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
//   2. marks thin pages (below MIN_WORDS of the page's own content, sidebar
//      excluded) and self-declared placeholder pages noindex,follow;
//   3. regenerates /ui/sitemap.xml from the pages that remain indexable;
//   4. repairs internal links: the upstream Starlight build is not configured
//      with the /ui base path, so its pages link to /components/x/ instead of
//      /ui/components/x/. Links that resolve under /ui are re-prefixed, known
//      renamed pages are redirected, and links that resolve nowhere (fake
//      demo URLs such as /2026/q2 inside a breadcrumb example) lose their href
//      so crawlers do not follow them into 404s;
//   5. gives pages that share a <title> distinct titles.
// Parsing only; the imported application code is never executed.
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const BASE = 'https://www.tekivex.com/ui';
// Vendored pages ship modern CSS jsdom's parser rejects; those warnings are noise.
const quiet = new VirtualConsole();
/**
 * Pages whose own content (sidebar, header and footer excluded) is shorter
 * than this are template stubs or application shells, not documentation.
 * Measured on the October 2026 build: 63 of 151 component pages fell below
 * it, each a generated stub (import line, demo heading, shared accessibility
 * bullets, source path). Code-heavy pages above it are real documentation.
 */
export const MIN_WORDS = 150;
/** Text that marks a page as an unfinished placeholder, whatever its length. */
export const PLACEHOLDER = /generated scaffold|will be replaced with hand-authored|lorem ipsum/i;

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

/**
 * The page's own content: the Starlight article body, else <main>, else the
 * body, with navigation, sidebars, headers, footers and scripts removed. The
 * sidebar alone lists ~150 links, so counting the whole body made every stub
 * look substantial.
 */
export function pageContent(document) {
  const root = document.querySelector('.sl-markdown-content') || document.querySelector('main') || document.body;
  if (!root) return '';
  const clone = root.cloneNode(true);
  for (const node of clone.querySelectorAll('script, style, noscript, template, nav, aside, header, footer')) node.remove();
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Count the words of a page's own content (see pageContent). */
export function visibleWords(document) {
  const text = pageContent(document);
  return text ? text.split(' ').length : 0;
}

/** Pages that moved upstream; the old path is still linked from other pages. */
const RENAMED = { '/ui/theme-builder/': '/ui/components/theme-builder/' };

/** True when a URL path is served by a real file in the built site. */
function existsIn(root, pathname) {
  const p = join(root, decodeURIComponent(pathname));
  if (existsSync(join(p, 'index.html'))) return true;
  return !pathname.endsWith('/') && existsSync(p) && statSync(p).isFile();
}

/**
 * Point every same-site link at a page that exists. Returns counts of
 * re-prefixed, renamed and neutralised links.
 * @param {Document} document
 * @param {string} target dist/ui directory
 * @param {string} pageUrl absolute URL of the page (for relative hrefs)
 */
export function repairLinks(document, target, pageUrl) {
  const root = join(target, '..');
  const counts = { prefixed: 0, renamed: 0, neutralised: 0 };
  for (const a of document.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (/^(#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let url;
    try { url = new URL(href, pageUrl); } catch { continue; }
    if (url.origin !== 'https://www.tekivex.com') continue;
    let path = url.pathname;
    if (existsIn(root, path)) continue;
    const suffix = url.search + url.hash;
    if (RENAMED[path] || RENAMED[path + '/']) {
      a.setAttribute('href', (RENAMED[path] || RENAMED[path + '/']) + suffix);
      counts.renamed++;
      continue;
    }
    if (!path.startsWith('/ui/')) {
      const prefixed = '/ui' + path;
      const withSlash = prefixed.endsWith('/') ? prefixed : prefixed + '/';
      if (existsIn(root, prefixed)) { a.setAttribute('href', prefixed + suffix); counts.prefixed++; continue; }
      if (existsIn(root, withSlash)) { a.setAttribute('href', withSlash + suffix); counts.prefixed++; continue; }
    }
    // Nothing to link to: keep the text, drop the navigation.
    a.removeAttribute('href');
    a.setAttribute('data-unlinked-href', href);
    counts.neutralised++;
  }
  return counts;
}

const SUFFIX = / \| TekiVex UI$/;
const humanize = (slug) => slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function setRobots(document, content) {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'robots');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export async function prepareUi(target) {
  const indexable = [];
  let adsRemoved = 0;
  let thin = 0;
  const links = { prefixed: 0, renamed: 0, neutralised: 0 };
  // Pre-scan titles so pages sharing one can be told apart.
  const files = [...htmlFiles(target)];
  const titleCount = new Map();
  for (const file of files) {
    const t = readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
    if (t) titleCount.set(t, (titleCount.get(t) || 0) + 1);
  }
  let retitled = 0;
  for (const file of files) {
    const rel = relative(target, file).split(sep).join('/');
    const dom = new JSDOM(readFileSync(file, 'utf8'), { virtualConsole: quiet });
    const { document } = dom.window;
    adsRemoved += stripAds(document);
    const pagePath = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
    for (const [k, v] of Object.entries(repairLinks(document, target, BASE + pagePath))) links[k] += v;
    const title = document.title.trim();
    if (titleCount.get(title) > 1 && rel.endsWith('/index.html')) {
      const slug = rel.split('/').at(-2);
      const base = title.replace(SUFFIX, '');
      document.title = `${base} — ${humanize(slug)}${SUFFIX.test(title) ? ' | TekiVex UI' : ''}`;
      retitled++;
    }
    const isPage = rel.endsWith('/index.html') || rel === 'index.html';
    const words = visibleWords(document);
    const placeholder = PLACEHOLDER.test(pageContent(document));
    if (!isPage || words < MIN_WORDS || placeholder) {
      setRobots(document, 'noindex, follow');
      if (isPage) thin++;
    } else {
      const path = rel === 'index.html' ? '/' : '/' + rel.slice(0, -'index.html'.length);
      indexable.push(path);
    }
    writeFileSync(file, dom.serialize());
    dom.window.close();
    // jsdom frees a closed window only once the event loop turns; yield so
    // ~180 parsed pages do not accumulate in memory.
    await new Promise((r) => setImmediate(r));
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
  console.log(`Prepared /ui: removed ${adsRemoved} ad tags, noindexed ${thin} thin pages, ${indexable.length} pages in sitemap; links: ${links.prefixed} re-prefixed, ${links.renamed} renamed, ${links.neutralised} unlinked; ${retitled} titles disambiguated.`);
  return { adsRemoved, thin, indexable, links, retitled };
}
