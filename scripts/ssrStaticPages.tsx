// Build-time SSR entry for the static "trust" pages (About, FAQ, legal,
// contact). These pages are plain React with no WebGL/AI runtime, so they can
// be rendered to static HTML with react-dom/server and embedded in the
// prerendered shell — the crawler then sees the SAME full content users see,
// instead of a one-line summary.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AboutPage } from '../src/pages/AboutPage';
import { FaqPage, FAQS } from '../src/pages/FaqPage';
import { PrivacyPolicyPage } from '../src/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from '../src/pages/TermsOfServicePage';
import { CookiePolicyPage } from '../src/pages/CookiePolicyPage';
import { DisclaimerPage } from '../src/pages/DisclaimerPage';
import { AccessibilityPage } from '../src/pages/AccessibilityPage';
import { ContactPage } from '../src/pages/ContactPage';
import { ConsentProvider } from '../src/consent/ConsentProvider';

function render(node: React.ReactElement): string {
  // ConsentProvider is SSR-safe (localStorage reads are try/caught) and is
  // required by CookiePolicyPage's useConsent hook.
  return renderToStaticMarkup(<ConsentProvider>{node}</ConsentProvider>);
}

export const STATIC_PAGE_HTML: Record<string, string> = {
  '/about': render(<AboutPage />),
  '/faq': render(<FaqPage />),
  '/privacy-policy': render(<PrivacyPolicyPage />),
  '/terms-of-service': render(<TermsOfServicePage />),
  '/cookie-policy': render(<CookiePolicyPage />),
  '/disclaimer': render(<DisclaimerPage />),
  '/accessibility': render(<AccessibilityPage />),
  '/contact': render(<ContactPage />),
};

export { FAQS };
