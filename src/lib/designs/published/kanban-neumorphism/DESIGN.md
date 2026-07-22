# Kanban Board · Neumorphism

**Version** 1.0.0 · **Slug** `kanban-neumorphism` · **Page type** data-management
**Visual intent:** a **Hairline-Ringed Neumorphism** Kanban board — soft extruded and inset monochrome cool-gray surfaces, paired near-light (upper-left) and darker (lower-right) extrusion shadows, complementary inset pressed states, and an explicit 1px darker inner hairline ring on every column, card, and selected/raised control so boundaries stay legible when relief is subtle. Light theme, comfortable density, WCAG 2.2 AA. Recognizably neumorphic while prioritizing legibility over purity.

> This is the catalog's **low-contrast-lifted-to-AA** style. Its board content is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): the same columns, cards, labels, members, due dates, and the empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity, team avatars, search, filters, view controls, primary action) over four columns of draggable-feeling cards: Backlog → In Progress → In Review → Done. The **In Review** column is empty, demonstrating the empty state; the other three hold realistic cards with a title, labels, an optional priority indicator, an optional checklist progress line, a due date, and assignee avatars.

## Design principles

1. **Surfaces match the canvas.** The neumorphic signature: at rest, raised cards, columns, and controls are the _same_ cool-gray color as the page background. Depth comes only from paired light/dark extrusion shadows, never from fills, gradients, or translucency. (The single allowed exception is the documented _transient_ cool-cobalt hover tint on cards and secondary controls — see Interaction and motion.)
2. **Hairline rings carry the boundary.** Because same-color-on-same-color relief can vanish against the canvas, every raised or pressed surface also carries a 1px darker inner hairline ring (an inset `box-shadow` layer). The ring is what keeps edges readable at AA — it is non-negotiable.
3. **Selection = pressed in.** Active toggles and filters become inset (pressed) wells rather than colored fills. Tactile state is the interaction language; no colored "active" pill is needed.
4. **Legibility over purity.** Ink is AA-dark, neutrals are tinted near-white rather than pure white, and a tiny set of whisper-chroma semantic cues (stage dots, priority, done, error) is retained — always paired with text/icons — so meaning never relies on the barely-there relief alone. Whisper-chroma is otherwise semantic-only; the one non-semantic chroma in the system is the documented decorative hover tint.

## Color system (OKLCH)

| Token           | Value                    | Role                                                                                  |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `--canvas`      | `oklch(0.9 0.006 255)`   | Neumorphic page base; raised surfaces share this exact color at rest                  |
| `--surface`     | `oklch(0.9 0.006 255)`   | Cards, columns, controls (identical to canvas at rest)                                |
| `--ink`         | `oklch(0.26 0.014 255)`  | AA-dark primary text (≈7:1 on surface)                                                |
| `--ink-soft`    | `oklch(0.37 0.014 255)`  | Meta: due dates, counts, checklist, empty-state copy, search placeholder (≈5:1)       |
| `--ink-faint`   | `oklch(0.5 0.012 255)`   | Grip handle, decorative icons (non-text only)                                         |
| `--hair`        | `oklch(0.8 0.008 255)`   | 1px inner hairline ring on resting raised/pressed surfaces                            |
| `--hair-strong` | `oklch(0.72 0.012 255)`  | 1px inner ring on selected/raised controls                                            |
| `--accent`      | `oklch(0.42 0.016 255)`  | Monochrome dark focus/selection accent; primary fill                                  |
| `--on-accent`   | `oklch(0.96 0.004 255)`  | Near-white ink on the dark primary fill (never `#fff`)                                |
| `--hover-tint`  | `oklch(0.918 0.032 250)` | Restrained cool-cobalt hover tint — decorative feedback on cards & secondary controls |
| `--danger`      | `oklch(0.48 0.13 25)`    | Muted clay-red error ink/icon                                                         |
| `--danger-soft` | `oklch(0.88 0.03 25)`    | Pale clay error surface                                                               |
| `--done`        | `oklch(0.45 0.1 152)`    | Muted green done state                                                                |
| `--pri-high`    | `oklch(0.48 0.12 25)`    | Muted clay-red high priority                                                          |
| `--pri-medium`  | `oklch(0.48 0.09 65)`    | Muted amber medium priority                                                           |

- **Neutrals are tinted** toward hue 255 (cool gray), never pure grey/black/white. `--on-accent` is a near-white, not `#fff`.
- **No gradients, no backdrop blur, no translucency** anywhere. The only depth cues are the dual extrusion shadows and the hairline ring.
- **Monochrome by default:** at rest and persistently, cards, columns, labels, controls, dividers, and dividers are all the cool-gray surface — large surfaces are never given a persistent color fill. The only color in the system is a tiny set of **whisper-chroma semantic cues** (chroma 0.04–0.13), each always paired with a text label or icon, plus one **decorative** cool-cobalt hover tint (`--hover-tint`, chroma 0.032) that applies only transiently on hover to cards and secondary controls (never a persistent fill):
  - **Stage dots** (one per column header, chroma 0.02–0.05): Backlog slate `oklch(0.52 0.02 260)`, In Progress blue `oklch(0.52 0.05 250)`, In Review amber `oklch(0.6 0.05 70)`, Done green `oklch(0.54 0.05 152)`. They never become a colored side-stripe.
  - **Priority** (dot + capitalized word): high `oklch(0.48 0.12 25)`, medium `oklch(0.48 0.09 65)`.
  - **Done** due-date + check icon: `oklch(0.45 0.1 152)`.
  - **Error** banner/icon/Retry: `oklch(0.48 0.13 25)` on `oklch(0.88 0.03 25)`.
- **Labels are monochrome pressed-in pills** (surface fill + hairline ring + `--ink-soft` text). The label _text_ is the meaning; tone is intentionally not colorized, which keeps the board unmistakably neumorphic and distinct from colored-chip styles.
- **Avatars:** near-white initials on `oklch(0.45 0.05 <hue>)` — a whisper-chroma per-person fill (chroma 0.05, nearly gray with a hint of identity). L 0.45 keeps near-white initials above 4.5:1. A crisp neumorphic ring (`box-shadow: var(--raise-sm), inset 0 0 0 1px oklch(0.4 0.02 <hue>)`) separates overlaps against whichever surface they sit on.

## Typography

- System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) — no external fonts, so the preview is self-contained and the handoff is framework-agnostic.
- Scale (rem): board title 1.2 / 700 · column heading 0.95 / 700 · card title 0.9 / 650 · meta 0.74–0.82 · labels 0.68. Hierarchy through scale + weight contrast; `font-synthesis: none`.
- Body/meta line length is bounded by the card width.

## Spacing, density, elevation, radii

- **Density:** comfortable. Card padding 0.8–0.85rem; column padding 0.85rem; app-bar padding 0.9rem + `clamp(0.9rem, 2vw, 1.15rem)` sides; canvas padding `clamp(0.9rem, 3vw, 1.4rem)` (gives the floating slabs room to cast shadows). Gaps vary for rhythm (cards 0.6rem, labels 0.3rem, footer meta 0.5rem).
- **Radii:** cards, columns, empty-state, error banner, add-card, skeleton = **12px** (the signature radius); controls/inputs/chip tracks = **10px**; pills, count badges, avatars = **999px**.
- **Elevation = paired extrusion shadows** (the only depth cue besides the ring). A tinted near-white light from the upper-left and a dark cool-gray shade to the lower-right — never pure white/black:
  - `--raise-sm`: `3px 3px 6px rgba(86,92,112,.26), -3px -3px 6px rgba(248,250,254,.90)` — resting cards, chips, project chip, avatars, icon hovers.
  - `--raise`: `5px 5px 10px rgba(86,92,112,.28), -5px -5px 10px rgba(248,250,254,.92)` — app bar, hovered card.
  - `--raise-lg`: `8px 8px 16px rgba(86,92,112,.30), -8px -8px 16px rgba(248,250,254,.94)` — available for hero/modal surfaces.
  - `--press`: `inset 3px 3px 6px rgba(86,92,112,.28), inset -3px -3px 6px rgba(248,250,254,.90)` — empty-state well, pressed selections.
  - `--press-sm`: `inset 2px 2px 4px rgba(86,92,112,.24), inset -2px -2px 4px rgba(248,250,254,.88)` — search field, count pill, labels, add-card, skeleton groove, active toggle inset.
- **Hairline ring (non-negotiable):** `inset 0 0 0 1px var(--hair)` on resting raised/pressed surfaces; `inset 0 0 0 1px var(--hair-strong)` on selected/raised controls. The ring is layered into the same `box-shadow` as the extrusion.
- **Borders:** avoid hard `border` lines; use the ring or pressed grooves to separate regions (e.g., the card footer uses an inset top groove instead of a top border).

## Layout and composition

- The board floats on the cool-gray canvas: the canvas has outer padding, and the app bar, error banner, and each column are raised slabs that cast dual shadows into that padding. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The app bar wraps its controls onto further rows on narrow widths.
- Depth is layered by extrusion, not nested fills: the app bar is the most pronounced raise; columns and cards are `--raise-sm` resting (cards lift to `--raise` on hover). Selected controls press _in_. Surfaces are always the canvas color — never a panel-on-panel tint.

## Components and behavior

- **App bar** (raised slab, 12px radius, `--raise` + ring): project chip + title + subtitle + team-avatar group on the left; on the right a pressed-in search field, a raised segmented filter track (All / Mine / Due this week), a raised segmented Board/List track, and an inverted dark "New task" primary button. Wraps on narrow widths.
- **Column** (raised slab, 12px radius, `--raise-sm` + ring): a header row with a whisper-chroma stage dot, the column name (`<h2>`), a pressed-in count pill, and a "more actions" icon button; a vertical list of cards; a pressed "Add a card" button; and a pressed empty-state placeholder when the column has no cards.
- **Card** (raised slab, 12px radius, `--raise-sm` + ring): title (`<h3>`), monochrome pressed label pills, an optional checklist progress line, and a footer (separated by a pressed groove) with the priority indicator, due date, and assignee avatars. Hover lifts the card 1px to `--raise` (reduced-motion: static).
- **Label chip:** monochrome pressed-in pill + `--ink-soft` text; meaning is the text.
- **Avatar:** near-white initials on a whisper-chroma OKLCH fill with a neumorphic ring; exposes the full name via `aria-label`. Two sizes: header 34px, card 28px.
- **Controls:** search input (pressed-in well, 44px height, dark text), segmented tracks holding pressed-in active options (`aria-pressed`), primary button (inverted dark fill with near-white text, 44px), icon buttons (column "more actions" and error dismiss, full 44×44px). Every header filter/view control is a full 44px tap. The search field shows a contrasting dark `:focus-within` ring.
- **Empty state:** a pressed well with a small inset square mark and "No cards yet" renders in any column with zero cards.
- **Loading skeleton:** a pressed groove card holding inset placeholder bars with an opacity pulse (gradient-free).

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the neumorphic chrome: a raised app bar (brand + search + primary action + avatar menu) over a raised sidebar/column rail for board/account navigation, all floating on the cool-gray canvas with outer padding so shadows can cast. Never use a colored side-stripe as an accent — use a pressed chip, a dot, or a leading icon. Separate stacked surfaces with extrusion shadows and the hairline ring, never with translucency or hard borders.

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is thin (`scrollbar-width: thin` for Firefox, `::-webkit-scrollbar` for WebKit).
- **Mobile/tablet (<768px):** columns stack vertically; the app-bar control rows wrap; no document-level horizontal overflow at 375/768/1280. Outer padding scales via `clamp`.
- Touch targets: **every interactive control is ≥44×44px at all viewports** — search field, primary, every filter chip, every Board/List segmented button, add-card, Retry, and every icon button (the column "more actions" button and the error dismiss button). There is no sub-44px target anywhere in the board.

## Interaction and motion

- Hover: card lifts 1px to `--raise`; primary button lifts 1px; icon buttons and add-card shift from ring-only to `--raise-sm`. Active filter/view presses _into_ its track (`--press-sm` + `--ring-strong`). In addition, a restrained **cool-cobalt hover tint** (`--hover-tint`, `oklch(0.918 0.032 250)`) is applied to cards and the secondary controls — inactive filter chips, inactive Board/List buttons, the column "more actions" icon button, and "Add a card". The tint is **decorative feedback only**: the paired light/dark shadow, the 1px hairline ring, the focus ring, and the pressed/selected semantics all remain, so hover color is never the sole state signal. The **primary button and the error Retry/dismiss actions are deliberately not recolored**, keeping their semantic role unambiguous. The tint holds AA — AA-dark ink on the slightly-lighter pale-cobalt background still clears 4.5:1.
- Normal UI transitions (hover, focus, press, active-state shadow, and the hover tint) are **0.16s ease**, gated behind `@media (prefers-reduced-motion: no-preference)`. Hover-only effects are additionally gated behind `@media (hover: hover)` so touch devices don't get sticky hover states. Under `prefers-reduced-motion` the hover tint still applies (a color change is not motion) but **instantly**, with no fade; only the transform lifts and the fade are suppressed.
- The loading skeleton's opacity pulse is a separate, slower **1.4s ease-in-out** loop, also gated behind `prefers-reduced-motion: no-preference`. It is the only repeating motion and has no reduced-motion counterpart by design (reduced-motion shows static skeleton grooves).
- In both cases, reduced-motion users get a fully static board with no loss of function.
- Never animate CSS layout properties (other than the small `transform` lifts); never use bounce/elastic easing.

## States

The states below are **visual state/affordance demonstrations only**, not functional behavior. The **filter chips and the Board/List segmented toggle are `aria-pressed` toggle controls** — they reflect selection state in the specimen but perform no real filtering or view switch. **Search, the New task primary, the column "More actions" overflow, the "Add a card" drop zone, Retry, and dismiss all render their affordance but perform no real search, creation, menu, sync, or dismissal** — they are inert specimen controls that exist only to demonstrate their visual treatment. The **drag grip is a static affordance** with no drag-and-drop logic. Reuse these visual treatments when wiring real behavior:

- **Empty (shown):** a column with no cards renders a pressed well ("No cards yet") — see the **In Review** column.
- **Loading (shown):** a **skeleton card** with inset placeholder grooves (in Backlog). The skeleton uses an **opacity pulse** (not a gradient shimmer) so it stays gradient-free. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline **raised pale-clay error banner** under the app bar — clay warning icon + bold clay label, a raised Retry button with clay text/ring, and a dismiss control (`role="status" aria-live="polite"`). No side-stripe.
- **Drag/move affordance (shown, static):** every card has a **grip handle** (faint by default, full on hover, `cursor: grab`) as a visual affordance only — no drag-and-drop logic is implemented. Add actual DnD when wiring it for real, reusing the card + grip treatment.
- **Done (shown):** completed cards show a check icon and a green due-date treatment.
- **Priority (shown):** dot + capitalized word in the card footer (clay-red/High, amber/Medium).
- **Selection (shown):** the active filter chip and active Board/List option are **pressed in** — the neumorphic "selected = pressed" pattern, no colored fill.
- **Validation:** when implementing real card-edit forms, reuse the clay error-ink + inline message pattern under each field inside a pressed-in field well.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; counts and icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced).
- **Visible focus:** `outline: 3px solid var(--accent)` with `outline-offset: 2px` on every interactive element — the dark cool-gray accent contrasts ≥3:1 (≈4:1) against the cool-gray surface. The primary button uses the **same dark accent ring**: its `outline-offset` seats the ring outside the dark fill, against the surrounding app-bar surface, where the dark ring reads at ≥3:1 (a near-white ring would vanish against the near-white surface). The composite search field shows focus on its container via a contrasting **dark `:focus-within` ring** (the same-color surface would otherwise hide an input outline); the `<input>` remains the semantic focus target, with its own redundant outline suppressed so keyboard users see one clear indicator.
- **WCAG 2.2 AA** is met by construction: dark cool-gray ink (L 0.26) on the cool-gray surface (L 0.9) gives ≈7:1; meta ink (L 0.37) gives ≈5:1; near-white initials (L 0.96) on avatar fills (L 0.45) give ≈4.9:1; label/priority/done/error text is always dark enough on the surface for AA. **The hairline ring is the accessibility-critical fallback** for low-contrast relief — never remove it. Meaning is never conveyed by color/shape alone (priority and status are always labelled in text, and state is reinforced by the pressed/raised tactile difference).

## Extending the design to new pages

Keep the token set + extrusion scale + hairline ring constant; adapt the layout shell. Any new surface is a raised cool-gray slab (card/column recipe at 12px radius, `--raise-sm`, with the ring) floating on the canvas with outer padding so shadows can cast.

- **Settings / account page:** raised app bar; a two-column shell (raised nav rail + raised content slab). Form fields are pressed-in wells (44px height, 10px radius, ring) on the content slab; the save bar is a raised footer with the inverted dark primary button.
- **Auth / login:** centered single raised card (12px radius, `--raise`) on the canvas; inputs as pressed-in wells; an inverted dark "Sign in" primary button. Add a secondary "Create account" text link.
- **Tables / data views:** a raised slab holds the table; rows separated by pressed grooves (no zebra stripes); sticky raised header row; filters reuse the segmented track + pressed-chip patterns.
- **Detail pages:** raised breadcrumb + title header; metadata as monochrome pressed label chips; related items as a horizontal scroll of cards reusing the board-card recipe.
- **Dashboards:** KPI tiles reuse the card recipe (raised slab + ring) — but avoid the SaaS "hero-metric" cliché; lead with a chart in a raised panel, not a giant number.

## Do / Don't

**Do**

- Make every raised or pressed surface the **same cool-gray color as the canvas**; derive depth only from paired light/dark extrusion shadows.
- Always layer the **1px darker inner hairline ring** onto columns, cards, and selected/raised controls — it is what keeps low-contrast relief legible.
- Express selection as a **pressed-in** state, not a colored fill.
- Keep shadows tinted (near-white light, dark cool-gray shade), never pure white/black; keep all colors OKLCH; tint neutrals toward hue 255.
- Give every interactive element the focus ring and ≥44px target; convey state in text/tactile difference, not color/shape alone.

**Don't**

- Don't use gradients, backdrop blur, translucency, glass, clay, flat-material elevation, or illustration treatments — this is the neumorphic direction.
- Don't use `#000`/`#fff` or gradient text.
- Don't use a colored side-stripe (`border-left > 1px`) as an accent — use a pressed chip, a dot, or a leading icon.
- Don't colorize label chips or give large surfaces a _persistent_ color fill; keep the board monochrome at rest and let whisper-chroma live only in the tiny semantic cues (dots, priority, done, error), each paired with text. (The documented _transient_ cool-cobalt hover tint on cards/secondary controls is the one allowed exception — decorative, non-persistent, never the sole state signal.)
- Don't remove the hairline ring to chase "purer" neumorphism — legibility over purity.
- Don't use a gradient shimmer for loading skeletons; use the opacity pulse on inset grooves.
- Don't animate layout properties (besides small `transform` lifts) or use bounce/elastic easing; don't ship motion without a reduced-motion fallback.

## When to use / avoid / trade-offs

- **Use** when the product wants a calm, tactile, modern soft-UI feel — distinctive without being loud; a good fit for focused productivity, wellness, and consumer surfaces where a gentle, premium texture is the brand.
- **Avoid** when the product needs maximum information density and razor-sharp boundary contrast (use flat/material), bold branding (use glass or illustration), or a dark theme (neumorphism depends on a mid-tone canvas for both shadows to read).
- **Trade-offs:** Neumorphism is the most contrast-fragile direction in the catalog. The cool-gray canvas must stay near L 0.9 so _both_ the light and dark shadows remain visible; ink must stay near L 0.26–0.37 for AA; and the hairline ring is load-bearing for legibility. It is inexpensive to render (no GPU effects, no assets) but unforgiving of token drift — small lightness changes collapse the relief. The monochrome labels and whisper-chroma semantics favor calm over scannability; if a team needs strong color-coded triage, prefer flat/material.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System UI font stack; icons are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Cool-gray canvas (`oklch(0.9 0.006 255)`) sits behind every surface; raised cards/columns/controls use the **same** surface color.
- [ ] Depth comes only from paired light/dark extrusion shadows (tinted near-white + dark cool-gray, no pure white/black) plus the hairline ring. No gradients, no `backdrop-filter`, no translucency, no glass/clay/flat-material/illustration treatments.
- [ ] A **1px darker inner hairline ring** (`inset 0 0 0 1px var(--hair)`, or `--hair-strong` on selected/raised controls) is layered onto every column, card, and selected/raised control.
- [ ] Selection/active state is a **pressed-in** well (`--press-sm` + `--ring-strong`), not a colored fill.
- [ ] All colors are OKLCH; neutrals tinted toward hue 255; no `#000`/`#fff`; no gradient text; no colored side-stripes; label chips and large surfaces are monochrome at rest (no persistent color fill); whisper-chroma lives only in stage dots/priority/done/error, each paired with text — except the single documented transient cool-cobalt hover tint on cards/secondary controls.
- [ ] Typography uses the system stack and the documented scale; hierarchy via scale + weight.
- [ ] Every interactive element has the focus ring — the dark accent outline on every control including the primary (whose ring seats against the surrounding surface at `outline-offset`, not against the dark fill) — is ≥44×44px at all viewports (every filter chip, Board/List segmented button, and every icon button including column "more actions" and error dismiss), and has a real role/label; avatars expose the full name; the search field shows a contrasting dark `:focus-within` ring with the input kept as the semantic focus target.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its cool-gray background; state is conveyed in text/tactile difference, not color/shape alone.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions are ≤0.16s ease and the skeleton opacity pulse is a 1.4s loop, both gated behind `prefers-reduced-motion: no-preference` (reduced-motion shows a fully static board); hover effects gated behind `(hover: hover)`; no layout-property animation (besides small `transform` lifts); no bounce/elastic.
- [ ] A restrained cool-cobalt hover tint (`--hover-tint`) is applied to cards and the secondary controls (inactive filter chips, inactive Board/List buttons, the column "more actions" icon button, "Add a card") as decorative feedback only — the shadow, hairline ring, focus ring, and pressed/selected semantics remain, so color is never the sole state signal; the primary and error actions are not recolored; AA-dark text still clears 4.5:1 on the tint; under `prefers-reduced-motion` the tint applies instantly with no fade.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state renders.
- [ ] Loading (skeleton with opacity pulse on inset grooves, gradient-free), error (raised pale-clay banner), drag affordance (grip), empty, done, priority, and pressed-selection states are all shown; the skeleton pulse respects `prefers-reduced-motion`.
