import { describe, it, expect } from 'vitest';
import {
  ARTICLES,
  getArticle,
  getArticlesByProduct,
  getArticlesForProductId,
  getArticlesGroupedByProduct,
} from '../registry';
import { getProduct } from '../../platform/registry';
import { getAuthor } from '../authors';

// Load every article markdown at test time via Vite (no node:fs needed).
const MD = import.meta.glob('../../../public/use-cases/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function readArticle(contentFile: string): string | undefined {
  const entry = Object.entries(MD).find(([path]) => path.endsWith(`/${contentFile}`));
  return entry?.[1];
}

describe('use-cases article registry', () => {
  it('ships a curated library of in-depth articles', () => {
    // Curated set — focused on the three published products (GridStorm,
    // Tekivex UI, Quantum Vault). Kept intentionally substantial.
    expect(ARTICLES.length).toBeGreaterThanOrEqual(12);
  });

  it('has unique slugs', () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every article has the required metadata', () => {
    for (const a of ARTICLES) {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/);
      expect(a.title.length).toBeGreaterThan(10);
      expect(a.description.length).toBeGreaterThan(20);
      expect(a.kind.length).toBeGreaterThan(0);
      expect(a.keywords.length).toBeGreaterThan(0);
      expect(a.readingMinutes).toBeGreaterThan(0);
      expect(a.author.length).toBeGreaterThan(0);
      expect(getAuthor(a.authorId), `unknown author for ${a.slug}`).toBeDefined();
      expect(a.author).toBe(getAuthor(a.authorId)!.name);
      expect(a.contentFile).toBe(`${a.slug}.md`);
      expect(a.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('anchors every article to a real product id', () => {
    for (const a of ARTICLES) {
      expect(getProduct(a.productId), `unknown product for ${a.slug}`).toBeDefined();
    }
  });

  it('has a non-trivial markdown file for every article, with no stray H1', () => {
    for (const a of ARTICLES) {
      const md = readArticle(a.contentFile);
      expect(md, `missing content file: ${a.contentFile}`).toBeDefined();
      // Substantial content (not a thin stub).
      expect(md!.length, `thin content: ${a.contentFile}`).toBeGreaterThan(2000);
      // The page renders the title as <h1>; markdown must not add its own.
      // (Ignore '#' that appear inside fenced code blocks.)
      const withoutCode = md!.replace(/```[\s\S]*?```/g, '');
      expect(/^#\s/m.test(withoutCode), `markdown has a stray H1: ${a.contentFile}`).toBe(false);
    }
  });

  it('getArticle resolves a known slug and rejects unknown', () => {
    expect(getArticle(ARTICLES[0].slug)).toBeDefined();
    expect(getArticle('does-not-exist')).toBeUndefined();
  });

  it('groups articles by product without dropping any', () => {
    const grouped = getArticlesGroupedByProduct();
    const total = grouped.reduce((n, g) => n + g.articles.length, 0);
    expect(total).toBe(ARTICLES.length);
  });

  it('finds articles by product name and id', () => {
    const gs = getArticlesByProduct('GridStorm');
    expect(gs.length).toBeGreaterThan(0);
    expect(getArticlesForProductId('gridstorm').length).toBeGreaterThanOrEqual(gs.length);
  });
});
