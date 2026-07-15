# Kanban Board — Glassmorphism

A single-page Kanban board for a small product team, rendered in a **glassmorphism** visual language: frosted, translucent panels floating over a vibrant gradient mesh, softened by backdrop blur, hairline borders, and gentle glow.

- **Page type:** data-management (project board)
- **Theme / density:** light / comfortable
- **Subject:** 4 columns — Backlog → In Progress → In Review → Done — with realistic cards carrying titles, labels, assignee avatars, due dates, and counts, under a board header with search, filters, and view controls.

## Visual language

The signature is **translucent frosted glass over color**. Depth comes from layered blur, hairline-light borders, and soft shadows — never from heavy solid fills.

### The glass recipe

Apply this to every panel (header, columns). It is the heart of the direction:

```css
.panel {
	background: rgba(255, 255, 255, 0.55);
	border: 1px solid rgba(255, 255, 255, 0.6);
	border-radius: 20px; /* 22px for the header, 14px for cards */
	box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);

	-webkit-backdrop-filter: blur(18px) saturate(180%);
	backdrop-filter: blur(18px) saturate(180%);
}
```

- **White at 0.55 alpha** keeps panels readable while still letting the gradient show through.
- **`saturate(180%)`** compensates for the desaturation that blur introduces, so the color behind the glass stays vivid instead of washing grey.
- **Hairline `rgba(255,255,255,0.6)` border** sells the "glass edge" — a 1px light rim catches the implied light source.
- **Cards** use the same recipe at smaller radius with **white 0.62** (slightly more opaque) and `blur(10px)` so card text stays crisp on top of the column.

### Backdrop-filter fallback (required)

`backdrop-filter` is not universal. Always pair it with an opaque fallback so panels never become unreadable:

```css
@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
	.panel {
		background: rgba(255, 255, 255, 0.88);
	}
}
```

### The vibrant field

The gradient is a **mesh of soft radial blobs over a diagonal base**, fixed to the viewport so it stays stable while columns scroll:

```css
background:
	radial-gradient(at 16% 20%, oklch(0.7 0.2 290) 0px, transparent 55%),
	radial-gradient(at 84% 12%, oklch(0.78 0.18 350) 0px, transparent 52%),
	radial-gradient(at 78% 80%, oklch(0.74 0.16 230) 0px, transparent 55%),
	radial-gradient(at 22% 86%, oklch(0.78 0.15 165) 0px, transparent 52%),
	linear-gradient(135deg, oklch(0.62 0.17 275), oklch(0.66 0.16 320) 48%, oklch(0.72 0.16 355));
background-attachment: fixed;
```

The base `linear-gradient` keeps minimum luminance high so no dark holes form — this is what lets dark ink pass AA even before the glass is drawn.

## Color

| Token             | Value                   | Use                                        |
| ----------------- | ----------------------- | ------------------------------------------ |
| `--ink`           | `oklch(0.26 0.035 285)` | Card titles, primary text                  |
| `--ink-soft`      | `oklch(0.42 0.03 285)`  | Meta text: due dates, counts, subtitles    |
| `--ink-faint`     | `oklch(0.5 0.03 285)`   | Placeholder text                           |
| `--accent-strong` | `oklch(0.5 0.17 285)`   | Active filters, focus ring, primary button |
| `--hair`          | `rgba(255,255,255,0.6)` | All hairline borders                       |

**Accent gradients** (project chip, primary button): `linear-gradient(135deg, oklch(0.54 0.18 292), oklch(0.54 0.17 340))`, with a soft colored glow shadow.

### Label tones

Each label is a **light frosted tint with dark ink** (never a saturated chip with white text). This pair is what keeps the catalog's AA baseline on a translucent surface. Representative pairs:

| Tone   | Background             | Ink       |
| ------ | ---------------------- | --------- |
| violet | `rgba(124,92,255,.16)` | `#3a2a92` |
| teal   | `rgba(20,150,150,.16)` | `#135f5f` |
| blue   | `rgba(56,120,240,.16)` | `#1f4fb0` |
| green  | `rgba(34,160,90,.16)`  | `#1a6638` |
| amber  | `rgba(200,140,20,.18)` | `#75510a` |
| red    | `rgba(210,55,55,.16)`  | `#8a2424` |

(Same pattern for slate, indigo, pink, rose, cyan.) The ink colors sit near L 0.3–0.4 on a near-white tint — comfortably above 4.5:1.

### Avatars

Initials in a 34px (26px on cards) circle, white text on `oklch(0.46 0.13 <hue>)`. The **0.46 lightness** is deliberate: it is the lowest L that still looks like a friendly mid color while keeping white initials above 4.5:1 at small sizes. A 2px white rim separates overlapping avatars.

## Typography

- System UI stack (`-apple-system, …, system-ui, sans-serif`) — no external fonts, so the preview is fully self-contained.
- Board title 1.15rem / weight 750; column headings 0.92rem / 700; card titles 0.88rem / 620; meta 0.72–0.76rem.
- `font-synthesis: none`.

## Layout

- **Header** (glass, 22px radius): project chip + title + team avatars on the left; search, filter chips, board/list toggle, and a primary "New task" on the right. Wraps on narrow widths.
- **Board body**: a flex row of columns on ≥768px with horizontal scroll (authentic Kanban); columns stack vertically below 768px.
- **Column** (glass, 20px radius): heading with a colored dot (`--accent` per column), count chip, and a "more actions" button; a vertical list of cards; a dashed "Add a card" affordance.
- **Card** (glass, 14px radius): optional priority bar (3px left edge — red for high, amber for medium), title, label chips, optional checklist progress, and a footer with due date + assignee avatars.

## Accessibility

- Semantic landmarks: `<header>` for the board, `<section aria-label="Kanban board">`, one `<section>` per column with an `<h2>`, cards as `<h3>` inside `<article>`.
- All controls are real `<button>`/`<input>` elements; filters and view toggles carry `aria-pressed`, counts carry `aria-label`, icons are `aria-hidden` with labelled control parents.
- **Visible focus:** `outline: 2px solid var(--accent-strong); outline-offset: 2px;` on every interactive element.
- **AA contrast** is maintained by the design, not by exception: dark ink over a high-opacity frosted white panel, light-tint label chips with dark ink, and a deliberately bright gradient field so dark text never lands on a dark region.
- Avatars and priority bars are decorative; meaning (labels, due dates) is always conveyed in text.

## Motion

Motion is minimal and reserved for affordance feedback (card lift on hover, button hover). All transitions are gated behind `@media (prefers-reduced-motion: no-preference)`, so users who prefer reduced motion get a fully static board with no loss of function.

## Content

The board ships "Aurora — Sprint 24": 9 cards across Backlog (3), In Progress (2), In Review (2), Done (2). Each entry owns its fixture copy; see `fixtures.ts` for the full card, label, member, and due-date data.
