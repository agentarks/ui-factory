import { getPublished } from '$lib/catalog/registry';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = getPublished(params.slug);
	if (!entry) error(404, 'Design not found');

	return {
		metadata: entry.metadata,
		document: entry.document
	};
};
