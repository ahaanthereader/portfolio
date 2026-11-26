# Sally UX review — Reading Nook shelf

## User and task

Ahaan opens the Reading Nook to choose a favorite book. Ahaan needs to see the cover, title, author, and rating before he opens a book. The shelf must remain easy to use with a mouse, touch, and keyboard.

## Review findings

1. **Make the full book card the link.** The Aesop card must open the existing `aesop.html` page. Give the link a clear accessible name and a visible focus ring.
2. **Keep the shelf in one horizontal row.** Use scroll snapping so each book settles into view. Keep native touch scrolling, and add pointer dragging for mouse users.
3. **Show clear scroll controls.** Keep previous and next controls visible only when more books exist in that direction. Make each target at least 44 pixels and label both controls.
4. **Keep card details readable.** Show the cover, author, and five-star rating without clipping. Do not use an ellipsis for essential author text.
5. **Keep Currently Reading inside the viewport.** Use a bounded desktop grid and a stacked mobile layout. Allow the text to wrap and keep the page free of horizontal overflow.
6. **Respect motion preferences.** Use instant scrolling when reduced motion is active. Keep the shelf usable without animation.

## Applied design direction

Build a compact, scrollable row with snap points, visible arrow controls, swipe, drag, and keyboard focus. Use a dedicated Aesop cover illustration. Place the Currently Reading card beside the shelf only when the viewport has enough width. Stack it below the shelf on mobile.

## Review status

Review completed before implementation. Verify the final layout at 1280 × 800 and 390 × 844. Test arrows, drag, touch scrolling, keyboard use, focus visibility, reduced motion, and horizontal overflow.
