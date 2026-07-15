import { z } from 'zod';

export const designMetadataSchema = z.object({
	schemaVersion: z.literal(1),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	version: z.string().regex(/^\d+\.\d+\.\d+$/),
	title: z.string().trim().min(1),
	summary: z.string().trim().min(1),
	pageType: z.enum([
		'dashboard',
		'product-detail',
		'authentication',
		'settings',
		'checkout',
		'data-management',
		'landing-page',
		'app-shell',
		'other'
	]),
	applicationTypes: z.array(z.string().trim().min(1)).min(1),
	visualStyles: z.array(z.string().trim().min(1)).min(1),
	theme: z.enum(['light', 'dark', 'adaptive']),
	density: z.enum(['compact', 'comfortable', 'spacious']),
	platforms: z.array(z.enum(['web', 'desktop', 'tablet', 'mobile'])).min(1),
	status: z.enum(['draft', 'reviewed', 'production-ready', 'deprecated']),
	tags: z.array(z.string().trim().min(1)).default([])
});

export type DesignMetadata = z.infer<typeof designMetadataSchema>;
