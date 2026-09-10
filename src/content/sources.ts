import { ARTICLES } from './registry';

// Ship the small editorial library with the app. Initial rendering and SPA
// navigation must not depend on a second request for the article body.
// The separate Node prerenderer imports App while rendering trust pages. It
// renders articles directly from disk, and does not run Vite's glob transform.
const sources: Record<string, string> = typeof window === 'undefined' ? {} : import.meta.glob<string>('/public/use-cases/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getArticleSource(contentFile: string): string | undefined {
  return sources[`/public/use-cases/content/${contentFile}`];
}

for (const article of ARTICLES) {
  if (typeof window !== 'undefined' && !getArticleSource(article.contentFile)?.trim()) {
    throw new Error(`Missing article content: ${article.contentFile}`);
  }
}
