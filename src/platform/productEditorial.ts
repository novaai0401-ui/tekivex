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
      'Teams migrating off AG Grid who want a free alternative with no per-developer fee.',
    ],
    limitations: [
      'GridStorm is a grid engine, not a full BI suite — it focuses on fast, editable tables; charting, dashboards, and reporting are out of scope.',
      'The headless model means you write (or adopt) the rendering layer; if you want batteries-included styled components out of the box, expect some initial wiring.',
    ],
    faqs: [
      { q: 'Is GridStorm really free for commercial use?', a: 'Yes. It is free for commercial use with no enterprise tier, no per-seat pricing, and no feature gating. You can use it in commercial products and redistribute it as long as you keep the copyright notice.' },
      { q: 'How does it compare to AG Grid?', a: 'GridStorm is free for commercial use (AG Grid gates many features behind a paid enterprise license), ships a smaller core, and is headless-first. See our in-depth GridStorm vs AG Grid comparison and migration guide in the guides section.' },
      { q: 'Which frameworks are supported?', a: 'React, Vue, Svelte, and Angular via official adapters. The core itself is framework-agnostic, so you can also drive it from vanilla JavaScript.' },
    ],
  },

  // ── Pyntra (hosted web app) ──────────────────────────────────────────────
  pyntra: {
    overview: [
      'Pyntra is Tekivex’s free browser app for the things people actually send: festival and birthday cards, invitations, photo edits, short reels, and PDFs. Everything runs on your device — open a file or start a design and it does not go to our servers.',
      'On the design side, make greeting cards and invitations for birthdays, weddings and festivals, edit and collage photos, and build short captioned videos. On the document side, fill and sign PDF forms, redact sensitive content, and password-protect — all locally. Your work autosaves in this browser, and you can clear it any time. If you use the optional AI copy helper for a wish or script, only the text you type is sent (after you consent) — never your file.',
    ],
    howItWorks: [
      { title: 'Open Pyntra', body: 'Go to pyntra.tekivex.com in any browser. There is nothing to install and no account, and it works offline too.' },
      { title: 'Start a design or open a file', body: 'Pick a card, invitation, photo or short video to create, or open a PDF to fill, sign or redact. Everything happens on your device.' },
      { title: 'Save or share', body: 'Download or share your card, video or PDF. Your work autosaves in the browser and never leaves your device.' },
    ],
    useCases: [
      'Making birthday, wedding, anniversary and festival cards and invitations.',
      'Editing photos and building short captioned videos to share.',
      'Filling and signing PDF forms without printing and scanning.',
      'Redacting or password-protecting a PDF before you send it.',
    ],
    limitations: [
      'Everything runs in your browser, so very large photos or long videos are bounded by your device’s available memory.',
      'It is in beta — feedback on any card, video, or document helps us improve it.',
    ],
    faqs: [
      { q: 'Do I need to install anything or sign up?', a: 'No. Pyntra runs in your browser at pyntra.tekivex.com with nothing to install and no account. It works offline, and your work autosaves on your own device.' },
      { q: 'Do my files get uploaded?', a: 'No. Your cards, photos, videos and PDFs are created and edited on your own device and never sent to our servers. The only thing that can leave — and only if you use the optional AI copy helper and consent — is the text you type for a wish or script, never the file.' },
      { q: 'Is Pyntra just a PDF editor?', a: 'No. People use it for cards and invitations as much as for PDFs. It makes greeting cards, invitations, photo edits and short videos, and it also fills, signs, redacts and password-protects PDFs — all in the browser.' },
    ],
  },

  // ── Analytics Studio (hosted web app) ────────────────────────────────────
  'analytics-studio': {
    overview: [
      'Analytics Studio is a free, browser-based business-intelligence app. Open www.tekivex.com/analytics, bring your data, and build pivot tables, charts, and KPI dashboards by dragging fields — there is no backend to stand up and no software to install.',
      'It is in beta. The pivot builder, 26+ chart types, KPI dashboards, and an in-browser SQL engine (SELECT / WHERE / GROUP BY / JOIN) all work today. Your data is processed in the browser, so you can explore it without sending it to a server.',
    ],
    howItWorks: [
      { title: 'Open the app', body: 'Go to www.tekivex.com/analytics — the studio loads in your browser with nothing to install.' },
      { title: 'Bring your data', body: 'Load tabular data into the app. Analytics Studio infers a schema and makes the fields available to the pivot builder and the SQL view.' },
      { title: 'Build and explore', body: 'Drag fields to group, aggregate, and filter; switch between 26+ chart types; compose a KPI dashboard; or run SQL directly. Export to PDF or Excel when you are done.' },
    ],
    useCases: [
      'Exploring a CSV or dataset without setting up a database.',
      'Building a KPI dashboard with threshold-based alerts.',
      'Running ad-hoc SQL queries against your data, in the browser.',
      'Producing a quick chart or pivot table for a report.',
    ],
    limitations: [
      'Beta — features are still stabilising and may change.',
      'The in-browser SQL engine supports a practical subset (SELECT / WHERE / GROUP BY / JOIN); it is not a full database.',
      'The natural-language query parser handles common phrasings rather than arbitrary free text.',
    ],
    faqs: [
      { q: 'Do I need a backend or database?', a: 'No. Analytics Studio runs in your browser and processes data client-side, including its SQL engine. Just open the app and load your data.' },
      { q: 'Is there anything to install?', a: 'No — it is a hosted web app at www.tekivex.com/analytics.' },
      { q: 'What is it built on?', a: 'It uses the same high-performance GridStorm engine that powers our data grid, which is how it handles large datasets and pivoting smoothly in the browser.' },
    ],
  },

  // ── DataFlow (hosted web app) ────────────────────────────────────────────
  dataflow: {
    overview: [
      'DataFlow is a free, browser-based real-time streaming dashboard. Open the live app at www.tekivex.com/dataflow/stocks to watch high-frequency data update in place — values flash as they change, anomalies are flagged automatically, and you can rewind the stream.',
      'It is in beta. The live dashboard demonstrates streaming feeds, backpressure handling, anomaly detection, and time-travel replay — all running in the browser with nothing to install.',
    ],
    howItWorks: [
      { title: 'Open the live app', body: 'Go to www.tekivex.com/dataflow/stocks — the streaming dashboard starts immediately, with no setup required.' },
      { title: 'Watch data stream', body: 'Live values update in place with directional flash highlighting, while backpressure control keeps the view smooth even under a fast feed.' },
      { title: 'Investigate and replay', body: 'Anomalies are flagged automatically (Z-score, IQR, MAD, or thresholds), and time-travel replay lets you record, seek, and play the stream back at variable speed.' },
    ],
    useCases: [
      'Watching live, market-style data update in real time.',
      'Seeing how anomaly detection flags spikes and drops on a stream.',
      'Reviewing a recorded stream with time-travel replay.',
      'Demonstrating real-time dashboard patterns to a team.',
    ],
    limitations: [
      'Beta — the live dashboard is still evolving.',
      'Anomaly detection uses statistical methods (Z-score, IQR, MAD) suited to numeric streams rather than complex ML-based detection.',
    ],
    faqs: [
      { q: 'Is there anything to install?', a: 'No. DataFlow is a hosted web app — open www.tekivex.com/dataflow/stocks and the live dashboard runs in your browser.' },
      { q: 'What can I do in the live app?', a: 'Watch streaming data update in place with change highlighting, see anomaly alerts, and use time-travel replay to record and rewind the stream.' },
      { q: 'Where does the data come from?', a: 'The hosted demo streams a live, simulated market-style feed so you can see the real-time behaviour end to end.' },
    ],
  },

  // ── Quantum Vault ────────────────────────────────────────────────────────
  'quantum-vault': {
    overview: [
      'Quantum Vault issues, validates, and rotates cryptographic tokens using NIST-standardised post-quantum cryptography — CRYSTALS-Dilithium (ML-DSA-87 / FIPS 204) for signatures, with payload confidentiality provided by XChaCha20-Poly1305 authenticated encryption. It is built for teams that want their identity and secrets infrastructure to be resistant to a future quantum adversary. On npm it ships as @sigvault/sdk.',
      'It is deliberately sovereign: you self-host it, so there is no third-party trust dependency for issuing or validating tokens. The threat it addresses is "harvest now, decrypt later" — data captured today that a quantum computer could break once Q-Day arrives.',
    ],
    howItWorks: [
      { title: 'Issue', body: 'Quantum Vault generates tokens signed with ML-DSA-87 (Dilithium-5) and encrypts the payload with XChaCha20-Poly1305, so claims are confidential rather than merely base64-encoded as in a JWT.' },
      { title: 'Validate', body: 'Services verify token signatures locally against the issuer\'s public (verifying) key, so validation does not depend on an external authority being online. A stateful HYDRA mutation chain provides replay protection.' },
      { title: 'Rotate', body: 'Issuance, validation, and rotation primitives let you roll keys and expire tokens on a schedule, which is essential for long-lived credentials in a post-quantum posture.' },
    ],
    useCases: [
      'Sovereign identity and signed-credential systems that must outlive current public-key cryptography.',
      'Long-lived secrets where "harvest now, decrypt later" is a realistic threat.',
      'Air-gapped or self-hosted environments that cannot depend on a third-party token service.',
      'Organisations preparing migration plans for the NIST PQC signature standard (ML-DSA / FIPS 204).',
    ],
    limitations: [
      'Security-sensitive: evaluate carefully and review against your threat model before production use.',
      'Post-quantum signatures are larger than classical equivalents (ML-DSA-87 signatures are roughly 4,627 bytes), which has bandwidth and storage implications worth measuring.',
      'It is self-hosted by design — you operate the deployment and own key management.',
    ],
    faqs: [
      { q: 'Why post-quantum now, before quantum computers can break RSA?', a: 'Because of "harvest now, decrypt later" — encrypted data captured today can be stored and broken once a capable quantum computer exists. Anything that must stay secret for years should migrate ahead of Q-Day.' },
      { q: 'Which algorithms does it use?', a: 'CRYSTALS-Dilithium (ML-DSA-87, FIPS 204) for signatures, standardised by NIST, plus XChaCha20-Poly1305 for authenticated payload encryption and a HYDRA mutation chain for replay protection.' },
      { q: 'Is it hosted or self-managed?', a: 'Self-managed. Quantum Vault is sovereign by design so there is no third-party trust dependency for issuing or validating tokens. On npm the package is @sigvault/sdk.' },
    ],
  },

  // ── Tekivex UI ──────────────────────────────────────────────────────────
  'tekivex-ui': {
    overview: [
      'Tekivex UI is a professional component library with 50+ accessible components — buttons, inputs, selects, modals, drawers, toasts, navigation, and layout primitives — plus a headless layer for full style control. It ships React 18+, Vue 3, and Svelte 5 bindings with idiomatic APIs, so design decisions stay consistent across frameworks.',
      'It is in Preview. The component set, theming system, and accessibility work are usable today; we are expanding coverage and stabilising APIs ahead of a 1.0. Everything is WCAG 2.1 AA, tree-shakeable ESM, and ships with zero runtime dependencies.',
    ],
    howItWorks: [
      { title: 'Install only what you use', body: 'Components are distributed as tree-shakeable ESM, so your bundle includes only the parts you import — the core stays under 8 KB.' },
      { title: 'Theme with CSS variables', body: 'Dark, light, and high-contrast themes are driven by CSS custom properties, so you can re-theme the whole library without overriding component styles.' },
      { title: 'Drop to headless when needed', body: 'Each component exposes a headless primitive, so when the styled version is not enough you keep the behaviour and accessibility while supplying your own markup.' },
    ],
    useCases: [
      'Production apps that need accessible components out of the box (WCAG 2.1 AA) without a heavy runtime.',
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
