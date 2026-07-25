import { expect, test, type Page } from '@playwright/test';

// Two-context focus helper for a dark theme: asserts the focused control has a
// solid >=3px teal outline and that the outline reads >=3:1 against the
// SURROUNDING backdrop (the parent chain that the offset ring actually paints
// over), not the control's own face. The ring must read on whichever dark
// surface the control sits on (deep-space canvas vs raised panel).
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
		// Climb the parent chain to the nearest OPAQUE ancestor — the backdrop the
		// offset ring paints over (the control's own face is irrelevant).
		const isOpaque = (cssColor: string) => {
			const m = cssColor.match(/rgba?\([^)]*\)/);
			if (!m) return true;
			const parts = m[0].replace(/[^\d.,]/g, '').split(',');
			return parts.length < 4 || parseFloat(parts[3]) > 0;
		};
		let bgNode: Element | null = el.parentElement;
		let bgColor = 'rgb(0,0,0)';
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

test('opens the dashboard-saas-orbital design and its isolated preview states', async ({
	page
}) => {
	// ---- Detail page: identity + exact public summary ----
	await page.goto('/designs/dashboard-saas-orbital');

	await expect(
		page.getByRole('heading', { name: 'SaaS Analytics · Orbital Telemetry', exact: false })
	).toBeVisible();
	await expect(
		page.getByText(
			'A dark deep-space telemetry console for the Aurora product-analytics dashboard: a conic radar sweep rotates over concentric telemetry rings while KPI readouts dock to ring quadrants and sparklines render as orbit arcs. Phosphor teal dominates, with signal-green and alert-amber as restrained semantic secondaries.',
			{ exact: true }
		)
	).toBeVisible();

	// ---- Isolated preview: locked SaaS baseline content ----
	const frame = page.frameLocator('iframe[title*="preview"i]');

	// Header identity + range + team avatars
	await expect(frame.getByText('Aurora', { exact: true })).toBeVisible();
	await expect(frame.getByText('Product analytics', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Date range: Last 30 days' })).toBeVisible();
	for (const initials of ['MR', 'DC', 'PN', 'SO', 'LF']) {
		await expect(frame.locator('.avatar', { hasText: initials }).first()).toBeVisible();
	}

	// KPI values + deltas (mixed up/down; never color alone)
	await expect(frame.getByText('$48,200')).toBeVisible();
	await expect(frame.getByText('12,840')).toBeVisible();
	await expect(frame.getByText('3.8%').first()).toBeVisible();
	await expect(frame.getByText('1.9%').first()).toBeVisible();

	// Trend chart (dual-series 12-cycle) + revenue donut, as real inline SVG
	await expect(frame.locator('.chart').first()).toBeVisible();
	await expect(frame.locator('.donut')).toBeVisible();

	// Top accounts table (5 rows) with hairline rows
	await expect(frame.getByText('Northwind Labs')).toBeVisible();
	await expect(frame.getByText('Helix Systems')).toBeVisible();
	await expect(frame.getByText('Cobalt Industries')).toBeVisible();
	await expect(frame.getByText('Lumen Health')).toBeVisible();
	await expect(frame.getByText('Atlas Robotics')).toBeVisible();

	// Demonstrated states
	await expect(frame.locator('.sk').first()).toBeVisible(); // loading skeleton (NRR widget)
	await expect(frame.getByText('Telemetry link degraded', { exact: false })).toBeVisible(); // inline error
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Dismiss', exact: true })).toBeVisible();
	await expect(frame.getByText('No anomalies in range')).toBeVisible(); // empty/filtered segment
	await expect(frame.getByText('Q3 MRR goal', { exact: false })).toBeVisible(); // goal/status indicator

	// Export primary action
	await expect(frame.getByRole('button', { name: 'Export' })).toBeVisible();

	// interaction smoke: segmented range toggle updates aria-pressed
	const seg30 = frame.getByRole('button', { name: '30D', exact: true });
	await seg30.click();
	await expect(seg30).toHaveAttribute('aria-pressed', 'true');

	// ------------------------------------------------------------------
	// Direct preview route: orbital signature + AA contrast table +
	// 44x44 targets + no overflow + reduced motion + two-context focus.
	// ------------------------------------------------------------------
	await page.goto('/designs/dashboard-saas-orbital/preview');
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.getByText('Aurora', { exact: true })).toBeVisible();

	// Orbital signature: dark deep-space canvas, phosphor-teal accent, the radar
	// sweep exists and is decorative (aria-hidden + pointer-events:none), and the
	// concentric telemetry rings render.
	const sig = await page.evaluate(() => {
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
		const tealness = (cssColor: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = cssColor;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return d[1] - d[0]; // green minus red — teal reads positive
		};
		const ringsSvg = document.querySelector('.rings');
		const ringsCs = ringsSvg ? getComputedStyle(ringsSvg) : null;
		const ringCount = document.querySelectorAll('.ringline').length;
		const sweepEl = document.querySelector('.sweep');
		const sweepCs = sweepEl ? getComputedStyle(sweepEl) : null;
		return {
			canvasLum: bgLum('.dash-root'),
			accent: cs('.dash-root')?.getPropertyValue('--accent') ?? '',
			accentTealness: tealness(cs('.dash-root')?.getPropertyValue('--accent') || 'oklch(0 0 0)'),
			chartBg: bgLum('.panel'),
			panelBorder: cs('.panel')?.borderWidth ?? '0',
			noGradientOnCanvas: cs('.dash-root')?.backgroundImage ?? 'none',
			noGradientOnPanel: cs('.panel')?.backgroundImage ?? 'none',
			ringsPointerEvents: ringsCs?.pointerEvents ?? '',
			ringsAriaHidden: ringsSvg?.getAttribute('aria-hidden'),
			ringCount,
			sweepExists: !!sweepEl,
			sweepTransform: sweepCs?.transform ?? ''
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.canvasLum, 'canvas is deep-space dark (not light)').toBeLessThan(0.25);
	expect(sig!.accentTealness, 'accent is teal (green>red)').toBeGreaterThan(15);
	expect(sig!.ringCount, 'concentric telemetry rings render').toBeGreaterThanOrEqual(3);
	expect(sig!.sweepExists, 'radar sweep element exists').toBe(true);
	expect(sig!.ringsAriaHidden, 'rings are aria-hidden (decorative)').toBe('true');
	expect(sig!.ringsPointerEvents, 'rings are pointer-events:none (decorative)').toBe('none');
	expect(sig!.panelBorder, 'panels have hairline borders (>=1px)').not.toBe('0');
	expect(sig!.noGradientOnCanvas, 'no background gradient on canvas').toBe('none');
	expect(sig!.noGradientOnPanel, 'no background gradient on panels').toBe('none');

	// Table-driven WCAG AA contrast audit: every semantic text role against its
	// actual opaque parent surface (deep-space / panel), compositing any
	// translucency. Includes the amber/green deltas and status badges.
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
			return lum('rgb(0,0,0)');
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
		const elRatio = (el: Element) => {
			if (!(el instanceof HTMLElement)) return -1;
			const tL = lum(getComputedStyle(el).color);
			const bL = bgLumOf(el);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
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
			{ role: 'table-head', ratio: ratio('.tbl th', '.panel') },
			{ role: 'table-account', ratio: ratio('.tbl .acc b', '.tbl tbody tr') },
			{ role: 'table-id', ratio: ratio('.tbl .id', '.tbl tbody tr') },
			{ role: 'table-mrr', ratio: ratio('.tbl .num', '.tbl tbody tr') },
			{ role: 'chip-plan', ratio: selfRatio('.chip') },
			{ role: 'badge-healthy', ratio: selfRatio('.badge.s-pos') },
			{ role: 'badge-risk', ratio: selfRatio('.badge.s-neg') },
			{ role: 'badge-new', ratio: selfRatio('.badge.s-acc') },
			{ role: 'owner-name', ratio: ratio('.tbl .owner-name', '.tbl tbody tr') },
			{ role: 'error-msg', ratio: ratio('.errbar .msg', '.errbar') },
			{ role: 'error-strong', ratio: ratio('.errbar .msg strong', '.errbar') },
			{ role: 'empty-title', ratio: ratio('.empty .t', '.mini') },
			{ role: 'empty-sub', ratio: ratio('.empty .s', '.mini') },
			{ role: 'export-text', ratio: selfRatio('.btn-primary') },
			{ role: 'retry-text', ratio: selfRatio('.errbar .btn:not(.btn-ghost)') },
			{ role: 'seg-on', ratio: selfRatio('.seg button.on') },
			{ role: 'seg-off', ratio: selfRatio('.seg button:not(.on)') },
			{ role: 'search-placeholder', ratio: ratio('.search input', '.search', '::placeholder') },
			{ role: 'search-input', ratio: ratio('.search input', '.search') },
			{ role: 'mini-value', ratio: ratio('.mini .v', '.mini') },
			{ role: 'link-text', ratio: ratio('.link', '.panel') }
		];
		document.querySelectorAll('.delta').forEach((el) => {
			const cls = el.className;
			results.push({ role: `delta:${cls}`, ratio: elRatio(el) });
		});
		document.querySelectorAll('.avatar').forEach((el) => {
			const initials = el.textContent?.trim() || '?';
			results.push({ role: `avatar:${initials}`, ratio: elRatio(el) });
		});
		return results;
	});
	expect(contrastResults).not.toBeNull();
	for (const { role, ratio } of contrastResults!) {
		expect(ratio, `${role} text contrast >= 4.5:1`).toBeGreaterThanOrEqual(4.5);
	}

	// Deltas never rely on color alone: each carries an up/down arrow glyph and an
	// accessible name (favorable/unfavorable).
	const deltas = await page.evaluate(() => {
		const list = Array.from(document.querySelectorAll('.delta'));
		return list.map((el) => ({
			text: el.textContent?.trim() ?? '',
			label: el.getAttribute('aria-label') ?? '',
			hasArrow: /▲|▼|↑|↓/.test(el.textContent ?? '')
		}));
	});
	expect(deltas.length, 'deltas present').toBeGreaterThan(0);
	for (const d of deltas) {
		expect(d.hasArrow, `delta "${d.text}" has an up/down arrow`).toBe(true);
		expect(d.label.length, `delta "${d.text}" has an accessible label`).toBeGreaterThan(0);
	}

	// Status badges always carry text + dot (never color alone).
	const badges = await page.evaluate(() => {
		return Array.from(document.querySelectorAll('.badge')).map((el) => ({
			text: el.textContent?.trim() ?? '',
			hasDot: !!el.querySelector('.d')
		}));
	});
	expect(badges.length, 'badges present').toBeGreaterThan(0);
	for (const b of badges) {
		expect(b.text.length, `badge has visible text`).toBeGreaterThan(0);
		expect(b.hasDot, `badge "${b.text}" has a dot`).toBe(true);
	}

	// .seg container must not clip the offset focus ring (overflow: visible).
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

	// Two-context focus: a representative control on a raised panel (a segmented
	// button) and the primary action on the console-bezel header both get a
	// >=3:1 teal ring against their actual backdrop.
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.getByRole('button', { name: '7D', exact: true }).focus();
	await assertFocusRingOnBackdrop(page, 'seg button 7D');
	await page.getByRole('button', { name: 'Export' }).focus();
	await assertFocusRingOnBackdrop(page, 'Export primary');

	// 44x44 targets at 375/768/1280 + no horizontal overflow.
	const targets = ['Export', 'Retry', 'Dismiss', '7D', '30D', '90D', '12M'];
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

	// Reduced motion: the sweep holds static (no running rotation), the skeleton
	// pulse is suppressed, and the full static dashboard stays present.
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ reducedMotion: 'reduce' });

	const reducedMotion = await page.evaluate(() => {
		const sweep = document.querySelector('.sweep');
		const sk = document.querySelector('.sk');
		return {
			sweepAnim: sweep ? getComputedStyle(sweep).animationName : 'none',
			sweepTransform: sweep ? getComputedStyle(sweep).transform : '',
			skeletonAnim: sk ? getComputedStyle(sk).animationName : 'none'
		};
	});
	expect(reducedMotion.sweepAnim, 'sweep rotation suppressed under reduced motion').toBe('none');
	expect(reducedMotion.skeletonAnim, 'skeleton pulse suppressed under reduced motion').toBe('none');
	// The sweep still exists and holds a static transform (frozen at 135°).
	expect(reducedMotion.sweepTransform, 'sweep holds a static transform').not.toBe('none');

	// The complete static dashboard is still present under reduced motion.
	await expect(page.getByText('$48,200')).toBeVisible();
	await expect(page.getByText('Northwind Labs')).toBeVisible();
	await expect(page.getByText('Telemetry link degraded', { exact: false })).toBeVisible();
	await expect(page.getByText('Q3 MRR goal', { exact: false })).toBeVisible();
	await expect(page.getByText('No anomalies in range')).toBeVisible();
	await expect(page.locator('.sk').first()).toBeVisible();

	await page.emulateMedia({ reducedMotion: null });
});
