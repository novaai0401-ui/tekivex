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
      'Tekivex is an open-source enterprise developer-tools platform. It ships a suite of MIT-licensed products under one roof: GridStorm (high-performance React data grid with 35+ plugins), Analytics Studio (drag-and-drop business intelligence with 26+ chart types), DataFlow (real-time streaming engine), Quantum Vault (sovereign post-quantum token issuance and verification), and TekiVex UI (the React component library at ui.tekivex.com). Every product is free forever, fully tree-shakable, and ships TypeScript declarations.',
  },
  {
    question: 'What does Tekivex offer for React developers?',
    answer:
      'For React developers Tekivex publishes the tekivex-ui component library (113 production primitives, accessibility-first, WCAG 2.1 AAA), tekivex-3d (a WebGL 3D + 360° toolkit), tekivex-pdf (browser-native PDF generation without Puppeteer), and printable templates as tekivex-resume-templates and tekivex-biodata-templates. All packages are on npm and documented at ui.tekivex.com.',
  },
  {
    question: 'How do I install Tekivex products?',
    answer:
      'Pick a package and install from npm. For UI components: "npm install tekivex-ui". For 3D: "npm install tekivex-3d". For the GridStorm grid: "npm install @tekivex/gridstorm". For post-quantum tokens: "npm install @tekivex/quantum-vault". Every package ships with TypeScript declarations and tree-shaking support so the bundle scales with your imports — not the library size.',
  },
  {
    question: 'Is Tekivex free for commercial use?',
    answer:
      'Yes. Every Tekivex product is open-source under the MIT license: free for commercial use, modification, and redistribution, no royalties, no per-seat or per-document fees. Attribution is appreciated but not required. The full license appears in each repository on GitHub and at opensource.org/licenses/MIT.',
  },
  {
    question: 'How is Tekivex different from AG Grid, Material UI, or Chakra?',
    answer:
      'Three differences. First, Tekivex is a unified platform — one brand, one design language, one issue tracker for the data grid, the chart library, the streaming engine, the PDF renderer, and the component library. Second, every Tekivex product targets WCAG 2.1 AAA out of the box, not as a paid add-on. Third, the entire stack is MIT-licensed with no enterprise tier hidden behind a paywall — every feature is in the open-source build.',
  },
  {
    question: 'Where can I see Tekivex products in action?',
    answer:
      'GridStorm has live demos at gridstorm.tekivex.com (financial trading, analytics explorer, feature showcase, spreadsheet, cookbook). The TekiVex UI component library has an interactive playground at ui.tekivex.com/playground and an engineering blog with deep-dives at ui.tekivex.com/blog. Each product page on tekivex.com links directly to its live demo and source repository.',
  },
  {
    question: 'How do I report bugs or contribute to Tekivex?',
    answer:
      'File issues on the public GitHub trackers — every Tekivex package is hosted under the github.com/007krcs and github.com/novaai0401-ui orgs and has its own issue tracker. The maintainers respond inside 24 hours on weekdays. Pull requests are welcome; every repo has a CONTRIBUTING.md explaining the dev setup and code style.',
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
        <div className="tx-eyebrow" style={{ marginBottom: 12, color: '#3a86ff', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          About Tekivex
        </div>
        <h2
          style={{
            margin: '0 0 14px',
            fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: '#0f172a',
          }}
        >
          What is Tekivex?
        </h2>
        <p
          style={{
            color: '#475569',
            fontSize: 'clamp(15px, 1.2vw, 17px)',
            lineHeight: 1.65,
            maxWidth: 760,
            margin: '0 auto',
          }}
        >
          Tekivex is an open-source platform of enterprise developer tools — a
          single, MIT-licensed home for a high-performance data grid, a chart
          library, a streaming engine, a post-quantum token vault, and a complete React
          component library. Free forever, accessibility-first, production-tested.
        </p>
      </header>

      {/* Brand keyword paragraph — written for humans first, but also gives Google
          enough natural co-occurrence of "Tekivex" + every product + every
          npm package name to lock in the brand cluster. */}
      <div
        className="tx-brand-prose"
        style={{
          background: '#ffffff',
          border: '1px solid #e6e8ef',
          borderRadius: 16,
          padding: 'clamp(20px, 3vw, 32px)',
          marginBottom: 40,
          fontSize: 15,
          lineHeight: 1.75,
          color: '#1a1f2e',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
        }}
      >
        <p style={{ margin: 0 }}>
          The <strong>Tekivex</strong> platform groups several React-focused
          open-source products: <strong>GridStorm</strong> (live at{' '}
          <a href="https://gridstorm.tekivex.com" target="_blank" rel="noopener noreferrer">
            gridstorm.tekivex.com
          </a>
          ) is a high-performance data grid with 35+ plugins;{' '}
          <strong>Analytics Studio</strong> is a drag-and-drop BI tool with 26+
          chart types; <strong>DataFlow</strong> is a real-time streaming engine;{' '}
          <strong>Quantum Vault</strong> is a sovereign post-quantum token vault; and{' '}
          <strong>TekiVex UI</strong> (npm: <code>tekivex-ui</code>) is the React
          component library at{' '}
          <a href="https://ui.tekivex.com" target="_blank" rel="noopener noreferrer">
            ui.tekivex.com
          </a>{' '}
          covering 113 accessible primitives, a 3D toolkit (<code>tekivex-3d</code>),
          and printable templates (<code>tekivex-resume-templates</code> +{' '}
          <code>tekivex-biodata-templates</code>). Every package is MIT-licensed,
          fully typed in TypeScript, and free for commercial use.
        </p>
      </div>

      <h3
        style={{
          margin: '0 0 20px',
          fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#0f172a',
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
                background: '#ffffff',
                border: `1px solid ${open ? '#3a86ff' : '#e6e8ef'}`,
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
                  color: '#0f172a',
                  fontFamily: 'inherit',
                }}
              >
                <span>{f.question}</span>
                <span style={{ color: '#3a86ff', fontSize: 22, fontWeight: 400 }}>
                  {open ? '−' : '+'}
                </span>
              </button>
              {open && (
                <div
                  style={{
                    padding: '0 22px 20px',
                    color: '#334155',
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
