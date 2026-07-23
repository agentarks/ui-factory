# Kanban Board · Diagonal Axis

**Version** 1.0.0 · **Slug** `kanban-swiss` · **Page type** data-management
**Visual intent:** a Swiss / Minimal Kanban board faithful to the approved **THEME 7 (Diagonal)** concept: a strict orthogonal grid of hairline rules and flat near-square cards set entirely in an austere system sans, on a warm near-white canvas with near-black ink and a **single cobalt accent** (`#1857c6` adapted to OKLCH). A disciplined **45-degree diagonal** appears in exactly two places — a cobalt diamond marking the **active column** and a cobalt diamond marking **high-priority** cards. Everything else holds the strict grid. Five team avatars sit in the header; the active column and the selected card expose their state programmatically. Depth comes only from hairline borders and the focus outline: there are **no shadows, no gradients, no backdrop blur, no translucency** anywhere. Light theme, comfortable density, monochrome-plus-one-accent palette.

> This is the catalog's **Swiss / Minimal direction**. Its board content is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): the same columns, cards, labels, members, due dates, and the empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a header carrying a brand chip ("Aurora"), a sans board title and a tabular-figures subtitle, **all five team members as accessible avatars**, and an austere row of controls; then four columns of cards: Backlog → In Progress → In Review → Done. **In Progress** is the active column, marked by a cobalt diamond and a 2px cobalt rule, and announced as the active column. **In Review** is empty, demonstrating the empty state. The other columns hold realistic cards with a title, tiny uppercase monochrome labels with uniform dots, an optional priority indicator (a cobalt diamond for High), an optional checklist progress line, a due date, and restrained ink assignee avatars. One card (**au-137**) is selected, marked by a full cobalt border and announced as selected. Done titles are struck through.

## Design principles

1. **The grid is the protagonist; the diagonal is its disciplined accent.** Every element sits on a strict orthogonal hairline grid. A single 45-degree motif — cobalt diamonds — appears in exactly two places (active column, high priority) and always carries meaning. It is never decorative, never expanded across brand, selection, or empty states.
2. **Monochrome with one accent.** Warm near-black ink on a warm near-white canvas is the whole palette. Cobalt appears only on the two diagonal markers, the primary action, the active-column rule, the focus ring, and the error icon. Label dots are uniform ink; avatars are uniform ink circles. Meaning is carried by text, weight, and position — never by colour alone.
3. **Austere system sans, high craft.** A single system grotesque at every level; hierarchy through scale, weight, tracking, and precise alignment. No serif (this is not Editorial), no monospace (this is not Brutalism).
4. **Flatness over chrome.** Surfaces are flat fills on a hairline grid; no app bar, no elevation shadows, no gradients, no blur (this is not Flat Material). Focus (outline) is the sole justified depth treatment.

## Color system (OKLCH)

| Token           | Value                         | Role                                                                                                                          |
| --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--canvas`      | `oklch(0.97 0.004 90)`        | Warm near-white canvas (`#f7f7f5`)                                                                                            |
| `--paper`       | `oklch(0.99 0.003 90)`        | Brighter warm paper card/control surfaces (`#fffefe`)                                                                         |
| `--ink`         | `oklch(0.22 0.008 90)`        | Near-black warm primary text (titles, headings) + ink fills                                                                   |
| `--ink-soft`    | `oklch(0.44 0.006 90)`        | Meta text: labels, counts, dates, subtitle, checklist (AA)                                                                    |
| `--ink-faint`   | `oklch(0.58 0.005 90)`        | Decorative drag-grip handle only (non-text)                                                                                   |
| `--rule`        | `oklch(0.86 0.005 90)`        | Hairline: card borders, skeleton, scrollbar                                                                                   |
| `--rule-soft`   | `oklch(0.92 0.004 90)`        | Lighter hairline: card-foot divider                                                                                           |
| `--rule-strong` | `oklch(0.5 0.008 90)`         | Stronger hairline: header rule, control borders, inactive marker                                                              |
| `--accent`      | `oklch(0.4886 0.1845 261.01)` | Cobalt — exact `#1857c6` = `rgb(24,87,198)`: diagonal markers, primary fill, active rule, priority/done text, focus ring (AA) |
| `--on-ink`      | `oklch(0.99 0.003 90)`        | Paper-coloured text on ink/cobalt fills (never `#fff`)                                                                        |

- **Neutrals are tinted** toward hue 90 (warm), never pure grey/black/white. `--on-ink` is paper-coloured, not `#fff`.
- **No gradients, no backdrop blur, no translucency, and no box shadows anywhere.** Overlapping avatars are separated by a crisp 2px canvas/paper-coloured `border`, not a shadow ring. Focus uses `outline`, not shadow.
- **Cobalt is restricted** to the two diagonal markers (active column + high priority), the primary action fill, the active-column 2px rule, the focus ring, and the error icon. It is never a side-stripe and never a label colour. Selected filter/view chips use an **ink** fill (monochrome), not cobalt.
- **Label dots are uniform ink** (`--ink-soft`) — meaning is carried by the label text, never by dot colour. **Avatars are uniform ink circles** with paper initials; a 2px canvas/paper-coloured border separates overlaps.
- **The error banner is a flat paper panel** with a full `1px solid --rule-strong` hairline border, a cobalt warning icon, bold ink label, ink-soft body, and an ink Retry button — **no red, no side-stripe** (the system stays pure monochrome + one cobalt accent).

## Typography

- **Sans** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) — no external fonts — for **everything**: masthead title, column headings, card titles, controls, labels, dates, counts, and checklists. A single austere grotesque at every level. No serif anywhere (keeps it clear of Editorial); no monospace (keeps it clear of Brutalism).
- Scale (rem): board title 1.18 / 700 · column heading 0.76 uppercase / 700 / tracked 0.14em · card title 0.86 / 600 · subtitle/count/due 0.70 · labels/priority 0.64 uppercase / tracked. Hierarchy through scale + weight + tracking; `font-synthesis: none`. Counts and dates use `font-variant-numeric: tabular-nums` for precise column alignment.

## Spacing, density, elevation, radii, rules

- **Density:** comfortable. Header padding `clamp(1.4rem, 3vw, 2.1rem)` top / `clamp(1.1rem, 3vw, 2rem)` sides; board-shell padding `clamp(1.1rem, 2.5vw, 1.6rem)` top to `clamp(1.4rem, 3vw, 2rem)` bottom; card padding 0.66–0.78rem; card gaps 0.55rem; column gap 1.1rem.
- **Radii:** cards, controls, inputs, error banner, add-card, empty-state, icon buttons, skeleton = **1px** (near-square — the signature radius); avatars and the scrollbar thumb = `999px` (circles/pills). No large radii anywhere.
- **Rules (the structural device):**
  - A **1px stronger hairline rule** (`border-bottom: 1px solid --rule-strong`) spans the full width under the header, separating identity from data.
  - The **active column** gets a **2px cobalt rule** (`border-bottom: 2px solid --accent`) under its heading, plus its cobalt diamond.
  - A **1px hairline** (`--rule`) borders every card, control, and icon button; a lighter `--rule-soft` divides the card footer.
- **Elevation:** none. Surfaces are separated by hairline borders, never by shadow. Overlapping avatars are separated by a crisp 2px canvas/paper-coloured `border` (the later avatar's leading border sits atop the previous one), not by a shadow ring.
- **Borders:** 1px `--rule` (solid) on cards/controls; **2px cobalt** on the selected card (a full border, never a side-stripe); 1px dashed `--rule` on the add-card and empty-state affordances; 1px `--rule-strong` on the error banner.

## Layout and composition

- The board is a header (brand chip + title/subtitle + five team avatars + controls) over a full-width hairline rule, then the board shell. On ≥768px the columns form a horizontal flex row that scrolls horizontally when they overflow (authentic Kanban); below 768px they stack vertically. The control row wraps onto further rows on narrow widths.
- Structure is read through rules, not nested fills: the header hairline separates identity from data; the active column's cobalt rule marks the focal column; hairline borders bound each card. Surfaces are always flat — never a panel-on-panel translucency or shadow.
- The horizontal board scroller carries **internal breathing room** (`padding: 0.4rem` on the scroller at desktop) so keyboard focus perimeters on controls inside it are never clipped at the scroll edges. `overflow-x: auto` computes `overflow-y` to `auto`, so without that room the first/last column controls' offset focus rings would be cut at the top and at both scroll extremes.

## Components and behavior

- **Header** (flat canvas): a brand chip ("Aurora"), a sans title (`<h1>` "Sprint 24 · Board"), a tabular-figures subtitle, and **all five team members as accessible avatars** (`aria-label` = full name). On the right, a row of austere controls that wraps.
- **Controls (compact face + ≥44px target, for search/filter/view/primary only):** the visible chrome of the **search**, **filter chips** (All / Mine / Due this week), **Board/List toggle**, and **primary** is a compact ~22px "face" element; the interactive element (button/label) is a transparent ≥44px semantic hit target that centres the face — keeping the austere Swiss control scale while meeting the WCAG 2.2 44px target minimum. Filter chips and the Board/List toggle are `aria-pressed` controls (separate faced chips, not a clipped group); inactive = ink text on paper, **active = ink fill with paper text**; the **primary is the one cobalt-filled action** (the accent as emphasis). The **Retry**, **dismiss**, per-column **more-actions** icon buttons, and **Add a card** are **not** faced — they retain full ~44px visible chrome. Focus renders on the compact face for faced controls and on the control itself for the full-chrome controls.
- **Column:** a `<section>` region whose `aria-label` is the column name (the active column's label adds ", active column" so the showcased state is exposed programmatically). Its header has a marker (a **cobalt diamond** for the active column, a square ink **marker** for others), the uppercase sans name (`<h2>`), a tabular count, and an outlined "more actions" icon button (44px); below the rule, a vertical list of cards; a dashed "Add a card" button; and a dashed empty-state placeholder when the column has no cards. The active column (In Progress) carries the 2px cobalt rule.
- **Card** (flat near-square, 1px radius, no elevation, **never interactive**): sans title (`<h3>`, struck through when done), tiny uppercase monochrome labels with uniform ink dots, an optional checklist progress line, and a footer with the priority indicator, due date (cobalt with a check when done), and ink assignee avatars. **Selected** (`au-137`): a **full 2px cobalt border** + an `aria-label` of "{title}, selected" that exposes the showcased selection state (the article is not made interactive). Hover deepens the card border to `--ink-soft` (reduced-motion: still applies, it is a colour change).
- **Label:** tiny uppercase sans word with a leading uniform ink dot — meaning carried by text, never by dot colour.
- **Avatar:** paper initials on a uniform ink circle with a crisp 2px canvas/paper-coloured `border` that separates overlaps (no shadow ring); exposes the full name via `aria-label`. Two sizes: header team avatars are 28px, card assignees are 27px.
- **Empty state:** a dashed hairline placeholder with a small square mark ("No cards yet") renders in any column with zero cards — see the **In Review** column.

## Navigation patterns

This specimen is a single board with no route navigation. When extending to a full app, keep the header: brand chip + sans title + team avatars over a full-width hairline rule, with austere controls on the right. Use a vertical text-link rail (ink, underlined on hover) for board/account navigation rather than a coloured sidebar. Never use a coloured side-stripe, a shadow, or a gradient as an accent — use the cobalt diamond (reserved for the active/focal item), a hairline rule, a dot, or a leading icon. Separate stacked surfaces with hairline borders, never with elevation.

## Responsive behavior

- **Desktop (≥768px):** columns in a horizontal flex row; the board scrolls horizontally when columns overflow; the board-body scrollbar is thin (`scrollbar-width: thin`, `::-webkit-scrollbar`) in `--rule`. The scroller has `0.4rem` internal breathing room so focus perimeters on its controls are never clipped at the top or at either scroll extreme.
- **Mobile/tablet (<768px):** columns stack vertically; the control row wraps; no document-level horizontal overflow at 375/768/1280. Outer padding scales via `clamp`.
- Touch targets: every interactive control is a ≥44px target at all viewports (search field, primary, every filter chip, every Board/List segmented button, icon buttons, add-card, Retry, dismiss). For **search/filter/view/primary** the visible chrome stays compact (~22px face) because the face is a separate element centred inside the transparent 44px target. **Retry, dismiss, the more-actions icon buttons, and Add a card** are not faced; they keep their full ~44px visible chrome as the target.

## Interaction and motion

- Hover: card border deepens to `--ink-soft`; inactive controls' borders/text darken; the drag grip goes full-opacity on card hover. No transforms, no lifts, no shadow changes.
- Normal UI transitions (hover, focus, active-state fill) are **0.16s ease** colour transitions, gated behind `@media (prefers-reduced-motion: no-preference)`. Active filter/view gets the ink fill with paper text instantly.
- The loading skeleton's opacity pulse is a separate, slower **1.6s ease-in-out** loop, also gated behind `prefers-reduced-motion: no-preference`. It is the only repeating motion and has no reduced-motion counterpart by design (reduced-motion shows static skeleton bars).
- Reduced-motion users get a fully static board (transitions removed; skeleton static) with no loss of function.
- Never animate CSS layout properties; never use bounce/elastic easing; never introduce a shadow or gradient as a hover/state effect.

## States

The states below are **visual state/affordance demonstrations only**, not functional behavior. The **filter chips and the Board/List segmented toggle are `aria-pressed` toggle controls** — they reflect selection state in the specimen but perform no real filtering or view switch. **Search, Retry, New task, more-actions, add-card, and dismiss render their affordance but perform no real search, sync, creation, or dismissal.** The **drag grip is a static affordance** with no drag-and-drop logic. Cards are **never interactive** (no role/tabindex). Reuse these visual treatments when wiring real behavior:

- **Empty (shown):** a column with no cards renders a dashed hairline placeholder with a small square mark ("No cards yet") — see the **In Review** column.
- **Loading (shown):** a **skeleton card** with placeholder bars (in Backlog). The skeleton uses an **opacity pulse** (not a gradient shimmer) so it stays gradient-free. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline **flat paper banner** with a full `1px solid --rule-strong` hairline border — a cobalt warning icon, bold ink "Sync paused." label, ink-soft body, an ink Retry button, and a dismiss control (`role="status" aria-live="polite"`). **No red, no side-stripe.**
- **Drag/move affordance (shown, static):** every card has a **grip handle** (faint by default, full on hover, `cursor: grab`) as a visual affordance only — no drag-and-drop logic.
- **Done (shown):** completed cards show a **struck-through sans title**, a cobalt check icon, and a cobalt due-date treatment.
- **Priority (shown):** High = a **cobalt diamond** + cobalt word (`--accent`, AA — ≈5.8:1 on paper); Medium = a square ink dot + ink word (monochrome). The diamond is the second of the design's two diagonal uses.
- **Selection (shown, non-interactive):** the selected card (`au-137`) shows a **full 2px cobalt border** and is announced as "{title}, selected" via `aria-label` — never a side-stripe, never made interactive.
- **Validation:** when implementing real card-edit forms, reuse the cobalt label + inline message pattern under each field, rendered as an austere outlined control.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label="Kanban board">` (region); one `<section>` per column with an `<h2>` (the active column's region label adds ", active column"), cards as `<h3>` inside `<article>`. Heading order h1→h2→h3 is strict.
- All controls are real `<button>`/`<input>`; filters and view toggle carry `aria-pressed`; counts and icon buttons carry `aria-label`; icons are `aria-hidden`.
- **Showcased states are exposed programmatically without adding interaction:** the active column region's `aria-label` notes "active column"; the selected card's `aria-label` is "{title}, selected" (it remains a static article, not a widget).
- **Avatars expose the full name** via `aria-label` (initials alone are not enough; `title` is not reliably announced) — all five team members in the header and every assignee.
- **Visible focus:** `outline: 3px solid --accent` (cobalt) with `outline-offset: 2px`, ≥3:1 (the WCAG 2.2 UI-component minimum) against every paper surface, so keyboard focus is unmistakable. For the faced controls (search, filters, Board/List, primary) the ring renders on the **compact face**, not the 44px target, so it hugs the visible chrome; segmented groups have **no `overflow` clipping**, so every segmented button gets a **complete, unclipped focus perimeter**. The composite search field lights its face via `:focus-within`; the `<input>` remains the semantic focus target, with its own redundant outline suppressed. Inside the desktop horizontal board scroller, internal breathing room ensures focus perimeters on the column controls are never clipped at the top or at either scroll extreme.
- **WCAG 2.2 AA** is met by construction: near-black ink (L 0.22) on near-white paper (L ≈ 0.97–0.99), and paper text (L 0.99) on ink/cobalt fills (L ≈ 0.22–0.49), both give large contrast margins. Meta text uses `--ink-soft` (L 0.44) which stays ≥4.5:1 on paper; the single cobalt accent (`#1857c6`, ≈5.8:1 on paper) carries priority/done text and the cobalt primary fill carries paper text (≈5.4:1). Meaning is never conveyed by colour/shape alone (priority, status, and selection are always labelled or paired with a diamond + border; label dots are uniform).

## Extending the design to new pages

Keep the token set, single-sans typography, hairline-rule structure, 1px radii, and the cobalt diagonal motif (reserved for active/focal + high-priority) constant; adapt the layout shell. Any new surface is a flat paper panel (card/control recipe at 1px radius, `--rule` border) over the canvas, with the same tokens, cobalt focus ring, and motion rules. Apply a cobalt diamond to mark the active/focal item and a cobalt marker to flag high-importance items so the 45-degree motif remains the system's signature — but keep it to those two uses.

- **Settings / account page:** brand chip + sans title + team avatars over a hairline rule; a two-column shell (text-link nav rail + content). Form fields are austere outlined inputs (`--rule-strong` border, 44px height, 1px radius); the save bar is an ink-filled primary button (or a dashed cancel link). Separate sections with hairline rules, never cards-in-cards.
- **Auth / login:** centred single outlined paper card (1px radius, `--rule` border) on the canvas, framed by whitespace; inputs as above; cobalt "Sign in" primary button. Add a secondary "Create account" text link.
- **Tables / data views:** the table sits on the canvas; rows separated by `--rule-soft` (no zebra stripes, no shadows); a sticky header row with a 2px cobalt rule on the active/sorted column; filters reuse the outlined chip + segmented-control patterns.
- **Detail pages:** sans breadcrumb + title header over a hairline rule; metadata as tiny uppercase labels with uniform ink dots; related items as a horizontal scroll of flat near-square cards reusing the board-card recipe.
- **Dashboards:** KPI tiles reuse the card recipe (flat fill, `--rule` border, 1px radius, no shadow) — lead with a chart in a bordered panel, not a giant shadowed number. Mark the focal KPI with a cobalt diamond.

## Do / Don't

**Do**

- Build structure only from hairline borders and rules (header rule, active-column 2px cobalt rule, `--rule` card/control borders); keep all colours OKLCH and warm-tinted.
- Keep a single austere system sans at every level; create hierarchy through scale, weight, tracking, and precise alignment.
- Use cobalt only for the two diagonal markers (active column + high priority), the primary action, the active-column rule, the focus ring, and the error icon; keep label dots and avatars uniform ink; make selected filter/view an ink fill.
- Keep the diagonal to exactly those two showcased uses; expose the active-column and selected-card states via `aria-label` without making cards interactive.
- Give every interactive element the cobalt focus ring and ≥44px target; keep the horizontal scroller's focus perimeters unclipped with internal breathing room; convey state in text + structure, not colour/shape alone.

**Don't**

- Don't use box shadows, gradients, backdrop blur, translucency, glass, clay, or neumorphic relief — this is the flat Swiss direction. (Avatar overlap separation is a crisp border, never a shadow.)
- Don't use serif or monospace; don't use app-bar chrome or elevation shadows (that drifts to Editorial / Flat Material / Brutalism).
- Don't expand the diagonal motif beyond the active-column and high-priority markers (no header slash, brand, selection, or empty-state diamonds); don't use `#000`/`#fff`, gradient text, or a coloured side-stripe; don't convey selection with a side-stripe (use the full cobalt border).
- Don't render the error in red or as a side-stripe — use the flat paper banner with a cobalt icon and full hairline border.
- Don't use a gradient shimmer for loading skeletons; use the opacity pulse.
- Don't animate layout properties or use bounce/elastic easing; don't ship motion (including the skeleton pulse) without a reduced-motion fallback.

## When to use / avoid / trade-offs

- **Use** when the product wants a precise, high-craft, neutral surface that signals structure and craft — engineering tools, operations dashboards, design systems, and any brand that values grid discipline and a single disciplined graphic motif over decoration.
- **Avoid** when the brand demands warmth (editorial serif), expressiveness (illustration, neon), or raw provocation (brutalism), or when maximum information density per screen matters more than alignment discipline.
- **Trade-offs:** Swiss is the most neutral and performant direction (flat fills, no shadows/blur, no custom assets, robust contrast, framework-agnostic system fonts). Its restraint can read as austere next to bolder concepts, and the single cobalt diagonal must stay limited to two uses (active column + high priority) or it stops reading as Swiss. The comfortable density shows fewer cards per screen than a timetable-style board.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** A single system sans stack; icons are inline SVG; avatars are initials (no image assets); the diagonal motif is pure CSS (`transform: rotate(45deg)`). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review [empty], Done), 9 cards with labels, priority, checklist, due dates, and assignees. All five members render as accessible team avatars in the header. Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Warm near-white canvas (`oklch(0.97 0.004 90)`) sits behind every surface; brighter warm paper card/control surfaces (`oklch(0.99 0.003 90)`) hold cards and controls.
- [ ] All surfaces are flat fills; structure comes only from hairline borders and rules (header 1px rule, active-column 2px cobalt rule, `--rule` card/control borders). **No box shadows anywhere** (avatar overlaps use a crisp border), **no gradients, no `backdrop-filter`, no translucency**, no glass/clay/neumorphic relief.
- [ ] Cards are flat near-squares (`--rule` border, **1px radius**, no elevation) and **never interactive**; the selected card uses a **full 2px cobalt border** (`aria-label` "{title}, selected"), never a side-stripe.
- [ ] A single austere system sans at every level (no serif, no monospace); all colours OKLCH and warm-tinted; no `#000`/`#fff`; no gradient text; no coloured side-stripes; the palette is monochrome + one cobalt accent.
- [ ] The **45-degree diagonal** is reserved for exactly two cobalt markers: the **active column** (diamond + 2px cobalt rule) and **high priority** (diamond). No header slash, brand, selection, or empty-state diamonds.
- [ ] Cobalt is restricted to those two markers, the primary action fill, the active-column rule, the focus ring, and the error icon; selected filter/view chips use an ink fill; label dots and avatars are uniform ink.
- [ ] **All five team members** render as accessible avatars in the header (`aria-label` = full name); every assignee avatar exposes the full name.
- [ ] The active-column region and the selected card **expose their showcased state** via `aria-label` ("active column" / "selected") without becoming interactive.
- [ ] Every interactive control is a ≥44px target at all viewports. **Search, primary, every filter chip, and every Board/List segmented button** carry a compact ~22px face centred inside a transparent ≥44px target; **Retry, dismiss, the more-actions icon buttons, and Add a card** retain full ~44px visible chrome. Each has a real role/label.
- [ ] Focus renders as a complete, unclipped cobalt perimeter (`outline: 3px solid` + offset, ≥3:1 on paper) on every control — on the compact face for faced controls; segmented groups never clip with `overflow`; the search field lights its face via `:focus-within`; the horizontal board scroller keeps internal breathing room so its controls' focus perimeters are never clipped at the top or at either scroll extreme.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its paper background, including the cobalt priority/done text and the cobalt primary fill; state is conveyed in text + structure, not colour/shape alone.
- [ ] Layout is responsive: columns scroll horizontally on desktop and stack on mobile; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions are ≤0.16s ease colour changes and the skeleton opacity pulse is a 1.6s loop, both gated behind `prefers-reduced-motion: no-preference` (reduced-motion shows a fully static board); no layout-property animation; no bounce/elastic.
- [ ] The board content matches the locked `fixtures.ts` baseline; the empty-column state renders.
- [ ] Loading (skeleton with opacity pulse, gradient-free), error (flat paper banner with cobalt icon + full hairline border, no red/side-stripe), drag affordance (grip), empty, done (struck-through title + cobalt check), priority (cobalt diamond for High), and selection (full cobalt border + "selected" aria-label) states are all shown; the skeleton pulse respects `prefers-reduced-motion`.
