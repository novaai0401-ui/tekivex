import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer — legal links', () => {
  it('links to every legal page from the bottom bar', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms-of-service');
    expect(screen.getByRole('link', { name: 'Cookies' })).toHaveAttribute('href', '/cookie-policy');
    const disclaimers = screen.getAllByRole('link', { name: 'Disclaimer' });
    expect(disclaimers.length).toBeGreaterThanOrEqual(1);
    disclaimers.forEach((el) => expect(el).toHaveAttribute('href', '/disclaimer'));
  });

  it('links to Contact and FAQ from the bottom bar', () => {
    render(<Footer />);
    expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'FAQ' }).length).toBeGreaterThan(0);
  });

  it('renders a Legal column with all 5 entries', () => {
    render(<Footer />);
    const heading = screen.getByText('Legal');
    expect(heading).toBeInTheDocument();
    const col = heading.parentElement;
    expect(col?.textContent).toContain('Privacy Policy');
    expect(col?.textContent).toContain('Terms of Service');
    expect(col?.textContent).toContain('Cookie Policy');
    expect(col?.textContent).toContain('Disclaimer');
    expect(col?.textContent).toContain('Contact');
  });

  it('does not link to the removed tutorials section', () => {
    render(<Footer />);
    expect(
      screen.queryAllByRole('link').some((l) => l.getAttribute('href') === '/tutorials'),
    ).toBe(false);
    expect(screen.queryByRole('link', { name: 'Tutorials' })).not.toBeInTheDocument();
  });

  it('exposes legal links as internal hrefs (not external _blank)', () => {
    render(<Footer />);
    const privacy = screen.getByRole('link', { name: 'Privacy' });
    expect(privacy).not.toHaveAttribute('target', '_blank');
  });
});
