import { describe, expect, it } from 'vitest';
import { designMetadataSchema } from './schema';

const validMetadata = {
	schemaVersion: 1,
	slug: 'analytics-dashboard',
	version: '1.0.0',
	title: 'Analytics Dashboard',
	summary: 'A dashboard for reviewing product analytics.',
	pageType: 'dashboard',
	applicationTypes: ['analytics'],
	visualStyles: ['minimal'],
	theme: 'light',
	density: 'comfortable',
	platforms: ['web'],
	status: 'production-ready',
	tags: ['charts']
};

describe('designMetadataSchema', () => {
	it('accepts complete version-1 metadata', () => {
		expect(designMetadataSchema.safeParse(validMetadata).success).toBe(true);
	});

	it('rejects a slug that is not lowercase kebab-case', () => {
		expect(
			designMetadataSchema.safeParse({ ...validMetadata, slug: 'Analytics_Dashboard' }).success
		).toBe(false);
	});

	it('rejects an invalid semantic version', () => {
		expect(designMetadataSchema.safeParse({ ...validMetadata, version: '1.0' }).success).toBe(
			false
		);
	});

	it.each(['applicationTypes', 'visualStyles', 'platforms'] as const)(
		'rejects an empty %s array',
		(field) => {
			expect(designMetadataSchema.safeParse({ ...validMetadata, [field]: [] }).success).toBe(false);
		}
	);

	it.each([
		['pageType', 'profile'],
		['theme', 'sepia'],
		['density', 'dense'],
		['platforms', ['watch']],
		['status', 'archived']
	] as const)('rejects an unsupported %s value', (field, value) => {
		expect(designMetadataSchema.safeParse({ ...validMetadata, [field]: value }).success).toBe(
			false
		);
	});
});
