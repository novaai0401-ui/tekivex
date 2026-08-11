// ─────────────────────────────────────────────────────────────────────────────
// BrandFaq — keyword-dense brand explainer + accordion FAQ for tekivex.com.
// Two SEO jobs: (1) saturate the home page with natural mentions of
// "Tekivex", every product name, and the npm package names so Google
// disambiguates the brand and ranks it for its own searches; (2) emit
// FAQPage JSON-LD so the answers can render as rich snippets.
// Clean / professional / light — no dark theme.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'What is Tekivex?',
    answer:
      'Tekivex is an independently built platform of free developer tools. It ships a suite of free-to-use products under one roof. Three are npm libraries: GridStorm (high-performance React data grid with 35+ plugins), Tekivex UI (accessible React/Vue/Svelte component library at ui.tekivex.com), and Quantum Vault (sovereign post-quantum token issuance and verification). Three are free hosted web apps you simply open and use in the browser: Pyntra, a PDF editor at pyntra.tekivex.com; Analytics Studio, an in-browser BI app at analytics.tekivex.com; and DataFlow, a real-time streaming dashboard at dataflow.tekivex.com. Everything is free forever.',
  },
  {
    question: 'What does Tekivex offer for React developers?',
    answer:
      'For React developers Tekivex offers the tekivex-ui component library (accessibility-first, WCAG 2.1 AA), free to use and documented at ui.tekivex.com, plus GridStorm, a high-performance headless data grid. Additional products are available as live, hosted demos linked from each product page.',
  },
  {
    question: 'How do I get started with Tekivex products?',
    answer:
      'Tekivex UI is free to use, documented at ui.tekivex.com. The other products are available as live, hosted demos linked from each product page; visit a product page to open its demo and documentation. Everything is built TypeScript-first with tree-shaking support so your bundle scales with what you use.',
  },
  {
    question: 'Is Tekivex free for commercial use?',
    answer:
      'Yes. Every Tekivex product is free for commercial use, with no royalties, no per-seat or per-document fees. There is no paywall and no enterprise tier — every feature is free for everyone to use.',
  },
  {
    question: 'How is Tekivex different from AG Grid, Material UI, or Chakra?',
    answer:
      'Three differences. First, Tekivex is a unified platform — one brand, one design language, one issue tracker for the data grid, the component library, and the post-quantum token vault. Second, every Tekivex product targets WCAG 2.1 AA out of the box, not as a paid add-on. Third, the entire stack is free for commercial use with no enterprise tier hidden behind a paywall — every feature is free, with no paywall.',
  },
  {
    question: 'Where can I see Tekivex products in action?',
    answer:
      'GridStorm has live demos at gridstorm.tekivex.com (financial trading, analytics explorer, feature showcase, spreadsheet, cookbook). The TekiVex UI component library has an interactive playground at ui.tekivex.com/playground. The three hosted web apps are live and ready to use right now: open Pyntra at pyntra.tekivex.com, Analytics Studio at analytics.tekivex.com, and DataFlow at dataflow.tekivex.com/stocks. Each product page on tekivex.com links straight to the app or its live demo.',
  },
  {
    question: 'How do I report bugs or contribute to Tekivex?',
    answer:
      'File issues on the public Tekivex issue tracker on GitHub (github.com/novaai0401-ui/tekivex-issue-report). The maintainers aim to respond within two business days. Feedback and feature requests are welcome.',
  },
];

export function BrandFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // FAQPage JSON-LD — Google uses this for rich-result accordions in the SERP.
  useEffect(() => {
    const id = 'tx-faq-jsonld';
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const tag = document.createElement('script');
    tag.id = id;
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((q) => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    });
    document.head.appendChild(tag);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <section
      id="about-tekivex"
      aria-label="About Tekivex"
      style={{
        padding: 'clamp(48px, 7vw, 96px) clamp(20px, 4vw, 48px)',
        maxWidth: 1080,
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: 40, textAlign: 'center' }}>
        <div className="tx-eyebrow" style={{ marginBottom: 12, color: 'var(--hub-accent)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          About Tekivex
        </div>
        <h2
          style={{
            margin: '0 0 14px',
            fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: 'var(--hub-text)',
          }}
        >
          What is Tekivex?
        </h2>
        <p
          style={{
            color: 'var(--hub-text-secondary)',
            fontSize: 'clamp(15px, 1.2vw, 17px)',
            lineHeight: 1.65,
            maxWidth: 760,
            margin: '0 auto',
          }}
        >
          Tekivex is an independently built platform of free developer tools — a
          single, free-to-use home for a high-performance data grid, a
          post-quantum token vault, and a complete React/Vue/Svelte
          component library, plus three free hosted web apps you open
          and use in the browser: a PDF editor, a BI dashboard builder,
          and a real-time streaming dashboard. Free forever,
          accessibility-first, and free for commercial use.
        </p>
      </header>

      {/* Brand keyword paragraph — written for humans first, but also gives Google
          enough natural co-occurrence of "Tekivex" + every product + every
          npm package name to lock in the brand cluster. */}
      <div
        className="tx-brand-prose"
        style={{
          background: 'var(--hub-surface)',
          border: '1px solid var(--hub-border)',
          borderRadius: 16,
          padding: 'clamp(20px, 3vw, 32px)',
          marginBottom: 40,
          fontSize: 15,
          lineHeight: 1.75,
          color: 'var(--hub-text)',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
        }}
      >
        <p style={{ margin: 0 }}>
          The <strong>Tekivex</strong> platform groups six free products. Three are
          npm libraries: <strong>GridStorm</strong> (<code>gridstorm</code>, live at{' '}
          <a href="https://gridstorm.tekivex.com" target="_blank" rel="noopener noreferrer">
            gridstorm.tekivex.com
          </a>
          ) is a high-performance data grid with 35+ plugins;{' '}
          <strong>Quantum Vault</strong> (<code>@sigvault/sdk</code>) is a sovereign
          post-quantum token vault; and{' '}
          <strong>TekiVex UI</strong> (<code>tekivex-ui</code>) is the accessible
          React/Vue/Svelte component library at{' '}
          <a href="https://ui.tekivex.com" target="_blank" rel="noopener noreferrer">
            ui.tekivex.com
          </a>. Three are free hosted web apps — nothing to install, just open the URL
          and use them: <strong>Pyntra</strong>, a browser-based PDF editor at{' '}
          <a href="https://pyntra.tekivex.com" target="_blank" rel="noopener noreferrer">
            pyntra.tekivex.com
          </a>;{' '}
          <strong>Analytics Studio</strong>, an in-browser BI app at{' '}
          <a href="https://analytics.tekivex.com" target="_blank" rel="noopener noreferrer">
            analytics.tekivex.com
          </a>; and{' '}
          <strong>DataFlow</strong>, a real-time streaming dashboard at{' '}
          <a href="https://dataflow.tekivex.com/stocks" target="_blank" rel="noopener noreferrer">
            dataflow.tekivex.com
          </a>. Every product is free for commercial use.
        </p>
      </div>

      <h3
        style={{
          margin: '0 0 20px',
          fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--hub-text)',
        }}
      >
        Frequently asked questions about Tekivex
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map((f, i) => {
          const open = i === openIdx;
          return (
            <div
              key={f.question}
              style={{
                background: 'var(--hub-surface)',
                border: `1px solid ${open ? 'var(--hub-accent)' : 'var(--hub-border)'}`,
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: open ? '0 4px 16px rgba(58, 134, 255, 0.12)' : '0 1px 3px rgba(15, 23, 42, 0.04)',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                style={{
                  width: '100%',
                  padding: '18px 22px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  color: 'var(--hub-text)',
                  fontFamily: 'inherit',
                }}
              >
                <span>{f.question}</span>
                <span style={{ color: 'var(--hub-accent)', fontSize: 22, fontWeight: 400 }}>
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && (
                <div
                  style={{
                    padding: '0 22px 20px',
                    color: 'var(--hub-text-secondary)',
                    fontSize: 15,
                    lineHeight: 1.75,
                  }}
                >
                  {f.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
