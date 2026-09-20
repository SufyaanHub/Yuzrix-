/**
 * POST /api/assistant
 *
 * The single backend entry point for the landing-page assistant. Runs on the
 * server only, so `LLM_API_KEY` never reaches the browser.
 *
 * Flow: Landing Page → this route → LLM provider → Response → Chat UI
 */

import { isObviouslyOffTopic, ERROR_REPLY, OUT_OF_SCOPE_REPLY } from "@/lib/assistant/prompt"
import { generateReply } from "@/lib/assistant/llm"
import {
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_LENGTH,
  type AssistantResponse,
  type ChatMessage,
} from "@/lib/assistant/types"

/** Rate limit: requests allowed per IP inside the window below. */
const RATE_LIMIT_MAX = 12
const RATE_LIMIT_WINDOW_MS = 60_000

/**
 * In-memory sliding-window counter. Good enough to stop casual abuse of a
 * landing-page widget on a single instance. For multi-instance deployments,
 * swap this for a shared store (Redis, Upstash, …).
 */
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  )

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent)
    return true
  }

  recent.push(now)
  hits.set(ip, recent)

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
        hits.delete(key)
      }
    }
  }

  return false
}

function json(body: AssistantResponse, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  })
}

/**
 * Validates and normalises the incoming message list. Anything malformed is
 * dropped rather than trusted, and only the most recent turns are kept.
 */
function parseMessages(input: unknown): ChatMessage[] | null {
  if (typeof input !== "object" || input === null) return null

  const raw = (input as { messages?: unknown }).messages
  if (!Array.isArray(raw)) return null

  const messages: ChatMessage[] = []
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) continue

    const role = (entry as { role?: unknown }).role
    const content = (entry as { content?: unknown }).content

    if (role !== "user" && role !== "assistant") continue
    if (typeof content !== "string") continue

    const text = content.trim()
    if (!text) continue

    messages.push({ role, content: text.slice(0, MAX_MESSAGE_LENGTH) })
  }

  if (messages.length === 0) return null

  const last = messages[messages.length - 1]
  if (last.role !== "user") return null

  // Keep the tail so follow-up questions still resolve, without unbounded cost.
  return messages.slice(-MAX_HISTORY_MESSAGES)
}

export async function POST(request: Request): Promise<Response> {
  // Client IP is used only for rate limiting; nothing is stored or logged.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"

  if (isRateLimited(ip)) {
    return json({ reply: ERROR_REPLY }, 429)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ reply: ERROR_REPLY }, 400)
  }

  const messages = parseMessages(body)
  if (!messages) {
    return json({ reply: ERROR_REPLY }, 400)
  }

  const question = messages[messages.length - 1].content

  // Fast path: obvious off-topic asks are answered without spending a model
  // call. The system prompt remains the authoritative scope guard.
  if (isObviouslyOffTopic(question)) {
    return json({ reply: OUT_OF_SCOPE_REPLY })
  }

  const result = await generateReply(messages)

  if (!result.ok) {
    // Detailed reason stays on the server; the client only sees ERROR_REPLY.
    console.error(`[api/assistant] generation failed: ${result.reason}`)
    return json({ reply: ERROR_REPLY }, 502)
  }

  return json({ reply: result.reply })
}