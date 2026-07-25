import { expect, test, type Page } from '@playwright/test';

// Focus-perimeter helper for the chart-range segmented control. Asserts that
// the focused .seg button has a solid >=3px accent-ink (teal) outline whose
// extent reaches beyond the .seg container on the sides that matter (top and
// bottom always; left for the first button, right for the last), proving the
// ring needs overflow:visible to render and is therefore unclipped. Also
// asserts the ring reads >=3:1 against the surrounding panel-header backdrop.
async function assertSegFocusPerimeter(page: Page, label: string, horizSide: 'left' | 'right') {
	const info = await page.evaluate((side) => {
		const el = document.activeElement;
		if (!(el instanceof HTMLElement)) return null;
		const seg = el.closest('.seg');
		if (!seg) return null;
		const cs = getComputedStyle(el);
		const segCs = getComputedStyle(seg);
		const ow = parseFloat(cs.outlineWidth);
		const oo = parseFloat(cs.outlineOffset || '0');
		const extent = ow + oo;
		const btnRect = el.getBoundingClientRect();
		const segRect = seg.getBoundingClientRect();
		const segBorderL = parseFloat(segCs.borderLeftWidth);
		const segBorderR = parseFloat(segCs.borderRightWidth);
		const segBorderT = parseFloat(segCs.borderTopWidth);
		const segBorderB = parseFloat(segCs.borderBottomWidth);
		// Top and bottom always extend beyond the seg (buttons fill its height).
		const extendsTop = btnRect.top - extent < segRect.top + segBorderT;
		const extendsBottom = btnRect.bottom + extent > segRect.bottom - segBorderB;
		// The relevant horizontal side: left for the first button, right for the last.
		const extendsHoriz =
			side === 'left'
				? btnRect.left - extent < segRect.left + segBorderL
				: btnRect.right + extent > segRect.right - segBorderR;
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
		const surround = el.closest('.panel-h') ?? el.closest('.panel');
		// Climb to the nearest OPAQUE ancestor for the effective backdrop
		// (panel-h is transparent; the ring actually renders on the panel surface).
		const isOpaque = (c: string) => {
			const m = c.match(/rgba?\([^)]*\)/);
			if (!m) return true;
			const p = m[0].replace(/[^\d.,]/g, '').split(',');
			return p.length < 4 || parseFloat(p[3]) > 0;
		};
		let bgNode: Element | null = surround;
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
		return {
			outlineStyle: cs.outlineStyle,
			outlineWidth: ow,
			extendsHoriz,
			extendsTop,
			extendsBottom,
			contrast
		};
	}, horizSide);
	expect(info, `seg focus info for ${label}`).not.toBeNull();
	expect(info!.outlineStyle, `${label} outline solid`).toBe('solid');
	expect(info!.outlineWidth, `${label} outline >= 3px`).toBeGreaterThanOrEqual(3);
	expect(info!.extendsHoriz, `${label} ring extends ${horizSide} of seg`).toBe(true);
	expect(info!.extendsTop, `${label} ring extends top of seg`).toBe(true);
	expect(info!.extendsBottom, `${label} ring extends bottom of seg`).toBe(true);
	expect(info!.contrast, `${label} focus ring >= 3:1`).toBeGreaterThanOrEqual(3);
}

test('opens the dashboard-saas-slate design and its isolated preview states', async ({ page }) => {
	// ---- Detail page: identity + exact public summary ----
	await page.goto('/designs/dashboard-saas-slate');

	await expect(
		page.getByRole('heading', { name: 'SaaS Analytics · Cool Slate', exact: false })
	).toBeVisible();
	await expect(
		page.getByText(
			'A calm, crafted SaaS product-analytics dashboard on a cool light-gray canvas with low-chroma slate neutrals, a single restrained teal accent, system-grotesque tight-tracked type, monospace numerals, 1px hairline borders, and a backdrop-blur sticky header.',
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

	// Trend chart (dual-series 12-month) + revenue donut, as real inline SVG
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
	await expect(frame.getByText('Live sync interrupted', { exact: false })).toBeVisible(); // inline error
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Dismiss', exact: true })).toBeVisible();
	await expect(frame.getByText('No anomalies in range')).toBeVisible(); // empty/filtered segment

	// Export primary action
	await expect(frame.getByRole('button', { name: 'Export' })).toBeVisible();

	// interaction smoke: segmented range toggle updates aria-pressed
	const seg30 = frame.getByRole('button', { name: '30D', exact: true });
	await seg30.click();
	await expect(seg30).toHaveAttribute('aria-pressed', 'true');

	// ------------------------------------------------------------------
	// Direct preview route: visual signature + AA contrast table +
	// 44x44 targets + no overflow + reduced motion.
	// ------------------------------------------------------------------
	await page.goto('/designs/dashboard-saas-slate/preview');
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.getByText('Aurora', { exact: true })).toBeVisible();

	// Visual signature: cool slate — light canvas (not dark), low-chroma slate
	// neutrals, a restrained teal accent. No pure black/white.
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
		return {
			canvasLum: bgLum('.dash-root'),
			barBg: cs('.appbar')?.backgroundColor ?? '',
			backdrop: cs('.appbar')?.backdropFilter ?? 'none',
			accent: cs('.dash-root')?.getPropertyValue('--accent') ?? '',
			accentTealness: tealness(cs('.dash-root')?.getPropertyValue('--accent') || 'oklch(0 0 0)'),
			chartBg: bgLum('.panel'),
			panelBorder: cs('.panel')?.borderWidth ?? '0',
			noGradientOnCanvas: cs('.dash-root')?.backgroundImage ?? 'none',
			noGradientOnPanel: cs('.panel')?.backgroundImage ?? 'none'
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.canvasLum, 'canvas is light (not dark)').toBeGreaterThan(0.85);
	expect(sig!.backdrop, 'header has backdrop blur').not.toBe('none');
	expect(sig!.accentTealness, 'accent is teal (green>red)').toBeGreaterThan(15);
	expect(sig!.panelBorder, 'panels have hairline borders (>=1px)').not.toBe('0');
	expect(sig!.noGradientOnCanvas, 'no gradient on canvas').toBe('none');
	expect(sig!.noGradientOnPanel, 'no gradient on panels').toBe('none');

	// Table-driven WCAG AA contrast audit: every semantic text role against its
	// actual opaque parent surface.
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

	// Deltas never rely on color alone: each carries an up/down arrow glyph.
	const deltaArrows = await page.evaluate(() => {
		const deltas = Array.from(document.querySelectorAll('.delta'));
		return deltas.map((el) => ({
			cls: el.className,
			text: el.textContent?.trim() ?? '',
			hasArrow: /▲|▼|↑|↓/.test(el.textContent ?? '')
		}));
	});
	expect(deltaArrows.length, 'deltas present').toBeGreaterThan(0);
	for (const d of deltaArrows) {
		expect(d.hasArrow, `delta "${d.text}" has an up/down arrow`).toBe(true);
	}

	// ------------------------------------------------------------------
	// Chart-range segmented control: focus-perimeter regression (WCAG
	// 2.4.11/2.4.13). .seg { overflow: hidden } clips the offset
	// :focus-visible ring (3px + 2px = 5px extent) on every side, making
	// keyboard focus on the 7D/30D/90D/12M buttons invisible. Same root
	// cause as the kanban-editorial fix.
	// ------------------------------------------------------------------
	// Root-cause lock first: the .seg container must not clip.
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

	// Then Tab-walk keyboard focus to the FIRST and LAST .seg button at
	// 768 and 1280, and assert an unclipped accent-ink (teal) ring renders
	// on all four sides at >=3:1 against the surrounding backdrop.
	for (const width of [768, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		// Focus the Retry button (last focusable before the seg group in tab
		// order), then Tab into the first seg button so :focus-visible applies.
		await page.getByRole('button', { name: 'Retry' }).focus();
		await page.keyboard.press('Tab'); // -> 7D (first .seg button)
		await assertSegFocusPerimeter(page, 'first (7D)', 'left');
		// Tab to the last seg button (12M).
		await page.keyboard.press('Tab'); // -> 30D
		await page.keyboard.press('Tab'); // -> 90D
		await page.keyboard.press('Tab'); // -> 12M (last .seg button)
		await assertSegFocusPerimeter(page, 'last (12M)', 'right');
	}

	// 44x44 targets at 375/768/1280 + no horizontal overflow.
	const targets = ['Export', 'Retry', 'Dismiss', '7D', '30D', '90D', '12M'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of targets) {
			const box = await page.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height, `${name} height at ${width}`).toBeGreaterThanOrEqual(44);
			expect(box?.width, `${name} width at ${width}`).toBeGreaterThanOrEqual(44);
		}
		// The range pill and filter-accounts search are clickable targets too.
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

	// Reduced motion: skeleton pulse suppressed; skeleton stays visible.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const skeletonStatic = await page.evaluate(() => {
		const el = document.querySelector('.sk');
		if (!(el instanceof HTMLElement)) return null;
		return getComputedStyle(el).animationName === 'none';
	});
	expect(skeletonStatic).toBe(true);
	await page.emulateMedia({ reducedMotion: null });

	// Almost no box-shadow: at most one tiny soft shadow on hover. At rest,
	// verify no element carries a decorative elevation shadow (the cool-slate
	// direction is hairline-border-first, elevation-free at rest).
	const shadowOffenders = await page.evaluate(() => {
		const offenders: { cls: string; shadow: string }[] = [];
		document.querySelectorAll('.dash-root, .dash-root *').forEach((el) => {
			const cs = getComputedStyle(el);
			if (cs.boxShadow !== 'none') {
				offenders.push({
					cls: (el as HTMLElement).className || el.tagName.toLowerCase(),
					shadow: cs.boxShadow
				});
			}
		});
		return offenders;
	});
	expect(shadowOffenders, 'no resting box-shadow (elevation-free at rest)').toEqual([]);
});
