// ─── Use-Cases content types ───────────────────────────────────────────────
// Product-focused, long-form articles served on tekivex.com itself (not a
// learning blog). Every article is anchored to a real Tekivex product so the
// content is original and unique — the kind of substantial, first-party
// material Google AdSense and search engines reward.

export interface Article {
  /** URL slug — /use-cases/<slug> */
  slug: string;
  /** Article H1 / SEO title base */
  title: string;
  /** One-sentence summary (meta description + hub card) */
  description: string;
  /** Product this article is anchored to (matches a product manifest id) */
  productId: string;
  /** Human product name for breadcrumbs / grouping */
  productName: string;
  /** Short category label shown on cards (e.g. "Migration", "Architecture") */
  kind: string;
  /** SEO keywords */
  keywords: string[];
  /** Estimated reading time in minutes */
  readingMinutes: number;
  /** ISO date first published */
  datePublished: string;
  /** ISO date last updated */
  dateModified: string;
  /** Byline (author display name — resolved from authorId). */
  author: string;
  /** Id of the human author in the authors registry (E-E-A-T). */
  authorId: string;
  /** Markdown file under public/use-cases/content/<contentFile> */
  contentFile: string;
}
