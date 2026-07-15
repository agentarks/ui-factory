# Architecture

## Purpose

UI Factory is a SvelteKit application backed by versioned files in the repository. This keeps design previews, metadata, fixtures, assets, and their portable handoffs together without a database, CMS, runtime API, generated registry, or repository-wide scan.

The canonical entry shape and metadata schema are defined in the [design entry contract](design-entry-contract.md).

## Boundaries

- `src/lib/designs/published/<slug>/` owns each public design and its handoff.
- `src/lib/designs/workbench/<slug>/` holds unpublished authoring work outside the runtime catalog boundary.
- `src/lib/catalog/schema.ts` validates entry metadata.
- `src/lib/catalog/registry.server.ts` discovers published entries and exposes read-only server queries.
- `src/lib/catalog/previews.ts` is the client-safe preview index; it contains only typed lazy preview globs.
- SvelteKit server route loaders request public catalog data; routes do not parse entry files directly.
- The factory application may frame a preview but must not impose its tokens or components on the preview.
- Catalog data comes only from validated entries. There is no parallel metadata source.

## Build-time discovery

The server registry uses Vite's `import.meta.glob` only against known entry file patterns under `src/lib/designs/published/`. It eagerly loads published metadata and handoff text on the server, verifies each required preview path, validates metadata, checks folder and slug identity, and rejects duplicate slugs. A published entry whose status is not `production-ready` fails validation. The prerendered home loader evaluates this boundary during every production build, so an invalid publication fails the build.

The client preview index separately uses one typed lazy glob for `src/lib/designs/published/*/Preview.svelte`. It does not import metadata or `DESIGN.md`. Nothing in runtime catalog or client code imports `src/lib/designs/workbench/`.

Optional fixtures and assets remain owned by an entry. An empty published glob result is valid and produces an empty catalog.

## Data flow

```text
published entry files
  -> server-only import.meta.glob discovery
  -> schema, publication, and structural validation
  -> read-only server registry
  -> SvelteKit server page loader
  -> catalog or design route

published Preview.svelte files
  -> client-safe typed lazy glob
  -> isolated preview route
```

The catalog loader requests public summaries for browsing. The detail loader resolves a public slug and supplies its validated metadata and published handoff. An isolated preview server loader validates the same public slug before its client-safe index lazy-loads the preview module inside the detail page's iframe. Copy and download use the stored `DESIGN.md` text exactly as decoded; the application does not generate or rewrite it.

Because discovery is file-backed and bundled by Vite, adding a valid entry requires a rebuild but no application-code registration.

## Visibility

Public registry queries can discover only entries under `published/`, and every discovered entry must be `production-ready`. Draft, reviewed, and deprecated work belongs under `workbench/`, which runtime code never imports. The [entry contract](design-entry-contract.md#status-and-visibility) is the source of truth for status behavior.

## Error behavior

| Condition                                | Result                                                            |
| ---------------------------------------- | ----------------------------------------------------------------- |
| No entry folders                         | Valid empty catalog                                               |
| Invalid metadata                         | Catalog loading fails with the entry and validation problem named |
| Missing required file                    | Catalog loading fails with the entry and missing file named       |
| Folder and metadata slug differ          | Catalog loading fails validation                                  |
| Duplicate slug                           | Catalog loading fails validation                                  |
| Non-production status under `published/` | Production build and catalog loading fail                         |
| Unknown or unpublished route slug        | SvelteKit 404                                                     |
| Preview module fails to load             | Isolated error with a reload link                                 |
| No qualified handoff                     | Copy and download controls are absent                             |

Validation failures are authoring or build errors, not silently skipped entries. This prevents a partially broken catalog from appearing trustworthy.

## Trade-offs

Build-time files keep the first version inspectable, versioned, and deployment-simple. They require a rebuild for publication and are not intended for live collaborative editing. A database, CMS, or API should be considered only if observed authoring or delivery needs outgrow this model.
