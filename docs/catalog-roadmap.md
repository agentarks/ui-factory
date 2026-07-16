# Catalog Roadmap

One page type, ten **distinct visual styles** — the catalog's core value is comparing directions on the same subject, so we fix the page and vary the visual language.

## Subject

A **Kanban board** for a small product team: 4–5 columns (e.g. Backlog → In Progress → In Review → Done, plus an empty Blocked column to exercise the empty state), cards with title, labels, assignee avatars, due dates, and counts, plus a board header with filters and view controls.

- `pageType`: `data-management`
- Shared **realistic content** is copied into each entry's own `fixtures.ts` (entries stay independent per the contract — each owns its copy). Only the visual language changes.
- **Baseline locked** by the first published entry: `src/lib/designs/published/kanban-glassmorphism/fixtures.ts` (5 columns including an empty `Blocked` column, 9 cards, 5 members). Later styles copy that file and re-skin only the visuals.

## The ten styles

Each is one single-page specimen with a meaningfully distinct visual direction. Every style is adapted to keep a WCAG 2.2 AA baseline — styles with inherent contrast challenges (neumorphism, claymorphism, brutalism) raise text/background contrast and never rely on shape alone.

| #   | Slug                   | Style                   | Visual signature                                                                                     | Theme | Density     |
| --- | ---------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------- | ----- | ----------- |
| 1   | `kanban-flat-material` | Flat / Material         | Solid color blocks, crisp elevation shadows, bold accents, app-like chrome                           | light | comfortable |
| 2   | `kanban-glassmorphism` | Glassmorphism           | Frosted translucent panels over a vibrant gradient, light hairline borders, soft glow                | light | comfortable |
| 3   | `kanban-neumorphism`   | Neumorphism             | Soft extruded/inset monochrome surfaces, dual light+dark shadows, tactile, low-contrast lifted to AA | light | comfortable |
| 4   | `kanban-claymorphism`  | Claymorphism            | Puffy pastel 3D shapes, rounded marshmallow cards, soft drop shadows, candy palette                  | light | comfortable |
| 5   | `kanban-illustration`  | Illustration / Playful  | Chunky illustrated accents, stickers, rounded friendly shapes, doodles, bright palette               | light | spacious    |
| 6   | `kanban-editorial`     | Editorial / Typographic | Serif display type, generous whitespace, content-first, restrained print palette, big headings       | light | spacious    |
| 7   | `kanban-swiss`         | Swiss / Minimal         | Strict grid, austere sans, monochrome with one accent, precise alignment, high craft                 | light | comfortable |
| 8   | `kanban-brutalism`     | Brutalism               | Raw monospace, harsh borders, black/white + one accent, exposed grid, high contrast                  | light | compact     |
| 9   | `kanban-dark-neon`     | Dark / Neon             | Near-black canvas, glowing neon accents, monospace metrics, terminal/cyberpunk vibe                  | dark  | compact     |
| 10  | `kanban-skeuomorphic`  | Skeuomorphic            | Realistic textures and depth, bevels, physical affordances, layered shadows, material metaphors      | light | comfortable |

## Build order and why

> **Baseline locked.** Dispatch priority published `kanban-glassmorphism` first, so its `fixtures.ts` is the canonical shared content baseline. The order below is advisory; `kanban-flat-material` now re-skins the locked baseline rather than defining it.

1. **`kanban-flat-material`** — cleanest, most accessible reference style; re-skins the locked baseline and confirms the structural baseline every other style shares.
2. **`kanban-glassmorphism`** — _(published first; locked the content baseline)_ first visually demanding direction; proves blur/gradient/translucency handling.
3. **`kanban-neumorphism`** — proves the AA-contrast adaptation pattern for low-contrast styles early.
4. **`kanban-claymorphism`** — puffy 3D; proves custom shadows and candy palette.
5. **`kanban-illustration`** — first decorative/asset direction; proves illustration + playful chrome.
6. **`kanban-editorial`** — serif/whitespace; proves typographic, content-first restraint.
7. **`kanban-swiss`** — grid/craft; proves strict minimal composition.
8. **`kanban-brutalism`** — raw/monospace; proves intentional rule-breaking that still passes checks.
9. **`kanban-dark-neon`** — dark theme + glow; proves dark-mode contrast and motion/glow within reduced-motion limits.
10. **`kanban-skeuomorphic`** — textures/depth; the most asset-heavy, built last.

Order is advisory; re-prioritize if a particular style is needed sooner.

## Per-entry reminders

- Each lives in `src/lib/designs/workbench/<slug>/` while drafting, then `published/` when `production-ready`.
- Each owns its own `metadata.json`, `Preview.svelte`, `fixtures.ts`, `DESIGN.md`, and optional `assets/`.
- `visualStyles` and `tags` metadata carry the style label so the gallery can filter by it.
