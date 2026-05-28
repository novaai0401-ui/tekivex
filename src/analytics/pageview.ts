// SPA pageview tracking. The router uses the History API and fires a
// custom `tekivex:navigate` event; we forward those (and back/forward
// popstate) to gtag. Safe to call before gtag.js loads — window.gtag
// becomes a no-op queue until the script is on the page.

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

function sendPageview(): void {
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;
  const path = window.location.pathname + window.location.search;
  gtag('event', 'page_view', { page_path: path });
}

let installed = false;

export function initPageviewTracking(): () => void {
  if (installed) return () => {};
  installed = true;
  window.addEventListener('popstate', sendPageview);
  window.addEventListener('tekivex:navigate', sendPageview);
  return () => {
    installed = false;
    window.removeEventListener('popstate', sendPageview);
    window.removeEventListener('tekivex:navigate', sendPageview);
  };
}
