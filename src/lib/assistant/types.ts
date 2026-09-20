/** Shared types for the Yuzrix assistant. Safe to import from client code. */

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  role: ChatRole
  content: string
}

/** Request body accepted by `POST /api/assistant`. */
export type AssistantRequest = {
  messages: ChatMessage[]
}

/** Response body returned by `POST /api/assistant`. */
export type AssistantResponse = {
  reply: string
}

/** Maximum characters accepted for a single visitor message. */
export const MAX_MESSAGE_LENGTH = 600

/**
 * How many past messages are sent to the model. Keeps follow-up questions
 * working ("who is it for?") while holding token usage down.
 */
export const MAX_HISTORY_MESSAGES = 8