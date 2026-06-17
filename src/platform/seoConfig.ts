// ─── SEO Config — per-route metadata map ─────────────────────────────────
import { type SeoConfig, seoFromManifest } from './useSeo';
import { getProduct } from './registry';

const BASE_URL = 'https://tekivex.com';

// ── Home ──────────────────────────────────────────────────────────────────
const HOME_SEO: SeoConfig = {
  title: 'Tekivex — Enterprise Developer Tools Platform',
  description:
    'Tekivex builds open-source enterprise developer tools: GridStorm (high-performance data grid, ' +
    '35 plugins), Analytics Studio (26+ charts, drag-drop BI), DataFlow (real-time streaming), and ' +
    'Quantum Vault (sovereign post-quantum tokens). MIT-licensed. Free forever.',
  keywords: [
    'enterprise developer tools',
    'open source data grid',
    'react data grid',
    'AG Grid alternative',
    'data grid library',
    'analytics dashboard builder',
    'real-time streaming engine',
    'post-quantum cryptography',
    'GridStorm',
    'Tekivex',
    'TypeScript enterprise',
    'open source enterprise software',
    'MIT license developer tools',
    'headless data grid',
    'virtual scrolling grid',
  ],
  canonical: BASE_URL,
  ogTitle: 'Tekivex — Enterprise Developer Tools Platform',
  ogDescription:
    'Open-source enterprise developer tools: GridStorm data grid, Analytics Studio, DataFlow streaming, ' +
    'Quantum Vault — MIT-licensed, free forever.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  twitterTitle: 'Tekivex — Enterprise Developer Tools Platform',
  twitterDescription:
    'GridStorm data grid, Analytics Studio, DataFlow streaming, Quantum Vault — one platform, all open source.',
  twitterImage: `${BASE_URL}/og-tekivex.png`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tekivex',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
        width: 200,
        height: 60,
      },
      description:
        'Tekivex builds open-source enterprise developer tools — GridStorm, Analytics Studio, DataFlow, and Quantum Vault. All MIT-licensed.',
      sameAs: [
        'https://github.com/novaai0401-ui/tekivex',
        'https://www.linkedin.com/company/tekivex/',
        'https://x.com/BharatTechPath',
        'https://whatsapp.com/channel/0029Va4q7fr0lwgt6bUyjV2Y',
      ],
      foundingDate: '2025',
      knowsAbout: [
        'Data Grids', 'Business Intelligence', 'Real-time Streaming',
        'Post-Quantum Cryptography', 'Enterprise Software', 'TypeScript', 'React', 'Vue', 'Svelte',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Tekivex',
      url: BASE_URL,
      description:
        'Open-source enterprise developer tools — GridStorm data grid, Analytics Studio, DataFlow streaming, Quantum Vault.',
      publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
    },
  ],
};

// ── Products ──────────────────────────────────────────────────────────────
const PRODUCTS_SEO: SeoConfig = {
  title: 'Products — Tekivex Enterprise Developer Tools',
  description:
    'Explore Tekivex products: GridStorm enterprise data grid (35 plugins, 100K+ rows), ' +
    'Analytics Studio (26+ charts, in-browser SQL), DataFlow (real-time streaming, WebSocket/SSE), ' +
    'and Quantum Vault (post-quantum tokens — Kyber + Dilithium). All MIT-licensed.',
  keywords: [
    'GridStorm data grid', 'Analytics Studio BI', 'DataFlow streaming',
    'Quantum Vault PQC', 'open source enterprise tools', 'Tekivex products',
    'developer software suite', 'TypeScript libraries', 'React data grid',
    'Vue data grid', 'Svelte data grid',
  ],
  canonical: `${BASE_URL}/products`,
  ogTitle: 'Products — Tekivex Developer Tools Suite',
  ogDescription:
    'GridStorm, Analytics Studio, DataFlow, Quantum Vault — enterprise developer tools, MIT-licensed, free forever.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  twitterTitle: 'Tekivex Product Suite',
  twitterDescription:
    'GridStorm, Analytics Studio, DataFlow, Quantum Vault — enterprise tools for every team.',
  twitterImage: `${BASE_URL}/og-tekivex.png`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tekivex Product Suite',
    description: 'Enterprise developer tools built by Tekivex',
    url: `${BASE_URL}/products`,
    numberOfItems: 6,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GridStorm',
        description: 'Open-source enterprise data grid — virtual scrolling, 35 plugins, MIT-licensed',
        url: `${BASE_URL}/product/gridstorm` },
      { '@type': 'ListItem', position: 2, name: 'Pyntra',
        description: 'Client-side PDF editor — form filling, annotation, signing, AES-256, headless React',
        url: `${BASE_URL}/product/pyntra` },
      { '@type': 'ListItem', position: 3, name: 'Analytics Studio',
        description: 'Drag-and-drop BI platform — 26+ charts, in-browser SQL, KPI dashboards',
        url: `${BASE_URL}/product/analytics-studio` },
      { '@type': 'ListItem', position: 4, name: 'Quantum Vault',
        description: 'Sovereign post-quantum tokens — CRYSTALS-Kyber + Dilithium, NIST-standardised',
        url: `${BASE_URL}/product/quantum-vault` },
      { '@type': 'ListItem', position: 5, name: 'DataFlow',
        description: 'Real-time streaming engine — WebSocket, SSE, anomaly detection, time-travel replay',
        url: `${BASE_URL}/product/dataflow` },
      { '@type': 'ListItem', position: 6, name: 'Tekivex UI',
        description: 'Enterprise component library — 50+ accessible components for React, Vue & Svelte',
        url: `${BASE_URL}/product/tekivex-ui` },
    ],
  },
};

// ── About ─────────────────────────────────────────────────────────────────
const ABOUT_SEO: SeoConfig = {
  title: 'About Tekivex — Open-Source Enterprise Developer Tools',
  description:
    'Tekivex is an independent developer tools company building open-source enterprise software — ' +
    'GridStorm data grid, Pyntra browser PDF editor, Analytics Studio, Quantum Vault, DataFlow streaming engine, and Tekivex UI component library. ' +
    '6 products, 57 npm packages, 1,899+ tests. All MIT-licensed. Founded 2025.',
  keywords: [
    'about Tekivex', 'Tekivex company', 'open-source developer tools company',
    'GridStorm team', 'enterprise software company', 'MIT licensed tools',
    'TypeScript developer tools', 'independent software developer',
    'open source business', 'developer tools startup',
  ],
  canonical: `${BASE_URL}/about`,
  ogTitle: 'About Tekivex — Enterprise Software, Crafted with Skill',
  ogDescription:
    '6 products, 57 packages, 1,899+ tests, MIT license. We build open-source enterprise developer tools. Founded 2025.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  twitterTitle: 'About Tekivex',
  twitterDescription:
    'The team behind GridStorm, Pyntra, Analytics Studio, Quantum Vault, DataFlow, and Tekivex UI — all MIT-licensed.',
  twitterImage: `${BASE_URL}/og-tekivex.png`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tekivex',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` },
    description:
      'Tekivex builds enterprise-grade developer tools: GridStorm data grid, Analytics Studio, Quantum Vault, and DataFlow.',
    foundingDate: '2025',
    sameAs: [
      'https://github.com/novaai0401-ui/tekivex',
      'https://www.linkedin.com/company/tekivex/',
      'https://x.com/BharatTechPath',
      'https://whatsapp.com/channel/0029Va4q7fr0lwgt6bUyjV2Y',
    ],
    knowsAbout: [
      'Data Grids', 'Post-Quantum Cryptography', 'Business Intelligence',
      'Real-time Streaming', 'TypeScript', 'React', 'Vue', 'Svelte',
    ],
  },
};

// ── Platform hub ──────────────────────────────────────────────────────────
const PLATFORM_SEO: SeoConfig = {
  title: 'Platform — Tekivex Developer Tools Hub',
  description:
    'The Tekivex platform hub — launch GridStorm, Analytics Studio, DataFlow, and Quantum Vault ' +
    'from a single dashboard. All products are MIT-licensed and production-ready.',
  keywords: [
    'Tekivex platform', 'developer tools hub', 'GridStorm',
    'Analytics Studio', 'DataFlow', 'Quantum Vault', 'enterprise software platform',
  ],
  canonical: `${BASE_URL}/platform`,
  ogTitle: 'Tekivex Platform Hub',
  ogDescription:
    'Launch all Tekivex products from one place — GridStorm, Analytics Studio, DataFlow, Quantum Vault.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  jsonLd: null,
};

// ── Legal & informational pages ───────────────────────────────────────────
function makeBasicSeo(path: string, title: string, description: string): SeoConfig {
  return {
    title,
    description,
    keywords: ['Tekivex', title.toLowerCase()],
    canonical: `${BASE_URL}${path}`,
    ogTitle: title,
    ogDescription: description,
    ogImage: `${BASE_URL}/og-tekivex.png`,
    ogType: 'website',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${BASE_URL}/og-tekivex.png`,
    jsonLd: null,
  };
}

const TERMS_SEO = makeBasicSeo(
  '/terms-of-service',
  'Terms of Service — Tekivex',
  'Read the Terms of Service for tekivex.com and the open-source products published by Tekivex.',
);

const COOKIE_SEO = makeBasicSeo(
  '/cookie-policy',
  'Cookie Policy — Tekivex',
  'How Tekivex uses cookies for analytics and advertising, and how you can manage your consent at any time.',
);

const DISCLAIMER_SEO = makeBasicSeo(
  '/disclaimer',
  'Disclaimer — Tekivex',
  'This page sets out the limits of warranty for tekivex.com and the meaning of beta / preview product status.',
);

const CONTACT_SEO = makeBasicSeo(
  '/contact',
  'Contact Tekivex',
  'Get in touch with the Tekivex team — email, GitHub issues, security disclosures, and partnership enquiries.',
);

const FAQ_SEO: SeoConfig = {
  ...makeBasicSeo(
    '/faq',
    'FAQ — Tekivex',
    'Answers to common questions about Tekivex products, licensing, demos, and advertising.',
  ),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'FAQ — Tekivex',
    url: `${BASE_URL}/faq`,
    description: 'Frequently asked questions about Tekivex products.',
  },
};

// ── Route resolver ────────────────────────────────────────────────────────
export function getSeoForRoute(route: string): SeoConfig {
  if (route === '/' || route === '' || route === '/products') {
    return route === '/products' ? PRODUCTS_SEO : HOME_SEO;
  }
  if (route === '/about') return ABOUT_SEO;
  if (route === '/platform') return PLATFORM_SEO;
  if (route === '/terms-of-service') return TERMS_SEO;
  if (route === '/cookie-policy') return COOKIE_SEO;
  if (route === '/disclaimer') return DISCLAIMER_SEO;
  if (route === '/contact') return CONTACT_SEO;
  if (route === '/faq') return FAQ_SEO;

  if (route.startsWith('/product/')) {
    const id = route.slice('/product/'.length).split('/')[0];
    const product = id ? getProduct(id) : undefined;

    if (product?.seo) {
      const config = seoFromManifest(product.seo, BASE_URL, route);
      const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${BASE_URL}/products` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}${route}` },
        ],
      };
      return { ...config, jsonLd: [config.jsonLd, breadcrumb] as any };
    }

    if (product) {
      return {
        title: `${product.name} — Tekivex`,
        description: product.description,
        keywords: [...product.tags, 'open source', 'MIT license', 'enterprise software', 'Tekivex', 'TypeScript'],
        canonical: `${BASE_URL}${route}`,
        ogTitle: `${product.name} — Tekivex`,
        ogDescription: product.description,
        ogImage: `${BASE_URL}/og-tekivex.png`,
        ogType: 'website',
        twitterTitle: `${product.name} — Tekivex`,
        twitterDescription: product.description,
        twitterImage: `${BASE_URL}/og-tekivex.png`,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: product.name,
            description: product.description,
            url: `${BASE_URL}${route}`,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
            publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Products', item: `${BASE_URL}/products` },
              { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}${route}` },
            ],
          },
        ] as any,
      };
    }
  }

  return HOME_SEO;
}
