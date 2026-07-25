import { expect, test } from '@playwright/test';

// dashboard-saas-riso — Risograph Broadsheet direction.
//
// Test-first: this file is run RED while the entry is an unpublished workbench
// draft (public /designs/dashboard-saas-riso returns 404 → the detail heading is
// absent), then GREEN after promotion to published/.

test('opens the dashboard-saas-riso design and locks the risograph signature + AA baseline', async ({
	page
}) => {
	// ------------------------------------------------------------------
	// Detail page: identity + exact public summary.
	// ------------------------------------------------------------------
	await page.goto('/designs/dashboard-saas-riso');

	await expect(
		page.getByRole('heading', { name: 'SaaS Analytics · Risograph Broadsheet', exact: false })
	).toBeVisible();
	await expect(
		page.getByText('risograph-printed broadsheet for the Aurora product-analytics dashboard', {
			exact: false
		})
	).toBeVisible();
	await expect(
		page.getByText(
			'two spot colors (fluorescent red and federal blue) deliberately misregister with mix-blend-mode multiply overprint',
			{ exact: false }
		)
	).toBeVisible();

	// ------------------------------------------------------------------
	// Isolated preview: locked SaaS baseline content.
	// ------------------------------------------------------------------
	const frame = page.frameLocator('iframe[title*="preview"i]');

	// Masthead nameplate + dateline (broadsheet identity)
	await expect(frame.getByRole('heading', { name: 'Aurora · Product analytics' })).toBeVisible();
	await expect(frame.getByText('Vol. IV, No. 7', { exact: false })).toBeVisible();

	// Header range + team avatars
	await expect(frame.getByRole('button', { name: 'Date range: Last 30 days' })).toBeVisible();
	for (const initials of ['MR', 'DC', 'PN', 'SO', 'LF']) {
		await expect(frame.locator('.avatar', { hasText: initials }).first()).toBeVisible();
	}

	// KPI values + deltas (mixed up/down; never color alone)
	await expect(frame.getByText('$48,200')).toBeVisible();
	await expect(frame.getByText('12,840')).toBeVisible();
	await expect(frame.getByText('3.8%').first()).toBeVisible();
	await expect(frame.getByText('1.9%').first()).toBeVisible();

	// Trend chart (dual-series 12-cycle) + revenue-by-plan halftone panel
	await expect(frame.locator('.chart').first()).toBeVisible();
	await expect(frame.locator('.overprint-layer').first()).toBeVisible();

	// Top accounts table (5 rows)
	await expect(frame.getByText('Northwind Labs')).toBeVisible();
	await expect(frame.getByText('Helix Systems')).toBeVisible();
	await expect(frame.getByText('Cobalt Industries')).toBeVisible();
	await expect(frame.getByText('Lumen Health')).toBeVisible();
	await expect(frame.getByText('Atlas Robotics')).toBeVisible();

	// Demonstrated states
	await expect(frame.locator('.sk').first()).toBeVisible(); // loading skeleton (NRR widget)
	await expect(frame.getByText('Press run interrupted', { exact: false })).toBeVisible(); // inline error
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
	// Direct preview route: risograph signature + AA contrast table +
	// 44x44 targets + no overflow + reduced motion.
	// ------------------------------------------------------------------
	await page.goto('/designs/dashboard-saas-riso/preview');
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.getByText('Aurora', { exact: true }).first()).toBeVisible();

	// Risograph signature: warm newsprint (not pure white), the two spot colors
	// are declared, halftone dot SVGs render, the overprint layer exists with
	// TWO stacked dot layers, the red pass uses mix-blend-mode: multiply, and
	// the misregistration is a deliberate non-zero fixed positional offset.
	const sig = await page.evaluate(() => {
		const root = document.querySelector('.dash-root');
		const cs = root instanceof HTMLElement ? getComputedStyle(root) : null;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!cs || !ctx) return null;
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
		const overprintLayers = Array.from(document.querySelectorAll('.overprint-layer'));
		const firstLayer = overprintLayers[0];
		const blueEl = firstLayer?.querySelector('.ht-blue');
		const redEl = firstLayer?.querySelector('.ht-red');
		const blueRect = blueEl?.getBoundingClientRect();
		const redRect = redEl?.getBoundingClientRect();
		const redCs = redEl ? getComputedStyle(redEl) : null;
		// Halftone dot count across all plan bars.
		const dotCount = document.querySelectorAll('.ht-dots circle').length;
		// Nameplate ornament skew + decorative-only markers. aria-hidden lives on
		// the .nameplate-ornament wrapper; the skew transform lives on .orn-dots.
		const ornamentWrap = document.querySelector('.nameplate-ornament');
		const ornament = document.querySelector('.orn-dots');
		const ornamentCs = ornament ? getComputedStyle(ornament) : null;
		return {
			newsprintLum: lum(cs.backgroundColor),
			newsprintRgb: cs.backgroundColor,
			spotBlueDeclared: cs.getPropertyValue('--spot-blue'),
			spotRedDeclared: cs.getPropertyValue('--spot-red'),
			spotRedInkDeclared: cs.getPropertyValue('--spot-red-ink'),
			overprintLayerCount: overprintLayers.length,
			blueLayerExists: !!blueEl,
			redLayerExists: !!redEl,
			redMixBlend: redCs?.mixBlendMode ?? '',
			offsetDx: blueRect && redRect ? redRect.left - blueRect.left : null,
			offsetDy: blueRect && redRect ? redRect.top - blueRect.top : null,
			dotCount,
			ornamentExists: !!ornamentWrap,
			ornamentAriaHidden: ornamentWrap?.getAttribute('aria-hidden'),
			ornamentTransform: ornamentCs?.transform ?? '',
			noGradientOnCanvas: cs.backgroundImage ?? 'none',
			noBackdropFilter: cs.backdropFilter ?? 'none',
			noBoxShadowOnPanel:
				getComputedStyle(document.querySelector('.panel') ?? root ?? document.body).boxShadow ?? ''
		};
	});
	expect(sig).not.toBeNull();
	// Newsprint is warm off-white, clearly darker than pure white (L < 0.97).
	expect(sig!.newsprintLum, 'newsprint is warm off-white, not pure white').toBeLessThan(0.97);
	expect(sig!.newsprintLum, 'newsprint is a light surface').toBeGreaterThan(0.7);
	// Both spot colors declared (non-empty, distinct).
	expect(sig!.spotBlueDeclared.trim().length, 'spot-blue declared').toBeGreaterThan(0);
	expect(sig!.spotRedDeclared.trim().length, 'spot-red declared').toBeGreaterThan(0);
	expect(sig!.spotRedInkDeclared.trim().length, 'spot-red-ink declared').toBeGreaterThan(0);
	expect(sig!.spotBlueDeclared, 'blue and red are distinct').not.toBe(sig!.spotRedDeclared);
	// Halftone dots render across the plan bars.
	expect(sig!.dotCount, 'halftone dots render').toBeGreaterThan(50);
	// Overprint signature: one layer per plan, each with two stacked dot layers.
	expect(sig!.overprintLayerCount, 'one overprint layer per plan segment').toBeGreaterThanOrEqual(
		4
	);
	expect(sig!.blueLayerExists, 'blue dot layer present').toBe(true);
	expect(sig!.redLayerExists, 'red dot layer present').toBe(true);
	// The red pass is the overprint: mix-blend-mode multiply.
	expect(sig!.redMixBlend, 'red overprint uses mix-blend-mode: multiply').toBe('multiply');
	// The misregistration is a deliberate non-zero fixed offset (2–4px on each axis).
	expect(sig!.offsetDx, 'overprint dx is a deliberate non-zero offset').toBeGreaterThanOrEqual(2);
	expect(sig!.offsetDx, 'overprint dx stays within 2–4px').toBeLessThanOrEqual(4);
	expect(sig!.offsetDy, 'overprint dy is a deliberate non-zero offset').toBeGreaterThanOrEqual(1);
	expect(sig!.offsetDy, 'overprint dy stays within 1–4px').toBeLessThanOrEqual(4);
	// Nameplate ornament: exists, decorative, and skewed (the broadsheet ~3° mark).
	expect(sig!.ornamentExists, 'nameplate ornament exists').toBe(true);
	expect(sig!.ornamentAriaHidden, 'ornament is aria-hidden (decorative)').toBe('true');
	expect(sig!.ornamentTransform, 'ornament is skewed (~3°)').toContain('matrix');
	// No gradients, no backdrop-filter, no panel box-shadow (flat printed sheet).
	expect(sig!.noGradientOnCanvas, 'no background gradient on canvas').toBe('none');
	expect(sig!.noBackdropFilter, 'no backdrop-filter').toBe('none');
	expect(sig!.noBoxShadowOnPanel, 'no box-shadow on panels').toBe('none');

	// The masthead nameplate and KPI values use the editorial serif (Georgia).
	const typeVoices = await page.evaluate(() => {
		const ff = (sel: string) => {
			const el = document.querySelector(sel);
			return el ? getComputedStyle(el).fontFamily : '';
		};
		return { nameplate: ff('.nameplate'), kpiValue: ff('.kpi .v'), eyebrow: ff('.eyebrow') };
	});
	expect(typeVoices.nameplate.toLowerCase(), 'nameplate uses Georgia serif').toContain('georgia');
	expect(typeVoices.kpiValue.toLowerCase(), 'KPI value uses Georgia serif').toContain('georgia');
	expect(typeVoices.eyebrow.toLowerCase(), 'eyebrow uses monospace').toContain('monospace');

	// ------------------------------------------------------------------
	// Table-driven WCAG AA contrast audit: every semantic text role against
	// its actual opaque newsprint parent. Includes the red + blue deltas and
	// the status badges. Red text must use the darkened --spot-red-ink.
	// ------------------------------------------------------------------
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
			{ role: 'goal-value', ratio: ratio('.goal-v', '.mini') },
			{ role: 'goal-status', ratio: ratio('.goal-status', '.mini') },
			{ role: 'link-text', ratio: ratio('.link', '.panel') },
			{ role: 'nameplate', ratio: ratio('.nameplate', '.masthead') },
			{ role: 'dateline', ratio: ratio('.dateline', '.masthead') }
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
	// accessible name (favorable/unfavorable + good/bad).
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

	// 44x44 targets at 375/768/1280 + no horizontal overflow, and the ornament
	// skew straightens on mobile (no overflow induced by the broadsheet skew).
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

	// Reduced motion: the overprint misregistration stays static (it never
	// animated), the skeleton pulse is suppressed, and the full static dashboard
	// remains present and complete.
	await page.setViewportSize({ width: 1280, height: 900 });
	await page.emulateMedia({ reducedMotion: 'reduce' });

	const reducedMotion = await page.evaluate(() => {
		const sk = document.querySelector('.sk');
		const orn = document.querySelector('.ht-red');
		return {
			skeletonAnim: sk ? getComputedStyle(sk).animationName : 'none',
			// The overprint layer must remain in place (static offset) under reduced motion.
			overprintStillPresent: !!orn,
			overprintTransform: orn ? getComputedStyle(orn).transform : ''
		};
	});
	expect(reducedMotion.skeletonAnim, 'skeleton pulse suppressed under reduced motion').toBe('none');
	expect(reducedMotion.overprintStillPresent, 'overprint layer remains under reduced motion').toBe(
		true
	);
	// The fixed misregistration offset survives (transform is still a translate, not 'none').
	expect(reducedMotion.overprintTransform, 'overprint keeps its static misregistration').not.toBe(
		'none'
	);

	// The complete static dashboard is still present under reduced motion.
	await expect(page.getByText('$48,200')).toBeVisible();
	await expect(page.getByText('Northwind Labs')).toBeVisible();
	await expect(page.getByText('Press run interrupted', { exact: false })).toBeVisible();
	await expect(page.getByText('Q3 MRR goal', { exact: false })).toBeVisible();
	await expect(page.getByText('No anomalies in range')).toBeVisible();
	await expect(page.locator('.sk').first()).toBeVisible();
	await expect(page.locator('.overprint-layer').first()).toBeVisible();

	await page.emulateMedia({ reducedMotion: null });
});
