import { published } from '$lib/catalog/registry.server';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	designs: published.map(({ metadata }) => metadata)
});
