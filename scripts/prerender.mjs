// ─────────────────────────────────────────────────────────────────────────────
// tekivex.com prerender — for every real route in the site, emit a static
// HTML file with route-specific <title>, meta description, canonical, and a
// clean light-theme pre-hydration shell. Crawlers see content
// instantly; React then hydrates over it.
//
// We deliberately avoid trying to SSR the full React tree because some
// product pages load WebGL / AI runtimes that don't exist in Node.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

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

// ─── Shared tmp dir for compiling TS modules we read at build time ───────────
const TMP_DIR = join(DIST, '.prerender-tmp');
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Load the real product manifests (single source of truth) ───────────────
// We bundle the platform registry with esbuild so the prerendered HTML carries
// the exact same product copy — descriptions, stats, capabilities, tags — that
// the React app renders. This keeps crawlers (and the AdSense reviewer) from
// seeing a near-empty shell.
async function loadProducts() {
  const entry = join(ROOT, 'src', 'platform', 'registry.ts');
  const outPath = join(TMP_DIR, 'registry.platform.mjs');
  esbuild.buildSync({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'esnext',
    outfile: outPath,
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(outPath).href);
  return mod.getAllProducts();
}

const PRODUCTS = await loadProducts();

const STATUS_LABEL = {
  ga: 'Generally Available',
  beta: 'Beta',
  preview: 'Preview',
  'coming-soon': 'Coming Soon',
};

// Full, crawlable detail block for a single product page.
function productDetailBlock(p) {
  const stats = (p.stats || [])
    .map(
      (s) =>
        `<div style="flex:1;min-width:120px;text-align:center;padding:16px;background:#f8fafc;border:1px solid #e6e8ef;border-radius:10px"><div style="font-size:1.6rem;font-weight:800;color:#0a0f1f">${escapeHtml(s.value)}</div><div style="font-size:13px;color:#64748b">${escapeHtml(s.label)}</div></div>`,
    )
    .join('');
  const features = (p.keyFeatures || [])
    .map((f) => `<li style="margin-bottom:8px">${escapeHtml(f)}</li>`)
    .join('');
  const links = (p.quickLinks || [])
    .map(
      (l) =>
        `<li style="margin-bottom:6px"><a href="${escapeHtml(l.path)}" style="color:#3a86ff;text-decoration:none"${l.external ? ' rel="noopener noreferrer"' : ''}>${escapeHtml(l.label)}</a></li>`,
    )
    .join('');
  const tags = (p.tags || [])
    .map(
      (t) =>
        `<span style="display:inline-block;font-size:12px;color:#475569;background:#eef2f7;border:1px solid #e6e8ef;border-radius:999px;padding:4px 12px;margin:0 6px 6px 0">${escapeHtml(t)}</span>`,
    )
    .join('');
  return `
      <p style="font-size:13px;color:#64748b;margin:0 0 6px"><strong>${escapeHtml(STATUS_LABEL[p.status] || p.status)}</strong> · v${escapeHtml(p.version)} · MIT licensed</p>
      <p style="font-size:18px;line-height:1.6;color:#3a3a52;margin:0 0 16px">${escapeHtml(p.tagline)}</p>
      <p style="font-size:16px;line-height:1.78;color:#1f2937;margin:0 0 28px">${escapeHtml(p.description)}</p>
      ${stats ? `<div style="display:flex;flex-wrap:wrap;gap:12px;margin:0 0 32px">${stats}</div>` : ''}
      <h2 style="font-size:1.35rem;font-weight:800;color:#0a0f1f;margin:0 0 12px">Key capabilities</h2>
      <ul style="margin:0 0 32px;padding-left:20px;color:#1f2937;line-height:1.7">${features}</ul>
      ${links ? `<h2 style="font-size:1.35rem;font-weight:800;color:#0a0f1f;margin:0 0 12px">Resources &amp; quick links</h2><ul style="margin:0 0 32px;padding-left:20px">${links}</ul>` : ''}
      ${tags ? `<div style="margin:0 0 8px">${tags}</div>` : ''}`;
}

// Compact, crawlable card for catalogue/home pages.
function productCardBlock(p) {
  const features = (p.keyFeatures || [])
    .slice(0, 4)
    .map((f) => `<li style="margin-bottom:4px">${escapeHtml(f)}</li>`)
    .join('');
  return `
      <section style="border:1px solid #e6e8ef;border-radius:12px;padding:24px;margin:0 0 20px">
        <h2 style="font-size:1.4rem;font-weight:800;color:#0a0f1f;margin:0 0 4px"><a href="${escapeHtml(p.homePath)}" style="color:#0a0f1f;text-decoration:none">${escapeHtml(p.name)}</a> <span style="font-size:12px;font-weight:600;color:#64748b">${escapeHtml(STATUS_LABEL[p.status] || p.status)}</span></h2>
        <p style="font-size:15px;color:#475569;margin:0 0 8px">${escapeHtml(p.tagline)}</p>
        <p style="font-size:15px;line-height:1.7;color:#1f2937;margin:0 0 12px">${escapeHtml(p.description)}</p>
        <ul style="margin:0 0 12px;padding-left:20px;color:#334155;line-height:1.6;font-size:14px">${features}</ul>
        <a href="${escapeHtml(p.homePath)}" style="color:#3a86ff;text-decoration:none;font-weight:600">Explore ${escapeHtml(p.name)} →</a>
      </section>`;
}

const productCatalogBlock = PRODUCTS.map(productCardBlock).join('');

// ─── Routes ────────────────────────────────────────────────────────────────
const products = PRODUCTS.map((p) => ({ id: p.id, name: p.name, tagline: p.tagline, manifest: p }));

const routes = [
  {
    path: '/',
    title: 'Tekivex — Open-Source Enterprise Developer Tools Platform',
    description:
      'Tekivex is an open-source enterprise developer tools platform. GridStorm data grid, Pyntra browser PDF editor, Analytics Studio BI, DataFlow streaming, Quantum Vault, and TekiVex UI components — all MIT-licensed, free forever, accessibility-first.',
    h1: 'Tekivex — open-source enterprise developer tools',
    body:
      'Tekivex groups several React-focused open-source products under one roof: GridStorm, Analytics Studio, DataFlow, Quantum Vault, and TekiVex UI. Every package is MIT-licensed, fully typed in TypeScript, and free for commercial use.',
    contentHtml: `<h2 style="font-size:1.5rem;font-weight:800;color:#0a0f1f;margin:32px 0 16px">The Tekivex product suite</h2>${productCatalogBlock}`,
  },
  {
    path: '/products',
    title: 'Tekivex products — Data grid, charts, streaming, PDF, components',
    description:
      'Browse Tekivex products: GridStorm React data grid, Pyntra browser PDF editor, Analytics Studio BI, DataFlow streaming engine, Quantum Vault, and TekiVex UI component library. All open source.',
    h1: 'Tekivex products',
    body:
      'A unified catalog of every Tekivex product — data grid, charts, streaming, PDF, components. All open source under the MIT license, all production-tested.',
    contentHtml: productCatalogBlock,
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
  {
    path: '/use-cases',
    title: 'Use Cases — Product Guides, Comparisons & Deep Dives | Tekivex',
    description:
      'In-depth articles on the Tekivex product suite — GridStorm, Pyntra, Analytics Studio, DataFlow, Quantum Vault, and Tekivex UI. Architecture deep dives, migration guides, and real-world use cases by the Tekivex Engineering team.',
    h1: 'Tekivex use cases',
    body:
      'Product guides, comparisons, and engineering deep dives across the Tekivex suite — how each library works, how to put it to work, and how it compares to the alternatives.',
  },
  ...products.map((p) => ({
    path: `/product/${p.id}`,
    title: p.manifest.seo?.title || `${p.name} — Tekivex`,
    description: p.manifest.seo?.description || p.tagline,
    h1: p.name,
    body: p.tagline,
    contentHtml: productDetailBlock(p.manifest),
  })),
];

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
      ${route.contentHtml || ''}
      <p style="color:#64748b;font-size:13px;border-top:1px solid #e6e8ef;padding-top:20px;margin-top:32px">Tekivex · open-source enterprise developer tools · MIT licensed · <a href="/products" style="color:#3a86ff;text-decoration:none">Products</a> · <a href="/use-cases" style="color:#3a86ff;text-decoration:none">Use Cases</a> · <a href="/about" style="color:#3a86ff;text-decoration:none">About</a> · <a href="https://ui.tekivex.com" style="color:#3a86ff;text-decoration:none">TekiVex UI</a></p>
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

// ─── Use-Cases articles ────────────────────────────────────────────────────
// Compile the article registry (TS) so we read the same metadata the app uses,
// then server-render each article's full markdown so crawlers and AI agents see
// the real content without executing JavaScript.
async function loadArticles() {
  const srcPath = join(ROOT, 'src', 'content', 'registry.ts');
  const src = readFileSync(srcPath, 'utf8');
  const transformed = esbuild.transformSync(src, { loader: 'ts', format: 'esm', target: 'esnext' }).code;
  const outPath = join(TMP_DIR, 'registry.mjs');
  writeFileSync(outPath, transformed, 'utf8');
  const mod = await import(pathToFileURL(outPath).href);
  return mod.ARTICLES;
}

function articleHtml(article, contentHtml) {
  const path = `/use-cases/${article.slug}`;
  const url = `${ORIGIN}${path}`;
  const title = `${article.title} | Tekivex`;
  const description = article.description;

  let html = baseHtml;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  if (/<link\s+rel="canonical"/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${url}" />\n</head>`);
  }
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(article.title)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/, `<meta property="og:type" content="article" />`);
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(article.title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    url,
    author: { '@type': 'Organization', name: article.author, url: ORIGIN },
    publisher: { '@type': 'Organization', name: 'Tekivex', url: ORIGIN, logo: { '@type': 'ImageObject', url: `${ORIGIN}/logo.svg` } },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: `${ORIGIN}/og-tekivex.png`,
    inLanguage: 'en',
    keywords: (article.keywords || []).join(', '),
    about: { '@type': 'SoftwareApplication', name: article.productName, applicationCategory: 'DeveloperApplication' },
    isPartOf: { '@type': 'CollectionPage', name: 'Tekivex Use Cases', url: `${ORIGIN}/use-cases` },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tekivex', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Use Cases', item: `${ORIGIN}/use-cases` },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  };
  html = html.replace(
    '</head>',
    `    <script type="application/ld+json">${JSON.stringify(articleLd)}</script>\n` +
    `    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>\n  </head>`,
  );

  const ssr = `
    <article style="max-width:760px;margin:0 auto;padding:56px 24px 96px;color:#1a1f2e;font:16px/1.78 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <nav aria-label="Breadcrumb" style="font-size:13px;color:#64748b;margin-bottom:20px">
        <a href="/" style="color:#3a86ff;text-decoration:none">Tekivex</a> &nbsp;›&nbsp;
        <a href="/use-cases" style="color:#3a86ff;text-decoration:none">Use Cases</a> &nbsp;›&nbsp;
        <span>${escapeHtml(article.productName)}</span>
      </nav>
      <h1 style="font-size:2.2rem;font-weight:800;letter-spacing:-0.02em;color:#0a0f1f;margin:0 0 12px;line-height:1.18">${escapeHtml(article.title)}</h1>
      <p style="color:#475569;font-size:18px;line-height:1.6;margin:0 0 12px">${escapeHtml(article.description)}</p>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 28px">By ${escapeHtml(article.author)} · ${escapeHtml(article.readingMinutes + ' min read')}</p>
      <div class="uc-article-body" style="font-size:16px;line-height:1.78;color:#1f2937">
        ${contentHtml}
      </div>
      <hr style="margin:44px 0 24px;border:none;border-top:1px solid #e6e8ef" />
      <p style="color:#64748b;font-size:13px">
        Part of <a href="/use-cases" style="color:#3a86ff;text-decoration:none">Tekivex use cases</a>.
        Explore our <a href="/products" style="color:#3a86ff;text-decoration:none">open-source products</a>.
      </p>
    </article>`;
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${ssr}</div>`);
  return html;
}

const CONTENT_DIR = join(ROOT, 'public', 'use-cases', 'content');
const articleRoutes = [];
let articleCount = 0;
let articleSkipped = 0;
const articles = await loadArticles();
for (const article of articles) {
  const mdPath = join(CONTENT_DIR, article.contentFile);
  if (!existsSync(mdPath)) {
    console.warn(`  ⚠ missing article markdown: ${article.contentFile}`);
    articleSkipped++;
    continue;
  }
  const md = readFileSync(mdPath, 'utf8');
  const contentHtml = marked.parse(md);
  const dir = join(DIST, 'use-cases', article.slug);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), articleHtml(article, contentHtml), 'utf8');
  articleRoutes.push({
    path: `/use-cases/${article.slug}`,
    title: article.title,
    description: article.description,
    category: article.productName,
    pubDate: new Date(`${article.datePublished}T00:00:00Z`),
  });
  articleCount++;
}
try { rmSync(TMP_DIR, { recursive: true, force: true }); } catch {}

// Enrich the /use-cases hub shell with a real, crawlable list of every article
// (grouped by product) so crawlers and AI agents discover the content without JS.
{
  const hubFile = join(DIST, 'use-cases', 'index.html');
  if (existsSync(hubFile) && articleRoutes.length) {
    const byProduct = new Map();
    for (const r of articleRoutes) {
      if (!byProduct.has(r.category)) byProduct.set(r.category, []);
      byProduct.get(r.category).push(r);
    }
    let list = '';
    for (const [product, items] of byProduct) {
      list += `<h2 style="font-size:1.25rem;font-weight:800;color:#0a0f1f;margin:32px 0 12px">${escapeHtml(product)}</h2><ul style="margin:0 0 8px;padding-left:20px">`;
      for (const it of items) {
        list += `<li style="margin-bottom:8px"><a href="${it.path}" style="color:#3a86ff;text-decoration:none">${escapeHtml(it.title)}</a> — <span style="color:#475569">${escapeHtml(it.description)}</span></li>`;
      }
      list += `</ul>`;
    }
    let hubHtml = readFileSync(hubFile, 'utf8');
    hubHtml = hubHtml.replace('</main>', `${list}</main>`);
    writeFileSync(hubFile, hubHtml, 'utf8');
  }
}

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
  '\n' +
  articleRoutes
    .map((r) => {
      const url = `${ORIGIN}${r.path}`;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <xhtml:link rel="alternate" hreflang="en" href="${url}"/>\n  </url>`;
    })
    .join('\n') +
  `\n  <url>\n    <loc>https://ui.tekivex.com/</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>` +
  `\n</urlset>\n`;

// ─── RSS feed for the use-cases hub (freshness signal) ───────────────────
const rssXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
  `  <channel>\n` +
  `    <title>Tekivex Use Cases</title>\n` +
  `    <link>${ORIGIN}/use-cases</link>\n` +
  `    <description>Product guides, comparisons, and engineering deep dives on the Tekivex developer-tools suite.</description>\n` +
  `    <language>en-us</language>\n` +
  `    <lastBuildDate>${NOW_RFC}</lastBuildDate>\n` +
  `    <atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />\n` +
  articleRoutes
    .map((r) => {
      const link = `${ORIGIN}${r.path}`;
      return `    <item>\n      <title>${escapeHtml(r.title)}</title>\n      <link>${link}</link>\n      <guid isPermaLink="true">${link}</guid>\n      <description>${escapeHtml(r.description)}</description>\n      <category>${escapeHtml(r.category)}</category>\n      <pubDate>${r.pubDate.toUTCString()}</pubDate>\n    </item>`;
    })
    .join('\n') +
  `\n  </channel>\n</rss>\n`;

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

// ─── llms.txt / llms-full.txt (guide LLMs to the canonical facts) ─────────
// Generated from the same product facts + article list so they never drift.
const LLM_PRODUCTS = [
  { name: 'GridStorm', url: `${ORIGIN}/product/gridstorm`, npm: '@tekivex/gridstorm',
    s: 'Headless, framework-agnostic enterprise data grid. Virtual scrolling for 100K+ rows at 60fps, 42 Excel-compatible formula functions, Excel copy/paste, 35 composable plugins, WCAG 2.1 AA accessibility, React/Vue/Svelte/Angular adapters, <50KB core. MIT-licensed.' },
  { name: 'Pyntra', url: `${ORIGIN}/product/pyntra`, npm: '@pyntra/engine',
    s: 'Client-side, browser-native PDF editor with React headless hooks and a bring-your-own-UI adapter. Form filling, signing, stamping, annotation, redaction, and RC4/AES-128/AES-256 encryption — entirely in the browser with zero third-party PDF dependencies.' },
  { name: 'Analytics Studio', url: `${ORIGIN}/product/analytics-studio`, npm: null,
    s: 'Drag-and-drop business-intelligence builder powered by GridStorm. Pivot tables, 26+ chart types, an in-browser SQL engine (SELECT/WHERE/GROUP BY/JOIN), KPI dashboards, and scheduled reports — no backend required.' },
  { name: 'Quantum Vault', url: `${ORIGIN}/product/quantum-vault`, npm: '@tekivex/quantum-vault',
    s: 'Sovereign, self-hosted post-quantum token issuance, validation, and rotation using NIST-standardized CRYSTALS-Kyber (ML-KEM / FIPS 203) and CRYSTALS-Dilithium (ML-DSA / FIPS 204).' },
  { name: 'DataFlow', url: `${ORIGIN}/product/dataflow`, npm: null,
    s: 'Real-time streaming engine for React: WebSocket and Server-Sent Events sources, backpressure handling, time-travel replay, and anomaly detection.' },
  { name: 'Tekivex UI', url: `${ORIGIN}/product/tekivex-ui`, npm: 'tekivex-ui',
    s: 'Accessible React/Vue/Svelte component library: 50+ components, WCAG 2.1 AA, dark/light/high-contrast themes via CSS custom properties, tree-shakeable ESM, zero runtime dependencies, headless primitives. MIT-licensed.' },
];
const LLM_INTRO =
  'Tekivex is an open-source platform of MIT-licensed enterprise developer tools for JavaScript and TypeScript. ' +
  'Every product is free for commercial use, framework-agnostic, accessibility-first, and production-tested. ' +
  'Built and maintained by the Tekivex Engineering team. Official site: ' + ORIGIN + '.';

const llmsTxt = [
  '# Tekivex', '',
  '> ' + LLM_INTRO, '',
  '## Products',
  ...LLM_PRODUCTS.map((p) => `- [${p.name}](${p.url})${p.npm ? ` (npm: \`${p.npm}\`)` : ''}: ${p.s}`),
  '',
  '## Guides & use cases',
  ...articleRoutes.map((r) => `- [${r.title}](${ORIGIN}${r.path}): ${r.description}`),
  '',
  '## More',
  `- [Use-cases hub](${ORIGIN}/use-cases): All product guides, comparisons, and deep dives.`,
  `- [About Tekivex](${ORIGIN}/about): Mission, values, and the open-source model.`,
  `- [FAQ](${ORIGIN}/faq): Licensing, commercial use, and contributing.`,
  '',
].join('\n');

const llmsFull = [
  '# Tekivex — full reference for LLMs', '',
  LLM_INTRO, '',
  'License: MIT (free for commercial use, modification, and redistribution; keep the copyright notice). ',
  'No enterprise tier, no paywall, no per-seat fees.', '',
  '## Products', '',
  ...LLM_PRODUCTS.flatMap((p) => [
    `### ${p.name}`,
    p.s,
    p.npm ? `Install: \`npm install ${p.npm}\`` : 'Install: see the product page.',
    `URL: ${p.url}`,
    '',
  ]),
  '## Articles by product', '',
  ...(() => {
    const order = [];
    const map = new Map();
    for (const r of articleRoutes) {
      if (!map.has(r.category)) { map.set(r.category, []); order.push(r.category); }
      map.get(r.category).push(r);
    }
    return order.flatMap((cat) => [
      `### ${cat}`,
      ...map.get(cat).map((r) => `- ${r.title} — ${r.description} (${ORIGIN}${r.path})`),
      '',
    ]);
  })(),
].join('\n');

writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');
writeFileSync(join(DIST, 'sitemap-index.xml'), sitemapIndex, 'utf8');
writeFileSync(join(DIST, 'humans.txt'), humans, 'utf8');
writeFileSync(join(DIST, 'feed.xml'), rssXml, 'utf8');
writeFileSync(join(DIST, 'llms.txt'), llmsTxt, 'utf8');
writeFileSync(join(DIST, 'llms-full.txt'), llmsFull, 'utf8');

// Mirror into public/ so vite dev serves them too
const pub = join(ROOT, 'public');
if (existsSync(pub)) {
  writeFileSync(join(pub, 'sitemap.xml'), sitemapXml, 'utf8');
  writeFileSync(join(pub, 'sitemap-index.xml'), sitemapIndex, 'utf8');
  writeFileSync(join(pub, 'humans.txt'), humans, 'utf8');
  writeFileSync(join(pub, 'llms.txt'), llmsTxt, 'utf8');
  writeFileSync(join(pub, 'llms-full.txt'), llmsFull, 'utf8');
}

const totalSitemapUrls = routes.length + articleRoutes.length + 1;
console.log(
  `✓ ${count} static routes + ${articleCount} use-case articles prerendered` +
  (articleSkipped ? ` (${articleSkipped} skipped — markdown missing)` : '') +
  `, sitemap.xml (${totalSitemapUrls} URLs), sitemap-index.xml, feed.xml, humans.txt`,
);
