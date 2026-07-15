import { published } from '$lib/catalog/registry';

export const load = () => ({
	designs: published.map(({ metadata }) => metadata)
});
