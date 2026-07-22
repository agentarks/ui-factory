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
});
