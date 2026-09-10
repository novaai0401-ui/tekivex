import { ARTICLES } from './registry';

// Ship the small editorial library with the app. Initial rendering and SPA
// navigation must not depend on a second request for the article body.
const sources = import.meta.glob<string>('/public/use-cases/content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getArticleSource(contentFile: string): string | undefined {
  return sources[`/public/use-cases/content/${contentFile}`];
}

for (const article of ARTICLES) {
  if (!getArticleSource(article.contentFile)?.trim()) {
    throw new Error(`Missing article content: ${article.contentFile}`);
  }
}
