<script>
  export let categories = [];
  export let selectedCategories = [];
  export let t;
  export let onToggle;
  export let headingId;
</script>

<div id={headingId} class="flex items-center gap-2 text-[var(--text-color)] font-bold mb-4 border-b border-[var(--button-border-color)] pb-2 uppercase tracking-wider">
    <svg class="h-3 w-3" viewBox="0 0 448 512" aria-hidden="true">
        <path fill="currentColor" d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8l-9.8 58.8h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8l-9.7 58.8H416c17.7 0 32 14.3 32 32s-14.3 32-32 32h-68.9l-21.3 128H384c17.7 0 32 14.3 32 32s-14.3 32-32 32h-68.9l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7h-95.1l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.6-58.9H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zm5.8 159.6l-21.3 128h95.1l21.3-128z" />
    </svg>
    <span>{t("category")}</span>
</div>

<div class="flex flex-wrap gap-2" role="group" aria-labelledby={headingId}>
    
    {#each categories as cat}
        <button 
            type="button"
            aria-pressed={selectedCategories.includes(cat)}
            aria-controls="archive-content"
            on:click={() => onToggle(cat)}
            class="category-chip px-3 py-1 text-xs rounded-md transition-all border
            {selectedCategories.includes(cat) 
                ? 'bg-[var(--link-color)] text-white border-[var(--link-color)]' 
                : 'hover:border-[var(--link-color)] border-[var(--button-border-color)] text-[var(--text-color)]'}"
        >
            {cat === 'undefined' ? t("pagecard.uncategorized") : cat}
        </button>
    {/each}
</div>

<style>
  .category-chip { max-width: 100%; overflow-wrap: anywhere; }
  .category-chip:focus-visible { outline: 2px solid var(--link-color); outline-offset: 3px; }
</style>
