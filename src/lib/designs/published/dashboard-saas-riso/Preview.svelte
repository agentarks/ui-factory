<script lang="ts">
	import { kpis, plans, accounts, members, byId, months, mrrSeries, usersSeries } from './fixtures';

	// ---- Trend chart geometry (computed from fixtures, dual-axis) ----
	const PL = 40;
	const PR = 20;
	const CW = 760;
	const plotW = CW - PL - PR;
	const xs = mrrSeries.map((_, i) => PL + (i * plotW) / (mrrSeries.length - 1));
	const yMrr = (v: number) => 51 + ((48000 - v) / 12000) * 189;
	const yUsers = (v: number) => 58 + ((13000 - v) / 2000) * 134;
	const mrrPts = mrrSeries.map((v, i) => `${xs[i].toFixed(0)},${yMrr(v).toFixed(0)}`);
	const userPts = usersSeries.map((v, i) => `${xs[i].toFixed(0)},${yUsers(v).toFixed(0)}`);
	const mrrPath = 'M' + mrrPts.join(' L');

	// ---- Halftone dot wash under the MRR trend line (decorative) ----
	// A static field of dots placed beneath each MRR segment, precomputed so the
	// markup stays a plain {#each} over a value (no inline arrow in markup).
	const htAreaDots: { cx: number; cy: number }[] = [];
	for (let i = 0; i < mrrSeries.length - 1; i++) {
		const midX = (xs[i] + xs[i + 1]) / 2;
		const topY = yMrr(mrrSeries[i]);
		for (let k = 0; k < 6; k++) {
			htAreaDots.push({ cx: midX, cy: topY + k * 18 });
		}
	}

	// ---- Nameplate ornament dot field (decorative, skewed ~3°) ----
	// Precomputed grid so markup stays a plain keyed {#each}.
	const ornDots: { cx: number; cy: number; r: number }[] = [];
	for (let ry = 0; ry < 9; ry++) {
		for (let cx = 0; cx < 120; cx++) {
			ornDots.push({ cx: cx * 10 + 5, cy: ry * 10 + 5, r: 1.6 + ((ry + cx) % 4) * 0.5 });
		}
	}

	// ---- KPI sparkline geometry (as halftone-dot polylines) ----
	function spark(data: number[], w: number, h: number): { x: number; y: number }[] {
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const step = data.length > 1 ? w / (data.length - 1) : 0;
		return data.map((v, i) => ({
			x: i * step,
			y: h - ((v - min) / range) * h
		}));
	}

	// ---- Halftone dot grid for the plan-share bars ----
	// Dot RADIUS encodes plan share (bigger dot = denser screen = larger share).
	// The % label and value text are the redundant accessible encoding.
	const HT_W = 210;
	const HT_H = 22;
	const HT_STEP = 7;
	const htGrid: { x: number; y: number }[] = [];
	for (let y = HT_STEP / 2; y < HT_H; y += HT_STEP) {
		for (let x = HT_STEP / 2; x < HT_W; x += HT_STEP) {
			htGrid.push({ x, y });
		}
	}
	// Map plan percent to a halftone dot radius via r = 0.9 + (percent/50)·2.5
	// (so the locked data renders ~1.2–3.1px: Free 6% → 1.2, Pro 44% → 3.1).
	const htRadius = (percent: number) => 0.9 + (Math.min(percent, 50) / 50) * 2.5;
	// Deliberate overprint misregistration: spot 2 is offset by a fixed 3×2px from
	// spot 1 so the two inks "clash" like a physical riso pass. The offset is a
	// structural marker for the overprint signature (asserted in E2E).
	const OVERPRINT_DX = 3;
	const OVERPRINT_DY = 2;

	// ---- Visual-specimen interaction only (no real filtering) ----
	const ranges = ['7D', '30D', '90D', '12M'] as const;
	let activeRange = $state<(typeof ranges)[number]>('30D');
	let filterQuery = $state('');

	// Avatar fill — warm ink tinted per member, dark enough for AA near-white initials.
	const avatarFill = (hue: number) => `oklch(0.42 0.11 ${hue})`;
</script>

<div class="dash-root">
	<!-- Decorative broadsheet nameplate ornament: skewed halftone field, aria-hidden -->
	<div class="nameplate-ornament" aria-hidden="true">
		<svg class="orn-dots" viewBox="0 0 1200 90" preserveAspectRatio="none">
			{#each ornDots as d (d.cx + '-' + d.cy)}
				<circle cx={d.cx} cy={d.cy} r={d.r} />
			{/each}
		</svg>
	</div>

	<header class="appbar">
		<div class="logo">
			<span class="dot" aria-hidden="true"></span>
			<b>Aurora</b>
		</div>
		<span class="crumb"><span class="sep" aria-hidden="true">/</span>Product analytics</span>
		<span class="spacer" aria-hidden="true"></span>
		<button type="button" class="pill-range" aria-label="Date range: Last 30 days">
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<rect x="3" y="4" width="18" height="17" rx="2" />
				<path d="M3 9h18M8 2v4M16 2v4" />
			</svg>
			Last 30 days
			<svg
				width="10"
				height="10"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M6 9l6 6 6-6" />
			</svg>
		</button>
		<span class="vdiv" aria-hidden="true"></span>
		<ul class="avatars" aria-label="Team members">
			{#each members as m (m.id)}
				<li
					class="avatar"
					style="background: {avatarFill(m.hue)}"
					aria-label={m.name}
					title={m.name}
				>
					{m.initials}
				</li>
			{/each}
		</ul>
		<button type="button" class="btn btn-primary">
			<svg
				width="13"
				height="13"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
			</svg>
			Export
		</button>
	</header>

	<main class="body">
		<div class="masthead">
			<h1 class="nameplate"><em>Aurora</em> · Product analytics</h1>
			<p class="dateline">
				Broadsheet · Last 30 days · <span class="mono">Vol. IV, No. 7</span>
			</p>
		</div>

		<div class="errbar" role="status" aria-live="polite">
			<span class="err-ic" aria-hidden="true">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 8v5M12 16h.01" />
				</svg>
			</span>
			<span class="msg">
				<strong>Press run interrupted.</strong>
				The live data feed dropped a sheet — some figures may be a few minutes stale at the press.
			</span>
			<span class="err-end">
				<button type="button" class="btn btn-ghost">Dismiss</button>
				<button type="button" class="btn">Retry</button>
			</span>
		</div>

		<section class="kpi-row" aria-label="Key metrics">
			{#each kpis as kpi (kpi.id)}
				<article class="kpi">
					<div class="kpi-lab">
						<span class="eyebrow">{kpi.label}</span>
					</div>
					<div class="kpi-main">
						<span class="v"><em>{kpi.value}</em></span>
						<svg class="spark" viewBox="0 0 72 24" preserveAspectRatio="none" aria-hidden="true">
							{#each spark(kpi.spark, 72, 22) as pt, i (i)}
								<circle
									class={'spark-' + kpi.tone}
									cx={pt.x.toFixed(1)}
									cy={pt.y.toFixed(1)}
									r={1.8 + (i / (kpi.spark.length - 1)) * 0.8}
								/>
							{/each}
						</svg>
					</div>
					<span
						class="delta {kpi.tone === 'up' ? 'pos' : 'neg'}"
						aria-label="{kpi.label}: {kpi.delta} {kpi.tone === 'up' ? 'up' : 'down'}, {kpi.good
							? 'favorable'
							: 'unfavorable'}"
					>
						<span class="tri" aria-hidden="true">{kpi.tone === 'up' ? '▲' : '▼'}</span>
						{kpi.delta}
						<span class="visually-hidden">{kpi.good ? 'good' : 'bad'}</span>
					</span>
					<div class="vs">{kpi.caption}</div>
				</article>
			{/each}
		</section>

		<div class="grid-main">
			<section class="panel" aria-label="MRR and active users trend">
				<div class="panel-h">
					<span class="t"><em>MRR &amp; active users</em></span>
					<span class="s">Last 12 months</span>
					<span class="panel-end">
						<span class="legend">
							<span><i class="sw sw-blue" aria-hidden="true"></i>MRR</span>
							<span><i class="sw sw-red" aria-hidden="true"></i>Active users</span>
						</span>
						<div class="seg" role="group" aria-label="Chart range">
							{#each ranges as r (r)}
								<button
									type="button"
									class={activeRange === r ? 'on' : ''}
									aria-pressed={activeRange === r}
									onclick={() => (activeRange = r)}>{r}</button
								>
							{/each}
						</div>
					</span>
				</div>
				<div class="chartwrap">
					<svg
						class="chart"
						viewBox="0 0 760 290"
						preserveAspectRatio="xMidYMid meet"
						role="img"
						aria-label="MRR rose from about 38 thousand to 48 thousand dollars and active users rose from about 11 thousand to 13 thousand over the last twelve months."
					>
						<g class="grid" stroke-width="1">
							<line x1="40" y1="51" x2="740" y2="51" />
							<line x1="40" y1="114" x2="740" y2="114" />
							<line x1="40" y1="177" x2="740" y2="177" />
							<line x1="40" y1="240" x2="740" y2="240" />
						</g>
						<g class="axis" font-family="ui-monospace, monospace" font-size="10" text-anchor="end">
							<text x="32" y="54">$48k</text>
							<text x="32" y="117">$44k</text>
							<text x="32" y="180">$40k</text>
							<text x="32" y="243">$36k</text>
						</g>
						<g
							class="axis"
							font-family="ui-monospace, monospace"
							font-size="10"
							text-anchor="middle"
						>
							{#each months as mo, i (mo)}
								<text x={xs[i].toFixed(0)} y="266">{mo}</text>
							{/each}
						</g>
						<!-- MRR area as a halftone dot wash (decorative, aria off via parent role=img) -->
						<g class="ht-area" aria-hidden="true">
							{#each htAreaDots as d (d)}
								<circle cx={d.cx.toFixed(0)} cy={d.cy.toFixed(0)} r="1.6" />
							{/each}
						</g>
						<polyline class="users" points={userPts.join(' ')} />
						<path class="mrr" d={mrrPath} />
						<g class="dots">
							{#each mrrPts as pt, i (i)}
								{#if i < mrrPts.length - 1}
									<circle cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="2.6" />
								{/if}
							{/each}
						</g>
						<circle
							class="ring"
							cx={xs[xs.length - 1].toFixed(0)}
							cy={yMrr(mrrSeries[mrrSeries.length - 1]).toFixed(0)}
							r="7"
							stroke-width="5"
						/>
						<circle
							class="edot"
							cx={xs[xs.length - 1].toFixed(0)}
							cy={yMrr(mrrSeries[mrrSeries.length - 1]).toFixed(0)}
							r="3.4"
						/>
					</svg>
				</div>
			</section>

			<section class="panel" aria-label="Revenue by plan">
				<div class="panel-h">
					<span class="t"><em>Revenue by plan</em></span>
					<span class="s">Halftone density = share</span>
				</div>
				<div class="halftone-wrap">
					<p class="ht-note">Two-ink overprint: blue + red, deliberately misregistered.</p>
					{#each plans as p (p.name)}
						<div class="ht-row">
							<div class="ht-meta">
								<span class="ht-name">{p.name}</span>
								<span class="ht-val mono">{p.value}</span>
								<span class="ht-pct mono">{p.percent}%</span>
							</div>
							<!-- Overprint signature: two stacked dot layers (spot-blue + spot-red),
							     offset by a fixed 3x2px, mixed via mix-blend-mode: multiply. Dot
							     radius encodes the plan share. The % label and value text are the
							     redundant accessible encoding. -->
							<div
								class="overprint-layer"
								role="img"
								aria-label="{p.name} plan share: {p.percent} percent, {p.value} monthly recurring revenue."
							>
								<svg
									class="ht-dots ht-blue"
									viewBox="0 0 {HT_W} {HT_H}"
									preserveAspectRatio="none"
									aria-hidden="true"
								>
									{#each htGrid as g (g)}
										<circle cx={g.x} cy={g.y} r={htRadius(p.percent)} />
									{/each}
								</svg>
								<svg
									class="ht-dots ht-red"
									viewBox="0 0 {HT_W} {HT_H}"
									preserveAspectRatio="none"
									aria-hidden="true"
								>
									{#each htGrid as g (g)}
										<circle
											cx={g.x + OVERPRINT_DX}
											cy={g.y + OVERPRINT_DY}
											r={htRadius(p.percent)}
										/>
									{/each}
								</svg>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</div>

		<div class="grid-sub">
			<section class="panel" aria-label="Top accounts">
				<div class="panel-h">
					<span class="t"><em>Top accounts</em></span>
					<span class="s">5 of 312</span>
					<span class="panel-end">
						<label class="search">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="7" />
								<path d="M21 21l-4-4" />
							</svg>
							<input
								type="search"
								placeholder="Filter accounts"
								aria-label="Filter accounts"
								bind:value={filterQuery}
							/>
						</label>
						<button type="button" class="link">View all</button>
					</span>
				</div>
				<div class="tbl-wrap">
					<table class="tbl">
						<thead>
							<tr>
								<th scope="col">Account</th>
								<th scope="col">Plan</th>
								<th scope="col" class="r">MRR</th>
								<th scope="col">Status</th>
								<th scope="col">Owner</th>
							</tr>
						</thead>
						<tbody>
							{#each accounts as a (a.id)}
								<tr>
									<td>
										<div class="acc">
											<b>{a.name}</b>
											<span class="id mono">{a.id}</span>
										</div>
									</td>
									<td><span class="chip">{a.plan}</span></td>
									<td class="r num mono">{a.mrr}</td>
									<td>
										<span
											class="badge s-{a.status === 'healthy'
												? 'pos'
												: a.status === 'at-risk'
													? 'neg'
													: 'acc'}"
										>
											<span class="d" aria-hidden="true"></span>
											{a.status === 'at-risk'
												? 'At risk'
												: a.status === 'healthy'
													? 'Healthy'
													: 'New'}
										</span>
									</td>
									<td>
										<div class="owner">
											<span
												class="avatar sm"
												style="background: {avatarFill(byId.get(a.owner)?.hue ?? 250)}"
												aria-label={byId.get(a.owner)?.name ?? ''}
												title={byId.get(a.owner)?.name ?? ''}
											>
												{byId.get(a.owner)?.initials}
											</span>
											<span class="owner-name">{byId.get(a.owner)?.name}</span>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<aside class="rail" aria-label="Additional metrics">
				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Net revenue retention</span></div>
					<div class="sk sk-big" aria-hidden="true"></div>
					<div class="sk sk-sm" aria-hidden="true"></div>
					<div class="mini-note">Crunching cohort data…</div>
				</div>
				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Q3 MRR goal</span></div>
					<div class="goal">
						<span class="goal-v"><em>$50,000</em></span>
						<span class="goal-pct mono">96%</span>
					</div>
					<div class="goal-bar" aria-hidden="true">
						<div class="goal-fill"></div>
					</div>
					<span class="goal-status" aria-label="Q3 MRR goal: on track">
						<span class="d-good" aria-hidden="true"></span>On track
					</span>
				</div>
				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Anomalies</span></div>
					<div class="empty">
						<span class="empty-ic" aria-hidden="true">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.6"
							>
								<circle cx="12" cy="12" r="9" />
								<path d="M8.5 12.5l2.5 2.5 4.5-5" />
							</svg>
						</span>
						<span class="t">No anomalies in range</span>
						<span class="s">Nothing crossed the 2σ band in the last 30 days.</span>
					</div>
				</div>
			</aside>
		</div>
	</main>

	<footer class="colophon" aria-label="Colophon">
		<span class="mono"
			>Set in Georgia &amp; system monospace · Two-ink risograph overprint · No external assets</span
		>
	</footer>
</div>

<style>
	/* Preview documents render outside the factory CSS boundary, so reset here. */
	:global(html, body) {
		margin: 0;
		min-height: 100%;
	}

	.dash-root,
	.dash-root *,
	.dash-root *::before,
	.dash-root *::after {
		box-sizing: border-box;
	}

	.dash-root {
		/* Risograph Broadsheet tokens — OKLCH throughout, no pure black/white. */
		--newsprint: oklch(0.94 0.012 85);
		--newsprint-2: oklch(0.915 0.014 85);
		--surface: oklch(0.955 0.011 85);
		--surface-2: oklch(0.925 0.013 85);
		--surface-3: oklch(0.89 0.015 85);
		--ink: oklch(0.28 0.02 85); /* dark warm ink */
		--muted: oklch(0.42 0.018 85); /* secondary ink */
		--faint: oklch(0.46 0.018 85); /* tertiary */
		--rule: oklch(0.7 0.02 85); /* broadsheet rules */
		--rule-strong: oklch(0.55 0.02 85);
		--spot-blue: oklch(0.46 0.12 250); /* federal blue — good/pos/primary */
		--spot-blue-ink: oklch(0.42 0.12 250); /* darker blue for small text */
		--spot-red: oklch(0.54 0.2 25); /* fluorescent red — decorative overprint */
		--spot-red-ink: oklch(0.48 0.19 25); /* darkened red for AA text */
		--on-blue: oklch(0.97 0.008 85); /* near-newsprint on blue fills */
		--err-bg: oklch(0.93 0.028 25);
		--err-border: oklch(0.62 0.18 25);
		--spark-up: var(--spot-blue-ink);
		--spark-down: var(--spot-red-ink);

		min-height: 100vh;
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-synthesis: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: var(--ink);
		background: var(--newsprint);
		font-size: 15px;
		line-height: 1.5;
	}

	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-feature-settings:
			'tnum' 1,
			'zero' 1;
	}

	.eyebrow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.visually-hidden {
		position: absolute !important;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* ---------- Broadsheet nameplate ornament (skewed halftone, decorative) ---------- */
	.nameplate-ornament {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 90px;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.orn-dots {
		width: 100%;
		height: 100%;
		display: block;
		fill: var(--spot-blue);
		opacity: 0.18;
		transform: skewY(-3deg) translateY(-12px);
		transform-origin: top left;
	}

	/* ---------- Masthead ---------- */
	.masthead {
		position: relative;
		z-index: 1;
		border-bottom: 3px double var(--ink);
		padding: 6px 0 14px;
	}

	.nameplate {
		margin: 0;
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-style: italic;
		font-size: 34px;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.nameplate em {
		font-style: italic;
	}

	.dateline {
		margin: 6px 0 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	/* ---------- Sticky app bar ---------- */
	.appbar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 11px 28px;
		background: var(--newsprint);
		border-bottom: 1px solid var(--ink);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 9px;
	}

	.logo .dot {
		width: 18px;
		height: 18px;
		border-radius: 0;
		background: var(--spot-blue);
		display: grid;
		place-items: center;
	}

	.logo .dot::after {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 0;
		background: var(--on-blue);
		opacity: 0.9;
	}

	.logo b {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-style: italic;
		letter-spacing: -0.02em;
		font-size: 18px;
	}

	.crumb {
		color: var(--muted);
		font-size: 14px;
	}

	.crumb .sep {
		color: var(--faint);
		margin-right: 7px;
	}

	.spacer {
		flex: 1;
	}

	.pill-range {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 44px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		color: var(--ink);
		border: 1.5px solid var(--ink);
		background: var(--surface);
		padding: 6px 12px;
		border-radius: 0;
		cursor: pointer;
	}

	.pill-range svg {
		opacity: 0.7;
	}

	.vdiv {
		width: 1px;
		height: 20px;
		background: var(--rule);
	}

	.avatars {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.avatars li {
		margin-left: -9px;
	}

	.avatars li:first-child {
		margin-left: 0;
	}

	.avatar {
		width: 28px;
		height: 28px;
		border-radius: 9999px;
		display: grid;
		place-items: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 10px;
		color: var(--on-blue);
		border: 2px solid var(--newsprint);
	}

	.avatar.sm {
		width: 22px;
		height: 22px;
		font-size: 8.5px;
		border-width: 1.5px;
	}

	/* ---------- Buttons ---------- */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 44px;
		font: inherit;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 11.5px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink);
		border: 1.5px solid var(--ink);
		background: var(--surface);
		padding: 7px 14px;
		border-radius: 0;
		cursor: pointer;
	}

	.btn:hover {
		background: var(--surface-2);
	}

	.btn-primary {
		background: var(--spot-blue);
		border-color: var(--spot-blue);
		color: var(--on-blue);
	}

	.btn-primary:hover {
		background: var(--spot-blue-ink);
	}

	.btn-ghost {
		background: transparent;
	}

	/* ---------- Body ---------- */
	.body {
		position: relative;
		z-index: 1;
		max-width: 1320px;
		margin: 0 auto;
		padding: 18px 28px 80px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		min-width: 0;
	}

	/* ---------- Error banner ---------- */
	.errbar {
		display: flex;
		align-items: center;
		gap: 11px;
		border: 1.5px solid var(--err-border);
		background: var(--err-bg);
		border-radius: 0;
		padding: 10px 14px;
		flex-wrap: wrap;
	}

	.err-ic {
		color: var(--spot-red-ink);
		flex: 0 0 auto;
	}

	.errbar .msg {
		font-size: 14px;
		flex: 1;
		min-width: 200px;
	}

	.errbar .msg strong {
		font-weight: 700;
		font-style: italic;
	}

	.err-end {
		display: flex;
		gap: 8px;
	}

	/* ---------- KPI row ---------- */
	.kpi-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1px;
		background: var(--ink);
		border: 1.5px solid var(--ink);
	}

	.kpi {
		background: var(--newsprint);
		padding: 16px 16px 14px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.kpi-lab {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}

	.kpi-main {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 8px;
		min-width: 0;
	}

	.kpi .v {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-size: 30px;
		letter-spacing: -0.022em;
		line-height: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.kpi .v em {
		font-style: italic;
	}

	.spark {
		width: 72px;
		height: 24px;
		flex: none;
	}

	.spark .spark-up {
		fill: var(--spot-blue);
	}

	.spark .spark-down {
		fill: var(--spot-red);
	}

	.delta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		font-weight: 600;
	}

	.delta.pos {
		color: var(--spot-blue-ink);
	}

	.delta.neg {
		color: var(--spot-red-ink);
	}

	.delta .tri {
		font-size: 9px;
	}

	.kpi .vs {
		color: var(--faint);
		font-size: 10.5px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	/* ---------- Grids ---------- */
	.grid-main,
	.grid-sub {
		display: grid;
		grid-template-columns: 1.95fr 1fr;
		gap: 18px;
	}

	/* ---------- Panel ---------- */
	.panel {
		border: 1.5px solid var(--ink);
		background: var(--newsprint);
		min-width: 0;
		overflow: hidden;
	}

	.panel-h {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		padding: 12px 16px 0;
		border-bottom: 1px solid var(--rule);
		padding-bottom: 10px;
	}

	.panel-h .t {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.012em;
	}

	.panel-h .t em {
		font-style: italic;
	}

	.panel-h .s {
		color: var(--muted);
		font-size: 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	.panel-end {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.legend {
		display: inline-flex;
		gap: 12px;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: var(--muted);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	.legend i {
		width: 9px;
		height: 9px;
		border-radius: 9999px;
		display: inline-block;
	}

	.legend i.sw-blue {
		background: var(--spot-blue);
	}

	.legend i.sw-red {
		background: var(--spot-red);
	}

	/* ---------- Segmented toggle ---------- */
	.seg {
		display: inline-flex;
		border: 1.5px solid var(--ink);
		background: var(--surface);
	}

	.seg button {
		min-height: 44px;
		min-width: 44px;
		font: inherit;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--muted);
		background: transparent;
		border: 0;
		padding: 6px 11px;
		cursor: pointer;
		border-radius: 0;
	}

	.seg button:first-child {
		border-radius: 0;
	}

	.seg button:last-child {
		border-radius: 0;
	}

	.seg button.on {
		background: var(--spot-blue);
		color: var(--on-blue);
		font-weight: 600;
	}

	.seg button + button {
		border-left: 1.5px solid var(--ink);
	}

	/* ---------- Chart ---------- */
	.chartwrap {
		padding: 10px 8px 12px;
	}

	.chart {
		width: 100%;
		height: auto;
		display: block;
	}

	.chart .grid {
		stroke: var(--rule);
	}

	.chart .axis {
		fill: var(--muted);
	}

	.chart .ht-area circle {
		fill: var(--spot-blue);
		opacity: 0.22;
	}

	.chart .users {
		fill: none;
		stroke: var(--spot-red);
		stroke-width: 1.8;
		stroke-linejoin: round;
		stroke-linecap: round;
		opacity: 0.95;
	}

	.chart .mrr {
		fill: none;
		stroke: var(--spot-blue);
		stroke-width: 2.2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.chart .dots circle {
		fill: var(--spot-blue);
	}

	.chart .ring {
		fill: none;
		stroke: var(--spot-blue);
		stroke-opacity: 0.3;
	}

	.chart .edot {
		fill: var(--spot-blue);
	}

	/* ---------- Halftone overprint (revenue by plan) ---------- */
	.halftone-wrap {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 14px 16px 16px;
	}

	.ht-note {
		margin: 0 0 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.ht-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.ht-meta {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	.ht-name {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-style: italic;
		font-size: 14px;
	}

	.ht-val {
		color: var(--muted);
		font-size: 11px;
	}

	.ht-pct {
		margin-left: auto;
		font-weight: 600;
		font-size: 12px;
		color: var(--ink);
	}

	.overprint-layer {
		position: relative;
		width: 100%;
		height: 22px;
		background: var(--newsprint);
		border: 1px solid var(--rule);
		overflow: hidden;
	}

	.ht-dots {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
	}

	.ht-blue {
		fill: var(--spot-blue);
	}

	.ht-red {
		/* The overprint pass: deliberately misregistered by a fixed 3×2px offset
		   and mixed via multiply so the two inks clash like a physical riso print. */
		fill: var(--spot-red);
		transform: translate3d(3px, 2px, 0);
		mix-blend-mode: multiply;
	}

	/* ---------- Table ---------- */
	.tbl-wrap {
		padding: 8px 4px 4px;
	}

	.tbl {
		width: 100%;
		border-collapse: collapse;
	}

	.tbl th {
		text-align: left;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 9px 12px;
		border-bottom: 1.5px solid var(--ink);
	}

	.tbl td {
		padding: 11px 12px;
		border-bottom: 1px solid var(--rule);
		font-size: 13.5px;
		vertical-align: middle;
	}

	.tbl tbody tr:last-child td {
		border-bottom: 0;
	}

	.tbl .r {
		text-align: right;
	}

	.tbl .num {
		font-feature-settings: 'tnum' 1;
	}

	.tbl .acc {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tbl .acc b {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-style: italic;
		letter-spacing: -0.01em;
	}

	.tbl .acc .id {
		font-size: 10.5px;
		color: var(--faint);
	}

	.tbl .owner {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--ink);
		border: 1px solid var(--ink);
		background: var(--surface);
		padding: 3px 8px;
		border-radius: 0;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 9px;
		border-radius: 0;
		background: var(--surface);
		border: 1px solid var(--ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink);
		white-space: nowrap;
	}

	.badge .d {
		width: 7px;
		height: 7px;
		border-radius: 9999px;
		flex: none;
	}

	.badge.s-pos .d {
		background: var(--spot-blue);
	}

	.badge.s-neg .d {
		background: var(--spot-red);
	}

	.badge.s-acc .d {
		background: var(--ink);
	}

	/* ---------- Search ---------- */
	.search {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 44px;
		border: 1.5px solid var(--ink);
		background: var(--surface);
		border-radius: 0;
		padding: 6px 10px;
	}

	.search input {
		background: transparent;
		border: 0;
		outline: 0;
		color: var(--ink);
		font: inherit;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		width: 130px;
	}

	.search input::placeholder {
		color: var(--faint);
	}

	.search svg {
		opacity: 0.6;
	}

	.link {
		color: var(--spot-blue-ink);
		font: inherit;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		border: 0;
		background: transparent;
		padding: 0;
	}

	/* ---------- Rail / mini panels ---------- */
	.rail {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.mini {
		border: 1.5px solid var(--ink);
		background: var(--newsprint);
		padding: 14px 16px;
	}

	.mini-lab {
		margin-bottom: 9px;
	}

	/* ---------- Skeleton (loading) ---------- */
	.sk {
		background: repeating-linear-gradient(
			45deg,
			var(--surface-3) 0,
			var(--surface-3) 4px,
			transparent 4px,
			transparent 8px
		);
		border: 1px solid var(--rule);
	}

	.sk-big {
		height: 24px;
		width: 62%;
		margin: 4px 0 10px;
	}

	.sk-sm {
		height: 9px;
		width: 80%;
	}

	.mini-note {
		margin-top: 10px;
		font-size: 10.5px;
		color: var(--faint);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.55;
		}
		50% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.sk {
			animation: pulse 1.5s ease-in-out infinite;
		}
	}

	/* ---------- Goal ---------- */
	.goal {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-bottom: 8px;
	}

	.goal-v {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-style: italic;
		font-size: 22px;
		letter-spacing: -0.02em;
	}

	.goal-pct {
		color: var(--muted);
		font-size: 12px;
	}

	.goal-bar {
		height: 10px;
		background: var(--surface-2);
		border: 1px solid var(--ink);
		overflow: hidden;
	}

	.goal-fill {
		height: 100%;
		width: 96%;
		background: var(--spot-blue);
	}

	.goal-status {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--spot-blue-ink);
	}

	.goal-status .d-good {
		width: 7px;
		height: 7px;
		border-radius: 9999px;
		background: var(--spot-blue);
	}

	/* ---------- Empty ---------- */
	.empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 7px;
		padding: 2px 0;
	}

	.empty-ic {
		color: var(--faint);
	}

	.empty .t {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-weight: 700;
		font-style: italic;
		font-size: 14px;
	}

	.empty .s {
		color: var(--muted);
		font-size: 12px;
	}

	/* ---------- Colophon ---------- */
	.colophon {
		position: relative;
		z-index: 1;
		max-width: 1320px;
		margin: 0 auto;
		padding: 14px 28px 40px;
		border-top: 3px double var(--ink);
		font-size: 10.5px;
		color: var(--faint);
	}

	/* ---------- Focus ---------- */
	.dash-root :where(button, input):focus-visible {
		outline: 3px solid var(--spot-blue-ink);
		outline-offset: 2px;
	}

	/* ---------- Motion ---------- */
	@media (prefers-reduced-motion: no-preference) {
		.btn,
		.pill-range,
		.seg button {
			transition:
				background 0.16s cubic-bezier(0.4, 0, 0.2, 1),
				border-color 0.16s cubic-bezier(0.4, 0, 0.2, 1),
				color 0.16s cubic-bezier(0.4, 0, 0.2, 1);
		}
	}

	/* ---------- Responsive ---------- */
	@media (max-width: 1080px) {
		.grid-main,
		.grid-sub {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 760px) {
		.body {
			padding: 16px 14px 60px;
		}

		.appbar {
			padding: 11px 14px;
			gap: 10px;
		}

		.nameplate {
			font-size: 26px;
		}

		.kpi-row {
			grid-template-columns: 1fr 1fr;
		}

		.kpi .v {
			font-size: 24px;
		}

		/* Straighten the broadsheet skew on mobile so ornament collapses gracefully. */
		.orn-dots {
			transform: skewY(0) translateY(0);
		}

		.tbl-wrap {
			overflow-x: auto;
		}

		.tbl {
			white-space: nowrap;
		}

		.colophon {
			padding: 12px 14px 30px;
		}
	}
</style>
