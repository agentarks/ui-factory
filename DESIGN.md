# UI Factory Design Context

This root file governs the UI Factory browsing application. It must not be copied as a catalog export. Every entry owns a separate `src/lib/designs/<slug>/DESIGN.md` that describes that design's independent visual language and is delivered byte-for-byte to consumers.

## Direction

A project owner compares detailed page previews on a laptop or tablet in ordinary working light. The factory should recede around those previews, so use a restrained light interface with high legibility, quiet structure, and one cool accent reserved for action and focus.

## Visual system

### Color

Use a restrained palette of subtly cool OKLCH neutrals. Avoid pure white and black.

| Role       | Value                    | Use                                  |
| ---------- | ------------------------ | ------------------------------------ |
| Canvas     | `oklch(0.98 0.006 255)`  | Application background               |
| Surface    | `oklch(0.995 0.003 255)` | Header and raised controls           |
| Text       | `oklch(0.22 0.015 255)`  | Primary content                      |
| Muted text | `oklch(0.5 0.018 255)`   | Supporting metadata                  |
| Border     | `oklch(0.9 0.012 255)`   | Dividers and control outlines        |
| Accent     | `oklch(0.55 0.16 255)`   | Primary action, selection, and focus |
| Danger     | `oklch(0.55 0.18 25)`    | Errors only                          |

Keep accent coverage below ten percent of the interface. Screenshots and previews retain their own colors and must not be tinted by the factory.

### Typography

Use the native system sans-serif stack. Favor 400 for body text, 500 for controls and labels, and 650 to 700 for primary headings. Use a compact fixed scale with clear contrast:

- Page title: `2rem`, tight line height
- Section title: `1.25rem`
- Body and controls: `1rem`
- Metadata: `0.875rem`

Cap explanatory prose at 70 characters per line. Do not use display fonts, gradient text, or oversized marketing headlines.

### Spacing and shape

Use a 4px base unit with 8, 12, 16, 24, 32, 48, and 64px steps. Let major sections breathe while keeping metadata compact. Controls use 8px radii; preview frames and major surfaces may use 12px. Prefer dividers and spacing over card containers. Do not nest cards.

## Composition

- Use a shallow header with product identity and only necessary global actions.
- Lead catalog pages with a direct heading, a short status line when useful, then visual results.
- Give previews most of the available area; metadata supports rather than competes with them.
- Keep primary export action close to the entry identity and quality status.
- Use stable, predictable placement for search, filters, viewport controls, and state controls when those features exist.
- Keep the empty catalog centered on the next useful understanding, not on decoration or disabled controls.

## Components and states

- Buttons and links use familiar browser semantics, visible hover and active feedback, and a clear `:focus-visible` ring.
- Inputs retain visible labels. Placeholder text never replaces a label.
- Status is conveyed with text as well as color.
- Loading preserves page structure with quiet skeletons; avoid blocking spinners when content shape is known.
- Error messages state what failed and the available recovery action.
- Copy and download controls appear only for a real, qualified export and confirm success without a modal.
- Motion communicates state in 150 to 250ms with an ease-out curve. Respect reduced-motion preferences.

## Responsive behavior

- Start with a single-column mobile reading order.
- Collapse secondary metadata before reducing preview usefulness.
- Replace side-by-side regions with stacked regions when either becomes cramped.
- Use structural breakpoints for gallery columns and detail layout; keep type sizes fixed.
- Preserve touch targets of at least 44 by 44px and prevent horizontal page scrolling.

## Accessibility

Meet WCAG 2.2 AA contrast and interaction expectations. Use semantic landmarks and headings, keyboard-operable controls, visible focus, descriptive labels, meaningful image alternatives, and announcements for asynchronous copy or load results. Never rely on motion, position, or color alone to communicate state.

## Avoid

- Decorative gradients, glass effects, and heavy shadows
- Metric dashboards, feature theater, or fake catalog content
- Identical promotional card grids
- Factory styling leaking into entry previews
- Custom controls where native behavior is clearer
- Decorative animation or orchestrated page entrances
