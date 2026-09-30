import { it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareUi, cleanUiPage } from './prepare-ui.mjs';

const LOADER = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630229006617891" crossorigin="anonymous"></script>';

it('removes advertising and marks every vendored UI page noindex', () => {
  const root = mkdtempSync(join(tmpdir(), 'tekivex-ui-'));
  try {
    mkdirSync(join(root, 'docs/button'), { recursive: true });
    writeFileSync(join(root, 'index.html'), `<html><head>${LOADER}<meta name="robots" content="index, follow, max-image-preview:large" /></head><body><h1>Tekivex UI</h1><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1"></ins></body></html>`);
    writeFileSync(join(root, 'docs/button/index.html'), '<html><head><title>Button</title></head><body><div id="app"></div></body></html>');
    writeFileSync(join(root, 'sitemap.xml'), '<urlset></urlset>');
    writeFileSync(join(root, 'sitemap-0.xml'), '<urlset></urlset>');
    writeFileSync(join(root, 'sitemap-index.xml'), '<sitemapindex></sitemapindex>');
    writeFileSync(join(root, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://www.tekivex.com/ui/sitemap.xml\n');
    writeFileSync(join(root, 'assets.js'), 'window.adsbygoogle=[]');

    expect(prepareUi(root)).toEqual({ pages: 2, adsRemoved: 1 });

    const home = readFileSync(join(root, 'index.html'), 'utf8');
    expect(home).not.toContain('adsbygoogle');
    expect(home).toContain('<meta name="robots" content="noindex, follow" />');
    expect(home).not.toMatch(/index, follow, max-image/);
    expect(home).toContain('<h1>Tekivex UI</h1>');
    const doc = readFileSync(join(root, 'docs/button/index.html'), 'utf8');
    expect(doc).toContain('<head><meta name="robots" content="noindex, follow" /><title>Button</title>');
    expect(existsSync(join(root, 'sitemap.xml'))).toBe(false);
    expect(existsSync(join(root, 'sitemap-0.xml'))).toBe(false);
    expect(existsSync(join(root, 'sitemap-index.xml'))).toBe(false);
    expect(readFileSync(join(root, 'robots.txt'), 'utf8')).not.toMatch(/Sitemap:/);
    expect(readFileSync(join(root, 'assets.js'), 'utf8')).toBe('window.adsbygoogle=[]'); // app code untouched
    expect(prepareUi(root).adsRemoved).toBe(0); // idempotent
  } finally { rmSync(root, { recursive: true, force: true }); }
});

it('keeps a single robots meta when cleaning twice', () => {
  const once = cleanUiPage('<html><head></head><body></body></html>');
  expect(cleanUiPage(once).match(/name="robots"/g)).toHaveLength(1);
});

it('refuses a build without an index page', () => {
  const root = mkdtempSync(join(tmpdir(), 'tekivex-ui-'));
  try { expect(() => prepareUi(root)).toThrow('no index.html'); }
  finally { rmSync(root, { recursive: true, force: true }); }
});
