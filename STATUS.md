# Project Status

## Phase and objective

**Phase:** Scaffold complete

**Objective:** Publish the first independent, production-ready design entry.

## Completed

- Established the SvelteKit, Svelte 5, TypeScript, Tailwind CSS, Vite, Zod, Vitest, and Playwright scaffold.
- Implemented a build-time, file-backed catalog that validates required entry files and metadata, preserves each `DESIGN.md`, and lazy-loads previews.
- Established `published/` as the runtime publication boundary and `workbench/` as authoring-only: server catalog code imports only production-ready published metadata and handoffs, while client code imports only published preview modules.
- Added a test-only incomplete workbench fixture plus unit and post-build gates that fail if server or client discovery widens across the publication boundary.
- Made non-production entries under `published/` fail production builds; workbench, hidden, deprecated, and unknown slugs remain unavailable to public routes.
- Added the responsive semantic factory shell, intentional empty catalog, published-design listing and detail routes, and isolated iframe preview route with reload recovery.
- Wired Tailwind through the factory route group while keeping preview documents outside its preflight and utilities.
- Covered schema, registry, and preview lookup behavior with 32 unit tests and empty-catalog, detail 404, and isolated preview 404 behavior with 3 Chromium tests, including document-style isolation.
- Kept the production catalog empty: there are no sample designs.
- Impeccable critique: the restrained hierarchy keeps attention on future previews and the publication message makes the empty state candid rather than promotional.
- Impeccable audit: semantic landmarks, visible focus, AA-oriented tokens, and bounded line lengths cover the shell; Chromium checks at 375px and 1280px found no horizontal overflow and preserved skip-link focus.
- Impeccable polish: removed starter UI and demo routes, used dividers instead of cards, and retained system type, a single cool accent, and concise product copy.

## Next

- Add the first independent design through the documented publication workflow.

## Decisions

- Catalog entries are repository files discovered at build time; no database, CMS, or generated registry.
- Public entries live under `src/lib/designs/published/`; unpublished authoring work lives under `src/lib/designs/workbench/` and is never imported by runtime code.
- Root `DESIGN.md` governs the factory UI; each entry's `DESIGN.md` is an independent portable handoff.
- Preview documents render in a separate route group without factory CSS so entry-owned styles remain isolated.
- Iframe sandboxing is deferred while previews are trusted repository content; require it before accepting untrusted or community-authored previews.
- Detail-page happy-path browser coverage is deferred until the first real published design provides a stable subject.

## Blockers

None.

## Last verified commands

- `npm run check`
- `npm test`
- `npm run test:e2e`
- `npm run build` (includes the client publication-boundary scan)
- `node scripts/check-client-publication-boundary.mjs`
- `npm run lint`
- Mutation checks: widened client discovery fails the post-build scan; widened server preview discovery fails registry startup for missing metadata.
- `git diff --check`
