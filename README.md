# UI Factory

A browsable catalog for evaluating polished single-page designs and exporting a curated `DESIGN.md` as implementation guidance. See the [product vision](ui-factory-product-vision.md) for the durable product model.

## Setup

**Prerequisites:** Node.js and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

## Commands

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start the development server     |
| `npm run format`   | Format the repository            |
| `npm run lint`     | Check formatting and lint rules  |
| `npm run check`    | Run Svelte and TypeScript checks |
| `npm test`         | Run unit tests once              |
| `npm run test:e2e` | Run browser tests                |
| `npm run build`    | Build for production             |
| `npm run preview`  | Preview the production build     |

## Documentation

| Document                                                                      | Purpose                                               |
| ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| [STATUS.md](STATUS.md)                                                        | Current phase, next work, blockers, and verification  |
| [AGENTS.md](AGENTS.md)                                                        | Task-based context routing and completion rules       |
| [PRODUCT.md](PRODUCT.md)                                                      | Product-register context for the browsing application |
| [DESIGN.md](DESIGN.md)                                                        | Visual rules for the browsing application             |
| [Product vision](ui-factory-product-vision.md)                                | Durable product intent and scope                      |
| [Architecture](docs/architecture.md)                                          | File-backed catalog boundaries and data flow          |
| [Design entry contract](docs/design-entry-contract.md)                        | Canonical entry files, schema, and visibility rules   |
| [Adding a design](docs/adding-a-design.md)                                    | Minimal contribution workflow                         |
| [Approved scaffold spec](docs/specs/2026-07-14-ui-factory-scaffold-design.md) | Scaffold decisions and acceptance scope               |
