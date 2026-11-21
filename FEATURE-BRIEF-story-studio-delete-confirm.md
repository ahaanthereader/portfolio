# Feature Brief — Story Studio delete confirm + undo (Ahaan's World)

From Goku, Nov 19, 2026 (next-feature pick from the Sally UX review, R4; Nishant's drive instruction). Worker 0004. Build, publish, live-verify on driver authority.

## Why this one
The Sally UX review (Nov 12) found: **Story Studio Delete has no confirm and no undo** — one tap and a kid's story is gone. That's the most kid-safety-relevant open item on the site. (Note: Sally R2 Math Dash red-marking is NOT part of this brief — it stays the Codex cloud pilot, do not touch games.html Math Dash.)

## What to build
- Tapping Delete in Story Studio asks first: a friendly confirm ("Delete this story? You can't get it back.") with clear **Keep it** / **Delete** choices. Kid-readable words (grade 3), big tap targets.
- After deleting, show an **Undo** option for a few seconds that brings the story back.
- No red scare styling — calm, clear, sensory-friendly (per AGENTS.md). Wrong-answer red is banned on this site; delete confirm should be neutral, not alarming.

## Acceptance
- Delete asks before removing; Cancel/Keep leaves the story untouched.
- Undo restores the deleted story.
- Desktop 1280×800 + mobile 390×844, zero console errors.
- Publish: merge to main, push, Pages run success, live-verify, record in HANDOFF.md.
- Add a Fresh Drops entry with its screenshot for this publish (standing rule, Nov 19).
