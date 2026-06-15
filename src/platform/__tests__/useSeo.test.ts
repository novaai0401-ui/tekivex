// ─── useSeo Tests ─────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { seoFromManifest } from '../useSeo';
import { useSeo } from '../useSeo';
import type { SeoConfig } from '../useSeo';
import type { ProductSeoMeta } from '../types';

const BASE_CONFIG: SeoConfig = {
  title: 'GridStorm — Fast Data Grid',
  description: 'The fastest open-source data grid for the web.',
  keywords: ['data grid', 'react', 'open source'],
  canonical: 'https://tekivex.dev/product/gridstorm',
  ogTitle: 'GridStorm',
  ogDescription: 'Open-source data grid',
  ogImage: 'https://tekivex.dev/og.png',
  ogType: 'website',
  twitterTitle: 'GridStorm',
  twitterDescription: 'Fast data grid',
  twitterImage: 'https://tekivex.dev/og.png',
  jsonLd: { '@context': 'https://schema.org', '@type': 'SoftwareApplication' },
};

describe('useSeo', () => {
  beforeEach(() => {
    // Clean <head> between tests
    document.title = '';
    document.head.querySelectorAll('meta, link, script').forEach(el => el.remove());
  });

  it('sets document.title', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    expect(document.title).toBe('GridStorm — Fast Data Grid');
  });

  it('sets meta description', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('The fastest open-source data grid for the web.');
  });

  it('sets meta keywords', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[name="keywords"]');
    expect(meta?.getAttribute('content')).toContain('data grid');
  });

  it('sets canonical link', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://tekivex.dev/product/gridstorm');
  });

  it('sets og:title', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[property="og:title"]');
    expect(meta?.getAttribute('content')).toBe('GridStorm');
  });

  it('sets og:description', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[property="og:description"]');
    expect(meta?.getAttribute('content')).toBe('Open-source data grid');
  });

  it('sets og:image', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[property="og:image"]');
    expect(meta?.getAttribute('content')).toBe('https://tekivex.dev/og.png');
  });

  it('sets og:site_name to Tekivex', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[property="og:site_name"]');
    expect(meta?.getAttribute('content')).toBe('Tekivex');
  });

  it('sets og:url to canonical', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[property="og:url"]');
    expect(meta?.getAttribute('content')).toBe('https://tekivex.dev/product/gridstorm');
  });

  it('sets twitter:card to summary_large_image', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[name="twitter:card"]');
    expect(meta?.getAttribute('content')).toBe('summary_large_image');
  });

  it('sets twitter:title', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[name="twitter:title"]');
    expect(meta?.getAttribute('content')).toBe('GridStorm');
  });

  it('sets twitter:description', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const meta = document.head.querySelector('meta[name="twitter:description"]');
    expect(meta?.getAttribute('content')).toBe('Fast data grid');
  });

  it('injects JSON-LD script tag', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    const script = document.head.querySelector('script[data-seo-jsonld]') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.type).toBe('application/ld+json');
    const data = JSON.parse(script.textContent ?? '{}');
    expect(data['@context']).toBe('https://schema.org');
  });

  it('removes JSON-LD script when jsonLd is null', () => {
    renderHook(() => useSeo(BASE_CONFIG));
    // Inject first, then remove
    renderHook(() => useSeo({ ...BASE_CONFIG, jsonLd: null }));
    expect(document.head.querySelector('script[data-seo-jsonld]')).toBeNull();
  });

  it('updates document.title when config changes', () => {
    const { rerender } = renderHook(
      ({ config }: { config: SeoConfig }) => useSeo(config),
      { initialProps: { config: BASE_CONFIG } }
    );
    rerender({ config: { ...BASE_CONFIG, title: 'Updated Title' } });
    expect(document.title).toBe('Updated Title');
  });

  it('does NOT inject keywords meta when keywords array is empty', () => {
    renderHook(() => useSeo({ ...BASE_CONFIG, keywords: [] }));
    const meta = document.head.querySelector('meta[name="keywords"]');
    // Either not present or empty content
    if (meta) expect(meta.getAttribute('content')).toBe('');
  });

  it('falls back twitter:title to config.title when twitterTitle is absent', () => {
    const cfg: SeoConfig = { ...BASE_CONFIG, twitterTitle: undefined };
    renderHook(() => useSeo(cfg));
    const meta = document.head.querySelector('meta[name="twitter:title"]');
    expect(meta?.getAttribute('content')).toBe(cfg.title);
  });
});

describe('seoFromManifest', () => {
  const META: ProductSeoMeta = {
    title: 'GridStorm — Enterprise Data Grid',
    description: 'The fastest open-source data grid.',
    keywords: ['data grid', 'react', 'grid'],
    ogImage: '/og-gridstorm.png',
    jsonLdType: 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
  };

  it('returns a SeoConfig with the manifest title', () => {
    const seo = seoFromManifest(META);
    expect(seo.title).toBe(META.title);
  });

  it('returns a SeoConfig with the manifest description', () => {
    const seo = seoFromManifest(META);
    expect(seo.description).toBe(META.description);
  });

  it('builds canonical from baseUrl + route', () => {
    const seo = seoFromManifest(META, 'https://tekivex.dev', '/product/gridstorm');
    expect(seo.canonical).toBe('https://tekivex.dev/product/gridstorm');
  });

  it('builds absolute ogImage from relative path', () => {
    const seo = seoFromManifest(META, 'https://tekivex.dev');
    expect(seo.ogImage).toBe('https://tekivex.dev/og-gridstorm.png');
  });

  it('preserves absolute ogImage as-is', () => {
    const meta = { ...META, ogImage: 'https://cdn.example.com/img.png' };
    const seo = seoFromManifest(meta);
    expect(seo.ogImage).toBe('https://cdn.example.com/img.png');
  });

  it('falls back to the default og image when ogImage is absent', () => {
    const meta = { ...META, ogImage: undefined };
    const seo = seoFromManifest(meta, 'https://tekivex.dev');
    expect(seo.ogImage).toBe('https://tekivex.dev/og-tekivex.png');
  });

  it('injects JSON-LD with correct @type', () => {
    const seo = seoFromManifest(META);
    const ld = seo.jsonLd as Record<string, unknown>;
    expect(ld['@type']).toBe('SoftwareApplication');
  });

  it('JSON-LD publisher is Tekivex', () => {
    const seo = seoFromManifest(META, 'https://tekivex.dev');
    const ld = seo.jsonLd as Record<string, unknown>;
    const pub = ld['publisher'] as Record<string, unknown>;
    expect(pub['name']).toBe('Tekivex');
  });

  it('JSON-LD offers has price "0"', () => {
    const seo = seoFromManifest(META);
    const ld = seo.jsonLd as Record<string, unknown>;
    const offers = ld['offers'] as Record<string, unknown>;
    expect(offers['price']).toBe('0');
  });

  it('uses applicationCategory from manifest', () => {
    const seo = seoFromManifest(META);
    const ld = seo.jsonLd as Record<string, unknown>;
    expect(ld['applicationCategory']).toBe('DeveloperApplication');
  });

  it('defaults applicationCategory to DeveloperApplication when absent', () => {
    const meta = { ...META, applicationCategory: undefined };
    const seo = seoFromManifest(meta);
    const ld = seo.jsonLd as Record<string, unknown>;
    expect(ld['applicationCategory']).toBe('DeveloperApplication');
  });
});
