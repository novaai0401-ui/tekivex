import { useConsent } from '../consent/ConsentProvider';
import { LegalLayout, LegalSection, legalProse, legalLi } from './LegalLayout';

export function CookiePolicyPage() {
  const { status, reset } = useConsent();

  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cookie Policy"
      lastUpdated="September 15, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          This page explains the cookies and similar technologies tekivex.com uses,
          why we use them, and how you can control them. You can change your choice
          at any time using the button at the bottom of this page.
        </p>
      }
    >
      <LegalSection title="1. What is a cookie?">
        <p style={legalProse}>
          A cookie is a small text file stored in your browser by a website you
          visit. Cookies let sites remember your preferences, measure traffic, and
          show relevant ads. Some are essential to make the site work; others are
          optional and require your consent.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies we use">
        <div style={{
          overflowX: 'auto', border: '1px solid rgba(148,163,184,0.18)',
          borderRadius: '10px', marginBottom: '20px',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--hub-text-secondary)', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--hub-surface-2)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Set by</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Purpose</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Lifetime</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 14px' }}>tekivex.consent.v1</td>
                <td style={{ padding: '10px 14px' }}>Tekivex (localStorage)</td>
                <td style={{ padding: '10px 14px' }}>Remembers your cookie choice</td>
                <td style={{ padding: '10px 14px' }}>Persistent until cleared</td>
                <td style={{ padding: '10px 14px' }}>Essential</td>
              </tr>
              <tr style={{ background: 'var(--hub-surface)' }}>
                <td style={{ padding: '10px 14px' }}>hub-theme</td>
                <td style={{ padding: '10px 14px' }}>Tekivex (localStorage)</td>
                <td style={{ padding: '10px 14px' }}>Remembers light / dark theme</td>
                <td style={{ padding: '10px 14px' }}>Persistent</td>
                <td style={{ padding: '10px 14px' }}>Essential</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 14px' }}>_ga, _ga_*</td>
                <td style={{ padding: '10px 14px' }}>Google Analytics</td>
                <td style={{ padding: '10px 14px' }}>Distinguishes unique visitors, page views</td>
                <td style={{ padding: '10px 14px' }}>2 years</td>
                <td style={{ padding: '10px 14px' }}>Analytics</td>
              </tr>
              <tr style={{ background: 'var(--hub-surface)' }}>
                <td style={{ padding: '10px 14px' }}>__gads, __gpi, IDE</td>
                <td style={{ padding: '10px 14px' }}>Google AdSense</td>
                <td style={{ padding: '10px 14px' }}>Ad selection, frequency capping, measurement</td>
                <td style={{ padding: '10px 14px' }}>13 months</td>
                <td style={{ padding: '10px 14px' }}>Advertising</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={legalProse}>
          Optional analytics is controlled by the Tekivex analytics banner below.
          Google advertising preferences are collected separately through Google’s
          privacy message where applicable. Ad availability and personalization
          depend on those choices and Google’s serving rules.
        </p>
      </LegalSection>

      <LegalSection title="3. Third-party cookies">
        <p style={legalProse}>
          Google may use cookies and similar technologies to serve ads based on a
          user's prior visits to our site or other sites, as described in Google's
          advertising policies. You can opt out of personalised advertising by
          visiting{' '}
          <a href="https://www.google.com/settings/ads" style={{ color: '#4f46e5' }} target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>{' '}or{' '}
          <a href="https://optout.aboutads.info/" style={{ color: '#4f46e5' }} target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>.
        </p>
      </LegalSection>

      <LegalSection title="4. Your choices">
        <ul>
          <li style={legalLi}>Use the consent banner buttons (Accept analytics / Reject analytics).</li>
          <li style={legalLi}>Change your choice at any time using the button below.</li>
          <li style={legalLi}>Use browser site-data controls to remove existing cookies and local storage.</li>
          <li style={legalLi}>Changing a preference does not delete files you have downloaded.</li>
        </ul>
        <div style={{
          marginTop: '16px', padding: '18px 22px', borderRadius: '10px',
          background: 'var(--hub-surface)', border: '1px solid var(--hub-border)',
        }}>
          <p style={{ ...legalProse, marginBottom: '12px' }}>
            <strong style={{ color: 'var(--hub-text)' }}>Analytics choice:</strong>{' '}
            <span data-testid="consent-status" style={{ color: '#4f46e5' }}>{status}</span>
          </p>
          <button
            onClick={reset}
            data-testid="manage-cookies"
            style={{
              padding: '9px 18px', fontSize: 13, fontWeight: 600,
              borderRadius: 8, border: '1px solid #4f46e5',
              background: 'transparent', color: '#4f46e5', cursor: 'pointer',
            }}
          >
            Reopen cookie banner
          </button>
        </div>
      </LegalSection>

      <LegalSection title="Advertising preferences"><p style={legalProse}>To reopen Google’s advertising message, use the Advertising privacy choices control below a guide, such as <a href="/use-cases/how-to-merge-pdf-free#advertising-privacy">our PDF merging guide</a>. Availability depends on Google’s message configuration and your location. This control is separate from the analytics choice above.</p></LegalSection>
      <LegalSection title="5. Contact">
        <p style={legalProse}>
          For questions about this Cookie Policy, email{' '}
          <a href="mailto:nishu_singh@tekivex.com" style={{ color: '#4f46e5' }}>nishu_singh@tekivex.com</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
