# HANDOFF — Ahaan's Portfolio

## Lazy river bridge verification — Nov 10, 2026

### Trampoline browser retry

- Fresh Chrome completed a 20-second sample with no JavaScript errors.
- Apex: rig y=6.648 m at x=−4.3, z=0.2. Screenshot: `/tmp/ahaan-lazy-river/trampoline-apex.png`.
- Landing: rig y=5.387 m at x=−4.3, z=0.2. Screenshot: `/tmp/ahaan-lazy-river/trampoline-landing.png`.
- The mat base is at rig base + 0.54 m. The observed landing is within the bounce cycle near the mat.
- Side-step exit and sustained repeated-bounce behavior were not verified.

- The source measurements report a 2.1 m underside and 0.22–0.36 m head overlap.
- The new shared profile sets a 2.84 m baseline underside and a 0.46 m arch.
- The two Mississippi spans use the segmented bridge mesh.
- The four lazy river spans now use `bridgeDeckHeight()` for deck segment heights.
- `groundHeightAt()` raises Ahaan during walking on each radial bridge span.
- Browser load passed with no JavaScript errors.
- Four over-crossing screenshots were saved under `/tmp/ahaan-lazy-river/over-*.png`.
- Floating-under screenshots were not captured. The browser run did not exercise the float path.
- Follow-up float check entered the lazy river and saved `under-1.png` through `under-4.png`.
- The four captures show different points on the loop, not one view at each bridge.
- Therefore the images do not prove head clearance under all four bridges.
- Observed head clearance remains unconfirmed. The float rig reported local head position y=1.48 m and tube center y≈0.22–0.26 m.
- Correction: the prior check compared world-space head height with bridge-local underside height. Those values used different coordinate spaces.
- At a plain float spot, rig world y was 4.971 m and seated head top was 5.503 m.
- At the four bridge centres, rig world y was 4.971 m and seated head top was 5.723 m.
- The additional 0.22 m came from placing the tube centre at local y=0.22 m during the check.
- The bridge underside is 3.245 m above its map origin. Add the map group's world y before comparing it with the head.
- Correct gap formula: `(mapGroup world y + 3.245 m) - measured head top`. The map group's world y was not captured in this run.
- Float clearance remains unconfirmed. The prior negative gaps are invalid and must not guide a clearance change.
- Follow-up browser check read the active scene graph after starting the float activity.
- The bridge map group's world y is 0.000 m. The tube's world y is 0.222 m.
- Recomputed the seated head box after updating world matrices: head top is 2.616 m.
- At bridge centre, underside is 3.245 m. Final measured gap is 0.629 m.
- The old 5.503 m baseline came from a stale matrix after direct object repositioning. It is invalid.
- Float clearance passes at the tested centre pose by 0.629 m. Four separate bridge-centre head-box checks remain recommended.
- Trampoline, signboard, texture pass, and full sensory checks remain unverified.
- `node --check assets/park3d.js` and `git diff --check` passed.

Written by Goku (Muse) on Nov 9, 2026, after the Antigravity session on this
project stopped mid-work (budget expired). Purpose: any coding agent (Codex,
Claude Code) can pick the work up cold from this file.

## Read first

- `AGENTS.md` in this folder holds the project rules. Follow them.
- Two rules matter most:
  - Use Simplified Technical English (ASD-STE100) for all text, comments,
    commit messages, and replies. Short sentences. One fact per sentence.
  - The reader is Ahaan, a child. Follow the sensory-friendly spec in
    `docs/sensory-friendly-spec.md`: no sound until the user asks for sound,
    controls to stop motion, readable contrast, visible focus rings.
- The site is static. It has many pages and no build step.

## State found on Nov 9, 2026 (verified from the files, not from chat history)

- `index.html` was edited today at 10:53 AM CST.
- `assets/site.css` (about 110 KB) and `assets/ahaan-model.js` (about 34 KB)
  were edited today at 10:53 AM CST.
- `assets/park3d.js` (about 153 KB, a Three.js park scene) was created or
  recreated today at 11:06 AM CST. The session stopped soon after.
- `assets/three.min.js` and `assets/candy.js` are older (Oct 19) and were not
  touched today.
- The work focus today was the home page and the 3D park and model code.
  The end state is NOT verified. No test was recorded after the last edit.

## First tasks for the receiving agent

1. Report the current state against this handoff before you change code.
2. Open `index.html` in a browser. Verify that the page loads with no errors.
3. Verify that the 3D park scene runs: `park3d.js`, `ahaan-model.js`, and
   `three.min.js` must load in the correct order.
4. Fix broken wiring only. Do not redesign the page.
5. Check the sensory rules after any fix: no auto-play sound, motion control
   present, focus rings visible.
6. Report what you saw and what you fixed. Use short sentences.

## Warning

- The original warning was incorrect. Git history already exists.
- Do not run `git init`. The verified baseline is `dd564b2e2677ab6ddd580ddcc84a95516f61b318`.

## Worker update for Goku (Muse) — Nov 9, 2026

### State before changes

- Codex read HANDOFF.md, AGENTS.md, and the sensory specification.
- Codex reported the state before code changes.
- The main branch had no tracked changes. HANDOFF.md was untracked.
- The file sizes and edit times matched the original handoff.
- The existing `lazy-river-water-features` worktree remained unchanged.
- The worker used branch `handoff-verification` in `.worktrees/handoff-verification`.

### Verified

- Chrome loaded index.html through a local HTTP server.
- The model script loaded before the park script.
- The park script loaded local three.min.js before scene initialization.
- The 3D canvas rendered at 1440 × 900 pixels.
- No JavaScript errors or failed resources appeared in the desktop check.
- Chrome reported GPU warnings during software rendering.
- Desktop and 390 × 844 mobile screenshots showed the park and controls.
- Breeze off stopped idle park frames after user movement settled.
- Breeze on resumed ambient motion.
- Keyboard Space activated the focused Breeze button.
- The Breeze button showed a dark, 3 px focus outline.
- The skip link received the first Tab focus.
- Emulated touch activated the Breeze button.
- Reduced motion stopped an active park loop.
- Setting `data-motion="off"` stopped an active park loop.
- No audio context existed before a sound request.
- Selecting Sound on created one audio context. Sound off remained available.
- Saved Breeze off restored on a fresh page.
- ArrowRight still moved Ahaan with Breeze off.
- Butterfly positions remained correct with saved Breeze off.
- `node --check assets/park3d.js` passed.
- `git diff --check` passed.

### Fixed

- Connected the existing Breeze state to ambient 3D callbacks and clouds.
- Preserved requested landmark actions while Breeze is off.
- Stopped active loops when reduced motion, page visibility, or motion settings change.
- Connected the existing offscreen pause class to the park loop.
- Prevented park shortcuts from taking keys from focused controls.
- Prevented park shortcuts when the hero is offscreen.
- Removed the automatic greeting wave. Requested greetings can still wave.
- Replaced the light focus outline on the top controls with a dark outline.
- Set butterfly positions before their first animation frame.
- Preserved the page layout and all scene geometry.

### Review and remaining work

- An independent reviewer found blocked landmark actions in the first patch. The worker corrected the callback checks.
- The reviewer found offscreen shortcuts in the first patch. The worker added an offscreen check.
- The reviewer found missing butterfly positions with saved Breeze off. The worker set initial positions and tested them.
- Goku must inspect and merge branch `handoff-verification`. The worker did not merge or publish.
- The root HANDOFF.md contains the same report for the coordinator.
- The full sensory specification remains a separate task. The home page has no full Calm settings panel.
- Existing CSS hides Breeze under reduced motion. The OS preference stops park motion.
- The mobile header and greeting have limited space. The worker did not redesign the layout.
- Touch checks used browser emulation. No physical touch device was tested.
- Audio activation was checked through AudioContext creation. Speaker volume and perceived loudness require a human check.
- Other pages, all playground activities, and the CDN fallback were not fully tested.
- Software rendering cannot establish performance on the child's laptop.

### Local evidence

- Browser checks: `/tmp/check-ahaan-handoff.cjs` and `/tmp/check-ahaan-saved.cjs`.
- Screenshots: `/tmp/ahaan-after.png`, `/tmp/ahaan-mobile.png`, and `/tmp/ahaan-focus.png`.
- The local test address uses port 8765 and the `handoff-verification` worktree.
- Temporary evidence files can disappear after system cleanup.

## Worker update: other pages check — Nov 10, 2026

Branch: `other-pages-check` in `.worktrees/other-pages-check`. The worker made a local commit only. The worker did not merge or publish.

### State before changes

- The branch started at `c8d5446` (home motion controls fix). The tree was clean.
- An earlier pass loaded 16 pages and found no page-level JavaScript errors.
- The earlier pass flagged two items: the Bells "Sound: on" behavior and a sound check on the Music page.

### Method

- Chrome (headless, through Playwright) loaded each page from a local server on port 8766.
- A probe counted each AudioContext and each oscillator start.
- The test clicked the main activity on each page and read the result.
- The test pressed Tab and read the focus outline.
- A second load used reduced motion. The test counted running infinite animations.

### Results per page

| Page | Main activity tested | Result |
|---|---|---|
| bells | Ring a bell from a stamp. Open and close the card. Sound off, then on. Keyboard Enter on a stamp. | Pass |
| calendar | Next month. Today. Put a sticker on a day. | Pass |
| doors | Open a door. Card opens. Chime is off by default. | Pass |
| games | Memory flip. Tic-Tac-Toe move by mouse and by Enter. Catch the Star start and catch. Math Dash start. | Pass |
| geography | Click a country on the map. Fact text appears. | Pass (mouse only) |
| journey | Timeline shows 4 items. | Pass |
| kindle | Pick the Welcome book. The EPUB renders. Next page works. | Pass (needs internet for the EPUB library) |
| library | Switch between the two tabs. | Pass |
| movies | "What should we watch?" changes the result. | Pass |
| music | Calm music start and pause. Piano key plays one note. Echo game starts. | Pass |
| quiz | Answer a question. The next question appears. The score updates. | Pass |
| reading | Click a book. The lightbox opens. Escape closes it. | Pass (mouse only) |
| rewards | 9 badges render. | Pass after fix |
| sketchbook | The embedded sketchbook page loads in the frame. | Pass |
| story | Type page text. Read mode opens. Edit mode returns. | Pass |
| swing | Click the swing. The push level increases. | Pass (mouse only) |

- No page showed a JavaScript error, a console error, or a failed request.
- No page created an AudioContext at load.
- Each page showed a visible focus outline on the second Tab stop.

### Bells "Sound: on" result

- A saved "Sound: on" choice restores on a fresh page. The button shows "Sound: on" and `aria-pressed="true"`.
- No AudioContext exists at load with the saved "on" state. Sound starts only after a tap on a bell or a stamp.
- The project spec (SF-4, SF-27) requires a remembered choice. The worker kept this behavior.
- Sound off mutes the shared master gain at once.
- Failure found: the home "Sound" button wrote volume 60 to the shared sound setting. A volume of 20 on Bells became 60 after one home toggle. This made Bells and Doors louder than the chosen level.

### Music page sound result

- No sound plays at load. Calm music, piano, and Echo start only after a tap or a key press.
- Pause stops new calm notes. The calm notes fade out in 0.35 s.
- Open risk: `assets/music.js` uses its own AudioContext. It does not use the shared `AhaanAudio` volume ceiling or limiter.
- Open risk: the piano note peak is about 0.4 of full scale. A shared bell peak is at most 0.036 of full scale.
- Open risk: the home and Bells "Sound" setting does not mute the Music page.
- Open risk: the 5-second music preview (SF-26) does not exist.
- The worker did not change music.js. These items are spec work, not broken wiring. They need a parent ear check. Sound level is the top sensory priority.

### Fixed

- `assets/park3d.js`: the home Sound button now keeps the saved volume. The home page applies the saved volume. A first-time visitor still gets volume 60.
- `assets/site.css`: the medal bob, the medal shine, and the playing music button pulse stop under reduced motion and under `data-motion="off"`.

### Verified after the fixes

- Bells volume 20 stays 20 after the home Sound button goes off and on.
- A fresh home page creates no AudioContext at load. Sound on plays one soft note and saves volume 60.
- Rewards has 0 running infinite animations with reduced motion. Rewards has 2 without reduced motion.
- Music has 0 running infinite animations with reduced motion while music plays.
- The home page shows no JavaScript errors with or without reduced motion.
- `node --check assets/park3d.js` passed.
- A full second pass over all 16 pages passed with no errors.

### Failed checks not fixed (no redesign allowed)

- Keyboard: a keyboard cannot reach these click targets: calendar days, geography map countries (175), movie cards, reading books, and the swing. Each target is a `div` or SVG shape with no `tabindex`.
- Keyboard: music piano keys are `div` elements. The A to K letter keys play them, so the piano works from a keyboard.
- Motion: only the home page has a motion control. The other pages depend on the OS reduced-motion setting. The full Calm panel (SF-1 to SF-3) remains a separate task.
- Motion: the swing sways in the default mode. The spec (D4) allows this motion.
- Reading: the shelf arrows hide when all books fit. This behavior is correct at 1280 px and at 600 px.

### Content notes for Nishant

- The sketchbook frame shows the name "Meng To" and social links for that person. Nishant must decide if this content belongs on Ahaan's site.
- The library 3D shelf shows covers with video game names (for example "Elden Ring" and "Dark Souls"). Nishant must decide if this content is correct.

### Evidence

- Screenshots: `/tmp/other-pages-final/other-<page>.png` (16 pages).
- Extra screenshots: `/tmp/other-pages-final/bells-sound-on.png` and `/tmp/other-pages-final/other-games-ttt.png`.
- Test scripts: `/tmp/other-pages-final/*.cjs`. The main script is `check.cjs`.
- Temporary evidence files can disappear after system cleanup.

## Worker update: custom domain check (ahaanadhikari.com) — Nov 10, 2026

Result: the worker did not wire the domain. Two steps need access that the worker does not have. The worker made no change on GitHub and no change at Porkbun.

### What exists

- Git remote: `origin` is `https://github.com/ahaanthereader/portfolio.git`.
- The repository is public. The default branch is `main`.
- GitHub Pages is on. The site URL is `https://ahaanthereader.github.io/portfolio/`. The URL returned HTTP 200.
- Pages build type: GitHub Actions (`.github/workflows/pages.yml`). Each push to `main` deploys the whole repository root.
- The last deploy ran on Nov 9, 2026 for commit `dd564b2`. The deploy succeeded.
- Pages custom domain: none (`cname` is null). HTTPS is enforced on the github.io URL.
- The `gh` account on this machine is `Nishant-Adhikari`. The account has push access to the repository. The account does not have admin access.

### DNS state on Nov 10, 2026

- Name servers: Porkbun (`curitiba`, `fortaleza`, `maceio`, `salvador` at `ns.porkbun.com`).
- `ahaanadhikari.com` A records: `207.207.210.23`, `207.207.210.36`, `207.207.210.50`. These are Porkbun parking addresses.
- `www.ahaanadhikari.com` is a CNAME to `uixie.porkbun.com` (Porkbun parking).
- The domain does not point to GitHub yet.

### Why the worker stopped

- A `CNAME` file does not set the domain for an Actions build. GitHub ignores the file for this build type. A merge of a `CNAME` file only triggers a deploy with no domain change.
- The custom domain must be set in the repository Pages settings. That change needs admin access. The worker account has no admin access.
- The DNS records are at Porkbun. The worker has no Porkbun access.
- Order matters. If the domain is set in GitHub before the DNS change, the github.io URL will redirect to the Porkbun parking page. The live site will then be unreachable for visitors.

### Steps to finish the wiring (in this order)

1. At Porkbun, delete the parking records for `ahaanadhikari.com` and `www`.
2. At Porkbun, add four A records for `ahaanadhikari.com`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Optional: add four AAAA records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
4. At Porkbun, add a CNAME record: `www` points to `ahaanthereader.github.io`.
5. Recommended: verify the domain for the `ahaanthereader` GitHub account (Settings, Pages, Add a domain). GitHub gives a TXT record to add at Porkbun. Verification blocks domain takeover.
6. Wait until `dig +short ahaanadhikari.com` shows the four GitHub addresses.
7. Sign in as `ahaanthereader` (the repository admin). Open Settings, Pages, Custom domain. Enter `ahaanadhikari.com`. Save.
8. Alternative to step 7: an admin runs `gh api -X PUT repos/ahaanthereader/portfolio/pages -f cname=ahaanadhikari.com`.
9. Wait for the GitHub certificate. Then select "Enforce HTTPS".
10. Verify that `https://ahaanadhikari.com/` serves the site.

### Notes for the publish step

- No `CNAME` file is necessary for the Actions build.
- All site paths are relative. The move from `/portfolio/` to the domain root will not break links.
- After step 7, `ahaanthereader.github.io/portfolio/` will redirect to `ahaanadhikari.com`.
- A worker with admin access and Porkbun access can do steps 1 to 10. Nishant can also add a Porkbun API key or give the worker admin access.

## Worker update: Ahaan's Country Book — Nov 10, 2026

The worker made a local commit only. The worker did not merge, push or publish.

### Where the work is

- Branch: `feature/country-book`. The worker created the branch from `other-pages-check` at `5f51f15`.
- Worktree: `.worktrees/country-book`.
- Commit: see `git log -1 feature/country-book`. The commit message starts with "feat: add Ahaan's Country Book".

### What changed

- `sketchbook.html`: the Meng To iframe is gone. The page is now "Ahaan's Country Book". The title, the meta description, the icon and the section text are new.
- `assets/country-data.js` (new): one line for each country or place. The header tells Ahaan how to fix a fact.
- `assets/country-book.js` (new): one template draws every page from the data.
- `assets/country-book.css` (new): the book styles.
- `geography.html`: one new link, "Open the Country Book", in the map legend.
- `assets/site.css`: three new lines for that link.
- The nav label on every page is still "Sketchbook". The brief did not allow other page changes.

### Count

- The Geography map has 175 named shapes. The brief said 176, but that count included the page `<title>` tag.
- The book has 176 pages: the 175 map names plus Singapore.
- Data entries: 176. Book pages: 176. Contents entries: 176.
- Each map name is used exactly once. A build check confirmed this.
- 166 entries are countries. 10 entries are places: Falkland Islands, Greenland, Kosovo, New Caledonia, Northern Cyprus, Palestine, Puerto Rico, Somaliland, Taiwan and Western Sahara.
- Each place page says "A place in …" and has one sentence that explains the place.

### The book

- Cover: "Ahaan's Country Book", "176 countries and places", "By Ahaan", and a "See the map" link to geography.html.
- Contents: an A to Z list with the capital and the page number. A search box finds a name or a capital. The search ignores accents, so "cote" finds Côte d'Ivoire. Enter opens the first match.
- Country page order: name, flag stripes and flag emoji, capital, continent, language, currency, famous place, fun fact.
- Controls: Previous, Contents, Next, and "Page X of 176". The left and right arrow keys turn pages. The arrow keys do not turn pages in the search box or the menu.
- Each page has its own address, for example `sketchbook.html#india`.
- No sound. Nothing moves by itself. A short page slide (0.3 s) plays only when the system allows motion and Motion is not off.

### Verified (Chrome, local server on port 8767)

- No JavaScript error and no console error on desktop (1280 × 800) or mobile (390 × 844).
- No empty field in any of the 176 entries. Each entry has three flag colours.
- Keyboard only: Tab reaches Next after 11 stops. Enter opens Contents. Tab reaches the search box. Typing "singa" and Enter opens Singapore, page 137.
- Focus rings: 3 px solid on the buttons, the search box, the contents names and the page heading after a jump.
- ArrowRight walked all 176 pages in A to Z order from Afghanistan to Zimbabwe. All 176 names were different. Each page had a capital and 5 filled facts in the correct order.
- Reduced motion: 0 animations after a page turn. Motion off: 0 animations. Normal motion: one `cbTurnNext` slide. 0 animations at load.
- The "See the map" link and the "Open the Country Book" link both work.
- Tap on Next works on the mobile size. No horizontal scroll on the mobile size.
- At 1280 × 800 and at 1440 × 900, every country page fits with no inside scroll.

### Screenshots

- Folder: `/tmp/ahaan-country-book/`.
- Desktop: `desktop-cover.png`, `desktop-contents.png`, `desktop-singapore.png`, `desktop-india.png`, `desktop-united-states.png`, `desktop-geography-link.png`.
- Mobile: `mobile-cover.png`, `mobile-contents.png`, `mobile-singapore.png`, `mobile-india.png`, `mobile-united-states.png`.
- Test scripts are in the worker scratchpad. They are temporary.

### Meng To files

- `sketchbook.html` no longer links to `public/landing-pages/meng-to-sketchbook.html`. That page and `landing-pages/meng-to-sketchbook.html` are now unlinked. The worker did not delete them.
- Warning: do NOT delete the folder `public/landing-pages/meng-to-sketchbook/`. The site still uses images from that folder:
  - `assets/site.css` uses `bg-wash.jpg` as the background of every inner page (3 places).
  - `index.html` uses `botany-left.png` and `botany-right.png`.
- If Nishant wants to remove all Meng To material, first move those three images to `assets/` and update the paths.

### Facts for Ahaan to check

Capitals that have a special case:
- Indonesia: Jakarta. Indonesia is building a new capital, Nusantara. The move is not complete.
- Israel: Jerusalem. Many countries keep their embassies in Tel Aviv.
- Palestine: the page says "Seat of government: Ramallah". Palestine names East Jerusalem as its capital.
- Western Sahara: the page says "Largest city: Laayoune". Countries do not agree about a capital.
- Yemen: Sanaa. The recognised government works from Aden.
- Equatorial Guinea: Malabo. A new capital, Ciudad de la Paz, is under construction.
- Entries with two or three capitals: Benin, Bolivia, Burundi, Côte d'Ivoire, Eswatini, Netherlands, South Africa and Sri Lanka.

Languages and money that changed in recent years:
- Bulgaria: Euro (from January 1, 2026).
- Burkina Faso, Mali and Niger: these countries changed the status of French between 2023 and 2025.
- Zimbabwe: Zimbabwe Gold (ZiG) and US dollar.
- Ethiopia: five working languages.
- United States: English. English became the official language by an executive order in 2025.

Continents that books show in different ways:
- Cyprus and Northern Cyprus: the book says Europe. On a map, the island is in Asia.
- Armenia, Azerbaijan and Georgia: the book says Asia. Some books say Europe.
- Russia: Europe and Asia. Turkey: Asia and Europe.

Numbers and "biggest" facts to check in a book:
- Bahamas (about 700 islands), Croatia (more than 1,000), Estonia (more than 2,000), Fiji (more than 300), Japan (more than 14,000), Philippines (more than 7,600), Finland (about 188,000 lakes).
- Ganvié (about 20,000 people), Latvia (forest on about half), Libya (desert on more than 90 percent), Tajikistan (mountains on more than 90 percent), Lesotho (all land above 1,000 m), Uganda (about half of the mountain gorillas).
- Superlatives: Belize reef (second-largest), Colombia (most bird kinds), Lake Malawi (most fish kinds), Marovo Lagoon, New Caledonia Lagoon, Slovakia (most cars for each person), Kuwaiti dinar, Kaieteur Falls, Sudan pyramids, Lake Ohrid, Azerbaijan mud volcanoes.

### Decisions for Nishant

- Kosovo, Palestine and Taiwan are "places" in the book. Each page says that countries do not agree. Nishant can change `kind` to "country" in `assets/country-data.js`.
- Northern Cyprus and Somaliland have no flag emoji. Their pages show 🗺️. The flag stripes still show their colours.
- The flag stripes show three main colours. The stripes are not a drawing of the flag. Some stripes look like another flag (for example, the United States stripes look like the Netherlands flag). The emoji next to the stripes shows the real flag.
- The brief asked for 177 pages. The real number is 176 (see "Count").

## Worker update: publish — Nov 10, 2026

Nishant decided to publish the site. The worker merged and pushed. The worker did not force-push.

### Merge

- The main checkout had untracked files (`HANDOFF.md` and three `FEATURE-BRIEF-*.md` files). The merge brings in a tracked `HANDOFF.md`, so the merge could not run in the main checkout.
- The worker used a clean worktree: `.worktrees/publish-main`, detached at `origin/main` (`dd564b2`).
- Merge commit: `77ed2ed` ("Merge feature/country-book: publish Ahaan's Country Book"). The merge had no conflicts.
- The merge publishes three commits: `c8d5446` (home motion controls), `5f51f15` (saved sound volume and medal motion) and `0fd3edd` (Ahaan's Country Book).
- Push: `dd564b2..77ed2ed` to `origin main`.

### Deploy

- Workflow: "Deploy to GitHub Pages".
- Run: `42773091642` (https://github.com/ahaanthereader/portfolio/actions/runs/42773091642).
- Commit: `77ed2edf729a68021145e8efd8e43c2f0fbf38af`.
- Result: success. The run started at 07:07:25 UTC and ended at 07:07:48 UTC on Nov 10, 2026.

### Live check (Chrome, 1280 × 800)

- `https://ahaanthereader.github.io/portfolio/sketchbook.html`: HTTP 200. The title is "Ahaan's Country Book · Ahaan's World". The cover says "176 countries and places". The page has no iframe and no link to the Meng To page. `COUNTRY_BOOK` has 176 entries. `#india` shows India, New Delhi, "Page 70 of 176".
- `https://ahaanthereader.github.io/portfolio/`: HTTP 200. The 3D park canvas renders. The Sound button shows "Sound: off". No AudioContext exists at load.
- `https://ahaanthereader.github.io/portfolio/geography.html`: HTTP 200. The "📖 Open the Country Book" link exists. A click opens the Country Book cover.
- No JavaScript errors and no console errors on the three pages.
- Screenshots: `/tmp/ahaan-live/live-sketchbook.png`, `/tmp/ahaan-live/live-index.png`, `/tmp/ahaan-live/live-geography.png`.

### Not done (stays for Nishant)

- The custom domain `ahaanadhikari.com` is NOT wired. The domain needs Porkbun DNS changes and a Pages admin. See "custom domain check" above for the steps.

### Local state after the publish

- The local `main` branch in the main checkout is still at `dd564b2`. `origin/main` is ahead.
- Before a `git pull` in the main checkout, move the untracked `HANDOFF.md` aside. The pull brings in a tracked `HANDOFF.md` with the same name, so Git will refuse to overwrite the untracked file.
- Worktree `.worktrees/publish-main` can be removed with `git worktree remove .worktrees/publish-main`.

## Worker update: publish lazy-river bridges — Nov 10, 2026

Nishant approved publishing `feature/lazy-river-bridges`. The worker merged only that branch into the fetched `origin/main` in detached worktree `.worktrees/publish-bridges`.

### Merge

- The merge had no conflicts. Existing handoff records remain in this file.
- Merge commit: `60d0ad7` ("Merge branch 'feature/lazy-river-bridges' into HEAD").
- The merge adds the lazy-river bridge changes in `assets/park3d.js` and the branch handoff record.
- Handoff commit: `9193ee7` ("docs: record lazy-river bridges publish").
- Push: `399e409..9193ee7` to `origin main`.

### Deploy

- Workflow: "Deploy to GitHub Pages".
- Run: `43137412650` (https://github.com/ahaanthereader/portfolio/actions/runs/43137412650).
- Commit: `9193ee7d96cb75e815ee000adcb0dfb6cae7aefc`.
- Result: success.

### Live check

- `https://ahaanthereader.github.io/portfolio/`: HTTP 200.
- `assets/park3d.js`: HTTP 200. The deployed script contains the four lazy-river bridges and bridge deck geometry.
- `node --check` on the fetched script passed.
- Browser console check was not available because Computer Use setup was incomplete. Runtime errors were not verified.

## Signboard and texture audit — Nov 10, 2026

### Sign evidence follow-up

#### Clear-frame retry

- Ahaan moved to the map centre before each screenshot.
- New views: `/tmp/ahaan-lazy-river/sign-entrance-clear.png`, `sign-missouri-clear.png`, and `sign-mississippi-clear.png`.
- Entrance: text fits — No; faces path — No; readable — No. The board is edge-on and partly outside frame.
- Missouri: text fits — Yes; faces path — No; readable — No. A post blocks the text, and bridge parts cover the view.
- Mississippi: text fits — Yes; faces path — No; readable — No. Bridge parts obstruct the board.
- Camera framing still cannot show three clean path views. Stop this audit here.

- Chrome saved `/tmp/ahaan-lazy-river/sign-entrance.png`, `sign-missouri.png`, and `sign-mississippi.png`.
- The camera framing placed Ahaan in front of the boards. The views do not establish path readability or board direction.
- Visible portions show no clear text overflow, but all three text-fit checks remain inconclusive.
- The screenshots show board edges and posts. They do not prove the posts meet the ground.
- Keep the sign audit open. Do not treat these images as passing evidence.

- Six state-direction signs and one lazy-river sign exist.
- State sign labels now shrink to fit the 144 px canvas width.
- Close-view checks for sign direction, readability, flicker, and planted posts remain incomplete.
- Before and after screenshots of three signs were not captured.
- Existing detail includes lilies, lotus flowers, rocks, pebble and sand banks, docks, bridge planks, rails, and posts.
- No water ripples or edge foam were found. No added reeds or beach balls were found.
- No texture pass was made. Motion preference checks for water remain incomplete.

## Country Book v2 — IN PROGRESS (Nov 13, 2026)

- Started branch `feature/country-book-v2` from `origin/main` at `8310cea`.
- Worktree: `.worktrees/country-book-v2`.
- First check: inspect the current 176-entry data and the book renderer.
- The current data has 176 entries. Each entry uses one object line.
- Added optional template rows for Hello, Population (2024), Famous food or another place, and another fun fact.
- Missing optional fields hide their rows.
- The data now has 176 greetings, 171 populations, 163 foods, 12 extra places, and 42 extra facts. Every entry has at least one new field.
- Added rounded 2024 population values to 171 entries.
- Source: World Bank indicator `SP.POP.TOTL`, 2024 values: https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=2024&format=json&per_page=1000
- Indicator notes: https://data.worldbank.org/indicator/SP.POP.TOTL
- Values use two significant figures. Each value starts with “About”.

### Facts for Ahaan to check

- The World Bank query has no separate 2024 match for Falkland Islands, Northern Cyprus, Somaliland, Taiwan, or Western Sahara.
- Their population rows stay hidden until a reliable source and matching territory are checked.
- Western Sahara has no checked population or food/second-place value. Its greeting now uses a checked Hassaniya phrase.

### Book component research

- The React route uses `react-pageflip`. Its README requires React components, JSX, and a build step. This static site has no React or build step.
- The plain JavaScript route uses StPageFlip. Its repository offers a browser bundle and an HTML element API.
- The React route would add React, a build pipeline, JSX, and a rewrite of the current renderer and navigation.
- The StPageFlip prototype loaded the real 176 entries plus cover and contents. It created 178 page nodes at once, so it failed the 176-page requirement.
- Selected the current plain JavaScript pager. It renders one country page on phones and two country pages per wide-screen spread.
- A two-page spread keeps each country address. Search and contents still select a country page. The spread keeps only two country templates in the DOM.
- Sources: https://github.com/Nodlik/react-pageflip · https://github.com/Nodlik/StPageFlip · https://nodlik.github.io/StPageFlip/docs/classes/pageflip.html

### First content pass — greetings

- Added checked greeting fields to all 176 entries.
- Each greeting that uses one language from a multilingual entry names the language.
- The renderer hides the greeting row when no checked phrase exists.
- Moved the greeting and population rows before the food and fact rows.
- Omniglot greeting list: https://www.omniglot.com/language/phrases/hello.htm
- Checked phrase pages: https://www.omniglot.com/language/phrases/albanian.php · https://www.omniglot.com/language/phrases/macedonian.php · https://www.omniglot.com/language/phrases/malay.php · https://www.omniglot.com/language/phrases/kinyarwanda.php · https://www.omniglot.com/language/phrases/vietnamese.php
- Added greetings for Bangladesh, Burundi, Montenegro, Vietnam, and Western Sahara after checking language-specific sources.
- Bangladesh displays both common greetings because greeting choice differs across religious communities: https://www.ciee.org/sites/default/files/documents/hsib-orientation/bangladesh.pdf · https://www.omniglot.com/language/phrases/bengali.php
- Burundi: Amahoro is a Kirundi greeting: https://repository.ub.edu.bi/server/api/core/bitstreams/ffcd52b4-69dc-467d-96d8-045942f1e7ba/content
- Montenegro: Ćao is listed as an informal greeting by the national tourism site: https://www.montenegro.travel/en/plan-your-stay-in-montenegro/useful-tips-and-facts/montenegrin-dictionary
- Vietnam: Xin chào is a common versatile greeting: https://www.vietnamairlines.com/us/en/plan-book/travel/travel-guide/hello-in-vietnamese
- Western Sahara: a Hassaniya phrase list gives “Salam Aleïkum”: https://www.amatlichtours.mr/en/hassaniya-2/ · LangMedia confirms Hassaniya use in the Western Saharan region: https://www.langmedia.fivecolleges.edu/resources/western-sahara/basic-communications/greetings-and-hospitality
- A data load check confirms 176 entries and 176 greetings. No greeting row stays hidden.

### Book look and interaction checks — Nov 17, 2026

- Added a cream page, a subtle texture, a centre fold, page edges, and a soft shadow.
- The existing sketchbook background gives the book a calm desk setting.
- Added a two-page spread at widths above 860 px. Phones show one country page.
- Added touch swipes. A horizontal swipe turns pages. Vertical touch still scrolls.
- The StPageFlip prototype loaded 178 page nodes. It did not meet the requirement to avoid 176 page subtrees.
- Browser checks at 1280x800 found two country pages and no console errors. Search opened India at `#india`. Direct `#mongolia` opened Mongolia.
- Browser checks at 390x844 found one country page, no horizontal overflow, no console errors, and a working touch swipe.
- Button, arrow, and touch checks turned pages at both viewports. Motion off and reduced motion removed the page-turn animation.
- Screenshots: `/tmp/ahaan-country-book-v2/desktop-cover.png`, `/tmp/ahaan-country-book-v2/desktop-india.png`, `/tmp/ahaan-country-book-v2/desktop-contents.png`, `/tmp/ahaan-country-book-v2/mobile-india.png`.

### Next content pass — famous food or another place

- Started source checks for the third data field in the brief.
- Added 163 source-checked foods and 12 second famous places to the data.
- Sources: Afghanistan — Kabuli palaw (https://lets-visit-afghanistan.com/en/food-and-drinks); Albania — tavë kosi (https://albaniatourism.org/albanian-food-and-drink/); Algeria — couscous (https://visitalgeria.dz/en/culture-history/algerian-cuisine); Argentina — asado (https://www.argentina.travel/en/news/el-asado-guia-para-vivir-el-ritual-mas-sabroso); Armenia — khorovats (https://armenia.travel/things-to-do/armenian-cuisine/); Australia — meat pie (https://www.australia.com/en-ca/things-to-do/food-and-drinks/typical-aussie-foods-to-try.html); Austria — Wiener schnitzel (https://www.austria.info/en-us/recipes/wiener-schnitzel/); Azerbaijan — plov (https://azerbaijan.travel/azerbaijani-plov); Bahamas — cracked conch (https://www.bahamas.com/blog/5-ways-to-eat-conch-in-the-bahamas); Benin — amiwo (https://www.untourism.int/africa/african-gastronomy/benin); Bhutan — ema datshi (https://bhutan.travel/journal/editorial/the-diverse-and-delicious-food-of-bhutan); Bosnia and Herzegovina — ćevapi (https://fsa.gov.ba/wp-content/uploads/2026/04/Katalog_zasticenih_proizvoda_final_compressed.pdf); Cambodia — fish amok (https://lib.ncdd.gov.kh/storage/app/public/library_backend/CAT_19903_1/2016-Invest-in-Cambodia.pdf).
- More sources: Denmark — smørrebrød (https://www.visitdenmark.com/denmark/things-to-do/eat-drink/traditional-danish-food); Iceland — skyr (https://www.visiticeland.com/article/enjoy-icelandic-food/); Peru — ceviche (https://www.peru.travel/news/peru-conquers-canada-and-awakens-the-world-a-destination-that-has-it-all); Romania — sarmale (https://www.euraxess.gov.ro/romania/information-assistance/daily-life/romanian-cuisine); Serbia — ćevapi (https://www.serbia.travel/en/authentic-from-serbia/); Slovakia — bryndzové halušky (https://slovakia.travel/en/things-to-see-and-do/gastronomia/tradition-on-a-plate); South Africa — bobotie (https://www.southafrica.net/gl/en/travel/article/iconic-south-african-foods-taste-all-the-flavours-of-the-rainbow-nation); Spain — paella (https://www.spain.info/en/discover-spain/dishes-traditional-cuisine-spain/); Uganda — matooke (https://utb.go.ug/utb-hosts-spectacular-cultural-gala-for-international-visitors-at-ndere-cultural-center/); Vietnam — phở (https://vietnam.travel/things-to-do/21-must-try-vietnamese-dishes/).
- I left foods out when the source did not support a clear choice.
- Food sources for the next 47 records: Fiji — Kokoda (https://www.fiji.travel/things-to-do/local-eats/how-to-make-fijian-kokoda); Finland — Karelian pie (https://www.visitfinland.com/en/articles/finlands-traditional-and-iconic-foods/); France — baguette (https://www.france.fr/en/article/art-french-breakfast/); Gabon — nyembwe (https://presidence.ga/la-culture-du-gabon/); Gambia — benachin (https://visitgambia.com/gambia/themes/food-drink); Georgia — khachapuri (https://georgia.travel/get-a-taste-of-khachapuri); Germany — Thuringian Rostbratwurst (https://www.germany.travel/en/experience-enjoy/german-cuisine.html); Ghana — banku (https://visitghana.com/wp-content/uploads/2024/04/Glitz-See-Ghana-Brochure.pdf); Greece — tzatziki (https://www.visitgreece.gr/en/experiences/culture/archaeological-sites-monuments/cherished-greek-dishes); Greenland — suaasat (https://visitgreenland.com/activities/greenlandic-gastronomy-a-taste-of-greenland/); Guatemala — pepián (https://nominaciones.mcd.gob.gt/en/glossary/); Guinea — sauce feuille (https://mpci.gov.gn/TOURISM/GUIDETOURISTIQUE.html); Guinea-Bissau — cafriela (https://www.consulmarbissau.com/sites/default/files/files/tourist_guide_guinea-bissau_eu_acl2018_en_web.pdf); Guyana — pepperpot (https://travelguyana.gy/story/cuisine/); Haiti — soup joumou (https://ich.unesco.org/en/d%C3%A9cisions/16.COM/19); Honduras — baleadas (https://bvss.incap.int/honduras/); Hungary — gulyás soup (https://visithungary.com/articles/all-you-need-to-know-about-hungarian-cuisine); India — Hyderabadi biryani (https://www.incredibleindia.gov.in/en/telangana/hyderabad/embark-on-an-extravagant-culinary-journey-in-hyderabad); Indonesia — nasi goreng (https://www.indonesia.travel/gb/en/travel-ideas/gastronomy/5-popular-fried-rice-varieties-at-jakarta-s-food-stalls); Iran — chelow kabab (https://www.iranicaonline.org/articles/spazi-cookery/?generate_pdf=1); Iraq — masgouf (https://iraqiembassy.us/art-and-culture/); Ireland — Irish stew (https://www.ireland.com/en-gb/magazine/food-and-drink/traditional-irish-food/); Israel — shakshuka (https://www.gov.il/BlobFolder/generalpage/facts-about-israel-2018/en/English_ABOUT_ISRAEL_PDF_Israel%20Lifestyle%202018.pdf); Italy — Neapolitan pizza (https://www.italia.it/en/campania/naples/things-to-do/pizza); Jamaica — ackee and saltfish (https://www.visitjamaica.com/best-of-jamaica/food/); Japan — sushi (https://www.japan.travel/en/things-to-do/eat-and-drink/); Jordan — mansaf (https://international.visitjordan.com/page/13/RomanTheatre.aspx); Kazakhstan — beshbarmak (https://www.gov.kz/article/64578?lang=en); Kenya — ugali (https://www.kenyarep-jp.com/en/kenya/basic/); Kosovo — flija (https://kosovo.travel/About); Kuwait — machboos (https://www.journeykuwait.com/taste-kuwait); Kyrgyzstan — beshbarmak (https://cbtkyrgyzstan.kg/useful/o-kyrgyzstane/); Laos — laap (https://www.tourismlaos.org/welcome/food-flavours/); Latvia — grey peas with bacon (https://www.latvia.travel/en/flavours-latvia); Lebanon — falafel (https://apnews.com/article/bc03a28df47d174f89708ac7a27f4cb4); Lesotho — papa (https://centralbank.org.ls/about-the-kingdom-of-lesotho/); Liberia — palm butter soup (https://enjoyliberia.travel/pages/cultural-heritage/); Libya — bazin (https://libyanheritagehouse.org/arts-culture/libyan-cuisine); Lithuania — cepelinai (https://lithuania.travel/en/what-to-do/food-and-drink/lithuanian-products/cepelinai); Luxembourg — Judd mat Gaardebounen (https://luxembourg.public.lu/dam-assets/publications/just-arrived/just-arrived-en.pdf); Madagascar — romazava (https://madagascar-tourisme.com/fr/activities/gastronomie/?ontm_categorie=0&ontm_recherche=&ontm_region=); Malawi — nsima (https://ich.unesco.org/en/RL/nsima-culinary-tradition-of-malawi-01292); Malaysia — nasi lemak (https://rai.malaysia.gov.my/visit); Mali — mafé (https://www.ibamako.com/en/que-faire/malian-food-dishes-bamako/); Mauritania — leksour (https://visitmauritania.com/saveurs/); Mexico — mole (https://visitmexico.com/en/destino/18021/mercado-zonal-candiani); Moldova — mămăligă (https://turism.gov.md/wp-content/uploads/2025/06/brosura_generala_plic_cap3_en_2025_tipar.pdf).

- More food sources: Morocco — couscous (https://www.visitmorocco.com/en/travel-info/food-drinks); Namibia — kapana (https://visitnamibia.com.na/top-10-things-to-do/); Nepal — dal bhat tarkari (https://trade.ntb.gov.np/know-nepal/culture/); Norway — lefse (https://www.visitnorway.com/things-to-do/food-and-drink/lefse/); Palestine — musakhan (https://visitpalestine.ps/travel-information/food-and-dining/); Poland — pierogi (https://www.poland.travel/en/flavours-of-polish-cuisine/); Portugal — bacalhau à Brás (https://www.visitportugal.com/en/content/the-portuguese-menu-fish-coriander-and-fantasy); Qatar — machboos (https://visitqatar.com/intl-en/about-qatar/cuisine); Rwanda — brochettes (https://pre-webunwto.s3.eu-west-1.amazonaws.com/s3fs-public/2024-11/a-tour-of-african-gastronomy-rwanda.pdf?VersionId=aL6dwgxuvJuOedB0VSx7t2Qw8Sb3nJa0); South Korea — kimchi (https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=140728); South Sudan — kisra (https://lib-repo.pnu.edu.ua/bitstream/123456789/20830/1/TastesofTraditions.pdf); Sri Lanka — kottu (https://www.srilanka.travel/culinary-tourism/index.php); Switzerland — rösti (https://www.aboutswitzerland.eda.admin.ch/en/switzerlands-national-dishes); Thailand — pad Thai (https://www.doae.go.th/en/pad-thai/); Togo — fufu (https://togotourisme.tg/detailsite?slug=specialites-culinaires&type=activite); Trinidad and Tobago — doubles (https://visittrinbago.tt/things-to-do/cuisine/); Yemen — saltah (https://embassy-of-yemen.pl/en/home/visit-yemen/tourism-in-yemen/must-try/).

- Recent food sources: Cameroon — Achu soup (https://tourismeouestcameroun.com/specialites-culinaires/); Chad — boule (https://tchadmaculture.com/en/cuisine/); Djibouti — skoudehkaris (https://visit-djibouti.com/en/culture/djiboutian-cuisine/); Egypt — koshari (https://www.experienceegypt.eg/en/home/culture); Eritrea — zigni (https://shabait.com/2013/02/22/traditional-maadi/); Mozambique — matapa (https://www.visitmozambique.gov.mz/wp-content/uploads/2025/04/BROCHURA-Cultura_Gastronomia_Print.pdf); Nigeria — jollof rice (https://www.fmacce.gov.ng/gastronomy); Somalia — cambulo (https://www.fao.org/4/aq045e/aq045e.pdf); Somaliland — laxoox (https://link.springer.com/article/10.1186/s42779-022-00138-3); Sudan — ful medames (https://visitsudan.org/en/cuisine); Tanzania — pilau (https://www.ke.tzembassy.go.tz/tanzania/category/people-and-culture); Tunisia — brik (https://www.discovertunisia.com/en/sophistication-and-tradition); Zimbabwe — sadza (https://tourismzim.gov.zw/).

- More checked foods: Belgium — Brussels waffle (https://www.visit.brussels/en/visitors/where-to-eat/brussels-culinary-specialities); Cyprus — halloumi (https://www.visitcyprus.com/discover-cyprus/food-drink/local-produce/halloumi-cheese/); Czechia — svíčková (https://www.visitczechia.com/en-us/things-to-do/places/gastronomic-tourism/czech-cuisine-and-regional-products/g-svickova-na-smetane); North Korea — Pyongyang naengmyeon (https://chinese1.visitkorea.or.kr/enu/FOD/FO_ENG_1_4.jsp); Oman — shuwa (https://booknow.visitoman.om/en/idea/62015096/prepare-oman-s-no-1-underground-traditional-dish-oman); Philippines — pinakbet (https://app.philippines.travel/articles/intro-to-ilocos-norte); Saudi Arabia — kabsa (https://www.visitsaudi.com/en/stories/saudis-youngest-ambassadors-omar-and-aya); Ukraine — borscht (https://mincult.gov.ua/en/news/ukrainian-borscht-is-inscribed-on-the-unesco-list-of-intangible-cultural-heritage/); Uruguay — chivito (https://uruguaynatural.com/en/experiences/uruguay-patrimonio-vivo-del-futbol-mundial/); Panama — sancocho (https://embajadadepanamaenespana.gob.pa/conoce-panama/); Paraguay — sopa paraguaya (https://cultura.gov.py/2017/08/cultura-declara-patrimonio-cultural-inmaterial-del-paraguay-la-sopa-paraguaya-el-vori-vori-el-locro-y-el-jopara/); Sweden — köttbullar (https://visitsweden.com/what-to-do/food-drink/swedish-kitchen/local-legends/); Vanuatu — lap lap (https://www.vanuatu.travel/en/about-vanuatu/local-eats).
- Added four more places: Falkland Islands — Christ Church Cathedral in Stanley (https://www.falklandislands.com/our-islands/stanley-capital-of-the-falklands); Montenegro — Ostrog Monastery (https://www.montenegro.travel/en/explore-montenegro/culture-and-tours/sacral-objects); Myanmar — Shwedagon Pagoda in Yangon (https://myanmar.gov.mm/-/yangon?redirect=%2Ftravel-myanmar); Pakistan — Faisal Mosque in Islamabad (https://www.ptpctourism.com/).

- Latest food sources: Equatorial Guinea — pepesup (https://www.guineaecuatorialpress.com/index.php/noticias/gastronomia); Eswatini — sidvudvu selijoti (https://agrinfosystems.gov.sz/assets/uploadsEswatini%20food%20composition%20table.pdf); Republic of the Congo — saka-saka (https://www.untourism.int/africa/african-gastronomy/republic-of-congo); Suriname — pom (https://www.southamerica.travel/guianas/travel-info/food-drink/); Zambia — nshima (https://www.mots.gov.zm/wp-content/uploads/2026/03/ZAMBIA-COUNTRY-HIGHLIGHTS_english.pdf).
- Latest place sources: Central African Republic — Boali Falls (https://www.usrcaembassy.org/tourism); Niger — Aïr and Ténéré Natural Reserves (https://whc.unesco.org/en/list/573); Solomon Islands — Lake Tegano on Rennell Island (https://whc.unesco.org/en/list/854/); Syria — Palmyra (https://whc.unesco.org/en/list/23/); United States — Statue of Liberty (https://www.nps.gov/stli/learn/statue-of-liberty-facts.htm).

### Second fun fact pass

- Added checked `fact2` fields to 42 entries.
- The page labels these rows “Another fun fact”.
- I skipped repeat candidates for Azerbaijan, South Korea, and Fiji.
- Africa sources: Algeria (https://whc.unesco.org/en/list/179); Angola (https://whc.unesco.org/en/list/1511); Botswana (https://whc.unesco.org/en/list/1021); Central African Republic (https://whc.unesco.org/en/list/1380); Chad (https://whc.unesco.org/en/list/1400); Egypt (https://whc.unesco.org/en/list/88/); Ethiopia (https://whc.unesco.org/en/list/18); Gambia (https://whc.unesco.org/en/list/761); Madagascar (https://whc.unesco.org/en/documents/104118); Mali (https://whc.unesco.org/en/list/119); Morocco (https://whc.unesco.org/en/list/836); Rwanda (https://whc.unesco.org/en/list/1697/); Senegal (https://whc.unesco.org/en/list/1359/); South Africa (https://whc.unesco.org/en/list/915/); Sudan (https://whc.unesco.org/en/list/1336/); Tanzania (https://whc.unesco.org/en/list/173); Tunisia (https://whc.unesco.org/en/list/38/); Uganda (https://whc.unesco.org/en/list/1022).
- Asia sources: Cambodia (https://www.unesco.org/en/mab/tonle-sap?hub=66369); China (https://za.china-embassy.gov.cn/eng/zngx_1/ChinaSARelations2004/202401/t20240104_11216991.htm); Georgia (https://ich.unesco.org/en/RL/ancient-georgian-traditional-qvevri-wine-making-method-00870); India (https://culture.gov.in/kaziranga-national-park); Indonesia (https://whc.unesco.org/en/list/609); Iran (https://whc.unesco.org/en/list/1506); Japan (https://www.japan.go.jp/tomodachi/2014/autumn2014/the_shinkansen_japans_high-speed_rail.html); Jordan (https://businessevents.visitjordan.com/en/page/17/DeadSea); Kazakhstan (https://www.gov.kz/uploads/2020/12/27/4d25dfd8ea1e19b5488d44e2528a8e12_original.17964681.pdf); Laos (https://whc.unesco.org/en/list/1587/); Malaysia (https://www.malaysia.travel/index.php/explore/appreciate-the-nation-s-unique-biodiversity-this-malaysia-day-flora-edition); Mongolia (https://ich.unesco.org/en/RL/traditional-music-of-the-morin-khuur-00068); Myanmar (https://ich.unesco.org/en/decisions/16.COM/8.B.27); Nepal (https://whc.unesco.org/en/list/120).
- Other sources: Australia (https://whc.unesco.org/document/162440); Brazil (https://publicacoes-snif.florestal.gov.br/florestasdobrasil/en/forest-resources/extent-of-forests-in-brazil/); Canada (https://www.unesco.org/en/iggp/cliffs-fundy-unesco-global-geopark); Estonia (https://visitestonia.com/en/where-to-go/tallinn); France (https://whc.unesco.org/en/list/80/); Greece (https://www.unesco.org/en/mab/mount-olympus); Italy (https://whc.unesco.org/pg.cfm?CID=31&ID_SITE=394&l=en); New Zealand (https://www.doc.govt.nz/globalassets/documents/our-work/milford-opportunities-project/stage-2/mop-land-analysis-report-2021.pdf); United States (https://www.nps.gov/grca/faqs.htm); Vanuatu (https://tourism.gov.vu/en/program/products/product-development/iconic-tourism-products).
