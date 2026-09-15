// Turn the vendored hub's raw Markdown modules into directly readable docs.
// Parse modules as data: never execute code from the imported application.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';

const BASE = 'https://www.tekivex.com/gridstorm';
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export function prepareGridstorm(target) {
  const assets = join(target, 'hub-assets');
  const docs = new Map();
  for (const file of readdirSync(assets).filter((f) => f.endsWith('.js'))) {
    const source = readFileSync(join(assets, file), 'utf8');
    // The hub's Vite import map records the original doc slug and chunk filename.
    for (const m of source.matchAll(/docs\/src\/content\/docs\/([\w/-]+)\.md"\s*:\s*\(\)=>[^\n]*?import\("\.\/([^"/]+\.js)"\)/g)) {
      docs.set(m[1], m[2]);
    }
  }
  if (!docs.has('getting-started/introduction')) throw new Error('Gridstorm documentation import map changed; refusing to publish incomplete docs');
  const pages = [];
  for (const [slug, chunk] of docs) {
    const ast = ts.createSourceFile(chunk, readFileSync(join(assets, chunk), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    let markdown;
    for (const statement of ast.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        const value = declaration.initializer;
        if (value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) && value.text.startsWith('---')) markdown = value.text;
      }
    }
    if (!markdown) throw new Error(`No raw Markdown in Gridstorm doc ${slug}`);
    const title = markdown.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, '') || slug;
    const content = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
    pages.push({ slug, title, content });
  }
  const nav = pages.map(({slug, title}) => `<li><a href="/gridstorm/docs/${slug}/">${escape(title)}</a></li>`).join('');
  function page(title, path, body) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} | GridStorm documentation</title><link rel="canonical" href="${BASE}${path}"><style>body{font:17px/1.65 system-ui,sans-serif;color:#182332;max-width:1000px;margin:auto;padding:24px}a{color:#214fbe}nav{display:flex;gap:24px;flex-wrap:wrap}pre{padding:16px;background:#f0f3f7;overflow:auto}table{display:block;overflow:auto;border-collapse:collapse}td,th{padding:10px;border:1px solid #ccd3df}img{max-width:100%}h1,h2,h3{line-height:1.25}footer{border-top:1px solid #ccd3df;margin-top:40px;padding-top:16px}</style></head><body><nav aria-label="Main"><a href="/">Tekivex</a><a href="/product/gridstorm">GridStorm</a><a href="/gridstorm/docs/">Documentation</a><a href="/gridstorm/playground/">Playground</a></nav><main>${body}</main><footer><a href="/contact">Contact</a> · <a href="/privacy-policy">Privacy</a> · <a href="https://github.com/novaai0401-ui/grid-data">Source repository</a></footer></body></html>`;
  }
  for (const {slug, title, content} of pages) {
    const dom = new JSDOM(marked.parse(content));
    if (!dom.window.document.querySelector('h1')) {
      const heading = dom.window.document.createElement('h1');
      heading.textContent = title;
      dom.window.document.body.prepend(heading);
    }
    for (const a of dom.window.document.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (href.startsWith('#') && !href.startsWith('#/docs')) continue;
      const relative = href.replace(/^.*#\/docs\//, '').replace(/^\/(?:gridstorm\/)?docs\//, '').replace(/^\//, '');
      const candidate = relative.replace(/\/$/, '').replace(/\.md$/, '');
      if (docs.has(candidate)) a.setAttribute('href', `/gridstorm/docs/${candidate}/`);
    }
    const directory = join(target, 'docs', slug);
    mkdirSync(directory, {recursive:true});
    writeFileSync(join(directory, 'index.html'), page(title, `/docs/${slug}/`, dom.window.document.body.innerHTML));
  }
  mkdirSync(join(target, 'docs'), {recursive:true});
  writeFileSync(join(target, 'docs/index.html'), page('Documentation', '/docs/', `<h1>GridStorm documentation</h1><p>Installation, API reference, framework adapters and plugin guides. These pages are published from the same documentation used by the interactive hub.</p><ul>${nav}</ul>`));
  function walk(directory) {
    for (const entry of readdirSync(directory, {withFileTypes:true})) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html')) {
        const html = readFileSync(file, 'utf8').replace(/https:\/\/(?:gridstorm|griddata)\.tekivex\.com/g, BASE);
        writeFileSync(file, html);
      }
    }
  }
  walk(target);
  // Preserve bookmarked hub doc routes while sending readers to readable HTML.
  const routeScript = `(()=>{function route(){const m=location.hash.match(/^#\\/docs(?:\\/(.*))?$/);if(m){const slug=(m[1]||'').replace(/\\/$/,'');location.replace('/gridstorm/docs/'+(slug?slug+'/':''));}}route();addEventListener('hashchange',route);})();`;
  writeFileSync(join(target, 'documentation-route.js'), routeScript);
  const hub = join(target, 'index.html');
  let hubHtml = readFileSync(hub, 'utf8');
  if (!hubHtml.includes('src="/gridstorm/documentation-route.js"')) hubHtml = hubHtml.replace('<head>', '<head><script src="/gridstorm/documentation-route.js"></script>');
  writeFileSync(hub, hubHtml);
  const sitemap = join(target, 'sitemap.xml');
  const prior = existsSync(sitemap) ? readFileSync(sitemap, 'utf8') : '';
  const urls = new Set([BASE+'/', BASE+'/docs/', ...pages.map(p => `${BASE}/docs/${p.slug}/`)]);
  for (const match of prior.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = new URL(match[1]);
    if (!url.hash && url.origin === 'https://www.tekivex.com' && url.pathname.startsWith('/gridstorm/')) urls.add(url.href);
  }
  writeFileSync(sitemap, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...urls].map(u=>`<url><loc>${escape(u)}</loc></url>`).join('')}</urlset>`);
  // The upstream index points to an Astro sitemap that is absent in this build.
  writeFileSync(join(target, 'sitemap-index.xml'), `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${BASE}/sitemap.xml</loc></sitemap></sitemapindex>`);
  console.log(`Prepared ${pages.length} Gridstorm documentation pages and canonical URLs.`);
  return pages.length;
}
