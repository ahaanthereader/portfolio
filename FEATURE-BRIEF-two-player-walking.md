# Brief: Park — 2-player + walking improvement pass (Ahaan's World)

From Nishant (Nov 20, 2026): "improve 2 player and both websites - walking is off - test yourself and fix issues you see - drive it over the night."

## Context
- 3D park on index.html (assets/park3d.js): Play together mode, Ahaan blue / Vihaan red, vehicles — quad (23, 20), chopper (23, -20), e-bike (-13, 7), 2-seater car (-14, -8); shared groundHeightAt(), soft collision, clampPlayerSeparation().
- Nishant reports walking is off — find what remains after the Nov 18 vehicles publish.
- Sensory-friendly rules hold: calm motion, no red error states, no flashing, no harsh sounds. Simplified Technical English in any kid-facing text.

## Do this, in order
1. Baseline: run the existing checks and record pass/fail with numbers — two-player-browser, quad-browser, vehicles live check (use the durable harness: PLAYWRIGHT_MODULE=/Users/Nishant/dev-tools/browser-check/node_modules/playwright). One persistent VQA dir per suite — reuse it, do not mint new dirs per rerun.
2. Fresh-eyes playtest (desktop 1280x800 + mobile 390x844): both boys walk all 4 directions + diagonals; mount/ride/dismount every vehicle with BOTH players present; car driver + passenger seats; chopper airborne-dismount block; bike slide around the South Grove oak; bridges. Look for: heading drift or veering, foot sliding, separation clamp yanking a player unexpectedly, camera losing a player, vehicle rider pose errors, mount failing at range, toggle off resetting vehicles to parking spots.
3. Fix every issue you find, one at a time. After each fix, re-run the affected check and record the result. A failed check stays recorded as failed — never quietly turn it into a pass.
4. Two-player specifics to verify with numbers: both boys move simultaneously without either freezing; camera keeps both in frame at max separation; each vehicle mount/ride/dismount works for each boy; toggle off → vehicles home, Vihaan gone, no console errors.
5. Publish: merge to main, push, wait for Pages, live-verify desktop + mobile with zero console errors. Record the publish in HANDOFF.md.
6. Fresh Drops standing rule: this publish gets a Fresh Drops entry (date + what changed + Try it line + screenshot of the live feature from publish verification). No entry without its screenshot.

## Report back
- Baseline results, each issue found + fixed (with the check result after), publish merge + Pages run + live-verify result.
