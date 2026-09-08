// Run after build. Set PLAYWRIGHT_MODULE to a Playwright module URL if the
// browser test dependency is supplied by an external development environment.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.m4a': 'audio/mp4', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.wasm': 'application/wasm' };
const server = createServer(async (req, res) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep) && path !== root.slice(0, -1)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const body = await readFile(path);
    res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=600');
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Math.min(range[2] ? Number(range[2]) : body.length - 1, body.length - 1);
      res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 });
      res.end(body.subarray(start, end + 1));
    } else {
      res.setHeader('Content-Length', body.length);
      res.end(body);
    }
  } catch { res.writeHead(404).end(); }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.testAudios = [];
    const NativeAudio = window.Audio;
    window.Audio = class extends NativeAudio {
      constructor(...args) { super(...args); window.testAudios.push(this); }
    };
  });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.route('**/*', (route) => route.request().url().startsWith(base) ? route.continue() : route.abort());
  await page.goto(base);
  await page.waitForFunction(() => document.querySelector('[data-player-ready="true"]'));
  await page.waitForTimeout(700);
  assert.equal(requests.filter((url) => url.includes('/audio/')).length, 0, 'no audio before a gesture');
  assert.equal(requests.filter((url) => /\/(archives|about|projects|blog)\//.test(url)).length, 0, 'no bulk route prefetch');
  const css = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => r.name.includes('.css')).map((r) => ({ url: r.name.split('/').at(-1), bytes: r.decodedBodySize })));
  console.log('Home CSS:', css);
  assert.ok(css.reduce((total, item) => total + item.bytes, 0) < 260000, 'font shards stay out of blocking home CSS');
  await page.locator('#nav-bar a[href="/projects/"]').hover();
  await page.waitForFunction(() => document.querySelector('link[data-intent-prefetch][href*="projects."]'));
  assert.equal(requests.filter((url) => url.includes('/projects/')).length, 1, 'only one intended route request');
  assert.equal(requests.filter((url) => /\/(archives|about|blog)\//.test(url)).length, 0, 'hover does not crawl other pages');
  assert.equal(requests.filter((url) => url.includes('/audio/')).length, 0, 'intent prefetch never starts audio');
  const focusedRoute = page.waitForRequest(base + '/archives/');
  await page.locator('#nav-bar a[href="/archives/"]').focus();
  await focusedRoute;
  await page.locator('[data-music-primary]').click();
  await page.waitForFunction(() => window.testAudios[0].currentTime > 0.15);
  const start = await page.evaluate(() => window.testAudios[0].currentTime);
  for (const path of ['/archives/', '/about/', '/en/', '/blog/function-summary/', '/']) {
    await page.evaluate((path) => {
      const link = document.createElement('a'); link.href = path; document.body.append(link); link.click();
    }, path);
    await page.waitForURL(base + path);
    await page.waitForFunction(() => document.documentElement.classList.contains('route-fast-swap'));
    assert.equal(await page.evaluate(() => window.testAudios.length), 1, 'one player through navigation');
    assert.equal(await page.evaluate(() => window.testAudios[0].paused), false, 'music stays playing');
  }
  assert.ok(await page.evaluate(() => window.testAudios[0].currentTime) > start);
  await page.goBack();
  await page.waitForURL(base + '/blog/function-summary/');
  await page.goForward();
  await page.waitForURL(base + '/');
  assert.equal(await page.evaluate(() => window.testAudios.length === 1 && !window.testAudios[0].paused), true);
  await page.evaluate(() => {
    for (let i = 0; i < 8; i++) document.querySelector('[data-music-next]').click();
  });
  await page.waitForFunction(() => window.testAudios[0].currentTime > 0.1);
  assert.equal(await page.locator('.has-playback-error').count(), 0, 'rapid skips do not report obsolete errors');
  await page.locator('[data-music-primary]').click();
  assert.equal(await page.evaluate(() => window.testAudios[0].paused), true);
  await page.evaluate(() => { window.testAudios[0].currentTime = 12; });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('[data-player-ready="true"]'));
  assert.equal(await page.evaluate(() => window.testAudios[0].paused), true, 'reload waits for gesture');
  await page.locator('[data-music-primary]').click();
  await page.waitForFunction(() => window.testAudios[0].currentTime >= 12);

  // A superseded promise must not mark the newer, successful track as failed.
  await page.evaluate(() => {
    const audio = window.testAudios[0]; const play = audio.play.bind(audio); let once = true;
    audio.play = () => {
      if (!once) return play();
      once = false;
      return new Promise((_, reject) => setTimeout(() => reject(new DOMException('old request', 'NotSupportedError')), 200));
    };
    document.querySelector('[data-music-next]').click();
    document.querySelector('[data-music-next]').click();
  });
  await page.waitForTimeout(350);
  assert.equal(await page.locator('.has-playback-error').count(), 0);

  // Simulate a media request failure, then retry the same track successfully.
  await page.locator('[data-music-primary]').click();
  await page.route('**/audio/**', (route) => route.abort('failed'));
  await page.evaluate(() => {
    window.testAudios[0].src = '/audio/For%20River.m4a?failure-test';
    window.testAudios[0].load();
  });
  await page.locator('[data-music-primary]').click();
  await page.waitForFunction(() => document.querySelector('.has-playback-error'));
  await page.unroute('**/audio/**');
  await page.locator('[data-music-primary]').click();
  await page.waitForFunction(() => window.testAudios[0].currentTime > 0.1 && !window.testAudios[0].paused);
  assert.equal(await page.locator('.has-playback-error').count(), 0);
  assert.deepEqual(errors, []);

  // First-screen text must remain visible with JavaScript disabled.
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const article = await noJS.newPage();
  await article.goto(base + '/blog/function-summary/');
  assert.equal(await article.locator('.markdown-content').evaluate((el) => getComputedStyle(el.firstElementChild).opacity), '1');
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const touchPage = await mobile.newPage();
  await touchPage.goto(base);
  await touchPage.waitForFunction(() => document.querySelector('[data-player-ready="true"]'));
  await touchPage.locator('[data-music-primary]').tap();
  await touchPage.waitForFunction(() => document.querySelector('[data-music-primary]').getAttribute('aria-pressed') === 'true');
  await touchPage.locator('[data-music-next]').tap();
  await touchPage.waitForFunction(() => document.querySelector('[data-music-title]').textContent === 'For River');
  await touchPage.locator('[data-music-primary]').tap();
  await touchPage.waitForFunction(() => document.querySelector('[data-music-primary]').getAttribute('aria-pressed') === 'false');
  const limited = await browser.newContext();
  await limited.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' } }));
  const limitedPage = await limited.newPage();
  const limitedRequests = [];
  limitedPage.on('request', request => limitedRequests.push(request.url()));
  await limitedPage.goto(base);
  await limitedPage.locator('#nav-bar a[href="/projects/"]').hover();
  await limitedPage.waitForTimeout(350);
  assert.equal(limitedRequests.filter(url => url.includes('/projects/')).length, 0, 'data saver disables speculative requests');
  await limitedPage.locator('#nav-bar a[href="/projects/"]').click();
  await limitedPage.waitForURL(base + '/projects/');
  console.log('PASS: font CSS budget, hover/focus style prefetch, data saver navigation, lazy audio, persistent playback, back/forward, rapid skips, refresh/seek, stale rejection, failure retry, no-JS text, touch play/skip/pause.');
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
}
