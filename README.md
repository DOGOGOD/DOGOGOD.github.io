# Guztchian's Blog

<div align="center">
    <p>一个人的写作与知识博客 —— 私人笔记本，也是公开作品集。</p>
    <small>基于 <a href="https://github.com/Motues/Momo">Momo</a> 迭代而来，使用 <a href="https://astro.build/">Astro</a> 搭建</small>
</div>

## ✨ 特性

- **纸质主题**：暖象牙纸背景、温暖墨水色、陶土色点缀（Anthropic clay），营造安静的阅读氛围
- **深色模式**：支持手动切换或自动跟随系统
- **音乐播放器**：右下角悬浮播放器，跨页面播放不中断，预置三首背景音乐
- **项目展示**：独立项目页面，展示 GitHub 仓库卡片
- **文章搜索**：使用 [pagefind](https://pagefind.app/) 实现本地化全文搜索
- **国际化（i18n）**：支持简体中文和英文
- **移动端适配**：组件针对移动端优化
- **评论功能**：支持本地部署和 Cloudflare 部署，具体参考 [Momo-backend](https://github.com/Motues/Momo-Backend)
- **丰富的 Markdown 语法**：KaTeX、Typst、Alert 组件、GitHub 卡片、自定义语法等
- 其他功能：文章分类、目录、RSS 订阅、字数统计、阅读时间

## 🚀 快速开始

1. 克隆本项目
    ```bash
    git clone https://github.com/DOGOGOD/DOGOGOD.github.io.git
    cd DOGOGOD.github.io
    ```
2. 安装依赖（需先安装 `pnpm`：`npm install -g pnpm`）
    ```bash
    pnpm install
    ```
3. 启动开发服务器
    ```bash
    pnpm dev
    ```
    访问 `http://localhost:4321`

## 🔧 配置

主要配置文件：

| 文件 | 说明 |
|---|---|
| `src/config.ts` | 站点标题、分页、主题开关、音乐曲目等 |
| `astro.config.mjs` | 站点 URL、i18n 语言、Markdown 插件等 |

详细说明参考站点内的「配置指南」文章。

## 📦 命令

| 指令 | 作用 |
|---|---|
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器 `http://localhost:4321` |
| `pnpm build` | 构建到 `./dist` |
| `pnpm preview` | 预览构建结果 |
| `pnpm newpost <path> <lang>` | 创建新文章 |

## 📁 项目结构

```
src/
├── components/     # Astro / Svelte 组件
├── content/        # Markdown 文章和页面内容
├── data/           # 项目数据 (projects.json)
├── i18n/           # 多语言翻译文件
├── layouts/        # 页面布局
├── pages/          # 路由页面
├── plugins/        # Markdown 插件
├── styles/         # 全局样式和主题变量
├── types/          # TypeScript 类型定义
└── utils/          # 工具函数
```

---

> 本项目基于 [Momo](https://github.com/Motues/Momo) 主题深度定制迭代而来（[Motues/Momo](https://github.com/Motues/Momo)），感谢原作者 [Motues](https://github.com/Motues) 的优秀工作。
