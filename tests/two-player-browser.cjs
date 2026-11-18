const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const siteRoot = path.resolve(__dirname, '..');
let server;
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-two-player';

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
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
  const launchOptions = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE) launchOptions.executablePath = process.env.CHROMIUM_EXECUTABLE;
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Park3D && document.querySelector('#top canvas'));

    assert.equal(await page.locator('#togetherBtn').getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'), 'false');
    assert.equal(await page.evaluate(() => window.Park3D.getV().rig.visible), false);
    const soloStart = await page.evaluate(() => window.Park3D.getA().rig.position.x);
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.up('ArrowRight');
    assert.ok(await page.evaluate(start => window.Park3D.getA().rig.position.x > start, soloStart));

    await page.locator('#togetherBtn').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#togetherBtn').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'togetherBtn');
    assert.notEqual(await page.locator('#togetherBtn').evaluate(button => getComputedStyle(button).outlineStyle), 'none');
    await page.keyboard.press('Space');
    await page.waitForFunction(() => !window.Park3D.getV().rig.visible, { timeout: 8000 });

    await page.evaluate(() => window.Park3D.teleportAhaan(0, 0));
    await page.locator('#togetherBtn').click();
    await page.waitForTimeout(700);
    assert.ok(await page.evaluate(() => window.Park3D.getVihaanExitState().timer > 0), 'Vihaan must wave on entry.');
    const duoStart = await page.evaluate(() => ({
      a: window.Park3D.getA().rig.position.toArray(),
      v: window.Park3D.getV().rig.position.toArray()
    }));
    const redShirt = await page.evaluate(() => {
      let found = false;
      window.Park3D.getV().rig.traverse(node => {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        if (materials.some(material => material && material.color && material.color.getHex() === 0xc9363e)) found = true;
      });
      return found;
    });
    assert.equal(redShirt, true, 'Vihaan must wear a red shirt.');

    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(300);
    await page.keyboard.up('ArrowRight');
    const afterArrow = await page.evaluate(() => ({
      a: window.Park3D.getA().rig.position.toArray(),
      v: window.Park3D.getV().rig.position.toArray()
    }));
    assert.equal(afterArrow.a[0], duoStart.a[0], 'Arrows must not move Ahaan.');
    assert.ok(afterArrow.v[0] > duoStart.v[0], 'Arrows must move Vihaan.');

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(300);
    await page.keyboard.up('KeyW');
    const afterW = await page.evaluate(() => ({
      a: window.Park3D.getA().rig.position.toArray(),
      v: window.Park3D.getV().rig.position.toArray()
    }));
    assert.ok(afterW.a[2] < afterArrow.a[2], 'W must move Ahaan north.');
    assert.equal(afterW.v[2], afterArrow.v[2], 'W must not move Vihaan.');

    await page.evaluate(() => window.Park3D.teleportAhaan(-4.3, 0.2));
    await page.keyboard.press('KeyE');
    assert.equal(await page.evaluate(() => window.Park3D.getCurrentActivity()), 'trampoline');
    await page.evaluate(() => window.Park3D.teleportVihaan(-4.3, 0.2));
    await page.keyboard.press('Enter');
    assert.ok(await page.evaluate(() => window.Park3D.getVihaanBounceTime() > 0), 'Enter must start Vihaan’s trampoline bounce.');
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(250);
    await page.keyboard.up('ArrowRight');
    assert.equal(await page.evaluate(() => window.Park3D.getCurrentActivity()), 'trampoline', 'Vihaan movement must not stop Ahaan’s activity.');
    await page.evaluate(() => window.Park3D.stopPlayActivity());

    await page.evaluate(() => window.Park3D.teleportVihaan(4.2, -12.5));
    await page.keyboard.press('Enter');
    await page.locator('#iceCreamPicker').waitFor({ state: 'visible' });
    await page.locator('[data-flavor="Mango"]').click();
    assert.match(await page.locator('#iceCreamStatus').textContent(), /Vihaan eats Mango/);
    assert.equal(await page.evaluate(() => window.Park3D.getV().rig.children.some(child => child.visible && child.position.x === 0.82 && child.position.z === 1)), true);

    await page.evaluate(() => window.Park3D.teleportAhaan(4.2, -12.5));
    await page.keyboard.press('KeyE');
    await page.locator('#iceCreamPicker').waitFor({ state: 'visible' });
    await page.locator('[data-flavor="Chocolate"]').click();
    assert.match(await page.locator('#iceCreamStatus').textContent(), /Ahaan eats Chocolate/);
    assert.equal(await page.evaluate(() => window.Park3D.getA().rig.children.some(child => child.visible && child.position.x === 0.82 && child.position.z === 1)), true);
    assert.equal(await page.evaluate(() => window.Park3D.getV().rig.children.some(child => child.visible && child.position.x === 0.82 && child.position.z === 1)), true);

    await page.evaluate(() => window.Park3D.teleportVihaan(-4.3, 0.2));
    await page.keyboard.press('Enter');
    assert.ok(await page.evaluate(() => window.Park3D.getVihaanBounceTime() > 0), 'Enter must start Vihaan’s trampoline bounce.');

    await page.evaluate(() => window.Park3D.teleportVihaan(11.5, -4.9));
    await page.waitForTimeout(100);
    const bridgeHeight = await page.evaluate(() => ({
      actual: window.Park3D.getV().rig.position.y,
      expected: window.Park3D.getGroundHeight(11.5, -4.9)
    }));
    assert.ok(Math.abs(bridgeHeight.actual - bridgeHeight.expected) < 0.02, 'Vihaan must follow the Mississippi bridge deck.');

    await page.evaluate(() => {
      window.Park3D.teleportAhaan(0, 0);
      const limit = window.Park3D.getSeparationLimit();
      window.Park3D.teleportVihaan(limit - 0.1, 0);
    });
    const boundResult = await page.evaluate(() => {
      const before = window.Park3D.getV().rig.position.x;
      const accepted = window.Park3D.attemptVihaanMove(0.25, 0);
      return { accepted, before, after: window.Park3D.getV().rig.position.x };
    });
    assert.equal(boundResult.accepted, false, 'Vihaan must stop before the camera loses Ahaan.');
    assert.equal(boundResult.after, boundResult.before);
    await page.waitForTimeout(1400);
    const desktopFrame = await page.evaluate(() => window.Park3D.projectPlayers());
    assert.ok(Math.abs(desktopFrame.ahaan.x) < 0.95 && Math.abs(desktopFrame.vihaan.x) < 0.95);
    assert.equal(await page.locator('#playerLabelAhaan').isVisible(), true);
    assert.equal(await page.locator('#playerLabelVihaan').isVisible(), true);
    await page.screenshot({ path: path.join(evidenceDir, 'desktop.png') });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1400);
    const mobileFrame = await page.evaluate(() => window.Park3D.projectPlayers());
    assert.ok(Math.abs(mobileFrame.ahaan.x) < 0.95 && Math.abs(mobileFrame.vihaan.x) < 0.95);
    const mobileLabels = await page.evaluate(() => ['playerLabelAhaan', 'playerLabelVihaan'].map(id => {
      const label = document.getElementById(id).getBoundingClientRect();
      const hero = document.getElementById('top').getBoundingClientRect();
      return label.left >= hero.left && label.right <= hero.right && label.top >= hero.top && label.bottom <= hero.bottom;
    }));
    assert.deepEqual(mobileLabels, [true, true], 'Both name labels must stay inside the mobile scene.');
    await page.screenshot({ path: path.join(evidenceDir, 'mobile.png'), fullPage: true });

    await page.locator('#togetherBtn').click();
    await page.waitForFunction(() => !window.Park3D.getV().rig.visible, { timeout: 8000 });
    assert.equal(await page.locator('#togetherBtn').getAttribute('aria-pressed'), 'false');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#togetherBtn').click();
    assert.equal(await page.evaluate(() => window.Park3D.getV().rig.visible), true, 'Reduced motion must keep the toggle usable.');
    assert.equal(await page.evaluate(() => window.Park3D.getVihaanExitState().timer), 0, 'Reduced motion must skip the entrance wave.');
    await page.locator('#togetherBtn').click();
    assert.equal(await page.evaluate(() => window.Park3D.getV().rig.visible), false);
    assert.deepEqual(errors, [], 'The page must not report browser errors.');
    console.log(JSON.stringify({ desktopFrame, mobileFrame, bridgeHeight, evidenceDir, errors }, null, 2));
  } finally {
    await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
