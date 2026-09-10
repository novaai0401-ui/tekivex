import { Link, navigate } from '../App';
import { AdSlot } from '../ads/AdSlot';
import { Markdown } from './Markdown';
import { getArticle, getArticlesByProduct } from './registry';
import { getAuthor } from './authors';
import { getProduct } from '../platform/registry';
import { getArticleSource } from './sources';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function ArticlePage({ slug }: { slug: string }) {
  const article = getArticle(slug);
  const source = article ? getArticleSource(article.contentFile) : undefined;

  if (!article) {
    return (
      <div className="uc-article" style={{ textAlign: 'center' }}>
        <h1 className="uc-article-title">Article not found</h1>
        <p className="uc-article-lead">No article exists at this URL.</p>
        <Link to="/use-cases" className="uc-back-link">← All use cases</Link>
      </div>
    );
  }

  const product = getProduct(article.productId);
  const author = getAuthor(article.authorId);
  const related = getArticlesByProduct(article.productName).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="uc-article">
      <nav aria-label="Breadcrumb" className="uc-breadcrumb">
        <Link to="/">Tekivex</Link>
        <span className="uc-breadcrumb-sep">›</span>
        <Link to="/use-cases">Use Cases</Link>
        <span className="uc-breadcrumb-sep">›</span>
        <span className="uc-breadcrumb-current">{article.productName}</span>
      </nav>

      <span className="uc-kind-pill">{article.kind}</span>
      <h1 className="uc-article-title">{article.title}</h1>
      <p className="uc-article-lead">{article.description}</p>

      <div className="uc-article-meta">
        <span className="uc-byline">By {author ? <Link to={`/authors/${author.id}`}>{author.name}</Link> : article.author}</span>
        <span className="uc-meta-sep">·</span>
        <time dateTime={article.datePublished}>{formatDate(article.datePublished)}</time>
        {article.dateModified !== article.datePublished && (
          <>
            <span className="uc-meta-sep">·</span>
            <span>Updated <time dateTime={article.dateModified}>{formatDate(article.dateModified)}</time></span>
          </>
        )}
        <span className="uc-meta-sep">·</span>
        <span>{article.readingMinutes} min read</span>
      </div>

      {!source && (
        <p className="uc-article-lead" role="alert">
          This article could not be loaded. Please try again later.
        </p>
      )}

      {source && <Markdown source={source} />}

      {/* This length guard prevents empty placements; it is not a content
          quality assessment or an AdSense approval criterion. */}
      {source && source.length > 1500 && (
        <AdSlot slot="5896441076" label="Sponsored" className="ad-slot--article" />
      )}

      {author && (
        <aside className="uc-author-box">
          <div className="uc-author-avatar" aria-hidden="true">
            {author.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </div>
          <div className="uc-author-meta">
            <span className="uc-author-label">Written by</span>
            <strong className="uc-author-name">{author.name}</strong>
            <span className="uc-author-role">{author.role}</span>
            <p className="uc-author-bio">{author.bio}</p>
            <span className="uc-author-links">
              <Link to={`/authors/${author.id}`} rel="author">Profile</Link>
              <span className="uc-meta-sep">·</span>
              <a href={author.url} target="_blank" rel="noopener noreferrer author">LinkedIn</a>
              <span className="uc-meta-sep">·</span>
              <a href={`mailto:${author.email}`} rel="author">Email</a>
            </span>
          </div>
        </aside>
      )}

      {product && (
        <aside className="uc-product-cta">
          <div className="uc-product-cta-text">
            <strong>About {product.name}</strong>
            <p>{product.tagline}</p>
          </div>
          <div className="uc-product-cta-actions">
            <button className="uc-btn-primary" onClick={() => navigate(product.homePath)}>
              Explore {product.name}
            </button>
            {product.primaryDemoPath && (
              <a className="uc-btn-secondary" href={product.primaryDemoPath} target="_blank" rel="noopener noreferrer">
                Live demo →
              </a>
            )}
          </div>
        </aside>
      )}

      {related.length > 0 && (
        <section className="uc-related">
          <h2 className="uc-related-title">More on {article.productName}</h2>
          <div className="uc-related-grid">
            {related.map((r) => (
              <Link key={r.slug} to={`/use-cases/${r.slug}`} className="uc-related-card">
                <span className="uc-related-kind">{r.kind}</span>
                <span className="uc-related-card-title">{r.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Link to="/use-cases" className="uc-back-link">← All use cases</Link>
    </div>
  );
}
