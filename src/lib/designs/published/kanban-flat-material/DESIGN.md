# Kanban Board · Flat Material

**Version** 1.0.0 · **Slug** `kanban-flat-material` · **Page type** data-management
**Visual intent:** a high-contrast Flat / Material Kanban board — solid color fields, crisp layered elevation, bold cobalt accents, and familiar app-like chrome. A deep cobalt app bar leads; a pale blue canvas holds solid near-white surfaces; depth comes purely from stacked 4dp/8dp-style shadows, never from blur, gradients, or translucency. Light theme, comfortable density.

> This is the catalog's **cleanest reference style**. Its board content is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): the same columns, cards, labels, members, due dates, and the empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity, team avatars, search, filters, view controls, primary action) over four columns of draggable-feeling cards: Backlog → In Progress → In Review → Done. The **In Review** column is empty, demonstrating the empty state; the other three hold realistic cards with a title, colored labels, an optional priority indicator, an optional checklist progress line, a due date, and assignee avatars.

## Design principles

1. **Solid, not translucent.** Every surface is a flat fill. Depth = stacked elevation shadows (1dp → 8dp), never blur or gradient. What you see is exactly the color written down.
2. **Cobalt leads.** Deep cobalt is the brand/primary color — it owns the app bar and every primary action (inverted to near-white on the bar itself). Accents elsewhere are disciplined semantic stage colors only.
3. **High contrast by construction.** Dark navy ink on near-white surfaces, and near-white on deep cobalt, give large AA headroom everywhere. Hierarchy is built from weight + scale + elevation, not low-contrast tints.
4. **Familiar chrome.** Real `<button>`/`<input>` controls, an app-like full-bleed top bar, segmented toggles, and chips — recognizable Material/Flat affordances, no custom widgets where native is clearer.

## Color system (OKLCH)

| Token             | Value                    | Role                                                        |
| ----------------- | ------------------------ | ----------------------------------------------------------- |
| `--canvas`        | `oklch(0.96 0.015 250)`  | Pale blue page background                                   |
| `--app-bar`       | `oklch(0.42 0.134 260)`  | Deep cobalt app bar                                         |
| `--app-bar-2`     | `oklch(0.47 0.124 260)`  | Raised cobalt surface (control fills on the bar, if needed) |
| `--surface`       | `oklch(0.985 0.004 250)` | Solid near-white cards, columns, inputs, chips-on-bar       |
| `--surface-2`     | `oklch(0.965 0.008 250)` | Tinted surface (count pills, hover, empty-state fill)       |
| `--ink`           | `oklch(0.28 0.03 260)`   | Dark navy primary text                                      |
| `--ink-soft`      | `oklch(0.45 0.025 260)`  | Meta: due dates, counts, checklist, empty-state copy        |
| `--ink-faint`     | `oklch(0.52 0.022 260)`  | Grip handle, decorative icons                               |
| `--primary`       | `oklch(0.45 0.144 260)`  | Cobalt primary action, active control text, focus accent    |
| `--primary-press` | `oklch(0.4 0.144 260)`   | Pressed primary                                             |
| `--on-bar`        | `oklch(0.99 0.004 250)`  | Near-white text/icons on cobalt (never `#fff`)              |
| `--hair`          | `oklch(0.9 0.01 250)`    | Hairline dividers on near-white surfaces                    |
| `--danger`        | `oklch(0.5 0.19 25)`     | Error icon/label/button text                                |
| `--danger-soft`   | `oklch(0.96 0.03 25)`    | Pale red error surface                                      |

- **Neutrals are tinted** toward hue 250 (a faint blue), never pure grey/black/white. `--on-bar` is a near-white, not `#fff`.
- **No gradients, no backdrop blur, no translucency** anywhere. Control fills on the bar are solid near-white (the standard Material "white field on colored toolbar" pattern), not frosted tints.
- **Semantic stage colors** mark columns only (a small solid dot per column header): Backlog slate `oklch(0.52 0.02 260)`, In Progress blue `oklch(0.52 0.14 255)`, In Review amber `oklch(0.62 0.14 65)`, Done green `oklch(0.54 0.12 152)`. They never become a colored side-stripe.
- **Label tones** are solid pale OKLCH tints with dark ink of the same hue (AA). Example pairs:

  | Tone   | Background              | Ink                   |
  | ------ | ----------------------- | --------------------- |
  | violet | `oklch(0.93 0.025 290)` | `oklch(0.4 0.08 290)` |
  | blue   | `oklch(0.93 0.028 250)` | `oklch(0.4 0.08 250)` |
  | green  | `oklch(0.93 0.03 150)`  | `oklch(0.4 0.08 150)` |
  | amber  | `oklch(0.93 0.04 70)`   | `oklch(0.42 0.08 70)` |
  | red    | `oklch(0.93 0.03 25)`   | `oklch(0.42 0.09 25)` |
  | cyan   | `oklch(0.93 0.025 220)` | `oklch(0.4 0.06 220)` |

  (Same pattern for teal, slate, indigo, pink, rose.) Ink near L 0.4–0.42 on a pale L≈0.93 tint is comfortably above 4.5:1.

- **Avatars:** near-white initials on `oklch(0.5 0.09 <hue>)` — a solid colored circle (chroma 0.09 for a readable but calm hue); the 0.5 lightness keeps near-white initials above 4.5:1. A crisp 2px ring (`box-shadow: 0 0 0 2px <background>`) separates overlapping avatars against whichever surface they sit on (cobalt bar or near-white card).

## Typography

- System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) — no external fonts, so the preview is self-contained and the handoff is framework-agnostic.
- Scale (rem): board title 1.2 / 700 · column heading 0.95 / 700 · card title 0.9 / 650 · meta 0.74–0.82 · labels 0.68. Hierarchy through scale + weight contrast; `font-synthesis: none`.
- Body/meta line length is bounded by the card width.

## Spacing, density, elevation, radii

- **Density:** comfortable. Card padding 0.75–0.85rem; column padding 0.85rem; app-bar padding 0.85rem + `clamp(1rem, 3vw, 1.5rem)` sides; board shell padding `clamp(1rem, 3vw, 1.5rem)`. Gaps vary for rhythm (cards 0.6rem, labels 0.3rem, footer meta 0.5rem).
- **Radii:** cards, columns, empty-state, error banner, add-card = **12px** (the signature radius); controls/inputs/chip containers = **8px**; pills, count badges, avatars = **999px**. Larger surfaces get the larger 12px radius.
- **Elevation (the only depth cue):** crisp layered shadows in navy `rgba(15,23,42,…)` (never pure black), approximating Material dp levels:
  - `--shadow-1`: `0 1px 2px rgba(15,23,42,.10), 0 1px 3px rgba(15,23,42,.08)` — resting cards, chips, inputs.
  - `--shadow-2`: `0 1px 3px rgba(15,23,42,.12), 0 2px 6px rgba(15,23,42,.08)` — columns, primary button.
  - `--shadow-4`: `0 2px 4px rgba(15,23,42,.10), 0 4px 8px rgba(15,23,42,.10)` — raised primary hover.
  - `--shadow-8`: `0 4px 8px rgba(15,23,42,.12), 0 8px 16px rgba(15,23,42,.10)` — hovered card.
  - `--bar-shadow`: `0 2px 6px rgba(15,23,42,.22), 0 1px 2px rgba(15,23,42,.28)` — app bar (heavier so it reads as the top chrome).
- **Borders:** 1px `--hair` on card foot dividers; 1px dashed navy-tinted (`oklch(0.78 0.02 260)`) on add-card/empty affordances. Surfaces otherwise rely on shadow, not borders.

## Layout and composition

- The board is a full-bleed solid cobalt app bar over a board shell. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The app bar wraps its controls onto further rows on narrow widths.
- Depth is layered by elevation, not nested fills: the cobalt bar sits highest (heaviest shadow); columns are 2dp; cards are 1dp resting and lift to 8dp on hover. Surfaces are always solid — never a panel-on-panel translucency.

## Components and behavior

- **App bar** (solid cobalt, full-bleed): project chip + title + subtitle + team-avatar group on the left; on the right a solid near-white search field, filter chips (All / Mine / Due this week), a Board/List segmented toggle, and an inverted near-white primary "New task" button. Wraps on narrow widths.
- **Column** (solid near-white, 12px radius, 2dp): a header row with a solid semantic stage dot, the column name (`<h2>`), a card-count pill, and a "more actions" icon button; a vertical list of cards; a dashed "Add a card" button; and an empty-state placeholder when the column has no cards.
- **Card** (solid near-white, 12px radius, 1dp): title (`<h3>`), label chips, an optional checklist progress line, and a footer with the priority indicator, due date, and assignee avatars. Hover lifts the card 2px to an 8dp shadow (reduced-motion: static).
- **Label chip:** solid pale OKLCH tint + dark ink (AA), one per concept; pill, ~0.68rem.
- **Avatar:** near-white initials on a solid colored OKLCH fill (hue per person) with a 2px ring; exposes the full name via `aria-label`. Two sizes: header 34px, card 28px.
- **Controls:** search input (solid near-white, 44px height, dark text), segmented toggle and filter chips (`aria-pressed`; inactive = near-white text on cobalt, active = solid near-white fill with cobalt text), primary button (inverted near-white with cobalt text, 44px), icon button (44px). Every control shows the focus ring.
- **Empty state:** a solid tinted placeholder with a dashed navy outline ("No cards yet") renders in any column with zero cards.

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the Flat/Material chrome: a solid cobalt top app bar (brand + search + primary action + avatar menu) over a solid near-white sidebar or column rail for board/account navigation. Never use a colored side-stripe as an accent — use a tinted chip, a dot, or a leading icon. Separate stacked surfaces with elevation shadow, never with translucency.

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is thin (`scrollbar-width: thin` for Firefox, `::-webkit-scrollbar` for WebKit).
- **Mobile/tablet (<768px):** columns stack vertically; the app-bar control rows wrap; no document-level horizontal overflow at 375/768/1280. Outer padding scales via `clamp`.
- Touch targets: every interactive control ≥44px (search, primary, chips, icon buttons, add-card). In-bar segmented buttons use a 38px tap height inside a 44px-tall group container; the group itself remains comfortably operable — raise to 44px if you drop the container padding.

## Interaction and motion

- Hover: card lifts 2px to an 8dp shadow; primary button lifts 1px to a 4dp shadow and settles on active. Active filter/view gets the solid near-white fill with cobalt text.
- All transitions are 0.16s ease and are **gated behind `@media (prefers-reduced-motion: no-preference)`** — reduced-motion users get a fully static board with no loss of function.
- Never animate CSS layout properties (other than the small `transform` lifts); never use bounce/elastic easing.

## States

The specimen demonstrates each state visually (functional drag-and-drop and network logic are out of scope — these are the visual treatments to reuse):

- **Empty (shown):** a column with no cards renders a dashed tinted placeholder ("No cards yet") — see the **In Review** column.
- **Loading (shown):** a **skeleton card** with solid placeholder bars (in Backlog). The skeleton uses an **opacity pulse** (not a gradient shimmer) so it stays gradient-free. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline **solid pale-red error banner** under the app bar — red warning icon + bold red label, a solid red Retry button, and a dismiss control (`role="status" aria-live="polite"`). No side-stripe.
- **Drag/move affordance (shown):** every card has a **grip handle** (faint by default, full on hover, `cursor: grab`). Full drag-and-drop logic is optional and not implemented; add actual DnD when wiring it for real, reusing the card + grip treatment.
- **Done (shown):** completed cards show a check icon and a green due-date treatment.
- **Priority (shown):** colored dot + capitalized word in the card footer (red/High, amber/Medium).
- **Validation:** when implementing real card-edit forms, reuse the red label + inline message pattern under each field.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; counts and icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced).
- **Visible focus:** `outline: 3px solid` with `outline-offset: 2px` on every interactive element — near-white on the cobalt bar, cobalt on near-white surfaces (verified live).
- **WCAG 2.2 AA** is met by construction: dark navy ink (L 0.28) on near-white surfaces (L ≈ 0.965–0.985) and near-white (L 0.99) on deep cobalt (L 0.42) both give large contrast margins. Label chips carry dark ink on pale tints; priority/done/error colors are all dark enough on near-white for AA. Meaning is never conveyed by color/shape alone (priority and status are always labelled in text).

## Extending the design to new pages

Keep the token set + elevation scale constant; adapt the layout shell. Any new surface is a solid near-white panel (card/column recipe at 12px radius) over the pale-blue canvas, with the same tokens, focus ring, and motion rules.

- **Settings / account page:** cobalt top bar; a solid two-column shell (nav rail + content). Form fields are solid near-white inputs (hairline-free, 44px height, 8px radius) on the near-white content panel; save bar is a solid near-white footer with the cobalt primary button (or an inverted white primary if the footer is cobalt).
- **Auth / login:** centered single solid near-white card (12px radius, 2dp) on the pale-blue canvas; inputs as above; cobalt "Sign in" primary button (inverted white if the card sits on a cobalt hero). Add a secondary "Create account" text link.
- **Tables / data views:** solid near-white panel holds the table; rows separated by `--hair` (no zebra stripes); sticky solid near-white header row with 1dp shadow; filters reuse the chip + segmented-control patterns.
- **Detail pages:** solid near-white breadcrumb + title header; metadata as labelled chips; related items as a horizontal scroll of cards reusing the board-card recipe.
- **Dashboards:** KPI tiles reuse the card recipe (solid fill, 1dp shadow) — but avoid the SaaS "hero-metric" cliché; lead with a chart in a solid panel, not a giant number.

## Do / Don't

**Do**

- Build depth only from the layered elevation scale (1dp → 8dp); keep shadows navy, not pure black.
- Keep the app bar solid cobalt and invert primary actions to near-white when they sit on it.
- Use solid near-white fields for inputs/controls on the colored bar (the standard white-field-on-toolbar pattern).
- Give every interactive element the focus ring and ≥44px target; convey state in text, not color/shape alone.
- Tint every neutral toward hue 250; keep all colors OKLCH.

**Don't**

- Don't use gradients, backdrop blur, translucency, glass, clay, or neumorphic shadows — this is the flat/elevation direction.
- Don't use `#000`/`#fff` or gradient text.
- Don't use a colored side-stripe (`border-left > 1px`) as an accent — use a tinted chip, a dot, or a leading icon.
- Don't use a gradient shimmer for loading skeletons; use the opacity pulse.
- Don't animate layout properties (besides small `transform` lifts) or use bounce/elastic easing; don't ship motion without a reduced-motion fallback.

## When to use / avoid / trade-offs

- **Use** when the product wants a clear, familiar, high-contrast, app-like surface that reads instantly on any device — the safest, most accessible reference direction, and a strong default for internal tools, productivity, and team-collaboration apps.
- **Avoid** when the brand demands a more expressive or decorative direction (glass, illustration, brutalism), or when the flat look reads as too utilitarian for a consumer-marketing surface.
- **Trade-offs:** Flat/Material is the lowest-risk, lowest-cost direction (no GPU effects, no custom assets, robust contrast), but its restraint can feel less distinctive. Elevation shadows are cheap to render, so performance is excellent; the cost is purely visual "personality" relative to more stylized directions.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System UI font stack; icons are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- License: inherits the source repository's license.

## Content baseline

`fixtures.ts` is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Pale-blue canvas (`oklch(0.96 0.015 250)`) sits behind every surface; a solid deep-cobalt app bar (`oklch(0.42 0.134 260)`) leads the chrome.
- [ ] All surfaces are solid fills; depth comes only from the layered 1dp/2dp/4dp/8dp elevation scale (navy shadows, no pure black). No gradients, no `backdrop-filter`, no translucency, no glass/clay/neumorphic shadows.
- [ ] Cards are solid near-white (12px radius, 1dp resting, 8dp on hover); columns are solid near-white (12px radius, 2dp); the app bar is solid cobalt with the heavier bar shadow.
- [ ] All colors are OKLCH; neutrals tinted toward hue 250; no `#000`/`#fff`; no gradient text; no colored side-stripes.
- [ ] Primary actions are cobalt; on the cobalt bar they invert to near-white with cobalt text.
- [ ] Typography uses the system stack and the documented scale; hierarchy via scale + weight.
- [ ] Every interactive element has the focus ring (near-white on cobalt, cobalt on surfaces), ≥44px target, and a real role/label; avatars expose the full name.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its solid background; state is conveyed in text, not color/shape alone.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] All motion is ≤0.16s ease, gated behind `prefers-reduced-motion: no-preference`; no layout-property animation (besides small `transform` lifts); no bounce/elastic.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state renders.
- [ ] Loading (skeleton with opacity pulse, gradient-free), error (inline pale-red banner), drag affordance (grip), empty, done, and priority states are all shown; the skeleton pulse respects `prefers-reduced-motion`.
