# Kanban Board · Luminous Putty

**Version** 1.0.0 · **Slug** `kanban-claymorphism` · **Page type** data-management
**Visual intent:** a **dark claymorphism** Kanban board on a deep tinted-indigo canvas with clearly puffy raised **pastel-clay** card faces and controls, paired inset highlight/shadow plus soft cast extrusion depth, and a restrained low-radius glow used only as a secondary material cue. Rounded putty masses, brighter opaque pastel faces, substantial soft extrusion, and tactile pressed selected states — unmistakably clay, not dark-neon/cyberpunk and not cool-gray neumorphism. Dark theme, comfortable density, WCAG 2.2 AA. System sans for UI text; monospace only for compact metrics/counts/dates.

> The board content is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): the same columns, cards, labels, members, due dates, and the empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity, team avatars, search, filters, view controls, primary action) over four columns of draggable-feeling cards: Backlog → In Progress → In Review → Done. The **In Review** column is empty, demonstrating the empty state; the other three hold realistic cards with a title, labels, an optional priority indicator, an optional checklist progress line, a due date, and assignee avatars.

## Design principles

1. **Bright opaque pastel faces on dark putty masses.** The claymorphic signature: cards and controls are clearly puffy raised shapes with opaque light pastel faces, floating on dark indigo structural surfaces (app bar, columns). Depth comes from paired inset highlight + inset shadow + outer cast extrusion, never from translucency or glass.
2. **Clay recipe is the depth language.** Every raised surface carries the same four-layer shadow: inset upper-left highlight (tinted near-white on pastel, soft violet on dark), inset lower-right shadow (tinted indigo), outer cast drop shadow, and a restrained low-radius glow. The glow is a secondary material cue, never the sole state signal.
3. **Selection = pressed in.** Active toggles and filters become inverted-inset wells — the clay squishes down — rather than colored fills. Tactile state is the interaction language.
4. **Legibility over purity.** Pastel card faces carry dark indigo ink (≥7:1); dark structural surfaces carry light pastel text (≥7:1). No pure black or white. Semantic text roles (priority labels, done dates, error text, primary action text) use **dedicated darker `-ink` variants** (L 0.36) that pass AA on pastel faces; bright decorative tokens (L 0.68–0.74) are reserved for dots and checkmarks. Monospace for metrics/dates/counts adds a tactile terminal accent.

## Color system (OKLCH)

| Token               | Value                   | Role                                                             |
| ------------------- | ----------------------- | ---------------------------------------------------------------- |
| `--canvas`          | `oklch(0.21 0.05 272)`  | Deep tinted-indigo page background                               |
| `--clay-dark`       | `oklch(0.27 0.05 275)`  | Dark indigo clay: columns                                        |
| `--bar-bg`          | `oklch(0.24 0.048 274)` | App bar dark clay (slightly deeper than columns)                 |
| `--surface`         | `oklch(0.84 0.028 285)` | Bright opaque pastel-clay card face (the luminous element)       |
| `--ink`             | `oklch(0.24 0.035 278)` | Dark indigo ink on pastel surfaces (≈7:1)                        |
| `--ink-soft`        | `oklch(0.38 0.035 278)` | Meta on pastel: due dates, checklist, labels (≈4.5:1+)           |
| `--ink-faint`       | `oklch(0.48 0.03 278)`  | Grip handle, decorative icons (non-text only)                    |
| `--ink-bright`      | `oklch(0.9 0.025 285)`  | Light pastel text on dark surfaces (≈10:1)                       |
| `--ink-bright-soft` | `oklch(0.7 0.035 285)`  | Meta on dark: column counts, subtitle (≈4.5:1+)                  |
| `--accent`          | `oklch(0.62 0.12 280)`  | Bright violet: focus ring on dark surfaces (≈4.7:1)              |
| `--accent-fill`     | `oklch(0.46 0.12 280)`  | Darker violet: primary button fill (>=4.5:1 for near-white text) |
| `--on-accent`       | `oklch(0.95 0.015 285)` | Near-white ink on accent fill (never `#fff`)                     |
| `--accent-soft`     | `oklch(0.42 0.07 280)`  | Darker violet for search inner-ring focus on pastel surfaces     |
| `--danger`          | `oklch(0.74 0.16 25)`   | Coral-red: error text/icon on dark surface (>=4.5:1)             |
| `--danger-soft`     | `oklch(0.3 0.06 25)`    | Dark coral error banner surface                                  |
| `--done`            | `oklch(0.72 0.14 152)`  | Bright green: decorative done checkmark/dot                      |
| `--done-ink`        | `oklch(0.36 0.1 152)`   | Dark green: done date text on pastel (>=4.5:1)                   |
| `--pri-high`        | `oklch(0.68 0.17 25)`   | Bright coral: decorative priority dot                            |
| `--pri-high-ink`    | `oklch(0.36 0.12 25)`   | Dark coral: high-priority text on pastel (>=4.5:1)               |
| `--pri-medium`      | `oklch(0.72 0.14 65)`   | Bright amber: decorative priority dot                            |
| `--pri-medium-ink`  | `oklch(0.36 0.1 65)`    | Dark amber: medium-priority text on pastel (>=4.5:1)             |

- **No pure black or white.** Neutrals are tinted toward indigo (hue 272–285). `--on-accent` is a near-white, not `#fff`. Shadow layers use tinted rgba (`rgba(250,245,255,…)` for highlights, `rgba(70,65,120,…)` for indigo shadows, `rgba(12,12,35,…)` for cast drops, `rgba(120,100,200,…)` for glow) — never pure `#000`/`#fff`.
- **No gradients, no backdrop blur, no translucency** anywhere. The only depth cues are the four-layer clay shadow.
- **Label chips** are pastel pills (L 0.74, slightly more saturated than the card face) with dark indigo text. Each tone has a distinct pastel hue, but meaning lives in the text. They carry a small clay shadow for tactile separation from the card face.
- **Avatars** are pastel-clay circles (`oklch(0.68 0.08 <hue>)`) with dark indigo initials — L 0.68 fill with L 0.24 ink gives ≈5:1. Each person gets a distinct hue via the fixture's `hue` field. A small clay shadow separates overlaps.
- **Stage dots** (one per column header) are pastel-colored dots on the dark header, paired with the column name: Backlog slate `oklch(0.62 0.03 275)`, In Progress blue `oklch(0.62 0.1 250)`, In Review amber `oklch(0.7 0.12 70)`, Done green `oklch(0.62 0.1 152)`.

## Typography

- **UI text:** system sans stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) — no external fonts.
- **Metrics/counts/dates:** monospace stack (`ui-monospace, 'SF Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace`) — applied only to column count badges, due dates, checklist progress numbers, and any compact numeric metric.
- Scale (rem): board title 1.2 / 700 · column heading 0.95 / 700 · card title 0.9 / 650 · meta 0.74–0.82 · labels 0.68 · mono metrics 0.72 / 600. Hierarchy through scale + weight contrast; `font-synthesis: none`.

## Spacing, density, elevation, radii

- **Density:** comfortable. Card padding 0.8–0.85rem; column padding 0.85rem; app-bar padding 0.9rem + `clamp(0.9rem, 2vw, 1.15rem)` sides; canvas padding `clamp(0.9rem, 3vw, 1.4rem)` (gives the puffy masses room to cast shadows). Gaps vary for rhythm (cards 0.6rem, labels 0.3rem, footer meta 0.5rem).
- **Radii:** cards, columns, empty-state, error banner, add-card, skeleton = **14px** (generous puffy radius); controls/inputs/chip tracks = **12px**; chips/buttons within tracks = **9px**; pills, count badges, avatars = **999px**.
- **Elevation = four-layer clay shadow** (the only depth cue besides the pastel/dark face contrast):
  - `--clay` (pastel raised, cards): `inset 0 0 0 1.5px rgba(110,100,170,.16), inset 2px 2px 5px rgba(250,245,255,.55), inset -2px -2px 5px rgba(70,65,120,.12), 0 6px 14px rgba(12,12,35,.38), 0 0 12px rgba(120,100,200,.06)` — resting cards.
  - `--clay-hover` (pastel raised, larger puff): deeper cast (`0 10px 22px`), brighter glow (`0 0 16px`), stronger inset highlights — hovered cards.
  - `--clay-sm` (pastel small): `inset 0 0 0 1px rgba(110,100,170,.12), inset 1px 1px 3px …, inset -1px -1px 3px …, 0 3px 8px rgba(12,12,35,.28), 0 0 8px rgba(120,100,200,.05)` — chips, controls, add-card, skeleton.
  - `--clay-pressed` (pastel inverted): `inset 0 0 0 1px …, inset 2px 2px 5px rgba(70,65,120,.18), inset -2px -2px 5px rgba(250,245,255,.35)` — selected chips, active toggle, skeleton groove.
  - `--clay-dark-raise` (dark raised): `inset 1.5px 1.5px 4px rgba(140,130,210,.12), inset -1.5px -1.5px 4px rgba(5,5,20,.4), 0 5px 12px rgba(8,8,25,.4), 0 0 10px rgba(100,80,200,.05)` — app bar, columns, error banner.
  - `--clay-dark-press` (dark pressed): `inset 2px 2px 5px rgba(5,5,20,.5), inset -2px -2px 5px rgba(140,130,210,.08)` — empty-state well, count badge, segmented track.
  - `--clay-accent` (violet primary): `inset 1.5px 1.5px 4px rgba(200,190,255,.3), inset -1.5px -1.5px 4px rgba(40,30,80,.3), 0 4px 10px rgba(8,8,25,.35), 0 0 10px rgba(120,100,200,.12)` — the single saturated fill.
- **Borders:** the card-foot separator is a 1px solid `rgba(110,100,170,.15)` top border — the only hard border; all other boundaries come from the clay shadow layers (inset ring within each recipe).

## Layout and composition

- The board floats on the deep indigo canvas: the canvas has outer padding, and the app bar (dark clay slab), error banner (dark clay slab), and each column (dark clay slab) cast their extrusion shadows into that padding. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The app bar wraps its controls onto further rows on narrow widths.
- **Bright pastel cards pop off dark columns:** the luminous quality comes from the high lightness contrast between the L 0.84 pastel card faces and the L 0.27 dark indigo column surfaces. Controls on the dark bar (search, filter chips, toggle, primary) are also pastel clay pills — bright tactile objects on the dark structural surface.
- Depth is layered by extrusion: the app bar and columns use `--clay-dark-raise`; cards use `--clay` (the largest puff); controls use `--clay-sm`. Selected controls press _in_ (`--clay-pressed`). The glow layer in each recipe is subtle (0.05–0.12 alpha) and never the sole state signal.

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the claymorphic chrome: a raised dark indigo app bar (brand chip + search + primary action + avatar menu) over a raised dark indigo sidebar rail for board/account navigation, all floating on the deep indigo canvas with outer padding so shadows can cast. Navigation items are raised pastel clay pills; the active item presses in. Never use a colored side-stripe — use a pressed pill, a stage dot, or a leading icon. Separate stacked surfaces with clay shadows, never with translucency or hard borders.

## Components and behavior

- **App bar** (dark clay slab, 14px radius, `--clay-dark-raise`): pastel project chip + title + subtitle (light text) + team-avatar group on the left; on the right a raised pastel search pill, a pressed dark segmented filter track holding raised pastel chips (All / Mine / Due this week), a pressed dark segmented Board/List track, and a violet "New task" primary clay pill. Wraps on narrow widths.
- **Column** (dark clay slab, 14px radius, `--clay-dark-raise`): a header row with a pastel stage dot, the column name (`<h2>`, light text), a pressed dark count badge (monospace), and a "more actions" pastel icon button; a vertical list of cards; a raised pastel "Add a card" button; and a pressed dark empty-state placeholder when the column has no cards.
- **Card** (bright pastel clay puff, 14px radius, `--clay`): title (`<h3>`, dark indigo), pastel label chips, an optional checklist progress line (monospace numbers), and a footer (top-border separator) with the priority indicator, due date (monospace), and assignee avatars. Hover deepens the extrusion shadow and lifts the card 2px (reduced-motion: static, shadow still changes instantly).
- **Label chip:** pastel pill (L 0.74, tone-specific hue) + dark indigo text + small clay shadow.
- **Avatar:** pastel-clay circle with dark indigo initials; exposes the full name via `aria-label`. Two sizes: header 34px, card 28px.
- **Controls:** search (raised pastel pill, 44px, dark text, inner-ring focus groove), segmented tracks (pressed dark wells holding raised pastel chips that press in when active, `aria-pressed`), primary (violet clay fill with near-white text, 44px), icon buttons (pastel clay, full 44×44px). Every header filter/view control is a full 44px tap.
- **Empty state:** a pressed dark well with a small inset square mark and "No cards yet" (light text) renders in any column with zero cards.
- **Loading skeleton:** a pressed-in pastel groove card holding placeholder bars with an opacity pulse (gradient-free).

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is thin (`scrollbar-width: thin` for Firefox, `::-webkit-scrollbar` for WebKit) with an indigo thumb.
- **Mobile/tablet (<768px):** columns stack vertically; the app-bar control rows wrap; no document-level horizontal overflow at 375/768/1280. Outer padding scales via `clamp`.
- Touch targets: **every interactive control is ≥44×44px at all viewports** — search field, primary, every filter chip, every Board/List segmented button, add-card, Retry, and every icon button (the column "more actions" button and the error dismiss button). There is no sub-44px target anywhere in the board.

## Interaction and motion

- Hover: the card lifts 2px and its extrusion shadow deepens (`--clay-hover`); the primary lifts 1px with a brighter glow; icon buttons and add-card darken their label. Active filter/view presses _into_ its track (`--clay-pressed` + slightly darker face). **Hover feedback is shadow + transform only** — no background face is ever recolored. Hovering a card or appropriate raised control (inactive chip, inactive Board/List button, more-actions icon, add-card, error-retry, project chip) swaps to `--clay-hover`, a clearly deeper cast shadow with brighter glow. **Selected/pressed controls and the primary are excluded** from the generic hover-swap so their semantic styles win. The glow change is always accompanied by the shadow change and (on hover) the transform lift — it is never the sole state signal. Text contrast is unaffected because no text-bearing background changes.
- Normal UI transitions (hover, focus, press, active-state shadow, glow) are **0.18s ease-out**, gated behind `@media (prefers-reduced-motion: no-preference)`. Hover-only effects are additionally gated behind `@media (hover: hover)` so touch devices don't get sticky hover states. Under `prefers-reduced-motion` the shadow still applies (a shadow change is not motion) but **instantly**, with no fade or transform.
- The loading skeleton's opacity pulse is a separate, slower **1.6s ease-in-out** loop, also gated behind `prefers-reduced-motion: no-preference`. It is the only repeating motion and has no reduced-motion counterpart by design (reduced-motion shows static skeleton grooves).
- In both cases, reduced-motion users get a fully static board with no loss of function.
- Never animate CSS layout properties (other than the small `transform` lifts); never use bounce/elastic easing. All motion is 150–250ms ease-out.

## States

The states below are **visual state/affordance demonstrations only**, not functional behavior. The **filter chips and the Board/List segmented toggle are `aria-pressed` toggle controls** — they reflect selection state in the specimen but perform no real filtering or view switch. **Search, the New task primary, the column "More actions" overflow, the "Add a card" drop zone, Retry, and dismiss all render their affordance but perform no real search, creation, menu, sync, or dismissal** — they are inert specimen controls that exist only to demonstrate their visual treatment. The **drag grip is a static affordance** with no drag-and-drop logic. Reuse these visual treatments when wiring real behavior:

- **Empty (shown):** a column with no cards renders a pressed dark well ("No cards yet") — see the **In Review** column.
- **Loading (shown):** a **skeleton card** with pressed-in pastel grooves (in Backlog). The skeleton uses an **opacity pulse** (not a gradient shimmer) so it stays gradient-free. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline **raised dark-coral error banner** under the app bar — coral warning icon + bold coral label, a raised pastel Retry button with dark text, and a pastel dismiss control (`role="status" aria-live="polite"`). No side-stripe.
- **Drag/move affordance (shown, static):** every card has a **grip handle** (faint by default, full on hover, `cursor: grab`) as a visual affordance only — no drag-and-drop logic is implemented.
- **Done (shown):** completed cards show a check icon and a green due-date treatment.
- **Priority (shown):** dot + capitalized word in the card footer (coral/High, amber/Medium).
- **Selection (shown):** the active filter chip and active Board/List option are **pressed in** — the claymorphic "selected = pressed" pattern, with a slightly darker face.
- **Validation:** when implementing real card-edit forms, reuse the coral error-ink + inline message pattern under each field inside a pressed-in pastel well.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; count badges expose "N cards" via visually hidden unit text (not `aria-label` on a non-interactive span); icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced).
- **Visible focus:** the default focus ring is `outline: 3px solid var(--accent)` (bright violet, L 0.62) with `outline-offset: 2px` — it contrasts ≥3:1 (≈4.7:1) against the dark indigo surfaces (app bar, columns, error banner) where every button sits. The primary inherits this ring; at `outline-offset: 2px` it seats outside the violet fill, against the dark app-bar surface, where the bright-violet ring reads at ≈4.7:1. The search field uses a contrasting **dark-violet inner-ring groove** (`outline: 3px solid var(--accent-soft)` at `outline-offset: -3px`) drawn inside the pastel surface, so the ring is visible regardless of the surrounding dark bar — the inner groove reads at ≈3.4:1 against the pastel face; the `<input>` remains the semantic focus target, with its own redundant outline suppressed.
- **WCAG 2.2 AA** is met by construction: dark indigo ink (L 0.24) on the pastel surface (L 0.84) gives ≈7:1; light pastel text (L 0.9) on dark clay (L 0.24) gives ≈10:1; meta inks (L 0.38 on pastel, L 0.7 on dark) give ≥4.5:1; avatar initials (L 0.24) on pastel fills (L 0.68) give ≈5:1; primary text (L 0.95 near-white on L 0.46 accent-fill) gives ≈5:1; error text (L 0.74 coral on L 0.3 dark-coral) gives ≈4.7:1; done/priority text uses dedicated darker `-ink` variants (L 0.36 on L 0.84 pastel, ≈5:1) — bright decorative tokens (L 0.68–0.74) appear only on non-text indicators (dots, checkmarks). Meaning is never conveyed by color/shape alone (priority and status are always labelled in text, and state is reinforced by the pressed/raised tactile difference).

## Extending the design to new pages

Keep the token set + clay shadow scale constant; adapt the layout shell. Any new surface is either a raised dark indigo clay slab (structural) or a raised pastel clay puff (content), floating on the canvas with outer padding so shadows can cast.

- **Settings / account page:** raised dark app bar; a two-column shell (raised dark nav rail + raised dark content slab). Form fields are raised pastel wells (44px height, 12px radius, clay-sm) on the dark content slab; the save bar is a raised dark footer with the violet primary.
- **Auth / login:** centered single raised pastel card (14px radius, `--clay`) on the dark canvas; inputs as raised pastel wells; a violet "Sign in" primary clay pill. Add a secondary "Create account" text link in light pastel text.
- **Tables / data views:** a raised dark slab holds the table; rows separated by subtle top borders (1px indigo); sticky raised dark header row; filters reuse the segmented track + pastel chip patterns. Monospace for numeric columns.
- **Detail pages:** raised dark breadcrumb + title header (light text); metadata as pastel label chips; related items as a horizontal scroll of pastel cards reusing the board-card recipe.
- **Dashboards:** KPI tiles reuse the pastel card recipe (`--clay`) on a dark dashboard shell — but avoid the SaaS "hero-metric" cliché; lead with a chart in a raised dark panel, not a giant number. Use monospace for metrics.

## Do / Don't

**Do**

- Make cards and controls clearly **puffy raised pastel-clay shapes** with opaque bright faces (L 0.84) on dark indigo structural surfaces (L 0.24–0.27). The luminous quality comes from this contrast.
- Use the **four-layer clay shadow** (inset highlight + inset shadow + cast drop + restrained glow) as the sole depth language. Keep glow subtle (0.05–0.12 alpha) — it is a secondary material cue, never the primary state signal.
- Express selection as a **pressed-in** state (inverted inset shadows), not a colored fill.
- Keep shadows tinted (near-white highlight, indigo shade, indigo cast, violet glow), never pure black/white; keep all named colors OKLCH; tint neutrals toward indigo.
- Give every interactive element the focus ring and ≥44px target; convey state in text/tactile difference, not color/shape alone.
- Use monospace only for compact metrics/counts/dates; system sans for all UI text.

**Don't**

- Don't use gradients, backdrop blur, translucency, glass, neumorphic monochrome surfaces, flat-material elevation, dark-neon glow, or illustration treatments — this is the claymorphic direction.
- Don't use `#000`/`#fff` or gradient text.
- Don't use a colored side-stripe (`border-left > 1px`) as an accent — use a pressed chip, a stage dot, or a leading icon.
- Don't make glow the sole state signal — every glow change must be accompanied by a shadow change, transform lift, or tactile state difference.
- Don't use a gradient shimmer for loading skeletons; use the opacity pulse on pressed-in grooves.
- Don't animate layout properties (besides small `transform` lifts) or use bounce/elastic easing; don't ship motion without a reduced-motion fallback.
- Don't use external fonts or binary assets — system sans + system monospace only.

## When to use / avoid / trade-offs

- **Use** when the product wants a warm, tactile, playful-but-premium feel — distinctive dark claymorphism that stands out from flat/material or glass styles. A good fit for creative tools, consumer apps, and surfaces where a delightful tactile texture is the brand. The dark indigo canvas with bright pastel faces is visually striking and emotionally engaging.
- **Avoid** when the product needs maximum information density and razor-sharp boundary contrast (use flat/material), a light theme (claymorphism's candy-pastel look depends on the dark canvas for contrast), or strict enterprise neutrality (the puffy aesthetic may read as too playful for compliance-heavy contexts).
- **Trade-offs:** Claymorphism is the most shadow-layer-intensive direction in the catalog — the four-layer recipe (inset highlight + inset shadow + cast + glow) costs more rendering than flat or neumorphic shadows. The dark theme requires careful text-color discipline: dark indigo ink on pastel faces (not light text on pastel, which would fail AA), and light pastel text on dark surfaces (not dark text on dark). The pastel card faces (L 0.84) are the brightest elements in the system — any color placed on them must be dark enough for AA. The glow is intentionally subtle; making it brighter risks drifting toward dark-neon/cyberpunk, which is a separate catalog direction.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System sans + system monospace font stacks; icons are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Deep tinted-indigo canvas (`oklch(0.21 0.05 272)`) sits behind every dark structural surface; bright opaque pastel-clay card faces (`oklch(0.84 0.028 285)`) are never recolored on hover (hover feedback is shadow + transform only — no background change anywhere).
- [ ] Depth comes only from the four-layer clay shadow (inset highlight + inset shadow + cast drop + restrained glow, all tinted); no gradients, no `backdrop-filter`, no translucency, no glass/neumorphic/flat-material/dark-neon/illustration treatments.
- [ ] Glow is subtle (0.05–0.12 alpha) and never the sole state signal — every glow change is accompanied by a shadow change, transform lift, or tactile state difference.
- [ ] Selection/active state is a **pressed-in** well (`--clay-pressed`, inverted insets), not a colored fill.
- [ ] All colors are OKLCH; neutrals tinted toward indigo (hue 272–285); no `#000`/`#fff`; no gradient text; no colored side-stripes; shadow layers use tinted rgba (never pure black/white).
- [ ] Typography uses system sans for UI text and system monospace only for compact metrics/counts/dates; hierarchy via scale + weight.
- [ ] Every interactive element has the focus ring — the bright-violet outline (L 0.62) on every button control including the primary (whose ring seats against the dark surrounding surface at `outline-offset`), and the dark-violet inner-ring groove on the search (at `outline-offset: -3px` on the pastel face) — is ≥44×44px at all viewports (every filter chip, Board/List segmented button, and every icon button including column "more actions" and error dismiss), and has a real role/label; avatars expose the full name.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its actual opaque background: dark indigo ink on pastel faces, light pastel text on dark surfaces, primary text (near-white on accent-fill), error text (coral on dark-coral), and priority/done date text using dedicated darker `-ink` variants (L 0.36, not the bright decorative dot tokens); state is conveyed in text/tactile difference, not color/shape alone.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions are 0.18s ease-out and the skeleton opacity pulse is a 1.6s loop, both gated behind `prefers-reduced-motion: no-preference` (reduced-motion shows a fully static board with shadows applied instantly); hover effects gated behind `(hover: hover)`; no layout-property animation (besides small `transform` lifts); no bounce/elastic.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state renders.
- [ ] Loading (skeleton with opacity pulse on pressed-in pastel grooves, gradient-free), error (raised dark-coral banner), drag affordance (grip), empty, done, priority, and pressed-selection states are all shown; the skeleton pulse respects `prefers-reduced-motion`.
