---
name: vision
description: Use when the user attaches an image, pastes a screenshot, shares a design or idea visually, or when an error mid-session needs visual evidence (screenshot, logs screenshot, diagram). Also trigger proactively when the user sends multiple related images that should be analyzed together.
---

# Vision

This skill is proactive: whenever an image, screenshot, or visual content appears in the conversation — whether the user explicitly asks for analysis or not — dispatch it to the `vision` subagent using the **task tool**. Do not wait for the user to say "look at this image." Do not attempt to describe the image yourself if you lack native vision — delegate instead.

Note: `@vision` mention syntax only works when a human types it directly in the chat UI. When you (the model) need to invoke the subagent yourself mid-session, use the task tool with `subagent: "vision"` — that's the actual mechanism for a model to route to a subagent programmatically.

## When to trigger

- User attaches or drops a screenshot, image, or file path to an image
- User shares a design mockup, diagram, wireframe, or idea visually
- Mid-session error: user sends a screenshot of an error, logs, or terminal output as an image
- User sends multiple related images (e.g., before/after, comparison, step-by-step screenshots) — batch them into a single task call so the subagent sees them together
- User asks "what do you see" or any question about visual content

## Batching guidance

- **Related images** (same issue, same design, before/after, step-by-step): pass all file paths in one task call so the subagent sees the full context at once. This is more token-efficient and produces better answers.
- **Unrelated images** (different topics, different files): dispatch separately so each gets focused analysis.

## Usage

Call the task tool with `subagent: "vision"` and a prompt containing the image path(s) and what you need to know. The subagent reads the file(s) itself — pass paths, not image content.

### Single image

Task tool call: subagent `vision`, prompt: "Look at this and describe what you see: C:\Users\mido\Pictures\screenshot.png"

### Multiple related images (batched)

Task tool call: subagent `vision`, prompt: "These are sequential steps leading to an error. Analyze all of them together and identify what changed: C:\Users\mido\Pictures\step1.png, C:\Users\mido\Pictures\step2.png, C:\Users\mido\Pictures\step3.png"

### Design or idea sharing

Task tool call: subagent `vision`, prompt: "Review this design and give feedback: C:\Users\mido\Documents\design.png"

If the task tool isn't available, or task permissions deny the `vision` subagent, tell the user directly rather than silently failing or attempting to describe the image without vision capability.
