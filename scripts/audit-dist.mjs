#!/usr/bin/env node
// Post-build quality gate for the complete www.tekivex.com tree (marketing
// site + vendored apps). Runs after fetch-apps.mjs so it sees exactly what
// will be deployed, and exits non-zero on any of:
//
//   • a sitemap URL with no file, no <title>, no meta description, no
//     canonical, a noindex directive, or fewer than MIN_WORDS visible words;
//   • two sitemap pages sharing a <title>;
//   • a same-site link, on any sitemap page, to a path that is neither a
//     file, a configured redirect, nor an app route served by a rewrite;
//   • AdSense loader or ad-unit markup in any HTML file outside ADS_ALLOWED.
//
// AdSense rejected the site for low-value content; each check above is a
// regression of a fix made for that review. Usage: node scripts/audit-dist.mjs [distDir]
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

export const ORIGIN = 'https://www.tekivex.com';
export const MIN_WORDS = 250;
/** Path prefixes whose prerendered HTML may carry ad markup (long-form editorial). */
export const ADS_ALLOWED = ['/use-cases/', '/product/'];
const quiet = new VirtualConsole();

function* htmlFiles(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(f);
    else if (e.name.endsWith('.html')) yield f;
  }
}

/** Resolve a URL path to the file Render would serve, or null. */
export function fileFor(dist, pathname) {
  const p = join(dist, decodeURIComponent(pathname));
  if (existsSync(join(p, 'index.html'))) return join(p, 'index.html');
  if (!pathname.endsWith('/') && existsSync(p) && statSync(p).isFile()) return p;
  if (!pathname.endsWith('/') && existsSync(p + '.html')) return p + '.html';
  return null;
}

/** Redirect sources and app rewrite prefixes from render.yaml. */
export function routing(renderYaml) {
  const redirects = new Set([...renderYaml.matchAll(/type:\s*redirect\s+source:\s*(\S+)/g)].map((m) => m[1].replace(/\/$/, '')));
  // /ui/* is a catch-all for the landing SPA; every real /ui page is a static
  // file, so a link that only resolves through it is a soft 404.
  const rewrites = [...renderYaml.matchAll(/type:\s*rewrite\s+source:\s*(\S+)/g)]
    .map((m) => m[1].replace(/\*$/, ''))
    .filter((p) => p !== '/ui/');
  return { redirects, rewrites };
}

export async function audit(dist) {
  const failures = [];
  const fail = (kind, where, detail) => failures.push({ kind, where, detail });
  const renderYaml = existsSync(join(dist, '..', 'render.yaml')) ? readFileSync(join(dist, '..', 'render.yaml'), 'utf8') : '';
  const { redirects, rewrites } = routing(renderYaml);
  const resolves = (path) => fileFor(dist, path) || redirects.has(path.replace(/\/$/, '')) || rewrites.some((r) => path.startsWith(r));

  const sitemaps = ['sitemap.xml', 'ui/sitemap.xml', 'gridstorm/sitemap.xml', 'analytics/sitemap.xml', 'dataflow/sitemap.xml']
    .map((s) => join(dist, s)).filter(existsSync);
  const titles = new Map();
  let pages = 0;
  for (const map of sitemaps) {
    for (const [, loc] of readFileSync(map, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = new URL(loc);
      const where = url.pathname;
      if (url.origin !== ORIGIN || url.hash) { fail('sitemap-url', where, loc); continue; }
      const file = fileFor(dist, url.pathname);
      if (!file) { fail('sitemap-missing', where, relative(dist, map)); continue; }
      pages++;
      // Scripts and styles are never inspected here; dropping them before
      // parsing keeps jsdom from building a CSSOM for every page, which ran
      // the Render build out of memory across ~280 pages.
      const html = readFileSync(file, 'utf8')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
      const { window } = new JSDOM(html, { virtualConsole: quiet, url: loc });
      const { document } = window;
      const title = document.title.trim();
      if (!title) fail('no-title', where);
      else titles.set(title, [...(titles.get(title) || []), where]);
      if (!document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()) fail('no-description', where);
      if (!document.querySelector('link[rel="canonical"]')?.getAttribute('href')) fail('no-canonical', where);
      if (/noindex/i.test(document.querySelector('meta[name="robots"]')?.getAttribute('content') || '')) fail('noindex-in-sitemap', where);
      const body = document.body.cloneNode(true);
      for (const n of body.querySelectorAll('script, style, noscript, template')) n.remove();
      const words = body.textContent.split(/\s+/).filter(Boolean).length;
      if (words < MIN_WORDS) fail('thin', where, `${words} words`);
      for (const a of document.querySelectorAll('a[href]')) {
        const href = a.getAttribute('href');
        if (/^(#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
        let target;
        try { target = new URL(href, loc); } catch { fail('bad-href', where, href); continue; }
        if (target.origin !== ORIGIN) continue;
        if (!resolves(target.pathname)) fail('broken-link', where, target.pathname);
      }
      window.close();
      // jsdom frees a closed window only once the event loop turns; without
      // this yield every page stays in memory and the build hits the heap limit.
      await new Promise((r) => setImmediate(r));
    }
  }
  for (const [title, where] of titles) if (where.length > 1) fail('duplicate-title', where.join(' | '), title);

  for (const file of htmlFiles(dist)) {
    const path = '/' + relative(dist, file).split(sep).join('/');
    if (ADS_ALLOWED.some((p) => path.startsWith(p))) continue;
    const html = readFileSync(file, 'utf8');
    if (/<script[^>]+adsbygoogle\.js|class="adsbygoogle"/.test(html)) fail('ads-outside-editorial', path);
  }
  return { pages, sitemaps: sitemaps.length, failures };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dist = resolve(process.argv[2] || 'dist');
  const { pages, sitemaps, failures } = await audit(dist);
  const byKind = {};
  for (const f of failures) (byKind[f.kind] ||= []).push(f);
  for (const [kind, list] of Object.entries(byKind)) {
    console.error(`✗ ${kind}: ${list.length}`);
    for (const f of list.slice(0, 25)) console.error(`    ${f.where}${f.detail ? `  →  ${f.detail}` : ''}`);
    if (list.length > 25) console.error(`    … ${list.length - 25} more`);
  }
  if (failures.length) {
    console.error(`✗ audit-dist: ${failures.length} problem(s) across ${pages} sitemap pages in ${sitemaps} sitemaps`);
    process.exit(1);
  }
  console.log(`✓ audit-dist: ${pages} sitemap pages in ${sitemaps} sitemaps — no broken links, thin, duplicate, unindexable or ad-bearing pages`);
}
