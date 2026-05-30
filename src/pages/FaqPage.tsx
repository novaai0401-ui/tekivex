import { LegalLayout, LegalSection, legalProse } from './LegalLayout';

interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: 'What is Tekivex?',
    a: 'Tekivex is an independent developer-tools project that publishes open-source enterprise software — GridStorm (data grid), Analytics Studio (BI), DataFlow (real-time streaming), Quantum Vault (post-quantum tokens), and Tekivex UI. All of our products are MIT licensed.',
  },
  {
    q: 'Are Tekivex products really free to use commercially?',
    a: 'Yes. Every published product is MIT licensed, which permits commercial use, modification, and redistribution. You only have to keep the copyright notice in your distribution.',
  },
  {
    q: 'How does Tekivex make money if the products are free?',
    a: 'The marketing site shows Google AdSense advertisements alongside our free tutorials. We may also offer optional paid support and hosted services in the future. Open-source code stays MIT licensed.',
  },
  {
    q: 'Which frameworks do the products support?',
    a: 'Most products ship a TypeScript-first core with React, Vue, and Svelte adapters. Check each product page or its npm README for the up-to-date support matrix.',
  },
  {
    q: 'Where can I see live demos?',
    a: 'Every product page has an "Open Demo" button that links to its hosted demo (e.g. gridstorm.tekivex.com). Demos run entirely in the browser — no sign-up required.',
  },
  {
    q: 'How do I report a bug or request a feature?',
    a: 'Open a GitHub issue at github.com/novaai0401-ui/tekivex-issue-report/issues, or email hello@tekivex.com. See the contact page for a checklist of what to include.',
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
    q: 'Where can I find the tutorials?',
    a: 'Visit /tutorials. We currently publish in-depth guides on system design, software architecture, frontend and backend patterns, and AI/ML. New topics are added regularly.',
  },
  {
    q: 'Can I contribute a tutorial?',
    a: 'We welcome pull requests. Open an issue first describing the topic so we can confirm fit, then submit a draft as Markdown. We will edit for style consistency before publishing.',
  },
  {
    q: 'How often is the site updated?',
    a: 'Tutorials are added weekly. Product manifests, sitemap, and prerendered SEO are regenerated on every deploy.',
  },
  {
    q: 'Is Tekivex hiring?',
    a: 'We hire opportunistically when a role unlocks something we cannot ship otherwise. If you build infrastructure-grade developer tools and want to work on them full-time, email hello@tekivex.com with examples of your work.',
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
      lastUpdated="May 28, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          Quick answers to the questions we get most often. Still stuck? Email{' '}
          <a href="mailto:hello@tekivex.com" style={{ color: '#3b82f6' }}>
            hello@tekivex.com
          </a>{' '}
          or visit the <a href="/contact" style={{ color: '#3b82f6' }}>contact page</a>.
        </p>
      }
    >
      <FaqJsonLd />
      <LegalSection title="General">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            style={{
              borderBottom: '1px solid rgba(148,163,184,0.15)',
              padding: '14px 0',
            }}
          >
            <summary
              style={{
                cursor: 'pointer', fontSize: 16, fontWeight: 600,
                color: '#f1f5f9', listStyle: 'none',
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
