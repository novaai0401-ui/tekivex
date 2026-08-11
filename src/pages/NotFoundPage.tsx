import { Link } from '../App';

export function NotFoundPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '96px 32px',
        textAlign: 'center',
      }}
      data-testid="notfound-page"
    >
      <p style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: '#4f46e5', margin: '0 0 12px',
      }}>
        404 · Page not found
      </p>
      <h1 style={{
        fontSize: 44, fontWeight: 800, color: 'var(--hub-text)',
        margin: '0 0 16px', lineHeight: 1.15,
      }}>
        We couldn't find that page
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--hub-text-secondary)', margin: '0 0 32px' }}>
        The link may have moved, the product may have been renamed, or the URL may
        have a typo. Try one of these instead:
      </p>
      <div style={{
        display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
      }}>
        <Link to="/" style={primaryBtn}>Home</Link>
        <Link to="/products" style={ghostBtn}>Products</Link>
        <Link to="/contact" style={ghostBtn}>Contact</Link>
      </div>
    </main>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: '11px 22px', borderRadius: 10, background: '#4f46e5',
  color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 14,
};
const ghostBtn: React.CSSProperties = {
  padding: '11px 22px', borderRadius: 10, background: 'transparent',
  color: 'var(--hub-text-secondary)', fontWeight: 600, textDecoration: 'none', fontSize: 14,
  border: '1px solid rgba(148,163,184,0.35)',
};
