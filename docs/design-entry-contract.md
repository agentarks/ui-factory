# Design Entry Contract

This is the canonical contract for catalog entry files, metadata, validation, and public visibility.

## Folder and files

Each entry lives at `src/lib/designs/<slug>/`.

```text
<slug>/
├── metadata.json  required
├── DESIGN.md      required
├── Preview.svelte required
├── fixtures.ts    optional
└── assets/        optional
```

The folder name must equal `metadata.slug`. Slugs must be unique across all entries. Missing required files, folder-slug mismatches, and duplicate slugs fail catalog validation.

`Preview.svelte` is the working single-page specimen. Entry-owned fixtures and assets must not depend on another design folder.

`DESIGN.md` is a curated, self-contained handoff for consumers. The registry returns its contents byte-for-byte except for text decoding; it does not generate, normalize, or rewrite the file. The expected handoff coverage and quality bar are defined in the [product vision](../ui-factory-product-vision.md#the-designmd-handoff).

## Metadata schema

`metadata.json` must contain:

| Field              | Contract                                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion`    | Literal number `1`                                                                                                                      |
| `slug`             | String matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`                                                                                            |
| `version`          | String matching `^\d+\.\d+\.\d+$`                                                                                                       |
| `title`            | Non-empty trimmed string                                                                                                                |
| `summary`          | Non-empty trimmed string                                                                                                                |
| `pageType`         | One of `dashboard`, `product-detail`, `authentication`, `settings`, `checkout`, `data-management`, `landing-page`, `app-shell`, `other` |
| `applicationTypes` | Non-empty array of non-empty trimmed strings                                                                                            |
| `visualStyles`     | Non-empty array of non-empty trimmed strings                                                                                            |
| `theme`            | One of `light`, `dark`, `adaptive`                                                                                                      |
| `density`          | One of `compact`, `comfortable`, `spacious`                                                                                             |
| `platforms`        | Non-empty array whose values are `web`, `desktop`, `tablet`, or `mobile`                                                                |
| `status`           | One of `draft`, `reviewed`, `production-ready`, `deprecated`                                                                            |
| `tags`             | Optional array of non-empty trimmed strings; defaults to an empty array when omitted                                                    |

The schema is implemented in `src/lib/catalog/schema.ts`. Change this document and the schema together when the contract changes.

## Status and visibility

| Status             | Public catalog and detail                               | Authoring use                              |
| ------------------ | ------------------------------------------------------- | ------------------------------------------ |
| `draft`            | Hidden                                                  | In progress                                |
| `reviewed`         | Hidden                                                  | Available for review                       |
| `production-ready` | Visible and eligible for unqualified `DESIGN.md` export | Published                                  |
| `deprecated`       | Excluded from normal discovery and public lookup        | Retained only for maintenance or reference |

Public queries expose only `production-ready` entries. A hidden or unknown slug therefore resolves as a public 404.
