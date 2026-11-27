// Fresh Drops checks for the newest live image and seven-day NEW labels.
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
      const navLeanCard = page.locator('.fresh-drop').filter({ hasText: 'One tidy row for Park controls' }).first();
      assert.equal(await navLeanCard.locator('time').getAttribute('datetime'), '2026-11-27');
      assert.equal(await navLeanCard.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: nav lean card NEW badge is visible`);
      const navLeanScreenshot = navLeanCard.locator('img');
      assert.match(await navLeanScreenshot.getAttribute('src'), /2026-11-27-nav-lean\.png$/);
      await navLeanScreenshot.scrollIntoViewIfNeeded();
      await navLeanScreenshot.evaluate(image => image.decode());
      assert.ok(await navLeanScreenshot.evaluate(image => image.complete && image.naturalWidth >= 1200), `${viewport.name}: nav lean screenshot loads at full width`);

      const realismCard = page.locator('.fresh-drop').filter({ hasText: 'A brighter Park with more depth' }).first();
      assert.equal(await realismCard.locator('time').getAttribute('datetime'), '2026-11-27');
      assert.equal(await realismCard.locator('h2').textContent(), 'A brighter Park with more depth');
      const realismScreenshot = realismCard.locator('img');
      assert.match(await realismScreenshot.getAttribute('src'), /2026-11-27-park-realism\.png$/);
      await realismScreenshot.scrollIntoViewIfNeeded();
      await realismScreenshot.evaluate(image => image.decode());
      assert.ok(await realismScreenshot.evaluate(image => image.complete && image.naturalWidth >= 1200), `${viewport.name}: Park realism screenshot loads at full width`);

      const booksCard = page.locator('.fresh-drop').filter({ hasText: "Aesop's Fables joins the book shelf" }).first();
      assert.equal(await booksCard.locator('time').getAttribute('datetime'), '2026-11-26');
      assert.equal(await booksCard.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: books card NEW badge is visible`);
      const booksScreenshot = booksCard.locator('img');
      assert.match(await booksScreenshot.getAttribute('src'), /2026-11-26-books-shelf\.png$/);
      await booksScreenshot.scrollIntoViewIfNeeded();
      await booksScreenshot.evaluate(image => image.decode());
      assert.ok(await booksScreenshot.evaluate(image => image.complete && image.naturalWidth >= 1200), `${viewport.name}: books shelf screenshot loads at full width`);

      const zooCard = page.locator('.fresh-drop').filter({ hasText: /You asked to meet the animals/ }).first();
      assert.equal(await zooCard.locator('time').getAttribute('datetime'), '2026-11-26');
      assert.equal(await zooCard.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: zoo card NEW badge is visible`);
      const zooScreenshot = zooCard.locator('img');
      assert.match(await zooScreenshot.getAttribute('src'), /2026-11-26-zoo-interact\.png$/);
      await zooScreenshot.scrollIntoViewIfNeeded();
      await zooScreenshot.evaluate(image => image.decode());
      assert.ok(await zooScreenshot.evaluate(image => image.complete && image.naturalWidth >= 1200), `${viewport.name}: zoo screenshot loads at full width`);
      await page.screenshot({ path: path.join(evidenceDir, `fresh-drops-${viewport.name}.png`) });

      await page.goto(`${baseUrl}/index.html`, { waitUntil: 'commit' });
      await page.waitForFunction(() => document.querySelector('.fresh-drops-home [data-fresh-new]')?.hidden === false, null, { timeout: 10000 });
      assert.equal(await page.locator('.fresh-drops-home').getAttribute('data-latest-date'), '2026-11-27');
      assert.equal(await page.locator('.fresh-drops-home [data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: home card shows NEW`);
      assert.equal(await page.locator('.park-rides-nav').getAttribute('data-new-date'), '2026-11-27');
      assert.equal(await page.locator('.park-rides-nav [data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: Park rides menu shows NEW`);
      const readingNav = page.locator('.fresh-drops-nav[href="reading.html"]');
      assert.equal(await readingNav.getAttribute('data-new-date'), '2026-11-26');
      assert.equal(await readingNav.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: Reading Nook menu shows NEW`);
      const zooLink = page.locator('#ng-play a[href="index.html#zoo"]');
      assert.equal(await zooLink.getAttribute('data-new-date'), '2026-11-26');
      assert.equal(await zooLink.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: Zoo menu shows NEW`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: no horizontal overflow`);
      await page.screenshot({ path: path.join(evidenceDir, `home-${viewport.name}.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], `Browser errors: ${errors.join(' | ')}`);
    console.log(`recent-fresh-drops-browser: PASS (desktop + mobile, books and zoo screenshots, NEW labels, zero browser errors). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
