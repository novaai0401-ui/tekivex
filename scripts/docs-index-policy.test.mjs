// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { noindexHtml, deindexDocs } from './docs-index-policy.mjs';

describe('docs index policy', () => {
  it('adds or replaces the robots meta', () => {
    expect(noindexHtml('<html><head><title>x</title></head></html>')).toContain('<head><meta name="robots" content="noindex, follow">');
    expect(noindexHtml('<head><meta name="robots" content="index, follow"></head>')).toBe('<head><meta name="robots" content="noindex, follow"></head>');
  });
  it('noindexes every page under the target and empties its sitemap', () => {
    const dir = mkdtempSync(join(tmpdir(), 'docs-policy-'));
    try {
      mkdirSync(join(dir, 'a/b'), { recursive: true });
      writeFileSync(join(dir, 'index.html'), '<html><head></head></html>');
      writeFileSync(join(dir, 'a/b/index.html'), '<html><head><meta name="robots" content="index"></head></html>');
      writeFileSync(join(dir, 'sitemap.xml'), '<urlset><url><loc>https://www.tekivex.com/ui/</loc></url></urlset>');
      expect(deindexDocs(dir)).toBe(2);
      for (const f of ['index.html', 'a/b/index.html']) expect(readFileSync(join(dir, f), 'utf8')).toContain('content="noindex, follow"');
      expect(readFileSync(join(dir, 'sitemap.xml'), 'utf8')).not.toContain('<loc>');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
