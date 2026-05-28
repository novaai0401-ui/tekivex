import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrivacyPolicyPage } from '../PrivacyPolicyPage';

describe('PrivacyPolicyPage — AdSense disclosure', () => {
  it('shows the May 28 2026 last-updated date', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getAllByText(/May 28, 2026/).length).toBeGreaterThan(0);
  });

  it('discloses Google AdSense by publisher id', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText(/ca-pub-4630229006617891/)).toBeInTheDocument();
  });

  it('names the DART cookie and links to Google Ads Settings', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText(/DART/)).toBeInTheDocument();
    const optOut = screen.getByRole('link', { name: /Google Ads Settings/i });
    expect(optOut).toHaveAttribute('href', 'https://www.google.com/settings/ads');
    expect(optOut).toHaveAttribute('target', '_blank');
  });

  it('mentions the consent banner and the Reopen flow on /cookie-policy', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getAllByText(/consent banner/i).length).toBeGreaterThan(0);
    const cookieLink = screen.getByRole('link', { name: /Cookie Policy/i });
    expect(cookieLink).toHaveAttribute('href', '/cookie-policy');
  });

  it('lists Advertising cookies in the cookie types section', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText(/Advertising cookies — set by Google AdSense/i)).toBeInTheDocument();
  });

  it('links to aboutads.info for third-party opt-out', () => {
    render(<PrivacyPolicyPage />);
    const ab = screen.getByRole('link', { name: /aboutads\.info/i });
    expect(ab).toHaveAttribute('href', 'https://optout.aboutads.info/');
  });
});
