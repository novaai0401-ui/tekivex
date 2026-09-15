import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ConsentStatus = 'undecided' | 'accepted' | 'denied';

interface ConsentContextValue {
  status: ConsentStatus;
  accept: () => void;
  reject: () => void;
  reset: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export const CONSENT_KEY = 'tekivex.consent.v1';
export const CONSENT_CHANGE_EVENT = 'tekivex:consent-change';

function signal(status: ConsentStatus) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  // This preference is for analytics. Advertising consent belongs to Google's
  // certified message; a custom Accept button must not impersonate its choice.
  gtag?.('consent', 'update', { analytics_storage: status === 'accepted' ? 'granted' : 'denied' });
}

function readStored(): ConsentStatus {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw === 'accepted' || raw === 'denied') return raw;
  } catch {
    // localStorage may be blocked (Safari private, embedded webviews) —
    // treat as undecided rather than crashing.
  }
  return 'undecided';
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>(() => readStored());

  useEffect(() => {
    const handler = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== CONSENT_KEY && event.key !== null) return;
      const detail = (event as CustomEvent<ConsentStatus>).detail;
      const next = ['accepted', 'denied', 'undecided'].includes(detail) ? detail : readStored();
      setStatus(next);
      signal(next);
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const persist = useCallback((next: ConsentStatus) => {
    try {
      if (next === 'undecided') localStorage.removeItem(CONSENT_KEY);
      else localStorage.setItem(CONSENT_KEY, next);
    } catch {
      // ignore — UI still updates in-memory
    }
    setStatus(next);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: next }));
  }, []);

  // On mount, if we hydrated to a decided state from localStorage, push
  // the same signal so a returning visitor doesn't get a default-denied
  // session.
  useEffect(() => {
    const initial = readStored();
    if (initial === 'undecided') return;
    signal(initial);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      status,
      accept: () => persist('accepted'),
      reject: () => persist('denied'),
      reset: () => persist('undecided'),
    }),
    [status, persist],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within a ConsentProvider');
  return ctx;
}
