import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from '../../App';
import { NotFoundPage } from '../NotFoundPage';

function pushRoute(path: string) {
  window.history.pushState(null, '', path);
}

describe('NotFoundPage', () => {
  beforeEach(() => {
    cleanup();
    document.head.querySelectorAll('meta[name="robots"]').forEach((m) => m.remove());
  });

  it('renders the 404 heading and helpful links', () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/404 · Page not found/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/couldn't find/i);
    expect(screen.getByRole('link', { name: /^Home$/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^Products$/ })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /^Contact$/ })).toHaveAttribute('href', '/contact');
  });

  it('App renders NotFoundPage for an unknown route and sets noindex', () => {
    pushRoute('/this-route-does-not-exist');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toBe('noindex, follow');
  });

  it('App does not 404 on a known static route', () => {
    pushRoute('/faq');
    render(<App />);
    expect(screen.queryByTestId('notfound-page')).not.toBeInTheDocument();
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('index, follow');
  });

  it('App 404s on the removed /tutorials route', () => {
    pushRoute('/tutorials');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });

  it('App 404s on a former tutorial topic route', () => {
    pushRoute('/tutorials/system-design/cap-theorem');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });

  it('App 404s on a product id that does not exist', () => {
    pushRoute('/product/fake-product-xyz');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });

  it('App does NOT 404 on a real product id', () => {
    pushRoute('/product/gridstorm');
    render(<App />);
    expect(screen.queryByTestId('notfound-page')).not.toBeInTheDocument();
  });

  it('suppresses the cookie banner on the 404 page', () => {
    localStorage.clear();
    pushRoute('/this-route-does-not-exist');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
    expect(screen.queryByText(/Cookies on Tekivex/i)).not.toBeInTheDocument();
  });

  it('still shows the cookie banner on a real route', () => {
    localStorage.clear();
    pushRoute('/faq');
    render(<App />);
    expect(screen.getByText(/Cookies on Tekivex/i)).toBeInTheDocument();
  });
});
