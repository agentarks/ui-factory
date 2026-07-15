# Design Entry Contract

This is the canonical contract for catalog entry files, metadata, validation, and public visibility.

## Folder and files

Every entry uses the same file shape in one of two locations:

- `src/lib/designs/workbench/<slug>/` for unpublished authoring work
- `src/lib/designs/published/<slug>/` for public, production-ready entries

```text
workbench/ or published/
└── <slug>/
    ├── metadata.json  required
    ├── DESIGN.md      required
    ├── Preview.svelte required
    ├── fixtures.ts    optional
    └── assets/        optional
```

The folder name must equal `metadata.slug`. Published slugs must be unique. Missing required files, folder-slug mismatches, duplicate published slugs, and non-production statuses under `published/` fail catalog validation.

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

| Status             | Required location | Public behavior                                     |
| ------------------ | ----------------- | --------------------------------------------------- |
| `draft`            | `workbench/`      | Never imported by runtime catalog or client code    |
| `reviewed`         | `workbench/`      | Never imported by runtime catalog or client code    |
| `production-ready` | `published/`      | Visible and eligible for unqualified handoff export |
| `deprecated`       | `workbench/`      | Never imported by runtime catalog or public lookup  |

The directory is the publication boundary, not a runtime status filter. Server registry queries and the client preview index glob only `published/`. Every entry there must be `production-ready`; any other status fails the production build. A workbench or unknown slug resolves as a public 404.
