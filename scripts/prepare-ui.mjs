// Post-process the vendored Tekivex UI documentation site (dist/ui/).
//
// The upstream build ships an AdSense Auto-ads loader on every page and lists
// every page in its own sitemap, but each page's initial HTML is a thin app
// shell (roughly 70–110 words). Ads on low-value screens and thin indexed
// pages are both cited by Google's publisher policies, so until the upstream
// site prerenders its full documentation we:
//   1. strip the advertising loader (and any ad units) from every HTML file,
//   2. mark every page noindex,follow so links still pass but shells are not
//      indexed as content, and
//   3. remove the /ui sitemaps and their robots.txt references so nothing
//      advertises the shells to crawlers.
// This never touches the app's JavaScript or client-side routing.
import { readFileSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const AD_LOADER = /<script\b[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*>\s*<\/script>/gi;
const AD_UNIT = /<ins\b[^>]*\bclass="[^"]*\badsbygoogle\b[^"]*"[^>]*>\s*<\/ins>/gi;
const ROBOTS_META = /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i;
const NOINDEX = '<meta name="robots" content="noindex, follow" />';

function* htmlFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.name.endsWith('.html')) yield file;
  }
}

/** Returns one page's cleaned HTML. Exported for unit tests. */
export function cleanUiPage(html) {
  let out = html.replace(AD_LOADER, '').replace(AD_UNIT, '');
  if (ROBOTS_META.test(out)) out = out.replace(ROBOTS_META, NOINDEX);
  else if (/<head[^>]*>/i.test(out)) out = out.replace(/<head[^>]*>/i, (m) => `${m}${NOINDEX}`);
  else out = `${NOINDEX}${out}`;
  return out;
}

export function prepareUi(target) {
  if (!existsSync(join(target, 'index.html'))) throw new Error('Tekivex UI build has no index.html; refusing to post-process');
  let pages = 0;
  let adsRemoved = 0;
  for (const file of htmlFiles(target)) {
    const html = readFileSync(file, 'utf8');
    if (AD_LOADER.test(html) || AD_UNIT.test(html)) adsRemoved++;
    AD_LOADER.lastIndex = 0; AD_UNIT.lastIndex = 0;
    writeFileSync(file, cleanUiPage(html));
    pages++;
  }
  for (const name of readdirSync(target)) {
    if (/^sitemap.*\.xml$/.test(name)) rmSync(join(target, name), { force: true });
  }
  const robots = join(target, 'robots.txt');
  if (existsSync(robots)) {
    const lines = readFileSync(robots, 'utf8').split('\n').filter((l) => !/^\s*Sitemap:/i.test(l));
    writeFileSync(robots, lines.join('\n'));
  }
  console.log(`Prepared /ui: ${pages} pages marked noindex, advertising removed from ${adsRemoved}, sitemaps dropped.`);
  return { pages, adsRemoved };
}
