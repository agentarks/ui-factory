<script lang="ts">
	import { kpis, plans, accounts, members, byId, months, mrrSeries, usersSeries } from './fixtures';

	// ---- Radar sweep + telemetry-ring geometry (decorative hero) ----
	// Centre of the 460×460 radial. The sweep group rotates around this point.
	const CX = 230;
	const CY = 230;
	// Concentric telemetry rings (radii). The sweep reaches the outermost.
	const ringRadii = [70, 120, 170, 215];
	// Point at angle θ (degrees, clockwise from 12 o'clock) and radius R.
	const polar = (thetaDeg: number, r: number) => {
		const t = (thetaDeg * Math.PI) / 180;
		return [CX + r * Math.sin(t), CY - r * Math.cos(t)];
	};
	// A filled wedge path from centre, spanning [theta0, theta1] clockwise, radius R.
	const wedge = (theta0: number, theta1: number, r: number) => {
		const [x0, y0] = polar(theta0, r);
		const [x1, y1] = polar(theta1, r);
		const large = Math.abs(theta1 - theta0) > 180 ? 1 : 0;
		const sweep = theta1 > theta0 ? 1 : 0;
		return `M${CX},${CY} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} ${sweep} ${x1.toFixed(
			1
		)},${y1.toFixed(1)} Z`;
	};
	// The sweep fades from a bright leading edge (θ=0, pointing up) back to a faint
	// trailing edge (θ=-66). Three stacked slices fake the conic phosphor trail; a
	// crisp leading-edge line anchors the read. Leading edge sweeps clockwise.
	const sweepSlices = [
		{ d: wedge(-22, 0, 215), op: 0.4 },
		{ d: wedge(-44, -22, 215), op: 0.22 },
		{ d: wedge(-66, -44, 215), op: 0.1 }
	];
	const [leadX, leadY] = polar(0, 215);
	// Cardinal tick marks (N/E/S/W) on the outer ring — mission-console detail.
	const cardinals = [0, 90, 180, 270].map((theta) => {
		const [x0, y0] = polar(theta, 205);
		const [x1, y1] = polar(theta, 215);
		return { x0, y0, x1, y1 };
	});

	// ---- Orbit-arc sparkline: each KPI series mapped along a semicircular arc ----
	// Reads as a telemetry "orbit" rather than a straight polyline.
	function orbitArc(data: number[]) {
		const cx = 60;
		const cy = 52;
		const r = 42;
		const amp = 9;
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const n = data.length;
		const pts = data.map((v, i) => {
			const t = n > 1 ? i / (n - 1) : 0;
			const ang = Math.PI + t * Math.PI; // 180° → 360°: left, over the top, to right
			const rr = r + ((v - min) / range) * amp;
			return [cx + rr * Math.cos(ang), cy - rr * Math.sin(ang)];
		});
		const line = 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
		// Baseline arc (the orbit track) at the base radius.
		const base = `M${cx + r * Math.cos(Math.PI)},${cy - r * Math.sin(Math.PI)} A${r},${r} 0 0 1 ${
			cx + r * Math.cos(2 * Math.PI)
		},${cy - r * Math.sin(2 * Math.PI)}`;
		const last = pts[pts.length - 1];
		return { line, base, end: last };
	}
	const arcs = kpis.map((k) => orbitArc(k.spark));

	// ---- Trend chart geometry (computed from fixtures, dual-axis; identical to baseline) ----
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
	const areaPath = `${mrrPath} L${xs[xs.length - 1].toFixed(0)},240 L${xs[0].toFixed(0)},240 Z`;

	// ---- Donut geometry (computed from plan percentages) ----
	const DC = 2 * Math.PI * 54;
	let cumulative = 0;
	const donutSegs = plans.map((p) => {
		const dash = (DC * p.percent) / 100;
		const seg = {
			...p,
			dash: dash.toFixed(2),
			gap: (DC - dash).toFixed(2),
			rot: (cumulative / 100) * 360 - 90
		};
		cumulative += p.percent;
		return seg;
	});

	// ---- Visual-specimen interaction only (no real filtering) ----
	const ranges = ['7D', '30D', '90D', '12M'] as const;
	let activeRange = $state<(typeof ranges)[number]>('30D');
	let filterQuery = $state('');

	// Avatar hue → fill token. Coloured chips on the deep-space header; bright
	// initials read AA on every hue.
	const avatarFill = (hue: number) => `oklch(0.5 0.11 ${hue})`;

	// KPI quadrant docking (index → corner).
	const quads = ['nw', 'ne', 'sw', 'se'] as const;
</script>

<div class="dash-root" data-orbital="dashboard-saas-orbital">
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
				<strong>Telemetry link degraded.</strong>
				Reconnecting to the events stream — some readouts may be a few cycles stale.
			</span>
			<span class="err-end">
				<button type="button" class="btn btn-ghost">Dismiss</button>
				<button type="button" class="btn">Retry</button>
			</span>
		</div>

		<section class="hero" aria-label="Live telemetry readouts">
			<svg
				class="rings"
				viewBox="0 0 460 460"
				aria-hidden="true"
				preserveAspectRatio="xMidYMid meet"
			>
				<line class="crosshair" x1="15" y1={CY} x2="445" y2={CY} />
				<line class="crosshair" x1={CX} y1="15" x2={CX} y2="445" />
				{#each ringRadii as rr, i (rr)}
					<circle class="ringline r{i + 1}" cx={CX} cy={CY} r={rr} />
				{/each}
				{#each cardinals as c (c)}
					<line class="tick" x1={c.x0} y1={c.y0} x2={c.x1} y2={c.y1} />
				{/each}
				<!-- Decorative blips on the ring (signal contacts) -->
				<circle class="blip blip-green" cx={polar(35, 120)[0]} cy={polar(35, 120)[1]} r="3.5" />
				<circle class="blip blip-amber" cx={polar(155, 170)[0]} cy={polar(155, 170)[1]} r="3.5" />
				<circle class="blip blip-green" cx={polar(300, 70)[0]} cy={polar(300, 70)[1]} r="3" />
				<g class="sweep">
					{#each sweepSlices as s (s.d)}
						<path class="sweep-fill" d={s.d} style="opacity: {s.op}" />
					{/each}
					<line class="sweep-lead" x1={CX} y1={CY} x2={leadX.toFixed(1)} y2={leadY.toFixed(1)} />
				</g>
				<!-- Hub -->
				<circle class="hub" cx={CX} cy={CY} r="6" />
			</svg>

			{#each kpis as kpi, i (kpi.id)}
				<article class="kpi {quads[i]}">
					<div class="kpi-lab">
						<span class="eyebrow">{kpi.label}</span>
					</div>
					<div class="kpi-main">
						<span class="v">{kpi.value}</span>
						<svg
							class="orbit"
							viewBox="0 0 120 56"
							preserveAspectRatio="xMidYMid meet"
							aria-hidden="true"
						>
							<path class="orbit-base" d={arcs[i].base} />
							<path class="orbit-line orbit-{kpi.tone}" d={arcs[i].line} />
							<circle
								class="orbit-end orbit-{kpi.tone}"
								cx={arcs[i].end[0]}
								cy={arcs[i].end[1]}
								r="2.4"
							/>
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
					</span>
					<div class="vs">{kpi.caption}</div>
				</article>
			{/each}
		</section>

		<div class="grid-main">
			<section class="panel" aria-label="MRR and active users trend">
				<div class="panel-h">
					<span class="t">MRR &amp; active users</span>
					<span class="s">Last 12 cycles</span>
					<span class="panel-end">
						<span class="legend">
							<span><i class="sw sw1" aria-hidden="true"></i>MRR</span>
							<span><i class="sw line" aria-hidden="true"></i>Active users</span>
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
						aria-label="MRR rose from about 38 thousand to 48 thousand dollars and active users rose from about 11 thousand to 13 thousand over the last twelve cycles."
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
						<path class="area" d={areaPath} />
						<polyline class="users" points={userPts.join(' ')} />
						<path class="mrr" d={mrrPath} />
						<g class="dots">
							{#each mrrPts as pt, i (i)}
								{#if i < mrrPts.length - 1}
									<circle cx={pt.split(',')[0]} cy={pt.split(',')[1]} r="2.4" />
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
					<span class="t">Revenue by plan</span>
					<span class="s">By MRR</span>
				</div>
				<div class="donut-wrap">
					<div class="donut">
						<svg
							width="132"
							height="132"
							viewBox="0 0 140 140"
							role="img"
							aria-label="Donut: Pro 44 percent, Team 30 percent, Enterprise 20 percent, Free 6 percent."
						>
							<circle class="track" cx="70" cy="70" r="54" fill="none" stroke-width="14" />
							<g fill="none" stroke-width="14">
								{#each donutSegs as seg (seg.name)}
									<circle
										class={seg.segClass}
										cx="70"
										cy="70"
										r="54"
										stroke-dasharray="{seg.dash} {seg.gap}"
										transform="rotate({seg.rot.toFixed(2)} 70 70)"
									/>
								{/each}
							</g>
							<text
								class="center"
								x="70"
								y="68"
								text-anchor="middle"
								font-family="ui-monospace, monospace"
								font-size="18"
								font-weight="600">$48.2k</text
							>
							<text
								class="clabel"
								x="70"
								y="84"
								text-anchor="middle"
								font-family="ui-monospace, monospace"
								font-size="8.5"
								letter-spacing="1.5">MRR</text
							>
						</svg>
					</div>
					<div class="leg-list">
						{#each plans as p, i (p.name)}
							<div class="leg-row">
								<span class="sw sw{i + 1}" aria-hidden="true"></span>
								<span class="nm">{p.name}</span>
								<span class="vl">{p.value}</span>
								<span class="pc">{p.percent}%</span>
							</div>
						{/each}
					</div>
				</div>
			</section>
		</div>

		<div class="grid-sub">
			<section class="panel" aria-label="Top accounts">
				<div class="panel-h">
					<span class="t">Top accounts</span>
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
											<span class="id">{a.id}</span>
										</div>
									</td>
									<td><span class="chip">{a.plan}</span></td>
									<td class="r num">{a.mrr}</td>
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
				<div class="mini goal">
					<div class="mini-lab"><span class="eyebrow">Q3 MRR goal</span></div>
					<div class="goal-row">
						<div class="goal-v">
							<span class="v">$48.2k</span>
							<span class="goal-of">of $50k</span>
						</div>
						<span class="goal-pct" aria-label="Q3 MRR goal: 96 percent of target, on track">
							<span class="tri" aria-hidden="true">▲</span>96%
						</span>
					</div>
					<div class="goal-bar" aria-hidden="true">
						<span class="goal-fill" style="width: 96%"></span>
					</div>
					<span class="goal-note">On track — 2 cycles remaining.</span>
				</div>
				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Net revenue retention</span></div>
					<div class="sk sk-big" aria-hidden="true"></div>
					<div class="sk sk-sm" aria-hidden="true"></div>
					<div class="mini-note">Crunching cohort data…</div>
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
						<span class="s">Nothing crossed the 2σ band in the last 30 cycles.</span>
					</div>
				</div>
				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Seats sold</span></div>
					<div class="v">1,280</div>
					<span class="delta pos" aria-label="Seats sold: 4.2% up, favorable"
						><span class="tri" aria-hidden="true">▲</span>4.2%</span
					>
				</div>
			</aside>
		</div>
	</main>
</div>

<style>
	/* Preview documents render outside the factory CSS boundary, so reset here. */
	:global(html, body) {
		margin: 0;
		min-height: 100%;
		background: oklch(0.16 0.03 250);
	}

	.dash-root,
	.dash-root *,
	.dash-root *::before,
	.dash-root *::after {
		box-sizing: border-box;
	}

	.dash-root {
		/* Orbital telemetry tokens — OKLCH throughout, no pure black/white. Deep-space
		   canvas with phosphor-teal dominance and restrained green/amber semantics. */
		--canvas: oklch(0.16 0.03 250);
		--surface: oklch(0.2 0.025 250); /* slightly-raised readout panels */
		--surface-2: oklch(0.245 0.025 250); /* hover fill, badge/chip backgrounds */
		--surface-3: oklch(0.28 0.02 250); /* skeleton placeholder */
		--border: oklch(0.31 0.025 250); /* faint hairlines */
		--border-strong: oklch(0.38 0.03 250); /* hover border */
		--text: oklch(0.93 0.018 250); /* primary ink — bright tint, not white */
		--muted: oklch(0.74 0.02 250); /* secondary text */
		--faint: oklch(0.68 0.02 250); /* tertiary text */
		--accent: oklch(0.82 0.16 190); /* phosphor teal — data strokes / fills */
		--accent-ink: oklch(0.82 0.16 190); /* bright teal reads AA on every dark surface */
		--pos: oklch(0.82 0.16 145); /* signal green — good / healthy */
		--neg: oklch(0.78 0.16 50); /* alert amber — bad / at-risk */
		--on-accent: oklch(0.16 0.03 250); /* deep-space text on teal fills */
		--bar-bg: oklch(0.14 0.03 250); /* console bezel (opaque) */
		--chart-grid: oklch(0.3 0.02 250);
		--chart-users: oklch(0.66 0.04 250);
		--track: oklch(0.3 0.02 250);
		--err-bg: oklch(0.22 0.035 50);
		--err-border: oklch(0.78 0.16 50);
		--avatar-ink: oklch(0.98 0.005 250);

		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		font-synthesis: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: var(--text);
		background: var(--canvas);
		font-size: 14px;
		line-height: 1.45;
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
		font-size: 10.5px;
		letter-spacing: 0.085em;
		text-transform: uppercase;
		color: var(--muted);
	}

	/* ---------- App bar (opaque console bezel; no blur — dark single context) ---------- */
	.appbar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 11px 28px;
		background: var(--bar-bg);
		border-bottom: 1px solid var(--border);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 9px;
	}

	.logo .dot {
		width: 18px;
		height: 18px;
		border-radius: 5px;
		background: var(--accent);
		display: grid;
		place-items: center;
		box-shadow: 0 0 10px oklch(0.82 0.16 190 / 0.45);
	}

	.logo .dot::after {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 2px;
		background: var(--on-accent);
		opacity: 0.9;
	}

	.logo b {
		font-weight: 600;
		letter-spacing: -0.02em;
		font-size: 14.5px;
	}

	.crumb {
		color: var(--muted);
		font-size: 13px;
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
		font-size: 12px;
		color: var(--text);
		border: 1px solid var(--border);
		background: var(--surface);
		padding: 6px 12px;
		border-radius: 8px;
		cursor: pointer;
	}

	.pill-range svg {
		opacity: 0.65;
	}

	.vdiv {
		width: 1px;
		height: 20px;
		background: var(--border);
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
		width: 26px;
		height: 26px;
		border-radius: 9999px;
		display: grid;
		place-items: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 9.5px;
		color: var(--avatar-ink);
		border: 2px solid var(--bar-bg);
	}

	.avatar.sm {
		width: 22px;
		height: 22px;
		font-size: 8.5px;
		border-width: 1.5px;
		border-color: var(--surface);
	}

	/* ---------- Buttons ---------- */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 44px;
		font: inherit;
		font-weight: 500;
		font-size: 12.5px;
		color: var(--text);
		border: 1px solid var(--border);
		background: var(--surface);
		padding: 7px 14px;
		border-radius: 8px;
		cursor: pointer;
	}

	.btn:hover {
		background: var(--surface-2);
		border-color: var(--border-strong);
	}

	.btn-primary {
		background: var(--accent);
		border-color: transparent;
		color: var(--on-accent);
		font-weight: 600;
	}

	.btn-primary:hover {
		background: oklch(0.86 0.16 190);
	}

	.btn-ghost {
		background: transparent;
	}

	/* ---------- Body ---------- */
	.body {
		max-width: 1320px;
		margin: 0 auto;
		padding: 22px 28px 80px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-width: 0;
	}

	/* ---------- Error banner ---------- */
	.errbar {
		display: flex;
		align-items: center;
		gap: 11px;
		border: 1px solid var(--err-border);
		background: var(--err-bg);
		border-radius: 10px;
		padding: 8px 14px;
		flex-wrap: wrap;
	}

	.err-ic {
		color: var(--neg);
		flex: 0 0 auto;
	}

	.errbar .msg {
		font-size: 12.5px;
		flex: 1;
		min-width: 200px;
	}

	.errbar .msg strong {
		font-weight: 600;
	}

	.err-end {
		display: flex;
		gap: 8px;
	}

	/* ---------- Orbital hero ---------- */
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: 1fr minmax(280px, 400px) 1fr;
		grid-template-rows: auto auto auto;
		column-gap: 18px;
		row-gap: 16px;
		align-items: center;
		justify-items: stretch;
		padding: 8px 0 4px;
	}

	.rings {
		grid-row: 1 / 4;
		grid-column: 2;
		width: 100%;
		max-width: 400px;
		height: auto;
		margin: 0 auto;
		display: block;
		pointer-events: none;
		filter: drop-shadow(0 0 6px oklch(0.82 0.16 190 / 0.12));
	}

	.rings .crosshair {
		stroke: oklch(0.3 0.02 250);
		stroke-width: 1;
	}

	.rings .ringline {
		fill: none;
		stroke: var(--accent);
		stroke-width: 1;
	}

	.rings .r1 {
		stroke-opacity: 0.55;
	}

	.rings .r2 {
		stroke-opacity: 0.4;
	}

	.rings .r3 {
		stroke-opacity: 0.28;
	}

	.rings .r4 {
		stroke-opacity: 0.18;
	}

	.rings .tick {
		stroke: var(--accent);
		stroke-width: 1.5;
		stroke-opacity: 0.7;
	}

	.rings .blip {
		stroke: var(--canvas);
		stroke-width: 1.5;
	}

	.rings .blip-green {
		fill: var(--pos);
	}

	.rings .blip-amber {
		fill: var(--neg);
	}

	.rings .hub {
		fill: var(--accent);
		fill-opacity: 0.9;
	}

	/* The sweep group: base transform holds it static at 135°. The rotation runs
	   only under prefers-reduced-motion: no-preference (see Motion below), so under
	   reduced motion it freezes at 135° with no running animation. */
	.sweep {
		transform-box: view-box;
		transform-origin: 230px 230px;
		transform: rotate(135deg);
	}

	.sweep-fill {
		fill: var(--accent);
	}

	.sweep-lead {
		stroke: var(--accent);
		stroke-width: 1.5;
		stroke-linecap: round;
	}

	/* KPI readouts docked to the four quadrants */
	.kpi {
		border: 1px solid var(--border);
		border-radius: 11px;
		background: var(--surface);
		padding: 15px 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.kpi.nw {
		grid-row: 1;
		grid-column: 1;
		align-self: end;
	}

	.kpi.ne {
		grid-row: 1;
		grid-column: 3;
		align-self: end;
	}

	.kpi.sw {
		grid-row: 3;
		grid-column: 1;
		align-self: start;
	}

	.kpi.se {
		grid-row: 3;
		grid-column: 3;
		align-self: start;
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
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 25px;
		letter-spacing: -0.022em;
		line-height: 1;
		min-width: 0;
		overflow-wrap: anywhere;
		color: var(--accent-ink);
		text-shadow: 0 0 12px oklch(0.82 0.16 190 / 0.35);
	}

	.orbit {
		width: 84px;
		height: 40px;
		flex: none;
	}

	.orbit-base {
		fill: none;
		stroke: var(--border-strong);
		stroke-width: 1;
		stroke-dasharray: 2 3;
	}

	.orbit-line {
		fill: none;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.orbit-up {
		stroke: var(--pos);
	}

	.orbit-down {
		stroke: var(--neg);
	}

	.orbit-end {
		stroke: none;
	}

	.orbit-end.orbit-up {
		fill: var(--pos);
	}

	.orbit-end.orbit-down {
		fill: var(--neg);
	}

	.delta {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 600;
	}

	.delta.pos {
		color: var(--pos);
	}

	.delta.neg {
		color: var(--neg);
	}

	.delta .tri {
		font-size: 9px;
	}

	.kpi .vs {
		color: var(--faint);
		font-size: 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	/* ---------- Grids ---------- */
	.grid-main,
	.grid-sub {
		display: grid;
		grid-template-columns: 1.95fr 1fr;
		gap: 14px;
	}

	/* ---------- Panel ---------- */
	.panel {
		border: 1px solid var(--border);
		border-radius: 11px;
		background: var(--surface);
		min-width: 0;
		overflow: hidden;
	}

	.panel-h {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		padding: 14px 16px 0;
	}

	.panel-h .t {
		font-weight: 600;
		font-size: 13.5px;
		letter-spacing: -0.012em;
	}

	.panel-h .s {
		color: var(--muted);
		font-size: 11.5px;
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
		font-size: 11.5px;
		color: var(--muted);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	.legend i {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		display: inline-block;
	}

	.legend i.line {
		width: 14px;
		height: 2px;
		border-radius: 2px;
	}

	.sw1 {
		background: var(--accent);
	}

	.sw2 {
		background: oklch(0.7 0.12 200);
	}

	.sw3 {
		background: oklch(0.5 0.03 250);
	}

	.sw4 {
		background: oklch(0.38 0.025 250);
	}

	/* ---------- Segmented toggle ---------- */
	.seg {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--surface);
		overflow: visible;
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
		border-radius: 8px 0 0 8px;
	}

	.seg button:last-child {
		border-radius: 0 8px 8px 0;
	}

	.seg button.on {
		background: color-mix(in oklch, var(--accent) 16%, var(--surface-2));
		color: var(--accent-ink);
		font-weight: 600;
	}

	.seg button + button {
		border-left: 1px solid var(--border);
	}

	/* ---------- Chart ---------- */
	.chartwrap {
		padding: 6px 8px 10px;
	}

	.chart {
		width: 100%;
		height: auto;
		display: block;
	}

	.chart .grid {
		stroke: var(--chart-grid);
	}

	.chart .axis {
		fill: var(--muted);
	}

	.chart .area {
		fill: var(--accent);
		fill-opacity: 0.16;
	}

	.chart .users {
		fill: none;
		stroke: var(--chart-users);
		stroke-width: 1.5;
		stroke-linejoin: round;
		stroke-linecap: round;
		opacity: 0.9;
	}

	.chart .mrr {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
		filter: drop-shadow(0 0 4px oklch(0.82 0.16 190 / 0.4));
	}

	.chart .dots circle {
		fill: var(--accent);
	}

	.chart .ring {
		fill: none;
		stroke: var(--accent);
		stroke-opacity: 0.3;
	}

	.chart .edot {
		fill: var(--accent);
	}

	/* ---------- Donut ---------- */
	.donut-wrap {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 12px 16px 16px;
	}

	.donut svg {
		display: block;
		flex: none;
	}

	.donut .track {
		stroke: var(--track);
	}

	.donut .s1 {
		stroke: var(--accent);
		filter: drop-shadow(0 0 3px oklch(0.82 0.16 190 / 0.35));
	}

	.donut .s2 {
		stroke: oklch(0.7 0.12 200);
	}

	.donut .s3 {
		stroke: oklch(0.5 0.03 250);
	}

	.donut .s4 {
		stroke: oklch(0.38 0.025 250);
	}

	.donut .center {
		fill: var(--text);
	}

	.donut .clabel {
		fill: var(--muted);
	}

	.leg-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.leg-row {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 12.5px;
	}

	.leg-row .sw {
		width: 9px;
		height: 9px;
		border-radius: 3px;
		flex: none;
	}

	.leg-row .nm {
		color: var(--text);
	}

	.leg-row .vl {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: var(--muted);
		font-size: 12px;
	}

	.leg-row .pc {
		margin-left: auto;
		color: var(--faint);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
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
		font-size: 10.5px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 9px 12px;
		border-bottom: 1px solid var(--border);
	}

	.tbl td {
		padding: 11px 12px;
		border-bottom: 1px solid var(--border);
		font-size: 13px;
		vertical-align: middle;
	}

	.tbl tbody tr:last-child td {
		border-bottom: 0;
	}

	.tbl .r {
		text-align: right;
	}

	.tbl .num {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-feature-settings: 'tnum' 1;
	}

	.tbl .acc {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tbl .acc b {
		font-weight: 500;
		letter-spacing: -0.01em;
	}

	.tbl .acc .id {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
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
		color: var(--muted);
		border: 1px solid var(--border);
		background: var(--surface-2);
		padding: 4px 9px;
		border-radius: 7px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px 4px 9px;
		border-radius: 9999px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		font-size: 11px;
		font-weight: 500;
		color: var(--text);
		white-space: nowrap;
	}

	.badge .d {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
		flex: none;
	}

	.badge.s-pos .d {
		background: var(--pos);
	}

	.badge.s-neg .d {
		background: var(--neg);
	}

	.badge.s-acc .d {
		background: var(--accent);
	}

	/* ---------- Search ---------- */
	.search {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		min-height: 44px;
		border: 1px solid var(--border);
		background: var(--surface);
		border-radius: 8px;
		padding: 6px 10px;
	}

	.search input {
		background: transparent;
		border: 0;
		outline: 0;
		color: var(--text);
		font: inherit;
		font-size: 12px;
		width: 130px;
	}

	.search input::placeholder {
		color: var(--faint);
	}

	.search svg {
		opacity: 0.6;
	}

	.link {
		color: var(--accent-ink);
		font: inherit;
		font-size: 12px;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		border: 0;
		background: transparent;
		padding: 0;
	}

	.link:hover {
		text-decoration: underline;
	}

	/* ---------- Rail / mini panels ---------- */
	.rail {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.mini {
		border: 1px solid var(--border);
		border-radius: 11px;
		background: var(--surface);
		padding: 14px 16px;
	}

	.mini-lab {
		margin-bottom: 9px;
	}

	.mini .v {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 22px;
		letter-spacing: -0.02em;
		color: var(--accent-ink);
	}

	/* ---------- Goal indicator (status) ---------- */
	.goal-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 8px;
	}

	.goal-v {
		display: flex;
		align-items: baseline;
		gap: 6px;
		min-width: 0;
	}

	.goal-v .v {
		font-size: 20px;
	}

	.goal-of {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		color: var(--faint);
	}

	.goal-pct {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 600;
		color: var(--pos);
	}

	.goal-pct .tri {
		font-size: 9px;
	}

	.goal-bar {
		width: 100%;
		height: 6px;
		border-radius: 9999px;
		background: var(--surface-3);
		overflow: hidden;
	}

	.goal-fill {
		display: block;
		height: 100%;
		border-radius: 9999px;
		background: var(--accent);
		box-shadow: 0 0 8px oklch(0.82 0.16 190 / 0.5);
	}

	.goal-note {
		display: block;
		margin-top: 8px;
		font-size: 11px;
		color: var(--muted);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	/* ---------- Skeleton (loading) ---------- */
	.sk {
		background: var(--surface-3);
		border-radius: 6px;
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
		font-size: 11px;
		color: var(--faint);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 0.9;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.sk {
			animation: pulse 1.5s ease-in-out infinite;
		}
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
		font-weight: 500;
		font-size: 13px;
	}

	.empty .s {
		color: var(--muted);
		font-size: 12px;
	}

	/* ---------- Focus ---------- */
	.dash-root :where(button, input):focus-visible {
		outline: 3px solid var(--accent-ink);
		outline-offset: 2px;
	}

	/* ---------- Motion ---------- */
	@keyframes sweep-rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.sweep {
			animation: sweep-rotate 6s linear infinite;
		}

		.btn,
		.pill-range,
		.kpi,
		.seg button {
			transition:
				background 0.16s cubic-bezier(0.4, 0, 0.2, 1),
				border-color 0.16s cubic-bezier(0.4, 0, 0.2, 1),
				color 0.16s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.kpi:hover {
			border-color: var(--border-strong);
			background: var(--surface-2);
		}
	}

	/* ---------- Responsive ---------- */
	@media (max-width: 1080px) {
		.grid-main,
		.grid-sub {
			grid-template-columns: 1fr;
		}
	}

	/* Collapse the orbital hero below 860px: hide rings + sweep, dock readouts
	   into a clean grid. Below 480px the readouts stack to a single column. */
	@media (max-width: 860px) {
		.hero {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: none;
		}

		.rings {
			display: none;
		}

		.kpi.nw,
		.kpi.ne,
		.kpi.sw,
		.kpi.se {
			grid-row: auto;
			grid-column: auto;
			align-self: stretch;
		}
	}

	@media (max-width: 480px) {
		.body {
			padding: 18px 14px 60px;
		}

		.appbar {
			padding: 11px 14px;
			gap: 10px;
		}

		.hero {
			grid-template-columns: 1fr;
		}

		.kpi .v {
			font-size: 21px;
		}

		.tbl-wrap {
			overflow-x: auto;
		}

		.tbl {
			white-space: nowrap;
		}
	}

	@media (max-width: 760px) {
		.appbar {
			padding: 11px 14px;
			gap: 10px;
		}

		.tbl-wrap {
			overflow-x: auto;
		}

		.tbl {
			white-space: nowrap;
		}
	}
</style>
