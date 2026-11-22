// Zoo section check: four animal pens, prompts, fact bubbles, Play together, desktop + mobile.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-zoo';
const ANIMALS = [
  { id: 'zoo-tiger', name: 'Tiger', x: -45, z: 37, fact: 'Tigers love to swim in cool water.' },
  { id: 'zoo-elephant', name: 'Elephant', x: -37, z: 45, fact: 'Elephants say hello with their trunks.' },
  { id: 'zoo-kangaroo', name: 'Kangaroo', x: -53, z: 45, fact: "Baby kangaroos ride in their mom's pouch." },
  { id: 'zoo-monkey', name: 'Monkey', x: -45, z: 53, fact: 'Monkeys help their friends stay clean.' }
];
// A spot outside each fence, on the plaza side.
const standAt = a => { const dx = -45 - a.x, dz = 45 - a.z, d = Math.hypot(dx, dz); return { x: a.x + dx / d * 4.6, z: a.z + dz / d * 4.6 }; };

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  let server;
  let baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    server = http.createServer((request, response) => {
      const requestedPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filePath = path.resolve(siteRoot, `.${requestedPath}`);
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
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    for (const vp of [{ name: 'desktop', width: 1280, height: 800 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      page.on('pageerror', error => errors.push(`${vp.name}: ${error.message}`));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(`${vp.name} console: ${msg.text()}`); });
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D && document.querySelector('#top canvas'));

      for (const animal of ANIMALS) {
        const spot = standAt(animal);
        await page.evaluate(({ x, z }) => window.Park3D.teleportAhaan(x, z), spot);
        await page.waitForTimeout(400);
        assert.equal(await page.evaluate(() => { const i = window.Park3D.getCurrentNearbyItem(); return i && i.id; }), animal.id, `${vp.name}: ${animal.name} prompt`);
        assert.match(await page.locator('#actionPromptText').textContent(), new RegExp(animal.name.toLowerCase()));
        await page.locator('#actionPromptBtn').click();
        await page.waitForTimeout(300);
        assert.match(await page.locator('#abGreeting').textContent(), new RegExp(`Hi, ${animal.name}`));
        assert.equal((await page.locator('#abSub').textContent()).trim(), animal.fact);
        await page.waitForTimeout(1200);
        await page.screenshot({ path: path.join(evidenceDir, `${vp.name}-${animal.name.toLowerCase()}.png`) });
      }

      // Keyboard path: Enter near the tiger.
      await page.evaluate(({ x, z }) => window.Park3D.teleportAhaan(x, z), standAt(ANIMALS[0]));
      await page.waitForTimeout(300);
      await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
      await page.evaluate(() => window.Park3D.teleportAhaan(-45, 41.4));
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      assert.match(await page.locator('#abGreeting').textContent(), /Hi, Tiger/);

      // Play together: Vihaan visits the kangaroo while Ahaan stands at the plaza.
      if (vp.name === 'desktop') {
        await page.evaluate(() => window.Park3D.teleportAhaan(-46, 45));
        await page.locator('#togetherBtn').click();
        await page.waitForTimeout(900);
        const kanga = standAt(ANIMALS[2]);
        await page.evaluate(({ x, z }) => window.Park3D.teleportVihaan(x, z), kanga);
        await page.waitForTimeout(300);
        assert.equal(await page.evaluate(() => window.Park3D.getVihaanNearbyItem()), 'zoo-kangaroo');
        assert.match(await page.locator('#vihaanActionPromptText').textContent(), /kangaroo/);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);
        assert.match(await page.locator('#abGreeting').textContent(), /Vihaan says hi, Kangaroo/);
        await page.waitForTimeout(1200);
        await page.screenshot({ path: path.join(evidenceDir, 'desktop-together.png') });
        await page.locator('#togetherBtn').click();
      }

      // Overview shot from the plaza.
      await page.evaluate(() => window.Park3D.setCustomCamera({ x: -38, y: 24, z: 68 }, { x: -45, y: 0, z: 45 }));
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(evidenceDir, `${vp.name}-overview.png`) });
      await page.close();
    }
    // Play menu link: index.html#zoo starts Ahaan at the zoo gate, with a NEW tag.
    {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      page.on('pageerror', error => errors.push(`zoo-link: ${error.message}`));
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Park3D && document.querySelector('#top canvas'));
      const link = page.locator('#ng-play a[href="index.html#zoo"]');
      assert.equal(await link.count(), 1, 'zoo link under Play');
      assert.equal(await link.locator('[data-fresh-new]').getAttribute('hidden'), null, 'zoo link shows NEW');
      await page.evaluate(() => { location.hash = 'zoo'; });
      await page.waitForFunction(() => Math.hypot(window.Park3D.getA().rig.position.x + 36.5, window.Park3D.getA().rig.position.z - 36.5) < 0.5);
      await page.close();
    }
    assert.deepEqual(errors, [], `Page errors: ${errors.join(' | ')}`);
    console.log(`zoo-browser: PASS (desktop + mobile, 4 pens, zero page errors). Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
