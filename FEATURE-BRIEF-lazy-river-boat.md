# Ahaan Park — lazy river boat

**Picked by:** Nishant, Sat Nov 21, 2026, 9:14 PM CT (from Goku's suggestions list, #4): "Lazy River Boat — chhoti boat lazy river me chalaye, bridges ke neeche se jaye". **Inspiration (Nishant, 9:16 PM CT): the boys just saw one in the Oklahoma City (Bricktown) canal** — style the boat like a canal boat (flat-bottomed canal cruiser with bench seats) so it feels like the one they saw.
**Project:** Ahaan's World, 3D Park (index.html, `assets/park3d.js`, worker 0004).
**Queue position:** AFTER the park expand + water brief (FEATURE-BRIEF-park-expand-water.md) — the boat needs the lazy river built first. Then this brief. Math Dash stays the Codex cloud pilot — do not touch it.

## What to build
A small boat Ahaan can ride on the lazy river:

1. **Boat:** A proper little boat (rowboat style with a pointed bow, benches/seats, oars — NOT a tub shape) docked at a small dock on the lazy river. **Two seats: Ahaan and Vihaan both sit in the boat together** (Nishant, Nov 21, 9:15 PM CT: "have ahaan and vihaan sit in that boat - remove the tub instea let's run the boat which AV can hop on and hop off"). Ahaan walks to the dock → prompt pill "Press E to ride the boat" → he sits in the boat; in Play together Vihaan boards and sits beside him. Either boy can hop on and hop off at the dock/bank stops independently.
2. **Ride:** The boat floats along the lazy river with the gentle current. Steering: arrows (and click-to-go like other vehicles — point at a spot on the river, boat goes there). Boat passes **under the park bridges** (clearance checked — boat + seated Ahaan fit under every bridge on its route).
3. **Hop on / hop off:** At the dock (or any calm bank spot) prompt to hop off; the boy steps back onto land. Both boys hop on/off independently — one can get off while the other keeps riding. In Play together, Vihaan sits in the second seat and rides along; solo, Ahaan rides alone in either seat.
4. **Feel:** Gentle bobbing on the rippling water, soft wake/ripples behind the boat, calm speed. Sensory-friendly, no splashing chaos.
5. If the lazy river loops the center island, the boat route follows the loop; if the river is a channel section, the boat goes end to end and turns around gently at the ends.

## Acceptance checks
- Dock → board → ride the full lazy river route, passing under bridges with no clipping (desktop 1280x800 + mobile 390x844, zero errors).
- Arrows steer; click-to-go on the river works; hop off returns Ahaan to land walking normally.
- Play together: both boys ride together; inputs don't cross.
- Existing checks still pass: `tests/two-player-browser.cjs`, quad/vehicles checks.
- Publish on driver authority + live-verify + Fresh Drops entry WITH screenshot of the boat under a bridge (standing rule: no entry without its screenshot).

## Notes
- Keep the boat light for mobile; reuse water/ripple work from the expand brief.
- Do not copy code from Vihaan's Room Life repo; this is Ahaan's Park only.
