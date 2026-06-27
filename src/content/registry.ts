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
  'pyntra-client-side-pdf-editing': 'seema-almas-shaikh',
  'pyntra-vs-pdfjs-puppeteer': 'seema-almas-shaikh',
  'pyntra-headless-react-pdf-hooks': 'seema-almas-shaikh',
  'analytics-studio-drag-drop-dashboards': 'seema-almas-shaikh',
  'analytics-studio-in-browser-sql': 'chandan-kumar',
  'analytics-studio-chart-types-guide': 'seema-almas-shaikh',
  'analytics-studio-vs-metabase-looker': 'seema-almas-shaikh',
  'quantum-vault-post-quantum-tokens-explained': 'chandan-kumar',
  'quantum-vault-migrate-pqc-token-issuance': 'chandan-kumar',
  'quantum-vault-sovereign-token-verification': 'chandan-kumar',
  'dataflow-realtime-streaming-react': 'chandan-kumar',
  'dataflow-backpressure-time-travel-replay': 'chandan-kumar',
  'dataflow-anomaly-detection-streams': 'chandan-kumar',
  'tekivex-ui-vs-mui-chakra': 'seema-almas-shaikh',
  'tekivex-ui-headless-design-system': 'seema-almas-shaikh',
  'tekivex-ui-accessible-forms': 'seema-almas-shaikh',
  'tekivex-stack-how-products-fit': 'chandan-kumar',
  'tekivex-mit-open-source-model': 'chandan-kumar',
};

const DEFAULT_AUTHOR_ID = 'chandan-kumar';

// Editorial calendar. Each guide carries its own publish date, and a modified
// date where the piece was later revised.
const DATES: Record<string, { published: string; modified?: string }> = {
  // 2025 — foundational & GridStorm
  'tekivex-mit-open-source-model':                 { published: '2025-09-09', modified: '2026-02-11' },
  'tekivex-stack-how-products-fit':                { published: '2025-09-23', modified: '2026-03-04' },
  'gridstorm-virtual-scrolling-60fps':             { published: '2025-10-07', modified: '2026-04-15' },
  'gridstorm-plugin-architecture':                 { published: '2025-10-21' },
  'gridstorm-vs-ag-grid-migration':                { published: '2025-11-04', modified: '2026-05-12' },
  'gridstorm-accessible-data-grid':                { published: '2025-11-18' },
  'gridstorm-excel-formulas':                      { published: '2025-12-02' },
  'gridstorm-financial-trading-grid':              { published: '2025-12-16' },
  // 2026 — Tekivex UI
  'tekivex-ui-headless-design-system':             { published: '2026-01-06' },
  'tekivex-ui-vs-mui-chakra':                      { published: '2026-01-20' },
  'tekivex-ui-accessible-forms':                   { published: '2026-02-03' },
  // 2026 — Pyntra
  'pyntra-client-side-pdf-editing':                { published: '2026-02-17' },
  'pyntra-vs-pdfjs-puppeteer':                     { published: '2026-03-03' },
  'pyntra-headless-react-pdf-hooks':               { published: '2026-03-17' },
  // 2026 — Analytics Studio
  'analytics-studio-drag-drop-dashboards':         { published: '2026-03-31' },
  'analytics-studio-in-browser-sql':               { published: '2026-04-14' },
  'analytics-studio-chart-types-guide':            { published: '2026-04-21' },
  'analytics-studio-vs-metabase-looker':           { published: '2026-04-28' },
  // 2026 — Quantum Vault
  'quantum-vault-post-quantum-tokens-explained':   { published: '2026-05-05' },
  'quantum-vault-migrate-pqc-token-issuance':      { published: '2026-05-19' },
  'quantum-vault-sovereign-token-verification':    { published: '2026-05-26' },
  // 2026 — DataFlow
  'dataflow-realtime-streaming-react':             { published: '2026-06-02' },
  'dataflow-backpressure-time-travel-replay':      { published: '2026-06-09' },
  'dataflow-anomaly-detection-streams':            { published: '2026-06-16' },
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
    keywords: ['GridStorm vs AG Grid', 'AG Grid alternative', 'data grid migration', 'open source data grid', 'react grid comparison'],
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

  // ── Pyntra ─────────────────────────────────────────────────────────────
  article({
    slug: 'pyntra-client-side-pdf-editing',
    title: 'Client-Side PDF Editing Without a Server: The Pyntra Approach',
    description:
      'Pyntra edits, fills, signs, and encrypts PDFs entirely in the browser — no upload, no server round-trip. Here is the architecture that makes it private and fast.',
    productId: 'pyntra',
    productName: 'Pyntra',
    kind: 'Architecture',
    keywords: ['client-side PDF editor', 'browser PDF editing', 'Pyntra', 'no server PDF', 'private PDF editor', 'fill PDF form browser', 'sign PDF react', 'AES-256 PDF'],
    readingMinutes: 12,
  }),
  article({
    slug: 'pyntra-vs-pdfjs-puppeteer',
    title: 'Pyntra vs PDF.js vs Puppeteer: Choosing a PDF Stack',
    description:
      'When do you reach for Pyntra, PDF.js, or server-side Puppeteer? A clear breakdown of viewing vs editing vs generation, and the trade-offs of each.',
    productId: 'pyntra',
    productName: 'Pyntra',
    kind: 'Comparison',
    keywords: ['Pyntra vs PDF.js', 'puppeteer PDF', 'PDF library comparison', 'edit PDF javascript', 'PDF stack'],
    readingMinutes: 10,
  }),
  article({
    slug: 'pyntra-headless-react-pdf-hooks',
    title: 'Headless React PDF Hooks: Building a Custom Viewer with Pyntra',
    description:
      'Pyntra exposes headless hooks and a bring-your-own-UI adapter. Build a fully custom PDF viewer and editor with Material UI, Tekivex UI, or your own components.',
    productId: 'pyntra',
    productName: 'Pyntra',
    kind: 'Feature Deep-Dive',
    keywords: ['headless PDF hooks', 'react PDF viewer', 'bring your own UI', 'Pyntra adapter', 'custom PDF editor react'],
    readingMinutes: 9,
  }),

  // ── Analytics Studio ───────────────────────────────────────────────────
  article({
    slug: 'analytics-studio-drag-drop-dashboards',
    title: 'Building Drag-and-Drop Dashboards with Analytics Studio',
    description:
      'Create pivot tables, KPI tiles, and 26+ chart types by dragging fields — no backend, no SQL required. A tour of the Analytics Studio dashboard builder.',
    productId: 'analytics-studio',
    productName: 'Analytics Studio',
    kind: 'Use Case',
    keywords: ['drag drop dashboard', 'BI dashboard builder', 'pivot table', 'Analytics Studio', 'no-code analytics'],
    readingMinutes: 9,
  }),
  article({
    slug: 'analytics-studio-in-browser-sql',
    title: 'In-Browser SQL on Live Data: How Analytics Studio Works',
    description:
      'Analytics Studio runs SELECT / WHERE / GROUP BY / JOIN entirely in the browser with no server. Here is how the in-browser SQL engine is built.',
    productId: 'analytics-studio',
    productName: 'Analytics Studio',
    kind: 'Architecture',
    keywords: ['in-browser SQL', 'client-side SQL engine', 'query data javascript', 'Analytics Studio SQL', 'no backend BI'],
    readingMinutes: 9,
  }),
  article({
    slug: 'analytics-studio-chart-types-guide',
    title: 'Choosing Among 26+ Chart Types in Analytics Studio',
    description:
      'Bar, line, scatter, radar, heatmap, treemap, sankey and more — a practical guide to picking the right visualization for your data in Analytics Studio.',
    productId: 'analytics-studio',
    productName: 'Analytics Studio',
    kind: 'Feature Deep-Dive',
    keywords: ['chart types guide', 'data visualization', 'choosing charts', 'Analytics Studio charts', 'heatmap treemap sankey'],
    readingMinutes: 10,
  }),
  article({
    slug: 'analytics-studio-vs-metabase-looker',
    title: 'Analytics Studio vs Metabase and Looker for Embedded BI',
    description:
      'A comparison of Analytics Studio against Metabase and Looker for embedding analytics in your app — deployment, cost, and the no-backend advantage.',
    productId: 'analytics-studio',
    productName: 'Analytics Studio',
    kind: 'Comparison',
    keywords: ['Analytics Studio vs Metabase', 'embedded BI', 'Looker alternative', 'embed analytics react', 'BI tool comparison'],
    readingMinutes: 10,
  }),

  // ── Quantum Vault ──────────────────────────────────────────────────────
  article({
    slug: 'quantum-vault-post-quantum-tokens-explained',
    title: 'Post-Quantum Tokens Explained: Kyber and Dilithium in Quantum Vault',
    description:
      'What post-quantum tokens are, why Q-Day threatens today’s cryptography, and how Quantum Vault uses CRYSTALS-Kyber and Dilithium (FIPS 203/204) to stay safe.',
    productId: 'quantum-vault',
    productName: 'Quantum Vault',
    kind: 'Explainer',
    keywords: ['post-quantum cryptography', 'CRYSTALS-Kyber', 'Dilithium', 'Q-Day', 'Quantum Vault', 'NIST PQC', 'FIPS 203', 'FIPS 204', 'ML-KEM', 'ML-DSA'],
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

  // ── DataFlow ───────────────────────────────────────────────────────────
  article({
    slug: 'dataflow-realtime-streaming-react',
    title: 'Real-Time Streaming in React with DataFlow (WebSocket and SSE)',
    description:
      'Wire up live WebSocket and Server-Sent Events streams in React with DataFlow — connection management, reconnection, and rendering high-frequency updates.',
    productId: 'dataflow',
    productName: 'DataFlow',
    kind: 'Use Case',
    keywords: ['real-time streaming react', 'WebSocket react', 'server-sent events', 'DataFlow', 'live data react'],
    readingMinutes: 9,
  }),
  article({
    slug: 'dataflow-backpressure-time-travel-replay',
    title: 'Backpressure and Time-Travel Replay in DataFlow',
    description:
      'High-frequency streams overwhelm UIs. DataFlow’s backpressure and time-travel replay let you throttle, buffer, and rewind live data without dropping state.',
    productId: 'dataflow',
    productName: 'DataFlow',
    kind: 'Architecture',
    keywords: ['backpressure', 'time-travel replay', 'stream throttling', 'DataFlow', 'event replay'],
    readingMinutes: 9,
  }),
  article({
    slug: 'dataflow-anomaly-detection-streams',
    title: 'Anomaly Detection on Live Streams with DataFlow',
    description:
      'Detect spikes, drops, and outliers on streaming data in real time with DataFlow’s built-in anomaly detection — thresholds, rolling statistics, and alerts.',
    productId: 'dataflow',
    productName: 'DataFlow',
    kind: 'Feature Deep-Dive',
    keywords: ['anomaly detection', 'streaming analytics', 'real-time alerts', 'DataFlow', 'outlier detection'],
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
      'GridStorm, Pyntra, Analytics Studio, DataFlow, Quantum Vault, and Tekivex UI are designed to compose. Here is how the pieces fit into one application stack.',
    productId: 'gridstorm',
    productName: 'Tekivex Platform',
    kind: 'Overview',
    keywords: ['Tekivex stack', 'developer tools platform', 'open source stack', 'react enterprise tools', 'Tekivex products'],
    readingMinutes: 8,
  }),
  article({
    slug: 'tekivex-mit-open-source-model',
    title: 'Why Everything Is MIT-Licensed: The Tekivex Open-Source Model',
    description:
      'No enterprise tier, no paywall, no per-seat fees — every Tekivex product is MIT-licensed. Here is the reasoning and what it means for commercial use.',
    productId: 'gridstorm',
    productName: 'Tekivex Platform',
    kind: 'Overview',
    keywords: ['MIT license', 'open source business model', 'free for commercial use', 'Tekivex licensing', 'no paywall'],
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
