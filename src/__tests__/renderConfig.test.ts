import { describe, expect, it } from 'vitest';
import renderConfig from '../../render.yaml?raw';

const REQUIRED_REDIRECTS = [
  ['/platform', '/products'],
  ['/privacy', '/privacy-policy'],
  ['/product/pdfcraft', '/product/pyntra'],
  ['/use-cases/quantum-vault-why-nist-pqc-matters', '/use-cases/quantum-vault-post-quantum-tokens-explained'],
  ['/use-cases/tekivex-ui-theming-css-variables', '/use-cases/tekivex-ui-headless-design-system'],
] as const;

describe('Render production routing', () => {
  it.each(REQUIRED_REDIRECTS)('declares permanent legacy redirect %s → %s', (source, destination) => {
    expect(renderConfig).toMatch(
      new RegExp(`type:\\s*redirect\\s+source:\\s*${source}\\s+destination:\\s*${destination}`),
    );
  });

  it('keeps every redirect ahead of the first application rewrite', () => {
    const firstRewrite = renderConfig.indexOf('type: rewrite');
    expect(firstRewrite).toBeGreaterThan(0);
    for (const [source] of REQUIRED_REDIRECTS) {
      expect(renderConfig.indexOf(`source: ${source}`)).toBeLessThan(firstRewrite);
    }
  });

  it('does not mask real 404 responses with a site-wide SPA rewrite', () => {
    expect(renderConfig).not.toMatch(/source:\s*\/\*\s+destination:\s*\/index\.html/);
  });
});
