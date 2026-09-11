<script>
  import { onMount } from 'svelte';
  import ArchiveCategoryFilter from './ArchiveCategoryFilter.svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import i18nit from '@i18n/translation';
  import { formatMonthDay } from '@/utils/time'
  import { getRelativeLocaleUrl } from '@utils/url-utils';

  export let sortedPosts = [];
  export let currentLang = "zh-cn";
  export let defaultLocale = "zh-cn";

  let selectedCategories = [];
  let reducedMotion = false;
  const isEn = currentLang === 'en';
  const t = i18nit(currentLang);

  // 提取所有分类并去重
  $: categories = [...new Set(sortedPosts.map(post => post.data.category || 'undefined'))].sort();


  // 响应式过滤逻辑 - 特殊处理 undefined 情况
  $: filteredPosts = selectedCategories.length > 0
    ? sortedPosts.filter(post => {
        const postCat = post.data.category || 'undefined';
        return selectedCategories.includes(postCat);
      })
    : sortedPosts;

  // 按年份分组逻辑
  $: postsByYear = filteredPosts.reduce((acc, post) => {
    const year = new Date(post.data.pubDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  $: years = Object.keys(postsByYear).sort((a, b) => b - a);

  onMount(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => { reducedMotion = motion.matches; };
    syncMotion();
    motion.addEventListener('change', syncMotion);
    // 获取初始 URL 参数 - 特殊处理 undefined
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    
    // 当参数为 'undefined' 时，专门用于显示未分类文章
    if (categoryParam === 'undefined') {
      selectedCategories = ['undefined'];
    } else if (categoryParam && categoryParam !== 'null') {
      selectedCategories = categoryParam.split(',');
    }

    // 处理浏览器前进/后退
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      selectedCategories = params.get('category')?.split(',') || [];
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
        window.removeEventListener('popstate', handlePopState);
        motion.removeEventListener('change', syncMotion);
    }
  });

  // 筛选点击逻辑
  function toggleCategory(cat) {
    if (cat === null) {
      selectedCategories = []; // 点击“全部”则清空
    } else {
      if (selectedCategories.includes(cat)) {
        // 如果已选中，则移除
        selectedCategories = selectedCategories.filter(c => c !== cat);
      } else {
        // 如果未选中，则添加
        selectedCategories = [...selectedCategories, cat];
      }
    }

    // 更新 URL，方便分享和刷新
    const url = new URL(window.location);
    if (selectedCategories.length > 0) {
      url.searchParams.set('category', selectedCategories.join(','));
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState(window.history.state, '', url);
  }

</script>

<div class="archives mx-auto w-full max-w-[var(--page-width)]">
    <div class="text-center pt-5 pb-10 max-w-[var(--page-width)] mx-auto md:mt-0 mt-28">
        <p class="text-[var(--text-color)] text-3xl py-5 font-bold">{t("header.archive")}</p>
        <p aria-live="polite" aria-atomic="true" class="text-[var(--text-color-70)] font-bold">{t("cover.subTitle.archive", {count: filteredPosts.length})}</p>
    </div>

    {#if categories.length > 0}
      <section class="mobile-filters" aria-labelledby="mobile-category-heading">
        <ArchiveCategoryFilter {categories} {selectedCategories} {t}
          onToggle={toggleCategory} headingId="mobile-category-heading" />
      </section>
    {/if}

    <div class="py-6 mx-auto text-[var(--text-color)]" id="archive-content">
        {#if filteredPosts.length === 0}
          <div class="archive-empty">
            <p>{isEn ? 'No articles in this selection.' : '暂无符合筛选条件的文章。'}</p>
            <button type="button" on:click={() => toggleCategory(null)}>{isEn ? 'Show all articles' : '查看全部文章'}</button>
          </div>
        {/if}
        {#each years as year (year)}
            <div class="mb-8">
                <h2 class="text-2xl font-bold my-4 text-[var(--text-color)] flex items-center gap-3">
                    <span class="w-1 h-6 bg-[var(--link-color)] rounded-full"></span>
                    {year}
                </h2>
                <div class="space-y-2">
                    {#each postsByYear[year] as post (post.id)}
                        <div animate:flip={{ duration: reducedMotion ? 0 : 250 }} in:fade={{ duration: reducedMotion ? 0 : 150 }} out:fade={{ duration: reducedMotion ? 0 : 150 }} >
                            <a 
                                href={getRelativeLocaleUrl(currentLang, `/blog/${post.id}/`)}
                                class="flex items-center gap-4 active:bg-[var(--button-hover-color)] hover:bg-[var(--button-hover-color)] p-2 rounded transition-all duration-200 group"
                            >
                                <span class="text-[var(--text-color-70)] min-w-[80px] md:min-w-[120px]">
                                    {formatMonthDay(post.data.pubDate, currentLang)}
                                </span>
                                
                                <span class="text-lg group-hover:pl-2 group-hover:text-[var(--link-color)] group-hover:font-bold transition-all duration-200 flex-1 group-active:text-[var(--link-color)]">
                                    {post.data.title}
                                    {#if post.isFallback}
                                        <span class="inline-block px-1 ml-2 text-xs font-mono uppercase bg-[var(--button-hover-color)] rounded border border-[var(--button-border-color)]">
                                            {defaultLocale}
                                        </span>
                                    {/if}
                                    <span class="mobile-post-category">#{post.data.category || t('pagecard.uncategorized')}</span>
                                </span>

                                <span class="hidden md:flex items-center font-mono text-sm text-[var(--text-color-70)]">
                                    <svg class="mr-1 h-[1em] w-[0.875em]" viewBox="0 0 448 512" aria-hidden="true">
                                        <path fill="currentColor" d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8l-9.8 58.8h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8l-9.7 58.8H416c17.7 0 32 14.3 32 32s-14.3 32-32 32h-68.9l-21.3 128H384c17.7 0 32 14.3 32 32s-14.3 32-32 32h-68.9l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7h-95.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.6-58.9H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zm5.8 159.6l-21.3 128h95.1l21.3-128z" />
                                    </svg>
                                    {post.data.category || t("pagecard.uncategorized")}
                                </span>
                            </a>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

    <aside 
        id="category-sidebar"
        class="hidden lg:block absolute left-[var(--toc-offset-left)] top-70 bottom-0 w-[var(--category-width)]">
        <div class="sticky top-24">
            <ArchiveCategoryFilter {categories} {selectedCategories} {t}
              onToggle={toggleCategory} headingId="desktop-category-heading" />
        </div>
    </aside>

<style>
  .mobile-filters {
    margin: 0.5rem 0 0.25rem;
    padding: 0 0 1.25rem;
  }
  .archive-empty button:focus-visible {
    outline: 2px solid var(--link-color);
    outline-offset: 3px;
  }
  .mobile-post-category {
    display: block;
    margin-top: 0.25rem;
    color: var(--text-color-70);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .archive-empty { padding: 2rem 0; text-align: center; color: var(--text-color-70); }
  .archive-empty button { margin-top: 1rem; color: var(--link-color); text-decoration: underline; text-underline-offset: 4px; }
  @media (min-width: 768px) { .mobile-post-category { display: none; } }
  @media (min-width: 1024px) { .mobile-filters { display: none; } }
</style>
