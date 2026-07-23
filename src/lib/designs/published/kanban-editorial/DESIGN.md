# Kanban Board · Annual Report

**Version** 1.0.0 · **Slug** `kanban-editorial` · **Page type** data-management
**Visual intent:** a sober Editorial / Typographic Kanban board that reads like a corporate annual report — near-white cool paper, dark navy ink, and a restrained teal accent. A serif masthead and serif column/card headings carry editorial warmth; system-sans controls, labels, dates, and counts keep dense data crisp. Depth comes only from hairline borders and rules: there are **no shadows, no gradients, no translucency** anywhere (focus is the sole justified depth treatment). Light theme, spacious density, formal two-colour print palette.

> This is the catalog's **editorial / typographic direction**. Its board content is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): the same columns, cards, labels, members, due dates, and the empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a sober report masthead ("Aurora") over a compact uppercase sprint/board line and a thin dark horizontal board rule, then four columns of cards: Backlog → In Progress → In Review → Done. The **In Review** column is empty, demonstrating the empty state; the other three hold realistic cards with a title, tiny uppercase data-key labels with dot separators, an optional priority indicator, an optional checklist progress line, a due date, and restrained navy assignee avatars. Done titles are struck through.

## Design principles

1. **Print, not screen chrome.** Every surface is a flat paper fill on a hairline grid. Hierarchy comes from serif/sans contrast, scale, weight, and rules — never from elevation, blur, or gradients. What you see is exactly the colour written down.
2. **Two-colour discipline.** Dark navy ink on near-white cool paper is the whole palette; teal appears only as the column rule, the done check, and the focus ring. No rainbow label dots, no coloured side-stripes — label dots are uniform navy separators, avatars are uniform navy circles.
3. **Serif leads, sans serves.** The masthead, column headings, and card titles use a Georgia/Times system serif; every control, label, date, count, and supporting datum uses the system sans. Content reads first; chrome recedes.
4. **Restraint over decoration.** Cards are bordered near-squares with no decorative elevation; controls are understated outlined report controls; the selected/primary state is a single dark navy fill. Generous surrounding whitespace frames the data-table rhythm.

## Color system (OKLCH)

| Token            | Value                    | Role                                                       |
| ---------------- | ------------------------ | ---------------------------------------------------------- |
| `--paper`        | `oklch(0.985 0.003 250)` | Near-white cool paper canvas                               |
| `--paper-bright` | `oklch(0.995 0.002 250)` | Brighter paper card/control surfaces                       |
| `--ink`          | `oklch(0.26 0.03 258)`   | Dark navy primary text (titles, masthead)                  |
| `--ink-soft`     | `oklch(0.4 0.025 258)`   | Meta text: labels, counts, dates, checklist (AA on paper)  |
| `--ink-faint`    | `oklch(0.5 0.02 258)`    | Decorative grip handle only (non-text)                     |
| `--rule`         | `oklch(0.84 0.006 255)`  | Cool-gray hairline: card/control borders, board scrollbar  |
| `--rule-soft`    | `oklch(0.9 0.005 255)`   | Lighter hairline: card-foot divider                        |
| `--accent`       | `oklch(0.44 0.08 200)`   | Restrained teal: 2px column rules only                     |
| `--accent-ink`   | `oklch(0.4 0.09 200)`    | Darker teal for done check/due text (AA on paper)          |
| `--focus`        | `oklch(0.38 0.1 200)`    | Teal focus ring (≥3:1 on paper — the only depth treatment) |
| `--on-navy`      | `oklch(0.985 0.003 250)` | Paper-coloured text on navy fills (never `#fff`)           |
| `--danger`       | `oklch(0.4 0.15 25)`     | Error icon/label/strong text + full banner border          |
| `--danger-soft`  | `oklch(0.95 0.025 25)`   | Pale red error banner fill                                 |
| `--pri-high`     | `oklch(0.42 0.13 25)`    | High-priority word + dot (AA on paper)                     |
| `--pri-medium`   | `oklch(0.42 0.09 65)`    | Medium-priority word + dot (AA on paper)                   |

- **Neutrals are tinted** toward hue 250–258 (cool), never pure grey/black/white. `--on-navy` is paper-coloured, not `#fff`.
- **No gradients, no backdrop blur, no translucency, and no box shadows anywhere** — overlapping avatars are separated by a crisp 2px paper-coloured `border`, not a shadow ring. Focus is rendered with `outline`, not shadow.
- **Teal is restricted** to the 2px column rule, the done check/due treatment, and the focus ring. It is never a fill, a side-stripe, or a label colour.
- **Label dots are uniform navy** (`--ink-soft`) separators — meaning is carried by the label text, never by dot colour. **Avatars are uniform navy circles** (`oklch(0.4 0.06 258)`) with paper initials; a 2px paper-coloured ring separates overlaps.
- **The error banner is a full pale-red panel with a full hairline border** (`1px solid --danger`), icon + bold label + Retry + dismiss — **never a side-stripe** (the concept's side-stripe is overridden by the project's absolute side-stripe ban).

## Typography

- **Serif** (`Georgia, 'Times New Roman', Times, serif`) — no external fonts — for the **masthead**, **column headings**, and **card titles**. The serif lends editorial warmth to content.
- **Sans** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) for **every control, label, date, count, checklist, and supporting datum**. The sans keeps dense data crisp and readable.
- Scale (rem): masthead `clamp(1.9, 1.4+1.6vw, 2.6)` / 700 serif · column heading 1.15 / 700 serif · card title 0.98 / 700 serif · board/sprint line 0.72 uppercase / 700 sans · subtitle/count 0.72 uppercase sans · labels/priority 0.66 uppercase sans · due/checklist 0.72 sans. Hierarchy through serif-vs-sans + scale + weight; `font-synthesis: none`.
- Board/sprint line, subtitle, counts, labels, and priority are **tiny uppercase data keys**; body/meta line length is bounded by the card width.

## Spacing, density, elevation, radii, rules

- **Density:** spacious. Masthead padding `clamp(1.75rem, 4vw, 2.75rem)` top / `clamp(1.25rem, 4vw, 3rem)` sides; board-shell padding `clamp(1.25rem, 3vw, 2rem)` top to `clamp(1.75rem, 4vw, 2.75rem)` bottom; card padding 0.7–0.85rem; card gaps 0.6rem. Generous surrounding whitespace frames the data-table rhythm.
- **Radii:** cards, controls, inputs, error banner, add-card, empty-state, icon buttons, skeleton = **3px** (near-square — the signature radius); avatars and the scrollbar thumb = `999px` (circles/pills). No large radii anywhere.
- **Rules (the structural device):**
  - A **thin dark navy 1px board rule** (`border-top: 1px solid --ink`) spans the full width under the masthead, separating report identity from the data.
  - A **2px teal rule** (`border-bottom: 2px solid --accent`) sits under each column heading.
  - A **1px cool-gray hairline** (`--rule`) borders every card, control, and icon button; a lighter `--rule-soft` divides the card footer.
- **Elevation:** none. Surfaces are separated by hairline borders and rules, never by shadow. Overlapping avatars are separated by a crisp 2px paper-coloured `border` (the later avatar's leading border sits atop the previous one), not by a shadow ring.
- **Borders:** 1px `--rule` (solid) on cards/controls; 1px dashed `--rule` on the add-card and empty-state affordances; 1px `--danger` on the full error banner.

## Layout and composition

- The board is a report masthead (serif nameplate + uppercase sprint/data line) over a full-width dark board rule, then the board shell. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The masthead control row wraps onto further rows on narrow widths.
- Structure is read through rules, not nested fills: the dark board rule separates identity from data; the teal column rules mark each section; hairline borders bound each card. Surfaces are always flat paper — never a panel-on-panel translucency or shadow.

## Components and behavior

- **Masthead** (flat paper): serif "Aurora" nameplate (a styled `<p>`, the brand identity) over an uppercase sans sprint line (`<h1>` "Sprint 24 · Board") and an uppercase subtitle of column/card counts. On the right, a row of understated outlined controls that wraps.
- **Controls (compact face + ≥44px target):** the visible chrome is a compact ~22px outlined "face" element; the interactive element (button/label) is a transparent ≥44px semantic hit target that centres the face. This keeps the dense ~21–24px print reference while meeting the WCAG 2.2 44px target minimum. A near-white outlined **search** field, **filter chips** (All / Mine / Due this week), and a **Board/List segmented toggle** are all `aria-pressed` report controls (separate faced chips, not a clipped group); inactive = ink text on paper, **active = dark navy face fill with paper text**. A **navy-faced primary "New task" button** is the one emphatic action. A navy **"Retry"** and a dismiss control appear in the error banner. Every control shows the teal focus ring on its face.
- **Column:** a header row with the serif column name (`<h2>`), a sans uppercase count, and an outlined "more actions" icon button (44px); below the 2px teal rule, a vertical list of cards; a dashed "Add a card" button; and a dashed empty-state placeholder when the column has no cards. No stage dot — the teal rule is the column's only accent.
- **Card** (bordered near-square, 3px radius, no elevation): serif title (`<h3>`, struck through when done), tiny uppercase data-key labels with navy dot separators, an optional checklist progress line, and a footer with the priority indicator, due date (teal with a check when done), and navy assignee avatars. Hover deepens the card border to `--ink-soft` (reduced-motion: still applies, it is a colour change, not motion).
- **Label:** tiny uppercase sans word with a leading uniform navy dot — one per concept; meaning carried by text, never by dot colour.
- **Avatar:** paper initials on a uniform navy circle (`oklch(0.4 0.06 258)`) with a crisp 2px paper-coloured `border` that separates overlaps (the later avatar's leading border sits atop the previous one — no shadow ring); exposes the full name via `aria-label`. Two sizes: header-width team avatars are not shown (the masthead keeps to identity + data), card avatars are 27px.
- **Empty state:** a dashed hairline placeholder ("No cards yet", italic uppercase) renders in any column with zero cards — see the **In Review** column.

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the report masthead: a serif nameplate + uppercase sans section line over a full-width dark rule, with outlined report controls (search, filters, primary action) on the right. Use a vertical text-link rail (navy, underlined on hover) for board/account navigation rather than a coloured sidebar. Never use a coloured side-stripe, a shadow, or a gradient as an accent — use a hairline rule, a dot, or a leading icon. Separate stacked surfaces with hairline borders and rules, never with elevation.

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is thin (`scrollbar-width: thin`, `::-webkit-scrollbar`) in `--rule`.
- **Mobile/tablet (<768px):** columns stack vertically; the masthead control row wraps; no document-level horizontal overflow at 375/768/1280. Outer padding scales via `clamp`.
- Touch targets: every interactive control is a ≥44px semantic target at all viewports (search field, primary, every filter chip, every Board/List segmented button, icon buttons, add-card, Retry, dismiss). The visible chrome stays compact (~21–24px face) because the face is a separate element centred inside the transparent 44px target — the hit area does not bloat the print controls.

## Interaction and motion

- Hover: card border deepens to `--ink-soft`; inactive controls' borders/text darken; the drag grip goes full-opacity on card hover. No transforms, no lifts, no shadow changes.
- Normal UI transitions (hover, focus, active-state fill) are **0.16s ease** colour transitions, gated behind `@media (prefers-reduced-motion: no-preference)`. Active filter/view gets the dark navy fill with paper text instantly.
- The loading skeleton's opacity pulse is a separate, slower **1.6s ease-in-out** loop, also gated behind `prefers-reduced-motion: no-preference`. It is the only repeating motion and has no reduced-motion counterpart by design (reduced-motion shows static skeleton bars).
- Reduced-motion users get a fully static board (transitions removed; skeleton static) with no loss of function.
- Never animate CSS layout properties; never use bounce/elastic easing; never introduce a shadow or gradient as a hover/state effect.

## States

The states below are **visual state/affordance demonstrations only**, not functional behavior. The **filter chips and the Board/List segmented toggle are `aria-pressed` toggle controls** — they reflect selection state in the specimen but perform no real filtering or view switch. **Search, Retry, New task, more-actions, add-card, and dismiss render their affordance but perform no real search, sync, creation, or dismissal.** The **drag grip is a static affordance** with no drag-and-drop logic. Reuse these visual treatments when wiring real behavior:

- **Empty (shown):** a column with no cards renders a dashed hairline placeholder ("No cards yet") — see the **In Review** column.
- **Loading (shown):** a **skeleton card** with placeholder bars (in Backlog). The skeleton uses an **opacity pulse** (not a gradient shimmer) so it stays gradient-free. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline **full pale-red error banner** with a full `1px solid --danger` hairline border — warning icon + bold red label, a navy Retry button, and a dismiss control (`role="status" aria-live="polite"`). **No side-stripe** (the concept's left-stripe is overridden by the project's absolute side-stripe ban).
- **Drag/move affordance (shown, static):** every card has a **grip handle** (faint by default, full on hover, `cursor: grab`) as a visual affordance only — no drag-and-drop logic. Add actual DnD when wiring it for real, reusing the card + grip treatment.
- **Done (shown):** completed cards show a **struck-through serif title**, a teal check icon, and a teal due-date treatment.
- **Priority (shown):** tiny uppercase dot + word in the card footer (red/High, amber/Medium).
- **Validation:** when implementing real card-edit forms, reuse the red label + inline message pattern under each field, rendered as an outlined report control.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; counts and icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced).
- **Visible focus:** `outline: 3px solid --focus` (teal) with `outline-offset: 2px`, ≥3:1 (the WCAG 2.2 UI-component minimum) against every paper surface, so keyboard focus is unmistakable. For the faced controls (search, filters, Board/List, primary) the ring renders on the **compact face**, not the 44px target, so it hugs the visible chrome; segmented groups have **no `overflow` clipping**, so every segmented button gets a **complete, unclipped focus perimeter**. The composite search field lights its face via `:focus-within`; the `<input>` remains the semantic focus target, with its own redundant outline suppressed so keyboard users see one clear indicator, not an invisible near-paper double ring.
- **WCAG 2.2 AA** is met by construction: dark navy ink (L 0.26) on near-white paper (L ≈ 0.985–0.995), and paper text (L 0.985) on navy fills (L ≈ 0.26–0.4), both give large contrast margins. Meta text uses `--ink-soft` (L 0.4) which stays ≥4.5:1 on paper; label dots, priority, done, and error colours are all dark enough on paper for AA. Meaning is never conveyed by colour/shape alone (priority and status are always labelled in text; label dots are uniform).

## Extending the design to new pages

Keep the token set, serif/sans split, hairline-rule structure, and 3px radii constant; adapt the layout shell. Any new surface is a flat paper panel (card/control recipe at 3px radius, `--rule` border) over the paper canvas, with the same tokens, teal focus ring, and motion rules.

- **Settings / account page:** serif nameplate masthead over a dark board rule; a two-column shell (text-link nav rail + content). Form fields are outlined paper inputs (`--rule` border, 44px height, 3px radius) on the paper content panel; the save bar is a navy-filled primary button (or a dashed cancel link). Separate sections with hairline rules, never cards-in-cards.
- **Auth / login:** centred single outlined paper card (3px radius, `--rule` border) on the paper canvas, framed by generous whitespace; inputs as above; navy "Sign in" primary button. Add a secondary "Create account" text link.
- **Tables / data views:** the table sits on paper; rows separated by `--rule-soft` (no zebra stripes, no shadows); a sticky header row with a 2px teal rule (matching the column-heading rule); filters reuse the outlined chip + segmented-control patterns.
- **Detail pages:** serif breadcrumb + title header over a dark rule; metadata as tiny uppercase data-key labels with navy dots; related items as a horizontal scroll of bordered near-square cards reusing the board-card recipe.
- **Dashboards:** KPI tiles reuse the card recipe (flat fill, `--rule` border, 3px radius, no shadow) — lead with a chart in a bordered panel, not a giant shadowed number.

## Do / Don't

**Do**

- Build structure only from hairline borders and rules (dark board rule, teal column rules, `--rule` card/control borders); keep all colours OKLCH and tinted cool.
- Keep the serif for masthead/column/card headings and the sans for every control, label, date, and count.
- Keep teal restricted to the column rule, the done check, and the focus ring; keep label dots and avatars uniform navy.
- Make selected/primary state a single dark navy fill with paper text; make every control an understated outlined report control.
- Give every interactive element the teal focus ring and ≥44px target; convey state in text, not colour/shape alone.

**Don't**

- Don't use box shadows, gradients, backdrop blur, translucency, glass, clay, or neumorphic relief — this is the flat print direction. (Avatar overlap separation is a crisp border, never a shadow.)
- Don't use `#000`/`#fff`, gradient text, or a coloured side-stripe as an accent.
- Don't render the error as a side-stripe — use the full pale-red banner with a full hairline border.
- Don't use a gradient shimmer for loading skeletons; use the opacity pulse.
- Don't animate layout properties or use bounce/elastic easing; don't ship motion (including the skeleton pulse) without a reduced-motion fallback.

## When to use / avoid / trade-offs

- **Use** when the product wants a credible, content-first, quietly authoritative surface — annual reports, editorial products, finance, research, documentation, and any brand that values typographic restraint and generous whitespace over app-like chrome.
- **Avoid** when the brand demands a more expressive or decorative direction (glass, illustration, brutalism, neon), or when maximum information density per screen matters more than breathing room (the generous whitespace trades density for legibility).
- **Trade-offs:** Editorial is the safest formal direction (no GPU effects, no custom assets, robust contrast, framework-agnostic system fonts), but its restraint can read as conventional next to bolder concepts, and the spacious density shows fewer cards per screen. Performance is excellent (flat fills, no shadows/blur); the cost is purely visual "personality" and lower information density.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System serif (Georgia/Times) and system sans stacks; icons are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Near-white cool paper canvas (`oklch(0.985 0.003 250)`) sits behind every surface; brighter paper card/control surfaces (`oklch(0.995 0.002 250)`) hold cards and controls.
- [ ] All surfaces are flat fills; structure comes only from hairline borders and rules (dark navy 1px board rule, 2px teal column rules, `--rule` card/control borders). **No box shadows anywhere** (avatar overlaps use a crisp border), **no gradients, no `backdrop-filter`, no translucency**, no glass/clay/neumorphic relief.
- [ ] Cards are bordered near-squares (`--rule` border, **3px radius**, no elevation); the masthead and column/card headings are serif; every control, label, date, count, and checklist is sans.
- [ ] All colours are OKLCH and tinted cool; no `#000`/`#fff`; no gradient text; no coloured side-stripes; teal restricted to the column rule, the done check, and the focus ring; label dots and avatars uniform navy.
- [ ] The selected/primary state is a single dark navy fill with paper text; all other controls are understated outlined report controls.
- [ ] Typography uses the system serif/sans split and the documented scale; hierarchy through serif-vs-sans + scale + weight.
- [ ] Every interactive control is a ≥44px semantic target whose visible chrome is a compact ~21–24px face centred inside it (search, primary, every filter chip, every Board/List segmented button, icon buttons, add-card, Retry, dismiss); each has a real role/label and avatars expose the full name.
- [ ] Focus renders as a complete, unclipped teal perimeter (`outline: 3px solid` + offset, ≥3:1 on paper) on every control — on the compact face for faced controls; segmented groups never clip with `overflow`; the search field lights its face via `:focus-within` with the input kept as the semantic focus target.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its paper background; state is conveyed in text, not colour/shape alone.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions are ≤0.16s ease colour changes and the skeleton opacity pulse is a 1.6s loop, both gated behind `prefers-reduced-motion: no-preference` (reduced-motion shows a fully static board); no layout-property animation; no bounce/elastic.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state renders.
- [ ] Loading (skeleton with opacity pulse, gradient-free), error (full pale-red banner with full hairline border, no side-stripe), drag affordance (grip), empty, done (struck-through title + teal check), and priority states are all shown; the skeleton pulse respects `prefers-reduced-motion`.
