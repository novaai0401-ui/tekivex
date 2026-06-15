// ─── ThemeProvider Tests ──────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from '../ThemeProvider';
import type { HubTheme } from '../ThemeProvider';

// ── Consumer helper ───────────────────────────────────────────────────────────

function ThemeConsumer() {
  const { theme, setTheme, cycleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">Set Dark</button>
      <button onClick={() => setTheme('light')} data-testid="set-light">Set Light</button>
      <button onClick={() => setTheme('high-contrast')} data-testid="set-hc">Set HC</button>
      <button onClick={cycleTheme} data-testid="cycle">Cycle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mark the one-time "stale dark → light" migration as already applied so
    // these tests exercise a returning visitor whose stored preference is
    // honoured. The migration itself is covered by its own test below.
    localStorage.setItem('hub-theme-reset-v2', '1');
    // Reset data-hub-theme attribute
    delete document.documentElement.dataset.hubTheme;
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Initial theme ──────────────────────────────────────────────────────────

  it('defaults to "light" when nothing is stored', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('restores stored theme from localStorage', () => {
    localStorage.setItem('hub-theme', 'dark');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('restores "high-contrast" theme from localStorage', () => {
    localStorage.setItem('hub-theme', 'high-contrast');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('high-contrast');
  });

  it('ignores invalid stored theme value and falls back to "light"', () => {
    localStorage.setItem('hub-theme', 'invalid-theme');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('one-time migration resets a stale stored "dark" preference to "light"', () => {
    // Returning visitor from before light became the default: 'dark' is stored
    // but the migration flag has not been set yet.
    localStorage.removeItem('hub-theme-reset-v2');
    localStorage.setItem('hub-theme', 'dark');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    expect(screen.getByTestId('theme').textContent).toBe('light');
    // Flag is now persisted so the migration runs only once.
    expect(localStorage.getItem('hub-theme-reset-v2')).toBe('1');
  });

  // ── setTheme ───────────────────────────────────────────────────────────────

  it('setTheme("dark") updates theme to dark', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('setTheme("light") updates theme to light', () => {
    localStorage.setItem('hub-theme', 'dark');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('set-light'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('setTheme("high-contrast") updates theme', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('set-hc'));
    expect(screen.getByTestId('theme').textContent).toBe('high-contrast');
  });

  it('setTheme persists to localStorage', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(localStorage.getItem('hub-theme')).toBe('dark');
  });

  it('setTheme updates document.documentElement data attribute', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('set-dark'));
    expect(document.documentElement.dataset.hubTheme).toBe('dark');
  });

  // ── cycleTheme ────────────────────────────────────────────────────────────

  it('cycleTheme advances light → dark', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    // starts at light
    fireEvent.click(screen.getByTestId('cycle'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('cycleTheme advances dark → high-contrast', () => {
    localStorage.setItem('hub-theme', 'dark');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('cycle'));
    expect(screen.getByTestId('theme').textContent).toBe('high-contrast');
  });

  it('cycleTheme wraps high-contrast → light', () => {
    localStorage.setItem('hub-theme', 'high-contrast');
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    fireEvent.click(screen.getByTestId('cycle'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('cycleTheme three times returns to starting theme', () => {
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>);
    const startTheme = screen.getByTestId('theme').textContent;
    fireEvent.click(screen.getByTestId('cycle'));
    fireEvent.click(screen.getByTestId('cycle'));
    fireEvent.click(screen.getByTestId('cycle'));
    expect(screen.getByTestId('theme').textContent).toBe(startTheme);
  });

  // ── Children rendering ─────────────────────────────────────────────────────

  it('renders children', () => {
    render(
      <ThemeProvider>
        <span>content</span>
      </ThemeProvider>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  // ── useTheme outside provider ──────────────────────────────────────────────

  it('useTheme throws when used outside ThemeProvider', () => {
    const originalError = console.error;
    console.error = () => {};
    expect(() => render(<ThemeConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    console.error = originalError;
  });
});
