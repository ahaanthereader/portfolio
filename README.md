# Ahaan's World 🌍📖

A single-file static portfolio for Ahaan — reader, geography buff, library regular,
and the kid on the highest swing in the park.

## Tech
- **Static pages, no build step, no npm dependencies.** One HTML page per corner of the site (`index.html`, `reading.html`, `kindle.html`, `geography.html`, `quiz.html`, `doors.html`, `bells.html`, `swing.html`, `library.html`, `story.html`, `music.html`, `movies.html`, `games.html`, `calendar.html`, `rewards.html`, `journey.html`).
- **Shared files in `assets/`:** `site.css` (all styles), `shared.js` (data, badges, nav), one script per page, plus `audio.js` (soft sound with a volume ceiling and limiter), `brush-wc.js` (optional p5.brush watercolor, lazy-loaded), `ahaan3d.js` (3D Ahaan, Three.js lazy-loaded) and `candy.js` (home page "pick a sweet").
- **Fonts:** Fraunces (headings) + Fredoka (body) via Google Fonts.
- **Sensory-friendly by design:** see `docs/sensory-friendly-spec.md`. Nothing plays sound or moves unless Ahaan starts it.
- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`), auto-deploys on push to `main`.

## Pages
Home (watercolor park, 3D Ahaan, pick a sweet to open a page) → Reading → Kindle → Geography → Quiz → Doors of the World → Bells of the World → The Swing → Library → Story Studio → Music → Movies → Games → Calendar → Rewards → Journey.

## Editing content
Most content lives in clearly-labeled JS arrays in `assets/shared.js`:
`BOOKS`, `FACTS`, `QUIZ`, `CHECKOUTS`, `LIB_STATS`, `TIMELINE`. Country cards are in `assets/doors.js`, bells in `assets/bells.js`.
Only use **real** data (no invented stats). Add photos under `images/`.

## Local preview
```bash
python3 -m http.server 4321 --directory .
# open http://localhost:4321/
```

## Deploy
Push to `main`. GitHub Pages must have its source set to **GitHub Actions**
(repo owner / admin does this once under Settings → Pages).
