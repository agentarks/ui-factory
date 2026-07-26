# Operational · Topology Schematic

**Version** 1.0.0 · **Slug** `dashboard-ops-topology` · **Page type** dashboard
**Visual intent:** a light, warm-tinted blueprint dependency-graph operations dashboard for **Aurora** — the screen on-call engineers reason in. The hero is a **topology DAG**: the six services as nodes positioned left-to-right by dependency depth, with edges as SVG `<path>` lines using `stroke-dasharray: 4 4` **animated via `stroke-dashoffset`** so the dashes flow client → dependency. Degraded nodes carry an expanding **heartbeat pulse** ring. Around it: four headline metrics with sparklines, a dual-series live-metrics chart, an incidents list, and an SLO / error-budget indicator. Restrained colour strategy — monochrome ink + one red for bad — on a faint blueprint grid field. System sans for prose, monospace for node labels and data. Light theme, comfortable density.

> This is the catalog's **first Operational / monitoring dashboard** and **locks the Operational baseline**. Its `fixtures.ts` is canonical: the five Aurora members (on-call LF), four headline metrics (Uptime / Request rate / Error rate / p95 latency), two locked 12-point live-metric series, six services with statuses, seven DAG dependencies, three incidents, and the SLO/error-budget indicator. Later Operational styles copy this baseline and change only the visual language.

## Canonical page reference

An operations dashboard for **Aurora**: a sticky header (`Aurora · Operations`, a "Last 60 min" range pill, the **on-call avatar LF** for Lena Foss, and an ink "Pause stream" primary); an inline metrics-pipeline error banner (Retry + Dismiss); four headline metric cards (Uptime `99.94%` `−0.04 pp` ↓ **bad** — declining toward the 99.9% SLO; Request rate `4,820 req/s` `+312` ↑ good; Error rate `0.42%` `+0.18 pp` ↑ **bad**; p95 latency `184 ms` `−7 ms` ↓ good), each with a 12-point sparkline; the **topology DAG hero** (six services — API Gateway, Web App, Postgres [degraded], Redis, Workers [degraded], CDN — as nodes with edges flowing client → dependency; Postgres and Workers pulse; the edges into Postgres and Workers are red/at-risk); a dual-series live-metrics chart (request rate + error rate, 12 five-min buckets); a three-row incidents table (INC-2041 Postgres SEV-2 active; INC-2040 Web App SEV-3 resolved; INC-2039 Workers SEV-3 monitored); and a rail with the SLO/error-budget indicator (62% remaining, at-risk), a loading skeleton (recent deployments), and an empty/filtered segment (no incidents in eu-west).

## Design principles

1. **The screen matches the mental model.** On-call engineers already reason in dependency graphs — seeing `web-app → postgres` and `workers → postgres` at once explains why INC-2041 cascades. The topology DAG is the hero, not a sidebar.
2. **Monochrome ink + one red for bad.** A restrained, schematic palette: warm-tinted ink for everything healthy, one red for degraded services, at-risk edges, bad deltas, and the SEV-2 severity. A calm teal dots healthy nodes but never carries meaning alone. No gradient mesh, no rainbow.
3. **Motion is decorative, never essential.** The animated dashes (flow client → dependency) and the heartbeat pulse (degraded nodes) make the graph _feel_ live, but the **static DAG conveys the same facts** — direction arrows, node labels, and the red edges carry the meaning. All motion is gated behind `prefers-reduced-motion: no-preference`; under reduced-motion the dashes are static and the pulse fades to a visible ring.
4. **Monospace for data, sans for prose.** Node labels, metrics, IDs, axes, and statuses use the monospace stack with tabular numerals (an engineering readout); headings, sentences, and summaries use the system-grotesque stack. Hierarchy through mono-vs-sans and weight, not colour.

## Color system (OKLCH)

| Token             | Value                    | Role                                                                              |
| ----------------- | ------------------------ | --------------------------------------------------------------------------------- |
| `--canvas`        | `oklch(0.95 0.008 220)`  | Warm-tinted blueprint cream page background                                       |
| `--surface`       | `oklch(0.972 0.006 220)` | Panels, KPI cards, node cards, inputs                                             |
| `--surface-2`     | `oklch(0.94 0.007 220)`  | Hover fill, badge/chip backgrounds                                                |
| `--surface-3`     | `oklch(0.91 0.007 220)`  | Skeleton placeholder bars, budget track                                           |
| `--grid`          | `oklch(0.9 0.006 220)`   | Faint blueprint grid hairlines (the drafting field)                               |
| `--border`        | `oklch(0.85 0.009 220)`  | 1px hairlines on every panel/card/divider                                         |
| `--border-strong` | `oklch(0.76 0.013 220)`  | Node card borders, hover border                                                   |
| `--ink`           | `oklch(0.4 0.04 220)`    | Primary ink — nodes, body text, rules, primary fill (~8:1 on cream)               |
| `--muted`         | `oklch(0.46 0.028 220)`  | Secondary text, axis labels, meta (darkened from concept 0.52 for AA headroom)    |
| `--faint`         | `oklch(0.5 0.022 220)`   | Tertiary text, placeholders, deployment notes                                     |
| `--bad`           | `oklch(0.55 0.16 25)`    | UI strokes — at-risk edges, degraded dots, error-rate line, budget fill (≥3:1 UI) |
| `--bad-ink`       | `oklch(0.47 0.16 25)`    | Darkened red for **all text roles** — "degraded" word, bad deltas, SEV-2 (≥4.5:1) |
| `--good`          | `oklch(0.5 0.09 220)`    | Restrained calm teal — healthy dots only (non-text)                               |
| `--good-ink`      | `oklch(0.42 0.09 220)`   | Teal text — healthy status word, favourable deltas (≥4.5:1)                       |
| `--on-accent`     | `oklch(0.97 0.006 220)`  | Near-white text on the ink primary fill                                           |
| `--spark-up`      | `oklch(0.46 0.1 200)`    | Favourable sparkline strokes (request rate, p95)                                  |
| `--spark-down`    | `oklch(0.47 0.16 25)`    | Unfavourable sparkline strokes (uptime, error rate)                               |
| `--err-bg`        | `oklch(0.93 0.022 25)`   | Error banner surface                                                              |
| `--err-border`    | `oklch(0.6 0.15 25)`     | Error banner border (≥3:1 against `--err-bg` and canvas, WCAG 1.4.11)             |
| `--chart-grid`    | `oklch(0.89 0.008 220)`  | Live-metrics chart grid lines                                                     |

- **Neutrals are warm-tinted** (hue ≈ 220) at very low chroma (≤ 0.04 for ink, ≤ 0.009 for surfaces). No pure grey/black/white anywhere — ink floors at L 0.40, canvas tops at L 0.95.
- **`--bad` (L 0.55, chroma 0.16) clears the ≥3:1 UI-stroke threshold** on cream for edges and dots; **any text role steps down to `--bad-ink` (L 0.47)** to hold ≥4.5:1 for body text. The "degraded" status word, bad deltas, the SEV-2 pill, and the SLO "at risk" word all use `--bad-ink`.
- **`--muted` is deliberately darkened** from the concept's `oklch(0.52 0.03 220)` to `oklch(0.46 0.028 220)`. The concept value already cleared AA at ~4.7:1 but only barely; the darkening provides headroom for the small monospace axis labels and node meta text.
- **Avatar fills** sit at L 0.42 (chroma 0.1) so near-white initials clear AA on every hue. On-call avatar LF uses hue 300.

## Typography

- **System-grotesque stack** (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`) for headings, body prose, incident summaries, panel titles, and controls. Tight negative tracking on headings: `−0.02em` on the brand/logo, `−0.018em` on KPI values, `−0.012em` on panel titles. Font-weight 500/600 — never 700. Antialiased.
- **Monospace stack** (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) for every datum: KPI values and deltas, sparkline-adjacent figures, **node labels**, node status/stats/meta, throughput units, p95, error %, uptime, chart axis labels, interval ticks, eyebrows, range pill, segmented toggles, severity pills, incident IDs/ages, search. Tabular numerals (`font-feature-settings: 'tnum'`). Monospace on node labels is the engineering-readout signal — an on-call engineer reads them as machine data.
- **Scale:** KPI value 22px / 600 · panel title 13.5px / 600 · brand 14.5px / 600 · node label 12px / 600 · table cell 13px / 400 · eyebrow 10.5px / 600 uppercase tracked 0.085em · node meta 9.5px / 400 · body 14px / 400. Hierarchy through mono-vs-sans + scale + weight, never colour.

## Spacing, density, radii, borders, elevation

- **Density:** comfortable. Body padding 22px 28px (18px 14px on mobile); panel padding 14–16px; KPI padding 15px 16px; gaps 14px between panels, 6px within KPI cards.
- **Radii:** panels/KPI cards/mini = **11px**; node cards = **8px**; buttons/inputs/segmented/search/severity pills = **8px** (severity 6px); status badges/avatars/budget bar = **9999px** (pill, tiny only). Small, crisp radii — schematic, not soft.
- **Borders:** **1px `--border` hairline** on every panel, KPI card, table row, divider, input, and control outline. Node cards use 1px `--border-strong`; degraded nodes use **1.5px `--bad-ink`** to read as at-risk without colour alone (the heavier stroke + the word "degraded" + the dot + the pulse together). The sticky header gets a 1px bottom border. No borders thicker than 1.5px (no side-stripes).
- **Elevation:** **no box-shadow anywhere** — the schematic direction is hairline-first, like a blueprint. Depth comes from the faint `--grid` field, hairlines, and spacing. No glow, no cast shadows, no layered shadows, no `backdrop-filter`.

## Layout and composition

- A full-width sticky header over a max-1320px centered body. The body is a vertical stack: error banner → KPI row (4-up) → **topology DAG hero** (full-width panel) → live-metrics chart (full-width panel) → grid-sub (incidents table 1.95fr + indicator rail 1fr).
- The topology SVG uses a 780×336 viewBox with nodes placed at four dependency-depth columns (0 = API Gateway; 1 = Web App + CDN; 2 = Workers; 3 = Postgres + Redis). Edges are cubic-bezier `<path>`s from the source right-edge to the target left-edge, with computed arrowhead polygons at each target. Degraded nodes (Postgres, Workers) carry a pulse ring behind the card.
- The grid-sub collapses to single-column under 1080px. The KPI row wraps to 2×2 under 760px. **The topology SVG is replaced by a vertical service list under 760px** so the document never overflows; the list carries the same per-service facts plus textual dependency hints ("depends on: Postgres, Redis") with at-risk dependencies in `--bad-ink`.

## Navigation patterns

This specimen is a single operations dashboard with no route navigation. When extending: keep the opaque sticky header (brand + breadcrumb + range + on-call avatar + primary action) and add a slim left nav rail or a top tab strip (Services / Incidents / SLOs / Deploys) in the same hairline style. Never use a coloured side-stripe — use a status dot, severity pill, or leading icon. Panel-on-panel surfaces are separated by 14px gaps and 1px hairlines, never by translucency or shadow.

## Components and states

- **Header** (sticky, opaque): logo mark (ink rounded square) + "Aurora" + "Operations" breadcrumb; "Last 60 min" range pill (clock icon); 1px vertical divider; **On call** label + LF avatar; ink "Pause stream" primary (pause icon).
- **KPI card:** monospace eyebrow label · mono value · directional delta (▲/▼, `--good-ink`/`--bad-ink`, with text + accessible label) · monospace caption ("−0.04 pp vs 99.9% SLO" / "up is unfavorable"). A 72×24 sparkline (computed from each metric's 12-point series, stroke keyed on `good` so favourable trends read teal and unfavourable read red) sits beside the value.
- **Topology DAG hero:** real inline SVG. A `<pattern>` blueprint grid field; seven `<path class="edge">` edges with `stroke-dasharray: 4 4` (animated `stroke-dashoffset` under no-preference motion) and computed arrowhead `<polygon>`s; six `<g class="node">` groups each with a status dot, label, status word, uptime, throughput, p95, and error %. Degraded nodes get a `<rect class="pulse">` behind the card. At-risk edges (into Postgres, into Workers) render in `--bad` with a faster flow; healthy edges render in `--ink`. A legend + region segmented control sit in the panel header.
- **Live-metrics chart:** inline SVG (viewBox 760×240). Subtle grid, dual monospace axes (left = req/s, right = %), an ink request-rate polyline with an end dot, a dashed red error-rate polyline with an end dot, and interval ticks.
- **Incidents table:** three hairline rows — mono ID · service · severity pill (SEV-2 in `--bad-ink`) · right-aligned mono age · status badge (active/resolved/monitored, **always text + dot**) · summary sentence. A filter search + All/Open/Resolved segmented control sit in the panel header (visual-specimen `aria-pressed`; no real filtering).
- **Indicator rail:** three mini panels — **Error budget** (62% big figure + at-risk word + ink budget bar at 62% + SLO note), **Recent deployments** (loading skeleton with opacity pulse + note), **eu-west incidents** (empty state with check icon + copy).
- **Severity pills:** SEV-1 would render in `--bad-ink` (reserved); SEV-2 in `--bad-ink` border + text; SEV-3 in neutral ink. Always carry the literal "SEV-N" text — never colour alone.
- **Status badges:** pill (9999px) with a 6px dot + text. `s-active` (red dot, "active"), `s-resolved` (teal dot, "resolved"), `s-monitored` (ink dot, "monitored"). Badge text is always `--ink` on `--surface-2`.

## Empty, loading, and error states

These are **visual state demonstrations** (the specimen is static; controls reflect state but perform no real behavior):

- **Loading (shown):** the **Recent deployments** mini panel shows skeleton bars (`.sk`) with an opacity pulse (1.5s) and a "Fetching deploy timeline…" note. The pulse animates only under `prefers-reduced-motion: no-preference`.
- **Error (shown):** an inline banner under the header — red icon, "Metrics pipeline delayed." strong label, explanation, **Dismiss** and **Retry** buttons (`role="status" aria-live="polite"`). No side-stripe; a full pale-red panel with a 1px `--err-border` rule that clears ≥3:1 against both the panel surface and the canvas (WCAG 1.4.11).
- **Empty/filtered (shown):** the **eu-west incidents** mini panel shows an empty state — check icon, "No incidents in eu-west", supporting copy. This is the region-filter-with-no-matches specimen referenced in the locked baseline.
- **Validation:** when wiring real forms (region filters, ack incident), reuse the inline message-under-field pattern with the `--bad-ink` label.

## Responsive behavior

- **Desktop (≥1080px):** KPI row 4-up; topology DAG hero full-width; live-metrics full-width; incidents table + indicator rail side by side.
- **Tablet (760–1080px):** KPI row 4-up; topology DAG hero full-width; incidents/rail collapse to single column. The SVG scales with its viewBox.
- **Mobile (<760px):** KPI row wraps to 2×2; header wraps; **the topology SVG is replaced by a vertical service list** (dependency hints as text) so the document never overflows; the incidents table scrolls horizontally within its panel. No document-level horizontal overflow at 375/768/1280.
- **Touch targets:** every interactive control ≥44×44 at all viewports (Pause stream, range pill, every segmented button, Retry, Dismiss, filter-incidents search, All/Open/Resolved filter).

## Interaction and motion

- Hover: KPI cards transition border→`--border-strong` and background→`--surface-2`; buttons transition background/border/colour. All **0.16s** `cubic-bezier(0.4, 0, 0.2, 1)`, gated behind `prefers-reduced-motion: no-preference`.
- **Decorative motion (the topology signature):** edges animate `stroke-dashoffset` (`dashflow`, 0.9s linear; at-risk edges 0.7s) so dashes flow client → dependency; degraded nodes pulse (`heartbeat`, 1.8s ease-out: scale 1→1.16 + opacity 0.55→0). Both are gated behind `prefers-reduced-motion: no-preference`. **Under reduced-motion the dashes are static (stroke-dasharray still present) and the pulse holds a visible ~55% ring** — the DAG + all data remain complete and legible.
- The skeleton opacity pulse is a separate **1.5s ease-in-out** loop, also reduced-motion-gated.
- The region and incident segmented toggles reflect `aria-pressed` selection but perform no real filtering (visual-specimen only). The range pill, search, Retry, Dismiss, and Pause stream are visual-specimen affordances — they do not toggle real state.
- Never animate layout properties; never use bounce/elastic; never ship motion without a reduced-motion fallback.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label>` per region (headline metrics, topology, live metrics, incidents) + `<aside aria-label>` for the rail. The topology SVG and live-metrics chart are `role="img"` with descriptive `aria-label`s. Mobile list items are `role="listitem"` inside a `role="list"`.
- All controls are real `<button>`/`<input>`; segmented toggles carry `aria-pressed`; the range pill and search carry `aria-label`; icons are `aria-hidden`.
- **Each topology node exposes a full sentence** via `aria-label` ("Postgres: degraded, uptime 99.91%, throughput 880 qps, error rate 0.62%, p95 224 milliseconds") — node dots/colour never carry meaning alone. Health/severity/status are always text + shape + accessible label.
- **Deltas never rely on colour alone** — each carries an ▲/▼ arrow glyph + text and an accessible label ("Uptime: 0.04 pp down, unfavorable"). Incident statuses and severities always carry text.
- **Visible focus:** `outline: 3px solid var(--ink)` with `outline-offset: 2px` on every interactive element — ink reads ≥3:1 against all light surfaces. The `.seg` container uses `overflow: visible` (end buttons are rounded directly) so the offset ring is never clipped.
- **WCAG 2.2 AA** is met by construction and verified by a real-pixel contrast audit across every text role (ink ~8:1, muted ~5.8:1, bad-ink text ≥4.5:1, good-ink text ≥4.5:1, avatar initials ~7.4–8.2:1).
- **Motion is decorative:** the topology remains fully legible without the dash flow or the pulse (the static DAG with arrowheads, labels, and red edges conveys the same facts). Reduced-motion users get the complete static dashboard.

## Extending the design to new pages

Keep the token set, the hairline-first elevation rule (no box-shadow), the faint blueprint grid field, and the two-type-voice (sans prose + mono data) system constant; adapt the layout shell. Any new surface is a flat `--surface` panel (11px radius, 1px `--border`) over `--canvas`.

- **Service detail / traces:** keep the topology DAG as a navigation anchor; drill into a service with a side panel showing traces, logs, and recent incidents in the same hairline table recipe. Use the severity pill + status badge patterns unchanged.
- **Incident detail:** breadcrumb + incident ID header in the panel-h style; timeline as a vertical hairline list; severity + status pills at top. Ack/resolve actions are ink primary buttons (44px).
- **SLO / error-budget dashboard:** reuse the budget-bar recipe (track + fill + percent + state word) at the top; list SLOs in the hairline table. The "at risk" word uses `--bad-ink`.
- **On-call schedule:** the on-call avatar + label pattern from the header becomes a weekly grid; avatars expose the full name via `aria-label`.
- **More charts:** every chart is entry-owned inline SVG (no charting dependency). Reuse the grid + dual-axis + ink-primary-line + red-dashed-secondary recipe. Keep sparklines as tiny SVG polylines computed from data.

## Do / Don't

**Do**

- Make the topology DAG the hero — it is the mental model on-call engineers already reason in. Place nodes by dependency depth and let edges flow client → dependency.
- Reserve red (`--bad-ink` for text, `--bad` for strokes) for degraded services, at-risk edges, bad deltas, SEV-2, and the error-rate line. Pair every red cue with a word/shape — never colour alone.
- Gate the dash-flow and heartbeat-pulse motion behind `prefers-reduced-motion: no-preference`; ensure the **static DAG is complete** (arrowheads + labels + red edges) so reduced-motion users lose no information.
- Use monospace for all node labels and data; system-grotesque for prose. Keep all colours OKLCH, warm-tinted (hue ≈ 220); no `#000`/`#fff`.
- Replace the topology SVG with a vertical list on mobile so the document never overflows; carry the same per-service facts and dependency hints.

**Don't**

- Don't add box-shadow, glow, gradients, gradient text, coloured side-stripes, or `backdrop-filter` — this is a flat hairline schematic.
- Don't use `--bad` (L 0.55) as text on light surfaces — it fails AA for body text; always step down to `--bad-ink` (L 0.47) for any text role.
- Don't rely on the dash flow or the pulse to convey dependency direction or degraded state — the static arrowheads, labels, and red edges must carry the meaning on their own.
- Don't add a charting library or any dependency — the topology, charts, and sparklines are inline SVG + CSS.
- Don't ship motion (including the dash flow, pulse, and skeleton pulse) without a `prefers-reduced-motion` fallback.

## When to use / avoid / trade-offs

- **Use** for operations, monitoring, observability, and incident-response surfaces where the **dependency graph is the primary mental model** and on-call engineers need to see cascade paths at a glance. The blueprint-schematic read signals "engineering tool" without adopting a dark terminal aesthetic.
- **Avoid** when the audience is non-technical (the DAG reads as esoteric), when the brand demands warmth or personality (use a warmer direction), or when a dark operational aesthetic is preferred (use a dark direction).
- **Trade-offs:** the animated dashes and pulse add liveliness but are GPU-modest and fully decorative; the static DAG is the source of truth, so the design is robust to motion sensitivity. The monochrome-plus-red restraint keeps the graph scannable but means categorical service colour-coding is intentionally unavailable (services are distinguished by label + position, not hue). The blueprint grid field is faint enough to stay out of the way but signals "schematic" — it can feel busy on very small screens, which is why the mobile view switches to a clean list.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** System-grotesque + monospace font stacks; icons, topology, charts, and sparklines are inline SVG; the on-call avatar is initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` **locks the Operational baseline**: the five Aurora members (MR/DC/PN/SO/LF, on-call = LF); four headline metrics (Uptime `99.94%` −0.04 pp **bad**; Request rate `4,820 req/s` +312 good; Error rate `0.42%` +0.18 pp **bad**; p95 latency `184 ms` −7 ms good) each with a 12-point sparkline; two locked 12-point live-metric series over 5-min buckets (request rate `4620…4820`, error rate `0.24…0.42`); six services (API Gateway healthy, Web App healthy, Postgres **degraded**, Redis healthy, Workers **degraded**, CDN healthy) with uptime, throughput+unit, error %, and p95; seven DAG dependencies with at-risk flags on edges into degraded targets; three incidents (INC-2041 Postgres SEV-2 active, INC-2040 Web App SEV-3 resolved, INC-2039 Workers SEV-3 monitored); and the SLO/error-budget indicator (99.9% uptime SLO, 62% remaining, at-risk). Later Operational styles copy this file verbatim and change only the visual language.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Warm-tinted blueprint cream canvas (`oklch(0.95 0.008 220)`) sits behind every surface; a faint `--grid` blueprint field tiles the topology panel; an opaque sticky header (no `backdrop-filter`) leads the chrome.
- [ ] All surfaces are flat `--surface` panels defined by **1px `--border` hairlines**; **no box-shadow anywhere**; no gradients, no glow, no coloured side-stripes, no `backdrop-filter`, no gradient text.
- [ ] All colours are OKLCH, warm-tinted (hue ≈ 220); no `#000`/`#fff`; `--bad-ink` (L 0.47) for every red **text** role and `--bad` (L 0.55) only for UI strokes (edges, dots, error-rate line, budget fill).
- [ ] The **topology DAG hero** renders six service nodes positioned left-to-right by dependency depth, with seven `<path class="edge">` edges using `stroke-dasharray: 4 4`, computed arrowheads, and at-risk edges (into Postgres, into Workers) in `--bad`. Degraded nodes (Postgres, Workers) carry a `<rect class="pulse">`.
- [ ] The dash-flow (`stroke-dashoffset`) and heartbeat-pulse animations are gated behind `prefers-reduced-motion: no-preference`; under reduced-motion `animationName === 'none'` on edges and pulse, the dashes stay static, the pulse holds a visible ~55% ring, and the DAG + all data remain complete.
- [ ] Monospace stack for all node labels, metrics, IDs, axes, and statuses; system-grotesque for prose; tight tracking on headings; weight 500/600.
- [ ] Every health/severity/status/delta cue carries text + shape + accessible label — never colour alone; topology nodes expose full-sentence `aria-label`s; deltas carry ▲/▼ + an accessible label; incident statuses and severities always carry text.
- [ ] Charts are real inline SVG (no charting dependency); the live-metrics chart is dual-series (ink request-rate line + red-dashed error-rate line) with dual axes; KPI sparklines are tiny SVG polylines computed from data.
- [ ] Every interactive element has a ≥3:1 ink focus ring (3px + 2px offset), ≥44×44 target at 375/768/1280, and a real role/label; the on-call avatar exposes the full name; `.seg` containers use `overflow: visible` so the offset ring is never clipped.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its actual surface (ink ~8:1, muted ~5.8:1, bad-ink ≥4.5:1, good-ink ≥4.5:1, avatar initials ~7.4–8.2:1).
- [ ] Layout is responsive: KPI row wraps, grid collapses, **topology SVG swaps to a vertical list on mobile**, incidents table scrolls; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions ≤0.16s; the dash-flow (0.9s/0.7s), heartbeat pulse (1.8s), and skeleton opacity pulse (1.5s) are all gated behind `prefers-reduced-motion: no-preference` (reduced-motion shows a fully static, complete dashboard).
- [ ] Loading (skeleton with opacity pulse), error (inline pale-red banner + Retry + Dismiss), empty/filtered (no incidents in eu-west), and the SLO/error-budget indicator (62% at-risk) states are all shown; the content matches the locked `fixtures.ts` baseline.
