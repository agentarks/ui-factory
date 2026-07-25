# SaaS Analytics · Cool Slate

**Version** 1.0.0 · **Slug** `dashboard-saas-slate` · **Page type** dashboard
**Visual intent:** a calm, crafted SaaS product-analytics dashboard — the "Classic, flawless" SaaS layout on a cool light-gray canvas with low-chroma slate neutrals and a single restrained teal accent. A backdrop-blur sticky header leads; four KPI cards (value + delta + sparkline) sit over a dual-series 12-month trend chart, a revenue-by-plan donut, a hairline top-accounts table, and a metric rail. Depth comes from 1px hairline borders and generous calm spacing — almost no box-shadow. Light theme, comfortable density.

> This is the catalog's **first dashboard** and **locks the SaaS baseline**. Its `fixtures.ts` is canonical: the five Aurora members, four KPIs with mixed up/down deltas, two locked 12-point monthly series, a four-segment plan breakdown, and five top accounts. Later SaaS styles copy this baseline and change only the visual language.

## Canonical page reference

A product-analytics dashboard for **Aurora**: a sticky header (logo + breadcrumb "Product analytics", a "Last 30 days" range pill, five team avatars MR/DC/PN/SO/LF, and a teal Export primary); four KPI cards (MRR $48,200 +6.4%; Active users 12,840 +3.1%; Trial→Paid 3.8% −0.4pp; Churn 1.9% +0.2pp — up is bad) each with a value, a directional delta (▲/▼), and a small sparkline; a dual-series trend chart (MRR + Active users, 12 months) as real inline SVG with a subtle grid; a revenue-by-plan donut (Pro/Team/Enterprise/Free); a five-row top-accounts table with hairline rows; and a metric rail with a loading skeleton, an empty/anomaly segment, and a seats KPI. An inline error+retry banner sits under the header.

## Design principles

1. **Calm and measured.** Low-chroma slate neutrals (hue ≈ 248, near-zero chroma) keep every surface even-tempered. No element shouts. The calmest, most "enterprise" read.
2. **One restrained teal accent, used like a scalpel.** Teal (`oklch(0.5 0.1 220)`) lands only on the MRR line, the Pro donut segment, the logo dot, sparklines, and the Export primary. Emerald (positive) and rose (negative) are reserved for semantic deltas — always paired with an up/down arrow + text, never color alone.
3. **Hairline-first, elevation-free.** Surfaces are defined by 1px `--border` hairlines and spacing, not shadows. There is **no box-shadow anywhere at rest**. The only depth cue beyond borders is the backdrop-blur sticky header.
4. **Monospace for numbers, grotesque for words.** KPI values, MRR, percentages, IDs, timestamps, and labels use the monospace stack with tabular numerals; headings and body use the system-grotesque stack with tight negative tracking.

## Color system (OKLCH)

| Token             | Value                         | Role                                                              |
| ----------------- | ----------------------------- | ----------------------------------------------------------------- |
| `--canvas`        | `oklch(0.974 0.006 248)`      | Cool light-gray page background                                   |
| `--surface`       | `oklch(0.99 0.004 248)`       | Panels, KPI cards, inputs, table header                           |
| `--surface-2`     | `oklch(0.98 0.005 248)`       | Hover fill, badge/chip backgrounds                                |
| `--surface-3`     | `oklch(0.952 0.007 248)`      | Skeleton placeholder bars                                         |
| `--border`        | `oklch(0.908 0.008 248)`      | 1px hairlines on every panel/card/divider                         |
| `--border-strong` | `oklch(0.865 0.011 248)`      | Hover border, raised emphasis                                     |
| `--text`          | `oklch(0.23 0.01 250)`        | Primary ink (≈ 16:1 on surface)                                   |
| `--muted`         | `oklch(0.46 0.012 250)`       | Secondary text, axis labels, meta (≈ 7:1)                         |
| `--faint`         | `oklch(0.5 0.012 250)`        | Tertiary text, placeholder, account IDs (≈ 5.5:1)                 |
| `--accent`        | `oklch(0.5 0.1 220)`          | Teal — MRR line, donut Pro segment, logo dot (non-text uses)      |
| `--accent-ink`    | `oklch(0.4 0.1 220)`          | Darker teal — Export fill, links, active-segment text, focus      |
| `--pos`           | `oklch(0.42 0.11 165)`        | Positive delta text/sparkline (≈ 5.3:1 on surface)                |
| `--neg`           | `oklch(0.4 0.14 25)`          | Negative delta text/sparkline, error icon (≈ 5.9:1)               |
| `--on-accent`     | `oklch(0.99 0.003 248)`       | Near-white text on teal/primary fills (≈ 5.3:1 on `--accent-ink`) |
| `--bar-bg`        | `oklch(0.99 0.004 248 / 0.8)` | Sticky header translucent fill (paired with backdrop blur)        |
| `--chart-grid`    | `oklch(0.89 0.009 248)`       | Trend chart grid lines                                            |
| `--chart-users`   | `oklch(0.58 0.014 250)`       | Active-users secondary line                                       |
| `--track`         | `oklch(0.91 0.009 248)`       | Donut track                                                       |
| `--err-bg`        | `oklch(0.95 0.022 28)`        | Error banner surface                                              |
| `--err-border`    | `oklch(0.74 0.1 28)`          | Error banner border                                               |

- **Neutrals are cool slate** (hue ≈ 248–250) at very low chroma (≤ 0.012). No pure grey/black/white anywhere — ink floors at L 0.23, canvas tops at L 0.974.
- **`--accent` (L 0.5) is never used as text on light surfaces** — its contrast (~4:1) falls below AA. All text/primary uses `--accent-ink` (L 0.4, ~5.3:1). The concept's lighter teal is reserved for data-viz strokes and fills where contrast rules don't apply.
- **`--neg` is darkened** from the concept's `oklch(0.52 0.15 25)` to `oklch(0.4 0.14 25)` so negative delta text clears AA on the light surface (the concept value measured ~3.3:1).
- **Avatar fills** sit at L 0.42 (chroma 0.1) so near-white initials clear AA on every hue. Five hues: MR 250, DC 210, PN 30, SO 180, LF 300.
- **Plan/donut segment colors:** Pro `--accent`, Team `oklch(0.55 0.09 200)`, Enterprise `oklch(0.68 0.012 248)`, Free `oklch(0.82 0.01 248)` — a calm teal-to-neutral ramp, no rainbow.

## Typography

- **System-grotesque stack** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) for headings, body, controls, and labels. Tight negative tracking on headings: `−0.02em` on the brand/logo and KPI values, `−0.012em` on panel titles. Font-weight 500/600 — never 700. Antialiased (`-webkit-font-smoothing: antialiased`).
- **Monospace stack** (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) for every numeral, ID, timestamp, axis label, eyebrow, and metric: KPI values, deltas, sparklines, donut center, table MRR/account IDs, chart axis labels, range pills, segmented toggle, eyebrows. Tabular numerals (`font-feature-settings: 'tnum'`).
- **Scale:** KPI value 25px / 600 · panel title 13.5px / 600 · brand 14.5px / 600 · table cell 13px / 400 · eyebrow 10.5px / 600 uppercase tracked 0.085em · body 14px / 400. Hierarchy through scale + weight + tracking, not color.

## Spacing, density, radii, borders, elevation

- **Density:** comfortable. Body padding 22px 28px (18px 14px on mobile); panel padding 14–16px; KPI padding 15px 16px; gaps 14px between panels, 6px within KPI cards.
- **Radii:** panels/KPI cards/mini = **11px**; buttons/inputs/segmented/search/chips = **8px**; status badges/avatars = **9999px** (pill, tiny only); donut swatch = **3px**. Small, crisp radii throughout.
- **Borders:** **1px `--border` hairline** on every panel, KPI card, table row, divider, input, and control outline. The sticky header gets a 1px bottom border. Hover raises border to `--border-strong`. There are **no borders thicker than 1px** (no side-stripes, no accent rules).
- **Elevation:** **no box-shadow at rest** — the design is hairline-first. The only non-border depth cue is the header's `backdrop-filter: blur(12px) saturate(150%)`. No glow, no cast shadows, no layered shadows.

## Layout and composition

- A full-width sticky header over a max-1320px centered body. The body is a vertical stack: error banner → KPI row (4-up) → grid-main (trend chart 1.95fr + donut 1fr) → grid-sub (top-accounts table 1.95fr + metric rail 1fr).
- The two 2-column grids collapse to single-column under 1080px. The KPI row wraps to 2×2 under 760px. The table scrolls horizontally on narrow viewports.
- Panels are flat `--surface` cards with 1px borders and 11px radii — never nested. Spacing (not shadow) separates them.

## Navigation patterns

This specimen is a single dashboard with no route navigation. When extending: keep the backdrop-blur sticky header (brand + breadcrumb + range + primary action + avatar menu) and add a slim left nav rail or top tab strip in the same hairline style. Never use a colored side-stripe — use a dot, chip, or leading icon. Panel-on-panel surfaces are separated by 14px gaps and 1px borders, never by translucency or shadow.

## Components and states

- **Header** (sticky, backdrop-blur): logo dot + "Aurora" + "Product analytics" breadcrumb; "Last 30 days" range pill; 1px vertical divider; five team avatars (2px canvas-colored ring); teal Export primary.
- **KPI card:** eyebrow label · mono value · directional delta (▲/▼, colored, with text) · monospace caption ("vs previous 30 days" / "up is unfavorable"). A small 72×24 sparkline (computed from the 12-point series) sits beside the value.
- **Trend chart:** real inline SVG (viewBox 760×290). Subtle grid, monospace axis labels, teal MRR area+line with dots and an end-point ring, a muted secondary active-users polyline. A range segmented toggle (7D/30D/90D/12M) and legend sit in the panel header.
- **Donut:** inline SVG with four `stroke-dasharray` segments (computed from plan percentages), a track ring, and a mono center label ("$48.2k MRR"). A legend lists each plan with swatch, value, and percent.
- **Top-accounts table:** five hairline rows — account (+ mono ID), plan chip, right-aligned mono MRR, status badge (Healthy/At risk/New, always text + dot, never color alone), owner avatar + name.
- **Metric rail:** three mini panels — NRR (loading skeleton), Anomalies (empty state), Seats sold (value + positive delta).
- **Status badges:** pill (9999px) with a 6px dot + text. `s-pos` (green dot, Healthy), `s-neg` (red dot, At risk), `s-acc` (teal dot, New). Badge text is always `--text` on `--surface-2`.

## Empty, loading, and error states

These are **visual state demonstrations** (the specimen is static; controls reflect state but perform no real behavior):

- **Loading (shown):** the **Net revenue retention** mini panel shows skeleton bars (`.sk`) with an opacity pulse (1.5s) and a "Crunching cohort data…" note. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline banner under the header — red icon, "Live sync interrupted." strong label, explanation, **Dismiss** and **Retry** buttons (`role="status" aria-live="polite"`). No side-stripe; a full pale-red panel with a 1px red border.
- **Empty/filtered (shown):** the **Anomalies** mini panel shows an empty state — check icon, "No anomalies in range", supporting copy.
- **Validation:** when wiring real forms (settings, filters), reuse the inline message-under-field pattern with the `--neg` label.

## Responsive behavior

- **Desktop (≥1080px):** KPI row 4-up; trend chart + donut side by side; table + rail side by side.
- **Tablet (760–1080px):** KPI row 4-up; trend/donut and table/rail collapse to single column.
- **Mobile (<760px):** KPI row wraps to 2×2; header wraps; table scrolls horizontally. No document-level horizontal overflow at 375/768/1280.
- **Touch targets:** every interactive control ≥44×44 at all viewports (Export, range pill, every segmented button, Retry, Dismiss, filter-accounts search, View all link).

## Interaction and motion

- Hover: KPI cards transition border→`--border-strong` and background→`--surface-2`; buttons transition background/border/color. All **0.16s** `cubic-bezier(0.4, 0, 0.2, 1)`, gated behind `prefers-reduced-motion: no-preference`.
- The skeleton opacity pulse is a separate **1.5s ease-in-out** loop, also reduced-motion-gated (reduced-motion shows static skeleton bars).
- The range segmented toggle reflects `aria-pressed` selection but performs no real range switch (visual-specimen only).
- Never animate layout properties; never use bounce/elastic; never ship motion without a reduced-motion fallback.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label>` per region (KPIs, trend, revenue, top accounts) + `<aside aria-label>` for the rail. Charts are `role="img"` with descriptive `aria-label`.
- All controls are real `<button>`/`<input>`/`<a>`; the segmented toggle carries `aria-pressed`; the range pill and filter input carry `aria-label`; icons are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are insufficient). Deltas expose direction + favourability via `aria-label` ("MRR: 6.4% up, favorable").
- **Visible focus:** `outline: 3px solid var(--accent-ink)` with `outline-offset: 2px` on every interactive element — teal reads ≥3:1 against all light surfaces.
- **WCAG 2.2 AA** is met by construction and verified by a real-pixel contrast audit across every text role (ink ≈ 16:1, muted ≈ 7:1, faint ≈ 5.5:1, deltas ≥ 5.3:1, accent-ink text ≈ 5.3:1, avatar initials ≈ 5.3:1). **Deltas never rely on color alone** — each carries an ▲/▼ arrow glyph + text and an accessible label.
- Status meaning is always text + dot, never color alone.

## Extending the design to new pages

Keep the token set, the hairline-first elevation rule, and the two-type-voice system constant; adapt the layout shell. Any new surface is a flat `--surface` panel (11px radius, 1px `--border`) over `--canvas`.

- **Settings / account:** backdrop-blur header + a two-column shell (slim nav rail + content). Form fields are 44px-tall 8px-radius inputs with 1px borders; save bar is a footer row with the teal primary. Toggles reuse the segmented-control recipe.
- **Auth / login:** centered single panel on `--canvas`; inputs as above; teal "Sign in" primary (`--accent-ink` fill, `--on-accent` text); secondary "Create account" text link in `--accent-ink`.
- **Tables / data views:** reuse the hairline-row table recipe (1px `--border` dividers, no zebra, mono right-aligned numerics, sticky header row). Filters reuse the search field + chip + segmented patterns.
- **Detail pages:** breadcrumb + title header in the panel-h style; metadata as labelled chips; related items as a horizontal scroll of KPI-style cards.
- **More charts:** every chart is entry-owned inline SVG (no charting dependency). Reuse the grid + axis + teal-primary-line + muted-secondary-line recipe. Keep sparklines as tiny SVG polylines computed from data.

## Do / Don't

**Do**

- Define surfaces with 1px hairline borders and spacing; keep box-shadow off at rest.
- Reserve the teal accent for data-viz strokes, the primary fill, the logo dot, and focus — use `--accent-ink` (darker) whenever teal appears as text.
- Pair every semantic delta with an up/down arrow glyph + text and an accessible label; never communicate state by color alone.
- Use monospace for all numerals/IDs/timestamps/labels and system-grotesque for all words; track headings tightly.
- Keep all colors OKLCH, tinted cool (hue ≈ 248–250); no `#000`/`#fff`.

**Don't**

- Don't use box-shadow, glow, gradients, gradient text, graph-paper grids, or colored side-stripes.
- Don't use `backdrop-filter` anywhere except the sticky header.
- Don't use `--accent` (L 0.5) as text on light surfaces — it fails AA; always step down to `--accent-ink`.
- Don't ship motion (including the skeleton pulse) without a `prefers-reduced-motion` fallback.
- Don't add a charting library or any dependency — charts are inline SVG.

## When to use / avoid / trade-offs

- **Use** for B2B SaaS analytics, product dashboards, and business-intelligence surfaces that need a calm, professional, content-first read — the most measured, "enterprise" cool-slate direction. A safe default when the brand wants neutrality over personality.
- **Avoid** when the brand demands warmth (use a warm-paper direction), personality via bold color (use a committed-accent direction), or a dark operational aesthetic (use a dark direction).
- **Trade-offs:** the low-chroma slate palette is deliberately quiet — data and typography carry all the hierarchy, so weak type or spacing will read as flat. The hairline-first, shadow-free approach is GPU-cheap and robust, but offers no elevation-based depth cues; structure must come from borders and spacing discipline.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System-grotesque + monospace font stacks; icons and charts are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` **locks the SaaS baseline**: five members (MR/DC/PN/SO/LF), four KPIs with mixed up/down deltas and 12-point sparkline series, two locked 12-point monthly trend series (MRR + Active users), a four-segment plan breakdown (Pro 44% / Team 30% / Enterprise 20% / Free 6%), and five top accounts (Northwind Labs, Helix Systems, Cobalt Industries, Lumen Health, Atlas Robotics). Later SaaS styles copy this file verbatim and change only the visual language.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Cool light-gray canvas (`oklch(0.974 0.006 248)`) sits behind every surface; a backdrop-blur sticky header (80% opacity + `blur(12px)`) leads the chrome.
- [ ] All surfaces are flat `--surface` panels defined by **1px `--border` hairlines**; **no box-shadow at rest** anywhere; no gradients, no glow, no colored side-stripes, no `backdrop-filter` beyond the header.
- [ ] All colors are OKLCH, cool-tinted (hue ≈ 248–250); no `#000`/`#fff`; no gradient text.
- [ ] Teal accent (`oklch(0.5 0.1 220)`) is used only for data-viz strokes/fills, the logo dot, sparklines; **`--accent-ink` (`oklch(0.4 0.1 220)`)** is used wherever teal appears as text or a primary fill.
- [ ] Monospace stack for all numerals/IDs/timestamps/labels; system-grotesque for words; tight tracking (−0.02em) on values; weight 500/600.
- [ ] Every semantic delta carries an ▲/▼ arrow + text + accessible label; status badges always carry text + dot; meaning is never color alone.
- [ ] Charts are real inline SVG (no charting dependency); the trend chart is dual-series with a subtle grid; the donut is `stroke-dasharray` segments computed from data; sparklines are tiny SVG polylines.
- [ ] Every interactive element has a ≥3:1 teal focus ring (`--accent-ink`), ≥44×44 target at 375/768/1280, and a real role/label; avatars expose the full name.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its actual surface; `--neg` is darkened to L 0.4 for AA.
- [ ] Layout is responsive: KPI row wraps, grids collapse, table scrolls; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions ≤0.16s and the skeleton opacity pulse is 1.5s, both gated behind `prefers-reduced-motion: no-preference` (reduced-motion shows a fully static dashboard).
- [ ] Loading (skeleton with opacity pulse), error (inline pale-red banner + Retry + Dismiss), and empty (anomaly segment) states are all shown; the content matches the locked `fixtures.ts` baseline.
