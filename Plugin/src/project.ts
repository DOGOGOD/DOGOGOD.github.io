import path from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { slug } from 'github-slugger';

export function inside(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function isBlog(root: string): boolean {
  try {
    const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
    return Boolean(pkg.dependencies?.astro) && existsSync(path.join(root, 'src/content/blog'));
  } catch { return false; }
}

export function findProject(vault: string, configured: string, activePath?: string): string {
  if (configured.trim()) {
    const root = path.resolve(vault, configured.trim());
    if (!inside(vault, root)) throw new Error('Blog 目录必须位于当前 Obsidian 仓库内。');
    if (!isBlog(root)) throw new Error('该目录不是 Blog 根目录，请选择包含 package.json 和 src/content/blog 的文件夹。');
    return root;
  }
  let current = activePath ? path.dirname(path.resolve(vault, activePath)) : vault;
  while (inside(vault, current)) {
    if (isBlog(current)) return current;
    if (current === vault) break;
    current = path.dirname(current);
  }
  throw new Error('请先打开 src/content/blog 中的文章，或在插件设置中填写 Blog 根目录。');
}

export function routeForFile(relativePath: string, frontmatter?: Record<string, unknown>): string | null {
  const relative = relativePath.replaceAll('\\', '/');
  if (!relative.startsWith('src/content/')) return null;
  const match = /^src\/content\/(blog|spec)\/(.+)\/(zh-cn|en)\.md$/.exec(relative);
  if (!match) return null;
  const [, collection, folder, language] = match;
  if (folder.split('/').some(part => part === '..' || part === '.')) return null;
  // Astro's glob loader uses github-slugger per segment; slugId is not a route override.
  const id = typeof frontmatter?.slug === 'string'
    ? frontmatter.slug
    : `${folder.split('/').map(part => slug(part)).join('/')}/${language}`;
  const parts = id.split('/');
  const locale = parts.pop();
  if (!parts.length || !['zh-cn', 'en'].includes(locale ?? '') || parts.some(part => !part || part === '..' || part === '.')) return null;
  const prefix = locale === 'en' ? '/en' : '';
  const articleId = parts.map(part => encodeURIComponent(part)).join('/');
  if (collection === 'blog') return `${prefix}/blog/${articleId}/`;
  return articleId === 'about' ? `${prefix}/about/` : null;
}

export function validPort(value: unknown): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('端口需要是 1024–65535 之间的整数。');
  return port;
}

export function supportsNode(version: string): boolean {
  const [major, minor] = version.replace(/^v/, '').split('.').map(Number);
  return major > 22 || (major === 22 && minor >= 12);
}
