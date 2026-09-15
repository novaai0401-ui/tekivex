import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initPageviewTracking } from '../pageview';

describe('initPageviewTracking', () => {
  let teardown: () => void = () => {};
  let gtagSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtagSpy = vi.fn();
    window.gtag = gtagSpy as unknown as typeof window.gtag;
    window.history.replaceState(null, '', '/');
    teardown = initPageviewTracking();
  });

  afterEach(() => {
    teardown();
    delete window.gtag;
  });

  it('sends a page_view to gtag on tekivex:navigate', () => {
    window.history.pushState(null, '', '/about');
    window.dispatchEvent(new Event('tekivex:navigate'));
    expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', { page_path: '/about', page_location: window.location.origin + '/about' });
  });

  it('sends a page_view on popstate (back/forward)', () => {
    window.history.pushState(null, '', '/products');
    window.dispatchEvent(new Event('popstate'));
    expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', { page_path: '/products', page_location: window.location.origin + '/products' });
  });

  it('uses the current pathname, not a hash fragment', () => {
    window.history.pushState(null, '', '/product/gridstorm');
    window.dispatchEvent(new Event('tekivex:navigate'));
    const calls = gtagSpy.mock.calls;
    const last = calls[calls.length - 1];
    expect(last?.[2]).toEqual({ page_path: '/product/gridstorm', page_location: window.location.origin + '/product/gridstorm' });
    expect(String(last?.[2]?.page_path ?? '')).not.toContain('#');
  });

  it('omits query and fragment data from analytics URLs', () => {
    window.history.pushState(null, '', '/products?utm=x#private-chart-data');
    window.dispatchEvent(new Event('tekivex:navigate'));
    expect(gtagSpy).toHaveBeenLastCalledWith('event', 'page_view', { page_path: '/products', page_location: window.location.origin + '/products' });
  });

  it('is a no-op when gtag is not loaded', () => {
    delete window.gtag;
    expect(() => {
      window.dispatchEvent(new Event('tekivex:navigate'));
    }).not.toThrow();
  });

  it('idempotent — calling init twice does not double-fire', () => {
    initPageviewTracking();
    window.history.pushState(null, '', '/faq');
    window.dispatchEvent(new Event('tekivex:navigate'));
    expect(gtagSpy).toHaveBeenCalledTimes(2);
  });
});
