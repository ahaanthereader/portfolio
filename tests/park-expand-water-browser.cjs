const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-park-expand-water';
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
      page.on('pageerror', error => errors.push(`${viewport.name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${viewport.name}: ${message.text()}`); });
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getA && document.querySelector('#top canvas'));

      const layout = await page.evaluate(() => {
        const sceneGroup = Park3D.getA().rig.parent;
        let mississippi = 0, lazyRiver = 0;
        sceneGroup.traverse(object => {
          if (object.name === 'mississippi-ripple') mississippi++;
          if (object.name === 'lazy-river-ripple') lazyRiver++;
        });
        return { scale: sceneGroup.scale.toArray(), mississippi, lazyRiver };
      });
      assert.deepEqual(layout.scale, [1.2, 1, 1.2], `${viewport.name}: expanded park scale`);
      assert.equal(layout.mississippi, 5, `${viewport.name}: Mississippi ripples`);
      assert.equal(layout.lazyRiver, 8, `${viewport.name}: lazy river ripples`);
      assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false', `${viewport.name}: water stays silent`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-park.png`) });

      const before = await page.evaluate(() => {
        const ring = Park3D.getA().rig.parent.getObjectByName('mississippi-ripple');
        return ring.material.opacity;
      });
      await page.waitForTimeout(500);
      const after = await page.evaluate(() => Park3D.getA().rig.parent.getObjectByName('mississippi-ripple').material.opacity);
      assert.notEqual(after, before, `${viewport.name}: water ripples animate`);

      await page.evaluate(() => Park3D.teleportAhaan(0, 14.5));
      await page.waitForFunction(() => {
        let visible = 0;
        Park3D.getA().rig.parent.traverse(object => { if (object.name === 'splash-droplet-ahaan' && object.visible) visible++; });
        return visible > 0;
      });
      await page.locator('#togetherBtn').click();
      await page.evaluate(() => Park3D.teleportVihaan(1, 14.5));
      await page.waitForFunction(() => {
        let visible = 0;
        Park3D.getA().rig.parent.traverse(object => { if (object.name === 'splash-droplet-vihaan' && object.visible) visible++; });
        return visible > 0;
      });
      await page.locator('#mctlReset').click();
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-splash-zone.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], 'The page must not report browser errors.');
    console.log(`park-expand-water-browser: PASS (desktop + mobile, expanded map, animated water, both boys splashed, zero browser errors). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
