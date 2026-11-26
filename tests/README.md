# Park browser checks

The browser check starts a local HTTP server for this worktree.

Install Playwright outside the site when no local Playwright module exists.
Set `PLAYWRIGHT_MODULE` to the Playwright package path when needed.
Set `CHROMIUM_EXECUTABLE` when the browser path differs from the Playwright default.
Set `BASE_URL` to use a running local site instead of the test's local server.

Run `node tests/two-player-browser.cjs`.
The check saves desktop and mobile screenshots under `/tmp/ahaan-two-player`.
The check covers solo controls, twin controls, ice cream, trampoline, bridge height, camera bounds, toggle cleanup, and browser errors.

Run `PLAYWRIGHT_MODULE=/path/to/playwright node tests/story-delete-browser.cjs` for Story Studio delete confirmation and undo checks.

Run `PLAYWRIGHT_MODULE=/path/to/playwright node tests/reading-shelf-browser.cjs` for Reading Nook shelf, Aesop cover, scroll controls, drag, keyboard, and layout checks.

Run `PLAYWRIGHT_MODULE=/path/to/playwright node tests/chopper-click-browser.cjs` for desktop and mobile chopper and ground-vehicle targets, touch input, arrow cancel, rotor audio, default height, and two-player input ownership checks.

Run `PLAYWRIGHT_MODULE=/path/to/playwright node tests/quad-browser.cjs` for Vihaan's quad mount, click target, arrow cancel, ride, and dismount checks.
