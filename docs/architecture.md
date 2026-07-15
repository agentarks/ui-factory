# Architecture

## Purpose

UI Factory is a SvelteKit application backed by versioned files in the repository. This keeps design previews, metadata, fixtures, assets, and their portable handoffs together without a database, CMS, runtime API, generated registry, or repository-wide scan.

The canonical entry shape and metadata schema are defined in the [design entry contract](design-entry-contract.md).

## Boundaries

- `src/lib/designs/<slug>/` owns each independent design and its handoff.
- `src/lib/catalog/schema.ts` validates entry metadata.
- `src/lib/catalog/registry.ts` discovers entries and exposes read-only queries.
- SvelteKit route loaders request public catalog data; routes do not parse entry files directly.
- The factory application may frame a preview but must not impose its tokens or components on the preview.
- Catalog data comes only from validated entries. There is no parallel metadata source.

## Build-time discovery

The registry uses Vite's `import.meta.glob` against the known entry file patterns under `src/lib/designs/`. Discovery is constrained to that directory and does not scan the repository or require a generated index.

For each folder, the registry pairs metadata, handoff text, and preview module; verifies required files; validates metadata; checks folder and slug identity; and rejects duplicate slugs. Optional fixtures and assets remain owned by the entry.

An empty glob result is valid and produces an empty catalog.

## Data flow

```text
entry files
  -> import.meta.glob discovery
  -> schema and structural validation
  -> read-only registry
  -> SvelteKit page loader
  -> catalog or design route
  -> rendered preview and exact DESIGN.md export
```

The catalog loader requests public summaries for browsing. The detail loader resolves a public slug and supplies its validated metadata and published handoff. An isolated preview route resolves the same public slug and lazy-loads its preview module inside the detail page's iframe. Copy and download use the stored `DESIGN.md` text exactly as decoded; the application does not generate or rewrite it.

Because discovery is file-backed and bundled by Vite, adding a valid entry requires a rebuild but no application-code registration.

## Visibility

Public registry queries return only `production-ready` entries. Authoring states are not exposed by public routes, and deprecated entries are excluded from normal discovery. The [entry contract](design-entry-contract.md#status-and-visibility) is the source of truth for status behavior.

## Error behavior

| Condition                        | Result                                                            |
| -------------------------------- | ----------------------------------------------------------------- |
| No entry folders                 | Valid empty catalog                                               |
| Invalid metadata                 | Catalog loading fails with the entry and validation problem named |
| Missing required file            | Catalog loading fails with the entry and missing file named       |
| Folder and metadata slug differ  | Catalog loading fails validation                                  |
| Duplicate slug                   | Catalog loading fails validation                                  |
| Unknown or non-public route slug | SvelteKit 404                                                     |
| Preview module fails to load     | Isolated error with a reload link                                 |
| No qualified handoff             | Copy and download controls are absent                             |

Validation failures are authoring or build errors, not silently skipped entries. This prevents a partially broken catalog from appearing trustworthy.

## Trade-offs

Build-time files keep the first version inspectable, versioned, and deployment-simple. They require a rebuild for publication and are not intended for live collaborative editing. A database, CMS, or API should be considered only if observed authoring or delivery needs outgrow this model.
