import { LegalLayout, LegalSection, legalProse } from './LegalLayout';

export function DisclaimerPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Disclaimer"
      lastUpdated="May 28, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          The information on tekivex.com is published in good faith and for general
          information purposes only. We make no warranties about completeness,
          accuracy, reliability, or suitability for your specific situation.
        </p>
      }
    >
      <LegalSection title="1. Documentation is informational">
        <p style={legalProse}>
          Product documentation, guides, and code samples published on tekivex.com
          are intended for general information. They reflect the state of the
          software at the time of writing and may not match the latest API changes,
          security advisories, or vendor recommendations. Always verify against the
          authoritative source for each product before relying on it in production.
        </p>
      </LegalSection>

      <LegalSection title="2. No professional advice">
        <p style={legalProse}>
          Nothing on this site constitutes professional engineering, legal,
          financial, or medical advice. Code samples are provided for illustration;
          you are responsible for reviewing them for correctness and security in
          the context of your own application.
        </p>
      </LegalSection>

      <LegalSection title="3. Product status">
        <p style={legalProse}>
          Products marked "Beta", "Preview", or "Coming Soon" are not feature
          complete and may change in incompatible ways. Documented APIs may move
          or be removed before a stable release.
        </p>
      </LegalSection>

      <LegalSection title="4. External links">
        <p style={legalProse}>
          Tekivex pages may contain links to third-party sites — for example
          GitHub, npm, Vercel, or vendor documentation. We do not control those
          sites and are not responsible for their content, policies, or any losses
          arising from your use of them.
        </p>
      </LegalSection>

      <LegalSection title="5. Affiliate and sponsored content">
        <p style={legalProse}>
          We display Google AdSense advertisements to support this free site. We do
          not endorse any specific advertiser. If we add affiliate or sponsored
          posts in the future, they will be clearly labelled.
        </p>
      </LegalSection>

      <LegalSection title="6. Consent">
        <p style={legalProse}>
          By using this site you consent to this Disclaimer and accept its terms.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
