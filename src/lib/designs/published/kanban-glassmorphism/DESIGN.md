# Kanban Board · Glassmorphism

**Version** 1.0.0 · **Slug** `kanban-glassmorphism` · **Page type** data-management
**Visual intent:** a frosted, translucent Kanban board floating over a vibrant gradient mesh — depth from layered backdrop blur, hairline-light borders, and soft glow, never from heavy solid fills. Light theme, comfortable density.

> This is the catalog's **first published design**, so its board content (`fixtures.ts`) is the **locked shared Kanban baseline** that the other nine styles re-skin: the same columns, cards, labels, members, due dates, and the empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity, team avatars, search, filters, view controls, primary action) over four columns of draggable-feeling cards: Backlog → In Progress → In Review → Done. The **In Review** column is empty, demonstrating the empty state; the other three hold realistic cards with a title, colored labels, an optional priority indicator, an optional checklist progress line, a due date, and assignee avatars.

## Design principles

1. **Translucent, not solid.** Panels are frosted white over color; the gradient is always partly visible. Depth = blur + hairline edge + soft shadow.
2. **Color does the work behind glass.** The vibrant field provides energy; the UI on top stays restrained and high-contrast.
3. **Legibility beats effect.** Where blur or translucency would hurt readability or AA contrast, opacity goes up and the effect yields. The `@supports` fallback and the opaque-enough tints exist for this reason.
4. **Purposeful glass.** Glassmorphism is the subject, so it is used boldly and consistently — not as a decorative accent on an otherwise flat UI.

## Color system (OKLCH)

| Token             | Value                   | Role                                                           |
| ----------------- | ----------------------- | -------------------------------------------------------------- |
| `--ink`           | `oklch(0.26 0.035 285)` | Card titles, primary text                                      |
| `--ink-soft`      | `oklch(0.42 0.03 285)`  | Meta: due dates, counts, subtitles, checklist                  |
| `--ink-faint`     | `oklch(0.46 0.03 285)`  | Placeholder text, empty-state copy                             |
| `--accent-strong` | `oklch(0.5 0.17 285)`   | Active filter, focus ring, primary button                      |
| `--on-accent`     | `oklch(0.99 0.004 285)` | Text/borders on accent fills (tinted near-white, never `#fff`) |
| `--hair`          | `rgba(255,255,255,0.6)` | Hairline glass edges                                           |

- **Neutrals are tinted** toward hue 285 (a faint violet), never pure grey/black/white. `--on-accent` is a near-white, not `#fff`.
- **Accent gradients** (project chip, primary button): `linear-gradient(135deg, oklch(0.54 0.18 292), oklch(0.54 0.17 340))` with a soft colored glow.
- **Label tones** are paired as a light frosted tint + dark ink so contrast survives on glass. Example pairs:

  | Tone   | Background             | Ink       |
  | ------ | ---------------------- | --------- |
  | violet | `rgba(124,92,255,.16)` | `#3a2a92` |
  | blue   | `rgba(56,120,240,.16)` | `#1f4fb0` |
  | green  | `rgba(34,160,90,.16)`  | `#14592f` |
  | amber  | `rgba(200,140,20,.18)` | `#75510a` |
  | red    | `rgba(210,55,55,.16)`  | `#8a2424` |
  | cyan   | `rgba(20,160,200,.16)` | `#0f5266` |

  (Same tint+dark-ink pattern for teal, slate, indigo, pink, rose.) Ink colors sit near L 0.3–0.4 on a near-white tint — comfortably above 4.5:1.

- **Avatars:** white initials on `oklch(0.46 0.13 <hue>)`. The 0.46 lightness keeps white initials above 4.5:1 while still reading as a friendly mid color. A 2px `--on-accent` rim separates overlapping avatars.

## Typography

- System UI stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) — no external fonts, so the preview is self-contained and the handoff is framework-agnostic.
- Scale (rem): board title 1.15 / 750 · column heading 0.92 / 700 · card title 0.88 / 620 · meta 0.72–0.78 · labels 0.66. Hierarchy through scale + weight contrast; `font-synthesis: none`.
- Body/meta line length is bounded by the card width (≈ comfortable for the short strings on a board).

## Spacing, density, elevation, radii

- **Density:** comfortable. Card padding 0.7–0.8rem; column padding 0.85rem; header padding 0.85rem 1.1rem; board outer padding `clamp(1rem, 2.5vw, 2rem)`. Gaps vary for rhythm (cards 0.6rem, labels 0.3rem, footer meta 0.5rem).
- **Radii:** header 22px · columns 20px · cards 14px · controls 9–12px · chips/avatars 999px. Larger surfaces get larger radii.
- **Elevation (shadows, the only "border" that reads on glass):** panels `0 8px 32px rgba(31,38,135,.18)` · cards `0 4px 14px rgba(31,38,135,.12)` · hover lifts the card to `0 10px 22px rgba(31,38,135,.22)`.
- **Borders:** 1px `--hair` (rgba white 0.6) on glass edges; dashed rgba-white 0.7 on the add-card/empty affordances.

## The glass recipe (core technique)

```css
.panel {
	background: rgba(255, 255, 255, 0.55);
	border: 1px solid rgba(255, 255, 255, 0.6);
	border-radius: 20px;
	box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);
	-webkit-backdrop-filter: blur(18px) saturate(180%);
	backdrop-filter: blur(18px) saturate(180%);
}

/* Backdrop-filter is not universal — always pair with an opaque fallback. */
@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
	.panel {
		background: rgba(255, 255, 255, 0.88);
	}
}
```

- **White at ~0.55 alpha** keeps panels readable while letting the gradient through.
- **`saturate(180%)`** cancels the desaturation blur introduces.
- **Cards are a lighter frosted layer:** `blur(6px) saturate(150%)` (vs the columns' 18px) so cards read as thinner, closer glass above the columns — a deliberate z-depth layering (board → columns → cards). White 0.62 fill + hairline border + soft shadow.
- **Do not use `background-attachment: fixed` with `backdrop-filter`** — it repaint-glitches on Safari/iOS. The gradient scrolls with the page.

### The vibrant field

A mesh of soft radial blobs over a diagonal base, painted on the board root:

```css
background:
	radial-gradient(at 16% 20%, oklch(0.7 0.2 290) 0px, transparent 55%),
	radial-gradient(at 84% 12%, oklch(0.78 0.18 350) 0px, transparent 52%),
	radial-gradient(at 78% 80%, oklch(0.74 0.16 230) 0px, transparent 55%),
	radial-gradient(at 22% 86%, oklch(0.78 0.15 165) 0px, transparent 52%),
	linear-gradient(135deg, oklch(0.62 0.17 275), oklch(0.66 0.16 320) 48%, oklch(0.72 0.16 355));
```

The base `linear-gradient` holds minimum luminance high (L ≥ 0.62) so dark ink never lands on a dark region — this is what lets dark text pass AA even before the glass is drawn.

## Layout and composition

- The board is a header bar over a body of columns. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The header wraps its controls onto a second row on narrow widths.
- Z-depth is layered: the vibrant field sits at the back; frosted glass columns (`blur(18px)`) float above it; frosted cards (`blur(6px)`) float above the columns. Each layer is separated by its shadow, hairline border, and opacity, never by nested solid fills.

## Components and behavior

- **Board header** (glass, 22px radius): project chip + title + subtitle + team-avatar group on the left; on the right a search field, filter chips (All / Mine / Due this week), a Board/List segmented toggle, and a primary “New task” button. Wraps on narrow widths.
- **Column** (glass, 20px radius): a header row with a colored accent dot, the column name (`<h2>`), a card-count pill, and a “more actions” icon button; a vertical list of cards; a dashed “Add a card” button; and an empty-state placeholder when the column has no cards.
- **Card** (frosted glass, 14px radius, `blur(6px)`): title (`<h3>`), label chips, an optional checklist progress line, and a footer with the priority indicator, due date, and assignee avatars. Hover lifts the card 2px with a deeper shadow (reduced-motion: static).
- **Label chip:** light frosted tint + dark ink (AA), one per concept; pill, ~0.66rem.
- **Avatar:** initials on a dark-tinted OKLCH fill (hue per person) with a 2px rim; exposes the full name via `aria-label`. Two sizes: header 34px, card 26px.
- **Controls:** search input (translucent fill, 44px min-height), segmented toggle and filter chips (`aria-pressed`, 44px), primary button (accent gradient, 44px), icon button (44px). Every control shows the accent focus ring.
- **Empty state:** a dashed frosted placeholder (“No cards yet”) renders in any column with zero cards.

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the glass chrome: a glass top bar (brand + search + primary action + avatar menu) over a glass sidebar or column rail for board/account navigation. Never put a glass panel directly on a glass panel without a clear shadow or border separation.

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is thin and frosted (`scrollbar-width: thin` for Firefox, `::-webkit-scrollbar` for WebKit).
- **Mobile/tablet (<768px):** columns stack vertically; no document-level horizontal overflow at 375/768/1280 (verified). Outer padding scales via `clamp`.
- Touch targets: every interactive control ≥44px (search, primary, chips, icon buttons, add-card).

## Interaction and motion

- Hover: card lifts 2px with a deeper shadow; primary button lifts 1px. Active filter/view gets the accent fill.
- All transitions are 0.18s ease and are **gated behind `@media (prefers-reduced-motion: no-preference)`** — reduced-motion users get a fully static board with no loss of function.
- Never animate CSS layout properties; never use bounce/elastic easing.

## States

The specimen demonstrates each state visually (functional drag-and-drop and network logic are out of scope — these are the visual treatments to reuse):

- **Empty (shown):** a column with no cards renders a dashed frosted placeholder (“No cards yet”) — see the **In Review** column.
- **Loading (shown):** a frosted **skeleton card** with shimmering placeholder bars (in Backlog) represents a card still loading. The shimmer animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline **glass error banner** under the header — red-tinted warning icon + bold label, a Retry button, and a dismiss control (`role="alert"`).
- **Drag/move affordance (shown):** every card has a **grip handle** (faint by default, full on hover). Full drag-and-drop logic is optional and not implemented; add `cursor: grab` + actual DnD when wiring it for real, reusing the card + grip treatment.
- **Done (shown):** completed cards show a check icon and a green due-date treatment.
- **Priority (shown):** colored dot + capitalized word in the card footer (red/High, amber/Medium).
- **Validation:** when implementing real card-edit forms, reuse the red-tinted label + inline message pattern under each field.

## Accessibility

- Landmarks: `<header>` (banner) + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; counts and icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced).
- **Visible focus:** `outline: 2px solid var(--accent-strong); outline-offset: 2px;` on every interactive element (verified live).
- **WCAG 2.2 AA** is met by construction: dark ink over high-opacity frosted white, light-tint label chips with dark ink, white-on-accent only where the accent is dark enough. Independent real-pixel audit confirmed every text role ≥ 4.5:1.
- Meaning is never conveyed by color/shape alone (priority and status are always labelled in text).

## Extending the design to new pages

Keep the gradient field + glass recipe constant; adapt the layout shell.

- **Settings / account page:** glass top bar; a glass two-column shell (nav rail + content). Form fields are translucent inputs (rgba white 0.4 fill, hairline border, 44px min-height) on the glass content panel; save bar is a glass footer with the primary button.
- **Auth / login:** centered single glass card (radius 22, white 0.55, blur 18) on the vibrant field; inputs as above; primary "Sign in" button. Add a secondary "Create account" text link.
- **Tables / data views:** glass panel holds the table; rows separated by `rgba(255,255,255,0.5)` hairlines (no zebra stripes); sticky glass header row; filters reuse the chip + segmented-control patterns.
- **Detail pages:** glass breadcrumb + title header; metadata as labelled chips; related items as a horizontal scroll of cards reusing the board-card recipe.
- **Dashboards:** glass KPI tiles reuse the card recipe (translucent fill, hairline border, soft shadow) — but avoid the SaaS "hero-metric" cliché; lead with a chart in a glass panel, not a giant number.

Rule of thumb: any new surface is a glass panel (header/column/card recipe at an appropriate radius) over the same gradient field, with the same tokens, focus ring, and motion rules.

## Do / Don't

**Do**

- Pair every `backdrop-filter` with the `@supports` opaque fallback.
- Keep glass on the vibrant field; let the gradient show through at ~0.55 white.
- Use dark tinted ink on frosted surfaces; tint every neutral toward hue 285.
- Give every interactive element the accent focus ring and ≥44px target.
- Convey state (priority, done, empty) in text, not color/shape alone.

**Don't**

- Don't blur a surface that sits on a sharp, detailed surface expecting a frosted result — backdrop-filter only blurs what's behind the element, so ensure there is actually varied content or a gradient behind the glass.
- Don't use `background-attachment: fixed` with `backdrop-filter` (Safari/iOS glitch).
- Don't put glass directly on glass without a shadow or border to separate them.
- Don't use a colored side-stripe (`border-left > 1px`) as an accent — use a tinted chip, a dot, or a leading icon.
- Don't animate layout properties or use bounce/elastic easing; don't ship motion without a reduced-motion fallback.
- Don't use `#000`/`#fff` or gradient text.

## When to use / avoid / trade-offs

- **Use** when the product wants an expressive, modern, visually rich surface and the target devices can afford `backdrop-filter` (modern evergreen browsers).
- **Avoid** for data-dense, performance-critical, or primarily-text surfaces (observability, long tables, reading apps), or when supporting older browsers without `backdrop-filter` where the opaque fallback would erase the effect.
- **Trade-offs:** glassmorphism is GPU-heavier than flat UI (`backdrop-filter` blurs the header, columns, and every card), and contrast depends on the field behind the glass, so ink/tints must be tuned conservatively. The expressive look costs performance and contrast headroom; acceptable for a showcase specimen, worth bounding (fewer/smaller blur layers) in a high-traffic app.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System UI font stack; icons are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- License: inherits the source repository's license.

## Content baseline

`fixtures.ts` is the locked shared Kanban baseline: 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. Later styles copy this file and re-skin only the visuals.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Vibrant gradient field is present behind every surface; minimum luminance stays high (no dark holes under text).
- [ ] Panels use the glass recipe (rgba white ~0.55, `backdrop-filter: blur(18px) saturate(180%)`, hairline border, soft shadow) **with** the `@supports` opaque fallback.
- [ ] Cards are a lighter frosted layer (`blur(6px)`) above the columns, giving layered z-depth (board → columns → cards); the `@supports` opaque fallback covers them too.
- [ ] All colors are OKLCH; neutrals tinted toward hue 285; no `#000`/`#fff`; no gradient text; no colored side-stripes.
- [ ] Typography uses the system stack and the documented scale; hierarchy via scale + weight.
- [ ] Every interactive element has the accent focus ring, ≥44px target, and a real role/label; avatars expose the full name.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its rendered frosted background; state is conveyed in text, not color/shape alone.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] All motion is ≤0.18s ease, gated behind `prefers-reduced-motion: no-preference`; no layout-property animation; no bounce/elastic.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state renders.
- [ ] Loading (skeleton), error (inline banner), drag affordance (grip), empty, done, and priority states are all shown; the skeleton shimmer respects `prefers-reduced-motion`.
