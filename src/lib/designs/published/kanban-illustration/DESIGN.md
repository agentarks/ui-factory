# Kanban Board · Mid-Century Poster

**Version** 1.0.0 · **Slug** `kanban-illustration` · **Page type** data-management
**Visual intent:** a warm, hand-cut poster Kanban — parchment canvas, espresso ink, a disciplined mustard/teal/coral palette, and geometric cut-paper shapes (starbursts, concentric circles, hard-edged offset shadows). Serif headings and card titles over system-sans controls and meta. Light theme, spacious density. Illustration is concentrated in the composition (header watermark, project mark) and state treatments (empty, error, skeleton, drag grip); cards themselves stay clean and rectangular.

> Re-skins the catalog's locked shared Kanban baseline (columns, cards, labels, members, due dates, and the empty-column state) defined by `kanban-glassmorphism/fixtures.ts`. Only the visual language changes.

## Canonical page reference

A Kanban board for a small product team: a board header (project identity with starburst mark, team avatars, search, filters, view controls, primary action) over four columns of draggable-feeling cards: Backlog → In Progress → In Review → Done. The **In Review** column is empty, demonstrating the empty state; the other three hold realistic cards with a title, colored labels, an optional priority indicator, an optional checklist progress line, a due date, and assignee avatars.

## Design principles

1. **Print, not screen.** Surfaces are flat fills with hard-edged 2px espresso outlines and crisp offset shadows (`Npx Npx 0`). No blur, no glass, no soft elevation — the page reads like a screen-printed poster.
2. **Disciplined palette.** Three signature hues — mustard, teal, coral — carry meaning (primary action, completion, urgency). Everything else is warm parchment and espresso. Categorical label chips stay low-chroma so the signature palette keeps its punch.
3. **Two type roles, one voice.** Serif for editorial weight (board title, column headings, card titles, error label); system-sans for controls, meta, and data. The pairing is the personality — never mix a third family.
4. **Illustration concentrated, not scattered.** Geometric marks (starbursts, concentric circles) appear in the header composition and in state treatments (empty, error, skeleton, grip). Cards stay clean — they are the working surface, not a canvas for decoration.

## Color system (OKLCH)

| Token              | Value                  | Role                                                                |
| ------------------ | ---------------------- | ------------------------------------------------------------------- |
| `--parchment`      | `oklch(0.94 0.028 80)` | Page canvas: warm cream. Never `#fff`.                              |
| `--parchment-deep` | `oklch(0.9 0.035 75)`  | Canvas edge wash, hover surfaces, skeleton base                     |
| `--surface`        | `oklch(0.97 0.018 80)` | Header and column background                                        |
| `--card`           | `oklch(0.99 0.008 80)` | Card and control background — near-white cream, still not `#fff`    |
| `--ink`            | `oklch(0.28 0.035 50)` | Espresso: primary text, all 2px outlines. Never `#000`.             |
| `--ink-soft`       | `oklch(0.42 0.032 50)` | Meta: due dates, subtitles, checklist                               |
| `--ink-faint`      | `oklch(0.46 0.03 60)`  | Placeholder, empty-state copy, drag grip                            |
| `--rule`           | `oklch(0.82 0.025 70)` | Card footer divider, skeleton border                                |
| `--rule-strong`    | `oklch(0.7 0.035 65)`  | Card outline + offset shadow (so cards read against parchment)      |
| `--mustard`        | `oklch(0.62 0.14 75)`  | Decorative dots, watermark, medium-priority dot                     |
| `--mustard-deep`   | `oklch(0.45 0.12 62)`  | Primary action fill, active filter, focus ring — AA on cream text   |
| `--teal`           | `oklch(0.5 0.09 195)`  | Secondary accent, In-Progress column                                |
| `--teal-deep`      | `oklch(0.38 0.07 195)` | Done check, due-date-on-done (AA on parchment)                      |
| `--coral`          | `oklch(0.55 0.14 35)`  | Tertiary decorative, error banner border                            |
| `--coral-deep`     | `oklch(0.45 0.15 28)`  | High-priority ink, error icon/label (AA on parchment)               |
| `--on-accent`      | `oklch(0.97 0.018 80)` | Cream text on deep accents (mustard-deep / coral-deep). Not `#fff`. |

- **Neutrals are warm** — hue 50–80 (espresso to khaki). There is no pure grey, pure black, or pure white anywhere.
- **Signature fills with cream text:** `--mustard-deep` (L 0.45) and `--coral-deep` (L 0.45) each carry `--on-accent` (L 0.97) at ≥4.5:1.
- **Avatars** use `oklch(0.42 0.08 <hue>)` with cream initials — the 0.42 lightness holds AA for white initials, and chroma is muted (0.08) so the team reads as a calm set, not a bag of Skittles. A 2px espresso rim + offset shadow separates overlapping avatars and ties them to the outline language.
- **Label tones** (11): a very pale warm OKLCH tint + dark espresso ink of the same hue. Same pattern as the rest of the catalog (L≈0.92 background, L≈0.36 ink) so chips read calm and AA-safe against the card surface:

  | Tone   | Background              | Ink                    |
  | ------ | ----------------------- | ---------------------- |
  | violet | `oklch(0.92 0.025 290)` | `oklch(0.36 0.07 290)` |
  | blue   | `oklch(0.92 0.028 230)` | `oklch(0.36 0.08 230)` |
  | green  | `oklch(0.92 0.03 165)`  | `oklch(0.36 0.07 165)` |
  | amber  | `oklch(0.92 0.04 75)`   | `oklch(0.38 0.09 62)`  |
  | red    | `oklch(0.92 0.03 25)`   | `oklch(0.38 0.1 28)`   |
  | cyan   | `oklch(0.92 0.025 200)` | `oklch(0.36 0.07 200)` |

  (Same warm-parchment pattern for teal, slate, indigo, pink, rose.)

### The parchment canvas

The board root is a warm parchment wash — two soft `--parchment-deep` corner radials over a flat `--parchment` base, painted on `.board-root`:

```css
background:
	radial-gradient(at 100% 0%, var(--parchment-deep) 0px, transparent 45%),
	radial-gradient(at 0% 100%, var(--parchment-deep) 0px, transparent 42%), var(--parchment);
```

Luminance stays very high (L ≈ 0.9–0.94) so espresso ink has maximum contrast headroom, and chroma stays low (≤ 0.035) so the canvas reads as warm cream paper, not saturated color. The two corner radials give the page a subtle printed-paper depth without ever darkening enough under text to threaten AA contrast. Major surfaces (header, columns, cards) sit on top as opaque ink-outlined fills, not as translucent layers — the canvas is a backdrop, never a see-through surface.

## Typography

- **Serif stack:** `ui-serif, 'Iowan Old Style', 'Palatino Linotype', P052, Palatino, 'Source Serif 4', serif`. `ui-serif` resolves to the OS serif (Iowan on Apple, Palatino elsewhere) so the preview is self-contained and the handoff is framework-agnostic. No external fonts.
- **Sans stack:** `ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`.
- **Role split:** serif for the board title, column headings, card titles, and the error "Sync paused" label; sans for every control, count, label chip, meta line, and timestamp. Never set body controls in the serif.
- **Scale (rem):** board title 1.4 / 700 serif · column heading 1.02 / 700 serif · card title 0.95 / 700 serif · subtitle/meta 0.78 sans · controls 0.78–0.82 sans · labels 0.66 / 700 uppercase tracked. Hierarchy via family + scale + weight; `font-synthesis: none`.

## Spacing, density, borders, radii, elevation

- **Density:** spacious. Outer board padding `clamp(1rem, 2.5vw, 2rem)`; header 1rem 1.2rem; column 0.9rem 0.85rem; card 0.75rem 0.85rem. Card-list gap 0.7rem; board-body gap 1.25rem.
- **Radii:** rectangular. Cards, columns, header, controls, project chip, count pill, and label chips are all `0` (sharp corners — the cut-paper aesthetic). Only the column accent dots, priority dots, avatars, and skeleton surfaces are circular. Never give a card or column a rounded corner.
- **Borders:** every major surface has a 2px espresso `--ink` outline (header, columns, project chip, avatars, primary button, search, segmented controls, error banner). Cards use 1.5px `--rule-strong` so they read as a lighter layer than columns. Footer dividers and column-head underlines are 1.5–2px `--rule`.
- **Elevation = crisp offset shadows, never blur.** The core recipe:

```css
.card {
	box-shadow: 3px 3px 0 var(--rule-strong);
} /* lighter layer */
.column {
	box-shadow: 5px 5px 0 var(--ink);
} /* heavier, ink */
.header,
.project-chip,
.primary {
	box-shadow: 3px 3px 0 var(--ink);
}
.card:hover {
	box-shadow: 5px 5px 0 var(--ink);
} /* poster lift */
```

The offset direction matches the poster convention (down-right). Header/project-chip/primary use a 3px ink offset; columns use 5px ink; cards use 3px `--rule-strong` and lift to 5px ink on hover. Hover moves the element up-left by the same delta so the shadow appears to grow, not detach.

## Layout and composition

- The board is a header banner over a body of columns. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The header wraps its controls onto a second row on narrow widths.
- **Composition illustration lives in the header:** a faint mustard starburst watermark bleeds off the top-right corner of the header (opacity 0.12, `aria-hidden`), and the project chip carries a small filled starburst mark. This is the poster moment — everything below the header is a disciplined working surface.
- **Z-depth is layered by outline weight and shadow size, not translucency:** ink-outlined columns (5px offset) sit on the parchment; lighter rule-outlined cards (3px offset) sit inside them. No nesting of fills.

## Components and behavior

- **Board header** (rectangular, 2px ink outline, 6px ink offset shadow): project chip (mustard-deep fill, cream uppercase text + starburst mark, 3px offset shadow) + serif title + sans subtitle + team-avatar group on the left; on the right a search field, filter chips (All / Mine / Due this week), a Board/List segmented toggle, and a primary "New task" button. Wraps on narrow widths.
- **Column** (rectangular, 2px ink outline, 5px offset shadow): a header row with a **concentric cut-paper circle** mark (a filled back-disc offset behind a coloured front-disc, both espresso-rimmed), the serif column name (`<h2>`), a rectangular count chip with a 1.5px ink border, and a "more actions" icon button; a vertical list of cards; a dashed "Add a card" button; and an empty-state placeholder when the column has no cards.
- **Card** (rectangular, 1.5px rule-strong outline, 3px offset shadow): serif title (`<h3>`), rectangular label chips with a 1.5px same-hue outline, an optional checklist progress line (square icon + count), and a footer with the priority indicator, due date, and assignee avatars. Hover moves the card up-left 2px and grows the shadow to 5px ink (reduced-motion: static).
- **Drag grip:** a 2×3 grid of small squares (geometric, not dots) — faint by default, full colour on hover.
- **Label chip:** rectangular cut-paper block — pale warm OKLCH tint fill + dark espresso ink of the same hue + 1.5px same-hue outline. Uppercase, tracked, ~0.66rem.
- **Avatar:** circular, initials on a dark warm-tinted OKLCH fill, 2px espresso rim + offset shadow; exposes the full name via `aria-label`. Two sizes: header 34px, card 28px.
- **Controls:** search input (cream fill, 2px ink outline, 2px offset shadow, 44px min-height), segmented toggle and filter chips (`aria-pressed`, 44px), primary button (mustard-deep fill, cream text, 3px offset shadow, 44px), icon button (44px). Every control shows the 3px mustard-deep focus ring. The search input, filter chips, and view toggle demonstrate **selected interaction state only** — they do not filter, search, or re-render the board; they are visual-specimen controls that toggle `aria-pressed` and bound `value`, not business logic.
- **Empty state:** a dashed rectangular placeholder with a filled-starburst mark (mustard-deep) and serif italic "No cards yet" — see the **In Review** column.
- **Skeleton (loading):** a card-shaped outline with hard-edged shimmering bars (no rounded corners). Shimmer animates only under `prefers-reduced-motion: no-preference`.
- **Error (inline):** a rectangular banner under the header — coral-deep border, warm coral wash, a **cut-paper triangle** icon (filled mustard-cream with espresso outline), serif "Sync paused" label, sans body copy, a coral-deep Retry button, and a dismiss control (`role="status" aria-live="polite"`).
- **Done:** completed cards show a circled check icon and a teal-deep due-date treatment.
- **Priority:** outlined dot + capitalized word in the card footer (coral-deep for High, mustard for Medium).

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the poster chrome: a rectangular ink-outlined top bar (brand starburst + name + search + primary action + avatar menu) over a rectangular sidebar or column rail for board/account navigation. Every navigational surface keeps its 2px espresso outline and crisp offset shadow.

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is a chunky rectangular thumb (`scrollbar-width: thin`, `::-webkit-scrollbar` with a 3px parchment border) on a khaki thumb.
- **Mobile/tablet (<768px):** columns stack vertically; no document-level horizontal overflow at 375/768/1280. Outer padding scales via `clamp`.
- Touch targets: every interactive control is ≥44px (search, primary, chips, filter chips, view-toggle buttons, icon buttons, add-card).

## Interaction and motion

- Hover: card moves up-left 2px and its shadow grows from 3px rule-strong to 5px ink; primary button and error Retry move up-left 1px. Active filter/view gets the mustard-deep fill. Chips/segmented buttons get a parchment-deep hover fill.
- **Transitions** are 0.18s ease over `transform`, `box-shadow`, `background`, and `color`, applied to `.card`, `.chip`, `.segmented button`, `.primary`, `.icon-btn`, and `.error-retry`, and are **gated behind `@media (prefers-reduced-motion: no-preference)`** — reduced-motion users get a fully static board with no loss of function. Only non-layout properties are transitioned; layout is never animated.
- **Skeleton shimmer:** `.skel` uses a `repeating-linear-gradient(90deg, …)` stripe fill with `background-size: 200% 100%`, and a `@keyframes shimmer` animates `background-position` from `200% 0` to `-200% 0` over `1.4s ease-in-out infinite`, also gated behind `prefers-reduced-motion: no-preference`.
- Never animate CSS layout properties; never use bounce/elastic easing; never use blur or soft shadows (they break the print aesthetic).

## States

The specimen demonstrates each state visually (functional drag-and-drop and network logic are out of scope — these are the visual treatments to reuse):

- **Empty (shown):** a column with no cards renders a dashed rectangular placeholder with a starburst mark and serif italic copy ("No cards yet") — see the **In Review** column.
- **Loading (shown):** a **skeleton card** with hard-edged shimmering bars (in Backlog) represents a card still loading. The shimmer animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline rectangular banner under the header — cut-paper triangle warning + serif "Sync paused" label + Retry button + dismiss control (`role="status" aria-live="polite"`).
- **Drag/move affordance (shown):** every card has a **grip handle** (2×3 grid of squares; faint by default, full on hover). Full drag-and-drop logic is optional and not implemented; add `cursor: grab` + actual DnD when wiring it for real, reusing the card + grip treatment.
- **Done (shown):** completed cards show a circled check icon and a teal-deep due-date treatment.
- **Priority (shown):** outlined dot + capitalized word in the card footer (coral-deep High, mustard Medium).
- **Validation:** when implementing real card-edit forms, reuse the coral-deep border + inline message pattern under each field.

## Accessibility

- Landmarks: `<header>` (banner) + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; counts and icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced).
- **Visible focus:** `outline: 3px solid var(--mustard-deep); outline-offset: 2px;` on every interactive element (verified live). The 3px ring clears the 2px espresso outline so it is visible against every surface.
- **WCAG 2.2 AA** is met by construction: the parchment canvas (L ≈ 0.94) gives espresso ink (L ≈ 0.28) maximum contrast headroom; signature fills are deepened to L 0.45 so cream text clears 4.5:1; label chips carry L≈0.36 ink on L≈0.92 tints. Meaning is never conveyed by colour/shape alone (priority and status are always labelled in text).

## Extending the design to new pages

Keep the parchment canvas + 2px espresso outline + crisp offset shadow constant; adapt the layout shell. Every new surface is a rectangular ink-outlined panel on the parchment, with the same tokens, serif/sans split, and focus ring.

- **Settings / account page:** ink-outlined top bar; a two-column shell (nav rail + content panel). Form fields are cream inputs with 2px ink outlines and 2px offset shadows on the content panel; the save bar is a rectangular footer with the primary mustard-deep button.
- **Auth / login:** a single centered rectangular card (2px ink outline, 6px offset shadow) on the parchment; inputs as above; a mustard-deep "Sign in" button; a secondary "Create account" text link underneath. Add a faint starburst watermark in a corner for the poster moment.
- **Tables / data views:** an ink-outlined panel holds the table; rows separated by 1.5px `--rule` hairlines (no zebra stripes); a sticky ink-outlined header row; filters reuse the chip + segmented-control patterns. Keep cell type in sans; consider serif only for the table title.
- **Detail pages:** an ink-outlined breadcrumb + serif title header; metadata as rectangular cut-paper chips; related items as a horizontal scroll of cards reusing the board-card recipe.
- **Dashboards:** KPI tiles reuse the card recipe (cream fill, rule-strong outline, 3px offset shadow) — but avoid the SaaS "hero-metric" cliché; lead with a chart in an ink-outlined panel, not a giant number.

Rule of thumb: any new surface is a rectangular panel (header/column/card recipe) on the same parchment, with the same tokens, focus ring, and motion rules. Reserve starbursts and concentric circles for composition accents and state marks — never decorate the working surface of a card.

## Do / Don't

**Do**

- Pair every signature fill (mustard-deep, coral-deep) with `--on-accent` cream text; both are tuned to L 0.45 to clear AA.
- Give every major surface a 2px espresso outline and a crisp `Npx Npx 0` offset shadow — the outline + shadow pair is the whole personality.
- Keep the serif/sans role split strict: serif for editorial weight, sans for controls and data.
- Concentrate illustration in the composition (header) and state treatments (empty, error, skeleton, grip); let cards be clean working surfaces.
- Give every interactive element the 3px mustard-deep focus ring, ≥44px target, and a real role/label; avatars expose the full name.
- Convey state (priority, done, empty, error) in text, not colour/shape alone.

**Don't**

- Don't use `box-shadow` blur, `backdrop-filter`, gradients-on-surfaces, or soft elevation — they break the print aesthetic. Offsets are always `0` blur.
- Don't round card, column, header, control, or chip corners. Rectangular is the rule; only dots/avatars are circular.
- Don't introduce a third type family, a display font, or gradient text.
- Don't use a coloured side-stripe (`border-left > 2px`) as an accent — use a chip, a dot, a leading icon, or the concentric circle mark.
- Don't animate layout properties other than `transform`, and don't ship motion without a reduced-motion fallback.
- Don't use `#000`/`#fff`, and don't cite or imitate a named illustrator — the direction is a generic mid-century print vocabulary, not a specific artist's signature.

## When to use / avoid / trade-offs

- **Use** when the product wants a warm, characterful, editorial surface that still reads as a serious working tool — creative tools, design-systems dashboards, editorial/productivity apps, or any brand that wants a hand-crafted, print-derived identity without sacrificing legibility.
- **Avoid** for data-dense operational surfaces (observability, trading, large tables) where the 2px outlines and offset shadows add visual noise at scale; for dark-mode-first products (this is a light, parchment direction); or for brands whose identity is genuinely minimalist (use `kanban-swiss` instead).
- **Trade-offs:** the strong outlines and offset shadows give the page real personality but cost visual headroom on very dense screens — the spacious density is intentional to keep cards breathable. Crisp offset shadows render identically on every browser (no `backdrop-filter` GPU cost), so performance is uniformly light; the cost is that the look is bold, which some products will want to tone down by dropping shadow offsets to 2px.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System serif + system sans stacks; every icon (starburst, grip squares, concentric circle, cut-paper triangle, check, calendar, search) is inline SVG; avatars are initials (no image assets); the header watermark is an inline SVG mask. Self-contained and framework-agnostic.
- License: inherits the source repository's license.

## Content baseline

`fixtures.ts` is copied verbatim from the catalog's locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. Only the visual language changes between styles.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Canvas is warm parchment (`oklch(0.94 0.028 80)`); no `#000`/`#fff` anywhere; no pure grey — all neutrals tinted toward hue 50–80.
- [ ] Every major surface (header, columns, project chip, avatars, primary button, search, segmented controls, error banner) has a 2px espresso `--ink` outline and a crisp `Npx Npx 0` offset shadow (no blur, ever).
- [ ] Cards are a lighter rectangular layer (1.5px `--rule-strong` outline, 3px offset shadow); hover moves them up-left 2px and grows the shadow to 5px ink.
- [ ] Corners are rectangular on every card, column, header, control, count chip, and label chip; only dots/avatars are circular.
- [ ] Signature fills (`--mustard-deep`, `--coral-deep`) are L 0.45 and carry `--on-accent` cream text (AA). Column accents pull from the disciplined palette (khaki / teal / mustard / sage-teal).
- [ ] Typography uses the system serif stack for board title, column headings, card titles, and the error label; system sans for every control, meta line, count, and chip. No third family, no display font, no gradient text.
- [ ] All colours are OKLCH; no coloured side-stripes (`border-left > 2px`); no cited or imitated named illustrator.
- [ ] Every interactive element has the 3px `--mustard-deep` focus ring (`outline-offset: 2px`), ≥44px target, and a real role/label; avatars expose the full name via `aria-label`.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its rendered surface; state is conveyed in text, not colour/shape alone.
- [ ] Illustration is concentrated in composition (header starburst watermark + project-chip starburst) and state treatments (empty starburst, cut-paper error triangle, 2×3 square grip, skeleton) — cards stay clean.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] All motion is ≤0.18s ease (transitions on `transform`, `box-shadow`, `background`, `color`) or the 1.4s ease-in-out skeleton `background-position` animation, each gated behind `prefers-reduced-motion: no-preference`; no layout-property animation; no blur/soft-shadow/bounce.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state (In Review) renders with the starburst mark.
- [ ] Loading (hard-edged skeleton), error (cut-paper inline banner), drag affordance (square grip), empty, done, and priority states are all shown; the skeleton shimmer respects `prefers-reduced-motion`.
