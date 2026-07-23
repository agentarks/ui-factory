# Kanban Board · Luminous Putty

**Version** 1.0.0 · **Slug** `kanban-claymorphism` · **Page type** data-management

**Visual intent:** a compact dark claymorphism Kanban board with a deep indigo canvas, a darker app bar, medium-dark indigo cards and controls, light lavender text, transparent column bodies, and restrained violet glow. Small radii and tight spacing keep the layered putty treatment crisp rather than candy-like. Dark theme, WCAG 2.2 AA, system sans for UI text, and monospace only for compact metrics, counts, and dates.

> The board content is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): the same columns, cards, labels, members, due dates, and empty-column state. Only the visual language changes between styles.

## Canonical page reference

A Kanban board for a small product team: a board header with project identity, team avatars, search, filters, view controls, and a primary action over four columns, Backlog, In Progress, In Review, and Done. In Review is empty to demonstrate the empty state. The other columns contain realistic cards with titles, labels, optional priority and checklist information, due dates, and assignee avatars.

## Design principles

1. **Dark putty, not pastel slabs.** The canvas is deep indigo, the app bar is darker, and cards, column headers, controls, empty states, and skeletons use one medium-dark indigo surface with light lavender text.
2. **Open columns.** Column bodies are transparent and have no fill, shell, padding, radius, or elevation. Only each compact header and its cards are raised, so the board stays visually light and dense.
3. **Clay depth stays restrained.** Raised objects use dark and lavender inset shading, a thin violet inset ring, a low-alpha violet glow, and a short dark cast shadow. Pressed objects invert the vertical inset direction.
4. **Compact geometry.** Main radii stay between 6px and 10px, card padding is `0.6rem 0.65rem`, and desktop columns are 16rem wide. Full 44px hit boxes do not require visually tall controls.
5. **Color supports text.** Stage, label, priority, done, and error colors are paired with text, icons, or tactile state. Color is never the only signal.

## Color system

All named color tokens are OKLCH. Shadow layers use the exact translucent RGB values shown in the elevation section.

| Token             | Value                   | Role                                                                   |
| ----------------- | ----------------------- | ---------------------------------------------------------------------- |
| `--canvas`        | `oklch(0.22 0.055 272)` | Deep indigo page and exposed board background                          |
| `--bar-bg`        | `oklch(0.17 0.05 273)`  | Darker app bar and segmented tracks                                    |
| `--surface`       | `oklch(0.3 0.058 275)`  | Cards, controls, column headers, empty state, and skeleton             |
| `--surface-hover` | `oklch(0.33 0.06 275)`  | Declared surface variant; the current hover rules do not recolor faces |
| `--ink`           | `oklch(0.88 0.025 285)` | Primary light lavender text on dark surfaces                           |
| `--ink-soft`      | `oklch(0.7 0.04 285)`   | Secondary text, metadata, labels, placeholders, and inactive controls  |
| `--ink-faint`     | `oklch(0.5 0.03 285)`   | Decorative grip handle                                                 |
| `--accent`        | `oklch(0.65 0.09 280)`  | Focus outline                                                          |
| `--accent-fill`   | `oklch(0.46 0.1 280)`   | Primary and selected-control fill                                      |
| `--on-accent`     | `oklch(0.92 0.02 285)`  | Text on accent fills and avatar initials                               |
| `--accent-soft`   | `oklch(0.42 0.07 280)`  | Declared darker accent; the current focus rule uses `--accent`         |
| `--danger`        | `oklch(0.72 0.16 25)`   | Error icon and emphasized error text                                   |
| `--danger-soft`   | `oklch(0.25 0.05 25)`   | Error-banner background                                                |
| `--done`          | `oklch(0.72 0.14 152)`  | Completed due-date treatment                                           |
| `--pri-high`      | `oklch(0.72 0.16 25)`   | High-priority dot and text                                             |
| `--pri-medium`    | `oklch(0.75 0.14 65)`   | Medium-priority dot and text                                           |

Additional fixed colors:

- Label faces use `oklch(0.26 0.04 275)`. A 6px dot supplies the label tone: violet `oklch(0.65 0.12 285)`, teal `oklch(0.65 0.12 180)`, blue `oklch(0.65 0.12 250)`, slate `oklch(0.62 0.02 275)`, indigo `oklch(0.65 0.12 270)`, green `oklch(0.65 0.12 152)`, pink `oklch(0.65 0.12 350)`, amber `oklch(0.7 0.12 70)`, rose `oklch(0.65 0.12 15)`, red `oklch(0.65 0.12 25)`, and cyan `oklch(0.65 0.12 200)`.
- Stage dots are slate `oklch(0.62 0.03 275)`, blue `oklch(0.62 0.1 250)`, amber `oklch(0.7 0.12 70)`, and green `oklch(0.62 0.1 152)`.
- Avatars use `oklch(0.48 0.09 <fixture hue>)` with `--on-accent` initials.
- Skeleton bars use `rgba(140, 130, 210, 0.12)`. Card-foot separators use `rgba(110, 100, 170, 0.18)`.
- There are no gradients, backdrop filters, translucent content faces, pure-black fills, pure-white fills, or gradient text. The shadow recipes do use translucent black for shade and cast layers.

## Typography

- **UI text:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`.
- **Metrics, counts, and dates:** `ui-monospace, 'SF Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace`.
- Board title: `1.05rem`, weight 700, line-height 1.2.
- Column heading and card title: `0.82rem`; headings use weight 700 and card titles use 650 with line-height 1.3.
- Controls: `0.76rem` to `0.82rem`; subtitle `0.72rem`; labels `0.62rem`; priority `0.66rem`; mono metrics `0.68rem`, weight 600.
- `font-synthesis: none` prevents synthetic weights.

## Spacing, density, elevation, and radii

**Density is compact.** Canvas padding is `clamp(0.75rem, 2.5vw, 1.1rem)`. The app bar uses `0.65rem clamp(0.65rem, 1.5vw, 0.85rem)`. Cards use `0.6rem 0.65rem`, card-list gaps are `0.45rem`, label gaps are `0.25rem`, and column headers use `0.4rem 0.6rem`.

Radii are exact tokens:

- `--r-card: 9px`
- `--r-control: 8px`
- `--r-header: 7px`
- `--r-board: 10px`
- Segmented and icon buttons: 6px
- Labels and the empty mark: 5px
- Skeleton bars: 4px
- Count badges, label skeletons, and circular avatars/dots use pill or circular radii.

Elevation uses these exact recipes:

```css
--clay:
	inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(140, 130, 210, 0.2),
	inset 0 0 0 1.5px rgba(110, 100, 170, 0.3), 0 0 10px rgba(100, 80, 200, 0.12),
	0 3px 8px rgba(0, 0, 0, 0.3);

--clay-sm:
	inset 0 -1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(140, 130, 210, 0.15),
	inset 0 0 0 1px rgba(110, 100, 170, 0.25), 0 0 6px rgba(100, 80, 200, 0.08),
	0 2px 4px rgba(0, 0, 0, 0.2);

--clay-pressed:
	inset 0 2px 4px rgba(0, 0, 0, 0.35), inset 0 -1px 2px rgba(140, 130, 210, 0.1),
	inset 0 0 0 1px rgba(110, 100, 170, 0.2);

--clay-hover:
	inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(140, 130, 210, 0.25),
	inset 0 0 0 1.5px rgba(110, 100, 170, 0.35), 0 0 14px rgba(100, 80, 200, 0.16),
	0 5px 12px rgba(0, 0, 0, 0.35);

--clay-accent:
	inset 0 -2px 4px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(180, 170, 240, 0.25),
	inset 0 0 0 1.5px rgba(120, 110, 190, 0.35), 0 0 10px rgba(100, 80, 200, 0.18),
	0 3px 8px rgba(0, 0, 0, 0.3);
```

Use `--clay` for cards, the app bar, and the error banner; `--clay-sm` for compact raised controls, headers, labels, avatars, and the project chip; `--clay-pressed` for tracks, selected controls, counts, empty states, and the skeleton; `--clay-hover` for eligible hover states; and `--clay-accent` for the primary action.

## Layout and composition

- The deep indigo canvas is continuous behind the board.
- The darker app bar wraps two flex rows as space narrows. It uses a 10px radius and `--clay`.
- The error banner is another compact 10px raised surface below the bar.
- Column bodies are transparent and open. Each column consists of a raised 7px-radius header, a 0.45rem-gap card list, and no enclosing slab.
- Below 48rem, columns stack vertically. At 48rem and above, the board becomes a horizontally scrolling flex row and each column is `flex: 0 0 16rem`.
- Board-level overflow stays inside `.board-body`; the document does not scroll horizontally at 375px, 768px, or 1280px.

## Navigation patterns

This specimen has no route navigation. In a larger product, keep global navigation in a compact `--bar-bg` bar on the indigo canvas. Use medium-dark `--surface` controls, an accent-filled current item or a pressed state, and the same 6px to 10px radius range. Keep content regions open instead of enclosing every page or navigation group in a large raised slab. Never use a colored side stripe.

## Components and behavior

- **App bar:** darker indigo, 10px radius, `--clay`; contains a compact project chip, board title and subtitle, 30px overlapping avatars, search, filter and view groups, and the primary action.
- **Search:** 44px raised `--surface` wrapper with light text. Focus uses `3px solid var(--accent)` at `outline-offset: 2px`; the input's redundant outline is suppressed.
- **Segmented controls:** a `--bar-bg` track with 3px padding and `--clay-pressed`. Buttons have a 44px border box, a visually compact 38px face created by a 3px transparent border plus `background-clip: padding-box`, and a 6px radius. Active options use `--accent-fill`, `--on-accent`, and `--clay-pressed`.
- **Primary:** `--accent-fill`, `--on-accent`, 44px minimum height, 8px radius, and `--clay-accent`.
- **Column header:** `--surface`, 7px radius, `--clay-sm`; contains a 9px stage dot, heading, pressed count badge, and overflow control.
- **Icon buttons:** 44px square border boxes with a compact 36px visual face created by a 4px transparent border plus `background-clip: padding-box`; radius 6px and `--clay-sm`.
- **Card:** `--surface`, 9px radius, `0.6rem 0.65rem` padding, and `--clay`; contains title, labels, optional checklist, priority, due state, and 24px assignee avatars.
- **Label:** a tiny 5px-radius `oklch(0.26 0.04 275)` pill with light text, `--clay-sm`, and a 6px pastel dot.
- **Add card and Retry:** real 44px-minimum buttons using `--surface` and `--clay-sm`.
- **Empty state:** a `--surface` pressed well with a 16px inset mark and text.
- **Loading skeleton:** a `--surface` pressed card with compact lavender placeholder bars.

## Responsive behavior

- **Mobile and tablet below 48rem:** columns stack; app-bar groups wrap; outer padding contracts through `clamp`.
- **Desktop at 48rem and above:** 16rem columns sit in one horizontal flex row with contained horizontal scrolling.
- The board uses a thin 8px WebKit scrollbar and `scrollbar-width: thin`; the thumb is `oklch(0.4 0.04 275)`.
- Search, primary, Retry, Add card, all filter/view controls, and all icon buttons expose at least a 44px target. Transparent borders preserve the approved 38px segmented face and 36px icon face inside those hit boxes.
- The direct preview has no document-level horizontal overflow at 375px, 768px, or 1280px.

## Interaction and motion

- Hover-capable devices swap eligible card and raised-control shadows to `--clay-hover` without recoloring the face. Cards lift 1px.
- The primary's hover shadow is the accent recipe with lavender inset alpha `0.3`, violet ring alpha `0.4`, glow `0 0 14px rgba(100, 80, 200, 0.22)`, and cast `0 5px 12px rgba(0, 0, 0, 0.35)`; it also lifts 1px.
- Cards, chips, segmented buttons, primary, Add card, icon buttons, Retry, project chip, and labels transition shadow, background, color, and transform over `0.18s ease-out` only under `prefers-reduced-motion: no-preference`.
- Hover rules are additionally gated by `(hover: hover)`.
- Skeleton bars pulse opacity from 1 to 0.45 and back over `1.6s ease-in-out infinite`, only when reduced motion is not requested.
- Under reduced motion, transform and transition motion disappear, the skeleton is static, and immediate shadow-state feedback remains.

## States

These states demonstrate appearance. Only filter chips and Board/List update `aria-pressed`; they do not filter cards or change the layout. Search, New task, More actions, Add a card, Retry, and Dismiss are inert specimen affordances. The grip is not wired to drag-and-drop.

- **Selection:** accent-filled, light-text control with `--clay-pressed`.
- **Empty:** In Review shows the pressed `--surface` empty well.
- **Loading:** Backlog shows a gradient-free pressed skeleton with a reduced-motion-aware opacity pulse.
- **Error:** the inline `--danger-soft` status banner uses coral icon/emphasis, light body text, Retry, and Dismiss.
- **Hover:** eligible faces keep their resting background while shadow depth increases; cards lift 1px when motion is allowed.
- **Priority:** High and Medium use colored text plus matching dots.
- **Done:** completed due dates use `--done` plus a check icon.
- **Drag affordance:** each card includes a faint six-dot grip that becomes fully opaque on hover.
- **Focus:** all semantic inputs and buttons receive the visible violet outline.

## Accessibility

- Structure uses `<header>`, `<main>`, a labelled board section, one section and `<h2>` per column, and `<article>` cards with `<h3>` titles.
- Controls are native buttons and an input. Toggle states use `aria-pressed`; icon buttons have accessible names; counts include visually hidden units; avatars expose full names; decorative icons are hidden from assistive technology.
- The error banner uses `role="status"` and `aria-live="polite"`.
- Focus uses `outline: 3px solid var(--accent)` and `outline-offset: 2px` for buttons and search `:focus-within`. It remains visible against the dark app bar and medium-dark control surfaces. The focused input remains the semantic target.
- Current E2E coverage audits each text role against its actual opaque parent at a minimum 4.5:1 ratio, including title, metadata, labels, avatars, priority, done, error, search placeholder, selected and inactive controls, and primary text.
- All tested interactive targets are at least 44px at 375px, 768px, and 1280px. The compact face is preserved inside the larger transparent border box.
- Stage, priority, done, error, and label colors are paired with text, icons, or tactile state; meaning does not rely on color alone.

## Extending the design to new pages

Keep the exact color, radius, type, focus, and shadow tokens. Prefer an open canvas with individually raised controls and content objects instead of large filled panel shells.

- **Settings and account:** use a compact darker app bar, an open two-column layout, medium-dark 8px-radius fields with 44px target boxes, and accent-filled selection and Save states.
- **Authentication:** center one 9px-radius `--surface` form card using `--clay`; use medium-dark fields, light labels, the existing focus ring, and an accent primary.
- **Tables and data views:** leave the table region open on the canvas; raise the compact header and filter controls with `--clay-sm`; use the existing 1px indigo separator for rows and monospace only for numeric values.
- **Detail pages:** use a compact raised title/header row followed by separate 9px-radius content objects. Reuse tiny dark labels with pastel dots for metadata.
- **Dashboards:** use 9px-radius medium-dark modules sparingly. Keep gaps compact, avoid a hero-metric layout, and do not wrap the full dashboard in a raised slab.
- New interactive controls must keep a 44px border box, visible violet focus, native semantics, and reduced-motion behavior. A transparent border plus background clipping may preserve a smaller visual face.

## Do / Don't

**Do**

- Use the exact deep-indigo canvas, darker bar, medium-dark surface, and light lavender ink tokens.
- Keep column bodies transparent and raise only headers, cards, controls, states, and the app bar.
- Use the exact clay shadow recipes and 6px to 10px radii.
- Use tiny dark labels with a pastel dot and readable text.
- Keep content dense while preserving 44px targets through transparent border boxes where needed.
- Use accent fill for primary and selected controls; use pressed shadow as a supporting tactile cue.
- Preserve native semantics, visible focus, AA text, and reduced-motion handling.

**Don't**

- Do not introduce bright L 0.84 pastel card faces, pale controls, or raised filled column slabs.
- Do not increase cards or structural radii to 14px.
- Do not put dark ink on card faces; primary card and control text is light lavender.
- Do not recolor cards on hover; change shadow and, when motion is allowed, translate by 1px.
- Do not add gradients, backdrop blur, glass, large neon bloom, illustration, colored side stripes, gradient text, external fonts, or binary assets.
- Do not make the label face pastel; keep the face dark and use the 6px dot for tone.
- Do not shrink semantic hit boxes below 44px to achieve compactness.

## When to use / avoid / trade-offs

- **Use** for creative and productivity tools that benefit from a compact, tactile dark interface with more material character than flat UI.
- **Avoid** for print-like light products, extremely high-density tables where layered shadows become noise, or products that require almost invisible styling.
- **Trade-offs:** five-layer raised shadows cost more paint work than flat borders; the dark palette requires disciplined AA checks; horizontal desktop columns intentionally scroll inside the board; and 44px hit boxes occupy layout space even when transparent borders keep their visible faces compact. Keeping glow restrained avoids drifting into the catalog's separate dark-neon direction.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** The implementation uses Svelte, native CSS, system font stacks, inline SVG, and text initials. It adds no package dependency or third-party asset.
- **Licensing:** this repository declares no license, with no `LICENSE` file and no `package.json` `license` field. The source is unlicensed/all-rights-reserved by default under copyright. Confirm the consuming repository's license before adoption.

## Content baseline

`fixtures.ts` is copied verbatim from the locked shared Kanban baseline (`kanban-glassmorphism/fixtures.ts`): 5 members, 4 columns (Backlog, In Progress, In Review empty, and Done), and 9 cards with labels, priority, checklist, due dates, and assignees. Only the visual language changes.

## Acceptance checklist for implementation agents

- [ ] Canvas is `oklch(0.22 0.055 272)`, app bar is `oklch(0.17 0.05 273)`, and cards and controls are `oklch(0.3 0.058 275)` with `oklch(0.88 0.025 285)` primary text.
- [ ] Column bodies are transparent and open; compact raised headers and cards sit directly on the canvas.
- [ ] Cards are 9px, controls 8px, column headers 7px, and app bar/error banner 10px; segmented and icon buttons are 6px.
- [ ] The exact `--clay`, `--clay-sm`, `--clay-pressed`, `--clay-hover`, and `--clay-accent` recipes are used; no gradients, blur, glass, bright pastel faces, or large raised column shells are added.
- [ ] Labels use `oklch(0.26 0.04 275)`, light text, 5px radius, and a 6px pastel dot.
- [ ] System sans carries UI text and system monospace is limited to compact metrics, counts, and dates.
- [ ] Selection uses `--accent-fill`, `--on-accent`, and `--clay-pressed`; inactive controls remain medium-dark.
- [ ] Hover leaves the face background unchanged, swaps to the documented shadow, and lifts cards and primary by only 1px when reduced motion is not requested.
- [ ] Focus is a 3px `--accent` outline at 2px offset on buttons and search; text roles meet WCAG 2.2 AA against their actual backgrounds.
- [ ] Every interactive target is at least 44px. Segmented controls preserve a 38px visual face with a 3px transparent border; icon buttons preserve a 36px visual face with a 4px transparent border; both use `background-clip: padding-box`.
- [ ] Columns stack below 48rem and become contained horizontal 16rem columns at 48rem and above; there is no document overflow at 375px, 768px, or 1280px.
- [ ] Empty, loading, error, drag affordance, done, priority, selection, hover, focus, and reduced-motion states are represented.
- [ ] Board content matches the locked fixture baseline; dependencies, assets, and licensing status remain as declared above.
