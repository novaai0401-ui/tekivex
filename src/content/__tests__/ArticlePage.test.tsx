import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { ArticlePage } from '../ArticlePage';
import { ARTICLES } from '../registry';
import { getArticleSource } from '../sources';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('article availability', () => {
  it('ships non-empty content for every published article', () => {
    for (const article of ARTICLES) {
      expect(getArticleSource(article.contentFile)?.trim(), article.slug).toBeTruthy();
    }
  });

  it('renders the body immediately even when network requests are unavailable', () => {
    const fetch = vi.fn(() => Promise.reject(new Error('offline')));
    vi.stubGlobal('fetch', fetch);
    const { container } = render(<ArticlePage slug={ARTICLES[0].slug} />);
    expect(container.querySelector('.uc-article-body h2')).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('switches article bodies synchronously when navigating between slugs', () => {
    const { container, rerender } = render(<ArticlePage slug={ARTICLES[0].slug} />);
    const first = container.querySelector('.uc-article-body')!.textContent;
    rerender(<ArticlePage slug={ARTICLES[1].slug} />);
    expect(container.querySelector('.uc-article-body')!.textContent).not.toBe(first);
    rerender(<ArticlePage slug="does-not-exist" />);
    expect(container.querySelector('.uc-article-body')).toBeNull();
    expect(container.querySelector('.adsbygoogle')).toBeNull();
  });
});
