import { LegalLayout, LegalSection, legalProse, legalLi } from './LegalLayout';

const SUPPORT_EMAIL = 'nishu_singh@tekivex.com';
const GITHUB_ISSUES = 'https://github.com/novaai0401-ui/tekivex-issue-report/issues';
const GITHUB_ORG = 'https://github.com/novaai0401-ui';

const link = { color: '#4f46e5' } as const;

export function ContactPage() {
  return (
    <LegalLayout
      eyebrow="Get in touch"
      title="Contact"
      lastUpdated="September 6, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          Tekivex is run by a small team, so the fastest way to reach us is email or a
          public GitHub issue. Every route below lands with a real person; we aim to
          reply within <strong style={{ color: 'var(--hub-text)' }}>two business days</strong>.
          Pick the section that matches what you need so it reaches the right place.
        </p>
      }
    >
      <LegalSection title="General inquiries">
        <p style={legalProse}>
          Questions about Tekivex, the products, licensing, or anything not covered
          below:
        </p>
        <p style={{ ...legalProse, marginBottom: '6px' }}>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            data-testid="contact-email"
            style={{ ...link, fontSize: 18, fontWeight: 600 }}
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Technical support & bug reports">
        <p style={legalProse}>
          For a bug, a broken tool, or a feature request, please open a GitHub issue so
          the discussion stays public and other users can follow along:
        </p>
        <p style={legalProse}>
          <a href={GITHUB_ISSUES} target="_blank" rel="noopener noreferrer" style={link}>
            github.com/novaai0401-ui/tekivex-issue-report/issues
          </a>
        </p>
        <p style={{ ...legalProse, marginBottom: '8px' }}>What to include so we can help quickly:</p>
        <ul>
          <li style={legalLi}>The product (GridStorm, Tekivex UI, Quantum Vault, Pyntra, Analytics Studio, DataFlow, or one of the free tools).</li>
          <li style={legalLi}>For the libraries, the version from your <code>package.json</code>; for the hosted apps and tools, the page URL where it happened.</li>
          <li style={legalLi}>Browser and operating system for runtime issues.</li>
          <li style={legalLi}>A minimal reproducible example (a StackBlitz or CodeSandbox link is ideal).</li>
          <li style={legalLi}>Expected versus actual behaviour.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Security disclosures">
        <p style={legalProse}>
          Please do not file public issues for security vulnerabilities. Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={link}>{SUPPORT_EMAIL}</a> with the
          subject line <strong style={{ color: 'var(--hub-text)' }}>Security</strong> and
          we will respond privately. Our{' '}
          <a href="/.well-known/security.txt" style={link}>security.txt</a> carries the
          same contact.
        </p>
      </LegalSection>

      <LegalSection title="Content corrections">
        <p style={legalProse}>
          Spotted an error in a guide, a product page, or a comparison? We would rather
          fix it than defend it. Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={link}>{SUPPORT_EMAIL}</a> with the
          subject line <strong style={{ color: 'var(--hub-text)' }}>Correction</strong>,
          or open an issue on the tracker above, and include:
        </p>
        <ul>
          <li style={legalLi}>The page URL and the passage in question.</li>
          <li style={legalLi}>What you believe is wrong, and — if you have one — a source we can check.</li>
        </ul>
        <p style={legalProse}>
          Corrections are handled as described in our{' '}
          <a href="/editorial-policy" style={link}>editorial policy</a>; material fixes
          update the article's revision date.
        </p>
      </LegalSection>

      <LegalSection title="Open-source contributions">
        <p style={legalProse}>
          Our libraries are developed in public. Browse the repositories at{' '}
          <a href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" style={link}>
            github.com/novaai0401-ui
          </a>
          . The best way to start is an issue on the tracker describing the change you
          have in mind, so we can agree on direction before you invest time in a patch.
        </p>
      </LegalSection>

      <LegalSection title="Business & partnership inquiries">
        <p style={legalProse}>
          For partnerships, integrations, press, or anything commercial, email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={link}>{SUPPORT_EMAIL}</a> with the
          subject line <strong style={{ color: 'var(--hub-text)' }}>Partnership</strong>.
          Note that every Tekivex product stays free for commercial use — there is no
          enterprise tier to negotiate.
        </p>
      </LegalSection>

      <LegalSection title="Accessibility">
        <p style={legalProse}>
          If you hit an accessibility barrier anywhere on this site, see our{' '}
          <a href="/accessibility" style={link}>accessibility statement</a> for how to
          report it; the same email above reaches us.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
