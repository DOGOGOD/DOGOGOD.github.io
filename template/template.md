<%* 
// ============================================================
// Blog 文章模板 - Templater 模板
// 使用方法:
//   1. 在 src/content/blog/ 下新建文件夹（即 slugId）
//   2. 在文件夹内新建 zh-cn.md 或 en.md
//   3. 应用此模板，按 Tab 依次填写各字段
// ============================================================

// 从文件名判断语言
const fileName = tp.file.title; // "zh-cn" or "en"
const isZh = fileName === "zh-cn";

// 从父文件夹名提取 slugId
const folderName = tp.file.folder(true); // 例如 "src/content/blog/my-post"
const pathParts = folderName.split("/");
const slugId = pathParts[pathParts.length - 1] || tp.file.title;

// 预设分类选项（可根据需要修改）
const categories = ["tech", "life", "guide", "notes", "project", "tutorial"];
const category = await tp.system.suggester(categories, categories, false, isZh ? "选择分类 (ESC 跳过)：" : "Select category (ESC to skip): ");

_%>---
title: "<% tp.file.cursor(1) %>"
pubDate: <% tp.date.now("YYYY-MM-DD") %>
slugId: "<% slugId %>"
description: "<% tp.file.cursor(2) %>"
category: "<% category %>"
draft: true
pinTop: 0
image: ""
---
<%* if (isZh) { _%>

# <% tp.file.cursor(1) %>

<% tp.file.cursor(3) %>

---

## 参考：博客支持的 Markdown 扩展语法

| 功能        | 语法                                                                              |                  |
| --------- | ------------------------------------------------------------------------------- | ---------------- |
| 提示框       | `:::note` / `:::tip` / `:::important` / `:::warning` / `:::caution` 配合 `:::` 闭合 |                  |
| 自定义标题提示框  | `:::important[自定义标题]`                                                           |                  |
| 音乐卡片      | `::music{id="网易云歌曲ID"}`                                                         |                  |
| GitHub 卡片 | `::github{repo="owner/repo"}`                                                   |                  |
| 引用块       | `:::quote ... :::`                                                              |                  |
| 模糊效果      | `!!文本!!`                                                                        |                  |
| 拼音标注      | `{汉字}(拼音\|拼音)`                                                                  |                  |
| 彩虹文字      | `==文本==`                                                                        |                  |
| 下划线       | `++文本++`                                                                        |                  |
| 行内公式      | `$E=mc^2$`                                                                      |                  |
| 块级公式      | `$$ ... $$`                                                                     |                  |
| 脚注        | `[^1]` 配合 `[^1]: 内容`                                                            |                  |
| Typst 渲染  | ` ```typst ... ``` `                                                            | <%* } else { _%> |

# <% tp.file.cursor(1) %>

<% tp.file.cursor(3) %>

---

## Reference: Extended Markdown Syntax

| Feature              | Syntax                                                           |
|----------------------|------------------------------------------------------------------|
| Alert Boxes          | `:::note` / `:::tip` / `:::important` / `:::warning` / `:::caution` closed with `:::` |
| Custom Alert Title   | `:::important[Custom Title]`                                     |
| Music Card           | `::music{id="Netease song ID"}`                                  |
| GitHub Card          | `::github{repo="owner/repo"}`                                    |
| Quote Block          | `:::quote ... :::`                                               |
| Blur Effect          | `!!text!!`                                                       |
| Pinyin Annotation    | `{汉字}(pinyin\|pinyin)`                                         |
| Rainbow Text         | `==text==`                                                       |
| Underline            | `++text++`                                                       |
| Inline Formula       | `$E=mc^2$`                                                       |
| Block Formula        | `$$ ... $$`                                                      |
| Footnote             | `[^1]` with `[^1]: content`                                      |
| Typst Render         | ` ```typst ... ``` `                                             |<%* } _%>
