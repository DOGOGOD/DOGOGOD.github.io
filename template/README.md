# Obsidian 文章模板

本目录存放写 Blog 用的 Obsidian 模板。模板只服务编辑器，**不会被 Astro 构建读取**
（内容集合只扫描 `src/content/blog`）。

| 文件 | 适用插件 | 特点 |
| --- | --- | --- |
| `template.md` | [Templater](https://github.com/SilentVoid13/Templater) | 自动填 `title` / `pubDate` / `slugId`，推荐 |
| `template-plain.md` | 核心插件 **Templates** | 无需第三方插件，`slugId` 需手填 |

## 文章目录约定

每篇文章一个目录，中英文各一个文件，图片放在同一目录或其子目录：

```text
src/content/blog/my-first-post/
├── zh-cn.md      # 中文（站点根路径 /blog/my-first-post/）
├── en.md         # 英文（/en/blog/my-first-post/，可缺省，缺省时回退中文）
├── cover.jpg     # 首页封面
└── images/
    └── landscape.jpg
```

`slugId` 必须与文章目录名一致（例如目录 `my-first-post` → `slugId: my-first-post`）。

## Frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 文章标题 |
| `pubDate` | ✅ | 发布日期，**不加引号**的 `YYYY-MM-DD` |
| `slugId` | ✅ | 同文章目录名 |
| `description` | | 摘要，用于卡片与 SEO |
| `image` | | 首页封面，相对当前 `.md` 的路径，如 `"./cover.jpg"`（注意是 `image`，不是 `imge`） |
| `draft` | | `true` 仅在开发模式可见，正式构建隐藏；发布前改 `false` |
| `category` | | 分类名 |
| `pinTop` | | 置顶优先级，>0 在首页置顶，越大越靠前 |

## 使用 Templater（推荐）

1. 安装并启用 **Templater** 社区插件。
2. `设置 → Templater → Template folder location` 填 `dogogod.github.io/template`
   （按你的 Obsidian 仓库根目录填写相对路径）。
3. 写文章：在 `src/content/blog/<文章目录>/` 下新建 `zh-cn.md` 或 `en.md`，
   运行命令 **Templater: Insert template** → 选 `template.md`。
4. 模板会自动写入 frontmatter，`slugId` 取自当前文件所在目录名。

### 可选：自动套用

在 `Templater → Folder Templates` 添加规则，让在该目录新建的笔记自动套用模板：

| Folder | Template |
| --- | --- |
| `dogogod.github.io/src/content/blog` | `dogogod.github.io/template/template.md` |

## 使用内置 Templates 插件

1. `设置 → 核心插件 → 模板` 打开，`模板文件夹位置` 设为 `dogogod.github.io/template`。
2. 新建文章文件后运行 **插入模板** → 选 `template-plain.md`。
3. 手动补全 `title` 与 `slugId`。

## 写作提示

- 正文图片用标准 Markdown：`![说明](./images/x.jpg "图注")`；**不要**用 Obsidian 的
  `![[x.jpg]]`，网站不支持该语法。
- 目录（TOC）由 `##` / `###` 标题自动生成，无需手写。
- 提示框、引用块、音乐 / GitHub 卡片、公式、拼音、模糊、彩虹、下划线、脚注、Typst 等
  语法示例已写在模板正文的 HTML 注释里，写完删除注释段即可。
- 实时预览：安装仓库内的 **Guztchian Blog Preview** 插件，可在 Obsidian 右侧分栏查看
  接近正式页面的效果（详见 `Plugin/README.md`）。
