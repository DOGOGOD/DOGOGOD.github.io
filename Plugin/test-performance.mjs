import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { bundle } from './build.mjs';

const directory = await mkdtemp(join(tmpdir(), 'blog-plugin-test-'));
const outfile = join(directory, 'plugin.cjs');
const originalSetTimeout = globalThis.setTimeout;
const originalClearTimeout = globalThis.clearTimeout;
try {
  await bundle('src/main.ts', outfile, {
    external: [],
    plugins: [{ name: 'obsidian-test-host', setup(build) {
      build.onResolve({ filter: /^obsidian$/ }, () => ({ path: 'obsidian', namespace: 'test-host' }));
      build.onLoad({ filter: /.*/, namespace: 'test-host' }, () => ({ contents: `
        export class Plugin {} export class ItemView {} export class PluginSettingTab {}
        export class App {} export class FileSystemAdapter {} export class MarkdownView {}
        export class Notice {} export class Setting {} export class TFile {}
        export class WorkspaceLeaf {} export function setTooltip() {}
      ` }));
    } }],
  });
  const { default: BlogPreviewPlugin } = createRequire(import.meta.url)(outfile);
  const plugin = new BlogPreviewPlugin();
  const timers = new Map();
  let id = 0;
  globalThis.setTimeout = (callback, delay) => { timers.set(++id, { callback, delay }); return id; };
  globalThis.clearTimeout = timer => timers.delete(timer);
  let stops = 0;
  let active = false;
  let views = [{ isClosed: () => false, hasFrame: () => active }];
  plugin.views = () => views;
  plugin.server.stop = () => { stops++; };
  plugin.maybeStopServer();
  assert.equal(stops, 0, 'ordinary notes retain warm server');
  assert.equal([...timers.values()][0].delay, 30000);
  plugin.cancelIdleStop();
  assert.equal(timers.size, 0, 'returning to blog cancels shutdown');
  active = true;
  plugin.maybeStopServer();
  assert.equal(timers.size, 0, 'active preview remains running');
  active = false;
  plugin.maybeStopServer();
  const expiry = [...timers.values()][0];
  timers.clear();
  expiry.callback();
  assert.equal(stops, 1, 'idle server eventually shuts down');
  views = [{ isClosed: () => true, hasFrame: () => false }];
  plugin.maybeStopServer();
  assert.equal(stops, 2, 'closing last preview stops immediately');
  plugin.server.log('a'.repeat(20000));
  assert.equal(plugin.server.logs.join('').length, 18000);
  for (let i = 0; i < 1000; i++) plugin.server.log('next message\n');
  assert.ok(plugin.server.logs.join('').length <= 18000);
  console.log('Plugin: warm reuse, idle shutdown, close cleanup and bounded logs passed.');
} finally {
  globalThis.setTimeout = originalSetTimeout;
  globalThis.clearTimeout = originalClearTimeout;
  await rm(directory, { recursive: true, force: true });
}
