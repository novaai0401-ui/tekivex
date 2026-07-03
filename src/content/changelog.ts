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
