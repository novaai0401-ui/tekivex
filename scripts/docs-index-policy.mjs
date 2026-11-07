// Whether the vendored library documentation (/ui and /gridstorm) is offered
// to search engines.
//
// November 2026: AdSense rejected tekivex.com four times for "Low value
// content". 153 of its 212 indexed pages were reference docs for Tekivex's own
// two libraries, so the site read as product documentation rather than
// publisher content. On the owner's decision the docs stay published and
// linked but are marked noindex and left out of every sitemap, so the site is
// judged on its guides and tools. Set DOCS_INDEXED to true to undo.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const DOCS_INDEXED = false;
const META = '<meta name="robots" content="noindex, follow">';
const EMPTY_SITEMAP = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';

/** Add or replace the robots meta tag so the page is noindex, follow. */
export function noindexHtml(html) {
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) return html.replace(/<meta\s+name=["']robots["'][^>]*>/gi, META);
  return html.replace(/<head([^>]*)>/i, `<head$1>${META}`);
}

function* htmlFiles(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(f);
    else if (e.name.endsWith('.html')) yield f;
  }
}

/** Mark every HTML page under `target` noindex and empty its sitemap. Returns the page count. */
export function deindexDocs(target) {
  let n = 0;
  for (const f of htmlFiles(target)) {
    const html = readFileSync(f, 'utf8');
    const out = noindexHtml(html);
    if (out === html && !/noindex/i.test(html)) throw new Error(`could not add noindex to ${f}`);
    writeFileSync(f, out);
    n++;
  }
  writeFileSync(join(target, 'sitemap.xml'), EMPTY_SITEMAP);
  return n;
}
