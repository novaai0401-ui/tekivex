import React from 'react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '44px' }}>
      <h2 style={{
        fontSize: '20px', fontWeight: 700, color: '#f1f5f9',
        marginBottom: '12px', paddingBottom: '8px',
        borderBottom: '1px solid rgba(148,163,184,0.15)',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

const prose: React.CSSProperties = {
  fontSize: '15px', lineHeight: '1.85', color: '#94a3b8', marginBottom: '14px',
};

const li: React.CSSProperties = {
  fontSize: '15px', lineHeight: '1.8', color: '#94a3b8', marginBottom: '6px',
};

export function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: '820px', margin: '0 auto', padding: '56px 32px 96px' }}>

      {/* Header */}
      <header style={{ marginBottom: '52px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '4px 14px', borderRadius: '99px',
          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
          marginBottom: '20px',
        }}>
          <span style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Legal
          </span>
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#f1f5f9', margin: '0 0 16px', lineHeight: '1.2' }}>
          Privacy Policy
        </h1>
        <p style={{ ...prose, color: '#64748b', marginBottom: '20px' }}>
          <strong style={{ color: '#94a3b8' }}>Last updated:</strong> May 28, 2026 &nbsp;·&nbsp;
          <strong style={{ color: '#94a3b8' }}>Effective date:</strong> May 28, 2026
        </p>
        <div style={{
          padding: '18px 22px', borderRadius: '10px',
          background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)',
        }}>
          <p style={{ ...prose, margin: 0 }}>
            Tekivex ("we", "our", or "us") operates <strong style={{ color: '#f1f5f9' }}>tekivex.com</strong> and related subdomains including <strong style={{ color: '#f1f5f9' }}>gridstorm.tekivex.com</strong>, <strong style={{ color: '#f1f5f9' }}>analytics.tekivex.com</strong>, <strong style={{ color: '#f1f5f9' }}>dataflow.tekivex.com</strong>, and <strong style={{ color: '#f1f5f9' }}>ui.tekivex.com</strong>. This Privacy Policy explains how we collect, use, and protect your information when you visit these sites.
          </p>
        </div>
      </header>

      {/* 1 */}
      <Section title="1. Information We Collect">
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', margin: '20px 0 8px' }}>
          1.1 Automatically Collected Data
        </h3>
        <p style={prose}>
          When you visit Tekivex sites our servers and third-party services automatically log standard data your browser sends: IP address (anonymized), browser type and version, operating system, referring URL, pages visited, time and date of visit, time spent on pages, and diagnostic data.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', margin: '20px 0 8px' }}>
          1.2 Cookies and Tracking Technologies
        </h3>
        <p style={prose}>We and our third-party partners (including Google) use cookies and similar tracking technologies — such as web beacons (pixel tags / clear GIFs), local storage, and IP addresses — to collect information as a result of ad serving and analytics on this site. Types of cookies we use:</p>
        <ul style={{ paddingLeft: '24px', margin: '0 0 14px' }}>
          {[
            'Essential cookies — required for the site to function correctly (e.g. tekivex.consent.v1 in localStorage, which remembers your cookie choice).',
            'Preference cookies — remember your theme or settings (e.g. hub-theme in localStorage).',
            'Analytics cookies — help us understand how visitors use our sites (Google Analytics 4, _ga / _ga_*). Loaded only after you accept on the consent banner.',
            'Advertising cookies — set by Google AdSense (__gads, __gpi, IDE) so ads can be selected and frequency-capped. Loaded only after you accept on the consent banner.',
          ].map(t => <li key={t} style={li}>{t}</li>)}
        </ul>
        <p style={prose}>
          When you first visit tekivex.com you will see a consent banner with <strong style={{ color: '#f1f5f9' }}>Accept all</strong> and <strong style={{ color: '#f1f5f9' }}>Reject non-essential</strong> buttons. We use Google Consent Mode v2: until you accept, all advertising and analytics storage signals default to <em>denied</em>, so no analytics or advertising cookies are stored on your device and any ads shown are non-personalised. You can change your choice at any time from the <a href="/cookie-policy" style={{ color: '#3b82f6' }}>Cookie Policy</a> page using the "Reopen cookie banner" button, or by clearing cookies and site data for tekivex.com in your browser.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', margin: '20px 0 8px' }}>
          1.3 Information You Voluntarily Provide
        </h3>
        <p style={prose}>
          If you submit a GitHub issue, contact form, or community forum post, the information you provide is collected for the purpose of responding to your request. We do not sell or share this information with third parties.
        </p>
      </Section>

      {/* 2 */}
      <Section title="2. How We Use Your Information">
        <ul style={{ paddingLeft: '24px', margin: '0 0 14px' }}>
          {[
            'Operate and maintain our websites and free products.',
            'Understand and analyse how visitors use our sites (Google Analytics 4).',
            'Improve and develop new features and products.',
            'Detect and address technical issues and security threats.',
            'Comply with applicable legal obligations.',
          ].map(t => <li key={t} style={li}>{t}</li>)}
        </ul>
        <p style={prose}>We will never sell your personal data to third parties.</p>
      </Section>

      {/* 3 */}
      <Section title="3. Google Analytics">
        <p style={prose}>
          We use <strong style={{ color: '#f1f5f9' }}>Google Analytics 4 (GA4)</strong> to understand how visitors interact with our sites. Google Analytics places cookies on your device to collect information about your use of the site. This information is transmitted to and stored by Google on servers in the United States.
        </p>
        <p style={prose}>
          Measurement IDs used:
        </p>
        <ul style={{ paddingLeft: '24px', margin: '0 0 14px' }}>
          <li style={li}><code style={{ background: 'rgba(15,23,42,0.8)', padding: '2px 7px', borderRadius: '4px', fontSize: '13px' }}>G-C65SFGKM00</code> — tekivex.com</li>
          <li style={li}><code style={{ background: 'rgba(15,23,42,0.8)', padding: '2px 7px', borderRadius: '4px', fontSize: '13px' }}>G-E7HBFMG7BG</code> — ui.tekivex.com</li>
        </ul>
        <p style={prose}>
          You can opt out of Google Analytics by installing the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>
      </Section>

      {/* 4 */}
      <Section title="4. Advertising (Google AdSense)">
        <p style={prose}>
          tekivex.com displays advertisements served by{' '}
          <strong style={{ color: '#f1f5f9' }}>Google AdSense</strong> (publisher ID{' '}
          <code style={{ background: 'rgba(15,23,42,0.8)', padding: '2px 7px', borderRadius: '4px', fontSize: '13px' }}>ca-pub-4630229006617891</code>)
          to help keep this site free. AdSense is loaded only after you click <strong style={{ color: '#f1f5f9' }}>Accept all</strong> on the consent banner described in section 1.2.
        </p>
        <p style={prose}>
          Once loaded, Google and its partners may use cookies — including the DART cookie — to serve ads based on your visit to this site and other sites on the Internet. The DART cookie enables Google to show personalised ads. You can opt out of the DART cookie and personalised advertising at any time by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            Google Ads Settings
          </a>{' '}or{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            Google's advertising policies
          </a>.
        </p>
        <p style={prose}>
          Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. You can review how Google uses information from sites or apps that use its services at{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            How Google uses data when you use our partners' sites or apps
          </a>. You may also opt out of third-party vendor use of cookies for personalised advertising by visiting{' '}
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            aboutads.info
          </a>{' '}or{' '}
          <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
            youronlinechoices.com
          </a>.
        </p>
        <p style={prose}>
          If you reject non-essential cookies, no advertising cookies are stored on your device (Google Consent Mode keeps <code style={{ background: 'rgba(15,23,42,0.8)', padding: '2px 7px', borderRadius: '4px', fontSize: '13px' }}>ad_storage</code> and <code style={{ background: 'rgba(15,23,42,0.8)', padding: '2px 7px', borderRadius: '4px', fontSize: '13px' }}>ad_personalization</code> denied), and any ads shown remain non-personalised.
        </p>
      </Section>

      {/* 5 */}
      <Section title="5. Third-Party Services">
        <ul style={{ paddingLeft: '24px', margin: '0 0 14px' }}>
          {[
            'Google Analytics 4 — analytics (policies.google.com/privacy)',
            'Google AdSense — advertising (policies.google.com/technologies/ads)',
            'GitHub — code hosting and issue tracking',
            'Content delivery / download hosting',
            'Vercel / Render — web hosting',
            'Google Fonts — Inter typeface (fonts.googleapis.com)',
          ].map(t => <li key={t} style={li}>{t}</li>)}
        </ul>
        <p style={prose}>
          Each third-party service operates under its own privacy policy. We encourage you to review their policies.
        </p>
      </Section>

      {/* 6 */}
      <Section title="6. Free Products and Downloads">
        <p style={prose}>
          Tekivex offers free software downloads. When you download or use this software, your interaction is governed by the applicable download terms. We do not collect personal data through the use of the downloaded software itself.
        </p>
      </Section>

      {/* 7 */}
      <Section title="7. Data Retention">
        <p style={prose}>
          Analytics data is retained for 26 months in line with Google Analytics 4's default data retention settings. We do not store personal data beyond what is aggregated anonymously by our analytics provider.
        </p>
      </Section>

      {/* 8 */}
      <Section title="8. Your Rights">
        <p style={prose}>Depending on your location, you may have the right to:</p>
        <ul style={{ paddingLeft: '24px', margin: '0 0 14px' }}>
          {[
            'Access — request a copy of the personal data we hold about you.',
            'Rectification — request correction of inaccurate data.',
            'Erasure — request deletion of your data ("right to be forgotten").',
            'Restriction — request we limit how we process your data.',
            'Portability — receive your data in a portable format.',
            'Object — object to processing based on legitimate interests.',
          ].map(t => <li key={t} style={li}>{t}</li>)}
        </ul>
        <p style={prose}>
          EU/EEA residents have these rights under the GDPR. California residents have similar rights under the CCPA. To exercise any of these rights, please contact us via GitHub.
        </p>
      </Section>

      {/* 9 */}
      <Section title="9. Children's Privacy">
        <p style={prose}>
          Our services are not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.
        </p>
      </Section>

      {/* 10 */}
      <Section title="10. Security">
        <p style={prose}>
          All data in transit between your browser and our services is encrypted using HTTPS/TLS. Our free products are built with security-first principles — zero runtime dependencies where possible, no eval(), and regular dependency audits. However, no method of electronic transmission is 100% secure.
        </p>
      </Section>

      {/* 11 */}
      <Section title="11. Changes to This Policy">
        <p style={prose}>
          We may update this Privacy Policy periodically. We will notify you of material changes by updating the "Last updated" date at the top of this page. Continued use of our sites after changes are posted constitutes acceptance of the updated policy.
        </p>
      </Section>

      {/* 12 */}
      <Section title="12. Contact">
        <p style={prose}>For privacy-related questions or to exercise your rights, please contact us:</p>
        <div style={{
          padding: '20px 24px', borderRadius: '10px',
          background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)',
        }}>
          <p style={{ ...prose, marginBottom: '8px' }}><strong style={{ color: '#f1f5f9' }}>Tekivex</strong></p>
          <p style={{ ...prose, marginBottom: '8px' }}>
            GitHub:{' '}
            <a href="https://github.com/007krcs" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
              github.com/007krcs
            </a>
          </p>
          <p style={{ ...prose, marginBottom: '8px' }}>
            Issue Tracker:{' '}
            <a href="https://github.com/novaai0401-ui/tekivex-issue-report/issues" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
              github.com/novaai0401-ui/tekivex-issue-report/issues
            </a>
          </p>
          <p style={{ ...prose, marginBottom: 0 }}>
            Website:{' '}
            <a href="https://tekivex.com" style={{ color: '#3b82f6' }}>tekivex.com</a>
          </p>
        </div>
      </Section>

      {/* Compliance note */}
      <div style={{
        marginTop: '52px', padding: '20px 24px', borderRadius: '10px',
        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
      }}>
        <p style={{ ...prose, margin: 0, fontSize: '13px', color: '#64748b' }}>
          This Privacy Policy was drafted to comply with the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), and to meet the cookie-and-data-collection disclosure obligations of the third-party services we integrate (currently Google Analytics 4 and Google AdSense). We are committed to handling your data transparently and responsibly.
        </p>
      </div>
    </main>
  );
}
