# Ahaan Park — improve the car + fire truck (Ahaan drives, Vihaan sprays)

**Asked by:** Nishant, Sat Nov 21, 2026, 9:11 PM CT (typed from the Mac, with screenshot of the current tan car): "Improve the car and also add a fire truck to it which ahaan can start vihaan can sit where he can spray on any seid using it while ahaan drives in 2 player mode" (read: Ahaan starts/drives the fire truck, Vihaan sits in it and can spray on any side while Ahaan drives, in 2-player mode).
**Project:** Ahaan's World, 3D Park (index.html, `assets/park3d.js`, worker 0004).
**Queue position:** After Story Studio delete-undo → click-to-go all vehicles + chopper sound/design/height → train + cars-moved-out. The car design improvement may ride with the cars-moved-out brief if cleaner; the fire truck is its own feature. Math Dash stays the Codex cloud pilot — do not touch it.

## 1. Improve the car
The current 2-seater car (screenshot: plain tan box body) looks basic. Improve its design: proper car body shape, windows/windshield, 4 visible wheels that turn, headlights, nicer color (keep it clearly Ahaan's car). Keep all mechanics: driver + passenger seat, 16 m/s, click-to-go + arrows, toggle-Off reset to its (new, further-out) parking spot. Light model for mobile.

## 2. Fire truck — Ahaan drives, Vihaan sprays
New vehicle: a fire truck parked in the park (pick a clear spot near the other vehicles, not crowding the center).

1. **Look:** Red fire truck — cab, ladder on top, hose reel, lights (calm, no strobing/flashing lights — steady glow only, sensory-friendly), 4 wheels. Kid-friendly proportions.
2. **Ahaan drives:** Ahaan mounts as driver and starts/drives it (arrows + click-to-go, same as other vehicles). Solo mode: Ahaan can drive it alone.
3. **Vihaan rides + sprays (2-player):** In Play together mode, Vihaan sits in the passenger/operator seat. While Ahaan drives, Vihaan aims the hose to **any side** (left, right, front, back — aim with Vihaan's movement keys, arrows) and sprays water (hold his action key, Enter) — a smooth water spray/arc with splash where it lands. Spray works while the truck is moving and while stopped. Vihaan's spray input must not steer the truck; Ahaan's driving input must not aim the hose.
4. **Solo spray:** If Ahaan is alone in the truck, let him spray too (aim with arrows while stopped, or spray forward) — keep it simple and say how in the hint pill. (Nice-to-have; 2-player spray is the must-have.)
5. Hint pills match existing vehicle prompts ("Press E to drive the fire truck", passenger: "Hold Enter to spray").
6. Gentle water sound while spraying is welcome if the site's vehicle sounds exist; keep volume kid-friendly, stop when spray stops. No siren blasts.

## Acceptance checks
- Improved car visible in desktop 1280x800 + mobile 390x844 screenshots; drive/passenger/click-to-go/reset still work.
- Fire truck: Ahaan drives (arrows + click-to-go); in Play together Vihaan boards, aims hose to all four sides and sprays while Ahaan drives; water lands with splash; inputs don't cross.
- Existing checks still pass: `tests/two-player-browser.cjs`, quad/vehicles checks (bike, e-bike, quad, car, chopper unchanged apart from car look).
- Publish on driver authority + live-verify + Fresh Drops entry WITH screenshot of Vihaan spraying from the moving fire truck (standing rule: no entry without its screenshot).

## Notes
- Sensory-friendly: smooth motion, no flashing/strobing, calm sounds.
- Do not copy code from Vihaan's Room Life repo; this is Ahaan's Park only.
