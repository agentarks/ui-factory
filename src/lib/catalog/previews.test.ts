import type { Component } from 'svelte';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { createPreviewRegistry, getPublishedPreview, type PreviewLoader } from './previews';

const TestPreview: Component = () => ({});

describe('getPublishedPreview', () => {
	it('does not discover the test-only workbench fixture in the production registry', () => {
		expect(getPublishedPreview('publication-boundary-test-only')).toBeUndefined();
		expectTypeOf<PreviewLoader>().toEqualTypeOf<() => Promise<{ default: Component }>>();
	});

	it('loads a published preview from an injected registry', async () => {
		const loader: PreviewLoader = () => Promise.resolve({ default: TestPreview });
		const getPreview = createPreviewRegistry({
			'../designs/published/example/Preview.svelte': loader
		});

		expect(getPreview('example')).toBe(loader);
		await expect(getPreview('example')!()).resolves.toEqual({ default: TestPreview });
	});
});
