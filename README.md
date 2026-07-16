# Glyph Studio

A React browser and customization studio for the 300,000+ open-source icons available through Iconify.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Features

- Search all Iconify icons and browse individual collections
- Browse a cleaned, merged taxonomy generated from all source categories across 230 local Iconify JSON sets
- Combine category and icon-set filters to narrow exact icon-level matches
- Inspect collection, license, palette, and dimension metadata
- Customize icon size, color, rotation, and horizontal/vertical flips
- Copy React, SVG, CSS mask, or JSON code
- Download customized SVG files
- Save favorites locally in the browser
- Light/dark theme and responsive mobile layout

This is a client-side app and uses the public `https://api.iconify.design` endpoints. No API key or backend is required. Icon licenses vary by collection; the editor displays the collection's license metadata when Iconify provides it.

To rebuild the compact category index after changing files in `public/icon-json-data`, run `npm run build:categories`. The production build intentionally excludes the 450 MB source archive and ships only `category-index.json`.
