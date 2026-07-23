import React from 'react';
import { Icon } from '../icons/Icon';

// GridStorm lives at this URL — all docs/demo links point here
const GS = 'https://gridstorm.tekivex.com';

const FOOTER_COLS = [
  {
    heading: 'Free Tools',
    links: [
      { label: 'All Tools',     href: '/tools' },
      { label: 'Merge PDF',     href: '/tools/merge-pdf' },
      { label: 'Split PDF',     href: '/tools/split-pdf' },
      { label: 'JPG to PDF',    href: '/tools/jpg-to-pdf' },
      { label: 'Compress PDF',  href: '/tools/compress-pdf' },
      { label: 'CSV to Chart',  href: '/tools/csv-to-chart' },
      { label: 'Changelog',     href: '/changelog' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'All Products',       href: '/products' },
      { label: 'About Us',           href: '/about' },
      { label: 'Privacy Policy',     href: '/privacy-policy' },
      { label: 'GridStorm',          href: '/product/gridstorm' },
      { label: 'Tekivex UI',         href: '/product/tekivex-ui' },
      { label: 'Quantum Vault',      href: '/product/quantum-vault' },
      { label: 'Pyntra',             href: '/product/pyntra' },
      { label: 'Analytics Studio',   href: '/product/analytics-studio' },
      { label: 'DataFlow',           href: '/product/dataflow' },
      { label: 'Report an Issue',     href: 'https://github.com/novaai0401-ui/tekivex-issue-report/issues' },
    ],
  },
  {
    heading: 'GridStorm',
    links: [
      { label: 'Introduction',    href: `${GS}/#/docs/getting-started/introduction` },
      { label: 'Plugin System',   href: `${GS}/#/docs/plugins/plugin-system` },
      { label: 'AI & MCP',        href: `${GS}/#/docs/core-concepts/architecture` },
      { label: 'Migration Guide', href: `${GS}/#/docs/guides/migration-from-ag-grid` },
    ],
  },
  {
    heading: 'Documentation',
    links: [
      { label: 'Quick Start',   href: `${GS}/#/docs/getting-started/quick-start` },
      { label: 'API Reference', href: `${GS}/#/docs/api/grid-api` },
      { label: 'Column Defs',   href: `${GS}/#/docs/api/column-definitions` },
      { label: 'Accessibility', href: `${GS}/#/docs/plugins/a11y` },
      { label: 'Contributing',  href: `${GS}/#/docs/getting-started/introduction` },
    ],
  },
  {
    heading: 'Frameworks',
    links: [
      { label: 'React',   href: `${GS}/#/docs/frameworks/react` },
      { label: 'Vue',     href: `${GS}/#/docs/frameworks/vue` },
      { label: 'Angular', href: `${GS}/#/docs/frameworks/angular` },
      { label: 'Svelte',  href: `${GS}/#/docs/frameworks/svelte` },
      { label: 'Vanilla', href: `${GS}/#/docs/frameworks/vanilla` },
    ],
  },
  {
    heading: 'Demos',
    links: [
      { label: 'Feature Showcase',   href: `${GS}/feature-showcase/` },
      { label: 'Playground',         href: `${GS}/playground/` },
      { label: 'Financial Trading',  href: `${GS}/financial-trading/` },
      { label: 'Analytics Explorer', href: `${GS}/analytics-explorer/` },
      { label: 'PDF Viewer',         href: `${GS}/pdf-viewer/` },
    ],
  },
  {
    heading: 'Community',
    links: [
      { label: 'Report an Issue', href: 'https://github.com/novaai0401-ui/tekivex-issue-report/issues' },
      { label: 'Use Cases',       href: '/use-cases' },
      { label: 'About Us',        href: '/about' },
      { label: 'Contact',         href: '/contact' },
      { label: 'FAQ',             href: '/faq' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',    href: '/privacy-policy' },
      { label: 'Terms of Service',  href: '/terms-of-service' },
      { label: 'Cookie Policy',     href: '/cookie-policy' },
      { label: 'Disclaimer',        href: '/disclaimer' },
      { label: 'Contact',           href: '/contact' },
    ],
  },
];

export function Footer() {
  // Anything that's not a hash link (#/) is external
  const isExternal = (href: string) => !href.startsWith('#');

  return (
    <footer className="hub-footer-enterprise">
      {/* Top: brand + badges */}
      <div className="hub-footer-top">
        <div className="hub-footer-brand">
          <div className="hub-footer-logo">
            <img src="/favicon.svg" alt="Tekivex" width="36" height="36" style={{ display: 'block', borderRadius: 8 }} />
          </div>
          <div>
            <div className="hub-footer-brand-name">Tekivex</div>
            <div className="hub-footer-brand-tagline">Free developer tools, independently built</div>
          </div>
        </div>
        <div className="hub-footer-badges">
          <span className="hub-footer-badge">6 products</span>
          <span className="hub-footer-badge">TypeScript-native</span>
          <span className="hub-footer-badge">Free</span>
          <a
            href="https://www.producthunt.com/products/tekivex?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-tekivex"
            target="_blank"
            rel="noopener noreferrer"
            className="hub-footer-ph-badge"
            aria-label="Tekivex on Product Hunt"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1175121&theme=light&t=1782130779644"
              alt="Tekivex - free dev tools for modern web applications | Product Hunt"
              width={250}
              height={54}
              loading="lazy"
            />
          </a>
        </div>
      </div>

      {/* Main link columns */}
      <div className="hub-footer-cols">
        {FOOTER_COLS.map((col) => (
          <div key={col.heading} className="hub-footer-col">
            <h4 className="hub-footer-col-heading">{col.heading}</h4>
            <ul className="hub-footer-col-list">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hub-footer-col-link"
                    {...(isExternal(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="hub-footer-bottom">
        <div className="hub-footer-copy">
          &copy; {new Date().getFullYear()} Tekivex. All rights reserved.
        </div>
        <div
          className="hub-footer-bottom-links"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 24px',
            alignItems: 'center',
          }}
        >
          <a href="/products" className="hub-footer-bottom-link" style={footerLinkStyle}>Products</a>
          <a href="https://ui.tekivex.com" className="hub-footer-bottom-link" style={footerLinkStyle} target="_blank" rel="noopener noreferrer">TekiVex UI</a>
          <a href={`${GS}/#/docs/getting-started/introduction`} className="hub-footer-bottom-link" style={footerLinkStyle} target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="/about" className="hub-footer-bottom-link" style={footerLinkStyle}>About</a>
          <a href="/contact" className="hub-footer-bottom-link" style={footerLinkStyle}>Contact</a>
          <a href="/faq" className="hub-footer-bottom-link" style={footerLinkStyle}>FAQ</a>
          <a href="/privacy-policy" className="hub-footer-bottom-link" style={footerLinkStyle}>Privacy</a>
          <a href="/terms-of-service" className="hub-footer-bottom-link" style={footerLinkStyle}>Terms</a>
          <a href="/cookie-policy" className="hub-footer-bottom-link" style={footerLinkStyle}>Cookies</a>
          <a href="/disclaimer" className="hub-footer-bottom-link" style={footerLinkStyle}>Disclaimer</a>
          <a href="https://github.com/novaai0401-ui/tekivex-issue-report/issues" className="hub-footer-bottom-link" style={footerLinkStyle} target="_blank" rel="noopener noreferrer">Report Issue</a>
        </div>
        <div className="hub-footer-social">
          <a
            href="https://github.com/novaai0401-ui/tekivex-issue-report/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hub-footer-social-link"
            aria-label="Report Issue"
          >
            <Icon name="github" size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: '#475569',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap',
};
