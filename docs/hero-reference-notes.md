# Hero reference notes: cofounder.co (analysed with REA)

Purpose: learn *why* the cofounder.co hero feels calm, then build an **original** hero for Ahaan's World. Nothing (images, video, code, copy, fonts) is copied.

Source: `rea capture-browser-scenario` (launch mode, temporary Chrome profile, one 5 s settle wait), 2026-10-17.
Evidence ID: `ev_b107607d9b4e7a232b32d30392894db4c79105693eeb25fc52517ca32361538a`

## Observed (from the captured DOM and screenshot)

- **Scene:** a full-bleed pixel-art park: soft blue sky, big cumulus clouds, a large tree framing the right edge, grass and clover in the foreground, a distant city skyline, a bench, small details (flower, ladybird).
- **Rendering:** one `<video>`: `autoplay muted loop playsinline`, WebM + MP4 sources, a `.webp` poster, `object-cover` anchored to the right. No `<canvas>`, no WebGL.
- **Layout:** headline and two buttons top-left over the scene; nav as translucent "glass" pills at top-right; two small floating glass status chips mid-right.
- **Glass:** `backdrop-filter` blur is used 17 times (nav pills, buttons, chips).
- **Type:** a soft geometric sans (CSS variable `--font-neoris`) for headline and body, a pixel mono (`--font-departure`) and IBM Plex Mono as accents. Headline is light weight, large, white on sky.
- **Palette:** sky blues, leafy greens, warm off-white text and buttons.

### Second pass (same Evidence, DOM classes)

- **Headline:** `h1`, normal weight, 46 px (38 px under 900 px, 34 px under 500 px), line-height 108%, max 20ch, white gradient text with a 1–3 px soft drop shadow.
- **Subline:** 16 px, weight ~460, line-height 140%, white at 80% opacity, max 540 px.
- **Buttons:** 41 px tall, 8 px radius; one light solid surface, one translucent glass; 15 px labels.
- **Nav:** 15 px links, weight ~410, grouped in translucent pills.
- **Chips:** "glass-pill" items inside a `hero-notif-wheel` (they rotate through, i.e. self-moving).
- **Entrance:** text uses a `hero-stagger` class with a `--stagger` index (staggered entrance on load).
- **Hero height:** a `--hero-min-height` of 720 px (620 px from the md breakpoint).

## Inferred (why it feels calm)

- One big, quiet picture instead of many competing elements; text sits on the calmest area (sky).
- Low contrast between scene elements, high contrast only for the headline.
- Light-weight type and generous spacing.

## Unknowns / limits

- Only the first viewport was captured; scroll behaviour and the video's motion over time were not analysed.
- Network content was not retained.

## Decisions for Ahaan's hero (design choices, not observations)

- **Keep:** full-bleed calm outdoor scene, airy headline top-left, glass buttons, one focal point.
- **Change for the sensory spec:** no looping video. The scene is a **static, original watercolor park** (SF-10, SF-11). The only motion is 3D Ahaan's head following the cursor, which Ahaan starts himself; Calm mode makes him still (SF-14).
- **Ahaan:** full-length 3D figure standing in the scene (owner request).
- **Fonts:** keep the site's own Fraunces and Fredoka.
- **Not adopted for the sensory spec:** the rotating chip wheel (ours are static progress chips) and the staggered entrance on load (SF-11).
