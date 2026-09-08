// One delegated listener set survives Astro's body swaps. Only a link the
// visitor points to/focuses is warmed; never crawl the site's other pages.
type Connection = { saveData?: boolean; effectiveType?: string };
const warmed = new Set<string>();
const assets = new Set<string>();
let timer: number | undefined;

function candidate(target: EventTarget | null) {
  const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href]') : null;
  if (!link || link.download || link.hasAttribute('download') ||
      link.hasAttribute('data-astro-reload') || link.dataset.astroPrefetch === 'false' ||
      (link.target && link.target !== '_self')) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || !/^https?:$/.test(url.protocol) ||
      (url.pathname === location.pathname && url.search === location.search)) return;
  url.hash = '';
  return url.href;
}

function remember(set: Set<string>, value: string) {
  set.add(value);
  if (set.size > 32) set.delete(set.values().next().value!);
}

async function warm(url: string) {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (document.hidden || !navigator.onLine || connection?.saveData ||
      /(^|-)2g$/.test(connection?.effectiveType ?? '') || warmed.has(url)) return;
  remember(warmed, url);
  try {
    // Reuses the HTTP cache when Astro fetches this URL on click.
    const response = await fetch(url, { priority: 'low', credentials: 'same-origin' });
    if (!response.ok || response.redirected || !response.headers.get('content-type')?.includes('text/html')) {
      warmed.delete(url);
      return;
    }
    const html = await response.text();
    if (html.length > 512_000) return;
    // Only inspect the head: don't parse article bodies or discover their images.
    const headEnd = html.toLowerCase().indexOf('</head>');
    if (headEnd < 0) return;
    const next = new DOMParser().parseFromString(html.slice(0, headEnd + 7), 'text/html');
    if (!next.querySelector('meta[name="astro-view-transitions-enabled"]')) return;
    const current = new Set(Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'), link => link.href));
    for (const style of Array.from(next.querySelectorAll<HTMLLinkElement>('head link[rel="stylesheet"]')).slice(0, 4)) {
      const href = new URL(style.getAttribute('href')!, url);
      if (href.origin !== location.origin || current.has(href.href) || assets.has(href.href)) continue;
      remember(assets, href.href);
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'style';
      preload.href = href.href;
      preload.fetchPriority = 'low';
      preload.dataset.intentPrefetch = '';
      preload.addEventListener('error', () => { assets.delete(href.href); preload.remove(); }, { once: true });
      document.head.append(preload);
    }
  } catch {
    // A transient failure should not prevent a later retry or normal navigation.
    warmed.delete(url);
  }
}

function cancel() { window.clearTimeout(timer); }
function schedule(event: Event) {
  cancel();
  const url = candidate(event.target);
  if (url) timer = window.setTimeout(() => void warm(url), 100);
}
document.addEventListener('pointerover', schedule, { passive: true });
document.addEventListener('pointerout', cancel, { passive: true });
document.addEventListener('focusin', schedule);
document.addEventListener('focusout', cancel);
document.addEventListener('pointerdown', (event) => {
  cancel();
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const url = candidate(event.target);
  if (url) void warm(url);
}, { passive: true });
document.addEventListener('astro:before-preparation', cancel);
