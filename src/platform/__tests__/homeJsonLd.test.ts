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

  it('includes a WebSite schema with a SearchAction', () => {
    const website = blocks.find((b) => (b as Record<string, unknown>)['@type'] === 'WebSite');
    expect(website).toBeDefined();
    const action = (website as Record<string, unknown>).potentialAction as Record<string, unknown>;
    expect(action).toBeDefined();
    expect(action['@type']).toBe('SearchAction');
    const target = action.target as Record<string, unknown>;
    expect(String(target.urlTemplate)).toContain('{search_term_string}');
    expect(action['query-input']).toBe('required name=search_term_string');
  });

  it('SearchAction target URL is absolute and on the canonical domain', () => {
    const website = blocks.find((b) => (b as Record<string, unknown>)['@type'] === 'WebSite');
    const action = (website as Record<string, unknown>).potentialAction as Record<string, unknown>;
    const target = action.target as Record<string, unknown>;
    expect(String(target.urlTemplate)).toMatch(/^https:\/\/tekivex\.com\//);
  });
});
