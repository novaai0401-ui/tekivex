import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from '../../App';
import { getSeoForRoute } from '../../platform/seoConfig';
import { ARTICLES } from '../registry';

vi.mock('@mlc-ai/web-llm', () => ({ CreateMLCEngine: vi.fn(), prebuiltAppConfig: { model_list: [] } }));

function pushRoute(path: string) {
  window.history.pushState(null, '', path);
}

describe('use-cases routing', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    localStorage.setItem('hub-theme-reset-v2', '1');
  });

  it('renders the content hub at /use-cases', () => {
    pushRoute('/use-cases');
    render(<App />);
    expect(screen.queryByTestId('notfound-page')).not.toBeInTheDocument();
    expect(screen.getByText(/Product guides/i)).toBeInTheDocument();
  });

  it('treats a real article slug as a known route', () => {
    pushRoute(`/use-cases/${ARTICLES[0].slug}`);
    render(<App />);
    expect(screen.queryByTestId('notfound-page')).not.toBeInTheDocument();
  });

  it('404s on an unknown use-cases slug', () => {
    pushRoute('/use-cases/not-a-real-article');
    render(<App />);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });
});

describe('use-cases SEO', () => {
  it('hub returns a CollectionPage with canonical', () => {
    const seo = getSeoForRoute('/use-cases');
    expect(seo.canonical).toBe('https://www.tekivex.com/use-cases');
    const ld = seo.jsonLd as Record<string, unknown>;
    expect(ld['@type']).toBe('CollectionPage');
  });

  it('an article returns TechArticle + BreadcrumbList JSON-LD and correct canonical', () => {
    const slug = ARTICLES[0].slug;
    const seo = getSeoForRoute(`/use-cases/${slug}`);
    expect(seo.canonical).toBe(`https://www.tekivex.com/use-cases/${slug}`);
    expect(seo.ogType).toBe('article');
    const blocks = seo.jsonLd as Array<Record<string, any>>;
    expect(Array.isArray(blocks)).toBe(true);
    const types = blocks.map((b) => b['@type']);
    expect(types).toContain('TechArticle');
    expect(types).toContain('BreadcrumbList');
    const article = blocks.find((b) => b['@type'] === 'TechArticle')!;
    expect(article.author['@type']).toBe('Person');
    expect(article.author.name.length).toBeGreaterThan(0);
    expect(Array.isArray(article.author.sameAs)).toBe(true);
    expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('does not noindex real article routes', () => {
    const seo = getSeoForRoute(`/use-cases/${ARTICLES[0].slug}`);
    expect(seo.noindex).toBeFalsy();
  });
});
