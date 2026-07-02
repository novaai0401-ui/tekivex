import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolsHub } from '../ToolsHub';
import { TOOLS } from '../registry';

describe('ToolsHub', () => {
  it('renders a card linking to every tool', () => {
    render(<ToolsHub />);
    for (const t of TOOLS) {
      const link = screen.getByRole('link', { name: new RegExp(t.name) });
      expect(link.getAttribute('href')).toBe(`/tools/${t.slug}`);
    }
  });

  it('leads with the privacy promise', () => {
    render(<ToolsHub />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/never upload/i);
  });
});
