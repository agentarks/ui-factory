# Kanban Board · Blueprint

**Version** 1.0.0 · **Slug** `kanban-brutalism` · **Page type** data-management
**Visual intent:** a compact, light, brutalist Kanban board read as a **technical schematic / blueprint**. Raw monospace throughout, a foregrounded graph-paper grid, near-black ink on off-white drafting paper (never pure `#000`/`#fff`), harsh exposed 2–3px structural rules, near-square cards, and coordinate/dimension notation (✛ crosshair ticks, `N=` counts) drawn in one deep technical-blue accent. Intentionally rougher and more technical than the published Swiss (sans, hidden grid) and Editorial (serif) directions. Light theme, compact density.

> Board content is copied **verbatim** from `kanban-glassmorphism/fixtures.ts` — the locked shared Kanban baseline (4 columns: Backlog, In Progress, In Review [empty], Done; 9 cards; 5 members). Only the visual language changes.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity, team avatars, search, filters, view controls, primary action) over four columns of cards — Backlog → In Progress → In Review → Done. **In Review** is empty (empty state); the other three hold cards with an ID, title, tags, optional priority, optional checklist progress, due date, and assignee avatars. One card is shown **selected** and one column is shown **active**; a loading skeleton, an inline sync-error banner, and a static drag affordance are demonstrated. Search / New task / Retry / dismiss / drag are honest visual-specimen-only affordances; only the filters and Board/List toggle carry `aria-pressed`.

## Design principles

1. **Structure is the subject.** The graph-paper grid, harsh rules, and monospace type are foregrounded, not hidden. Depth comes from exposed borders and the grid, never from soft shadow or blur.
2. **One ink, one accent.** Near-black ink carries all structure and most text, **including the primary `New task` and project-chip fills**; a single deep technical-blue accent is reserved for meaningful marks (active column, selection, priority HIGH, done, focus, drafting notation). Never multi-hue labels or colored side-stripes.
3. **Drafting notation, used purposefully.** ✛ crosshair ticks prefix every card ID; `N=` prefixes every column count; coordinate axis letters (A–D) label columns; registration crosshairs mark the board corners. Notation communicates, it is not decoration.
4. **Honest and high-contrast.** Brutalism's rawness is paired with a WCAG 2.2 AA baseline: deep ink on off-white paper, state conveyed by text as well as color, and full 44×44 targets. Compact density comes from type, spacing, and rhythm — never from shrinking touch targets.

## Color system (OKLCH)

All CSS color tokens are OKLCH. No pure black or white anywhere.

| Token        | Value                    | Role                                                                                                                                                                                              |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--paper`    | `oklch(0.94 0.005 250)`  | Canvas / drafting paper (the graph-paper field); search field background                                                                                                                          |
| `--surface`  | `oklch(0.975 0.003 250)` | Raised surfaces: header, column heads, cards, error banner                                                                                                                                        |
| `--ink`      | `oklch(0.24 0.005 250)`  | Primary text, structural rules, dark fills (primary/chip/avatars)                                                                                                                                 |
| `--ink-soft` | `oklch(0.4 0.006 250)`   | Secondary text: card IDs, due dates, counts axis, checklist, empty state                                                                                                                          |
| `--rule`     | `oklch(0.24 0.005 250)`  | Harsh exposed structural borders (same near-black as ink)                                                                                                                                         |
| `--accent`   | `oklch(0.42 0.13 236)`   | The one deep technical-blue accent (see roles below)                                                                                                                                              |
| `--on-ink`   | `oklch(0.97 0.004 250)`  | Light text on ink/accent fills (near-white, never `#fff`)                                                                                                                                         |
| `--grid`     | `oklch(0.82 0.006 250)`  | Graph-paper grid stroke (and skeleton block fill). The inline data-URI SVG serializes this token to the equivalent sRGB `#c6c8ce`, because a data-URI SVG cannot reference a CSS custom property. |

- **Neutrals** are tinted toward hue 250 (a faint cool blue-gray), never pure grey/black/white.
- **Accent roles** (the only places the deep blue appears): active-column name + head rule + `ACTIVE` tag; `✛` card-ID ticks; `N=` counts; HIGH priority text + marker; done check + due; selection outline + border; all focus rings; the `Retry` fill; the error `!` mark and `SYNC PAUSED.` word; board-corner registration crosshairs. The primary `New task` and project-chip are **ink**-filled (not accent).
- **Tags/labels are monochrome** — every tag is ink text on a paper fill with a 1px ink border. Categorical tone is dropped on purpose: brutalism is monochrome + one accent, so meaning never relies on hue.
- **Avatars are monochrome** ink-filled squares with `--on-ink` initials (per-member hues in the fixture are intentionally unused). Overlap separation is a 1.5px `--surface` border + negative margin — never a box-shadow.

## Typography

- **Raw monospace everywhere:** `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`. No external fonts; the preview is self-contained and the handoff is framework-agnostic. Sans and serif are explicitly forbidden in this direction.
- **Scale + weight:** board title `1.05rem/700` (UPPERCASE, tracked) · column name `0.82rem/700` (UPPERCASE, accent) · card title `0.82rem/700` · card ID `0.64rem/700` · tags `0.58rem/700` · meta/due/count `0.62–0.7rem/700`. Hierarchy is by weight + case + the accent, not by a large scale spread (compact density).
- **Tracking:** structural labels use `letter-spacing: 0.04–0.08em` so uppercase monospace reads as schematic legend text. `font-synthesis: none`.

## Spacing, density, borders, radii, elevation

- **Density:** compact. Card padding `0.5–0.6rem`; column/card-list padding `0.55–0.6rem`; header padding `0.75rem 0.85rem`; board outer padding `clamp(0.75rem, 2vw, 1.25rem)`. Gaps: cards `0.5rem`, tags `0.25rem`, footer meta `0.45rem`.
- **Radii:** effectively zero. Cards, controls, tags, avatars, and the board frame are square (`border-radius: 0`). Brutalism rejects rounded corners; the only curves are the circular priority glyphs (◆/●) and avatar-free geometry. (Do not soften this with radii.)
- **Borders (the only "elevation"):** everything structural is a harsh exposed solid rule.
  - Board frame: `2px solid var(--rule)`.
  - Header / column-head / error-banner separators: `2px solid var(--rule)` (the active column's head rule is `2px solid var(--accent)`).
  - Column separators (desktop): `2px solid var(--rule)`; mobile: a `2px` bottom rule per column.
  - Cards: `1.5px solid var(--rule)`; the selected card is `2px solid var(--accent)` **plus** a `3px solid var(--accent)` outline at `1px` offset (full perimeter, not a side-stripe).
  - Tags: `1px solid var(--rule)`; add-card / empty: `1.5px dashed var(--rule)`.
- **Elevation:** **none.** There are zero `box-shadow` and zero `backdrop-filter` values anywhere. Depth is communicated entirely by the exposed grid and harsh rules. (See do-not.)
- **Graph-paper grid:** the canvas carries an inline, dependency-free SVG data-URI tiling a 16×16 grid stroked in `--grid` (serialized to sRGB `#c6c8ce` in the SVG — see the color table), so the drafting field is literally foregrounded. Cards/headers are opaque `--surface` sheets sitting on the grid; the grid shows through in the board padding, column gutters, and between cards.

## Layout and composition rules

- Mobile-first: columns stack vertically; the header is a wrapping flex row. No element forces document width.
- At `≥48rem` the board body becomes a horizontal row of `flex: 1 0 15rem` columns (they share a 15rem basis but **grow to fill** the available width on wide screens, leaving no empty gutter) inside an `overflow-x: auto` scroller with internal padding so focus rings never clip; on narrower tablet widths the columns keep their basis and the board scrolls internally. The document never scrolls horizontally.
- Header leads with the project chip + title block + team avatars (left) and search / filters / Board-List toggle / New task (right); it wraps on narrow viewports.
- The error banner is a full-width, full-border panel directly under the header (never a colored side-stripe).
- Registration crosshairs (✛) sit just inside the top-left and bottom-right board corners.

## Navigation patterns

- Filters (`All` / `Mine` / `Due this week`) and the Board/List toggle are the only controls that carry `aria-pressed`; clicking toggles selection state only (visual specimen, not business filtering).
- Search, New task, Retry, dismiss, and the drag grip are honest visual affordances — they render and respond to focus/hover but perform no business action in the specimen.
- All interactive controls are real `<button>`/`<input>` elements with accessible names; the more-actions and dismiss controls expose their purpose via `aria-label`.

## Component appearance and behavior

- **Header controls** are square, harsh-bordered, UPPERCASE monospace, each a full `44×44` (or wider) **non-shrinking** target (`flex: none` on icon buttons, so a tight column head never squeezes the more-actions/dismiss targets below 44px). Active (pressed) filter/view = solid ink fill + `--on-ink` text; inactive = transparent on the paper track + ink text. The primary `New task` is an ink-filled button.
- **Search** is a bordered paper field with a compact visible `SEARCH` label (the input keeps its accessible name `Search cards` via `aria-label`, satisfying label-in-name); keyboard focus draws a `3px` accent ring on the field container (`:focus-within`), the input's own outline suppressed so the ring is never an invisible double-ring.
- **Columns** carry a coordinate letter (A–D), an accent UPPERCASE name, an `N=` count, and a more-actions button. The active column additionally shows an accent `ACTIVE` tag, an accent head rule, and exposes its state via `aria-label="…, active column"`.
- **Cards** show `✛ AU-###` ID, title, monochrome tags, optional `[n/m] SUBTASKS`, a footer with priority (◆ HIGH in accent / ● MED in ink-soft) and due date, and assignee avatars. Done cards strike through the title and recolour the due/check to accent. The selected card uses a full accent border + outline and `aria-label="…, selected"` (it does **not** also set `aria-labelledby`, which would otherwise win and drop "selected" from the accessible name).
- **States demonstrated:** empty (In Review, `No cards yet`), loading skeleton (solid `--grid` blocks with a reduced-motion-gated opacity blink), inline error (`SYNC PAUSED.` + Retry + dismiss), static drag grip, done, priority, selected, hover (card border → accent, an instant state that still applies under reduced motion; only the transition is motion-gated), keyboard focus, and reduced motion.

## Responsive behavior

- Single-column mobile reading order; header and controls wrap without horizontal document overflow at 375/768/1280.
- Board body switches from vertical stack (mobile) to a contained horizontal scroller (≥48rem); the internal scroll never clips focus rings because columns carry their own padding.
- Type sizes are fixed (compact); only layout reflows. Every target stays ≥44×44 at every width.

## Interaction and motion guidance

- Motion is minimal and stateful only: a `0.12s` `border-color`/`color`/`opacity` transition on cards and controls, and a `1.4s` opacity blink on skeleton blocks.
- **Reduced motion:** the skeleton blink and all non-essential **transitions** are suppressed under `prefers-reduced-motion: reduce`; content remains fully visible and static.
- Hover feedback is an **instant** state change — the card border switches to the accent (no shadow, no transform) — and is deliberately **not** gated behind `prefers-reduced-motion`, so reduced-motion users retain the hover affordance; only the animated transition is motion-gated. Focus always draws a complete, unclipped `3px` accent perimeter.

## Accessibility requirements

- **WCAG 2.2 AA.** Every semantic text role meets ≥4.5:1 against its actual opaque parent surface (audited across titles, IDs, ticks, tags, counts, due/priority, active/inactive controls, placeholder, and avatar initials). The accent meets ≥3:1 as a focus/UI-component perimeter.
- **No color-only meaning:** priority, done, active, selected, and error are each conveyed by text/glyph/structure as well as the accent. Tags are monochrome.
- **Targets:** every interactive control is ≥44×44 at 375/768/1280, and icon targets are non-shrinking so a dense column head cannot squeeze them below 44px.
- **Visible labels:** inputs retain a visible label (the search field shows a compact `SEARCH` label) in addition to their accessible name; placeholder text never replaces a label.
- **Semantics:** landmarks, headings, `role="status"`/`aria-live` for the error, `aria-pressed` on filters/view, `aria-label` on icon buttons, the active column, and the selected card. Meaningful images/glyphs are `aria-hidden` with text equivalents.
- **No horizontal document overflow** at any breakpoint; internal board scrolling does not clip focus rings (the scroller carries internal padding).

## Rules for extending the design to new pages

- **Settings:** square bordered fieldsets with `2px` ink rules; labels are UPPERCASE tracked monospace above inputs; toggles are square ink-fill switches (matching `aria-pressed` chips); the active section carries an accent rule + `ACTIVE` tag like the active column.
- **Authentication:** a single centered square card on the graph-paper canvas, `2px` frame, ink-filled primary action, `✛` drafting ticks on field labels; errors are full-border panels (never side-stripes) with `role="status"`.
- **Forms:** every input a bordered paper field with the `:focus-within` accent ring; helper/error text in ink-soft/accent with a text label, never colour alone.
- **Tables / data grids:** full `1.5px` cell borders, tabular monospace numerals, `A/B/C` column letters and row numbers as coordinate notation, `NULL`-style empty cells — the closest this direction gets to a "spreadsheet" sibling while keeping the blueprint ink + accent.
- **Detail pages:** a square bordered sheet on the grid; metadata as `KEY: VALUE` legend rows; status pills are square ink/accent tags with text.
- Keep the **one ink + one accent + graph-paper grid + harsh rules + monospace** contract on every page. Introduce a second hue only if a hard semantic need (e.g. destructive) appears, and then as a bordered panel with a text label, never a side-stripe.

## Do

- Use raw monospace everywhere; foreground the graph-paper grid; use harsh exposed 2–3px solid rules; keep cards near-square; reserve the single deep-blue accent for meaningful marks; convey every state with text/glyph as well as colour; keep all targets ≥44×44; use OKLCH tokens.

## Do not

- Do not use gradients, gradient text, `box-shadow`, or `backdrop-filter` anywhere. Do not use pure `#000`/`#fff`, multi-hue/coloured tags, coloured side-stripes, rounded corners, serif or sans type, external fonts/assets/dependencies, or colour-only meaning. Do not clip focus rings inside scroll containers.

## When to use / avoid / trade-offs

- **Use** for technical, engineering, data-heavy, or developer-tool products where exposed structure and a schematic feel reinforce trust and scannability.
- **Avoid** for consumer/retail/wellness contexts where the raw, high-contrast, grid-forward aesthetic reads as harsh; for brands needing warmth, imagery, or soft motion; or where stakeholders expect conventional "product" polish.
- **Trade-offs:** the foregrounded grid adds background texture that competes slightly with dense card content at very small sizes (mitigated by opaque card sheets); monospace narrows title room; the deliberately unrefined posture trades conventional polish for distinctiveness and structural honesty.

## Dependencies, assets, and licenses

- **Dependencies:** none beyond the host application. No runtime libraries are added.
- **Assets/fonts:** none external. The graph-paper grid is an inline, dependency-free SVG data-URI; the type is the native monospace stack; all icons are inline SVG.
- **License:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field). The exported `DESIGN.md` is a design specification; confirm licensing with the repository owner before reuse.

## AI acceptance checklist

- [ ] Raw monospace everywhere; no sans or serif resolves on any element.
- [ ] Foregrounded graph-paper grid on the canvas (SVG url background); no gradients anywhere.
- [ ] Near-black ink on off-white drafting paper; no pure `#000`/`#fff`.
- [ ] Harsh exposed 2–3px solid structural rules; near-square cards (radius ≤ 3px).
- [ ] Exactly one deep technical-blue accent, reserved for meaningful marks; monochrome tags/avatars.
- [ ] Coordinate/dimension notation present and purposeful (`✛` ticks, `N=` counts, axis letters, registration crosshairs).
- [ ] Zero `box-shadow` and zero `backdrop-filter` on any element.
- [ ] All semantic text roles ≥4.5:1; focus/UI perimeter ≥3:1.
- [ ] No colour-only meaning; states carried by text/glyph/structure.
- [ ] Every interactive target ≥44×44 at 375/768/1280; no horizontal document overflow; focus rings never clipped.
- [ ] Reduced motion suppresses the skeleton blink and non-essential transitions; content stays visible.
- [ ] Locked content unchanged (4 columns, 9 cards, 5 members, In Review empty).
- [ ] No new dependencies, assets, or external fonts; license status stated as "no license".
