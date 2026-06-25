<script>
  import { untrack } from 'svelte';
  import Icon from '@iconify/svelte';

  let { tracks = [] } = $props();

  let audioEl = $state(null);
  let index = $state(0);
  let playing = $state(false);
  let hovered = $state(false);
  let focused = $state(false);

  const hasTracks = $derived(tracks.length > 0);
  const current = $derived(hasTracks ? tracks[index] : undefined);
  const expanded = $derived(hovered || focused || playing);

  $effect(() => {
    const a = audioEl;
    if (!a || !current) return;
    a.src = current.src;
    if (untrack(() => playing)) {
      a.play().catch(() => (playing = false));
    }
  });

  function toggle() {
    const a = audioEl;
    if (!a || !current) return;
    if (playing) {
      a.pause();
      playing = false;
    } else {
      a.play()
        .then(() => (playing = true))
        .catch(() => (playing = false));
    }
  }

  function skip(e) {
    e.stopPropagation();
    if (!hasTracks) return;
    index = (index + 1) % tracks.length;
  }

  function onEnded() {
    if (tracks.length > 1) {
      index = (index + 1) % tracks.length;
    } else {
      playing = false;
    }
  }
</script>

<audio bind:this={audioEl} onended={onEnded} preload="none"></audio>

<div
  class="fixed bottom-6 right-6 z-50"
  style="animation: mp-fade-rise 0.7s ease-out 0.24s both"
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
>
  <div
    class="flex items-center gap-0 overflow-hidden rounded-full border shadow-sm"
    style="
      background: var(--bg-color);
      border-color: var(--button-border-color);
      transition: all 320ms cubic-bezier(0.22, 1, 0.36, 1);
    "
  >
    <button
      type="button"
      onclick={toggle}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      class="mp-btn grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors"
      style={playing
        ? 'color: var(--link-color)'
        : 'color: var(--text-color)'}
      aria-label={playing
        ? `暂停 · ${current?.title ?? ''}`
        : `播放${current ? ' · ' + current.title : '音乐'}`}
      aria-pressed={playing}
    >
      {#if hasTracks}
        {#if playing}
          <Icon icon="material-symbols:pause" width="18" height="18" />
        {:else}
          <Icon icon="material-symbols:play-arrow" width="18" height="18" style="transform:translateX(1px)" />
        {/if}
      {:else}
        <Icon icon="material-symbols:music-note" width="18" height="18" />
      {/if}
    </button>

    <div
      class="flex items-center"
      style="
        max-width: {expanded ? '220px' : '0'};
        opacity: {expanded ? 1 : 0};
        transition: max-width 320ms cubic-bezier(0.22, 1, 0.36, 1),
                    opacity 220ms ease;
      "
    >
      <span
        class="whitespace-nowrap pl-1 pr-1 text-xs"
        style="color: var(--text-color-70)"
      >
        {current ? current.title : '暂无曲目'}
      </span>
      {#if tracks.length > 1}
        <button
          type="button"
          onclick={skip}
          onfocus={() => (focused = true)}
          onblur={() => (focused = false)}
          class="mp-btn mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors"
          style="color: var(--text-color-70)"
          aria-label="下一首"
          tabindex={expanded ? 0 : -1}
        >
          <Icon icon="material-symbols:skip-next" width="15" height="15" />
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  @keyframes mp-fade-rise {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mp-btn:hover {
    background-color: rgba(33, 31, 28, 0.06);
  }
</style>
