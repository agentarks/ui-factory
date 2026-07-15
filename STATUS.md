# Project Status

## Phase and objective

**Phase:** Scaffold complete

**Objective:** Publish the first independent, production-ready design entry.

## Completed

- Established the SvelteKit, Svelte 5, TypeScript, Tailwind CSS, Vite, Zod, Vitest, and Playwright scaffold.
- Implemented a build-time, file-backed catalog that validates required entry files and metadata, preserves each `DESIGN.md`, and lazy-loads previews.
- Established `published/` as the runtime publication boundary and `workbench/` as authoring-only: server catalog code imports only production-ready published metadata and handoffs, while client code imports only published preview modules.
- Made non-production entries under `published/` fail production builds; workbench, hidden, deprecated, and unknown slugs remain unavailable to public routes.
- Added the responsive semantic factory shell, intentional empty catalog, published-design listing and detail routes, and isolated iframe preview route with reload recovery.
- Covered schema, registry, and preview lookup behavior with 32 unit tests and empty-catalog, detail 404, and isolated preview 404 behavior with 3 Chromium tests.
- Kept the production catalog empty: there are no sample designs.

## Next

- Add the first independent design through the documented publication workflow.

## Decisions

- Catalog entries are repository files discovered at build time; no database, CMS, or generated registry.
- Public entries live under `src/lib/designs/published/`; unpublished authoring work lives under `src/lib/designs/workbench/` and is never imported by runtime code.
- Root `DESIGN.md` governs the factory UI; each entry's `DESIGN.md` is an independent portable handoff.
- Preview documents render outside the factory shell so entry-owned styles remain isolated.

## Blockers

None.

## Last verified commands

- `npm run check`
- `npm test`
- `npm run test:e2e`
- `npm run build`
- `npm exec prettier -- --check .`
- `npm exec eslint .`
- `git diff --check`
