import React, { useState } from 'react';
import { usePlatform } from '../platform/PlatformProvider';
import { Icon } from '../icons/Icon';
import type { ProductManifest, ProductStatus, ProductTier } from '../platform/types';
import { BrandFaq } from '../layout/BrandFaq';
import { Link } from '../App';
import { getAllArticles } from '../content/registry';

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  ga:            { label: 'GA',          color: '#4ade80', bg: 'rgba(74,222,128,0.14)' },
  beta:          { label: 'Beta',        color: '#fbbf24', bg: 'rgba(251,191,36,0.14)' },
  preview:       { label: 'Preview',     color: '#a78bfa', bg: 'rgba(167,139,250,0.14)' },
  'coming-soon': { label: 'Coming Soon', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
};

const TIER_CONFIG: Record<ProductTier, { label: string }> = {
  'open-source': { label: 'Free' },
  'enterprise':  { label: 'Enterprise' },
  'platform':    { label: 'Platform' },
};

// ── 3D Tilt Product Card ──────────────────────────────────────────────

function ProductCard3D({ product }: { product: ProductManifest }) {
  const { navigate } = usePlatform();
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const isLive = product.status !== 'coming-soon';
  const status = STATUS_CONFIG[product.status];
  const tier   = TIER_CONFIG[product.tier];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x, y, active: true });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0, active: false });

  const transform = tilt.active
    ? `perspective(900px) rotateY(${tilt.x * 16}deg) rotateX(${-tilt.y * 16}deg) translateZ(14px) scale(1.015)`
    : 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';

  const shadow = tilt.active
    ? `${-tilt.x * 30}px ${tilt.y * 30}px 60px ${product.color}45, 0 28px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)`
    : `0 4px 28px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)`;

  const transition = tilt.active
    ? 'transform 0.06s ease-out, box-shadow 0.06s ease-out'
    : 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s cubic-bezier(0.23,1,0.32,1)';

  return (
    <div
      className={`tx-card${isLive ? '' : ' tx-card-soon'}`}
      style={{ '--product-color': product.color, transform, boxShadow: shadow, transition } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient accent bar at top */}
      <div className="tx-card-accent" style={{ background: `linear-gradient(90deg, ${product.color} 0%, transparent 100%)` }} />

      {/* Header */}
      <div className="tx-card-head">
        <div className="tx-card-icon" style={{ background: product.accentColor, color: product.color }}>
          <Icon name={product.iconName} size={26} />
        </div>
        <div className="tx-card-meta">
          <div className="tx-card-badges">
            <span className="tx-badge" style={{ color: status.color, background: status.bg }}>{status.label}</span>
            <span className="tx-badge tx-badge-tier">{tier.label}</span>
          </div>
          <h3 className="tx-card-name">{product.name}</h3>
          <p className="tx-card-tagline">{product.tagline}</p>
        </div>
        <div className="tx-card-ver">v{product.version}</div>
      </div>

      {/* Description */}
      <p className="tx-card-desc">{product.description}</p>

      {/* Feature list */}
      <ul className="tx-feat-list">
        {product.keyFeatures.slice(0, 4).map(f => (
          <li key={f} className="tx-feat-item">
            <span className="tx-feat-dot" style={{ background: product.color }} />
            {f}
          </li>
        ))}
      </ul>

      {/* Stats row */}
      {product.stats.length > 0 && (
        <div className="tx-card-stats">
          {product.stats.map(s => (
            <div key={s.label} className="tx-card-stat">
              <span className="tx-card-stat-val" style={{ color: product.color }}>{s.value}</span>
              <span className="tx-card-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="tx-tag-row">
        {product.tags.slice(0, 5).map(t => (
          <span key={t} className="tx-tag">{t}</span>
        ))}
      </div>

      {/* CTAs */}
      <div className="tx-card-ctas">
        {isLive ? (
          <>
            <button
              className="tx-btn-open"
              style={{ '--btn-c': product.color } as React.CSSProperties}
              onClick={() => navigate(product.homePath)}
            >
              Open {product.name} →
            </button>
            {product.primaryDemoPath && (
              <a href={product.primaryDemoPath} className="tx-btn-demo" target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            )}
          </>
        ) : (
          <button className="tx-btn-soon" disabled>Coming Soon</button>
        )}
      </div>

      {/* Quick links */}
      {product.quickLinks.length > 0 && (
        <div className="tx-quicklinks">
          {product.quickLinks.map(link => (
            link.external ? (
              <a key={link.label} href={link.path} className="tx-quicklink" target="_blank" rel="noopener noreferrer">
                {link.label}
                {link.isNew && <span className="tx-new-pill">New</span>}
              </a>
            ) : (
              <button key={link.label} className="tx-quicklink" onClick={() => navigate(link.path)}>
                {link.label}
                {link.isNew && <span className="tx-new-pill">New</span>}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

// ── Hero 3D Floating Stack ────────────────────────────────────────────

function HeroStack({ products }: { products: ProductManifest[] }) {
  const stack = products.slice(0, 4);
  return (
    <div className="tx-hero-vis" aria-hidden="true">
      <div className="tx-float-scene">
        {stack.map((p, i) => (
          <div
            key={p.id}
            className="tx-float-card"
            style={{ '--fi': i, '--fc': p.color, '--fa': p.accentColor } as React.CSSProperties}
          >
            <div className="tx-float-icon" style={{ background: p.accentColor, color: p.color }}>
              <Icon name={p.iconName} size={18} />
            </div>
            <div className="tx-float-text">
              <div className="tx-float-name">{p.name}</div>
              <div className="tx-float-sub">{p.tagline}</div>
            </div>
            <div className="tx-float-dot" style={{ background: p.color }} />
          </div>
        ))}
        {/* Glow disc under the stack */}
        <div className="tx-float-glow" style={{ background: `radial-gradient(ellipse, ${stack[0]?.color ?? '#2563eb'}55 0%, transparent 70%)` }} />
      </div>
    </div>
  );
}

// ── Featured guides (content-first) ───────────────────────────────────
// The homepage leads with original, first-party editorial content — the
// substantial material that makes tekivex.com a content destination in its
// own right, not a launcher that only links out to product subdomains.

function FeaturedGuides() {
  const articles = getAllArticles();
  const total = articles.length;
  const featured = articles.slice(0, 6);

  return (
    <section className="tx-section" id="tx-guides">
      <div className="tx-section-label">Guides &amp; deep dives</div>
      <h2 className="tx-section-title">
        Learn from our <span className="tx-gradient-text">engineering articles</span>
      </h2>
      <p className="tx-section-sub">
        {total} in-depth, original articles written by the Tekivex Engineering team —
        architecture deep dives, migration guides, and real-world use cases you can read
        right here. No sign-up, no paywall.
      </p>

      <div className="uc-hub-grid">
        {featured.map((a) => (
          <Link key={a.slug} to={`/use-cases/${a.slug}`} className="uc-hub-card">
            <span className="uc-kind-pill uc-kind-pill--sm">{a.kind}</span>
            <h3 className="uc-hub-card-title">{a.title}</h3>
            <p className="uc-hub-card-desc">{a.description}</p>
            <span className="uc-hub-card-foot">
              {a.readingMinutes} min read
              <span className="uc-hub-card-arrow" aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="tx-hero-ctas" style={{ marginTop: 32, justifyContent: 'center' }}>
        <Link to="/use-cases" className="tx-cta-btn">
          Browse all {total} guides →
        </Link>
      </div>
    </section>
  );
}

// ── Platform Page ─────────────────────────────────────────────────────

export function PlatformPage() {
  const { config, products, navigate } = usePlatform();

  const launched   = products.filter(p => p.status !== 'coming-soon');
  const comingSoon = products.filter(p => p.status === 'coming-soon');

  const platformStats = [
    { val: String(launched.length), lbl: 'Live Products' },
    { val: 'Free', lbl: 'To use' },
    { val: 'AA',   lbl: 'WCAG 2.1' },
    { val: 'TS',   lbl: 'TypeScript-native' },
  ];

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
      <section className="tx-hero">
        <div className="tx-hero-content">
          <span className="tx-eyebrow-pill">
            <span className="tx-eyebrow-dot" />
            {launched.length} products live · {comingSoon.length} on roadmap
          </span>

          <h1 className="tx-hero-title">
            <span className="tx-gradient-text">{config.name}</span>
          </h1>
          <p className="tx-hero-tagline">{config.tagline}</p>

          <div className="tx-hero-pills">
            {launched.map(p => (
              <button
                key={p.id}
                className="tx-hero-pill"
                style={{ '--pc': p.color } as React.CSSProperties}
                onClick={() => navigate(p.homePath)}
              >
                <Icon name={p.iconName} size={12} />
                {p.name}
              </button>
            ))}
            {comingSoon.map(p => (
              <span key={p.id} className="tx-hero-pill tx-hero-pill-soon">
                <Icon name={p.iconName} size={12} />
                {p.name}
                <em>soon</em>
              </span>
            ))}
          </div>

          <div className="tx-hero-ctas">
            <button
              className="tx-cta-btn"
              onClick={() => document.getElementById('tx-guides')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Read the Guides
            </button>
            <button
              className="tx-btn-demo"
              onClick={() => document.getElementById('tx-products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Products
            </button>
          </div>
        </div>

        <HeroStack products={launched} />
      </section>

      {/* ── Stats bar ── */}
      <div className="tx-stats-bar">
        {platformStats.map(s => (
          <div key={s.lbl} className="tx-stats-item">
            <span className="tx-stats-val">{s.val}</span>
            <span className="tx-stats-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* ── Featured guides (content-first) ── */}
      <FeaturedGuides />

      {/* ── Showcase (animated promo) ── */}
      <section className="tx-section" id="tx-showcase">
        <div className="tx-section-label">Watch</div>
        <h2 className="tx-section-title">
          The platform <span className="tx-gradient-text">in motion</span>
        </h2>
        <p className="tx-section-sub">
          A 30-second tour of the Tekivex suite — GridStorm, Tekivex UI,
          and Quantum Vault. Free forever.
        </p>
        <div className="tx-showcase-frame">
          <iframe
            src="/promo.html"
            title="Tekivex platform — animated product showcase"
            loading="lazy"
            aria-label="Animated showcase of the Tekivex product suite"
          />
        </div>
      </section>

      {/* ── Live Products ── */}
      <section className="tx-section" id="tx-products">
        <div className="tx-section-label">Products</div>
        <h2 className="tx-section-title">
          Available <span className="tx-gradient-text">now</span>
        </h2>
        <div className="tx-products-grid">
          {launched.map(p => <ProductCard3D key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Roadmap ── */}
      {comingSoon.length > 0 && (
        <section className="tx-section">
          <div className="tx-section-label">Roadmap</div>
          <h2 className="tx-section-title">
            What's <span className="tx-gradient-text">coming next</span>
          </h2>
          <p className="tx-section-sub">
            New tools we're actively building. Each ships to the same production
            quality bar as everything already live on the platform.
          </p>
          <div className="tx-products-grid">
            {comingSoon.map(p => <ProductCard3D key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <BrandFaq />

      {/* ── Closing CTA ── */}
      <section className="tx-cta-section">
        <div className="tx-cta-card">
          <div className="tx-cta-glow" />
          <div className="tx-cta-icon-wrap">
            <Icon name="puzzle" size={32} />
          </div>
          <h3 className="tx-cta-title">Build with Tekivex</h3>
          <p className="tx-cta-body">
            Every tool on the platform is free to use and free for commercial use
            in production. Explore what's available today, or get in touch about
            enterprise support, partnerships, and what we're building next.
          </p>
          <div className="tx-cta-actions">
            <button className="tx-cta-btn" onClick={() => navigate('/products')}>
              Explore Products
            </button>
            <button className="tx-btn-demo" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
