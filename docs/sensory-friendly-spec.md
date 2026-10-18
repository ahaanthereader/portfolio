# Sensory-Friendly Spec — Ahaan's World

Status: **Draft v0.2: owner decisions applied (section 8)** · Scope: `index.html` (single-file static site, no build step)

## 1. Goal

Make Ahaan's World comfortable to use for a child who may be sensitive to motion, sound, brightness, visual clutter, time pressure, or surprise. Ahaan should always feel **in control** (he is the one who operates the settings): nothing moves, plays, flashes, or ticks unless he chose it, and a calm version is one tap away.

**Non-goals:** changing the content, the games' rules, or the site's cheerful personality. Calm mode removes intensity, not fun.

## 2. Principles

1. **Predictable.** No surprises: no auto-playing sound, no sudden motion, no layout jumps.
2. **In control.** Every moving or noisy thing can be turned off, and the choice is remembered.
3. **Quiet by default for sound, gentle by default for motion.** Intense effects are opt-in.
4. **No pressure.** Timers and "wrong" feedback are optional or soft.
5. **Respect the system.** Honor `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme`, and browser text-size settings automatically, before any site setting.
6. **Real data only** (existing site rule): sensory settings never invent content.

## 3. Findings: what the site does today

Verified by reading `index.html`.

| Area | Current behaviour | Risk |
|---|---|---|
| Looping animation | Always-running: music button pulse (1.6s), today's calendar day bounce (1.4s), reward medal bob (2.6s), medal shine sweep (4.5s), swing sway (3.2s), 3D Ahaan breathing/blinking | Constant peripheral motion |
| Reduced motion | Only 2 CSS blocks: swing sway and calendar day are handled. **Music button pulse, medal bob and medal shine are not.** Smooth scroll is handled. | Partial; the system setting is not honored everywhere |
| Hero | Floating emoji that react to the pointer, a dot-and-grid pattern background, bright green gradient, plus the 3D Ahaan that waves on load | Busy first screen, unexpected motion on arrival |
| Effects | Confetti bursts on badges and wins; badge "pop" animations | Sudden, high-contrast, many moving pieces |
| Sound | All audio is generated live (Web Audio oscillators): calm music, piano, Echo game | Needs a clear master mute, volume cap, and no sound without a tap |
| Timers | Two games count down once per second ("Time: 23s") | Time pressure |
| Focus and keyboard | Only two inputs define `:focus`; both remove the outline and use a border colour instead | Keyboard users may not see where they are |
| Semantics | Few `aria-` attributes (11) and `alt` attributes (3) for a 2,400-line page | Screen-reader gaps |
| Persistence | `localStorage` already used for rewards and stories | We can reuse it for settings |

## 4. Requirements

Priority: **P0** must ship in v1 · **P1** should · **P2** later.
Each requirement has an acceptance check (AC) that can be tested in the browser.

### 4.1 Calm controls (the settings panel)

- **SF-1 (P0) Calm button, for Ahaan.** A persistent, big, friendly, labelled button ("🌿 Calm") reachable from every screen, including by keyboard, designed for a child to use himself (large, plain words, picture + text). AC: reachable with Tab within 3 stops from the top; at least 48×48 px; no parent step is needed to use it.
- **SF-2 (P0) One-tap "Calm mode".** *Decision D2.* The site opens in its current look, and **one tap** turns on everything below at once: motion off, sound off, soft colours, no timers, no confetti. A second tap returns to his previous settings. AC: one activation changes all of 4.2 to 4.6; one more restores.
- **SF-3 (P0) Individual switches** for: Motion, Sound, Timers, Celebrations, Colour intensity, Text size. AC: each switch works alone and the state is shown in text, not only colour.
- **SF-4 (P0) Remembered.** Choices persist in `localStorage` (wrapped in try/catch, as the site already does) and apply **before first paint** to avoid a flash of motion. AC: reload keeps settings; with storage blocked the site still works with defaults.
- **SF-5 (P0) System first.** If the OS asks for reduced motion, the site starts in Motion-off. A site choice can override it only by an explicit tap. AC: toggling the OS setting changes the default on reload.

### 4.2 Motion

- **SF-10 (P0) Calm motion off means off.** In Motion-off, every `infinite` animation and looping transform stops, including medal bob, medal shine, music button pulse, calendar bounce, swing sway, floating emoji drift, hero pointer-reaction. AC: no element has a computed `animation-iteration-count` of `infinite`, and no JS loop moves anything on its own; checked with a script.
- **SF-11 (P0) No motion on arrival.** Nothing animates on page load without a tap. AC: 3D Ahaan does not auto-wave in any mode; the first 5 seconds of the page are static in Motion-off.
- **SF-12 (P0) No flashing.** Nothing flashes more than 3 times per second (WCAG 2.3.1), including confetti and "shine". AC: audit shows none; Celebrations-off removes confetti entirely.
- **SF-13 (P1) Default mode keeps the playful motion.** *Decision D4.* Swing sway, medal shine, and floating emoji stay in the default look. Where motion is allowed, new motion uses 200–400 ms, ease-in-out, no sharp bounce, no parallax. Calm mode (SF-10) removes all of it.
- **SF-14 (P1) 3D Ahaan stays in Calm mode, as a still figure.** *Decision D5.* Calm/Motion-off: forward-facing still pose, no blinking loop, no cursor tracking, no wave. Default mode: tracks the cursor smoothly, wave only on tap (no wave on load, SF-11). AC: matches both states.
- **SF-16 (P1) Likeness.** *Decision D5.* 3D Ahaan should look more like Ahaan. Reference is the parent-supplied photo, which is **not committed to the repo**. Target features: short black buzz-cut with hairline low on the forehead; warm medium-brown skin; large dark-brown eyes; arched dark brows; small open smile; ears slightly out; maroon-and-cream wide-striped polo with dark maroon collar; light-blue jeans. AC: side-by-side review with a parent, who signs off. Remaining work is in shape (hairline, face proportions, ears), colour, and shirt detail.
- **SF-15 (P1) Scrolling.** Smooth scroll off when Motion-off (already true for the OS setting); no scroll-jacking.

### 4.3 Sound

- **SF-20 (P0) Silent until asked.** No sound plays without a direct tap on a sound control. AC: loading and navigating the site makes no sound.
- **SF-21 (P0) Master mute** in the Calm panel that silences calm music, piano, Echo game, and any chimes. Muting takes effect immediately and stops sounds already playing. AC: no audio node connected to the output while muted.
- **SF-22 (P0) Volume ceiling.** *Top priority: Ahaan is sometimes bothered by loud sounds.* A master gain applied to all generated audio, with a default well below full scale (exact level tuned by ear on a laptop speaker with a parent, then locked), and a volume slider (keyboard-operable). AC: no sound can exceed the master ceiling; the slider only lowers it or raises it up to that ceiling.
- **SF-23 (P0) No sudden loud sounds.** Every tone has a soft fade in (≥ 50 ms) and fade out, no clicks or sharp attacks, and effects never layer louder than a single note. A brief limiter (compressor node) sits on the master output as a safety net. AC: each sound reviewed; stacking many notes (piano mashing, Echo) stays under the ceiling.
- **SF-26 (P0) Music preview, then quiet.** *Decision D6.* Tapping the music button plays the calm music for about **5 seconds**, fades it out over about 1 second, and stops by itself. A visible "Keep playing" control lets Ahaan choose to continue; without it, music ends after the preview. Music never starts without a tap (SF-20). AC: tap starts music; at ~5 s it fades and stops; "Keep playing" continues; muted state blocks it.
- **SF-27 (P0) Doors chime.** *Decision D8.* Doors of the World may play a soft bell chime when a door opens, inspired by the Budarina "chimes" site. It is **off by default**; only Ahaan turns it on, with a visible "Soft chime" switch (remembered). Each country has its own pitch. A chime is three gentle sine-bell notes with a fade-in of at least 60 ms and a fade-out of about 2 s, played through the shared master gain (SF-22) and limiter (SF-23), and silent when muted. A visual twin always exists (the door opens and the proverb appears). AC: with the switch off, opening any door is silent; with it on, the chime is audibly soft, never clicks, and stops being audible when volume is 0 or muted.
- **SF-24 (P1) Every sound has a visual twin.** Nothing important is conveyed by sound alone, so muting loses no information.
- **SF-25 (P2) Quieter timbres.** Offer a "soft" sound set (sine, slower attack) as the default for effects.

### 4.4 Visual comfort

- **SF-30 (P0) Colour intensity.** Calm mode swaps saturated gradients and the dotted/grid hero pattern for a flat, low-contrast-but-readable palette from the existing theme (parchment, soft green, muted brown). AC: no pattern or gradient background behind body text in Calm mode.
- **SF-31 (P0) Readable contrast.** Text meets WCAG AA (4.5:1) in all modes; the hero's light text on green is measured and fixed if it fails. Calm mode aims for AA but avoids pure white on saturated colour (glare).
- **SF-32 (P0) Text size.** Honors browser font size; adds Small / Medium / Large (e.g., 100/115/130 %), with no layout breakage. AC: no horizontal scroll at 320 px and Large text.
- **SF-33 (P1) Less clutter.** Calm mode hides decorative-only elements (floating emoji, 3D Ahaan can stay if still) and reduces simultaneous focal points per screen. AC: hero shows one focal point.
- **SF-34 (P1) Dark/soft theme.** Respect `prefers-color-scheme` with a non-glaring dark theme (no pure black on pure white). 
- **SF-35 (P1) Consistent layout.** Navigation, the Calm button, and section structure stay in the same place on every visit; no content shifts after load (CLS ≈ 0).
- **SF-36 (P2) Respect `prefers-contrast`** and `forced-colors`.

### 4.5 Pressure, feedback, and surprise

- **SF-40 (P0) Timers optional.** In Timers-off, the two countdown games run untimed (play until finished or a self-chosen "I'm done"). AC: no `setInterval` countdown is created.
- **SF-41 (P0) Gentle feedback.** Wrong answers never use red flashes, buzzers, or shaking; they show a soft message ("Not quite. Want to try again?") and the right answer calmly. AC: no wrong-answer state uses motion or sound.
- **SF-42 (P1) Calm celebrations.** Celebrations-on uses a still badge and a short message; confetti is a separate, opt-in "Big celebrations".
- **SF-43 (P1) Easy exits.** Every game and every overlay has a visible Close/Done control and responds to Esc. Nothing auto-advances.
- **SF-44 (P1) No auto-play of anything** (carousels, videos, tours), and no popups, modals, or notifications that appear on their own.

### 4.6 Navigation, keyboard, and assistive tech

- **SF-50 (P0) Visible focus.** Every interactive element shows a clear focus ring (≥ 3:1 contrast, 2 px+). The two inputs that remove outlines get a replacement ring. AC: Tab through the whole page; focus is always visible.
- **SF-51 (P0) Skip link** ("Skip to content") as the first focusable element.
- **SF-52 (P0) Live regions politely.** Score and timer changes are not announced every second; results announced once, `aria-live="polite"`.
- **SF-53 (P1) Labels and alt text.** Every control has an accessible name; meaningful images have `alt`; decorative emoji marked `aria-hidden`.
- **SF-54 (P1) Targets and pointing.** *Decision D7: used mainly on a laptop.* Mouse and keyboard are the primary inputs, so every control must be fully keyboard-usable and have a clear hover and focus state. Targets are at least 32×32 px (44×44 px on narrow screens), and every drag has a click or keyboard alternative.
- **SF-55 (P1) Plain language.** Short sentences, concrete words, no sarcasm or idioms in UI text.

### 4.7 Doors of the World (feature)

- **DW-1 (P0) Real sayings only.** Every door shows the original script, an English translation, and a short source note. Each saying must be checked against a native speaker or an authoritative source before it ships. *Currently unverified: Kazakh, Swahili, Italian.*
- **DW-2 (P0) Nothing happens until Ahaan acts.** Doors do not open, move, or chime on their own; the chime switch is off by default (SF-27).
- **DW-3 (P0) Calm mode.** Doors open with no swing animation, the script text does not sway, and no sound plays.
- **DW-4 (P1) Keyboard and assistive tech.** Each door is a real button with `aria-expanded`; the saying panel is a polite live region; Esc and a "close the door" button close it (SF-43).
- **DW-5 (P1) Default motion is gentle.** The door swing lasts under 0.8 s; the script sways only while a door is open and stops when it closes (no always-on loop).
- **DW-6 (P1) Watercolor-on-paper look.** *Owner direction.* Keep the site's parchment feel and add soft watercolor washes, uneven hand-painted edges, and a light paper grain. All effects are **static** (no animated filters or textures) so they add no motion, and text always sits on a calm, light area so contrast stays at AA (SF-31). Calm mode may drop the grain and edge wobble for a flatter look.

### 4.8 Bells of the World (feature)

- **BW-1 (P0) Silent until chosen.** Sound is off by default and shares Ahaan's choice with Doors; every bell goes through the master ceiling and limiter (SF-22, SF-23). Verified: no audio context is created while sound is off.
- **BW-2 (P0) Motion only when he acts.** Bells hang still. Ringing or dragging a bell swings it gently (about 40 to 50 px), and it settles in about 5 seconds, after which the animation loop stops. Calm mode: no swing, the bell just glows.
- **BW-3 (P0) Real facts.** Six countries to start (Japan, China, India, Kazakhstan, Kenya, Italy). *Verify before sharing widely: Chion-in bell weight, Kazakhstan and Kenya facts, Agnone foundry.*
- **BW-4 (P1) Accessible.** The canvas is decorative; every bell has a stamp button (keyboard and screen reader), cards close with Esc.
- **BW-5 (P1) Original work.** Roof, bells, sounds and string physics are made for this site. Nothing is copied from the chimes site, whose license reserves all rights.

## 5. Design: how it fits the code

- **Shared audio helper.** A single `AhaanAudio` object owns one `AudioContext`, one master `GainNode` (volume ceiling), a compressor used as a limiter, and a mute flag. Doors uses it first; the Music corner migrates to it in Phase 1 (it currently has its own context and a fixed 0.8 master).
- **One settings object** `{ motion, sound, timers, celebrate, calmColours, textSize }` stored under a single `localStorage` key, read by a tiny inline script at the top of `<head>` that sets `data-*` attributes on `<html>` (e.g. `data-motion="off"`) before first paint.
- **CSS does the work.** Motion-off is one rule: `[data-motion="off"] *, ... { animation: none !important; transition: none !important; }` plus targeted `@media (prefers-reduced-motion)` mirrors, so the OS setting and the site setting share one code path.
- **JS reads the same flags.** `confettiBurst`, game timers, 3D Ahaan, floating emoji, and the audio helper check `settings` first; the audio helper owns a single master `GainNode` for mute and volume.
- **No new dependencies**, consistent with the README. 3D Ahaan's Three.js remains lazy-loaded and is skipped entirely when Calm hides it.
- **Testing:** a manual checklist (section 7) plus a small script that loads each state and asserts SF-10, SF-12, SF-20, and SF-40.

## 6. Phasing

- **Phase 1 (P0), loud sounds first:** master gain + limiter + soft attacks (SF-20 to SF-23), music preview (SF-26), then Calm button + one-tap Calm + persistence, motion off, timers off, gentle feedback, focus rings, skip link, contrast fixes.
- **Phase 2 (P1):** 3D Ahaan stillness and likeness (SF-14, SF-16), celebrations options, text size polish, clutter reduction, dark theme, semantics and touch targets.
- **Phase 3 (P2):** soft sound set, high-contrast support, personal profile presets.

## 7. Acceptance checklist (manual)

- [ ] Fresh load with OS "reduce motion" on: page is still, no sound.
- [ ] Calm button reachable by keyboard; one tap enables Calm mode; reload keeps it.
- [ ] In Calm mode: no animation running (script check), no confetti, no timers, no sound, flat colours.
- [ ] Master mute silences music, piano, Echo; volume slider works.
- [ ] Wrong answers: no red flash, no buzz, no shake.
- [ ] Tab through the page: focus always visible; skip link works.
- [ ] 320 px width and Large text: no horizontal scroll.
- [ ] Storage blocked: site still works.

## 8. Decisions

| # | Question | Decision (owner) | Effect on spec |
|---|---|---|---|
| D1 | What bothers Ahaan? | **Loud sounds, sometimes** | Sound safety is the top P0 (SF-22, SF-23, SF-26). Other areas stay in scope but rank lower. |
| D2 | Default state | **Current look, one-tap Calm** | SF-2 only: no forced Calm. OS reduced-motion still sets the default (SF-5). |
| D3 | Who controls settings | **Ahaan** | SF-1: big, child-friendly button; no parent-only menu in v1. |
| D4 | Keep animated favourites in default mode | **Yes, keep** | SF-13: swing sway, medal shine, floating emoji stay; Calm removes them. |
| D5 | 3D Ahaan in Calm mode | **Stays, as a still figure, and should look more like Ahaan** | SF-14 and new SF-16 (likeness, from the parent's photo). |
| D6 | Music | **Start with about 5 seconds of music, then turn off** | SF-26. Interpreted as a tap-started 5 s preview that fades and stops; see open points. |
| D8 | Chimes site inspiration | **Use the chimes idea for the Doors knock sound, as a soft opt-in chime** | SF-27 and section 4.7. |
| D7 | Device | **Laptop** | SF-54 reworked for mouse and keyboard; touch is secondary. |

### Still open

1. **D6 interpretation:** is the 5 seconds a *preview after a tap* (what SF-26 says), or should it also play once automatically on arrival? Browsers block autoplay with sound anyway, and SF-20 says silent until a tap, so the spec assumes a tap.
2. **Volume ceiling:** to be set by ear with a parent on the laptop's speakers.
3. **Wrong-answer wording** (SF-41): a parent or Ahaan may want to pick the kind phrases.

## 9. Out of scope (for now)

Translations, user accounts, analytics, and any data leaving the device. Settings stay in the browser only.
