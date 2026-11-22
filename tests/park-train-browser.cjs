const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = '/tmp/ahaan-park-train';
const errors = [];

let server;

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  let baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    server = http.createServer((request, response) => {
      const requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filePath = path.resolve(siteRoot, `.${requestedPath}`);
      if (!filePath.startsWith(`${siteRoot}${path.sep}`)) { response.writeHead(403).end(); return; }
      fs.readFile(filePath, (error, data) => {
        if (error) { response.writeHead(404).end(); return; }
        const type = filePath.endsWith('.html') ? 'text/html' : filePath.endsWith('.css') ? 'text/css' : filePath.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
        response.writeHead(200, { 'content-type': type }).end(data);
      });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/index.html`;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getTrainState);
      await page.evaluate(() => Park3D.setCustomCamera({ x: 17, y: 28, z: -2 }, { x: 5, y: 0, z: -17 }));

      const initial = await page.evaluate(() => Park3D.getTrainState());
      assert.equal(initial.stationCount, 4, 'four stations exist');
      assert.deepEqual(initial.stations, ['Ice Cream Stop', 'Bridge Stop', 'South Grove', 'West Grove']);
      assert.equal(initial.tieCount, 320, 'track has visible sleepers');
      assert.equal(initial.railCount, 2, 'track has two rails');
      assert.equal(initial.carriageCount, 3, 'train has one engine and two carriages');
      assert.ok(initial.routeLength > 180, 'track forms an outer park loop');
      assert.equal(initial.currentStation, 'Ice Cream Stop', 'train starts at the ice cream station');
      assert.ok(initial.dwell > 0, 'train waits at its station');
      assert.equal(initial.engineColor, 0x287fc0, 'engine uses Ahaan blue');
      assert.equal(initial.dinoSounds, 0, 'station sound count starts at zero');
      if (viewport.width === 1280) {
        assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false', 'sound starts off');
        await page.locator('#soundBtn').click();
      }
      await page.evaluate(() => Park3D.teleportAhaan(5, -17));
      if (viewport.width === 1280) {
        await page.locator('#togetherBtn').click();
        await page.evaluate(() => Park3D.teleportVihaan(5, -17));
        await page.keyboard.press('E');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => {
          const riders = Park3D.getTrainState().riders;
          return riders.ahaan && riders.vihaan;
        });
        await page.keyboard.press('E');
        await page.waitForFunction(() => !Park3D.getTrainState().riders.ahaan && Park3D.getTrainState().riders.vihaan);
        await page.waitForFunction(() => Park3D.getTrainState().currentStation === 'Bridge Stop' && Park3D.getTrainState().dwell > 2.2, null, { timeout: 120000 });
        assert.equal((await page.evaluate(() => Park3D.getTrainState())).dinoSounds, 1, 'friendly sound plays at Bridge Stop when enabled');
        assert.ok(await page.evaluate(() => Math.hypot(Park3D.getV().rig.position.x - 18, Park3D.getV().rig.position.z - 9) < 12), 'Vihaan follows train to Bridge Stop');
        await page.evaluate(() => Park3D.teleportAhaan(18, 9));
        await page.waitForFunction(() => Park3D.getCurrentNearbyItem()?.id === 'train');
        await page.keyboard.press('E');
        await page.waitForFunction(() => Park3D.getTrainState().riders.ahaan);
        await page.keyboard.press('E');
        await page.waitForFunction(() => !Park3D.getTrainState().riders.ahaan && Park3D.getTrainState().riders.vihaan);
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => !Park3D.getTrainState().riders.vihaan);
        await page.locator('#togetherBtn').click();
      } else {
        await page.keyboard.press('E');
        await page.waitForFunction(() => Park3D.getTrainState().riders.ahaan);
        await page.keyboard.press('E');
        await page.waitForFunction(() => !Park3D.getTrainState().riders.ahaan);
      }
      if (viewport.width === 1280) {
        await page.waitForFunction(() => Park3D.getTrainState().speed > 0.2, null, { timeout: 20000 });
        await page.locator('#breezeBtn').click();
        await page.waitForFunction(() => document.querySelector('.home-hero').classList.contains('breeze-off'));
        const pauseStart = await page.evaluate(() => Park3D.getTrainState().progress);
        await page.waitForTimeout(350);
        const paused = await page.evaluate(() => Park3D.getTrainState());
        assert.equal(paused.progress, pauseStart, 'Breeze off pauses train motion');
        await page.locator('#breezeBtn').click();
        await page.waitForFunction(progress => Park3D.getTrainState().progress !== progress, pauseStart, { timeout: 5000 });
        await page.waitForFunction(() => Park3D.getTrainState().speed > 0.2 && Park3D.getTrainState().smokePuffs > 0, null, { timeout: 20000 });
        await page.evaluate(() => {
          Park3D.teleportAhaan(-30, -35);
          const { x, z } = Park3D.getTrainState().enginePosition;
          const heading = Park3D.getTrainState().engineHeading;
          Park3D.setCustomCamera({ x: x + Math.sin(heading) * 7 + Math.cos(heading) * 4, y: 6, z: z + Math.cos(heading) * 7 - Math.sin(heading) * 4 }, { x, y: 1, z });
        });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(evidenceDir, 'dino-smoke-1280.png') });
        await page.evaluate(() => Park3D.setCustomCamera({ x: 17, y: 28, z: -2 }, { x: 5, y: 0, z: -17 }));

        for (const station of ['South Grove', 'West Grove', 'Ice Cream Stop']) {
          await page.waitForFunction(name => {
            const state = Park3D.getTrainState();
            return state.currentStation === name && state.dwell > 2.2;
          }, station, { timeout: 120000 });
          assert.equal((await page.evaluate(() => Park3D.getTrainState())).dinoSounds, ['South Grove', 'West Grove', 'Ice Cream Stop'].indexOf(station) + 2, `friendly sound plays at ${station}`);
        }
        assert.equal((await page.evaluate(() => Park3D.getTrainState())).dinoSounds, 4, 'friendly sound plays at all four perimeter stops');
      } else {
        await page.waitForFunction(() => Park3D.getTrainState().speed > 0.2 && Park3D.getTrainState().smokePuffs > 0, null, { timeout: 20000 });
        await page.evaluate(() => {
          Park3D.teleportAhaan(-30, -35);
          const { x, z } = Park3D.getTrainState().enginePosition;
          const heading = Park3D.getTrainState().engineHeading;
          Park3D.setCustomCamera({ x: x + Math.sin(heading) * 5 + Math.cos(heading) * 3, y: 4.7, z: z + Math.cos(heading) * 5 - Math.sin(heading) * 3 }, { x, y: 1, z });
        });
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(evidenceDir, 'dino-smoke-390.png') });
        await page.evaluate(() => Park3D.setCustomCamera({ x: 17, y: 28, z: -2 }, { x: 5, y: 0, z: -17 }));
        await page.locator('#breezeBtn').click();
        await page.waitForFunction(() => document.querySelector('.home-hero').classList.contains('breeze-off'));
        const pauseStart = await page.evaluate(() => Park3D.getTrainState().progress);
        await page.waitForTimeout(350);
        assert.equal((await page.evaluate(() => Park3D.getTrainState())).progress, pauseStart, 'mobile Breeze off pauses train motion');
      }

      await page.screenshot({ path: path.join(evidenceDir, `station-${viewport.width}.png`) });
      assert.deepEqual(errors, [], 'browser has no errors');
      await page.close();
    }
    process.stdout.write(JSON.stringify({ desktop: 'pass', mobile: 'pass', dinoEngine: 'pass', smokePuffs: 'pass', stationSounds: 'pass', stationStops: 'pass', boarding: 'pass', independentExits: 'pass', breezePause: 'pass', errors, screenshots: evidenceDir }));
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => {
  console.error(error);
  if (server) server.close();
  process.exitCode = 1;
});
