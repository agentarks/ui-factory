import type { Component } from 'svelte';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { all, createCatalog, type CatalogEntry } from './registry.server';

type PreviewModule = { default: Component };

const fixtureMetadata = import.meta.glob<unknown>('./__fixtures__/published/*/metadata.json', {
	eager: true,
	import: 'default'
});
const fixtureDocuments = import.meta.glob<string>('./__fixtures__/published/*/DESIGN.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});
const fixturePreviews = import.meta.glob<PreviewModule>(
	'./__fixtures__/published/*/Preview.svelte'
);

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

const TestPreview: Component = () => ({});

const mapsFor = (metadata: unknown = validMetadata): Parameters<typeof createCatalog>[0] => ({
	metadata: { '/entries/entry/metadata.json': metadata },
	documents: { '/entries/entry/DESIGN.md': '# Entry\n' },
	previews: {
		'/entries/entry/Preview.svelte': () => Promise.resolve({ default: TestPreview })
	}
});

describe('createCatalog', () => {
	it("does not discover the 'complete' test fixture in the production catalog", () => {
		expect(all.map((entry) => entry.metadata.slug)).not.toContain('complete');
	});

	it('exposes readonly metadata arrays', () => {
		expectTypeOf<CatalogEntry['metadata']['applicationTypes']>().toEqualTypeOf<readonly string[]>();
		expectTypeOf<CatalogEntry['metadata']['visualStyles']>().toEqualTypeOf<readonly string[]>();
		expectTypeOf<CatalogEntry['metadata']['platforms']>().toEqualTypeOf<
			readonly ('web' | 'desktop' | 'tablet' | 'mobile')[]
		>();
		expectTypeOf<CatalogEntry['metadata']['tags']>().toEqualTypeOf<readonly string[]>();
		expect(typeof TestPreview).toBe('function');
	});

	it('accepts empty maps', () => {
		const catalog = createCatalog({ metadata: {}, documents: {}, previews: {} });

		expect(catalog.all).toEqual([]);
		expect(catalog.published).toEqual([]);
		expect(catalog.getPublished('missing')).toBeUndefined();
	});

	it('discovers a complete production-ready file-backed fixture', () => {
		const catalog = createCatalog({
			metadata: fixtureMetadata,
			documents: fixtureDocuments,
			previews: fixturePreviews
		});

		expect(catalog.all).toHaveLength(1);
		expect(catalog.all[0].metadata.slug).toBe('complete');
		expect(catalog.published).toEqual(catalog.all);
		expect(catalog.getPublished('complete')).toBe(catalog.all[0]);
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

	it.each(['draft', 'reviewed', 'deprecated'])(
		'rejects %s entries from the published directory',
		(status) => {
			expect(() => createCatalog(mapsFor({ ...validMetadata, status }))).toThrow(
				/entry.*published.*production-ready/i
			);
		}
	);

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
		const second: Parameters<typeof createCatalog>[0] = {
			metadata: { '/other-root/entry/metadata.json': validMetadata },
			documents: { '/other-root/entry/DESIGN.md': '# Duplicate\n' },
			previews: {
				'/other-root/entry/Preview.svelte': () => Promise.resolve({ default: TestPreview })
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

	it('exposes immutable catalog collections and metadata', () => {
		const catalog = createCatalog(mapsFor());
		const metadata = catalog.all[0].metadata;

		expect(Object.isFrozen(catalog.all)).toBe(true);
		expect(Object.isFrozen(catalog.published)).toBe(true);
		expect(Object.isFrozen(catalog.all[0])).toBe(true);
		expect(Object.isFrozen(metadata)).toBe(true);
		expect(() => Object.assign(metadata, { title: 'Mutated' })).toThrow(TypeError);
		expect(metadata.title).toBe('Entry');
	});

	it.each([
		['all', (catalog: ReturnType<typeof createCatalog>) => catalog.all[0]],
		['published', (catalog: ReturnType<typeof createCatalog>) => catalog.published[0]],
		['getPublished', (catalog: ReturnType<typeof createCatalog>) => catalog.getPublished('entry')!]
	])('prevents mutation of nested metadata arrays returned by %s', (_name, getEntry) => {
		const metadata = getEntry(createCatalog(mapsFor())).metadata;

		for (const values of [
			metadata.applicationTypes,
			metadata.visualStyles,
			metadata.platforms,
			metadata.tags
		]) {
			expect(() => Array.prototype.push.call(values, values[0])).toThrow(TypeError);
		}
	});
});
