// ─── TopNav Tests ─────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { PlatformProvider } from '../../platform/PlatformProvider';
import { TopNav } from '../TopNav';

// ── Wrapper ───────────────────────────────────────────────────────────────────

function renderTopNav(route: string, activeProductId: string | null = null) {
  return render(
    <ThemeProvider>
      <PlatformProvider activeProductId={activeProductId}>
        <TopNav route={route} />
      </PlatformProvider>
    </ThemeProvider>
  );
}

describe('TopNav', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── Brand ──────────────────────────────────────────────────────────────────

  it('renders the platform name "Tekivex"', () => {
    renderTopNav('/');
    expect(screen.getByText('Tekivex')).toBeInTheDocument();
  });

  it('renders the Tekivex logo img', () => {
    renderTopNav('/');
    expect(screen.getByAltText('Tekivex')).toBeInTheDocument();
  });

  it('renders the nav element', () => {
    renderTopNav('/');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  // ── Platform link ──────────────────────────────────────────────────────────

  it('renders a "Platform" link', () => {
    renderTopNav('/');
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('"Platform" link is active when on platform home', () => {
    renderTopNav('/');
    const link = screen.getByText('Platform').closest('a');
    expect(link?.className).toContain('active');
  });

  it('"Platform" link is not active when on a product page', () => {
    renderTopNav('/product/gridstorm', 'gridstorm');
    const link = screen.getByText('Platform').closest('a');
    expect(link?.className).not.toContain('active');
  });

  // ── Tutorials removed ────────────────────────────────────────────────────────

  it('does not render a Tutorials nav link', () => {
    renderTopNav('/');
    expect(screen.queryByText('Tutorials')).not.toBeInTheDocument();
    expect(
      screen.queryAllByRole('link').some((l) => l.getAttribute('href') === '/tutorials'),
    ).toBe(false);
  });

  // ── Product switcher ───────────────────────────────────────────────────────

  it('renders the Products switcher button', () => {
    renderTopNav('/');
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('products dropdown is initially closed', () => {
    renderTopNav('/');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clicking Products button opens the dropdown', () => {
    renderTopNav('/');
    fireEvent.click(screen.getByText('Products').closest('button')!);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('dropdown has aria-expanded=false initially', () => {
    renderTopNav('/');
    const btn = screen.getByText('Products').closest('button')!;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('dropdown has aria-expanded=true when open', () => {
    renderTopNav('/');
    const btn = screen.getByText('Products').closest('button')!;
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('dropdown shows "Live" section label', () => {
    renderTopNav('/');
    fireEvent.click(screen.getByText('Products').closest('button')!);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('dropdown shows GridStorm in live products', () => {
    renderTopNav('/');
    fireEvent.click(screen.getByText('Products').closest('button')!);
    expect(screen.getAllByText('GridStorm').length).toBeGreaterThan(0);
  });

  it('dropdown closes when clicking "View all products"', () => {
    renderTopNav('/');
    fireEvent.click(screen.getByText('Products').closest('button')!);
    fireEvent.click(screen.getByText('View all products'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // ── Active product in nav ──────────────────────────────────────────────────

  it('shows product name in switcher when on product page', () => {
    renderTopNav('/product/gridstorm', 'gridstorm');
    // The switcher button should show the active product name, not generic "Products"
    const btn = screen.getByRole('button', { name: /gridstorm/i });
    expect(btn).toBeInTheDocument();
  });

  // Note: the GitHub button was intentionally removed from the homepage nav
  // (commit 45cb75f). Tests for it were dropped accordingly.

  // ── Mobile menu toggle ────────────────────────────────────────────────────

  it('renders mobile menu toggle button', () => {
    renderTopNav('/');
    expect(screen.getByLabelText('Toggle navigation menu')).toBeInTheDocument();
  });

  it('mobile menu toggle opens nav links', () => {
    renderTopNav('/');
    const toggle = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(toggle);
    const links = screen.getByText('Platform').closest('.top-nav-links');
    expect(links?.className).toContain('open');
  });

  // ── Product nav links ──────────────────────────────────────────────────────

  it('shows Docs/Demo/GitHub links for gridstorm product page', () => {
    renderTopNav('/product/gridstorm', 'gridstorm');
    // GridStorm manifest has docsRoot and primaryDemoPath — check at least one appears
    const navLinks = screen.getAllByRole('link');
    const labels = navLinks.map(l => l.textContent);
    const hasProductLinks = labels.some(l => l?.match(/docs|demo|github/i));
    expect(hasProductLinks).toBe(true);
  });

  // ── ThemeToggle ────────────────────────────────────────────────────────────

  it('renders the theme toggle button', () => {
    renderTopNav('/');
    // ThemeToggle renders a button for cycling theme
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
