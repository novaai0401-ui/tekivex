// ─── useSeo — Dynamic <head> meta injection ───────────────────────────────
// Call this hook once in App with the route. It updates document.title and
// all meta/og/twitter/link tags on every hash-route change. JSON-LD
// SoftwareApplication schemas are injected per product page.

import { useEffect } from 'react';
import type { ProductSeoMeta } from './types';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  /** Single object or array of JSON-LD objects (e.g. [SoftwareApplication, BreadcrumbList]) */
  jsonLd?: object | object[] | null;
  /** If true, emit <meta name="robots" content="noindex,follow"> (used for 404 etc). */
  noindex?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function setMeta(selector: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const nameMatch = selector.match(/name="([^"]+)"/);
    const propMatch = selector.match(/property="([^"]+)"/);
    if (nameMatch) el.setAttribute('name', nameMatch[1]);
    if (propMatch) el.setAttribute('property', propMatch[1]);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Inject one or multiple JSON-LD blocks tracked via data-seo-jsonld attribute. */
function setJsonLd(data: object | object[] | null) {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
  if (!data) return;
  const blocks = Array.isArray(data) ? data : [data];
  blocks.forEach((block, idx) => {
    const el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo-jsonld', String(idx));
    el.textContent = JSON.stringify(block, null, 2);
    document.head.appendChild(el);
  });
}

// ── Build SeoConfig from a ProductSeoMeta manifest entry ─────────────────
export function seoFromManifest(
  seo: ProductSeoMeta,
  baseUrl = 'https://tekivex.com',
  route = '/',
): SeoConfig {
  const canonical = `${baseUrl}${route.startsWith('/') ? route : '/' + route}`;
  const ogImage = seo.ogImage
    ? seo.ogImage.startsWith('http')
      ? seo.ogImage
      : `${baseUrl}${seo.ogImage}`
    : `${baseUrl}/og-tekivex.png`;

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': seo.jsonLdType,
    name: seo.title.split(' —')[0].trim(),
    description: seo.description,
    url: canonical,
    image: ogImage,
    applicationCategory: seo.applicationCategory ?? 'DeveloperApplication',
    operatingSystem: seo.operatingSystem ?? 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tekivex',
      url: baseUrl,
    },
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: [
      ...(seo.keywords ?? []),
      'free', 'Tekivex', 'enterprise software',
    ],
    canonical,
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogImage,
    ogType: 'website',
    twitterTitle: seo.title,
    twitterDescription: seo.description,
    twitterImage: ogImage,
    jsonLd,
  };
}

// ── Main hook ─────────────────────────────────────────────────────────────
export function useSeo(config: SeoConfig) {
  useEffect(() => {
    // Title
    document.title = config.title;

    // Basic meta
    setMeta('meta[name="description"]', config.description);
    setMeta(
      'meta[name="robots"]',
      config.noindex
        ? 'noindex, follow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    );
    if (config.keywords?.length) {
      setMeta('meta[name="keywords"]', config.keywords.join(', '));
    }

    // Canonical (points to the hash URL so search engines follow the right page)
    if (config.canonical) {
      setLink('canonical', config.canonical);
    }

    // Open Graph
    setMeta('meta[property="og:type"]', config.ogType ?? 'website');
    setMeta('meta[property="og:title"]', config.ogTitle ?? config.title);
    setMeta('meta[property="og:description"]', config.ogDescription ?? config.description);
    setMeta('meta[property="og:site_name"]', 'Tekivex');
    setMeta('meta[property="og:locale"]', 'en_US');
    if (config.canonical) setMeta('meta[property="og:url"]', config.canonical);
    if (config.ogImage) {
      setMeta('meta[property="og:image"]', config.ogImage);
      setMeta('meta[property="og:image:width"]', '1200');
      setMeta('meta[property="og:image:height"]', '630');
      setMeta('meta[property="og:image:alt"]', config.ogTitle ?? config.title);
    }

    // Twitter Card
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:site"]', '@BharatTechPath');
    setMeta('meta[name="twitter:creator"]', '@BharatTechPath');
    setMeta('meta[name="twitter:title"]', config.twitterTitle ?? config.title);
    setMeta('meta[name="twitter:description"]', config.twitterDescription ?? config.description);
    if (config.twitterImage) {
      setMeta('meta[name="twitter:image"]', config.twitterImage);
      setMeta('meta[name="twitter:image:alt"]', config.twitterTitle ?? config.title);
    }

    // JSON-LD (supports single object or array of multiple schemas)
    setJsonLd(config.jsonLd ?? null);
  }, [
    config.title,
    config.description,
    config.canonical,
    config.ogImage,
    config.keywords,
    config.jsonLd,
  ]);
}
