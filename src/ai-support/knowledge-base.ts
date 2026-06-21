/**
 * Tekivex AI Support — Knowledge Base
 * Zero-API, client-side Q&A for all Tekivex products.
 *
 * Each entry has:
 *   - id          unique key
 *   - category    product or topic grouping
 *   - questions   synonymous phrasings (used for TF-IDF + keyword matching)
 *   - answer      markdown-ready response text
 *   - tags        extra keywords boosting relevance
 */

export type Category =
  | 'general'
  | 'gridstorm'
  | 'pdf-toolkit'
  | 'nexa-recruit'
  | 'nexa-care'
  | 'analytics-studio'
  | 'pricing'
  | 'getting-started'
  | 'troubleshooting';

export interface KbEntry {
  id: string;
  category: Category;
  questions: string[];
  answer: string;
  tags: string[];
}

// ─────────────────────────────────────────────
// KNOWLEDGE BASE — 60+ entries
// ─────────────────────────────────────────────
export const KNOWLEDGE_BASE: KbEntry[] = [

  // ══════════════════════════════════════
  // GENERAL / COMPANY
  // ══════════════════════════════════════

  {
    id: 'what-is-tekivex',
    category: 'general',
    questions: [
      'What is Tekivex?',
      'Tell me about Tekivex',
      'What does Tekivex do?',
      'Who makes these products?',
      'What company is this?',
    ],
    answer: `**Tekivex** is a developer tools company building next-generation open-source and enterprise software products.

Our product portfolio includes:
- 🟦 **GridStorm** — Enterprise data grid (GA, MIT-licensed, free)
- 📄 **PDF Toolkit** — WASM-powered PDF processing (Beta, enterprise tier)
- 👥 **NexaRecruit** — AI-powered ATS & resume builder (Coming Soon)
- 🏥 **NexaCare** — Healthcare platform (Coming Soon)
- 📊 **Analytics Studio** — Self-service analytics (Coming Soon)
- 🔄 **DataFlow** — Real-time streaming (Coming Soon)

We believe enterprise-grade software should be accessible to every team regardless of budget.`,
    tags: ['tekivex', 'company', 'about', 'products', 'portfolio'],
  },

  {
    id: 'products-overview',
    category: 'general',
    questions: [
      'What products does Tekivex offer?',
      'Show me all products',
      'List all Tekivex products',
      'What can I build with Tekivex?',
    ],
    answer: `Tekivex currently offers the following products:

| Product | Status | Description |
|---------|--------|-------------|
| GridStorm | ✅ GA | Enterprise data grid — 35 plugins, WCAG 2.1 AA |
| PDF Toolkit | 🧪 Beta | WASM PDF renderer, annotations, PII masking |
| NexaRecruit | 🔜 Soon | AI-powered applicant tracking system |
| NexaCare | 🔜 Soon | Healthcare management platform |
| Analytics Studio | 🔜 Soon | Self-service BI & analytics |
| DataFlow | 🔜 Soon | Real-time event streaming |

Visit each product page for demos, docs, and quick-start guides.`,
    tags: ['products', 'list', 'overview', 'all'],
  },

  {
    id: 'open-source',
    category: 'general',
    questions: [
      'Is Tekivex open source?',
      'Are the products free?',
      'What is the license?',
      'MIT license',
      'Can I use it for free?',
    ],
    answer: `**GridStorm** is fully **MIT-licensed** — free for personal and commercial use, forever. No per-developer fees, no licensing servers.

**PDF Toolkit** has an enterprise tier — the core API is open-source, advanced features (PII detection, digital signatures, bulk processing) are enterprise.

Upcoming products (NexaRecruit, NexaCare, Analytics Studio) will follow the same open-core model: free community edition + optional enterprise features.

Report issues at **github.com/novaai0401-ui/tekivex-issue-report/issues**.`,
    tags: ['license', 'MIT', 'free', 'open source', 'cost', 'pricing'],
  },

  // ══════════════════════════════════════
  // GRIDSTORM
  // ══════════════════════════════════════

  {
    id: 'gridstorm-what-is',
    category: 'gridstorm',
    questions: [
      'What is GridStorm?',
      'Tell me about GridStorm',
      'What does the data grid do?',
      'GridStorm overview',
    ],
    answer: `**GridStorm** is an open-source enterprise data grid built for modern web applications.

**Key highlights:**
- ⚡ Virtual scrolling — 100,000+ rows at 60fps
- 🔌 35 composable plugins (sorting, filtering, grouping, pivoting, charts, and more)
- ♿ WCAG 2.1 AA accessibility (screen readers, keyboard navigation)
- 🔢 42 Excel-compatible formula functions
- 📋 True Excel copy/paste with type coercion
- 🎨 Framework-agnostic: React, Vue, Svelte, Angular
- 📦 <50KB core bundle
- 📝 Comprehensive automated test suite
- 🆓 MIT license — free forever

**Compared to AG Grid Enterprise ($999/dev/yr):** GridStorm provides the same enterprise features for $0.`,
    tags: ['gridstorm', 'data grid', 'react grid', 'table', 'virtual scroll'],
  },

  {
    id: 'gridstorm-install',
    category: 'gridstorm',
    questions: [
      'How do I install GridStorm?',
      'GridStorm installation',
      'npm install gridstorm',
      'Getting started with GridStorm',
      'How to add GridStorm to my project',
      'Setup GridStorm',
    ],
    answer: `**Install GridStorm in 3 steps:**

\`\`\`bash
# 1. Install packages
npm install @gridstorm/core @gridstorm/react @gridstorm/theme-default

# 2. Import the theme in your app entry
import '@gridstorm/theme-default/dist/index.css';

# 3. Use the component
import { GridStorm } from '@gridstorm/react';
\`\`\`

**Minimal example:**
\`\`\`tsx
<GridStorm
  columns={[
    { id: 'name', header: 'Name', width: 200 },
    { id: 'revenue', header: 'Revenue', width: 120 }
  ]}
  rows={myData}
/>
\`\`\`

See the [full documentation](https://gridstorm.tekivex.com/#/docs/getting-started/introduction) for plugin setup, theming, and advanced configuration.`,
    tags: ['install', 'npm', 'setup', 'quickstart', 'getting started'],
  },

  {
    id: 'gridstorm-plugins',
    category: 'gridstorm',
    questions: [
      'What plugins does GridStorm have?',
      'GridStorm plugin list',
      'What features are available as plugins?',
      'How many plugins?',
      'Plugin system',
    ],
    answer: `GridStorm ships **35 composable plugins** across 3 tiers:

**Tier 1 — Core (Open Source)**
sorting · filtering · selection · editing · pagination · column-pinning · column-resize · column-reorder · context-menu · clipboard

**Tier 2 — Enterprise**
grouping · aggregation · pivoting · master-detail · tree-data · row-reorder · excel-export · pdf-export · sparklines · charts · server-side row model (SSRM)

**Tier 3 — Next-Gen**
status-bar · state-persistence · column-autosize · row-pinning · conditional-formatting · streaming · ai

**Accessibility & Formula Plugins (NEW)**
plugin-a11y (WCAG 2.1 AA) · plugin-formula · plugin-formula-engine (42 functions) · plugin-clipboard-pro

Plugins are installed independently and loaded on demand — your bundle only includes what you use.`,
    tags: ['plugins', 'features', 'sorting', 'filtering', 'grouping', 'pivoting'],
  },

  {
    id: 'gridstorm-performance',
    category: 'gridstorm',
    questions: [
      'How fast is GridStorm?',
      'GridStorm performance',
      'Can it handle large datasets?',
      'How many rows can GridStorm handle?',
      'Virtual scroll performance',
      '100k rows',
      'million rows',
    ],
    answer: `**GridStorm is engineered for extreme performance:**

- **100,000+ rows at 60fps** via virtual scrolling (only renders visible rows)
- **<16ms frame budget** — optimized DOM batch updates
- **<50KB core bundle** — lazy-loaded plugins
- **Sub-millisecond sort** on 100K rows with typed arrays
- **Streaming plugin** — handles live data with batched cell updates at 60fps
- **Server-Side Row Model (SSRM)** — lazy-load millions of rows on demand

The virtual scroller maintains a fixed DOM regardless of dataset size. On a mid-range laptop, GridStorm renders 1M rows with SSRM without any lag.`,
    tags: ['performance', 'speed', 'rows', 'virtual scroll', 'large data'],
  },

  {
    id: 'gridstorm-accessibility',
    category: 'gridstorm',
    questions: [
      'Is GridStorm accessible?',
      'WCAG compliance',
      'Screen reader support',
      'Keyboard navigation',
      'ADA compliance',
      'ARIA',
      'accessibility',
    ],
    answer: `**GridStorm achieves WCAG 2.1 AA compliance** through the \`plugin-a11y\` plugin:

**Keyboard Navigation**
- Arrow keys — cell navigation
- Tab / Shift+Tab — column traversal
- Enter — start/stop editing
- Escape — cancel / close menus
- Space — select row
- Home/End — first/last cell in row

**Screen Reader Support**
- \`role="grid"\` with aria-rowcount, aria-colcount
- \`aria-sort\` on sortable columns
- \`aria-selected\`, \`aria-expanded\` on rows
- Live region announcements for sort, filter, selection changes
- Skip-navigation links

**Visual Accessibility**
- High-contrast mode (prefers-contrast: more)
- Windows forced-colors support
- Respects prefers-reduced-motion
- 4.5:1 minimum color contrast ratio

This satisfies procurement requirements for government, healthcare, and education customers (ADA, Section 508, EN 301 549).`,
    tags: ['accessibility', 'WCAG', 'a11y', 'screen reader', 'keyboard', 'ADA'],
  },

  {
    id: 'gridstorm-formulas',
    category: 'gridstorm',
    questions: [
      'Does GridStorm support formulas?',
      'Excel formulas in GridStorm',
      'VLOOKUP in GridStorm',
      'SUM formula',
      'Formula engine',
      'Spreadsheet formulas',
      'SUMIF COUNTIF',
    ],
    answer: `**GridStorm includes a full Excel-compatible formula engine** via \`plugin-formula\` + \`plugin-formula-engine\`:

**42 supported functions:**

*Conditional:* SUMIF, COUNTIF, AVERAGEIF, SUMIFS, COUNTIFS, IFS, SWITCH
*Lookup:* VLOOKUP, HLOOKUP, XLOOKUP, INDEX, MATCH
*Math:* SUM, AVERAGE, MIN, MAX, COUNT, ROUND, ABS, ROUNDUP, ROUNDDOWN, CEILING, FLOOR, SIGN, LOG, LN, EXP, PI, PRODUCT, SUMPRODUCT
*Text:* LEN, UPPER, LOWER, TRIM, CONCAT, LEFT, RIGHT, MID, FIND, SEARCH, REPLACE, PROPER
*Date:* DATE, TODAY, NOW, YEAR, MONTH, DAY
*Info:* IF, AND, OR, NOT, ISBLANK, ISNUMBER, ISTEXT, ISERROR

**Advanced features:**
- Named ranges: \`=SUM(Revenue)\`
- Array formulas: \`{=SUM(A1:A10*B1:B10)}\`
- Absolute & relative references: \`$A$1\`, \`A1\`, \`$A1\`
- Circular dependency detection
- Auto-recalculation on cell change`,
    tags: ['formula', 'VLOOKUP', 'SUMIF', 'Excel', 'calculation', 'spreadsheet'],
  },

  {
    id: 'gridstorm-vs-aggrid',
    category: 'gridstorm',
    questions: [
      'GridStorm vs AG Grid',
      'How does GridStorm compare to AG Grid?',
      'Should I use GridStorm or AG Grid?',
      'AG Grid alternative',
      'AG Grid free alternative',
      'Replace AG Grid',
    ],
    answer: `**GridStorm vs AG Grid Enterprise ($999/dev/yr):**

| Feature | GridStorm | AG Grid Community | AG Grid Enterprise |
|---------|-----------|------------------|-------------------|
| Price | **Free (MIT)** | Free | $999/dev/yr |
| Virtual Scroll | ✅ | ✅ | ✅ |
| WCAG 2.1 AA | ✅ | ❌ | ✅ |
| Excel Formulas | ✅ 42 functions | ❌ | ✅ |
| Excel Copy/Paste | ✅ | Basic | ✅ |
| Pivoting | ✅ | ❌ | ✅ |
| Server-Side RM | ✅ | ❌ | ✅ |
| Streaming | ✅ | ❌ | ✅ |
| Bundle size | <50KB core | ~300KB | ~300KB |
| Framework support | React, Vue, Svelte, Angular | Same | Same |

GridStorm provides AG Grid Enterprise feature parity at **$0 per developer**.`,
    tags: ['AG Grid', 'comparison', 'alternative', 'vs', 'pricing'],
  },

  {
    id: 'gridstorm-frameworks',
    category: 'gridstorm',
    questions: [
      'Does GridStorm work with Vue?',
      'GridStorm React',
      'GridStorm Vue',
      'GridStorm Svelte',
      'GridStorm Angular',
      'Framework support',
      'Vanilla JS GridStorm',
    ],
    answer: `**GridStorm is fully framework-agnostic** and ships official adapters for all major frameworks:

- **React** — \`@gridstorm/react\` (React 18+, hooks-first API)
- **Vue** — \`@gridstorm/vue\` (Vue 3, composables: \`useGrid\`, \`useKpi\`, \`usePivot\`)
- **Svelte** — \`@gridstorm/svelte\` (Svelte 4/5, stores: \`createGridStore\`)
- **Angular** — \`@gridstorm/angular\` (Angular 16+, standalone components)
- **Vanilla JS** — Use \`@gridstorm/core\` + \`@gridstorm/dom-renderer\` directly

The headless core engine (\`@gridstorm/core\`) works in any JavaScript environment — Node.js, web workers, and server-side rendering.`,
    tags: ['React', 'Vue', 'Svelte', 'Angular', 'framework', 'vanilla JS'],
  },

  {
    id: 'gridstorm-themes',
    category: 'gridstorm',
    questions: [
      'GridStorm themes',
      'Dark mode GridStorm',
      'How to customize GridStorm appearance?',
      'CSS variables GridStorm',
      'Styling GridStorm',
      'Custom theme',
    ],
    answer: `**GridStorm theming is powered by CSS custom properties** — zero JavaScript dependency.

**Built-in themes:**
- Light (default)
- Dark
- High-contrast (WCAG AAA)

**Density modes:**
- Comfortable (default)
- Compact
- Spacious

**Switching themes at runtime:**
\`\`\`js
// Dark mode
document.documentElement.setAttribute('data-gs-theme', 'dark');

// Compact density
document.documentElement.setAttribute('data-gs-density', 'compact');
\`\`\`

**Custom theme (CSS variables):**
\`\`\`css
:root {
  --gs-header-bg: #1e293b;
  --gs-header-color: #f1f5f9;
  --gs-cell-height: 36px;
  --gs-accent: #6366f1;
  --gs-border: #334155;
}
\`\`\`

All 80+ tokens are documented in the [theme reference](https://gridstorm.tekivex.com/#/docs).`,
    tags: ['theme', 'dark mode', 'CSS', 'styling', 'customize', 'appearance'],
  },

  {
    id: 'gridstorm-excel-export',
    category: 'gridstorm',
    questions: [
      'Export to Excel from GridStorm',
      'Download CSV from GridStorm',
      'XLSX export',
      'Excel download',
      'Export data',
    ],
    answer: `**GridStorm supports multiple export formats** via dedicated plugins:

**plugin-excel-export** — Generates real \`.xlsx\` files with:
- All visible columns & rows (or custom range)
- Column headers
- Cell formatting preserved
- Merged header cells for grouped columns
- Sheet naming

**plugin-pdf-export** — Generates styled PDF tables:
- Respects current sort/filter/grouping
- Page headers & footers
- Configurable paper size (A4, Letter, etc.)

**Usage:**
\`\`\`js
// Excel
grid.dispatch('excel-export:download', { filename: 'report.xlsx' });

// PDF
grid.dispatch('pdf-export:download', { filename: 'report.pdf', pageSize: 'A4' });
\`\`\`

Both plugins work with any current view state — filtered, sorted, grouped data.`,
    tags: ['export', 'Excel', 'XLSX', 'CSV', 'PDF', 'download'],
  },

  {
    id: 'gridstorm-charts',
    category: 'gridstorm',
    questions: [
      'Charts in GridStorm',
      'Data visualization GridStorm',
      'Bar chart GridStorm',
      'plugin-charts',
      'How to add charts?',
      'Sparklines',
    ],
    answer: `**GridStorm offers two chart integrations:**

**plugin-sparklines** — Inline cell-level charts:
- Line, bar, area, win/loss sparklines
- Renders inside grid cells
- Updates live with data changes

**plugin-charts** — Full chart panel alongside the grid:
- 26 chart types: bar, line, area, pie, scatter, bubble, radar, polar, heatmap, treemap, waterfall, funnel, sankey, candlestick, calendar heatmap, and more
- Powered by Recharts (SVG)
- Auto-aggregates data by dimension
- Brush zoom/pan on time series
- Export as PNG

**Usage:**
\`\`\`js
grid.dispatch('charts:open', {
  type: 'bar',
  xKey: 'region',
  series: [{ columnId: 'revenue', label: 'Revenue' }]
});
\`\`\``,
    tags: ['charts', 'visualization', 'bar', 'line', 'sparkline', 'graph'],
  },

  // ══════════════════════════════════════
  // PDF TOOLKIT
  // ══════════════════════════════════════

  {
    id: 'pdf-toolkit-what-is',
    category: 'pdf-toolkit',
    questions: [
      'What is PDF Toolkit?',
      'Tell me about PDF Toolkit',
      'WASM PDF processing',
      'PDF Toolkit overview',
    ],
    answer: `**Tekivex PDF Toolkit** is a WASM-powered PDF processing library for web applications.

**Core capabilities:**
- 🦀 Rust-compiled WASM renderer — no JS PDF libraries
- 🖊️ 13 annotation types (text, highlight, underline, strikethrough, shapes, signatures, stamps, and more)
- 📝 Smart form auto-fill with JSON data binding
- 🔒 PII detection & GDPR-compliant masking
- ✍️ Digital signatures with certificate validation
- 🔐 AES-256 encryption / password protection
- 🤖 AI text extraction & semantic analysis

**Current status:** Beta (v0.1.2) — production-ready for most use cases.

[View Demo](https://gridstorm.tekivex.com/pdf-viewer/) | [Documentation](https://gridstorm.tekivex.com/#/docs/guides/pdf-toolkit)`,
    tags: ['PDF', 'WASM', 'Rust', 'annotation', 'form fill', 'encryption'],
  },

  {
    id: 'pdf-toolkit-pii',
    category: 'pdf-toolkit',
    questions: [
      'PII detection in PDF Toolkit',
      'GDPR PDF masking',
      'Redact sensitive data from PDF',
      'Privacy PDF',
      'Remove personal information from PDF',
    ],
    answer: `**PDF Toolkit PII Detection & Masking:**

Automatically detect and optionally redact Personally Identifiable Information (PII) from PDF documents.

**Detected PII types:**
- Email addresses
- Phone numbers (US, international)
- Social Security Numbers
- Credit card numbers
- Passport numbers
- Date of birth patterns
- IP addresses
- Physical addresses

**Usage:**
\`\`\`js
const result = await pdfToolkit.detectPii(pdfBuffer);
// result.entities: [{ type: 'email', text: '...', page: 1, bounds: {...} }]

// Auto-mask all PII
const maskedPdf = await pdfToolkit.maskPii(pdfBuffer, {
  types: ['email', 'phone', 'ssn'],
  replacement: '████████'
});
\`\`\`

This supports GDPR Article 17 (right to erasure) and HIPAA de-identification workflows.`,
    tags: ['PII', 'GDPR', 'privacy', 'redact', 'mask', 'HIPAA'],
  },

  {
    id: 'pdf-toolkit-signatures',
    category: 'pdf-toolkit',
    questions: [
      'Digital signatures PDF',
      'Sign PDF',
      'PDF signature verification',
      'Certificate PDF',
      'eSign',
    ],
    answer: `**PDF Toolkit Digital Signatures:**

**Signing a PDF:**
\`\`\`js
const signedPdf = await pdfToolkit.sign(pdfBuffer, {
  certificate: myCert,        // X.509 PEM certificate
  privateKey: myPrivateKey,   // PEM private key
  reason: 'Approved by manager',
  location: 'New York, USA',
  signaturePage: 'last',
});
\`\`\`

**Verifying signatures:**
\`\`\`js
const verification = await pdfToolkit.verifySignatures(pdfBuffer);
// { valid: true, signers: [{ name: 'John Doe', timestamp: '...', trusted: true }] }
\`\`\`

Supports:
- Multiple signers / sequential signing workflows
- Timestamp Authority (TSA) integration
- Certificate chain validation
- Long-Term Validation (LTV) profiles`,
    tags: ['signature', 'digital signature', 'sign', 'certificate', 'verify'],
  },

  // ══════════════════════════════════════
  // NEXA RECRUIT
  // ══════════════════════════════════════

  {
    id: 'nexa-recruit-what-is',
    category: 'nexa-recruit',
    questions: [
      'What is NexaRecruit?',
      'Tell me about NexaRecruit',
      'ATS platform Tekivex',
      'Applicant tracking',
      'Resume builder',
      'Hiring software',
    ],
    answer: `**NexaRecruit** is Tekivex's upcoming AI-powered Applicant Tracking System (ATS) and resume builder.

**Planned features:**
- 🤖 AI resume parsing & scoring
- 📊 Candidate pipeline kanban board
- 🔍 Smart candidate search & ranking
- 📧 Automated email sequences
- 📋 Job posting management
- 🎯 Skills-based matching
- 📈 Hiring analytics dashboard
- 📄 AI-powered resume builder for candidates

**Current status:** Coming Soon — join the waitlist at tekivex.com.

NexaRecruit will be built on top of GridStorm (for candidate tables and analytics) and integrate with LinkedIn, Indeed, and other job boards.`,
    tags: ['ATS', 'recruiting', 'hiring', 'resume', 'NexaRecruit', 'HR'],
  },

  // ══════════════════════════════════════
  // NEXA CARE
  // ══════════════════════════════════════

  {
    id: 'nexa-care-what-is',
    category: 'nexa-care',
    questions: [
      'What is NexaCare?',
      'Tell me about NexaCare',
      'Healthcare platform Tekivex',
      'Medical software',
      'Patient management',
    ],
    answer: `**NexaCare** is Tekivex's upcoming healthcare management platform.

**Planned features:**
- 🏥 Patient record management (EHR-compliant)
- 📅 Appointment scheduling & reminders
- 💊 Prescription management
- 🔒 HIPAA-compliant data storage
- 📊 Clinical analytics dashboard
- 🧬 Lab results tracking
- 💳 Insurance billing integration
- 📱 Patient portal (mobile-first)

**Current status:** Coming Soon — designed for clinics, private practices, and telehealth providers.

Built with full HIPAA and GDPR compliance from day one, leveraging PDF Toolkit for document management and GridStorm for clinical data grids.`,
    tags: ['healthcare', 'EHR', 'HIPAA', 'patients', 'medical', 'NexaCare'],
  },

  // ══════════════════════════════════════
  // ANALYTICS STUDIO
  // ══════════════════════════════════════

  {
    id: 'analytics-studio-what-is',
    category: 'analytics-studio',
    questions: [
      'What is Analytics Studio?',
      'Self-service analytics',
      'BI tool Tekivex',
      'Business intelligence',
      'Data analytics platform',
      'dashboard builder',
    ],
    answer: `**Analytics Studio** is Tekivex's upcoming self-service analytics and BI platform.

**Planned features:**
- 🖱️ Drag-and-drop dashboard builder
- 📊 30+ chart types (built on GridStorm charts engine)
- 🔌 Data connectors: SQL, REST API, CSV, Google Sheets, Excel
- 🤖 Natural language queries ("Show me sales by region last quarter")
- 📅 Scheduled reports with email delivery
- 👥 Collaborative dashboards with sharing & comments
- 📱 Mobile-responsive embeddable widgets
- 🔔 KPI alerts & anomaly detection

**Target users:** Business analysts, operations teams, product managers who need insights without writing code.

**Current status:** Coming Soon — [join the waitlist](https://tekivex.com).`,
    tags: ['analytics', 'BI', 'dashboard', 'charts', 'SQL', 'reports'],
  },

  // ══════════════════════════════════════
  // PRICING
  // ══════════════════════════════════════

  {
    id: 'pricing-general',
    category: 'pricing',
    questions: [
      'How much does Tekivex cost?',
      'Pricing plans',
      'Is there a free plan?',
      'Enterprise pricing',
      'Cost of Tekivex products',
      'Subscription price',
    ],
    answer: `**Tekivex Pricing:**

**GridStorm** — **Free forever** (MIT license)
No seat fees, no usage limits, no license servers.
Use in any project, commercial or personal.

**PDF Toolkit** — Enterprise tier
- Community: Free (core rendering, basic annotations)
- Enterprise: Contact us for pricing (PII masking, bulk processing, digital signatures)

**Upcoming products** (NexaRecruit, NexaCare, Analytics Studio):
- Will follow open-core model: free community edition + paid enterprise tier
- Pricing TBD — join waitlist for early adopter pricing

For enterprise licensing, SLAs, or volume discounts, contact **enterprise@tekivex.com**.`,
    tags: ['pricing', 'cost', 'free', 'enterprise', 'subscription', 'license'],
  },

  // ══════════════════════════════════════
  // GETTING STARTED
  // ══════════════════════════════════════

  {
    id: 'getting-started-general',
    category: 'getting-started',
    questions: [
      'How do I get started?',
      'Where to begin?',
      'New to Tekivex',
      'First steps',
      'Quickstart',
    ],
    answer: `**Welcome to Tekivex! Here's how to get started:**

1. **Choose your product** — visit the [product hub](/) to see all available products
2. **GridStorm** (most popular) — \`npm install @gridstorm/core @gridstorm/react\`
3. **Read the docs** — [gridstorm.tekivex.com/#/docs](https://gridstorm.tekivex.com/#/docs)
4. **Try the demo** — [Live Feature Showcase](https://gridstorm.tekivex.com/feature-showcase/)

**5-minute quickstart for GridStorm:**
\`\`\`bash
npm install @gridstorm/core @gridstorm/react @gridstorm/theme-default
\`\`\`
\`\`\`tsx
import { GridStorm } from '@gridstorm/react';
import '@gridstorm/theme-default/dist/index.css';

export default function App() {
  return (
    <GridStorm
      columns={[{ id: 'name', header: 'Name' }, { id: 'value', header: 'Value' }]}
      rows={[{ name: 'Alpha', value: 42 }, { name: 'Beta', value: 99 }]}
    />
  );
}
\`\`\``,
    tags: ['quickstart', 'getting started', 'install', 'first steps'],
  },

  // ══════════════════════════════════════
  // TROUBLESHOOTING
  // ══════════════════════════════════════

  {
    id: 'troubleshoot-build-error',
    category: 'troubleshooting',
    questions: [
      'Build error with GridStorm',
      'TypeScript error GridStorm',
      'Cannot find module gridstorm',
      'Import error',
      'Compilation error',
    ],
    answer: `**Common GridStorm build issues:**

**1. "Cannot find module '@gridstorm/core'"**
\`\`\`bash
# Ensure you've installed all required packages
npm install @gridstorm/core @gridstorm/react @gridstorm/theme-default
\`\`\`

**2. TypeScript errors about JSX**
Add to your tsconfig.json:
\`\`\`json
{ "compilerOptions": { "jsx": "react-jsx" } }
\`\`\`

**3. CSS not loading (unstyled grid)**
\`\`\`ts
// Add to your app entry (main.tsx / index.ts)
import '@gridstorm/theme-default/dist/index.css';
\`\`\`

**4. Plugin not working**
Ensure you've registered the plugin:
\`\`\`ts
import { sortingPlugin } from '@gridstorm/plugin-sorting';
// In GridStorm component:
plugins={[sortingPlugin()]}
\`\`\`

Still stuck? [Open an issue](https://github.com/novaai0401-ui/tekivex-issue-report/issues).`,
    tags: ['error', 'build', 'TypeScript', 'import', 'troubleshoot'],
  },

  {
    id: 'troubleshoot-performance',
    category: 'troubleshooting',
    questions: [
      'GridStorm is slow',
      'Grid lagging with many rows',
      'Performance issue',
      'Slow rendering',
      'Grid freezing',
    ],
    answer: `**GridStorm performance optimization tips:**

**1. Enable virtual scrolling (default — make sure not disabled)**
\`\`\`tsx
<GridStorm virtualScroll={true} rowHeight={36} />
\`\`\`

**2. Set a fixed rowHeight** (avoids layout recalculation)
\`\`\`tsx
rowHeight={36}  // px — skip auto-sizing for best performance
\`\`\`

**3. Use SSRM for server-side datasets >500K rows**
\`\`\`ts
plugins={[ssrmPlugin({ fetchPage: async (params) => fetchData(params) })]}
\`\`\`

**4. Debounce live updates** (streaming data)
\`\`\`ts
plugins={[streamingPlugin({ batchMs: 100 })]}  // batch updates every 100ms
\`\`\`

**5. Avoid inline objects in JSX** (causes re-renders)
\`\`\`tsx
// BAD: new object every render
columns={[{ id: 'name', ... }]}

// GOOD: stable reference
const COLUMNS = [{ id: 'name', ... }];
\`\`\``,
    tags: ['performance', 'slow', 'lag', 'optimization', 'speed'],
  },

  {
    id: 'troubleshoot-sorting',
    category: 'troubleshooting',
    questions: [
      'Sorting not working',
      'Column sort broken',
      'Click header no sort',
      'Sort order wrong',
    ],
    answer: `**Sorting troubleshooting:**

**1. Ensure plugin-sorting is registered:**
\`\`\`ts
import { sortingPlugin } from '@gridstorm/plugin-sorting';
plugins={[sortingPlugin()]}
\`\`\`

**2. Column must have \`sortable: true\` (default for most configs):**
\`\`\`ts
{ id: 'revenue', header: 'Revenue', sortable: true }
\`\`\`

**3. Custom sort comparator:**
\`\`\`ts
{ id: 'date', sortComparator: (a, b) => new Date(a).getTime() - new Date(b).getTime() }
\`\`\`

**4. Programmatic sort:**
\`\`\`ts
grid.dispatch('sort:set', { columnId: 'revenue', direction: 'desc' });
\`\`\`

**5. Multi-column sort** — hold Shift and click multiple headers.`,
    tags: ['sort', 'sorting', 'column', 'broken', 'troubleshoot'],
  },

  {
    id: 'troubleshoot-filter',
    category: 'troubleshooting',
    questions: [
      'Filtering not working',
      'Filter broken',
      'Search not working in grid',
      'Column filter issue',
      'Quick filter not working',
    ],
    answer: `**Filtering troubleshooting:**

**1. Register plugin-filtering:**
\`\`\`ts
import { filteringPlugin } from '@gridstorm/plugin-filtering';
plugins={[filteringPlugin()]}
\`\`\`

**2. Enable column filter:**
\`\`\`ts
{ id: 'name', header: 'Name', filterable: true }
\`\`\`

**3. Programmatic filter:**
\`\`\`ts
grid.dispatch('filter:set', {
  columnId: 'region',
  type: 'text',
  value: 'Europe'
});
\`\`\`

**4. Quick filter (search all columns):**
\`\`\`ts
grid.dispatch('filter:setQuick', { value: 'john' });
\`\`\`

**5. Clear all filters:**
\`\`\`ts
grid.dispatch('filter:clearAll');
\`\`\``,
    tags: ['filter', 'filtering', 'search', 'column filter', 'troubleshoot'],
  },

  {
    id: 'troubleshoot-editing',
    category: 'troubleshooting',
    questions: [
      'Cell editing not working',
      'Cannot edit cells',
      'How to enable editing',
      'Edit mode not starting',
      'Inline edit',
    ],
    answer: `**Cell editing setup:**

**1. Register plugin-editing:**
\`\`\`ts
import { editingPlugin } from '@gridstorm/plugin-editing';
plugins={[editingPlugin()]}
\`\`\`

**2. Mark columns as editable:**
\`\`\`ts
{ id: 'name', header: 'Name', editable: true }
\`\`\`

**3. Start editing with Enter or double-click** (default behavior).

**4. Handle cell value changes:**
\`\`\`ts
grid.on('cell:valueChanged', ({ rowId, columnId, newValue, oldValue }) => {
  console.log(\`\${rowId}[\${columnId}]: \${oldValue} → \${newValue}\`);
  updateMyData(rowId, columnId, newValue);
});
\`\`\`

**5. Custom cell editors:**
\`\`\`ts
{ id: 'status', editable: true, editor: 'select', editorParams: { options: ['Active', 'Inactive'] } }
\`\`\``,
    tags: ['editing', 'edit', 'cell', 'inline', 'input'],
  },

  {
    id: 'contact-support',
    category: 'general',
    questions: [
      'How do I contact support?',
      'Report a bug',
      'GitHub issues',
      'Support email',
      'Help',
      'Talk to a human',
      'Contact Tekivex',
    ],
    answer: `**Tekivex Support Channels:**

📋 **Report an Issue** (recommended for bugs & features)
[github.com/novaai0401-ui/tekivex-issue-report/issues](https://github.com/novaai0401-ui/tekivex-issue-report/issues)

📖 **Documentation**
[gridstorm.tekivex.com/#/docs](https://gridstorm.tekivex.com/#/docs)

🎮 **Live Demo & Playground**
[gridstorm.tekivex.com/feature-showcase/](https://gridstorm.tekivex.com/feature-showcase/)

💼 **Enterprise inquiries**
enterprise@tekivex.com

When reporting bugs, please include:
- GridStorm version (npm list @gridstorm/core)
- Browser and OS
- Minimal reproduction code
- Console errors (F12 → Console)`,
    tags: ['support', 'contact', 'bug', 'help', 'GitHub', 'email'],
  },

  {
    id: 'gridstorm-pagination',
    category: 'gridstorm',
    questions: [
      'How to add pagination to GridStorm?',
      'Paginate GridStorm',
      'Page size GridStorm',
      'Previous next page',
      'Pagination plugin',
    ],
    answer: `**GridStorm Pagination:**

\`\`\`ts
import { paginationPlugin } from '@gridstorm/plugin-pagination';

// In your GridStorm component:
plugins={[
  paginationPlugin({ pageSize: 50, pageSizeOptions: [25, 50, 100, 200] })
]}
\`\`\`

**Programmatic control:**
\`\`\`ts
grid.dispatch('pagination:goto', { page: 3 });
grid.dispatch('pagination:setPageSize', { size: 100 });
\`\`\`

**React to page changes:**
\`\`\`ts
grid.on('pagination:changed', ({ page, pageSize, totalPages }) => {
  console.log(\`Page \${page} of \${totalPages}\`);
});
\`\`\`

**Server-side pagination** — combine with SSRM plugin to fetch each page from your API.`,
    tags: ['pagination', 'paging', 'page', 'page size'],
  },

  {
    id: 'gridstorm-grouping',
    category: 'gridstorm',
    questions: [
      'Row grouping GridStorm',
      'Group by column',
      'Expand collapse groups',
      'Tree view data',
      'Aggregation with grouping',
    ],
    answer: `**GridStorm Row Grouping:**

\`\`\`ts
import { groupingPlugin } from '@gridstorm/plugin-grouping';
import { aggregationPlugin } from '@gridstorm/plugin-aggregation';

plugins={[
  groupingPlugin(),
  aggregationPlugin()
]}
\`\`\`

**Group by a column:**
\`\`\`ts
grid.dispatch('grouping:set', { columnIds: ['region', 'category'] });
\`\`\`

**Configure aggregations:**
\`\`\`ts
{ id: 'revenue', aggFunc: 'sum' }   // sum/avg/min/max/count
\`\`\`

**Expand/collapse:**
\`\`\`ts
grid.dispatch('grouping:expandAll');
grid.dispatch('grouping:collapseAll');
grid.dispatch('grouping:toggleGroup', { groupKey: 'Europe' });
\`\`\`

Subtotals are automatically calculated for all numeric columns with \`aggFunc\` defined.`,
    tags: ['grouping', 'group by', 'tree', 'aggregation', 'subtotal'],
  },

  {
    id: 'gridstorm-state-persistence',
    category: 'gridstorm',
    questions: [
      'Save grid state',
      'Persist GridStorm settings',
      'Remember column order',
      'Save filters between sessions',
      'State persistence plugin',
      'localStorage grid',
    ],
    answer: `**GridStorm State Persistence:**

The \`plugin-state-persistence\` plugin automatically saves and restores:
- Column order, widths, visibility, pinning
- Sort state
- Filter state
- Group-by configuration
- Page size

\`\`\`ts
import { statePersistencePlugin } from '@gridstorm/plugin-state-persistence';

plugins={[
  statePersistencePlugin({
    key: 'my-grid-v1',        // localStorage key
    debounceMs: 500,          // save debounce (default 500ms)
    include: ['columns', 'sort', 'filter'], // optional subset
  })
]}
\`\`\`

**Custom storage adapter:**
\`\`\`ts
statePersistencePlugin({
  adapter: {
    load: async (key) => await myDb.get(key),
    save: async (key, state) => await myDb.set(key, state),
  }
})
\`\`\``,
    tags: ['state', 'persist', 'save', 'localStorage', 'remember', 'restore'],
  },

  {
    id: 'gridstorm-server-side',
    category: 'gridstorm',
    questions: [
      'Server-side data GridStorm',
      'Lazy loading rows',
      'Fetch data on scroll',
      'SSRM plugin',
      'Infinite scroll GridStorm',
      'Large dataset server',
    ],
    answer: `**GridStorm Server-Side Row Model (SSRM):**

For datasets larger than ~100K rows, use SSRM to fetch data lazily from your API:

\`\`\`ts
import { ssrmPlugin } from '@gridstorm/plugin-ssrm';

plugins={[
  ssrmPlugin({
    fetchPage: async ({ page, pageSize, sort, filter }) => {
      const response = await fetch(
        \`/api/data?page=\${page}&size=\${pageSize}\`,
        { method: 'POST', body: JSON.stringify({ sort, filter }) }
      );
      const { rows, totalCount } = await response.json();
      return { rows, totalCount };
    },
    pageSize: 100,
  })
]}
\`\`\`

GridStorm sends your API the current sort/filter/group state — your backend applies them and returns the page. Supports infinite scroll or pagination UI.`,
    tags: ['SSRM', 'server-side', 'lazy load', 'infinite scroll', 'API', 'backend'],
  },
];

// ─────────────────────────────────────────────
// CATEGORY METADATA
// ─────────────────────────────────────────────
export const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  general:           { label: 'General',          emoji: '💬', color: '#6366f1' },
  gridstorm:         { label: 'GridStorm',         emoji: '🟦', color: '#3b82f6' },
  'pdf-toolkit':     { label: 'PDF Toolkit',       emoji: '📄', color: '#ef4444' },
  'nexa-recruit':    { label: 'NexaRecruit',       emoji: '👥', color: '#10b981' },
  'nexa-care':       { label: 'NexaCare',          emoji: '🏥', color: '#ec4899' },
  'analytics-studio':{ label: 'Analytics Studio',  emoji: '📊', color: '#f59e0b' },
  pricing:           { label: 'Pricing',           emoji: '💰', color: '#8b5cf6' },
  'getting-started': { label: 'Getting Started',   emoji: '🚀', color: '#06b6d4' },
  troubleshooting:   { label: 'Troubleshooting',   emoji: '🔧', color: '#f97316' },
};

// ─────────────────────────────────────────────
// STARTER QUESTIONS (shown before first message)
// ─────────────────────────────────────────────
export const STARTER_QUESTIONS = [
  'What is GridStorm?',
  'How do I install GridStorm?',
  'Is GridStorm free to use?',
  'How does GridStorm compare to AG Grid?',
  'What chart types are supported?',
  'How do I enable accessibility features?',
  'What is PDF Toolkit?',
  'How to get started with Tekivex?',
];
