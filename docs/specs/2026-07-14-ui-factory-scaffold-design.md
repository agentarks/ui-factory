# UI Factory Scaffold Design

## Goal

Create the smallest maintainable SvelteKit foundation for UI Factory without adding sample designs. The scaffold must support a future browse, preview, and `DESIGN.md` export workflow while keeping new-session context small and task-specific.

## Scope

The scaffold will provide:

- SvelteKit application shell using Svelte 5, TypeScript, Tailwind CSS, Vite, Zod, Vitest, and Playwright
- A file-backed design catalog discovered at build time
- A validated metadata contract for future design entries
- An intentional empty catalog experience
- A detail route that returns 404 for unknown designs
- An isolated iframe preview route that keeps factory styles out of design documents
- Root Impeccable context for designing the UI Factory application
- Progressive-disclosure documentation for agents and maintainers
- Focused unit and browser smoke tests

The scaffold will not include sample designs, authentication, a database, a CMS, an API service, a shared component library, or AI-generated content.

## Architecture

UI Factory will use a file-backed catalog. Future public entries will live under `src/lib/designs/published/<slug>/`; unpublished authoring work will live under `src/lib/designs/workbench/<slug>/`. Both use this file shape:

```text
metadata.json
DESIGN.md
Preview.svelte
fixtures.ts
assets/
```

`src/lib/catalog/schema.ts` will define the Zod metadata schema. Required metadata fields are:

- `schemaVersion`: literal `1`
- `slug`: stable lowercase kebab-case identifier
- `version`: semantic version string
- `title`: human-readable name
- `summary`: concise description
- `pageType`: `dashboard`, `product-detail`, `authentication`, `settings`, `checkout`, `data-management`, `landing-page`, `app-shell`, or `other`
- `applicationTypes`: non-empty string array
- `visualStyles`: non-empty string array
- `theme`: `light`, `dark`, or `adaptive`
- `density`: `compact`, `comfortable`, or `spacious`
- `platforms`: non-empty array containing `web`, `desktop`, `tablet`, or `mobile`
- `status`: `draft`, `reviewed`, `production-ready`, or `deprecated`
- `tags`: optional string array

A design folder must contain `metadata.json`, `DESIGN.md`, and `Preview.svelte`. `fixtures.ts` and `assets/` are optional. The folder name must equal `metadata.slug`; duplicate published slugs and mismatches fail validation. The directory is the publication boundary: only `production-ready` entries may live under `published/`; draft, reviewed, and deprecated work stays under `workbench/` and is never imported by runtime code.

`src/lib/catalog/registry.server.ts` will discover only published entry metadata and handoff files with `import.meta.glob`, validate each entry, reject any non-production published status, and expose read-only catalog queries to server loaders. The `DESIGN.md` content must be returned byte-for-byte except for text decoding; the registry must not generate or rewrite it. `src/lib/catalog/previews.ts` will be client-safe and contain only typed lazy globs for published `Preview.svelte` modules, with no metadata or handoff imports.

The initial registry must work when no design folders exist. The home route will display an intentional empty state. The detail route will look up a slug and return SvelteKit's 404 response when no public entry exists.

Published previews will render inside an iframe backed by `/designs/[slug]/preview`. Factory pages and preview documents will use separate SvelteKit route groups so Tailwind, factory resets, and browsing-shell styles are never loaded into the preview document. The preview route will lazy-load only the selected published `Preview.svelte` module and return 404 for unknown slugs.

No generated registry, database, server process, plugin system, or repository-wide scan is needed.

## Documentation and Session Context

The repository root will contain:

- `AGENTS.md`: short operating guide and task-to-document routing table
- `STATUS.md`: current phase, completed work, next work, decisions, blockers, and verified commands
- `PRODUCT.md`: Impeccable product context for the UI Factory application
- `DESIGN.md`: Impeccable visual rules for the UI Factory application
- `README.md`: human setup and command entry point
- `ui-factory-product-vision.md`: durable product intent

Supporting documentation will contain:

- `docs/architecture.md`: boundaries, data flow, and route behavior
- `docs/design-entry-contract.md`: required files and metadata fields
- `docs/adding-a-design.md`: contribution workflow

Future agents must begin with `STATUS.md`, then use the routing table in `AGENTS.md` to load only the documentation relevant to their task. They should not scan unrelated design folders. `AGENTS.md` must remain a routing-only entry point, and `STATUS.md` must remain a concise current snapshot rather than a project history. Detailed explanations belong in the linked documents.

The root `DESIGN.md` controls the UI Factory application itself. A design entry's `DESIGN.md` is the portable artifact exported to consumers. Documentation will state this distinction explicitly.

## UI Foundation

The initial UI will be an accessible, responsive product surface with:

- Application header and concise product identity
- Catalog heading
- Intentional empty state explaining how designs will appear
- No fake cards, sample content, disabled feature theater, or decorative dashboard metrics

Impeccable will guide the product register, visual context, accessibility, responsive behavior, critique, audit, and polish. Completion requires root `PRODUCT.md` and `DESIGN.md`, an Impeccable-informed review of the implemented shell, and a short record in `STATUS.md` of the critique, audit, polish, and verification results.

## Error Handling

- Invalid metadata will fail catalog loading with a message naming the entry and validation problem
- Unknown design slugs will return 404
- An empty catalog is valid product state, not an error
- Copy and download behavior will only appear when a real `DESIGN.md` exists

## Validation

The scaffold will provide npm scripts for:

- `npm run check`
- `npm test`
- `npm run test:e2e`
- `npm run build`

Focused checks will prove:

- Valid metadata passes schema validation
- Invalid metadata fails with useful errors
- The empty registry returns no entries
- A test-only complete entry is discovered without becoming a catalog sample
- Missing `metadata.json`, `DESIGN.md`, or `Preview.svelte` fails entry validation
- Folder-slug mismatches and duplicate slugs fail validation
- The curated test fixture's `DESIGN.md` is returned unchanged
- Published-directory validation rejects non-production statuses
- Runtime globs do not import workbench metadata, handoffs, or previews
- The catalog page renders its empty state without search or filter controls
- Unknown detail and preview routes return 404
- Tailwind applies to factory pages without leaking into isolated preview documents

Documentation review will confirm that `AGENTS.md` routes tasks without duplicating linked guidance and that `STATUS.md` contains current state rather than historical narrative.

## Proposed Structure

```text
ui-factory/
├── AGENTS.md
├── STATUS.md
├── PRODUCT.md
├── DESIGN.md
├── README.md
├── ui-factory-product-vision.md
├── docs/
│   ├── architecture.md
│   ├── design-entry-contract.md
│   ├── adding-a-design.md
│   └── specs/
├── src/
│   ├── app.css
│   ├── lib/
│   │   ├── catalog/
│   │   │   ├── schema.ts
│   │   │   ├── registry.server.ts
│   │   │   ├── registry.test.ts
│   │   │   └── previews.ts
│   │   └── designs/
│   │       ├── published/
│   │       ├── workbench/
│   │       └── README.md
│   └── routes/
│       ├── +layout.svelte
│       ├── (factory)/
│       │   ├── +layout.svelte
│       │   ├── +page.server.ts
│       │   ├── +page.svelte
│       │   └── designs/[slug]/
│       │       ├── +page.server.ts
│       │       └── +page.svelte
│       └── (preview)/designs/[slug]/preview/
│           ├── +page.server.ts
│           └── +page.svelte
├── tests/
│   └── catalog.e2e.ts
└── standard SvelteKit configuration
```

Empty directories will not be committed unless they contain an explanatory file or are required by tooling.
