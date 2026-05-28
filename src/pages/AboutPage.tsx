import { Icon } from '../icons/Icon';
import { Link } from '../App';

const PRODUCTS = [
  {
    name: 'GridStorm',
    color: '#3b82f6',
    icon: 'grid',
    status: 'GA',
    statusColor: '#4ade80',
    description: 'Headless enterprise data grid — 57 packages, 35 plugins, 100K+ rows at 60fps.',
    href: '/product/gridstorm',
  },
  {
    name: 'Analytics Studio',
    color: '#06b6d4',
    icon: 'bar-chart',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Drag-and-drop BI platform — 26+ charts, pivot tables, SQL engine, KPI dashboards.',
    href: '/product/analytics-studio',
  },
  {
    name: 'PDF Toolkit',
    color: '#ef4444',
    icon: 'file-pdf',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Rust/WASM PDF renderer — 13 annotation types, digital signatures, AES-256 encryption.',
    href: '/product/pdf-toolkit',
  },
  {
    name: 'DataFlow',
    color: '#22c55e',
    icon: 'trending-up',
    status: 'Beta',
    statusColor: '#fbbf24',
    description: 'Zero-dependency streaming engine — WebSocket, SSE, anomaly detection, time-travel replay.',
    href: '/product/dataflow',
  },
];

const VALUES = [
  {
    icon: 'lock',
    title: 'Open-Source First',
    body: 'Core packages are MIT-licensed — forever. No lock-in, no per-developer license fees, no surprise paywalls.',
  },
  {
    icon: 'shield',
    title: 'Production Quality',
    body: 'Every release ships with 1,800+ tests, strict TypeScript, and performance benchmarks. If it ships, it works.',
  },
  {
    icon: 'cpu',
    title: 'Zero Dependencies',
    body: "We obsess over bundle size. GridStorm's core is under 50KB. DataFlow streams without a single runtime dep.",
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
  { label: 'Testing', value: 'Vitest + jsdom (1,899+ tests)' },
  { label: 'Native', value: 'Rust + WASM (PDF Toolkit)' },
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
            Enterprise software,{' '}
            <span className="tx-gradient-text">crafted with skill</span>
          </h1>
          <p className="tx-hero-tagline" style={{ maxWidth: 600 }}>
            Tekivex is an independent developer tools company building the next generation of
            open-source enterprise software — data grids, analytics, PDF processing, and real-time
            streaming, all MIT-licensed and free forever.
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
              Enterprise tools shouldn't cost a fortune
            </h3>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              AG Grid charges $999/developer/year. Handsontable charges per seat. Most enterprise
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
              Open-source is the right default
            </h3>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Every product at Tekivex ships with an MIT license. We believe the best way to earn
              trust is to show the code, welcome contributions, and let the community hold us to a
              high standard.
            </p>
            <p style={{ color: 'var(--hub-text-muted)', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '0.75rem' }}>
              Open-source doesn't mean low quality — it means better quality, because everyone can
              see exactly what we shipped.
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
          { val: '4',      lbl: 'Live products' },
          { val: '57',     lbl: 'npm packages' },
          { val: '1,899+', lbl: 'Tests' },
          { val: 'MIT',    lbl: 'License' },
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
