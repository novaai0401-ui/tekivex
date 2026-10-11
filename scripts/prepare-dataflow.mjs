// Post-process the vendored DataFlow build (dist/dataflow).
//
// The five dashboards (/stocks, /crypto, /iot, /commerce, /canvas) ship the
// same server-rendered text as the /dataflow/ landing page; only the title and
// description differ. Six indexed copies of one page read as duplicate,
// low-value content. Keep the landing page indexed, mark the dashboards
// noindex,follow (they stay fully usable), and list only the landing page in
// the sitemap. Parsing only; no application code runs.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://www.tekivex.com/dataflow/';
const NOINDEX = '<meta name="robots" content="noindex, follow" />';

export function noindex(html) {
  if (/<meta\s+name="robots"[^>]*>/i.test(html)) return html.replace(/<meta\s+name="robots"[^>]*>/gi, NOINDEX);
  return html.replace(/<head([^>]*)>/i, `<head$1>${NOINDEX}`);
}

export function prepareDataflow(target) {
  if (!existsSync(join(target, 'index.html'))) throw new Error('DataFlow build has no landing page');
  const dashboards = readdirSync(target, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(target, e.name, 'index.html')))
    .map((e) => e.name);
  for (const name of dashboards) {
    const file = join(target, name, 'index.html');
    writeFileSync(file, noindex(readFileSync(file, 'utf8')));
  }
  writeFileSync(
    join(target, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${BASE}</loc></url></urlset>`,
  );
  console.log(`Prepared /dataflow: landing page indexed, ${dashboards.length} dashboard copies noindexed.`);
  return dashboards;
}
