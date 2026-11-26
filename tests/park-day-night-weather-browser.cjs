const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-day-night-weather';
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
    for (const viewport of [{ name: 'desktop', width: 1280, height: 800 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width === 390, hasTouch: viewport.width === 390 });
      page.on('pageerror', error => errors.push(`${viewport.name}: ${error.message}`));
      page.on('console', message => { if (message.type() === 'error') errors.push(`${viewport.name}: ${message.text()}`); });
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D?.getDayWeatherState && document.querySelector('#parkCanvas'));
      const dayControl = page.locator('.park-day-quick');
      assert.equal(await dayControl.isVisible(), true, `${viewport.name}: prominent day control is visible`);
      await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-day-night-control.png`) });

      const nightButton = page.locator('[data-park-day="night"]');
      if (viewport.width === 390) await nightButton.tap(); else await nightButton.click();
      assert.equal((await page.evaluate(() => Park3D.getDayWeatherState())).dayMode, 'night');
      const autoButton = page.locator('[data-park-day="auto"]');
      if (viewport.width === 390) await autoButton.tap(); else await autoButton.click();
      assert.equal(await page.locator('#parkDayMode').inputValue(), 'auto');

      await page.locator('.park-weather-controls summary').click();
      await page.locator('#parkWeatherMode').selectOption('rain');
      await page.waitForTimeout(1200);
      const lightRainFill = await page.evaluate(() => Park3D.getDayWeatherState().averagePuddleFill);
      for (const weather of ['heavy-rain', 'stormy']) {
        await page.locator('#parkWeatherMode').selectOption(weather);
        await page.waitForTimeout(weather === 'heavy-rain' ? 1200 : 500);
        const state = await page.evaluate(() => Park3D.getDayWeatherState());
        assert.equal(state.weatherMode, weather, `${viewport.name}: ${weather} selection`);
        assert.equal(state.visibleRainCount, 48, `${viewport.name}: ${weather} uses all pooled rain streaks`);
        if (weather === 'heavy-rain') assert.ok(state.averagePuddleFill > lightRainFill + 0.15, `${viewport.name}: heavy rain fills puddles faster`);
        if (weather === 'stormy') {
          assert.equal(state.stormy, true);
          assert.ok(state.sunIntensity < 0.8, `${viewport.name}: stormy weather reduces daylight`);
          assert.ok(state.exposure < 0.8, `${viewport.name}: stormy weather darkens the Park view`);
        }
        await page.screenshot({ path: path.join(evidenceDir, `${viewport.name}-${weather}.png`) });
      }
      assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false', `${viewport.name}: sound stays off`);
      if (viewport.name === 'desktop') {
        await page.locator('#soundBtn').click();
        await page.waitForFunction(() => Park3D.getDayWeatherState().lightningGlow > 0.2, undefined, { timeout: 13000 });
        await page.screenshot({ path: path.join(evidenceDir, 'desktop-stormy-lightning.png') });
      }
      await page.close();
    }
    assert.deepEqual(errors, [], 'The page must not report browser errors.');
    console.log(`park-day-night-weather-browser: PASS (desktop + mobile, quick day controls, heavy rain, stormy, sound off, zero browser errors). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
