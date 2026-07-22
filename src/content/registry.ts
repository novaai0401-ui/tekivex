// ─── Use-Cases article registry ─────────────────────────────────────────────
// Single source of truth for the /use-cases content hub. Article prose lives in
// public/use-cases/content/<slug>.md; metadata lives here so both the React app
// and the prerender script read the same list.

import type { Article } from './types';
import { AUTHORS } from './authors';

const PUBLISHED = '2026-06-17';

// Which real author wrote each guide. Chandan leads on architecture, performance,
// data/streaming, crypto, and platform pieces; Seema leads on UI, accessibility,
// design systems, PDF tooling, and analytics dashboards — matching their stated
// expertise, and giving the hub a natural two-author byline mix.
const AUTHOR_BY_SLUG: Record<string, string> = {
  'gridstorm-virtual-scrolling-60fps': 'chandan-kumar',
  'gridstorm-vs-ag-grid-migration': 'chandan-kumar',
  'gridstorm-financial-trading-grid': 'chandan-kumar',
  'gridstorm-plugin-architecture': 'chandan-kumar',
  'gridstorm-excel-formulas': 'chandan-kumar',
  'gridstorm-accessible-data-grid': 'seema-almas-shaikh',
  'quantum-vault-post-quantum-tokens-explained': 'chandan-kumar',
  'quantum-vault-migrate-pqc-token-issuance': 'chandan-kumar',
  'quantum-vault-sovereign-token-verification': 'chandan-kumar',
  'tekivex-ui-vs-mui-chakra': 'seema-almas-shaikh',
  'tekivex-ui-headless-design-system': 'seema-almas-shaikh',
  'tekivex-ui-accessible-forms': 'seema-almas-shaikh',
  'tekivex-stack-how-products-fit': 'chandan-kumar',
  'tekivex-mit-open-source-model': 'chandan-kumar',
  // Free-tools how-to guides
  'how-to-merge-pdf-free': 'seema-almas-shaikh',
  'how-to-split-pdf-extract-pages': 'seema-almas-shaikh',
  'how-to-convert-jpg-to-pdf': 'seema-almas-shaikh',
  'how-to-compress-pdf': 'seema-almas-shaikh',
  'how-to-make-chart-from-csv': 'chandan-kumar',
  'why-browser-tools-keep-files-private': 'chandan-kumar',
  'how-to-convert-pdf-to-jpg': 'seema-almas-shaikh',
  'how-to-rotate-pdf': 'seema-almas-shaikh',
  'how-to-delete-pages-from-pdf': 'seema-almas-shaikh',
};

const DEFAULT_AUTHOR_ID = 'chandan-kumar';

// Publication dates. These reflect when each guide actually entered the
// repository (git history), with the modified date from the last substantive
// revision — honest dates, not a back-dated editorial calendar.
const MODIFIED = '2026-06-28';
const DATES: Record<string, { published: string; modified?: string }> = {
  'tekivex-mit-open-source-model':                 { published: PUBLISHED, modified: MODIFIED },
  'tekivex-stack-how-products-fit':                { published: PUBLISHED, modified: MODIFIED },
  'gridstorm-virtual-scrolling-60fps':             { published: PUBLISHED, modified: MODIFIED },
  'gridstorm-plugin-architecture':                 { published: PUBLISHED, modified: MODIFIED },
  'gridstorm-vs-ag-grid-migration':                { published: PUBLISHED, modified: MODIFIED },
  'gridstorm-accessible-data-grid':                { published: PUBLISHED, modified: MODIFIED },
  'gridstorm-excel-formulas':                      { published: PUBLISHED, modified: MODIFIED },
  'gridstorm-financial-trading-grid':              { published: PUBLISHED, modified: MODIFIED },
  'tekivex-ui-headless-design-system':             { published: PUBLISHED, modified: MODIFIED },
  'tekivex-ui-vs-mui-chakra':                      { published: PUBLISHED, modified: MODIFIED },
  'tekivex-ui-accessible-forms':                   { published: PUBLISHED, modified: MODIFIED },
  'quantum-vault-post-quantum-tokens-explained':   { published: PUBLISHED, modified: MODIFIED },
  'quantum-vault-migrate-pqc-token-issuance':      { published: PUBLISHED, modified: MODIFIED },
  'quantum-vault-sovereign-token-verification':    { published: PUBLISHED, modified: MODIFIED },
  // Free-tools how-to guides — shipped with the tools hub.
  'how-to-merge-pdf-free':                         { published: '2026-07-02' },
  'how-to-split-pdf-extract-pages':                { published: '2026-07-02' },
  'how-to-convert-jpg-to-pdf':                     { published: '2026-07-02' },
  'how-to-compress-pdf':                           { published: '2026-07-02' },
  'how-to-make-chart-from-csv':                    { published: '2026-07-02' },
  'why-browser-tools-keep-files-private':          { published: '2026-07-02' },
  'how-to-convert-pdf-to-jpg':                     { published: '2026-07-22' },
  'how-to-rotate-pdf':                             { published: '2026-07-22' },
  'how-to-delete-pages-from-pdf':                  { published: '2026-07-22' },
};

function article(
  a: Omit<Article, 'author' | 'authorId' | 'datePublished' | 'dateModified' | 'contentFile'> &
    Partial<Pick<Article, 'datePublished' | 'dateModified'>>,
): Article {
  const d = DATES[a.slug];
  const published = a.datePublished ?? d?.published ?? PUBLISHED;
  const modified = a.dateModified ?? d?.modified ?? published;
  const authorId = AUTHOR_BY_SLUG[a.slug] ?? DEFAULT_AUTHOR_ID;
  return {
    author: AUTHORS[authorId].name,
    authorId,
    datePublished: published,
    dateModified: modified,
    contentFile: `${a.slug}.md`,
    ...a,
  };
}

export const ARTICLES: Article[] = [
  // ── Free Tools — how-to guides for a consumer audience ─────────────────────
  article({
    slug: 'how-to-merge-pdf-free',
    title: 'How to Merge PDF Files for Free Without Uploading Them',
    description:
      'A step-by-step guide to combining PDF files into one document entirely in your browser — no upload, no watermark, no account. Includes ordering, common pitfalls, and encrypted-PDF notes.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['how to merge pdf', 'combine pdf free', 'merge pdf without uploading', 'join pdf files', 'private pdf merge'],
    readingMinutes: 5,
  }),
  article({
    slug: 'how-to-split-pdf-extract-pages',
    title: 'How to Split a PDF and Extract Pages in Your Browser',
    description:
      'Extract a single page, a range, or any combination of pages from a PDF for free and privately. Learn the page-range syntax and how to avoid the mistakes that trip people up.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['how to split pdf', 'extract pages from pdf', 'split pdf free', 'remove pages from pdf', 'pdf page range'],
    readingMinutes: 5,
  }),
  article({
    slug: 'how-to-convert-jpg-to-pdf',
    title: 'How to Convert JPG or PNG Images to a PDF, Privately',
    description:
      'Turn photos and scans into a single PDF without uploading them anywhere — ideal for IDs, receipts, and documents. Covers image order, page sizing, and unsupported formats like HEIC.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['jpg to pdf', 'convert images to pdf', 'png to pdf', 'scan to pdf private', 'photos to pdf'],
    readingMinutes: 5,
  }),
  article({
    slug: 'how-to-compress-pdf',
    title: 'How to Compress a PDF to a Smaller File Size (Free, No Upload)',
    description:
      'Shrink a large PDF so it fits an email or upload limit — in your browser, with an honest look at what compression can and cannot do, and why scanned PDFs shrink most.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['how to compress pdf', 'reduce pdf size', 'shrink pdf', 'make pdf smaller', 'compress pdf free'],
    readingMinutes: 6,
  }),
  article({
    slug: 'how-to-make-chart-from-csv',
    title: 'How to Make a Chart from a CSV File (and Share It Privately)',
    description:
      'Turn a spreadsheet export into a clean bar, line, area, or donut chart in seconds, download it as SVG or PNG, and share a link whose data never touches a server.',
    productId: 'analytics-studio',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['csv to chart', 'make a chart from csv', 'chart from spreadsheet', 'csv graph maker', 'shareable chart link'],
    readingMinutes: 6,
  }),
  article({
    slug: 'why-browser-tools-keep-files-private',
    title: 'Why In-Browser Tools Keep Your Files Private (No Upload, Explained)',
    description:
      'Most online PDF and file tools upload your document to their servers. Here is what "runs in your browser" actually means, why it is more private, and how to tell the difference.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'Explainer',
    keywords: ['client-side tools', 'no upload pdf tools', 'private online tools', 'browser file processing', 'are online pdf tools safe'],
    readingMinutes: 6,
  }),
  article({
    slug: 'how-to-convert-pdf-to-jpg',
    title: 'How to Convert a PDF to JPG Images, Privately',
    description:
      'A step-by-step guide to turning each page of a PDF into a JPG or PNG image entirely in your browser — no upload, no watermark. Covers when to pick JPG vs PNG and common pitfalls.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['how to convert pdf to jpg', 'pdf to image free', 'pdf to png', 'convert pdf to jpg without upload', 'extract images from pdf'],
    readingMinutes: 5,
  }),
  article({
    slug: 'how-to-rotate-pdf',
    title: 'How to Rotate a PDF and Fix Sideways Pages (Free, No Upload)',
    description:
      'A step-by-step guide to rotating PDF pages 90°, 180° or 270° and saving the corrected file in your browser — no quality loss, no upload. Includes how to rotate a single page.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['how to rotate pdf', 'rotate pdf pages', 'fix sideways pdf', 'rotate pdf free', 'rotate pdf without upload'],
    readingMinutes: 4,
  }),
  article({
    slug: 'how-to-delete-pages-from-pdf',
    title: 'How to Delete Pages from a PDF (Free, in Your Browser)',
    description:
      'A step-by-step guide to removing unwanted pages from a PDF — single pages, ranges, or a mix — and downloading the trimmed file, all in your browser with no upload and no watermark.',
    productId: 'pyntra',
    productName: 'Free Tools',
    kind: 'How-To',
    keywords: ['how to delete pages from pdf', 'remove pages from pdf', 'delete pdf pages free', 'trim pdf pages', 'remove page from pdf without upload'],
    readingMinutes: 5,
  }),

  // ── GridStorm ──────────────────────────────────────────────────────────
  article({
    slug: 'gridstorm-virtual-scrolling-60fps',
    title: 'How GridStorm Renders 100K Rows at 60fps',
    description:
      'A deep dive into GridStorm’s virtual scrolling engine: windowing, row recycling, and the render budget that keeps 100,000+ rows smooth at 60fps.',
    productId: 'gridstorm',
    productName: 'GridStorm',
    kind: 'Architecture',
    keywords: ['virtual scrolling', 'react data grid performance', 'windowing', 'GridStorm', '60fps grid', 'row recycling'],
    readingMinutes: 9,
  }),
  article({
    slug: 'gridstorm-vs-ag-grid-migration',
    title: 'GridStorm vs AG Grid: Feature Comparison and Migration Guide',
    description:
      'A practical, honest comparison of GridStorm and AG Grid — licensing, bundle size, plugins, accessibility — plus a step-by-step migration path.',
    productId: 'gridstorm',
    productName: 'GridStorm',
    kind: 'Comparison',
    keywords: ['GridStorm vs AG Grid', 'AG Grid alternative', 'data grid migration', 'free data grid', 'react grid comparison'],
    readingMinutes: 11,
  }),
  article({
    slug: 'gridstorm-financial-trading-grid',
    title: 'Building a Real-Time Financial Trading Grid with GridStorm',
    description:
      'How to build a high-frequency trading blotter with GridStorm: streaming cell updates, flash highlighting, conditional formatting, and frozen columns.',
    productId: 'gridstorm',
    productName: 'GridStorm',
    kind: 'Use Case',
    keywords: ['trading grid', 'real-time data grid', 'financial dashboard react', 'GridStorm trading', 'streaming grid updates'],
    readingMinutes: 10,
  }),
  article({
    slug: 'gridstorm-plugin-architecture',
    title: 'Inside GridStorm’s 35-Plugin Architecture',
    description:
      'GridStorm ships a headless core and 35 composable plugins. Here is how the plugin system works and how to build your own.',
    productId: 'gridstorm',
    productName: 'GridStorm',
    kind: 'Architecture',
    keywords: ['GridStorm plugins', 'headless data grid', 'plugin architecture', 'composable grid', 'extensible data table'],
    readingMinutes: 9,
  }),
  article({
    slug: 'gridstorm-excel-formulas',
    title: 'Excel-Compatible Formulas in GridStorm: 42 Functions in the Browser',
    description:
      'GridStorm implements 42 Excel-compatible formula functions with a real dependency graph and copy/paste type coercion. Here is how the formula engine works.',
    productId: 'gridstorm',
    productName: 'GridStorm',
    kind: 'Feature Deep-Dive',
    keywords: ['excel formulas in javascript', 'spreadsheet grid', 'GridStorm formulas', 'formula engine', 'excel copy paste grid'],
    readingMinutes: 9,
  }),
  article({
    slug: 'gridstorm-accessible-data-grid',
    title: 'Making Data Grids WCAG-Accessible with GridStorm',
    description:
      'Data grids are notoriously hard to make accessible. GridStorm’s a11y plugin delivers WCAG 2.1 AA — keyboard nav, ARIA grid roles, and screen-reader support.',
    productId: 'gridstorm',
    productName: 'GridStorm',
    kind: 'Accessibility',
    keywords: ['accessible data grid', 'WCAG data table', 'ARIA grid', 'keyboard navigation grid', 'screen reader data grid'],
    readingMinutes: 9,
  }),

  // ── Quantum Vault ──────────────────────────────────────────────────────
  article({
    slug: 'quantum-vault-post-quantum-tokens-explained',
    title: 'Post-Quantum Tokens Explained: ML-DSA-87 (Dilithium) in Quantum Vault',
    description:
      'What post-quantum tokens are, why Q-Day threatens today’s cryptography, and how Quantum Vault uses NIST-standardised CRYSTALS-Dilithium (ML-DSA-87 / FIPS 204) signatures to stay safe.',
    productId: 'quantum-vault',
    productName: 'Quantum Vault',
    kind: 'Explainer',
    keywords: ['post-quantum cryptography', 'CRYSTALS-Dilithium', 'ML-DSA-87', 'Q-Day', 'Quantum Vault', 'NIST PQC', 'FIPS 204', 'ML-DSA', 'XChaCha20'],
    readingMinutes: 13,
  }),
  article({
    slug: 'quantum-vault-migrate-pqc-token-issuance',
    title: 'Migrating Token Issuance to Post-Quantum Crypto with Quantum Vault',
    description:
      'A migration playbook for moving JWT/RSA-style token issuance to quantum-resistant signatures using Quantum Vault, with a hybrid transition strategy.',
    productId: 'quantum-vault',
    productName: 'Quantum Vault',
    kind: 'Migration',
    keywords: ['post-quantum migration', 'quantum-resistant tokens', 'JWT alternative', 'crypto agility', 'Quantum Vault migration'],
    readingMinutes: 10,
  }),
  article({
    slug: 'quantum-vault-sovereign-token-verification',
    title: 'Sovereign, Self-Hosted Token Verification with Quantum Vault',
    description:
      'Why sovereignty matters for cryptographic infrastructure and how to run self-hosted, no-third-party-trust token issuance and verification with Quantum Vault.',
    productId: 'quantum-vault',
    productName: 'Quantum Vault',
    kind: 'Use Case',
    keywords: ['sovereign identity', 'self-hosted tokens', 'no third party trust', 'Quantum Vault', 'token verification'],
    readingMinutes: 9,
  }),

  // ── Tekivex UI ─────────────────────────────────────────────────────────
  article({
    slug: 'tekivex-ui-vs-mui-chakra',
    title: 'Tekivex UI vs MUI vs Chakra: An Honest Comparison',
    description:
      'How Tekivex UI compares with Material UI and Chakra on bundle size, theming, accessibility, and headless flexibility — with guidance on when to pick which.',
    productId: 'tekivex-ui',
    productName: 'Tekivex UI',
    kind: 'Comparison',
    keywords: ['Tekivex UI vs MUI', 'Chakra alternative', 'react component library comparison', 'headless UI', 'UI library bundle size'],
    readingMinutes: 11,
  }),
  article({
    slug: 'tekivex-ui-headless-design-system',
    title: 'Tree-Shakeable, Headless Components: The Tekivex UI Design System',
    description:
      'Tekivex UI ships headless primitives with zero runtime dependencies and tree-shakeable ESM. Here is the design-system philosophy and how to compose it.',
    productId: 'tekivex-ui',
    productName: 'Tekivex UI',
    kind: 'Architecture',
    keywords: ['headless components', 'design system', 'tree-shakeable UI', 'Tekivex UI', 'zero dependency components', 'CSS custom properties theming', 'design tokens', 'high contrast theme'],
    readingMinutes: 13,
  }),
  article({
    slug: 'tekivex-ui-accessible-forms',
    title: 'Building Accessible Forms with Tekivex UI Primitives',
    description:
      'Accessible forms are hard: labels, error states, ARIA, focus management. Tekivex UI’s form toolkit handles them so you ship WCAG-compliant forms faster.',
    productId: 'tekivex-ui',
    productName: 'Tekivex UI',
    kind: 'Accessibility',
    keywords: ['accessible forms react', 'form validation', 'ARIA forms', 'Tekivex UI forms', 'WCAG forms'],
    readingMinutes: 9,
  }),

  // ── Platform / cross-product ───────────────────────────────────────────
  article({
    slug: 'tekivex-stack-how-products-fit',
    title: 'The Tekivex Stack: How the Products Fit Together',
    description:
      'GridStorm, Tekivex UI, and Quantum Vault are designed to compose. Here is how the pieces fit into one application stack.',
    productId: 'gridstorm',
    productName: 'Tekivex Platform',
    kind: 'Overview',
    keywords: ['Tekivex stack', 'developer tools platform', 'free stack', 'react enterprise tools', 'Tekivex products'],
    readingMinutes: 8,
  }),
  article({
    slug: 'tekivex-mit-open-source-model',
    title: 'Why Tekivex Products Are Free to Use: No Paywall, No Per-Seat Fees',
    description:
      'No enterprise tier, no paywall, no per-seat fees — every Tekivex product is free to use, including commercially. Here is the reasoning and what it means for your team.',
    productId: 'gridstorm',
    productName: 'Tekivex Platform',
    kind: 'Overview',
    keywords: ['free for commercial use', 'Tekivex pricing', 'no paywall', 'free developer tools'],
    readingMinutes: 7,
  }),

];

export function getAllArticles(): Article[] {
  return ARTICLES;
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByProduct(productName: string): Article[] {
  return ARTICLES.filter((a) => a.productName === productName);
}

/** Articles anchored to a specific product id (for cross-linking from product pages). */
export function getArticlesForProductId(productId: string): Article[] {
  return ARTICLES.filter((a) => a.productId === productId);
}

/** Group articles by product name, preserving first-seen order. */
export function getArticlesGroupedByProduct(): { product: string; articles: Article[] }[] {
  const order: string[] = [];
  const map = new Map<string, Article[]>();
  for (const a of ARTICLES) {
    if (!map.has(a.productName)) {
      map.set(a.productName, []);
      order.push(a.productName);
    }
    map.get(a.productName)!.push(a);
  }
  return order.map((product) => ({ product, articles: map.get(product)! }));
}
