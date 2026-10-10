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
    date: '2026-10-10',
    title: 'Sourced comparisons, tested tools and fewer ads',
    items: [
      { tag: 'Fixed', text: 'Rewrote the GridStorm and AG Grid comparison table so every statement about AG Grid links to AG Grid’s own documentation, and removed unmeasured size and accessibility claims.' },
      { tag: 'Improved', text: 'Ads now appear only on reader guides an editor has approved. Product pages, tools and documentation carry none.' },
      { tag: 'Fixed', text: 'JPG to PDF now reads the orientation tag phones store with portrait photos, so they no longer come out as sideways pages. The photo is placed upright without being re-compressed.' },
      { tag: 'Fixed', text: 'Split PDF and Delete PDF Pages no longer leave an image from a removed page embedded in the output when the source file shares one resource list across pages.' },
      { tag: 'Fixed', text: 'The PDF tools now say a file is encrypted rather than password-protected, because files that open without a password but restrict editing are rejected too.' },
      { tag: 'Improved', text: 'The merge, split, delete, rotate, JPG to PDF and PDF to JPG guides now report what we tested on published sample files, including what each tool keeps and drops. The merge guide no longer claims that compressing after merging deduplicates fonts and images.' },
    ],
  },
  {
    date: '2026-09-30',
    title: 'Documentation-first indexing',
    items: [
      { tag: 'Improved', text: 'The Tekivex UI sitemap now lists its 151 full documentation pages (components, recipes, blueprints) instead of 27 short landing screens, which are no longer indexed.' },
      { tag: 'Improved', text: 'The GridStorm documentation index now summarises every guide and reference page, grouped by section. The interactive playground and example apps stay available but are no longer indexed as articles.' },
      { tag: 'Fixed', text: 'Removed advertising from the Tekivex UI documentation screens. Ads now appear only on long-form guides.' },
    ],
  },
  {
    date: '2026-09-15',
    title: 'Measured examples and readable GridStorm docs',
    items: [
      { tag: 'New', text: 'Published the GridStorm documentation as plain, readable pages under /gridstorm/docs, with working links between guides.' },
      { tag: 'Improved', text: 'The Compress PDF guide now includes a downloadable sample PDF and its measured results at each compression level.' },
      { tag: 'Improved', text: 'Rewrote the GridStorm virtual-scrolling and AG Grid comparison guides with dated, sourced evaluation criteria.' },
      { tag: 'Fixed', text: 'Charts shared from CSV to Chart no longer send their data to analytics in the page URL.' },
    ],
  },
  {
    date: '2026-09-06',
    title: 'One domain for every product',
    items: [
      { tag: 'Improved', text: 'Tekivex UI, GridStorm, Analytics Studio and DataFlow are now served from www.tekivex.com under their own paths instead of separate subdomains.' },
      { tag: 'New', text: 'Added an editorial policy page, an expanded FAQ and a categorised contact page.' },
    ],
  },
  {
    date: '2026-08-31',
    title: 'Accessibility and crawlable pages',
    items: [
      { tag: 'New', text: 'Published an accessibility statement and added a skip link, a single main landmark and visible focus styles.' },
      { tag: 'Improved', text: 'About, FAQ, legal and contact pages are now fully server-rendered, so they read correctly without JavaScript.' },
      { tag: 'Fixed', text: 'Corrected the cookie banner role and reading order for screen readers, and removed a duplicate page heading.' },
    ],
  },
  {
    date: '2026-08-11',
    title: 'Author profiles and a readable theme',
    items: [
      { tag: 'New', text: 'Added author profile pages linking each guide to the person who wrote it.' },
      { tag: 'Fixed', text: 'Every page is now readable in both light and dark themes.' },
      { tag: 'Improved', text: 'Expanded the PDF and CSV guides with more worked detail.' },
    ],
  },
  {
    date: '2026-07-22',
    title: 'Three more PDF tools',
    items: [
      { tag: 'New', text: 'Added PDF to JPG, Rotate PDF and Remove Pages tools, each with a step-by-step guide. Files stay in your browser.' },
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
