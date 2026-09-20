/**
 * Client-safe assistant configuration.
 *
 * Everything here is safe to ship to the browser: display names, quick
 * questions, and the fixed replies the UI needs to recognise. The project
 * knowledge itself lives in `project-context.ts` and stays server-side.
 */

/** Short label used in the chat header and quick-question chips. */
export const ASSISTANT_NAME = "Yuzrix Assistant"

/** The company the assistant represents. */
export const PROJECT_NAME = "Yuzrix"

/** Opening message shown when the panel first opens. */
export const GREETING = `Hi, I'm the ${PROJECT_NAME} Assistant.`

export const GREETING_DETAIL =
  "I can help you think through your pricing, or answer questions about Yuzrix and how the service works."

/** Shown when the visitor asks something unrelated to Yuzrix. */
export const OUT_OF_SCOPE_REPLY =
  "I'm here specifically to answer questions about Yuzrix and this project. Ask me about the company, product, service, or how the business works."

/** Shown when the answer is genuinely not in the project context. */
export const NOT_IN_CONTEXT_REPLY =
  "I don't have that information in the project context yet."

/** Shown when the LLM call fails. Never leaks provider or internal details. */
export const ERROR_REPLY =
  "I'm having trouble responding right now. Please try again."

/**
 * Quick-question chips shown under the opening message. Each one must be
 * answerable from the project context in `project-context.ts`. These lead with
 * the visitor's own problem rather than with product facts.
 */
export const QUICK_QUESTIONS = [
  "Is my price right?",
  "How do I set my price?",
  "What's in an audit?",
  "How do I get started?",
] as const