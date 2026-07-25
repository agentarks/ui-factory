# SaaS Analytics · Orbital Telemetry

**Version** 1.0.0 · **Slug** `dashboard-saas-orbital` · **Page type** dashboard
**Visual intent:** a dark deep-space **telemetry console** for the same Aurora product-analytics dashboard. The wow mechanic is a **conic radar sweep** — an inline-SVG wedge rotated by a CSS `@keyframes` — sweeping over **concentric telemetry rings**; the four KPIs dock as **live readouts at the ring quadrants**, and each sparkline renders as an **orbit arc** (an SVG path traced along a semicircular ring). It reads as mission control, not "a dark dashboard" — the sweep is the structuring idea. **Phosphor teal dominates** (data strokes, KPI values, focus), with **signal green** (good/healthy) and **alert amber** (bad/at-risk) as restrained semantic secondaries. Under `prefers-reduced-motion` the sweep **holds static at 135°** and the dashboard is otherwise complete and beautiful — a frozen console, not a broken one.

> This entry **copies the locked SaaS baseline verbatim** from `dashboard-saas-slate/fixtures.ts` (members, KPIs, 12-point series, plans, accounts). Only the visual language changes. The sweep + rings are **decorative only** (`aria-hidden`, `pointer-events:none`); the numbers always live in the readouts as text.

## Canonical page reference

A product-analytics dashboard for **Aurora**, re-skinned as a mission-control console: an opaque console-bezel sticky header (logo dot + "Aurora" + "Product analytics" breadcrumb, a "Last 30 days" range pill, five team avatars MR/DC/PN/SO/LF, and a teal Export primary); an inline error+retry banner; the **orbital hero** — a rotating radar sweep over four concentric telemetry rings with the four KPI readouts docked at the NW/NE/SW/SE quadrants (MRR $48,200 +6.4%↑good · Active users 12,840 +3.1%↑good · Trial→Paid 3.8% −0.4pp↓bad · Churn 1.9% +0.2pp↑bad), each readout carrying a value, a directional delta (▲/▼ + text + accessible label), and a 12-point **orbit-arc sparkline**; a dual-series trend chart (MRR + Active users, 12 cycles); a revenue-by-plan donut (Pro/Team/Enterprise/Free); a five-row top-accounts table; and a metric rail with a Q3-MRR-goal status indicator, a loading skeleton, an empty/anomaly segment, and a seats KPI.

## Design principles

1. **The sweep is the structuring idea.** The radar sweep over concentric rings is the composition's organizing gesture — it makes the dashboard read as a live console rather than a dark theme. It is **decorative only**: the data always lives in the readouts as text, so removing the sweep leaves a complete dashboard.
2. **Phosphor teal dominates, used like a scalpel.** Teal (`oklch(0.82 0.16 190)`) carries data strokes, KPI values, the MRR line, the Pro donut segment, the logo dot, sparkline arcs, focus, and the primary fill. Green (good) and amber (bad) are restrained semantics — always paired with an arrow + word + accessible label, never color alone.
3. **Opaque readouts on deep space.** Every text surface is an **opaque** dark panel over the deep-space canvas, so text reads against a known backdrop (no translucency math for data). Surfaces are defined by 1px hairlines and spacing, not shadows; a restrained phosphor glow accents only the sweep, the MRR stroke, KPI values, and the goal fill.
4. **Monospace for readouts, grotesque for words.** KPI values, deltas, MRR, percentages, IDs, axis labels, and eyebrows use the monospace stack with tabular numerals (mission-console rhythm); headings and body use the system-grotesque stack with tight negative tracking.

## Color system (OKLCH)

| Token             | Value                    | Role                                                                        |
| ----------------- | ------------------------ | --------------------------------------------------------------------------- |
| `--canvas`        | `oklch(0.16 0.03 250)`   | Deep-space page background                                                  |
| `--surface`       | `oklch(0.2 0.025 250)`   | Readout panels, KPI cards, table, inputs                                    |
| `--surface-2`     | `oklch(0.245 0.025 250)` | Hover fill, badge/chip backgrounds                                          |
| `--surface-3`     | `oklch(0.28 0.02 250)`   | Skeleton placeholder bars                                                   |
| `--border`        | `oklch(0.31 0.025 250)`  | 1px hairlines on every panel/card/divider                                   |
| `--border-strong` | `oklch(0.38 0.03 250)`   | Hover border, orbit-arc track                                               |
| `--text`          | `oklch(0.93 0.018 250)`  | Primary ink (bright tint, not white)                                        |
| `--muted`         | `oklch(0.74 0.02 250)`   | Secondary text, axis labels, meta                                           |
| `--faint`         | `oklch(0.68 0.02 250)`   | Tertiary text, captions, account IDs                                        |
| `--accent`        | `oklch(0.82 0.16 190)`   | Phosphor teal — data strokes/fills, MRR line, donut Pro, logo dot, focus    |
| `--accent-ink`    | `oklch(0.82 0.16 190)`   | Bright teal reads AA on every dark surface (used for all teal text)         |
| `--pos`           | `oklch(0.82 0.16 145)`   | Signal green — positive delta, healthy status, favorable orbit arcs         |
| `--neg`           | `oklch(0.78 0.16 50)`    | Alert amber — negative delta, at-risk status, error, unfavorable orbit arcs |
| `--on-accent`     | `oklch(0.16 0.03 250)`   | Deep-space text on teal primary fills                                       |
| `--bar-bg`        | `oklch(0.14 0.03 250)`   | Console-bezel sticky header (opaque)                                        |
| `--chart-grid`    | `oklch(0.3 0.02 250)`    | Trend chart grid lines                                                      |
| `--chart-users`   | `oklch(0.66 0.04 250)`   | Active-users secondary line                                                 |
| `--track`         | `oklch(0.3 0.02 250)`    | Donut track                                                                 |
| `--err-bg`        | `oklch(0.22 0.035 50)`   | Error banner surface (amber-tinted)                                         |
| `--err-border`    | `oklch(0.78 0.16 50)`    | Error banner border (amber)                                                 |
| `--avatar-ink`    | `oklch(0.98 0.005 250)`  | Near-white initials on coloured avatars                                     |

- **Neutrals are light tints on the dark canvas** (hue ≈ 250, low chroma) — never pure white. The brightest text stops at L 0.93; the canvas floors at L 0.16. Hairlines are faint (L ≈ 0.31–0.38) and only carry meaning decoratively (rings, orbit tracks).
- **Teal is bright enough to serve as its own text token.** Because the surfaces are dark, `--accent` (L 0.82) clears AA as text on every surface — so `--accent` and `--accent-ink` are the same value here (unlike the light slate baseline, where teal L 0.5 failed AA on light and had to darken to L 0.4 for text).
- **Amber (`--neg`, L 0.78) clears AA on deep-space** for delta numerals and the error border; it is reserved for bad/at-risk semantics and never used decoratively at scale. Green (`--pos`, L 0.82) is used for good/healthy.
- **Avatar fills** sit at L 0.5 (chroma 0.11) so near-white initials (L 0.98) clear AA on every hue. Five hues: MR 250, DC 210, PN 30, SO 180, LF 300.
- **Donut segment ramp** (teal-led, no rainbow): Pro `--accent`, Team `oklch(0.7 0.12 200)`, Enterprise `oklch(0.5 0.03 250)`, Free `oklch(0.38 0.025 250)`.

## Typography

- **System-grotesque stack** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) for headings, body, controls, labels. Tight negative tracking on headings: `−0.02em` on brand/KPI values, `−0.012em` on panel titles. Weight 500/600 — never 700. Antialiased.
- **Monospace stack** (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) for every readout, ID, axis label, eyebrow, delta, and metric — the mission-console voice. Tabular numerals (`font-feature-settings: 'tnum'`).
- **Scale:** KPI value 25px / 600 · panel title 13.5px / 600 · brand 14.5px / 600 · table cell 13px / 400 · eyebrow 10.5px / 600 uppercase tracked 0.085em · body 14px / 400. Hierarchy through scale + weight + tracking + the teal value glow, not color alone.

## Spacing, density, radii, borders, elevation

- **Density:** comfortable. Body padding 22px 28px (18px 14px on mobile); panel padding 14–16px; KPI padding 15px 16px; gaps 14–18px between panels, 6px within KPI cards; the hero uses 18px column gap so readouts clear the rings.
- **Radii:** panels/KPI cards/mini = **11px**; buttons/inputs/segmented/search/chips = **8px**; status badges/avatars/goal-bar = **9999px** (pill, tiny only); donut swatch = **3px**. Small, crisp radii throughout.
- **Borders:** **1px `--border` hairline** on every panel, KPI card, table row, divider, input, control outline, and ring. Hover raises border to `--border-strong`. No borders thicker than 1px (no side-stripes, no accent rules).
- **Elevation:** hairline-first. A **restrained phosphor glow** accents only the sweep (`drop-shadow` on the rings SVG), the MRR line + Pro donut segment (`drop-shadow`), KPI values (`text-shadow`), the logo dot, and the goal fill (`box-shadow`). These are tight, low-alpha glows (α ≤ ~0.5) that read as phosphor, not as elevation. No cast shadows, no layered shadows, no glassmorphism.

## Layout and composition

- A full-width opaque sticky header over a max-1320px centered body. The body stacks: error banner → **orbital hero** → grid-main (trend chart 1.95fr + donut 1fr) → grid-sub (top-accounts table 1.95fr + metric rail 1fr).
- **The orbital hero** is a 3-column / 3-row CSS grid: the rings+sweep SVG occupies the centre column (rows 1–3); the four KPI readouts dock at the corners (NW row1/col1, NE row1/col3, SW row3/col1, SE row3/col3). The radial is centred and the readouts dock around it — the mission-control composition.
- The two 2-column grids collapse to single-column under 1080px. The hero collapses under 860px (rings + sweep hidden; readouts become a 2-column grid) and under 480px (readouts stack 1-column, KPI value scales to 21px). The table scrolls horizontally on narrow viewports.

## Navigation patterns

This specimen is a single dashboard with no route navigation. When extending: keep the opaque console-bezel sticky header (brand + breadcrumb + range + primary action + avatar menu) and add a slim left nav rail or top tab strip in the same hairline style over `--surface`. Never use a colored side-stripe — use a dot, chip, or leading icon. Panel-on-panel surfaces are separated by 14px gaps and 1px hairlines, never by translucency or cast shadows.

## Components and states

- **Header** (sticky, opaque console bezel): teal logo dot (with phosphor glow) + "Aurora" + "Product analytics" breadcrumb; "Last 30 days" range pill; 1px vertical divider; five team avatars (2px bezel-colored ring); teal Export primary.
- **Orbital hero:** a decorative inline-SVG radial (`aria-hidden`, `pointer-events:none`) — four concentric telemetry rings (decreasing opacity outward), N/E/S/W cardinal ticks, a horizontal+vertical crosshair, three signal blips (green/amber), a central hub, and the **radar sweep** (three stacked wedge slices fading from a bright leading edge to a faint trail, plus a crisp leading-edge line) inside a `<g class="sweep">` rotated by CSS. Four **KPI readouts** dock at the quadrants, each: eyebrow · teal mono value (phosphor glow) · orbit-arc sparkline · directional delta (▲/▼ + text) · monospace caption.
- **Orbit-arc sparkline:** each 12-point series is mapped along a semicircular arc (180°→360°) with the value modulating the radius — a telemetry "orbit" rather than a straight polyline, with a dashed orbit track and an end-point dot. Stroke is green (up/favorable) or amber (down/unfavorable), matching the delta.
- **Trend chart:** real inline SVG (viewBox 760×290), re-skinned dark — subtle grid, mono axis labels, teal MRR area+line (with phosphor `drop-shadow`) + dots + end-point ring, a muted secondary active-users polyline. A range segmented toggle (7D/30D/90D/12M) and legend sit in the panel header.
- **Donut:** inline SVG with four `stroke-dasharray` segments (teal-led ramp), a track ring, and a mono center label ("$48.2k MRR"). The Pro segment carries a soft teal glow.
- **Top-accounts table:** five hairline rows — account (+ mono ID), plan chip, right-aligned mono MRR, status badge (Healthy=green / At risk=amber / New=teal, always text + dot), owner avatar + name.
- **Metric rail:** four mini panels — Q3 MRR goal (value + 96% + teal goal bar with glow + "On track"), NRR (loading skeleton), Anomalies (empty state), Seats sold (teal value + green delta).
- **Status badges:** pill (9999px) with a 6px dot + text. `s-pos` (green dot, Healthy), `s-neg` (amber dot, At risk), `s-acc` (teal dot, New). Badge text is always `--text` on `--surface-2`.

## Empty, loading, and error states

These are **visual state demonstrations** (the specimen is static; controls reflect state but perform no real behavior):

- **Loading (shown):** the **Net revenue retention** mini panel shows skeleton bars (`.sk`) with an opacity pulse (1.5s, 0.4↔0.9) and a "Crunching cohort data…" note. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline banner under the header — amber icon, "Telemetry link degraded." strong label, explanation, **Dismiss** and **Retry** buttons (`role="status" aria-live="polite"`). No side-stripe; a full amber-tinted panel with a 1px amber border.
- **Empty/filtered (shown):** the **Anomalies** mini panel shows an empty state — check icon, "No anomalies in range", supporting copy.
- **Status/goal indicator (shown):** the **Q3 MRR goal** mini panel — value + "of $50k", a 96% favorable readout (▲ + green + accessible label), a teal goal bar at 96%, and an "On track" note.
- **Validation:** when wiring real forms (settings, filters), reuse the inline message-under-field pattern with the `--neg` (amber) label.

## Responsive behavior

- **Desktop (≥1080px):** orbital hero with centre radial + 4 corner readouts; trend chart + donut side by side; table + rail side by side.
- **Tablet (860–1080px):** trend/donut and table/rail collapse to single column; the hero still shows the radial + 4 docked readouts.
- **Narrow tablet/hero collapse (<860px):** rings + sweep hidden; readouts become a 2-column grid.
- **Mobile (<480px):** readouts stack 1-column; KPI value scales to 21px; header wraps; table scrolls horizontally. No document-level horizontal overflow at 375/768/1280.
- **Touch targets:** every interactive control ≥44×44 at all viewports (Export, range pill, every segmented button, Retry, Dismiss, filter-accounts search, View all link).

## Interaction and motion

- **The radar sweep** rotates via a CSS `@keyframes sweep-rotate` (0→360°, 6s linear infinite) on `<g class="sweep">` (transform-origin the SVG centre via `transform-box: view-box`). The animation runs **only under `prefers-reduced-motion: no-preference`**; the group's base `transform: rotate(135deg)` holds it **static at 135°** under reduced motion. The sweep is `aria-hidden` + `pointer-events:none` and carries no data.
- Hover: KPI cards transition border→`--border-strong` and background→`--surface-2`; buttons transition background/border/color. All **0.16s** `cubic-bezier(0.4, 0, 0.2, 1)`, gated behind `prefers-reduced-motion: no-preference`.
- The skeleton opacity pulse is a separate **1.5s ease-in-out** loop, also reduced-motion-gated.
- The range segmented toggle reflects `aria-pressed` selection but performs no real range switch (visual-specimen only), matching the locked baseline's "honest affordances" rule.
- Never animate layout properties; never use bounce/elastic; never ship motion without a reduced-motion fallback.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label>` per region (telemetry readouts, trend, revenue, top accounts) + `<aside aria-label>` for the rail. The trend chart and donut are `role="img"` with descriptive `aria-label`.
- **The sweep + rings are decorative only:** the radial SVG is `aria-hidden="true"` and `pointer-events:none`; it never conveys data alone (the numbers are always present as text in the readouts).
- All controls are real `<button>`/`<input>`/`<a>`; the segmented toggle carries `aria-pressed`; the range pill and filter input carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label`. Deltas expose direction + favourability via `aria-label` ("MRR: 6.4% up, favorable"). **Deltas never rely on color alone** — each carries an ▲/▼ glyph + text + accessible label; status badges always carry text + dot.
- **Visible focus + two-context coverage:** `outline: 3px solid var(--accent-ink)` (bright teal) with `outline-offset: 2px` on every interactive element. Because every control sits on a dark opaque surface (header bezel L 0.14, panels L 0.2), the teal ring reads ≥3:1 against whichever surface it sits on. The `.seg` container uses `overflow: visible` so the offset ring is never clipped.
- **WCAG 2.2 AA** is met by construction and verified by a real-pixel contrast audit across every semantic text role against its opaque parent (ink ≈14:1, muted ≈5.6:1, faint ≈4.6:1, teal value ≈9:1, positive delta ≈9:1, negative/amber delta ≈8:1, avatar initials ≥7:1). The amber `--neg` is verified ≥4.5:1 on deep-space for every text use.

## Extending the design to new pages

Keep the token set, the opaque-panel rule, the sweep-as-structuring-gesture option, and the two-type-voice system constant; adapt the layout shell. Any new surface is a flat `--surface` panel (11px radius, 1px `--border`) over `--canvas`.

- **Settings / account:** console-bezel header + a two-column shell (slim nav rail + content). Form fields are 44px-tall 8px-radius inputs with 1px borders; save bar is a footer row with the teal primary. Toggles reuse the segmented-control recipe.
- **Auth / login:** centered single panel on `--canvas`; inputs as above; teal "Sign in" primary (`--accent` fill, `--on-accent` text); secondary "Create account" text link in teal.
- **Tables / data views:** reuse the hairline-row table recipe (1px `--border` dividers, no zebra, mono right-aligned numerics). Filters reuse the search field + chip + segmented patterns.
- **Detail pages:** breadcrumb + title header in the panel-h style; metadata as labelled chips; related items as a horizontal scroll of KPI-style readouts.
- **More charts:** every chart is entry-owned inline SVG (no charting dependency). Reuse the grid + axis + teal-primary-line + muted-secondary-line recipe; reuse the orbit-arc sparkline for compact readouts; reserve a sweep/ring composition for true telemetry surfaces.

## Do / Don't

**Do**

- Make the sweep the structuring gesture but keep it **decorative only** (`aria-hidden`, `pointer-events:none`); the data always lives in the readouts as text.
- Define surfaces with 1px hairlines over opaque dark panels; keep cast shadows off; reserve the phosphor glow for the sweep, the MRR stroke, KPI values, and the goal fill.
- Use the bright teal (`oklch(0.82 0.16 190)`) for both data strokes and teal text — it clears AA on every dark surface here.
- Pair every semantic delta/status with an arrow + word + accessible label / dot + text; never communicate state by color alone.
- Use monospace for all readouts/IDs/labels and system-grotesque for words; track headings tightly.
- Keep all colors OKLCH, tinted blue (hue ≈ 250); no `#000`/`#fff`.

**Don't**

- Don't put data only in the sweep or rings — they are decorative; the numbers must be text in the readouts.
- Don't use glassmorphism/backdrop-blur, gradient text (`background-clip:text`), colored side-stripes, or a charting dependency.
- Don't use `--neg` (amber) decoratively at scale — reserve it for bad/at-risk/error semantics.
- Don't ship motion (the sweep rotation or the skeleton pulse) without a `prefers-reduced-motion` fallback (the sweep must freeze at 135° and the dashboard stays complete).
- Don't let the radial hero overflow horizontally on mobile — collapse (hide rings, stack readouts) below 860/480px.

## When to use / avoid / trade-offs

- **Use** for product-analytics, operational, or business-intelligence surfaces that benefit from a live, mission-control read — dashboards that want to feel instrumented and alert. A strong choice when a dark, telemetry-forward identity is desired and the brand embraces phosphor accents.
- **Avoid** for calm/enterprise neutrals (use the cool-slate direction), warm editorial reads, or any context where animated motion is unwelcome even with a reduced-motion fallback. Also avoid if the data must be conveyed by the radial alone — the sweep is decorative.
- **Trade-offs:** the sweep is the identity but also a motion commitment; the reduced-motion fallback freezes it at 135° and the dashboard stays complete, but the "alive" quality is lost without motion. The radial hero demands responsive collapse discipline (it hides on narrow viewports). The phosphor glow is GPU-modest (small `drop-shadow`/`text-shadow`/`box-shadow` blurs) but adds render cost vs the elevation-free slate baseline.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System-grotesque + monospace font stacks; icons, the radar sweep, the rings, sparklines, the trend chart, and the donut are all inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is **copied verbatim** from the locked SaaS baseline (`dashboard-saas-slate/fixtures.ts`): five members (MR/DC/PN/SO/LF), four KPIs with mixed up/down deltas and 12-point sparkline series, two locked 12-point monthly trend series (MRR + Active users), a four-segment plan breakdown (Pro 44% / Team 30% / Enterprise 20% / Free 6%), and five top accounts (Northwind Labs, Helix Systems, Cobalt Industries, Lumen Health, Atlas Robotics). Only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Deep-space canvas (`oklch(0.16 0.03 250)`) sits behind every surface; an opaque console-bezel sticky header leads the chrome (no backdrop blur).
- [ ] A **conic radar sweep** (inline-SVG wedge in `<g class="sweep">`, rotated by CSS `@keyframes`) sweeps over **concentric telemetry rings**; the radial is `aria-hidden="true"` + `pointer-events:none` and carries no data (numbers are text in the readouts).
- [ ] Under `prefers-reduced-motion` the sweep **holds static at 135°** (no running animation; `animationName === 'none'`) and the dashboard is otherwise complete and beautiful.
- [ ] The four KPIs dock as readouts at the ring quadrants, each with a value, an **orbit-arc sparkline** (SVG path along a ring), and a directional delta; sparklines use green (up/favorable) / amber (down/unfavorable).
- [ ] All surfaces are opaque dark `--surface` panels defined by **1px `--border` hairlines**; no cast shadows; a restrained phosphor glow accents only the sweep, MRR stroke, KPI values, and goal fill.
- [ ] All colors are OKLCH, blue-tinted (hue ≈ 250); no `#000`/`#fff`; no gradient text; no glassmorphism; no colored side-stripes; no charting dependency (charts/sweep/sparklines are inline SVG + CSS).
- [ ] Phosphor teal (`oklch(0.82 0.16 190)`) dominates (data strokes, KPI values, MRR line, donut Pro, logo dot, sparklines, focus, primary fill); green (good/healthy) and amber (bad/at-risk) are restrained semantics.
- [ ] Every semantic delta carries an ▲/▼ arrow + text + accessible label; status badges always carry text + dot; meaning is never color alone.
- [ ] Every interactive element has a ≥3:1 teal focus ring (`--accent-ink`, 3px + 2px offset) reading against whichever dark surface it sits on (two-context coverage), ≥44×44 target at 375/768/1280, and a real role/label; avatars expose the full name; the `.seg` container uses `overflow: visible`.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its actual opaque surface (ink ≈14:1, muted ≈5.6:1, faint ≈4.6:1, teal value ≈9:1, deltas ≈8–9:1, avatars ≥7:1); amber `--neg` verified ≥4.5:1 on deep-space for every text use.
- [ ] Layout is responsive: the radial hero collapses (hide rings, stack readouts) below 860/480px; KPI row adapts; grids collapse; table scrolls; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions ≤0.16s and the skeleton pulse is 1.5s, both gated behind `prefers-reduced-motion: no-preference`; the sweep rotation is also gated and freezes at 135°.
- [ ] Demonstrated states: goal/status indicator, loading (skeleton with opacity pulse), error (inline amber banner + Retry + Dismiss), and empty (anomaly segment) — content matches the locked `fixtures.ts` baseline.
