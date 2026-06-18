import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConsentProvider, useConsent, CONSENT_KEY } from '../ConsentProvider';

function Probe() {
  const { accept, reject } = useConsent();
  return (
    <div>
      <button onClick={accept}>accept</button>
      <button onClick={reject}>reject</button>
    </div>
  );
}

describe('ConsentProvider — Google Consent Mode v2 signals', () => {
  let gtag: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    localStorage.clear();
    gtag = vi.fn();
    (window as unknown as { gtag?: unknown }).gtag = gtag;
  });
  afterEach(() => {
    delete (window as Window & { gtag?: unknown }).gtag;
  });

  it('dispatches consent=update with all-granted on Accept', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => screen.getByText('accept').click());
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  it('dispatches consent=update with all-denied on Reject', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => screen.getByText('reject').click());
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('re-applies the stored decision on mount so returning visitors get the right signal', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  it('does NOT dispatch consent=update when the visitor is still undecided', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    expect(gtag).not.toHaveBeenCalled();
  });
});
