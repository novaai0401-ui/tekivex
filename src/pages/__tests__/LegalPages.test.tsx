import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ConsentProvider, CONSENT_KEY } from '../../consent/ConsentProvider';
import { TermsOfServicePage } from '../TermsOfServicePage';
import { CookiePolicyPage } from '../CookiePolicyPage';
import { DisclaimerPage } from '../DisclaimerPage';
import { ContactPage } from '../ContactPage';
import { FaqPage, __FAQ_COUNT } from '../FaqPage';

function withConsent(node: React.ReactNode) {
  return <ConsentProvider>{node}</ConsentProvider>;
}

describe('TermsOfServicePage', () => {
  it('renders the heading and Tekivex contact', () => {
    render(<TermsOfServicePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms of Service');
    expect(screen.getByText(/nishu_singh@tekivex\.com/i)).toBeInTheDocument();
  });

  it('mentions MIT licensing and limitation of liability', () => {
    render(<TermsOfServicePage />);
    expect(screen.getAllByText(/MIT/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Limitation of liability/i)).toBeInTheDocument();
  });
});

describe('CookiePolicyPage', () => {
  beforeEach(() => localStorage.clear());

  it('lists the Google Analytics and AdSense cookies', () => {
    render(withConsent(<CookiePolicyPage />));
    expect(screen.getByText('_ga, _ga_*')).toBeInTheDocument();
    expect(screen.getByText('__gads, __gpi, IDE')).toBeInTheDocument();
  });

  it('shows the current consent status', () => {
    render(withConsent(<CookiePolicyPage />));
    expect(screen.getByTestId('consent-status').textContent).toBe('undecided');
  });

  it('Reopen banner button resets consent to undecided', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    render(withConsent(<CookiePolicyPage />));
    expect(screen.getByTestId('consent-status').textContent).toBe('accepted');
    act(() => screen.getByTestId('manage-cookies').click());
    expect(screen.getByTestId('consent-status').textContent).toBe('undecided');
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
  });
});

describe('DisclaimerPage', () => {
  it('renders the heading and the informational-content section', () => {
    render(<DisclaimerPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Disclaimer');
    expect(screen.getByText(/Documentation is informational/i)).toBeInTheDocument();
  });
});

describe('ContactPage', () => {
  it('exposes a real mailto link', () => {
    render(<ContactPage />);
    const link = screen.getByTestId('contact-email') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('mailto:nishu_singh@tekivex.com');
  });

  it('links to the public issue tracker', () => {
    render(<ContactPage />);
    const issues = screen.getByRole('link', { name: /github\.com\/.*tekivex-issue-report/i });
    expect(issues).toHaveAttribute('target', '_blank');
    expect(issues).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});

describe('FaqPage', () => {
  it('renders the FAQPage JSON-LD schema', () => {
    render(<FaqPage />);
    const script = screen.getByTestId('faq-jsonld');
    const parsed = JSON.parse(script.textContent || '{}');
    expect(parsed['@type']).toBe('FAQPage');
    expect(Array.isArray(parsed.mainEntity)).toBe(true);
    expect(parsed.mainEntity.length).toBe(__FAQ_COUNT);
    expect(parsed.mainEntity[0]['@type']).toBe('Question');
    expect(parsed.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });

  it('renders every question as a <details> element', () => {
    const { container } = render(<FaqPage />);
    expect(container.querySelectorAll('details').length).toBe(__FAQ_COUNT);
  });
});
