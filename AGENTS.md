# Agent Guide

## Session start

1. Read `STATUS.md` first.
2. Use the task map below to open only the context needed for the task.

## Task map

| Task                                 | Read                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| Product scope or priorities          | `PRODUCT.md`, then `ui-factory-product-vision.md` when durable product detail is needed |
| Factory browsing UI                  | Root `DESIGN.md`                                                                        |
| Catalog architecture or route data   | `docs/architecture.md`                                                                  |
| Entry metadata, files, or visibility | `docs/design-entry-contract.md`                                                         |
| Add or review one design             | `docs/adding-a-design.md`, then that entry's files only                                 |
| Scaffold intent or acceptance        | `docs/specs/2026-07-14-ui-factory-scaffold-design.md`                                   |
| Setup and commands                   | `README.md`                                                                             |

Do not scan unrelated folders under `src/lib/designs/`. Do not duplicate linked guidance; update its canonical document instead.

## Commands

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start local development          |
| `npm run format`   | Format maintained files          |
| `npm run lint`     | Check formatting and lint rules  |
| `npm run check`    | Run Svelte and TypeScript checks |
| `npm test`         | Run unit tests once              |
| `npm run test:e2e` | Run browser tests                |
| `npm run build`    | Build the production application |

## State updates

Update `STATUS.md` whenever the phase, objective, completed work, next work, decisions, blockers, or verified commands change. Keep it as a current snapshot, not a history.

## Definition of done

- The requested scope is complete without unrelated changes.
- Relevant formatting, static checks, tests, and build commands pass.
- User-visible behavior has appropriate accessibility and responsive coverage.
- Canonical documentation and `STATUS.md` match the resulting state.
- The worktree contains no accidental generated output or staged leftovers.
