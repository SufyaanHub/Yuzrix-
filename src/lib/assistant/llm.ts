/**
 * LLM provider — the ONLY place that talks to a model vendor.
 *
 * The rest of the app depends on the small `generateReply` interface below,
 * never on a specific vendor. To switch providers, add a resolver to
 * `BACKENDS` and set LLM_PROVIDER in the environment. No UI or route code
 * needs to change.
 *
 * Server-only: this module reads secrets from process.env and must never be
 * imported into a client component.
 */

import { SYSTEM_PROMPT } from "./prompt"
import type { ChatMessage } from "./types"

/**
 * Server-only guard. Avoids pulling in the `server-only` package while still
 * failing loudly if this module is ever imported into client code, which would
 * risk bundling credentials into the browser.
 */
if (typeof window !== "undefined") {
  throw new Error(
    "lib/assistant/llm.ts is server-only and must not be imported from client code."
  )
}

/** Provider-agnostic request handed to a backend implementation. */
export type GenerateReplyInput = {
  systemPrompt: string
  messages: ChatMessage[]
}

/** Provider-agnostic result. `ok: false` means the caller shows ERROR_REPLY. */
export type GenerateReplyResult =
  | { ok: true; reply: string }
  | { ok: false; reason: string }

/** Every backend implements this one function. */
export type LlmBackend = (input: GenerateReplyInput) => Promise<GenerateReplyResult>

const DEFAULT_TIMEOUT_MS = 20_000
const DEFAULT_MAX_TOKENS = 400

/** OpenRouter's OpenAI-compatible endpoint. */
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
/** Default model when LLM_PROVIDER=openrouter. */
const OPENROUTER_DEFAULT_MODEL = "google/gemma-3-27b-it"

const OPENAI_BASE_URL = "https://api.openai.com/v1"
const OPENAI_DEFAULT_MODEL = "gpt-4o-mini"

/** Reads an env var, treating blank/whitespace values as unset. */
function env(name: string): string | undefined {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

/** Reads a positive integer env var, falling back when unset or invalid. */
function envInt(name: string, fallback: number): number {
  const raw = env(name)
  if (!raw) return fallback
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

/** Resolved connection details for one chat-completions call. */
type ProviderSettings = {
  apiKey: string
  baseUrl: string
  model: string
  headers: Record<string, string>
}

/**
 * Shared OpenAI-compatible transport.
 *
 * Every provider below speaks the same `/chat/completions` shape, so only the
 * credentials, base URL, model and any extra headers differ.
 */
async function callChatCompletions(
  settings: ProviderSettings,
  { systemPrompt, messages }: GenerateReplyInput
): Promise<GenerateReplyResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${settings.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
        ...settings.headers,
      },
      body: JSON.stringify({
        model: settings.model,
        temperature: 0.2,
        max_tokens: envInt("LLM_MAX_TOKENS", DEFAULT_MAX_TOKENS),
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      // Log the status only — never the body, which can echo request details.
      console.error(`[assistant] provider responded ${response.status}`)
      return { ok: false, reason: `provider-${response.status}` }
    }

    const data: unknown = await response.json()

    // OpenRouter can return HTTP 200 carrying an error envelope.
    if (hasErrorEnvelope(data)) {
      console.error("[assistant] provider returned an error envelope")
      return { ok: false, reason: "provider-error-envelope" }
    }

    const reply = extractReply(data)
    if (!reply) return { ok: false, reason: "empty-completion" }
    return { ok: true, reply }
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "timeout"
        : "network-error"
    console.error(`[assistant] request failed: ${reason}`)
    return { ok: false, reason }
  } finally {
    clearTimeout(timeout)
  }
}

/** Detects `{ "error": { ... } }` returned with a 2xx status. */
function hasErrorEnvelope(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false
  const error = (data as { error?: unknown }).error
  return typeof error === "object" && error !== null
}

/**
 * Pulls the assistant text out of an OpenAI-shaped response, defensively.
 * Handles both a plain string and the multi-part content array that some
 * models return.
 */
function extractReply(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null

  const choices = (data as { choices?: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) return null

  const message = (choices[0] as { message?: unknown }).message
  if (typeof message !== "object" || message === null) return null

  const content = (message as { content?: unknown }).content

  if (typeof content === "string") {
    const trimmed = content.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (Array.isArray(content)) {
    const text = content
      .map((part) =>
        typeof part === "object" &&
        part !== null &&
        typeof (part as { text?: unknown }).text === "string"
          ? (part as { text: string }).text
          : ""
      )
      .join("")
      .trim()

    return text.length > 0 ? text : null
  }

  return null
}

/**
 * OpenRouter — routes to 500+ models behind one OpenAI-compatible API.
 * https://openrouter.ai/docs
 */
const openRouter: LlmBackend = (input) => {
  // OPENROUTER_API_KEY is the name OpenRouter's own docs use; LLM_API_KEY is
  // accepted as a fallback so either variable works.
  const apiKey = env("OPENROUTER_API_KEY") ?? env("LLM_API_KEY")
  if (!apiKey) return Promise.resolve({ ok: false, reason: "missing-api-key" })

  return callChatCompletions(
    {
      apiKey,
      baseUrl: (env("LLM_BASE_URL") ?? OPENROUTER_BASE_URL).replace(/\/+$/, ""),
      model: env("LLM_MODEL") ?? OPENROUTER_DEFAULT_MODEL,
      headers: {
        // Optional attribution headers. They only affect OpenRouter's public
        // leaderboards and app pages — requests work fine without them.
        "HTTP-Referer": env("OPENROUTER_SITE_URL") ?? "https://yuzrix.in",
        "X-Title": env("OPENROUTER_SITE_NAME") ?? "Yuzrix",
      },
    },
    input
  )
}

/** Plain OpenAI, and any other OpenAI-compatible gateway. */
const openAiCompatible: LlmBackend = (input) => {
  const apiKey = env("LLM_API_KEY")
  if (!apiKey) return Promise.resolve({ ok: false, reason: "missing-api-key" })

  return callChatCompletions(
    {
      apiKey,
      baseUrl: (env("LLM_BASE_URL") ?? OPENAI_BASE_URL).replace(/\/+$/, ""),
      model: env("LLM_MODEL") ?? OPENAI_DEFAULT_MODEL,
      headers: {},
    },
    input
  )
}

/** Registry of available backends, keyed by LLM_PROVIDER. */
const BACKENDS: Record<string, LlmBackend> = {
  openrouter: openRouter,
  openai: openAiCompatible,
  "openai-compatible": openAiCompatible,
  azure: openAiCompatible,
  groq: openAiCompatible,
}

/** The provider used when LLM_PROVIDER is not set. */
const DEFAULT_PROVIDER = "openrouter"

function resolveProvider(): string {
  return (env("LLM_PROVIDER") ?? DEFAULT_PROVIDER).toLowerCase()
}

/**
 * Generates a reply using the configured backend.
 *
 * The system prompt is injected here rather than by the caller, so the
 * behavioural rules cannot be bypassed by a crafted request body.
 */
export async function generateReply(
  messages: ChatMessage[]
): Promise<GenerateReplyResult> {
  const provider = resolveProvider()
  const backend = BACKENDS[provider]

  if (!backend) {
    console.error(`[assistant] unknown LLM_PROVIDER "${provider}"`)
    return { ok: false, reason: "unknown-provider" }
  }

  return backend({ systemPrompt: SYSTEM_PROMPT, messages })
}

/** True when the server has enough configuration to call a model. */
export function isLlmConfigured(): boolean {
  return resolveProvider() === "openrouter"
    ? Boolean(env("OPENROUTER_API_KEY") ?? env("LLM_API_KEY"))
    : Boolean(env("LLM_API_KEY"))
}