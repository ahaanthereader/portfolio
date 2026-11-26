// Check the home navigation at desktop and mobile sizes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-nav-fix';

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
      const layout = await page.evaluate(() => {
        const rect = element => { const { x, y, width, height } = element.getBoundingClientRect(); return { x, y, width, height, right: x + width, bottom: y + height }; };
        const intersects = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
        const nav = document.querySelector('#navLinks');
        const controls = document.querySelector('.nav-controls');
        const park = document.querySelector('.park-weather-controls summary');
        const buttons = [...document.querySelectorAll('.nav-gbtn')];
        const pills = [...document.querySelectorAll('.nav-controls .breeze-pill')];
        return {
          labelColor: getComputedStyle(buttons[0]).color,
          brandColor: getComputedStyle(document.querySelector('.brand')).color,
          caretDisplay: getComputedStyle(buttons[0], '::after').display,
          caretWhiteSpace: getComputedStyle(buttons[0]).whiteSpace,
          navControlsOverlap: intersects(rect(nav), rect(controls)),
          parkOverlapsNav: intersects(rect(park), rect(nav)),
          pills: pills.map(button => ({ text: button.innerText, whiteSpace: getComputedStyle(button).whiteSpace, scrollHeight: button.scrollHeight, clientHeight: button.clientHeight })),
          hasMotionHighlight: Boolean(nav.querySelector('.nav-highlight'))
        };
      });
      assert.equal(layout.labelColor, layout.brandColor, `${viewport.name}: home nav labels match the brand ink`);
      assert.equal(layout.caretWhiteSpace, 'nowrap', `${viewport.name}: nav labels do not wrap`);
      assert.equal(layout.navControlsOverlap, false, `${viewport.name}: controls stay clear of nav pill`);
      assert.equal(layout.parkOverlapsNav, false, `${viewport.name}: Park control stays clear of nav pill`);
      assert.ok(layout.pills.every(pill => pill.whiteSpace === 'nowrap' && pill.scrollHeight <= pill.clientHeight), `${viewport.name}: toggle pills stay on one line`);
      if (viewport.name === 'desktop') {
        await page.locator('.nav-gbtn').filter({ hasText: 'Play' }).click();
        await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.nav-highlight')).opacity) > 0);
        assert.equal(await page.locator('#ng-play').isVisible(), true, 'desktop: Play dropdown opens');
        assert.equal(await page.locator('.nav-group.is-current .nav-gbtn').innerText().then(text => text.includes('Play')), true, 'desktop: opened group is active');
        const dropdownClearsControls = await page.evaluate(() => {
          const menu = document.querySelector('#ng-play').getBoundingClientRect();
          const controls = document.querySelector('.nav-controls').getBoundingClientRect();
          return menu.top >= controls.bottom;
        });
        assert.equal(dropdownClearsControls, true, 'desktop: open dropdown stays below Park and toggle controls');
      } else {
        await page.locator('#menuBtn').click();
        assert.equal(await page.locator('#navLinks').evaluate(element => element.classList.contains('open')), true, 'mobile: menu opens');
        assert.equal(await page.locator('#navLinks .nav-group').count(), 4, 'mobile: all four nav groups remain available');
      }
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}.png`) });
      await page.close();
    }
    assert.deepEqual(errors, [], 'browser reports no page or console errors');
    console.log(JSON.stringify({ viewports: ['desktop 1280x800', 'mobile 390x844'], errors, evidenceDir }, null, 2));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
