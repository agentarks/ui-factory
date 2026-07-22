---
name: ui-factory-design-loop
description: Use when starting, continuing, or resuming a UI Factory catalog style, especially after a merged design PR or requests mentioning the next style, ten samples, the design loop, live preview, review, PR, or cleanup.
---

# UI Factory Design Loop

Run one style through cleanup in Herdr.

## Requirements

- Read `STATUS.md` first, then task-mapped docs from `AGENTS.md`.
- Require `HERDR_ENV=1`; otherwise tell the user to enter Herdr and stop.
- Concept agents, implementers, reviewers, and servers **must run in Herdr tabs/workspaces** with returned IDs. Plain branches, hidden subagents, and background-shell servers are invalid.
- Copy locked `kanban-glassmorphism/fixtures.ts`; change only visuals.
- Keep `STATUS.md` factual; verify worker claims.

## Pause only for

1. The user's choice among ten concepts.
2. Final live-app visual approval.
3. A genuine blocker, permission need, or unresolved product decision.

Never ask whether to continue after completion, tests, findings, remediation, or PR creation. Reporting the PR URL is not a third gate.

## Loop

1. **Clean and sync**
   - Verify any stated PR is merged.
   - Stop servers; remove `.superpowers/`, loop-owned Herdr resources, merged worktrees/branches.
   - Fast-forward `main`; require cleanliness.
   - Choose the next unpublished roadmap style unless `STATUS.md` overrides it.

2. **Generate exactly ten concepts**
   - Start `$HOME/.agents/skills/superpowers/brainstorming/scripts/start-server.sh --project-dir "$PWD"`.
   - In a new Herdr tab launch `opencode --model zai-coding-plan/glm-5.2`.
   - Request one standalone HTML comparison: exactly ten distinct concepts, locked content, rationale/trade-off each, and ranked top three. Do not edit product source.
   - Wait through Herdr, require artifact plus HTTP 200, present URL/names, pause.

3. **Implement in isolation**
   - Create a Herdr-managed worktree/feature branch; a plain branch is invalid.
   - Launch a GLM-5.2 OpenCode implementer in its returned root pane. Add no brainstorming/spec gate.
   - Require `draft` → `reviewed` → `production-ready` → `published`, entry-owned files, focused E2E, `STATUS.md`, verification, and a clean commit.

4. **Review and remediate**
   - Launch a separate read-only Pi frontend reviewer in another Herdr tab.
   - Evaluate findings; reject subjective drift and out-of-scope behavior.
   - Return valid findings to the implementer; commit and re-review until `APPROVED` or blocked. Never involve the user in routine remediation.

5. **Verify and show**
   - Run format, lint, check, unit, E2E, build, and `git diff --check <base>..HEAD`.
   - Start the branch app in a separate Herdr tab on a checked free port. Require HTTP 200 for detail and isolated-preview routes.
   - Present both URLs and pause. Changes loop through implementation → review → full verification → live approval.

6. **PR and cleanup**
   - After explicit approval, rerun verification, push, create a focused PR, report its URL, and keep the preview available. Never merge or add another question.
   - After the user reports merge, verify it; stop servers; remove comparison files, loop-owned Herdr resources and merged worktrees/branches; fast-forward `main`; require one clean main worktree.

## Red flags

- Not exactly ten concepts.
- Routine “continue?” questions.
- PR before live approval.
- No re-review after fixes.
- Missing Herdr IDs for any agent/server.
- Leftover `.superpowers/`, servers, worktrees, or merged branches.
