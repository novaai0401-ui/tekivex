import { useState, useRef, useEffect } from 'react';
import { Icon } from '../icons/Icon';
import { ThemeToggle } from '../theme/ThemeToggle';
import { navigate } from '../App';
import { usePlatform } from '../platform/PlatformProvider';
import type { ProductManifest } from '../platform/types';

interface TopNavProps {
  route: string;
}

// ── Per-product nav link builder ──────────────────────────────────
// Derives Docs / Demo / Playground / GitHub links from each product manifest.
// Only links with a real URL are included — no dead links, ever.

interface NavLink {
  label: string;
  href: string;
  isNew?: boolean;
}

function getProductNavLinks(product: ProductManifest): NavLink[] {
  const links: NavLink[] = [];

  if (product.docsRoot)
    links.push({ label: 'Docs', href: product.docsRoot });

  if (product.primaryDemoPath)
    links.push({ label: 'Demo', href: product.primaryDemoPath });

  if (product.playgroundPath && product.playgroundPath !== product.primaryDemoPath)
    links.push({ label: 'Playground', href: product.playgroundPath });


  return links;
}

// ── Product Switcher Dropdown ──────────────────────────────────────

function ProductSwitcher({ currentRoute }: { currentRoute: string }) {
  const { products, activeProductId } = usePlatform();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Split by status:
  //   live     = ga, beta, preview (has a real demo or repo link)
  //   comingSoon = no public artefact yet
  const live      = products.filter(p => p.status === 'ga' || p.status === 'beta' || p.status === 'preview');
  const preview: typeof products   = []; // merged into live section above
  const comingSoon = products.filter(p => p.status === 'coming-soon');
  const activeProduct = products.find(p => p.id === activeProductId);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const isOnPlatformHome = currentRoute === '/' || currentRoute === '/products';

  const statusBadge = (p: ProductManifest) => {
    if (p.status === 'beta')    return <span className="ps-badge ps-badge--beta">Beta</span>;
    if (p.status === 'preview') return <span className="ps-badge ps-badge--preview">Preview</span>;
    return null;
  };

  return (
    <div className="ps-wrap" ref={ref}>
      <button
        className={`ps-trigger${open ? ' ps-trigger-open' : ''}${isOnPlatformHome ? ' ps-trigger-active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {activeProduct ? (
          <>
            <span className="ps-dot" style={{ background: activeProduct.color }} />
            <span className="ps-label">{activeProduct.name}</span>
          </>
        ) : (
          <>
            <Icon name="layers" size={14} />
            <span className="ps-label">Products</span>
          </>
        )}
        <Icon name="chevron-down" size={13} className="ps-chevron" />
      </button>

      {open && (
        <div className="ps-dropdown" role="listbox">
          {/* Live products */}
          <div className="ps-section-label">Live</div>
          {live.map(p => (
            <button
              key={p.id}
              className={`ps-item${activeProductId === p.id ? ' ps-item-active' : ''}`}
              style={{ '--ps-color': p.color } as React.CSSProperties}
              onClick={() => { navigate(p.homePath); setOpen(false); }}
              role="option"
              aria-selected={activeProductId === p.id}
            >
              <span className="ps-item-dot" style={{ background: p.color }} />
              <span className="ps-item-text">
                <span className="ps-item-name">{p.name}</span>
                <span className="ps-item-tag">{p.tagline.split('—')[0]?.trim()}</span>
              </span>
              {statusBadge(p)}
              {activeProductId === p.id && <Icon name="check" size={13} />}
            </button>
          ))}

          {/* Preview products */}
          {preview.length > 0 && (
            <>
              <div className="ps-divider" />
              <div className="ps-section-label">Preview</div>
              {preview.map(p => (
                <button
                  key={p.id}
                  className={`ps-item${activeProductId === p.id ? ' ps-item-active' : ''}`}
                  style={{ '--ps-color': p.color } as React.CSSProperties}
                  onClick={() => { navigate(p.homePath); setOpen(false); }}
                  role="option"
                  aria-selected={activeProductId === p.id}
                >
                  <span className="ps-item-dot" style={{ background: p.color }} />
                  <span className="ps-item-text">
                    <span className="ps-item-name">{p.name}</span>
                    <span className="ps-item-tag">{p.tagline.split('—')[0]?.trim()}</span>
                  </span>
                  {statusBadge(p)}
                </button>
              ))}
            </>
          )}

          {/* Roadmap (coming soon) */}
          {comingSoon.length > 0 && (
            <>
              <div className="ps-divider" />
              <div className="ps-section-label">Roadmap</div>
              {comingSoon.map(p => (
                <div key={p.id} className="ps-item ps-item-soon">
                  <span className="ps-item-dot" style={{ background: '#94a3b8' }} />
                  <span className="ps-item-text">
                    <span className="ps-item-name">{p.name}</span>
                    <span className="ps-item-tag">{p.stats[0]?.value}</span>
                  </span>
                  <span className="ps-soon-badge">Soon</span>
                </div>
              ))}
            </>
          )}

          <div className="ps-divider" />
          <button
            className="ps-all-products"
            onClick={() => { navigate('/products'); setOpen(false); }}
          >
            <Icon name="layers" size={14} />
            View all products
          </button>
        </div>
      )}
    </div>
  );
}

// ── TopNav ────────────────────────────────────────────────────────

export function TopNav({ route }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { config, products, activeProductId } = usePlatform();

  // Get the manifest for the currently active product (if on a product page)
  const activeProduct = products.find(p => p.id === activeProductId) ?? null;

  // Build contextual nav links from the active product's manifest
  const productNavLinks: NavLink[] = activeProduct ? getProductNavLinks(activeProduct) : [];

  return (
    <nav className="top-nav">
      <div className="top-nav-left">
        {/* Platform brand */}
        <a
          href="/products"
          className="top-nav-brand"
          onClick={(e) => { e.preventDefault(); navigate('/products'); }}
          title={config.name}
        >
          <div className="top-nav-logo">
            <img src="/favicon.svg" alt="Tekivex" width="28" height="28" style={{ display: 'block', borderRadius: 6 }} />
          </div>
          <span className="top-nav-name">{config.name}</span>
        </a>

        {/* Product switcher */}
        <ProductSwitcher currentRoute={route} />

        {/* Mobile toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
        </button>

        {/* Contextual nav links */}
        <div className={`top-nav-links${mobileMenuOpen ? ' open' : ''}`}>
          {/* Platform home */}
          <a
            href="/products"
            className={`top-nav-link ${!activeProductId ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/products'); setMobileMenuOpen(false); }}
          >
            Platform
          </a>

          {/* About */}
          <a
            href="/about"
            className={`top-nav-link${route === '/about' ? ' active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/about'); setMobileMenuOpen(false); }}
          >
            About
          </a>

          {/* Product-specific links — derived from the active product manifest */}
          {productNavLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`top-nav-link${link.isNew ? ' top-nav-link--new' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
              {link.isNew && <span className="top-nav-new-dot" aria-hidden="true" />}
            </a>
          ))}

          {/* "Coming Soon" indicator when on a roadmap product with no links */}
          {activeProduct && productNavLinks.length === 0 && activeProduct.status === 'coming-soon' && (
            <span className="top-nav-link top-nav-link--muted">
              Coming {activeProduct.stats[0]?.value ?? 'Soon'}
            </span>
          )}
        </div>
      </div>

      <div className="top-nav-right">
        <ThemeToggle />
      </div>
    </nav>
  );
}
