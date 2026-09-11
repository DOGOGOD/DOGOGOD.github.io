import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { chromium } from 'playwright';
import { runnerSource } from '../Plugin/build.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const slug = `preview-images-check-${Date.now()}`;
const fixture = resolve(root, 'src/content/blog', slug);
let child;
let browser;
try {
  await mkdir(fixture);
  await sharp({ create: { width: 960, height: 320, channels: 3, background: '#3185a1' } })
    .png().toFile(resolve(fixture, '中文 图片.png'));
  await writeFile(resolve(fixture, 'zh-cn.md'), `---
title: Preview image check
pubDate: 2026-09-11
slugId: ${slug}
image: "./中文 图片.png"
pinTop: 99999
---

![preview-body](<./中文 图片.png>)
`);
  // Run the plugin's actual bundled launcher, isolating only its test caches.
  const runner = (await runnerSource()).replaceAll('./node_modules/.cache/obsidian-blog-preview/', './.astro/plugin-image-test/');
  child = spawn(process.execPath, ['--input-type=module', '-e', runner, root, '0', 'image-test'], {
    cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    env: { ...process.env, NODE_ENV: 'development', ASTRO_TELEMETRY_DISABLED: '1' },
  });
  let logs = '';
  child.stdout.on('data', (data) => { logs += data; });
  child.stderr.on('data', (data) => { logs += data; });
  const origin = await new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error(logs || 'Preview startup timeout')), 60000);
    child.on('error', reject);
    child.on('exit', () => { clearTimeout(timer); reject(new Error(logs)); });
    child.on('message', (message) => {
      if (message.type === 'ready') { clearTimeout(timer); resolveReady(message.origin); }
      if (message.type === 'error') { clearTimeout(timer); reject(new Error(message.message)); }
    });
  });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } });
  await page.route('**/*', (route) => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  await page.setContent(`<iframe title="Plugin preview" sandbox="allow-scripts allow-same-origin allow-popups" referrerpolicy="no-referrer" src="${origin}/" style="width:850px;height:1000px"></iframe>`);
  const frame = page.frameLocator('iframe');
  async function checkImage(img) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((element) => element.decode());
    assert.ok(await img.evaluate((element) => element.naturalWidth > 0));
    assert.equal(await img.evaluate((element) => getComputedStyle(element).opacity), '1');
    const src = await img.getAttribute('src');
    assert.ok(!src.startsWith('/_image'), 'preview bypasses native image conversion');
    const response = await fetch(new URL(src, origin));
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^image\//);
  }
  const card = frame.locator(`.article-entry[href="/blog/${slug}/"]`);
  await checkImage(card.locator('img'));
  const realCard = frame.locator('.article-entry[href="/blog/guizhou-trip/"]');
  if (await realCard.count()) {
    await checkImage(realCard.locator('img'));
    await realCard.screenshot({ path: resolve(root, '.astro/plugin-image-preview.png') });
  }
  await card.click();
  await checkImage(frame.locator('article img[alt="preview-body"]'));
  assert.equal(await frame.locator('.article-cover').count(), 0);
  console.log('Plugin runner + sandboxed iframe: cover, Markdown image, Chinese/space paths, HTTP status, MIME and visible pixels passed.');
} finally {
  await browser?.close();
  if (child?.connected) {
    const exited = new Promise((done) => child.once('exit', done));
    child.send({ type: 'stop' });
    const timer = setTimeout(() => child.kill(), 8000);
    await exited;
    clearTimeout(timer);
  }
  assert.equal(dirname(fixture), resolve(root, 'src/content/blog'));
  assert.ok(slug.startsWith('preview-images-check-'));
  await rm(fixture, { recursive: true, force: true });
}
