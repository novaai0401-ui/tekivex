import { useEffect, useRef } from 'react';
import { useConsent } from '../consent/ConsentProvider';
import { ADSENSE_CLIENT } from '../consent/ScriptLoader';

interface AdSlotProps {
  /** AdSense ad unit slot id (numeric string from the AdSense dashboard). */
  slot: string;
  /** Ad layout. 'auto' is responsive and fits most placements. */
  format?: 'auto' | 'fluid' | 'rectangle';
  /** Optional aria-label for screen readers. */
  label?: string;
  /** Extra className for wrapper styling per-placement. */
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Renders an AdSense ad unit, but only when the visitor has accepted
 * cookies. Returns null otherwise so denied/undecided visitors get
 * the full content area with no reserved blank space.
 *
 * In dev (import.meta.env.DEV) a labelled placeholder is rendered so
 * authors can verify placements without loading real ads.
 */
export function AdSlot({ slot, format = 'auto', label, className }: AdSlotProps) {
  const { status } = useConsent();
  const pushed = useRef(false);

  useEffect(() => {
    if (status !== 'accepted') return;
    if (pushed.current) return;
    if (typeof window === 'undefined') return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      // adsbygoogle may not be ready yet; AdSense retries on the next
      // script load. Silently skip rather than crashing the page.
    }
  }, [status, slot]);

  if (status !== 'accepted') return null;

  if (import.meta.env?.DEV) {
    return (
      <div
        className={`ad-slot ad-slot--placeholder ${className ?? ''}`.trim()}
        aria-label={label ?? 'Advertisement placeholder'}
        data-testid="ad-slot-placeholder"
      >
        Ad placeholder · slot {slot}
      </div>
    );
  }

  return (
    <div className={`ad-slot ${className ?? ''}`.trim()} aria-label={label ?? 'Advertisement'}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-testid="ad-slot-ins"
      />
    </div>
  );
}
