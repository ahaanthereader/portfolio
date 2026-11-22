# HANDOFF — Ahaan's Portfolio

## Park train loop brief — Nov 22, 2026

- Started branch `feature/park-train-and-cars` from published main commit `7b9dced`.
- The feature worktree is `.worktrees/feature-park-train-and-cars`.
- Queue item 1, click-to-go vehicles, is published and live-verified in merge `7b9dced`.
- Pages run `45016995946` passed after the bike bridge route fix.
- The car parking state starts at `(-14, -8)` with heading `0` in `assets/park3d.js`.
- The brief asks to move the car farther from the center and add a loop train with stations.
- Initial inspection found no train or station implementation in `assets/park3d.js`.
- Moved the car parking point to `(-20, -14)`, away from the center route and nearby boulders.
- Updated the durable vehicle harness to approach the car at `(-20, -14)`.
- `node --check assets/park3d.js`, `node --check tests/chopper-click-browser.cjs`, and `git diff --check` passed.
- The durable desktop and mobile vehicle suite passed, including car mount, click-to-go, and manual control.
- Added a Catmull-Rom loop with four stations near the ice-cream shop, bridge, south grove, and west grove.
- Added two visible rails, 320 sleepers, bridge supports, four platforms with signs, and a small engine with two carriages.
- The train starts at the Ice Cream Stop, pauses at each station, then continues at a smooth speed.
- The Breeze control pauses the train. Train sound stays off until Ahaan enables the Sound control.
- Added `tests/park-train-browser.cjs` for the loop, station pauses, screenshots, and desktop and mobile checks.
- `node --check assets/park3d.js`, both browser test files, and `git diff --check` passed.
- `tests/park-train-browser.cjs` passed on desktop and mobile. The check verified the loop, all four station pauses, and Breeze pause and resume.
- `tests/chopper-click-browser.cjs` passed on desktop and mobile. The existing vehicle checks passed.
- `tests/two-player-browser.cjs` passed with zero browser errors. Bridge height matched at `8.000940 m`.
- `tests/quad-browser.cjs` passed mount, ride, and dismount checks with zero browser errors.
- Screenshots: `/tmp/ahaan-park-train/station-1280.png` and `/tmp/ahaan-park-train/station-390.png`.
- Visual inspection shows the train on the rails at the Ice Cream Stop. The track and stations render on mobile.
- Added independent boarding and station exits for Ahaan (E) and Vihaan (Enter). A rider can leave only during a station stop.
- Added sit poses and train-follow positions for both riders.
- Ahaan boards with E at a station and exits with E at any later station. Vihaan boards with Enter and exits with Enter. One boy can leave while the other stays aboard.
- `tests/park-train-browser.cjs` passed on desktop (1280x800) and mobile (390x844). It verified solo boarding, both boys boarding, independent exits, travel to Bridge Stop, all four stops, and Breeze pause/resume.
- Repeated `tests/park-train-browser.cjs` after the latest request. Desktop and mobile passed again with no browser errors.
- `tests/two-player-browser.cjs` passed with no browser errors. Bridge height remained `8.000940 m`.
- Inspected the desktop and mobile station screenshots at `/tmp/ahaan-park-train/station-1280.png` and `/tmp/ahaan-park-train/station-390.png`.
- Read `FEATURE-BRIEF-park-train-upgrade-dino.md`. The brief amends the train design in this worktree.
- Changed the engine to blue and added a friendly dinosaur head, steam chimney, and moving smoke puffs.
- Added a soft two-tone dinosaur sound at each station arrival. The shared Sound control gates the sound and stays off by default.
- Extended the train browser check for the blue engine, smoke puffs, and all four sounds when Sound is enabled.
- First upgrade browser run reached the test's 45-second Bridge Stop timeout before arrival. Raised that wait to the 120-second station-check limit used by the full loop.
- Final `tests/park-train-browser.cjs` passed on desktop and mobile. It checked the blue engine, moving smoke, sound at all four stops, boarding, and separate exits. There were no browser errors.
- Visual inspection shows the blue dinosaur face and smoke in the moving train view. The station screenshot shows the train stopped at the Ice Cream Stop.
- Screenshots: `/tmp/ahaan-park-train/dino-smoke-1280.png`, `/tmp/ahaan-park-train/dino-smoke-390.png`, and `/tmp/ahaan-park-train/station-1280.png`.
- `node --check assets/park3d.js`, `node --check tests/park-train-browser.cjs`, and `git diff --check` passed.
- Ponytail full used on the train work: reused the Sound control and audio helper, added no dependencies, and reduced the dinosaur face to a head, snout, eyes, and three spikes.
- At the ponytail-only step, skipped the garage queue, commit, publish, and live verification. The garage queue remains untouched.
- At the ponytail-only step, skipped a browser rerun after the visual-only model reduction. The train behavior did not change.
- Re-ran `tests/park-train-browser.cjs` after the model reduction. Desktop and mobile passed for the train, smoke, four sounds, boarding, and independent exits. No browser errors appeared.
- Inspected the new moving-train screenshots and the Ice Cream Stop screenshot.
- Merged `origin/main` at `f189875` and kept its zoo prompts while resolving the train prompt overlap.
- After the merge, `tests/park-train-browser.cjs` passed on desktop and mobile with no browser errors.
- After the merge, `tests/zoo-browser.cjs` passed on desktop and mobile. It checked four pens and reported no browser errors.
- Train feature commit: `b7e3c74` (`Add perimeter dinosaur train`). Merge commit `517751c` includes current main and the train.
- Pushed merge commit `517751c` to `main`. Pages run `45043472388` completed successfully.
- Ran the train browser check against the live Pages URL. Desktop and mobile passed all train, smoke, sound, boarding, and exit checks with zero page errors.
- Captured the live train at the Ice Cream Stop in `public/fresh-drops/2026-11-22-dinosaur-train.png`.
- Added the dinosaur train entry to `fresh-drops.html` with the live screenshot. Commit `60b7c67` published the entry, and Pages run `45047203903` succeeded.
- Focused live Fresh Drops checks passed on desktop and mobile. The card text and live screenshot loaded with zero page errors.
- Live screenshots: `/tmp/ahaan-park-train/fresh-drops-live-1280.png` and `/tmp/ahaan-park-train/fresh-drops-live-390.png`.
- The full live chopper harness failed at its chopper click wait before reaching Fresh Drops. The focused Fresh Drops check passed.
- Latest main commit `7c37f74` keeps the garage brief next in the queue.
- `node --check assets/park3d.js`, `node --check tests/park-train-browser.cjs`, and `git diff --check` passed after the boarding changes.
- The first browser attempt found a timing race when the test tried to reboard during the initial station dwell. Updated the check to verify each rider at separate station stops.
- The next browser attempt reached Bridge Stop with Vihaan aboard. The test radius missed the rear carriage, so I widened the position check to cover the train length.
- Ponytail full is active. Keep the implementation small and reuse existing vehicle patterns.
- The root checkout has unrelated local edits and remains untouched.

### First step

- Recorded the original car parking coordinates and confirmed the train feature is absent.
- Moved the car's spawn and reset point to `(-20, -14)`.
- Updated and passed the desktop and mobile vehicle browser check from the new spot.
- Boarding and independent exit checks pass in the train browser suite.

## Click-to-go vehicles brief — Nov 22, 2026

- Started from `main` at `a2aabea` in `.worktrees/feature-chopper-click-to-fly`.
- The active branch is `feature/chopper-click-to-fly`.
- The root `FEATURE-BRIEF-chopper-click-to-fly.md` defines the top queue item.
- The feature covers click-to-go for five vehicles, plus chopper sound, design, and safe height.
- The root checkout has unrelated untracked briefs and an edited `AGENTS.md`. Those files remain untouched.
- Initial inspection found bike, quad, e-bike, car, and chopper code in `assets/park3d.js`.
- Chopper clicks on walkable ground now set a fly-to point. Arrow or WASD input cancels that point.
- The chopper turns toward the point, slows near it, and clears the marker after it stops.
- Mounting sets the default flight height to 10.5 m. The rotor and tail rotor spin up as before.
- Chopper body and canopy colors now use Ahaan's blue palette.
- Added a soft rotor tone to the shared audio helper. It starts only when the Sound setting is on and stops on dismount.
- Added light cabin windows, tail fins, a rotor mast, and a hub. Adjusted the rider scale and seated limb pose for the cabin. The dismount restores the rider's original scale.
- Ground clicks now route to the ridden vehicle. A grid route uses shared obstacle checks and bridge decks for bike, e-bike, quad, and car targets.
- E now mounts the e-bike and car in solo mode. Existing E and Enter exit controls remain active.
- The durable chopper browser check passed at desktop and mobile sizes. It checked target arrival, arrow cancellation, 10.5 m height, rotor start and stop, and rider scale restoration.
- Mobile touch checks passed for the chopper, bike, e-bike, and car.
- In two-player mode, Vihaan can set a chopper target while Ahaan keeps WASD walking. Ahaan's keys do not cancel Vihaan's target.
- The chopper takes target clicks while mounted, even when another ride is occupied.
- Initial durable checks passed desktop and mobile target setting for the bike, e-bike, car, and chopper.
- Ground-ride tests found that clicks on obstacles needed a clear destination. The route planner moves blocked clicks to a nearby open point and avoids blocked cells.
- The two-player browser check passed. Bridge height matched at 8.000940 m and browser errors were empty.
- The quad browser check passed target arrival, stop, arrow cancellation, manual ride, and dismount.
- The expanded durable check passed desktop and mobile. Bike, e-bike, and car reached their clicked point, stopped, and accepted manual steering after a new target.
- The Fresh Drops comparison loaded both images at desktop and mobile. The two images fit without horizontal overflow. The NEW badge appeared.
- The chopper screenshots are in `/tmp/ahaan-chopper-click`. The inspected target screenshots show the blue chopper design and target marker.
- Added a before-and-after Fresh Drops card. The before image shows the original green chopper. The local after image shows the blue chopper during click-to-go. Replace the after image with a live publish screenshot after deployment.
- `node --check` passed for `assets/park3d.js`, `assets/audio.js`, `assets/fresh-drops.js`, and both browser checks. `git diff --check` passed.
- The desktop chopper route reached its clicked point at 10.5 m. The test checked the default height, arrow movement, and target cancellation.
- The browser run passed target arrivals and manual cancellation on desktop and mobile for the bike, e-bike, and car. The quad check passed mount, target, arrow cancellation, manual ride, and dismount.
- Merged the feature into `main` as `1f054bb` (`Publish click-to-go park rides`).
- Pushed `1f054bb` to `origin/main`.
- GitHub Pages run `45013437262` completed with success.
- The durable browser check passed on the live site at desktop 1280 × 800 and mobile 390 × 844.
- Live checks passed chopper click-to-go, manual cancel, safe height, rotor start and stop, rider scale, ground vehicle routes, Fresh Drops images, and NEW badges.
- Live browser errors: none. Screenshots: `/tmp/ahaan-chopper-click/`.
- Replaced the Fresh Drops after image with the live target screenshot at `public/fresh-drops/2026-11-22-chopper-after.jpg`.
- The live target screenshot shows the blue chopper near the target. The overhead camera partly hides Ahaan.
- Ponytail full was used. It kept the change to the live screenshot and deployment record.
- Follow-up screenshot commit `a3f0d60` was published in merge `1efbf16`.
- Pages run `45015727425` completed with success after the screenshot update.
- The live suite found a bike route that stopped at the east exit of the Mississippi bridge.
- The route planner allowed a wider bridge lane than collision checks. Widened the shared bridge clearance from 0.94 m to 1.2 m.
- `node --check assets/park3d.js`, `git diff --check`, and the local desktop and mobile browser suite pass after the fix.
- The bridge clearance fix was published in merge `7b9dced`.
- Pages run `45016995946` succeeded. The final live desktop and mobile suite passed.
- Ponytail full kept the fix to one shared collision value and its required checks.
- Feature commit: `5b01295` (`Add click-to-go park rides`). Verification record commit: `78ca9d0` (`Record click-to-go verification`).

## Brief queue — dispatched by Goku (Nov 20, 2026)

Execute in this order. Build, publish, live-verify on driver authority (Nishant's Nov 19 drive instruction). Update HANDOFF.md as you go. Fresh Drops standing rule: every publish adds a Fresh Drops entry with its screenshot (from publish verification) — no entry without its screenshot.

1. **Fresh Drops page** — `FEATURE-BRIEF-release-notes.md` (in this folder). Completed Nov 21, 2026; published and live-verified.
2. **Park 2-player + walking improvement pass** — `FEATURE-BRIEF-two-player-walking.md` (Nishant's Nov 20 priority: walking is off — test yourself and fix issues you see).
3. **Story Studio delete confirm + undo** — `FEATURE-BRIEF-story-studio-delete-confirm.md` (Sally R4; do NOT touch games.html Math Dash — that stays the Codex cloud pilot). Completed Nov 21, 2026; published and live-verified.

## Brief queue — overnight drive, dispatched by Goku (Nov 22, 2026)

Execute in this order. Build, publish, live-verify on driver authority (Nishant's Nov 19/20 drive instruction). Update HANDOFF.md as you go.

Standing rules (Nishant, Nov 21): (a) every publish adds a Fresh Drops entry WITH a screenshot of the live feature — no entry without its screenshot; (b) every new feature/page goes under an existing menu tab at publish time — no orphan/random separate pages — and gets a visible "NEW" tag (nav entry + home card) for its first 7 days so the kids know what to try.

1. **Click-to-go for ALL vehicles + chopper sound/design/default height** — `FEATURE-BRIEF-chopper-click-to-fly.md`. TOP OF QUEUE — execute first.
2. **Park train loop + stations, cars moved further from center** — `FEATURE-BRIEF-park-train-and-cars.md`. COMPLETED and published Nov 22, 2026. Train commit `b7e3c74`; Pages run `45043472388` succeeded; live desktop and mobile checks passed.
3. **Dinosaur train upgrade (AMENDMENT to brief 2 — fold into the in-flight train work)** — `FEATURE-BRIEF-park-train-upgrade-dino.md` (Ahaan + Nishant, Nov 22 voice call: blue dinosaur steam engine, smoke puffs, friendly dinosaur sound at each of the 4 perimeter stops; train stays outside, never in the garage). COMPLETED and published in `60b7c67`; Fresh Drops Pages run `45047203903` succeeded; live desktop and mobile checks passed.
4. **Garage + 1.5x speed + lifelike vehicles + rider seating** — `FEATURE-BRIEF-park-garage-speed-positions.md` (garage near the picnic area for chopper/bike/bicycle/car — train stays outside; everything 1.5x faster; fix odd rider seating positions).
5. **Train guided tour upgrade** — `FEATURE-BRIEF-park-train-guided-tour.md` (Ahaan + Nishant, Nov 22 voice call: make the existing train bigger, both Ahaan and Vihaan ride at the same time, camera follows the train, choo-choo sound, one boarding station, kid-friendly narration of what is on the left and right). QUEUED Nov 22, 2026 — runs after the current train publish + garage brief.
6. **Movie theater** — `FEATURE-BRIEF-park-movie-theater.md` (Ahaan, Nov 22 voice call: theater building with a big screen and seats). QUEUED Nov 22, 2026.
7. **Pyramid** — `FEATURE-BRIEF-park-pyramid.md` (Ahaan, Nov 22 voice call). QUEUED Nov 22, 2026.
8. **Zoo section (4–5 animals, each its own area)** — `FEATURE-BRIEF-park-zoo.md` (one section of the 4-section park plan; sits outside the train track on its side). Dispatched to a Claude worker in parallel, Nov 22 — worktree `feature-park-zoo`. PUBLISHED live Nov 22, 2026 (feature 94d3cce, Pages run 45034019201 success, live-verified desktop + mobile, zero page errors; Fresh Drops entry with live screenshot).
9. **Water park (4 big rides, diagonally opposite the zoo)** — `FEATURE-BRIEF-park-water-park.md` (the diagonally opposite section of the 4-section plan).
10. **Improve the car + fire truck (Ahaan drives, Vihaan sprays)** — `FEATURE-BRIEF-park-car-improve-fire-truck.md`.
11. **Bigger center, expand the park, realistic rippling water, lazy river + splash zone** — `FEATURE-BRIEF-park-expand-water.md`. NOTE: lay out the 4-section plan here (zoo = one section, water park = diagonally opposite) so briefs 8–9 attach cleanly.
12. **Lazy river boat (canal style, both boys sit, hop on/off)** — `FEATURE-BRIEF-lazy-river-boat.md` (depends on brief 11).
13. **Day/night cycle + weather (park lights, rain, puddles)** — `FEATURE-BRIEF-park-day-night-weather.md`.

## Zoo section — Nov 22, 2026

- Worktree `.worktrees/feature-park-zoo` on `feature/park-zoo`, from `origin/main` `e5f3aa6`.
- BMAD spec: `_bmad-output/implementation-artifacts/spec-park-zoo.md` (gitignored).
- Animals (Ahaan's own picks): tiger, elephant, kangaroo, monkey. Each pen has a wooden fence ring, a hedge, a tilted name sign with the fact, and a gentle idle animation (head turns, tail sway, ear flaps, small kangaroo hops). No animal sounds.
- Location: the **southwest** corner, outside the planned train loop and the rim trees. Plaza (-45, 45), gate (-38, 38), pens tiger (-45, 37), elephant (-37, 45), kangaroo (-53, 45), monkey (-45, 53). A gravel path runs from the Texas edge (-27, 19) through the rim-tree gap (-29.5, 33) to the gate.
- Why not northwest: the north clouds (y about 20, z -18 to -28) sit between the default camera and anything far north, so they hid the zoo. **The water park (brief 9) goes in the diagonally opposite corner: northeast.** The water-park worker must handle the north clouds (move or fade them).
- Prompt pill near a pen: "Say hi to the <animal>". E, Enter, or a tap shows the speech bubble with the kind fact. In Play together, Vihaan gets his own prompt and Enter greets the animal.
- Pens are `parkObstacles`, so vehicles go around them. Walking is not blocked, the same as trees.
- Play menu: new link "🐯 Ahaan's Zoo" (`index.html#zoo`, NEW tag for 7 days). The `#zoo` hash starts Ahaan at the zoo gate.
- Fixed a tap blocker: hidden `.activity-hud` and hidden `.action-prompt` elements kept `display: flex` and blocked clicks and taps on the visible prompt pill. `site.css` now sets `display: none` for both when hidden.
- New check: `tests/zoo-browser.cjs` (desktop 1280x800 + mobile 390x844, all four pens, fact text, Enter key, Vihaan in Play together, `#zoo` link, zero page errors) — PASS.
- Published: pushed `e5f3aa6..94d3cce` to `main` as a fast-forward. Pages run `45034019201` completed with success in 22 s.
- Live verified: `tests/zoo-browser.cjs` with `BASE_URL=https://ahaanthereader.github.io/portfolio/index.html` PASS (desktop + mobile, four pens, facts, Vihaan, `#zoo` link, zero page errors). Live `assets/park3d.js` has the zoo code.
- Fresh Drops: new top entry "Ahaan's Zoo" ("You asked for this!") with the live screenshot `public/fresh-drops/2026-11-22-zoo.jpg` (from `/tmp/ahaan-zoo/live/desktop-overview.png`). Local check: desktop + mobile, image loads, NEW tag shows, zero errors.
- Fresh Drops publish: commit `b6431f4`, Pages run `45034266531` success. Live `fresh-drops.html`: zoo card first, image 200, NEW tag shows, desktop + mobile, zero errors.
- Regression: `two-player-browser.cjs` PASS, `quad-browser.cjs` PASS. `chopper-click-browser.cjs` FAILS at the 20 s chopper-arrival wait. The same failure happens on unchanged `origin/main` `e5f3aa6`, so the zoo change did not cause it.

## Reading Nook Aesop link — Nov 16–17, 2026

- The active brief is `FEATURE-BRIEF-reading-aesop-link.md`.
- Added one Aesop's Fables link below the book shelf in `reading.html`.
- Added a warm paper style and a visible keyboard focus outline.
- Desktop screenshot at 1280 × 800 shows the link below the shelf.
- Mobile screenshot at 390 × 844 shows the link below the shelf.
- The mobile screenshot also shows the existing shelf content past the right edge.
- Clicked the link in Chrome. The Aesop page opened and showed all ten fables.
- Chrome DevTools reported no console errors on `reading.html`.
- Screenshots: `/tmp/ahaan-reading-aesop/reading-desktop.png` and `reading-mobile.png`.
- `git diff --check` passed.
- Feature commit: `1d21b5f` (`Add Reading Nook link to Aesop fables`).
- Published Nov 18, 2026: merged to main as `a8fe125`, pushed `990e2a1..a8fe125`; GitHub Pages run `44256079700` success in 19 s; live verified reading.html (200) desktop 1280×800 + mobile 390×844, link visible, click opens aesop.html (200, title "Aesop's Fables · Ahaan's World"), zero console errors, zero failed requests; live aesop-data.js 200, 8,655 bytes; live aesop.html 200, 2,068 bytes.

## Capitals quiz brief — Nov 16, 2026

### State before changes

- The quiz page is `quiz.html` and loads `assets/quiz.js`.
- The page shows a 50-question quiz immediately. It has no start screen or stop button.
- A wrong answer uses the red `#e7806a` style.
- `geography.html` and `sketchbook.html` already link to `quiz.html`.
- The worktree is on `feature/capitals-quiz` from `origin/main`. Only the brief file was untracked.

### Work in progress

- Started the four-quiz implementation from `FEATURE-BRIEF-capitals-quiz.md`.

### Implemented and checked

- `quiz.html` now opens with four quiz cards. The page does not start a round on load.
- Each quiz selects 10 questions without repeats. Each question has four distinct answer buttons.
- The reader can stop at any time. Each answer shows kind feedback and a Next button.
- Wrong answers use a soft neutral style. The right answer uses green.
- The end screen shows the answered count, the score, Play again, and Choose another quiz.
- Best scores save separately by quiz type. Storage errors do not stop the quiz.
- The quiz uses 176 Country Book entries, 50 state-capital entries, 12 food entries, and 12 building entries.
- All building country names match a Country Book entry. The starter list has no name mismatch.
- Country food entries added: Australia—meat pie; Brazil—feijoada; Canada—poutine; China—dumplings; Egypt—koshari; France—baguette; India—biryani; Italy—pizza; Japan—sushi; Mexico—tacos; Peru—ceviche; Spain—paella.
- Food sources: Australia—[Australian cuisine](https://en.wikipedia.org/wiki/Australian_cuisine#Meat_pies); Brazil—[feijoada](https://en.wikipedia.org/wiki/Feijoada); Canada—[poutine](https://en.wikipedia.org/wiki/Poutine); China—[Chinese dumplings](https://en.wikipedia.org/wiki/Chinese_dumpling).
- Egypt—[UNESCO koshary entry](https://ich.unesco.org/en/RL/koshary-daily-life-dish-and-practices-associated-with-it-02278); France—[UNESCO baguette entry](https://ich.unesco.org/en/RL/baguette-bread-craft-knowledge-and-culture-01883); India—[biryani](https://en.wikipedia.org/wiki/Biryani); Italy—[pizza](https://en.wikipedia.org/wiki/Pizza).
- Japan—[GO TOKYO food guide](https://www.gotokyo.org/en/see-and-do/drinking-and-dining/japanese-cuisine/index.html); Mexico—[UNESCO Mexican cuisine entry](https://ich.unesco.org/en/RL/traditional-mexican-cuisine-00400); Peru—[UN Tourism cuisine note](https://pre-webunwto.s3.eu-west-1.amazonaws.com/s3fs-public/2025-06/20250613_Information%20Note_70CAM_Peru_EN.pdf); Spain—[paella](https://en.wikipedia.org/wiki/Paella).
- State-capital source: [Wikipedia list of U.S. capitals](https://en.wikipedia.org/wiki/List_of_capitals_in_the_United_States). The file contains 50 states with no duplicate state names.
- Building pairs checked against the Country Book landmark entries and these building references: [Eiffel Tower](https://en.wikipedia.org/wiki/Eiffel_Tower), [Taj Mahal](https://en.wikipedia.org/wiki/Taj_Mahal), [Great Wall](https://en.wikipedia.org/wiki/Great_Wall_of_China), [Pyramids of Giza](https://en.wikipedia.org/wiki/Giza_pyramid_complex), [Colosseum](https://en.wikipedia.org/wiki/Colosseum), [Statue of Liberty](https://en.wikipedia.org/wiki/Statue_of_Liberty), [Sydney Opera House](https://en.wikipedia.org/wiki/Sydney_Opera_House), [Big Ben](https://en.wikipedia.org/wiki/Big_Ben), [Machu Picchu](https://en.wikipedia.org/wiki/Machu_Picchu), [Christ the Redeemer](https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)), [Leaning Tower of Pisa](https://en.wikipedia.org/wiki/Leaning_Tower_of_Pisa), and [Sagrada Familia](https://en.wikipedia.org/wiki/Sagrada_Fam%C3%ADlia).
- Chrome checks passed at 1280×800 and 390×844. The checks played every quiz to 10 questions, tested one wrong answer per quiz, checked score counts, stopped an empty round, checked answer focus, and found no horizontal scroll or JavaScript errors.
- Screenshots are in `/tmp/ahaan-capitals-quiz/`: `start.png`, `question-1.png` through `question-4.png`, `wrong-neutral.png`, `stopped.png`, and `full-round.png`.
- `node --check` passed for the quiz and both new data files. `git diff --check` passed.
- Facts for Ahaan to check: none recorded.
- The worker committed the changes locally on `feature/capitals-quiz` with message `Build four kind quiz rounds`. No files were published.
## Two-player mode — Nov 13, 2026

- Branch `feature/two-player` starts at bike branch commit `ee0688d`.
- The approved spec is `_bmad-output/implementation-artifacts/spec-two-player.md`.
- Vihaan uses Ahaan's model and scale with a red shirt. Ahaan keeps his maroon shirt.
- Added the accessible Play together toggle and projected name labels.
- Added separate arrow-key walking for Vihaan. Shift increases his walking speed.
- In two-player mode, arrows do not enter Ahaan's bike controls.
- The camera follows both players. A frustum-based limit preserves a screen margin.
- Added separate ice-cream cones, timers, arms, prompts, and a trampoline bounce for Vihaan.
- Vihaan enters and exits with a wave when motion is allowed.
- Syntax, whitespace, desktop, mobile, and reduced-motion checks pass.
- Screenshots: `/tmp/ahaan-two-player/desktop.png` and `/tmp/ahaan-two-player/mobile.png`.
- Implementation commit: `b46a012` (rebased from `5a689a1` onto main `218ead7`; record commit `21cbcb3`).
- Published Nov 17, 2026: merged to main as `8495fdc`, pushed `218ead7..8495fdc`; GitHub Pages run `44211964764` success; live verified desktop + mobile, browser suite errors: [].

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

## Country Book v2 — COMPLETE (Nov 17, 2026)

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
- All brief work is complete. No implementation step remains.
- The optional facts listed below remain hidden until checked. The brief allows uncertain fields to stay off the pages.

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
- Published Nov 17, 2026: merged to main as `e05fc2f` (branch `1a2296e`; main merged into the branch first, HANDOFF.md kept both sides, country-data.js kept the branch version plus main's header line), pushed `3c2b456..e05fc2f`; GitHub Pages run `44221176304` success; live verified https://ahaanthereader.github.io/portfolio/sketchbook.html desktop + mobile (176 entries A-to-Z, direct #mongolia, search India to #india, button/arrow/touch turns, motion off + reduced motion), browser suite errors: []. Evidence: `/tmp/ahaan-country-book-v2-live/` (live-check.json, live-desktop-mongolia.png, live-desktop-india.png, live-mobile-india.png).

## Bike and ice cream feature — Nov 10, 2026

- Branch `feature/bike-ice-cream` starts at `24f68aba1d6a8e6a37c08499c22a4effe1fc1e62`, the tip of `feature/lazy-river-bridges`.
- The bike and ice cream brief is `FEATURE-BRIEF-bike-icecream.md` in the main checkout. The branch worktree does not track that brief.
- The approved spec is `_bmad-output/implementation-artifacts/spec-bike-ice-cream.md`. Feature code is in progress.
- The existing park has no touch walking controls. The feature will record this choice instead of adding bike touch buttons.
- Code inspection found bridge-aware `groundHeightAt()`, interaction prompts, raycast taps, and smooth camera follow in `assets/park3d.js`.
- Code inspection found no walking collision system. Bike movement needs its own checks for water and solid obstacles.

### Browser check — Nov 11, 2026

- `node --check assets/park3d.js` and `git diff --check` passed.
- Desktop Chrome loaded the park with the canvas ready. Sound stayed off. The browser reported no console errors.
- Ahaan walked near the parked bike. The prompt said “Press E to ride the bike.” E mounted the bike and showed “Press E to park the bike.” The E dismount key is not yet verified.
- W turned both bike wheels. Wheel rotation changed by 5.25 radians during the ride.
- At x=−0.65, z=8.55, Ahaan's rig y was 7.55 m on the south lazy-river bridge. This confirms bridge height tracking at that point.
- The shop callback opened the picker while riding and dismounted Ahaan first. Escape closed the picker. E opened the picker near the counter. Strawberry produced a cone and status text.
- Mobile Chrome at 390 × 844 displayed the flavour picker. No console errors appeared.
- Screenshots: `/tmp/ahaan-bike-icecream/bike-parked.png`, `bike-riding.png`, `over-bridge.png`, `shop-front.png`, `flavour-picker.png`, `eating-cone.png`, `mobile-park.png`, and `mobile-picker.png`.
- Visual review found that Ahaan's legs still looked too straight while riding. The shop sign was also blocked in the close view. Both points were addressed in the Nov 12 follow-up below.
- Water stops and tree collision stops are not yet verified. Mississippi bridge crossings are not yet verified.

## Riding pose and shop view — Nov 12, 2026

- Raised the handlebars to meet Ahaan's hands. Bent his knees and elbows into a riding pose.
- Added a small leg cycle while the bike moves. The pedals and wheels turn together.
- Raised the shop sign above the awning. Added two sign supports.
- Moved Ahaan to the right side for the close shop screenshot. The “Ice Cream” sign now reads clearly.
- Captured and inspected `/tmp/ahaan-bike-icecream/rider-pose-close.png` and `/tmp/ahaan-bike-icecream/shop-front.png`.
- The bridge screenshot still shows Ahaan on the south lazy-river bridge. The rig position was x=−0.65, z=10.95, y=7.15 m.
- The updated Chrome run had no console errors. The wheel rotation changed by 9.22 radians during the ride.
- `node --check assets/park3d.js` and `git diff --check` passed.
- Tree collision stops and Mississippi bridge crossings still need checks.

## E dismount check — Nov 12, 2026

- Chrome mounted the bike with E and rode across the south lazy-river bridge.
- E dismounted Ahaan after the bike reached the path.
- Ahaan stood 1.55 m from the bike. His feet reached y=0.45 m, the path height.
- The prompt returned to “Press E to ride the bike.”
- Screenshot: `/tmp/ahaan-bike-icecream/e-dismount.png`. Visual review showed Ahaan standing beside the parked bike.
- The browser run reported no console errors. Tree stops and Mississippi bridge crossings remained unverified at this check.

## Water-edge stop check — Nov 12, 2026

- Chrome mounted the bike with E. W and D steered the bike off the south bridge toward the lazy river.
- The water boundary blocked the bike at x=0.918, z=8.336 m. The position was beside the bridge, at river radius 8.386 m.
- After key release, the bike moved 0.002 m over 1.8 seconds. The bike remained stopped beside the water.
- Screenshot: `/tmp/ahaan-bike-icecream/water-stop.png`. Visual review showed the bike at the water edge beside the bridge.
- The ride and dismount checks also passed. E returned the prompt “Press E to ride the bike.” No browser console errors appeared.
- Tree collision stops and Mississippi bridge crossings still need checks.

## Tree collision stop check — Nov 13, 2026

- Chrome mounted the bike with E. W rode it south along the path toward the oak at x=0, z=32 m.
- The bike stopped at x=−0.65, z=30.739 m. Its distance from the tree center was 1.418 m, matching the oak collision radius plus clearance.
- After key release, the bike moved 0.043 m over 1.8 seconds, then stayed at the tree boundary.
- Screenshot: `/tmp/ahaan-bike-icecream/tree-stop.png`. The bike wheel appears beside the tree. The tree crown hides much of Ahaan in this camera view.
- The browser run reported no console errors. E dismount still returned the prompt “Press E to ride the bike.”
- Mississippi bridge crossings still need checks.

## Mississippi bridge ride attempt — Nov 13, 2026

- Chrome mounted the bike with E and rode across the south lazy-river bridge onto the park path.
- The ride reached the west bank near the second Mississippi bridge. The bike stopped at x=11.546, z=8.781 m, before it entered the bridge deck.
- Ahaan's rig y stayed at 4.631 m at the stopped position. The bike did not cross the Mississippi bridge in this run.
- This attempt does not confirm Mississippi bridge height tracking or deck clearance. No bridge crossing screenshot was captured.
- The first Mississippi bridge remains unverified. The second bridge needed an aligned retry.

## Aligned Mississippi bridge ride — Nov 13, 2026

- The first ride stopped just before the second Mississippi bridge. The water check rejected the bike before the bridge collision span began.
- Extended the bike's river-bridge collision span from 6.4 m to 6.8 m. This lets the bike move from the bank onto the raised deck.
- Started the browser ride at x=9.69, z=5.57 m, heading 1.05 radians. The ride faced the southwest deck entrance.
- The bike entered the deck at x=11.253, z=6.467 m. Its across-deck offset was 0.006 m.
- At the midpoint, x=13.976, z=8.028 m, the bike stayed 0.006 m from the deck centerline. The bike height was 3.576 m. The deck height was 3.616 m.
- Ahaan's rig height at the midpoint was 7.877 m. The path height before the bridge was 4.631 m. The rig followed the raised deck profile.
- The bike reached the far bank at x=17.363, z=9.971 m. The bike height returned to 0.06 m, and the rig returned to 4.631 m.
- Screenshot: `/tmp/ahaan-bike-icecream/mississippi-bridge-aligned.png`. Visual review showed Ahaan and the bike near the bridge's far end.
- Chrome reported no browser errors. The bike's original parked position was restored after the check.
- The second Mississippi bridge crossing passed. The first bridge remained for the aligned check below.

## First Mississippi bridge ride — Nov 13, 2026

- The earlier aligned start at x=8.013, z=−3.391 m was blocked by the lazy-river ring check. The bike could not move from that point.
- Let Mississippi bridge positions pass the lazy-river ring check. The bike can now ride onto the bridge from the southwest approach.
- Started at x=8.382, z=−3.550 m, heading 1.98 radians. E mounted the bike. The prompt changed from “Press E to ride the bike.” to “Press E to park the bike.”
- The bike entered the deck at x=8.566, z=−3.630 m. Its along-deck position was −3.198 m, and its centerline offset was 0.002 m.
- At the midpoint, x=11.297, z=−4.814 m, the bike stayed 0.002 m from the centerline. Bike height was 3.577 m. Deck height was 3.617 m.
- Ahaan's rig height was 7.878 m at the midpoint. The path height was 4.631 m. The rig followed the raised deck profile.
- The bike stayed on the deck through x=14.422, z=−6.169 m. The bike then reached the far bank at x=15.374, z=−6.582 m, and returned to path height.
- The wheels rotated 8.18 radians during the deck crossing. Chrome reported no browser errors.
- Screenshot: `/tmp/ahaan-bike-icecream/mississippi-bridge-first-midpoint.png`. Visual review showed Ahaan and the bike on the bridge deck.
- The bike's original parked position was restored after the check. Both Mississippi bridge crossings passed.

## Local commit — Nov 13, 2026

- Feature commit: `ee0688d` (`Add bike and ice cream feature`).
- The commit contains the bike and ice cream work, collision adjustments, and verification notes.
- The commit is local. No push was made.

## Aesop’s Fables — IN PROGRESS (Nov 12, 2026)

- Started branch `feature/aesops-fables` from `origin/main` at `8310cea`.
- Worktree: `.worktrees/aesops-fables`.
- Project Gutenberg confirms the edition title, translator, and 1912 publication.
- Source: https://www.gutenberg.org/files/11339/11339-h/11339-h.htm
- Catalog: https://www.gutenberg.org/ebooks/11339
- Catalog title: “Aesop’s Fables; a new translation.” Translator: V. S. Vernon Jones.
- The source text title page says “1912 Edition.” Gutenberg lists the original publication as New York: Avenel Books, 1912.
- All ten requested fables appear in this edition. The source uses these titles:
  1. “The Hare and the Tortoise” (brief: “The Tortoise and the Hare”).
  2. “The Fox and the Grapes.”
  3. “The Shepherd’s Boy and the Wolf” (brief: “The Boy Who Cried Wolf”).
  4. “The Lion and the Mouse.”
  5. “The Grasshopper and the Ants” (brief: “The Ant and the Grasshopper”).
  6. “The Fox and the Crow.”
  7. “The Wolf in Sheep’s Clothing.”
  8. “The Goose That Laid the Golden Eggs” (brief: “The Goose with the Golden Eggs”).
  9. “The Milkmaid and Her Pail.”
  10. “The Oak and the Reeds.”
- Title matches were checked against the Gutenberg contents and story headings.
- No story text had been copied at the time of source verification.
- Added only the first fable to `assets/aesop-data.js`, with the source title and moral label.
- The story text and moral match the Gutenberg text at the source URL above.
- Added the second fable, “The Fox and the Grapes,” with its exact source title and story text.
- The Gutenberg entry has no separate moral line. The displayed moral uses the story’s final sentence word for word.
- Added the third fable, “The Shepherd’s Boy and the Wolf,” with its source text and moral.
- The source moral is “You cannot believe a liar even when he tells the truth.”
- Added the fourth fable, “The Lion and the Mouse,” with its source title and story text.
- The Gutenberg entry has no separate moral line. The displayed moral uses the story’s final phrase word for word.
- Added the fifth fable, “The Grasshopper and the Ants,” with its source title and story text.
- The Gutenberg entry has no separate moral line. The displayed moral uses the Ants’ final statement word for word.
- Added the sixth fable, “The Fox and the Crow,” with its source title and story text.
- The Gutenberg entry has no separate moral line. The displayed moral uses the Fox’s final phrase word for word.
- Added the seventh fable, “The Wolf in Sheep’s Clothing,” with its source title and story text.
- The Gutenberg entry has no separate moral line. The displayed moral uses the source phrase “He completely deceived the shepherd”.
- Added the eighth fable, “The Goose That Laid the Golden Eggs,” with its source title and story text.
- The printed source moral is “Much wants more and loses all.”
- Added the ninth fable, “The Milkmaid and Her Pail,” with its source title and story text.
- The printed source moral is “Do not count your chickens before they are hatched.”
- Added the tenth fable, “The Oak and the Reeds,” with its source title and story text.
- The Gutenberg entry has no separate moral line. The displayed moral uses the Reeds’ exact phrase “we bow and yield to every breeze”.

### Page build and browser verification — Nov 13, 2026

- Added `aesop.html`, `assets/aesop-book.js`, and `assets/aesop-book.css`.
- Added one Aesop link to the home page footer and one to `sketchbook.html`.
- The contents page shows all ten fables. Search finds each title.
- All ten fable addresses opened the matching title and moral label.
- The first contents link opened the first fable. Next and Previous changed pages.
- Chrome checks passed at 1280 × 800 and 390 × 844.
- The mobile document width was 390 px. The page had no horizontal overflow.
- No JavaScript errors, console errors, or failed requests appeared.
- Screenshots: `/tmp/ahaan-aesops-fables/contents.png`, `fable-desktop.png`, and `fable-phone.png`.
- `node --check assets/aesop-book.js`, `node --check assets/aesop-data.js`, and `git diff --check` passed.

## Publish: bike + ice cream and Aesop's Fables — Nov 14, 2026

- Merged `feature/bike-ice-cream` into main: commit `63e994b` (bike feature `ee0688d`, record `e8a50b4`).
- Merged `feature/aesops-fables` into main: commit `7f0ddfa` (book `6ab184a`). HANDOFF.md had one conflict (both branches appended records); resolved by keeping both records, bike first.
- Fast-forwarded main from `dd564b2` to `origin/main 8310cea` first. The main worktree had an untracked coordinator HANDOFF.md (135 lines, Nov 9 Goku copy with the overnight queue). Backed up to `/tmp/HANDOFF-coordinator-2026-11-14.md` before the fast-forward. The tracked HANDOFF.md (487 lines) is the workers' record.
- Pushed `8310cea..7f0ddfa` to origin main.
- GitHub Pages deploy run `43596574039` ("Merge branch 'feature/aesops-fables'") completed success in 20 s, 2026-11-14T12:47:59Z.
- Live verified: https://ahaanthereader.github.io/portfolio/ (200), `assets/park3d.js` (200, 176,534 bytes, bike code live: "ride the bike", "Mississippi" x10), https://ahaanthereader.github.io/portfolio/aesop.html (200, 2,068 bytes, shell links all three Aesop assets), `assets/aesop-data.js` (200, 8,655 bytes, all ten fable titles and morals present).
- The local `AGENTS.md` modification (Karpathy worker rules, Nov 11) is still uncommitted in the main worktree. It was not part of this publish.
- Two-player PUBLISHED Nov 17 (merge 8495fdc, Pages run 44211964764, live-verified). Country Book v2 PUBLISHED Nov 17 (merge e05fc2f, Pages run 44221176304, live-verified).

## Next briefs - overnight queue (Goku, updated Nov 17, 2026)

1. FEATURE-BRIEF-bike-icecream.md — PUBLISHED live Nov 14 (63e994b)
2. FEATURE-BRIEF-aesops-fables.md — PUBLISHED live Nov 14 (7f0ddfa)
3. FEATURE-BRIEF-two-player.md — PUBLISHED live Nov 17, 2026 (merge 8495fdc, Pages run 44211964764 success, live-verified; HANDOFF record fix 3c2b456). Vihaan's shirt is RED.
4. FEATURE-BRIEF-country-book-v2.md — PUBLISHED live Nov 17, 2026 (merge e05fc2f, Pages run 44221176304 success, live-verified: 176 entries, desktop + mobile, zero console errors; record commit 990e2a1).
5. FEATURE-BRIEF-bike-speed-boost.md — PUBLISHED live Nov 16, 2026 (feature 669318a, merge 1b39ba5; Pages run 43995668330 success). Space = boost (8 m/s top), base top 4.15 → 5.5 m/s, accel 1.55 → 2.6, steering base 0.22 → 0.55; hint "Hold Space to go fast! 🚲💨" live on index.html.
6. FEATURE-BRIEF-vihaan-quad.md — PUBLISHED live Nov 18, 2026 (merge 8f35b6b, Pages run 44282760464 success in 19 s, live-verified: mount/ride/dismount pass, zero console errors, desktop 1280x800 + mobile 390x844). Vihaan's red four-wheel quad, parked at (2.45, 6.2) beside the bike, top speed 12 m/s, about 1.5x the boosted bike.
7. FEATURE-BRIEF-capitals-quiz.md — PUBLISHED live Nov 17, 2026 (merge 218ead7, Pages run 44200931157 success, live-verified: all four rounds, Stop button on every question, wrong answers never red; local commit e441a3c).
8. FEATURE-BRIEF-reading-aesop-link.md — PUBLISHED live Nov 18, 2026 (merge a8fe125, Pages run 44256079700 success, live-verified: reading.html 200 desktop + mobile, link visible, click opens aesop.html, zero console errors).
9. FEATURE-BRIEF-two-player-vehicles.md — QUEUED Nov 17, 2026 (Nishant's ask: Ahaan blue tee in two-player mode; quad, e-bike, 2-seater car, chopper parked outside the middle park with proper mechanics and physics; bike stuck fix first). Next for the idle two-player worker (1000090004) once screen capture is back. NOTE Nov 18, 2026: the Vihaan quad has LANDED on main (merge 8f35b6b). Reuse this quad in the vehicles build. Do NOT add a second quad to the park.
10. FEATURE-BRIEF-sally-home-page-improvements.md — PUBLISHED live Nov 19, 2026 (merge dd4156a, Pages run 44500957374 success, live-verified desktop + mobile: grouped nav, Country Book label, footer "Made with love by Ahaan.", focus rings solid 3px, zero console errors; local commit 2dafccd).
When one job finishes, start the next brief without waiting. Update this HANDOFF as you go.

## FEATURE-BRIEF-two-player-vehicles.md — bike baseline before changes — Nov 18, 2026

- Created `.worktrees/feature-two-player-vehicles` on `feature/two-player-vehicles` from main commit `4e6dcac`, which includes quad merge `8f35b6b`.
- Reused the merged quad. Did not add another quad.
- Reproduction used Chrome at 1280 × 800. Ahaan mounted the bike at `(-0.65, 6.2)` and held W south.
- Repro result: **PASS** — reproduced the stuck behavior at the recorded South Grove oak.
- Draft implementation spec: `_bmad-output/implementation-artifacts/spec-two-player-vehicles.md`.
- Shirt switch: `assets/ahaan-model.js` now supports live shirt palette changes. `assets/park3d.js` sets Ahaan to blue (`#2b6ea6`) when Play together is on and restores maroon (`#5a1d2d`) when off. Vihaan remains red (`#c9363e`).
- Reused the published quad. `assets/park3d.js` still has one `quadState`; no second quad was added.
- Syntax checks passed: `node --check assets/park3d.js` and `node --check assets/ahaan-model.js`.
- The bike crossed the central island's south bridge without stopping or wobbling. It continued south and stopped at the South Grove oak.
- Exact last safe bike position: `x = -0.65`, `z = 30.4945`. The oak is at `(0, 32)`. The collision threshold is 1.418 m; the next step enters that threshold.
- At the last sample, speed was 5.175 m/s and decreasing. The bike remained at the same coordinates while the collision check rejected forward movement.
- No bike code changed before this baseline record. Page errors: none.
- Reproduction harness: `/tmp/repro-middle-bike.cjs`.
- Fix: keep full movement when clear. If an obstacle blocks the full step, allow the safe axis movement so the bike can slide along the edge. Reduce speed at 1.8 m/s² while sliding and 5.5 m/s² when blocked head-on.
- Bike slide-fix step: confirmed the movement code keeps clear steps, tests safe-axis slide candidates after a blocked step, and uses the requested 1.8 m/s² and 5.5 m/s² deceleration rates. `node --check assets/park3d.js` passed.
- E-bike step: added one electric bike model and state at outer parking spot `(-13, 7)`. The spot is outside the central island and clear of the nearby bridge and recorded obstacles.
- E-bike top speed is 10.4 m/s. Ahaan mounts and dismounts with E and rides with WASD. Vihaan mounts and dismounts with Enter and rides with arrows when Play together is on.
- E-bike movement reuses park ground and obstacle checks. Blocked movement uses the same safe-axis slide, 1.8 m/s² slide deceleration, and 5.5 m/s² head-on deceleration as the bike. The e-bike adds no sound.
- `node --check assets/park3d.js` passed after the e-bike change.
- Two-seat car step: added one car model and state at outer parking spot `(-14, -8)`, clear of the central island and nearby rock.
- Car top speed is 16 m/s. The first boy to mount drives; the second boy takes the passenger seat. Each boy exits with E or Enter. The driver's usual keys control the car. If the driver exits first, the passenger takes the driver seat and the car stops.
- The car uses shared bridge surface and rider ground heights, water and obstacle checks, and safe-axis sliding. It decelerates at 1.8 m/s² while sliding and 5.5 m/s² when blocked head-on. The car adds no sound.
- `node --check assets/park3d.js` passed after the car change.
- Car-only follow-up: confirmed the single car state/model remains at `(-14, -8)`, outside the middle park. Top speed is 16 m/s. Ahaan exits with E; Vihaan exits with Enter. Each boy can occupy the driver or passenger seat. `node --check assets/park3d.js` passed on Nov 18, 2026.
- Chopper step: added one model and state at `(23, -20)`, on a clear outer spot outside the middle park and away from nearby trees. Space lifts to a 12.5 m altitude cap; Shift descends; W/A/S/D or arrows steer and move. The rotor spins up on mount. E or Enter cannot dismount above ground level. Movement reuses `blockedBikePosition` and the shared ground and bridge height helpers. The chopper adds no sound. `node --check assets/park3d.js` passed on Nov 18, 2026.
- Chopper browser checks used Playwright from `/Users/Nishant/dev-tools/browser-check` with `/tmp/chopper-browser-check.cjs`.
- Desktop (1280×800) and mobile (390×844) checks passed. Ahaan mounted, the rotor spun, Space lifted, W moved, E stayed blocked in flight, Shift descended, and E dismounted on the ground. Sound stayed off. Both viewports reported zero page errors.
- Screenshots: `/tmp/ahaan-chopper-check/desktop-airborne.png` and `/tmp/ahaan-chopper-check/mobile-airborne.png`.
- Initial visual inspection found Ahaan upright above the cabin. Added a seated leg pose and raised the rider slightly to align his hips with the cabin seat.
- The browser run exposed a ground-height reset that prevented Ahaan from rising. Added a chopper rider guard to the normal height update. The first parking spot also blocked forward movement near a pine; moved the chopper to `(23, -20)`, then both movement checks passed.
- `node --check assets/park3d.js` passed after the browser fixes.
- Pose follow-up: the durable desktop and mobile chopper checks passed again after the seated pose change. Both screenshots show bent knees over the cabin seat. Rotor spin, lift, movement, blocked airborne dismount, descent, grounded dismount, silent audio, and zero page errors passed at both viewport sizes. Screenshots remain `/tmp/ahaan-chopper-check/desktop-airborne.png` and `/tmp/ahaan-chopper-check/mobile-airborne.png`. `node --check assets/park3d.js` passed.
- Vehicles implementation commit: `812cb86` (`Add chopper and outer vehicles`), local on `feature/two-player-vehicles`; no push.
- Quad parking follow-up: moved the single reused quad to the clear outer spot `(23, 20)`. Updated `tests/quad-browser.cjs` to place both players near the quad. Durable browser check: `/Users/Nishant/dev-tools/browser-check/node_modules/playwright`; desktop 1280×720 mount, ride, and dismount passed with zero page errors. `node --check assets/park3d.js` and `node --check tests/quad-browser.cjs` passed.
- After the fix, the same southward ride crossed the island and bridge. It stopped at `(-0.65, 30.73975)` just outside the oak collision radius, with speed at 0 m/s.
- With W and A held from the stop, the bike steered around the oak and moved to `(-5.6258, 27.0204)` at 5.5 m/s. The bike did not remain stuck.
- `node --check assets/park3d.js` and `git diff --check` passed. The browser reproduction reported no page errors.
- The straight route showed one blocked spot. It did not show a wobble or a stop at the central south bridge.

## Bike speed boost — Nov 15, 2026

- Normal top speed: 4.15 → 5.5 m/s.
- Normal acceleration: 1.55 → 2.6 m/s².
- Steering base rate: 0.22 → 0.55 rad/s; the speed-based part and lean remain.
- Held Space boost top speed: 8 m/s, with 3.2 m/s² acceleration.
- Released boost above normal speed: ease down by 0.65 m/s².
- Chrome checks passed at 1280 × 800 and 390 × 844. Space boost, release, E dismount, touch hold, and riding hint passed. No console errors appeared.
- Screenshots: `/tmp/ahaan-bike-speed/parked.png`, `riding.png`, and `boosting.png`.

## Publish: bike speed boost — Nov 16, 2026

- Merged `feature/bike-speed-boost` into main: commit `1b39ba5` (feature `669318a`).
- Pushed `85852ef..1b39ba5` to origin main.
- GitHub Pages deploy run `43995668330` ("Merge branch 'feature/bike-speed-boost'") completed success.
- Live verified: https://ahaanthereader.github.io/portfolio/ (200), `assets/park3d.js` (200, 177,917 bytes, boost code live: `boostHeld`, Space handler, `actionBoostHint` toggle), live `index.html` contains the `actionBoostHint` hint element ("Hold Space to go fast! 🚲💨").
- The main worktree's uncommitted `AGENTS.md` modification (Karpathy worker rules, Nov 11) is still uncommitted. It was not part of this publish.
- Two-player PUBLISHED Nov 17 (merge 8495fdc, Pages run 44211964764, live-verified). Country Book v2 PUBLISHED Nov 17 (merge e05fc2f, Pages run 44221176304, live-verified).
## Two-player feature — Nov 13, 2026

- Created branch `feature/two-player` from commit `ee0688d` in `.worktrees/feature/two-player`.
- Source brief: `FEATURE-BRIEF-two-player.md` in the main checkout.
- Read the brief, queue entry, project instructions, and sensory-friendly spec.
- Mapped the model, input, activity, interaction, and camera code.
- Drafted `_bmad-output/implementation-artifacts/spec-two-player.md`. The spec records the control map, camera limit, actor-specific actions, and verification checks.
- Nishant approved the spec and implementation on Nov 13, 2026.
- Implementation now uses baseline commit `ee0688d1d4d6fee53e74f8ea1e48a1923263579a`.

## Two-player implementation results — Nov 17, 2026

- Nishant changed Vihaan's shirt from teal to red. Ahaan keeps his maroon shirt.
- Ahaan uses WASD and E. Vihaan uses arrow keys and Enter when the toggle is on.
- Shift with movement keys makes either boy run.
- Arrow keys do not steer Ahaan's bike. WASD still controls the bike.
- Both boys have separate prompts, ice-cream cones, timers, and trampoline actions.
- Vihaan followed the Mississippi deck height at x=11.5, z=−4.9 m. His rig and ground height both measured 8.00094 m.
- The camera follows the players' midpoint and zooms up to the existing 1.45 limit.
- A frustum limit preserves a 3.5 m horizontal margin. The limit adjusts when the viewport changes.
- Desktop and mobile frame checks kept both players within 0.90 NDC. The mobile screenshot shows both names and characters.
- Reduced motion kept the toggle active and skipped entry and exit waves.
- Browser checks passed for solo controls, both control sets, independent trampoline actions, both ice-cream cones, bridge height, bike isolation, camera bounds, and toggle cleanup.
- No browser page errors appeared. Sound stayed off.
- `node --check` passed for both source files and the browser test. `git diff --check` passed.
- Browser test: `tests/two-player-browser.cjs`. Screenshots: `/tmp/ahaan-two-player/desktop.png` and `/tmp/ahaan-two-player/mobile.png`.
- Implementation commit: `5a689a1f5d8417fc287a6b54305aa5019a754df2`.
- Merged to main Nov 17, 2026 (merge 8495fdc); pushed 218ead7..8495fdc; Pages run 44211964764 success; live-verified (toggle On, both boys, Vihaan red, zero console errors). HANDOFF record fix 3c2b456.

## Vihaan quad — Nov 18, 2026

- Resumed the first unblocked queue item after two-player mode landed.
- Worktree: `.worktrees/feature-vihaan-quad`, branch `feature/vihaan-quad`, based on `origin/main` at `990e2a1`.
- The worktree already had an uncommitted parked red quad model in `assets/park3d.js`. Preserved that work and will build on it.
- Bike top speed: 5.5 m/s normally and 8 m/s with Space boost. Quad target: 12 m/s, about 1.5 times the boosted bike speed.
- The park has no bike touch controls. No separate quad touch controls are planned.
- Code map: reuse `groundHeightAt`, bridge deck helpers, and bike obstacle checks. Add quad ride input before the current Vihaan walking arrow handler.
- Drafted `_bmad-output/implementation-artifacts/spec-vihaan-quad.md` with the ride controls, 12 m/s target, collision behavior, and browser checks.
- The current uncommitted model is red, with four wheels, a seat, and a handlebar. It is at `(2.45, 6.2)` beside the bike.
- Next: approve the spec, then implement the ride behavior and verify it in the browser.
- Nov 18 follow-up: headless Chrome loaded `index.html` with HTTP 200 and `Park3D` ready. No JavaScript page errors or failed requests appeared. Chromium logged WebGL `ReadPixels` GPU stall warnings.
- Quad-only test uses GPU-safe flags, a free local port, a direct DOM click for Play together, and a 30-second hard timeout. It failed at `mount`: Enter left `getQuadState().riding` false after Vihaan teleported to `(2.45, 6.2)`. Ride and dismount were not reached. No page errors were reported before the assertion.
- Browser test file: `tests/quad-browser.cjs`. Do not repeat this check until the mount failure is corrected.
- Mount diagnosis: Enter depended on `vihaanNearbyItem.id === "quad"`; another nearby item could replace that item. Added a direct 2.2 m quad-distance fallback in Enter handling. The one permitted retest still failed at mount: Enter left `getQuadState().riding` false. Ride and dismount were not reached. No page error was reported before the assertion. `node --check assets/park3d.js` passed. Stop quad browser checks and request direction.
- Minimal mount probe (no full quad test): with Play together enabled, teleport placed Vihaan at (2.45, 6.2), getVihaanNearbyItem() returned quad, and riding started false. Dispatching Enter on window changed riding to true and nearby item to null. Proximity updates correctly, the Enter quad branch runs, and toggleQuadRide() writes the same quadState object exposed by getQuadState(). The earlier test's Enter event did not reach the branch; focus-target handling is the likely difference between page.keyboard.press() and window dispatch. Probe added getVihaanNearbyItem() for inspection. No full quad test was run.
- Quad check follow-up: changed both Enter actions in tests/quad-browser.cjs to dispatch a bubbling KeyboardEvent on window. Kept GPU-safe flags, port-0 binding, and the hard timeout. The one full check failed at mount again: riding remained false after Enter. Ride and dismount did not run. This test path differs from the successful minimal probe, so the assumed focus-target cause is not confirmed. No commit; branch is not ready for publish verification.
- Quad test timing follow-up: replaced the 100 ms delay with waitForFunction(getVihaanNearbyItem() === quad), dispatched Enter keyup and keydown, and logged pre/post state. The single run timed out at move-vihaan-near-quad before Enter. Thus proximity never became quad in the full test after teleport; the branch log did not run. The full check differs from the minimal probe at this point. Mount, ride, and dismount remain unverified.
- Quad teleport comparison: both scripts call Park3D.teleportVihaan(2.45, 6.2), which sets coordinates and recomputes proximity synchronously. In the full check, the immediate log showed together=true, position (1.4700, 3.7201), and nearby=null. A frame clamps Vihaan to maxPlayerSeparation from Ahaan at origin: the requested point is 6.67 m away, but the allowed distance is 4 m. The probe dispatches Enter before the next animation frame can clamp Vihaan. Full check then waits forever for quad proximity. Exact difference: probe's immediate Enter precedes the separation clamp; full check's proximity wait yields to the frame and the clamp moves Vihaan outside quad radius. No Enter changes made in this step. Mount, ride, and dismount remain unverified.
- Quad-only browser check setup fix: moved Ahaan to (0, 6) before enabling Play together, so Vihaan can reach the quad without separation clamping. One full run passed: mount pass, ride pass, dismount pass, zero page errors. The quad moved forward under ArrowUp. Check: tests/quad-browser.cjs. Branch is ready for publish verification; no publish or push performed.
- Published Nov 18, 2026: merged to main as 8f35b6b (HANDOFF conflict resolved by hand: kept the two-player publish record and the full quad section; dropped only the stale "branch contains local commits only" line), pushed b58ffbe..8f35b6b; GitHub Pages run 44282760464 success in 19 s; live verified on the deployed site with /tmp/ahaan-quad-live.cjs — desktop 1280x800: mount pass, ride pass, dismount pass, zero page errors, quad z 6.2 to 6.308625, speed 0.52; mobile 390x844: mount pass, ride pass, dismount pass, zero page errors, quad z 6.2 to 6.347125, speed 0.63; live index.html 200, park3d.js 200, tests/quad-browser.cjs 200; screenshots /tmp/ahaan-quad-live/quad-riding-desktop.png and quad-riding-mobile.png.

## Sally home page improvements — Nov 19, 2026

- Goku dispatched queue item 10 from `FEATURE-BRIEF-sally-home-page-improvements.md`.
- Read Sally's review and the implementation brief. No planning or implementation artifacts exist in the new worktree.
- Created `.worktrees/feature-sally-home-page-improvements` on `feature/sally-home-page-improvements` from main commit `a435570`.
- The build workflow identified five independently shippable changes: add the grouped home navigation, rename the shared Country Book link, replace footer placeholder copy, wrap fit-screen intros, and add global focus rings.
- Added the home navigation groups `Read`, `Explore`, `Play`, and `My stuff` in `index.html`.
- Kept all 16 existing navigation destinations and left the candy drawer unchanged.
- Checked the group labels, destination files, and candy drawer. No other brief items changed.
- Completed R12: changed the shared navigation label from `Sketchbook` to `Country Book` on every page with the grouped nav. Kept the `sketchbook.html` destination.
- Completed R13 on the home page: replaced the footer placeholder with `Made with love by Ahaan.` No other footer or Journey copy changed.
- Completed R15 in `assets/site.css`: fit-screen intro paragraphs now wrap naturally instead of clipping to one line. This prevents horizontal overflow from long intro text.
- Completed R3: verified the existing global `button:focus-visible, a:focus-visible` rule in `assets/site.css`. It uses a 3 px `var(--ink)` outline with a 2 px offset. No duplicate rule was needed.
- Published Nov 19, 2026: merged to main as dd4156a, pushed a435570..dd4156a; GitHub Pages run 44500957374 success in 23 s; live-verified on ahaanthereader.github.io/portfolio with the durable harness — desktop 1280x800 + mobile 390x844: grouped nav (Read/Explore/Play/My stuff), Country Book label, footer "Made with love by Ahaan.", focus outline solid 3px, no horizontal scroll, zero console errors. Acceptance checks run locally before publish (no passing record existed in HANDOFF); desktop footer hidden by the pre-existing .page-home footer rule, copy verified in live HTML and visible on mobile.

## Fresh Drops — Nov 21, 2026

- Goku placed `FEATURE-BRIEF-release-notes.md` at the top of the brief queue.
- Created `.worktrees/feature-fresh-drops` on `feature/fresh-drops` from main commit `1e8ac9a`.
- Read the brief and confirmed the seed publish dates against this HANDOFF. The bridge feature published on Nov 10, 2026.
- First publish, spacing fix, follow-up publish, and live verification passed.
- Standing rule: add a dated Fresh Drops entry with its live publish screenshot during every future site publish. Do not add an entry without its screenshot. Update the home card's latest date with each new entry.
- Built `fresh-drops.html` with 13 dated entries in newest-first order. Each entry has a live-site screenshot, kid-readable copy, and a Try it instruction.
- Added a Fresh Drops link to the home page's My stuff menu and a visible home card. The card shows `NEW` when its latest entry is within seven days.
- Added date-based `NEW` badges to fresh entries. The Nov 21 local check showed nine fresh entries.
- Captured 12 seed screenshots from the live site at 1280 × 800. Saved optimized JPEGs in `public/fresh-drops/`.
- The first publish added a Fresh Drops entry for this page. Its screenshot is `/private/tmp/fresh-drops-live/fresh-drops-desktop.png`, saved as `public/fresh-drops/2026-11-21-fresh-drops.jpg`.
- Durable local browser check passed: desktop 1280 × 800 and mobile 390 × 844; home card and nav link opened the page; candy drawer opened and closed; all 13 images loaded; no horizontal overflow; zero console or page errors. Screenshots: `/private/tmp/fresh-drops-local/`.
- `node --check assets/fresh-drops.js` and `git diff --check` passed.
- Date note: the vehicles branch merged as `a435570` on Nov 18. HANDOFF has no separate Pages run for that feature. The Nov 19 Sally Pages run `44500957374` is the next recorded full-site publish and includes the merge.
- First publish: merge `7b745ea` (`Publish Fresh Drops release page`), pushed `1e8ac9a..7b745ea`; GitHub Pages run `44885800007` completed successfully.
- First live verification passed on Nov 21. Desktop and mobile showed 12 entries, eight NEW entry badges, all images loaded, no horizontal overflow, and zero page or console errors. Screenshots: `/private/tmp/fresh-drops-live/`.
- Visual follow-up: removed inherited section padding that left a large gap above the cards. Added the Nov 21 Fresh Drops page entry with a screenshot from the first live publish. Updated the home card's latest date to Nov 21.
- The follow-up local browser check passed at 1280 × 800 and 390 × 844. The page showed 13 entries and nine NEW badges. All images loaded. No horizontal overflow or page errors appeared.
- Feature commits: `470639e` (`Add Fresh Drops release page`) and `0def0a3` (`Polish Fresh Drops page`).
- Second publish: merged as `6936351`, pushed `7b745ea..6936351`; GitHub Pages run `44891647142` completed successfully.
- Final live verification passed on desktop 1280 × 800 and mobile 390 × 844. Both views showed 13 entries; desktop showed nine NEW badges. All images loaded, no horizontal overflow appeared, and zero page or console errors appeared.
- Final live screenshots: `/private/tmp/fresh-drops-live-final/fresh-drops-desktop.png`, `fresh-drops-mobile.png`, `home-desktop.png`, and `home-mobile.png`.

## Park 2-player walking pass — Nov 21, 2026

- Created `.worktrees/feature-two-player-walking` on `feature/two-player-walking` from `origin/main` at `6936351adac1fce1177b4edfa40aa82bfb2ff166`.
- Ran `tests/two-player-browser.cjs` with the durable browser-check Playwright module. The suite passed on desktop and mobile. Bridge height matched at 8.00094 m. Both players stayed in frame, and page errors were empty. Evidence: `/tmp/ahaan-two-player/`.
- The walking-direction probe covered all four directions and four diagonals for both boys. Both boys also walked north at the same time. The desktop run sampled only three animation frames in 350 ms.
- The probe measured 0.68 m of north movement in 350 ms (1.94 m/s), below the 6.8 m/s walking speed. The animation loop capped every frame at 0.05 s, so slow frames dropped walking distance.
- Earlier probe attempts failed their test thresholds: 0.34 m in 200 ms (<0.70 m), 1.02 m in 600 ms (<2.00 m), and diagonal direction dot 0.952 (<0.96). These limits were too strict for the low-frame sample and sequential key dispatch. The final probe uses browser key event times and a 0.90 diagonal direction threshold.
- A post-fix speed assertion also failed at 3.71 m/s because it included Playwright dispatch overhead. The final probe measured from browser keydown through keyup instead.
- Fixed walking displacement and both foot cycles to use elapsed time capped at 0.2 s. Other park animation still uses the existing 0.05 s cap.
- The post-fix probe passed for both boys in four directions and four diagonals. Both boys walked north together. The 350 ms cardinal sample increased from 0.68 m before the fix to 2.72 m after the fix.
- Desktop and mobile screenshots show both boys in frame. The probe reported zero page errors. `node --check assets/park3d.js` passed.
- Screenshots: `/tmp/ahaan-two-player-walking/walking-desktop.png` and `walking-mobile.png`.
- Feature commit: `b8c349e` (`Fix Park walking speed on slow frames`). Handoff correction commit: `18e15d3` (`Refresh release handoff status`).
- First publish: merged to main as `0f095c0`, pushed `6936351..0f095c0`. GitHub Pages run `44914958144` completed successfully.
- First live verification passed with the durable browser harness. Desktop 1280 × 800 and mobile 390 × 844 passed eight-direction movement for both boys and simultaneous walking. Page errors, console errors, and failed requests were empty. Both players remained in frame.
- Live screenshots: `/tmp/ahaan-two-player-live-walking-44914958144/walking-desktop.jpg` and `walking-mobile.jpg`. The desktop screenshot is saved as `public/fresh-drops/2026-11-21-two-player-walking.jpg`.
- Mobile visual review found the two player labels overlap when the boys stand close. The Fresh Drops home card also covers part of the Vihaan label. Record this for the next walking review; this publish does not change label placement.
- Added the Nov 21 Fresh Drops entry `Walk together in the park` with the live desktop screenshot. The home card already has the Nov 21 latest date.
- Entry commit: `8860622` (`Add walking fix to Fresh Drops`).
- Second publish: merged as `6d9490a`, pushed `0f095c0..6d9490a`. GitHub Pages run `44918968152` completed successfully.
- Final live verification passed with the durable browser harness. Desktop and mobile walking probes passed for both boys in four directions and four diagonals. Simultaneous walking passed. Fresh Drops showed 14 entries, the new image loaded at 1280 pixels wide, and the home card date was `2026-11-21`. No horizontal overflow, page errors, console errors, or failed requests appeared.
- The combined run first captured the Fresh Drops route at 390 pixels wide. A separate check then passed at 1280 × 800 and 390 × 844.
- Final walking screenshots: `/tmp/ahaan-two-player-final-live-44918968152/walking-desktop.jpg` and `walking-mobile.jpg`.
- Final Fresh Drops screenshots: `/tmp/fresh-drops-final-desktop-44918968152/fresh-drops-desktop.png` and `fresh-drops-mobile.png`.

## Story Studio delete confirmation and undo — Nov 21, 2026

- Goku placed `FEATURE-BRIEF-story-studio-delete-confirm.md` next in the brief queue.
- Created `.worktrees/feature-story-studio-delete-undo` on `feature/story-studio-delete-confirm-undo` from `origin/main` at `6831b033f338780cf19ed8165eefdd4b5770bcf5`.
- Applied the ponytail skill at full level. Reuse existing Story Studio buttons and toast styles. No dependency or shared abstraction is needed.
- `assets/story.js` deletes the current page and saves the remaining story in local storage. The undo action must restore that page and save it again.
- Added a native confirmation dialog and a five-second Undo toast. The first browser check failed because the toast's flex style overrode its hidden state. Scoped flex display to the visible toast and kept the failed result recorded.
- Keep it and Escape close the dialog without changing the story. Delete stores the current page and index. Undo restores both and saves the story. Starting a new book clears a pending undo.
- Added `tests/story-delete-browser.cjs` with the durable Playwright harness. Desktop and mobile checks passed. The test covered Keep it, Escape, Delete, five-second expiry, page text and sticker restoration, new-book cleanup, dialog bounds, a 44 px Undo target, horizontal width, and zero browser errors.
- Browser evidence: `/tmp/ahaan-story-studio-delete/desktop-undo.png`, `mobile-confirm.png`, and `mobile-undo.png`.
- `node --check assets/story.js`, `node --check tests/story-delete-browser.cjs`, and `git diff --check` passed.
- The dialog says “Delete this page?” because the existing button removes one page, not the whole story.
- Feature commit: `54884f0` (`Add Story Studio delete undo`).
- First publish: merged as `385c228`, pushed `6831b03..385c228`. GitHub Pages run `44981555261` completed successfully.
- First live verification passed with the durable Playwright harness at 1280 × 800 and 390 × 844. Keep it, Escape, delete, undo, five-second expiry, and new-book cleanup passed. No page or console errors appeared.
- Live screenshots: `/tmp/ahaan-story-studio-delete-live/desktop-undo.png`, `mobile-confirm.png`, and `mobile-undo.png`.
- Added the Nov 21 Fresh Drops entry `Undo a deleted page` with the live desktop screenshot. The home card already has the Nov 21 latest date.
- Entry commit: `5617747` (`Add Story Studio undo to Fresh Drops`).
- Second publish: merged as `eb5dc1f`, pushed `385c228..eb5dc1f`.
- Pages run `44983727222` failed twice. Attempt one found no artifact. Attempt two found duplicate `github-pages` artifacts after rerunning the job.
- Clean workflow-dispatch Pages run `44991263301` succeeded.
- Final live Story Studio checks passed at 1280 × 800 and 390 × 844. Keep it, Escape, Delete, Undo, five-second expiry, and new-book cleanup passed. No page or console errors appeared.
- Final live Fresh Drops check showed 15 entries. The new image loaded at 1280 pixels wide. Desktop and mobile had no horizontal overflow. The home card date was `2026-11-21`. Page errors, console errors, and failed requests were empty.
- Final live screenshots: `/tmp/ahaan-story-studio-delete-live/desktop-undo.png`, `mobile-confirm.png`, and `mobile-undo.png`; `/tmp/story-studio-fresh-drops-live-44991263301/fresh-drops-desktop.png` and `fresh-drops-mobile.png`.
