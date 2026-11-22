# Ahaan Park — bigger center, expanded park, realistic rippling water

**Asked by:** Nishant, Sat Nov 21, 2026, 9:13 PM CT (typed from the Mac, with top-view screenshot of the park): "Make middle part bigger - it's becoming to conjusted + expand the park all over - make water more real with ripples and all"
**Project:** Ahaan's World, 3D Park (index.html, `assets/park3d.js`, worker 0004).
**Queue position:** After Story Studio delete-undo → click-to-go all vehicles + chopper sound/design/height → train + cars-moved-out → car improve + fire truck. IMPORTANT sequencing: if the train track has not been built yet when this runs, lay the perimeter track and vehicle parking spots on the NEW expanded layout (do not build the train on the old small layout and then move it). Math Dash stays the Codex cloud pilot — do not touch it.

## What to build
1. **Bigger middle:** The center island (Arkansas — swings, picnic blanket, trampoline, play structures) is congested. Make the middle part noticeably bigger so everything has breathing room: spread the play structures, picnic area, and paths out. Keep all existing items (swings, slide, trampoline, picnic, signs) — just roomier.
2. **Expand the whole park:** Grow the park overall — larger island/world, state circles (Arkansas center, Oklahoma, Texas, and the others) spread further apart, longer paths and bridges scaled to match. Vehicle spots, bridges, and (if built) the train perimeter follow the new layout. Camera framing + Top View must still show the park well (adjust default zoom/framing if needed so nothing feels cut off).
3. **Real water with ripples:** Make the water look real — animated ripples (gentle expanding ripple rings and/or a soft ripple shader), subtle wave motion, nicer water color/depth shading at edges. Keep it calm and sensory-friendly: slow, gentle ripples, no flashing or harsh sparkle. Ripples should be visible in both normal view and Top View.

4. **Lazy river + splash zone (Nishant, Nov 21, 9:13 PM CT):** "Also laze river have some plash zone with water an all" — add a **lazy river**: a slow, gentle water channel loop (around the center island or a section of the park) with calm flowing water the boys can wade/float in. Add a **splash zone**: a water play area with gentle sprinklers / splash pads / small fountains where Ahaan (and Vihaan in Play together) can run through and get splashed — soft water arcs and ripples, kid-friendly, no harsh jets. Boys entering the splash zone get a happy splash effect (water droplets, ripple rings around feet). Keep all water calm and sensory-friendly.

## Acceptance checks (additions)
- Lazy river loop present with gently flowing water; boys can enter/wade in it.
- Splash zone: sprinklers/fountains animate gently; walking through triggers splash droplets + ripple rings; works for both boys in Play together.
- Center island visibly roomier in before/after screenshots (desktop 1280x800 + mobile 390x844); all play items still present and reachable.
- Whole park expanded: state circles further apart, paths/bridges connect cleanly, no floating/clipped geometry.
- Water shows animated ripples (two screenshots a moment apart differ); calm motion.
- Everything still works on the new layout: walking (both boys), bike/e-bike/quad/car/chopper (+ fire truck/train if built), click-to-go, separation clamp, camera framing. Existing checks pass: `tests/two-player-browser.cjs`, quad/vehicles checks.
- Publish on driver authority + live-verify + Fresh Drops entry WITH screenshot of the expanded park + rippling water (standing rule: no entry without its screenshot).

## Notes
- Keep performance smooth on mobile (ripple effect must stay light).
- Do not copy code from Vihaan's Room Life repo; this is Ahaan's Park only.
