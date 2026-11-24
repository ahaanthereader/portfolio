// Water park checks: ride geometry, prompts, boarding, exits, Play together, desktop, and mobile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-water-park';
const rides = [
  { id: 'water-slide', x: 40, z: -35, prompt: /splash slide/i },
  { id: 'wave-pool', x: 34, z: -42, prompt: /wave pool/i },
  { id: 'lazy-river-water-park', x: 43, z: -43, prompt: /lazy river/i },
  { id: 'dump-tower', x: 32, z: -35, prompt: /dump tower/i }
];

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  let server;
  let baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    server = http.createServer((request, response) => {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filePath = path.resolve(siteRoot, `.${pathname}`);
      if (!filePath.startsWith(`${siteRoot}${path.sep}`)) { response.writeHead(403).end(); return; }
      const target = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() ? path.join(filePath, 'index.html') : filePath;
      fs.readFile(target, (error, data) => {
        if (error) { response.writeHead(404).end(); return; }
        const type = target.endsWith('.html') ? 'text/html' : target.endsWith('.css') ? 'text/css' : target.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
        response.writeHead(200, { 'content-type': type }).end(data);
      });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/index.html`;
  }

  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    for (const viewport of [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'mobile', width: 390, height: 844 }
    ]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(`${viewport.name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${viewport.name} console: ${message.text()}`); });
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getWaterParkState && document.querySelector('#parkCanvas'));

      const state = await page.evaluate(() => window.Park3D.getWaterParkState());
      assert.equal(state.rides.length, 4, `${viewport.name}: four rides exist`);
      assert.deepEqual(state.rides.map(({ id, x, z }) => ({ id, x, z })), rides.map(({ id, x, z }) => ({ id, x, z })), `${viewport.name}: ride positions`);

      for (const ride of rides) {
        await page.evaluate(({ x, z }) => window.Park3D.teleportAhaan(x, z), ride);
        await page.waitForTimeout(350);
        assert.equal((await page.evaluate(() => window.Park3D.getWaterParkState())).obstructingCloudsVisible.every(visible => !visible), true, `${viewport.name}: north clouds clear the water park view`);
        assert.equal(await page.evaluate(() => window.Park3D.getCurrentNearbyItem()?.id), ride.id, `${viewport.name}: ${ride.id} nearby prompt`);
        assert.match(await page.locator('#actionPromptText').textContent(), ride.prompt, `${viewport.name}: ${ride.id} prompt text`);
        const before = await page.evaluate(() => ({ x: window.Park3D.getA().rig.position.x, z: window.Park3D.getA().rig.position.z }));
        await page.locator('#actionPromptBtn').click();
        await page.waitForTimeout(1100);
        assert.equal((await page.evaluate(() => window.Park3D.getWaterParkState())).riders.ahaan, ride.id, `${viewport.name}: ${ride.id} boards`);
        if (ride.id === 'water-slide' || ride.id === 'wave-pool' || ride.id === 'lazy-river-water-park') {
          await page.waitForTimeout(1000);
          const after = await page.evaluate(() => ({ x: window.Park3D.getA().rig.position.x, z: window.Park3D.getA().rig.position.z }));
          assert.ok(Math.hypot(after.x - before.x, after.z - before.z) > 0.15, `${viewport.name}: ${ride.id} moves gently`);
        }
        await page.locator('#actionPromptBtn').click();
        await page.waitForTimeout(350);
        assert.equal((await page.evaluate(() => window.Park3D.getWaterParkState())).riders.ahaan, null, `${viewport.name}: ${ride.id} exits`);
        await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-${ride.id}.png`) });
      }

      await page.evaluate(() => window.Park3D.setCustomCamera({ x: 63, y: 62, z: 78 }, { x: 39, y: 0, z: -39 }));
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-overview.png`) });

      if (viewport.name === 'desktop') {
        await page.evaluate(() => window.Park3D.teleportAhaan(40, -35));
        await page.locator('#togetherBtn').click();
        await page.waitForTimeout(300);
        await page.evaluate(({ x, z }) => window.Park3D.teleportVihaan(x, z), rides[2]);
        await page.waitForTimeout(350);
        assert.equal(await page.evaluate(() => window.Park3D.getVihaanNearbyItem()), rides[2].id, 'Play together: Vihaan gets lazy river prompt');
        assert.match(await page.locator('#vihaanActionPromptText').textContent(), /lazy river/i);
        await page.locator('body').click({ position: { x: 8, y: 8 } });
        await page.keyboard.press('Enter');
        await page.waitForTimeout(900);
        assert.equal((await page.evaluate(() => window.Park3D.getWaterParkState())).riders.vihaan, rides[2].id, 'Play together: Vihaan boards');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(350);
        assert.equal((await page.evaluate(() => window.Park3D.getWaterParkState())).riders.vihaan, null, 'Play together: Vihaan exits');
        await page.locator('#togetherBtn').click();
      }

      await page.close();
    }

    const arrivalPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    arrivalPage.on('pageerror', error => errors.push(`arrival: ${error.message}`));
    await arrivalPage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await arrivalPage.waitForFunction(() => window.Park3D?.getWaterParkState);
    const waterParkLink = arrivalPage.locator('#ng-play a[href="index.html#waterpark"]');
    assert.equal(await waterParkLink.count(), 1, 'water park link appears under Play');
    assert.equal(await waterParkLink.locator('[data-fresh-new]').getAttribute('hidden'), null, 'water park link shows NEW');
    await arrivalPage.evaluate(() => { location.hash = 'waterpark'; });
    await arrivalPage.waitForFunction(() => Math.hypot(window.Park3D.getA().rig.position.x - 29, window.Park3D.getA().rig.position.z + 30) < 0.5);
    assert.ok((await arrivalPage.evaluate(() => window.Park3D.getTrainState())).stations.includes('Water Park Stop'), 'train loop includes a water park stop');
    await arrivalPage.close();

    assert.deepEqual(errors, [], `Browser errors: ${errors.join(' | ')}`);
    console.log(`park-water-park-browser: PASS (desktop + mobile, four rides, Play together, zero page or console errors). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
