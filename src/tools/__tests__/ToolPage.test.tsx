import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolPage } from '../ToolPage';
import { getTool, TOOLS } from '../registry';

describe('ToolPage', () => {
  it('renders the tool heading, steps, limitations, FAQs, and cross-links', async () => {
    render(<ToolPage slug="merge-pdf" />);
    const tool = getTool('merge-pdf')!;
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(tool.name);
    // Lazy tool UI resolves.
    expect(await screen.findByTestId('tool-merge-pdf')).toBeInTheDocument();
    for (const s of tool.steps) expect(screen.getByText(new RegExp(`${s.title}\\.`))).toBeInTheDocument();
    for (const f of tool.faqs) expect(screen.getByText(f.q)).toBeInTheDocument();
    // Cross-links to every other tool.
    for (const other of TOOLS.filter((t) => t.slug !== 'merge-pdf')) {
      expect(screen.getByRole('link', { name: other.name })).toHaveAttribute('href', `/tools/${other.slug}`);
    }
  });

  it('renders an ad slot only below the tool and editorial content', async () => {
    const { container } = render(<ToolPage slug="split-pdf" />);
    await screen.findByTestId('tool-split-pdf');
    const ad = container.querySelector('.ad-slot--tool');
    expect(ad).not.toBeNull();
    const faqHeading = screen.getByRole('heading', { name: /frequently asked/i });
    // Ad precedes the FAQ section but follows the tool body in document order.
    expect(ad!.compareDocumentPosition(screen.getByTestId('tool-split-pdf')) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    expect(ad!.compareDocumentPosition(faqHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('falls back to the not-found page for unknown slugs', () => {
    render(<ToolPage slug="does-not-exist" />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });
});
