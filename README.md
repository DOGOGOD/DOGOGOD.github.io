# Guztchian's Blog

<div align="center">
    <p>一个人的写作与知识博客 —— 私人笔记本，也是公开作品集。</p>
    <small>使用 <a href="https://astro.build/">Astro</a> 搭建的个人博客</small>
</div>

在线访问：[dogogod.github.io](https://dogogod.github.io/)。中文页面使用根路径，英文页面使用 `/en/` 前缀。

## ✨ 特性

- **纸质主题**：暖象牙纸背景、温暖墨水色、陶土色点缀，营造安静的阅读氛围
- **深色模式**：支持手动切换或自动跟随系统
- **音乐播放器**：点击后加载音频，支持播放、暂停、切歌和拖动；站内切页保持播放，完整刷新后等待点击恢复
- **项目展板**：个人项目（Side Projects）与科研成果（Research Works）分别展示；各自默认显示前 4 项，使用箭头展开和收起，科研成果可关联论文、仓库和项目主页
- **四季动画**：春日樱花、夏夜流星、秋日落叶、冬日雪花随机出现，跨页面保持连续；页脚图标随季节变化，可暂停动画，并尊重系统的减少动态效果设置
- **文章搜索**：使用 [Pagefind](https://pagefind.app/) 实现本地化全文搜索
- **国际化（i18n）**：支持简体中文（zh-cn）和英文（en），含路由级多语言
- **阅读体验**：响应式布局、文章目录、阅读进度、归档分类与「随手翻一页」随机阅读
- **加载优化**：字体分片按需请求，文章样式单独加载；悬停或聚焦站内链接时预取目标页面及样式，省流量模式下关闭预取
- **丰富的 Markdown 语法**：
  - KaTeX 数学公式 & Typst 渲染
  - Admonition 提示框（note / tip / important / caution / warning）
  - GitHub 仓库卡片（`::github{repo="owner/repo"}`）
  - 网易云音乐卡片（`::music{id="歌曲ID"}`）
  - 自定义引用块（`:::quote` 配合 `:::` 闭合）
  - 注音（ruby）、剧透块、彩虹文字、下划线
- 其他：RSS 订阅、字数与阅读时间统计、LQIP 图片占位、滚动入场效果、PhotoSwipe 图片灯箱

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | [Astro 7.3](https://astro.build/)（当前锁定 7.3.2） |
| UI | [Svelte 5](https://svelte.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| 内容 | Markdown（`@astrojs/markdown-remark` + `unified()`，保留 Remark / Rehype 插件链） |
| 搜索 | [Pagefind](https://pagefind.app/) |
| 数学 | [KaTeX](https://katex.org/) + [Typst](https://typst.app/) |
| 图标 | [Iconify](https://iconify.design/) |
| 字体 | LXGW WenKai Bright 正文、EB Garamond 标题、JetBrains Mono 代码字体 |
| 包管理 | [pnpm](https://pnpm.io/) 10.34.5，版本与依赖由配置和锁定文件固定 |

当前未配置 MDX 集成，内容集合读取 `.md` 文件。

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/DOGOGOD/dogogod.github.io.git
cd dogogod.github.io

# 安装依赖（推荐 Node.js 24；最低 22.12，pnpm 10.34.5）
pnpm install --frozen-lockfile

# 启动开发服务器
pnpm dev
```

访问终端输出的地址，默认是 `http://localhost:4321/`。首次使用需准备 Node.js 与 pnpm；推荐 Node.js 24，最低版本为 22.12.0。

开发模式支持热更新，但搜索展示的是示例结果。检查真实搜索、正式样式和加载性能时，使用构建预览：

```bash
pnpm astro dev stop
pnpm build
pnpm preview
```

运行中的正式预览需要在修改后重新构建。开发与正式预览若同时运行，请指定不同端口，例如 `pnpm dev --port 4322`。

## 📦 命令

| 指令 | 作用 |
|---|---|
| `pnpm install --frozen-lockfile` | 按锁定版本安装依赖 |
| `pnpm dev` | 启动开发服务器 `http://localhost:4321` |
| `pnpm build` | 生成 `dist/`、前移 M4A 索引并建立 Pagefind 搜索索引 |
| `pnpm preview` | 预览构建结果 |
| `pnpm newpost <path> [lang]` | 创建文章骨架，语言默认 `zh-cn`；字段修正见下文 |
| `pnpm typecheck` | TypeScript 检查 |
| `pnpm test:audio` | 检查音频索引与数据一致性 |
| `pnpm test:browser` | 检查预加载、音乐、页面导航与触屏操作 |
| `pnpm test:seasonal` | 检查四季动画、跨页连续性及减少动态效果模式 |
| `pnpm benchmark` | 本地模拟慢网络下的首屏与切页性能测试 |
| `pnpm astro dev status` / `pnpm astro dev stop` | 查看／停止开发服务器 |
| `pnpm astro preview status` / `pnpm astro preview stop` | 查看／停止正式预览服务器 |

音频、浏览器、季节与性能检查请先执行 `pnpm build`。浏览器测试默认使用本机 Chrome；`test:browser` 与 `test:seasonal` 可通过环境变量 `BROWSER_CHANNEL=msedge` 改用 Edge。性能测试结果写入 `node_modules/.cache/performance/latest.json`，不能直接等同于公网访问速度。

## 📝 写文章

### CLI 创建

```bash
pnpm newpost my-article zh-cn   # 创建中文文章
pnpm newpost my-article en       # 创建英文翻译
```

脚本会在 `src/content/blog/my-article/` 下生成对应语言的 `.md` 文件。

**当前脚本仍输出旧字段 `date` 与 `slug`。生成后，请将它们改为 `pubDate` 与 `slugId`，再填写正文。** 也可以直接手动创建文件并使用下方模板。`template/template.md` 是 Obsidian Templater 模板，不是 CLI 脚本使用的模板。

### Frontmatter

```yaml
---
title: 文章标题
pubDate: 2026-09-09
slugId: my-article
description: 文章描述
image: ""
draft: true
category: 分类
pinTop: 0      # 置顶优先级，越大越靠前
---
```

必填字段为 `title`、`pubDate` 和 `slugId`。其中 `pubDate` 使用不加引号的 YAML 日期，`slugId` 建议与文章目录名称一致；当前路由按目录名称生成，例如 `/blog/my-article/` 和 `/en/blog/my-article/`。

`draft: true` 的文章在开发模式可见，正式构建中不展示；准备发布时改为 `false`。`pinTop` 大于 0 时在首页置顶，数值越大越靠前。英文翻译与中文放在同一目录；英文缺失时会回退到中文内容。

### 自定义 Markdown 语法

**Admonition 提示框：**

```markdown
:::note
这是一个提示
:::

:::tip
这是小技巧
:::

:::important
这是重要信息
:::

:::caution
这是注意事项
:::

:::warning
这是警告
:::
```

**GitHub 与音乐卡片：** 单独放在一行，分别填写仓库路径和网易云歌曲数字 ID。

```markdown
::github{repo="DOGOGOD/SJTU-Sync"}

::music{id="123456"}
```

卡片详情通过外部接口按需获取；它们与右下角播放本地音频的播放器是两套独立功能。

**引用块：**

```markdown
:::quote
在这里写引用内容。

—— 作者
:::
```

此外支持 `$...$` 行内公式、`$$...$$` 块级公式、`typst` 代码围栏，以及 `!!模糊文字!!`、`==彩虹文字==`、`++下划线++`、`{汉字}(han|zi)`。完整示例见 [Blog 功能总结](./src/content/blog/function-summary/zh-cn.md)。

## 季节预览

正常访问按浏览器日期判断季节：3–5 月为春季、6–8 月为夏季、9–11 月为秋季、12–2 月为冬季。

仅在 `localhost`、`127.0.0.1` 或 `[::1]` 上显示季节预览面板。使用下拉框切换季节，或在地址中加入：

| 参数 | 效果 |
| --- | --- |
| `?season=spring` | 樱花 |
| `?season=summer` | 平行轨迹的流星 |
| `?season=autumn` | 落叶 |
| `?season=winter` | 雪花 |
| `?season=auto` | 恢复实际季节 |

例如 `http://localhost:4321/projects/?season=winter`。预览选择在当前标签页内随切页保留，「再看一次」可立即触发一组动画；系统启用减少动态效果时不会强制播放。线上不启用季节覆盖参数。

## 🔧 配置

| 文件 | 说明 |
|---|---|
| `src/config.ts` | 站点标题、分页、TOC、主题开关、音乐曲目、个人资料、许可协议 |
| `astro.config.mjs` | 站点 URL、i18n 语言、Markdown 插件链 |
| `src/content.config.ts` | 文章内容集合与字段校验 |
| `src/data/projects.json` | 个人项目；数组顺序决定展示顺序 |
| `src/data/research.json` | 科研成果；支持论文、GitHub 和项目主页链接 |
| `src/data/goals.json` | 保留的目标数据，当前未接入页面渲染 |
| `src/i18n/` | 中英文界面文案 |
| `src/utils/season.ts` | 季节判断与问候文案 |
| `src/scripts/seasonal-atmosphere.ts` | 季节动画、预览和暂停逻辑 |
| `src/styles/variables.css` | 主题颜色及布局变量 |
| `public/audio/` | 音乐源文件；构建仅优化输出副本 |

项目和科研数据格式见 [数据说明](./src/data/README.md)。两个板块各默认展示前 4 项，更多内容通过无文字箭头展开；科研数组为空时显示待整理提示。文章许可卡的显示名称与链接由 `src/config.ts` 中的 `licenseConfig` 控制。

## Obsidian 实时预览

项目内置了 [Guztchian Blog Preview](./Plugin/README.md) Obsidian 插件。它会直接启动 Blog 的 Astro 开发渲染器，在 Obsidian 右侧分栏中显示接近正式发布页面的效果，支持 Blog 当前使用的字体、代码高亮、公式、提示框、GitHub 卡片和音乐卡片。

安装时，将 `Plugin/release/guztchian-blog-preview/` 中的 `main.js`、`manifest.json` 和 `styles.css` 复制到 Obsidian 插件目录下的 `guztchian-blog-preview` 文件夹，然后在 Obsidian 的第三方插件设置中启用。首次使用前，请在 Blog 根目录安装依赖：

```text
pnpm install
```

插件设置中的 **Blog 根目录** 可以留空，插件会从当前文章自动识别；也可以填写相对于 Obsidian 仓库的路径。**渲染范围** 用逗号分隔多个文件夹，默认是 `src/content/blog` 和 `src/content/spec/about`。范围外的文件不会启动 Blog 预览，继续使用 Obsidian 原生渲染。预览默认使用本地 `4323` 端口，并在关闭预览分栏、停止预览或退出 Obsidian 时释放自己启动的 Node/Astro 服务。

编辑文章时，插件使用 Obsidian 原生保存接口，停止输入后由 Astro HMR 更新预览，不会直接覆盖编辑器内容。完整设置、故障提示和构建方法见 [插件说明](./Plugin/README.md)。

## 📁 项目结构

```
src/
├── components/     # Astro / Svelte 组件
│   ├── control/    # 导航、主题切换、随机阅读
│   └── misc/       # 搜索、图片、Markdown 渲染、许可卡
├── content/
│   ├── blog/       # 博客文章（每篇一个文件夹，含各语言 .md）
│   └── spec/       # 关于页面等内容
├── i18n/           # 多语言翻译文件
├── data/           # 个人项目、科研成果、目标数据
├── icons/          # 本地 SVG 图标目录
├── layouts/        # 页面布局
├── pages/          # 路由页面
├── plugins/        # Remark / Rehype 与 Typst 渲染插件
├── scripts/        # 季节动画与意图预加载
├── styles/         # 全局样式和主题变量
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── vendor/         # 随项目保存的 Typst 包
├── config.ts       # 站点配置入口
└── content.config.ts # 内容集合定义
```

`public/` 存放静态资源，`script/` 存放构建辅助、文章创建与测试脚本，`.github/workflows/` 存放部署流程。

## 🚢 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

工作流使用 `pnpm 10.34.5` + `Node.js 24`，通过锁定文件安装依赖。升级说明与验证结果见 [ASTRO-UPGRADE.md](./ASTRO-UPGRADE.md)。

在仓库 Settings → Pages 中选择 **GitHub Actions** 作为发布来源。构建输出 `dist/` 通过 Pages artifact 上传并发布，不需要单独维护 `gh-pages` 分支。更换域名时同步修改 `astro.config.mjs` 中的 `site` 和相关个人主页配置。

更多维护记录：[性能优化](./PERFORMANCE.md) · [季节动画设计](./SEASONAL-DESIGN.md) 。
