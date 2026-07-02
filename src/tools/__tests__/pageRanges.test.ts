import { describe, it, expect } from 'vitest';
import { parsePageRanges } from '../lib/pageRanges';

describe('parsePageRanges', () => {
  it('parses single pages and ranges to 0-based indices', () => {
    expect(parsePageRanges('1,3,7-9', 10)).toEqual({ ok: true, indices: [0, 2, 6, 7, 8] });
  });

  it('supports reversed ranges', () => {
    expect(parsePageRanges('9-7', 10).indices).toEqual([8, 7, 6]);
  });

  it('tolerates whitespace and stray commas', () => {
    expect(parsePageRanges(' 2 - 4 ,, 6 ', 10).indices).toEqual([1, 2, 3, 5]);
  });

  it('rejects pages beyond the document', () => {
    const r = parsePageRanges('5-12', 10);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/page 12 is out of range/i);
  });

  it('rejects page 0 and garbage', () => {
    expect(parsePageRanges('0', 10).ok).toBe(false);
    expect(parsePageRanges('abc', 10).ok).toBe(false);
    expect(parsePageRanges('1-2-3', 10).ok).toBe(false);
  });

  it('rejects empty input with a helpful message', () => {
    const r = parsePageRanges('   ', 10);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/1,3,7-9/);
  });
});
