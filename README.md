# Ahaan's World 🌍📖

A single-file static portfolio for Ahaan — reader, geography buff, library regular,
and the kid on the highest swing in the park.

## Tech
- **One file:** `index.html` — all HTML, CSS, and JS inline. No framework, no build step, no dependencies.
- **Fonts:** Fraunces (headings) + Nunito (body) via Google Fonts.
- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`), auto-deploys on push to `main`.

## Sections
Hero → Reading Nook (books + lightbox) → Geography (clickable world map + capitals quiz) →
The Swing (click-to-push tire swing) → Library (library-card + stats) → Journey (timeline) → Footer.

## Editing content
All placeholder content lives in clearly-labeled JS arrays near the bottom of `index.html`:
`BOOKS`, `FACTS`, `QUIZ`, `CHECKOUTS`, `LIB_STATS`, `TIMELINE`, plus `#currentBook`.
Swap in Ahaan's real books, facts, and milestones — and only use **real** data
(no invented stats). Add photos under `images/`.

## Local preview
```bash
python3 -m http.server 4321 --directory .
# open http://localhost:4321/index.html
```

## Deploy
Push to `main`. GitHub Pages must have its source set to **GitHub Actions**
(repo owner / admin does this once under Settings → Pages).
