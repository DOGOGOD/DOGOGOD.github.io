# Guztchian Blog Preview（Obsidian 插件）

这个插件把当前 Blog 的 Astro 开发渲染器放进 Obsidian 的右侧分栏。文章中的 Blog 字体、目录、代码高亮、公式、提示框、GitHub 卡片和音乐卡片都会沿用网站本身的排版规则，避免在编辑器里维护一套容易失真的“仿网页预览”。

## 安装

1. 在 Obsidian 中打开 **设置 → 第三方插件 → 已安装插件 → 打开插件文件夹**。
2. 把 `release/guztchian-blog-preview/` 内的 `main.js`、`manifest.json`、`styles.css` 复制到插件文件夹下的 `guztchian-blog-preview` 目录。
3. 回到 Obsidian，刷新第三方插件列表并启用 **Guztchian Blog Preview**。

插件目录也可以直接使用本目录构建后的三个根文件：`main.js`、`manifest.json`、`styles.css`。`src/`、`build.mjs` 和依赖目录不需要复制到 Obsidian。

## 使用

打开 `src/content/blog/<文章目录>/zh-cn.md` 或 `en.md`，点击左侧功能区的面板图标，或者运行命令面板中的 **打开文章预览（右侧分栏）**。预览会跟随当前打开的文章；关闭“跟随文章”后可以固定当前页面。

插件只作用于设置中的 **渲染范围**。默认范围是 `src/content/blog` 和 `src/content/spec/about`；可以在设置中用逗号添加或替换文件夹，例如 `src/content/blog, src/content/spec/about, drafts/published`。范围以相对于 Obsidian 仓库的路径填写，范围外的文件不会启动 Blog 预览，也不会修改 Obsidian 原生 Markdown 渲染。即使某个范围内的笔记没有对应的发布路由，插件也只会在预览分栏中提示，不会接管该笔记的编辑视图。

首次打开会在 Blog 根目录启动一个只监听 `127.0.0.1` 的 Astro 开发服务（默认端口 4323）。Obsidian 文章停止输入后会调用自身的保存接口，Astro 随后通过 HMR 更新预览，不会直接改写编辑器内容。预览分栏关闭后服务会自动停止；插件卸载时也会清理自己启动的服务。

设置中的 **Blog 根目录** 留空即可自动识别：插件会从当前文章向上查找同时包含 `package.json`、`src/content/blog` 的目录。若 Obsidian 仓库是 Blog 的上一级目录，填写相对于仓库的路径，例如 `Blog/dogogod.github.io`。首次使用前请在该目录安装依赖：

```text
pnpm install
```

**Node.js 路径** 留空使用系统 `node`；本项目需要 Node.js 22.12 或更高版本。端口可以改为 1024–65535 的本地空闲端口，插件不会停止其他端口上的 Astro 服务。

工具栏还提供：

- 适应分栏、手机 390px、桌面 1280px 三种视口；
- 跟随系统、浅色纸面、深色纸面三种网页主题；
- 刷新预览、在浏览器打开、查看启动日志；
- 文章切换和 HMR 更新时尽量保留网页滚动位置。

关于页面和普通 Markdown 的边界与正式网站一致：只有 `src/content/blog` 中具备 `zh-cn.md` 或 `en.md` 的文章，以及 `src/content/spec/about` 中的关于页面有发布路由。普通笔记会显示说明，不会被插件擅自转换成另一种 Markdown 方言。

## 开发与检查

在 `Plugin` 目录执行：

```text
pnpm install --offline
node node_modules/typescript/bin/tsc --noEmit
node build.mjs
```

`node build.mjs` 会把源代码打包为 Obsidian 所需的 CommonJS `main.js`，并生成可直接复制的 `release/guztchian-blog-preview/`。插件使用 Obsidian 官方公开的 `ItemView`、`editor-change`、Vault 事件和 `FileSystemAdapter` 接口；预览 iframe 使用沙箱，不获得 Obsidian 的 Node 权限。
