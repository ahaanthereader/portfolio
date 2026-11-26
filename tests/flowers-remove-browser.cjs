// Check clean Park edges on desktop and mobile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-flowers-remove';

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const server = http.createServer((request, response) => {
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
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    for (const viewport of [{ name: 'desktop', width: 1280, height: 800 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(`${viewport.name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${viewport.name}: ${message.text()}`); });
      await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.querySelector('.home-hero')?.classList.contains('park-ready'), null, { timeout: 45000 });
      assert.equal(await page.locator('.hero-botany').count(), 0, `${viewport.name}: no botanical overlay markup`);
      assert.equal(await page.locator('#parkCanvas').isVisible(), true, `${viewport.name}: Park canvas is visible`);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], 'browser reports no page or console errors');
    console.log(JSON.stringify({ viewports: ['desktop 1280x800', 'mobile 390x844'], flowers: 0, errors, evidenceDir }, null, 2));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
