import { Link } from '../App';
import { getChangelog } from '../content/changelog';

const TAG_CLASS: Record<string, string> = {
  New: 'cl-tag cl-tag--new',
  Improved: 'cl-tag cl-tag--improved',
  Fixed: 'cl-tag cl-tag--fixed',
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`;
}

export function ChangelogPage() {
  const entries = getChangelog();
  return (
    <div className="cl-page" data-testid="changelog-page">
      <header className="uc-hub-header">
        <div className="uc-hub-eyebrow">Changelog</div>
        <h1 className="uc-hub-title">What&apos;s <span className="tx-gradient-text">new</span></h1>
        <p className="uc-hub-sub">
          A running, dated record of what we&apos;ve shipped across the Tekivex tools and products.
          Have an idea or found a bug? <Link to="/contact">Tell us</Link>.
        </p>
      </header>

      <ol className="cl-list">
        {entries.map((e) => (
          <li key={e.date} className="cl-entry">
            <div className="cl-entry-meta">
              <time className="cl-date" dateTime={e.date}>{formatDate(e.date)}</time>
              <h2 className="cl-title">{e.title}</h2>
            </div>
            <ul className="cl-items">
              {e.items.map((it, i) => (
                <li key={i} className="cl-item">
                  <span className={TAG_CLASS[it.tag]}>{it.tag}</span>
                  <span className="cl-item-text">{it.text}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="tool-note">
        Follow along: browse the <Link to="/tools">free tools</Link>, read the{' '}
        <Link to="/use-cases">guides</Link>, or subscribe to the{' '}
        <a href="/feed.xml" rel="noopener noreferrer">RSS feed</a>.
      </p>
    </div>
  );
}
