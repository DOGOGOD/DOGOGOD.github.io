// Run after build. Real browser checks with virtual calendar/time; no production test hooks.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist');
const output = resolve(process.env.SEASONAL_SCREENSHOTS_DIR || 'node_modules/.cache/seasonal');
await mkdir(output, { recursive: true });
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream');
    res.end(await readFile(path));
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
const seasons = [
  ['spring', '2026-04-10T12:00:00', 'petal', '春日安好'],
  ['summer', '2026-07-10T12:00:00', 'meteor', '盛夏安好'],
  ['autumn', '2026-10-10T12:00:00', 'leaf', '新秋安好'],
  ['winter', '2026-01-10T12:00:00', 'snow', '冬日安好'],
];
async function navigate(page, path) {
  await page.evaluate(path => {
    const link = document.createElement('a');
    link.href = path;
    document.body.append(link);
    link.click();
  }, path);
  await page.waitForURL(base + path);
  await page.waitForFunction(() => document.documentElement.dataset.seasonMotion === 'running');
  await page.waitForFunction(() => !window.seasonTransitions?.size);
}

try {
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  for (const [season, date, kind, greeting] of seasons) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
    // Virtual RAF/time jumps conflict with Chromium's native screenshot
    // transitions. Exercise fallback here; native transitions use real time below.
    await context.addInitScript(() => { document.startViewTransition = undefined; });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push({ season, url: page.url(), message: error.message, stack: error.stack }));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.clock.install({ time: new Date(date) });
    await page.goto(base);
    await page.waitForFunction(() => document.documentElement.dataset.seasonMotion === 'running');
    assert.equal(await page.locator('html').getAttribute('data-season'), season);
    assert.equal(await page.locator('#seasonal-greeting-title').textContent(), greeting);
    assert.equal(await page.locator('#seasonal-atmosphere, .seasonal-light').count(), 0, 'no window shadows or lamplight');
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundImage), 'none', 'original solid background');
    assert.equal(await page.locator('#seasonal-particles').evaluate(el => getComputedStyle(el).pointerEvents), 'none');
    // A virtual timeout jump starts one naturally scheduled shower, without waiting in real time.
    await page.clock.fastForward(13000);
    const count = await page.locator('.seasonal-particle').count();
    assert.ok(season === 'summer' ? count >= 2 && count <= 3
      : season === 'winter' ? count >= 12 && count <= 16 : count >= 4 && count <= 7, `${season}: bounded seasonal shower`);
    assert.equal(await page.locator(`.seasonal-${kind}`).count(), count);
    if (season === 'spring') assert.equal(await page.locator('.seasonal-petal > i > b').count(), count * 5, 'five notched petals per sakura');
    if (season === 'summer') {
      const delays = await page.locator('.seasonal-meteor').evaluateAll(nodes => nodes.map(node => node.getAnimations()[0].effect.getTiming().delay));
      assert.ok(Math.max(...delays) - Math.min(...delays) < 500, 'meteors overlap as a small group');
    }
    const trajectories = await page.locator('.seasonal-particle').evaluateAll(nodes => nodes.map(node => JSON.stringify(node.getAnimations()[0].effect.getKeyframes())));
    assert.equal(new Set(trajectories).size, count, 'each path is independently randomized');
    // Freeze the actual generated trajectories mid-flight for inspectable screenshots.
    await page.locator('.seasonal-particle').evaluateAll(nodes => nodes.forEach(node => {
      node.getAnimations({ subtree: true }).forEach(animation => {
        animation.pause();
        const timing = animation.effect.getTiming();
        animation.currentTime = node.classList.contains('seasonal-meteor')
          ? Number(timing.delay) + Number(timing.duration) * .4 : 7000;
      });
    }));
    await page.screenshot({ path: resolve(output, `${season}-light.png`) });
    // Exercise the real theme control: system (light) -> light -> dark.
    await page.locator('#themeToggle').click();
    await page.locator('#themeToggle').click();
    // Let the theme toast expire before capturing the settled night palette.
    await page.clock.fastForward(3500);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: resolve(output, `${season}-dark.png`) });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');

    // Compare the same objects, timelines and transforms, not just a replacement
    // layer's item count. Include articles, locales and history navigation.
    await page.evaluate(() => {
      window.seasonLayer = document.querySelector('#seasonal-particles');
      window.seasonSnapshots = [...window.seasonLayer.children].map(node => ({
        node, animation: node.getAnimations()[0], time: node.getAnimations()[0].currentTime,
        transform: getComputedStyle(node).transform,
      }));
    });
    for (const path of ['/archives/', '/blog/function-summary/', '/en/', '/']) {
      await navigate(page, path);
      assert.equal(await page.evaluate(() => window.seasonLayer === document.querySelector('#seasonal-particles')
        && getComputedStyle(window.seasonLayer).visibility === 'visible'
        && window.seasonSnapshots.every(({ node, animation, time, transform }) => node.isConnected
          && node.getAnimations()[0] === animation && animation.currentTime === time
          && getComputedStyle(node).transform === transform)), true, `${season}: route preserves in-flight objects and position`);
    }
    await page.goBack();
    await page.waitForURL(base + '/en/');
    await page.waitForFunction(() => !window.seasonTransitions?.size);
    await page.goForward();
    await page.waitForURL(base + '/');
    assert.equal(await page.evaluate(() => window.seasonSnapshots.every(({node}) => node.isConnected)), true, 'history preserves particles');
    // A browser screenshot transition is invalidated by changing its viewport.
    // Finish history's transition before independently exercising resize behavior.
    await page.waitForFunction(() => !window.seasonTransitions?.size);
    await page.setViewportSize({ width: 1440, height: 960 });
    assert.equal(await page.evaluate(() => window.seasonSnapshots.every(({node}) => node.isConnected)), true, 'height-only viewport changes preserve flights');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => {
      const animation = window.seasonSnapshots[0].animation;
      const timing = animation.effect.getTiming();
      animation.currentTime = timing.delay + Number(timing.duration) * .1;
      animation.play();
      window.seasonBefore = animation.currentTime;
      document.addEventListener('astro:after-swap', () => {
        window.seasonAfter = {
          connected: window.seasonSnapshots[0].node.isConnected,
          time: animation.currentTime,
          running: animation.playState === 'running',
          visible: getComputedStyle(window.seasonLayer).visibility === 'visible',
        };
      }, { once: true });
    });
    await navigate(page, '/projects/');
    assert.equal(await page.evaluate(() => window.seasonAfter.connected && window.seasonAfter.running
      && window.seasonAfter.visible && window.seasonAfter.time >= window.seasonBefore), true, 'live animation continues during swap');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.documentElement.dataset.seasonMotion === 'paused');
    assert.equal(await page.locator('.seasonal-particle').count(), 0);
    await page.clock.fastForward(120000);
    assert.equal(await page.locator('.seasonal-particle').count(), 0, 'reduced motion does not schedule showers');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => document.documentElement.dataset.seasonMotion === 'running');

    if (season === 'autumn') {
      const toggle = page.locator('[data-season-toggle]');
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
      await page.reload();
      await page.waitForFunction(() => document.documentElement.dataset.seasonMotion === 'paused');
      assert.equal(await toggle.getAttribute('aria-pressed'), 'false', 'pause survives reload');
      await toggle.click();
      // Simulate the browser visibility state and its native event.
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.clock.fastForward(120000);
      assert.equal(await page.locator('.seasonal-particle').count(), 0, 'background tab does no particle work');
      assert.equal(await page.locator('html').getAttribute('data-season-motion'), 'paused');
      await page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event('visibilitychange'));
      });
      for (const path of ['/archives/', '/projects/', '/en/', '/blog/function-summary/', '/']) {
        await navigate(page, path);
        assert.equal(await page.locator('#seasonal-atmosphere').count(), 0);
        assert.equal(await page.locator('#seasonal-particles').count(), 1);
        if (path === '/en/') assert.equal(await page.locator('#seasonal-greeting-title').textContent(), 'Autumn greetings');
        if (path.includes('/blog/')) {
          assert.equal(await page.locator('#seasonal-particles').getAttribute('data-reading'), 'true');
          await page.evaluate(() => window.scrollTo(0, 900));
          await page.screenshot({ path: resolve(output, 'article-dark.png') });
        }
      }
      await page.clock.fastForward(13000);
      assert.ok(await page.locator('.seasonal-particle').count() <= 9, 'route changes do not duplicate schedulers');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.clock.fastForward(13000);
      assert.ok(await page.locator('.seasonal-particle').count() <= 5, 'mobile cap');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no horizontal overflow');
      await page.screenshot({ path: resolve(output, 'mobile-dark.png') });
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'theme survives route changes');
      await page.locator('#themeToggle').click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: resolve(output, 'mobile-light.png') });
      // Finishing the finite flight must also remove its infinite tumbling animation.
      await page.locator('.seasonal-particle').evaluateAll(nodes => nodes.forEach(node => node.getAnimations()[0].finish()));
      await page.waitForFunction(() => !document.querySelector('.seasonal-particle'));
    }
    await context.close();
    console.log(`PASS ${season}: calendar, greeting, random bounded paths, light/dark, reduced motion.`);
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const page = await noJS.newPage();
  await page.goto(base);
  assert.equal(await page.locator('#author-name').evaluate(el => getComputedStyle(el).opacity), '1');
  assert.equal(await page.locator('[data-season-toggle]').isVisible(), false);
  const native = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await native.addInitScript(() => {
    window.seasonTransitions = new Set();
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = (...args) => {
      const transition = start(...args);
      window.seasonTransitions.add(transition);
      const done = () => window.seasonTransitions.delete(transition);
      transition.finished.then(done, done);
      return transition;
    };
  });
  const live = await native.newPage();
  live.on('pageerror', error => errors.push({ native: true, message: error.message }));
  await live.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  // Only fix the date. RAF, timers and browser transitions keep their real clocks.
  await live.clock.setFixedTime(new Date('2026-10-10T12:00:00'));
  await live.goto(base);
  await live.waitForFunction(() => document.querySelector('.seasonal-particle'), { timeout: 15000 });
  await live.evaluate(() => {
    window.originalLayer = document.querySelector('#seasonal-particles');
    window.originalParticle = window.originalLayer.firstElementChild;
    window.originalFlight = window.originalParticle.getAnimations()[0];
    window.originalTime = window.originalFlight.currentTime;
  });
  for (const path of ['/archives/', '/blog/function-summary/', '/en/', '/']) {
    await navigate(live, path);
    assert.equal(await live.evaluate(() => window.originalLayer === document.querySelector('#seasonal-particles')
      && window.originalParticle.isConnected && window.originalParticle.getAnimations()[0] === window.originalFlight
      && window.originalFlight.playState === 'running' && window.originalFlight.currentTime >= window.originalTime
      && getComputedStyle(window.originalLayer).visibility === 'visible'), true, 'native real-time navigation preserves live flight');
  }
  await live.goBack();
  await live.waitForURL(base + '/en/');
  await live.waitForFunction(() => !window.seasonTransitions.size);
  await live.goForward();
  await live.waitForURL(base + '/');
  await live.waitForFunction(() => !window.seasonTransitions.size);
  assert.equal(await live.evaluate(() => window.originalParticle.isConnected && window.originalFlight.playState === 'running'), true, 'native history preserves live flight');
  await native.close();
  assert.deepEqual(errors, []);
  console.log('PASS: persistent particles/timelines through routes and history, live swap, fallback routing, viewport height changes, persisted pause, visibility, bilingual greeting, mobile cap, animation cleanup, no-JS.');
  console.log(`Screenshots: ${output}`);
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise(done => server.close(done));
}
