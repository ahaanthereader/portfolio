const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = '/tmp/ahaan-park-pyramid';
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
      await page.waitForFunction(() => window.Park3D?.getPyramidState);
      await page.evaluate(mobile => Park3D.setCustomCamera(mobile ? { x: 43, y: 35, z: 112 } : { x: 38, y: 26, z: 78 }, mobile ? { x: 43, y: 5.75, z: 42 } : { x: 38, y: 5.75, z: 42 }), viewport.width === 390);
      const state = await page.evaluate(() => Park3D.getPyramidState());
      assert.deepEqual(state.position, { x: 38, z: 42 }, 'pyramid sits at the selected southeast site');
      assert.equal(state.baseSize, 16, 'pyramid has a large base');
      assert.equal(state.height, 11.5, 'pyramid is visible above the train loop');
      assert.equal(state.color, 0xc7a066, 'pyramid uses a warm sandstone color');
      assert.equal(state.visible, true, 'pyramid body is visible');
      assert.equal(state.signVisible, true, 'pyramid sign is visible');
      assert.equal(state.pathVisible, true, 'walk-up path is visible');
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(evidenceDir, `pyramid-${viewport.width}.png`) });
      const pyramidLink = page.locator('#ng-play a[href="index.html#pyramid"]');
      assert.equal(await pyramidLink.getAttribute('data-new-date'), '2026-11-23', 'Play menu lists the pyramid as new');
      assert.equal(await pyramidLink.locator('[data-fresh-new]').evaluate(node => node.hidden), false, 'Play menu shows the NEW badge');
      const pyramidUrl = new URL(baseUrl);
      pyramidUrl.hash = 'pyramid';
      await page.goto(pyramidUrl.href, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getA && Math.abs(Park3D.getA().rig.position.x - 38) < 0.1 && Math.abs(Park3D.getA().rig.position.z - 55.5) < 0.1);
      assert.deepEqual(errors, [], 'browser has no page errors');
      await page.close();
    }
    process.stdout.write(JSON.stringify({ desktop: 'pass', mobile: 'pass', site: 'pass', pyramid: 'pass', sign: 'pass', path: 'pass', playMenuNewLink: 'pass', directParkArrival: 'pass', errors, screenshots: evidenceDir }));
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => {
  console.error(error);
  if (server) server.close();
  process.exitCode = 1;
});
