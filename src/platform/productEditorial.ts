// ─── Product editorial content ──────────────────────────────────────────────
// Long-form, original explainer copy for each product page. The value lives on
// tekivex.com itself — what the product is, how it works, where it fits, where
// it doesn't, and answers to real questions — so each product page reads as a
// genuine article rather than a thin card that only links out to a demo.
//
// Single source of truth: consumed both by the React ProductHomePage and by
// scripts/prerender.mjs (bundled with esbuild) so crawlers see the same prose.

export interface ProductFaq {
  q: string;
  a: string;
}

export interface ProductHowStep {
  title: string;
  body: string;
}

export interface ProductEditorial {
  /** Lead paragraphs — the "what and why" of the product. */
  overview: string[];
  /** Numbered "how it works" steps. */
  howItWorks: ProductHowStep[];
  /** Concrete situations the product is a good fit for. */
  useCases: string[];
  /** Honest constraints — especially important for Beta / Preview maturity. */
  limitations: string[];
  /** Real questions a developer evaluating the product would ask. */
  faqs: ProductFaq[];
}

export const PRODUCT_EDITORIAL: Record<string, ProductEditorial> = {
  // ── GridStorm ────────────────────────────────────────────────────────────
  gridstorm: {
    overview: [
      'GridStorm is a headless, framework-agnostic data grid built for the hardest table problem in front-end engineering: rendering and editing very large datasets without dropping frames. Its core ships under 50 KB and knows nothing about the DOM — you bring the renderer (React, Vue, Svelte, or Angular) and GridStorm supplies the engine for windowing, selection, sorting, grouping, and formula evaluation.',
      'The design goal is "spreadsheet behaviour, library ergonomics." That means 100,000+ rows scrolling at 60fps, Excel-compatible copy/paste with type coercion, 42 formula functions, and 35 composable plugins you opt into one at a time — all while keeping the bundle small and the accessibility tree intact (WCAG 2.1 AA).',
    ],
    howItWorks: [
      { title: 'Virtualised rendering', body: 'GridStorm only mounts the cells inside the visible viewport plus a small overscan buffer, recycling row nodes as you scroll. This keeps the DOM node count constant regardless of dataset size, which is what holds the frame budget at 60fps for six-figure row counts.' },
      { title: 'Headless core + adapters', body: 'All state — selection, sort, filter, grouping, formulas — lives in a pure TypeScript core. Thin framework adapters subscribe to that state and render it idiomatically, so the same engine behaves identically across React, Vue, Svelte, and Angular.' },
      { title: 'Composable plugins', body: 'Features like accessibility, Excel formulas, copy/paste, and column pinning are separate plugins. You register only what you need, so an app that never uses formulas never pays for the formula engine in its bundle.' },
    ],
    useCases: [
      'High-frequency financial blotters and trading grids with streaming cell updates and flash highlighting.',
      'Internal admin tools that must display tens of thousands of records without pagination.',
      'Data-heavy SaaS dashboards that need Excel-style editing, formulas, and copy/paste.',
      'Teams migrating off AG Grid who want an MIT-licensed alternative with no per-developer fee.',
    ],
    limitations: [
      'GridStorm is a grid engine, not a full BI suite — charting and reporting live in Analytics Studio, which is built on top of it.',
      'The headless model means you write (or adopt) the rendering layer; if you want batteries-included styled components out of the box, expect some initial wiring.',
    ],
    faqs: [
      { q: 'Is GridStorm really free for commercial use?', a: 'Yes. It is MIT-licensed with no enterprise tier, no per-seat pricing, and no feature gating. You can use it in commercial products and redistribute it as long as you keep the copyright notice.' },
      { q: 'How does it compare to AG Grid?', a: 'GridStorm is open source under MIT (AG Grid gates many features behind a paid enterprise license), ships a smaller core, and is headless-first. See our in-depth GridStorm vs AG Grid comparison and migration guide in the guides section.' },
      { q: 'Which frameworks are supported?', a: 'React, Vue, Svelte, and Angular via official adapters. The core itself is framework-agnostic, so you can also drive it from vanilla JavaScript.' },
    ],
  },

  // ── Pyntra ──────────────────────────────────────────────────────────────
  pyntra: {
    overview: [
      'Pyntra is a browser-native PDF editor delivered as React headless hooks. Every operation — filling form fields, adding new fields, signing, stamping, annotating, redacting, and editing encrypted documents — happens entirely client-side. The PDF never leaves the browser, which matters for documents containing personal or regulated data.',
      'It ships with zero third-party PDF dependencies and a bring-your-own-UI model: Pyntra owns the document logic and exposes it through hooks, while you render the interface with Material UI, Tekivex UI, or your own components. That separation lets you match your product\'s look exactly instead of fighting a pre-styled viewer.',
    ],
    howItWorks: [
      { title: 'Load in the browser', body: 'A PDF is read into memory client-side. Pyntra parses the document structure — pages, form fields, annotations, and encryption — without a server round-trip.' },
      { title: 'Edit through hooks', body: 'React hooks expose the document state: field values, annotation layers, signatures, and redactions. Your UI calls these hooks; Pyntra keeps the underlying PDF consistent.' },
      { title: 'Export securely', body: 'On save, Pyntra serialises the edited document back to a PDF, optionally re-encrypting with RC4, AES-128, or AES-256 — all in the browser, so sensitive content is never uploaded.' },
    ],
    useCases: [
      'Healthcare, legal, and finance apps where uploading documents to a server is a compliance risk.',
      'Form-filling workflows — text, date, number, checkbox, radio, dropdown, and listbox fields.',
      'Signature and stamping flows with a signature pad and embedded images.',
      'Redaction of sensitive content before sharing, performed entirely on the client.',
    ],
    limitations: [
      'Because everything runs in the browser, very large or scanned PDFs are bounded by the user\'s device memory rather than a server.',
      'Pyntra provides the document engine and hooks, not a finished UI — you build (or adopt an adapter for) the interface.',
    ],
    faqs: [
      { q: 'Does any document data leave the browser?', a: 'No. All parsing, editing, and encryption happen client-side. This is the core privacy guarantee — there is no upload step unless you add one.' },
      { q: 'Can it open password-protected PDFs?', a: 'Yes. Pyntra supports encrypted PDFs using RC4, AES-128, and AES-256, and can re-encrypt on export.' },
      { q: 'Which UI libraries work with it?', a: 'Any. The headless hooks are UI-agnostic; there are adapters for Material UI and Tekivex UI, or you can wire your own components.' },
    ],
  },

  // ── Analytics Studio ─────────────────────────────────────────────────────
  'analytics-studio': {
    overview: [
      'Analytics Studio is a drag-and-drop business-intelligence builder that runs in the browser, powered by the GridStorm engine. You connect data, drag fields into a pivot builder, and get pivot tables, 26+ interactive chart types, and KPI dashboards — without standing up a backend or writing application code.',
      'It is currently in Beta. The data model, pivot builder, charting, and the in-browser SQL engine (SELECT / WHERE / GROUP BY / JOIN) are all functional today; we are actively expanding connectors, the scheduled-report designer, and the natural-language query parser ahead of a stable release.',
    ],
    howItWorks: [
      { title: 'Bring your data', body: 'Load tabular data into the browser. Analytics Studio infers a schema and makes the fields available to the pivot builder and SQL engine.' },
      { title: 'Build visually', body: 'Drag fields to group, aggregate, and filter. Switch between 26+ chart types — bar, line, scatter, radar, heatmap, treemap, sankey, and more — or compose a KPI dashboard with threshold-based alerts.' },
      { title: 'Query and share', body: 'Run SQL directly in the browser for ad-hoc analysis, then export to PDF or Excel — manually or on a schedule via the report designer.' },
    ],
    useCases: [
      'Embedding self-service analytics inside a SaaS product without a separate BI backend.',
      'Internal KPI dashboards with auto-thresholds and alert rules.',
      'Ad-hoc data exploration using in-browser SQL, no database connection required.',
      'Cross-framework embedding — React, plus Vue and Svelte adapters.',
    ],
    limitations: [
      'Beta: APIs and the report-scheduling features are still stabilising and may change between releases.',
      'The in-browser SQL engine supports a practical subset (SELECT / WHERE / GROUP BY / JOIN); it is not a full database replacement.',
      'The natural-language query parser is regex-based (no external AI API), so it handles common phrasings rather than arbitrary free text.',
    ],
    faqs: [
      { q: 'Do I need a backend or database?', a: 'No. Analytics Studio runs in the browser and processes data client-side, including its SQL engine. You can wire it to your own data sources, but nothing is required server-side to get started.' },
      { q: 'It says Beta — is it safe to use?', a: 'It is functional and we publish it openly, but expect occasional API changes before the stable release. Pin a version and read the changelog if you adopt it in production.' },
      { q: 'What is it built on?', a: 'The same GridStorm engine that powers our data grid, which is how it handles large datasets and pivoting efficiently in the browser.' },
    ],
  },

  // ── DataFlow ────────────────────────────────────────────────────────────
  dataflow: {
    overview: [
      'DataFlow is a zero-dependency streaming engine for live data in front-end apps. It normalises WebSocket, Server-Sent Events, HTTP polling, and simulated sources behind one API, then handles the hard parts of real-time UIs: backpressure, change tracking, anomaly detection, and replay.',
      'It is in Beta. The adapters, backpressure control, anomaly methods, and time-travel replay work today across React, Vue 3, and Svelte 5; we are hardening the APIs and broadening connector coverage toward a stable release.',
    ],
    howItWorks: [
      { title: 'Connect a source', body: 'Point DataFlow at a WebSocket, SSE endpoint, polling URL, or a simulated scenario. All sources expose the same stream interface, so swapping transports does not change your UI code.' },
      { title: 'Control the firehose', body: 'Batched requestAnimationFrame backpressure lets you cap update frequency and choose a drop strategy (oldest, newest, or sampled) so a fast stream never overwhelms the render loop.' },
      { title: 'Track and replay', body: 'DataFlow tracks per-cell change direction for flash highlighting, runs anomaly detection (Z-score, IQR, MAD, or static thresholds), and records the stream so you can seek and replay at variable speed.' },
    ],
    useCases: [
      'Live financial tickers and trading dashboards with directional flash highlighting.',
      'Operational monitoring where you need anomaly alerts on streaming metrics.',
      'IoT and telemetry dashboards consuming high-rate WebSocket or SSE feeds.',
      'Debugging real-time UIs by recording a session and replaying it deterministically.',
    ],
    limitations: [
      'Beta: the streaming APIs are still stabilising and may change between releases.',
      'Anomaly detection uses statistical methods (Z-score, IQR, MAD), which suit numeric streams rather than complex ML-based detection.',
      'DataFlow handles the client side of streaming; you still provide the WebSocket/SSE backend.',
    ],
    faqs: [
      { q: 'Which transports are supported?', a: 'WebSocket, Server-Sent Events, HTTP polling, and a simulated source for development and testing — all behind a single stream interface.' },
      { q: 'How does it avoid freezing the UI under heavy load?', a: 'It batches updates on a requestAnimationFrame loop with a configurable frame rate and drop strategy (oldest / newest / sample), so render work stays bounded regardless of incoming message rate.' },
      { q: 'Does it work outside React?', a: 'Yes — React hooks, Vue 3 composables, and a Svelte 5 store factory all ship in the box.' },
    ],
  },

  // ── Quantum Vault ────────────────────────────────────────────────────────
  'quantum-vault': {
    overview: [
      'Quantum Vault issues, validates, and rotates cryptographic tokens using NIST-standardised post-quantum algorithms — CRYSTALS-Kyber (ML-KEM / FIPS 203) for key encapsulation and CRYSTALS-Dilithium (ML-DSA / FIPS 204) for signatures. It is built for teams that want their identity and secrets infrastructure to be resistant to a future quantum adversary.',
      'It is in Beta, and deliberately sovereign: you self-host it, so there is no third-party trust dependency for issuing or validating tokens. The threat it addresses is "harvest now, decrypt later" — data captured today that a quantum computer could break once Q-Day arrives.',
    ],
    howItWorks: [
      { title: 'Issue', body: 'Quantum Vault generates tokens signed with Dilithium and, where confidentiality is needed, wraps secrets using Kyber key encapsulation — both NIST-standardised post-quantum schemes.' },
      { title: 'Validate', body: 'Services verify token signatures locally against the issuer\'s public key, so validation does not depend on an external authority being online.' },
      { title: 'Rotate', body: 'Issuance, validation, and rotation primitives let you roll keys and expire tokens on a schedule, which is essential for long-lived credentials in a post-quantum posture.' },
    ],
    useCases: [
      'Sovereign identity and signed-credential systems that must outlive current public-key cryptography.',
      'Long-lived secrets where "harvest now, decrypt later" is a realistic threat.',
      'Air-gapped or self-hosted environments that cannot depend on a third-party token service.',
      'Organisations preparing migration plans for NIST PQC standards (FIPS 203 / 204).',
    ],
    limitations: [
      'Beta and security-sensitive: evaluate carefully and review against your threat model before production use.',
      'Post-quantum keys and signatures are larger than classical equivalents, which has bandwidth and storage implications worth measuring.',
      'It is self-hosted by design — you operate the deployment and own key management.',
    ],
    faqs: [
      { q: 'Why post-quantum now, before quantum computers can break RSA?', a: 'Because of "harvest now, decrypt later" — encrypted data captured today can be stored and broken once a capable quantum computer exists. Anything that must stay secret for years should migrate ahead of Q-Day.' },
      { q: 'Which algorithms does it use?', a: 'CRYSTALS-Kyber (ML-KEM, FIPS 203) for key encapsulation and CRYSTALS-Dilithium (ML-DSA, FIPS 204) for signatures — both standardised by NIST.' },
      { q: 'Is it hosted or self-managed?', a: 'Self-managed. Quantum Vault is sovereign by design so there is no third-party trust dependency for issuing or validating tokens.' },
    ],
  },

  // ── Tekivex UI ──────────────────────────────────────────────────────────
  'tekivex-ui': {
    overview: [
      'Tekivex UI is an enterprise component library with 50+ accessible components — buttons, inputs, selects, modals, drawers, toasts, navigation, and layout primitives — plus a headless layer for full style control. It ships React 18+, Vue 3, and Svelte 5 bindings with idiomatic APIs, so design decisions stay consistent across frameworks.',
      'It is in Preview. The component set, theming system, and accessibility work are usable today; we are expanding coverage and stabilising APIs ahead of a 1.0. Everything is WCAG 2.1 AA, tree-shakeable ESM, and ships with zero runtime dependencies.',
    ],
    howItWorks: [
      { title: 'Install only what you use', body: 'Components are distributed as tree-shakeable ESM, so your bundle includes only the parts you import — the core stays under 8 KB.' },
      { title: 'Theme with CSS variables', body: 'Dark, light, and high-contrast themes are driven by CSS custom properties, so you can re-theme the whole library without overriding component styles.' },
      { title: 'Drop to headless when needed', body: 'Each component exposes a headless primitive, so when the styled version is not enough you keep the behaviour and accessibility while supplying your own markup.' },
    ],
    useCases: [
      'Enterprise apps that need accessible components out of the box (WCAG 2.1 AA) without a heavy runtime.',
      'Teams shipping the same design system across React, Vue, and Svelte codebases.',
      'Products with strict bundle budgets that benefit from tree-shakeable, zero-dependency components.',
      'Design systems that need headless primitives for full visual customisation.',
    ],
    limitations: [
      'Preview: the component set is still growing and APIs may change before 1.0.',
      'As a deliberately lightweight library, it focuses on core primitives rather than a vast catalogue of niche widgets.',
    ],
    faqs: [
      { q: 'Is it accessible by default?', a: 'Yes. Components are WCAG 2.1 AA compliant with ARIA roles and full keyboard navigation built in, not bolted on.' },
      { q: 'Can I use it with Vue or Svelte, not just React?', a: 'Yes — React 18+, Vue 3, and Svelte 5 bindings ship in the box with idiomatic APIs for each.' },
      { q: 'How do I customise the look?', a: 'Re-theme via CSS custom properties for dark/light/high-contrast, or drop to the headless primitive of any component to supply your own markup while keeping the behaviour and accessibility.' },
    ],
  },
};

export function getEditorial(id: string): ProductEditorial | undefined {
  return PRODUCT_EDITORIAL[id];
}
