import { describe, it, expect } from 'vitest';
// Vite ?raw inlines the file contents at build time, no node:fs needed.
import indexHtml from '../../index.html?raw';

describe('index.html — AdSense ownership verification', () => {
  it('includes the google-adsense-account meta tag', () => {
    expect(indexHtml).toMatch(
      /<meta\s+name="google-adsense-account"\s+content="ca-pub-4630229006617891"\s*\/?>/,
    );
  });

  it('does NOT load adsbygoogle.js directly from index.html (consent-gated)', () => {
    expect(indexHtml).not.toMatch(/<script[^>]+adsbygoogle\.js/);
  });

  it('does NOT load gtag.js directly from index.html (consent-gated)', () => {
    expect(indexHtml).not.toMatch(/<script[^>]+googletagmanager\.com\/gtag\/js/);
  });

  it('declares the RSS feed via rel="alternate"', () => {
    expect(indexHtml).toMatch(
      /<link\s+rel="alternate"\s+type="application\/rss\+xml"[^>]*href="\/feed\.xml"/,
    );
  });
});
