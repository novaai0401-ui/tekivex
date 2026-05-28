// Deprecated. Analytics and AdSense are now loaded unconditionally in
// index.html and gated via Google Consent Mode v2 signals dispatched by
// ConsentProvider on Accept / Reject. This component is kept as a no-op
// so existing imports don't break; remove once nothing references it.

export const GTAG_ID = 'G-C65SFGKM00';
export const ADSENSE_CLIENT = 'ca-pub-4630229006617891';

export function ScriptLoader() {
  return null;
}
