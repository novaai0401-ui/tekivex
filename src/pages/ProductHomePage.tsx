import React from 'react';
import { usePlatform } from '../platform/PlatformProvider';
import { Icon } from '../icons/Icon';
import { Link, navigate } from '../App';
import { AdSlot } from '../ads/AdSlot';
import { getArticlesForProductId } from '../content/registry';
import { getEditorial } from '../platform/productEditorial';
import type { ProductManifest, ProductStatus } from '../platform/types';

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  ga:           { label: 'Generally Available', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.08)' },
  beta:         { label: 'Beta',                color: '#d97706', bg: 'rgba(217, 119, 6, 0.08)' },
  preview:      { label: 'Preview',             color: '#8b5cf6', bg: 'rgba(124, 58, 237, 0.08)' },
  'coming-soon':{ label: 'Coming Soon',         color: '#64748b', bg: 'rgba(100, 116, 139, 0.08)' },
};

// ── Editorial explainer section ───────────────────────────────────
// Long-form, original content rendered directly on the product page so the
// page carries genuine value (and FAQ structured data) rather than only
// linking out to an external demo.

function ProductEditorialSection({ product }: { product: ProductManifest }) {
  const editorial = getEditorial(product.id);
  if (!editorial) return null;

  return (
    <section className="prod-editorial" aria-label={`About ${product.name}`}>
      <h2 className="prod-card-title">What is {product.name}?</h2>
      {editorial.overview.map((p, i) => (
        <p key={i} className="prod-editorial-p">{p}</p>
      ))}

      <h3 className="prod-card-title">How it works</h3>
      <ol className="prod-editorial-steps">
        {editorial.howItWorks.map((s) => (
          <li key={s.title} className="prod-editorial-step">
            <strong>{s.title}.</strong> {s.body}
          </li>
        ))}
      </ol>

      <h3 className="prod-card-title">When to use {product.name}</h3>
      <ul className="prod-editorial-list">
        {editorial.useCases.map((u) => (
          <li key={u}>{u}</li>
        ))}
      </ul>

      <h3 className="prod-card-title">Limitations &amp; honest trade-offs</h3>
      <ul className="prod-editorial-list">
        {editorial.limitations.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <h3 className="prod-card-title">Frequently asked questions</h3>
      <dl className="prod-editorial-faq">
        {editorial.faqs.map((f) => (
          <div key={f.q} className="prod-editorial-faq-item">
            <dt>{f.q}</dt>
            <dd>{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// ── Generic product home (for non-gridstorm products) ─────────────

function GenericProductHome({ product }: { product: ProductManifest }) {
  const status = STATUS_CONFIG[product.status];
  const guides = getArticlesForProductId(product.id).filter((a) => a.productName === product.name);

  return (
    <div className="prod-home">
      {/* Breadcrumb */}
      <div className="prod-breadcrumb">
        <button className="prod-bc-link" onClick={() => navigate('/products')}>
          ← All Products
        </button>
        <span className="prod-bc-sep">/</span>
        <span className="prod-bc-current">{product.name}</span>
      </div>

      {/* Hero */}
      <div className="prod-hero" style={{ '--product-color': product.color, '--product-accent': product.accentColor } as React.CSSProperties}>
        <div className="prod-hero-icon" style={{ background: product.accentColor, color: product.color }}>
          <Icon name={product.iconName} size={36} />
        </div>
        <div className="prod-hero-text">
          <div className="prod-hero-badges">
            <span className="plat-badge" style={{ color: status.color, background: status.bg }}>{status.label}</span>
            <span className="prod-version">v{product.version}</span>
          </div>
          <h1 className="prod-hero-name">{product.name}</h1>
          <p className="prod-hero-tagline">{product.tagline}</p>
          <p className="prod-hero-desc">{product.description}</p>

          {/* CTAs */}
          <div className="prod-hero-ctas">
            {product.primaryDemoPath && (
              <a href={product.primaryDemoPath} className="plat-btn-primary" style={{ background: product.color }} target="_blank" rel="noopener noreferrer">
                Open Demo →
              </a>
            )}
            {product.docsRoot && (
              <a
                href={product.docsRoot}
                className="plat-btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="prod-stats-row">
        {product.stats.map(s => (
          <div key={s.label} className="prod-stat-block">
            <div className="prod-stat-value" style={{ color: product.color }}>{s.value}</div>
            <div className="prod-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features + Quick Links */}
      <div className="prod-body-grid">
        <div className="prod-features-card">
          <h3 className="prod-card-title">Key Capabilities</h3>
          <ul className="plat-feature-list">
            {product.keyFeatures.map(f => (
              <li key={f} className="plat-feature-item">
                <span className="plat-feature-dot" style={{ background: product.color }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {product.quickLinks.length > 0 && (
          <div className="prod-links-card">
            <h3 className="prod-card-title">Quick Links</h3>
            <div className="prod-links-list">
              {product.quickLinks.map(link => (
                link.external ? (
                  <a key={link.label} href={link.path} className="prod-link-row" target="_blank" rel="noopener noreferrer">
                    <Icon name="external-link" size={14} />
                    <span>{link.label}</span>
                    {link.isNew && <span className="plat-new-pill">New</span>}
                  </a>
                ) : (
                  <button key={link.label} className="prod-link-row" onClick={() => navigate(link.path)}>
                    <Icon name="chevron-right" size={14} />
                    <span>{link.label}</span>
                    {link.isNew && <span className="plat-new-pill">New</span>}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editorial explainer — original, first-party content on the page itself */}
      <ProductEditorialSection product={product} />

      {/* Sponsored — only on pages with substantial first-party content (never on
          coming-soon / thin product pages), placed after the editorial body to
          comply with Google's inventory-value policy. */}
      {product.status !== 'coming-soon' && getEditorial(product.id) && (
        <AdSlot slot="5896441076" label="Sponsored" className="ad-slot--product" />
      )}

      {/* In-depth guides — internal links to the use-cases hub */}
      {guides.length > 0 && (
        <section className="prod-guides">
          <h3 className="prod-card-title">In-depth guides &amp; deep dives</h3>
          <p className="prod-guides-sub">
            Engineering articles on {product.name} — architecture, use cases, and comparisons,
            written by the Tekivex Engineering team.
          </p>
          <div className="prod-guides-grid">
            {guides.map((g) => (
              <Link key={g.slug} to={`/use-cases/${g.slug}`} className="prod-guide-card">
                <span className="uc-kind-pill uc-kind-pill--sm">{g.kind}</span>
                <span className="prod-guide-title">{g.title}</span>
                <span className="prod-guide-foot">{g.readingMinutes} min read →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      <div className="plat-tags" style={{ marginTop: 32 }}>
        {product.tags.map(t => <span key={t} className="plat-tag">{t}</span>)}
      </div>
    </div>
  );
}

// ── ProductHomePage router ─────────────────────────────────────────

export function ProductHomePage({ productId }: { productId: string }) {
  const { getProduct } = usePlatform();
  const product = getProduct(productId);

  if (!product) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Product not found</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>No product registered with id "{productId}".</p>
        <button
          style={{ padding: '10px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
          onClick={() => navigate('/products')}
        >
          ← Back to Platform
        </button>
      </div>
    );
  }

  // All products use the generic home — GridStorm quickLinks are external URLs
  return <GenericProductHome product={product} />;
}
