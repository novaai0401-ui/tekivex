// ─────────────────────────────────────────────────────────────────────────────
// tekivex.com prerender — for every real route in the site, emit a static
// HTML file with route-specific <title>, meta description, canonical, and a
// clean light-theme pre-hydration shell. Crawlers see content
// instantly; React then hydrates over it.
//
// We deliberately avoid trying to SSR the full React tree because some
// product pages load WebGL / AI runtimes that don't exist in Node.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://tekivex.com';
const TODAY = new Date().toISOString().slice(0, 10);
const NOW_RFC = new Date().toUTCString();

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('✗ dist/index.html missing — run vite build first');
  process.exit(1);
}

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf8');

// ─── Routes ────────────────────────────────────────────────────────────────
const products = [
  { id: 'gridstorm',        name: 'GridStorm',        tagline: 'High-performance React data grid with 35+ plugins. MIT-licensed, free forever.' },
  { id: 'pyntra',           name: 'Pyntra',           tagline: 'Client-side PDF editor with React headless hooks — form filling, annotation, signing, AES-256.' },
  { id: 'analytics-studio', name: 'Analytics Studio', tagline: 'Drag-and-drop business intelligence with 26+ chart types and live data binding.' },
  { id: 'quantum-vault',    name: 'Quantum Vault',    tagline: 'Sovereign post-quantum tokens — CRYSTALS-Kyber + Dilithium, NIST-standardised.' },
  { id: 'dataflow',         name: 'DataFlow',         tagline: 'Real-time streaming engine for React with backpressure and replay.' },
  { id: 'tekivex-ui',       name: 'TekiVex UI',       tagline: 'Open-source React component library — 113 production-grade components, WCAG 2.1 AAA.' },
];

const routes = [
  {
    path: '/',
    title: 'Tekivex — Open-Source Enterprise Developer Tools Platform',
    description:
      'Tekivex is an open-source enterprise developer tools platform. GridStorm data grid, Pyntra browser PDF editor, Analytics Studio BI, DataFlow streaming, Quantum Vault, and TekiVex UI components — all MIT-licensed, free forever, accessibility-first.',
    h1: 'Tekivex — open-source enterprise developer tools',
    body:
      'Tekivex groups several React-focused open-source products under one roof: GridStorm, Analytics Studio, DataFlow, Quantum Vault, and TekiVex UI. Every package is MIT-licensed, fully typed in TypeScript, and free for commercial use.',
  },
  {
    path: '/products',
    title: 'Tekivex products — Data grid, charts, streaming, PDF, components',
    description:
      'Browse Tekivex products: GridStorm React data grid, Pyntra browser PDF editor, Analytics Studio BI, DataFlow streaming engine, Quantum Vault, and TekiVex UI component library. All open source.',
    h1: 'Tekivex products',
    body:
      'A unified catalog of every Tekivex product — data grid, charts, streaming, PDF, components. All open source under the MIT license, all production-tested.',
  },
  {
    path: '/about',
    title: 'About Tekivex — Open-source enterprise tools, MIT licensed',
    description:
      'Tekivex builds open-source enterprise developer tools that are free forever. Read about the platform, the mission, and the team behind GridStorm, Analytics Studio, DataFlow, and TekiVex UI.',
    h1: 'About Tekivex',
    body:
      'Tekivex is an independent open-source project that builds production-grade enterprise developer tools and releases them under the MIT license — no enterprise tier, no paywall, no per-seat pricing.',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy — Tekivex',
    description:
      'How Tekivex collects, uses, and protects information about visitors to tekivex.com and users of the open-source Tekivex products.',
    h1: 'Privacy Policy',
    body:
      'How Tekivex handles information about visitors to tekivex.com. Plain language, no dark patterns, only the third-party analytics needed to operate the site.',
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service — Tekivex',
    description:
      'Terms governing your use of tekivex.com and the open-source software and demos published by Tekivex.',
    h1: 'Terms of Service',
    body:
      'Plain-language Terms of Service for tekivex.com. Covers acceptable use, intellectual property, warranties, and limitation of liability.',
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy — Tekivex',
    description:
      'How Tekivex uses cookies and similar technologies for analytics and advertising, and how you can manage your consent at any time.',
    h1: 'Cookie Policy',
    body:
      'Tekivex uses a small set of cookies — essential, analytics, and advertising. Analytics and advertising cookies only load after you accept on the consent banner.',
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer — Tekivex',
    description:
      'Disclaimer for tekivex.com. Documentation is informational; product status badges describe maturity; advertisements support free content.',
    h1: 'Disclaimer',
    body:
      'Documentation and code samples on Tekivex are informational and reflect best practice at the time of writing. Always verify against authoritative sources before using in production.',
  },
  {
    path: '/contact',
    title: 'Contact Tekivex',
    description:
      'Reach the Tekivex team — email hello@tekivex.com, file a GitHub issue, or report a security disclosure privately.',
    h1: 'Contact',
    body:
      'Email hello@tekivex.com for general questions, or open a GitHub issue for bug reports and feature requests. Security disclosures go to the same email with a Security subject line.',
  },
  {
    path: '/faq',
    title: 'FAQ — Tekivex',
    description:
      'Frequently asked questions about Tekivex products, MIT licensing, demos, advertising, and cookies.',
    h1: 'Frequently Asked Questions',
    body:
      'Quick answers to common questions about Tekivex — what we build, how we make money, how to disable advertising, and how to contribute.',
  },
  ...products.map((p) => ({
    path: `/product/${p.id}`,
    title: `${p.name} — Tekivex`,
    description: p.tagline,
    h1: p.name,
    body: p.tagline,
  })),
];

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function makeHtml(route) {
  let html = baseHtml;
  const url = `${ORIGIN}${route.path}`;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);

  // description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
  );

  // canonical
  if (/<link\s+rel="canonical"/i.test(html)) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${url}" />`,
    );
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${url}" />\n</head>`);
  }

  // og:title / og:url / og:description
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
  );

  // SSR shell — clean / professional / light. The React app hydrates on top.
  const ssr = `
    <main style="max-width:780px;margin:0 auto;padding:64px 24px;color:#1a1f2e;font:16px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <nav aria-label="Breadcrumb" style="font-size:13px;color:#64748b;margin-bottom:24px"><a href="/" style="color:#3a86ff;text-decoration:none">Tekivex</a></nav>
      <h1 style="font-size:2.4rem;font-weight:800;letter-spacing:-0.025em;color:#0a0f1f;margin:0 0 12px;line-height:1.15">${escapeHtml(route.h1)}</h1>
      <p style="color:#3a3a52;font-size:18px;line-height:1.6;margin:0 0 24px">${escapeHtml(route.body)}</p>
      <p style="color:#64748b;font-size:13px;border-top:1px solid #e6e8ef;padding-top:20px">Tekivex · open-source enterprise developer tools · MIT licensed · <a href="/products" style="color:#3a86ff;text-decoration:none">Products</a> · <a href="/about" style="color:#3a86ff;text-decoration:none">About</a> · <a href="https://ui.tekivex.com" style="color:#3a86ff;text-decoration:none">TekiVex UI</a></p>
    </main>`;
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${ssr}</div>`);

  // BreadcrumbList JSON-LD per route
  const crumbs = [{ name: 'Tekivex', item: ORIGIN }];
  if (route.path !== '/') {
    const parts = route.path.split('/').filter(Boolean);
    let acc = '';
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      // The bare "/product" segment is not a navigable page — the catalogue
      // lives at "/products". Remap the intermediate crumb so the breadcrumb
      // never points crawlers at a 404.
      if (p === 'product' && i < parts.length - 1) {
        acc += '/' + p;
        crumbs.push({ name: 'Products', item: ORIGIN + '/products' });
        continue;
      }
      acc += '/' + p;
      crumbs.push({ name: p.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), item: ORIGIN + acc });
    }
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
  };
  html = html.replace(
    '</head>',
    `    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>\n  </head>`,
  );

  return html;
}

let count = 0;
for (const route of routes) {
  const dir = route.path === '/' ? DIST : join(DIST, route.path.replace(/^\//, ''));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), makeHtml(route), 'utf8');
  count++;
}

// Emit dist/404.html for crawlers / static hosts that serve it on misses.
const notFoundRoute = {
  path: '/404',
  title: 'Page not found — Tekivex',
  description: 'The page you are looking for does not exist on tekivex.com.',
  h1: 'Page not found',
  body: 'The page you requested does not exist. Try the Products or About pages.',
};
let notFoundHtml = makeHtml(notFoundRoute);
notFoundHtml = notFoundHtml.replace(
  /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
  '<meta name="robots" content="noindex, follow" />',
);
writeFileSync(join(DIST, '404.html'), notFoundHtml, 'utf8');

// ─── Sitemap (real URLs, hreflang, image extension) ──────────────────────
const sitemapXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n` +
  `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  routes
    .map((r) => {
      const url = `${ORIGIN}${r.path}`;
      const priority = r.path === '/' ? '1.0' : r.path.startsWith('/product/') ? '0.85' : '0.7';
      const changefreq = r.path === '/' || r.path === '/products' ? 'weekly' : r.path === '/privacy-policy' ? 'yearly' : 'monthly';
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <xhtml:link rel="alternate" hreflang="en" href="${url}"/>\n  </url>`;
    })
    .join('\n') +
  `\n  <url>\n    <loc>https://ui.tekivex.com/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>` +
  `\n</urlset>\n`;

const sitemapIndex =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `  <sitemap>\n    <loc>${ORIGIN}/sitemap.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n` +
  `  <sitemap>\n    <loc>https://ui.tekivex.com/sitemap.xml</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>\n` +
  `</sitemapindex>\n`;

const humans = [
  '/* TEAM */',
  '  Project: Tekivex',
  '  Site:    https://tekivex.com',
  '  Docs:    https://ui.tekivex.com',
  '',
  '/* PRODUCTS */',
  '  GridStorm        — high-performance React data grid',
  '  Analytics Studio — drag-and-drop BI with 26+ charts',
  '  DataFlow         — real-time streaming engine',
  '  Quantum Vault    — sovereign post-quantum tokens',
  '  Pyntra           — browser-native PDF editor with headless React hooks',
  '  TekiVex UI       — React component library (113 components)',
  '',
  '/* SITE */',
  `  Last update: ${TODAY}`,
  '  Standards: HTML5, CSS3, ES2022, WCAG 2.1 AAA',
  '  License: MIT',
  '',
].join('\n');

writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');
writeFileSync(join(DIST, 'sitemap-index.xml'), sitemapIndex, 'utf8');
writeFileSync(join(DIST, 'humans.txt'), humans, 'utf8');

// Mirror into public/ so vite dev serves them too
const pub = join(ROOT, 'public');
if (existsSync(pub)) {
  writeFileSync(join(pub, 'sitemap.xml'), sitemapXml, 'utf8');
  writeFileSync(join(pub, 'sitemap-index.xml'), sitemapIndex, 'utf8');
  writeFileSync(join(pub, 'humans.txt'), humans, 'utf8');
}

const totalSitemapUrls = routes.length + 1;
console.log(
  `✓ ${count} static routes prerendered, ` +
  `sitemap.xml (${totalSitemapUrls} URLs), sitemap-index.xml, humans.txt`,
);
