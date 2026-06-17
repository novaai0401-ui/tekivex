import { describe, it, expect } from 'vitest';
// Vite ?raw inlines the file contents at build time, no node:fs needed.
import indexHtml from '../../index.html?raw';

describe('index.html — verification meta tags', () => {
  it('includes the google-adsense-account meta tag', () => {
    expect(indexHtml).toMatch(
      /<meta\s+name="google-adsense-account"\s+content="ca-pub-4630229006617891"\s*\/?>/,
    );
  });

  it('includes a google-site-verification meta tag (Search Console)', () => {
    expect(indexHtml).toMatch(/<meta\s+name="google-site-verification"\s+content="[^"]+"/);
  });
});

describe('index.html — Google Consent Mode v2', () => {
  it('default-denies ad_storage before gtag.js loads', () => {
    expect(indexHtml).toMatch(/gtag\(\s*['"]consent['"]\s*,\s*['"]default['"]/);
    expect(indexHtml).toMatch(/ad_storage:\s*['"]denied['"]/);
    expect(indexHtml).toMatch(/ad_personalization:\s*['"]denied['"]/);
    expect(indexHtml).toMatch(/ad_user_data:\s*['"]denied['"]/);
    expect(indexHtml).toMatch(/analytics_storage:\s*['"]denied['"]/);
  });

  it('loads gtag.js (Consent Mode v2 needs the real script)', () => {
    expect(indexHtml).toMatch(/<script[^>]+googletagmanager\.com\/gtag\/js/);
  });

  it('loads the AdSense script with the publisher client id', () => {
    expect(indexHtml).toMatch(
      /<script[^>]+pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-4630229006617891/,
    );
  });

  it('default consent block precedes the gtag.js script tag', () => {
    const consentIdx = indexHtml.search(/gtag\(\s*['"]consent['"]\s*,\s*['"]default['"]/);
    const scriptIdx = indexHtml.search(/googletagmanager\.com\/gtag\/js/);
    expect(consentIdx).toBeGreaterThan(-1);
    expect(scriptIdx).toBeGreaterThan(consentIdx);
  });
});
