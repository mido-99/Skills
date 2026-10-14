---
name: orchestrate-opencode
description: Orchestrate one ticket end to end through OpenCode - create a per-ticket git worktree off an integration branch, dispatch OpenCode to implement, run a two-reviewer loop (code-review, then Opus via claude-delegate), run the clean-code and docs guards, then merge into the integration branch and clean up. Use whenever the user wants to run a ticket or sub-task through OpenCode with a worktree, reviewer loop and merge back to a feature branch, or says "orchestrate opencode", "dispatch this ticket to OpenCode and merge it", or "run the OpenCode workflow". Prefer opencode-delegate instead when the user just wants OpenCode to implement and will review and commit the diff themselves.
---

# Orchestrate OpenCode

Drive one ticket from worktree to merge. You are the orchestrator and reviewer; OpenCode writes the code. The worktree isolates each ticket so a bad run can be discarded, and the layered review catches what a single model misses.

## Config

Fill in before starting. Values here are defaults; ask the user if any are unclear.

- `TICKET` - the ticket or feature being built (`[TICKET-NAME]` in commands)
- `BIG_TARGET` - the parent integration branch is `feature/[BIG-TARGET]`
- `TARGET_PATH` - path passed to `/implement`
- Primary model: `deepseek v4.1 flash`
- Fallback model: `GLM 5.3 flash`
- Spare model: `Qwen3.7 Plus` (not used by the default flow; use it only if the fallback also degrades)
- Independent reviewer: Opus, medium effort, via `/claude-delegate`

## 0. Worktree and branch

Check whether `.worktrees/[TICKET-NAME]` already exists. If not, create it on a ticket branch off the integration branch:

```bash
git worktree add -b feature/[BIG-TARGET]-[TICKET-NAME] .worktrees/[TICKET-NAME] feature/[BIG-TARGET]
```

Run every sub-agent, edit and tool call inside `.worktrees/[TICKET-NAME]`, so nothing leaks into the main checkout.

## 1. Execute

Dispatch OpenCode (Correctly using `/opencode-delegate` to get notified when agents finish) with the primary model inside the worktree:

```bash
/implement <TARGET_PATH>
```

Tell it to apply `/clean-code-guard` and `/docs-guard` while implementing.

## 2. Verify

Once OpenCode reports completion, do not trust its claims; review the diff.

**Step A - primary review.** Run `/mattpocock-skills:code-review` at medium effort on the full worktree diff. On any bug, missed requirement, architectural flaw or unverified claim: write the findings down, re-dispatch OpenCode with the exact findings to fix in the worktree, and repeat until the review finds nothing.

**Step B - independent reviewer.** After Step A passes, run `/claude-delegate` targeting Opus (medium effort) at the workspace root directory to review the full diff in each worktree against agent claims & original ticket requirements.

- If Opus reports critical issues: pass its exact report to OpenCode to fix. For complex bugs or architectural violations, re-dispatch Opus to re-verify. For 1-3 straightforward bugs or typos, verify the fix yourself and skip Opus.
- If Opus approves with zero issues: go to step 4.

## 3. Fallback when OpenCode degrades

Applies at any point in steps 1-2. Signs: repeated hallucinated fixes, worse output after several fix rounds, breaking existing code, or a loop that does not converge. A degraded session keeps compounding its own mistakes, so restart with clean context rather than pushing on.

1. Write a compact summary: current worktree state, modifications done, remaining findings, original requirements.
2. End the overloaded session and start a fresh one with the fallback model inside the same worktree, seeded with that summary, to finish the fix cycle.

## 4. Guard re-check

Run in order: `/clean-code-guard`, then `/docs-guard`. Comments, docs and formatting must satisfy both before the ticket counts as done.

## 5. Land the work

Merging and removing the worktree are hard to undo, and some ticket branches should go through PR review instead. Show the user the branch names and a diff summary, then ask which they want:

- **Merge directly** into the integration branch `feature/[BIG-TARGET]`
- **Open a PR** from the ticket branch into `feature/[BIG-TARGET]`

Do nothing until they choose.

### Option A - merge directly

```bash
git checkout feature/[BIG-TARGET]
git merge feature/[BIG-TARGET]-[TICKET-NAME] --no-ff -m "feat([TICKET-NAME]): completed sub-task"
```

If the merge conflicts, stop and report; keep the worktree until it is resolved. Once merged, remove the worktree and branch:

```bash
git worktree remove --force .worktrees/[TICKET-NAME]
git branch -d feature/[BIG-TARGET]-[TICKET-NAME]
```

### Option B - open a PR

Push the ticket branch and open a PR against the integration branch:

```bash
git push -u origin feature/[BIG-TARGET]-[TICKET-NAME]
gh pr create --base feature/[BIG-TARGET] --head feature/[BIG-TARGET]-[TICKET-NAME] --title "feat([TICKET-NAME]): completed sub-task" --body "<human-readable summary of the change and the review results>"
```

Keep the worktree and branch: review feedback may need more commits, and the branch cannot be deleted until the PR merges. Report the PR URL. Remove the worktree only after the user confirms the PR is merged or closed.
