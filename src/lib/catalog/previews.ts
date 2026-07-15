import type { Component } from 'svelte';

type PreviewModule = { default: Component };
export type PreviewLoader = () => Promise<PreviewModule>;

export const createPreviewRegistry = (previews: Record<string, PreviewLoader>) => (slug: string) =>
	previews[`../designs/published/${slug}/Preview.svelte`];

export const getPublishedPreview = createPreviewRegistry(
	import.meta.glob<PreviewModule>('../designs/published/*/Preview.svelte')
);
