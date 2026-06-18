import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/**
 * Renders a Markdown string to HTML inside a styled article container.
 * Content is first-party (authored by the Tekivex team and shipped in the
 * repo), so rendering the parsed HTML directly is safe.
 */
export function Markdown({ source }: { source: string }) {
  const html = useMemo(() => marked.parse(source) as string, [source]);
  return (
    <div
      className="uc-article-body"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
