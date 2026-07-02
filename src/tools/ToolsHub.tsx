import { Link } from '../App';
import { Icon } from '../icons/Icon';
import { getAllTools } from './registry';

export function ToolsHub() {
  const tools = getAllTools();
  return (
    <main className="tools-hub" data-testid="tools-hub">
      <header className="uc-hub-header">
        <div className="uc-hub-eyebrow">Free Tools</div>
        <h1 className="uc-hub-title">
          Free tools that <span className="tx-gradient-text">never upload your files</span>
        </h1>
        <p className="uc-hub-sub">
          Every tool on this page runs entirely in your browser. Your PDFs, photos, and
          data are processed on your device and never sent to a server — there is nothing
          for us to store, scan, or leak. No accounts, no watermarks, no file limits from us.
        </p>
      </header>

      <div className="tools-grid">
        {tools.map((t) => (
          <Link key={t.slug} to={`/tools/${t.slug}`} className="tools-card" style={{ '--tc': t.color } as React.CSSProperties}>
            <span className="tools-card-icon" aria-hidden="true"><Icon name={t.iconName} size={22} /></span>
            <h2 className="tools-card-title">{t.name}</h2>
            <p className="tools-card-desc">{t.short}</p>
            <span className="tools-card-foot">Open tool <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>

      <section className="tools-hub-more">
        <h2 className="uc-hub-section-title">Why in-browser tools?</h2>
        <p>
          Most online converters upload your file to their servers, process it there, and
          hold a copy — a real problem for contracts, IDs, medical records, and anything
          confidential. These tools take the opposite approach: the processing code runs
          in <em>your</em> browser, so the file never crosses the network. It is also why
          they keep working on a flaky connection once the page has loaded.
        </p>
        <p>
          Need more than a quick task? <Link to="/product/pyntra">Pyntra</Link> is our full
          browser PDF editor (fill, sign, annotate, redact), and{' '}
          <Link to="/product/analytics-studio">Analytics Studio</Link> builds complete
          dashboards from your data — both free, both private by the same design.
        </p>
      </section>
    </main>
  );
}
