# Ahaan Park — click-to-go for ALL vehicles (bike, e-bike, quad, car, chopper) + chopper sound/design/height

**Asked by:** Nishant, Sat Nov 21, 2026, 9:04 PM CT (typed from the Mac): "ahaan is loving chopper but give him like click to a point and chopper goes there - apart from the arrow option s"
**Project:** Ahaan's World, 3D Park (index.html, `assets/park3d.js`, worker 0004).
**Queue position:** After Story Studio delete-confirm + undo (current brief). Math Dash stays the Codex cloud pilot — do not touch it.

## Scope widened (Nishant, Nov 21, 9:10 PM CT)
"For ahaan same goes fot any vheicle bike chopper - just point to an area an bike chopper goes there" — click-to-go applies to **every vehicle**: bike, e-bike, quad, 2-seater car, and chopper. Point at an area → the vehicle he is riding goes there. The chopper details below are the template; apply the same pattern to all vehicles (ground vehicles drive there on the ground, chopper flies there at cruising height).

## What to build
The chopper (parked at (23, -20); rotor spin on mount; airborne dismount blocked) is currently flown with arrow keys. Add **click-to-a-point flight** as an additional control, keeping arrows working exactly as now. Then apply the same click-to-go to bike, e-bike, quad, and car:

1. While mounted/flying the chopper, clicking or tapping a point on the ground sets a fly-to target. The chopper flies there smoothly at its normal flight altitude and speed, turning toward the target, then hovers over the point (or settles to its normal hover) until the next input.
2. Arrow keys (and any existing steering) still work at all times — pressing an arrow cancels the click target and returns control to manual flight immediately.
3. Show a small, calm target marker where he clicked (soft ring/dot on the ground that fades when the chopper arrives) so he can see where it is going. No flashing, no red.
4. Works with mouse click (desktop 1280x800) and tap (mobile 390x844). In Play together mode, the click applies to the chopper of the player who is flying it; do not steal the other player's input.
5. Keep all existing chopper rules: rotor spin on mount, airborne dismount blocked, separation clamp and camera framing unchanged.

## Additions (Nishant, Nov 21, 9:05 PM CT)
6. **Chopper sound on start:** When the chopper starts (mount/engine on), play a chopper rotor sound. Keep it kid-friendly volume, loop gently while flying, stop on dismount. Start audio only after a user gesture (browser autoplay rules) — the mount click/keypress counts. Add a mute-friendly behavior: respect any existing site sound toggle if present; never blast.
7. **Improve the chopper design:** Make the chopper look better — clearer body, canopy/windows, tail + tail rotor, skids, nicer colors matching Ahaan's blue. Keep it light (no heavy models that slow mobile). Show before/after screenshots in the Fresh Drops entry.
8. **Default flight height over everything:** By default the chopper flies at a height that clears everything in the park (trees, bridges, buildings) — no clipping through obstacles. Click-to-fly and arrow flight both use this safe cruising height. Landing/dismount still works as now.

## Acceptance checks (additions)
- Mount chopper: rotor sound starts; dismount: sound stops; no audio errors in console.
- New design visible desktop + mobile screenshots; still smooth FPS on mobile size.
- Fly across the park (arrows + click-to-fly): chopper stays above trees/bridges/buildings, zero clipping.
- Mount chopper, click a far ground point: chopper flies there smoothly and hovers over it; marker shows and fades on arrival.
- Same click-to-go for bike, e-bike, quad, car: mount, click a far point, vehicle drives there smoothly on the ground (respecting bridges/ground, no wall-clipping) and stops at the marker; arrow press cancels and manual control resumes.
- Press an arrow mid-flight: click target cancels, manual control resumes instantly.
- Tap-to-fly works on mobile size; desktop + mobile, zero page errors.
- Existing checks still pass: `tests/two-player-browser.cjs`, quad/vehicles browser checks (chopper mount/ride/dismount, airborne-dismount block).
- Publish on driver authority + live-verify + Fresh Drops entry WITH screenshot of click-to-fly (standing rule: no entry without its screenshot).

## Notes
- Sensory-friendly: smooth motion, no sudden snaps, no flashing.
- Do not copy code from Vihaan's Room Life repo; this is Ahaan's Park chopper only.
