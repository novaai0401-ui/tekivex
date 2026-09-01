import { Link } from '../App';
import { getAuthor } from '../content/authors';
import { getAllArticles } from '../content/registry';

/** Dedicated author profile page at /authors/<id> — the E-E-A-T anchor that
 *  the Person JSON-LD on every article points back to. */
export function AuthorPage({ authorId }: { authorId: string }) {
  const author = getAuthor(authorId);

  if (!author) {
    return (
      <div className="uc-article" style={{ textAlign: 'center' }}>
        <h1 className="uc-article-title">Author not found</h1>
        <p className="uc-article-lead">No author profile exists at this URL.</p>
        <Link to="/use-cases" className="uc-back-link">← All guides</Link>
      </div>
    );
  }

  const articles = getAllArticles().filter((a) => a.authorId === author.id);

  return (
    <div className="uc-article">
      <nav aria-label="Breadcrumb" className="uc-breadcrumb">
        <Link to="/">Tekivex</Link>
        <span className="uc-breadcrumb-sep">›</span>
        <Link to="/use-cases">Use Cases</Link>
        <span className="uc-breadcrumb-sep">›</span>
        <span className="uc-breadcrumb-current">{author.name}</span>
      </nav>

      <aside className="uc-author-box" style={{ marginTop: '1.5rem' }}>
        <div className="uc-author-avatar" aria-hidden="true">
          {author.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </div>
        <div className="uc-author-meta">
          <h1 className="uc-author-name" style={{ fontSize: '1.6rem', margin: 0 }}>{author.name}</h1>
          <span className="uc-author-role">{author.role}</span>
          <p className="uc-author-bio">{author.bio}</p>
          <span className="uc-author-links">
            <a href={author.url} target="_blank" rel="noopener noreferrer me">LinkedIn</a>
            <span className="uc-meta-sep">·</span>
            <a href={`mailto:${author.email}`}>Contact the Tekivex editorial team</a>
          </span>
        </div>
      </aside>

      <section aria-label={`Articles by ${author.name}`} style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
          Articles by {author.name} ({articles.length})
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {articles.map((a) => (
            <li key={a.slug} style={{ marginBottom: '1.1rem' }}>
              <Link to={`/use-cases/${a.slug}`} style={{ fontWeight: 600 }}>{a.title}</Link>
              <p style={{ margin: '0.25rem 0 0', opacity: 0.8, fontSize: '0.95rem' }}>{a.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <p style={{ marginTop: '2.5rem' }}>
        <Link to="/use-cases" className="uc-back-link">← Browse all guides</Link>
      </p>
    </div>
  );
}
