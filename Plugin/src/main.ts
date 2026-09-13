import {
  App, FileSystemAdapter, ItemView, MarkdownView, Notice, Plugin,
  PluginSettingTab, Setting, TFile, WorkspaceLeaf, setTooltip,
} from 'obsidian';
import path from 'node:path';
import { findProject, inside, routeForFile, validPort } from './project';
import { PreviewServer, type RunningServer } from './server';

const VIEW = 'guztchian-blog-preview';
const CHANNEL = 'guztchian-blog-preview';
type Theme = 'light' | 'dark' | 'system';
interface PreviewSettings {
  projectPath: string;
  scopePaths: string[];
  nodePath: string;
  port: number;
  autoSave: boolean;
  saveDelay: number;
  saveTimingVersion: number;
  theme: Theme;
  viewport: 'responsive' | 'mobile' | 'desktop';
}
const DEFAULTS: PreviewSettings = {
  projectPath: '', scopePaths: ['src/content/blog', 'src/content/spec/about'], nodePath: '', port: 4323, autoSave: true, saveDelay: 300, saveTimingVersion: 1,
  theme: 'system', viewport: 'responsive',
};

export default class BlogPreviewPlugin extends Plugin {
  settings: PreviewSettings = { ...DEFAULTS };
  server = new PreviewServer(message => this.views().forEach(view => view.status(message)));
  activeArticle: TFile | null = null;
  private projectRoot: string | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;

  async onload(): Promise<void> {
    const stored = await this.loadData();
    this.settings = { ...DEFAULTS, ...stored };
    // Migrate the old default once; keep custom delays and later user choices.
    const migrateSaveTiming = stored?.saveTimingVersion !== DEFAULTS.saveTimingVersion;
    if (migrateSaveTiming && Number(stored?.saveDelay) === 800) this.settings.saveDelay = DEFAULTS.saveDelay;
    this.settings.saveTimingVersion = DEFAULTS.saveTimingVersion;
    this.settings.scopePaths = Array.isArray(stored?.scopePaths) ? stored.scopePaths.filter((item: unknown): item is string => typeof item === 'string') : [...DEFAULTS.scopePaths];
    // Recover gracefully if settings were edited by hand or came from another version.
    try { this.settings.port = validPort(this.settings.port); } catch { this.settings.port = DEFAULTS.port; }
    this.settings.saveDelay = Math.max(300, Math.min(5000, Number(this.settings.saveDelay) || DEFAULTS.saveDelay));
    if (!['light', 'dark', 'system'].includes(this.settings.theme)) this.settings.theme = 'system';
    if (!['responsive', 'mobile', 'desktop'].includes(this.settings.viewport)) this.settings.viewport = 'responsive';
    if (migrateSaveTiming) await this.saveData(this.settings);
    this.registerView(VIEW, leaf => new BlogPreviewView(leaf, this));
    this.addRibbonIcon('panels-left-right', '打开 Blog 预览', () => void this.openPreview());
    this.addCommand({ id: 'open-preview', name: '打开文章预览（右侧分栏）', callback: () => void this.openPreview() });
    this.addCommand({ id: 'refresh-preview', name: '刷新文章预览', callback: () => this.views().forEach(view => void view.refresh()) });
    this.addCommand({ id: 'stop-preview', name: '停止预览服务', callback: () => {
      this.cancelSave();
      this.cancelIdleStop();
      this.views().forEach(view => view.clearFrame());
      this.server.stop();
      this.views().forEach(view => view.status('预览已停止；点击刷新可重新启动。'));
    } });
    this.addSettingTab(new BlogPreviewSettings(this.app, this));
    this.registerEvent(this.app.workspace.on('file-open', file => {
      if (!file) return; // Clicking the preview pane should not clear the article selection.
      this.cancelSave();
      this.activeArticle = file;
      this.views().forEach(view => { if (view.follow) void view.showFile(file); });
    }));
    this.registerEvent(this.app.workspace.on('editor-change', (_editor, info) => {
      if (!(info instanceof MarkdownView) || !info.file) return;
      const file = info.file;
      const interested = this.views().filter(view => view.file?.path === file.path && view.hasFrame());
      if (!interested.length) return;
      interested.forEach(view => view.status('正在编辑…'));
      this.cancelSave();
      if (!this.settings.autoSave) return;
      this.saveTimer = setTimeout(() => {
        this.saveTimer = null;
        if (this.disposed || info.file?.path !== file.path || !this.server.running || !this.views().some(view => view.file?.path === file.path)) return;
        // Use Obsidian's public save API; never replace the editor buffer or call fs.writeFile on notes.
        void info.save().catch(error => new Notice(`文章保存失败：${String(error)}`));
      }, this.settings.saveDelay);
    }));
    this.registerEvent(this.app.vault.on('modify', file => {
      this.views().filter(view => view.file?.path === file.path && view.hasFrame()).forEach(view => {
        view.status('已保存 · 等待网页更新…');
      });
      // Astro watches the file and updates through HMR; do not reload a second time here.
    }));
    this.registerEvent(this.app.vault.on('rename', (file) => {
      if (file instanceof TFile) this.views().filter(view => view.file === file).forEach(view => void view.showFile(file));
    }));
    this.registerEvent(this.app.vault.on('delete', file => {
      this.views().filter(view => view.file === file).forEach(view => {
        view.file = null;
        view.clearFrame();
        view.status('文章已删除，请打开另一篇文章。');
      });
    }));
    this.app.workspace.onLayoutReady(() => {
      if (this.disposed) return;
      const active = this.app.workspace.getActiveFile();
      if (active) this.activeArticle = active;
      this.views().forEach(view => { if (this.activeArticle) void view.showFile(this.activeArticle); });
    });
  }

  onunload(): void {
    this.disposed = true;
    this.cancelSave();
    this.app.workspace.detachLeavesOfType(VIEW);
    this.cancelIdleStop();
    this.server.stop();
  }

  cancelSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = null;
  }

  views(): BlogPreviewView[] {
    return this.app.workspace.getLeavesOfType(VIEW).map(leaf => leaf.view).filter((view): view is BlogPreviewView => view instanceof BlogPreviewView);
  }

  cancelIdleStop(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = null;
  }

  maybeStopServer(): void {
    this.cancelIdleStop();
    const views = this.views().filter(view => !view.isClosed());
    if (views.some(view => view.hasFrame())) return;
    if (!views.length) { this.server.stop(); return; }
    // Brief trips to ordinary notes should not force another Astro cold start.
    this.idleTimer = setTimeout(() => {
      this.idleTimer = null;
      if (!this.views().some(view => view.hasFrame())) this.server.stop();
    }, 30000);
  }

  vaultPath(): string {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof FileSystemAdapter)) throw new Error('此插件需要桌面版 Obsidian 和本地文件仓库。');
    return adapter.getBasePath();
  }

  project(file?: TFile | null): string {
    if (!this.projectRoot) this.projectRoot = findProject(this.vaultPath(), this.settings.projectPath, file?.path);
    return this.projectRoot;
  }

  route(file: TFile): { root: string; route: string } {
    const root = this.project(file);
    const absolute = path.resolve(this.vaultPath(), file.path);
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    const route = inside(root, absolute) ? routeForFile(path.relative(root, absolute), frontmatter) : null;
    if (!route) throw new Error('请选择 src/content/blog/文章目录/zh-cn.md（或 en.md）。也支持 src/content/spec/about 中的关于页面；普通笔记没有对应的发布页面。');
    return { root, route };
  }

  isInScope(file: TFile): boolean {
    const relative = file.path.replaceAll('\\', '/').replace(/^\/+|\/+$/g, '');
    return this.settings.scopePaths.some(folder => {
      const normalized = folder.replaceAll('\\', '/').replace(/^\/+|\/+$/g, '');
      return Boolean(normalized) && (relative === normalized || relative.startsWith(`${normalized}/`));
    });
  }

  async openPreview(): Promise<void> {
    const active = this.app.workspace.getActiveFile() ?? this.activeArticle;
    if (active) this.activeArticle = active;
    let leaf = this.app.workspace.getLeavesOfType(VIEW)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf('split', 'vertical');
      await leaf.setViewState({ type: VIEW, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    if (active && leaf.view instanceof BlogPreviewView) await leaf.view.showFile(active);
  }

  async saveSettings(restart = false): Promise<void> {
    await this.saveData(this.settings);
    if (restart) {
      this.cancelSave();
      this.cancelIdleStop();
      this.projectRoot = null;
      this.server.stop();
      this.views().forEach(view => { view.clearFrame(); view.status('设置已保存，点击刷新以重新启动预览。'); });
    }
  }
}

class BlogPreviewView extends ItemView {
  file: TFile | null = null;
  follow = true;
  private frame: HTMLIFrameElement | null = null;
  private frameUrl = '';
  private session: RunningServer | null = null;
  private revision = 0;
  private closed = false;
  private statusEl!: HTMLElement;
  private routeEl!: HTMLElement;
  private canvas!: HTMLElement;
  private logsEl!: HTMLPreElement;

  constructor(leaf: WorkspaceLeaf, private plugin: BlogPreviewPlugin) { super(leaf); }
  getViewType(): string { return VIEW; }
  getDisplayText(): string { return 'Blog 预览'; }
  getIcon(): string { return 'panels-left-right'; }

  async onOpen(): Promise<void> {
    this.contentEl.empty();
    this.contentEl.addClass('guz-blog-preview');
    const toolbar = this.contentEl.createDiv({ cls: 'guz-blog-toolbar' });
    toolbar.createSpan({ text: 'Blog 预览', cls: 'guz-blog-title' });
    const controls = toolbar.createDiv({ cls: 'guz-blog-controls' });
    const button = (label: string, callback: () => void) => {
      const el = controls.createEl('button', { text: label, attr: { type: 'button' } });
      this.registerDomEvent(el, 'click', callback);
      return el;
    };
    button('刷新', () => void this.refresh());
    const follow = button('跟随文章', () => {
      this.follow = !this.follow;
      follow.setText(this.follow ? '跟随文章' : '已固定');
      follow.setAttribute('aria-pressed', String(this.follow));
      if (this.follow && this.plugin.activeArticle) void this.showFile(this.plugin.activeArticle);
    });
    follow.setAttribute('aria-pressed', 'true');
    setTooltip(follow, '开启后，预览跟随 Obsidian 当前文章切换');
    const viewport = controls.createEl('select', { attr: { 'aria-label': '预览宽度' } });
    for (const [value, text] of [['responsive', '适应分栏'], ['mobile', '手机 · 390'], ['desktop', '桌面 · 1280']]) viewport.createEl('option', { text, value });
    viewport.value = this.plugin.settings.viewport;
    this.registerDomEvent(viewport, 'change', () => {
      this.plugin.settings.viewport = viewport.value as PreviewSettings['viewport'];
      this.applyViewport();
      void this.plugin.saveSettings();
    });
    const theme = controls.createEl('select', { attr: { 'aria-label': '网页主题' } });
    for (const [value, text] of [['system', '跟随系统'], ['light', '浅色纸面'], ['dark', '深色纸面']]) theme.createEl('option', { text, value });
    theme.value = this.plugin.settings.theme;
    this.registerDomEvent(theme, 'change', () => {
      this.plugin.settings.theme = theme.value as Theme;
      this.sendTheme();
      void this.plugin.saveSettings();
    });
    button('浏览器打开', () => {
      if (this.frameUrl) window.open(this.frameUrl, '_blank', 'noopener');
      else new Notice('请先打开一篇可预览的文章。');
    });
    const logsButton = button('日志', () => {
      this.logsEl.hidden = !this.logsEl.hidden;
      logsButton.setAttribute('aria-expanded', String(!this.logsEl.hidden));
      this.logsEl.setText(this.plugin.server.logs.join('') || '暂无日志。');
    });
    logsButton.setAttribute('aria-expanded', 'false');
    this.routeEl = this.contentEl.createDiv({ cls: 'guz-blog-route', text: '选择一篇 Blog 文章开始预览' });
    this.statusEl = this.contentEl.createDiv({ cls: 'guz-blog-status', attr: { role: 'status', 'aria-live': 'polite' } });
    this.logsEl = this.contentEl.createEl('pre', { cls: 'guz-blog-logs' });
    this.logsEl.hidden = true;
    this.canvas = this.contentEl.createDiv({ cls: 'guz-blog-canvas' });
    this.canvas.createDiv({ cls: 'guz-blog-empty', text: '打开 Blog 的 Markdown 文章，即可在这里查看实际网页排版。' });
    this.applyViewport();
    this.registerDomEvent(this.contentEl.win, 'message', event => this.receive(event));
    if (this.plugin.activeArticle) void this.showFile(this.plugin.activeArticle);
  }

  async onClose(): Promise<void> {
    this.closed = true;
    this.clearFrame();
    this.plugin.cancelSave();
    // getLeavesOfType may still contain this leaf while onClose runs.
    this.plugin.maybeStopServer();
  }

  hasFrame(): boolean { return this.frame !== null; }
  isClosed(): boolean { return this.closed; }
  status(text: string): void {
    if (this.closed || !this.statusEl) return;
    if (this.statusEl.textContent !== text) this.statusEl.setText(text);
    if (!this.logsEl.hidden) this.logsEl.setText(this.plugin.server.logs.join(''));
  }
  clearFrame(): void {
    ++this.revision;
    this.frame?.remove();
    this.frame = null;
    this.frameUrl = '';
    this.session = null;
  }
  private applyViewport(): void {
    if (this.canvas) this.canvas.dataset.viewport = this.plugin.settings.viewport;
  }
  private sendTheme(): void {
    if (this.frame && this.session) this.frame.contentWindow?.postMessage({
      channel: CHANNEL, token: this.session.token, type: 'theme', value: this.plugin.settings.theme,
    }, this.session.origin);
  }
  private receive(event: MessageEvent): void {
    if (!this.session || !this.frame || event.source !== this.frame.contentWindow || event.origin !== this.session.origin) return;
    const data = event.data;
    if (data?.channel !== CHANNEL || data?.token !== this.session.token) return;
    if (data.type === 'ready') {
      if (typeof data.path === 'string' && data.path.startsWith('/') && !data.path.startsWith('//')) {
        this.frameUrl = new URL(data.path, this.session.origin).href;
        this.routeEl.setText(`${this.file?.path ?? ''} → ${data.path}`);
      }
      this.status('预览已更新 · 使用 Blog 原生排版');
      this.sendTheme();
    }
    if (data.type === 'external' && typeof data.url === 'string') {
      try {
        const url = new URL(data.url);
        if (['https:', 'http:', 'mailto:'].includes(url.protocol)) window.open(url.href, '_blank', 'noopener');
      } catch { /* Ignore malformed links. */ }
    }
  }

  async showFile(file: TFile, force = false): Promise<void> {
    if (this.closed) return;
    const revision = ++this.revision;
    this.file = file;
    if (!this.plugin.isInScope(file)) {
      this.clearFrame();
      this.routeEl.setText(`${file.path} · 不在 Blog 预览范围`);
      this.canvas.empty();
      this.canvas.createDiv({ cls: 'guz-blog-empty', text: '此文件夹使用 Obsidian 原生渲染。若要在 Blog 预览中显示，请在插件设置中加入它的文件夹路径。' });
      this.status('原生渲染 · Blog 预览未启用');
      this.plugin.maybeStopServer();
      return;
    }
    try {
      const { root, route } = this.plugin.route(file);
      this.plugin.cancelIdleStop();
      this.routeEl.setText(`${file.path} → ${route}`);
      const session = await this.plugin.server.start(root, this.plugin.settings.nodePath, this.plugin.settings.port);
      if (this.closed || revision !== this.revision) return;
      const url = new URL(route, session.origin).href;
      if (!force && this.frame && this.frameUrl === url && this.session === session) return;
      this.frame?.remove();
      this.canvas.empty();
      this.session = session;
      this.frameUrl = url;
      this.frame = this.canvas.createEl('iframe', {
        cls: 'guz-blog-frame', attr: {
          title: 'Blog 文章发布效果预览',
          // A regular cross-origin iframe, with no Electron/Node privileges.
          sandbox: 'allow-scripts allow-same-origin allow-popups',
          referrerpolicy: 'no-referrer', src: url,
        },
      });
      this.status('正在渲染文章…');
    } catch (error) {
      if (this.closed || revision !== this.revision) return;
      this.clearFrame();
      this.canvas.empty();
      this.canvas.createDiv({ cls: 'guz-blog-empty', text: String(error instanceof Error ? error.message : error) });
      this.status('暂时无法预览，可在设置中检查目录、Node.js 和端口。');
      this.plugin.maybeStopServer();
    }
  }

  async refresh(): Promise<void> {
    const file = this.follow ? this.plugin.activeArticle ?? this.file : this.file;
    if (file) await this.showFile(file, true);
    else this.status('请先在 Obsidian 中打开一篇 Blog 文章。');
  }
}

class BlogPreviewSettings extends PluginSettingTab {
  constructor(app: App, private plugin: BlogPreviewPlugin) { super(app, plugin); }
  display(): void {
    this.containerEl.empty();
    this.containerEl.createEl('h2', { text: 'Guztchian Blog Preview' });
    this.containerEl.createEl('p', { text: '使用本地 Astro 开发服务渲染文章。首次打开会启动服务，关闭最后一个预览分栏后自动停止。目录、Node.js 和端口修改后，点击“保存连接设置”，再刷新预览。' });
    let projectPath = this.plugin.settings.projectPath;
    let nodePath = this.plugin.settings.nodePath;
    let port = String(this.plugin.settings.port);
    new Setting(this.containerEl).setName('Blog 根目录').setDesc('留空时从当前文章自动识别；也可填写相对于 Obsidian 仓库的路径或完整路径。')
      .addText(text => text.setPlaceholder('例如 Blog/dogogod.github.io').setValue(projectPath).onChange(value => { projectPath = value; }));
    let scope = this.plugin.settings.scopePaths.join(', ');
    new Setting(this.containerEl).setName('渲染范围').setDesc('只对这些文件夹启用 Blog 预览，使用相对于 Obsidian 仓库的路径，多个文件夹用逗号分隔。范围外的文件始终保留 Obsidian 原生渲染。')
      .addText(text => text.setPlaceholder('src/content/blog, src/content/spec/about').setValue(scope).onChange(value => { scope = value; }));
    new Setting(this.containerEl).setName('Node.js 路径').setDesc('留空使用系统 node。Windows 可填写 C:\\Program Files\\nodejs\\node.exe。需要 Node.js ≥ 22.12。')
      .addText(text => text.setPlaceholder('node 或 node.exe 完整路径').setValue(nodePath).onChange(value => { nodePath = value; }));
    new Setting(this.containerEl).setName('本地预览端口').setDesc('默认 4323，独立于常用的 4321。仅监听本机；端口冲突时会报错，不会关闭其他服务。')
      .addText(text => text.setValue(port).onChange(value => { port = value; }));
    new Setting(this.containerEl).addButton(button => button.setButtonText('保存连接设置').setCta().onClick(async () => {
      try {
        const checkedPort = validPort(port);
        if (projectPath.trim()) findProject(this.plugin.vaultPath(), projectPath);
        this.plugin.settings.projectPath = projectPath.trim();
        this.plugin.settings.scopePaths = scope.split(',').map(item => item.trim().replaceAll('\\', '/').replace(/^\/+|\/+$/g, '')).filter(Boolean);
        if (!this.plugin.settings.scopePaths.length) throw new Error('请至少填写一个渲染文件夹。');
        this.plugin.settings.nodePath = nodePath.trim();
        this.plugin.settings.port = checkedPort;
        await this.plugin.saveSettings(true);
        new Notice('已保存。回到 Blog 预览分栏，点击刷新。');
      } catch (error) { new Notice(String(error instanceof Error ? error.message : error)); }
    }));
    new Setting(this.containerEl).setName('及时保存并渲染').setDesc('仅在文章有打开的预览时，停止输入片刻后调用 Obsidian 原生保存。关闭后由 Obsidian 自动保存或 Ctrl/Cmd+S 触发更新。')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.autoSave).onChange(async value => {
        this.plugin.settings.autoSave = value;
        this.plugin.cancelSave();
        await this.plugin.saveSettings();
      }));
    new Setting(this.containerEl).setName('停止输入后的保存间隔').setDesc('单位为毫秒；适当延迟可避免每个按键都重新编译。')
      .addDropdown(dropdown => dropdown.addOptions({ '300': '300 ms', '500': '500 ms', '800': '800 ms', '1500': '1500 ms', '2500': '2500 ms' })
        .setValue(String(this.plugin.settings.saveDelay)).onChange(async value => {
          this.plugin.settings.saveDelay = Number(value);
          await this.plugin.saveSettings();
        }));
    this.containerEl.createEl('p', { text: '支持 Blog 中现有的 .md 语法与中英文文章；预览包含草稿。Obsidian 的双链、嵌入语法和插件专用代码块，只有在 Blog 自身支持时才会出现在发布结果中。' });
  }
}
