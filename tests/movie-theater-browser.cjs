const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = '/tmp/ahaan-movie-theater';
const errors = [];
let server;

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  let baseUrl = process.env.BASE_URL;
  if (!baseUrl) server = http.createServer((request, response) => {
    const requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const filePath = path.resolve(siteRoot, `.${requestedPath}`);
    if (!filePath.startsWith(`${siteRoot}${path.sep}`)) { response.writeHead(403).end(); return; }
    const type = filePath.endsWith('.html') ? 'text/html' : filePath.endsWith('.css') ? 'text/css' : filePath.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
    fs.readFile(filePath, (error, data) => {
      if (error) { response.writeHead(404).end(); return; }
      response.writeHead(200, { 'content-type': type }).end(data);
    });
  });
  if (server) {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/index.html`;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => localStorage.removeItem('ahaanDoorsSound'));
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getMovieTheaterState);
      assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false', 'shared sound starts off');
      await page.evaluate(() => Park3D.teleportAhaan(-40, -32.8));
      await page.waitForFunction(() => Park3D.getCurrentNearbyItem()?.id === 'movieTheater');
      if (viewport.width === 390) await page.locator('#actionPromptBtn').click();
      else await page.keyboard.press('E');
      await page.waitForFunction(() => Park3D.getMovieTheaterState().riders.ahaan);
      let state = await page.evaluate(() => Park3D.getMovieTheaterState());
      assert.equal(state.position.x, -40, 'theater uses selected northwest lawn site');
      assert.equal(state.position.z, -38, 'theater uses selected northwest lawn site');
      assert.equal(state.seats, 2, 'room has two seats');
      assert.equal(state.screenVisible, true, 'theater screen is visible');
      assert.equal(state.controlsVisible, true, 'screen controls appear after a rider enters');
      assert.equal(state.soundRequests, 0, 'movie starts without sound');
      assert.ok(state.sceneTitle, 'screen shows a kid-friendly scene title');
      await page.getByRole('button', { name: 'Play a soft sound' }).click();
      assert.equal((await page.evaluate(() => Park3D.getMovieTheaterState())).soundRequests, 0, 'movie sound stays off when shared sound is off');
      assert.match(await page.locator('.movie-theater-status').textContent(), /Park sound is off/);
      if (viewport.width === 1280) {
        await page.locator('#soundBtn').click();
        await page.getByRole('button', { name: 'Play a soft sound' }).click();
        assert.equal((await page.evaluate(() => Park3D.getMovieTheaterState())).soundRequests, 1, 'one soft sound plays only after both sound controls are chosen');
      }
      const currentScene = state.scene;
      await page.getByRole('button', { name: 'Next scene' }).click();
      state = await page.evaluate(() => Park3D.getMovieTheaterState());
      assert.notEqual(state.scene, currentScene, 'viewer can choose the next scene');
      if (viewport.width === 1280) await page.evaluate(() => Park3D.setCustomCamera({ x: -32, y: 13, z: -17 }, { x: -40, y: 1.5, z: -38 }));
      else await page.evaluate(() => Park3D.setCustomCamera());
      await page.waitForTimeout(400);
      const controlsBox = await page.locator('.movie-theater-controls').boundingBox();
      assert.ok(controlsBox.x >= 0 && controlsBox.x + controlsBox.width <= viewport.width, 'theater controls fit the viewport');
      await page.screenshot({ path: path.join(evidenceDir, viewport.width === 1280 ? 'theater-seated-desktop.png' : 'theater-seated-mobile.png') });
      await page.evaluate(() => Park3D.setCustomCamera());
      if (viewport.width === 390) await page.locator('#actionPromptBtn').click();
      else await page.keyboard.press('E');
      await page.waitForFunction(() => !Park3D.getMovieTheaterState().riders.ahaan);
      assert.equal((await page.evaluate(() => Park3D.getMovieTheaterState())).controlsVisible, false, 'controls close after the last viewer leaves');

      if (viewport.width === 1280) {
        await page.locator('#togetherBtn').click();
        await page.evaluate(() => { Park3D.teleportAhaan(-40, -32.8); Park3D.teleportVihaan(-40, -32.8); });
        await page.waitForFunction(() => Park3D.getCurrentNearbyItem()?.id === 'movieTheater');
        await page.keyboard.press('E');
        await page.waitForFunction(() => Park3D.getMovieTheaterState().riders.ahaan);
        await page.waitForFunction(() => Park3D.getVihaanNearbyItem() === 'movieTheater');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => Park3D.getMovieTheaterState().riders.vihaan);
        state = await page.evaluate(() => Park3D.getMovieTheaterState());
        assert.equal(state.riders.ahaan, true, 'Ahaan is seated');
        assert.equal(state.riders.vihaan, true, 'Vihaan is seated');
        assert.equal(state.riderPositions.ahaan.y, state.rigOriginHeight.ahaan, 'Ahaan sits at chair height');
        assert.equal(state.riderPositions.vihaan.y, state.rigOriginHeight.vihaan, 'Vihaan sits at chair height');
        if (viewport.width === 1280) await page.evaluate(() => Park3D.setCustomCamera({ x: -32, y: 13, z: -17 }, { x: -40, y: 1.5, z: -38 }));
      else await page.evaluate(() => Park3D.setCustomCamera());
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(evidenceDir, 'theater-two-riders-desktop.png') });
        await page.evaluate(() => Park3D.setCustomCamera());
        await page.keyboard.press('E');
        await page.waitForFunction(() => !Park3D.getMovieTheaterState().riders.ahaan && Park3D.getMovieTheaterState().riders.vihaan);
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => !Park3D.getMovieTheaterState().riders.vihaan);
      }
      assert.deepEqual(errors, [], 'browser reports no page errors');
      await page.close();
    }
    process.stdout.write(JSON.stringify({ desktop: 'pass', mobile: 'pass', twoSeats: 'pass', independentExits: 'pass', gentleScreen: 'pass', silentByDefault: 'pass', optionalSound: 'pass', errors, screenshots: evidenceDir }));
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => {
  console.error(error);
  if (server) server.close();
  process.exitCode = 1;
});
