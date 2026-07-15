import { getPublished } from '$lib/catalog/registry.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const entry = getPublished(params.slug);
	if (!entry) error(404, 'Design not found');

	return {
		slug: entry.metadata.slug,
		title: entry.metadata.title
	};
};
