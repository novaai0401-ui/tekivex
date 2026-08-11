import { Icon } from '../icons/Icon';
import { Link } from '../App';

const PRODUCTS = [
  {
    name: 'GridStorm',
    color: '#4f46e5',
    icon: 'grid',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Headless high-performance data grid — 35 plugins, 100K+ rows at 60fps.',
    href: '/product/gridstorm',
  },
  {
    name: 'Tekivex UI',
    color: '#06b6d4',
    icon: 'layers',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Accessible component library for React, Vue & Svelte — WCAG 2.1 AA out of the box.',
    href: '/product/tekivex-ui',
  },
  {
    name: 'Quantum Vault',
    color: '#8b5cf6',
    icon: 'shield',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Sovereign post-quantum tokens — ML-DSA-87 (FIPS 204) + XChaCha20-Poly1305, self-hosted.',
    href: '/product/quantum-vault',
  },
  {
    name: 'Pyntra',
    color: '#ef4444',
    icon: 'file-pdf',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Free hosted PDF editor — open the app to fill, sign, annotate & redact PDFs. Opens encrypted PDFs and runs entirely in your browser.',
    href: '/product/pyntra',
  },
  {
    name: 'Analytics Studio',
    color: '#06b6d4',
    icon: 'bar-chart',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Free hosted BI app — open it to build drag-and-drop pivots, 26+ charts, KPI dashboards and run in-browser SQL. No backend to set up.',
    href: '/product/analytics-studio',
  },
  {
    name: 'DataFlow',
    color: '#22c55e',
    icon: 'trending-up',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Free hosted real-time streaming dashboard — open the live app to watch feeds update in place, with anomaly alerts and time-travel replay.',
    href: '/product/dataflow',
  },
];

const VALUES = [
  {
    icon: 'lock',
    title: 'Free First',
    body: 'Core packages are free for commercial use — forever. No lock-in, no per-developer license fees, no surprise paywalls.',
  },
  {
    icon: 'shield',
    title: 'Production Quality',
    body: 'Every release ships with an automated test suite, strict TypeScript, and performance checks before it goes out.',
  },
  {
    icon: 'cpu',
    title: 'Zero Dependencies',
    body: "We obsess over bundle size. GridStorm's core is under 50KB, and every package is fully tree-shakable.",
  },
  {
    icon: 'accessibility',
    title: 'Accessibility by Default',
    body: 'WCAG 2.1 AA is not an afterthought — it is baked into the architecture. Grids announce, keyboards navigate.',
  },
  {
    icon: 'layers',
    title: 'Framework-Agnostic',
    body: 'Every product ships React, Vue, Svelte, and Angular adapters. We build the engine, you choose the shell.',
  },
  {
    icon: 'code',
    title: 'Developer Experience',
    body: 'Great DX is a feature. TypeScript-native APIs, clear error messages, codemod support, and migration guides.',
  },
];

const TECH_STACK = [
  { label: 'Language', value: 'TypeScript 5.x (strict)' },
  { label: 'Runtime', value: 'Browser-first, Node-compatible' },
  { label: 'Build', value: 'tsup + pnpm monorepo' },
  { label: 'Testing', value: 'Vitest + jsdom' },
  { label: 'Crypto', value: 'Post-quantum (ML-DSA-87 + XChaCha20)' },
  { label: 'Frameworks', value: 'React, Vue 3, Svelte 5, Angular 17+' },
];

export function AboutPage() {
  return (
    <div className="tx-page">

      {/* ── Ambient background ── */}
      <div className="tx-bg" aria-hidden="true">
        <div className="tx-orb tx-orb-1" />
        <div className="tx-orb tx-orb-2" />
        <div className="tx-orb tx-orb-3" />
        <div className="tx-grid-overlay" />
      </div>

      {/* ── Hero ── */}
      <section className="tx-hero" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
        <div className="tx-hero-content" style={{ maxWidth: 760 }}>
          <span className="tx-eyebrow-pill">
            <span className="tx-eyebrow-dot" />
            About Tekivex
          </span>
          <h1 className="tx-hero-title">
            Free developer tools,{' '}
            <span className="tx-gradient-text">independently built</span>
          </h1>
          <p className="tx-hero-tagline" style={{ maxWidth: 600 }}>
            Tekivex is an independent developer tools company building the next generation of
            free software — data grids, accessible UI components, and post-quantum security,
            plus free hosted web apps for editing PDFs, building dashboards, and watching
            real-time data. All free for commercial use and free forever.
          </p>
          <div className="tx-hero-ctas">
            <a
              href="https://github.com/novaai0401-ui/tekivex-issue-report/issues"
              className="tx-cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" size={16} />
              Report an Issue
            </a>
            <a href="/products" className="tx-ghost-btn">
              Explore Products
            </a>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="tx-section">
        <div className="tx-section-label">Mission</div>
        <h2 className="tx-section-title">
          Why we <span className="tx-gradient-text">build</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div className="about-prose-card">
            <h3 style={{ color: 'var(--hub-text)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              Professional tools shouldn't cost a fortune
            </h3>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              AG Grid charges $999/developer/year. Handsontable charges per seat. Most commercial
              data-grid vendors lock features behind paywalls that make the software inaccessible
              to small teams and startups.
            </p>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '0.75rem' }}>
              GridStorm is our answer: a fully-featured, WCAG 2.1 AA compliant, 100K-row data grid
              with 35 composable plugins — <strong style={{ color: 'var(--hub-text)' }}>free forever</strong>.
            </p>
          </div>
          <div className="about-prose-card">
            <h3 style={{ color: 'var(--hub-text)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              Free should be the default
            </h3>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Every product at Tekivex is free for commercial use — no per-seat fees, no enterprise
              tier, no paywall on the features that matter. We would rather earn trust by removing
              the cost barrier than by gating the good parts.
            </p>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '0.75rem' }}>
              Free doesn't mean low quality — every release ships with strict TypeScript, an
              automated test suite, and accessibility built in from the start.
            </p>
          </div>
        </div>
      </section>

      {/* ── Products overview ── */}
      <section className="tx-section">
        <div className="tx-section-label">Products</div>
        <h2 className="tx-section-title">
          What we <span className="tx-gradient-text">ship</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          {PRODUCTS.map(p => (
            <Link
              key={p.name}
              to={p.href}
              className="about-product-tile"
              style={{ '--pc': p.color } as React.CSSProperties}
            >
              <div className="about-tile-top">
                <div className="about-tile-icon" style={{ background: `${p.color}22`, color: p.color }}>
                  <Icon name={p.icon} size={20} />
                </div>
                <span className="about-tile-status" style={{ color: p.statusColor, background: `${p.statusColor}22` }}>
                  {p.status}
                </span>
              </div>
              <div className="about-tile-name">{p.name}</div>
              <div className="about-tile-desc">{p.description}</div>
              <div className="about-tile-arrow" style={{ color: p.color }}>Learn more →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="tx-section">
        <div className="tx-section-label">Values</div>
        <h2 className="tx-section-title">
          How we <span className="tx-gradient-text">work</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
          {VALUES.map(v => (
            <div key={v.title} className="about-value-card">
              <div className="about-value-icon">
                <Icon name={v.icon} size={20} />
              </div>
              <h4 className="about-value-title">{v.title}</h4>
              <p className="about-value-body">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="tx-section">
        <div className="tx-section-label">Stack</div>
        <h2 className="tx-section-title">
          Built with <span className="tx-gradient-text">care</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.875rem', marginTop: '2rem' }}>
          {TECH_STACK.map(t => (
            <div key={t.label} className="about-stack-row">
              <span className="about-stack-label">{t.label}</span>
              <span className="about-stack-value">{t.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="tx-stats-bar" style={{ marginTop: 0 }}>
        {[
          { val: '6',      lbl: 'Products' },
          { val: 'Free',   lbl: 'License' },
          { val: 'TS',     lbl: 'TypeScript-native' },
          { val: '2025',   lbl: 'Founded' },
        ].map(s => (
          <div key={s.lbl} className="tx-stats-item">
            <span className="tx-stats-val">{s.val}</span>
            <span className="tx-stats-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── Contact / CTA ── */}
      <section className="tx-cta-section">
        <div className="tx-cta-card">
          <div className="tx-cta-glow" />
          <div className="tx-cta-icon-wrap">
            <Icon name="message-circle" size={32} />
          </div>
          <h3 className="tx-cta-title">Get in touch</h3>
          <p className="tx-cta-body">
            Have a question, found a bug, or want to contribute? Open an issue on GitHub,
            start a discussion, or reach out directly — we read everything.
          </p>
          <div className="tx-cta-actions">
            <a
              href="https://github.com/novaai0401-ui/tekivex-issue-report/issues"
              className="tx-cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="message-circle" size={16} />
              Report an Issue
            </a>
            <a href="/products" className="tx-ghost-btn">
              Explore Products
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
