// remark-typst.mjs
import { visit } from 'unist-util-visit';
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectWorkspace = fileURLToPath(new URL('../../', import.meta.url));
const cetzWorkspace = fileURLToPath(
  new URL('../vendor/typst-packages/preview/cetz/0.4.2', import.meta.url),
);
const cetzVirtualRoot = '/__typst_packages/cetz/0.4.2';
const projectCompiler = NodeCompiler.create({ workspace: projectWorkspace });
const cetzImportPattern = (
  /^([\t ]*#\s*import\s+)"@preview\/cetz:0\.4\.2"(?=[\t ]*(?::|as\b|$))/gm
);
const cetzRootImportPattern = /^([\t ]*#?[\t ]*import\s+)"\/src\//gm;
const localCetzImport = `"${cetzVirtualRoot}/src/lib.typ"`;

function mapCetzPackage(directory, relativeDirectory = '') {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = relativeDirectory
      ? `${relativeDirectory}/${entry.name}`
      : entry.name;
    const sourcePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      mapCetzPackage(sourcePath, relativePath);
      continue;
    }
    if (!entry.name.endsWith('.typ') && !entry.name.endsWith('.wasm')) continue;

    const shadowPath = join(
      projectWorkspace,
      cetzVirtualRoot.slice(1),
      ...relativePath.split('/'),
    );
    const content = entry.name.endsWith('.typ')
      ? Buffer.from(
          readFileSync(sourcePath, 'utf8').replace(
            cetzRootImportPattern,
            `$1"${cetzVirtualRoot}/src/`,
          ),
        )
      : readFileSync(sourcePath);
    projectCompiler.mapShadow(shadowPath, content);
  }
}

mapCetzPackage(cetzWorkspace);

function prepareTypstSource(source) {
  return source.replace(cetzImportPattern, `$1${localCetzImport}`);
}

export function remarkTypst() {
  return async (tree) => {
    const instances = [];

    // 1. 收集所有 typst 代码块
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'typst') {
        instances.push({ node, index, parent });
      }
    });

    // 2. 异步并行渲染
    for (const { node, index, parent } of instances) {
      try {
        const title = node.meta ? node.meta.trim() : '';
        const formattedTitle = title.replace(/\*(.*?)\*/g, '<em>$1</em>');
        const source = prepareTypstSource(node.value);
        // Resolve the supported package import to the vendored source while
        // keeping the project workspace available to every Typst document.
        const svg = await projectCompiler.svg({
          mainFileContent: source,
        });

        // 将代码块替换为 raw 类型的 HTML 节点
        parent.children[index] = {
          type: 'html',
          value: `<div class="typst-render">
          ${svg}
          <div class="typst-title">${formattedTitle}</div>
          </div>`,
        };
      } catch (e) {
        console.error('Typst compilation failed:', e);
      }
    }
  };
}
