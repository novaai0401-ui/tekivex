// Parse a user-typed page selection like "1,3,7-9" or "9-7" into a list of
// 0-based page indices. Pure function so it is unit-testable and gives the UI
// precise error messages instead of silently dropping pages.

export interface PageRangeResult {
  ok: boolean;
  /** 0-based page indices in the order the user asked for. */
  indices: number[];
  /** Human-readable problem when ok is false. */
  error?: string;
}

export function parsePageRanges(input: string, pageCount: number): PageRangeResult {
  const fail = (error: string): PageRangeResult => ({ ok: false, indices: [], error });
  if (pageCount <= 0) return fail('The document has no pages.');
  const trimmed = input.trim();
  if (!trimmed) return fail('Enter the pages to extract, e.g. "1,3,7-9".');

  const indices: number[] = [];
  for (const rawPart of trimmed.split(',')) {
    const part = rawPart.trim();
    if (!part) continue;
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!m) return fail(`"${part}" is not a page number or range like "2-5".`);
    const start = parseInt(m[1]!, 10);
    const end = m[2] !== undefined ? parseInt(m[2], 10) : start;
    if (start < 1 || end < 1) return fail('Page numbers start at 1.');
    if (start > pageCount || end > pageCount) {
      return fail(`Page ${Math.max(start, end)} is out of range — the document has ${pageCount} page${pageCount === 1 ? '' : 's'}.`);
    }
    const step = start <= end ? 1 : -1;
    for (let p = start; step > 0 ? p <= end : p >= end; p += step) indices.push(p - 1);
  }
  if (!indices.length) return fail('Enter the pages to extract, e.g. "1,3,7-9".');
  return { ok: true, indices };
}
