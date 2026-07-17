// ─── Author profile page — /authors/<id> ────────────────────────────────────
// A real, on-site home for each named author: who they are, what they know,
// and every article they've written here. This is the accountability page
// bylines point to (E-E-A-T): a reader (or reviewer) can go from any article
// to the person behind it, then to their external profiles.

import { Link } from '../App';
import { getAuthor } from '../content/authors';
import { getAllArticles } from '../content/registry';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function AuthorPage({ authorId }: { authorId: string }) {
  const author = getAuthor(authorId);

  if (!author) {
    return (
      <main className="uc-article" style={{ textAlign: 'center' }}>
        <h1 className="uc-article-title">Author not found</h1>
        <p className="uc-article-lead">No author profile exists at this URL.</p>
        <Link to="/use-cases" className="uc-back-link">← All articles</Link>
      </main>
    );
  }

  const articles = getAllArticles()
    .filter((a) => a.authorId === author.id)
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

  return (
    <main className="uc-article">
      <nav aria-label="Breadcrumb" className="uc-breadcrumb">
        <Link to="/">Tekivex</Link>
        <span className="uc-breadcrumb-sep">›</span>
        <Link to="/use-cases">Use Cases</Link>
        <span className="uc-breadcrumb-sep">›</span>
        <span className="uc-breadcrumb-current">{author.name}</span>
      </nav>

      <div className="uc-author-box" style={{ marginTop: 24 }}>
        <div className="uc-author-avatar" aria-hidden="true">
          {author.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </div>
        <div className="uc-author-meta">
          <h1 className="uc-article-title" style={{ fontSize: '2rem', margin: 0 }}>{author.name}</h1>
          <span className="uc-author-role">{author.role}</span>
          <p className="uc-author-bio">{author.bio}</p>
          <span className="uc-author-links">
            <a href={author.url} target="_blank" rel="noopener noreferrer me">LinkedIn</a>
            <span className="uc-meta-sep">·</span>
            <a href={`mailto:${author.email}`}>Email</a>
          </span>
        </div>
      </div>

      <section aria-label={`Articles by ${author.name}`} style={{ marginTop: 40 }}>
        <h2 className="uc-hub-section-title">
          {articles.length} article{articles.length === 1 ? '' : 's'} by {author.name.split(' ')[0]}
        </h2>
        <div className="uc-hub-grid">
          {articles.map((a) => (
            <Link key={a.slug} to={`/use-cases/${a.slug}`} className="uc-hub-card">
              <span className="uc-kind-pill uc-kind-pill--sm">{a.kind}</span>
              <h3 className="uc-hub-card-title">{a.title}</h3>
              <p className="uc-hub-card-desc">{a.description}</p>
              <span className="uc-hub-card-foot">
                <time dateTime={a.datePublished}>{formatDate(a.datePublished)}</time>
                <span className="uc-hub-card-arrow" aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
