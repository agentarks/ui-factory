import { expect, test, type Page } from '@playwright/test';

// Focus-ring helper: asserts the focused control has a solid >=3px ink outline
// that reads >=3:1 against the SURROUNDING backdrop (the parent chain the offset
// ring actually paints over), not the control's own face.
async function assertFocusRingOnBackdrop(page: Page, label: string) {
	const info = await page.evaluate(() => {
		const el = document.activeElement;
		if (!(el instanceof HTMLElement)) return null;
		const cs = getComputedStyle(el);
		const ow = parseFloat(cs.outlineWidth);
		const oo = parseFloat(cs.outlineOffset || '0');
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return null;
		const lum = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			const ch = (v: number) => {
				const s = v / 255;
				return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * ch(d[0]) + 0.7152 * ch(d[1]) + 0.0722 * ch(d[2]);
		};
		const isOpaque = (cssColor: string) => {
			const m = cssColor.match(/rgba?\([^)]*\)/);
			if (!m) return true;
			const parts = m[0].replace(/[^\d.,]/g, '').split(',');
			return parts.length < 4 || parseFloat(parts[3]) > 0;
		};
		let bgNode: Element | null = el.parentElement;
		let bgColor = 'rgb(255,255,255)';
		while (bgNode) {
			const bg = getComputedStyle(bgNode).backgroundColor;
			if (isOpaque(bg)) {
				bgColor = bg;
				break;
			}
			bgNode = bgNode.parentElement;
		}
		const oL = lum(cs.outlineColor);
		const bL = lum(bgColor);
		const contrast = (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
		return { outlineStyle: cs.outlineStyle, outlineWidth: ow, offset: oo, contrast };
	});
	expect(info, `focus info for ${label}`).not.toBeNull();
	expect(info!.outlineStyle, `${label} outline solid`).toBe('solid');
	expect(info!.outlineWidth, `${label} outline >= 3px`).toBeGreaterThanOrEqual(3);
	expect(info!.contrast, `${label} focus ring >= 3:1 on backdrop`).toBeGreaterThanOrEqual(3);
}

test('opens the dashboard-ops-topology design and its isolated preview states', async ({
	page
}) => {
	// ---- Detail page: identity + exact public summary ----
	await page.goto('/designs/dashboard-ops-topology');

	await expect(
		page.getByRole('heading', { name: 'Operational · Topology Schematic', exact: false })
	).toBeVisible();
	await expect(
		page.getByText(
			'A light warm-tinted blueprint dependency-graph operations dashboard for Aurora: a topology DAG of six services with animated dashed edges flowing client → dependency and heartbeat pulses on degraded nodes, over four headline metrics, a dual-series live-metrics chart, an incidents list, and an SLO / error-budget indicator.',
			{ exact: true }
		)
	).toBeVisible();

	// ---- Isolated preview: locked Operational baseline content ----
	const frame = page.frameLocator('iframe[title*="preview"i]');

	// Header identity + range + on-call avatar LF
	await expect(frame.getByText('Aurora', { exact: true })).toBeVisible();
	await expect(frame.getByText('Operations', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Time range: Last 60 minutes' })).toBeVisible();
	await expect(frame.locator('.avatar', { hasText: 'LF' }).first()).toBeVisible();

	// 4 headline metrics + deltas (mixed good/bad; never color alone)
	await expect(frame.getByText('99.94%').first()).toBeVisible();
	await expect(frame.getByText('4,820 req/s')).toBeVisible();
	await expect(frame.getByText('0.42%').first()).toBeVisible();
	await expect(frame.getByText('184 ms')).toBeVisible();

	// Live-metrics chart + topology DAG as real inline SVG
	await expect(frame.locator('.chart').first()).toBeVisible();
	await expect(frame.locator('.topo').first()).toBeVisible();

	// Service labels (present in both SVG nodes and mobile list)
	for (const label of ['API Gateway', 'Web App', 'Postgres', 'Redis', 'Workers', 'CDN']) {
		await expect(frame.getByText(label, { exact: true }).first()).toBeVisible();
	}

	// Incidents (3) — IDs + summaries
	await expect(frame.getByText('INC-2041')).toBeVisible();
	await expect(frame.getByText('INC-2040')).toBeVisible();
	await expect(frame.getByText('INC-2039')).toBeVisible();
	await expect(frame.getByText('Elevated query latency in us-east')).toBeVisible();

	// SLO / error-budget indicator
	await expect(frame.getByText('Error budget', { exact: false })).toBeVisible();
	await expect(frame.locator('.slo-big')).toHaveText('62%');

	// Demonstrated states
	await expect(frame.locator('.sk').first()).toBeVisible(); // loading skeleton (deploys)
	await expect(frame.getByText('Metrics pipeline delayed', { exact: false })).toBeVisible(); // inline error
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Dismiss', exact: true })).toBeVisible();
	await expect(frame.getByText('No incidents in eu-west')).toBeVisible(); // empty/filtered segment

	// Pause stream primary action
	await expect(frame.getByRole('button', { name: 'Pause stream' })).toBeVisible();

	// interaction smoke: incident-filter segmented toggle updates aria-pressed
	const filterAll = frame.getByRole('button', { name: 'All', exact: true });
	await filterAll.click();
	await expect(filterAll).toHaveAttribute('aria-pressed', 'true');

	// ------------------------------------------------------------------
	// Direct preview route: topology signature + AA contrast table +
	// 44x44 targets + no overflow + reduced motion + focus.
	// ------------------------------------------------------------------
	await page.goto('/designs/dashboard-ops-topology/preview');
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.getByText('Aurora', { exact: true })).toBeVisible();

	// Topology signature: 6 service nodes, 7 dependency edges with
	// stroke-dasharray, 2 degraded-node pulse rings, arrowheads, and at-risk
	// edges into degraded targets. The grid field tiles behind it.
	const topo = await page.evaluate(() => {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return null;
		const lum = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			const ch = (v: number) => {
				const s = v / 255;
				return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * ch(d[0]) + 0.7152 * ch(d[1]) + 0.0722 * ch(d[2]);
		};
		const cs = (sel: string) => {
			const el = document.querySelector(sel);
			return el instanceof HTMLElement ? getComputedStyle(el) : null;
		};
		const bgLum = (sel: string) => {
			const c = cs(sel);
			return c ? lum(c.backgroundColor) : -1;
		};
		const nodes = Array.from(document.querySelectorAll('.topo .node'));
		const edges = Array.from(document.querySelectorAll('.topo .edge'));
		const pulses = Array.from(document.querySelectorAll('.topo .pulse'));
		const arrows = Array.from(document.querySelectorAll('.topo .arrow'));
		const degradedNodes = nodes.filter((n) => n.getAttribute('data-status') === 'degraded');
		const edgeDasharrays = edges.map((e) => getComputedStyle(e as SVGElement).strokeDasharray);
		const atRiskEdges = edges.filter((e) =>
			(e as SVGElement).getAttribute('class')?.includes('bad')
		);
		return {
			canvasLum: bgLum('.ops-root'),
			chartBg: bgLum('.panel'),
			panelBorder: cs('.panel')?.borderWidth ?? '0',
			noGradientOnCanvas: cs('.ops-root')?.backgroundImage ?? 'none',
			noGradientOnPanel: cs('.panel')?.backgroundImage ?? 'none',
			nodeCount: nodes.length,
			edgeCount: edges.length,
			pulseCount: pulses.length,
			arrowCount: arrows.length,
			degradedNodeCount: degradedNodes.length,
			allEdgesDashed: edgeDasharrays.every((d) => d !== 'none' && d !== ''),
			atRiskEdgeCount: atRiskEdges.length
		};
	});
	expect(topo).not.toBeNull();
	expect(topo!.canvasLum, 'canvas is light (warm cream)').toBeGreaterThan(0.85);
	expect(topo!.nodeCount, 'six service nodes').toBe(6);
	expect(topo!.edgeCount, 'seven dependency edges').toBe(7);
	expect(topo!.pulseCount, 'two degraded-node pulse rings').toBe(2);
	expect(topo!.degradedNodeCount, 'two degraded nodes (Postgres, Workers)').toBe(2);
	expect(topo!.arrowCount, 'an arrowhead per edge').toBe(7);
	expect(topo!.allEdgesDashed, 'every edge has stroke-dasharray').toBe(true);
	expect(topo!.atRiskEdgeCount, 'at-risk edges into degraded targets').toBeGreaterThanOrEqual(3);
	expect(topo!.panelBorder, 'panels have hairline borders').not.toBe('0');
	expect(topo!.noGradientOnCanvas, 'no background gradient on canvas').toBe('none');
	expect(topo!.noGradientOnPanel, 'no background gradient on panels').toBe('none');

	// Table-driven WCAG AA contrast audit: every semantic text role against its
	// actual opaque parent surface (cream canvas / panel / node card), reading
	// `color` for HTML and `fill` for SVG <text>. Includes red deltas, red
	// status words, SEV-2, and incident badges.
	const contrastResults = await page.evaluate(() => {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return null;
		const lum = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			const ch = (v: number) => {
				const s = v / 255;
				return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * ch(d[0]) + 0.7152 * ch(d[1]) + 0.0722 * ch(d[2]);
		};
		const isOpaque = (cssColor: string) => {
			const m = cssColor.match(/rgba?\([^)]*\)/);
			if (!m) return true;
			const parts = m[0].replace(/[^\d.,]/g, '').split(',');
			return parts.length < 4 || parseFloat(parts[3]) > 0;
		};
		const bgLumOf = (el: Element | null): number => {
			let node: Element | null = el;
			while (node) {
				const bg = getComputedStyle(node).backgroundColor;
				if (isOpaque(bg)) return lum(bg);
				node = node.parentElement;
			}
			return lum('rgb(255,255,255)');
		};
		// For SVG <text> the glyph colour is `fill`; for HTML it is `color`.
		const fgLumOf = (el: Element): number => {
			const cs = getComputedStyle(el);
			return lum((el as SVGElement).tagName === 'text' ? cs.fill : cs.color);
		};
		const ratio = (textSel: string, bgSel: string, pseudo?: string) => {
			const textEl = document.querySelector(textSel);
			const bgEl = document.querySelector(bgSel);
			if (!(textEl instanceof HTMLElement) || !(bgEl instanceof HTMLElement)) return -1;
			const cs = pseudo ? getComputedStyle(textEl, pseudo) : getComputedStyle(textEl);
			const tL = lum(cs.color);
			const bL = bgLumOf(bgEl);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
		const selfRatio = (sel: string) => ratio(sel, sel);
		const results: { role: string; ratio: number }[] = [
			{ role: 'kpi-value', ratio: ratio('.kpi .v', '.kpi') },
			{ role: 'kpi-eyebrow', ratio: ratio('.eyebrow', '.kpi') },
			{ role: 'kpi-vs', ratio: ratio('.kpi .vs', '.kpi') },
			{ role: 'delta-pos', ratio: ratio('.delta.pos', '.kpi') },
			{ role: 'delta-neg', ratio: ratio('.delta.neg', '.kpi') },
			{ role: 'panel-title', ratio: ratio('.panel-h .t', '.panel') },
			{ role: 'panel-sub', ratio: ratio('.panel-h .s', '.panel') },
			{ role: 'legend', ratio: ratio('.legend span', '.panel-h') },
			{ role: 'brand', ratio: ratio('.logo b', '.appbar') },
			{ role: 'crumb', ratio: ratio('.crumb', '.appbar') },
			{ role: 'range-text', ratio: ratio('.pill-range', '.appbar') },
			{ role: 'oncall-lab', ratio: ratio('.oncall-lab', '.appbar') },
			{ role: 'table-head', ratio: ratio('.tbl th', '.panel') },
			{ role: 'table-id', ratio: ratio('.tbl .num', '.tbl tbody tr') },
			{ role: 'table-summary', ratio: ratio('.tbl .summary', '.tbl tbody tr') },
			{ role: 'sev-2', ratio: selfRatio('.sev-sev-2') },
			{ role: 'sev-3', ratio: selfRatio('.sev:not(.sev-sev-2)') },
			{ role: 'badge-active', ratio: selfRatio('.badge.s-active') },
			{ role: 'badge-resolved', ratio: selfRatio('.badge.s-resolved') },
			{ role: 'badge-monitored', ratio: selfRatio('.badge.s-monitored') },
			{ role: 'error-msg', ratio: ratio('.errbar .msg', '.errbar') },
			{ role: 'error-strong', ratio: ratio('.errbar .msg strong', '.errbar') },
			{ role: 'empty-title', ratio: ratio('.empty .t', '.mini') },
			{ role: 'empty-sub', ratio: ratio('.empty .s', '.mini') },
			{ role: 'slo-big', ratio: ratio('.slo-big', '.mini') },
			{ role: 'slo-word', ratio: ratio('.slo-word', '.mini') },
			{ role: 'mini-note', ratio: ratio('.mini-note', '.mini') },
			{ role: 'pause-text', ratio: selfRatio('.btn-primary') },
			{ role: 'retry-text', ratio: selfRatio('.errbar .btn:not(.btn-ghost)') },
			{ role: 'seg-on', ratio: selfRatio('.seg button.on') },
			{ role: 'seg-off', ratio: selfRatio('.seg button:not(.on)') },
			{ role: 'search-placeholder', ratio: ratio('.search input', '.search', '::placeholder') },
			{ role: 'search-input', ratio: ratio('.search input', '.search') }
		];
		// SVG <text> node labels / status / stats / meta read against the panel surface.
		for (const sel of ['.nlabel', '.nstatus', '.nstat', '.nmeta']) {
			document.querySelectorAll(sel).forEach((el, i) => {
				const tL = fgLumOf(el);
				const bL = bgLumOf(el);
				results.push({
					role: `${sel}:${i}`,
					ratio: (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05)
				});
			});
		}
		// Every delta element (role includes its class).
		document.querySelectorAll('.delta').forEach((el) => {
			const tL = lum(getComputedStyle(el).color);
			const bL = bgLumOf(el);
			results.push({
				role: `delta:${el.className}`,
				ratio: (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05)
			});
		});
		// Avatar initials.
		document.querySelectorAll('.avatar').forEach((el) => {
			const tL = lum(getComputedStyle(el).color);
			const bL = bgLumOf(el);
			results.push({
				role: `avatar:${el.textContent?.trim() || '?'}`,
				ratio: (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05)
			});
		});
		return results;
	});
	expect(contrastResults).not.toBeNull();
	for (const { role, ratio } of contrastResults!) {
		expect(ratio, `${role} text contrast >= 4.5:1`).toBeGreaterThanOrEqual(4.5);
	}

	// Deltas never rely on color alone: each carries an up/down arrow glyph.
	const deltaArrows = await page.evaluate(() => {
		const deltas = Array.from(document.querySelectorAll('.delta'));
		return deltas.map((el) => ({
			text: el.textContent?.trim() ?? '',
			hasArrow: /▲|▼|↑|↓/.test(el.textContent ?? '')
		}));
	});
	expect(deltaArrows.length, 'deltas present').toBeGreaterThan(0);
	for (const d of deltaArrows) {
		expect(d.hasArrow, `delta "${d.text}" has an up/down arrow`).toBe(true);
	}

	// Incident statuses + severities always carry text (never color alone).
	const badges = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('.badge')).map((el) => ({
			text: el.textContent?.trim() ?? '',
			hasDot: !!el.querySelector('.d')
		}));
	});
	expect(badges.length, 'incident badges present').toBeGreaterThan(0);
	for (const b of badges) {
		expect(b.text.length, `badge has visible text`).toBeGreaterThan(0);
		expect(b.hasDot, `badge "${b.text}" has a dot`).toBe(true);
	}
	const sevs = await page.evaluate(() =>
		Array.from(document.querySelectorAll('.sev')).map((el) => ({
			text: el.textContent?.trim() ?? ''
		}))
	);
	for (const s of sevs) {
		expect(s.text.length, 'severity pill has visible text').toBeGreaterThan(0);
	}

	// .seg containers must not clip the offset focus ring (overflow: visible).
	const segOverflow = await page.evaluate(() =>
		Array.from(document.querySelectorAll('.seg')).map((el) => {
			const cs = getComputedStyle(el);
			return { ox: cs.overflowX, oy: cs.overflowY };
		})
	);
	expect(segOverflow.length, 'seg groups present').toBeGreaterThan(0);
	for (const o of segOverflow) {
		expect(o.ox, 'seg overflow-x visible (no clip)').toBe('visible');
		expect(o.oy, 'seg overflow-y visible (no clip)').toBe('visible');
	}

	// Visible focus: a segmented button and the primary action both get a
	// >=3:1 ink ring against their backdrop.
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.getByRole('button', { name: 'All', exact: true }).focus();
	await assertFocusRingOnBackdrop(page, 'seg button All');
	await page.getByRole('button', { name: 'Pause stream' }).focus();
	await assertFocusRingOnBackdrop(page, 'Pause stream primary');

	// 44x44 targets at 375/768/1280 + no horizontal document overflow.
	const targets = [
		'Pause stream',
		'Retry',
		'Dismiss',
		'All',
		'Open',
		'Resolved',
		'Region: all',
		'Region: us-e',
		'Region: eu-w'
	];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of targets) {
			const box = await page.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height, `${name} height at ${width}`).toBeGreaterThanOrEqual(44);
			expect(box?.width, `${name} width at ${width}`).toBeGreaterThanOrEqual(44);
		}
		const rangeBox = await page.locator('.pill-range').boundingBox();
		expect(rangeBox?.height, `range height at ${width}`).toBeGreaterThanOrEqual(44);
		const searchBox = await page.locator('.search').first().boundingBox();
		expect(searchBox?.height, `search height at ${width}`).toBeGreaterThanOrEqual(44);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth - document.documentElement.clientWidth ||
				window.scrollX
		);
		expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
	}

	// Reduced motion: the dash-flow + heartbeat-pulse + skeleton-pulse are all
	// suppressed (animationName === 'none'); the static DAG + all data stay.
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ reducedMotion: 'reduce' });

	const reducedMotion = await page.evaluate(() => {
		const edge = document.querySelector('.topo .edge');
		const pulse = document.querySelector('.topo .pulse');
		const sk = document.querySelector('.sk');
		return {
			edgeAnim: edge ? getComputedStyle(edge as SVGElement).animationName : 'none',
			edgeDash: edge ? getComputedStyle(edge as SVGElement).strokeDasharray : 'none',
			pulseAnim: pulse ? getComputedStyle(pulse as SVGElement).animationName : 'none',
			pulseOpacity: pulse ? getComputedStyle(pulse as SVGElement).opacity : '1',
			skeletonAnim: sk ? getComputedStyle(sk).animationName : 'none',
			nodeCount: document.querySelectorAll('.topo .node').length,
			edgeCount: document.querySelectorAll('.topo .edge').length,
			pulseCount: document.querySelectorAll('.topo .pulse').length
		};
	});
	expect(reducedMotion.edgeAnim, 'dash-flow suppressed under reduced motion').toBe('none');
	expect(reducedMotion.pulseAnim, 'heartbeat pulse suppressed under reduced motion').toBe('none');
	expect(reducedMotion.skeletonAnim, 'skeleton pulse suppressed under reduced motion').toBe('none');
	expect(reducedMotion.edgeDash, 'dashes still present (static) under reduced motion').not.toBe(
		'none'
	);
	// The pulse ring stays visible (faded) under reduced motion.
	expect(
		parseFloat(reducedMotion.pulseOpacity!),
		'pulse ring still visible under reduced motion'
	).toBeGreaterThan(0.2);
	expect(reducedMotion.nodeCount, 'nodes still present under reduced motion').toBe(6);
	expect(reducedMotion.edgeCount, 'edges still present under reduced motion').toBe(7);
	expect(reducedMotion.pulseCount, 'pulse rings still present under reduced motion').toBe(2);

	// The complete static dashboard is still present under reduced motion.
	await expect(page.getByText('99.94%').first()).toBeVisible();
	await expect(page.getByText('Postgres', { exact: true }).first()).toBeVisible();
	await expect(page.getByText('Metrics pipeline delayed', { exact: false })).toBeVisible();
	await expect(page.getByText('No incidents in eu-west')).toBeVisible();
	await expect(page.locator('.slo-big')).toHaveText('62%');
	await expect(page.locator('.sk').first()).toBeVisible();

	await page.emulateMedia({ reducedMotion: null });
});
