/**
 * Yuzrix project context — the single source of truth for the AI assistant.
 *
 * Everything the assistant is allowed to state as fact lives here. The model
 * receives this text on every request and is instructed to answer ONLY from
 * it. If a fact is not written below, the assistant must say it does not have
 * that information rather than guess.
 *
 * ── How to maintain this file ──────────────────────────────────────────────
 * • Only add information confirmed by the project owner.
 * • Keep each bullet short and factual — this text is sent to the model.
 * • Never put secrets, API keys, or internal credentials here.
 * • When a fact changes, edit it here; the assistant picks it up immediately.
 *
 * Server-only: this file is imported by the system prompt, which is only ever
 * built on the server, so the knowledge base is not shipped to the browser.
 */

export const PROJECT_NAME = "Yuzrix"

/**
 * The business context, written as plain prose so it reads naturally to the
 * model. Sections mirror the landing page so the assistant and the site never
 * contradict each other.
 */
export const PROJECT_CONTEXT = `
# Yuzrix — Project Context

## Company
- Yuzrix is a price-intelligence service for small local food businesses.
- It was founded in 2026 and is based in Varanasi, Uttar Pradesh, India.
- Yuzrix's stated purpose is to make useful market intelligence accessible to
  small businesses, starting with the ones already selling great food locally.
- The founding observation: large companies have market research teams and
  pricing analysts, while small local businesses usually have only a hunch.

## The business problem
- Small food businesses in Varanasi often do not know whether their prices are
  right for their local market.
- Pricing too high risks losing customers to a cheaper listing nearby before
  anyone tastes the difference.
- Pricing too low leaves margin on every order without the owner realising it.
- A business's own costs tell it what it needs to earn, but not what nearby
  customers are already comparing it against.
- Researching competitors by hand — checking menus, listings and WhatsApp posts
  one at a time — is slow and hard to trust.

## The solution
- Yuzrix researches what comparable food businesses nearby are charging and
  tells the business owner where their price stands and what to consider next.
- The core deliverable is a price audit: the local price range for comparable
  products, where the business's own price sits inside that range, and one
  clear recommendation.
- Yuzrix explains rather than merely displays. A price on its own is only
  information; Yuzrix adds local context and a recommendation so it becomes
  something the owner can act on.
- Yuzrix only recommends what it can support with real local comparisons, and
  says so when the data does not justify a price change.

## Target customers
- Home bakers and cloud kitchens are the first customers.
- Cakes and prepared food are the initial focus because they are easy to
  compare across businesses.
- The longer-term audience is local and rural small and medium businesses
  (SMEs) across India and beyond.

## Products and services
- Free 5-item price audit: the entry offer. The owner shares up to five
  products and Yuzrix returns a local price read for them.
- Price audit (paid): a fuller audit covering more products, the local range
  for each, where the business's price sits, and a recommendation.
- The audit output has three parts: a local price comparison, where the
  business's price stands, and one clear recommendation.
- Products Yuzrix compares include celebration cakes, cupcakes, cookies,
  cheesecakes and tiffin boxes.

## How it works (business workflow)
1. The business tells Yuzrix what it sells — the product, the portion size, and
   the price it currently charges.
2. Yuzrix researches the market by looking at comparable products from nearby
   businesses in Varanasi.
3. The business receives one clear price audit: the local range, where its
   price sits, and what to consider next.
- There is nothing to configure and no dashboard to learn. The owner shares a
  product list and Yuzrix does the research.

## Current MVP
- The current MVP is the concierge price audit: a person-led research service
  rather than a self-serve software product.
- A customer submits their product list and current prices; Yuzrix researches
  comparable local prices and returns a written audit.
- The MVP is deliberately narrow — home bakers and cloud kitchens in Varanasi,
  with a small set of easily comparable food products — so the model can be
  proven before it is scaled.
- The landing page's free 5-item audit is the current way to start.

## Features
- Local price comparison against comparable nearby businesses.
- A position read showing whether a price is below, within, or above the local
  range.
- One clear, plain-language recommendation per product.
- Coverage of celebration cakes, cupcakes, cookies, cheesecakes and tiffin
  boxes.
- Human research rather than an automated dashboard, so no setup is required
  from the business owner.

## How Yuzrix helps a business owner (guidance principles)
- Yuzrix's role is to help the owner reach a confident pricing decision, not
  only to report data. The insight is only useful if the owner can act on it.
- Pricing too high and pricing too low are both real risks. The goal is not the
  cheapest price or the highest price, but a price that fits the local market.
- What makes two products genuinely comparable: the product type, the portion
  size, the finish or decoration, and whether delivery or extras are included.
  Comparing unlike items produces a misleading answer.
- What an owner can usefully prepare before an audit:
  - the items they sell most often
  - the portion size or weight of each
  - the price they currently charge
  - what each item costs them to make
    This is enough for Yuzrix to start the research.
- Yuzrix does not set the price for the business — the owner always decides.
  Yuzrix provides the local context and a recommendation to consider.
- Yuzrix only recommends a change when real local comparisons support it, and
  says so plainly when the data does not justify a change.
- Yuzrix speaks about real local prices only after the research step. Live
  market prices are not available on demand inside a chat.

## Business model
- Yuzrix starts with a free 5-item price audit as the entry point.
- Paid price audits are the revenue model: the business pays for the research
  and the written recommendation.
- The service is sold as research and insight rather than as software seats or
  a subscription dashboard.
- The model is designed to be proven on a narrow, comparable product set before
  being scaled to more products and more cities.

## Long-term vision
- To close the gap between a hunch and a decision for small businesses.
- To extend beyond food into local and rural SMEs across India and beyond.
- To make the kind of pricing and competitive intelligence that large companies
  take for granted something a small business owner can actually reach.

## Operating principles
- Start where it matters: prove the model on home bakers and cloud kitchens
  before scaling.
- Explain, do not just display: always pair data with context and a
  recommendation.
- Speak plainly: no jargon and no dashboards to learn. If a business owner
  cannot understand the insight, the work is not finished.
- Earn the recommendation: only suggest what real local comparisons support.

## Contact
- Start a price audit: audit@yuzrix.in
- General questions: hello@yuzrix.in
- Partnerships (bakers' groups, cloud kitchen operators, suppliers):
  partners@yuzrix.in
- Replies within one working day, 9am–6pm, Monday to Saturday.
- Based in Varanasi, Uttar Pradesh, India.
`.trim()