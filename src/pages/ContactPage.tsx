import { LegalLayout, LegalSection, legalProse, legalLi } from './LegalLayout';

const SUPPORT_EMAIL = 'hello@tekivex.com';
const GITHUB_ISSUES = 'https://github.com/novaai0401-ui/tekivex-issue-report/issues';

export function ContactPage() {
  return (
    <LegalLayout
      eyebrow="Get in touch"
      title="Contact"
      lastUpdated="May 28, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          We're a small team — the fastest way to reach us is email or a GitHub
          issue. Please include enough detail (repro steps, environment, screenshots)
          so we can help quickly.
        </p>
      }
    >
      <LegalSection title="Email">
        <p style={legalProse}>
          For general questions, partnerships, and press enquiries:
        </p>
        <p style={{ ...legalProse, marginBottom: '6px' }}>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            data-testid="contact-email"
            style={{ color: '#3b82f6', fontSize: 18, fontWeight: 600 }}
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p style={legalProse}>
          We aim to reply within two business days.
        </p>
      </LegalSection>

      <LegalSection title="Bug reports & feature requests">
        <p style={legalProse}>
          Please open a GitHub issue so the discussion stays public and other users
          can follow along:
        </p>
        <p style={legalProse}>
          <a
            href={GITHUB_ISSUES}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#3b82f6' }}
          >
            github.com/novaai0401-ui/tekivex-issue-report/issues
          </a>
        </p>
      </LegalSection>

      <LegalSection title="What to include">
        <ul>
          <li style={legalLi}>The product (GridStorm, Tekivex UI, Quantum Vault).</li>
          <li style={legalLi}>Version number from your <code>package.json</code>.</li>
          <li style={legalLi}>Browser + OS for runtime issues.</li>
          <li style={legalLi}>Minimal reproducible example (StackBlitz / CodeSandbox link is ideal).</li>
          <li style={legalLi}>Expected vs actual behaviour.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Security disclosures">
        <p style={legalProse}>
          Please do not file public issues for security vulnerabilities. Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: '#3b82f6' }}>{SUPPORT_EMAIL}</a>
          {' '}with the subject line "Security" and we'll respond privately.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
