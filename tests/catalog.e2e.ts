import { expect, test } from '@playwright/test';

test('lists published designs in the catalog', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: 'UI Factory', exact: true })).toBeVisible();
	await expect(page.locator('html')).toHaveCSS('box-sizing', 'border-box');
	const brand = page.getByRole('link', { name: 'UI Factory', exact: true });
	await expect(brand).toBeVisible();
	expect((await brand.boundingBox())?.height).toBeGreaterThanOrEqual(44);

	const designLink = page.getByRole('link', { name: 'Kanban Board · Glassmorphism' });
	await expect(designLink).toBeVisible();
	await expect(page.getByText('frosted, translucent Kanban board', { exact: false })).toBeVisible();
	await expect(page.getByText('No designs published')).toHaveCount(0);

	// The catalog list is intentionally chrome-free: no search or filter UI.
	await expect(page.getByRole('searchbox')).toHaveCount(0);
	await expect(page.getByRole('button', { name: /filter/i })).toHaveCount(0);
	await expect(page.getByRole('link', { name: /filter/i })).toHaveCount(0);
});

test('opens a published design detail with its isolated preview', async ({ page }) => {
	await page.goto('/designs/kanban-glassmorphism');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Glassmorphism', exact: false })
	).toBeVisible();
	await expect(page.getByText('frosted, translucent Kanban board', { exact: false })).toBeVisible();

	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');
});

test('returns 404 for an unknown design', async ({ page }) => {
	const response = await page.goto('/designs/missing');

	expect(response?.status()).toBe(404);
	await expect(page.getByText('Design not found', { exact: true })).toBeVisible();
});

test('returns an isolated 404 for an unknown design preview', async ({ page }) => {
	const response = await page.goto('/designs/missing/preview');

	expect(response?.status()).toBe(404);
	await expect(page.getByText('Design not found', { exact: true })).toBeVisible();
	await expect(page.locator('.factory-shell')).toHaveCount(0);
	await expect(page.locator('html')).toHaveCSS('box-sizing', 'content-box');
	await expect(page.locator('body')).toHaveCSS('margin', '8px');
});

test('opens the kanban-flat-material design and its isolated preview states', async ({ page }) => {
	await page.goto('/designs/kanban-flat-material');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Flat Material', exact: false })
	).toBeVisible();
	await expect(
		page.getByText('high-contrast Flat/Material Kanban board', { exact: false })
	).toBeVisible();

	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a container ring with meaningful
	// contrast against the field background (>=3:1, the WCAG UI-component minimum),
	// proving the ring is visible — not merely a non-zero outline that could still
	// disappear against the near-white field.
	const previewFrame = page.frame({ url: /kanban-flat-material\/preview$/ });
	expect(previewFrame).toBeTruthy();
	await frame.getByRole('searchbox').focus();
	const focusContrast = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.search');
		if (!(el instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		// No focus ring present (regression) -> fail fast with a sentinel below 3.
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		// Parse any CSS color (oklch/rgb/named) via the browser's canvas color parser.
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
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
		const oL = lum(cs.outlineColor);
		const bL = lum(cs.backgroundColor);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(focusContrast).toBeGreaterThanOrEqual(3);

	// every filter/view control is >=44px, and the preview has no horizontal
	// document overflow, at each of mobile/tablet/desktop widths
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await frame.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height).toBeGreaterThanOrEqual(44);
		}
		const overflow = await previewFrame!.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);
	}
});

test('opens the kanban-illustration design and its isolated preview states', async ({ page }) => {
	await page.goto('/designs/kanban-illustration');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Mid-Century Poster', exact: false })
	).toBeVisible();
	await expect(page.getByText('warm parchment Kanban board', { exact: false })).toBeVisible();

	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');
});

test('opens the kanban-neumorphism design and its isolated preview states', async ({ page }) => {
	await page.goto('/designs/kanban-neumorphism');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Neumorphism', exact: false })
	).toBeVisible();
	await expect(
		page.getByText('Hairline-Ringed Neumorphic Kanban board', { exact: false })
	).toBeVisible();

	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state (neumorphic
	// "selected = pressed in")
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a container ring with meaningful
	// contrast against the cool-gray surface (>=3:1, the WCAG UI-component
	// minimum), proving the ring is visible on the low-contrast neumorphic field.
	const previewFrame = page.frame({ url: /kanban-neumorphism\/preview$/ });
	expect(previewFrame).toBeTruthy();
	await frame.getByRole('searchbox').focus();
	const focusContrast = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.search');
		if (!(el instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
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
		const oL = lum(cs.outlineColor);
		const bL = lum(cs.backgroundColor);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(focusContrast).toBeGreaterThanOrEqual(3);

	// the New task primary is a dark-filled button; its focus outline renders
	// against the surrounding app-bar surface (outline-offset seats it outside
	// the fill), so the dark accent ring must still read at >=3:1 there — a
	// near-white ring would vanish against the near-white surface. Reach it by
	// Tabbing from the preceding control so :focus-visible legitimately applies
	// (a programmatic .focus() would not match the keyboard-only heuristic).
	await frame.getByRole('button', { name: 'List', exact: true }).press('Tab');
	const primaryFocus = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.primary');
		const surround = el?.closest('.app-bar');
		if (!(el instanceof HTMLElement) || !(surround instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
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
		const oL = lum(cs.outlineColor);
		const bL = lum(getComputedStyle(surround).backgroundColor);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(primaryFocus).toBeGreaterThanOrEqual(3);

	// every filter/view control is >=44px, and the preview has no horizontal
	// document overflow, at each of mobile/tablet/desktop widths
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await frame.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height).toBeGreaterThanOrEqual(44);
		}
		// icon buttons are square targets: assert both width and height >=44px.
		// Covers the column "more actions" button and the error dismiss button,
		// which previously shipped at 38px (a target-size regression).
		const moreActions = await frame
			.getByRole('button', { name: 'More actions for Backlog' })
			.boundingBox();
		expect(moreActions?.width).toBeGreaterThanOrEqual(44);
		expect(moreActions?.height).toBeGreaterThanOrEqual(44);
		const dismiss = await frame
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height).toBeGreaterThanOrEqual(44);
		const overflow = await previewFrame!.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);
	}

	// Shadow-only hover feedback — the hovered element's face AND every parent
	// surface stay at their neutral resting background; only the computed
	// box-shadow changes, gaining the documented cool-cobalt lower-right shadow.
	// AA-dark text contrast is maintained on the unchanged neutral face.
	const bgOf = (sel: string) =>
		previewFrame!.evaluate((s) => {
			const el = document.querySelector(s);
			if (!(el instanceof HTMLElement)) return null;
			return { color: getComputedStyle(el).backgroundColor };
		}, sel);
	// Returns the computed box-shadow string plus the largest (blue - red) channel
	// gap among its colors — a cobalt layer reads >=80; the neutral resting
	// shadows read far below that.
	const shadowOf = (sel: string) =>
		previewFrame!.evaluate((s) => {
			const el = document.querySelector(s);
			if (!(el instanceof HTMLElement)) return null;
			const shadow = getComputedStyle(el).boxShadow;
			const ctx = document.createElement('canvas').getContext('2d');
			if (!ctx) return null;
			const colors = shadow.match(/(rgba?|oklch)\([^)]*\)/g) ?? [];
			let maxGap = 0;
			for (const c of colors) {
				ctx.clearRect(0, 0, 2, 2);
				ctx.fillStyle = '#000';
				ctx.fillStyle = c;
				ctx.fillRect(0, 0, 2, 2);
				const d = ctx.getImageData(0, 0, 1, 1).data;
				maxGap = Math.max(maxGap, d[2] - d[0]);
			}
			return { shadow, maxCobaltGap: maxGap };
		}, sel);
	const contrastBetween = (textSel: string, bgSel: string) =>
		previewFrame!.evaluate(
			([t, b]: [string, string]) => {
				const text = document.querySelector(t);
				const bg = document.querySelector(b);
				if (!(text instanceof HTMLElement) || !(bg instanceof HTMLElement)) return -1;
				const ctx = document.createElement('canvas').getContext('2d');
				if (!ctx) return -1;
				const lum = (css: string) => {
					ctx.clearRect(0, 0, 2, 2);
					ctx.fillStyle = '#000';
					ctx.fillStyle = css;
					ctx.fillRect(0, 0, 2, 2);
					const d = ctx.getImageData(0, 0, 1, 1).data;
					const ch = (v: number) => {
						const x = v / 255;
						return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
					};
					return 0.2126 * ch(d[0]) + 0.7152 * ch(d[1]) + 0.0722 * ch(d[2]);
				};
				const tL = lum(getComputedStyle(text).color);
				const bL = lum(getComputedStyle(bg).backgroundColor);
				return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
			},
			[textSel, bgSel] as [string, string]
		);

	// representative card: face + column backgrounds unchanged; shadow -> cobalt
	const cardRestBg = await bgOf('.card');
	const colRestBg = await bgOf('.column');
	const cardRestShadow = await shadowOf('.card');
	expect(cardRestShadow).not.toBeNull();
	await frame.locator('.card').first().hover();
	await page.waitForTimeout(220); // let the 0.16s box-shadow transition settle
	const cardHoverBg = await bgOf('.card');
	const colHoverBg = await bgOf('.column');
	const cardHoverShadow = await shadowOf('.card');
	expect(cardHoverBg!.color).toBe(cardRestBg!.color); // hovered card face unchanged (neutral)
	expect(colHoverBg!.color).toBe(colRestBg!.color); // parent column unchanged (no tint)
	expect(cardRestShadow!.maxCobaltGap).toBeLessThan(80); // no cobalt at rest
	expect(cardHoverShadow!.shadow).not.toBe(cardRestShadow!.shadow); // shadow changed
	expect(cardHoverShadow!.maxCobaltGap).toBeGreaterThanOrEqual(80); // cobalt shadow present
	expect(await contrastBetween('.card-title', '.card')).toBeGreaterThanOrEqual(4.5); // AA on neutral face

	// representative secondary button (All filter chip): face + track backgrounds
	// unchanged; shadow -> cobalt
	const chipRestBg = await bgOf('.chip');
	const trackRestBg = await bgOf('.segmented');
	const chipRestShadow = await shadowOf('.chip');
	await frame.getByRole('button', { name: 'All', exact: true }).hover();
	await page.waitForTimeout(220);
	const chipHoverBg = await bgOf('.chip');
	const trackHoverBg = await bgOf('.segmented');
	const chipHoverShadow = await shadowOf('.chip');
	expect(chipHoverBg!.color).toBe(chipRestBg!.color); // hovered chip face unchanged (neutral)
	expect(trackHoverBg!.color).toBe(trackRestBg!.color); // parent track unchanged (no tint)
	expect(chipHoverShadow!.shadow).not.toBe(chipRestShadow!.shadow); // shadow changed
	expect(chipHoverShadow!.maxCobaltGap).toBeGreaterThanOrEqual(80); // cobalt shadow present
});

test('opens the kanban-claymorphism design and its isolated preview states', async ({ page }) => {
	await page.goto('/designs/kanban-claymorphism');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Luminous Putty', exact: false })
	).toBeVisible();
	await expect(page.getByText('dark claymorphism Kanban board', { exact: false })).toBeVisible();

	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state (claymorphic
	// "selected = pressed in")
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a container ring with meaningful
	// contrast (>=3:1, the WCAG UI-component minimum) against the field surface,
	// proving the ring is visible on the dark claymorphic field.
	const previewFrame = page.frame({ url: /kanban-claymorphism\/preview$/ });
	expect(previewFrame).toBeTruthy();
	await frame.getByRole('searchbox').focus();
	const focusContrast = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.search');
		if (!(el instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
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
		const oL = lum(cs.outlineColor);
		const bL = lum(cs.backgroundColor);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(focusContrast).toBeGreaterThanOrEqual(3);

	// The New task primary is a violet-filled button; its focus outline renders
	// against the surrounding app-bar surface (outline-offset seats it outside
	// the fill), so the focus ring must still read at >=3:1 there. Reach it by
	// Tabbing from the preceding control so :focus-visible legitimately applies.
	await frame.getByRole('button', { name: 'List', exact: true }).press('Tab');
	const primaryFocus = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.primary');
		const surround = el?.closest('.app-bar');
		if (!(el instanceof HTMLElement) || !(surround instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
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
		const oL = lum(cs.outlineColor);
		const bL = lum(getComputedStyle(surround).backgroundColor);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(primaryFocus).toBeGreaterThanOrEqual(3);

	// every filter/view control + icon button is >=44px, and the preview has no
	// horizontal document overflow, at each of mobile/tablet/desktop widths
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await frame.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height).toBeGreaterThanOrEqual(44);
		}
		const moreActions = await frame
			.getByRole('button', { name: 'More actions for Backlog' })
			.boundingBox();
		expect(moreActions?.width).toBeGreaterThanOrEqual(44);
		expect(moreActions?.height).toBeGreaterThanOrEqual(44);
		const dismiss = await frame
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height).toBeGreaterThanOrEqual(44);
		const overflow = await previewFrame!.evaluate(
			() => document.documentElement.scrollWidth - document.documentElement.clientWidth
		);
		expect(overflow).toBeLessThanOrEqual(0);
	}

	// Hover material behavior: the card face stays opaque pastel (unchanged
	// background); only the computed box-shadow changes (deeper extrusion), so
	// text contrast on the unchanged opaque face is preserved at AA.
	const bgOf = (sel: string) =>
		previewFrame!.evaluate((s) => {
			const el = document.querySelector(s);
			if (!(el instanceof HTMLElement)) return null;
			return { color: getComputedStyle(el).backgroundColor };
		}, sel);
	const shadowOf = (sel: string) =>
		previewFrame!.evaluate((s) => {
			const el = document.querySelector(s);
			if (!(el instanceof HTMLElement)) return null;
			return { shadow: getComputedStyle(el).boxShadow };
		}, sel);
	const contrastBetween = (textSel: string, bgSel: string) =>
		previewFrame!.evaluate(
			([t, b]: [string, string]) => {
				const text = document.querySelector(t);
				const bg = document.querySelector(b);
				if (!(text instanceof HTMLElement) || !(bg instanceof HTMLElement)) return -1;
				const ctx = document.createElement('canvas').getContext('2d');
				if (!ctx) return -1;
				const lum = (css: string) => {
					ctx.clearRect(0, 0, 2, 2);
					ctx.fillStyle = '#000';
					ctx.fillStyle = css;
					ctx.fillRect(0, 0, 2, 2);
					const d = ctx.getImageData(0, 0, 1, 1).data;
					const ch = (v: number) => {
						const x = v / 255;
						return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
					};
					return 0.2126 * ch(d[0]) + 0.7152 * ch(d[1]) + 0.0722 * ch(d[2]);
				};
				const tL = lum(getComputedStyle(text).color);
				const bL = lum(getComputedStyle(bg).backgroundColor);
				return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
			},
			[textSel, bgSel] as [string, string]
		);

	// representative card: face background unchanged on hover; shadow changed
	const cardRestBg = await bgOf('.card');
	const cardRestShadow = await shadowOf('.card');
	expect(cardRestShadow).not.toBeNull();
	await frame.locator('.card').first().hover();
	await page.waitForTimeout(260); // let the ease-out box-shadow transition settle
	const cardHoverBg = await bgOf('.card');
	const cardHoverShadow = await shadowOf('.card');
	expect(cardHoverBg!.color).toBe(cardRestBg!.color); // opaque pastel face unchanged
	expect(cardHoverShadow!.shadow).not.toBe(cardRestShadow!.shadow); // shadow changed (deeper extrusion)
	expect(await contrastBetween('.card-title', '.card')).toBeGreaterThanOrEqual(4.5); // AA on opaque face

	// reduced-motion: skeleton pulse animation is suppressed; the skeleton
	// remains visible but static (no infinite animation).
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const skeletonAnimating = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.skel');
		if (!(el instanceof HTMLElement)) return null;
		const cs = getComputedStyle(el);
		// Under reduced-motion the animation-name should be 'none' (no pulse).
		return cs.animationName === 'none';
	});
	expect(skeletonAnimating).toBe(true);
});
