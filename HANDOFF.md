# HANDOFF — Ahaan's Portfolio

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
