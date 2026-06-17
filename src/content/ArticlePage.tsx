import { useEffect, useState } from 'react';
import { Link, navigate } from '../App';
import { AdSlot } from '../ads/AdSlot';
import { Markdown } from './Markdown';
import { getArticle, getArticlesByProduct } from './registry';
import { getProduct } from '../platform/registry';

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
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!article) return;
    let cancelled = false;
    setSource(null);
    setError(false);
    fetch(`/use-cases/content/${article.contentFile}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (!cancelled) setSource(text);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [article]);

  if (!article) {
    return (
      <main className="uc-article" style={{ textAlign: 'center' }}>
        <h1 className="uc-article-title">Article not found</h1>
        <p className="uc-article-lead">No article exists at this URL.</p>
        <Link to="/use-cases" className="uc-back-link">← All use cases</Link>
      </main>
    );
  }

  const product = getProduct(article.productId);
  const related = getArticlesByProduct(article.productName).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <main className="uc-article">
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
        <span className="uc-byline">By {article.author}</span>
        <span className="uc-meta-sep">·</span>
        <time dateTime={article.datePublished}>{formatDate(article.datePublished)}</time>
        <span className="uc-meta-sep">·</span>
        <span>{article.readingMinutes} min read</span>
      </div>

      {error && (
        <p className="uc-article-lead" role="alert">
          This article could not be loaded. Please try again later.
        </p>
      )}

      {source && <Markdown source={source} />}

      {/* In-content ad — placed inside substantive editorial content only. */}
      {source && <AdSlot slot="5896441076" label="Sponsored" className="ad-slot--article" />}

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
    </main>
  );
}
