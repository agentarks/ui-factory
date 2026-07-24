# Catalog Roadmap

The catalog compares **distinct visual directions on a fixed page subject**. It is built in chapters per page type: fix the page, vary the visual language, and keep every direction at a WCAG 2.2 AA baseline.

- **Kanban chapter — COMPLETE** (10 styles; see below).
- **Dashboard chapter — next** (4 dashboard page types; each gets an open concept brainstorm of distinct directions — no pre-locked library; see the [Dashboard chapter](#dashboard-chapter) section).

## Kanban chapter — COMPLETE

_Status: all ten styles are published under `src/lib/designs/published/`. The shared content baseline is locked by `kanban-glassmorphism/fixtures.ts`._

## Subject

A **Kanban board** for a small product team: 3–4 columns (Backlog → In Progress → In Review → Done), cards with title, labels, assignee avatars, due dates, and counts, plus a board header with filters and view controls.

- `pageType`: `data-management`
- Shared **realistic content** is copied into each entry's own `fixtures.ts` (entries stay independent per the contract — each owns its copy). Only the visual language changes.
- **Baseline locked** by the first published entry: `src/lib/designs/published/kanban-glassmorphism/fixtures.ts` (4 columns: Backlog, In Progress, In Review [empty], Done; 9 cards; 5 members). Later styles copy that file and re-skin only the visuals.

## The ten styles

Each is one single-page specimen with a meaningfully distinct visual direction. Every style is adapted to keep a WCAG 2.2 AA baseline — styles with inherent contrast challenges (neumorphism, claymorphism, brutalism) raise text/background contrast and never rely on shape alone.

| #   | Slug                   | Style                   | Visual signature                                                                                                                                    | Theme | Density     |
| --- | ---------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------- |
| 1   | `kanban-flat-material` | Flat / Material         | Solid color blocks, crisp elevation shadows, bold accents, app-like chrome                                                                          | light | comfortable |
| 2   | `kanban-glassmorphism` | Glassmorphism           | Frosted translucent panels over a soft low-chroma mist wash, cool-gray hairlines, calm accent                                                       | light | comfortable |
| 3   | `kanban-neumorphism`   | Neumorphism             | Soft extruded/inset monochrome surfaces, dual light+dark shadows, tactile, low-contrast lifted to AA                                                | light | comfortable |
| 4   | `kanban-claymorphism`  | Claymorphism            | Deep indigo canvas, medium-dark indigo cards/controls, light lavender text, open columns, 6–10px radii, restrained glow                             | dark  | compact     |
| 5   | `kanban-illustration`  | Illustration / Playful  | Chunky illustrated accents, stickers, rounded friendly shapes, doodles, bright palette                                                              | light | spacious    |
| 6   | `kanban-editorial`     | Editorial / Typographic | Serif display type, generous whitespace, content-first, restrained print palette, big headings                                                      | light | spacious    |
| 7   | `kanban-swiss`         | Swiss / Minimal         | Strict grid, austere sans, monochrome with one accent, precise alignment, high craft                                                                | light | comfortable |
| 8   | `kanban-brutalism`     | Brutalism               | Raw monospace, harsh borders, black/white + one accent, exposed grid, high contrast                                                                 | light | compact     |
| 9   | `kanban-dark-neon`     | Dark / Neon             | Near-black canvas, glowing neon accents, monospace metrics, terminal/cyberpunk vibe                                                                 | dark  | compact     |
| 10  | `kanban-terminal`      | Terminal / TUI          | Near-black ncurses canvas, full monospace, reverse-video bars, bordered dialog windows, bracketed fields, ANSI semantic colors, F-key status legend | dark  | compact     |

## Build order and why

> **Baseline locked.** Dispatch priority published `kanban-glassmorphism` first, so its `fixtures.ts` is the canonical shared content baseline. The order below is advisory; `kanban-flat-material` now re-skins the locked baseline rather than defining it.

1. **`kanban-flat-material`** — cleanest, most accessible reference style; re-skins the locked baseline and confirms the structural baseline every other style shares.
2. **`kanban-glassmorphism`** — _(published first; locked the content baseline)_ first visually demanding direction; proves blur/gradient/translucency handling.
3. **`kanban-neumorphism`** — proves the AA-contrast adaptation pattern for low-contrast styles early.
4. **`kanban-claymorphism`** — compact dark putty; proves layered inset/cast shadows, open-column composition, and restrained glow while preserving AA.
5. **`kanban-illustration`** — first decorative/asset direction; proves illustration + playful chrome.
6. **`kanban-editorial`** — serif/whitespace; proves typographic, content-first restraint.
7. **`kanban-swiss`** — grid/craft; proves strict minimal composition.
8. **`kanban-brutalism`** — raw/monospace; proves intentional rule-breaking that still passes checks.
9. **`kanban-dark-neon`** — dark theme + glow; proves dark-mode contrast and motion/glow within reduced-motion limits.
10. **`kanban-terminal`** — ncurses/TUI; the dialog/midnight-commander aesthetic — reverse-video bars, bordered dialog windows, bracketed field notation, an F-key status legend, and restrained ANSI semantic colors on a tinted near-black canvas.

Order is advisory; re-prioritize if a particular style is needed sooner.

## Per-entry reminders

- Each lives in `src/lib/designs/workbench/<slug>/` while drafting, then `published/` when `production-ready`.
- Each owns its own `metadata.json`, `Preview.svelte`, `fixtures.ts`, `DESIGN.md`, and optional `assets/`.
- `visualStyles` and `tags` metadata carry the style label so the gallery can filter by it.

## Dashboard chapter

Four dashboard page types. **Each type gets an open concept brainstorm of distinct visual directions** — the user picks freely from the brainstorm, and winning directions may be reused across the other types. There is no pre-locked direction library. Each type locks its own baseline content (copy-and-re-skin, same model as Kanban); only the visual language changes.

- `pageType`: `dashboard`.
- The concept gate is **ten distinct directions on that type's locked baseline** (like Kanban); the user picks from the open brainstorm rather than from a pre-set list.

### The four dashboard types

| Type                     | Subject                                     | Baseline locked by                       |
| ------------------------ | ------------------------------------------- | ---------------------------------------- |
| SaaS / product-analytics | KPIs, trends, plan breakdown, top accounts  | _(first built; locks the SaaS baseline)_ |
| Operational / monitoring | Services, health, incidents, live metrics   | _(defined when its chapter starts)_      |
| Marketing / growth       | Campaigns, acquisition, cohorts, conversion | _(defined when its chapter starts)_      |
| Finance / business       | P&L, cashflow, forecasts, headcount         | _(defined when its chapter starts)_      |

### Build order

1. **SaaS** first — validates the dashboard adaptation of the loop (charts/KPIs/tables are heavier than Kanban cards) and locks the SaaS baseline.
2. **Operational**, then **Marketing**, then **Finance** — phased, one type at a time. Each type locks its own baseline before its styles are built.

Order is advisory; re-prioritize if a type is needed sooner.

### SaaS baseline (locked)

A product-analytics dashboard for **"Aurora"** (same product universe as the Kanban board; reuses the five members for cohesion):

- Header: `Aurora · Product analytics`, range `Last 30 days`, team avatars.
- 4 KPI cards (value · Δ vs prev 30d · sparkline), mixed up/down: MRR `$48,200` `+6.4%`↑; Active users `12,840` `+3.1%`↑; Trial→Paid conversion `3.8%` `−0.4%`↓; Churn `1.9%` `+0.2pp`↑ (bad).
- Trend chart: MRR + Active users over 12 months (two locked 12-point series).
- Breakdown: revenue by plan (Pro / Team / Enterprise / Free).
- Table: Top accounts (5 rows) — account · plan · MRR · status (healthy/at-risk/new) · owner.
- Demonstrated states per style: loading skeleton (KPIs + chart), error (chart failed → Retry), empty (a filtered segment with no data), and a goal/status indicator.
