# Ahaan Park — day/night cycle + weather (lights, rain, puddles)

**Picked by:** Nishant, Sat Nov 21, 2026, 9:14 PM CT (from Goku's suggestions list, #8): "Day/Night + Weather — shaam ko Park lights jalein, halki baarish me puddles banein"
**Project:** Ahaan's World, 3D Park (index.html, `assets/park3d.js`, worker 0004).
**Queue position:** After the lazy river boat brief (which follows park expand + water). Math Dash stays the Codex cloud pilot — do not touch it.

## What to build
1. **Day/night cycle:** The park slowly cycles through day → golden evening → cozy night → morning. Sun/moon move, sky color shifts smoothly. A small on-screen control lets Ahaan pick Day / Evening / Night directly (and an Auto mode that cycles slowly). Default: Auto, slow and calm.
2. **Park lights at night:** Lamp posts around paths/bridges/stations glow warmly at evening/night; windows/signs softly lit. Steady glow only — no flickering or strobing (sensory-friendly). Lights turn off in daytime.
3. **Weather:** Gentle weather states — Sunny, Cloudy, Light Rain. A small control to pick weather (and Auto that changes slowly now and then). Light rain: soft falling rain streaks, **puddles form on paths** (shiny reflective patches with ripple rings where drops land), water ripples a bit more. Rain stays light and calm — no storms, no thunder sounds, no flashing.
4. Everything keeps working in every state: walking, all vehicles, train, boat, splash zone (rain + splash zone is fine and fun). Visibility stays good at night (never too dark to play).

## Acceptance checks
- Day → Evening → Night transitions smooth; park lights on at night, off in day (desktop 1280x800 + mobile 390x844 screenshots of each).
- Light rain: rain visible, puddles with ripple rings on paths; Sunny clears puddles gradually.
- Controls (Day/Evening/Night/Auto + Sunny/Cloudy/Rain/Auto) work by click/tap; zero console/page errors; mobile FPS stays smooth.
- Existing checks still pass: `tests/two-player-browser.cjs`, quad/vehicles checks.
- Publish on driver authority + live-verify + Fresh Drops entry WITH screenshot of the park at night with lights (standing rule: no entry without its screenshot).

## Notes
- Sensory-friendly: slow transitions, steady lights, gentle rain only.
- Do not copy code from Vihaan's Room Life repo; this is Ahaan's Park only.
