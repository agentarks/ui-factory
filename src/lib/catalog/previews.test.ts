import type { Component } from 'svelte';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { getPublishedPreview, type PreviewLoader } from './previews';

describe('getPublishedPreview', () => {
	it('returns no loader for an unknown published slug', () => {
		expect(getPublishedPreview('missing')).toBeUndefined();
		expectTypeOf<PreviewLoader>().toEqualTypeOf<() => Promise<{ default: Component }>>();
	});
});
