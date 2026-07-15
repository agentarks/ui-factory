# Adding a Design

Use this workflow only after the file-backed catalog is implemented. The repository intentionally begins without sample designs.

1. Read the [entry contract](design-entry-contract.md) and confirm the proposed page adds a meaningfully distinct visual direction.
2. Choose a stable unique slug and create `src/lib/designs/workbench/<slug>/`.
3. Add the required metadata, preview, and handoff files. Keep fixtures and assets inside the entry when needed.
4. Build the complete representative page with realistic fixture content, structural responsive behavior, keyboard access, visible focus, reduced-motion support, and relevant interaction states.
5. Author the entry's self-contained `DESIGN.md` alongside the preview. Confirm it can guide an implementation without access to UI Factory.
6. Keep the workbench entry `draft` while building, then move it to `reviewed` for quality review.
7. After it meets the [product quality standard](../ui-factory-product-vision.md#quality-standard), set its status to `production-ready` and move the whole folder to `src/lib/designs/published/<slug>/`.
8. Run the checks below and review the rendered preview at mobile, tablet, and desktop widths before publication.

```sh
npm run format
npm run lint
npm run check
npm test
npm run test:e2e
npm run build
```

A valid entry under `published/` is discovered automatically at build time. The build rejects any published entry that is not `production-ready`. Workbench entries are never imported by runtime catalog or client code. Do not edit a central registry, reuse another entry's visual context, or add unrelated catalog application code.
