# Kanban Board · Holodeck Wireframe

**Version** 1.0.0 · **Slug** `kanban-dark-neon` · **Page type** data-management
**Visual intent:** a dark, airy **Holodeck Wireframe** Kanban board — near-black cyan-blue canvas with **transparent / near-transparent panels defined by luminous cyan wireframe edges**, cool-white body/title text, **cyan monospace metrics**, and **restrained semantic glow** on dots / active / selected / focus. No filled slabs, no gradients, no backdrop blur, and no multi-hue signage: a single cyan accent carries every meaningful mark, with a pale-red full-border reserved only for the error state. Terminal/cyberpunk holographic-projection character. Dark theme, compact density.

> Board content is copied **verbatim** from `kanban-glassmorphism/fixtures.ts` — the locked shared Kanban baseline (4 columns: Backlog, In Progress, In Review [empty], Done; 9 cards; 5 members). Only the visual language changes.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity, team avatars, search, filters, view controls, primary action) over four columns of cards — Backlog → In Progress → In Review → Done. **In Review** is empty (empty state); the other three hold cards with an ID, title, labels, optional priority, optional checklist progress, due date, and assignee avatars. One card is shown **selected** and one column is shown **active**; a loading skeleton, an inline sync-error banner, and a static drag affordance are demonstrated. Search / New task / Retry / dismiss / drag are honest visual-specimen-only affordances; only the filters and Board/List toggle carry `aria-pressed`.

## Design principles

1. **The edge is the panel.** Surfaces are transparent or near-transparent; a panel is defined by a luminous cyan wireframe edge plus a restrained glow, never by a fill. The near-black canvas shows through everywhere, so the board reads as a projected hologram rather than stacked slabs.
2. **One cyan accent.** A single bright cyan carries every meaningful mark — wireframe edges, glow, metrics, dots, active column, selection, priority HIGH, done, focus. Categorical label hues are dropped on purpose (outlined monochrome labels). The only second colour is a pale red, reserved exclusively for the error state.
3. **Two type voices.** Cool-white system sans carries body content, titles, labels, and controls; cyan monospace carries the metrics — IDs, counts, dates, checklist progress, status tags. The split is the readable signature of the direction.
4. **Glow is restrained and semantic.** Glow (a `box-shadow` blur, never a backdrop blur or gradient) marks only what matters: column dots, the active column, selection, the primary action, and focus. It never washes whole panels and never competes with text.
5. **Honest and high-contrast.** Because panels are near-transparent, text effectively reads on the near-black canvas — so a WCAG 2.2 AA baseline comes for free and is verified against the composited backdrop. State is conveyed by text/glyph/structure as well as colour, and every target is ≥44×44.

## Color system (OKLCH)

Solid colour tokens are OKLCH. No pure black or white anywhere. The canvas is the only fully opaque surface; every panel is transparent or a faint cyan/red tint over it.

| Token          | Value                    | Role                                                                                                                                                                                                                                                                               |
| -------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--canvas`     | `oklch(0.13 0.035 230)`  | Near-black cyan-blue canvas; the only opaque surface and the effective text backdrop                                                                                                                                                                                               |
| `--bar-tint`   | `rgba(64,224,232,0.05)`  | App bar: cyan 5% wash over the canvas                                                                                                                                                                                                                                              |
| `--head-tint`  | `rgba(64,224,232,0.04)`  | Column head: near-transparent cyan wash                                                                                                                                                                                                                                            |
| `--error-tint` | `rgba(255,120,120,0.05)` | Error banner: near-transparent red wash                                                                                                                                                                                                                                            |
| `--ink`        | `oklch(0.96 0.012 220)`  | Body/title/control text (cool-white)                                                                                                                                                                                                                                               |
| `--ink-soft`   | `oklch(0.78 0.03 225)`   | Secondary text: checklist, empty state, done titles, MED priority (all ≥4.5:1 on the canvas)                                                                                                                                                                                       |
| `--accent`     | `oklch(0.82 0.15 198)`   | The one bright cyan: wireframe edges on active/selected/primary, glow, all metrics, dots, HIGH priority, done, focus rings                                                                                                                                                         |
| `--edge`       | `oklch(0.52 0.1 198)`    | Mid cyan resting wireframe edge (cards, columns, controls, labels, avatars, counts)                                                                                                                                                                                                |
| `--danger`     | `oklch(0.78 0.17 22)`    | Pale red — error border, error mark, and `Sync paused.` strong only                                                                                                                                                                                                                |
| `--cyan`       | `64, 224, 232`           | Cyan channel triplet used inside every `rgba()` cyan — glow halos, the active/hover cyan surface wash, the desktop column separator rule, the card-foot hairline, and the skeleton block fill. (A data-URI SVG is not used, so a CSS variable cannot be referenced from an image.) |

- **Accent roles:** card/column/control/label/avatar/count edges (mid `--edge` at rest, bright `--accent` when active/selected/hovered/focused); all cyan monospace metrics; column dots; the active column's head rule + `ACTIVE` tag; HIGH priority marker + word; the done check + due; selection; focus rings; the primary `New task` edge + glow; the `Retry` edge + glow.
- **Labels are monochrome** — every label is cool-white text in a cyan-edged transparent chip. Per-label categorical hues in the fixture are intentionally unused (no multi-hue signage).
- **Avatars are monochrome** — transparent circles with a cyan inner edge and an opaque canvas ring separating overlaps (no `box-shadow` cast). Per-member hues are intentionally unused.
- **Error is the only red.** The error banner is a transparent red-tinted panel with a full `1px solid var(--danger)` border on all sides; the `Retry` action keeps the cyan accent (it is an action, not an error). Never a coloured side-stripe.

## Typography

- **Two native stacks, no external fonts:** system sans for body/title/labels/controls (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`); monospace for metrics (`ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`). The preview is self-contained and the handoff is framework-agnostic.
- **Cyan monospace metrics:** card ID (`AU-###`), column count, due date, checklist progress, the header meta line, the `SEARCH` field label, the `ACTIVE` tag, and `ADD A CARD`. These are the terminal readouts and are the only cyan text.
- **Cool-white sans content:** board title `1.05rem/700`, column heading `0.82rem/700`, card title `0.82rem/650`, labels `0.62rem/600`, error body `0.78rem/400`, control labels `0.76–0.8rem`. Hierarchy is by weight and the cyan-metric/white-body split, not by a large scale spread (compact density). `font-synthesis: none`.

## Spacing, density, borders, radii, elevation

- **Density:** compact. Card padding `0.6–0.65rem`; header padding `0.6rem`; board outer padding `clamp(0.75rem, 2vw, 1.1rem)`. Gaps: cards `0.5rem`, labels `0.25rem`, footer meta `0.45rem`.
- **Radii:** small and technical. Cards/controls `6px`; labels `4px`; counts and avatars fully round (`999px` / `50%`). Not razor-square (this is wireframe, not brutalism), not soft putty.
- **Borders (the wireframe):**
  - Cards: `1px solid var(--edge)`; selected → `border-color: var(--accent)` (same 1px on all sides — full perimeter, never a side-stripe).
  - Error banner: `1px solid var(--danger)` on all four sides.
  - Column separator (desktop): a faint `1px solid rgba(--cyan,0.14)` full rule between columns (a structural rule, not a card side-stripe).
  - Column heads, controls, labels, avatars, counts: a `1px` cyan edge rendered as an `inset 0 0 0 1px` box-shadow so it can layer with glow without doubling the border.
- **Elevation:** **none in the material sense.** There are no cast/drop shadows and no `backdrop-filter`. Depth is communicated entirely by **luminous cyan edges and restrained glow** (`box-shadow` blur, alpha ≤ ~0.35). The resting card carries only a `0 0 6px rgba(--cyan,0.06)` halo; selection, the active column, dots, focus, and the primary add stronger-but-modest glow.

## Layout and composition rules

- Mobile-first: columns stack vertically; the header is a wrapping flex row. No element forces document width.
- At `≥48rem` the board body becomes a horizontal row of `flex: 1 0 15rem` columns (they grow to fill wide screens, leaving no empty gutter) inside an `overflow-x: auto` scroller with `4px` internal padding so offset focus rings never clip; on narrower tablet widths the columns keep their basis and the board scrolls internally. The document never scrolls horizontally.
- Header leads with the project chip + title block + team avatars (left) and search / filters / Board-List toggle / New task (right); it wraps on narrow viewports.
- The error banner is a full-width, full-border transparent panel directly under the header.

## Navigation patterns

- Filters (`All` / `Mine` / `Due this week`) and the Board/List toggle are the only controls that carry `aria-pressed`; clicking toggles selection state only (visual specimen, not business filtering). Selection = transparent face + bright cyan edge + modest glow.
- Search, New task, Retry, dismiss, and the drag grip are honest visual affordances — they render and respond to focus/hover but perform no business action in the specimen.
- All interactive controls are real `<button>`/`<input>` elements with accessible names; the more-actions and dismiss controls expose their purpose via `aria-label`.

## Component appearance and behavior

- **App bar** is a `rgba(cyan,5%)` wash with a cyan inset edge and a faint outer halo. The **project chip** is transparent with a cyan edge; the **team avatars** are outlined cyan-edge circles; the header meta line is a cyan monospace readout.
- **Header controls** are transparent, cyan-edged, full `44×44` targets. Active (pressed) filter/view = transparent face + bright cyan edge + glow; inactive = transparent face + mid cyan edge. The primary `New task` is a transparent button with a bright cyan edge + modest glow.
- **Search** is a transparent cyan-edged field with a compact visible `SEARCH` label (the input keeps its accessible name `Search cards` via `aria-label`); keyboard focus draws a `3px` cyan ring on the field container (`:focus-within`), the input's own outline suppressed so the ring is never an invisible double-ring.
- **Columns** carry a cyan dot, the name, an optional accent `ACTIVE` tag, a cyan monospace count in an outlined pill, and a more-actions button. The active column additionally glows: its head gets a cyan edge + halo and its dot brightens.
- **Cards** show a cyan monospace ID, a cool-white title, outlined monochrome labels, optional `n/total` subtasks, and a footer with priority (◆ HIGH in cyan / ● MED in cool-white) and a cyan monospace due date, plus assignee avatars. Done cards strike through the title and recolour it to secondary. The selected card uses a full bright-cyan border + stronger glow and `aria-label="…, selected"` (it does **not** also set `aria-labelledby`, which would otherwise win and drop "selected" from the accessible name).

## Empty, loading, and error states

All non-data states keep the zero-fill wireframe contract: they are transparent or cyan-tinted panels defined by cyan/red edges, never opaque slabs.

- **Empty** (In Review): a transparent, cyan-edged panel with a small outlined cyan mark and a cool-white monospace `No cards yet` — the empty column reads as an open frame, not a blank box.
- **Loading** (a skeleton card in Backlog): transparent cyan-edged card containing cyan-tinted (`rgba(--cyan,0.16)`) blocks whose opacity pulses on a `1.4s` cycle. The pulse is fully suppressed under `prefers-reduced-motion` (the blocks remain visible and static).
- **Error** (inline sync banner): a transparent `rgba(red,5%)` panel with a **full pale-red `1px` border on all four sides** (never a coloured side-stripe), a pale-red triangle mark + `Sync paused.` strong, a cool-white body line, and a transparent cyan-edge `Retry` action plus a dismiss control. It exposes `role="status"`/`aria-live="polite"`. Cyan is the action accent; red is reserved entirely for the error treatment.
- **Drag** is a static cyan dot grip (opacity lifted on card hover) — an honest affordance, no live drag.
- **Done** strikes the title through and dims it to secondary; the due date gains a cyan check. **Priority** reads as ◆ HIGH (cyan) or ● MED (cool-white), always with its word. **Selection** is a full bright-cyan border + stronger glow. **Hover** and **focus** are described under interaction/motion.

## Responsive behavior

- Single-column mobile reading order; header and controls wrap without horizontal document overflow at 375/768/1280.
- Board body switches from vertical stack (mobile) to a contained horizontal scroller (≥48rem); the internal `4px` padding never clips focus rings.
- Type sizes are fixed (compact); only layout reflows. Every target stays ≥44×44 at every width.

## Interaction and motion guidance

- Motion is minimal and stateful only: a `0.15s` `box-shadow`/`border-color`/`background-color`/`color`/`transform` transition on cards and controls, and a `1.4s` opacity pulse on skeleton blocks.
- **Reduced motion:** the skeleton pulse, the hover lift, and all non-essential **transitions** are suppressed under `prefers-reduced-motion: reduce`; content remains fully visible and static.
- **Hover (non-selected cards only)** is a multi-channel cue in the single cyan hue: a faint cyan wash (`rgba(--cyan,0.06)`) + a bright cyan edge (`border-color: var(--accent)`) + a small crisp `translateY(-2px)` lift added only when motion is allowed. The whole treatment is gated by `(hover: hover)`, so tapping a non-interactive card on a touch device cannot leave a sticky state that resembles selection. On hover-capable devices the wash + edge are **instant** and remain under `prefers-reduced-motion`; only the lift and animated transition are motion-gated. It is scoped to `:not(.is-selected)` so the selected card's stronger treatment is never downgraded by hover. No fill-at-rest, no gradient, no second hue, and cards stay non-interactive (`cursor: auto` — no pointer/grab). Focus always draws a complete, unclipped `3px` cyan perimeter.

## Accessibility requirements

- **WCAG 2.2 AA.** Every semantic text role meets ≥4.5:1 against its **real effective backdrop**. Because panels are near-transparent, the effective backdrop is the near-black canvas (verified by compositing each translucent panel layer over the canvas, not by measuring an un-composited tint that would overstate background luminance). The cyan accent meets ≥3:1 as a focus/UI-component perimeter.
- **No colour-only meaning:** priority, done, active, selected, and error are each conveyed by text/glyph/structure as well as colour. Labels are monochrome.
- **Targets:** every interactive control is ≥44×44 at 375/768/1280.
- **Visible labels:** inputs retain a visible label (the search field shows a compact `SEARCH` label) in addition to their accessible name; placeholder text never replaces a label.
- **Semantics:** landmarks, headings, `role="status"`/`aria-live` for the error, `aria-pressed` on filters/view, `aria-label` on icon buttons, the active column, and the selected card. Meaningful images/glyphs are `aria-hidden` with text equivalents.
- **No horizontal document overflow** at any breakpoint; internal board scrolling does not clip focus rings (the scroller carries internal padding).

## Rules for extending the design to new pages

- **Settings:** transparent fieldsets defined by cyan edges; labels are cyan monospace above inputs; toggles are transparent cyan-edge switches matching the `aria-pressed` chips; the active section glows like the active column.
- **Authentication:** a single centred transparent card on the near-black canvas, defined by a bright cyan edge + glow; cyan-edge inputs with the `:focus-within` ring; the primary action is a transparent cyan-edge + glow button; errors are pale-red full-border panels with `role="status"`.
- **Forms:** every input a transparent cyan-edge field with the `:focus-within` ring; helper/error text in cool-white/pale-red with a text label, never colour alone.
- **Tables / data grids:** transparent cells with cyan hairline rules and cyan monospace numerals; row/col headers in cyan mono — the closest this direction gets to a telemetry console while keeping the wireframe contract.
- **Detail pages:** a transparent sheet on the canvas; metadata as cyan-mono `KEY` + cool-white `VALUE` legend rows; status pills are outlined cyan-edge chips with text.
- Keep the **near-black canvas + transparent cyan-edge panels + cyan mono metrics / cool-white body + restrained glow + no fills/gradients/blur/multi-hue** contract on every page. Introduce a second hue only for a hard semantic need (e.g. destructive), and then as a full pale-red border panel with a text label, never a side-stripe.

## Do

- Define panels with luminous cyan wireframe edges over a near-black canvas; keep surfaces transparent/near-transparent; use cyan monospace for metrics and cool-white for body; reserve glow for dots/active/selected/focus; convey every state with text/glyph as well as colour; keep all targets ≥44×44; use OKLCH solid tokens.

## Do not

- Do not use fills, gradients, gradient text, `backdrop-filter`, or drop/cast shadows (glow is a `box-shadow` blur only). Do not use pure `#000`/`#fff`, multi-hue/coloured labels or avatars, coloured side-stripes, or colour-only meaning. Do not use external fonts/assets/dependencies, or clip focus rings inside scroll containers.

## When to use / avoid / trade-offs

- **Use** for developer tools, ops/security consoles, data-heavy dashboards, and technical products where an airy holographic/wireframe aesthetic reinforces a "live system" feel and scannability of metrics.
- **Avoid** for consumer/retail/wellness/editorial contexts where the dark, high-contrast, neon-glow aesthetic reads as cold or gaming-leaning; for brands needing warmth, imagery, or soft motion; or where a light print/serif direction is expected.
- **Trade-offs:** zero-fill wireframes can read sparse and rely entirely on edges/glow for grouping, so contrast is solved by reading text on the near-black canvas (panels stay non-opaque) and by pairing every colour cue with text. Cyan glow adds background energy that must stay restrained to avoid visual noise, and a dark theme trades daytime glare comfort for low-light focus.

## Dependencies, assets, and licenses

- **Dependencies:** none beyond the host application. No runtime libraries are added.
- **Assets/fonts:** none external. The type is the native sans + monospace stacks; all icons are inline SVG; all glow is CSS `box-shadow` (no images).
- **License:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field). The exported `DESIGN.md` is a design specification; confirm licensing with the repository owner before reuse.

## AI acceptance checklist

- [ ] Near-black cyan-blue canvas; transparent/near-transparent panels (cards/columns/controls/labels/avatars/counts) defined by cyan wireframe edges — no filled slabs.
- [ ] Single bright cyan accent for all meaningful marks; monochrome outlined labels and avatars; pale-red used only for the full-border error.
- [ ] Cool-white system-sans body/title; cyan monospace metrics (ID, count, due, checklist, header meta).
- [ ] Restrained semantic glow on dots/active/selected/focus/primary only; no gradients, no `backdrop-filter`, no drop/cast shadows anywhere.
- [ ] No pure `#000`/`#fff`; all solid colour tokens OKLCH.
- [ ] All semantic text roles ≥4.5:1 against the composited backdrop (near-black canvas); focus/UI perimeter ≥3:1.
- [ ] No colour-only meaning; states carried by text/glyph/structure.
- [ ] Every interactive target ≥44×44 at 375/768/1280; no horizontal document overflow; focus rings never clipped.
- [ ] Reduced motion suppresses the skeleton pulse, the hover lift, and non-essential transitions; on hover-capable devices the hover wash + edge remain, while touch taps never create a sticky hover state.
- [ ] Locked content unchanged (4 columns, 9 cards, 5 members, In Review empty).
- [ ] No new dependencies, assets, or external fonts; license status stated as "no license".
