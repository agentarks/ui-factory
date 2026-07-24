# Kanban Board · ncurses Terminal — Design Handoff

A single-page Kanban board specimen rendered in the **ncurses / TUI** visual language: the dialog/midnight-commander aesthetic. This file is a self-contained handoff. It does not depend on the UI Factory browsing application; consume it on its own.

## Canonical page reference

A Kanban board for a small product team shipping "Aurora", rendered as a **ncurses dialog-window TUI form** (the midnight-commander aesthetic) — the identity is structural, not a reskin. A single reverse-video title/status bar carries the board title (`Aurora - Sprint 24 - Board`) and a bracketed `[ SEARCH ]` field. A thin control strip carries the filters/view toggles, `[ + New task ]`, and the team as bracketed cells. Four columns (Backlog → In Progress → In Review [empty] → Done) render as **bordered dialog windows** whose headers read `+- NAME [n] -+`; cards are **flat TUI rows** separated by border-bottom hairlines (not modern elevated cards), with inline bracketed fields, `[!HIGH]`/`[MED]` priority, `[2/3]` checklist, due text, and bracketed assignee initials. Demonstrated states: empty column (`+-- no items --+`), loading skeleton (TUI block rows), inline sync error with Retry/dismiss, a static drag token, selected card, active column, hover, focus, and reduced-motion. A bottom F-key + status strip is labelled an inactive key-map reference.

## Design principles

- **Terminal fidelity is structural.** The board must read as a classic ncurses application: a near-black terminal canvas, full monospace, a reverse-video title bar, bordered dialog windows with `+- ... -+` headers, and flat border-bottom rows with bracketed field/state notation. It must not look like a modern SaaS Kanban with a dark coat of paint.
- **Borders and reverse video carry depth.** No drop shadows, glow, gradients, or translucency. Surfaces are separated by solid/dashed rules and inverted bars.
- **Restrained ANSI semantics.** A small set of semantic hues (yellow active, red priority/error, green done) is used sparingly, always paired with text so meaning never relies on color alone.
- **Honesty about interactivity.** Search/filter/view controls toggle selection state only; cards are not re-filtered. The key legend maps to real specimen actions and introduces no fake destructive behavior.

## Color system (OKLCH)

All tokens are OKLCH. There is no pure black (`#000`) or pure white (`#fff`) anywhere — the canvas is tinted and the bar is a soft silver.

| Token           | Value                    | Role                                                                       |
| --------------- | ------------------------ | -------------------------------------------------------------------------- |
| `--canvas`      | `oklch(0.2 0.028 270)`   | Tinted near-black terminal background (cool indigo tint)                   |
| `--window`      | `oklch(0.235 0.028 270)` | Slightly raised window/panel surface (error banner, status footer)         |
| `--bar`         | `oklch(0.83 0.008 270)`  | Reverse-video header bar background (bright silver)                        |
| `--head`        | `oklch(0.32 0.018 270)`  | Reverse-video column title bar, dark fills (chips, avatars, primary)       |
| `--ink`         | `oklch(0.9 0.006 270)`   | Primary light text on dark surfaces                                        |
| `--ink-soft`    | `oklch(0.7 0.014 270)`   | Meta text (IDs, labels, dates, footer)                                     |
| `--on-bar`      | `oklch(0.2 0.012 270)`   | Dark text on the reverse-video bar; dark focus outline on the bar          |
| `--on-bar-soft` | `oklch(0.34 0.014 270)`  | Soft dark text/meta on the reverse-video bar                               |
| `--rule`        | `oklch(0.42 0.016 270)`  | Window/dialog borders and separators                                       |
| `--rule-soft`   | `oklch(0.3 0.014 270)`   | Card borders and dashed separators                                         |
| `--accent`      | `oklch(0.84 0.16 95)`    | Yellow — active column, selection, focus ring on dark surfaces, key glyphs |
| `--red`         | `oklch(0.7 0.19 25)`     | ANSI red — high priority, error marker/border, `SYNC: PAUSED` status       |
| `--green`       | `oklch(0.8 0.16 150)`    | ANSI green — done state                                                    |

Measured (real-pixel) sRGB luminance: canvas ≈ 0.008, window ≈ 0.013, head ≈ 0.033, bar ≈ 0.571. Contrast: primary light text (`--ink`) reads at ≈9–13:1 on the dark surfaces and ≈11:1 on the silver bar; meta text (`--ink-soft`) reads at ≈6–7:1; reverse-video bar dark text (`--on-bar`) reads at ≈7:1; column-heading light text on the dark head reads at ≈9:1. All semantic text roles pass WCAG 2.2 AA (≥4.5:1), verified by real-pixel audit against each role's opaque parent.

## Typography

A single monospace voice everywhere — there is no sans-serif fallback:

```css
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
```

- Board title: `0.86rem`, weight 700 (the reverse-video title-bar text).
- Column heading: `0.8rem`, weight 700, uppercased, framed as `+- NAME [n] -+` (the `+-`/`-+` and `[n]` are literal aria-hidden box-drawing markers).
- Card title: `0.82rem`, weight 600.
- Body/meta (IDs, fields, dates, checklist, footer): `0.62–0.78rem`, weight 600–700.
- F-key glyphs: weight 700, accent yellow.

No display fonts, no web fonts, no gradient text. Hierarchy comes from weight, bracket notation, and reverse video — not from size variation.

## Spacing, density, borders, radii, elevation

- **Density:** compact. Row padding `0.45rem 0.55rem`.
- **Spacing scale:** 4px base (`0.25 / 0.4 / 0.5 / 0.6rem`); 6px column/strip gaps.
- **Radii:** `0` everywhere (square corners are intrinsic to the terminal aesthetic).
- **Borders (the primary structural device):**
  - Dialog-window columns: `1px solid var(--rule)` on all four sides; active column = `1px solid var(--accent)`.
  - Column header: a dark reverse-video bar separated by a `1px solid` bottom border; active = yellow fill.
  - **Cards are flat TUI rows:** a non-selected card carries ONLY a `1px solid var(--rule-soft)` bottom hairline (no top/left/right border — not a boxed card). The selected card becomes a full `1px solid var(--accent)` box on all four sides (TUI cursor/selection), never a side-stripe.
  - Fields/assignees: `1px solid var(--rule)` bracket cells.
- **Elevation:** none. There are **zero box-shadows** anywhere — ncurses is flat. Depth is expressed entirely through borders and reverse video (this also distinguishes the style from glow/shadow-based directions).

## Layout and composition rules

- A single **reverse-video title/status bar** spans the top: the board title `Aurora - Sprint 24 - Board` on the left, a bracketed `[ SEARCH ]` field on the right.
- A thin **control strip** sits beneath it: bracketed filter toggles (`[ All ] [ Mine ] [ Due this week ]`), bracketed view toggles (`[ Board ] [ List ]`), a bracketed `[ + New task ]` cell, and the team as a row of bracketed `[initials]` cells on the right.
- The inline error banner sits under the control strip, above the board.
- Columns are **bordered dialog windows** laid out in a vertical stack on mobile and a horizontal scrollable row on tablet/desktop. Each window header reads `+- NAME [n] -+`; the active window's border and header turn yellow.
- Inside each window, cards are **flat TUI rows** separated by `border-bottom` hairlines: a main line (`id`, static drag token, title, inline `[field]` cells, `[!HIGH]`/`[MED]`) and a meta line (`[2/3]` checklist, `Due:` text, bracketed `[initials]` assignees). The selected row becomes a full-border box.
- A bottom **F-key + status strip** closes the board. It is visibly AND accessibly labelled as an **inactive key-map reference** (`aria-label` = "Inactive key-map reference and board status (display only, no active shortcuts)"; a visible `KEY MAP — reference, display only` note). The glyphs (`F1`, `F5`, `F7`, `/`, `B/L`) document specimen actions as plain `<span>`s — **not** `<kbd>`, no handlers. The status is consistent with the visible sync error (`SYNC: PAUSED` in red), never a false "READY".

## Navigation patterns

- Filter (`All / Mine / Due this week`) and view (`Board / List`) are bracketed toggle cells; each carries `aria-pressed` reflecting the current selection (pressed = reverse-video silver fill). They toggle selection state only — they do not re-filter cards.
- The search field, `[ + New task ]`, Retry, and dismiss are specimen affordances: visible, keyboard-operable, and focusable, but they perform no business behavior on the specimen. There are no per-column overflow menus or add-card buttons (the concept has none).
- The bottom F-key strip documents specimen actions (`F1` Help, `F5` Retry, `F7` New, `/` Search, `B/L` Board/List) as an **inactive key-map reference** — display-only labels, not active bindings. No handlers and no shortcuts exist.

## Component appearance and behavior

- **Title/status bar:** bright reverse-video silver strip (`--bar` bg, `--on-bar` dark text) with the board title and a bracketed `[ SEARCH ]` field. No project chip, avatar row, or modern segmented/primary chrome.
- **Control strip:** a thin dark strip holding the bracketed toggles, `[ + New task ]` (yellow border accent), and the team as bracketed `[initials]` cells (each `aria-label` = full name).
- **Dialog-window column:** solid-bordered box; its header is a dark reverse-video bar reading `+- NAME [n] -+` (the `+-`/`-+` and brackets are aria-hidden, so the heading's accessible name stays the column name). The active window swaps its border and header fill to yellow.
- **Card rows:** flat border-bottom rows; the selected row becomes a full yellow border box; done rows strike the title, tint it green, and prefix `[x]`.
- **Priority:** high = `[!HIGH]` in red; medium = `[MED]` in yellow.
- **Fields/assignees:** bracketed `[design]` / `[MR]` cells in soft ink with a `1px` border.
- **Checklist:** `[ done/total ]` in accent yellow.
- **Drag token:** a static `[..]` bracketed token (aria-hidden, `title="Drag to move"`), no grab cursor; its opacity lifts on hover.

## Empty, loading, and error states

- **Empty column (In Review):** a dashed bordered cell reading `+-- no items --+` (the `+--`/`--+` markers are aria-hidden; the DOM text is "no items").
- **Loading skeleton:** TUI block-element rows — solid ink-soft block bars (`skel-bar`) inside border-bottom rows that pulse opacity (0.22 ↔ 0.08) over 1.4s, gated behind `prefers-reduced-motion: no-preference`, so they are static under reduced motion.
- **Inline error:** a bordered alert strip with a full red border on all sides (never a colored side-stripe), a `[!]` red marker, a strong "Sync paused." lead, body copy, a `[ Retry / F5 ]` control, and a `[x]` dismiss. Announced via `role="status" aria-live="polite"`.

## Responsive behavior

- **Mobile (`< 48rem`):** dialog windows stack vertically; the title bar and control strip wrap. No horizontal document overflow.
- **Tablet/desktop (`≥ 48rem`):** windows become a horizontal scrollable row (`flex-direction: row; overflow-x: auto`); each window is `flex: 1 0 15rem`. The scroller carries `6px` internal padding on every side so the 5px focus extent (3px outline + 2px offset) of edge controls is never clipped.
- Type sizes are fixed across breakpoints; only layout reflows. A thin scrollbar is styled to match the rule color.

## Interaction and motion guidance

- **Hover** is a multi-channel cue gated behind `(hover: hover)`: a hovered card row takes a faint **cursor-row highlight** — a low-alpha accent (yellow) wash, `color-mix(in oklch, var(--accent) 14%, transparent)`, the ncurses/mc/htop "current row" idiom — and the static drag token `[..]` lifts to full opacity. Control cells brighten their border/text toward the accent yellow. The row wash is **excluded from `.is-selected`** so the stronger full-border selection treatment always wins, and the card title stays ≥4.5:1 over the wash. No transform, no shadow, no gradient — ncurses is flat. The wash lands instantly; only a 0.12s `background-color` transition eases it, and that transition is suppressed under `prefers-reduced-motion: reduce` (the instant wash remains). A tap on a touch device (`hover: none`) cannot leave a sticky state resembling selection.
- **Focus (two contexts):** every control shows a `3px solid` outline at `2px` offset via `:focus-visible`. The search field, on the **bright reverse-video title bar**, uses a **dark** outline (`--on-bar`) — a yellow ring would be invisible on silver (≈1:1). Controls on **dark surfaces** (filters, view, New task, Retry) keep the **yellow** accent (`--accent`), which reads at ≥3:1. The offset ring seats outside the control, so its contrast is measured against the surrounding strip/bar backdrop, not the control's own face.
- **Motion** is limited to 150ms `ease-out` transitions on border/color/background for controls, and the 1.4s skeleton opacity pulse. All non-essential motion is suppressed under `prefers-reduced-motion: reduce`.

## Accessibility requirements

- **WCAG 2.2 AA contrast** verified by real-pixel audit for every semantic text role against its opaque parent (text reads on the near-black canvas; bar text reads on the silver bar; legend reads on the window). All roles ≥ 4.5:1.
- **No color-only state:** priority is text + color (`[!HIGH]`); done is strikethrough + green + `[x]`; active column is a yellow border **and** yellow header **and** `aria-label` ("…, active column"); selection is a full yellow border box **and** the selected row's accessible name includes "selected".
- **Semantic structure:** `header`/`main`/`footer` landmarks; `h1` board title (`Aurora - Sprint 24 - Board`), `h2` column headings, `h3` card titles; the `+-`/`-+`/bracket markers are `aria-hidden` so names stay clean.
- **Keyboard:** all controls are native buttons/inputs, operable, with visible focus. Card rows are not interactive (`cursor: auto`, no pointer/grab).
- **Targets:** every interactive target (search field, filters, view toggle, New task, Retry, dismiss) is ≥ 44×44px at 375/768/1280, with no horizontal overflow.
- **Reduced motion:** skeleton pulse and transitions are suppressed; content remains fully visible and usable.

## Rules for extending the design to new pages

1. Keep the near-black canvas, full monospace, and zero-radius corners — these are the style's identity.
2. Render major regions as bordered dialog windows with `+- ... -+` reverse-video headers; render list items as flat border-bottom TUI rows, not modern elevated cards.
3. Use bracket notation for all fields and state labels (`[ design ]`, `[N]`, `[!HIGH]`, `[x]`); keep box-drawing/bracket markers `aria-hidden`.
4. Reach for the yellow accent for active/selection/focus only; use red for errors and high-priority, green for success/done. Keep semantic hues restrained and always paired with text.
5. Add depth with borders and reverse video, never with shadows, glow, gradients, or translucency.

## Do

- Use a reverse-video title bar for the page header, and dark reverse-video bars for dialog-window headers.
- Frame windows with a full border on all four sides; separate rows with `border-bottom` hairlines only; box only the selected row.
- Bracket every field, count, priority, and checklist value; keep `+-`/`-+`/bracket markers `aria-hidden`.
- Pair every semantic color with an explicit text/icon label.

## Do not

- Do not build a modern SaaS app-bar (project chip + segmented filters + elevated cards + card footers) and paint it dark — the identity is structural.
- Do not add box-shadows, glow, gradients, `backdrop-filter`, translucency, or colored side-stripes.
- Do not use pure black (`#000`) or pure white (`#fff`) anywhere.
- Do not introduce a second type voice (no sans-serif, no display fonts).
- Do not present footer glyphs as active key bindings — label the footer an inactive, display-only reference (no `<kbd>`, no handlers), and keep its status consistent with the real state (never a false "READY" while a sync error is shown).
- Do not rely on color, position, or motion alone to communicate state.
- Do not use cyan glow, graph-paper backgrounds, or technical-schematic notation (those belong to the published Holodeck and Blueprint styles).

## When to use / avoid / trade-offs

- **Use** when the product targets developers or technical operators, or when a focused, keyboard-first, low-chrome aesthetic reinforces the brand. Strong for CLIs, ops dashboards, and internal tools.
- **Avoid** for broad consumer audiences unfamiliar with terminal conventions, or where a warm, approachable, or marketing-forward tone is required.
- **Trade-offs:** the dense, bracket-heavy notation and full monospace increase character density and reduce scanning speed for long prose. The retro aesthetic may read as "dated" to non-technical users. Mobile width is tighter because bracket characters and monospace consume more horizontal space — mitigated by stacking columns and wrapping the bar.

## Dependencies, assets, and licenses

- **Dependencies:** none. Pure semantic HTML/Svelte 5 + scoped CSS.
- **Fonts:** native monospace system stack only (`ui-monospace, …`). No web fonts are loaded.
- **Assets:** none. All markers, grips, and icons are inline SVG or ASCII/bracket characters.
- **License:** the repository declares **no license** — there is no `LICENSE` file and no `license` field in `package.json`. Treat the content as all-rights-reserved until a license is added.

## AI acceptance checklist

- [ ] Canvas is tinted near-black (not pure `#000`); no pure white anywhere.
- [ ] A reverse-video title bar (silver bg + dark text) carries the title + a bracketed `[ SEARCH ]` field — no modern app-bar/segmented/project-chip chrome.
- [ ] Every element uses the monospace stack; no sans-serif leaks in.
- [ ] Columns are bordered dialog windows whose headers read `+- NAME [n] -+`; active window = yellow border + yellow header.
- [ ] Cards are flat `border-bottom` TUI rows (no top/left/right border); the selected row is a full-border box.
- [ ] Fields, counts, priority, and checklists use bracket notation; `+-`/`-+`/bracket markers are `aria-hidden`.
- [ ] Yellow active/selection and focus-on-dark, red priority/error, green done — each paired with text.
- [ ] The search field shows a DARK focus outline (≥3:1 on the silver bar, complete perimeter); dark-surface controls keep yellow focus.
- [ ] Zero box-shadows, zero gradients, zero `backdrop-filter`, zero colored side-stripes.
- [ ] Clearly distinct from Holodeck (cyan glow) and Blueprint (graph paper, technical notation).
- [ ] All five team members render as accessible bracketed cells; empty In Review (`+-- no items --+`), loading skeleton (TUI block rows), inline error + Retry/dismiss, static drag token, done, priority, selected, hover, focus, and reduced-motion are all present.
- [ ] Filter/view controls carry `aria-pressed`; the F-key strip is labelled an inactive key-map reference (display only, no `<kbd>`, no handlers) and its status matches the sync error (no "READY").
- [ ] WCAG 2.2 AA verified for every text role; all interactive targets ≥ 44×44px at 375/768/1280; no horizontal overflow; reduced motion suppresses the skeleton pulse.
