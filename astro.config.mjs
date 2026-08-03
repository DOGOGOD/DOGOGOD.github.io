// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from 'astro-icon';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import rehypeComponents from "rehype-components";

import { admonition } from "./src/plugins/rehype-component-admonition.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { MusicCardComponent } from "./src/plugins/rehype-component-music-card.mjs";
import { GithubCardComponent } from './src/plugins/rehype-component-github-card.mjs';
import { QuoteComponent } from "./src/plugins/rehype-component-quote.mjs"
import { customFigurePlugin } from "./src/plugins/rehype-figure-plugin.mjs";
import { remarkCombined } from './src/plugins/remark-combined.mjs';
import { remarkTypst } from './src/plugins/remark-typst.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkLqip } from './src/plugins/remark-lqip.js';

import svelte from "@astrojs/svelte";

import { siteConfig } from './src/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://dogogod.github.io', // Root URL of site
  prefetch: {
    prefetchAll: true,
    // Warm every internal route after the first page finishes loading. This
    // deliberately trades initial bandwidth for near-instant navigation.
    defaultStrategy: 'load',
  },
  i18n: {
    locales: ['zh-cn', 'en'],
    defaultLocale: 'zh-cn',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [icon({
    include: {
      "fa6-solid": [
        "align-justify", "angle-right", "arrow-down", "arrow-left", "arrow-right",
        "arrow-up", "book-bookmark", "calendar-days", "circle", "circle-info",
        "clock", "diagram-project", "dice-three", "ellipsis", "globe", "hashtag",
        "house", "list-ul", "magnifying-glass", "pen-nib", "triangle-exclamation",
        "user", "xmark"
      ],
      "simple-icons": ["astro", "github", "rss", "svelte", "tailwindcss"],
      "material-symbols": [
        "dark-mode-outline-rounded", "music-note", "pause", "radio-button-partial-outline",
        "skip-next", "wb-sunny-outline-rounded"
      ],
      "fluent": ["pin-24-filled"],
    }
  }), svelte()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro', // code theme
      // theme: 'github-dark',
      wrap: false
    },
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkDirective,
      remarkTypst,
      parseDirectiveNode,
      remarkCombined,
      [remarkLqip, { enable: siteConfig.theme.LQIP }],
    ],
    rehypePlugins: [
      rehypeKatex,
      customFigurePlugin,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            music: MusicCardComponent,
            quote: QuoteComponent,
            note: admonition("note"),
            tip: admonition("tip"),
            important: admonition("important"),
            caution: admonition("caution"),
            warning: admonition("warning"),
          },
        },
      ],
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // ClientRouter waits for route-specific stylesheets before completing a
      // swap. Loading one shared stylesheet up front removes that round-trip.
      cssCodeSplit: false,
      // Keep reusable interaction code cacheable across Astro page transitions.
      // CSS keeps Vite's default inline threshold to avoid extra render-blocking requests.
      assetsInlineLimit(filePath, content) {
        return filePath.endsWith('.js') ? content.length < 1024 : undefined;
      },
    },
  }
});
