import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ToolPage } from '../ToolPage';
import { TOOLS } from '../registry';
import { TOOL_EVIDENCE } from '../evidence';
import engine from '../../../public/examples/tool-tests/results.json';
import compress from '../../../public/examples/tool-tests/compress-browser.json';

// Published files, listed (not loaded) so a missing sample or image fails the test.
const PUBLISHED = new Set(
  Object.keys(import.meta.glob(['../../../public/examples/**/*', '../../../public/use-cases/content/*.md'])).map((k) => k.replace('../../../public', '')),
);
const published = (path: string) => PUBLISHED.has(path);
const LAZY = { timeout: 10000 };

describe('tool evidence', { timeout: 20000 }, () => {
  it('covers every tool, with a guide link and only files that are actually published', () => {
    for (const t of TOOLS) {
      const e = TOOL_EVIDENCE[t.slug];
      expect(e, t.slug).toBeTruthy();
      expect(t.evidence).toBe(e);
      expect(t.guideSlug, `${t.slug} should link its guide`).toBeTruthy();
      expect(published(`/use-cases/content/${t.guideSlug}.md`), t.guideSlug).toBe(true);
      expect(e.rows.length).toBeGreaterThan(0);
      for (const s of e.sources.filter((x) => x.href.startsWith('/'))) expect(published(s.href), s.href).toBe(true);
      if (e.image) expect(published(e.image.src), e.image.src).toBe(true);
    }
  });

  it('reports the figures from the result files, not hand-typed numbers', () => {
    const merge = engine.tests.find((x) => x.label.startsWith('merge: structured'))!;
    expect(TOOL_EVIDENCE['merge-pdf'].rows[0].value).toContain(`${merge.pageCount} pages`);
    expect(TOOL_EVIDENCE['merge-pdf'].rows[1].value).toContain(`0 of ${engine.source.bookmarks * 2}`);
    const strong = compress.results.find((r) => r.input === 'compression-sample.pdf' && r.level === 'strong')!;
    expect(TOOL_EVIDENCE['compress-pdf'].rows.some((r) => r.value.endsWith(`${(strong.outputBytes / 1000).toFixed(1)} KB`))).toBe(true);
    expect(TOOL_EVIDENCE['jpg-to-pdf'].rows[1].value).toBe('0 of 8');
  });

  it('shows the same evidence on the visible tool page', async () => {
    render(<ToolPage slug="compress-pdf" />);
    await screen.findByTestId('tool-compress-pdf', undefined, LAZY);
    const section = screen.getByRole('region', { name: 'What we tested' });
    for (const r of TOOL_EVIDENCE['compress-pdf'].rows) expect(within(section).getByText(r.value)).toBeInTheDocument();
    expect(within(section).getByRole('img')).toHaveAttribute('src', '/examples/compression-strong.png');
    expect(within(section).getByRole('link', { name: 'Full write-up in the guide' })).toHaveAttribute('href', '/use-cases/how-to-compress-pdf');
  });
});
