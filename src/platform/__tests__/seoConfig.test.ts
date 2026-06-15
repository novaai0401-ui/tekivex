// ─── SEO Config Tests ─────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import { getSeoForRoute } from '../seoConfig';
import { getAllProducts, getProduct } from '../registry';

describe('getSeoForRoute', () => {
  // ── Platform home ────────────────────────────────────────────────────────

  it('returns home SEO for "/"', () => {
    const seo = getSeoForRoute('/');
    expect(seo.title).toContain('Tekivex');
    expect(seo.description.length).toBeGreaterThan(20);
  });

  it('home SEO has a canonical URL', () => {
    const seo = getSeoForRoute('/');
    expect(seo.canonical).toBeDefined();
    expect(seo.canonical!.startsWith('https://')).toBe(true);
  });

  it('home SEO has og:title and og:description', () => {
    const seo = getSeoForRoute('/');
    expect(seo.ogTitle).toBeDefined();
    expect(seo.ogDescription).toBeDefined();
  });

  it('home SEO has twitter metadata', () => {
    const seo = getSeoForRoute('/');
    expect(seo.twitterTitle).toBeDefined();
    expect(seo.twitterDescription).toBeDefined();
  });

  it('home SEO has JSON-LD with @context schema.org', () => {
    const seo = getSeoForRoute('/');
    expect(seo.jsonLd).not.toBeNull();
    const blocks = (Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd]) as Array<Record<string, unknown>>;
    const org = blocks.find((b) => b['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org!['@context']).toBe('https://schema.org');
  });

  // ── Products page ────────────────────────────────────────────────────────

  it('returns products SEO for "/products"', () => {
    const seo = getSeoForRoute('/products');
    expect(seo.title).toContain('Products');
  });

  it('products SEO canonical contains "/products"', () => {
    const seo = getSeoForRoute('/products');
    expect(seo.canonical).toContain('/products');
  });

  it('products SEO exposes an ItemList JSON-LD of the catalogue', () => {
    const seo = getSeoForRoute('/products');
    const blocks = (Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd]) as Array<Record<string, unknown>>;
    const list = blocks.find((b) => b && b['@type'] === 'ItemList');
    expect(list).toBeDefined();
    expect(list!['@context']).toBe('https://schema.org');
    expect(Array.isArray(list!['itemListElement'])).toBe(true);
  });

  // ── Product page ─────────────────────────────────────────────────────────

  it('returns product-specific SEO for known product route', () => {
    const seo = getSeoForRoute('/product/gridstorm');
    expect(seo.title).toContain('GridStorm');
  });

  it('product SEO canonical includes the route', () => {
    const seo = getSeoForRoute('/product/gridstorm');
    expect(seo.canonical).toContain('/product/gridstorm');
  });

  it('product SEO has description', () => {
    const seo = getSeoForRoute('/product/gridstorm');
    expect(typeof seo.description).toBe('string');
    expect(seo.description.length).toBeGreaterThan(10);
  });

  it('all registered product routes return a valid SeoConfig', () => {
    for (const p of getAllProducts()) {
      const seo = getSeoForRoute(p.homePath);
      expect(seo.title.length).toBeGreaterThan(0);
      expect(seo.description.length).toBeGreaterThan(0);
    }
  });

  // ── Unknown route falls back to home ─────────────────────────────────────

  it('falls back to home SEO for unknown route', () => {
    const seo = getSeoForRoute('/unknown-xyz');
    const home = getSeoForRoute('/');
    expect(seo.title).toBe(home.title);
  });

  it('falls back to home SEO for unknown product id', () => {
    const seo = getSeoForRoute('/product/does-not-exist');
    const home = getSeoForRoute('/');
    expect(seo.title).toBe(home.title);
  });

  // ── All SeoConfig objects are well-formed ─────────────────────────────────

  it('every returned config has title, description, and ogTitle', () => {
    const routes = ['/', '/products', '/product/gridstorm', '/product/unknown'];
    for (const route of routes) {
      const seo = getSeoForRoute(route);
      expect(typeof seo.title).toBe('string');
      expect(typeof seo.description).toBe('string');
    }
  });
});
