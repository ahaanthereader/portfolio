const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-lazy-river-boat';
let server;

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
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

  const launchOptions = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE) launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE;
  const browser = await chromium.launch(launchOptions);
  const errors = [];
  try {
    for (const viewport of [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'mobile', width: 390, height: 844 }
    ]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      page.on('pageerror', error => { errors.push(`${viewport.name}: ${error.message}`); console.error(`${viewport.name} pageerror: ${error.stack || error.message}`); });
      page.on('console', message => { if (message.type() === 'error') errors.push(`${viewport.name} console: ${message.text()}`); });
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getLazyRiverBoatState && document.querySelector('#top canvas'));
      await page.locator('#top canvas').scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      const boat = page.evaluate(() => Park3D.getLazyRiverBoatState());
      const parked = await boat;
      assert.equal(parked.seats, 2, `${viewport.name}: boat has two seats`);
      assert.ok(parked.radius >= 7.5 && parked.radius <= 10.1, `${viewport.name}: boat starts in the canal`);
      assert.equal(parked.riders.ahaan, false);
      assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false', `${viewport.name}: sound stays off`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-boat-at-dock.png`) });

      await page.evaluate(() => Park3D.teleportAhaan(7, 0.8));
      await page.waitForFunction(() => Park3D.getCurrentNearbyItem()?.id === 'riverBoat');
      await page.keyboard.press('e');
      await page.waitForFunction(() => Park3D.getLazyRiverBoatState().riders.ahaan);

      await page.locator('#togetherBtn').click();
      await page.evaluate(() => Park3D.teleportVihaan(7, 0.8));
      await page.waitForFunction(() => Park3D.getVihaanNearbyItem() === 'riverBoat');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => Park3D.getLazyRiverBoatState().riders.vihaan);

      const southPoint = await page.evaluate(() => Park3D.projectParkPoint(0, 8.8));
      await page.keyboard.down('w');
      await page.keyboard.down('ArrowUp');
      await page.mouse.click(southPoint.x, southPoint.y);
      console.log(`${viewport.name}: south target click ${JSON.stringify({ point: southPoint, state: await page.evaluate(() => Park3D.getLazyRiverBoatState()) })}`);
      await page.waitForFunction(() => {
        const state = Park3D.getLazyRiverBoatState();
        return state.targetAngle === null && Math.abs(Math.atan2(Math.sin(state.angle - Math.PI / 2), Math.cos(state.angle - Math.PI / 2))) < 0.06;
      }, null, { timeout: 40000 });
      await page.keyboard.up('w');
      await page.keyboard.up('ArrowUp');
      const south = await page.evaluate(() => Park3D.getLazyRiverBoatState());
      assert.ok(south.riders.ahaan && south.riders.vihaan, `${viewport.name}: both boys stay aboard`);
      assert.ok(south.bridgePasses.south > 0, `${viewport.name}: boat passes the south bridge`);
      assert.ok(south.headY < south.bridgeUndersideY, `${viewport.name}: riders clear the bridge underside`);
      await page.evaluate(() => Park3D.setCustomCamera({ x: 13, y: 2.5, z: 8.8 }, { x: 0, y: 0.7, z: 8.8 }));
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-under-south-bridge.png`) });
      if (process.env.SCREENSHOT_ONLY) { await page.close(); continue; }

      await page.keyboard.down('w');
      await page.keyboard.down('ArrowUp');
      try {
        await page.waitForFunction(() => {
          const state = Park3D.getLazyRiverBoatState();
          return state.bridgePasses.east > 0 && state.bridgePasses.west > 0 && state.bridgePasses.north > 0;
        }, null, { timeout: 180000 });
      } catch (error) {
        console.log(`${viewport.name}: loop state ${JSON.stringify(await page.evaluate(() => Park3D.getLazyRiverBoatState()))}`);
        throw error;
      }
      await page.keyboard.up('w');
      await page.keyboard.up('ArrowUp');
      const fullRoute = await page.evaluate(() => Park3D.getLazyRiverBoatState());
      for (const bridge of ['north', 'east', 'south', 'west']) assert.ok(fullRoute.bridgePasses[bridge] > 0, `${viewport.name}: boat passes ${bridge} bridge`);

      await page.keyboard.press('Enter');
      await page.waitForFunction(() => !Park3D.getLazyRiverBoatState().riders.vihaan && Park3D.getLazyRiverBoatState().riders.ahaan);
      await page.waitForFunction(() => Park3D.getVihaanNearbyItem() === 'riverBoat');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => Park3D.getLazyRiverBoatState().riders.vihaan);
      await page.keyboard.press('e');
      await page.waitForFunction(() => !Park3D.getLazyRiverBoatState().riders.ahaan && Park3D.getLazyRiverBoatState().riders.vihaan);
      const ahaaLand = await page.evaluate(() => ({ position: Park3D.getA().rig.position.toArray(), radius: Math.hypot(Park3D.getA().rig.position.x, Park3D.getA().rig.position.z) }));
      assert.ok(ahaaLand.radius > 10.4, `${viewport.name}: Ahaan steps onto the bank`);
      await page.keyboard.down('w');
      await page.waitForTimeout(450);
      await page.keyboard.up('w');
      const walked = await page.evaluate(() => Park3D.getA().rig.position.toArray());
      assert.ok(Math.hypot(walked[0] - ahaaLand.position[0], walked[2] - ahaaLand.position[2]) > 0.1, `${viewport.name}: Ahaan walks after leaving`);
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => !Park3D.getLazyRiverBoatState().riders.vihaan);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-boat-exits.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], `Browser errors: ${errors.join(' | ')}`);
    const scope = process.env.SCREENSHOT_ONLY ? 'under-bridge screenshots' : 'two riders, full bridge loop, click and key steering, separate exits, silent default';
    console.log(`lazy-river-boat-browser: PASS (desktop + mobile, ${scope}). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
