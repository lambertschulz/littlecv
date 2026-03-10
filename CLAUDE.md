# Bewerbungsmappe (littlecv)

## Project Overview
Local, browser-based CV/cover letter/cover page builder. No backend, no auth. Hosted on GitHub Pages.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no config files needed)
- Jotai (state management, `atomWithStorage` for localStorage persistence)
- `@react-pdf/renderer` (PDF generation)

## Key Decisions
- **Fonts:** Bundled TTF files (Inter, Roboto, Playfair Display) + runtime Google Fonts registration by URL
- **Thumbnails:** SVG files representing template layouts (not PNG)
- **Templates:** Registry pattern with `themeSchema` for dynamic theme editor controls
- **Deployment:** GitHub Actions with `actions/deploy-pages` (not gh-pages npm package)
- **No router:** View state managed via Jotai atoms
- **Base path:** `/littlecv/` (for GitHub Pages)

## Implementation Plan
See `docs/superpowers/plans/2026-03-10-bewerbungsbuilder.md` for the full plan (22 tasks, 7 chunks).

## Architecture
- `src/types/cv.ts` — Core data interfaces (CvData, ExportScope, etc.)
- `src/state/atoms.ts` — All Jotai atoms
- `src/templates/` — Template registry + per-template components (Modern, Classic)
- `src/components/` — UI: Toolbar, SplitPane, Preview, editor sections, theme editor
- `src/fonts/` — Font registration + bundled TTF files
- `src/services/` — PDF export, JSON export/import
