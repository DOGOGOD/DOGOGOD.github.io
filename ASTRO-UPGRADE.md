# Astro 7.3 升级记录

2026-09-09：从 Astro 5.18.1 升级到 **7.3.2**，版本范围设为 `~7.3.2`，避免普通安装自动跨到 7.4 或 8.x。

## 兼容处理

- 配套更新：`@astrojs/svelte` 9.0.1、`@astrojs/rss` 4.0.19、`astro-icon` 1.2.0、Tailwind CSS / Vite 插件 4.3.3。
- 显式安装 `@astrojs/markdown-remark` 7.3.1，通过 `unified({ remarkPlugins, rehypePlugins })` 保留现有公式、Typst、提示框、引用和媒体卡片处理，使用新版配置入口。
- `compressHTML: true` 保留原有行内元素间空格，避免 Astro 7 默认 JSX 空白规则改变排版。
- 内容集合的 Zod 改从 `astro/zod` 导入。
- Node.js 最低版本为 22.12.0；本地验证使用 24.14.0，部署流程使用 Node.js 24。
- 固定 pnpm 10.34.5，更新 `pnpm-lock.yaml`，部署使用 `--frozen-lockfile`。项目仍输出静态文件并部署到 GitHub Pages。
- 创建图标插件默认的本地图标目录，避免新版插件对缺失目录发出警告。

## 验证结果

- 锁定依赖安装、完整正式构建、TypeScript 检查通过；仍生成 13 个页面。
- 与升级前逐页比较，标题、文章标题层级、正文、链接、代码块数量、公式数量、媒体卡片和图片描述一致。
- Pagefind 仍索引 2 种语言、6 个页面、1773 个词；实际测试中英文搜索和点击结果进入文章。
- 浏览器回归通过：按需字体与页面样式预取、省流量模式、连续音乐播放、前进后退、快速切歌、刷新恢复位置、失败重试、触屏操作。
- 四季动画回归通过：实际季节、浅深色、减少动态效果、切页/历史导航连续性、暂停、页面隐藏和移动端数量上限。
- 项目页桌面/手机初始显示 4 项，顺序不变，展开和收起正常；全站已删除的上下跳转按钮未重新出现。
- 检查首页和文章截图；开发模式下首页、文章及英文项目页正常，未发现浏览器运行时错误。

## 性能对照

使用 `node script/benchmark-browser.mjs astro5` / `astro7` 测量。两组均为本地 gzip 服务、100 ms 延迟、1.6 Mbps 下载、4 倍 CPU 降速，每组 3 个全新浏览器上下文取中位数；切页前悬停项目链接 1.5 秒。

| 指标 | Astro 5.18.1 | Astro 7.3.2 |
| --- | ---: | ---: |
| 首次内容绘制 FCP | 1552 ms | 1584 ms |
| 最大内容绘制 LCP | 1848 ms | 1960 ms |
| 悬停后项目页就绪 | 473 ms | 341 ms |
| 首页 CSS（解压后） | 237321 B | 235855 B |
| 布局偏移 CLS | 0.00201 | 0.00201 |

这组样本中切页更快，首屏未提速，LCP 略有增加。样本量较小，不能据此承诺公网访问速度；升级主要完成框架和依赖维护。

## 本地使用

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
pnpm test:audio
pnpm test:browser
pnpm test:seasonal
```

搜索以 `pnpm build` 后的正式预览为准。Astro 7 的后台服务器可用 `pnpm astro dev status` / `pnpm astro dev stop`，或 `pnpm astro preview status` / `pnpm astro preview stop` 管理。

本次已完成本地验证，未执行线上发布。参考：[Astro 7.3 发布说明](https://astro.build/blog/astro-730/)、[v6 迁移指南](https://docs.astro.build/en/guides/upgrade-to/v6/)、[v7 迁移指南](https://docs.astro.build/en/guides/upgrade-to/v7/)。
