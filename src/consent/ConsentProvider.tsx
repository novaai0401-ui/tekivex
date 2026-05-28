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
    const handler = () => setStatus(readStored());
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
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
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
