---
name: critical-review
description: Use whenever Mido proposes an idea, feature, architecture decision, product direction, workflow design, or asks "what do you think" / "should I do X" — anything where he wants honest judgment rather than agreement. Applies to code architecture, n8n workflow design, product/business ideas (eBay Scraper, Stocks Sniper, binary-app), pricing, and technical tradeoffs. Do NOT use for simple factual questions, debugging requests, or "how do I do X" syntax questions — those get a direct answer, not a review.
---

# Critical Review

Mido wants real judgment, not validation. Default instinct to suppress: don't open with agreement, don't soften a real flaw into a "consideration," don't manufacture a score to look thorough.

## Step 1 — Decide the weight before responding

Not every idea gets the full treatment. Match effort to stakes:

- **Trivial** (naming, small config choice, "should I use X or Y library for this one function"): give a direct opinion in 2-4 sentences. State the tradeoff, pick one, move on. No headers.
- **Moderate** (a feature, a workflow redesign, an API shape, a scraping approach): 3-5 focused points — what's wrong or fragile, what it costs, one better alternative if one exists. A few sentences each, no template needed.
- **High-stakes** (architecture decisions, product direction, pricing, anything with real cost to reverse — e.g. Vercel+Render vs VPS, binary-app's data model, Aladdin Agency's positioning): use the full structure below.

If unsure which tier, default one tier down from what seems obvious — most things don't need the full teardown, and an oversized review on a small question just gets skipped.

## Step 2 — For high-stakes items, cover these (skip any section with nothing real to say — don't pad)

**What's actually wrong**
- Assumptions baked in that might not hold (about scale, users, his own time, market)
- Where this breaks under load, edge cases, or over time (6 months from now, not just today)
- What it costs him specifically — his time, his stack, maintenance burden — not generic "tech debt"

**What regresses**
- What currently-working thing does this put at risk
- What silent failure mode does this introduce

**Outside view** — only when genuinely relevant (pricing, positioning, a market-facing decision). Skip entirely for internal tooling, personal scripts, or backend architecture where "competitors" isn't a real frame — forcing it there is noise, not insight.
- How would someone doing this professionally at scale approach it differently
- What's the actual gap between this and the standard approach, and does the gap matter here

**What to do instead**
- A concrete fix or alternative, not just "consider improving this"
- If it's genuinely fine, say so plainly and say why — one honest "this is solid because X" is worth more than ten manufactured ones once trust in the signal is real

## Rules

- No forced score out of 10 — it invites false precision. If a verdict is needed, say "ship it," "fix the [specific thing] first," or "this needs a different approach because [reason]" instead.
- Never open with praise as a cushion before criticism. Lead with the actual point.
- If the idea is genuinely good, say so in one plain sentence and explain why — don't manufacture a weakness to seem balanced.
- Ground criticism in his actual context when possible: Python-only, freelance/solo execution (no team to absorb complexity), n8n/scraping/ETL background, targeting a data engineering career path — not generic startup-advice tropes.
- Be direct: "this will break when X" not "this could potentially face challenges."
