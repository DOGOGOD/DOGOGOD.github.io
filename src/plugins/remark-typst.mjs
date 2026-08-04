// remark-typst.mjs
import { visit } from 'unist-util-visit';
import { NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import { fileURLToPath } from 'node:url';

const projectCompiler = NodeCompiler.create({ workspace: process.cwd() });
const cetzWorkspace = fileURLToPath(
  new URL('../vendor/typst-packages/preview/cetz/0.4.2', import.meta.url),
);
const cetzCompiler = NodeCompiler.create({ workspace: cetzWorkspace });
const cetzPackageImport = '"@preview/cetz:0.4.2"';
const localCetzImport = '"/src/lib.typ"';

function prepareTypstSource(source) {
  if (!source.includes(cetzPackageImport)) {
    return { compiler: projectCompiler, source };
  }

  return {
    compiler: cetzCompiler,
    source: source.replaceAll(cetzPackageImport, localCetzImport),
  };
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
        const prepared = prepareTypstSource(node.value);
        // Compile against a vendored workspace so package-based examples are
        // deterministic and never depend on the network or a user cache.
        const svg = await prepared.compiler.svg({
          mainFileContent: prepared.source,
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
