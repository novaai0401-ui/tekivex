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
