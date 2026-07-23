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
	await expect(
		page.getByText(
			'A compact dark claymorphism Kanban board on a deep indigo canvas with medium-dark indigo cards and controls, light lavender text, open columns, 6–10px radii, and restrained layered inset/cast shadows with a soft violet glow.',
			{ exact: true }
		)
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

	// Hover material behavior: the medium-dark card face stays unchanged;
	// only the computed box-shadow changes (deeper extrusion), so text contrast
	// on the unchanged face is preserved at AA.
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
	expect(cardHoverBg!.color).toBe(cardRestBg!.color); // medium-dark face unchanged
	expect(cardHoverShadow!.shadow).not.toBe(cardRestShadow!.shadow); // shadow changed (deeper extrusion)
	expect(await contrastBetween('.card-title', '.card')).toBeGreaterThanOrEqual(4.5); // AA on card face

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

	// ------------------------------------------------------------------
	// Direct preview route: exact-width responsive assertions + table-driven
	// actual-parent contrast audit. The detail page embeds the preview in a
	// narrower iframe, so target-size and overflow checks must run on the
	// standalone /preview route at exact 375/768/1280 viewport widths.
	// ------------------------------------------------------------------
	await page.goto('/designs/kanban-claymorphism/preview');
	await expect(page.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();

	// Visual signature: the selected reference (Luminous Putty concept theme-6)
	// uses dark indigo surfaces throughout — dark canvas, dark bar, medium-dark
	// card/control faces with light lavender text, transparent/open column
	// bodies, compact radii, layered inset clay shadow with restrained glow.
	// No near-white pastel faces, no large raised column shells.
	await page.setViewportSize({ width: 1280, height: 800 });
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
		const colorLum = (sel: string) => {
			const c = cs(sel);
			return c ? lum(c.color) : -1;
		};
		const cardCs = cs('.card');
		return {
			canvasLum: bgLum('.board-root'),
			barLum: bgLum('.app-bar'),
			cardBgLum: bgLum('.card'),
			titleColorLum: colorLum('.card-title'),
			columnBg: cs('.column')?.backgroundColor ?? '',
			cardRadius: parseFloat(cardCs?.borderRadius ?? '0'),
			cardShadow: cardCs?.boxShadow ?? '',
			chipBgLum: bgLum('.chip:not([aria-pressed="true"])'),
			searchBgLum: bgLum('.search')
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.canvasLum, 'canvas dark').toBeLessThan(0.06);
	expect(sig!.barLum, 'bar dark').toBeLessThan(0.04);
	expect(sig!.cardBgLum, 'card face medium-dark (not near-white)').toBeGreaterThanOrEqual(0.02);
	expect(sig!.cardBgLum, 'card face not near-white').toBeLessThan(0.15);
	expect(sig!.titleColorLum, 'card text light lavender').toBeGreaterThan(0.5);
	expect(sig!.columnBg, 'column transparent/open').toMatch(/transparent|rgba\(0,\s*0,\s*0,\s*0\)/);
	expect(sig!.cardRadius, 'card radius compact (<=10px)').toBeLessThanOrEqual(10);
	expect(sig!.cardShadow, 'clay shadow with inset layers').toContain('inset');
	expect(sig!.chipBgLum, 'inactive chip dark').toBeLessThan(0.15);
	expect(sig!.searchBgLum, 'search face dark').toBeLessThan(0.15);

	// Table-driven WCAG AA contrast audit: every distinct semantic text role
	// against its actual opaque parent surface, including all repeated color
	// variants (avatars, labels, active/inactive controls, placeholder).
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
		const ratio = (textSel: string, bgSel: string, pseudo?: string) => {
			const textEl = document.querySelector(textSel);
			const bgEl = document.querySelector(bgSel);
			if (!(textEl instanceof HTMLElement) || !(bgEl instanceof HTMLElement)) return -1;
			const cs = pseudo ? getComputedStyle(textEl, pseudo) : getComputedStyle(textEl);
			const tL = lum(cs.color);
			const bL = lum(getComputedStyle(bgEl).backgroundColor);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
		const selfRatio = (sel: string) => ratio(sel, sel);
		const elRatio = (el: Element) => {
			if (!(el instanceof HTMLElement)) return -1;
			const tL = lum(getComputedStyle(el).color);
			const bL = lum(getComputedStyle(el).backgroundColor);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
		const results: { role: string; ratio: number }[] = [
			{ role: 'card-title', ratio: ratio('.card-title', '.card') },
			{ role: 'checklist', ratio: ratio('.checklist', '.card') },
			{ role: 'due-regular', ratio: ratio('.due:not(.is-done)', '.card') },
			{ role: 'due-done', ratio: ratio('.due.is-done', '.card') },
			{ role: 'pri-high', ratio: ratio('.pri-high', '.card') },
			{ role: 'pri-medium', ratio: ratio('.pri-medium', '.card') },
			{ role: 'board-title', ratio: ratio('.title-block h1', '.app-bar') },
			{ role: 'subtitle', ratio: ratio('.subtitle', '.app-bar') },
			{ role: 'column-heading', ratio: ratio('.column-head h2', '.column-head') },
			{ role: 'count-badge', ratio: selfRatio('.count') },
			{ role: 'empty-state', ratio: ratio('.empty-col p', '.empty-col') },
			{ role: 'error-body', ratio: ratio('.error-banner p', '.error-banner') },
			{ role: 'error-strong', ratio: ratio('.error-banner strong', '.error-banner') },
			{ role: 'primary-text', ratio: selfRatio('.primary') },
			{ role: 'add-card-text', ratio: selfRatio('.add-card') },
			{ role: 'retry-text', ratio: selfRatio('.error-retry') },
			{ role: 'project-chip', ratio: selfRatio('.project-chip') },
			{ role: 'chip-active', ratio: selfRatio('.chip[aria-pressed="true"]') },
			{
				role: 'chip-inactive',
				ratio: selfRatio('.chip:not([aria-pressed="true"])')
			},
			{
				role: 'view-active',
				ratio: selfRatio('.view-toggle button[aria-pressed="true"]')
			},
			{
				role: 'view-inactive',
				ratio: selfRatio('.view-toggle button:not([aria-pressed="true"])')
			},
			{ role: 'search-placeholder', ratio: ratio('.search input', '.search', '::placeholder') },
			{ role: 'search-input', ratio: ratio('.search input', '.search') }
		];
		// Every rendered label instance on the shared dark label face.
		document.querySelectorAll('.label').forEach((el) => {
			const name = el.textContent?.trim() || '?';
			results.push({ role: `label:${name}`, ratio: elRatio(el) });
		});
		// Every avatar variant (each member has a distinct hue fill)
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

	// Exact-width responsive: target sizes + no horizontal document overflow on
	// the direct preview route at exact 375/768/1280. The overflow check uses
	// documentElement.scrollWidth/clientWidth and scrollX to catch real document
	// overflow (e.g. from uncontained absolutely-positioned nodes).
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await page.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height, `${name} height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		const moreActions = await page
			.getByRole('button', { name: 'More actions for Backlog' })
			.boundingBox();
		expect(moreActions?.width).toBeGreaterThanOrEqual(44);
		expect(moreActions?.height).toBeGreaterThanOrEqual(44);
		const dismiss = await page
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height).toBeGreaterThanOrEqual(44);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth - document.documentElement.clientWidth ||
				window.scrollX
		);
		expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
	}
});

test('opens the kanban-editorial design and its isolated preview states', async ({ page }) => {
	// ---- Detail page: exact approved public summary + identity ----
	await page.goto('/designs/kanban-editorial');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Annual Report', exact: false })
	).toBeVisible();
	await expect(
		page.getByText(
			'A sober Editorial / Typographic Kanban board on near-white cool paper with dark navy ink, restrained teal accents, serif masthead and headings over system-sans data, teal column rules, and small-radius bordered cards in a formal two-colour print palette.',
			{ exact: true }
		)
	).toBeVisible();

	// ---- Isolated preview: locked content + empty/error/loading states ----
	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state (navy-fill selected)
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a ring on the compact visible
	// face with meaningful contrast (>=3:1) against the near-white paper.
	const previewFrame = page.frame({ url: /kanban-editorial\/preview$/ });
	expect(previewFrame).toBeTruthy();
	await frame.getByRole('searchbox').focus();
	const focusContrast = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.search .face');
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

	// The New task primary's compact face is navy-filled on the paper masthead;
	// its focus outline (seated outside the fill via outline-offset) renders
	// against the paper surface, so the ring must still read at >=3:1 there.
	// Reach it by Tabbing from the preceding control so :focus-visible applies.
	await frame.getByRole('button', { name: 'List', exact: true }).press('Tab');
	const primaryFocus = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.primary .face');
		const surround = el?.closest('.board-head');
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

	// reduced-motion: skeleton pulse animation is suppressed; the skeleton
	// remains visible but static (no infinite animation).
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const skeletonAnimating = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.skel');
		if (!(el instanceof HTMLElement)) return null;
		const cs = getComputedStyle(el);
		return cs.animationName === 'none';
	});
	expect(skeletonAnimating).toBe(true);
	await page.emulateMedia({ reducedMotion: null });

	// ------------------------------------------------------------------
	// Direct preview route: exact-width responsive + visual-signature +
	// table-driven contrast audit. The detail page embeds the preview in a
	// narrower iframe, so these checks run on the standalone /preview route
	// at exact 375/768/1280 viewport widths.
	// ------------------------------------------------------------------
	await page.goto('/designs/kanban-editorial/preview');
	await expect(page.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });

	// Visual signature: the selected Annual Report reference — near-white cool
	// paper canvas, brighter paper card surfaces, dark navy ink, restrained
	// teal accent. Serif masthead + headings; system-sans data. Teal 2px rules
	// under column headings. Bordered near-square cards. No shadows, no
	// gradients, no backdrop blur.
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
		const colorLum = (sel: string) => {
			const c = cs(sel);
			return c ? lum(c.color) : -1;
		};
		const tealness = (cssColor: string) => {
			// Teal/cyan reads as green channel >= red channel by a clear margin.
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = cssColor;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return d[1] - d[0]; // green minus red
		};
		const cardCs = cs('.card');
		const colHeadCs = cs('.column-head');
		const ruleCs = cs('.card');
		return {
			canvasLum: bgLum('.board-root'),
			cardBgLum: bgLum('.card'),
			cardBgImage: cardCs?.backgroundImage ?? '',
			cardBoxShadow: cardCs?.boxShadow ?? '',
			cardBorderStyle: cardCs?.borderStyle ?? '',
			cardBorderWidth: parseFloat(cardCs?.borderWidth ?? '0'),
			cardRadius: parseFloat(cardCs?.borderRadius ?? '0'),
			boardBgImage: cs('.board-root')?.backgroundImage ?? '',
			mastheadFont: cs('.masthead')?.fontFamily ?? '',
			titleFont: cs('.card-title')?.fontFamily ?? '',
			labelFont: cs('.label')?.fontFamily ?? '',
			dueFont: cs('.due')?.fontFamily ?? '',
			colHeadRuleWidth: parseFloat(colHeadCs?.borderBottomWidth ?? '0'),
			colHeadRuleTealness: colHeadCs ? tealness(colHeadCs.borderBottomColor) : -99,
			cardRuleTealness: ruleCs ? tealness(ruleCs.borderColor) : -99,
			backdropOnRoot: cs('.board-root')?.backdropFilter ?? '',
			backdropOnCard: cardCs?.backdropFilter ?? '',
			titleColorLum: colorLum('.card-title')
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.canvasLum, 'canvas near-white cool paper').toBeGreaterThan(0.9);
	expect(sig!.cardBgLum, 'card brighter paper surface').toBeGreaterThan(0.9);
	expect(sig!.cardBgLum, 'card brighter than or equal to canvas').toBeGreaterThanOrEqual(
		sig!.canvasLum
	);
	expect(sig!.cardBgImage, 'no gradient on cards').toBe('none');
	expect(sig!.boardBgImage, 'no gradient on canvas').toBe('none');
	expect(sig!.cardBoxShadow, 'no decorative elevation on cards').toBe('none');
	expect(sig!.cardBorderStyle, 'cards bordered').toBe('solid');
	expect(sig!.cardBorderWidth, 'card hairline border >= 1px').toBeGreaterThanOrEqual(1);
	expect(sig!.cardRadius, 'card near-square (<=4px radius)').toBeLessThanOrEqual(4);
	expect(sig!.mastheadFont.toLowerCase(), 'masthead serif').toMatch(/serif|georgia/);
	expect(sig!.titleFont.toLowerCase(), 'card title serif').toMatch(/serif|georgia/);
	expect(sig!.labelFont.toLowerCase(), 'label sans data').toMatch(/sans|system/);
	expect(sig!.dueFont.toLowerCase(), 'due sans data').toMatch(/sans|system/);
	// Sans confirmation: the label must not resolve to the serif stack. (A bare
	// /serif/ check would false-positive on "sans-serif".)
	expect(sig!.labelFont.toLowerCase(), 'label not the serif stack').not.toMatch(/georgia|times/);
	expect(sig!.colHeadRuleWidth, 'teal column rule 2px').toBeGreaterThanOrEqual(2);
	expect(sig!.colHeadRuleTealness, 'column rule is teal (green>red)').toBeGreaterThan(15);
	expect(sig!.cardRuleTealness, 'card border not teal (cool-gray hairline)').toBeLessThan(15);
	expect(sig!.backdropOnRoot, 'no backdrop blur on canvas').toBe('none');
	expect(sig!.backdropOnCard, 'no backdrop blur on cards').toBe('none');
	expect(sig!.titleColorLum, 'card title dark navy ink').toBeLessThan(0.3);

	// Table-driven WCAG AA contrast audit: every distinct semantic text role
	// against its actual opaque parent surface, including all repeated color
	// variants (avatars, labels, active/inactive controls, placeholder).
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
		// Resolve the effective background luminance by climbing to the nearest
		// opaque ancestor. Editorial controls are intentionally transparent
		// (flat paper design), so their "actual parent surface" is the paper
		// canvas — a real contrast audit climbs through transparency rather
		// than measuring text against rgba(0,0,0,0).
		const isOpaque = (cssColor: string) => {
			const m = cssColor.match(/rgba?\([^)]*\)/);
			if (!m) return true; // named/hex/oklch are opaque
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
			return lum('rgb(255,255,255)'); // document fallback
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
			{ role: 'card-title', ratio: ratio('.card-title', '.card') },
			{ role: 'checklist', ratio: ratio('.checklist', '.card') },
			{ role: 'due-regular', ratio: ratio('.due:not(.is-done)', '.card') },
			{ role: 'due-done', ratio: ratio('.due.is-done', '.card') },
			{ role: 'pri-high', ratio: ratio('.pri-high', '.card') },
			{ role: 'pri-medium', ratio: ratio('.pri-medium', '.card') },
			{ role: 'board-title', ratio: ratio('.title-block h1', '.board-head') },
			{ role: 'subtitle', ratio: ratio('.subtitle', '.board-head') },
			{ role: 'masthead', ratio: ratio('.masthead', '.board-head') },
			{ role: 'column-heading', ratio: ratio('.column-head h2', '.column-head') },
			{ role: 'count-badge', ratio: selfRatio('.count') },
			{ role: 'empty-state', ratio: ratio('.empty-col p', '.empty-col') },
			{ role: 'error-body', ratio: ratio('.error-banner p', '.error-banner') },
			{ role: 'error-strong', ratio: ratio('.error-banner strong', '.error-banner') },
			{ role: 'primary-text', ratio: selfRatio('.primary .face') },
			{ role: 'add-card-text', ratio: selfRatio('.add-card') },
			{ role: 'retry-text', ratio: selfRatio('.error-retry') },
			{ role: 'chip-active', ratio: selfRatio('.chip[aria-pressed="true"] .face') },
			{
				role: 'chip-inactive',
				ratio: selfRatio('.chip:not([aria-pressed="true"]) .face')
			},
			{
				role: 'view-active',
				ratio: selfRatio('.view-toggle button[aria-pressed="true"] .face')
			},
			{
				role: 'view-inactive',
				ratio: selfRatio('.view-toggle button:not([aria-pressed="true"]) .face')
			},
			{
				role: 'search-placeholder',
				ratio: ratio('.search input', '.search .face', '::placeholder')
			},
			{ role: 'search-input', ratio: ratio('.search input', '.search .face') }
		];
		document.querySelectorAll('.label').forEach((el) => {
			const name = el.textContent?.trim() || '?';
			results.push({ role: `label:${name}`, ratio: elRatio(el) });
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

	// Finding 3: no rendered element anywhere in the preview has a box-shadow.
	// The prior avatar overlap rings used box-shadow; they must move to crisp
	// borders. This generalises the card-only shadow check to every element.
	const shadowOffenders = await page.evaluate(() => {
		const offenders: { tag: string; shadow: string }[] = [];
		document.querySelectorAll('.board-root, .board-root *').forEach((el) => {
			const cs = getComputedStyle(el);
			if (cs.boxShadow !== 'none') {
				offenders.push({
					tag: (el as HTMLElement).className || el.tagName.toLowerCase(),
					shadow: cs.boxShadow
				});
			}
		});
		return offenders;
	});
	expect(shadowOffenders, 'no rendered element has a box-shadow').toEqual([]);

	// Finding 1: every segmented control gets a complete, unclipped, >=3:1
	// focus perimeter. Root-cause lock first — no .segmented ancestor may clip
	// (the original overflow:hidden cut off the offset focus outline).
	const overflowLock = await page.evaluate(() =>
		Array.from(document.querySelectorAll('.segmented')).map((el) => {
			const cs = getComputedStyle(el);
			return { ox: cs.overflowX, oy: cs.overflowY };
		})
	);
	expect(overflowLock.length, 'segmented groups present').toBeGreaterThan(0);
	for (const o of overflowLock) {
		expect(o.ox, 'segmented overflow-x visible (no clip)').toBe('visible');
		expect(o.oy, 'segmented overflow-y visible (no clip)').toBe('visible');
	}

	// Then Tab through every segmented control and confirm a complete >=3:1
	// focus perimeter renders on its compact face.
	await page.getByRole('searchbox').focus();
	const segmentedNames = ['All', 'Mine', 'Due this week', 'Board', 'List'];
	for (const expected of segmentedNames) {
		await page.keyboard.press('Tab');
		const info = await page.evaluate(() => {
			const el = document.activeElement;
			if (!(el instanceof HTMLElement)) return null;
			const face = el.querySelector('.face');
			const target = face instanceof HTMLElement ? face : el;
			const cs = getComputedStyle(target);
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
			// The outline seats outside the face; its surround is the control's
			// nearest opaque ancestor (paper). Climb from the control element.
			const isOpaque = (c: string) => {
				const m = c.match(/rgba?\([^)]*\)/);
				if (!m) return true;
				const p = m[0].replace(/[^\d.,]/g, '').split(',');
				return p.length < 4 || parseFloat(p[3]) > 0;
			};
			let node: Element | null = el;
			let bgLum = lum('rgb(255,255,255)');
			while (node) {
				const bg = getComputedStyle(node).backgroundColor;
				if (isOpaque(bg)) {
					bgLum = lum(bg);
					break;
				}
				node = node.parentElement;
			}
			const oL = lum(cs.outlineColor);
			const contrast = (Math.max(oL, bgLum) + 0.05) / (Math.min(oL, bgLum) + 0.05);
			return {
				text: el.textContent?.trim(),
				outlineStyle: cs.outlineStyle,
				outlineWidth: parseFloat(cs.outlineWidth),
				contrast,
				hasFace: !!face
			};
		});
		expect(info, `${expected} focused`).not.toBeNull();
		expect(info!.text, `${expected} is the focused control`).toBe(expected);
		expect(info!.hasFace, `${expected} has a compact face`).toBe(true);
		expect(info!.outlineStyle, `${expected} focus outline solid`).toBe('solid');
		expect(info!.outlineWidth, `${expected} focus outline >=3px`).toBeGreaterThanOrEqual(3);
		expect(info!.contrast, `${expected} focus perimeter >=3:1`).toBeGreaterThanOrEqual(3);
	}

	// Exact-width responsive: at each of 375/768/1280, every named faced
	// control's outer target is >=44px (width and height) while its intended
	// compact face stays ~21-26px; the full-44px-chrome controls (more-actions,
	// dismiss) keep their square targets; and there is no document overflow.
	const widths = [375, 768, 1280];
	for (const width of widths) {
		await page.setViewportSize({ width, height: 800 });

		// Named face-and-target measure for search, All, Mine, Due this week,
		// Board, List, and New task. Due this week is measured separately from
		// the other inactive chip (Mine).
		const faceRows = await page.evaluate(() => {
			const measure = (target: Element | null, face: Element | null) => {
				const empty = { targetH: -1, targetW: -1, faceH: -1, faceInsideTarget: false };
				if (!(target instanceof HTMLElement) || !(face instanceof HTMLElement)) return empty;
				const tr = target.getBoundingClientRect();
				const fr = face.getBoundingClientRect();
				return {
					targetH: Math.round(tr.height * 10) / 10,
					targetW: Math.round(tr.width * 10) / 10,
					faceH: Math.round(fr.height * 10) / 10,
					faceInsideTarget: fr.top >= tr.top - 0.5 && fr.bottom <= tr.bottom + 0.5
				};
			};
			const findByText = (selector: string, text: string): Element | null =>
				Array.from(document.querySelectorAll(selector)).find(
					(el) => (el.textContent?.trim() ?? '') === text
				) ?? null;
			const chip = (text: string) => findByText('.chip', text);
			const view = (text: string) => findByText('.view-toggle button', text);
			const faceOf = (el: Element | null): Element | null => el?.querySelector('.face') ?? null;
			const searchEl = document.querySelector('label.search');
			const primaryEl = document.querySelector('.primary');
			return [
				{ name: 'search', ...measure(searchEl, faceOf(searchEl)) },
				{ name: 'All', ...measure(chip('All'), faceOf(chip('All'))) },
				{ name: 'Mine', ...measure(chip('Mine'), faceOf(chip('Mine'))) },
				{
					name: 'Due this week',
					...measure(chip('Due this week'), faceOf(chip('Due this week')))
				},
				{ name: 'Board', ...measure(view('Board'), faceOf(view('Board'))) },
				{ name: 'List', ...measure(view('List'), faceOf(view('List'))) },
				{ name: 'New task', ...measure(primaryEl, faceOf(primaryEl)) }
			];
		});
		for (const row of faceRows) {
			expect(row.targetH, `${row.name} target height >=44 at ${width}`).toBeGreaterThanOrEqual(44);
			expect(row.targetW, `${row.name} target width >=44 at ${width}`).toBeGreaterThanOrEqual(44);
			expect(row.faceH, `${row.name} compact face ~21-26px at ${width}`).toBeGreaterThanOrEqual(21);
			expect(row.faceH, `${row.name} compact face <=26px at ${width}`).toBeLessThanOrEqual(26);
			expect(row.faceInsideTarget, `${row.name} face contained in target at ${width}`).toBe(true);
		}

		// Full-44px-chrome controls (not faced): more-actions + dismiss keep
		// square >=44x44 targets at every width.
		const moreActions = await page
			.getByRole('button', { name: 'More actions for Backlog' })
			.boundingBox();
		expect(moreActions?.width, `more-actions width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(moreActions?.height, `more-actions height at ${width}`).toBeGreaterThanOrEqual(44);
		const dismiss = await page
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width, `dismiss width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height, `dismiss height at ${width}`).toBeGreaterThanOrEqual(44);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth - document.documentElement.clientWidth ||
				window.scrollX
		);
		expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
	}
});

test('opens the kanban-swiss design and its isolated preview states', async ({ page }) => {
	// ---- Detail page: identity + approved summary ----
	await page.goto('/designs/kanban-swiss');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Diagonal Axis', exact: false })
	).toBeVisible();
	await expect(page.getByText('Swiss / Minimal Kanban board', { exact: false })).toBeVisible();

	// ---- Isolated preview: locked content + empty/error/loading states ----
	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state (ink-fill selected)
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a ring on the compact visible
	// face with meaningful contrast (>=3:1) against the warm paper surface.
	const previewFrame = page.frame({ url: /kanban-swiss\/preview$/ });
	expect(previewFrame).toBeTruthy();
	await frame.getByRole('searchbox').focus();
	const focusContrast = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.search .face');
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

	// reduced-motion: skeleton pulse animation is suppressed; the skeleton
	// remains visible but static (no infinite animation).
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const skeletonStatic = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.skel');
		if (!(el instanceof HTMLElement)) return null;
		return getComputedStyle(el).animationName === 'none';
	});
	expect(skeletonStatic).toBe(true);
	await page.emulateMedia({ reducedMotion: null });

	// ------------------------------------------------------------------
	// Direct preview route: visual-signature, a11y, and responsive checks.
	// The detail page embeds the preview in a narrower iframe, so these run
	// on the standalone /preview route at exact 375/768/1280 widths.
	// ------------------------------------------------------------------
	await page.goto('/designs/kanban-swiss/preview');
	await expect(page.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });

	// --- Locked content: all five team members render as accessible avatars
	//     in the header (complete fixed content, Swiss-styled). ---
	const memberNames = ['Maya Rivera', 'Devon Chen', 'Priya Nair', 'Sam Okafor', 'Lena Foss'];
	expect(await page.locator('.team-avatars [aria-label]').count()).toBe(5);
	for (const name of memberNames) {
		await expect(page.locator(`.team-avatars [aria-label="${name}"]`)).toBeVisible();
	}

	// --- Showcased states exposed programmatically (no interaction added): the
	//     active column announces its state, and the selected card's computed
	//     accessible NAME includes "selected" (aria-label must not be overridden
	//     by a competing aria-labelledby). ---
	await expect(page.locator('.column.is-active')).toHaveAttribute('aria-label', /active/i);
	await expect(page.getByRole('article', { name: /selected/i })).toBeVisible();

	// --- Approved THEME 7 signature: a single cobalt accent, with the 45deg
	//     diagonal limited to the active-column marker and the high-priority
	//     markers only (the artifact's only two rendered diagonal uses). The
	//     earlier red header-slash / brand / selection / empty diamonds were an
	//     invented expansion and must be gone. No serif (not Editorial), no
	//     monospace (not Brutalism), no app-bar/elevation (not Flat Material),
	//     no gradient/shadow/blur. ---
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
		// cobalt-dominant: blue channel clearly greater than red and green
		const isCobalt = (cssColor: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = cssColor;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return d[2] > d[0] + 40 && d[2] > d[1] + 30;
		};
		const isRotated = (t: string) => t.startsWith('matrix') && t !== 'matrix(1, 0, 0, 1, 0, 0)';
		const axis = cs('.col-axis');
		const pri = cs('.pri-diamond');
		const card = cs('.card');
		const fonts = new Set<string>();
		document.querySelectorAll('.board-root, .board-root *').forEach((el) => {
			const f = getComputedStyle(el).fontFamily.toLowerCase();
			if (f) fonts.add(f);
		});
		const anySerif = Array.from(fonts).some(
			(f) => /georgia|times|serif/.test(f) && !/sans/.test(f)
		);
		return {
			axisRotated: isRotated(axis?.transform ?? ''),
			axisCobalt: axis ? isCobalt(axis.backgroundColor) : false,
			priRotated: isRotated(pri?.transform ?? ''),
			priCobalt: pri ? isCobalt(pri.backgroundColor) : false,
			// every .diamond must be one of the two approved uses:
			diamondsOnlyApproved:
				document.querySelectorAll('.diamond').length ===
				document.querySelectorAll('.col-axis, .pri-diamond').length,
			inventedSlash: document.querySelectorAll('.axis-slash').length,
			inventedBrand: document.querySelectorAll('.brand-diamond').length,
			inventedSel: document.querySelectorAll('.sel-diamond').length,
			inventedEmpty: document.querySelectorAll('.empty-diamond').length,
			canvasLum: lum(cs('.board-root')?.backgroundColor ?? '#fff'),
			cardBgLum: lum(card?.backgroundColor ?? '#fff'),
			cardBgImage: card?.backgroundImage ?? '',
			cardBoxShadow: card?.boxShadow ?? '',
			boardBackdrop: cs('.board-root')?.backdropFilter ?? '',
			anySerif
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.axisRotated, 'active-column marker is a 45deg diamond').toBe(true);
	expect(sig!.axisCobalt, 'active-column marker is the cobalt accent').toBe(true);
	expect(sig!.priRotated, 'high-priority marker is a 45deg diamond').toBe(true);
	expect(sig!.priCobalt, 'high-priority marker is the cobalt accent').toBe(true);
	expect(sig!.diamondsOnlyApproved, 'diagonals limited to active-column + high-priority only').toBe(
		true
	);
	expect(sig!.inventedSlash, 'no invented header slash').toBe(0);
	expect(sig!.inventedBrand, 'no invented brand diamond').toBe(0);
	expect(sig!.inventedSel, 'no invented selection diamond').toBe(0);
	expect(sig!.inventedEmpty, 'no invented empty-state diamond').toBe(0);
	expect(sig!.canvasLum, 'canvas warm near-white').toBeGreaterThan(0.9);
	expect(sig!.cardBgLum, 'card bright paper').toBeGreaterThan(0.9);
	expect(sig!.cardBgImage, 'no gradient on cards').toBe('none');
	expect(sig!.cardBoxShadow, 'no decorative elevation on cards').toBe('none');
	expect(sig!.boardBackdrop, 'no backdrop blur').toBe('none');
	expect(sig!.anySerif, 'no serif anywhere (all sans — not Editorial)').toBe(false);

	// Cobalt text roles meet AA (>=4.5:1) on their actual parent surface — the
	// key AA risk for a vivid single accent used for priority, done, and the
	// cobalt-filled primary button.
	const cobaltAA = await page.evaluate(() => {
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
		const isOpaque = (c: string) => {
			const m = c.match(/rgba?\([^)]*\)/);
			if (!m) return true;
			const p = m[0].replace(/[^\d.,]/g, '').split(',');
			return p.length < 4 || parseFloat(p[3]) > 0;
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
		const ratio = (textSel: string, bgSel: string) => {
			const t = document.querySelector(textSel);
			const b = document.querySelector(bgSel);
			if (!(t instanceof HTMLElement) || !(b instanceof HTMLElement)) return -1;
			const tL = lum(getComputedStyle(t).color);
			const bL = bgLumOf(b);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
		const selfRatio = (sel: string) => {
			const el = document.querySelector(sel);
			if (!(el instanceof HTMLElement)) return -1;
			const tL = lum(getComputedStyle(el).color);
			const bL = bgLumOf(el);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
		return {
			priHigh: ratio('.pri-high', '.card'),
			dueDone: ratio('.due.is-done', '.card'),
			cardTitle: ratio('.card-title', '.card'),
			primaryText: selfRatio('.primary .face')
		};
	});
	expect(cobaltAA).not.toBeNull();
	expect(cobaltAA!.priHigh, 'high-priority cobalt text AA on card').toBeGreaterThanOrEqual(4.5);
	expect(cobaltAA!.dueDone, 'done cobalt text AA on card').toBeGreaterThanOrEqual(4.5);
	expect(cobaltAA!.cardTitle, 'card title AA on card').toBeGreaterThanOrEqual(4.5);
	expect(cobaltAA!.primaryText, 'primary text AA on cobalt fill').toBeGreaterThanOrEqual(4.5);

	// The accent is the exact approved cobalt #1857c6 = rgb(24, 87, 198),
	// rendered (within sRGB rounding) from the OKLCH token. Lock the computed
	// pixels so a drifted approximation (e.g. #2154d8) cannot ship.
	const accent = await page.evaluate(() => {
		const el = document.querySelector('.col-axis');
		if (!(el instanceof HTMLElement)) return null;
		const css = getComputedStyle(el).backgroundColor;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return null;
		ctx.fillStyle = '#000';
		ctx.fillStyle = css;
		ctx.fillRect(0, 0, 2, 2);
		const d = ctx.getImageData(0, 0, 1, 1).data;
		return { r: d[0], g: d[1], b: d[2], css };
	});
	expect(accent).not.toBeNull();
	expect(Math.abs(accent!.r - 24), 'accent red channel = 24').toBeLessThanOrEqual(3);
	expect(Math.abs(accent!.g - 87), 'accent green channel = 87').toBeLessThanOrEqual(3);
	expect(Math.abs(accent!.b - 198), 'accent blue channel = 198').toBeLessThanOrEqual(3);

	// --- Focus perimeters are never clipped inside the desktop horizontal board
	//     scroller. overflow-x:auto computes overflow-y:auto, so without internal
	//     breathing room the column controls' offset focus rings get cut at the
	//     scroll edges. Drive real keyboard focus (:focus-visible), then measure
	//     the rendered outline box against the scroller's clip rect at both
	//     extremes, at 1280 (fits, no scroll) and 768 (scrolls horizontally). ---
	const measureFocus = () =>
		page.evaluate(() => {
			const el = document.activeElement;
			const sc = el?.closest('.board-body');
			if (!(el instanceof HTMLElement) || !(sc instanceof HTMLElement)) return null;
			const cs = getComputedStyle(el);
			if (cs.outlineStyle !== 'solid') {
				return { label: el.getAttribute('aria-label'), clipped: true, reason: 'no-solid-outline' };
			}
			const ow = parseFloat(cs.outlineWidth);
			const oo = parseFloat(cs.outlineOffset);
			const er = el.getBoundingClientRect();
			const sr = sc.getBoundingClientRect();
			const top = er.top - oo - ow;
			const right = er.right + oo + ow;
			const bottom = er.bottom + oo + ow;
			const left = er.left - oo - ow;
			return {
				label: el.getAttribute('aria-label'),
				clipped: !(
					top >= sr.top - 0.5 &&
					right <= sr.right + 0.5 &&
					bottom <= sr.bottom + 0.5 &&
					left >= sr.left - 0.5
				)
			};
		});
	const tabTo = async (targetLabel: string) => {
		await page.getByRole('searchbox').focus();
		for (let i = 0; i < 50; i++) {
			await page.keyboard.press('Tab');
			const lbl = await page.evaluate(
				() => document.activeElement?.getAttribute('aria-label') ?? ''
			);
			if (lbl === targetLabel) return true;
		}
		return false;
	};

	// 1280: first column's more-actions (top/left edge) and last column's
	// more-actions (right edge).
	await page.setViewportSize({ width: 1280, height: 800 });
	expect(await tabTo('More actions for Backlog'), 'reached Backlog more-actions').toBe(true);
	let m = await measureFocus();
	expect(m, 'measured Backlog more-actions focus').not.toBeNull();
	expect(m!.clipped, 'Backlog more-actions focus perimeter not clipped').toBe(false);
	expect(await tabTo('More actions for Done'), 'reached Done more-actions').toBe(true);
	m = await measureFocus();
	expect(m, 'measured Done more-actions focus').not.toBeNull();
	expect(m!.clipped, 'Done more-actions focus perimeter not clipped').toBe(false);

	// 768: the board scrolls horizontally. Scroll to the right extreme and check
	// the last column's more-actions; then back to the left extreme for the first.
	await page.setViewportSize({ width: 768, height: 800 });
	await page.evaluate(() => {
		const sc = document.querySelector('.board-body');
		if (sc instanceof HTMLElement) sc.scrollLeft = sc.scrollWidth;
	});
	expect(await tabTo('More actions for Done'), 'reached Done more-actions at 768').toBe(true);
	m = await measureFocus();
	expect(m, 'measured Done more-actions focus at 768').not.toBeNull();
	expect(m!.clipped, 'Done more-actions focus not clipped at right extreme').toBe(false);
	await page.evaluate(() => {
		const sc = document.querySelector('.board-body');
		if (sc instanceof HTMLElement) sc.scrollLeft = 0;
	});
	expect(await tabTo('More actions for Backlog'), 'reached Backlog more-actions at 768').toBe(true);
	m = await measureFocus();
	expect(m, 'measured Backlog more-actions focus at 768').not.toBeNull();
	expect(m!.clipped, 'Backlog more-actions focus not clipped at left extreme').toBe(false);

	// Exact-width responsive: every named control is >=44px and there is no
	// horizontal document overflow at each of 375/768/1280.
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await page.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height, `${name} height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		const moreActions = await page
			.getByRole('button', { name: 'More actions for Backlog' })
			.boundingBox();
		expect(moreActions?.width, `more-actions width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(moreActions?.height, `more-actions height at ${width}`).toBeGreaterThanOrEqual(44);
		const dismiss = await page
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width, `dismiss width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height, `dismiss height at ${width}`).toBeGreaterThanOrEqual(44);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth - document.documentElement.clientWidth ||
				window.scrollX
		);
		expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
	}
});

test('opens the kanban-brutalism design and its isolated preview states', async ({ page }) => {
	// ---- Detail page: exact approved public summary + identity ----
	await page.goto('/designs/kanban-brutalism');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Blueprint', exact: false })
	).toBeVisible();
	await expect(
		page.getByText(
			'A compact brutalist Blueprint / technical-schematic Kanban board on off-white drafting paper with near-black ink, one deep technical-blue accent, raw monospace throughout, a foregrounded graph-paper grid, harsh exposed 2–3px structural rules, and coordinate/dimension notation with drafting crosshairs.',
			{ exact: true }
		)
	).toBeVisible();

	// ---- Isolated preview: locked content + empty/error/loading states ----
	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
	await expect(frame.getByText('Sync paused', { exact: false })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(frame.locator('.skeleton-card')).toBeVisible();

	// interaction smoke: toggling a filter updates its pressed state (ink-fill selected)
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a container ring with meaningful
	// contrast (>=3:1, the WCAG UI-component minimum) against the drafting paper.
	const previewFrame = page.frame({ url: /kanban-brutalism\/preview$/ });
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

	// reduced-motion: skeleton blink animation is suppressed; the skeleton
	// remains visible but static (no infinite animation).
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const skeletonStatic = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.skel');
		if (!(el instanceof HTMLElement)) return null;
		return getComputedStyle(el).animationName === 'none';
	});
	expect(skeletonStatic).toBe(true);
	await page.emulateMedia({ reducedMotion: null });

	// ------------------------------------------------------------------
	// Direct preview route: visual-signature, a11y, and responsive checks.
	// The detail page embeds the preview in a narrower iframe, so these run
	// on the standalone /preview route at exact 375/768/1280 widths.
	// ------------------------------------------------------------------
	await page.goto('/designs/kanban-brutalism/preview');
	await expect(page.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });

	// --- Locked content: all five team members render as accessible avatars
	//     in the header (complete fixed content, brutalist-styled). ---
	const memberNames = ['Maya Rivera', 'Devon Chen', 'Priya Nair', 'Sam Okafor', 'Lena Foss'];
	expect(await page.locator('.team-avatars [aria-label]').count()).toBe(5);
	for (const name of memberNames) {
		await expect(page.locator(`.team-avatars [aria-label="${name}"]`)).toBeVisible();
	}

	// --- Showcased states exposed programmatically (no interaction added):
	//     the active column announces its state, and the selected card's
	//     computed accessible NAME includes "selected". ---
	await expect(page.locator('.column.is-active')).toHaveAttribute('aria-label', /active/i);
	await expect(page.getByRole('article', { name: /selected/i })).toBeVisible();

	// --- BLUEPRINT signature: light compact brutalist technical schematic.
	//     Foregrounded graph-paper grid (an SVG url background, not a
	//     gradient), raw monospace throughout, near-black ink on off-white
	//     drafting paper (never pure #000/#fff), harsh exposed 2–3px solid
	//     structural rules, near-square cards, coordinate/dimension
	//     notation (✛ crosshair ticks, N= counts) in the one deep
	//     technical-blue accent. No gradients, no shadows, no backdrop
	//     blur anywhere. Unmistakably rougher/more technical than the
	//     published Swiss (sans, hidden grid) and Editorial (serif)
	//     directions. ---
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
		const channels = (cssColor: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = cssColor;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return { r: d[0], g: d[1], b: d[2] };
		};
		// Walk every element, collecting any gradient background, any
		// box-shadow, or any backdrop blur (brutalism forbids all three).
		let gradientFound = false;
		let shadowFound = false;
		let backdropFound = false;
		const fonts = new Set<string>();
		document.querySelectorAll('.board-root, .board-root *').forEach((el) => {
			const c = getComputedStyle(el);
			if (/gradient/i.test(c.backgroundImage)) gradientFound = true;
			if (c.boxShadow !== 'none') shadowFound = true;
			if (c.backdropFilter !== 'none') backdropFound = true;
			fonts.add(c.fontFamily.toLowerCase());
		});
		const rootCs = cs('.board-root');
		const cardCs = cs('.card');
		const tickCs = cs('.tick');
		const tickCh = tickCs ? channels(tickCs.color) : { r: -1, g: -1, b: -1 };
		return {
			rootBgImage: rootCs?.backgroundImage ?? '',
			rootBgColorLum: lum(rootCs?.backgroundColor ?? '#fff'),
			rootBorderWidth: parseFloat(rootCs?.borderWidth ?? '0'),
			rootBorderStyle: rootCs?.borderStyle ?? '',
			cardBgImage: cardCs?.backgroundImage ?? '',
			cardBorderStyle: cardCs?.borderStyle ?? '',
			cardBorderWidth: parseFloat(cardCs?.borderWidth ?? '0'),
			cardRadius: parseFloat(cardCs?.borderRadius ?? '0'),
			cardBgLum: lum(cardCs?.backgroundColor ?? '#fff'),
			inkLum: lum(cs('.card-title')?.color ?? '#000'),
			anySerif: Array.from(fonts).some((f) => /georgia|times|serif/.test(f) && !/sans/.test(f)),
			anySans: Array.from(fonts).some((f) => /sans/.test(f)),
			allMono: Array.from(fonts).every((f) => /mono/.test(f)),
			gradientFound,
			shadowFound,
			backdropFound,
			tickBlueOverRed: tickCh.b - tickCh.r,
			tickBlueOverGreen: tickCh.b - tickCh.g,
			notationCrosshair: document.body.textContent?.includes('✛') ?? false,
			notationCount: document.body.textContent?.includes('N=') ?? false
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.rootBgImage, 'foregrounded graph-paper grid present').toMatch(/^url\(/);
	expect(sig!.rootBgImage, 'root background is a url, not a gradient').not.toMatch(/gradient/i);
	expect(sig!.cardBgImage, 'no background image on cards').toBe('none');
	expect(sig!.rootBgColorLum, 'canvas off-white drafting paper (not pure white)').toBeLessThan(
		0.95
	);
	expect(sig!.rootBgColorLum, 'canvas light').toBeGreaterThan(0.78);
	expect(sig!.cardBgLum, 'card brighter surface').toBeGreaterThanOrEqual(sig!.rootBgColorLum);
	expect(sig!.inkLum, 'near-black ink (not pure black)').toBeGreaterThan(0.005);
	expect(sig!.inkLum, 'ink dark').toBeLessThan(0.22);
	expect(sig!.rootBorderWidth, 'board frame harsh rule >=2px').toBeGreaterThanOrEqual(2);
	expect(sig!.rootBorderStyle, 'board frame solid').toBe('solid');
	expect(sig!.cardBorderStyle, 'card harsh border solid').toBe('solid');
	expect(sig!.cardBorderWidth, 'card harsh border >=1.5px').toBeGreaterThanOrEqual(1.5);
	expect(sig!.cardRadius, 'card near-square (<=3px radius)').toBeLessThanOrEqual(3);
	expect(sig!.anySerif, 'no serif anywhere (not Editorial)').toBe(false);
	expect(sig!.anySans, 'no sans anywhere (not Swiss/flat)').toBe(false);
	expect(sig!.allMono, 'raw monospace throughout').toBe(true);
	expect(sig!.gradientFound, 'no gradient anywhere').toBe(false);
	expect(sig!.shadowFound, 'no box-shadow anywhere').toBe(false);
	expect(sig!.backdropFound, 'no backdrop blur anywhere').toBe(false);
	expect(sig!.tickBlueOverRed, 'accent blue channel > red').toBeGreaterThan(40);
	expect(sig!.tickBlueOverGreen, 'accent blue channel > green').toBeGreaterThan(20);
	expect(sig!.notationCrosshair, 'drafting crosshair (✛) notation present').toBe(true);
	expect(sig!.notationCount, 'dimension count (N=) notation present').toBe(true);

	// The --grid token (used by skeleton blocks) and the inline SVG grid stroke
	// share one drafting-grid identity, so they must render the EXACT same
	// colour. The SVG cannot reference the CSS variable, so its stroke is a
	// serialized sRGB hex that must equal the token's rendered pixels.
	const gridMatch = await page.evaluate(() => {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return null;
		const rgbOf = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return [d[0], d[1], d[2]];
		};
		const skelRgb = rgbOf(getComputedStyle(document.querySelector('.skel')!).backgroundColor);
		const bgImage = getComputedStyle(document.querySelector('.board-root')!).backgroundImage;
		const m = bgImage.match(/stroke=['"](?:%23|#)([0-9a-fA-F]{6})['"]/);
		const svgHex = m ? `#${m[1].toLowerCase()}` : null;
		const svgRgb = svgHex ? rgbOf(svgHex) : null;
		return { skelRgb, svgHex, svgRgb };
	});
	expect(gridMatch).not.toBeNull();
	expect(gridMatch!.svgHex, 'SVG grid stroke hex present in the data-URI').not.toBeNull();
	expect(gridMatch!.skelRgb, 'skeleton --grid RGB == serialized SVG grid stroke RGB').toEqual(
		gridMatch!.svgRgb
	);

	// --- Table-driven WCAG AA contrast audit: every distinct semantic text
	//     role against its actual opaque parent surface (climbing through
	//     transparency), including all repeated variants (tags, avatars,
	//     active/inactive controls, placeholder). Brutalism is monochrome +
	//     one accent, so the audit covers the accent text roles too. ---
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
			const p = m[0].replace(/[^\d.,]/g, '').split(',');
			return p.length < 4 || parseFloat(p[3]) > 0;
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
			{ role: 'card-title', ratio: ratio('.card-title', '.card') },
			{ role: 'card-id', ratio: ratio('.cid', '.card') },
			{ role: 'tick', ratio: ratio('.tick', '.card') },
			{ role: 'checklist', ratio: ratio('.checklist', '.card') },
			{ role: 'due-regular', ratio: ratio('.due:not(.is-done)', '.card') },
			{ role: 'due-done', ratio: ratio('.due.is-done', '.card') },
			{ role: 'pri-high', ratio: ratio('.pri-high', '.card') },
			{ role: 'pri-medium', ratio: ratio('.pri-medium', '.card') },
			{ role: 'board-title', ratio: ratio('.title-block h1', '.board-head') },
			{ role: 'subtitle', ratio: ratio('.subtitle', '.board-head') },
			{ role: 'project-chip', ratio: selfRatio('.project-chip') },
			{ role: 'column-heading', ratio: ratio('.col-name', '.col-head') },
			{ role: 'count', ratio: ratio('.count', '.col-head') },
			{ role: 'empty-state', ratio: ratio('.empty-col p', '.empty-col') },
			{ role: 'error-body', ratio: ratio('.error-banner p', '.error-banner') },
			{ role: 'error-strong', ratio: ratio('.error-banner strong', '.error-banner') },
			{ role: 'primary-text', ratio: selfRatio('.primary') },
			{ role: 'add-card-text', ratio: selfRatio('.add-card') },
			{ role: 'retry-text', ratio: selfRatio('.error-retry') },
			{ role: 'chip-active', ratio: selfRatio('.chip[aria-pressed="true"]') },
			{ role: 'chip-inactive', ratio: selfRatio('.chip:not([aria-pressed="true"])') },
			{
				role: 'view-active',
				ratio: selfRatio('.view-toggle button[aria-pressed="true"]')
			},
			{
				role: 'view-inactive',
				ratio: selfRatio('.view-toggle button:not([aria-pressed="true"])')
			},
			{ role: 'search-placeholder', ratio: ratio('.search input', '.search', '::placeholder') },
			{ role: 'search-label', ratio: ratio('.search-label', '.search') },
			{ role: 'search-input', ratio: ratio('.search input', '.search') }
		];
		document.querySelectorAll('.tag').forEach((el) => {
			const name = el.textContent?.trim() || '?';
			results.push({ role: `tag:${name}`, ratio: elRatio(el) });
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

	// --- Desktop columns grow to fill the board (the approved BLUEPRINT grows
	//     its columns rather than leaving a large empty grid gutter). At 1280
	//     the four columns share the available width, so each is clearly wider
	//     than the 15rem flex-basis. ---
	await page.setViewportSize({ width: 1280, height: 800 });
	const colWidths = await page.evaluate(() =>
		Array.from(document.querySelectorAll('.column')).map((el) =>
			Math.round((el as HTMLElement).getBoundingClientRect().width)
		)
	);
	expect(colWidths.length, 'four columns').toBe(4);
	for (const w of colWidths) {
		expect(w, 'desktop column grew past the 15rem basis (no empty gutter)').toBeGreaterThan(272);
	}

	// --- Stronger hover feedback for non-selected cards (live review): a
	//     pale technical-blue surface wash + a complete accent border
	//     perimeter + a small crisp lift when motion is allowed. Under
	//     reduced motion the wash + perimeter remain immediate and the
	//     lift/transition are suppressed. Cards stay non-interactive (no
	//     pointer/grab cursor). The selected card keeps its stronger
	//     selected treatment and is not downgraded by hover. No shadow,
	//     gradient, blur, second hue, or side-stripe. ---
	const hoverState = () =>
		page.evaluate(() => {
			const ctx = document.createElement('canvas').getContext('2d');
			if (!ctx) return null;
			const rgbOf = (css: string) => {
				ctx.clearRect(0, 0, 2, 2);
				ctx.fillStyle = '#000';
				ctx.fillStyle = css;
				ctx.fillRect(0, 0, 2, 2);
				const d = ctx.getImageData(0, 0, 1, 1).data;
				return [d[0], d[1], d[2]];
			};
			const lum = (css: string) => {
				const d = rgbOf(css);
				const ch = (v: number) => {
					const s = v / 255;
					return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
				};
				return 0.2126 * ch(d[0]) + 0.7152 * ch(d[1]) + 0.0722 * ch(d[2]);
			};
			const card = document.querySelector('.card:not(.is-selected)');
			const title = document.querySelector('.card:not(.is-selected) .card-title');
			if (!(card instanceof HTMLElement) || !(title instanceof HTMLElement)) return null;
			const cs = getComputedStyle(card);
			const bg = cs.backgroundColor;
			const bgRgb = rgbOf(bg);
			const borderRgb = rgbOf(cs.borderTopColor);
			const titleL = lum(getComputedStyle(title).color);
			const bgL = lum(bg);
			const transform = cs.transform;
			let lifted = false;
			if (transform !== 'none') {
				const m = transform.match(/matrix\(([^)]*)\)/);
				if (m) {
					const p = m[1].split(',');
					lifted = p.length >= 6 && parseFloat(p[5]) < 0;
				}
			}
			return {
				bgBlueGap: bgRgb[2] - bgRgb[0],
				borderBlueGap: borderRgb[2] - borderRgb[0],
				transform,
				lifted,
				cursor: cs.cursor,
				titleContrast: (Math.max(titleL, bgL) + 0.05) / (Math.min(titleL, bgL) + 0.05)
			};
		});

	// Resting baseline (no hover) for a non-selected card: neutral surface.
	const restNonSelBgGap = await page.evaluate(() => {
		const el = document.querySelector('.card:not(.is-selected)');
		if (!(el instanceof HTMLElement)) return -99;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -99;
		ctx.clearRect(0, 0, 2, 2);
		ctx.fillStyle = '#000';
		ctx.fillStyle = getComputedStyle(el).backgroundColor;
		ctx.fillRect(0, 0, 2, 2);
		const d = ctx.getImageData(0, 0, 1, 1).data;
		return d[2] - d[0];
	});
	expect(restNonSelBgGap, 'resting card surface is faintly cool, not blue-washed').toBeLessThan(8);

	// Motion-enabled (default): wash + perimeter + lift, no pointer cursor,
	// and the title stays AA on the washed surface. Poll the computed state
	// until the 0.12s transition settles — no arbitrary sleep (and reduced
	// motion resolves on the first poll since there is no transition).
	await page.emulateMedia({ reducedMotion: null });
	await page.locator('.card:not(.is-selected)').first().hover();
	await expect
		.poll(async () => {
			const s = await hoverState();
			return !!s && s.bgBlueGap > restNonSelBgGap + 4 && s.lifted;
		}, 'hover settles: blue wash present and card lifted')
		.toBe(true);
	const hov = await hoverState();
	expect(hov).not.toBeNull();
	expect(hov!.bgBlueGap, 'hover adds a pale technical-blue wash').toBeGreaterThan(
		restNonSelBgGap + 4
	);
	expect(hov!.borderBlueGap, 'hover perimeter is the blue accent').toBeGreaterThan(40);
	expect(hov!.lifted, 'hover lifts the card when motion is allowed').toBe(true);
	expect(hov!.cursor, 'card stays non-interactive (no pointer/grab cursor)').toBe('auto');
	expect(hov!.titleContrast, 'card title stays AA after hover').toBeGreaterThanOrEqual(4.5);

	// Reduced motion: wash + perimeter remain immediate; lift/transform gone.
	// No delay is needed (no transition runs under reduced motion).
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.locator('.card:not(.is-selected)').first().hover();
	await expect
		.poll(async () => {
			const s = await hoverState();
			return !!s && s.bgBlueGap > restNonSelBgGap + 4 && s.transform === 'none';
		}, 'reduced-motion hover settles: wash present, no transform')
		.toBe(true);
	const hovReduce = await hoverState();
	expect(hovReduce).not.toBeNull();
	expect(hovReduce!.bgBlueGap, 'reduced-motion keeps the blue wash').toBeGreaterThan(
		restNonSelBgGap + 4
	);
	expect(hovReduce!.borderBlueGap, 'reduced-motion keeps the blue perimeter').toBeGreaterThan(40);
	expect(hovReduce!.transform, 'reduced-motion suppresses the lift (no transform)').toBe('none');
	await page.emulateMedia({ reducedMotion: null });

	// Selected-state precedence: hovering the selected card does not change
	// its surface or lift it (its stronger selected treatment wins).
	const selRest = await page.evaluate(() => {
		const el = document.querySelector('.card.is-selected');
		if (!(el instanceof HTMLElement)) return null;
		const cs = getComputedStyle(el);
		return { bg: cs.backgroundColor, transform: cs.transform };
	});
	await page.locator('.card.is-selected').hover();
	const selHov = await page.evaluate(() => {
		const el = document.querySelector('.card.is-selected');
		if (!(el instanceof HTMLElement)) return null;
		const cs = getComputedStyle(el);
		return { bg: cs.backgroundColor, transform: cs.transform };
	});
	expect(selHov, 'selected card measured on hover').not.toBeNull();
	expect(selRest, 'selected card measured at rest').not.toBeNull();
	expect(selHov!.bg, 'selected card surface unchanged by hover').toBe(selRest!.bg);
	expect(selHov!.transform, 'selected card not lifted by hover').toBe('none');

	// --- Visible search label (root DESIGN.md: inputs retain visible labels).
	//     The accessible name is still "Search cards" via aria-label. ---
	await expect(page.locator('.search-label')).toBeVisible();
	await expect(page.getByRole('searchbox')).toHaveAccessibleName('Search cards');

	// Exact-width responsive: every named control, EVERY column more-actions,
	// and the dismiss control are non-shrinking >=44x44 targets, and there is
	// no horizontal document overflow at each of 375/768/1280.
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	const columnNames = ['Backlog', 'In Progress', 'In Review', 'Done'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await page.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height, `${name} height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		for (const col of columnNames) {
			const ma = await page
				.getByRole('button', { name: `More actions for ${col}`, exact: true })
				.boundingBox();
			expect(ma?.width, `${col} more-actions width at ${width}`).toBeGreaterThanOrEqual(44);
			expect(ma?.height, `${col} more-actions height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		const dismiss = await page
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width, `dismiss width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height, `dismiss height at ${width}`).toBeGreaterThanOrEqual(44);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth - document.documentElement.clientWidth ||
				window.scrollX
		);
		expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
	}

	// --- Focus perimeters are never clipped inside the horizontal board
	//     scroller. At 768 the board scrolls horizontally; keyboard-focus the
	//     first and last column more-actions at both scroll extremes and
	//     measure the rendered outline box against the scroller's clip rect. ---
	const measureFocus = () =>
		page.evaluate(() => {
			const el = document.activeElement;
			const sc = el?.closest('.board-body');
			if (!(el instanceof HTMLElement) || !(sc instanceof HTMLElement)) return null;
			const cs = getComputedStyle(el);
			if (cs.outlineStyle !== 'solid') {
				return { label: el.getAttribute('aria-label'), clipped: true, reason: 'no-solid-outline' };
			}
			const ow = parseFloat(cs.outlineWidth);
			const oo = parseFloat(cs.outlineOffset);
			const er = el.getBoundingClientRect();
			const sr = sc.getBoundingClientRect();
			const top = er.top - oo - ow;
			const right = er.right + oo + ow;
			const bottom = er.bottom + oo + ow;
			const left = er.left - oo - ow;
			return {
				label: el.getAttribute('aria-label'),
				clipped: !(
					top >= sr.top - 0.5 &&
					right <= sr.right + 0.5 &&
					bottom <= sr.bottom + 0.5 &&
					left >= sr.left - 0.5
				)
			};
		});
	const tabTo = async (targetLabel: string) => {
		await page.getByRole('searchbox').focus();
		for (let i = 0; i < 60; i++) {
			await page.keyboard.press('Tab');
			const lbl = await page.evaluate(
				() => document.activeElement?.getAttribute('aria-label') ?? ''
			);
			if (lbl === targetLabel) return true;
		}
		return false;
	};

	await page.setViewportSize({ width: 768, height: 800 });
	// Left extreme: first column's more-actions.
	expect(await tabTo('More actions for Backlog'), 'reached Backlog more-actions at 768').toBe(true);
	let mf = await measureFocus();
	expect(mf, 'measured Backlog more-actions focus at 768').not.toBeNull();
	expect(mf!.clipped, 'Backlog more-actions focus not clipped at left extreme').toBe(false);
	// Right extreme: scroll to the end, then keyboard-focus the last column's
	// more-actions (Tabbing scrolls it into view).
	await page.evaluate(() => {
		const sc = document.querySelector('.board-body');
		if (sc instanceof HTMLElement) sc.scrollLeft = sc.scrollWidth;
	});
	expect(await tabTo('More actions for Done'), 'reached Done more-actions at 768').toBe(true);
	mf = await measureFocus();
	expect(mf, 'measured Done more-actions focus at 768').not.toBeNull();
	expect(mf!.clipped, 'Done more-actions focus not clipped at right extreme').toBe(false);
});

test('kanban-brutalism hover does not stick on a touch pointer (hover: hover gate)', async ({
	browser
}) => {
	// Hover feedback must be gated behind (hover: hover). On a touch device a
	// tap would otherwise leave a sticky :hover wash/perimeter/lift that
	// resembles selection. A hasTouch context reports (hover: none).
	const context = await browser.newContext({
		hasTouch: true,
		viewport: { width: 1280, height: 900 }
	});
	const page = await context.newPage();
	await page.goto('/designs/kanban-brutalism/preview');
	await page.waitForSelector('.board-root');

	const hoverCapable = await page.evaluate(() => matchMedia('(hover: hover)').matches);
	expect(hoverCapable, 'touch context reports (hover: none)').toBe(false);

	const readCard = () =>
		page.evaluate(() => {
			const el = document.querySelector('.card:not(.is-selected)');
			if (!(el instanceof HTMLElement)) return null;
			const ctx = document.createElement('canvas').getContext('2d');
			if (!ctx) return null;
			const gap = (css: string) => {
				ctx.clearRect(0, 0, 2, 2);
				ctx.fillStyle = '#000';
				ctx.fillStyle = css;
				ctx.fillRect(0, 0, 2, 2);
				const d = ctx.getImageData(0, 0, 1, 1).data;
				return d[2] - d[0];
			};
			const cs = getComputedStyle(el);
			return {
				bgGap: gap(cs.backgroundColor),
				borderGap: gap(cs.borderTopColor),
				transform: cs.transform
			};
		});

	// Resting baseline before any interaction (must be at rest).
	const before = await readCard();
	expect(before, 'resting card readable').not.toBeNull();
	expect(before!.transform, 'precondition: card at rest (no transform)').toBe('none');

	// Tap the (non-interactive) card; its rest background/border/transform
	// must remain unchanged — no sticky hover wash/perimeter/lift.
	await page.locator('.card:not(.is-selected)').first().tap();
	const after = await readCard();
	expect(after, 'tapped card readable').not.toBeNull();
	expect(after!.transform, 'no sticky lift after tap').toBe('none');
	expect(
		Math.abs(after!.borderGap - before!.borderGap),
		'no sticky accent perimeter after tap'
	).toBeLessThanOrEqual(2);
	expect(
		Math.abs(after!.bgGap - before!.bgGap),
		'no sticky blue wash after tap'
	).toBeLessThanOrEqual(2);

	await context.close();
});

test('opens the kanban-dark-neon design and its isolated preview states', async ({ page }) => {
	// ---- Detail page: exact approved public summary + identity ----
	await page.goto('/designs/kanban-dark-neon');

	await expect(
		page.getByRole('heading', { name: 'Kanban Board · Holodeck Wireframe', exact: false })
	).toBeVisible();
	await expect(
		page.getByText(
			'A dark Holodeck Wireframe Kanban board on a near-black canvas with transparent panels defined by luminous cyan wireframe edges, cool-white body text, cyan monospace metrics, restrained semantic glow, outlined labels/avatars/counts, and a pale-red full-border error treatment — no fills, gradients, or backdrop blur.',
			{ exact: true }
		)
	).toBeVisible();

	// ---- Isolated preview: locked content + empty/error/loading states ----
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
	// (selection = bright cyan edge + glow on a transparent face)
	const mineBtn = frame.getByRole('button', { name: 'Mine', exact: true });
	await mineBtn.click();
	await expect(mineBtn).toHaveAttribute('aria-pressed', 'true');

	// keyboard focus on the search field shows a container ring with meaningful
	// contrast (>=3:1, the WCAG UI-component minimum) against its real effective
	// backdrop. The field sits on a near-transparent app bar over the near-black
	// canvas, so the surround is the composited panel-over-canvas — proving the
	// cyan ring is visible, not lost against the dark field.
	const previewFrame = page.frame({ url: /kanban-dark-neon\/preview$/ });
	expect(previewFrame).toBeTruthy();
	await frame.getByRole('searchbox').focus();
	const focusContrast = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.search');
		if (!(el instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
		const parseRgb = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return { r: d[0], g: d[1], b: d[2] };
		};
		const lumOfRgb = ({ r, g, b }: { r: number; g: number; b: number }) => {
			const ch = (v: number) => {
				const s = v / 255;
				return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
		};
		// Composite every translucent background layer (panel -> canvas) so the
		// effective backdrop is measured, not the un-composited tint.
		const alphaOf = (css: string) => {
			const m = css.match(/rgba?\(([^)]*)\)/);
			if (!m) return 1;
			const p = m[1].split(',').map((x) => x.trim());
			return p.length === 4 ? parseFloat(p[3]) : 1;
		};
		const bgLumOf = (start: Element): number => {
			const layers: { rgb: { r: number; g: number; b: number }; a: number }[] = [];
			let node: Element | null = start;
			while (node instanceof HTMLElement) {
				const bg = getComputedStyle(node).backgroundColor;
				layers.push({ rgb: parseRgb(bg), a: alphaOf(bg) });
				if (alphaOf(bg) >= 0.999) break;
				node = node.parentElement;
			}
			let acc = layers[layers.length - 1].rgb;
			for (let i = layers.length - 2; i >= 0; i--) {
				const s = layers[i];
				acc = {
					r: s.rgb.r * s.a + acc.r * (1 - s.a),
					g: s.rgb.g * s.a + acc.g * (1 - s.a),
					b: s.rgb.b * s.a + acc.b * (1 - s.a)
				};
			}
			return lumOfRgb(acc);
		};
		const oL = lumOfRgb(parseRgb(cs.outlineColor));
		const bL = bgLumOf(el);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(focusContrast).toBeGreaterThanOrEqual(3);

	// reduced-motion: skeleton pulse animation is suppressed; the skeleton
	// remains visible but static (no infinite animation).
	await page.emulateMedia({ reducedMotion: 'reduce' });
	const skeletonStatic = await previewFrame!.evaluate(() => {
		const el = document.querySelector('.skel');
		if (!(el instanceof HTMLElement)) return null;
		return getComputedStyle(el).animationName === 'none';
	});
	expect(skeletonStatic).toBe(true);
	await page.emulateMedia({ reducedMotion: null });

	// ------------------------------------------------------------------
	// Direct preview route: visual-signature, a11y, and responsive checks.
	// The detail page embeds the preview in a narrower iframe, so these run
	// on the standalone /preview route at exact 375/768/1280 widths.
	// ------------------------------------------------------------------
	await page.goto('/designs/kanban-dark-neon/preview');
	await expect(page.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });

	// --- Locked content: all five team members render as accessible avatars
	//     in the header (complete fixed content, wireframe-styled). ---
	const memberNames = ['Maya Rivera', 'Devon Chen', 'Priya Nair', 'Sam Okafor', 'Lena Foss'];
	expect(await page.locator('.team-avatars [aria-label]').count()).toBe(5);
	for (const name of memberNames) {
		await expect(page.locator(`.team-avatars [aria-label="${name}"]`)).toBeVisible();
	}

	// --- Showcased states exposed programmatically (no interaction added):
	//     the active column announces its state, and the selected card's
	//     computed accessible NAME includes "selected". ---
	await expect(page.locator('.column.is-active')).toHaveAttribute('aria-label', /active/i);
	await expect(page.getByRole('article', { name: /selected/i })).toBeVisible();

	// --- HOLODECK WIREFRAME signature: near-black canvas; transparent /
	//     near-transparent panels defined by luminous cyan wireframe edges;
	//     cool-white body/title text; cyan monospace metrics; restrained
	//     semantic glow on dots/active/selected/focus; outlined labels,
	//     avatars, and counts; pale-red full-border error. No fills, no
	//     gradients, no backdrop blur, no multi-hue signage, no side-stripes. ---
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
		const channels = (cssColor: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = cssColor;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return { r: d[0], g: d[1], b: d[2] };
		};
		// alpha of a background-color (returns 1 for opaque colour spaces)
		const alphaOf = (cssColor: string) => {
			const m = cssColor.match(/rgba?\(([^)]*)\)/);
			if (!m) return 1;
			const p = m[1].split(',').map((x) => x.trim());
			return p.length === 4 ? parseFloat(p[3]) : 1;
		};
		// Walk every element: gradients? backdrop blur? max cyan glow alpha?
		let gradientFound = false;
		let backdropFound = false;
		let maxCyanGlowAlpha = 0;
		const fonts = new Set<string>();
		const dotGlow = { hasBlur: false, cyan: false };
		document.querySelectorAll('.board-root, .board-root *').forEach((el) => {
			const c = getComputedStyle(el);
			if (/gradient/i.test(c.backgroundImage)) gradientFound = true;
			if (c.backdropFilter !== 'none') backdropFound = true;
			fonts.add(c.fontFamily.toLowerCase());
			// Parse box-shadow layers for cyan glow (blur radius > 0 + a
			// blue-dominant colour). Track the highest alpha to prove restraint.
			const shadows = c.boxShadow;
			if (shadows !== 'none') {
				const layerRe = /(rgba?\([^)]*\))\s+([-\d.]+px)\s+([-\d.]+px)\s+([-\d.]+px)?/g;
				let m: RegExpExecArray | null;
				while ((m = layerRe.exec(shadows))) {
					const color = m[1];
					const blur = m[4] ? parseFloat(m[4]) : 0;
					const ch = channels(color);
					// Cyan = both cool channels clearly above red (b>r and g>r),
					// distinguishing cyan/teal from pure blue, red, or warm hues.
					const cyanish = ch.b > ch.r + 40 && ch.g > ch.r + 40;
					if (blur > 0 && cyanish) {
						maxCyanGlowAlpha = Math.max(maxCyanGlowAlpha, alphaOf(color));
					}
				}
			}
		});
		// Active column dot: cyan + glowing (blur > 0).
		const dotCs = cs('.column.is-active .column-dot');
		if (dotCs) {
			const dotShadow = dotCs.boxShadow;
			const dm = dotShadow.match(/([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px/);
			if (dm) {
				dotGlow.hasBlur = parseFloat(dm[3]) > 0;
				const colorMatch = dotShadow.match(/(rgba?\([^)]*\))/);
				if (colorMatch) {
					const dch = channels(colorMatch[1]);
					dotGlow.cyan = dch.b > dch.r + 40 && dch.g > dch.r + 40;
				}
			}
		}
		const cardCs = cs('.card');
		const cardBorderCh = cardCs ? channels(cardCs.borderTopColor) : { r: -1, g: -1, b: -1 };
		const errCs = cs('.error-banner');
		const selCs = cs('.card.is-selected');
		return {
			canvasLum: lum(cs('.board-root')?.backgroundColor ?? '#000'),
			canvasBg: cs('.board-root')?.backgroundColor ?? '',
			cardBgAlpha: cardCs ? alphaOf(cardCs.backgroundColor) : -1,
			cardBgImage: cardCs?.backgroundImage ?? '',
			cardBorderBlueRed: cardBorderCh.b - cardBorderCh.r,
			cardBgLum: cardCs ? lum(cardCs.backgroundColor) : -1,
			columnBgAlpha: alphaOf(cs('.column')?.backgroundColor ?? 'transparent'),
			titleColorLum: lum(cs('.card-title')?.color ?? '#fff'),
			countFont: cs('.count')?.fontFamily ?? '',
			cidFont: cs('.cid')?.fontFamily ?? '',
			gradientFound,
			backdropFound,
			dotGlowHasBlur: dotGlow.hasBlur,
			dotGlowCyan: dotGlow.cyan,
			maxCyanGlowAlpha,
			errorAllSides:
				errCs &&
				errCs.borderTopStyle === 'solid' &&
				errCs.borderTopWidth === errCs.borderBottomWidth &&
				errCs.borderLeftWidth === errCs.borderRightWidth &&
				errCs.borderTopWidth === errCs.borderLeftWidth &&
				parseFloat(errCs.borderTopWidth) >= 1,
			selectedAllSides:
				selCs &&
				selCs.borderTopWidth === selCs.borderBottomWidth &&
				selCs.borderLeftWidth === selCs.borderRightWidth &&
				selCs.borderTopWidth === selCs.borderLeftWidth
		};
	});
	expect(sig).not.toBeNull();
	expect(sig!.canvasLum, 'canvas near-black').toBeLessThan(0.06);
	expect(sig!.cardBgAlpha, 'card face near-transparent (no fill)').toBeLessThan(0.1);
	expect(sig!.columnBgAlpha, 'column body transparent').toBe(0);
	expect(sig!.cardBgImage, 'no background image / gradient on cards').toBe('none');
	expect(sig!.cardBorderBlueRed, 'card wireframe edge is cyan').toBeGreaterThan(40);
	expect(sig!.titleColorLum, 'card title cool-white').toBeGreaterThan(0.6);
	expect(sig!.countFont.toLowerCase(), 'count metric is monospace').toMatch(/mono/);
	expect(sig!.cidFont.toLowerCase(), 'card-id metric is monospace').toMatch(/mono/);
	expect(sig!.gradientFound, 'no gradient anywhere').toBe(false);
	expect(sig!.backdropFound, 'no backdrop blur anywhere').toBe(false);
	expect(sig!.dotGlowHasBlur, 'active column dot glows (cyan blur)').toBe(true);
	expect(sig!.dotGlowCyan, 'active column dot glow is cyan').toBe(true);
	expect(sig!.maxCyanGlowAlpha, 'cyan glow is restrained').toBeLessThanOrEqual(0.4);
	expect(sig!.errorAllSides, 'error is a full pale-red border (no side-stripe)').toBe(true);
	expect(sig!.selectedAllSides, 'selection is a full cyan border (no side-stripe)').toBe(true);

	// --- Table-driven WCAG AA contrast audit: every distinct semantic text
	//     role against its actual opaque parent surface. Surfaces are
	//     transparent/near-transparent, so the audit climbs to the nearest
	//     opaque ancestor (the near-black canvas) — the real effective
	//     background for text on a wireframe panel. ---
	const contrastResults = await page.evaluate(() => {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return null;
		// Parse a CSS color to RGBA by rendering it to a 1px canvas and reading
		// the pixel — including the alpha channel (d[3]/255). This is the single
		// source of truth for alpha: it handles comma-rgba, space/slash modern
		// syntax (rgb(... / a)), AND oklch(... / a), which a regex cannot.
		const parseRgb = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
		};
		const lumOfRgb = ({ r, g, b }: { r: number; g: number; b: number }) => {
			const ch = (v: number) => {
				const s = v / 255;
				return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
		};
		// Composite every translucent panel layer over the near-black canvas so
		// text on a near-transparent wireframe surface is measured against its
		// real effective backdrop (canvas), not an un-composited cyan tint that
		// would overstate background luminance.
		const bgRgbOf = (start: Element | null): { r: number; g: number; b: number } => {
			if (!(start instanceof HTMLElement)) return parseRgb('rgb(0,0,0)');
			const layers: { rgb: { r: number; g: number; b: number }; a: number }[] = [];
			let node: Element | null = start;
			while (node instanceof HTMLElement) {
				const parsed = parseRgb(getComputedStyle(node).backgroundColor);
				layers.push({ rgb: { r: parsed.r, g: parsed.g, b: parsed.b }, a: parsed.a });
				if (parsed.a >= 0.999) break;
				node = node.parentElement;
			}
			let acc = layers[layers.length - 1].rgb;
			for (let i = layers.length - 2; i >= 0; i--) {
				const s = layers[i];
				acc = {
					r: s.rgb.r * s.a + acc.r * (1 - s.a),
					g: s.rgb.g * s.a + acc.g * (1 - s.a),
					b: s.rgb.b * s.a + acc.b * (1 - s.a)
				};
			}
			return acc;
		};
		// Cumulative element + ancestor opacity: opacity dims the whole element
		// render, so it multiplies the foreground's effective alpha.
		const opacityOf = (el: Element): number => {
			let op = 1;
			let node: Element | null = el;
			while (node instanceof HTMLElement) {
				op *= parseFloat(getComputedStyle(node).opacity || '1');
				node = node.parentElement;
			}
			return Math.min(Math.max(op, 0), 1);
		};
		// Composite the FOREGROUND rgba (alpha read from the rendered pixel,
		// so oklch(... / a) and rgb(... / a) work too) + element/ancestor
		// opacity over the effective backdrop before computing luminance.
		const blendOver = (
			fg: { r: number; g: number; b: number },
			bg: { r: number; g: number; b: number },
			a: number
		) => ({
			r: fg.r * a + bg.r * (1 - a),
			g: fg.g * a + bg.g * (1 - a),
			b: fg.b * a + bg.b * (1 - a)
		});
		const ratioOf = (
			color: string,
			bgRgb: { r: number; g: number; b: number },
			textEl: Element
		) => {
			const fg = parseRgb(color);
			const fgA = Math.min(fg.a * opacityOf(textEl), 1);
			const eff = blendOver({ r: fg.r, g: fg.g, b: fg.b }, bgRgb, fgA);
			const tL = lumOfRgb(eff);
			const bL = lumOfRgb(bgRgb);
			return (Math.max(tL, bL) + 0.05) / (Math.min(tL, bL) + 0.05);
		};
		const ratio = (textSel: string, bgSel: string, pseudo?: string) => {
			const textEl = document.querySelector(textSel);
			const bgEl = document.querySelector(bgSel);
			if (!(textEl instanceof HTMLElement) || !(bgEl instanceof HTMLElement)) return -1;
			const cs = pseudo ? getComputedStyle(textEl, pseudo) : getComputedStyle(textEl);
			return ratioOf(cs.color, bgRgbOf(bgEl), textEl);
		};
		const selfRatio = (sel: string) => ratio(sel, sel);
		const elRatio = (el: Element) => {
			if (!(el instanceof HTMLElement)) return -1;
			const cs = getComputedStyle(el);
			return ratioOf(cs.color, bgRgbOf(el), el);
		};
		const results: { role: string; ratio: number }[] = [
			{ role: 'card-title', ratio: ratio('.card-title', '.card') },
			{ role: 'cid', ratio: ratio('.cid', '.card') },
			{ role: 'checklist', ratio: ratio('.checklist', '.card') },
			{ role: 'due-regular', ratio: ratio('.due:not(.is-done)', '.card') },
			{ role: 'due-done', ratio: ratio('.due.is-done', '.card') },
			{ role: 'pri-high', ratio: ratio('.pri-high', '.card') },
			{ role: 'pri-medium', ratio: ratio('.pri-medium', '.card') },
			{ role: 'board-title', ratio: ratio('.title-block h1', '.app-bar') },
			{ role: 'subtitle', ratio: ratio('.subtitle', '.app-bar') },
			{ role: 'column-heading', ratio: ratio('.column-head h2', '.column-head') },
			{ role: 'count-badge', ratio: selfRatio('.count') },
			{ role: 'empty-state', ratio: ratio('.empty-col p', '.empty-col') },
			{ role: 'error-body', ratio: ratio('.error-banner p', '.error-banner') },
			{ role: 'error-strong', ratio: ratio('.error-banner strong', '.error-banner') },
			{ role: 'primary-text', ratio: selfRatio('.primary') },
			{ role: 'add-card-text', ratio: selfRatio('.add-card') },
			{ role: 'retry-text', ratio: selfRatio('.error-retry') },
			{ role: 'project-chip', ratio: selfRatio('.project-chip') },
			{ role: 'chip-active', ratio: selfRatio('.chip[aria-pressed="true"]') },
			{ role: 'chip-inactive', ratio: selfRatio('.chip:not([aria-pressed="true"])') },
			{
				role: 'view-active',
				ratio: selfRatio('.view-toggle button[aria-pressed="true"]')
			},
			{
				role: 'view-inactive',
				ratio: selfRatio('.view-toggle button:not([aria-pressed="true"])')
			},
			{ role: 'search-placeholder', ratio: ratio('.search input', '.search', '::placeholder') },
			{ role: 'search-input', ratio: ratio('.search input', '.search') }
		];
		document.querySelectorAll('.label').forEach((el) => {
			const name = el.textContent?.trim() || '?';
			results.push({ role: `label:${name}`, ratio: elRatio(el) });
		});
		document.querySelectorAll('.avatar').forEach((el) => {
			const initials = el.textContent?.trim() || '?';
			results.push({ role: `avatar:${initials}`, ratio: elRatio(el) });
		});

		// Self-check: a translucent foreground in a color function the regex
		// cannot parse — `oklch(... / a)` (getComputedStyle keeps it as oklch,
		// not comma-rgba) — combined with element AND ancestor opacity.
		// Effective alpha = 0.4 * 0.5 (element) * 0.5 (ancestor) = 0.1. A correct
		// compositor must read alpha from the RENDERED pixel (canvas d[3]/255)
		// and combine it with cumulative opacity — NOT a comma-rgba regex that
		// ignores oklch and treats the text as opaque. `expected` is the
		// analytic ratio for a_eff = 0.1 over the probe's real backdrop.
		const host = document.createElement('div');
		host.style.opacity = '0.5';
		const probe = document.createElement('span');
		probe.textContent = 'probe';
		probe.style.color = 'oklch(1 0 0 / 0.4)';
		probe.style.opacity = '0.5';
		host.appendChild(probe);
		const root = document.querySelector('.board-root');
		(root ?? document.body).appendChild(host);
		const measured = elRatio(probe);
		const bgRgb = bgRgbOf(probe);
		const expectedEff = blendOver({ r: 255, g: 255, b: 255 }, bgRgb, 0.1);
		const expT = lumOfRgb(expectedEff);
		const expB = lumOfRgb(bgRgb);
		const expected = (Math.max(expT, expB) + 0.05) / (Math.min(expT, expB) + 0.05);
		host.remove();

		return { results, mutation: { measured, expected } };
	});
	expect(contrastResults).not.toBeNull();
	for (const { role, ratio } of contrastResults!.results) {
		expect(ratio, `${role} text contrast >= 4.5:1`).toBeGreaterThanOrEqual(4.5);
	}
	// The compositor must match the analytic model that combines modern-syntax
	// foreground alpha (read from the rendered pixel) with element AND ancestor
	// opacity (effective alpha 0.4 * 0.5 * 0.5 = 0.1).
	const mut = contrastResults!.mutation;
	expect(
		Math.abs(mut.measured - mut.expected),
		'mutation measured ~= expected (fg alpha x element x ancestor opacity)'
	).toBeLessThan(0.03);
	expect(mut.expected, 'mutation expected is a bounded LOW contrast (>1)').toBeGreaterThan(1.0);
	expect(mut.expected, 'mutation expected is a bounded LOW contrast (<1.4)').toBeLessThan(1.4);

	// The New task primary is a transparent cyan-edge button on the near-black
	// app bar; its focus outline seats outside the face, so the cyan ring must
	// still read at >=3:1 against the canvas. We are on the standalone /preview
	// route (no iframe), so drive focus in the page directly. Reach the primary
	// by Tabbing from the preceding control so :focus-visible legitimately
	// applies.
	await page.getByRole('button', { name: 'List', exact: true }).press('Tab');
	const primaryFocus = await page.evaluate(() => {
		const el = document.querySelector('.primary');
		if (!(el instanceof HTMLElement)) return -1;
		const cs = getComputedStyle(el);
		if (cs.outlineStyle !== 'solid' || parseFloat(cs.outlineWidth) < 3) return -1;
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx) return -1;
		const parseRgb = (css: string) => {
			ctx.clearRect(0, 0, 2, 2);
			ctx.fillStyle = '#000';
			ctx.fillStyle = css;
			ctx.fillRect(0, 0, 2, 2);
			const d = ctx.getImageData(0, 0, 1, 1).data;
			return { r: d[0], g: d[1], b: d[2] };
		};
		const lumOfRgb = ({ r, g, b }: { r: number; g: number; b: number }) => {
			const ch = (v: number) => {
				const s = v / 255;
				return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
			};
			return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
		};
		// Composite the transparent primary face + faint app bar over the
		// canvas to get the real effective surround for the focus ring.
		const alphaOf = (css: string) => {
			const m = css.match(/rgba?\(([^)]*)\)/);
			if (!m) return 1;
			const p = m[1].split(',').map((x) => x.trim());
			return p.length === 4 ? parseFloat(p[3]) : 1;
		};
		const bgLumOf = (start: Element): number => {
			const layers: { rgb: { r: number; g: number; b: number }; a: number }[] = [];
			let node: Element | null = start;
			while (node instanceof HTMLElement) {
				const bg = getComputedStyle(node).backgroundColor;
				layers.push({ rgb: parseRgb(bg), a: alphaOf(bg) });
				if (alphaOf(bg) >= 0.999) break;
				node = node.parentElement;
			}
			let acc = layers[layers.length - 1].rgb;
			for (let i = layers.length - 2; i >= 0; i--) {
				const s = layers[i];
				acc = {
					r: s.rgb.r * s.a + acc.r * (1 - s.a),
					g: s.rgb.g * s.a + acc.g * (1 - s.a),
					b: s.rgb.b * s.a + acc.b * (1 - s.a)
				};
			}
			return lumOfRgb(acc);
		};
		const oL = lumOfRgb(parseRgb(cs.outlineColor));
		const bL = bgLumOf(el);
		return (Math.max(oL, bL) + 0.05) / (Math.min(oL, bL) + 0.05);
	});
	expect(primaryFocus).toBeGreaterThanOrEqual(3);

	// --- Reduced-motion hover contract: hover is gated behind (hover: hover)
	//     and lifts a card only when motion is allowed; under reduced motion
	//     the wash/edge remain but no transform runs. Cards stay
	//     non-interactive (no pointer/grab cursor). ---
	const hoverState = () =>
		page.evaluate(() => {
			const card = document.querySelector('.card:not(.is-selected)');
			if (!(card instanceof HTMLElement)) return null;
			const cs = getComputedStyle(card);
			return { transform: cs.transform, cursor: cs.cursor };
		});
	await page.emulateMedia({ reducedMotion: null });
	await page.locator('.card:not(.is-selected)').first().hover();
	await expect
		.poll(async () => {
			const s = await hoverState();
			return !!s && s.transform !== 'none';
		}, 'hover lifts the card when motion is allowed')
		.toBe(true);
	const hov = await hoverState();
	expect(hov, 'hover measured').not.toBeNull();
	expect(hov!.cursor, 'card stays non-interactive (no pointer/grab cursor)').toBe('auto');

	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.locator('.card:not(.is-selected)').first().hover();
	await expect
		.poll(async () => {
			const s = await hoverState();
			return !!s && s.transform === 'none';
		}, 'reduced-motion suppresses the hover lift (no transform)')
		.toBe(true);
	await page.emulateMedia({ reducedMotion: null });

	// Exact-width responsive: every interactive target — named controls, the
	// clickable Search label, New task, Retry, EVERY column more-actions, EVERY
	// "Add a card", and the dismiss control — is >=44px tall, and there is no
	// horizontal document overflow at each of 375/768/1280.
	const controls = ['Board', 'List', 'All', 'Mine', 'Due this week'];
	const columnNames = ['Backlog', 'In Progress', 'In Review', 'Done'];
	for (const width of [375, 768, 1280]) {
		await page.setViewportSize({ width, height: 800 });
		for (const name of controls) {
			const box = await page.getByRole('button', { name, exact: true }).boundingBox();
			expect(box?.height, `${name} height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		// The Search field is a clickable <label> (clicking it focuses the
		// input), so its clickable box must also meet the 44px minimum on both
		// axes.
		const searchBox = await page.locator('.search').boundingBox();
		expect(searchBox?.width, `search label width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(searchBox?.height, `search label height at ${width}`).toBeGreaterThanOrEqual(44);
		// Primary action + error Retry — both axes.
		const primary = await page.getByRole('button', { name: 'New task', exact: true }).boundingBox();
		expect(primary?.width, `New task width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(primary?.height, `New task height at ${width}`).toBeGreaterThanOrEqual(44);
		const retry = await page.getByRole('button', { name: 'Retry', exact: true }).boundingBox();
		expect(retry?.width, `Retry width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(retry?.height, `Retry height at ${width}`).toBeGreaterThanOrEqual(44);
		for (const col of columnNames) {
			const ma = await page
				.getByRole('button', { name: `More actions for ${col}`, exact: true })
				.boundingBox();
			expect(ma?.width, `${col} more-actions width at ${width}`).toBeGreaterThanOrEqual(44);
			expect(ma?.height, `${col} more-actions height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		// EVERY "Add a card" target (one per column) — both axes.
		const addCards = await page.getByRole('button', { name: 'ADD A CARD', exact: true }).all();
		expect(addCards.length, `one Add a card per column at ${width}`).toBe(columnNames.length);
		for (const ac of addCards) {
			const box = await ac.boundingBox();
			expect(box?.width, `Add a card width at ${width}`).toBeGreaterThanOrEqual(44);
			expect(box?.height, `Add a card height at ${width}`).toBeGreaterThanOrEqual(44);
		}
		const dismiss = await page
			.getByRole('button', { name: 'Dismiss error', exact: true })
			.boundingBox();
		expect(dismiss?.width, `dismiss width at ${width}`).toBeGreaterThanOrEqual(44);
		expect(dismiss?.height, `dismiss height at ${width}`).toBeGreaterThanOrEqual(44);
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth - document.documentElement.clientWidth ||
				window.scrollX
		);
		expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(0);
	}

	// Focus perimeters are never clipped inside the desktop/tablet horizontal
	// board scroller. The focus extent is 3px outline + 2px offset (5px), so
	// the scroller must carry >=6px internal breathing room on every side. The
	// full-width "Add a card" buttons sit flush with the scroller's side and
	// bottom edges (unlike the inset more-actions), so they are the controls
	// whose perimeters actually exercise the clip — measure them at both scroll
	// extremes, alongside a direct lock on the breathing room.
	await page.setViewportSize({ width: 1280, height: 800 });
	const padding = await page.evaluate(() => {
		const sc = document.querySelector('.board-body');
		if (!(sc instanceof HTMLElement)) return null;
		const cs = getComputedStyle(sc);
		return {
			top: parseFloat(cs.paddingTop),
			right: parseFloat(cs.paddingRight),
			bottom: parseFloat(cs.paddingBottom),
			left: parseFloat(cs.paddingLeft)
		};
	});
	expect(padding, 'scroller padding measurable').not.toBeNull();
	// 5px focus extent (3px outline + 2px offset) needs >=6px breathing room.
	expect(padding!.top, 'scroller top breathing room >= 6px').toBeGreaterThanOrEqual(6);
	expect(padding!.right, 'scroller right breathing room >= 6px').toBeGreaterThanOrEqual(6);
	expect(padding!.bottom, 'scroller bottom breathing room >= 6px').toBeGreaterThanOrEqual(6);
	expect(padding!.left, 'scroller left breathing room >= 6px').toBeGreaterThanOrEqual(6);

	const measureFocus = () =>
		page.evaluate(() => {
			const el = document.activeElement;
			const sc = el?.closest('.board-body');
			if (!(el instanceof HTMLElement) || !(sc instanceof HTMLElement)) return null;
			const cs = getComputedStyle(el);
			if (cs.outlineStyle !== 'solid') {
				return {
					label: el.getAttribute('aria-label'),
					text: el.textContent?.trim(),
					clipped: true
				};
			}
			const ow = parseFloat(cs.outlineWidth);
			const oo = parseFloat(cs.outlineOffset);
			const er = el.getBoundingClientRect();
			const sr = sc.getBoundingClientRect();
			const top = er.top - oo - ow;
			const right = er.right + oo + ow;
			const bottom = er.bottom + oo + ow;
			const left = er.left - oo - ow;
			return {
				label: el.getAttribute('aria-label'),
				text: el.textContent?.trim(),
				clipped: !(
					top >= sr.top - 0.5 &&
					right <= sr.right + 0.5 &&
					bottom <= sr.bottom + 0.5 &&
					left >= sr.left - 0.5
				)
			};
		});
	// Tab to the Nth "Add a card" (1 = first column, 4 = last column). These
	// are full-width, edge-flush targets, so they exercise the scroller clip.
	const tabToAddCard = async (ordinal: number) => {
		await page.getByRole('searchbox').focus();
		let count = 0;
		for (let i = 0; i < 90; i++) {
			await page.keyboard.press('Tab');
			const isAdd = await page.evaluate(() => {
				const el = document.activeElement;
				return !!(el && (el.textContent ?? '').includes('ADD A CARD') && el.closest('.add-card'));
			});
			if (isAdd) {
				count += 1;
				if (count === ordinal) return true;
			}
		}
		return false;
	};

	// 768 (scrolls horizontally): first column add-card at the left extreme,
	// last column add-card at the right extreme.
	await page.setViewportSize({ width: 768, height: 800 });
	await page.evaluate(() => {
		const sc = document.querySelector('.board-body');
		if (sc instanceof HTMLElement) sc.scrollLeft = 0;
	});
	expect(await tabToAddCard(1), 'reached first column Add a card at 768').toBe(true);
	let mf = await measureFocus();
	expect(mf, 'measured first column Add a card focus at 768').not.toBeNull();
	expect(mf!.clipped, 'first column Add a card focus not clipped at left extreme').toBe(false);
	await page.evaluate(() => {
		const sc = document.querySelector('.board-body');
		if (sc instanceof HTMLElement) sc.scrollLeft = sc.scrollWidth;
	});
	expect(await tabToAddCard(4), 'reached last column Add a card at 768').toBe(true);
	mf = await measureFocus();
	expect(mf, 'measured last column Add a card focus at 768').not.toBeNull();
	expect(mf!.clipped, 'last column Add a card focus not clipped at right extreme').toBe(false);

	// 1280 (fits, no scroll): first and last column add-cards.
	await page.setViewportSize({ width: 1280, height: 800 });
	expect(await tabToAddCard(1), 'reached first column Add a card at 1280').toBe(true);
	mf = await measureFocus();
	expect(mf, 'measured first column Add a card focus at 1280').not.toBeNull();
	expect(mf!.clipped, 'first column Add a card focus not clipped at 1280').toBe(false);
	expect(await tabToAddCard(4), 'reached last column Add a card at 1280').toBe(true);
	mf = await measureFocus();
	expect(mf, 'measured last column Add a card focus at 1280').not.toBeNull();
	expect(mf!.clipped, 'last column Add a card focus not clipped at 1280').toBe(false);
});
