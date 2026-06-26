# Guztchian's Blog

<div align="center">
    <p>一个人的写作与知识博客 —— 私人笔记本，也是公开作品集。</p>
    <small>基于 <a href="https://github.com/Motues/Momo">Momo</a> 深度定制，使用 <a href="https://astro.build/">Astro</a> 搭建</small>
</div>

## ✨ 特性

- **纸质主题**：暖象牙纸背景、温暖墨水色、陶土色点缀，营造安静的阅读氛围
- **深色模式**：支持手动切换或自动跟随系统
- **音乐播放器**：右下角悬浮播放器，跨页面播放不中断（View Transitions 持久化）
- **项目展示**：独立项目页面，展示 GitHub 仓库卡片
- **文章搜索**：使用 [Pagefind](https://pagefind.app/) 实现本地化全文搜索
- **国际化（i18n）**：支持简体中文（zh-cn）和英文（en）
- **移动端适配**：组件针对移动端优化
- **丰富的 Markdown 语法**：KaTeX 数学公式、Typst 渲染、Admonition 提示框、GitHub 卡片、音乐卡片、自定义引用块、注音（ruby）、剧透块、彩虹文字、下划线
- 其他：文章分类、目录（TOC）、RSS 订阅、字数统计、阅读时间、LQIP 图片占位、AOS 滚动动画、PhotoSwipe 图片灯箱

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/DOGOGOD/DOGOGOD.github.io.git
cd DOGOGOD.github.io

# 安装依赖（需要 pnpm）
pnpm install

# 启动开发服务器
pnpm dev
```
访问 `http://localhost:4321`

## 📦 命令

| 指令 | 作用 |
|---|---|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器 `http://localhost:4321` |
| `pnpm build` | 构建到 `./dist`（含 Pagefind 索引） |
| `pnpm preview` | 预览构建结果 |
| `pnpm newpost <path> <lang>` | 创建新文章（lang 默认 `zh-cn`） |

## 📝 写文章

### CLI 创建

```bash
pnpm newpost my-article zh-cn   # 创建中文文章
pnpm newpost my-article en       # 创建英文翻译
```

脚本会在 `src/content/blog/my-article/` 下生成对应语言的 `.md` 文件。

### Frontmatter

```yaml
---
title: 文章标题
date: 2026-06-26
description: 文章描述
image: ""
draft: false
slug: article-slug
category: 分类
pinTop: 0      # 置顶优先级，越大越靠前
---
```

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

**GitHub 卡片：** `:github[owner/repo]`

**音乐卡片：** `:music[歌曲名|艺术家]`

**引用块：** `:quote[作者|引用内容]`

## 🔧 配置

| 文件 | 说明 |
|---|---|
| `src/config.ts` | 站点标题、分页、TOC、主题开关、音乐曲目、个人资料等 |
| `astro.config.mjs` | 站点 URL、i18n 语言、Markdown 插件 |

## 📁 项目结构

```
src/
├── components/     # Astro / Svelte 组件
│   ├── control/    # 导航、主题切换、浮动菜单
│   └── misc/       # 搜索、图片、Markdown 渲染、许可卡
├── content/
│   ├── blog/       # 博客文章（每篇一个文件夹，含各语言 .md）
│   └── spec/       # 关于页面等内容
├── i18n/           # 多语言翻译文件
├── layouts/        # 页面布局
├── pages/          # 路由页面
├── plugins/        # Remark/Rehype 插件
├── styles/         # 全局样式和主题变量
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
└── config.ts       # 站点配置入口
```

## 🚢 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

---

> 本项目基于 [Momo](https://github.com/Motues/Momo) 主题深度定制迭代而来，感谢原作者 [Motues](https://github.com/Motues) 的优秀工作。
