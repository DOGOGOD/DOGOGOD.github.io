// This function is injected only into the plugin's development server.
// It never enters the production site's source or build.
function previewBridge(token) {
  if (window.parent === window || window.__guztchianPreviewBridge) return;
  window.__guztchianPreviewBridge = true;
  const channel = 'guztchian-blog-preview';
  const send = (type, extra = {}) => window.parent.postMessage({ channel, token, type, ...extra }, '*');
  const positionKey = () => `guztchian-preview-scroll:${location.pathname}`;
  let theme;
  const applyTheme = () => {
    if (!theme) return;
    const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', theme); } catch { /* Storage may be unavailable. */ }
  };
  const restore = () => {
    try {
      const y = Number(sessionStorage.getItem(positionKey()) || 0);
      if (y > 0) requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));
    } catch { /* Keep preview functional when storage is unavailable. */ }
  };
  const ready = () => { applyTheme(); send('ready', { path: location.pathname }); };
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.token !== token || event.data?.channel !== channel) return;
    if (event.data.type === 'theme' && ['light', 'dark', 'system'].includes(event.data.value)) {
      theme = event.data.value;
      applyTheme();
    }
  });
  window.addEventListener('beforeunload', () => {
    try { sessionStorage.setItem(positionKey(), String(window.scrollY)); } catch { /* Optional. */ }
  });
  window.addEventListener('load', () => { restore(); ready(); });
  document.addEventListener('astro:page-load', ready);
  document.addEventListener('click', event => {
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin) {
      event.preventDefault();
      if (['https:', 'http:', 'mailto:'].includes(url.protocol)) send('external', { url: url.href });
    }
  }, true);
}
