import { describe, expect, it } from 'vitest';
import { all, createCatalog } from './registry';

const fixtureMetadata = import.meta.glob('./__fixtures__/*/metadata.json', {
	eager: true,
	import: 'default'
});
const fixtureDocuments = import.meta.glob('./__fixtures__/*/DESIGN.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;
const fixturePreviews = import.meta.glob('./__fixtures__/*/Preview.svelte');

const validMetadata = {
	schemaVersion: 1,
	slug: 'entry',
	version: '1.0.0',
	title: 'Entry',
	summary: 'A valid entry.',
	pageType: 'dashboard',
	applicationTypes: ['analytics'],
	visualStyles: ['minimal'],
	theme: 'light',
	density: 'comfortable',
	platforms: ['web'],
	status: 'production-ready'
};

const mapsFor = (metadata: unknown = validMetadata) => ({
	metadata: { '/entries/entry/metadata.json': metadata } as Record<string, unknown>,
	documents: { '/entries/entry/DESIGN.md': '# Entry\n' } as Record<string, string>,
	previews: {
		'/entries/entry/Preview.svelte': () => Promise.resolve({ default: 'preview' })
	} as Record<string, () => Promise<unknown>>
});

describe('createCatalog', () => {
	it('does not discover test fixtures in the production catalog', () => {
		expect(all).toEqual([]);
	});

	it('accepts empty maps', () => {
		const catalog = createCatalog({ metadata: {}, documents: {}, previews: {} });

		expect(catalog.all).toEqual([]);
		expect(catalog.published).toEqual([]);
		expect(catalog.getPublished('missing')).toBeUndefined();
	});

	it('discovers a complete file-backed fixture with a lazy preview', async () => {
		const catalog = createCatalog({
			metadata: fixtureMetadata,
			documents: fixtureDocuments,
			previews: fixturePreviews
		});

		expect(catalog.all).toHaveLength(1);
		expect(catalog.all[0].metadata.slug).toBe('complete');
		expect(catalog.published).toEqual(catalog.all);
		expect(catalog.getPublished('complete')).toBe(catalog.all[0]);
		expect(await catalog.all[0].loadPreview()).toHaveProperty('default');
	});

	it('preserves DESIGN.md exactly', () => {
		const catalog = createCatalog({
			metadata: fixtureMetadata,
			documents: fixtureDocuments,
			previews: fixturePreviews
		});

		expect(catalog.all[0].document).toBe(
			'# Complete Fixture\n\nPreserve this handoff exactly.\n\n- spacing: intentional\n- ending: newline\n'
		);
	});

	it('publishes only production-ready entries', () => {
		const maps = mapsFor({ ...validMetadata, status: 'reviewed' });
		const catalog = createCatalog(maps);

		expect(catalog.all).toHaveLength(1);
		expect(catalog.published).toEqual([]);
		expect(catalog.getPublished('entry')).toBeUndefined();
	});

	it.each(['metadata.json', 'DESIGN.md', 'Preview.svelte'])('names a missing %s', (file) => {
		const maps = mapsFor();
		if (file === 'metadata.json') maps.metadata = {};
		if (file === 'DESIGN.md') maps.documents = {};
		if (file === 'Preview.svelte') maps.previews = {};

		expect(() => createCatalog(maps)).toThrow(`entry: missing ${file}`);
	});

	it('names the entry folder and validation problem for invalid metadata', () => {
		expect(() => createCatalog(mapsFor({ ...validMetadata, title: '' }))).toThrow(/entry.*title/i);
	});

	it('rejects a folder and slug mismatch', () => {
		expect(() => createCatalog(mapsFor({ ...validMetadata, slug: 'other' }))).toThrow(
			/entry.*slug.*other/i
		);
	});

	it('rejects duplicate metadata slugs', () => {
		const first = mapsFor();
		const second = {
			metadata: { '/other-root/entry/metadata.json': validMetadata },
			documents: { '/other-root/entry/DESIGN.md': '# Duplicate\n' },
			previews: {
				'/other-root/entry/Preview.svelte': () => Promise.resolve({ default: 'duplicate' })
			}
		};

		expect(() =>
			createCatalog({
				metadata: { ...first.metadata, ...second.metadata },
				documents: { ...first.documents, ...second.documents },
				previews: { ...first.previews, ...second.previews }
			})
		).toThrow(/duplicate slug.*entry/i);
	});

	it('exposes immutable catalog collections', () => {
		const catalog = createCatalog(mapsFor());

		expect(Object.isFrozen(catalog.all)).toBe(true);
		expect(Object.isFrozen(catalog.published)).toBe(true);
		expect(Object.isFrozen(catalog.all[0])).toBe(true);
	});
});
