# Blog 内容编辑指南

本指南涵盖博客全部内容板块的编辑方法。涉及文件均在 `src/` 目录下。

---

## 目录

- [首页三大板块](#首页三大板块)
- [耕集（Working）](#耕集working)
- [栈集 / 项目板块（Projects）](#栈集--项目板块projects)
- [言集（博客文章）](#言集博客文章)
- [关于页](#关于页)
- [文案与翻译（i18n）](#文案与翻译i18n)
- [个人信息与配置](#个人信息与配置)
- [快速速查表](#快速速查表)

---

## 首页三大板块

首页在 `src/pages/[...locale]/[...page].astro`，第 1 页包含三个板块：

| 行号 | 板块 | 中文名 | 英文名 | 数据来源 |
|------|------|--------|--------|---------|
| 141 | 文章 | 言集 | Articles | `src/content/blog/` |
| 176 | 工作 | 耕集 | Working | `src/data/goals.json` |
| 209 | 项目 | 栈集 | Projects | `src/data/projects.json` |

> 如需修改板块标题文字（如把"耕集"改成别的名字），直接改上述行号的 `<h2>` 标签内容即可。

---

## 耕集（Working）

**文件：`src/data/goals.json`**

展示在首页"耕集"板块，用于记录当前正在做的事/近期目标。

```json
[
  {
    "title": "持续更新 Blog",
    "titleEn": "Keep updating the blog",
    "desc": "完善博客功能，持续输出技术笔记与思考文章，把学到的东西沉淀下来。",
    "descEn": "Improve the blog and keep publishing technical notes and reflections — turning what I learn into lasting knowledge."
  }
]
```

### 字段说明

| 字段 | 说明 |
|------|------|
| `title` | 中文标题 |
| `titleEn` | 英文标题 |
| `desc` | 中文描述（1-2 句话） |
| `descEn` | 英文描述 |

### 操作

- **添加**：在数组末尾追加一个对象
- **修改**：直接编辑对应条目的字段
- **删除**：移除整个对象
- **排序**：数组顺序即首页展示顺序

---

## 栈集 / 项目板块（Projects）

**文件：`src/data/projects.json`**

首页"栈集"展示前 3 个项目；`/projects` 页面展示全部项目。两份数据共享此文件。

```json
[
  {
    "name": "Guztchian's Blog",
    "description": "你正在看的这个站点——暖调纸质主题、陶土色点缀...",
    "descriptionEn": "The site you're viewing right now — warm paper-toned theme...",
    "githubUrl": "https://github.com/DOGOGOD/DOGOGOD.github.io",
    "tags": ["Astro", "Tailwind", "TypeScript"],
    "status": "active"
  }
]
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 项目名称，中英文通用 |
| `description` | 是 | 中文描述 |
| `descriptionEn` | 否 | 英文描述（不填则英文页回退到中文描述） |
| `githubUrl` | 是 | GitHub 仓库链接 |
| `tags` | 是 | 技术标签，如 `["Python", "ROS2"]` |
| `status` | 否 | 项目状态，不填则不显示状态标签 |

### status 可选值

| 值 | 中文显示 | 英文显示 |
|----|---------|---------|
| `"active"` | 进行中 | Active |
| `"maintained"` | 维护中 | Maintained |
| `"experiment"` | 实验性 | Experimental |
| `"archived"` | 已封存 | Archived |

### 项目页标题/副标题

如需修改项目页面的标题和副标题，编辑 `src/i18n/language/zh-cn.ts` 和 `en.ts` 中的：

```ts
cover: {
    title: { projects: "项目" },
    subTitle: { projects: "一些我亲手做过的东西" },
}
```

---

## 言集（博客文章）

**目录：`src/content/blog/`**

### 目录结构

```
src/content/blog/
├── function-summary/       # slugId = "function-summary"
│   ├── zh-cn.md            # 中文版
│   └── en.md               # 英文版
├── git-learning/           # slugId = "git-learning"
│   └── Git Learning.md     # 单语言版（不规范，推荐用 zh-cn.md / en.md）
└── ...
```

### 创建新文章

1. 在 `src/content/blog/` 下新建文件夹，文件夹名即 `slugId`（URL 标识，建议用英文短横线连接，如 `my-new-post`）
2. 在文件夹内创建 `zh-cn.md`（中文）和/或 `en.md`（英文）
3. 写入以下 frontmatter + 正文：

```markdown
---
title: "文章标题"
pubDate: 2026-06-26
slugId: "my-new-post"
description: "文章摘要，会显示在卡片和 SEO 中"
category: "tech"
draft: false
pinTop: 0
image: ""
---

正文内容（Markdown）...
```

### Frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `pubDate` | 是 | 发布日期，格式 `YYYY-MM-DD` |
| `slugId` | 是 | URL 标识，与文件夹名一致 |
| `description` | 否 | 摘要，默认空 |
| `category` | 否 | 分类。常见值：`tech`、`life`、`guide`、`notes`、`project`、`tutorial` |
| `draft` | 否 | 草稿，`true` 则生产环境不显示，默认 `false` |
| `pinTop` | 否 | 置顶优先级，数字越大越靠前，`0` 为不置顶 |
| `image` | 否 | 封面图路径（相对于 `public/`） |

### 支持的 Markdown 扩展语法

| 功能 | 语法 |
|------|------|
| 提示框 | `:::note` / `:::tip` / `:::important` / `:::warning` / `:::caution` 配合 `:::` 闭合 |
| 自定义标题提示框 | `:::important[自定义标题]` |
| 音乐卡片 | `::music{id="网易云歌曲ID"}` |
| GitHub 卡片 | `::github{repo="owner/repo"}` |
| 引用块 | `:::quote ... :::` |
| 模糊效果 | `!!文本!!` |
| 拼音标注 | `{汉字}(拼音\|拼音)` |
| 彩虹文字 | `==文本==` |
| 下划线 | `++文本++` |
| 行内公式 | `$E=mc^2$` |
| 块级公式 | `$$ ... $$` |
| 脚注 | `[^1]` 配合 `[^1]: 内容` |
| Typst 渲染 | ` ```typst ... ``` ` |

---

## 关于页

**文件：`src/content/spec/about/zh-cn.md` 和 `en.md`**

纯 Markdown，无 frontmatter。直接编辑正文即可。

---

## 文案与翻译（i18n）

**目录：`src/i18n/language/`**

| 文件 | 说明 |
|------|------|
| `zh-cn.ts` | 中文文案 |
| `en.ts` | 英文文案 |

两个文件结构完全一致，包含以下模块：

| 模块 | 包含内容 |
|------|---------|
| `header` | 导航栏文字（首页、归档、项目、关于） |
| `cover` | 各页面标题和副标题 |
| `search` | 搜索框提示文字 |
| `pageNavigation` | 分页按钮（上一页/下一页） |
| `blogNavi` | 文章内导航（上一篇/下一篇） |
| `pagecard` | 文章卡片信息（字数、分钟、未分类） |
| `projectStatus` | 项目状态标签 |
| `page404` | 404 页面文案 |
| `themeInfo` | 主题切换提示 |
| `button` | 按钮文案 |
| `license` | 版权信息 |

> 编辑时保持两个文件结构同步，确保中英文都有对应翻译。

---

## 个人信息与配置

**文件：`src/config.ts`**

```ts
export const siteConfig: SiteConfig = {
    title: "Guztchian",        // 站点标题
    subTitle: "Blog",          // 副标题
    favicon: "/favicon/favicon.ico",
    pageSize: 6,               // 每页文章数
    // ...
}

export const profileConfig: ProfileConfig = {
    avatar: "/avatar.png",     // 头像（替换 public/avatar.png）
    name: "Guztchian",        // 显示名
    description: "永远年轻，永远热泪盈眶",
    intro: {
        zh: "中文自我介绍...",
        en: "English intro..."
    },
    tags: ["Python", "C++", ...],  // 首页标签
    startYear: 2024,
}
```

---

## 快速速查表

| 想改什么 | 改哪个文件 |
|---------|-----------|
| 耕集条目 | `src/data/goals.json` |
| 项目条目 | `src/data/projects.json` |
| 项目页标题/副标题 | `src/i18n/language/zh-cn.ts` 和 `en.ts` |
| 项目状态标签文字 | `src/i18n/language/zh-cn.ts` 和 `en.ts` |
| 首页板块标题（"言集""耕集""栈集"） | `src/pages/[...locale]/[...page].astro` 行 141/176/209 |
| 博客文章 | `src/content/blog/<slugId>/zh-cn.md` 和 `en.md` |
| 关于页 | `src/content/spec/about/zh-cn.md` 和 `en.md` |
| 导航栏/按钮/搜索等全部文案 | `src/i18n/language/zh-cn.ts` 和 `en.ts` |
| 站点标题/头像/自我介绍 | `src/config.ts` |
| 头像图片 | `public/avatar.png` |
| 音乐播放列表 | `src/config.ts` → `siteConfig.music.tracks` |

---

> 大部分数据文件（goals.json、projects.json）修改后刷新页面即可看到效果。Markdown 文章需要重新构建（`pnpm build` 或 `pnpm dev` 热更新）。
