import { LegalLayout, LegalSection, legalProse, legalLi } from './LegalLayout';

export function TermsOfServicePage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="May 28, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          These Terms of Service ("Terms") govern your access to and use of
          <strong style={{ color: '#f1f5f9' }}> tekivex.com</strong>, its subdomains, and any
          free software and demos we publish (the "Services").
          By using the Services you agree to these Terms.
        </p>
      }
    >
      <LegalSection title="1. Use of the Services">
        <p style={legalProse}>
          The Services are provided for personal, educational, and commercial use,
          subject to these Terms and to the licence accompanying each
          product. Our software is free for commercial use; the
          licence text accompanying each product controls in the event of conflict.
        </p>
        <p style={legalProse}>You agree not to:</p>
        <ul>
          <li style={legalLi}>Use the Services for any unlawful purpose or to violate any applicable law.</li>
          <li style={legalLi}>Attempt to disrupt, overload, or reverse-engineer the running Services in a way that goes beyond what the licence permits.</li>
          <li style={legalLi}>Scrape, harvest, or republish our content in bulk without attribution and a link back.</li>
          <li style={legalLi}>Misrepresent your affiliation with Tekivex.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Accounts">
        <p style={legalProse}>
          The marketing site does not require an account. If individual products
          require sign-up in the future, separate terms will apply at the point of
          registration.
        </p>
      </LegalSection>

      <LegalSection title="3. Intellectual Property">
        <p style={legalProse}>
          The Tekivex name, logo, and marketing copy are owned by Tekivex. Our
          software is licensed under the terms accompanying each product, and is
          free for commercial use. You retain ownership of anything you contribute
          through feedback or bug reports; by submitting a contribution you grant us
          the right to use, modify, and redistribute it.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-party services">
        <p style={legalProse}>
          The site uses Google Analytics and Google AdSense, subject to your cookie
          consent. Demos may embed third-party hosted services (Vercel, GitHub).
          Their terms apply to those interactions.
        </p>
      </LegalSection>

      <LegalSection title="5. Disclaimer of warranties">
        <p style={legalProse}>
          The Services are provided "as is" and "as available", without warranty of
          any kind, express or implied, including merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant that the
          Services will be uninterrupted, secure, or error-free.
        </p>
      </LegalSection>

      <LegalSection title="6. Limitation of liability">
        <p style={legalProse}>
          To the maximum extent permitted by law, Tekivex shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages,
          or for any loss of profits or revenues, arising out of or in connection
          with your use of the Services.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes">
        <p style={legalProse}>
          We may revise these Terms from time to time. The "Last updated" date at
          the top reflects the most recent revision. Material changes will be
          announced on the homepage.
        </p>
      </LegalSection>

      <LegalSection title="8. Governing law">
        <p style={legalProse}>
          These Terms are governed by the laws of India, without regard to its
          conflict-of-laws principles. Any disputes shall be resolved in the courts
          located in that jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p style={legalProse}>
          Questions about these Terms? Email{' '}
          <a href="mailto:nishu_singh@tekivex.com" style={{ color: '#4f46e5' }}>nishu_singh@tekivex.com</a>
          {' '}or use the <a href="/contact" style={{ color: '#4f46e5' }}>contact page</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
