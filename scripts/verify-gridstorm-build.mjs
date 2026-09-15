import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {JSDOM} from 'jsdom';
const root = resolve(process.argv[2] || 'dist/gridstorm');
const sitemap = new JSDOM(readFileSync(join(root, 'sitemap.xml'), 'utf8'), {contentType:'text/xml'});
let docs = 0;
for (const loc of sitemap.window.document.querySelectorAll('loc')) {
  const url = new URL(loc.textContent);
  assert.equal(url.origin, 'https://www.tekivex.com');
  assert.equal(url.hash, '', `Fragment in sitemap: ${url}`);
  assert.ok(url.pathname.startsWith('/gridstorm/'));
  const file = join(root, url.pathname.slice('/gridstorm/'.length), 'index.html');
  assert.ok(existsSync(file), `Missing sitemap file: ${file}`);
  if (!url.pathname.startsWith('/gridstorm/docs/')) continue;
  const document = new JSDOM(readFileSync(file, 'utf8')).window.document;
  assert.equal(document.querySelector('link[rel=canonical]')?.href, url.href);
  assert.ok(document.querySelector('main h1'), `Missing document heading: ${url}`);
  assert.ok(document.querySelector('main')?.textContent.length > 100);
  for (const link of document.querySelectorAll('a[href^="/gridstorm/docs/"]')) {
    const path = link.getAttribute('href').split('#')[0].split('?')[0];
    assert.ok(existsSync(join(root, path.slice('/gridstorm/'.length), 'index.html')), `Broken documentation link ${path}`);
  }
  docs++;
}
assert.ok(docs > 1, 'Missing documentation pages');
const hub = new JSDOM(readFileSync(join(root, 'index.html'), 'utf8')).window.document;
assert.equal(hub.querySelector('link[rel=canonical]')?.href, 'https://www.tekivex.com/gridstorm/');
assert.ok(hub.querySelector('script[src="/gridstorm/documentation-route.js"]'));
assert.ok(readdirSync(join(root, 'hub-assets')).some(f=>f.endsWith('.js')), 'Interactive hub assets lost');
console.log(`Verified ${docs} readable Gridstorm documentation pages, links and canonical URLs.`);
