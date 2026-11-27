const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-nav-lean';
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

      const row = await page.evaluate(() => {
        const rect = selector => {
          const { top, bottom, left, right } = document.querySelector(selector).getBoundingClientRect();
          return { top, bottom, left, right };
        };
        return {
          navHeight: document.querySelector('.nav').getBoundingClientRect().height,
          brand: rect('.brand'),
          menu: rect('#menuBtn'),
          links: rect('#navLinks'),
          controls: rect('.nav-controls'),
          groupCount: document.querySelectorAll('#navLinks > .nav-group').length,
          topControlButtons: document.querySelectorAll('.nav-controls > button').length,
          controlPanels: document.querySelectorAll('.nav-controls > details').length
        };
      });
      assert.equal(row.groupCount, 4, `${viewport.name}: four nav groups remain`);
      assert.equal(row.topControlButtons, 0, `${viewport.name}: no separate control pills remain`);
      assert.equal(row.controlPanels, 1, `${viewport.name}: one controls button remains`);
      assert.ok(row.navHeight < 100, `${viewport.name}: the nav uses one slim row`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${viewport.name}: no horizontal overflow`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}.png`) });

      if (viewport.name === 'desktop') {
        const centers = [row.brand, row.links, row.controls].map(box => (box.top + box.bottom) / 2);
        assert.ok(Math.max(...centers) - Math.min(...centers) < 3, 'desktop: brand, groups, and controls share one row');
        for (const [name, hrefs] of Object.entries(groups)) {
          const group = page.locator('#navLinks > .nav-group').filter({ has: page.locator('.nav-gbtn', { hasText: name }) });
          await group.locator('.nav-gbtn').click();
          assert.equal(await group.locator('.nav-gbtn').getAttribute('aria-expanded'), 'true', `desktop: ${name} opens`);
          assert.deepEqual(await group.locator('.nav-pop a').evaluateAll(links => links.map(link => link.getAttribute('href'))), hrefs, `desktop: ${name} destinations remain`);
          for (const href of hrefs) {
            const response = await page.request.get(new URL(href, baseUrl).href);
            assert.equal(response.status(), 200, `desktop: ${href} responds`);
          }
        }
      } else {
        assert.equal(await page.locator('#menuBtn').isVisible(), true, 'mobile: compact menu button shows');
        await page.locator('#menuBtn').click();
        assert.equal(await page.locator('#navLinks').evaluate(element => element.classList.contains('open')), true, 'mobile: menu opens');
        for (const [name, hrefs] of Object.entries(groups)) {
          const group = page.locator('#navLinks > .nav-group').filter({ has: page.locator('.nav-gbtn', { hasText: name }) });
          assert.equal(await group.locator('.nav-pop a').count(), hrefs.length, `mobile: ${name} destinations remain available`);
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'mobile menu has no horizontal overflow');
        await page.screenshot({ path: path.join(evidenceDir, 'mobile-menu.png'), fullPage: true });
        await page.locator('#menuBtn').click();
      }

      const controls = page.locator('#parkControls');
      await controls.locator('summary').click();
      assert.equal(await controls.locator('#parkControlsPanel').isVisible(), true, `${viewport.name}: controls panel opens`);
      assert.equal(await page.locator('#parkControlsOk').isVisible(), true, `${viewport.name}: OK button appears at panel bottom`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-controls.png`) });

      for (const mode of ['day', 'night', 'auto']) {
        await page.locator(`[data-park-day="${mode}"]`).click();
        assert.equal(await page.locator(`[data-park-day="${mode}"]`).getAttribute('aria-pressed'), 'true', `${viewport.name}: ${mode} button works`);
      }
      await page.locator('#parkDayMode').selectOption('night');
      assert.equal(await page.locator('[data-park-day="night"]').getAttribute('aria-pressed'), 'true', `${viewport.name}: day and night selector works`);
      await page.locator('#parkDayMode').selectOption('auto');
      assert.equal(await page.locator('[data-park-day="auto"]').getAttribute('aria-pressed'), 'true', `${viewport.name}: Auto selector works`);
      await page.locator('#parkWeatherMode').selectOption('heavy-rain');
      assert.equal(await page.locator('#parkWeatherMode').inputValue(), 'heavy-rain', `${viewport.name}: weather selector works`);
      for (const id of ['breezeBtn', 'soundBtn', 'togetherBtn']) {
        const control = page.locator(`#${id}`);
        const initial = await control.getAttribute('aria-pressed');
        await control.click();
        assert.equal(await control.getAttribute('aria-pressed'), String(initial !== 'true'), `${viewport.name}: ${id} toggles on`);
        await control.click();
        assert.equal(await control.getAttribute('aria-pressed'), initial, `${viewport.name}: ${id} toggles back`);
      }
      await page.locator('#parkControlsOk').click();
      assert.equal(await controls.evaluate(element => element.open), false, `${viewport.name}: OK closes controls`);
      assert.equal(await controls.locator('summary').evaluate(element => document.activeElement === element), true, `${viewport.name}: focus returns to Controls`);

      await page.goto(`${baseUrl}fresh-drops.html`, { waitUntil: 'domcontentloaded' });
      const freshCard = page.locator('.fresh-drop').filter({ hasText: 'One tidy row for Park controls' }).first();
      assert.equal(await freshCard.locator('time').getAttribute('datetime'), '2026-11-27');
      assert.equal(await freshCard.locator('[data-fresh-new]').getAttribute('hidden'), null, `${viewport.name}: Fresh Drops NEW tag shows`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-fresh-drops.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], `browser has no page or console errors: ${errors.join(' | ')}`);
    process.stdout.write(JSON.stringify({ viewports: ['desktop 1280x800', 'mobile 390x844'], controls: 'pass', groups: Object.keys(groups), freshDrops: 'pass', errors, evidenceDir }));
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
