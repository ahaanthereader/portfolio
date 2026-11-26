const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-books-shelf';
const baseUrl = process.env.BASE_URL;
let server;
let point = 'server-start';
const timeout = setTimeout(() => { console.error(`FAIL timeout at ${point}`); process.exit(2); }, 30000);

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  server = http.createServer((req, res) => {
    const file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end();
      const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream';
      res.writeHead(200, { 'content-type': type }).end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    point = 'desktop-initial';
    await page.goto(baseUrl || `http://127.0.0.1:${server.address().port}/reading.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('.book img').first().waitFor();
    assert.equal(await page.locator('.book').count(), 3);
    assert.equal(await page.locator('.book[href="aesop.html"]').count(), 1);
    assert.equal(await page.locator('.book[href="aesop.html"] img').evaluate(img => img.complete && img.naturalWidth > 0), true);
    await page.locator('#shelfNext').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.fresh-drops-nav[href="reading.html"]').getAttribute('data-new-date'), '2026-11-26');
    assert.equal(await page.locator('.fresh-drops-nav[href="reading.html"] [data-fresh-new]').getAttribute('hidden'), null);
    assert.equal(await page.locator('#shelfNext').isVisible(), true);
    assert.equal(await page.locator('#shelfPrev').isVisible(), false);
    const desktopCard = await page.locator('.reading-now').evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, viewport: innerWidth, text: node.innerText };
    });
    assert.ok(desktopCard.left >= 0 && desktopCard.right <= desktopCard.viewport);
    assert.match(desktopCard.text, /Exploring a brand-new country on every page/);
    await page.screenshot({ path: path.join(evidenceDir, 'desktop-shelf.png') });
    point = 'desktop-arrow-scroll';
    await page.locator('#shelfNext').click();
    await page.waitForTimeout(400);
    assert.ok(await page.locator('#shelf').evaluate(node => node.scrollLeft > 0));
    assert.equal(await page.locator('#shelfPrev').isVisible(), true);
    await page.locator('#shelfNext').click();
    await page.waitForTimeout(400);
    const aesopBounds = await page.locator('.book[href="aesop.html"]').evaluate(node => {
      const card = node.getBoundingClientRect();
      const shelf = document.querySelector('#shelf').getBoundingClientRect();
      return { cardLeft: card.left, cardRight: card.right, shelfLeft: shelf.left, shelfRight: shelf.right };
    });
    assert.ok(aesopBounds.cardLeft >= aesopBounds.shelfLeft && aesopBounds.cardRight <= aesopBounds.shelfRight);
    assert.equal(await page.locator('#shelfNext').isVisible(), false);
    await page.screenshot({ path: path.join(evidenceDir, 'desktop-aesop-card.png') });
    await page.screenshot({ path: path.join(evidenceDir, 'desktop-scrolled.png') });

    point = 'desktop-drag';
    const shelf = page.locator('#shelf');
    const beforeDrag = await shelf.evaluate(node => node.scrollLeft);
    const cardBounds = await page.locator('.book[href="aesop.html"]').boundingBox();
    await page.mouse.move(cardBounds.x + cardBounds.width / 2, cardBounds.y + cardBounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(cardBounds.x + cardBounds.width / 2 + 70, cardBounds.y + cardBounds.height / 2, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(100);
    assert.ok((await shelf.evaluate(node => node.scrollLeft)) < beforeDrag);

    point = 'keyboard-and-details';
    await page.locator('.book').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#lb').evaluate(node => node.classList.contains('open')), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lb').evaluate(node => node.classList.contains('open')), false);
    await page.locator('#shelf').focus();
    await page.keyboard.press('ArrowRight');
    assert.ok(await shelf.evaluate(node => node.scrollLeft > 0));

    point = 'reduced-motion';
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await shelf.evaluate(node => node.scrollTo({ left: 0, behavior: 'instant' }));
    await page.waitForTimeout(50);
    assert.equal(await shelf.evaluate(node => getComputedStyle(node).scrollBehavior), 'auto');
    const reducedStart = await shelf.evaluate(node => node.scrollLeft);
    await page.locator('#shelfNext').click();
    await page.waitForTimeout(50);
    assert.ok((await shelf.evaluate(node => node.scrollLeft)) > reducedStart);
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    point = 'mobile';
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.book img').first().waitFor();
    await page.locator('#shelfNext').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#shelfNext').isVisible(), true);
    const mobileArrowSize = await page.locator('#shelfNext').evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    assert.ok(mobileArrowSize.width >= 44 && mobileArrowSize.height >= 44);
    assert.equal(await page.locator('.book[href="aesop.html"] img').evaluate(img => img.complete && img.naturalWidth > 0), true);
    const mobile = await page.evaluate(() => {
      const node = document.querySelector('.reading-now');
      const rect = node.getBoundingClientRect();
      return { pageWidth: document.documentElement.scrollWidth, viewport: innerWidth, left: rect.left, right: rect.right, text: node.innerText };
    });
    assert.ok(mobile.pageWidth <= mobile.viewport, `horizontal overflow: ${mobile.pageWidth}`);
    assert.ok(mobile.left >= 0 && mobile.right <= mobile.viewport);
    assert.match(mobile.text, /Exploring a brand-new country on every page/);
    await page.screenshot({ path: path.join(evidenceDir, 'mobile-shelf.png'), fullPage: true });
    await page.locator('#shelfNext').click();
    await page.waitForTimeout(350);
    assert.ok(await page.locator('#shelf').evaluate(node => node.scrollLeft > 0));
    await page.locator('#shelfNext').click();
    await page.waitForTimeout(350);
    const mobileAesopBounds = await page.locator('.book[href="aesop.html"]').evaluate(node => {
      const card = node.getBoundingClientRect();
      const shelf = document.querySelector('#shelf').getBoundingClientRect();
      return { cardLeft: card.left, cardRight: card.right, shelfLeft: shelf.left, shelfRight: shelf.right };
    });
    assert.ok(mobileAesopBounds.cardLeft >= mobileAesopBounds.shelfLeft && mobileAesopBounds.cardRight <= mobileAesopBounds.shelfRight);
    await page.screenshot({ path: path.join(evidenceDir, 'mobile-scrolled.png') });
    assert.deepEqual(errors, []);
    console.log(`PASS desktop 1280x800 and mobile 390x844; arrows, drag, keyboard, cover, bounds, and errors. Evidence: ${evidenceDir}`);
  } finally {
    await browser.close();
    clearTimeout(timeout);
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(`FAIL at ${point}:`, error); process.exitCode = 1; });
