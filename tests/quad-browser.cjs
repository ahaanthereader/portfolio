const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`);
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  const contentTypes = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  fs.readFile(file, (err, data) => res.writeHead(err ? 404 : 200, { 'content-type': contentTypes[path.extname(file)] || 'application/octet-stream' }).end(err ? '' : data));
});
let point = 'server-start';
const timeout = setTimeout(() => { console.error(`FAIL timeout at ${point}`); process.exit(2); }, 120000);
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, args: ['--disable-gpu', '--use-gl=swiftshader', '--disable-gpu-sandbox'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    point = 'page-load';
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    point = 'park-ready';
    await page.waitForFunction(() => window.Park3D?.getQuadState);
    point = 'enable-together';
    await page.evaluate(() => {
      const quad = Park3D.getQuadState();
      Park3D.teleportAhaan(quad.x + 2.5, quad.z);
    });
    await page.evaluate(() => document.querySelector('#togetherBtn').click());
    await page.waitForFunction(() => Park3D.isTogetherEnabled());
    point = 'move-vihaan-near-quad';
    await page.evaluate(() => {
      const quad = Park3D.getQuadState();
      Park3D.teleportVihaan(quad.x, quad.z);
    });
    console.log('immediately after teleport', await page.evaluate(() => ({ nearby: Park3D.getVihaanNearbyItem(), position: [Park3D.getV().rig.position.x, Park3D.getV().rig.position.z], together: Park3D.isTogetherEnabled() })));
    await page.waitForFunction(() => Park3D.getVihaanNearbyItem() === 'quad');
    point = 'mount';
    console.log('before Enter', await page.evaluate(() => ({ together: Park3D.isTogetherEnabled(), nearby: Park3D.getVihaanNearbyItem(), position: [Park3D.getV().rig.position.x, Park3D.getV().rig.position.z], riding: Park3D.getQuadState().riding })));
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true })));
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true })));
    console.log('after Enter', await page.evaluate(() => ({ nearby: Park3D.getVihaanNearbyItem(), riding: Park3D.getQuadState().riding })));
    assert.equal((await page.evaluate(() => Park3D.getQuadState())).riding, true, 'mount');
    point = 'click-target';
    await page.evaluate(() => {
      const quad = Park3D.getQuadState();
      Park3D.setCustomCamera({ x: quad.x + 8, y: 10, z: quad.z + 12 }, { x: quad.x, y: 1, z: quad.z });
    });
    const rect = await page.evaluate(() => {
      window.scrollTo(0, 0);
      const bounds = document.querySelector('#parkCanvas').getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    });
    await page.mouse.click(Math.max(1, Math.min(1278, rect.x + rect.width * 0.6)), Math.max(1, Math.min(798, rect.y + rect.height * 0.62)));
    await page.waitForFunction(() => Park3D.getQuadState().target);
    const goal = await page.evaluate(() => Park3D.getQuadState().target);
    point = 'arrive-target';
    await page.waitForFunction(() => !Park3D.getQuadState().target, undefined, { timeout: 45000 });
    const arrived = await page.evaluate(() => Park3D.getQuadState());
    assert.ok(Math.hypot(arrived.x - goal.x, arrived.z - goal.z) < 1.2, 'quad reaches its clicked point');
    assert.ok(arrived.speed < 0.2, 'quad stops at its clicked point');
    point = 'cancel-target';
    await page.mouse.click(Math.max(1, Math.min(1278, rect.x + rect.width * 0.4)), Math.max(1, Math.min(798, rect.y + rect.height * 0.62)));
    await page.waitForFunction(() => Park3D.getQuadState().target);
    await page.keyboard.down('ArrowUp');
    await page.waitForFunction(() => !Park3D.getQuadState().target);
    await page.keyboard.up('ArrowUp');
    const before = await page.evaluate(() => Park3D.getQuadState());
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(900);
    await page.keyboard.up('ArrowUp');
    const moving = await page.evaluate(() => Park3D.getQuadState());
    assert.ok(moving.z > before.z && moving.speed > 0, 'ride');
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true })));
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', bubbles: true })));
    assert.equal((await page.evaluate(() => Park3D.getQuadState())).riding, false, 'dismount');
    assert.deepEqual(errors, [], 'browser errors');
    point = 'complete';
    process.stdout.write(JSON.stringify({ mount: 'pass', ride: 'pass', dismount: 'pass', errors }));
  } finally { clearTimeout(timeout); await browser.close(); server.close(); }
})().catch(error => { console.error(`FAIL at ${point}:`, error); clearTimeout(timeout); server.close(); process.exitCode = 1; });
    point = 'ride';
    point = 'dismount';
