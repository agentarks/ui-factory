<script lang="ts">
	import {
		headline,
		services,
		byServiceId,
		dependencies,
		incidents,
		slo,
		intervals,
		reqSeries,
		errSeries,
		byId,
		onCallId
	} from './fixtures';

	// ---- Topology DAG geometry (left-to-right by dependency depth) ----
	// Columns: 0 = api-gateway (entry); 1 = web-app, cdn; 2 = workers; 3 = postgres, redis.
	const NODE_W = 148;
	const NODE_H = 66;
	const halfW = NODE_W / 2;
	const halfH = NODE_H / 2;

	const colX = [80, 295, 510, 700];
	const nodePos: Record<string, { cx: number; cy: number }> = {
		'api-gateway': { cx: colX[0], cy: 168 },
		'web-app': { cx: colX[1], cy: 84 },
		cdn: { cx: colX[1], cy: 252 },
		workers: { cx: colX[2], cy: 168 },
		postgres: { cx: colX[3], cy: 84 },
		redis: { cx: colX[3], cy: 252 }
	};

	const TOPO_W = 780;
	const TOPO_H = 336;

	function edgePath(fromId: string, toId: string): string {
		const a = nodePos[fromId];
		const b = nodePos[toId];
		const x1 = a.cx + halfW;
		const y1 = a.cy;
		const x2 = b.cx - halfW;
		const y2 = b.cy;
		const mx = (x1 + x2) / 2;
		return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
	}

	// Arrowhead polygon (points right, tip at the target left-edge).
	function arrowPoints(toId: string): string {
		const b = nodePos[toId];
		const x2 = b.cx - halfW;
		const y2 = b.cy;
		return `${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`;
	}

	// ---- KPI sparkline geometry ----
	function spark(data: number[], w: number, h: number): string {
		const min = Math.min(...data);
		const max = Math.max(...data);
		const range = max - min || 1;
		const step = data.length > 1 ? w / (data.length - 1) : 0;
		return data
			.map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`)
			.join(' ');
	}

	// ---- Live-metrics dual-series chart geometry ----
	const PL = 46;
	const PR = 46;
	const CW = 760;
	const CH = 240;
	const plotW = CW - PL - PR;
	const plotTop = 22;
	const plotBot = 196;
	const xs = reqSeries.map((_, i) => PL + (i * plotW) / (reqSeries.length - 1));
	const reqMin = 4500;
	const reqMax = 5000;
	const errMin = 0.2;
	const errMax = 0.5;
	const yReq = (v: number) => plotBot - ((v - reqMin) / (reqMax - reqMin)) * (plotBot - plotTop);
	const yErr = (v: number) => plotBot - ((v - errMin) / (errMax - errMin)) * (plotBot - plotTop);
	const reqPts = reqSeries.map((v, i) => `${xs[i].toFixed(0)},${yReq(v).toFixed(0)}`);
	const errPts = errSeries.map((v, i) => `${xs[i].toFixed(0)},${yErr(v).toFixed(0)}`);

	// ---- Visual-specimen interaction only (no real filtering) ----
	const filters = ['All', 'Open', 'Resolved'] as const;
	let activeFilter = $state<(typeof filters)[number]>('All');
	let regionQuery = $state('');

	const onCall = byId.get(onCallId)!;
	const avatarFill = (hue: number) => `oklch(0.42 0.1 ${hue})`;

	function statusWord(s: string): string {
		return s === 'healthy' ? 'healthy' : s === 'degraded' ? 'degraded' : 'down';
	}
</script>

<div class="ops-root">
	<header class="appbar">
		<div class="logo">
			<span class="dot" aria-hidden="true"></span>
			<b>Aurora</b>
		</div>
		<span class="crumb"><span class="sep" aria-hidden="true">/</span>Operations</span>
		<span class="spacer" aria-hidden="true"></span>
		<button type="button" class="pill-range" aria-label="Time range: Last 60 minutes">
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7v5l3 2" />
			</svg>
			Last 60 min
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
		<span class="oncall" aria-label="On call: {onCall.name}">
			<span class="oncall-lab">On call</span>
			<span
				class="avatar"
				style="background: {avatarFill(onCall.hue)}"
				aria-label="{onCall.name}, on call"
				title="{onCall.name}, on call">{onCall.initials}</span
			>
		</span>
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
				<rect x="6" y="5" width="4" height="14" rx="1" />
				<rect x="14" y="5" width="4" height="14" rx="1" />
			</svg>
			Pause stream
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
				<strong>Metrics pipeline delayed.</strong>
				Telemetry is up to 40s stale for us-east while the collector replays the buffer.
			</span>
			<span class="err-end">
				<button type="button" class="btn btn-ghost">Dismiss</button>
				<button type="button" class="btn">Retry</button>
			</span>
		</div>

		<section class="kpi-row" aria-label="Headline metrics">
			{#each headline as m (m.id)}
				<article class="kpi">
					<div class="kpi-lab">
						<span class="eyebrow">{m.label}</span>
					</div>
					<div class="kpi-main">
						<span class="v">{m.value}</span>
						<svg class="spark" viewBox="0 0 72 24" preserveAspectRatio="none" aria-hidden="true">
							<polyline
								points={spark(m.spark, 72, 22)}
								fill="none"
								stroke="var(--spark-{m.good ? 'up' : 'down'})"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<span
						class="delta {m.tone === 'up' ? 'pos' : 'neg'}"
						aria-label="{m.label}: {m.delta} {m.tone === 'up' ? 'up' : 'down'}, {m.good
							? 'favorable'
							: 'unfavorable'}"
					>
						<span class="tri" aria-hidden="true">{m.tone === 'up' ? '▲' : '▼'}</span>
						{m.delta}
					</span>
					<div class="vs">{m.caption}</div>
				</article>
			{/each}
		</section>

		<section class="panel topo-panel" aria-label="Service topology">
			<div class="panel-h">
				<span class="t">Topology</span>
				<span class="s">6 services · live dependencies</span>
				<span class="panel-end">
					<span class="legend">
						<span><i class="lk ink" aria-hidden="true"></i>healthy dep</span>
						<span><i class="lk bad" aria-hidden="true"></i>at-risk dep</span>
						<span><i class="pdot deg" aria-hidden="true"></i>degraded node</span>
					</span>
					<div class="seg" role="group" aria-label="Region filter">
						{#each ['all', 'us-e', 'eu-w'] as r, i (r)}
							<button
								type="button"
								class={i === 0 ? 'on' : ''}
								aria-pressed={i === 0}
								aria-label="Region: {r}">{r}</button
							>
						{/each}
					</div>
				</span>
			</div>

			<!-- Desktop / tablet: SVG dependency graph -->
			<div class="topo-svg">
				<svg
					class="topo"
					viewBox="0 0 {TOPO_W} {TOPO_H}"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label="Dependency graph of six Aurora services. API Gateway depends on Web App and CDN. Web App depends on Postgres, Redis, and Workers. Workers depends on Postgres and Redis. Postgres and Workers are degraded; the edges into Postgres and into Workers are marked at risk."
				>
					<defs>
						<pattern id="bpgrid" width="24" height="24" patternUnits="userSpaceOnUse">
							<path d="M24 0H0V24" fill="none" stroke="var(--grid)" stroke-width="0.6" />
						</pattern>
					</defs>
					<rect x="0" y="0" width={TOPO_W} height={TOPO_H} fill="url(#bpgrid)" />

					<g class="edges">
						{#each dependencies as dep (dep.from + '-' + dep.to)}
							<path
								class="edge {dep.atRisk ? 'bad' : ''}"
								d={edgePath(dep.from, dep.to)}
								fill="none"
							/>
							<polygon class="arrow {dep.atRisk ? 'bad' : ''}" points={arrowPoints(dep.to)} />
						{/each}
					</g>

					{#each services as svc (svc.id)}
						{@const pos = nodePos[svc.id]}
						{@const degraded = svc.status === 'degraded'}
						<g
							class="node"
							data-svc={svc.id}
							data-status={svc.status}
							transform="translate({pos.cx - halfW},{pos.cy - halfH})"
							role="img"
							aria-label="{svc.label}: {statusWord(
								svc.status
							)}, uptime {svc.uptime}, throughput {svc.throughput} {svc.unit}, error rate {svc.errorPct}, p95 {svc.p95} milliseconds"
						>
							{#if degraded}
								<rect
									class="pulse"
									x="-7"
									y="-7"
									width={NODE_W + 14}
									height={NODE_H + 14}
									rx="14"
								/>
							{/if}
							<rect class="ncard" width={NODE_W} height={NODE_H} rx="8" />
							<circle class="ndot ndot-{svc.status}" cx="12" cy="15" r="4" />
							<text class="nlabel" x="22" y="19">{svc.label}</text>
							<text class="nstatus nstatus-{svc.status}" x="10" y="37"
								>{statusWord(svc.status)}</text
							>
							<text class="nstat" x={NODE_W - 10} y="37" text-anchor="end">{svc.uptime}</text>
							<text class="nmeta" x="10" y="53">{svc.throughput} {svc.unit}</text>
							<text class="nmeta r" x={NODE_W - 10} y="53" text-anchor="end">p95 {svc.p95}ms</text>
						</g>
					{/each}
				</svg>
			</div>

			<!-- Mobile: vertical list with dependency hints (document must not overflow) -->
			<div class="topo-list" role="list" aria-label="Service topology">
				{#each services as svc (svc.id)}
					{@const deps = dependencies.filter((d) => d.from === svc.id)}
					<div class="trow" data-svc={svc.id} data-status={svc.status} role="listitem">
						<div class="trow-h">
							<span class="pdot pdot-{svc.status}" aria-hidden="true"></span>
							<b>{svc.label}</b>
							<span class="tstatus tstatus-{svc.status}">{statusWord(svc.status)}</span>
						</div>
						<div class="trow-stats">
							<span>up {svc.uptime}</span>
							<span>{svc.throughput} {svc.unit}</span>
							<span>p95 {svc.p95}ms</span>
							<span>err {svc.errorPct}</span>
						</div>
						{#if deps.length}
							<div class="trow-deps">
								depends on:
								{#each deps as d, i (d.to)}{@const t = byServiceId.get(d.to)!}<span
										class="dep {d.atRisk ? 'dep-bad' : ''}"
										>{t.label}{i < deps.length - 1 ? ',' : ''}</span
									>{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<section class="panel" aria-label="Live metrics">
			<div class="panel-h">
				<span class="t">Live metrics</span>
				<span class="s">Last 60 min · 5-min buckets</span>
				<span class="panel-end">
					<span class="legend">
						<span><i class="lk ink" aria-hidden="true"></i>Request rate</span>
						<span><i class="lk bad" aria-hidden="true"></i>Error rate</span>
					</span>
				</span>
			</div>
			<div class="chartwrap">
				<svg
					class="chart"
					viewBox="0 0 {CW} {CH}"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label="Request rate climbed from about 4,620 to 4,820 requests per second and error rate rose from 0.24 to 0.42 percent over the last 60 minutes."
				>
					<g class="grid" stroke-width="1">
						<line x1={PL} y1={plotTop} x2={CW - PR} y2={plotTop} />
						<line x1={PL} y1={(plotTop + plotBot) / 2} x2={CW - PR} y2={(plotTop + plotBot) / 2} />
						<line x1={PL} y1={plotBot} x2={CW - PR} y2={plotBot} />
					</g>
					<g
						class="axis axis-l"
						font-family="ui-monospace, monospace"
						font-size="10"
						text-anchor="end"
					>
						<text x={PL - 8} y={plotTop + 4}>5,000</text>
						<text x={PL - 8} y={(plotTop + plotBot) / 2 + 4}>4,750</text>
						<text x={PL - 8} y={plotBot + 4}>4,500</text>
					</g>
					<g
						class="axis axis-r"
						font-family="ui-monospace, monospace"
						font-size="10"
						text-anchor="start"
					>
						<text x={CW - PR + 8} y={plotTop + 4}>0.50%</text>
						<text x={CW - PR + 8} y={(plotTop + plotBot) / 2 + 4}>0.35%</text>
						<text x={CW - PR + 8} y={plotBot + 4}>0.20%</text>
					</g>
					<g class="axis" font-family="ui-monospace, monospace" font-size="10" text-anchor="middle">
						{#each intervals as lab, i (lab)}
							{#if i % 2 === 0}
								<text x={xs[i].toFixed(0)} y={plotBot + 18}>{lab}</text>
							{/if}
						{/each}
					</g>
					<polyline class="req-line" points={reqPts.join(' ')} />
					<polyline class="err-line" points={errPts.join(' ')} />
					<circle
						class="req-dot"
						cx={xs[xs.length - 1].toFixed(0)}
						cy={yReq(reqSeries[reqSeries.length - 1]).toFixed(0)}
						r="3"
					/>
					<circle
						class="err-dot"
						cx={xs[xs.length - 1].toFixed(0)}
						cy={yErr(errSeries[errSeries.length - 1]).toFixed(0)}
						r="3"
					/>
				</svg>
			</div>
		</section>

		<div class="grid-sub">
			<section class="panel" aria-label="Incidents">
				<div class="panel-h">
					<span class="t">Incidents</span>
					<span class="s">3 open · last 7 days</span>
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
								placeholder="Filter incidents"
								aria-label="Filter incidents"
								bind:value={regionQuery}
							/>
						</label>
						<div class="seg" role="group" aria-label="Incident filter">
							{#each filters as f (f)}
								<button
									type="button"
									class={activeFilter === f ? 'on' : ''}
									aria-pressed={activeFilter === f}
									onclick={() => (activeFilter = f)}>{f}</button
								>
							{/each}
						</div>
					</span>
				</div>
				<div class="tbl-wrap">
					<table class="tbl">
						<thead>
							<tr>
								<th scope="col">ID</th>
								<th scope="col">Service</th>
								<th scope="col">Sev</th>
								<th scope="col" class="r">Age</th>
								<th scope="col">Status</th>
								<th scope="col">Summary</th>
							</tr>
						</thead>
						<tbody>
							{#each incidents as inc (inc.id)}
								{@const svc = byServiceId.get(inc.service)}
								<tr>
									<td class="num">{inc.id}</td>
									<td>{svc?.label ?? inc.service}</td>
									<td>
										<span class="sev sev-{inc.severity.toLowerCase()}">{inc.severity}</span>
									</td>
									<td class="r num">{inc.age}</td>
									<td>
										<span class="badge s-{inc.status}">
											<span class="d" aria-hidden="true"></span>
											{inc.status}
										</span>
									</td>
									<td class="summary">{inc.summary}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<aside class="rail" aria-label="Operational indicators">
				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Error budget</span></div>
					<div class="slo-row">
						<div class="slo-big">{slo.budgetRemaining}%</div>
						<div class="slo-state">
							<span class="pdot pdot-degraded" aria-hidden="true"></span>
							<span class="slo-word">{slo.state}</span>
						</div>
					</div>
					<div class="budgetbar" aria-hidden="true">
						<span class="budgetfill" style="width:{slo.budgetRemaining}%"></span>
					</div>
					<div class="mini-note">SLO {slo.slo} · 30-day window</div>
				</div>

				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">Recent deployments</span></div>
					<div class="sk sk-big" aria-hidden="true"></div>
					<div class="sk sk-sm" aria-hidden="true"></div>
					<div class="mini-note">Fetching deploy timeline…</div>
				</div>

				<div class="mini">
					<div class="mini-lab"><span class="eyebrow">eu-west incidents</span></div>
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
						<span class="t">No incidents in eu-west</span>
						<span class="s">The region filter has no matching incidents in the last 60 min.</span>
					</div>
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
	}

	.ops-root,
	.ops-root *,
	.ops-root *::before,
	.ops-root *::after {
		box-sizing: border-box;
	}

	.ops-root {
		/* Topology-schematic tokens — OKLCH throughout, warm-tinted blueprint cream, no pure black/white. */
		--canvas: oklch(0.95 0.008 220);
		--surface: oklch(0.972 0.006 220);
		--surface-2: oklch(0.94 0.007 220);
		--surface-3: oklch(0.91 0.007 220);
		--grid: oklch(0.9 0.006 220);
		--border: oklch(0.85 0.009 220);
		--border-strong: oklch(0.76 0.013 220);
		--ink: oklch(0.4 0.04 220); /* primary ink, ~8:1 on cream */
		--muted: oklch(
			0.46 0.028 220
		); /* secondary labels, darkened from concept 0.52 for AA headroom */
		--faint: oklch(0.5 0.022 220); /* tertiary text */
		--bad: oklch(0.55 0.16 25); /* UI strokes (edges/dots into degraded) — verify >=3:1 as UI */
		--bad-ink: oklch(0.47 0.16 25); /* darkened red for all text roles */
		--good: oklch(0.5 0.09 220); /* restrained calm teal, healthy dots only */
		--good-ink: oklch(0.42 0.09 220); /* teal text if ever needed */
		--on-accent: oklch(0.97 0.006 220);
		--accent: oklch(0.4 0.04 220);
		--spark-up: oklch(0.46 0.1 200);
		--spark-down: oklch(0.47 0.16 25);
		--err-bg: oklch(0.93 0.022 25);
		--err-border: oklch(
			0.6 0.15 25
		); /* darkened from 0.7 to clear >=3:1 (WCAG 1.4.11) against err-bg and canvas */
		--chart-grid: oklch(0.89 0.008 220);

		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		font-synthesis: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: var(--ink);
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

	/* ---------- Sticky app bar (opaque, schematic chrome) ---------- */
	.appbar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 11px 28px;
		background: var(--surface);
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
		background: var(--ink);
		display: grid;
		place-items: center;
	}

	.logo .dot::after {
		content: '';
		width: 7px;
		height: 7px;
		border: 1.5px solid var(--surface);
		border-radius: 1px;
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
		color: var(--ink);
		border: 1px solid var(--border);
		background: var(--surface);
		padding: 6px 12px;
		border-radius: 8px;
		cursor: pointer;
	}

	.pill-range svg {
		opacity: 0.6;
	}

	.vdiv {
		width: 1px;
		height: 20px;
		background: var(--border);
	}

	.oncall {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.oncall-lab {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
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
		color: var(--on-accent);
		border: 2px solid var(--surface);
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
		color: var(--ink);
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
		background: var(--ink);
		border-color: transparent;
		color: var(--on-accent);
		font-weight: 600;
	}

	.btn-primary:hover {
		background: oklch(0.36 0.04 220);
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
		color: var(--bad-ink);
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

	/* ---------- KPI row ---------- */
	.kpi-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 14px;
	}

	.kpi {
		border: 1px solid var(--border);
		border-radius: 11px;
		background: var(--surface);
		padding: 15px 16px;
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
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 22px;
		letter-spacing: -0.018em;
		line-height: 1;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.spark {
		width: 72px;
		height: 24px;
		flex: none;
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
		color: var(--good-ink);
	}

	.delta.neg {
		color: var(--bad-ink);
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
		width: 14px;
		height: 2px;
		border-radius: 2px;
		display: inline-block;
	}

	.lk.ink {
		background: var(--ink);
	}

	.lk.bad {
		background: var(--bad);
	}

	.legend .pdot {
		width: 9px;
		height: 9px;
		border-radius: 9999px;
		display: inline-block;
	}

	.legend .pdot.deg {
		background: var(--bad);
		border: 1.5px solid var(--bad-ink);
	}

	/* ---------- Segmented toggle ---------- */
	.seg {
		display: inline-flex;
		border: 1px solid var(--border);
		border-radius: 8px;
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
		border-radius: 8px 0 0 8px;
	}

	.seg button:last-child {
		border-radius: 0 8px 8px 0;
	}

	.seg button.on {
		background: color-mix(in oklch, var(--ink) 10%, var(--surface-2));
		color: var(--ink);
		font-weight: 600;
	}

	.seg button + button {
		border-left: 1px solid var(--border);
	}

	/* ---------- Topology ---------- */
	.topo-panel {
		overflow: visible;
	}

	.topo-svg {
		padding: 6px 10px 14px;
	}

	.topo {
		width: 100%;
		height: auto;
		display: block;
	}

	.topo .node {
		cursor: default;
	}

	.topo .pulse {
		fill: none;
		stroke: var(--bad);
		stroke-width: 1.5;
		opacity: 0.55;
		transform-box: fill-box;
		transform-origin: center;
	}

	.topo .ncard {
		fill: var(--surface);
		stroke: var(--border-strong);
		stroke-width: 1;
	}

	.topo .node[data-status='degraded'] .ncard {
		stroke: var(--bad-ink);
		stroke-width: 1.5;
	}

	.topo .ndot {
		stroke-width: 0;
	}

	.topo .ndot-healthy {
		fill: var(--good);
	}

	.topo .ndot-degraded {
		fill: var(--bad);
	}

	.topo .ndot-down {
		fill: var(--bad-ink);
	}

	.topo .nlabel {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 600;
		fill: var(--ink);
	}

	.topo .nstatus {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--muted);
	}

	.topo .nstatus-degraded {
		fill: var(--bad-ink);
	}

	.topo .nstatus-healthy {
		fill: var(--good-ink);
	}

	.topo .nstat {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--ink);
	}

	.topo .nmeta {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		fill: var(--muted);
	}

	.topo .edges .edge {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-dasharray: 4 4;
		opacity: 0.78;
	}

	.topo .edges .edge.bad {
		stroke: var(--bad);
		stroke-width: 1.8;
		opacity: 0.95;
	}

	.topo .arrow {
		fill: var(--ink);
		opacity: 0.78;
	}

	.topo .arrow.bad {
		fill: var(--bad);
		opacity: 0.95;
	}

	/* Decorative edge-flow + degraded-node pulse: only under no-preference motion.
	   The static DAG (dashes + faded pulse) conveys the same facts without motion. */
	@media (prefers-reduced-motion: no-preference) {
		.topo .edge {
			animation: dashflow 0.9s linear infinite;
		}

		.topo .edge.bad {
			animation: dashflow 0.7s linear infinite;
		}

		.topo .pulse {
			animation: heartbeat 1.8s ease-out infinite;
		}
	}

	@keyframes dashflow {
		to {
			stroke-dashoffset: -16;
		}
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1);
			opacity: 0.55;
		}
		65% {
			transform: scale(1.16);
			opacity: 0;
		}
		100% {
			transform: scale(1.16);
			opacity: 0;
		}
	}

	/* ---------- Mobile topology list ---------- */
	.topo-list {
		display: none;
		flex-direction: column;
		gap: 10px;
		padding: 12px 16px 16px;
	}

	.trow {
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--surface);
		padding: 10px 12px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.trow[data-status='degraded'] {
		border-color: var(--bad-ink);
	}

	.trow-h {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.trow-h b {
		font-size: 13.5px;
		font-weight: 600;
	}

	.tstatus {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--muted);
	}

	.tstatus-degraded {
		color: var(--bad-ink);
	}

	.tstatus-healthy {
		color: var(--good-ink);
	}

	.trow-stats {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--muted);
	}

	.trow-deps {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--faint);
	}

	.trow-deps .dep {
		color: var(--ink);
	}

	.trow-deps .dep-bad {
		color: var(--bad-ink);
		font-weight: 600;
	}

	.pdot {
		width: 9px;
		height: 9px;
		border-radius: 9999px;
		display: inline-block;
		flex: none;
	}

	.pdot-healthy {
		background: var(--good);
	}

	.pdot-degraded {
		background: var(--bad);
		border: 1.5px solid var(--bad-ink);
	}

	.pdot-down {
		background: var(--bad-ink);
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

	.chart .req-line {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.chart .err-line {
		fill: none;
		stroke: var(--bad);
		stroke-width: 1.8;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-dasharray: 3 3;
	}

	.chart .req-dot {
		fill: var(--ink);
	}

	.chart .err-dot {
		fill: var(--bad);
	}

	/* ---------- Table ---------- */
	.tbl-wrap {
		padding: 8px 4px 4px;
		overflow-x: auto;
	}

	.tbl {
		width: 100%;
		border-collapse: collapse;
		white-space: nowrap;
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

	.tbl .summary {
		white-space: normal;
		color: var(--ink);
	}

	.sev {
		display: inline-flex;
		align-items: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 600;
		padding: 3px 8px;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--surface-2);
		color: var(--ink);
	}

	.sev-sev-2 {
		border-color: var(--bad-ink);
		color: var(--bad-ink);
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
		color: var(--ink);
		white-space: nowrap;
	}

	.badge .d {
		width: 6px;
		height: 6px;
		border-radius: 9999px;
		flex: none;
	}

	.badge.s-active .d {
		background: var(--bad);
	}

	.badge.s-resolved .d {
		background: var(--good);
	}

	.badge.s-monitored .d {
		background: var(--ink);
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
		color: var(--ink);
		font: inherit;
		font-size: 12px;
		width: 130px;
	}

	.search input::placeholder {
		color: var(--faint);
	}

	.search svg {
		opacity: 0.5;
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

	.slo-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}

	.slo-big {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 600;
		font-size: 24px;
		letter-spacing: -0.02em;
	}

	.slo-state {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.slo-word {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		font-weight: 600;
		color: var(--bad-ink);
		text-transform: capitalize;
	}

	.budgetbar {
		margin-top: 12px;
		height: 8px;
		border-radius: 9999px;
		background: var(--surface-3);
		overflow: hidden;
	}

	.budgetfill {
		display: block;
		height: 100%;
		background: var(--bad);
		border-radius: 9999px;
	}

	.mini-note {
		margin-top: 10px;
		font-size: 11px;
		color: var(--faint);
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

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
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
	.ops-root :where(button, input):focus-visible {
		outline: 3px solid var(--ink);
		outline-offset: 2px;
	}

	/* ---------- Motion ---------- */
	@media (prefers-reduced-motion: no-preference) {
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
		.grid-sub {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 760px) {
		.body {
			padding: 18px 14px 60px;
		}

		.appbar {
			padding: 11px 14px;
			gap: 10px;
		}

		.kpi-row {
			grid-template-columns: 1fr 1fr;
		}

		/* Swap topology SVG for the vertical list so the document never overflows. */
		.topo-svg {
			display: none;
		}

		.topo-list {
			display: flex;
		}
	}
</style>
