import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrandFaq } from '../BrandFaq';

afterEach(() => {
  cleanup();
  document.getElementById('tx-faq-jsonld')?.remove();
});

// The FAQ accordion only renders the open answer in the DOM, but the
// FAQPage JSON-LD serialises every answer — so it is the reliable place
// to assert on the full FAQ content regardless of which item is open.
function readFaqJsonLd(): string {
  const jsonLd = document.getElementById('tx-faq-jsonld');
  expect(jsonLd).not.toBeNull();
  return (jsonLd?.textContent ?? '').toLowerCase();
}

describe('BrandFaq', () => {
  it('renders the FAQ section heading', () => {
    render(<BrandFaq />);
    expect(
      screen.getByText('Frequently asked questions about Tekivex'),
    ).toBeInTheDocument();
  });

  it('does not reference a blog anywhere in the FAQ content', () => {
    render(<BrandFaq />);
    const content = readFaqJsonLd();
    expect(content).not.toContain('blog');
    expect(content).not.toContain('ui.tekivex.com/blog');
  });

  it('still surfaces the live demo and playground links', () => {
    render(<BrandFaq />);
    const content = readFaqJsonLd();
    expect(content).toContain('gridstorm.tekivex.com');
    expect(content).toContain('ui.tekivex.com/playground');
  });
});
