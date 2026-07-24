# Kanban Board · ncurses Terminal — Design Handoff

A single-page Kanban board specimen rendered in the **ncurses / TUI** visual language: the dialog/midnight-commander aesthetic. This file is a self-contained handoff. It does not depend on the UI Factory browsing application; consume it on its own.

## Canonical page reference

A Kanban board for a small product team shipping "Aurora": a board header (project identity, sprint title, team avatars, search, filter and view controls, and a primary New task action), four columns (Backlog → In Progress → In Review [empty] → Done), and cards with title, bracketed labels, assignee avatars, due dates, checklist progress, priority, and done state. Demonstrated states: empty column, loading skeleton, inline sync error with Retry/dismiss, drag affordance, selected card, active column, hover, focus, and reduced-motion behaviour. A compact bottom function/status legend maps key hints to the real specimen actions.

## Design principles

- **Terminal fidelity over decoration.** The board should read as a classic ncurses application: a near-black terminal canvas, full monospace, reverse-video bars, bordered dialog windows, and bracketed field/state notation. It must not look like a "dark mode website."
- **Borders and reverse video carry depth.** No drop shadows, glow, gradients, or translucency. Surfaces are separated by solid/dashed rules and inverted bars.
- **Restrained ANSI semantics.** A small set of semantic hues (yellow active, red priority/error, green done) is used sparingly, always paired with text so meaning never relies on color alone.
- **Honesty about interactivity.** Search/filter/view controls toggle selection state only; cards are not re-filtered. The key legend maps to real specimen actions and introduces no fake destructive behavior.

## Color system (OKLCH)

All tokens are OKLCH. There is no pure black (`#000`) or pure white (`#fff`) anywhere — the canvas is tinted and the bar is a soft silver.

| Token           | Value                    | Role                                                                 |
| --------------- | ------------------------ | -------------------------------------------------------------------- |
| `--canvas`      | `oklch(0.12 0.014 270)`  | Tinted near-black terminal background (cool indigo tint)             |
| `--window`      | `oklch(0.155 0.014 270)` | Slightly raised window/panel surface (error banner, status legend)   |
| `--bar`         | `oklch(0.83 0.008 270)`  | Reverse-video header bar background (bright silver)                  |
| `--head`        | `oklch(0.3 0.016 270)`   | Reverse-video column title bar, dark fills (chips, avatars, primary) |
| `--ink`         | `oklch(0.9 0.006 270)`   | Primary light text on dark surfaces                                  |
| `--ink-soft`    | `oklch(0.7 0.014 270)`   | Meta text (IDs, labels, dates, legend)                               |
| `--on-bar`      | `oklch(0.2 0.012 270)`   | Dark text on the reverse-video bar                                   |
| `--on-bar-soft` | `oklch(0.34 0.014 270)`  | Soft dark text/meta on the reverse-video bar                         |
| `--rule`        | `oklch(0.42 0.016 270)`  | Window/dialog borders and separators                                 |
| `--rule-soft`   | `oklch(0.3 0.014 270)`   | Card borders and dashed separators                                   |
| `--accent`      | `oklch(0.84 0.16 95)`    | Yellow — active column, selection, focus ring, key hints             |
| `--red`         | `oklch(0.7 0.19 25)`     | ANSI red — high priority, error marker/border                        |
| `--green`       | `oklch(0.8 0.16 150)`    | ANSI green — done state, READY status                                |

Contrast: because the canvas is very dark, light text reads at ≥7:1; meta text (`--ink-soft`) reads at ≥6:1. The reverse-video bar (`--bar`) with dark text (`--on-bar`) reads at ≈8:1. All roles pass WCAG 2.2 AA (≥4.5:1), verified by real-pixel audit.

## Typography

A single monospace voice everywhere — there is no sans-serif fallback:

```css
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
```

- App/board title: `1.05rem`, weight 700, letter-spacing `-0.01em`.
- Column heading: `0.8rem`, weight 700, uppercased and bracketed (`[ BACKLOG ]`).
- Card title: `0.82rem`, weight 600.
- Body/meta (IDs, labels, dates, checklist, legend): `0.62–0.78rem`, weight 600–700.
- Key hints: weight 700, accent yellow.

No display fonts, no web fonts, no gradient text. Hierarchy comes from weight, bracket notation, and reverse video — not from size variation.

## Spacing, density, borders, radii, elevation

- **Density:** compact. Card padding `0.6rem 0.65rem`; card list gap `0.5rem`.
- **Spacing scale:** 4px base (`0.25 / 0.4 / 0.5 / 0.6 / 0.75rem`).
- **Radii:** `0` everywhere (square corners are intrinsic to the terminal aesthetic). Avatars are square blocks, not circles.
- **Borders (the primary structural device):**
  - Window/dialog columns: `1px solid var(--rule)` on all four sides; the reverse-video title bar is separated by a `1px solid var(--rule)` bottom border.
  - Cards: `1px solid var(--rule-soft)`; selected card = `1px solid var(--accent)`.
  - Card foot separator: `1px dashed var(--rule-soft)`.
  - Active column: border becomes `1px solid var(--accent)`.
- **Elevation:** none. There are **zero box-shadows** anywhere — ncurses is flat. Depth is expressed entirely through borders and reverse video. (This also distinguishes the style from glow/shadow-based directions.)

## Layout and composition rules

- The reverse-video app bar spans full width at the top, wrapping its two rows (identity/title/team on the left; search/filters/view/primary on the right).
- The inline error banner sits directly under the bar, above the board.
- Columns are bordered dialog windows laid out in a vertical stack on mobile and a horizontal scrollable row on tablet/desktop.
- Each window has a reverse-video title bar (`[ NAME ]` + `[count]` + active tag + more-actions), then a padded card list, then a dashed `[ ADD A CARD ]` affordance.
- Cards are bordered mini-windows: top row (id + drag grip), title, bracketed `[label]` fields, bracketed `[2/3]` checklist, dashed foot separator with priority/due + assignee blocks.
- A bottom status legend closes the board: key hints on the left, a status line on the right.

## Navigation patterns

- Filter (`All / Mine / Due this week`) and view (`Board / List`) controls are grouped segmented groups; each carries `aria-pressed` reflecting the current selection. They toggle selection state only — they do not re-filter cards.
- The search field and New task / Retry / dismiss / more-actions / add-a-card controls are specimen affordances: visible, keyboard-operable, and focusable, but they perform no business behavior on the specimen.
- The bottom legend documents key bindings (`[N]` New, `[/]` Search, `[B/L]` Board/List, `[F5]` Retry) as honest hints tied to those real controls — no invented destructive F-key behavior.

## Component appearance and behavior

- **App bar:** bright reverse-video silver bar with dark text; `[AURORA]` project chip is a dark bracketed block.
- **Team avatars:** square dark blocks with light initials and a `1px` border; overlapping blocks separated by negative margin.
- **Column window:** solid-bordered box with a dark reverse-video title bar; active column swaps its border (and the title bar's bottom separator) to yellow and shows an `<ACTIVE>` tag.
- **Count badge:** bracketed `[N]` in the title bar.
- **Cards:** bordered windows; selected card has a full yellow border (never a side-stripe); done cards strike the title and tint it green with a `[x]` marker.
- **Priority:** high = `[!HIGH]` in red; medium = `[MED]` in yellow.
- **Labels:** bracketed `[design]` fields in soft ink.
- **Checklist:** `[ done/total ]` with the word "subtasks".
- **Drag grip:** six-dot SVG, static (no grab cursor); revealed on hover.

## Empty, loading, and error states

- **Empty column (In Review):** a dashed bordered window containing `[ -- no cards -- ]` in soft ink.
- **Loading skeleton:** a bordered placeholder card with solid ink-soft block bars (`skel-title`, two `skel-label`, `skel-foot`) that pulse opacity (0.28 ↔ 0.10) over 1.4s — gated behind `prefers-reduced-motion: no-preference`, so it is static under reduced motion.
- **Inline error:** a bordered alert window with a full red border on all sides (never a colored side-stripe), a `[!]` red marker, a strong "Sync paused." lead, body copy, a Retry control (dark reverse button), and a dismiss icon. Announced via `role="status" aria-live="polite"`.

## Responsive behavior

- **Mobile (`< 48rem`):** single-column vertical stack; the app bar wraps; controls reflow. No horizontal document overflow.
- **Tablet/desktop (`≥ 48rem`):** columns become a horizontal scrollable row (`flex-direction: row; overflow-x: auto`); each column is `flex: 1 0 15rem`. The scroller carries `6px` internal padding on every side so the 5px focus extent (3px outline + 2px offset) of edge-flush controls is never clipped.
- Type sizes are fixed across breakpoints; only layout reflows. A thin scrollbar is styled to match the rule color.

## Interaction and motion guidance

- **Hover** (non-selected cards) is a multi-channel cue gated behind `(hover: hover)`: the border brightens to the accent yellow. No fill change, no transform — ncurses is flat. A tap on a touch device (`hover: none`) cannot leave a sticky state resembling selection.
- **Focus:** every button shows a `3px solid var(--accent)` outline at `2px` offset via `:focus-visible`; the search field shows a container outline via `:focus-within`.
- **Motion** is limited to 150ms `ease-out` transitions on border/color/background for controls, and the 1.4s skeleton opacity pulse. All non-essential motion is suppressed under `prefers-reduced-motion: reduce`.

## Accessibility requirements

- **WCAG 2.2 AA contrast** verified by real-pixel audit for every semantic text role against its opaque parent (text reads on the near-black canvas; bar text reads on the silver bar; legend reads on the window). All roles ≥ 4.5:1.
- **No color-only state:** priority is text + color (`[!HIGH]`); done is strikethrough + green + `[x]`; active column is a yellow border **and** an `<ACTIVE>` tag **and** `aria-label` ("…, active column"); selection is a yellow border **and** the selected card's accessible name includes "selected".
- **Semantic structure:** `header`/`main`/`footer` landmarks; `h1` board title, `h2` column headings, `h3` card titles; lists for avatars, labels, and assignees.
- **Keyboard:** all controls are native buttons/inputs, operable, with visible focus. Cards are not interactive (`cursor: auto`, no pointer/grab).
- **Targets:** every interactive target (search label, filters, view toggle, New task, Retry, dismiss, more-actions, every add-a-card) is ≥ 44×44px at 375/768/1280, with no horizontal overflow.
- **Reduced motion:** skeleton pulse and transitions are suppressed; content remains fully visible and usable.

## Rules for extending the design to new pages

1. Keep the near-black canvas, full monospace, and zero-radius corners — these are the style's identity.
2. Frame every major region as a bordered dialog window with a reverse-video title bar; frame leaf items as bordered mini-windows.
3. Use bracket notation for all fields and state labels (`[ name ]`, `[N]`, `[!HIGH]`, `[x]`).
4. Reach for the yellow accent for active/selection/focus only; use red for errors and high-priority, green for success/done. Keep semantic hues restrained and always paired with text.
5. Add depth with borders and reverse video, never with shadows, glow, gradients, or translucency.

## Do

- Use reverse-video bars for headers and column titles.
- Use full borders on all sides for windows; use dashed rules for soft separators (card foot, empty state, add-a-card).
- Bracket every field, count, priority, and checklist value.
- Keep square corners and square avatar blocks.
- Pair every semantic color with an explicit text/icon label.

## Do not

- Do not add box-shadows, glow, gradients, `backdrop-filter`, translucency, or colored side-stripes.
- Do not use pure black (`#000`) or pure white (`#fff`) anywhere.
- Do not introduce a second type voice (no sans-serif, no display fonts).
- Do not invent fake destructive F-key behavior; the legend maps only to real specimen actions.
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
- [ ] Every element uses the monospace stack; no sans-serif leaks in.
- [ ] Header bar and column title bars are reverse-video (bright bg + dark text / dark bg + light text).
- [ ] Columns and cards are bordered dialog windows on all four sides (box-rule framing).
- [ ] Fields, counts, priority, and checklists use bracket notation.
- [ ] Yellow active/selection/focus, red priority/error, green done — each paired with text.
- [ ] Zero box-shadows, zero gradients, zero `backdrop-filter`, zero colored side-stripes.
- [ ] Clearly distinct from Holodeck (cyan glow) and Blueprint (graph paper, technical notation).
- [ ] All five team members render as accessible avatars; empty In Review, loading skeleton, inline error + Retry/dismiss, drag affordance, done, priority, selected, hover, focus, and reduced-motion are all present.
- [ ] Filter/view controls carry `aria-pressed`; the bottom legend maps only to real specimen actions (no fake destructive behavior).
- [ ] WCAG 2.2 AA verified for every text role; all interactive targets ≥ 44×44px at 375/768/1280; no horizontal overflow; reduced motion suppresses the skeleton pulse.
