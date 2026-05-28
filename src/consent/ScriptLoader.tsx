import { useEffect } from 'react';
import { useConsent } from './ConsentProvider';

export const GTAG_ID = 'G-C65SFGKM00';
export const ADSENSE_CLIENT = 'ca-pub-4630229006617891';

const GTAG_SCRIPT_ID = 'tekivex-gtag-script';
const ADSENSE_SCRIPT_ID = 'tekivex-adsense-script';

function injectScript(id: string, src: string, extra: Record<string, string> = {}): void {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  for (const [k, v] of Object.entries(extra)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

function configureGtag(): void {
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== 'function') return;
  w.gtag('js', new Date());
  w.gtag('config', GTAG_ID, { anonymize_ip: true });
}

/**
 * Loads analytics + AdSense only when the visitor has accepted cookies.
 * Renders nothing — purely a side-effect component.
 */
export function ScriptLoader() {
  const { status } = useConsent();

  useEffect(() => {
    if (status !== 'accepted') return;
    injectScript(GTAG_SCRIPT_ID, `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`);
    configureGtag();
    injectScript(
      ADSENSE_SCRIPT_ID,
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
      { crossorigin: 'anonymous' },
    );
  }, [status]);

  return null;
}
