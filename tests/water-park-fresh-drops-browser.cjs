// Fresh Drops checks for the live water park image and seven-day NEW labels.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-water-park-fresh-drops';

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
    baseUrl = `http://127.0.0.1:${server.address().port}`;
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
      await page.goto(`${baseUrl}/fresh-drops.html`, { waitUntil: 'domcontentloaded' });
      const firstCard = page.locator('.fresh-drop').first();
      assert.match(await firstCard.locator('h2').textContent(), /bigger park with gentle water/i, `${viewport.name}: park expansion card is first`);
      assert.equal(await firstCard.locator('time').getAttribute('datetime'), '2026-11-24');
      assert.equal(await firstCard.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: NEW badge is visible`);
      const screenshot = firstCard.locator('img');
      assert.match(await screenshot.getAttribute('src'), /2026-11-24-park-expand-water\.png$/);
      await screenshot.scrollIntoViewIfNeeded();
      await screenshot.evaluate(image => image.decode());
      assert.ok(await screenshot.evaluate(image => image.complete && image.naturalWidth >= 1200), `${viewport.name}: live screenshot loads at full width`);
      await page.screenshot({ path: path.join(evidenceDir, `fresh-drops-${viewport.name}.png`) });

      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('.fresh-drops-home').getAttribute('data-latest-date'), '2026-11-24');
      assert.equal(await page.locator('.fresh-drops-home [data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: home card shows NEW`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: no horizontal overflow`);
      await page.screenshot({ path: path.join(evidenceDir, `home-${viewport.name}.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], `Browser errors: ${errors.join(' | ')}`);
    console.log(`park-expand-water-fresh-drops-browser: PASS (desktop + mobile, image, NEW labels, zero browser errors). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
