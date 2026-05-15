# Makeberry Affiliates

Marketing landing site for Makeberry Affiliates.

**Stack:** Vue 3, TypeScript, Vite, SCSS

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

Production output is written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Content (JSON)

Page copy and configuration live under `src/data/en/`:

- `pages/home.json` — home page sections
- `pages/affiliates/` — audience landing pages (`affiliates.json`, `advertisers.json`)
- `pages/casinos/` — casino landing pages (one file per slug)
- `pages/blog/` — blog index and articles (`articles/*.json`, `articles/order.json`)
- `shared/` — nav, footer, and UI strings (`nav.json`, `footer.json`, `ui.json`)

Types for JSON shapes are in `src/types/content.ts`. `src/composables/useContent.ts` loads and validates content at build time.

**Editing JSON safely**

- Keep valid JSON syntax (trailing commas are not allowed).
- Match existing field names and structure; see `src/types/content.ts` for expected shapes.
- Blog articles: add a new `articles/<slug>.json` and register the slug in `articles/order.json` (no duplicates).
- After edits, run `npm run build` — TypeScript and content invariants fail the build in dev if data is invalid.

## Scripts

### `scripts/inject-country-ids.mjs`

One-off utility for the interactive world map on the home page. It reads `public/images/home/map/world-map.svg` (exported from Figma without `id` attributes) and `scripts/figma-map-metadata.txt`, then writes ISO country `id` attributes onto each `<path>` in the SVG.

Run only when replacing the map SVG from Figma:

```bash
node scripts/inject-country-ids.mjs
```

The script overwrites `public/images/home/map/world-map.svg` in place and keeps a backup at `scripts/_backup/world-map.original.svg`.
