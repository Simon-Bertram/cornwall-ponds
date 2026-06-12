# sanity-cms-config

Portable Sanity Studio schema definitions for the Cornwall Ponds marketing site. These files mirror the shapes in `apps/web/src/lib/` and are **not** imported by the Astro app.

Copy this folder into a separate Sanity Studio repo when you are ready to manage content in Sanity.

## Setup

### 1. Create a Studio repo

```bash
npm create sanity@latest
```

Choose TypeScript and a clean project template.

### 2. Copy schema files

Copy into your Studio repo:

- `schemaTypes/` → `schemaTypes/` (merge or replace the default schemas)
- `structure.ts` → project root (or `src/structure.ts`)

### 3. Wire `sanity.config.ts`

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  // projectId, dataset, etc.
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
})
```

### 4. Create project and dataset

1. Create a Sanity project and a `production` dataset in [sanity.io/manage](https://www.sanity.io/manage).
2. Add CORS origins for your Studio URL and Astro dev URL (e.g. `http://localhost:4321`).

### 5. Verify

```bash
npm run dev
```

Studio should load without schema errors. Page singletons appear under **Pages**; repeatable content under **Content**.

## Content model

| Type | Role |
|------|------|
| `siteSettings` | Global business facts, footer, global CTA |
| `homePage`, `servicesPage`, … | Page singletons (fixed document IDs) |
| `legalPage` | Privacy / terms (`legalPage-privacy`, `legalPage-terms`) |
| `service`, `project`, `testimonial`, `heroSlide` | Repeatable entities |

References:

- `homePage.hero.slides` → `heroSlide`
- `project.service` → `service`
- `testimonial.project` → `project`
- `servicesPage.pricingRows[].service` → `service`

## Astro integration (later)

The Astro app reads content via `apps/web/src/lib/content.ts`. When Sanity is wired, replace static imports there with GROQ queries against the same document shapes defined here.

Out of scope for this folder:

- `seed.ndjson` generation
- `@sanity/client` / env vars in the monorepo
- Image asset upload scripts
