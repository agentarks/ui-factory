import type { Component } from 'svelte';

type PreviewModule = { default: Component };
export type PreviewLoader = () => Promise<PreviewModule>;

const previews = import.meta.glob<PreviewModule>('../designs/published/*/Preview.svelte');

export const getPublishedPreview = (slug: string) =>
	previews[`../designs/published/${slug}/Preview.svelte`];
