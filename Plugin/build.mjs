import { build, transform } from 'esbuild';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = path.dirname(fileURLToPath(import.meta.url));
export async function runnerSource() {
  const bridge = await readFile(path.join(root, 'src/bridge.js'), 'utf8');
  const source = await readFile(path.join(root, 'src/runner.mjs'), 'utf8');
  const result = await transform(source, {
    loader: 'js', target: 'node22', format: 'esm',
    define: { __PREVIEW_BRIDGE__: JSON.stringify(bridge.replace(/^\/\/.*\n/gm, '').trim()) },
  });
  return result.code;
}

export async function bundle(entry, outfile, options = {}) {
  await build({
    absWorkingDir: root, entryPoints: [entry], outfile, bundle: true,
    platform: 'node', format: 'cjs', target: 'es2022', external: ['obsidian'],
    define: { __PREVIEW_RUNNER__: JSON.stringify(await runnerSource()) },
    ...options,
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await bundle('src/main.ts', 'main.js');
  const release = path.join(root, 'release/guztchian-blog-preview');
  await mkdir(release, { recursive: true });
  for (const name of ['main.js', 'manifest.json', 'styles.css']) await copyFile(path.join(root, name), path.join(release, name));
  console.log('插件已构建：release/guztchian-blog-preview（安装只需这 3 个文件）');
}
