"use client"

import { ArrowUp, MessageSquare, Sparkles, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent } from "react"

import { cn } from "@/lib/utils"
import {
  ASSISTANT_NAME,
  ERROR_REPLY,
  GREETING,
  GREETING_DETAIL,
  OUT_OF_SCOPE_REPLY,
  QUICK_QUESTIONS,
} from "@/lib/assistant/config"
import {
  MAX_HISTORY_MESSAGES,
  MAX_MESSAGE_LENGTH,
  type AssistantResponse,
  type ChatMessage,
} from "@/lib/assistant/types"

type Bubble = ChatMessage & { id: number }

/** Same mark as the navbar/about panel, so the assistant reads as Yuzrix. */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
    >
      <path d="M 144 256 L 27.598 256 L 144 139.598 Z" />
      <path d="M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z" />
      <path d="M 0 204.402 L 0 112 L 92.402 112 Z" />
    </svg>
  )
}

/** Three-dot typing indicator shown while the assistant is thinking. */
function TypingIndicator() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="assistant-dot size-1.5 rounded-full bg-brass-light"
          style={{ animationDelay: `${dot * 160}ms` }}
        />
      ))}
    </span>
  )
}

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Bubble[]>([])
  const [draft, setDraft] = useState("")
  const [isSending, setIsSending] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  const hasStarted = messages.length > 0

  const makeBubble = (role: ChatMessage["role"], content: string): Bubble => ({
    id: nextId.current++,
    role,
    content,
  })

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, isSending])

  // Close on Escape, and focus the input when the panel opens.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [isOpen])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || isSending) return

    const outgoing = makeBubble("user", question.slice(0, MAX_MESSAGE_LENGTH))
    const history = [...messages, outgoing]

    setMessages(history)
    setDraft("")
    setIsSending(true)

    // Only the recent turns travel to the server, to control token usage.
    const payload = history
      .slice(-MAX_HISTORY_MESSAGES)
      .map(({ role, content }) => ({ role, content }))

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      })

      if (!response.ok) throw new Error("request-failed")

      const data = (await response.json()) as AssistantResponse
      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : ERROR_REPLY

      setMessages((prev) => [...prev, makeBubble("assistant", reply)])
    } catch {
      // Never surface provider errors, stack traces or keys to the visitor.
      setMessages((prev) => [...prev, makeBubble("assistant", ERROR_REPLY)])
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void send(draft)
  }

  const resetConversation = () => {
    setMessages([])
    setDraft("")
    setIsSending(false)
  }

  return (
    <>
      {/* ── Floating launcher ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="yuzrix-assistant-panel"
        aria-label={isOpen ? `Close ${ASSISTANT_NAME}` : `Open ${ASSISTANT_NAME}`}
        className={cn(
          "assistant-launcher fixed right-4 bottom-4 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full bg-navy text-ivory shadow-[0_16px_40px_-16px_rgba(13,22,38,0.7)] transition-[background-color,box-shadow,transform] duration-300 outline-none hover:bg-navy-deep hover:shadow-[0_20px_48px_-16px_rgba(13,22,38,0.8)] focus-visible:ring-3 focus-visible:ring-brass-deep/45 sm:right-6 sm:bottom-6",
          // `invisible` also removes the launcher from the tab order and the
          // accessibility tree while the panel is open.
          isOpen && "pointer-events-none invisible scale-95 opacity-0"
        )}
      >
        <MessageSquare className="size-5" strokeWidth={1.75} />
        {/* Brass rim, echoing the accent edge used across the site. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border border-brass-light/35"
        />
        {!hasStarted && (
          <span
            aria-hidden="true"
            className="assistant-ping pointer-events-none absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-brass-light ring-2 ring-ivory"
          />
        )}
      </button>

      {/* ── Chat panel ────────────────────────────────────────────────── */}
      <div
        id="yuzrix-assistant-panel"
        ref={panelRef}
        role="dialog"
        aria-label={ASSISTANT_NAME}
        aria-modal="false"
        aria-hidden={!isOpen}
        // Keeps the collapsed panel out of the tab order entirely.
        inert={!isOpen}
        className={cn(
          "assistant-panel fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-navy/12 bg-ivory shadow-[0_28px_70px_-24px_rgba(13,22,38,0.55)] transition-[opacity,transform] duration-300 ease-out",
          // Height is FIXED (not max-height) so the panel opens at its final
          // size and never jumps as messages arrive. `min()` keeps it inside
          // the viewport on short screens; the transcript scrolls instead.
          "inset-x-3 bottom-3 h-[min(22rem,calc(100dvh-2rem))]",
          // Desktop: compact column, anchored exactly where the launcher sat
          // so nothing shifts when the panel opens.
          "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(27rem,calc(100dvh-3rem))] sm:w-88",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        {/* Header */}
        <div className="relative flex items-center gap-2.5 border-b border-navy/10 bg-navy px-3.5 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
          <div aria-hidden="true" className="assistant-header-glow absolute inset-0" />

          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-brass-light/30 bg-brass-light/10 text-brass-light">
            <LogoMark className="size-3.5" />
          </span>

          <div className="relative min-w-0 flex-1">
            <p className="truncate font-serif text-[13.5px] leading-tight text-ivory sm:text-sm">
              {ASSISTANT_NAME}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-ivory/50">
              <span className="size-1.5 rounded-full bg-brass-light" />
              Answers from project context
            </p>
          </div>

          {/* Only rendered once there is a conversation, so the header keeps
              its full width on small screens. */}
          {hasStarted && (
            <button
              type="button"
              onClick={resetConversation}
              className="relative cursor-pointer rounded-lg px-2 py-1 text-[10px] font-medium text-ivory/50 transition-colors duration-200 outline-none hover:text-ivory focus-visible:ring-2 focus-visible:ring-brass-light/40"
            >
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="relative flex size-8 cursor-pointer items-center justify-center rounded-lg text-ivory/60 transition-colors duration-200 outline-none hover:bg-ivory/8 hover:text-ivory focus-visible:ring-2 focus-visible:ring-brass-light/40"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="assistant-scroll flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3 sm:space-y-3 sm:px-4 sm:py-4"
        >
          {/* Opening message */}
          <div className="flex gap-2.5">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-brass-deep/25 bg-ivory-deep text-brass-deep">
              <Sparkles className="size-3" strokeWidth={1.75} />
            </span>
            <div className="rounded-2xl rounded-tl-sm border border-navy/10 bg-ivory-deep/80 px-3 py-2.5 sm:px-3.5">
              <p className="text-[13px] leading-5 font-medium text-navy sm:text-sm sm:leading-6">
                {GREETING}
              </p>
              <p className="mt-1 text-[12.5px] leading-5 text-ink/65 sm:text-[13px] sm:leading-6">
                {GREETING_DETAIL}
              </p>
            </div>
          </div>

          {/* Quick questions, only before the conversation starts. Two fit per
              row on mobile, so the panel stays short. */}
          {!hasStarted && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 sm:pl-8.5">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void send(question)}
                  className="cursor-pointer rounded-full border border-navy/15 bg-ivory px-2.5 py-1 text-[11px] leading-5 text-ink/70 transition-colors duration-200 outline-none hover:border-brass-deep/40 hover:bg-ivory-deep hover:text-brass-deep focus-visible:ring-2 focus-visible:ring-brass-deep/30 sm:px-3 sm:py-1.5"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-navy px-3.5 py-2.5 text-[13px] leading-6 text-ivory">
                  {message.content}
                </p>
              </div>
            ) : (
              <div key={message.id} className="flex gap-2.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-brass-deep/25 bg-ivory-deep text-brass-deep">
                  <LogoMark className="size-3" />
                </span>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl rounded-tl-sm border px-3.5 py-2.5 text-[13px] leading-6",
                    message.content === OUT_OF_SCOPE_REPLY
                      ? "border-brass/30 bg-brass/8 text-ink/75"
                      : "border-navy/10 bg-ivory-deep/80 text-ink/75"
                  )}
                >
                  {message.content}
                </p>
              </div>
            )
          )}

          {/* Loading state */}
          {isSending && (
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-brass-deep/25 bg-ivory-deep text-brass-deep">
                <LogoMark className="size-3" />
              </span>
              <span className="flex items-center rounded-2xl rounded-tl-sm border border-navy/10 bg-ivory-deep/80 px-3.5 py-3">
                <TypingIndicator />
                <span className="sr-only">Thinking</span>
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-navy/10 bg-ivory-deep/60 px-3 py-2.5"
        >
          <div className="flex items-end gap-2">
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder="Ask about Yuzrix…"
              aria-label="Ask about Yuzrix"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-xl border border-navy/15 bg-ivory px-3 py-2 text-[13px] text-navy transition-colors duration-200 outline-none placeholder:text-ink/50 focus:border-brass-deep/50 sm:px-3.5 sm:py-2.5"
            />
            <button
              type="submit"
              disabled={!draft.trim() || isSending}
              aria-label="Send message"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-navy text-ivory transition-colors duration-200 outline-none hover:bg-navy-deep focus-visible:ring-3 focus-visible:ring-brass-deep/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp className="size-4" strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}