// ─────────────────────────────────────────────────────────────────────────────
// tekivex.com prerender — for every real route in the site, emit a static
// HTML file with route-specific <title>, meta description, canonical, and a
// clean light-theme pre-hydration shell. Crawlers see content
// instantly; React then hydrates over it.
//
// We deliberately avoid trying to SSR the full React tree because some
// product pages load WebGL / AI runtimes that don't exist in Node.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';
import { marked } from 'marked';

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
  { id: 'analytics-studio', name: 'Analytics Studio', tagline: 'Drag-and-drop business intelligence with 26+ chart types and live data binding.' },
  { id: 'pdf-toolkit',      name: 'PDF Toolkit',      tagline: 'WASM-based PDF renderer for the browser. No Puppeteer, no headless Chrome.' },
  { id: 'dataflow',         name: 'DataFlow',         tagline: 'Real-time streaming engine for React with backpressure and replay.' },
  { id: 'tekivex-ui',       name: 'TekiVex UI',       tagline: 'Open-source React component library — 113 production-grade components, WCAG 2.1 AAA.' },
];

const tutorialCategories = [
  { id: 'ai-ml',                title: 'AI & Machine Learning' },
  { id: 'ai-ml-transformers',   title: 'Transformers & Large Language Models' },
  { id: 'ai-ml-training',       title: 'Training, Optimization & Deployment' },
  { id: 'ai-ml-agents',         title: 'AI Agents & Multi-Agent Systems' },
  { id: 'ai-nlp',               title: 'NLP & Language Models' },
  { id: 'ai-langchain',         title: 'LangChain, LangGraph & Vector DBs' },
  { id: 'ai-speech',            title: 'Speech Recognition & LLM Engineering' },
  { id: 'ai-ethics',            title: 'AI Ethics & Regulation' },
  { id: 'system-design',        title: 'System Design' },
  { id: 'software-architecture',title: 'Software Architecture' },
  { id: 'frontend-patterns',    title: 'Frontend Patterns' },
  { id: 'backend-patterns',     title: 'Backend Patterns' },
];

const routes = [
  {
    path: '/',
    title: 'Tekivex — Open-Source Enterprise Developer Tools Platform',
    description:
      'Tekivex is an open-source enterprise developer tools platform. GridStorm data grid, Analytics Studio BI, DataFlow streaming, PDF Toolkit, and TekiVex UI components — all MIT-licensed, free forever, accessibility-first.',
    h1: 'Tekivex — open-source enterprise developer tools',
    body:
      'Tekivex groups several React-focused open-source products under one roof: GridStorm, Analytics Studio, DataFlow, PDF Toolkit, and TekiVex UI. Every package is MIT-licensed, fully typed in TypeScript, and free for commercial use.',
  },
  {
    path: '/products',
    title: 'Tekivex products — Data grid, charts, streaming, PDF, components',
    description:
      'Browse Tekivex products: GridStorm React data grid, Analytics Studio BI, DataFlow streaming engine, PDF Toolkit, and TekiVex UI component library. All open source.',
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
      'Terms governing your use of tekivex.com and the open-source software, tutorials, and demos published by Tekivex.',
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
      'Disclaimer for tekivex.com. Tutorials are educational; product status badges describe maturity; advertisements support free content.',
    h1: 'Disclaimer',
    body:
      'Tutorials on Tekivex are educational and reflect best practice at the time of writing. Always verify against authoritative sources before using in production.',
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
      'Frequently asked questions about Tekivex products, MIT licensing, demos, advertising, cookies, and contributing tutorials.',
    h1: 'Frequently Asked Questions',
    body:
      'Quick answers to common questions about Tekivex — what we build, how we make money, how to disable advertising, and how to contribute.',
  },
  {
    path: '/tutorials',
    title: 'Tekivex tutorials — System design, AI/ML, software architecture',
    description:
      'In-depth tutorials covering system design, software architecture, AI/ML, transformers, LangChain, frontend and backend patterns. Free, open-source, kept current.',
    h1: 'Tekivex tutorials',
    body:
      'A curated catalog of in-depth tutorials covering system design, software architecture, design patterns, AI/ML, transformers, LangChain, vector databases, and more. Updated monthly.',
  },
  ...products.map((p) => ({
    path: `/product/${p.id}`,
    title: `${p.name} — Tekivex`,
    description: p.tagline,
    h1: p.name,
    body: p.tagline,
  })),
  ...tutorialCategories.map((c) => ({
    path: `/tutorials/${c.id}`,
    title: `${c.title} — Tekivex tutorials`,
    description: `In-depth ${c.title} tutorials on Tekivex. Free, open-source, written by practitioners.`,
    h1: c.title,
    body: `Tekivex ${c.title} tutorial track — practical, deep, and current.`,
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
      <p style="color:#64748b;font-size:13px;border-top:1px solid #e6e8ef;padding-top:20px">Tekivex · open-source enterprise developer tools · MIT licensed · <a href="/products" style="color:#3a86ff;text-decoration:none">Products</a> · <a href="/tutorials" style="color:#3a86ff;text-decoration:none">Tutorials</a> · <a href="/about" style="color:#3a86ff;text-decoration:none">About</a> · <a href="https://ui.tekivex.com" style="color:#3a86ff;text-decoration:none">TekiVex UI</a></p>
    </main>`;
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${ssr}</div>`);

  // BreadcrumbList JSON-LD per route
  const crumbs = [{ name: 'Tekivex', item: ORIGIN }];
  if (route.path !== '/') {
    const parts = route.path.split('/').filter(Boolean);
    let acc = '';
    for (const p of parts) {
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
  body: 'The page you requested does not exist. Try the Products, Tutorials, or About pages.',
};
let notFoundHtml = makeHtml(notFoundRoute);
notFoundHtml = notFoundHtml.replace(
  /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
  '<meta name="robots" content="noindex, follow" />',
);
writeFileSync(join(DIST, '404.html'), notFoundHtml, 'utf8');

// ─── Per-topic tutorial prerendering ──────────────────────────────────────
// Tutorial topic markdown lives in public/tutorials/content/<cat>/<slug>.md
// and topic metadata lives in src/tutorials/data/<cat>.ts. We compile the .ts
// files via esbuild, import them, then emit a fully rendered HTML page for
// every topic so crawlers see the actual editorial content, not just a SPA
// shell with a category landing page.
const DATA_DIR = join(ROOT, 'src', 'tutorials', 'data');
const TUTORIAL_CONTENT = join(ROOT, 'public', 'tutorials', 'content');
const TMP_DIR = join(DIST, '.prerender-tmp');
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

// Source of truth: only the categories actually wired into the live registry
// (src/tutorials/registry.ts). Legacy/orphan .ts files in the data folder use
// an older inline-content format and are not surfaced in the app — skip them.
const REGISTERED_CATEGORIES = [
  'system-design',
  'software-architecture',
  'frontend-patterns',
  'backend-patterns',
  'ai-ml',
  'ai-ml-transformers',
  'ai-ml-training',
  'ai-ml-agents',
  'ai-nlp',
  'ai-langchain',
  'ai-speech',
  'ai-ethics',
];
const categoryIds = REGISTERED_CATEGORIES.filter((id) =>
  existsSync(join(DATA_DIR, `${id}.ts`)),
);

async function loadCategoryData(catId) {
  const srcPath = join(DATA_DIR, `${catId}.ts`);
  const src = readFileSync(srcPath, 'utf8');
  // Strip the `import type` line — it has no runtime effect and references a
  // path that won't resolve from the temp file's location.
  const cleaned = src.replace(/^\s*import\s+type[^;]+;\s*$/m, '');
  const transformed = esbuild.transformSync(cleaned, {
    loader: 'ts',
    format: 'esm',
    target: 'esnext',
  }).code;
  const outPath = join(TMP_DIR, `${catId}.mjs`);
  writeFileSync(outPath, transformed, 'utf8');
  const mod = await import(pathToFileURL(outPath).href);
  return mod.default;
}

function topicHtml({ category, section, topic, contentHtml }) {
  const path = `/tutorials/${category.id}/${topic.slug}`;
  const url = `${ORIGIN}${path}`;
  const title = `${topic.title} — ${category.title} | Tekivex tutorials`;
  const description = topic.description;

  let html = baseHtml;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  if (/<link\s+rel="canonical"/i.test(html)) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${url}" />`,
    );
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${url}" />\n</head>`);
  }
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: topic.title,
    description: topic.description,
    url,
    keywords: (topic.keywords || []).join(', '),
    inLanguage: 'en',
    isPartOf: { '@type': 'CreativeWorkSeries', name: category.title, url: `${ORIGIN}/tutorials/${category.id}` },
    publisher: { '@type': 'Organization', name: 'Tekivex', url: ORIGIN },
    datePublished: TODAY,
    dateModified: TODAY,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Tekivex', item: ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Tutorials', item: `${ORIGIN}/tutorials` },
      { '@type': 'ListItem', position: 3, name: category.title, item: `${ORIGIN}/tutorials/${category.id}` },
      { '@type': 'ListItem', position: 4, name: topic.title, item: url },
    ],
  };
  html = html.replace(
    '</head>',
    `    <script type="application/ld+json">${JSON.stringify(articleLd)}</script>\n` +
    `    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>\n  </head>`,
  );

  const meta = [
    topic.difficulty ? `${topic.difficulty[0].toUpperCase()}${topic.difficulty.slice(1)}` : null,
    topic.estimatedMinutes ? `${topic.estimatedMinutes} min read` : null,
  ].filter(Boolean).join(' · ');

  const ssr = `
    <article style="max-width:780px;margin:0 auto;padding:56px 24px 96px;color:#1a1f2e;font:16px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <nav aria-label="Breadcrumb" style="font-size:13px;color:#64748b;margin-bottom:20px">
        <a href="/" style="color:#3a86ff;text-decoration:none">Tekivex</a>
        &nbsp;›&nbsp;
        <a href="/tutorials" style="color:#3a86ff;text-decoration:none">Tutorials</a>
        &nbsp;›&nbsp;
        <a href="/tutorials/${escapeHtml(category.id)}" style="color:#3a86ff;text-decoration:none">${escapeHtml(category.title)}</a>
      </nav>
      <h1 style="font-size:2.2rem;font-weight:800;letter-spacing:-0.02em;color:#0a0f1f;margin:0 0 8px;line-height:1.2">${escapeHtml(topic.title)}</h1>
      <p style="color:#475569;font-size:17px;line-height:1.55;margin:0 0 8px">${escapeHtml(topic.description)}</p>
      ${meta ? `<p style="color:#94a3b8;font-size:13px;margin:0 0 28px">${escapeHtml(meta)}</p>` : ''}
      <div class="tkx-article-body" style="font-size:16px;line-height:1.75;color:#1f2937">
        ${contentHtml}
      </div>
      <hr style="margin:48px 0 24px;border:none;border-top:1px solid #e6e8ef" />
      <p style="color:#64748b;font-size:13px">
        Part of the <a href="/tutorials/${escapeHtml(category.id)}" style="color:#3a86ff;text-decoration:none">${escapeHtml(category.title)}</a> series on Tekivex.
        Browse all <a href="/tutorials" style="color:#3a86ff;text-decoration:none">tutorials</a> or
        explore our <a href="/products" style="color:#3a86ff;text-decoration:none">open-source products</a>.
      </p>
    </article>`;
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${ssr}</div>`);
  return html;
}

const topicRoutes = [];
let topicCount = 0;
let topicSkipped = 0;
for (const catId of categoryIds) {
  const category = await loadCategoryData(catId);
  for (const section of category.sections || []) {
    for (const topic of section.topics || []) {
      if (!topic.contentFile) {
        console.warn(`  ⚠ topic without contentFile: ${category.id}/${topic.slug}`);
        topicSkipped++;
        continue;
      }
      const mdPath = join(TUTORIAL_CONTENT, topic.contentFile);
      if (!existsSync(mdPath)) {
        console.warn(`  ⚠ missing markdown: ${topic.contentFile}`);
        topicSkipped++;
        continue;
      }
      const md = readFileSync(mdPath, 'utf8');
      const contentHtml = marked.parse(md);
      const html = topicHtml({ category, section, topic, contentHtml });
      const dir = join(DIST, 'tutorials', category.id, topic.slug);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html, 'utf8');
      topicRoutes.push({
        path: `/tutorials/${category.id}/${topic.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
      });
      topicCount++;
    }
  }
}

// Clean up the tmp dir used for compiled TS data modules.
try { rmSync(TMP_DIR, { recursive: true, force: true }); } catch {}

// ─── Sitemap (real URLs, hreflang, image extension) ──────────────────────
const sitemapXml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n` +
  `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  routes
    .map((r) => {
      const url = `${ORIGIN}${r.path}`;
      const priority = r.path === '/' ? '1.0' : r.path.startsWith('/product/') ? '0.85' : r.path.startsWith('/tutorials/') ? '0.75' : '0.7';
      const changefreq = r.path === '/' || r.path === '/products' || r.path === '/tutorials' ? 'weekly' : r.path === '/privacy-policy' ? 'yearly' : 'monthly';
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n    <xhtml:link rel="alternate" hreflang="en" href="${url}"/>\n  </url>`;
    })
    .join('\n') +
  '\n' +
  topicRoutes
    .map((r) => {
      const url = `${ORIGIN}${r.path}`;
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n    <xhtml:link rel="alternate" hreflang="en" href="${url}"/>\n  </url>`;
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
  '  PDF Toolkit      — WASM-based PDF renderer',
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

const totalSitemapUrls = routes.length + topicRoutes.length + 1;
console.log(
  `✓ ${count} static routes + ${topicCount} tutorial topics prerendered` +
  (topicSkipped ? ` (${topicSkipped} skipped — markdown missing)` : '') +
  `, sitemap.xml (${totalSitemapUrls} URLs), sitemap-index.xml, humans.txt`,
);
