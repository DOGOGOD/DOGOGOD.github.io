<script lang="ts">
  import { onMount } from 'svelte'
  import Icon from '@iconify/svelte'

  type Track = { title: string; src: string }
  let { tracks = [] as Track[] } = $props()

  let audioEl = $state<HTMLAudioElement>()
  let index = $state(0)
  let playing = $state(false)
  let hovered = $state(false)

  // ── Drag state ──
  const POS_KEY = '__music_pos__'
  let x = $state(initX())
  let y = $state(initY())
  let dragging = $state(false)
  let startX = 0, startY = 0, origX = 0, origY = 0, moved = false

  function initX() { try { return clamp(JSON.parse(localStorage.getItem(POS_KEY) || '').x, 0, innerW() - 48) } catch { return innerW() - 78 } }
  function initY() { try { return clamp(JSON.parse(localStorage.getItem(POS_KEY) || '').y, 0, innerH() - 48) } catch { return innerH() - 96 } }

  onMount(() => { restore() })

  function savePos() {
    try { localStorage.setItem(POS_KEY, JSON.stringify({ x, y })) } catch {}
  }
  function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
  function innerW() { return window.innerWidth }
  function innerH() { return window.innerHeight }

  function onPointerDown(e: PointerEvent) {
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    dragging = true; moved = false
    startX = e.clientX; startY = e.clientY
    origX = x; origY = y
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - startX, dy = e.clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true
    x = clamp(origX + dx, 0, innerW() - 48)
    y = clamp(origY + dy, 0, innerH() - 48)
  }
  function onPointerUp() {
    if (dragging && moved) savePos()
    dragging = false
  }

  // ── Audio state ──
  const STORAGE_KEY = '__music_state__'
  function save() {
    const a = audioEl; if (!a || tracks.length === 0) return
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ index, time: a.currentTime, playing })) } catch {}
  }
  function restore() {
    const a = audioEl; if (!a || tracks.length === 0) return
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) { a.src = tracks[0].src; return }
      const s = JSON.parse(raw) as { index: number; time: number; playing: boolean }
      if (s.index < tracks.length) {
        index = s.index; a.src = tracks[index].src
        a.currentTime = Math.max(0, s.time - 0.3)
        if (s.playing) a.play().then(() => playing = true).catch(() => playing = false)
      } else { a.src = tracks[0].src }
    } catch { a.src = tracks[0].src }
  }

  const hasTracks = $derived(tracks.length > 0)
  const current = $derived(hasTracks ? tracks[index] : undefined)
  const expanded = $derived(hovered)

  $effect(() => {
    const a = audioEl; if (!a || !current) return
    a.src = current.src
    if (playing) a.play().catch(() => (playing = false))
  })

  function toggle() {
    if (moved) return
    const a = audioEl; if (!a || !current) return
    if (playing) { a.pause(); playing = false }
    else { a.play().then(() => (playing = true)).catch(() => (playing = false)) }
  }
  function skip(e: MouseEvent) { e.stopPropagation(); if (tracks.length <= 1) return; index = (index + 1) % tracks.length }
  function onTimeUpdate() { save() }
  function onEnded() { if (tracks.length > 1) { index = (index + 1) % tracks.length } else { playing = false } }

  $effect(() => {
    const w = innerW(); const h = innerH()
    x = clamp(x, 0, w - 48)
    y = clamp(y, 0, h - 48)
  })
</script>

<audio bind:this={audioEl} preload="none" onended={onEnded} ontimeupdate={onTimeUpdate}></audio>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="music-player-container"
  style="left: {x}px; top: {y}px; cursor: {dragging ? 'grabbing' : 'grab'}"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointerleave={onPointerUp}
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
>
  <div
    class="flex items-center gap-0 overflow-hidden rounded-full border backdrop-blur"
    style="
      background: color-mix(in srgb, var(--bg-color) 20%, transparent);
      border-color: color-mix(in srgb, var(--text-color) 20%, transparent);
      transition: max-width 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;
    "
  >
    <button
      type="button" onclick={toggle}
      class="mp-btn grid h-11 w-11 shrink-0 place-items-center rounded-full active:scale-90"
      style={playing ? 'color: var(--link-color)' : 'color: var(--text-color)'}
      aria-label={playing ? `暂停 · ${current?.title ?? ''}` : `播放${current ? ' · ' + current.title : '音乐'}`}
      aria-pressed={playing}
    >
      {#if playing && hovered}
        <Icon icon="material-symbols:pause" width="18" height="18" />
      {:else}
        <Icon icon="material-symbols:music-note" width="18" height="18" />
      {/if}
    </button>

    <div class="flex items-center" style="max-width: {expanded ? '220px' : '0'}; opacity: {expanded ? 1 : 0}; transition: max-width 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease;">
      <span class="whitespace-nowrap pl-1 pr-1 text-xs" style="color: var(--text-color)">{current ? current.title : '暂无曲目'}</span>
      {#if tracks.length > 1}
        <button type="button" onclick={skip} class="mp-btn mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-200 active:scale-90" style="color: var(--text-color)" aria-label="下一首" tabindex={expanded ? 0 : -1}>
          <Icon icon="material-symbols:skip-next" width="15" height="15" />
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .music-player-container {
    position: fixed;
    z-index: 50;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }
  .mp-btn:hover { background-color: var(--button-hover-color); }
  .mp-btn:active { transform: scale(0.9); }
</style>
