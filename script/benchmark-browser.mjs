// Run against the production build, before and after a performance change.
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const root = resolve('dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    let path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (path !== root && !path.startsWith(root + sep)) throw Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    let body = await readFile(path);
    res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=600');
    if (/\.(html|css|js)$/.test(path) && req.headers['accept-encoding']?.includes('gzip')) {
      body = gzipSync(body);
      res.setHeader('Content-Encoding', 'gzip');
    }
    res.setHeader('Content-Length', body.length);
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const runs = [];
try {
  for (let i = 0; i < 3; i++) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await session.send('Network.enable');
    await session.send('Network.setBlockedURLs', { urls: ['https://*'] });
    await session.send('Network.emulateNetworkConditions', { offline: false, latency: 100, downloadThroughput: 200000, uploadThroughput: 100000 });
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.bench = { lcp: 0, cls: 0, route: 0 };
      new PerformanceObserver(list => { window.bench.lcp = list.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.bench.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
      document.addEventListener('astro:page-load', () => { window.bench.route = performance.now(); });
    });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const initial = await page.evaluate(() => ({
      ...window.bench,
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      cssBytes: performance.getEntriesByType('resource').filter(r => r.name.endsWith('.css')).reduce((sum, r) => sum + r.decodedBodySize, 0),
      fontBytes: performance.getEntriesByType('resource').filter(r => r.name.endsWith('.woff2')).reduce((sum, r) => sum + r.decodedBodySize, 0),
    }));
    await page.locator('#nav-bar a[href="/projects/"]').hover();
    await page.waitForTimeout(1500);
    const start = await page.evaluate(() => {
      const start = performance.now();
      document.querySelector('#nav-bar a[href="/projects/"]').click();
      return start;
    });
    await page.waitForFunction(start => window.bench.route > start, start);
    initial.warmNavigation = await page.evaluate(start => window.bench.route - start, start);
    runs.push(initial);
    await context.close();
  }
  const median = Object.fromEntries(['fcp', 'lcp', 'cls', 'cssBytes', 'fontBytes', 'warmNavigation'].map(key => [key, runs.map(run => run[key]).sort((a, b) => a - b)[1]]));
  const result = { conditions: 'Local gzip server; 100 ms latency, 1.6 Mbps download, 4x CPU slowdown; 3 fresh contexts; 1.5 s hover before navigation', median, runs };
  await mkdir('node_modules/.cache/performance', { recursive: true });
  await writeFile(`node_modules/.cache/performance/${process.argv[2] || 'latest'}.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
  server.closeAllConnections();
  await new Promise(done => server.close(done));
}
