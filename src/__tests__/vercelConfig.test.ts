import { describe, it, expect } from 'vitest';
import vercelConfig from '../../vercel.json';

describe('vercel.json — 404 handling', () => {
  it('enables cleanUrls so /foo serves dist/foo/index.html', () => {
    expect((vercelConfig as Record<string, unknown>).cleanUrls).toBe(true);
  });

  it('does NOT route unknown URLs back to /index.html as a soft 404', () => {
    const routes = (vercelConfig as { routes?: Array<{ dest?: string }> }).routes ?? [];
    const softFallback = routes.find((r) => r.dest === '/index.html');
    expect(softFallback).toBeUndefined();
  });

  it('does NOT define a rewrite that swallows unknown URLs', () => {
    const rewrites = (vercelConfig as { rewrites?: Array<{ destination?: string }> }).rewrites ?? [];
    const swallow = rewrites.find((r) => r.destination === '/index.html');
    expect(swallow).toBeUndefined();
  });

  it('points at dist/ for output', () => {
    expect((vercelConfig as Record<string, unknown>).outputDirectory).toBe('dist');
  });
});
