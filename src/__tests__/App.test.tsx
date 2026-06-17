// ─── App Integration Tests ────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { App } from '../App';

// Stub heavy AI modules that use WebGPU / WebWorker in jsdom
vi.mock('../ai-support/AiChat', () => ({
  AiChatWidget: () => <div data-testid="ai-chat-stub" />,
}));

// Stub @mlc-ai/web-llm entirely (not available in test env)
vi.mock('@mlc-ai/web-llm', () => ({
  CreateMLCEngine: vi.fn(),
  prebuiltAppConfig: { model_list: [] },
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    // Treat the one-time stale-dark → light migration as already applied so
    // a stored preference is honoured (see ThemeProvider migration test).
    localStorage.setItem('hub-theme-reset-v2', '1');
    window.location.hash = '';
    delete document.documentElement.dataset.hubTheme;
  });

  afterEach(() => {
    window.location.hash = '';
  });

  // ── Renders without crash ─────────────────────────────────────────────────

  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('renders the TopNav', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders the "Tekivex" brand name', () => {
    render(<App />);
    // Brand logo appears in both the top nav and the footer.
    expect(screen.getAllByAltText('Tekivex').length).toBeGreaterThan(0);
  });

  // ── Hash routing ───────────────────────────────────────────────────────────

  it('renders PlatformPage on "/" route (default)', () => {
    window.location.hash = '';
    render(<App />);
    // PlatformPage renders the product grid — check for known content.
    // "Platform" appears in both the nav link and the footer.
    expect(screen.getAllByText('Platform').length).toBeGreaterThan(0);
  });

  it('renders ProductHomePage when route starts with "/product/"', () => {
    window.location.hash = '#/product/gridstorm';
    render(<App />);
    // GridStorm product page should include product name
    expect(screen.getAllByText(/GridStorm/i).length).toBeGreaterThan(0);
  });

  // ── SEO ───────────────────────────────────────────────────────────────────

  it('sets document.title on render', () => {
    render(<App />);
    expect(document.title.length).toBeGreaterThan(0);
  });

  it('document.title contains "Tekivex" for home route', () => {
    window.location.hash = '';
    render(<App />);
    expect(document.title).toContain('Tekivex');
  });

  // ── Theme ─────────────────────────────────────────────────────────────────

  it('applies theme data attribute to document root', () => {
    render(<App />);
    expect(document.documentElement.dataset.hubTheme).toBeDefined();
  });

  it('applies "light" theme by default (no stored preference)', () => {
    render(<App />);
    expect(document.documentElement.dataset.hubTheme).toBe('light');
  });

  it('restores stored theme from localStorage', () => {
    localStorage.setItem('hub-theme', 'dark');
    render(<App />);
    expect(document.documentElement.dataset.hubTheme).toBe('dark');
  });

  // ── Hash change ───────────────────────────────────────────────────────────

  it('navigates on hash change', async () => {
    render(<App />);
    await act(async () => {
      window.location.hash = '#/product/gridstorm';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getAllByText(/GridStorm/i).length).toBeGreaterThan(0);
  });

  // ── Tutorials fully removed (visitor's view) ───────────────────────────────

  it('exposes no /tutorials link anywhere in the rendered app (home)', () => {
    window.history.pushState(null, '', '/');
    const { container } = render(<App />);
    const tutorialLinks = Array.from(container.querySelectorAll('a')).filter((a) =>
      (a.getAttribute('href') || '').startsWith('/tutorials'),
    );
    expect(tutorialLinks).toHaveLength(0);
  });

  it('renders no "Tutorials" nav/footer label anywhere on the home page', () => {
    window.history.pushState(null, '', '/');
    render(<App />);
    expect(screen.queryByText(/^Tutorials$/)).not.toBeInTheDocument();
  });

  it('shows the 404 page when a visitor opens an old tutorial URL', () => {
    window.history.pushState(null, '', '/tutorials/ai-ml/neural-network-basics');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });
});
