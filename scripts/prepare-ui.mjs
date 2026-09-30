// Post-process the vendored Tekivex UI build (dist/ui) before it ships under
// www.tekivex.com/ui.
//
// AdSense rejected the site for "low value content". The upstream /ui build
// places the AdSense loader on every landing-router page (about, contact,
// legal, /docs/*, /examples/*, /blog/*), each of which exposes only ~60–100
// words of server-rendered text, while the ~150 substantial Starlight pages
// (/components/*, /recipes/*, /blueprints/*, …) are absent from /ui/sitemap.xml.
//
// This step, mirroring prepare-gridstorm.mjs, makes the vendored tree honest:
//   1. strips every AdSense loader / ad unit from /ui — no ads on any /ui page;
//   2. marks thin pages (below MIN_WORDS of visible text) noindex,follow;
//   3. regenerates /ui/sitemap.xml from the pages that remain indexable.
// Parsing only; the imported application code is never executed.
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const BASE = 'https://www.tekivex.com/ui';
// Vendored pages ship modern CSS jsdom's parser rejects; those warnings are noise.
const quiet = new VirtualConsole();
/** Pages with fewer visible words than this are application shells, not content. */
export const MIN_WORDS = 200;

const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

function* htmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.name.endsWith('.html')) yield file;
  }
}

/** Remove AdSense loader scripts, ad units and their push() calls from a document. */
export function stripAds(document) {
  let removed = 0;
  for (const node of document.querySelectorAll('script[src*="adsbygoogle"], script[src*="googlesyndication"], ins.adsbygoogle')) {
    node.remove();
    removed++;
  }
  for (const script of document.querySelectorAll('script:not([src])')) {
    if (/adsbygoogle/.test(script.textContent)) { script.remove(); removed++; }
  }
  return removed;
}

/** Count the words a reader (or crawler) sees in the initial HTML. */
export function visibleWords(document) {
  const clone = document.body?.cloneNode(true);
  if (!clone) return 0;
  for (const node of clone.querySelectorAll('script, style, noscript, template')) node.remove();
  return (clone.textContent || '').split(/\s+/).filter(Boolean).length;
}

function setRobots(document, content) {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function prepareUi(target) {
  const indexable = [];
  let adsRemoved = 0;
  let thin = 0;
  for (const file of htmlFiles(target)) {
    const rel = relative(target, file).split(sep).join('/');
    const dom = new JSDOM(readFileSync(file, 'utf8'), { virtualConsole: quiet });
    const { document } = dom.window;
    adsRemoved += stripAds(document);
    const isPage = rel.endsWith('/index.html') || rel === 'index.html';
    const words = visibleWords(document);
    if (!isPage || words < MIN_WORDS) {
      setRobots(document, 'noindex, follow');
      if (isPage) thin++;
    } else {
      const path = rel === 'index.html' ? '/' : '/' + rel.slice(0, -'index.html'.length);
      indexable.push(path);
    }
    writeFileSync(file, dom.serialize());
  }
  if (!indexable.length) throw new Error('Tekivex UI build contains no substantial pages; refusing to publish an empty sitemap');
  indexable.sort();
  writeFileSync(
    join(target, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable.map((p) => `<url><loc>${escape(BASE + p)}</loc></url>`).join('')}</urlset>`,
  );
  writeFileSync(
    join(target, 'sitemap-index.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${BASE}/sitemap.xml</loc></sitemap></sitemapindex>`,
  );
  // The upstream Astro sitemap lists the thin shells too; one sitemap is enough.
  const stale = join(target, 'sitemap-0.xml');
  if (existsSync(stale)) rmSync(stale);
  console.log(`Prepared /ui: removed ${adsRemoved} ad tags, noindexed ${thin} thin pages, ${indexable.length} pages in sitemap.`);
  return { adsRemoved, thin, indexable };
}
