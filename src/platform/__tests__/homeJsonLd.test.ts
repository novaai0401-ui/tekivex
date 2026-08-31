import { describe, it, expect } from 'vitest';
import { getSeoForRoute } from '../seoConfig';

describe('Home JSON-LD', () => {
  const seo = getSeoForRoute('/');
  const blocks = Array.isArray(seo.jsonLd) ? seo.jsonLd : seo.jsonLd ? [seo.jsonLd] : [];

  it('emits more than one schema block', () => {
    expect(blocks.length).toBeGreaterThanOrEqual(2);
  });

  it('includes the Organization schema', () => {
    const org = blocks.find((b) => (b as Record<string, unknown>)['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect((org as Record<string, unknown>).name).toBe('Tekivex');
  });

  it('includes a WebSite schema on the canonical domain', () => {
    const website = blocks.find((b) => (b as Record<string, unknown>)['@type'] === 'WebSite');
    expect(website).toBeDefined();
    expect((website as Record<string, unknown>).url).toBe('https://www.tekivex.com');
  });

  it('does not advertise an on-site SearchAction (no site search)', () => {
    const website = blocks.find((b) => (b as Record<string, unknown>)['@type'] === 'WebSite');
    expect((website as Record<string, unknown>).potentialAction).toBeUndefined();
  });
});
