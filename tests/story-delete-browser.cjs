const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const evidenceDir = process.env.EVIDENCE_DIR || '/tmp/ahaan-story-studio-delete';
const baseUrl = process.env.BASE_URL;
const seed = { title: 'Undo test', pages: [{ text: 'First page', sticker: '🌟' }, { text: 'Second page', sticker: '🐉' }] };
let server;
let point = 'server-start';
const timeout = setTimeout(() => { console.error(`FAIL timeout at ${point}`); process.exit(2); }, 30000);

(async () => {
  fs.mkdirSync(evidenceDir, { recursive: true });
  if (!baseUrl) {
    server = http.createServer((req, res) => {
      const file = path.resolve(root, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`);
      if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
      fs.readFile(file, (error, data) => {
        if (error) return res.writeHead(404).end();
        const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
        res.writeHead(200, { 'content-type': type }).end(data);
      });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    point = 'desktop-load';
    await page.addInitScript(value => localStorage.setItem('ahaan-storybook', JSON.stringify(value)), seed);
    await page.goto(baseUrl || `http://127.0.0.1:${server.address().port}/story.html`, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('#storyUndoToast').isVisible(), false);
    await page.locator('#nextPg').click();
    point = 'keep-dialog';
    await page.locator('#delPg').click();
    assert.equal(await page.locator('#deleteDialog').isVisible(), true);
    assert.equal(await page.locator('#deleteDialogTitle').textContent(), 'Delete this page?');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'keepPage');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 2);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#deleteDialog').isVisible(), false);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 2);
    await page.locator('#delPg').click();
    await page.locator('#keepPage').click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 2);

    point = 'delete-and-undo';
    await page.locator('#delPg').click();
    await page.locator('#confirmDelete').click();
    assert.equal(await page.locator('#deleteDialog').isVisible(), false);
    assert.equal(await page.locator('#pageLabel').textContent(), 'Page 1 of 1');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 1);
    assert.equal(await page.locator('#storyUndoToast').isVisible(), true);
    await page.screenshot({ path: path.join(evidenceDir, 'desktop-undo.png') });
    await page.locator('#undoDelete').click();
    assert.equal(await page.locator('#pageLabel').textContent(), 'Page 2 of 2');
    assert.equal(await page.locator('#pageText').inputValue(), 'Second page');
    assert.equal(await page.locator('#pageSticker').textContent(), '🐉');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 2);
    assert.equal(await page.locator('#storyUndoToast').isVisible(), false);

    point = 'undo-timeout';
    await page.locator('#delPg').click();
    await page.locator('#confirmDelete').click();
    await page.waitForTimeout(5100);
    assert.equal(await page.locator('#storyUndoToast').isVisible(), false);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 1);

    point = 'mobile-dialog-and-undo';
    await page.evaluate(value => localStorage.setItem('ahaan-storybook', JSON.stringify(value)), seed);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#nextPg').click();
    await page.locator('#delPg').click();
    const dialogBounds = await page.locator('#deleteDialog').evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width, viewportWidth: innerWidth };
    });
    assert.ok(dialogBounds.left >= 0 && dialogBounds.right <= dialogBounds.viewportWidth);
    await page.screenshot({ path: path.join(evidenceDir, 'mobile-confirm.png') });
    await page.locator('#confirmDelete').click();
    assert.equal(await page.locator('#storyUndoToast').isVisible(), true);
    const undoHeight = await page.locator('#undoDelete').evaluate(node => node.getBoundingClientRect().height);
    assert.ok(undoHeight >= 44);
    await page.screenshot({ path: path.join(evidenceDir, 'mobile-undo.png') });
    await page.locator('#undoDelete').click();
    assert.equal(await page.locator('#pageText').inputValue(), 'Second page');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('#delPg').click();
    await page.locator('#confirmDelete').click();
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#newBook').click();
    assert.equal(await page.locator('#storyUndoToast').isVisible(), false);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), 1);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ dialogBounds, undoHeight, pagesRestored: await page.evaluate(() => JSON.parse(localStorage.getItem('ahaan-storybook')).pages.length), errors, evidenceDir }, null, 2));
  } finally {
    clearTimeout(timeout);
    await browser.close();
    if (server) server.close();
  }
})().catch(error => { console.error(`FAIL at ${point}:`, error); clearTimeout(timeout); if (server) server.close(); process.exitCode = 1; });
