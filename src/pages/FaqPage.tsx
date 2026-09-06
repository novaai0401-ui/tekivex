import { LegalLayout, LegalSection, legalProse } from './LegalLayout';

interface QA {
  q: string;
  a: string;
}

export const FAQS: QA[] = [
  {
    q: 'What is Tekivex?',
    a: 'Tekivex is an independent developer-tools project with six free products. Three are npm libraries: GridStorm (data grid), Tekivex UI (accessible component library), and Quantum Vault (post-quantum tokens). Three are free hosted web apps you open and use in the browser — nothing to install: Pyntra (a private studio for cards, photos, video & PDFs at pyntra.tekivex.com), Analytics Studio (an in-browser BI app at www.tekivex.com/analytics), and DataFlow (a real-time streaming dashboard at www.tekivex.com/dataflow). All of our products are free for commercial use.',
  },
  {
    q: 'Are Tekivex products really free to use commercially?',
    a: 'Yes. Every product is free for commercial use, with no royalties and no per-seat or per-document fees. There is no paywall and no enterprise tier.',
  },
  {
    q: 'How does Tekivex make money if the products are free?',
    a: 'The marketing site shows Google AdSense advertisements. We may also offer optional paid support and hosted services in the future. Our products stay free for commercial use.',
  },
  {
    q: 'Which frameworks do the products support?',
    a: 'Most products ship a TypeScript-first core with React, Vue, and Svelte adapters. Check each product page for the up-to-date support matrix.',
  },
  {
    q: 'Where can I see live demos?',
    a: 'Every product page has an "Open Demo" button that links to its hosted demo (e.g. www.tekivex.com/gridstorm). Demos run entirely in the browser — no sign-up required.',
  },
  {
    q: 'How do I report a bug or request a feature?',
    a: 'Open a GitHub issue at github.com/novaai0401-ui/tekivex-issue-report/issues, or email nishu_singh@tekivex.com. See the contact page for a checklist of what to include.',
  },
  {
    q: 'Do you collect personal data?',
    a: 'Only what we need. The site uses Google Analytics and Google AdSense, and both load only after you accept cookies. We do not run our own user database for the marketing site — see the privacy policy for full details.',
  },
  {
    q: 'Can I disable advertisements?',
    a: 'Yes. Click "Reject non-essential" on the consent banner (or "Reopen cookie banner" on the cookie policy page) and we will not load the AdSense script at all. You can also use a content blocker.',
  },
  {
    q: 'How often is the site updated?',
    a: 'Product manifests, sitemap, and prerendered SEO are regenerated on every deploy.',
  },
  {
    q: 'Is Tekivex hiring?',
    a: 'We hire opportunistically when a role unlocks something we cannot ship otherwise. If you build infrastructure-grade developer tools and want to work on them full-time, email nishu_singh@tekivex.com with examples of your work.',
  },
  // ── Privacy & files ──────────────────────────────────────────────────────
  {
    q: 'Do Tekivex tools upload my files?',
    a: 'No. The PDF and CSV tools, and the hosted apps, process your files entirely inside your browser using client-side code. Nothing is sent to our servers, so there is nothing for us to store, scan, or delete. Our guide "Why in-browser tools keep your files private" explains how to verify this yourself.',
  },
  {
    q: 'Where is my PDF actually processed?',
    a: 'On your own device. When you drop a PDF into a Tekivex tool, your browser reads it and performs the merge, split, rotation, or compression locally. The only real limit is your device memory, which is why very large files can be slow on older phones.',
  },
  {
    q: 'Does Tekivex store, log, or see my files?',
    a: 'No. Because processing never leaves your browser, we have no copy of your documents, images, or data. We only receive the standard, anonymised analytics and advertising signals described in our privacy policy, and only after you accept cookies.',
  },
  {
    q: 'Does Tekivex use analytics or advertising cookies?',
    a: 'Yes, but only with your consent. The site uses Google Analytics 4 and Google AdSense. Both run under Google Consent Mode v2 with storage defaulted to denied, so no analytics or advertising cookies are set until you click Accept on the consent banner. Choosing Reject keeps them off.',
  },
  // ── Using the site ───────────────────────────────────────────────────────
  {
    q: 'Do I need an account to use Tekivex?',
    a: 'No. None of the tools, guides, or hosted apps require sign-up, an email address, or a login. Open the page and use it.',
  },
  {
    q: 'Which browsers are supported, and is JavaScript required?',
    a: 'Any current version of Chrome, Edge, Firefox, or Safari on desktop or mobile. The interactive tools and hosted apps need JavaScript, because that is what performs the processing on your device. Our guides, product pages, and policy pages are fully readable without it.',
  },
  {
    q: 'Where is the source code?',
    a: 'Our libraries are published on npm (gridstorm, tekivex-ui, @sigvault/sdk) and developed in public repositories under github.com/novaai0401-ui. Each product page links to its npm package and repository.',
  },
  // ── Products ─────────────────────────────────────────────────────────────
  {
    q: 'What is GridStorm?',
    a: 'GridStorm is a free, high-performance data grid for React, Vue, Svelte, and Angular. It virtual-scrolls 100,000+ rows at 60fps, ships 35 composable plugins (sorting, filtering, grouping, pivoting, charts, Excel export), includes 42 Excel-compatible formula functions, and targets WCAG 2.1 AA. Install it from npm as gridstorm.',
  },
  {
    q: 'What is Tekivex UI?',
    a: 'Tekivex UI is an accessible component library for React, Vue, and Svelte, targeting WCAG 2.1 AA. It covers buttons, forms, modals, tables, toasts, navigation, and layout primitives, supports light and dark themes via CSS custom properties, and ships tree-shakeable ESM bundles with zero runtime dependencies. Install it from npm as tekivex-ui.',
  },
  {
    q: 'What is Quantum Vault?',
    a: 'Quantum Vault issues, validates, and rotates post-quantum cryptographic tokens using NIST-standardised ML-DSA-87 (FIPS 204) signatures with XChaCha20-Poly1305 encrypted payloads. It is self-hosted, designed for sovereign identity and quantum-resistant secrets, and ships on npm as @sigvault/sdk.',
  },
  {
    q: 'What are Pyntra, Analytics Studio, and DataFlow?',
    a: 'Three free hosted web apps you open and use in the browser with nothing to install. Pyntra is a private studio for greeting cards, invitations, photo and short-video edits, and PDF fill, sign, and redact. Analytics Studio builds drag-and-drop pivot tables, charts, and KPI dashboards. DataFlow is a real-time streaming dashboard with live feeds, anomaly alerts, and time-travel replay. All three run on your device and never upload your files.',
  },
];

function FaqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      data-testid="faq-jsonld"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqPage() {
  return (
    <LegalLayout
      eyebrow="Help"
      title="Frequently Asked Questions"
      lastUpdated="September 6, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          Quick answers to the questions we get most often. Still stuck? Email{' '}
          <a href="mailto:nishu_singh@tekivex.com" style={{ color: '#4f46e5' }}>
            nishu_singh@tekivex.com
          </a>{' '}
          or visit the <a href="/contact" style={{ color: '#4f46e5' }}>contact page</a>.
        </p>
      }
    >
      <FaqJsonLd />
      <LegalSection title="General">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            style={{
              borderBottom: '1px solid var(--hub-border)',
              padding: '14px 0',
            }}
          >
            <summary
              style={{
                cursor: 'pointer', fontSize: 16, fontWeight: 600,
                color: 'var(--hub-text)', listStyle: 'none',
              }}
            >
              {q}
            </summary>
            <p style={{ ...legalProse, marginTop: '10px', marginBottom: 0 }}>{a}</p>
          </details>
        ))}
      </LegalSection>
    </LegalLayout>
  );
}

// Exposed for tests so the count assertion does not need to import the list shape.
export const __FAQ_COUNT = FAQS.length;
