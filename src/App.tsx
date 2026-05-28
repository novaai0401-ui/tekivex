import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { PlatformProvider } from './platform/PlatformProvider';
import { PlatformPage } from './pages/PlatformPage';
import { ProductHomePage } from './pages/ProductHomePage';
import { AboutPage } from './pages/AboutPage';
import { TopNav } from './layout/TopNav';
import { Footer } from './layout/Footer';
import { getActiveProductId } from './platform/registry';
import { useSeo } from './platform/useSeo';
import { getSeoForRoute } from './platform/seoConfig';

import { TutorialLanding } from './tutorials/TutorialLanding';
import { TutorialLayout } from './tutorials/TutorialLayout';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { getProduct } from './platform/registry';

const STATIC_ROUTES = new Set<string>([
  '/', '/products', '/platform', '/about',
  '/privacy-policy', '/terms-of-service', '/cookie-policy',
  '/disclaimer', '/contact', '/faq',
  '/tutorials',
]);

function isKnownRoute(route: string): boolean {
  if (STATIC_ROUTES.has(route)) return true;
  if (route.startsWith('/tutorials/')) return true;
  if (route.startsWith('/product/')) {
    const id = route.slice('/product/'.length).split('/')[0];
    return !!id && !!getProduct(id);
  }
  return false;
}
import { ConsentProvider } from './consent/ConsentProvider';
import { CookieBanner } from './consent/CookieBanner';
import { ScriptLoader } from './consent/ScriptLoader';

const CONSENT_BANNER_SUPPRESS_ROUTES = new Set<string>([
  '/privacy-policy',
  '/cookie-policy',
  '/terms-of-service',
  '/disclaimer',
]);

// History API routing — real URLs (not hash fragments) so Google indexes
// every page as a distinct document. SPA fallback is configured in
// vercel.json so any URL hits index.html and React resolves it client-side.
function useHistoryRoute(): string {
  const [path, setPath] = React.useState(
    typeof window === 'undefined' ? '/' : window.location.pathname || '/',
  );
  React.useEffect(() => {
    const handler = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', handler);
    // Custom event so navigate() can notify subscribers without round-tripping
    window.addEventListener('tekivex:navigate', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('tekivex:navigate', handler);
    };
  }, []);
  return path;
}

export function navigate(path: string) {
  if (typeof window === 'undefined') return;
  // External / absolute URLs — let the browser handle them.
  if (/^https?:/.test(path)) {
    window.location.href = path;
    return;
  }
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('tekivex:navigate'));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/**
 * Internal SPA link. Behaves like <a> for crawlers and right-click but uses
 * history.pushState for in-app navigation so the page does not reload.
 */
export function Link({
  to,
  children,
  ...rest
}: { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (rest.target === '_blank') return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function App() {
  const route = useHistoryRoute();
  const activeProductId = getActiveProductId(route);

  // Scroll to top on every route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);

  const isKnown = isKnownRoute(route);
  const seo = isKnown
    ? getSeoForRoute(route)
    : {
        title: 'Page not found — Tekivex',
        description: 'The page you are looking for does not exist on tekivex.com. Browse our products, tutorials, or contact us.',
        canonical: 'https://tekivex.com' + route,
        noindex: true,
        jsonLd: null,
      };
  useSeo(seo);

  let page: React.ReactNode;

  if (!isKnown) {
    page = <NotFoundPage />;
  } else if (route === '/tutorials') {
    page = <TutorialLanding />;
  } else if (route.startsWith('/tutorials/')) {
    const parts = route.slice('/tutorials/'.length).split('/');
    const categoryId = parts[0];
    const topicSlug = parts[1] ?? null;
    page = <TutorialLayout categoryId={categoryId} topicSlug={topicSlug} />;
  } else if (route.startsWith('/product/')) {
    const productId = route.slice('/product/'.length).split('/')[0];
    page = <ProductHomePage productId={productId ?? ''} />;
  } else if (route === '/about') {
    page = <AboutPage />;
  } else if (route === '/privacy-policy') {
    page = <PrivacyPolicyPage />;
  } else if (route === '/terms-of-service') {
    page = <TermsOfServicePage />;
  } else if (route === '/cookie-policy') {
    page = <CookiePolicyPage />;
  } else if (route === '/disclaimer') {
    page = <DisclaimerPage />;
  } else if (route === '/contact') {
    page = <ContactPage />;
  } else if (route === '/faq') {
    page = <FaqPage />;
  } else {
    page = <PlatformPage />;
  }

  return (
    <ThemeProvider>
      <ConsentProvider>
        <PlatformProvider activeProductId={activeProductId}>
          <div className="bg-pattern" />
          <div className="bg-glow" />
          <div className="hub-container">
            <TopNav route={route} />
            {page}
            <Footer />
          </div>
          <CookieBanner suppressOnRoute={CONSENT_BANNER_SUPPRESS_ROUTES.has(route) || !isKnown} />
          <ScriptLoader />
          {/* AI Support Chat — temporarily disabled */}
        </PlatformProvider>
      </ConsentProvider>
    </ThemeProvider>
  );
}
