// Advertising is loaded only by an actual editorial ad slot. The publisher
// verification meta tag remains in every page, including pages without ads.

export const GTAG_ID = 'G-C65SFGKM00';
export const ADSENSE_CLIENT = 'ca-pub-4630229006617891';

export function loadAdSense() {
  if (document.getElementById('tekivex-ad-loader')) return;
  const script = document.createElement('script');
  script.id = 'tekivex-ad-loader';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(script);
}

export function ScriptLoader() {
  return null;
}
