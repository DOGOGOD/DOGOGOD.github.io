---
title: "Blog 功能总结"
pubDate: 2026-06-25
slugId: "function-summary"
description: "Blog 博客系统支持的所有文章功能特性汇总"
category: "guide"
---

# Blog 功能总结

本文档汇总了 Blog 博客系统支持的所有文章功能特性，并提供实时渲染的使用示例。

---

## 目录

1. [Alert 提示框](#1-alert-提示框)
2. [嵌入式卡片](#2-嵌入式卡片)
3. [草稿管理](#3-草稿管理)
4. [KaTeX 数学公式](#4-katex-数学公式)
5. [特殊排版样式](#5-特殊排版样式)
6. [文章目录生成](#6-文章目录生成)
7. [外部视频嵌入](#7-外部视频嵌入)

---

## 1. Alert 提示框

提供五种预设提示框样式，用于在文章中展示不同级别的提示信息。

### 单行内容

语法：`:::note` / `:::tip` / `:::important` / `:::warning` / `:::caution` 配合 `:::` 闭合。

以下是五种提示框的实时渲染效果：

:::note
这是一个提示。
:::

:::tip
这是一个建议。
:::

:::important
这是一个重要事项。
:::

:::warning
这是一个警告。
:::

:::caution
这是一个危险事项。
:::

### 多行内容

提示框内支持多段落、列表、粗体等 Markdown 元素：

:::tip
这是一个包含多行内容的提示框。

- 支持列表项
- 可以包含多个段落

**重点内容**：还可以包含粗体文字和其他 Markdown 元素。
:::

### 嵌套内容

提示框内可以嵌入代码块等复杂元素：

:::warning
提示框内可以包含代码块等其他元素。

```javascript
console.log('Hello World');
```
:::

### 自定义标题

使用 `:::important[自定义标题]` 语法覆盖默认标题：

:::important[自定义标题]
这是一个带有自定义标题的提示框。标题会显示为"自定义标题"而不是默认的"IMPORTANT"。
:::

---

## 2. 嵌入式卡片

支持在文章中嵌入第三方平台的内容卡片，丰富文章表现形式。

### 音乐卡片

语法：`::music{id="歌曲ID"}`

::music{id="30431366"}

### GitHub 卡片

语法：`::github{repo="owner/repo"}`

::github{repo="DOGOGOD/DOGOGOD"}

---

## 3. 草稿管理

提供文章草稿状态控制功能，方便作者进行内容预览和迭代。

在文章 frontmatter 中设置 `draft: true` 即可将文章设为草稿：

- **环境隔离**：草稿文章仅在 `dev` 环境下可见，生产环境自动隐藏
- **视觉标识**：草稿文章顶部显示红色提示框，内容为"草稿警告：此文章为草稿，只出现在测试环境，生产环境将不会显示。"

---

## 4. KaTeX 数学公式

全面支持 KaTeX 数学公式渲染，覆盖学术写作中的常见公式类型。

### 行内公式

这是一个行内公式示例：$E = mc^2$，它展示了爱因斯坦的质能方程。

另一个行内公式示例：$\sum_{i=1}^{n} x_i = X$，表示对 n 个数求和。

### 块级公式

薛定谔方程（时间依赖形式）：

$$
\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \frac{i}{\hbar}H\Psi(\mathbf{r},t)
$$

### 多行对齐公式

麦克斯韦方程组（微分形式）：

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} & = \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} & = 0
\end{aligned}
$$

### 矩阵

$$
\begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix}
$$

### 分段函数

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

### 极限

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

### 积分

高斯积分：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

---

## 5. 特殊排版样式

提供多种自定义 Markdown 扩展语法，增强文章表现力。

### 5.1 引用块

使用 `:::quote ... :::` 语法创建精美引用块，支持 HTML 标签对齐引文出处：

:::quote

宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼：他必须小心，因为林中到处都有与他一样潜行的猎人，如果他发现了别的生命，能做的只有一件事：开枪消灭之。

<br><right>——《三体 II：黑暗森林》</right>
:::

引用块内也可以嵌入数学公式：

:::quote
$E = mc^2$
:::

### 5.2 模糊效果

语法：`!!文本!!`

这是一个!!模糊!!效果。

- **桌面端**：鼠标悬停移除模糊，点击后保持 3 秒清晰显示
- **移动端**：点击移除模糊，当同时满足点击后超过 3 秒和页面滑动才会变为模糊状态

### 5.3 拼音标注

语法：`{汉字}(拼音)`，用 `|` 分隔每个字的拼音，用 `||` 跳过某个字的注音。

{拼音}(pīn|yīn)

{君の名は}(きみ||な|)

### 5.4 彩虹文字

语法：`==文本==`

这是一个==彩虹==文字效果。

### 5.5 下划线

语法：`++文本++`

这个文字下面有++下划线++效果。

### 5.6 样式嵌套

上述特殊样式可以自由嵌套组合，例如模糊 + 彩虹 + 拼音：

这是一个!!==模糊并且带{拼音}(pīn|yīn)的{彩虹}(cǎi|hóng)==!!

另一个嵌套示例：

!!==Do you like the movie {君の名は}(きみ||な|)==!!

### 5.7 脚注

在文章正文中使用 `[^1]` 添加脚注引用，在文末定义对应的引用内容[^1]。

这是另一句话，引用了另外一个文献[^2]。

### 5.8 Typst 渲染

基于 [Typst.ts](https://myriad-dreamin.github.io/typst.ts/) 实现 Typst 排版渲染。

基本排版示例：

```typst
#set page(width: auto, height: auto, margin: 10pt)
#set text(fill: rgb("#2f61eb"), size: 20pt)

$ cal(A) = pi r^2 $

Hello from *Typst*!
```

Cetz 3D 图形示例：

```typst *Waves*
// Code from https://github.com/typst/packages/blob/main/packages/preview/cetz/0.4.2/gallery/waves.typ
#import "@preview/cetz:0.4.2": canvas, draw, vector, matrix

#set page(width: auto, height: auto, margin: .5cm)

#canvas({
  import draw: *

  ortho(y: -30deg, x: 30deg, {
    on-xz({
      grid((0,-2), (8,2), stroke: gray + .5pt)
    })

    // Draw a sine wave on the xy plane
    let wave(amplitude: 1, fill: none, phases: 2, scale: 8, samples: 100) = {
      line(..(for x in range(0, samples + 1) {
        let x = x / samples
        let p = (2 * phases * calc.pi) * x
        ((x * scale, calc.sin(p) * amplitude),)
      }), fill: fill)

      let subdivs = 8
      for phase in range(0, phases) {
        let x = phase / phases
        for div in range(1, subdivs + 1) {
          let p = 2 * calc.pi * (div / subdivs)
          let y = calc.sin(p) * amplitude
          let x = x * scale + div / subdivs * scale / phases
          line((x, 0), (x, y), stroke: rgb(0, 0, 0, 150) + .5pt)
        }
      }
    }

    on-xy({
      wave(amplitude: 1.6, fill: rgb(84, 219, 219, 80))
    })
    on-xz({
      wave(amplitude: 1, fill: rgb(216, 219, 90, 80))
    })
  })
})
```

> **注意**：暗色模式下 Typst 图形渲染效果可能不佳。

---

## 6. 文章目录生成

根据文章标题层级自动生成可导航的目录（Table of Contents）。

- 自动解析 `##`、`###`、`####` 等各级标题
- 支持无限层级嵌套
- 生成可点击跳转的目录链接
- 在 `src/config.ts` 中可通过 `toc.depth` 配置最大目录深度（1~4）

---

## 7. 外部视频嵌入

支持通过标准 HTML `<iframe>` 标签嵌入外部平台的视频播放器，自适应宽度（`width="100%"`）。

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=717556844&bvid=BV13Q4y117A8&cid=397079113&p=1" scrolling="no" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="468"></iframe>

---

## 功能总览

| 功能 | 语法 | 核心能力 |
|------|------|---------|
| Alert 提示框 | `:::type ... :::` | 5 种预设样式，支持嵌套与自定义标题 |
| 音乐卡片 | `::music{id="..."}` | 网易云音乐嵌入 |
| GitHub 卡片 | `::github{repo="..."}` | 仓库信息卡嵌入 |
| 草稿管理 | frontmatter `draft: true` | 环境隔离 + 视觉标识 |
| KaTeX 行内公式 | `$...$` | 行内数学公式 |
| KaTeX 块级公式 | `$$...$$` | 居中块级数学公式 |
| 引用块 | `:::quote ... :::` | 精美引用，支持出处对齐和内嵌公式 |
| 模糊效果 | `!!...!!` | 悬停/点击交互式模糊 |
| 拼音标注 | `{汉字}(拼音)` | 中日文注音 |
| 彩虹文字 | `==...==` | 渐变色彩 |
| 下划线 | `++...++` | 文字下划线 |
| 样式嵌套 | 组合使用 | 多种效果自由叠加 |
| 脚注 | `[^n]` | 文内引用 + 文末定义 |
| Typst 渲染 | ` ```typst ` | 排版与 3D 图形渲染 |
| 目录生成 | 自动 | 基于标题层级自动生成 |
| 视频嵌入 | `<iframe>` | 跨平台视频嵌入 |

[^1]: 这里是第一个引用的具体内容，点击前面的箭头可以跳回正文。
[^2]: 这是第二个引用的内容，支持[链接](#)。
