import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
let articles = 0;
for (const url of urls) {
  const path = new URL(url).pathname;
  // /ui is built in a separate repository; this check covers this site's pages.
  if (path === '/ui/') continue;
  const file = join(dist, path.slice(1), 'index.html');
  assert.ok(existsSync(file), `Missing prerendered page: ${path}`);
  const document = new JSDOM(readFileSync(file, 'utf8')).window.document;
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), url);
  assert.ok(document.querySelector('h1'), `Missing heading: ${path}`);
  assert.ok(!document.querySelector('meta[name="robots"]')?.content.includes('noindex'), `Noindex sitemap page: ${path}`);
  if (!path.startsWith('/use-cases/')) continue;
  const slug = path.slice('/use-cases/'.length);
  const source = readFileSync(join(root, 'public/use-cases/content', `${slug}.md`), 'utf8');
  const expected = new JSDOM(marked.parse(source)).window.document.body.textContent;
  assert.equal(document.querySelector('.uc-article-body')?.textContent?.trim(), expected?.trim(), `Incomplete article: ${slug}`);
  assert.ok(document.querySelector('time[datetime]'), `Missing visible article date: ${slug}`);
  articles++;
}
assert.ok(articles > 0, 'No articles found in sitemap');
const notFound = new JSDOM(readFileSync(join(dist, '404.html'), 'utf8')).window.document;
assert.ok(notFound.querySelector('meta[name="robots"]')?.content.includes('noindex'));
const render = readFileSync(join(root, 'render.yaml'), 'utf8');
assert.ok(!/source:\s*\/\*\s*\n\s*destination:\s*\/index\.html/.test(render), 'Site-wide SPA fallback would mask 404s');
for (const match of render.matchAll(/type:\s*redirect\s+source:\s*(\S+)\s+destination:/g)) {
  assert.ok(!existsSync(join(dist, match[1].slice(1), 'index.html')), `Static page masks Render redirect: ${match[1]}`);
}
assert.ok(existsSync(join(dist, 'examples/monthly-revenue-expenses.csv')));
console.log(`Verified ${articles} complete articles, sitemap pages, dates, 404 markup and redirect paths.`);
