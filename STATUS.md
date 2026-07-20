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
- Added the responsive semantic factory shell, a graceful empty-catalog state, published-design listing and detail routes, and isolated iframe preview route with reload recovery.
- Wired Tailwind through the factory route group while keeping preview documents outside its preflight and utilities.
- Covered schema, registry, and preview lookup behavior with 32 unit tests; Chromium tests cover the populated catalog listing, the published-design detail with its isolated preview, and unknown-design / unknown-preview 404 behavior, including document-style isolation.
- Published the first production-ready design entry, `kanban-glassmorphism`, so the catalog is no longer empty.
- Impeccable critique: the restrained hierarchy keeps attention on future previews and the publication message makes the empty state candid rather than promotional.
- Impeccable audit: semantic landmarks, visible focus, AA-oriented tokens, and bounded line lengths cover the shell; Chromium checks at 375px and 1280px found no horizontal overflow and preserved skip-link focus.
- Impeccable polish: removed starter UI and demo routes, used dividers instead of cards, and retained system type, a single cool accent, and concise product copy.
- Published `kanban-glassmorphism`, the first of the ten planned Kanban styles: a frosted translucent board over a soft low-chroma mist wash with backdrop blur, cool-gray hairlines, and a calm dusty-slate accent, authored production-ready. Its `fixtures.ts` **locks the shared Kanban content baseline** (4 columns: Backlog, In Progress, In Review [empty, for the empty state], Done; 9 cards; 5 members) that later styles re-skin. The self-contained `DESIGN.md` meets the product-vision handoff bar (color/typography/spacing/layout/responsive/motion/a11y, extension rules to new pages, do/don't, when-to-use/avoid/trade-offs, declared deps/assets/licenses, and an AI acceptance checklist). Cleared impeccable critique/audit/polish plus independent `pi.frontend-reviewer`/`pi.qa` passes; WCAG 2.2 AA verified by real-pixel contrast audit across every text role.

## Next

- Build the remaining nine Kanban styles defined in `docs/catalog-roadmap.md`, one entry at a time through the documented publication workflow. Each copies the locked baseline from `src/lib/designs/published/kanban-glassmorphism/fixtures.ts` and re-skins only the visuals.
- Build `kanban-flat-material` next as the cleanest reference style, re-skinning the locked baseline.

## Decisions

- Catalog entries are repository files discovered at build time; no database, CMS, or generated registry.
- Public entries live under `src/lib/designs/published/`; unpublished authoring work lives under `src/lib/designs/workbench/` and is never imported by runtime code.
- Root `DESIGN.md` governs the factory UI; each entry's `DESIGN.md` is an independent portable handoff.
- Preview documents render in a separate route group without factory CSS so entry-owned styles remain isolated.
- Iframe sandboxing is deferred while previews are trusted repository content; require it before accepting untrusted or community-authored previews.
- Detail-page happy-path browser coverage is deferred until the first real published design provides a stable subject.
- Catalog direction is set in `docs/catalog-roadmap.md`: one page type (Kanban board) rendered in ten distinct visual styles (flat, glass, neumorphism, claymorphism, illustration, editorial, Swiss, brutalism, dark-neon, skeuomorphic), built one at a time. Style comparison on a fixed subject is the primary value.
- `kanban-glassmorphism` is the first published entry (dispatch priority) and therefore **locks the shared Kanban content baseline**: its `fixtures.ts` is canonical. Later styles copy it and change only the visual language. (Earlier advisory build order had `kanban-flat-material` locking the baseline; superseded by publication order.)

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
