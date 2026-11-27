// Check the single grouped navigation and Fresh Drops card.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-nav-consolidate';
const liveBaseUrl = process.env.BASE_URL;
const groups = {
  Read: ['reading.html', 'kindle.html', 'library.html', 'story.html', 'sketchbook.html'],
  Explore: ['geography.html', 'quiz.html', 'doors.html', 'bells.html'],
  Play: ['index.html#top', 'index.html#zoo', 'index.html#pyramid', 'index.html#waterpark', 'swing.html', 'games.html', 'music.html', 'movies.html'],
  'My stuff': ['calendar.html', 'rewards.html', 'journey.html', 'fresh-drops.html']
};

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  const server = liveBaseUrl ? null : http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const filePath = path.resolve(siteRoot, `.${pathname}`);
    if (!filePath.startsWith(`${siteRoot}${path.sep}`)) { response.writeHead(403).end(); return; }
    const target = fs.existsSync(filePath) && fs.statSync(filePath).isDirectory() ? path.join(filePath, 'index.html') : filePath;
    fs.readFile(target, (error, data) => {
      if (error) { response.writeHead(404).end(); return; }
      const type = target.endsWith('.html') ? 'text/html' : target.endsWith('.css') ? 'text/css' : target.endsWith('.js') ? 'text/javascript' : target.endsWith('.png') ? 'image/png' : 'application/octet-stream';
      response.writeHead(200, { 'content-type': type }).end(data);
    });
  });
  if (server) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = liveBaseUrl ? `${liveBaseUrl.replace(/\/$/, '')}/` : `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    for (const viewport of [{ name: 'desktop', width: 1280, height: 800 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(`${viewport.name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${viewport.name}: ${message.text()} (${message.location().url})`); });
      await page.goto(`${baseUrl}index.html`, { waitUntil: 'domcontentloaded' });
      await page.locator('#navLinks .nav-gbtn').first().waitFor({ state: 'attached' });

      const structure = await page.evaluate(() => ({
        groupCount: document.querySelectorAll('#navLinks > .nav-group').length,
        drawerCount: document.querySelectorAll('.candy-drawer, #candyShelf, #candyToggleBtn').length,
        oldFooterText: document.body.innerText.includes('Singapore Sketchbook Collection'),
        freshCard: (() => {
          const card = document.querySelector('.fresh-drops-home').getBoundingClientRect();
          const nav = document.querySelector('.nav').getBoundingClientRect();
          return { left: card.left, top: card.top, right: card.right, bottom: card.bottom, navBottom: nav.bottom, viewportWidth: innerWidth, viewportHeight: innerHeight };
        })()
      }));
      assert.equal(structure.groupCount, 4, `${viewport.name}: one set of four nav groups remains`);
      assert.equal(structure.drawerCount, 0, `${viewport.name}: duplicate drawer is absent`);
      assert.equal(structure.oldFooterText, false, `${viewport.name}: old drawer footer is absent`);
      assert.ok(structure.freshCard.left >= 0 && structure.freshCard.right <= structure.freshCard.viewportWidth, `${viewport.name}: Fresh Drops card stays inside the viewport width`);
      assert.ok(structure.freshCard.top >= structure.freshCard.navBottom && structure.freshCard.bottom <= structure.freshCard.viewportHeight, `${viewport.name}: Fresh Drops card clears the nav and viewport edges`);

      if (viewport.name === 'desktop') {
        for (const [groupName, expectedHrefs] of Object.entries(groups)) {
          const group = page.locator('#navLinks > .nav-group').filter({ has: page.locator('.nav-gbtn', { hasText: groupName }) });
          await group.locator('.nav-gbtn').click();
          assert.equal(await group.locator('.nav-gbtn').getAttribute('aria-expanded'), 'true', `desktop: ${groupName} opens`);
          assert.equal(await group.locator('.nav-pop').isVisible(), true, `desktop: ${groupName} items show`);
          assert.deepEqual(await group.locator('.nav-pop a').evaluateAll(links => links.map(link => link.getAttribute('href'))), expectedHrefs, `desktop: ${groupName} destinations and order stay unchanged`);
          assert.equal(await page.locator('#navLinks > .nav-group.open').count(), 1, 'desktop: only one group opens at a time');
          for (const href of expectedHrefs) {
            const response = await page.request.get(new URL(href, baseUrl).href);
            assert.equal(response.status(), 200, `desktop: ${href} destination responds`);
          }
          if (groupName === 'Read') await page.screenshot({ path: path.join(evidenceDir, 'desktop.png') });
        }
      } else {
        const menu = page.locator('#menuBtn');
        assert.equal(await menu.isVisible(), true, 'mobile: one compact menu button shows');
        await page.screenshot({ path: path.join(evidenceDir, 'mobile.png') });
        await menu.click();
        assert.equal(await page.locator('#navLinks').evaluate(element => element.classList.contains('open')), true, 'mobile: menu opens');
        for (const groupName of Object.keys(groups)) {
          const group = page.locator('#navLinks > .nav-group').filter({ has: page.locator('.nav-gbtn', { hasText: groupName }) });
          assert.equal(await group.locator('.nav-pop a').count(), groups[groupName].length, `mobile: ${groupName} items remain available`);
        }
        await page.screenshot({ path: path.join(evidenceDir, 'mobile-menu.png'), fullPage: true });
      }

      await page.goto(`${baseUrl}fresh-drops.html`, { waitUntil: 'domcontentloaded' });
      const navDrop = page.locator('.fresh-drop').filter({ hasText: 'One neat place to find things' }).first();
      assert.equal(await navDrop.locator('time').getAttribute('datetime'), '2026-11-26', `${viewport.name}: nav Fresh Drops card has current date`);
      assert.equal(await navDrop.locator('[data-fresh-new]').isVisible(), true, `${viewport.name}: nav card shows NEW`);
      await navDrop.locator('img').evaluate(image => image.decode());
      assert.ok(await navDrop.locator('img').evaluate(image => image.naturalWidth > 0), `${viewport.name}: nav screenshot loads`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-fresh-drops.png`) });

      await page.close();
    }
    assert.deepEqual(errors, [], 'browser reports no page or console errors');
    console.log(JSON.stringify({ viewports: ['desktop 1280x800', 'mobile 390x844'], destinations: Object.values(groups).flat().length, errors, evidenceDir }, null, 2));
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
