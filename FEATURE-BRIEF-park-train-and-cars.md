# Ahaan Park — train loop + stations, cars moved out

**Asked by:** Nishant, Sat Nov 21, 2026, 9:06 PM CT (typed from the Mac): "Also cars need to be moved slighly further away from center + Add a train track around the park outer perimeter and have ahaan use the train - make a train staion where he can just hop in and hop off to different stations"
**Project:** Ahaan's World, 3D Park (index.html, `assets/park3d.js`, worker 0004).
**Queue position:** After Story Studio delete-confirm + undo, then chopper click-to-fly/sound/design/height. Math Dash stays the Codex cloud pilot — do not touch it.

## 1. Cars further from center
The 2-seater car (currently parked around (-14, -8)) sits too close to the park center. Move its parking spot slightly further out toward the park edge — still easy to reach on foot, still clear of bridges/paths. Keep everything else: driver + passenger seat, 16 m/s top speed, toggle-Off reset returns it to the new spot. If the e-bike/quad spots crowd the center too, nudge only the car (his ask names cars) unless a spot physically overlaps.

## 2. Train track + stations
Build a small park train Ahaan can actually ride:

1. **Track:** A loop of track around the outer perimeter of the park island (inside the water/bridges, following the island edge). Visible rails + sleepers, gentle curves, no steep grades.
2. **Train:** A cute little engine + 1-2 carriages that run on the loop. Smooth, calm speed (kid-friendly, no jerking). Train stops at each station briefly, then continues.
3. **Stations:** 3-4 small stations around the loop (simple platform + sign with a friendly name, e.g. near the ice-cream spot, the bridges, the south grove — pick spots that fit the existing layout). Each station is a hop-on/hop-off point.
4. **Hop in / hop off:** Walk up to a station platform (or the stopped train) → prompt pill "Press E to ride the train" (match existing vehicle prompts) → Ahaan sits in the carriage and rides. At any station stop, prompt to hop off; he steps onto that platform. He can ride past stations and get off at a different one. In Play together mode, both boys can board the same train; each hops off independently.
5. Keep it sensory-friendly: smooth motion, gentle sounds only if the site already has vehicle sounds (no loud whistle blasts), no flashing.

## Acceptance checks
- Car parks at the new outer spot; mount/drive/passenger/reset still work (desktop 1280x800 + mobile 390x844, zero errors).
- Track loops the full perimeter; train runs the loop and stops at every station.
- Hop on at one station, ride, hop off at a different station — works for Ahaan solo and both boys in Play together.
- Existing checks still pass: `tests/two-player-browser.cjs`, quad/vehicles checks (quad, chopper, e-bike, car unchanged apart from car spot).
- Publish on driver authority + live-verify + Fresh Drops entry WITH screenshot of the train at a station (standing rule: no entry without its screenshot).

## Notes
- Keep models light for mobile; reuse park materials/colors where sensible.
- Do not copy code from Vihaan's Room Life repo; this is Ahaan's Park only.
