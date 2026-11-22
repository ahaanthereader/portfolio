const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const evidenceDir = '/tmp/ahaan-chopper-click';
fs.mkdirSync(evidenceDir, { recursive: true });
const server = http.createServer((req, res) => {
  const file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  fs.readFile(file, (err, data) => res.writeHead(err ? 404 : 200, { 'content-type': contentTypes[path.extname(file)] || 'application/octet-stream' }).end(err ? '' : data));
});
let point = 'server-start';
const timeout = setTimeout(() => { console.error(`FAIL timeout at ${point}`); process.exit(2); }, 360000);
(async () => {
  if (!process.env.BASE_URL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const siteBase = process.env.BASE_URL || `http://127.0.0.1:${server.address().port}/index.html`;
  const siteUrl = file => new URL(file, siteBase).href;
  const browser = await chromium.launch({ headless: true, args: ['--disable-gpu', '--use-gl=swiftshader', '--disable-gpu-sandbox'] });
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.addInitScript(() => {
        try { localStorage.setItem('ahaanDoorsSound', JSON.stringify({ on: true, vol: 30 })); } catch (e) {}
      });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      point = `load-${viewport.width}`;
      await page.goto(siteUrl('index.html'), { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForFunction(() => window.Park3D?.getChopperState);
      assert.equal(await page.locator('.park-rides-nav').getAttribute('href'), 'index.html#top', 'Park rides stays under Play');
      assert.equal(await page.locator('.park-rides-nav [data-fresh-new]').evaluate(badge => badge.hidden), false, 'Park rides shows NEW during its first week');
      await page.evaluate(() => {
        window.rotorStartCalls = 0;
        window.rotorStopCalls = 0;
        const start = AhaanAudio.startRotor.bind(AhaanAudio);
        const stop = AhaanAudio.stopRotor.bind(AhaanAudio);
        AhaanAudio.startRotor = () => { window.rotorStartCalls++; start(); };
        AhaanAudio.stopRotor = () => { window.rotorStopCalls++; stop(); };
      });
      if (viewport.width === 1280) await page.screenshot({ path: path.join(evidenceDir, 'parked-desktop.png') });
      else await page.screenshot({ path: path.join(evidenceDir, 'parked-mobile.png') });
      point = `mount-${viewport.width}`;
      await page.evaluate(() => Park3D.teleportAhaan(23, -20));
      const normalAhaanScale = await page.evaluate(() => Park3D.getA().rig.scale.x);
      await page.waitForFunction(() => Park3D.getCurrentNearbyItem()?.id === 'chopper');
      await page.keyboard.press('e');
      await page.waitForFunction(() => Park3D.getChopperState().riding);
      assert.ok((await page.evaluate(() => Park3D.getA().rig.scale.x)) < normalAhaanScale, 'rider fits the chopper cabin');
      assert.ok((await page.evaluate(() => Park3D.getChopperState().altitude)) >= 10, 'safe default flight height');
      assert.equal(await page.evaluate(() => window.rotorStartCalls), 1, 'rotor sound starts on mount');
      const checkClickTarget = async (stateName, key) => {
        point = `click-${stateName}-${viewport.width}`;
        const clickAt = async (xRatio, yRatio) => {
          const rect = await page.evaluate(() => {
          window.scrollTo(0, 0);
          const bounds = document.querySelector('#parkCanvas').getBoundingClientRect();
          return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
          });
          const clickX = Math.max(1, Math.min(viewport.width - 2, rect.x + rect.width * xRatio));
          const clickY = Math.max(1, Math.min(viewport.height - 2, rect.y + rect.height * yRatio));
          if (viewport.width === 390) await page.touchscreen.tap(clickX, clickY);
          else await page.mouse.click(clickX, clickY);
        };
        await clickAt(stateName === 'getChopperState' ? 0.9 : 0.6, stateName === 'getChopperState' ? 0.9 : 0.62);
        await page.waitForFunction(name => Park3D[name]().target, stateName, { timeout: 5000 });
        const goal = await page.evaluate(name => Park3D[name]().target, stateName);
        if (stateName === 'getChopperState') {
          await page.evaluate(() => {
            const state = Park3D.getChopperState();
            const mobile = innerWidth <= 390;
            const forward = { x: Math.sin(state.heading), z: Math.cos(state.heading) };
            const side = { x: Math.cos(state.heading), z: -Math.sin(state.heading) };
            const distance = mobile ? 14 : 9, sideOffset = mobile ? 4 : 2;
            const aim = { x: state.x, y: state.altitude + (mobile ? 3 : 1), z: state.z };
            Park3D.setCustomCamera({ x: state.x - forward.x * distance - side.x * sideOffset, y: state.altitude + (mobile ? 12 : 6), z: state.z - forward.z * distance - side.z * sideOffset }, aim);
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(250);
          await page.screenshot({ path: path.join(evidenceDir, viewport.width === 1280 ? 'target-desktop.png' : 'target-mobile.png') });
          if (viewport.width === 1280) {
            await page.waitForFunction(() => !Park3D.getChopperState().target, undefined, { timeout: 20000 });
            const arrived = await page.evaluate(() => Park3D.getChopperState());
            assert.ok(Math.hypot(arrived.x - goal.x, arrived.z - goal.z) < 1.2, 'chopper reaches its clicked point');
            assert.ok(Math.abs(arrived.altitude - 10.5) < 0.1, 'click flight stays at safe cruising height');
            await page.screenshot({ path: path.join(evidenceDir, 'arrived-desktop.png') });
          }
        }
        if (stateName !== 'getChopperState' || viewport.width === 1280) {
          point = `arrive-${stateName}-${viewport.width}`;
          try { await page.waitForFunction(name => !Park3D[name]().target, stateName, { timeout: 45000 }); }
          catch (error) { throw new Error(`${error.message}; stuck state ${JSON.stringify(await page.evaluate(name => Park3D[name](), stateName))}`); }
          const arrived = await page.evaluate(name => Park3D[name](), stateName);
          const arrivalDistance = Math.hypot(arrived.x - goal.x, arrived.z - goal.z);
          assert.ok(arrivalDistance < 1.2, `${stateName} reaches its clicked point (${arrivalDistance.toFixed(2)} m; target ${JSON.stringify(goal)}; state ${JSON.stringify(arrived)})`);
          assert.ok(arrived.speed < 0.2, `${stateName} stops at its clicked point (speed ${arrived.speed.toFixed(2)} m/s; target ${JSON.stringify(goal)}; state ${JSON.stringify(arrived)})`);
        }
        point = `cancel-${stateName}-${viewport.width}`;
        await clickAt(0.1, 0.35);
        await page.waitForFunction(name => Park3D[name]().target, stateName, { timeout: 5000 });
        const beforeCancel = await page.evaluate(name => Park3D[name](), stateName);
        await page.keyboard.down(key);
        await page.waitForTimeout(350);
        const cancelState = await page.evaluate(name => Park3D[name](), stateName);
        if (cancelState.target) throw new Error(`manual key did not cancel ${stateName} target: ${JSON.stringify(cancelState)}`);
        if (stateName === 'getChopperState') assert.ok(Math.hypot(cancelState.x - beforeCancel.x, cancelState.z - beforeCancel.z) > 0.04, 'chopper moves under manual control');
        else assert.ok(cancelState.speed > 0.1, `${stateName} accepts manual input`);
        if (stateName === 'getChopperState') assert.ok(Math.abs(cancelState.altitude - 10.5) < 0.1, 'arrow flight stays at safe cruising height');
        await page.keyboard.up(key);
      };
      const mountAhaan = async (x, z, id, stateName, key) => {
        await page.evaluate(([px, pz]) => Park3D.teleportAhaan(px, pz), [x, z]);
        await page.evaluate(([px, pz]) => Park3D.setCustomCamera({ x: px + 8, y: 10, z: pz + 12 }, { x: px, y: 1, z: pz }), [x, z]);
        await page.waitForFunction(name => Park3D.getCurrentNearbyItem()?.id === name, id);
        await page.keyboard.press('e');
        await page.waitForFunction(name => Park3D[name]().riding || Park3D[name]().driving, stateName);
        await checkClickTarget(stateName, key);
        await page.keyboard.press('e');
      };
      await checkClickTarget('getChopperState', 'ArrowUp');
      if (viewport.width === 1280) {
        await page.keyboard.down('ArrowDown');
        await page.waitForFunction(() => Park3D.getChopperState().speed < 0.2, { timeout: 10000 });
        await page.keyboard.up('ArrowDown');
        await page.keyboard.down('ShiftLeft');
        await page.waitForFunction(() => Park3D.getChopperState().altitude < 0.05, { timeout: 10000 });
        await page.keyboard.up('ShiftLeft');
        await page.keyboard.press('e');
        await page.waitForFunction(() => !Park3D.getChopperState().riding);
        assert.ok(Math.abs((await page.evaluate(() => Park3D.getA().rig.scale.x)) - normalAhaanScale) < 0.001, 'Ahaan returns to normal size after dismount');
        assert.equal(await page.evaluate(() => window.rotorStopCalls), 1, 'rotor sound stops on dismount');
        await mountAhaan(-0.65, 6.2, 'bike', 'getBikeState', 'ArrowUp');
        await mountAhaan(-13, 7, 'ebike', 'getEbikeState', 'KeyW');
        await mountAhaan(-20, -14, 'car', 'getCarState', 'KeyW');
        await page.evaluate(() => {
          document.querySelector('#togetherBtn').click();
          const chopper = Park3D.getChopperState();
          Park3D.teleportAhaan(chopper.x, chopper.z + 1);
          Park3D.teleportVihaan(chopper.x, chopper.z);
        });
        await page.waitForFunction(() => Park3D.getVihaanNearbyItem() === 'chopper');
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => Park3D.getChopperState().riding);
        const rect = await page.evaluate(() => {
          const bounds = document.querySelector('#parkCanvas').getBoundingClientRect();
          return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
        });
        await page.mouse.click(Math.min(1278, rect.x + rect.width * 0.9), Math.min(798, rect.y + rect.height * 0.9));
        await page.waitForFunction(() => Park3D.getChopperState().target);
        const ahaanBefore = await page.evaluate(() => Park3D.getA().rig.position.z);
        await page.keyboard.down('w');
        await page.waitForTimeout(250);
        await page.keyboard.up('w');
        const twinInput = await page.evaluate(() => ({ ahaanZ: Park3D.getA().rig.position.z, target: Park3D.getChopperState().target }));
        assert.ok(twinInput.ahaanZ < ahaanBefore, 'Ahaan keeps WASD walking while Vihaan flies');
        assert.ok(twinInput.target, 'Ahaan input does not cancel Vihaan target');
        await page.keyboard.down('ArrowUp');
        await page.waitForFunction(() => !Park3D.getChopperState().target);
        await page.keyboard.up('ArrowUp');
      } else {
        await page.keyboard.down('ArrowDown');
        await page.waitForFunction(() => Park3D.getChopperState().speed < 0.2, undefined, { timeout: 10000 });
        await page.keyboard.up('ArrowDown');
        await page.keyboard.down('ShiftLeft');
        await page.waitForFunction(() => Park3D.getChopperState().altitude < 0.05, undefined, { timeout: 10000 });
        await page.keyboard.up('ShiftLeft');
        await page.keyboard.press('e');
        await page.waitForFunction(() => !Park3D.getChopperState().riding);
        await mountAhaan(-0.65, 6.2, 'bike', 'getBikeState', 'ArrowUp');
        await mountAhaan(-13, 7, 'ebike', 'getEbikeState', 'KeyW');
        await mountAhaan(-20, -14, 'car', 'getCarState', 'KeyW');
      }
      point = `fresh-drops-${viewport.width}`;
      await page.goto(siteUrl('fresh-drops.html'), { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => [...document.querySelectorAll('.fresh-drop-comparison img')].every(image => image.complete && image.naturalWidth > 0));
      assert.equal(await page.locator('.fresh-drop-comparison figure').count(), 2, 'Fresh Drops shows before and after images');
      assert.equal(await page.locator('.fresh-drop-comparison').evaluate(el => el.scrollWidth > el.clientWidth), false, 'before and after images fit the card');
      assert.equal(await page.locator('.fresh-drop-comparison [data-fresh-new]').evaluate(badge => badge.hidden), false, 'Fresh Drops chopper entry shows NEW');
      await page.screenshot({ path: path.join(evidenceDir, `fresh-drops-${viewport.width === 1280 ? 'desktop' : 'mobile'}.png`), fullPage: true });
      assert.deepEqual(errors, [], 'browser errors');
      await page.close();
    }
    process.stdout.write(JSON.stringify({ desktop: 'pass', mobile: 'pass', chopperClick: 'pass', arrowCancel: 'pass', safeHeight: 'pass', rotorStartStop: 'pass', screenshots: evidenceDir }));
  } finally { clearTimeout(timeout); await browser.close(); if (server.listening) server.close(); }
})().catch(error => { console.error(`FAIL at ${point}:`, error); clearTimeout(timeout); if (server.listening) server.close(); process.exitCode = 1; });
