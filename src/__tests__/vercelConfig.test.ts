import { describe, it, expect } from 'vitest';
import vercelConfig from '../../vercel.json';

describe('vercel.json — 404 handling', () => {
  it('enables cleanUrls so /foo serves dist/foo/index.html', () => {
    expect((vercelConfig as Record<string, unknown>).cleanUrls).toBe(true);
  });

  // Prerendered files always win over rewrites on Vercel, so this fallback
  // only catches paths with no static file. The app then renders the
  // NotFound page with noindex instead of the visitor hitting a hard 404.
  it('defines an SPA fallback rewrite for un-prerendered URLs', () => {
    const rewrites = (vercelConfig as { rewrites?: Array<{ source?: string; destination?: string }> }).rewrites ?? [];
    const fallback = rewrites.find((r) => r.destination === '/index.html');
    expect(fallback).toBeDefined();
    expect(fallback?.source).toBe('/:path*');
  });

  it('points at dist/ for output', () => {
    expect((vercelConfig as Record<string, unknown>).outputDirectory).toBe('dist');
  });
});
