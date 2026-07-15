import { getPublished } from '$lib/catalog/registry';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = getPublished(params.slug);
	if (!entry) error(404, 'Design not found');

	return {
		slug: entry.metadata.slug,
		title: entry.metadata.title
	};
};
