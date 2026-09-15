import { LegalLayout, LegalSection, legalProse, legalLi } from './LegalLayout';

const link = { color: '#4f46e5' } as const;
const strong = { color: 'var(--hub-text)' } as const;

export function EditorialPolicyPage() {
  return (
    <LegalLayout
      eyebrow="How we publish"
      title="Editorial Policy"
      lastUpdated="September 15, 2026"
      intro={
        <p style={{ ...legalProse, margin: 0 }}>
          This page explains who writes the guides and product pages on tekivex.com,
          how technical claims are checked, how articles are dated and corrected, and
          how we keep editorial content independent of the advertising that funds the
          site. It applies to every article under{' '}
          <a href="/use-cases" style={link}>Guides</a>, every product page, and the
          free tool pages.
        </p>
      }
    >
      <LegalSection title="Who writes for Tekivex">
        <p style={legalProse}>
          Each guide has a named maintainer responsible for its upkeep and carries a byline that
          links to an author page. Our current authors are:
        </p>
        <ul>
          <li style={legalLi}>
            <a href="/authors/chandan-kumar" style={link}>Chandan Kumar</a> — Assistant
            Vice President, UI Lead &amp; Technical Project Leadership.
          </li>
          <li style={legalLi}>
            <a href="/authors/seema-almas-shaikh" style={link}>Seema Almas Shaikh</a> —
            Vice President, Technical Lead &amp; Frontend Architect.
          </li>
        </ul>
        <p style={legalProse}>
          Author pages list the
          role, background, and articles of each author. A byline identifies responsibility for upkeep; it is not evidence of an independent review.
        </p>
      </LegalSection>

      <LegalSection title="How technical claims are verified">
        <p style={legalProse}>
          Tekivex writes about its own software, and that software is open: the libraries
          are published on npm and developed in public repositories. That lets us hold
          articles to a simple standard —{' '}
          <strong style={strong}>a claim about a product must be true of the code that ships</strong>.
          Our verification process is:
        </p>
        <ul>
          <li style={legalLi}>Check feature descriptions against a specific source revision or release and state that scope.</li>
          <li style={legalLi}>Record the browser and inputs when a guide reports an executed workflow; distinguish tested examples from instructions.</li>
          <li style={legalLi}>Only present a performance figure as measured when its method and conditions are provided; otherwise qualify or remove it.</li>
          <li style={legalLi}>Where a page describes a product as Beta or Preview, that label reflects its real maturity, as set out in our <a href="/disclaimer" style={link}>disclaimer</a>.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Comparisons and competitors">
        <p style={legalProse}>
          When we compare a Tekivex product with an alternative, the comparison must be
          one a user of the alternative would recognise as fair. We state the genuine
          strengths of the competitor and our own limitations in the same article, and
          we prefer verifiable facts — licensing terms, bundle size, feature presence —
          over adjectives. If a comparison becomes outdated because a competitor ships
          something new, we update or withdraw it.
        </p>
      </LegalSection>

      <LegalSection title="Dates, updates, and corrections">
        <ul>
          <li style={legalLi}>Every article shows the date it was published and, when materially revised, the date it was last updated.</li>
          <li style={legalLi}>Articles are reviewed when the product they describe changes. A guide that no longer matches the tool is updated rather than left to mislead.</li>
          <li style={legalLi}>Anyone can report an error via the <a href="/contact" style={link}>contact page</a> or our public issue tracker. We check the report, fix confirmed errors, and bump the revision date of the article.</li>
          <li style={legalLi}>Corrections that change the substance of an article are noted in the text, not silently overwritten.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Advertising and editorial independence">
        <p style={legalProse}>
          The marketing site includes placements for Google AdSense advertisements to help keep every
          Tekivex product free, as described in our{' '}
          <a href="/privacy-policy" style={link}>privacy policy</a> and{' '}
          <a href="/cookie-policy" style={link}>cookie policy</a>. Advertising has no
          influence on what we write, which products we recommend, or how we describe
          alternatives. Ads are clearly distinguished from content, are never placed
          inside the interactive tools. Google handles advertising preferences separately from our analytics banner.
        </p>
        <p style={legalProse}>
          We do not publish sponsored articles or affiliate links. If that ever changes,
          any such content will be labelled as sponsored at the top of the page.
        </p>
      </LegalSection>

      <LegalSection title="Use of AI tools">
        <p style={legalProse}>
          A named author is accountable for every published article. Where software
          tools — including AI assistants — help with drafting, formatting, or research,
          the listed maintainer remains responsible for accuracy and corrections. Guides should provide source links or reproducible evidence for technical claims. Software assistance and a byline do not establish that every example has been independently tested.
        </p>
      </LegalSection>

      <LegalSection title="Privacy of readers">
        <p style={legalProse}>
          Reading an article or using a tool never requires an account. The free tools
          process files entirely in your browser and never upload them; our guide{' '}
          <a href="/use-cases/why-browser-tools-keep-files-private" style={link}>
            Why in-browser tools keep your files private
          </a>{' '}
          explains how to verify that for yourself.
        </p>
      </LegalSection>

      <LegalSection title="Questions about this policy">
        <p style={legalProse}>
          Use the <a href="/contact" style={link}>contact page</a>. We treat questions
          about accuracy and independence as a priority.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
