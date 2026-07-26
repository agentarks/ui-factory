# SaaS Analytics · Risograph Broadsheet

**Version** 1.0.0 · **Slug** `dashboard-saas-riso` · **Page type** dashboard
**Visual intent:** a warm, anti-corporate **risograph-printed broadsheet** for the same Aurora product-analytics dashboard. The wow mechanic is a **print artifact**: SVG halftone dot screens encode plan share by dot density, and the two spot colors — fluorescent red and federal blue — **deliberately misregister** by a fixed 3×2px with `mix-blend-mode: multiply` so the overprint "clash" reads as a physical print, not a CSS reskin. It is NOT "ink & paper with a serif"; the overprint misregistration + halftone screens are the structuring idea. An editorial serif (Georgia, system) italic carries figures and titles; tiny monospace captions carry the data. Off-grid broadsheet columns with an intentional ~3° skew on decorative blocks. Light theme, comfortable density. The print artifact itself is **static** (the misregistration is a fixed offset, not animation).

> `fixtures.ts` is copied **verbatim** from the locked SaaS baseline (`dashboard-saas-slate`); only the visual language changes. Same members, KPIs, 12-point series, plans, and accounts.

## Canonical page reference

A product-analytics dashboard for **Aurora** rendered as a printed broadsheet: a skewed halftone nameplate ornament sits behind a serif italic masthead ("_Aurora_ · Product analytics" + "Vol. IV, No. 7" dateline) over a 3px double rule; a sticky app bar (logo dot + "_Aurora_" + breadcrumb, "Last 30 days" range pill, 1px ink divider, five team avatars MR/DC/PN/SO/LF, federal-blue Export primary); four KPI readouts (MRR $48,200 +6.4%↑good · Active users 12,840 +3.1%↑good · Trial→Paid 3.8% −0.4pp↓bad · Churn 1.9% +0.2pp↑bad) as editorial figures with serif italic display values + tiny mono captions + 12-point halftone-dot sparklines; a dual-series 12-month trend chart (MRR + Active users) as real inline SVG with a halftone dot wash under the blue MRR line; a **revenue-by-plan breakdown as halftone dot bars** whose dot radius encodes share, printed in the two spot colors with deliberate 3×2px overprint misregistration; a five-row top-accounts table with broadsheet data columns; and a metric rail with a loading skeleton, an empty/anomaly segment, and a Q3 MRR goal indicator. An inline "Press run interrupted" error+retry banner sits under the masthead. A colophon footer closes the sheet.

## Design principles

1. **The print artifact is the structuring idea.** The two spot colors **deliberately misregister** by a fixed 3×2px with `mix-blend-mode: multiply`; where blue and red dots overlap you get the dark overprint "clash" of a physical riso pass. This is a static offset, not animation. It is NOT "ink & paper with a serif."
2. **Halftone dot screens encode data.** The revenue-by-plan bars are filled with dot grids whose **radius encodes the plan share** (bigger dot = denser screen = larger share). The encoding is redundant with the visible `%` label and value text, so the dots are a decorative amplification, never the sole carrier of meaning.
3. **Two type voices, editorial vs data.** A system serif (`Georgia, "Times New Roman", serif`) italic carries every display figure — the masthead, KPI values, panel titles, account names. A system monospace (`ui-monospace, monospace`) carries every datum — captions, deltas, MRR, IDs, axis labels, eyebrows. No external fonts.
4. **Warm anti-corporate palette, opaque newsprint.** A warm off-white newsprint (`oklch(0.94 0.012 85)`, NOT pure white) with a dark warm ink and exactly two spot colors. Every surface is **opaque** so text reads against a known backdrop; `mix-blend-mode: multiply` is used only on the decorative overprint dot layers, never on text.

## Color system (OKLCH)

| Token             | Value                   | Role                                                                                      |
| ----------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `--newsprint`     | `oklch(0.94 0.012 85)`  | Warm off-white page background (NOT pure white)                                           |
| `--newsprint-2`   | `oklch(0.915 0.014 85)` | Slightly deeper newsprint for nested fills                                                |
| `--surface`       | `oklch(0.955 0.011 85)` | Inputs, chips, raised control fills                                                       |
| `--surface-2`     | `oklch(0.925 0.013 85)` | Hover fill, goal-bar track, skeleton base                                                 |
| `--surface-3`     | `oklch(0.89 0.015 85)`  | Skeleton hatch                                                                            |
| `--ink`           | `oklch(0.28 0.02 85)`   | Primary warm ink — body text, rules, borders (≈12.3:1 on newsprint)                       |
| `--muted`         | `oklch(0.42 0.018 85)`  | Secondary ink — captions, axis, meta (≈7.1:1)                                             |
| `--faint`         | `oklch(0.46 0.018 85)`  | Tertiary ink — IDs, notes, placeholders (≈6.0:1)                                          |
| `--rule`          | `oklch(0.7 0.02 85)`    | Broadsheet hairline rules, table row dividers                                             |
| `--rule-strong`   | `oklch(0.55 0.02 85)`   | Raised emphasis rules                                                                     |
| `--spot-blue`     | `oklch(0.46 0.12 250)`  | Federal blue — pos/good delta, healthy badges, MRR line, logo dot, primary fill           |
| `--spot-blue-ink` | `oklch(0.42 0.12 250)`  | Darker blue for small/caption text and focus (≈7.1:1 on newsprint)                        |
| `--spot-red`      | `oklch(0.54 0.2 25)`    | Fluorescent red — **decorative overprint dots only** (NOT text; renders `rgb(201,34,43)`) |
| `--spot-red-ink`  | `oklch(0.48 0.19 25)`   | Darkened red for AA text — neg delta, at-risk badge dot, error icon (≈6.1:1)              |
| `--on-blue`       | `oklch(0.97 0.008 85)`  | Near-newsprint text on blue fills (≈6.5:1 on `--spot-blue`)                               |
| `--err-bg`        | `oklch(0.93 0.028 25)`  | Error banner surface                                                                      |
| `--err-border`    | `oklch(0.62 0.18 25)`   | Error banner border                                                                       |
| `--spark-up`      | `var(--spot-blue-ink)`  | KPI up-sparkline dot fill                                                                 |
| `--spark-down`    | `var(--spot-red-ink)`   | KPI down-sparkline dot fill                                                               |

- **Neutrals are warm** (hue ≈ 85) at low chroma (≤ 0.02). No pure black/white anywhere — ink floors at L 0.28, newsprint tops at L 0.94. Every text token clears AA (ink 12.3:1, muted 7.1:1, faint 6.0:1; measured by real-pixel audit).
- **The spot red is conservatively darkened for every text role.** The decorative `--spot-red` (`oklch(0.54 0.2 25)`, `rgb(201,34,43)`) is reserved for the overprint dot screen and renders at ~4.7:1 on newsprint — borderline for an L 0.54 swatch and therefore used **decoratively only**. All red text (neg deltas, at-risk dot, error icon) steps down to `--spot-red-ink` (`oklch(0.48 0.19 25)`, ≈6.1:1), matching slate's conservative-darkening precedent for small monospace numerals.
- **Avatar fills** sit at L 0.42 (chroma 0.11) across five hues (MR 250, DC 210, PN 30, SO 180, LF 300); near-newsprint initials read ≈7.0–8.2:1 on every hue (measured by real-pixel audit).
- **The overprint "clash" color** (where blue and red dots overlap under `mix-blend-mode: multiply`) is an emergent dark warm composite — not a declared token — and is decorative only.

## Typography

- **Editorial serif stack** (`Georgia, "Times New Roman", Times, serif`) for every display figure: masthead nameplate (italic 700, 34px), KPI values (italic 700, 30px), panel titles (italic 700, 17px), account names (italic 700), goal value (italic 700, 22px), empty-state title. Slight negative tracking (`−0.012em` to `−0.022em`). Antialiased.
- **System monospace stack** (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`) for every datum: KPI captions/deltas, MRR numbers, account IDs, plan chips, status badges, eyebrows (uppercase tracked 0.08–0.10em), axis labels, dateline, colophon. Tabular numerals (`font-feature-settings: 'tnum'`).
- **Scale:** nameplate 34px/700 italic · KPI value 30px/700 italic · panel title 17px/700 italic · table cell 13.5px/400 · body 15px/400 · eyebrow 10px/600 uppercase tracked 0.10em · dateline/badge 10.5–11px mono. Hierarchy through voice (serif vs mono), scale, and weight — never color.

## Spacing, density, radii, borders, elevation

- **Density:** comfortable. Body padding 18px 28px (16px 14px on mobile); panel padding 12–16px; KPI cell padding 16px; gaps 18px between panels, 6px within KPI cells; 1px gutters between KPI cells (the KPI row is a 1px ink grid).
- **Radii: zero throughout.** Broadsheet sheets have crisp square corners — panels, buttons, inputs, chips, badges, avatars-except-pill-dots are all `border-radius: 0`. The only round forms are the avatar discs and the tiny semantic dots (status/goal/sparkline), which are physical print-registration forms, not card chrome. This is the deliberate anti-SaaS signal.
- **Borders:** **1.5px solid `--ink`** on every major surface (app bar, panels, KPI row, buttons, inputs, chips, badges, table head). Broadsheet rules: a 3px **double** rule under the masthead and above the colophon; 1px `--rule` hairlines on table rows. The masthead uses the classic double-rule nameplate treatment. There are **no colored side-stripes** (the project bans them absolutely).
- **Elevation:** **no box-shadow anywhere.** Depth comes from ink borders, the 3px double rules, and spacing — the broadsheet is a flat printed sheet. No glow, no cast shadows, no layered shadows, no `backdrop-filter`, no translucency on surfaces.

## Layout and composition

- A full-width sticky app bar over a max-1320px centered body. The body is a vertical stack: masthead (nameplate + dateline + double rule) → error banner → KPI row (4-up, 1px ink gutters) → grid-main (trend chart 1.95fr + halftone plan panel 1fr) → grid-sub (top-accounts table 1.95fr + metric rail 1fr) → colophon (3px double rule).
- The KPI row is a **1px ink-bordered grid** whose 1px gutters are the ink background showing through — a broadsheet "boxcage" composition, not four floating cards.
- The decorative nameplate ornament is a halftone dot field **skewed ~3°** (`skewY(-3deg)`) behind the masthead; it is `aria-hidden` and `pointer-events: none`, purely print texture. The skew straightens to 0° under 760px so the ornament collapses gracefully on mobile.
- The two 2-column grids collapse to single-column under 1080px. The KPI row wraps to 2×2 under 760px. The table scrolls horizontally on narrow viewports.

## Navigation patterns

This specimen is a single dashboard with no route navigation. When extending: keep the sticky opaque app bar (brand dot + serif italic wordmark + breadcrumb + range + primary action + avatar group) and add a slim left nav rail or top tab strip in the same ink-bordered, zero-radius style. Never use a colored side-stripe — use a dot, chip, or leading icon. Surfaces are separated by 1.5px ink borders and 18px gaps, never by shadow or translucency.

## Components and states

- **App bar** (sticky, opaque): blue logo dot + serif italic "_Aurora_" + "Product analytics" breadcrumb; "Last 30 days" range pill (mono, 1.5px ink border, zero radius); 1px ink divider; five team avatars (2px newsprint ring); federal-blue Export primary (mono uppercase, zero radius).
- **Masthead:** serif italic nameplate ("_Aurora_ · Product analytics") + mono dateline ("Broadsheet · Last 30 days · Vol. IV, No. 7") over a 3px double ink rule. A skewed halftone ornament sits behind it (decorative).
- **KPI cell:** mono eyebrow label · serif italic value · directional delta (▲/▼, colored, with text + sr-label "good"/"bad") · mono caption. A 12-point **halftone-dot sparkline** (dot radius grows along the series) sits beside the value.
- **Trend chart:** real inline SVG (viewBox 760×290). Subtle grid, mono axis labels, a **halftone dot wash** beneath the blue MRR line (decorative), the blue MRR line+dots+end-point ring, a red active-users polyline. A range segmented toggle (7D/30D/90D/12M) and a two-swatch legend sit in the panel header.
- **Revenue by plan (the signature):** four rows, each a halftone dot bar. **Dot radius encodes the plan share** (`r = 0.9 + (percent/50)·2.5`, so Pro 44% → r≈3.1, Free 6% → r≈1.2). Each bar is an **overprint layer**: two stacked dot SVGs, `--spot-blue` at the grid origin and `--spot-red` offset by a **fixed 3×2px**, the red pass blended with `mix-blend-mode: multiply` so overlapping dots composite dark like physical inks. The `%` label and value text are the redundant accessible encoding (the layer also carries a descriptive `role="img"` `aria-label`).
- **Top-accounts table:** five hairline rows — serif italic account name (+ mono ID), plan chip, right-aligned mono MRR, status badge (Healthy=blue dot / At risk=red dot / New=ink dot, always text + dot), owner avatar + name.
- **Metric rail:** three mini panels — NRR (loading skeleton), Q3 MRR goal (value + 96% readout + blue goal bar + "On track" label), Anomalies (empty state).
- **Status badges:** zero-radius mono uppercase pill with a 7px dot + text. `s-pos` (blue dot, Healthy), `s-neg` (red dot, At risk), `s-acc` (ink dot, New). Badge text is always `--ink` on `--surface`.

## Empty, loading, and error states

These are **visual state demonstrations** (the specimen is static; controls reflect state but perform no real behavior):

- **Loading (shown):** the **Net revenue retention** mini panel shows a **hatched skeleton** — a 45° repeating-linear-gradient hatch (`repeating-linear-gradient(45deg, …)`, a print-like crosshatch rather than a flat block) with a 1.5s opacity pulse. The pulse animates only under `prefers-reduced-motion: no-preference`; reduced motion shows a static hatch.
- **Error (shown):** an inline banner under the masthead — red icon, "_Press run interrupted._" serif italic strong label, explanation, **Dismiss** and **Retry** mono buttons (`role="status" aria-live="polite"`). No side-stripe; a full pale-red panel with a 1.5px red border.
- **Empty/filtered (shown):** the **Anomalies** mini panel shows an empty state — check icon, serif italic "No anomalies in range", supporting copy.
- **Goal/status (shown):** the **Q3 MRR goal** mini panel shows a value + 96% readout + blue goal bar + "On track" accessible label.
- **Validation:** when wiring real forms (settings, filters), reuse the inline message-under-field pattern with the `--spot-red-ink` label.

## Responsive behavior

- **Desktop (≥1080px):** KPI row 4-up (1px ink gutters); trend chart + halftone panel side by side; table + rail side by side.
- **Tablet (760–1080px):** KPI row 4-up; trend/halftone and table/rail collapse to single column.
- **Mobile (<760px):** KPI row wraps to 2×2; the nameplate ornament **straightens its skew to 0°** and the masthead nameplate shrinks to 26px; header wraps; table scrolls horizontally. No document-level horizontal overflow at 375/768/1280.
- **Touch targets:** every interactive control ≥44×44 at all viewports (Export, range pill, every segmented button, Retry, Dismiss, filter-accounts search, View all link).

## Interaction and motion

- The print artifact is **static by design**. The halftone overprint misregistration is a fixed 3×2px offset, never animated. The page is complete and beautiful with zero animation.
- Hover: buttons/segmented transition background/border/color, **0.16s** `cubic-bezier(0.4, 0, 0.2, 1)`, gated behind `prefers-reduced-motion: no-preference`.
- The skeleton hatch opacity pulse is a separate **1.5s ease-in-out** loop, also reduced-motion-gated (reduced motion shows a static hatch).
- The range segmented toggle reflects `aria-pressed` selection but performs no real range switch (visual-specimen only).
- Never animate layout properties; never use bounce/elastic; never ship motion without a reduced-motion fallback.

## Accessibility

- Landmarks: `<header>` (banner) + `<main>` + `<section aria-label>` per region (KPIs, trend, revenue, top accounts) + `<aside aria-label>` for the rail + `<footer>` (colophon). Charts and the overprint layer are `role="img"` with descriptive `aria-label`s; the trend chart's `aria-label` narrates both series over 12 months.
- All controls are real `<button>`/`<input>`; the segmented toggle carries `aria-pressed`; the range pill and filter input carry `aria-label`; decorative icons, the nameplate ornament, and the halftone dot layers are `aria-hidden`.
- **Avatars expose the full name** via `aria-label` (initials alone are insufficient). Deltas expose direction + favourability via `aria-label` ("MRR: 6.4% up, favorable") and carry a visually-hidden "good"/"bad" word.
- **Visible focus:** `outline: 3px solid var(--spot-blue-ink)` with `outline-offset: 2px` on every interactive element — blue reads ≈7.1:1 against all newsprint surfaces. The segmented toggle uses zero radius and `overflow: visible` so the offset ring is never clipped.
- **WCAG 2.2 AA** is met by construction and verified by a real-pixel contrast audit across every text role against its opaque newsprint parent (ink 12.3:1, muted 7.1:1, faint 6.0:1, blue delta 7.1:1, red delta 6.1:1, on-blue-on-primary 6.5:1, avatars ≈7.0–8.2:1). **Deltas never rely on color alone** — each carries an ▲/▼ arrow glyph + text and an accessible label. **Status badges always carry text + dot.**
- The halftone/overprint decoration is **decorative** wherever it does not encode data (`aria-hidden`/`pointer-events: none` on the nameplate ornament and the trend dot wash). Where dots encode plan share, that encoding is redundant with the visible `%` label, value text, and the overprint layer's `role="img"` `aria-label`.

## Extending the design to new pages

Keep the token set, the zero-radius hairline-ink rule, the two-type-voice system, and the halftone-overprint signature constant; adapt the layout shell. Any new surface is a flat newsprint panel (1.5px `--ink` border, zero radius) over `--newsprint`.

- **Settings / account:** sticky app bar + a two-column shell (slim nav rail + content). Form fields are 44px-tall zero-radius inputs with 1.5px ink borders; save bar is a footer row with the federal-blue primary. Toggles reuse the segmented-control recipe.
- **Auth / login:** centered single panel on `--newsprint`; inputs as above; federal-blue "Sign in" primary (`--spot-blue` fill, `--on-blue` text); secondary "Create account" mono link in `--spot-blue-ink`.
- **Tables / data views:** reuse the hairline-row table recipe (1px `--rule` dividers, 1.5px ink head rule, no zebra, mono right-aligned numerics). Filters reuse the search field + chip patterns.
- **Detail pages:** masthead-style title header (serif italic over double rule); metadata as labelled mono chips; related items as a horizontal scroll of KPI-style cells.
- **More charts:** every chart is entry-owned inline SVG (no charting dependency). Reuse the grid + axis + blue-primary-line + halftone-dot-wash recipe. Keep sparklines as tiny dot fields computed from data.

## Do / Don't

**Do**

- Render the two spot colors as **deliberately misregistered overprint** (fixed 3×2px offset + `mix-blend-mode: multiply`) so the dot clash reads as a physical riso pass — that is the structuring idea.
- Encode plan share as **halftone dot radius** (bigger dot = denser screen = larger share), but always pair the dots with a visible `%` label, value text, and a descriptive `aria-label` so the encoding is redundant.
- Use the editorial serif italic for every display figure and the system monospace for every datum; let voice + scale + weight carry hierarchy, not color.
- Keep every surface **opaque newsprint** so text reads against a known backdrop; restrict `mix-blend-mode: multiply` to decorative dot layers.
- Keep all colors OKLCH, warm-tinted (hue ≈ 85); darken `--spot-red` to `--spot-red-ink` for every text role.

**Don't**

- Don't use box-shadow, glow, gradients, gradient text, `backdrop-filter`, translucency on surfaces, or colored side-stripes.
- Don't round corners (except avatar discs and tiny semantic dots) — the zero-radius broadsheet is the anti-SaaS signal.
- Don't use `--spot-red` (L 0.54) as text — it is decorative overprint only (≈4.7:1 on newsprint); always step down to `--spot-red-ink` (L 0.48, ≈6.1:1).
- Don't animate the overprint misregistration — the print artifact is static; the 3×2px offset is fixed.
- Don't ship motion (including the skeleton hatch pulse) without a `prefers-reduced-motion` fallback.
- Don't add a charting library, external fonts, images, or any dependency — charts, halftone screens, and sparklines are inline SVG.

## When to use / avoid / trade-offs

- **Use** for B2B SaaS analytics and product dashboards that want warmth, personality, and an editorial/anti-corporate read without sacrificing data legibility — the most "designed" and characterful SaaS direction. Strong when the brand values craft, print heritage, or differentiation from generic SaaS chrome.
- **Avoid** when the brand demands clinical neutrality (use the cool-slate direction), motion-led dynamism (use the flow-field or orbital directions), or a dark operational aesthetic (use the orbital direction). Also avoid when a zero-radius, serif-heavy editorial look would fight the brand's existing system.
- **Trade-offs:** the riso identity is loud — the overprint clash and serif italic dominate the read, so weak fixture content or sparse layouts will feel empty rather than calm. The zero-radius + 1.5px ink borders are GPU-cheap and robust but offer no elevation cues; structure must come from the broadsheet rules, the 1px KPI gutters, and spacing discipline. The decorative skew and halftone ornament must be `aria-hidden` and must straighten on mobile to avoid overflow.

## Dependencies, assets, and licenses

- **No external dependencies, fonts, images, or binary assets.** `Georgia, "Times New Roman", serif` and `ui-monospace, monospace` system stacks; icons, halftone screens, sparklines, and the trend chart are inline SVG; avatars are initials (no image assets). Self-contained and framework-agnostic.
- **Licensing:** this repository declares **no license** (no `LICENSE` file, no `package.json` `license` field), so the source is unlicensed/all-rights-reserved by default under copyright. The specimen adds no third-party assets of its own and imitates no named artist or commercial risograph house. Confirm the consuming repository's license before adopting these rules.

## Content baseline

`fixtures.ts` is copied **verbatim** from the locked SaaS baseline (`dashboard-saas-slate`): five members (MR/DC/PN/SO/LF), four KPIs with mixed up/down deltas and 12-point sparkline series, two locked 12-point monthly trend series (MRR + Active users), a four-segment plan breakdown (Pro 44% / Team 30% / Enterprise 20% / Free 6%), and five top accounts (Northwind Labs, Helix Systems, Cobalt Industries, Lumen Health, Atlas Robotics). It MUST `diff` identical to slate's `fixtures.ts`; only the visual language changes.

## Acceptance checklist (for AI coding agents implementing this direction)

- [ ] Warm off-white newsprint canvas (`oklch(0.94 0.012 85)`) sits behind every opaque surface; no pure black/white anywhere.
- [ ] All surfaces are flat newsprint panels defined by **1.5px `--ink` borders** and zero radius; **no box-shadow anywhere**; no gradients, no glow, no colored side-stripes, no `backdrop-filter`, no surface translucency.
- [ ] The **overprint signature** is present: each plan bar is an `.overprint-layer` with two stacked dot SVGs (`.ht-blue` + `.ht-red`), the red pass offset by a **fixed 3×2px** and blended with `mix-blend-mode: multiply`; the misregistration is a static offset, never animated.
- [ ] **Halftone dot radius encodes plan share** (Pro biggest → Free smallest); the `%` label, value text, and a `role="img"` `aria-label` make the encoding redundant.
- [ ] All colors are OKLCH, warm-tinted (hue ≈ 85); `--spot-red` (L 0.54) is decorative-only (≈4.7:1 on newsprint) and `--spot-red-ink` (L 0.48, ≈6.1:1) is used for every red text role.
- [ ] Editorial serif italic carries every display figure; system monospace carries every datum; no external fonts.
- [ ] Every semantic delta carries an ▲/▼ arrow + text + accessible label (+ visually-hidden "good"/"bad"); status badges always carry text + dot; meaning is never color alone.
- [ ] Charts are real inline SVG (no charting dependency); the trend chart has a blue MRR line over a halftone dot wash and a red active-users line; sparklines are tiny halftone-dot fields.
- [ ] Every interactive element has a ≥3:1 blue focus ring (`--spot-blue-ink`, 3px + 2px offset), ≥44×44 target at 375/768/1280, and a real role/label; avatars expose the full name.
- [ ] All text meets WCAG 2.2 AA (≥4.5:1) against its opaque newsprint parent (ink 12.3:1, muted 7.1:1, deltas 6.1–7.1:1, on-blue-on-primary 6.5:1, avatars ≈7.0–8.2:1).
- [ ] The decorative nameplate ornament is `aria-hidden`/`pointer-events: none` and skewed ~3°; it **straightens to 0° under 760px**; no document horizontal overflow at 375/768/1280.
- [ ] Normal UI transitions ≤0.16s and the skeleton hatch pulse is 1.5s, both gated behind `prefers-reduced-motion: no-preference`; reduced motion shows a complete static dashboard (frozen overprint, static hatch).
- [ ] Loading (hatched skeleton with opacity pulse), error (inline pale-red banner + Retry + Dismiss), empty (anomaly segment), and goal/status indicator are all shown; the content matches the locked `fixtures.ts` baseline (diff-identical to slate).
