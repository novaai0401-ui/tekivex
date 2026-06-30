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
