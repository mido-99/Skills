---
name: playwright-cleanup
description: Use whenever driving the Playwright MCP browser tools (browser_navigate, browser_click, browser_type, browser_tabs, browser_take_screenshot, browser_snapshot, browser_evaluate, etc.) in any project. Ensures browser tabs/instances get closed after the task and explains why this machine's Playwright MCP runs in --isolated mode.
---

# Playwright MCP cleanup

This machine runs Playwright MCP as a user-scoped server (`playwright`, `npx @playwright/mcp@latest --isolated`), not the marketplace plugin — the plugin is intentionally disabled in `~/.claude/settings.json`. Do not suggest re-enabling the plugin or removing `--isolated`: without it, parallel Claude Code sessions share one locked Chrome profile and fail with "in use by another agent" errors.

There's a `SessionEnd` hook (`~/.claude/hooks/playwright-cleanup.ps1`) that force-kills any leftover Playwright/browser processes, but it's a *backstop*, not the primary mechanism — it only runs on graceful session termination (`/clear`, logout, exiting the prompt) and never fires if the terminal/window is force-closed or the process is killed outright. Don't rely on it.

**Rule: when you finish a task that used Playwright browser tools, close what you opened before ending your turn** — call `browser_tabs` (action: close) for any tabs you opened, or `browser_close` if you're done with the browser entirely. Do this even if the user didn't ask for it explicitly.

The only exception: if the user explicitly asks you to leave a tab/browser open (e.g. for them to inspect or to test cleanup behavior), leave it open and say so plainly instead of closing it.
