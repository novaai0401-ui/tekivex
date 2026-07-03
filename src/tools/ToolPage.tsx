import React from 'react';
import { Link } from '../App';
import { AdSlot } from '../ads/AdSlot';
import { getAllTools, getTool } from './registry';
import { NotFoundPage } from '../pages/NotFoundPage';

// Tool UIs are lazy so a visitor only downloads the one they open.
const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  'merge-pdf':    React.lazy(() => import('./tools/MergePdfTool').then((m) => ({ default: m.MergePdfTool }))),
  'split-pdf':    React.lazy(() => import('./tools/SplitPdfTool').then((m) => ({ default: m.SplitPdfTool }))),
  'jpg-to-pdf':   React.lazy(() => import('./tools/JpgToPdfTool').then((m) => ({ default: m.JpgToPdfTool }))),
  'compress-pdf': React.lazy(() => import('./tools/CompressPdfTool').then((m) => ({ default: m.CompressPdfTool }))),
  'pdf-to-jpg':   React.lazy(() => import('./tools/PdfToJpgTool').then((m) => ({ default: m.PdfToJpgTool }))),
  'rotate-pdf':   React.lazy(() => import('./tools/RotatePdfTool').then((m) => ({ default: m.RotatePdfTool }))),
  'remove-pages-pdf': React.lazy(() => import('./tools/RemovePagesTool').then((m) => ({ default: m.RemovePagesTool }))),
  'csv-to-chart': React.lazy(() => import('./tools/CsvChartTool').then((m) => ({ default: m.CsvChartTool }))),
};

export function ToolPage({ slug }: { slug: string }) {
  const tool = getTool(slug);
  if (!tool) return <NotFoundPage />;
  const ToolUi = TOOL_COMPONENTS[slug];
  const others = getAllTools().filter((t) => t.slug !== slug);

  return (
    <main className="tool-page" data-testid={`tool-page-${slug}`}>
      <nav aria-label="Breadcrumb" className="tool-breadcrumb">
        <Link to="/">Tekivex</Link> <span aria-hidden="true">›</span>{' '}
        <Link to="/tools">Tools</Link> <span aria-hidden="true">›</span> <span>{tool.name}</span>
      </nav>

      <header className="tool-header">
        <h1 className="tool-title">{tool.name}</h1>
        <p className="tool-desc">{tool.description}</p>
        {tool.guideSlug && (
          <p className="tool-guide-link">
            New to this? Read the step-by-step guide:{' '}
            <Link to={`/use-cases/${tool.guideSlug}`}>How to use {tool.name}</Link>
          </p>
        )}
      </header>

      {ToolUi && (
        <React.Suspense fallback={<div className="tool-loading" role="status">Loading tool…</div>}>
          <ToolUi />
        </React.Suspense>
      )}

      <section className="tool-section" aria-label="How it works">
        <h2>How it works</h2>
        <ol className="tool-steps">
          {tool.steps.map((s) => (
            <li key={s.title}><strong>{s.title}.</strong> {s.body}</li>
          ))}
        </ol>
      </section>

      <section className="tool-section" aria-label="Limitations">
        <h2>Honest limitations</h2>
        <ul className="tool-limits">
          {tool.limitations.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </section>

      <AdSlot slot="5896441076" label="Sponsored" className="ad-slot--tool" />

      <section className="tool-section" aria-label="Frequently asked questions">
        <h2>Frequently asked questions</h2>
        {tool.faqs.map((f) => (
          <details key={f.q} className="tool-faq">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section className="tool-section tool-related" aria-label="More tools">
        <h2>More free tools</h2>
        <ul className="tool-related-list">
          {others.map((t) => (
            <li key={t.slug}><Link to={`/tools/${t.slug}`}>{t.name}</Link> — {t.short}</li>
          ))}
        </ul>
        <p className="tool-note">
          Need the full editor? <Link to="/product/pyntra">Pyntra</Link> fills, signs, and
          redacts PDFs — free, in your browser.
        </p>
      </section>
    </main>
  );
}
