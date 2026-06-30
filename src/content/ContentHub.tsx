import { Link } from '../App';
import { getArticlesGroupedByProduct, getAllArticles } from './registry';
import { getAllProducts } from '../platform/registry';

export function ContentHub() {
  const groups = getArticlesGroupedByProduct();
  const total = getAllArticles().length;
  // Hosted web apps (tier 'platform') — no install, used live in the browser.
  const apps = getAllProducts().filter((p) => p.tier === 'platform' && p.primaryDemoPath);

  return (
    <main className="uc-hub">
      <header className="uc-hub-header">
        <div className="uc-hub-eyebrow">Use Cases</div>
        <h1 className="uc-hub-title">
          Product guides, comparisons &amp; <span className="tx-gradient-text">deep dives</span>
        </h1>
        <p className="uc-hub-sub">
          {total} in-depth articles on the Tekivex product suite — how each library works,
          how to put it to work, and how it compares. Written by the Tekivex Engineering team.
        </p>
      </header>

      {apps.length > 0 && (
        <section className="uc-hub-section" aria-label="Free apps you can use live">
          <h2 className="uc-hub-section-title">Free apps — use them live</h2>
          <div className="uc-hub-grid">
            {apps.map((a) => (
              <Link key={a.id} to={a.homePath} className="uc-hub-card">
                <span className="uc-kind-pill uc-kind-pill--sm">Web app</span>
                <h3 className="uc-hub-card-title">{a.name}</h3>
                <p className="uc-hub-card-desc">{a.tagline}</p>
                <span className="uc-hub-card-foot">
                  Open {a.name}
                  <span className="uc-hub-card-arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {groups.map(({ product, articles }) => (
        <section key={product} className="uc-hub-section" aria-label={product}>
          <h2 className="uc-hub-section-title">{product}</h2>
          <div className="uc-hub-grid">
            {articles.map((a) => (
              <Link key={a.slug} to={`/use-cases/${a.slug}`} className="uc-hub-card">
                <span className="uc-kind-pill uc-kind-pill--sm">{a.kind}</span>
                <h3 className="uc-hub-card-title">{a.title}</h3>
                <p className="uc-hub-card-desc">{a.description}</p>
                <span className="uc-hub-card-foot">
                  {a.readingMinutes} min read
                  <span className="uc-hub-card-arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
