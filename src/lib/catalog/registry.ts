import type { Component } from 'svelte';
import { designMetadataSchema, type DesignMetadata } from './schema';

type CatalogMetadata = {
	readonly [Key in keyof DesignMetadata]: DesignMetadata[Key] extends unknown[]
		? Readonly<DesignMetadata[Key]>
		: DesignMetadata[Key];
};
type PreviewModule = { default: Component };
type PreviewLoader = () => Promise<PreviewModule>;

type CatalogMaps = {
	metadata: Record<string, unknown>;
	documents: Record<string, string>;
	previews: Record<string, PreviewLoader>;
};

export type CatalogEntry = Readonly<{
	metadata: CatalogMetadata;
	document: string;
	loadPreview: PreviewLoader;
}>;

export function createCatalog(maps: CatalogMaps) {
	const directories = new Set(
		[
			...Object.keys(maps.metadata),
			...Object.keys(maps.documents),
			...Object.keys(maps.previews)
		].map((path) => path.slice(0, path.lastIndexOf('/')))
	);
	const entries: CatalogEntry[] = [];
	const slugs = new Set<string>();

	for (const directory of directories) {
		const folder = directory.slice(directory.lastIndexOf('/') + 1);
		const paths = {
			metadata: `${directory}/metadata.json`,
			document: `${directory}/DESIGN.md`,
			preview: `${directory}/Preview.svelte`
		};

		if (!(paths.metadata in maps.metadata)) throw new Error(`${folder}: missing metadata.json`);
		if (!(paths.document in maps.documents)) throw new Error(`${folder}: missing DESIGN.md`);
		if (!(paths.preview in maps.previews)) throw new Error(`${folder}: missing Preview.svelte`);

		const result = designMetadataSchema.safeParse(maps.metadata[paths.metadata]);
		if (!result.success) {
			const problems = result.error.issues
				.map((issue) => `${issue.path.join('.') || 'metadata'}: ${issue.message}`)
				.join('; ');
			throw new Error(`${folder}: invalid metadata (${problems})`);
		}
		if (result.data.slug !== folder) {
			throw new Error(`${folder}: metadata slug ${result.data.slug} does not match folder`);
		}
		if (slugs.has(result.data.slug)) throw new Error(`duplicate slug: ${result.data.slug}`);
		slugs.add(result.data.slug);

		Object.freeze(result.data.applicationTypes);
		Object.freeze(result.data.visualStyles);
		Object.freeze(result.data.platforms);
		Object.freeze(result.data.tags);
		const metadata: CatalogMetadata = Object.freeze(result.data);
		entries.push(
			Object.freeze({
				metadata,
				document: maps.documents[paths.document],
				loadPreview: maps.previews[paths.preview]
			})
		);
	}

	const all = Object.freeze(entries);
	const published = Object.freeze(
		entries.filter((entry) => entry.metadata.status === 'production-ready')
	);
	const byPublishedSlug = new Map(published.map((entry) => [entry.metadata.slug, entry]));

	return Object.freeze({
		all,
		published,
		getPublished: (slug: string) => byPublishedSlug.get(slug)
	});
}

const productionCatalog = createCatalog({
	metadata: import.meta.glob<unknown>('../designs/*/metadata.json', {
		eager: true,
		import: 'default'
	}),
	documents: import.meta.glob<string>('../designs/*/DESIGN.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	}),
	previews: import.meta.glob<PreviewModule>('../designs/*/Preview.svelte')
});

export const { all, published, getPublished } = productionCatalog;
