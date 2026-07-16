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

	const frame = page.frameLocator('iframe[title*="preview"i]');
	await expect(frame.getByRole('heading', { name: 'Sprint 24 · Board' })).toBeVisible();
	await expect(frame.getByRole('button', { name: 'New task' })).toBeVisible();
	await expect(frame.getByText('Backlog', { exact: true })).toBeVisible();
	await expect(frame.getByRole('heading', { name: 'In Review' })).toBeVisible();
	await expect(frame.getByText('No cards yet')).toBeVisible();
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
