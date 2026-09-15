import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConsentProvider, useConsent, CONSENT_KEY } from '../ConsentProvider';

function Probe() {
  const { accept, reject, reset } = useConsent();
  return (
    <div>
      <button onClick={accept}>accept</button>
      <button onClick={reject}>reject</button><button onClick={reset}>reset</button>
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

  it('dispatches consent=update with analytics granted on Accept', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => screen.getByText('accept').click());
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
    });
  });

  it('dispatches consent=update with analytics denied on Reject', () => {
    render(
      <ConsentProvider>
        <Probe />
      </ConsentProvider>,
    );
    act(() => screen.getByText('reject').click());
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
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
      analytics_storage: 'granted',
    });
  });

  it('withdraws analytics on reset without overwriting Google advertising consent', () => {
    render(<ConsentProvider><Probe /></ConsentProvider>);
    act(() => screen.getByText('accept').click());
    act(() => screen.getByText('reset').click());
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', { analytics_storage: 'denied' });
    expect(gtag.mock.calls.every(call => !('ad_storage' in call[2]))).toBe(true);
  });

  it('synchronizes withdrawal from another tab', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    render(<ConsentProvider><Probe /></ConsentProvider>);
    act(() => { localStorage.removeItem(CONSENT_KEY); window.dispatchEvent(new StorageEvent('storage', { key: CONSENT_KEY })); });
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', { analytics_storage: 'denied' });
  });

  it('keeps the decision in memory when storage is blocked', () => {
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    render(<ConsentProvider><Probe /></ConsentProvider>);
    act(() => screen.getByText('accept').click());
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', { analytics_storage: 'granted' });
    write.mockRestore();
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
