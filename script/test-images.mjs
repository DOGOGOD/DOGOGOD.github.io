// Build a temporary article to exercise the real Markdown and cover pipelines.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../', import.meta.url));
const slug = `image-insertion-check-${Date.now()}`;
const fixture = resolve(root, 'src/content/blog', slug);
const output = resolve(root, '.astro/image-test-dist');
let browser;
let server;
try {
  await mkdir(resolve(fixture, 'images'), { recursive: true });
  for (const [name, background] of [['cover.jpg', '#3185a1'], ['images/旅行 照片.png', '#b47048']]) {
    await sharp({ create: { width: 960, height: 320, channels: 3, background } })
      .toFile(resolve(fixture, name));
  }
  // An optional real cover makes visual regressions easier to inspect.
  if (process.env.IMAGE_TEST_COVER) {
    await sharp(process.env.IMAGE_TEST_COVER).jpeg().toFile(resolve(fixture, 'cover.jpg'));
  }
  await writeFile(resolve(fixture, 'zh-cn.md'), `---
title: Image insertion check
pubDate: 2026-09-11
slugId: ${slug}
image: "./cover.jpg"
pinTop: 99999
---

![body-local](<./images/旅行 照片.png> "图片说明")

![body-reference][photo]

[photo]: ./images/旅行%20照片.png
`);
  const buildOptions = {
    root,
    outDir: output,
    cacheDir: resolve(root, '.astro/image-test-cache'),
    vite: { cacheDir: resolve(root, '.astro/image-test-vite') },
  };
  execFileSync(process.execPath, ['--input-type=module', '--eval',
    `import { build } from 'astro'; await build(${JSON.stringify(buildOptions)});`], {
    cwd: root, stdio: 'inherit', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
  server = createServer(async (req, res) => {
    try {
      let path = resolve(output, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
      assert.ok(path === output || path.startsWith(output + sep));
      if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
      const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
      res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
      res.end(await readFile(path));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage();
  await page.route('**/*', (route) => route.request().url().startsWith(base) ? route.continue() : route.abort());
  for (const locale of ['', '/en']) {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}${locale}/`);
      const card = page.locator(`.article-entry[href="${locale}/blog/${slug}/"]`);
      const cover = card.locator('.article-preview-cover img');
      await cover.scrollIntoViewIfNeeded();
      await cover.evaluate((img) => img.decode());
      assert.ok(await cover.evaluate((img) => img.naturalWidth > 0));
      await page.waitForFunction(() => {
        const img = document.querySelector('.article-preview-cover img');
        return img && getComputedStyle(img).opacity === '1';
      }, undefined, { timeout: 3000 });
      assert.ok(await cover.evaluate((img) => img.getBoundingClientRect().height >= 150));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
      if (!locale) await card.screenshot({ path: resolve(root, `.astro/image-card-${width}.png`) });
      await card.click();
      await page.waitForURL(`${base}${locale}/blog/${slug}/`);
      assert.equal(await page.locator('.article-cover').count(), 0, 'no automatic cover in article');
      assert.equal(await page.locator('article img').count(), 2, 'only explicit Markdown images');
      for (const alt of ['body-local', 'body-reference']) {
        const img = page.locator(`article img[alt="${alt}"]`);
        await img.scrollIntoViewIfNeeded();
        await img.evaluate((element) => element.decode());
        assert.ok((await img.getAttribute('src')).startsWith('/_astro/'), 'local asset emitted');
        assert.ok(await img.evaluate((element) => element.naturalWidth > 0));
      }
      assert.equal(await page.locator('figcaption').textContent(), '图片说明');
      // Return through the client router with the cover already in cache.
      await page.goBack();
      await page.waitForURL(`${base}${locale}/`);
      await cover.scrollIntoViewIfNeeded();
      await cover.evaluate((img) => img.decode());
      assert.equal(await cover.evaluate((img) => getComputedStyle(img).opacity), '1');
      await page.waitForFunction(() =>
        document.querySelector('.article-preview-cover .image-wrapper')?.getAttribute('data-loaded') === 'true');
    }
  }
  const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.route('**/*', (route) => route.request().url().startsWith(base) ? route.continue() : route.abort());
  await noScriptPage.goto(base);
  const noScriptCover = noScriptPage.locator(`.article-entry[href="/blog/${slug}/"] img`);
  await noScriptCover.scrollIntoViewIfNeeded();
  await noScriptCover.evaluate((img) => img.decode());
  assert.equal(await noScriptCover.evaluate((img) => getComputedStyle(img).opacity), '1', 'cover visible without load handlers');
  await noScriptContext.close();
  console.log('Image checks passed: home cover, article isolation, local Markdown images, captions, Chinese/space filenames, desktop/mobile, locale fallback.');
} finally {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
  // Remove only the uniquely named article created by this test.
  assert.equal(dirname(fixture), resolve(root, 'src/content/blog'));
  assert.ok(fixture.startsWith(resolve(root, 'src/content/blog') + sep + 'image-insertion-check-'));
  await rm(fixture, { recursive: true, force: true });
}
