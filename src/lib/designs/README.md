# Design entries

- Author unpublished entries under `workbench/<slug>/`.
- Move only `production-ready` entries to `published/<slug>/`.
- Runtime catalog and client code discover only `published/`; a non-production status there fails the build.
- `workbench/publication-boundary-test-only/Preview.svelte` is an intentionally incomplete regression fixture whose sentinel must never enter the public client bundle.

Follow the canonical [design entry contract](../../../docs/design-entry-contract.md).
