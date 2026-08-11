// ─── SEO Config — per-route metadata map ─────────────────────────────────
import { type SeoConfig, seoFromManifest } from './useSeo';
import { getProduct } from './registry';
import { getArticle, getAllArticles } from '../content/registry';
import { getAuthor } from '../content/authors';
import { getTool, getAllTools } from '../tools/registry';

const BASE_URL = 'https://tekivex.com';

// ── Home ──────────────────────────────────────────────────────────────────
const HOME_SEO: SeoConfig = {
  title: 'Tekivex — Free Developer Tools Platform',
  description:
    'Free developer tools & private web apps: GridStorm data grid, Tekivex UI components, ' +
    'Quantum Vault tokens on npm — plus 8 free in-browser tools (merge/split/compress PDF, ' +
    'CSV to chart) and hosted apps. Files never uploaded.',
  keywords: [
    'free developer tools',
    'free data grid',
    'react data grid',
    'AG Grid alternative',
    'data grid library',
    'react component library',
    'accessible components',
    'post-quantum cryptography',
    'online PDF editor',
    'browser BI app',
    'real-time streaming dashboard',
    'GridStorm',
    'Pyntra',
    'Analytics Studio',
    'DataFlow',
    'Tekivex',
    'TypeScript tools',
    'free software for developers',
    'free developer tools',
    'virtual scrolling grid',
  ],
  canonical: BASE_URL,
  ogTitle: 'Tekivex — Free Developer Tools Platform',
  ogDescription:
    'Free developer tools: GridStorm data grid, Tekivex UI component library, Quantum Vault, ' +
    'plus hosted web apps — Pyntra PDF editor, Analytics Studio, and DataFlow. Free forever.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  twitterTitle: 'Tekivex — Free Developer Tools Platform',
  twitterDescription:
    'GridStorm, Tekivex UI, Quantum Vault, plus Pyntra, Analytics Studio & DataFlow web apps — one platform, all free.',
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
        'Tekivex builds free developer tools — GridStorm, Tekivex UI, and Quantum Vault — plus three free hosted web apps: Pyntra, Analytics Studio, and DataFlow. All free for commercial use.',
      sameAs: [
        'https://github.com/novaai0401-ui/tekivex',
        'https://www.linkedin.com/company/tekivex/',
        'https://x.com/BharatTechPath',
        'https://whatsapp.com/channel/0029Va4q7fr0lwgt6bUyjV2Y',
      ],
      foundingDate: '2025',
      knowsAbout: [
        'Data Grids', 'Component Libraries', 'Accessibility',
        'Post-Quantum Cryptography', 'PDF Editing', 'Business Intelligence', 'Real-Time Streaming',
        'Developer Tooling', 'TypeScript', 'React', 'Vue', 'Svelte',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Tekivex',
      url: BASE_URL,
      description:
        'Free developer tools — GridStorm data grid, Tekivex UI component library, Quantum Vault — and free hosted web apps: Pyntra, Analytics Studio, and DataFlow.',
      publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
    },
  ],
};

// ── Products ──────────────────────────────────────────────────────────────
const PRODUCTS_SEO: SeoConfig = {
  title: 'Products — Tekivex Developer Tools',
  description:
    'Explore Tekivex: GridStorm high-performance data grid, Tekivex UI (accessible React/Vue/Svelte ' +
    'component library), and Quantum Vault (post-quantum tokens — ML-DSA-87 + XChaCha20), plus ' +
    'three free hosted web apps you open and use in the browser — Pyntra (PDF editor), ' +
    'Analytics Studio (BI & dashboards), and DataFlow (real-time streaming). All free for commercial use.',
  keywords: [
    'GridStorm data grid', 'Tekivex UI components', 'accessible component library',
    'Quantum Vault PQC', 'Pyntra PDF editor', 'Analytics Studio BI app',
    'DataFlow streaming dashboard', 'online PDF editor', 'browser BI tool',
    'real-time dashboard', 'free browser tools', 'Tekivex products',
    'developer software suite', 'React data grid',
  ],
  canonical: `${BASE_URL}/products`,
  ogTitle: 'Products — Tekivex Developer Tools Suite',
  ogDescription:
    'GridStorm, Tekivex UI, Quantum Vault, plus the Pyntra, Analytics Studio & DataFlow web apps — free for commercial use, free forever.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  twitterTitle: 'Tekivex Product Suite',
  twitterDescription:
    'GridStorm, Tekivex UI, Quantum Vault, plus Pyntra, Analytics Studio & DataFlow — six free tools for every team.',
  twitterImage: `${BASE_URL}/og-tekivex.png`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Tekivex Product Suite',
    description: 'Free developer tools and hosted web apps built by Tekivex',
    url: `${BASE_URL}/products`,
    numberOfItems: 6,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'GridStorm',
        description: 'Free high-performance data grid — virtual scrolling, 35 plugins, free for commercial use',
        url: `${BASE_URL}/product/gridstorm` },
      { '@type': 'ListItem', position: 2, name: 'Tekivex UI',
        description: 'Accessible component library for React, Vue & Svelte — WCAG 2.1 AA',
        url: `${BASE_URL}/product/tekivex-ui` },
      { '@type': 'ListItem', position: 3, name: 'Quantum Vault',
        description: 'Sovereign post-quantum tokens — ML-DSA-87 (FIPS 204) + XChaCha20-Poly1305',
        url: `${BASE_URL}/product/quantum-vault` },
      { '@type': 'ListItem', position: 4,
        item: {
          '@type': 'WebApplication', name: 'Pyntra',
          description: 'Free browser-based PDF editor — fill, sign, annotate & redact PDFs, opens encrypted PDFs, runs client-side. Open the app and use it.',
          url: `${BASE_URL}/product/pyntra`,
          applicationCategory: 'BusinessApplication', operatingSystem: 'All',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        } },
      { '@type': 'ListItem', position: 5,
        item: {
          '@type': 'WebApplication', name: 'Analytics Studio',
          description: 'Free browser-based BI app — drag-and-drop pivots, 26+ charts, KPI dashboards & in-browser SQL. Open the app and use it.',
          url: `${BASE_URL}/product/analytics-studio`,
          applicationCategory: 'BusinessApplication', operatingSystem: 'All',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        } },
      { '@type': 'ListItem', position: 6,
        item: {
          '@type': 'WebApplication', name: 'DataFlow',
          description: 'Free browser-based real-time streaming dashboard — live feeds, directional change highlighting, anomaly alerts & time-travel replay. Open the app and use it.',
          url: `${BASE_URL}/product/dataflow`,
          applicationCategory: 'BusinessApplication', operatingSystem: 'All',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        } },
    ],
  },
};

// ── About ─────────────────────────────────────────────────────────────────
const ABOUT_SEO: SeoConfig = {
  title: 'About Tekivex — Independent Developer Tools Project',
  description:
    'Tekivex is an independent developer tools company building free software — GridStorm data grid, ' +
    'Tekivex UI component library, and Quantum Vault post-quantum tokens — plus three free hosted ' +
    'web apps: Pyntra (PDF editor), Analytics Studio (BI), and DataFlow (real-time streaming). ' +
    'Six products, all free for commercial use. Founded 2025.',
  keywords: [
    'about Tekivex', 'Tekivex company', 'free developer tools company',
    'GridStorm team', 'independent software project', 'free tools',
    'Pyntra', 'Analytics Studio', 'DataFlow',
    'free business', 'developer tools startup',
  ],
  canonical: `${BASE_URL}/about`,
  ogTitle: 'About Tekivex — Independent, Free Developer Tools',
  ogDescription:
    'Six products, free for commercial use — three free libraries and three free hosted web apps. Founded 2025.',
  ogImage: `${BASE_URL}/og-tekivex.png`,
  ogType: 'website',
  twitterTitle: 'About Tekivex',
  twitterDescription:
    'The team behind GridStorm, Tekivex UI, Quantum Vault, Pyntra, Analytics Studio & DataFlow — all free for commercial use.',
  twitterImage: `${BASE_URL}/og-tekivex.png`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tekivex',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` },
    description:
      'Tekivex is an independent software project building free developer tools: GridStorm data grid, Tekivex UI component library, and Quantum Vault, plus the Pyntra, Analytics Studio, and DataFlow hosted web apps.',
    foundingDate: '2025',
    sameAs: [
      'https://github.com/novaai0401-ui/tekivex',
      'https://www.linkedin.com/company/tekivex/',
      'https://x.com/BharatTechPath',
      'https://whatsapp.com/channel/0029Va4q7fr0lwgt6bUyjV2Y',
    ],
    knowsAbout: [
      'Data Grids', 'Post-Quantum Cryptography', 'Component Libraries',
      'PDF Editing', 'Business Intelligence', 'Real-Time Streaming',
      'Accessibility', 'TypeScript', 'React', 'Vue', 'Svelte',
    ],
  },
};

// ── Platform hub ──────────────────────────────────────────────────────────
const PLATFORM_SEO: SeoConfig = {
  title: 'Platform — Tekivex Developer Tools Hub',
  description:
    'The Tekivex platform hub — GridStorm, Tekivex UI, and Quantum Vault libraries, plus three ' +
    'free hosted web apps you open and use right away: Pyntra (PDF editor), Analytics Studio (BI), ' +
    'and DataFlow (real-time streaming). All six are free for commercial use.',
  keywords: [
    'Tekivex platform', 'developer tools hub', 'GridStorm',
    'Tekivex UI', 'Quantum Vault', 'Pyntra', 'Analytics Studio', 'DataFlow',
    'independent software platform',
  ],
  canonical: `${BASE_URL}/platform`,
  ogTitle: 'Tekivex Platform Hub',
  ogDescription:
    'GridStorm, Tekivex UI, Quantum Vault, plus the Pyntra, Analytics Studio & DataFlow web apps — all in one place.',
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
  'Read the Terms of Service for tekivex.com and the free products published by Tekivex.',
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

  // ── Changelog ──
  if (route === '/changelog') {
    return {
      title: 'Changelog — What\'s New | Tekivex',
      description: 'A dated record of what\'s new across the Tekivex free tools and products — new tools, improvements, and fixes.',
      keywords: ['Tekivex changelog', 'what\'s new', 'product updates', 'release notes'],
      canonical: `${BASE_URL}/changelog`,
      ogTitle: 'Tekivex Changelog — What\'s New',
      ogDescription: 'New tools, improvements, and fixes across the Tekivex free tools and products.',
      ogImage: `${BASE_URL}/og-tekivex.png`,
      ogType: 'website',
      twitterTitle: 'Tekivex Changelog',
      twitterDescription: 'What\'s new across the Tekivex free tools and products.',
      twitterImage: `${BASE_URL}/og-tekivex.png`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Tekivex Changelog',
        description: 'A dated record of what\'s new across the Tekivex free tools and products.',
        url: `${BASE_URL}/changelog`,
        publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
      },
    };
  }

  // ── Free tools hub ──
  if (route === '/tools') {
    const count = getAllTools().length;
    return {
      title: 'Free Online Tools — Private, No Upload | Tekivex',
      description: `${count} free tools that run entirely in your browser — merge, split, and compress PDFs, convert JPG to PDF, and turn CSVs into charts. Your files are never uploaded.`,
      keywords: ['free online tools', 'pdf tools no upload', 'private pdf tools', 'merge pdf', 'split pdf', 'compress pdf', 'jpg to pdf', 'csv to chart'],
      canonical: `${BASE_URL}/tools`,
      ogTitle: 'Free Online Tools — Private, No Upload | Tekivex',
      ogDescription: 'Free in-browser tools for PDFs and data. Files are processed on your device and never uploaded.',
      ogImage: `${BASE_URL}/og-tekivex.png`,
      ogType: 'website',
      twitterTitle: 'Free Online Tools — Private, No Upload',
      twitterDescription: 'Merge, split, compress PDFs and chart CSVs — all in your browser, nothing uploaded.',
      twitterImage: `${BASE_URL}/og-tekivex.png`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Tekivex Free Tools',
        description: 'Free in-browser tools — PDFs and data are processed on your device and never uploaded.',
        url: `${BASE_URL}/tools`,
        publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
      },
    };
  }

  if (route.startsWith('/tools/')) {
    const slug = route.slice('/tools/'.length).split('/')[0];
    const tool = slug ? getTool(slug) : undefined;
    if (tool) {
      const url = `${BASE_URL}${route}`;
      return {
        title: tool.seoTitle,
        description: tool.seoDescription,
        keywords: tool.keywords,
        canonical: url,
        ogTitle: tool.seoTitle,
        ogDescription: tool.seoDescription,
        ogImage: `${BASE_URL}/og-tekivex.png`,
        ogType: 'website',
        twitterTitle: tool.seoTitle,
        twitterDescription: tool.seoDescription,
        twitterImage: `${BASE_URL}/og-tekivex.png`,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: `${tool.name} — Tekivex Tools`,
            description: tool.seoDescription,
            url,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All (browser-based)',
            browserRequirements: 'Requires JavaScript',
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: `How to use ${tool.name}`,
            description: tool.short,
            step: tool.steps.map((s) => ({ '@type': 'HowToStep', name: s.title, text: s.body })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Tekivex', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: `${BASE_URL}/tools` },
              { '@type': 'ListItem', position: 3, name: tool.name, item: url },
            ],
          },
        ] as any,
      };
    }
  }

  // ── Use-Cases content hub ──
  if (route === '/use-cases') {
    const count = getAllArticles().length;
    return {
      title: 'Use Cases — Product Guides, Comparisons & Deep Dives | Tekivex',
      description: `${count} in-depth articles on the Tekivex product suite — GridStorm, Tekivex UI, and Quantum Vault. Architecture deep dives, migration guides, and real-world use cases.`,
      keywords: ['Tekivex use cases', 'GridStorm guide', 'Tekivex UI', 'Quantum Vault', 'react data grid guide', 'developer tools articles'],
      canonical: `${BASE_URL}/use-cases`,
      ogTitle: 'Use Cases — Tekivex Product Guides & Deep Dives',
      ogDescription: `${count} in-depth articles on the Tekivex product suite, written by the Tekivex Engineering team.`,
      ogImage: `${BASE_URL}/og-tekivex.png`,
      ogType: 'website',
      twitterTitle: 'Use Cases — Tekivex Product Guides & Deep Dives',
      twitterDescription: `${count} in-depth articles on the Tekivex product suite.`,
      twitterImage: `${BASE_URL}/og-tekivex.png`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Tekivex Use Cases',
        description: 'In-depth product guides, comparisons, and deep dives on the Tekivex developer-tools suite.',
        url: `${BASE_URL}/use-cases`,
        publisher: { '@type': 'Organization', name: 'Tekivex', url: BASE_URL },
      },
    };
  }

  if (route.startsWith('/use-cases/')) {
    const slug = route.slice('/use-cases/'.length).split('/')[0];
    const article = slug ? getArticle(slug) : undefined;
    if (article) {
      const title = `${article.title} | Tekivex`;
      const url = `${BASE_URL}${route}`;
      return {
        title,
        description: article.description,
        keywords: article.keywords,
        canonical: url,
        ogTitle: article.title,
        ogDescription: article.description,
        ogImage: `${BASE_URL}/og-tekivex.png`,
        ogType: 'article',
        twitterTitle: article.title,
        twitterDescription: article.description,
        twitterImage: `${BASE_URL}/og-tekivex.png`,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: article.title,
            description: article.description,
            url,
            author: (() => {
              const a = getAuthor(article.authorId);
              return a
                ? { '@type': 'Person', name: a.name, url: a.url, jobTitle: a.role, sameAs: a.sameAs }
                : { '@type': 'Organization', name: article.author, url: BASE_URL };
            })(),
            publisher: {
              '@type': 'Organization',
              name: 'Tekivex',
              url: BASE_URL,
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.svg` },
            },
            datePublished: article.datePublished,
            dateModified: article.dateModified,
            image: `${BASE_URL}/og-tekivex.png`,
            inLanguage: 'en',
            keywords: article.keywords.join(', '),
            about: { '@type': 'SoftwareApplication', name: article.productName, applicationCategory: 'DeveloperApplication' },
            isPartOf: { '@type': 'CollectionPage', name: 'Tekivex Use Cases', url: `${BASE_URL}/use-cases` },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Use Cases', item: `${BASE_URL}/use-cases` },
              { '@type': 'ListItem', position: 3, name: article.title, item: url },
            ],
          },
        ] as any,
      };
    }
  }

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
        keywords: [...product.tags, 'free', 'developer software', 'Tekivex', 'TypeScript'],
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
