import { describe, it, expect, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { ConsentProvider, CONSENT_KEY } from '../ConsentProvider';
import { ScriptLoader, ADSENSE_CLIENT, GTAG_ID } from '../ScriptLoader';

function setup() {
  return render(
    <ConsentProvider>
      <ScriptLoader />
    </ConsentProvider>,
  );
}

function findScript(substr: string): HTMLScriptElement | undefined {
  return Array.from(document.querySelectorAll('script')).find(
    (s) => (s.src ?? '').includes(substr),
  ) as HTMLScriptElement | undefined;
}

describe('ScriptLoader', () => {
  beforeEach(() => {
    localStorage.clear();
    document.querySelectorAll('script[id^="tekivex-"]').forEach((s) => s.remove());
  });

  it('does not inject any script while consent is undecided', () => {
    setup();
    expect(findScript('googletagmanager.com')).toBeUndefined();
    expect(findScript('adsbygoogle.js')).toBeUndefined();
  });

  it('does not inject any script when consent is denied', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setup();
    expect(findScript('googletagmanager.com')).toBeUndefined();
    expect(findScript('adsbygoogle.js')).toBeUndefined();
  });

  it('injects gtag.js once consent is accepted', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setup();
    const tag = findScript('googletagmanager.com/gtag/js');
    expect(tag).not.toBeNull();
    expect(tag!.src).toContain(GTAG_ID);
    expect(tag!.async).toBe(true);
  });

  it('injects the AdSense script with the publisher client id', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setup();
    const tag = findScript('adsbygoogle.js');
    expect(tag).not.toBeNull();
    expect(tag!.src).toContain(`client=${ADSENSE_CLIENT}`);
    expect(tag!.getAttribute('crossorigin')).toBe('anonymous');
  });

  it('is idempotent — does not add duplicates on re-render', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    const { rerender } = setup();
    rerender(
      <ConsentProvider>
        <ScriptLoader />
      </ConsentProvider>,
    );
    const adsTags = Array.from(document.querySelectorAll('script')).filter((s) =>
      (s.src ?? '').includes('adsbygoogle.js'),
    );
    expect(adsTags.length).toBe(1);
  });

  it('injects scripts after consent flips from denied to accepted', () => {
    const { rerender } = setup();
    expect(findScript('adsbygoogle.js')).toBeUndefined();
    act(() => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      window.dispatchEvent(new Event('tekivex:consent-change'));
    });
    rerender(
      <ConsentProvider>
        <ScriptLoader />
      </ConsentProvider>,
    );
    expect(findScript('adsbygoogle.js')).toBeDefined();
  });
});
