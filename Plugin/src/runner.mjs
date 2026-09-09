import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// `-e` (used by the bundled plugin) omits a script path from argv; the small
// distinction also keeps this runner directly testable as a normal .mjs file.
const runnerArgs = process.argv[1]?.endsWith('.mjs') ? process.argv.slice(2) : process.argv.slice(1);
const [root, portString, token] = runnerArgs;
const bridge = __PREVIEW_BRIDGE__;
let server;
let stopping = false;
async function stop() {
  stopping = true;
  if (server) {
    await server.stop();
    process.exit(0);
  }
}
process.on('message', message => { if (message?.type === 'stop') void stop(); });
process.on('disconnect', () => void stop());
process.on('SIGTERM', () => void stop());
process.on('SIGINT', () => void stop());

try {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) throw new Error('需要 Node.js 22.12 或更高版本，建议使用本机 Node.js 24。');
  const require = createRequire(path.join(root, 'package.json'));
  const { dev } = await import(pathToFileURL(require.resolve('astro')).href);
  server = await dev({
    root,
    logLevel: 'info',
    server: { host: '127.0.0.1', port: Number(portString), open: false },
    devToolbar: { enabled: false },
    // Keep the plugin's content/dependency cache separate from normal CLI previews.
    cacheDir: './node_modules/.cache/obsidian-blog-preview/astro/',
    vite: { cacheDir: './node_modules/.cache/obsidian-blog-preview/vite/', server: { strictPort: true } },
    integrations: [{
      name: 'guztchian-obsidian-preview',
      hooks: {
        'astro:config:setup': ({ injectScript }) => {
          injectScript('head-inline', `(${bridge})(${JSON.stringify(token)});`);
        },
      },
    }],
  });
  if (stopping || !process.connected) await stop();
  else process.send?.({ type: 'ready', origin: `http://127.0.0.1:${server.address.port}` });
} catch (error) {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.send?.({ type: 'error', message });
  console.error(message);
  if (server) await server.stop();
  process.exit(1);
}
