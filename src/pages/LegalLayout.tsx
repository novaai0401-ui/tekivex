import React from 'react';

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

const proseColor = '#94a3b8';
const headingColor = '#f1f5f9';

export const legalProse: React.CSSProperties = {
  fontSize: '15px', lineHeight: '1.85', color: proseColor, marginBottom: '14px',
};

export const legalLi: React.CSSProperties = {
  fontSize: '15px', lineHeight: '1.8', color: proseColor, marginBottom: '6px',
};

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '44px' }}>
      <h2 style={{
        fontSize: '20px', fontWeight: 700, color: headingColor,
        marginBottom: '12px', paddingBottom: '8px',
        borderBottom: '1px solid rgba(148,163,184,0.15)',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LegalLayout({ eyebrow, title, lastUpdated, intro, children }: LegalLayoutProps) {
  return (
    <main style={{ maxWidth: '820px', margin: '0 auto', padding: '56px 32px 96px' }}>
      <header style={{ marginBottom: '52px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '99px',
          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
          marginBottom: '20px',
        }}>
          <span style={{
            color: '#3b82f6', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {eyebrow}
          </span>
        </div>
        <h1 style={{
          fontSize: '38px', fontWeight: 800, color: headingColor,
          margin: '0 0 16px', lineHeight: '1.2',
        }}>
          {title}
        </h1>
        <p style={{ ...legalProse, color: '#64748b', marginBottom: '20px' }}>
          <strong style={{ color: proseColor }}>Last updated:</strong> {lastUpdated}
        </p>
        {intro && (
          <div style={{
            padding: '18px 22px', borderRadius: '10px',
            background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)',
          }}>
            <div style={{ ...legalProse, margin: 0 }}>{intro}</div>
          </div>
        )}
      </header>
      {children}
    </main>
  );
}
