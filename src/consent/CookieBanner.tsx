import { useConsent } from './ConsentProvider';
import { Link } from '../App';

interface CookieBannerProps {
  /** Routes where the banner should never render (legal pages with own controls). */
  suppressOnRoute?: boolean;
}

export function CookieBanner({ suppressOnRoute }: CookieBannerProps) {
  const { status, accept, reject } = useConsent();
  if (suppressOnRoute) return null;
  if (status !== 'undecided') return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-banner-title"
    >
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <strong id="cookie-banner-title">Cookies on Tekivex</strong>
          <p>
            We use cookies for analytics and to personalise the ads from Google AdSense
            that keep our tutorials free. Accept to enable personalised ads and
            analytics, or reject for non-personalised ads only. Read our{' '}
            <Link to="/cookie-policy" className="cookie-banner-link">
              cookie policy
            </Link>
            .
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-banner-btn cookie-banner-btn--ghost"
            onClick={reject}
            data-testid="cookie-reject"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            className="cookie-banner-btn cookie-banner-btn--primary"
            onClick={accept}
            data-testid="cookie-accept"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
