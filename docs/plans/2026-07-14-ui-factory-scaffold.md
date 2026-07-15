# UI Factory Scaffold Implementation Plan

> **For agentic workers:** Execute this plan task by task. Use a fresh implementation worker and independent review for each task.

**Goal:** Build a maintainable SvelteKit foundation for a file-backed UI design catalog without adding sample designs.

**Architecture:** SvelteKit discovers future design folders with Vite glob imports. A pure catalog constructor validates path-keyed modules with Zod, which keeps catalog logic testable without a database or generated registry. Root documentation uses progressive disclosure so new sessions load only `STATUS.md` and task-relevant guidance.

**Tech Stack:** SvelteKit, Svelte 5, TypeScript, Tailwind CSS, Vite, Zod, Vitest, Playwright, ESLint, Prettier, npm

**Spec:** `docs/specs/2026-07-14-ui-factory-scaffold-design.md`

---

## Chunk 1: Tooling and project context

### Task 1: Create the official SvelteKit baseline

**Files:**
- Create or replace: `package.json`, `package-lock.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `playwright.config.ts`
- Create: `src/app.html`, `src/app.d.ts`, `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`
- Modify: `.gitignore`

- [ ] **Step 1: Generate the project with official tooling**

Run:

```bash
npx --yes sv create . \
  --template minimal \
  --types ts \
  --add eslint prettier 'vitest=usages:unit' playwright 'tailwindcss=plugins:none' \
  --install npm \
  --no-dir-check
npm install zod
```

Expected: SvelteKit files and npm lockfile are created without removing the existing product vision, spec, or Git history.

- [ ] **Step 2: Normalize package metadata and scripts**

Set the package name to `ui-factory`. Keep official scripts and ensure these commands exist:

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Do not add alternate package managers or task runners.

- [ ] **Step 3: Verify the generated baseline**

Run:

```bash
npm run check
npm test
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 4: Commit the baseline**

```bash
git add .gitignore package.json package-lock.json svelte.config.js vite.config.ts tsconfig.json eslint.config.js .prettier* playwright.config.ts src static tests

git commit -m "chore: scaffold SvelteKit application"
```

### Task 2: Add concise project and Impeccable context

**Files:**
- Create: `AGENTS.md`
- Create: `STATUS.md`
- Create: `PRODUCT.md`
- Create: `DESIGN.md`
- Replace: `README.md`
- Create: `docs/architecture.md`
- Create: `docs/design-entry-contract.md`
- Create: `docs/adding-a-design.md`

- [ ] **Step 1: Write the context-routing documents**

`AGENTS.md` must contain only:

- Session start order: read `STATUS.md`, then use the task map
- Task-to-document routing table
- Canonical npm commands
- Rules against scanning unrelated design folders or duplicating linked guidance
- Requirement to update `STATUS.md` when state changes
- Definition of done

`STATUS.md` must contain only:

- Current phase and objective
- Completed items
- Next items
- Durable decisions
- Blockers
- Last verified commands

- [ ] **Step 2: Write Impeccable context**

`PRODUCT.md` defines users, purpose, product register, tone, strategic principles, and anti-references for the UI Factory browsing application.

`DESIGN.md` defines the restrained light product surface used to browse designs. It must distinguish the root factory design context from future entry-level exported `DESIGN.md` files.

- [ ] **Step 3: Write focused maintainer documentation**

- `README.md`: setup, commands, document map, and current empty-catalog status
- `docs/architecture.md`: catalog boundaries, build-time discovery, route data flow, and errors
- `docs/design-entry-contract.md`: exact metadata and file contract from the approved spec
- `docs/adding-a-design.md`: minimal future contribution sequence and validation commands

Do not repeat the product vision or schema details across multiple documents. Link to the canonical source instead.

- [ ] **Step 4: Audit documentation**

Verify:

```bash
rg -n '/Users/|TODO|superpowers' AGENTS.md STATUS.md PRODUCT.md DESIGN.md README.md docs/architecture.md docs/design-entry-contract.md docs/adding-a-design.md
```

Expected: no absolute paths, unresolved TODOs, or internal workflow branding.

Confirm manually that a new session can start from `STATUS.md` and route to one relevant document without reading the repository.

- [ ] **Step 5: Commit documentation**

```bash
git add AGENTS.md STATUS.md PRODUCT.md DESIGN.md README.md docs/architecture.md docs/design-entry-contract.md docs/adding-a-design.md

git commit -m "docs: add maintainable project context"
```

---

## Chunk 2: File-backed catalog

### Task 3: Implement metadata validation with TDD

**Files:**
- Create: `src/lib/catalog/schema.ts`
- Create: `src/lib/catalog/schema.test.ts`

- [ ] **Step 1: Write failing schema tests**

Tests must cover:

- Complete version-1 metadata passes
- Invalid kebab-case slug fails
- Invalid semantic version fails
- Empty classification arrays fail
- Unsupported enum values fail

Use one valid metadata object and override only the field under test.

- [ ] **Step 2: Run tests and confirm failure**

```bash
npm test -- src/lib/catalog/schema.test.ts
```

Expected: FAIL because the schema module does not exist.

- [ ] **Step 3: Implement the Zod schema**

Export:

```ts
export const designMetadataSchema = z.object({
  schemaVersion: z.literal(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  pageType: z.enum([
    'dashboard',
    'product-detail',
    'authentication',
    'settings',
    'checkout',
    'data-management',
    'landing-page',
    'app-shell',
    'other'
  ]),
  applicationTypes: z.array(z.string().trim().min(1)).min(1),
  visualStyles: z.array(z.string().trim().min(1)).min(1),
  theme: z.enum(['light', 'dark', 'adaptive']),
  density: z.enum(['compact', 'comfortable', 'spacious']),
  platforms: z.array(z.enum(['web', 'desktop', 'tablet', 'mobile'])).min(1),
  status: z.enum(['draft', 'reviewed', 'production-ready', 'deprecated']),
  tags: z.array(z.string().trim().min(1)).default([])
});

export type DesignMetadata = z.infer<typeof designMetadataSchema>;
```

- [ ] **Step 4: Run the focused tests**

```bash
npm test -- src/lib/catalog/schema.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit the schema**

```bash
git add src/lib/catalog/schema.ts src/lib/catalog/schema.test.ts

git commit -m "feat: validate design metadata"
```

### Task 4: Implement catalog discovery with TDD

**Files:**
- Create: `src/lib/catalog/registry.ts`
- Create: `src/lib/catalog/registry.test.ts`
- Create: `src/lib/catalog/__fixtures__/complete/metadata.json`
- Create: `src/lib/catalog/__fixtures__/complete/DESIGN.md`
- Create: `src/lib/catalog/__fixtures__/complete/Preview.svelte`
- Create: `src/lib/designs/README.md`

- [ ] **Step 1: Write failing registry tests**

Test `createCatalog()` with injected path-keyed metadata, document, and preview maps. Cover:

- Empty module maps produce an empty catalog
- The complete fixture is discovered
- `DESIGN.md` text is returned unchanged
- Public entries include only `production-ready`
- Missing `metadata.json`, `DESIGN.md`, and `Preview.svelte` each throw and name the missing file
- Invalid metadata throws and names both the entry folder and validation problem
- Folder-slug mismatches throw
- Duplicate metadata slugs throw

The fixture must live under `src/lib/catalog/__fixtures__/`, not `src/lib/designs/`, so it never appears in the real catalog.

- [ ] **Step 2: Run tests and confirm failure**

```bash
npm test -- src/lib/catalog/registry.test.ts
```

Expected: FAIL because the registry module does not exist.

- [ ] **Step 3: Implement the minimal registry**

`createCatalog()` should:

1. Build the union of folders found in the three module maps
2. Require `metadata.json`, `DESIGN.md`, and `Preview.svelte`
3. Validate metadata with `designMetadataSchema`
4. Require folder name to equal metadata slug
5. Reject duplicate metadata slugs
6. Preserve raw `DESIGN.md` text
7. Return immutable `all`, `published`, and `getPublished(slug)` queries

Production maps use:

```ts
import.meta.glob('../designs/*/metadata.json', { eager: true, import: 'default' });
import.meta.glob('../designs/*/DESIGN.md', { eager: true, query: '?raw', import: 'default' });
import.meta.glob('../designs/*/Preview.svelte');
```

- [ ] **Step 4: Run focused and full unit tests**

```bash
npm test -- src/lib/catalog/registry.test.ts
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit the registry**

```bash
git add src/lib/catalog src/lib/designs/README.md

git commit -m "feat: discover file-backed designs"
```

---

## Chunk 3: Product shell and route behavior

### Task 5: Build the empty catalog UI

**Files:**
- Modify: `src/app.css`
- Modify: `src/routes/+layout.svelte`
- Create or modify: `src/routes/+page.ts`
- Modify: `src/routes/+page.svelte`
- Create: `src/routes/designs/[slug]/+page.ts`
- Create: `src/routes/designs/[slug]/+page.svelte`

- [ ] **Step 1: Install the browser and write failing route tests**

Run once before the red test:

```bash
npx playwright install chromium
```

Update Playwright tests to assert:

- `/` has the UI Factory product heading
- The empty catalog explains that designs will appear after publication
- No search or filter controls appear while the catalog is empty
- `/designs/missing` returns a 404 response

Run:

```bash
npm run test:e2e
```

Expected: FAIL against the generated starter page.

- [ ] **Step 2: Add route data**

`src/routes/+page.ts` returns serializable published metadata from the registry.

`src/routes/designs/[slug]/+page.ts` returns serializable metadata and exact `DESIGN.md` text for a published entry, or calls SvelteKit `error(404, 'Design not found')`.

Keep preview component loading in the page component through the registry's lazy preview loader rather than serializing a component through route data.

- [ ] **Step 3: Implement the Impeccable-informed shell**

Use root `PRODUCT.md` and `DESIGN.md` as the design context. Build:

- Semantic header and main content
- Restrained light product surface
- Clear catalog title and explanation
- Useful empty state with no fake entries or disabled controls
- Responsive layout and visible keyboard focus

Do not use gradients, glass effects, nested cards, decorative motion, or generic dashboard metrics.

- [ ] **Step 4: Run browser tests**

```bash
npm run test:e2e
```

Expected: PASS.

- [ ] **Step 5: Run Impeccable review**

Review the shell at mobile and desktop widths for hierarchy, accessibility, responsive behavior, empty-state usefulness, and prohibited patterns. Record critique, audit, and polish results in `STATUS.md`.

- [ ] **Step 6: Commit the product shell**

```bash
git add src tests STATUS.md

git commit -m "feat: add empty catalog experience"
```

### Task 6: Final verification and documentation sync

**Files:**
- Modify: `STATUS.md`
- Modify if commands differ: `README.md`, `AGENTS.md`

- [ ] **Step 1: Run the full validation suite**

```bash
npm run check
npm test
npm run test:e2e
npm run build
npm exec prettier -- --check .
npm exec eslint .
```

Expected: all commands exit 0.

- [ ] **Step 2: Verify repository hygiene**

```bash
git diff --check
git status --short
rg -n '/Users/|TODO|superpowers' AGENTS.md STATUS.md PRODUCT.md DESIGN.md README.md docs/architecture.md docs/design-entry-contract.md docs/adding-a-design.md src tests
```

Expected: no whitespace errors, accidental generated output, absolute local paths, unresolved TODOs, or internal workflow branding in maintained project files. Planning records are excluded because they document internal execution history rather than runtime project guidance.

- [ ] **Step 3: Update current status**

Record completed scaffold capabilities, remaining next work, and exact successful validation commands in `STATUS.md`. Do not append a session diary.

- [ ] **Step 4: Commit final synchronization**

```bash
git add STATUS.md README.md AGENTS.md docs

git commit -m "docs: record scaffold status"
```
