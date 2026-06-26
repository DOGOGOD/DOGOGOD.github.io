---
title: "Function Summary"
pubDate: 2025-06-25
slugId: "function-summary"
description: "A summary of all article features supported by the blog system, with live rendered examples"
category: "guide"
---

# Function Summary

This document summarizes all article features supported by the blog system, with live-rendered examples.

---

## Table of Contents

1. [Alert Boxes](#1-alert-boxes)
2. [Embedded Cards](#2-embedded-cards)
3. [Draft Management](#3-draft-management)
4. [KaTeX Math Formulas](#4-katex-math-formulas)
5. [Special Typography Styles](#5-special-typography-styles)
6. [Table of Contents Generation](#6-table-of-contents-generation)
7. [External Video Embedding](#7-external-video-embedding)

---

## 1. Alert Boxes

Provides five preset alert box styles for displaying different levels of callout information in articles.

### Single-Line Content

Syntax: `:::note` / `:::tip` / `:::important` / `:::warning` / `:::caution` with a closing `:::`.

Below are all five alert types rendered live:

:::note
This is a note.
:::

:::tip
This is a tip.
:::

:::important
This is an important note.
:::

:::warning
This is a warning.
:::

:::caution
This is a cautionary note.
:::

### Multi-Line Content

Alert boxes support multiple paragraphs, lists, bold text, and other Markdown elements:

:::tip
This is an alert box with multi-line content.

- Supports list items
- Can contain multiple paragraphs

**Key point**: can also include bold text and other Markdown elements.
:::

### Nested Content

Alert boxes can embed complex elements such as code blocks:

:::warning
Alert boxes can contain code blocks and other elements.

```javascript
console.log('Hello World');
```
:::

### Custom Title

Use the `:::important[Custom Title]` syntax to override the default title:

:::important[Custom Title]
This is an alert box with a custom title. The title will display as "Custom Title" instead of the default "IMPORTANT".
:::

---

## 2. Embedded Cards

Supports embedding third-party platform content cards within articles to enrich content presentation.

### Music Card

Syntax: `::music{id="song_id"}`

::music{id="30431366"}

### GitHub Card

Syntax: `::github{repo="owner/repo"}`

::github{repo="DOGOGOD/DOGOGOD"}

---

## 3. Draft Management

Provides article draft status control for content preview and iteration.

Set `draft: true` in the article's frontmatter to mark it as a draft:

- **Environment isolation**: Draft articles are only visible in the `dev` environment and are automatically hidden in production
- **Visual indicator**: A red alert box appears at the top of draft articles, reading: "Draft Warning: This article is a draft and only appears in the test environment. It will not be displayed in production."

---

## 4. KaTeX Math Formulas

Full support for KaTeX math formula rendering, covering common formula types in academic writing.

### Inline Formulas

Here is an inline formula example: $E = mc^2$, demonstrating Einstein's mass-energy equivalence.

Another inline formula example: $\sum_{i=1}^{n} x_i = X$, representing the sum of n numbers.

### Block Formulas

The Schrödinger equation (time-dependent form):

$$
\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \frac{i}{\hbar}H\Psi(\mathbf{r},t)
$$

### Multi-Line Aligned Formulas

Maxwell's equations (differential form):

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} & = \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} & = 0
\end{aligned}
$$

### Matrices

$$
\begin{pmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{pmatrix}
$$

### Piecewise Functions

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

### Limits

$$
\lim_{x \to 0} \frac{\sin(x)}{x} = 1
$$

### Integrals

The Gaussian integral:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

---

## 5. Special Typography Styles

Provides several custom Markdown extension syntaxes to enhance article expressiveness.

### 5.1 Quote Block

Use the `:::quote ... :::` syntax to create beautifully styled quote blocks, with HTML tag support for aligning attribution:

:::quote

The universe is a dark forest. Every civilization is an armed hunter, stalking through the trees like a ghost, gently pushing aside branches that block the path and trying to tread without sound. Even breathing is done with great care. The hunter has to be careful, because everywhere in the forest are stealthy hunters like him. If he finds other life — another hunter, an angel or a demon, a delicate infant or a tottering old man, a fairy or a demigod — there's only one thing he can do: open fire and eliminate them.

<br><right>— The Three-Body Problem II: The Dark Forest</right>
:::

Quote blocks can also embed math formulas:

:::quote
$E = mc^2$
:::

### 5.2 Blur Effect

Syntax: `!!text!!`

This is a !!blur!! effect.

- **Desktop**: Hover to remove blur; click to keep it clear for 3 seconds
- **Mobile**: Tap to remove blur; it returns to the blurred state only when both 3 seconds have elapsed since the tap and the page is scrolled

### 5.3 Pinyin Annotation

Syntax: `{汉字}(pinyin)`, use `|` to separate the pinyin of each character, and `||` to skip annotation for a character.

{pinyin}(pīn|yīn)

{君の名は}(きみ||な|)

### 5.4 Rainbow Text

Syntax: `==text==`

This is a ==rainbow== text effect.

### 5.5 Underline

Syntax: `++text++`

This text has an ++underline++ effect.

### 5.6 Style Nesting

The above special styles can be freely nested and combined — for example, blur + rainbow + pinyin:

This is a !!==blurred rainbow text with {pinyin}(pīn|yīn) annotation==!!

Another nesting example:

!!==Do you like the movie {君の名は}(きみ||な|)==!!

### 5.7 Footnotes

Use `[^1]` in the body text to add footnote references, and define the corresponding content at the end of the article[^1].

This is another sentence referencing a different source[^2].

### 5.8 Typst Rendering

Typst typesetting rendering powered by [Typst.ts](https://myriad-dreamin.github.io/typst.ts/).

Basic typesetting example:

```typst
#set page(width: auto, height: auto, margin: 10pt)
#set text(fill: rgb("#2f61eb"), size: 20pt)

$ cal(A) = pi r^2 $

Hello from *Typst*!
```

Cetz 3D graphics example:

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

> **Note**: Typst graphics rendering may not display optimally in dark mode.

---

## 6. Table of Contents Generation

Automatically generates a navigable Table of Contents based on heading hierarchy.

- Automatically parses `##`, `###`, `####` and other heading levels
- Supports unlimited depth nesting
- Generates clickable, jump-to-section TOC links
- Maximum TOC depth (1–4) can be configured via `toc.depth` in `src/config.ts`

---

## 7. External Video Embedding

Supports embedding external platform video players via standard HTML `<iframe>` tags, with responsive width (`width="100%"`).

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=717556844&bvid=BV13Q4y117A8&cid=397079113&p=1" scrolling="no" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="468"></iframe>

---

## Feature Overview

| Feature | Syntax | Core Capability |
|------|------|---------|
| Alert Boxes | `:::type ... :::` | 5 preset styles, supports nesting and custom titles |
| Music Card | `::music{id="..."}` | NetEase Cloud Music embedding |
| GitHub Card | `::github{repo="..."}` | Repository info card embedding |
| Draft Management | frontmatter `draft: true` | Environment isolation + visual indicator |
| KaTeX Inline | `$...$` | Inline math formulas |
| KaTeX Block | `$$...$$` | Centered block math formulas |
| Quote Block | `:::quote ... :::` | Styled quotes with attribution alignment and inline formulas |
| Blur Effect | `!!...!!` | Interactive hover/tap blur effect |
| Pinyin Annotation | `{汉字}(pinyin)` | CJK phonetic annotation |
| Rainbow Text | `==...==` | Gradient color text |
| Underline | `++...++` | Text underline |
| Style Nesting | Combined use | Free layering of multiple effects |
| Footnotes | `[^n]` | In-text reference + end-of-article definition |
| Typst Rendering | ` ```typst ` | Typesetting and 3D graphics rendering |
| TOC Generation | Automatic | Auto-generated from heading hierarchy |
| Video Embedding | `<iframe>` | Cross-platform video embedding |

[^1]: This is the content of the first reference. Click the arrow before it to jump back to the body text.
[^2]: This is the content of the second reference. Supports [links](#).
