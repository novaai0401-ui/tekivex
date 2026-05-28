import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConsentProvider, CONSENT_KEY } from '../ConsentProvider';
import { CookieBanner } from '../CookieBanner';

function renderBanner(props: { suppressOnRoute?: boolean } = {}) {
  return render(
    <ConsentProvider>
      <CookieBanner {...props} />
    </ConsentProvider>,
  );
}

describe('CookieBanner', () => {
  beforeEach(() => localStorage.clear());

  it('renders when status is undecided', () => {
    renderBanner();
    expect(screen.getByText(/Cookies on Tekivex/i)).toBeInTheDocument();
    expect(screen.getByTestId('cookie-accept')).toBeInTheDocument();
    expect(screen.getByTestId('cookie-reject')).toBeInTheDocument();
  });

  it('does not render once accepted', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    renderBanner();
    expect(screen.queryByText(/Cookies on Tekivex/i)).not.toBeInTheDocument();
  });

  it('does not render once denied', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    renderBanner();
    expect(screen.queryByText(/Cookies on Tekivex/i)).not.toBeInTheDocument();
  });

  it('does not render when suppressed on route (legal pages)', () => {
    renderBanner({ suppressOnRoute: true });
    expect(screen.queryByText(/Cookies on Tekivex/i)).not.toBeInTheDocument();
  });

  it('Accept all → persists "accepted" and dismisses the banner', () => {
    renderBanner();
    act(() => screen.getByTestId('cookie-accept').click());
    expect(localStorage.getItem(CONSENT_KEY)).toBe('accepted');
    expect(screen.queryByText(/Cookies on Tekivex/i)).not.toBeInTheDocument();
  });

  it('Reject non-essential → persists "denied" and dismisses the banner', () => {
    renderBanner();
    act(() => screen.getByTestId('cookie-reject').click());
    expect(localStorage.getItem(CONSENT_KEY)).toBe('denied');
    expect(screen.queryByText(/Cookies on Tekivex/i)).not.toBeInTheDocument();
  });

  it('links to the cookie policy page', () => {
    renderBanner();
    const link = screen.getByRole('link', { name: /cookie policy/i });
    expect(link).toHaveAttribute('href', '/cookie-policy');
  });
});
