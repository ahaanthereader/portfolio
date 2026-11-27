const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-park-realism';
const errors = [];
let server;

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
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
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.addInitScript(() => localStorage.removeItem('ahaanDoorsSound'));
      await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getDayWeatherState);
      await page.evaluate(() => {
        for (const [id, value] of [['parkDayMode', 'day'], ['parkWeatherMode', 'sunny']]) {
          const control = document.getElementById(id);
          control.value = value;
          control.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(evidenceDir, `day-${viewport.width}.png`) });
      const day = await page.evaluate(() => Park3D.getDayWeatherState());
      assert.equal(day.dayMode, 'day');
      assert.equal(day.weatherMode, 'sunny');
      const fps = await page.evaluate(async () => {
        let frames = 0;
        const start = performance.now();
        await new Promise(resolve => {
          function sample(now) {
            frames++;
            if (now - start >= 2000) resolve();
            else requestAnimationFrame(sample);
          }
          requestAnimationFrame(sample);
        });
        return Math.round(frames / ((performance.now() - start) / 1000));
      });
      await page.evaluate(() => {
        document.documentElement.dataset.motion = 'off';
        const control = document.getElementById('parkDayMode');
        control.value = 'night';
        control.dispatchEvent(new Event('change', { bubbles: true }));
      });
      const night = await page.evaluate(() => Park3D.getDayWeatherState());
      assert.equal(night.dayMode, 'night');
      assert.ok(night.nightMix > day.nightMix);
      assert.ok(night.sunIntensity < day.sunIntensity, 'night uses dimmer sunlight');
      await page.evaluate(() => {
        const control = document.getElementById('parkWeatherMode');
        control.value = 'rain';
        control.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(400);
      const rain = await page.evaluate(() => Park3D.getDayWeatherState());
      assert.equal(rain.weatherMode, 'rain');
      await page.evaluate(() => { delete document.documentElement.dataset.motion; });
      await page.waitForFunction(() => Park3D.getDayWeatherState().visibleRainCount > 0, null, { timeout: 5000 });
      results.push({ viewport: viewport.width, fps, day: day.dayMode, night: night.dayMode, weather: rain.weatherMode });
      await page.close();
    }
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto(`http://127.0.0.1:${server.address().port}/fresh-drops.html`, { waitUntil: 'domcontentloaded' });
      const firstCard = page.locator('.fresh-drop').first();
      assert.equal(await firstCard.locator('time').getAttribute('datetime'), '2026-11-27');
      assert.equal(await firstCard.locator('h2').textContent(), 'A brighter Park with more depth');
      const image = firstCard.locator('img');
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(element => element.decode());
      assert.ok(await image.evaluate(element => element.naturalWidth > 0), 'Fresh Drops screenshot loads');
      assert.equal(await firstCard.locator('[data-fresh-new]').getAttribute('hidden'), null, 'Park Fresh Drops card shows NEW');
      await page.screenshot({ path: path.join(evidenceDir, `fresh-drops-${viewport.width}.png`), fullPage: true });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Fresh Drops has no horizontal overflow');
      await page.close();
    }
    assert.deepEqual(errors, [], 'browser has no console or page errors');
    process.stdout.write(JSON.stringify({ results, freshDrops: 'pass', errors, screenshots: evidenceDir }));
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => {
  console.error(error);
  if (server) server.close();
  process.exitCode = 1;
});
