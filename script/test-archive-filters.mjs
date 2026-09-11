// Run against an Astro development or preview server.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const base = process.env.ARCHIVE_TEST_URL || 'http://127.0.0.1:4359';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => route.request().url().startsWith(base) ? route.continue() : route.abort());
  for (const locale of ['', '/en']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}${locale}/archives/`);
    await page.locator('astro-island[component-export="default"]:not([ssr]) .mobile-filters').waitFor();
    const buttons = page.locator('.mobile-filters .category-chip');
    const category = buttons.first();
    const categoryName = (await category.textContent()).trim();
    const expectedCount = await page.locator('.mobile-post-category').evaluateAll((nodes, name) => nodes.filter((node) => node.textContent.trim() === '#' + name).length, categoryName);
    const total = await page.locator('#archive-content a').count();
    assert.ok(total > 0);
    await category.click();
    await page.waitForFunction((count) => document.querySelectorAll('#archive-content a').length === count, expectedCount);
    assert.equal(await category.getAttribute('aria-pressed'), 'true');
    assert.equal(new URL(page.url()).searchParams.get('category'), categoryName);
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.mobile-filters .category-chip')?.getAttribute('aria-pressed') === 'true');
    assert.equal(await page.locator('#archive-content a').count(), expectedCount);
    if (await buttons.count() > 1) {
      await buttons.nth(1).click();
      assert.equal(await page.locator('.mobile-filters .category-chip[aria-pressed="true"]').count(), 2, 'multi-select');
    }
    while (await page.locator('.mobile-filters .category-chip[aria-pressed="true"]').count()) await page.locator('.mobile-filters .category-chip[aria-pressed="true"]').first().click();
    await page.waitForFunction((count) => document.querySelectorAll('#archive-content a').length === count, total);
    assert.equal(new URL(page.url()).searchParams.has('category'), false);
    for (const theme of ['dark', 'light']) {
      await page.evaluate((theme) => document.documentElement.setAttribute('data-theme', theme), theme);
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        assert.ok(await page.locator('.mobile-filters').isVisible());
        assert.ok(!(await page.locator('#category-sidebar').isVisible()));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px: no overflow`);
        assert.equal(await page.getByText('可多选', { exact: true }).count(), 0);
        const styles = await page.locator('.category-chip').evaluateAll((nodes) => nodes.map((node) => {
          const s = getComputedStyle(node);
          return [s.fontSize, s.padding, s.borderRadius].join('|');
        }));
        assert.equal(styles[0], styles[styles.length / 2], 'mobile and desktop share button styles');
        if (!locale && width === 390) {
          await page.screenshot({ path: fileURLToPath(new URL(`../.astro/archive-mobile-${theme}.png`, import.meta.url)), fullPage: true, animations: 'disabled' });
        }
      }
    }
    await page.goto(`${base}${locale}/archives/?category=missing-category`);
    await page.locator('.archive-empty').waitFor();
    await page.locator('.archive-empty button').click();
    await page.waitForFunction(() => !document.querySelector('.archive-empty'));
    await page.setViewportSize({ width: 1440, height: 1000 });
    assert.ok(!(await page.locator('.mobile-filters').isVisible()));
    assert.ok(await page.locator('#category-sidebar').isVisible());
  }
  assert.deepEqual(errors, []);
  console.log('Archive filters passed: multi-select, reset, URL persistence, empty state, 320/390/768/1440px, both themes and languages.');
} finally { await browser.close(); }

