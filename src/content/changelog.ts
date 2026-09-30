// ─── Changelog ───────────────────────────────────────────────────────────────
// A public, dated record of what actually shipped. Honest dates (matching the
// repository history), grouped newest-first. Consumed by the React
// ChangelogPage and by scripts/prerender.mjs so the page is crawlable and
// gives search engines a genuine freshness signal.

export type ChangeTag = 'New' | 'Improved' | 'Fixed';

export interface ChangeItem {
  tag: ChangeTag;
  text: string;
}

export interface ChangelogEntry {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Short headline for the release. */
  title: string;
  items: ChangeItem[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-09-30',
    title: 'Thin pages out of search and ad inventory',
    items: [
      { tag: 'Fixed', text: 'No page under /ui loads advertising any more. Tekivex UI pages with fewer than 200 words of initial HTML are marked noindex, and the /ui sitemap lists only the substantial component, recipe and blueprint pages.' },
      { tag: 'Fixed', text: 'GridStorm application and demo shells (hub, playground, spreadsheet, financial trading, feature showcase, cookbook, analytics explorer, PDF viewer, React demo) are marked noindex; the GridStorm sitemap now lists only the readable documentation pages.' },
      { tag: 'Improved', text: 'Sitemap lastmod dates now reflect the newest changelog entry instead of the build date, so a redeploy without content changes no longer claims every page was updated.' },
    ],
  },
  {
    date: '2026-09-15',
    title: 'Consent controls, honest claims and readable GridStorm docs',
    items: [
      { tag: 'Fixed', text: 'Cookie preferences can be reopened from the cookie policy page; withdrawing consent revokes earlier signals and stays in sync across browser tabs.' },
      { tag: 'Fixed', text: 'Advertising is loaded only by an actual editorial ad placement; the 404, legal, empty and tool-only screens carry no ad requests.' },
      { tag: 'Improved', text: 'Removed unsupported bundle-size, frame-rate and accessibility guarantees from product pages and guides; comparisons with other grids were rewritten as sourced evaluation guides.' },
      { tag: 'New', text: 'GridStorm documentation is published as plain, readable HTML pages under /gridstorm/docs/ with canonical URLs instead of hash-routed app views.' },
      { tag: 'Fixed', text: 'Chart data and query parameters are kept out of analytics page URLs.' },
    ],
  },
  {
    date: '2026-09-10',
    title: 'Prerender and routing repairs',
    items: [
      { tag: 'Fixed', text: 'Restored the complete prerender source so every article is served in full without JavaScript, and kept Vite-only imports out of the Node build.' },
      { tag: 'Improved', text: 'Render routing rules and editorial examples were corrected so articles stay reachable at their canonical URLs.' },
    ],
  },
  {
    date: '2026-09-06',
    title: 'Product apps under one domain',
    items: [
      { tag: 'New', text: 'Tekivex UI, GridStorm, Analytics Studio and DataFlow are served from www.tekivex.com/ui, /gridstorm, /analytics and /dataflow; their builds are vendored into one deploy and a missing app now fails the deploy instead of shipping a broken path.' },
      { tag: 'New', text: 'Added an editorial policy page, a 21-question FAQ and a categorised contact page.' },
    ],
  },
  {
    date: '2026-09-01',
    title: 'Crawlable trust pages and dependency patches',
    items: [
      { tag: 'Improved', text: 'About, FAQ, legal and contact pages are fully server-rendered for crawlers and readers without JavaScript.' },
      { tag: 'Fixed', text: 'Patched high-severity advisories in nanoid, pdfjs-dist and postcss.' },
    ],
  },
  {
    date: '2026-08-31',
    title: 'Accessibility, guide differentiation and SEO hygiene',
    items: [
      { tag: 'New', text: 'Skip link, a single main landmark, visible focus styles and a public accessibility statement.' },
      { tag: 'Improved', text: 'Each PDF and CSV how-to guide now has its own FAQ distinct from the matching tool page, and the Pyntra page describes the consumer studio it actually is.' },
      { tag: 'Fixed', text: 'Removed a duplicate H1, standardised the canonical host on www.tekivex.com, added a crawlable legal footer to every page and a /privacy redirect; old article URLs now redirect instead of returning 404.' },
      { tag: 'Fixed', text: 'Corrected the cookie banner role and reading order for screen readers.' },
    ],
  },
  {
    date: '2026-08-11',
    title: 'Author pages, design refresh and deeper guides',
    items: [
      { tag: 'New', text: 'Author profile pages for each guide writer with a domain-bound contact address.' },
      { tag: 'Improved', text: 'Adopted the indigo-on-slate design system and fixed hard-coded colours so every page is readable in light and dark themes.' },
      { tag: 'Improved', text: 'Richer structured data for the tools and deeper how-to guides in response to the earlier AdSense review.' },
      { tag: 'Fixed', text: 'Consent wording in the legal pages now matches what the site actually does; missing icons on the About page render again.' },
    ],
  },
  {
    date: '2026-07-23',
    title: 'Honest product framing',
    items: [
      { tag: 'Improved', text: 'Unified branding, removed templated copy from the tool pages and reworded product claims to match what ships.' },
    ],
  },
  {
    date: '2026-07-22',
    title: 'Three more PDF guides',
    items: [
      { tag: 'New', text: 'How-to guides for converting PDF to JPG, rotating PDF pages and deleting pages from a PDF, each paired with its free in-browser tool.' },
    ],
  },
  {
    date: '2026-07-06',
    title: 'Friendlier PDF errors',
    items: [
      { tag: 'Fixed', text: 'Tools now explain clearly when a PDF is corrupt or unreadable instead of failing silently.' },
    ],
  },
  {
    date: '2026-07-02',
    title: 'Free in-browser tools',
    items: [
      { tag: 'New', text: 'Launched the Tools hub with five free tools that run entirely in your browser — files are never uploaded: Merge PDF, Split PDF, JPG to PDF, Compress PDF, and CSV to Chart.' },
      { tag: 'New', text: 'CSV to Chart renders bar, line, area, and donut charts with a colour-blind-safe palette, exports to SVG or PNG, and now produces shareable links that carry the data in the URL — nothing is sent to a server.' },
      { tag: 'Improved', text: 'Compress PDF shows the real before/after file size and tells you when a PDF cannot be made smaller, instead of silently returning a bigger file.' },
    ],
  },
  {
    date: '2026-06-28',
    title: 'Accurate product catalogue',
    items: [
      { tag: 'Improved', text: 'Every product page now points at the real, published package or the live hosted app: GridStorm (npm gridstorm), Tekivex UI (npm tekivex-ui), and Quantum Vault (npm @sigvault/sdk).' },
      { tag: 'New', text: 'Restored Pyntra, Analytics Studio, and DataFlow as hosted web apps you can open and use directly, each with a Launch link — no install required.' },
      { tag: 'Fixed', text: 'Corrected the Quantum Vault documentation to describe its actual cryptography (ML-DSA-87 / FIPS 204 signatures with XChaCha20-Poly1305), and gave every guide an honest publication date.' },
    ],
  },
  {
    date: '2026-06-17',
    title: 'Guides & use cases',
    items: [
      { tag: 'New', text: 'Published the Use Cases hub with in-depth engineering guides across GridStorm, Tekivex UI, and Quantum Vault.' },
      { tag: 'Improved', text: 'Added full server-rendered content and structured data across the site so pages are readable without JavaScript.' },
    ],
  },
];

export function getChangelog(): readonly ChangelogEntry[] {
  return CHANGELOG;
}

export function latestChangeDate(): string {
  return CHANGELOG[0]?.date ?? '';
}
