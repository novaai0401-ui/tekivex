import { useEffect, useState } from 'react';

type GooglePrivacy = {
  callbackQueue: Array<{ CONSENT_API_READY: () => void }>;
  showRevocationMessage?: () => void;
};
declare global { interface Window { googlefc?: GooglePrivacy } }

/** Uses the public Funding Choices API after Google's readiness callback. */
export function AdvertisingPrivacy() {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('Advertising preferences are available when Google provides a privacy message for this visitor.');
  useEffect(() => {
    let mounted = true;
    window.googlefc = window.googlefc || { callbackQueue: [] };
    window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
    window.googlefc.callbackQueue.push({ CONSENT_API_READY: () => {
      if (mounted) setReady(typeof window.googlefc?.showRevocationMessage === 'function');
    } });
    return () => { mounted = false; };
  }, []);
  return <aside id="advertising-privacy" aria-label="Advertising privacy choices">
    <button disabled={!ready} onClick={() => {
      window.googlefc?.callbackQueue.push({ CONSENT_API_READY: () => {
        try { window.googlefc?.showRevocationMessage?.(); }
        catch { setMessage('Google could not reopen the message. Please reload this page and try again.'); }
      } });
    }}>Advertising privacy choices</button>
    <p role="status">{message} Analytics preferences are managed separately on the <a href="/cookie-policy">cookie policy page</a>.</p>
  </aside>;
}
