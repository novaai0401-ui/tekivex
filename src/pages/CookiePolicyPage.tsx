import { useConsent } from '../consent/ConsentProvider';
import { LegalLayout, LegalSection, legalProse, legalLi } from './LegalLayout';

export function CookiePolicyPage() {
  const { status, reset } = useConsent();

  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cookie Policy"
      lastUpdated="May 28, 2026"
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
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'rgba(15,23,42,0.5)', textAlign: 'left' }}>
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
              <tr style={{ background: 'rgba(15,23,42,0.3)' }}>
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
              <tr style={{ background: 'rgba(15,23,42,0.3)' }}>
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
          We use Google Consent Mode v2. The Google Analytics and Google AdSense
          scripts load with all storage signals defaulted to <em>denied</em>, so no
          Analytics or Advertising cookies are set until you click <em>Accept all</em>
          on our consent banner. If you reject or have not yet decided, these cookies
          are not stored and any ads shown are non-personalised.
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
          <li style={legalLi}>Use the consent banner buttons (Accept all / Reject non-essential).</li>
          <li style={legalLi}>Change your choice at any time using the button below.</li>
          <li style={legalLi}>Clear cookies in your browser to wipe all stored data.</li>
          <li style={legalLi}>Enable "Do Not Track" in your browser settings.</li>
        </ul>
        <div style={{
          marginTop: '16px', padding: '18px 22px', borderRadius: '10px',
          background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)',
        }}>
          <p style={{ ...legalProse, marginBottom: '12px' }}>
            <strong style={{ color: '#f1f5f9' }}>Current choice:</strong>{' '}
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

      <LegalSection title="5. Contact">
        <p style={legalProse}>
          For questions about this Cookie Policy, email{' '}
          <a href="mailto:nishu_singh@tekivex.com" style={{ color: '#4f46e5' }}>nishu_singh@tekivex.com</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
