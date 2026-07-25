# SaaS Analytics · Flow Field

**Version** 1.0.0 · **Slug** `dashboard-saas-flowfield` · **Page type** dashboard
**Visual intent:** a calm SaaS product-analytics dashboard on warm tinted paper whose background is a **generative `<canvas>` particle flow-field** — particles drift along a smooth pseudo-flow field behind the data. The wow mechanic is data-reactive: **particle drift speed subtly scales with the Active-users delta**. Cards/surfaces are calm, **opaque**, hairline-bordered, floating on top of the flow-field so all data text stays AA against its surface. A single restrained indigo accent carries every data-viz stroke, the primary fill, and the focus ring. Under `prefers-reduced-motion` the canvas hides entirely and only the clean static cards remain — a beautiful static fallback, not a frozen animation. Light theme, comfortable density.

> This entry copies the locked SaaS baseline from `dashboard-saas-slate` **verbatim** (`fixtures.ts`): the five Aurora members, four KPIs with mixed up/down deltas, two locked 12-point monthly series, a four-segment plan breakdown, and five top accounts. Only the visual language changes.

## Canonical page reference

A product-analytics dashboard for **Aurora**: a sticky header (logo + breadcrumb "Product analytics", a "Last 30 days" range pill, five team avatars MR/DC/PN/SO/LF, and an indigo Export primary); four KPI cards (MRR $48,200 +6.4%; Active users 12,840 +3.1%; Trial→Paid 3.8% −0.4pp; Churn 1.9% +0.2pp — up is bad) each with a value, a directional delta (▲/▼), and a small sparkline; a dual-series trend chart (MRR + Active users, 12 months) as real inline SVG with a subtle grid; a revenue-by-plan donut (Pro/Team/Enterprise/Free); a five-row top-accounts table with hairline rows; and a metric rail with a **Q3 MRR goal** status indicator, a loading skeleton, an empty/anomaly segment, and a seats KPI. An inline error+retry banner sits under the header. Behind everything, a decorative `<canvas>` renders the drifting particle flow-field whose speed carries the active-users delta.

## Design principles

1. **Calm and generative.** A warm tinted paper canvas (hue ≈ 75, very low chroma) is the calm backdrop; the flow-field is the only expressive element and it never touches the data. The dashboard reads first; the motion is atmosphere.
2. **One restrained indigo accent, used like a scalpel.** Indigo (`oklch(0.5 0.12 280)`) lands only on the MRR line, the Pro donut segment, the logo dot, the goal bar, sparklines, and the Export primary. Emerald (positive) and rose (negative) are reserved for semantic deltas — always paired with an up/down arrow + text, never color alone.
3. **Opaque, hairline-bordered surfaces over the field.** Cards are flat opaque `--surface` panels defined by 1px `--border` hairlines and spacing, floating above the canvas. Depth comes from borders and the field behind, never from shadows or translucency. There is **no box-shadow at rest**.
4. **Data drives the motion.** The flow-field's drift speed is a function of the active-users delta (the data-reactive hook), so the dashboard's most alive metric literally sets the tempo behind the data. The mapping is documented and exposed as a data attribute.
5. **Reduced motion is a first-class state.** When the user prefers reduced motion the canvas hides entirely and only the clean static cards remain — a complete, beautiful dashboard with zero animation.

## Color system (OKLCH)

| Token             | Value                   | Role                                                                               |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `--canvas`        | `oklch(0.975 0.008 75)` | Warm tinted-paper page background (also the canvas-at-rest backdrop)               |
| `--surface`       | `oklch(0.992 0.005 75)` | Panels, KPI cards, inputs, table header (opaque, over the flow-field)              |
| `--surface-2`     | `oklch(0.98 0.006 75)`  | Hover fill, badge/chip backgrounds                                                 |
| `--surface-3`     | `oklch(0.952 0.009 75)` | Skeleton placeholder bars, goal track                                              |
| `--border`        | `oklch(0.905 0.008 75)` | 1px hairlines on every panel/card/divider                                          |
| `--border-strong` | `oklch(0.86 0.012 75)`  | Hover border, raised emphasis                                                      |
| `--text`          | `oklch(0.24 0.012 75)`  | Primary ink (≈16:1 on surface)                                                     |
| `--muted`         | `oklch(0.45 0.014 75)`  | Secondary text, axis labels, meta (≈6.5:1)                                         |
| `--faint`         | `oklch(0.49 0.014 75)`  | Tertiary text, placeholder, account IDs (≈5.4:1)                                   |
| `--accent`        | `oklch(0.5 0.12 280)`   | Indigo — MRR line, donut Pro segment, logo dot, goal fill, flow-field particles    |
| `--accent-ink`    | `oklch(0.4 0.12 280)`   | Darker indigo — Export fill, links, active-segment text, focus (≈7.5:1 on surface) |
| `--pos`           | `oklch(0.42 0.11 155)`  | Positive delta text/sparkline (≈7.5:1 on surface)                                  |
| `--neg`           | `oklch(0.4 0.14 25)`    | Negative delta text/sparkline, error icon (≈9.5:1 on surface)                      |
| `--on-accent`     | `oklch(0.99 0.004 75)`  | Near-white text on indigo/primary fills                                            |
| `--chart-grid`    | `oklch(0.885 0.009 75)` | Trend chart grid lines                                                             |
| `--chart-users`   | `oklch(0.57 0.014 75)`  | Active-users secondary line                                                        |
| `--track`         | `oklch(0.91 0.009 75)`  | Donut track                                                                        |
| `--err-bg`        | `oklch(0.95 0.022 25)`  | Error banner surface                                                               |
| `--err-border`    | `oklch(0.74 0.1 25)`    | Error banner border                                                                |

- **Neutrals are warm** (hue ≈ 75) at very low chroma (≤ 0.014), giving a paper-like, slightly warm cast clearly distinct from the published cool-slate direction. No pure grey/black/white anywhere — ink floors at L 0.24, canvas tops at L 0.975.
- **`--accent` (L 0.5)** is reserved for data-viz strokes, fills, the logo dot, the goal bar, and the flow-field particles. All text and primary fills use **`--accent-ink` (L 0.4, ≈7.5:1)** for stronger contrast and clearer small-text legibility.
- **Avatar fills** sit at L 0.42 (chroma 0.1) so near-white initials clear AA on every hue (7.5–8.7:1 measured). Five hues: MR 250, DC 210, PN 30, SO 180, LF 300.
- **Plan/donut segment colors:** Pro `--accent`, Team `oklch(0.55 0.09 300)`, Enterprise `oklch(0.68 0.012 75)`, Free `oklch(0.82 0.01 75)` — a calm indigo-to-neutral ramp, no rainbow.
- **Flow-field particles** are `oklch(0.54 0.1 280 / 0.16)` — the indigo accent at low alpha over the warm paper, so they read as atmosphere, never as data. The canvas is decorative only (`aria-hidden`, `pointer-events:none`).

## Typography

- **System-grotesque stack** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) for headings, body, controls, and labels. Tight negative tracking on headings: `−0.02em` on the brand/logo and KPI values, `−0.012em` on panel titles. Font-weight 500/600 — never 700. Antialiased (`-webkit-font-smoothing: antialiased`).
- **Monospace stack** (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) for every numeral, ID, timestamp, axis label, eyebrow, and metric: KPI values, deltas, sparklines, donut center, table MRR/account IDs, chart axis labels, range pills, segmented toggle, eyebrows. Tabular numerals (`font-feature-settings: 'tnum'`).
- **Scale:** KPI value 25px / 600 · panel title 13.5px / 600 · brand 14.5px / 600 · table cell 13px / 400 · eyebrow 10.5px / 600 uppercase tracked 0.085em · body 14px / 400. Hierarchy through scale + weight + tracking, not color.

## Spacing, density, radii, borders, elevation

- **Density:** comfortable. Body padding 22px 28px (18px 14px on mobile); panel padding 14–16px; KPI padding 15px 16px; gaps 14px between panels, 6px within KPI cards.
- **Radii:** panels/KPI cards/mini = **11px**; buttons/inputs/segmented/search/chips = **8px**; status badges/avatars/goal-bar = **9999px** (pill, tiny only); donut swatch = **3px**. Small, crisp radii throughout.
- **Borders:** **1px `--border` hairline** on every panel, KPI card, table row, divider, input, and control outline. The sticky header gets a 1px bottom border. Hover raises border to `--border-strong`. There are **no borders thicker than 1px** (no side-stripes, no accent rules).
- **Elevation:** **no box-shadow at rest** — surfaces are hairline-first and the flow-field supplies the atmosphere. The only depth cue beyond borders is the canvas itself drifting behind opaque cards. No glow, no cast shadows, no layered shadows, no backdrop blur (the header is opaque so controls stay on a single light context).

## Layout and composition

- A full-width sticky header over a max-1320px centered body. The body is a vertical stack: error banner → KPI row (4-up) → grid-main (trend chart 1.95fr + donut 1fr) → grid-sub (top-accounts table 1.95fr + metric rail 1fr).
- The `.dash-root` is `position: relative; overflow: hidden`. The flow-field `<canvas>` is `position: absolute; inset: 0; z-index: 0` sized to the root; all content sits in a `.fg` wrapper at `z-index: 1`. Cards are opaque `--surface`, so the flow-field is visible only in the calm gaps and margins between cards — never behind data text.
- The two 2-column grids collapse to single-column under 1080px. The KPI row wraps to 2×2 under 760px. The table scrolls horizontally on narrow viewports.

## Navigation patterns

This specimen is a single dashboard with no route navigation. When extending: keep the opaque warm-paper sticky header (brand + breadcrumb + range + primary action + avatar menu) and add a slim left nav rail or top tab strip in the same hairline style. Never use a colored side-stripe — use a dot, chip, or leading icon. Panel-on-panel surfaces are separated by 14px gaps and 1px borders, never by translucency or shadow. Keep controls on the light surface (no dark control bar) so a single focus treatment suffices everywhere.

## Components and states

- **Header** (sticky, opaque warm paper): logo dot + "Aurora" + "Product analytics" breadcrumb; "Last 30 days" range pill; 1px vertical divider; five team avatars (2px surface-colored ring); indigo Export primary.
- **KPI card:** eyebrow label · mono value · directional delta (▲/▼, colored, with text) · monospace caption ("vs previous 30 days" / "up is unfavorable"). A small 72×24 sparkline (computed from the 12-point series) sits beside the value.
- **Trend chart:** real inline SVG (viewBox 760×290). Subtle grid, monospace axis labels, indigo MRR area+line with dots and an end-point ring, a muted secondary active-users polyline. A range segmented toggle (7D/30D/90D/12M) and legend sit in the panel header.
- **Donut:** inline SVG with four `stroke-dasharray` segments (computed from plan percentages), a track ring, and a mono center label ("$48.2k MRR"). A legend lists each plan with swatch, value, and percent.
- **Top-accounts table:** five hairline rows — account (+ mono ID), plan chip, right-aligned mono MRR, status badge (Healthy/At risk/New, always text + dot, never color alone), owner avatar + name.
- **Metric rail:** four mini panels — **Q3 MRR goal** (value + percent + indigo goal bar + status note), Net revenue retention (loading skeleton), Anomalies (empty state), Seats sold (value + positive delta).
- **Goal/status indicator:** the Q3 MRR goal mini panel shows `$48.2k of $50k`, a 96% readout with an up arrow and an accessible "on track" label, an indigo 6px goal bar, and a "On track — 2 weeks remaining." note.
- **Flow-field canvas:** decorative `<canvas>` behind all content. Particles drift along a smooth pseudo-flow field (layered trig); particle drift speed is `0.42 × (1 + active-users-delta/10)` — the data-reactive hook. `aria-hidden="true"`, `pointer-events:none`, hidden entirely under reduced motion.
- **Status badges:** pill (9999px) with a 6px dot + text. `s-pos` (green dot, Healthy), `s-neg` (red dot, At risk), `s-acc` (indigo dot, New). Badge text is always `--text` on `--surface-2`.

## Empty, loading, and error states

These are **visual state demonstrations** (the specimen is static; controls reflect state but perform no real behavior):

- **Loading (shown):** the **Net revenue retention** mini panel shows skeleton bars (`.sk`) with an opacity pulse (1.5s) and a "Crunching cohort data…" note. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline banner under the header — red icon, "Live sync interrupted." strong label, explanation, **Dismiss** and **Retry** buttons (`role="status" aria-live="polite"`). No side-stripe; a full pale-red panel with a 1px red border.
- **Empty/filtered (shown):** the **Anomalies** mini panel shows an empty state — check icon, "No anomalies in range", supporting copy.
- **Goal/status (shown):** the **Q3 MRR goal** mini panel — a status indicator with a progress bar and an "on track" accessible label.
- **Validation:** when wiring real forms (settings, filters), reuse the inline message-under-field pattern with the `--neg` label.

## Responsive behavior

- **Desktop (≥1080px):** KPI row 4-up; trend chart + donut side by side; table + rail side by side; flow-field visible in all gaps.
- **Tablet (760–1080px):** KPI row 4-up; trend/donut and table/rail collapse to single column; flow-field fills the taller column gaps.
- **Mobile (<760px):** KPI row wraps to 2×2; header wraps; table scrolls horizontally. No document-level horizontal overflow at 375/768/1280.
- **Touch targets:** every interactive control ≥44×44 at all viewports (Export, range pill, every segmented button, Retry, Dismiss, filter-accounts search, View all link).

## Interaction and motion

- The **flow-field** is the primary motion. Particle drift speed carries the active-users delta via `FLOW_SPEED = 1 + ACTIVE_DELTA/10` (≈1.31 for the locked 3.1% delta); the hook is exposed as `data-active-delta` and `data-flow-speed` on the root and documented in the handoff. The field is decorative only and never conveys data alone.
- Hover: KPI cards transition border→`--border-strong` and background→`--surface-2`; buttons transition background/border/color. All **0.16s** `cubic-bezier(0.4, 0, 0.2, 1)`, gated behind `prefers-reduced-motion: no-preference`.
- The skeleton opacity pulse is a separate **1.5s ease-in-out** loop, also reduced-motion-gated.
- The range segmented toggle reflects `aria-pressed` selection but performs no real range switch (visual-specimen only).
- **Reduced motion:** the canvas hides entirely (`display:none`) and all animation is suppressed; the static dashboard remains complete and beautiful.
- Never animate layout properties; never use bounce/elastic; never ship motion without a reduced-motion fallback.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label>` per region (KPIs, trend, revenue, top accounts) + `<aside aria-label>` for the rail. Charts are `role="img"` with descriptive `aria-label`.
- All controls are real `<button>`/`<input>`/`<a>`; the segmented toggle carries `aria-pressed`; the range pill and filter input carry `aria-label`; icons are `aria-hidden`.
- **The flow-field canvas is `aria-hidden="true"` and `pointer-events:none`** — it is pure decoration and never conveys data. It is hidden entirely under reduced motion.
- **Avatars expose the full name** via `aria-label` (initials alone are insufficient). Deltas expose direction + favourability via `aria-label` ("MRR: 6.4% up, favorable").
- **Visible focus:** `outline: 3px solid var(--accent-ink)` with `outline-offset: 2px` on every interactive element — indigo reads ≥3:1 against all light surfaces. The chart-range `.seg` container uses `overflow: visible` (end buttons are rounded directly) so the offset ring is never clipped.
- **WCAG 2.2 AA** is met by construction and verified by a real-pixel contrast audit. Because every text role sits on an **opaque** card/header/banner surface over the canvas, contrast is audited directly against the card surface (the decorative flow-field never sits behind text). Ink ≈16:1, muted ≈6.5:1, faint ≈5.4:1, positive delta ≈7.5:1, negative delta ≈9.5:1, accent-ink text/links ≈7.5:1, avatar initials 7.5–8.7:1. **Deltas never rely on color alone** — each carries an ▲/▼ arrow glyph + text and an accessible label.
- Status meaning is always text + dot, never color alone.

## Extending the design to new pages

Keep the token set, the hairline-first elevation rule, the opaque-over-flow-field rule, and the two-type-voice system constant; adapt the layout shell. Any new surface is a flat opaque `--surface` panel (11px radius, 1px `--border`) over `--canvas`; keep the flow-field behind, visible only in gaps.

- **Settings / account:** opaque header + a two-column shell (slim nav rail + content). Form fields are 44px-tall 8px-radius inputs with 1px borders; save bar is a footer row with the indigo primary. Toggles reuse the segmented-control recipe.
- **Auth / login:** centered single panel on `--canvas`; inputs as above; indigo "Sign in" primary (`--accent-ink` fill, `--on-accent` text); secondary "Create account" text link in `--accent-ink`.
- **Tables / data views:** reuse the hairline-row table recipe (1px `--border` dividers, no zebra, mono right-aligned numerics, sticky header row). Filters reuse the search field + chip + segmented patterns.
- **Detail pages:** breadcrumb + title header in the panel-h style; metadata as labelled chips; related items as a horizontal scroll of KPI-style cards.
- **More charts:** every chart is entry-owned inline SVG (no charting dependency). Reuse the grid + axis + indigo-primary-line + muted-secondary-line recipe. Keep sparklines as tiny SVG polylines computed from data. Keep the data-reactive flow-field as an optional backdrop whose speed may bind to any single featured metric.

## Do / Don't

**Do**

- Keep cards **opaque** `--surface` panels over the flow-field so text always reads against a known backdrop; let the field show only in gaps.
- Reserve the indigo accent for data-viz strokes, the primary fill, the logo dot, the goal bar, sparklines, the flow-field particles, and focus — use `--accent-ink` (darker) whenever indigo appears as text.
- Pair every semantic delta with an up/down arrow glyph + text and an accessible label; never communicate state by color alone.
- Keep the flow-field decorative: `aria-hidden`, `pointer-events:none`, never the sole carrier of data; hide it entirely under reduced motion.
- Keep all colors OKLCH, warm-tinted (hue ≈ 75); no `#000`/`#fff`.

**Don't**

- Don't place translucent text-bearing surfaces over the canvas — if a surface must be translucent, audit AA by compositing over the canvas-at-rest first.
- Don't use box-shadow, glow, gradients, gradient text, graph-paper grids, colored side-stripes, or backdrop blur.
- Don't use `--accent` (L 0.5) as text on light surfaces — step down to `--accent-ink`.
- Don't ship motion (including the flow-field and skeleton pulse) without a `prefers-reduced-motion` fallback.
- Don't add a charting library or any dependency — charts are inline SVG and the flow-field is plain canvas.

## When to use / avoid / trade-offs

- **Use** for B2B SaaS analytics, product dashboards, and business-intelligence surfaces that want a calm, crafted read with a subtle generative personality — the "alive but restrained" direction. A strong choice when the brand wants a distinctive, modern, data-reactive atmosphere without sacrificing legibility.
- **Avoid** when the deployment environment bans JavaScript/canvas (the static fallback is clean but the signature is the motion), when the brand demands a strict enterprise neutrality (use the cool-slate direction), or when a dark operational aesthetic is required (use a dark direction).
- **Trade-offs:** the flow-field is the personality and the cost — it needs a running canvas loop and a clean reduced-motion fallback (provided). Cards are deliberately opaque so AA is trivial, which means the field is visible only in gaps; weak spacing would starve the field of presence. The warm paper palette reads as calm and slightly editorial, less "corporate cool" than slate.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System-grotesque + monospace font stacks; icons and charts are inline SVG; avatars are initials (no image assets); the flow-field is plain `<canvas>` with layered-trig pseudo-noise (no noise library). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is copied **verbatim** from the locked SaaS baseline (`dashboard-saas-slate`): five members (MR/DC/PN/SO/LF), four KPIs with mixed up/down deltas and 12-point sparkline series, two locked 12-point monthly trend series (MRR + Active users), a four-segment plan breakdown (Pro 44% / Team 30% / Enterprise 20% / Free 6%), and five top accounts (Northwind Labs, Helix Systems, Cobalt Industries, Lumen Health, Atlas Robotics). Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Warm tinted-paper canvas (`oklch(0.975 0.008 75)`) sits behind every surface; an opaque warm-paper sticky header leads the chrome (no backdrop blur).
- [ ] A decorative `<canvas>` flow-field renders behind all content: `position:absolute; inset:0; z-index:0`; particles drift along a smooth pseudo-flow field; `aria-hidden="true"` and `pointer-events:none`.
- [ ] The flow-field speed is data-reactive: `FLOW_SPEED = 1 + ACTIVE_DELTA/10` where `ACTIVE_DELTA` is the active-users delta (3.1); the hook is exposed as `data-active-delta` and `data-flow-speed` on the root and documented.
- [ ] All surfaces are flat **opaque** `--surface` panels defined by **1px `--border` hairlines**; **no box-shadow at rest** anywhere; no gradients, no glow, no colored side-stripes, no backdrop blur.
- [ ] All colors are OKLCH, warm-tinted (hue ≈ 75); no `#000`/`#fff`; no gradient text.
- [ ] Indigo accent (`oklch(0.5 0.12 280)`) is used only for data-viz strokes/fills, the logo dot, the goal bar, sparklines, and the flow-field particles; **`--accent-ink` (`oklch(0.4 0.12 280)`)** is used wherever indigo appears as text or a primary fill.
- [ ] Monospace stack for all numerals/IDs/timestamps/labels; system-grotesque for words; tight tracking (−0.02em) on values; weight 500/600.
- [ ] Every semantic delta carries an ▲/▼ arrow + text + accessible label; status badges always carry text + dot; meaning is never color alone.
- [ ] Charts are real inline SVG (no charting dependency); the trend chart is dual-series with a subtle grid; the donut is `stroke-dasharray` segments computed from data; sparklines are tiny SVG polylines.
- [ ] Every interactive element has a ≥3:1 indigo focus ring (`--accent-ink`, 3px + 2px offset), ≥44×44 target at 375/768/1280, and a real role/label; avatars expose the full name; the `.seg` container uses `overflow: visible` so the offset ring is never clipped.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its actual opaque surface (ink ≈16:1, muted ≈6.5:1, faint ≈5.4:1, deltas 7.5–9.5:1, accent-ink ≈7.5:1, avatars 7.5–8.7:1).
- [ ] Layout is responsive: KPI row wraps, grids collapse, table scrolls; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions ≤0.16s and the skeleton opacity pulse is 1.5s, both gated behind `prefers-reduced-motion: no-preference`.
- [ ] Under `prefers-reduced-motion: reduce` the canvas is hidden entirely (`display:none`) and all animation is suppressed; the static dashboard remains complete.
- [ ] Loading (skeleton with opacity pulse), error (inline pale-red banner + Retry + Dismiss), empty (anomaly segment), and goal/status (Q3 MRR goal progress) states are all shown; the content matches the locked `fixtures.ts` baseline.
