import { describe, it, expect } from 'vitest';
import { TOOLS, getTool, getAllTools } from '../registry';
import { getArticle } from '../../content/registry';

describe('tools registry', () => {
  it('ships at least five tools', () => {
    expect(TOOLS.length).toBeGreaterThanOrEqual(5);
  });

  it('has unique, url-safe slugs', () => {
    const slugs = TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it('every tool has complete, substantial metadata', () => {
    for (const t of TOOLS) {
      expect(t.name.length).toBeGreaterThan(2);
      expect(t.short.length).toBeGreaterThan(20);
      expect(t.description.length).toBeGreaterThan(80);
      expect(t.seoTitle.length).toBeGreaterThan(20);
      expect(t.seoTitle).toContain('Tekivex');
      expect(t.seoDescription.length).toBeGreaterThan(50);
      expect(t.keywords.length).toBeGreaterThanOrEqual(4);
      expect(t.steps.length).toBeGreaterThanOrEqual(3);
      expect(t.faqs.length).toBeGreaterThanOrEqual(3);
      expect(t.limitations.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('every tool states the no-upload privacy promise', () => {
    for (const t of TOOLS) {
      const all = [t.description, t.seoDescription, ...t.faqs.map((f) => f.a)].join(' ').toLowerCase();
      expect(all, `${t.slug} must state files are not uploaded`).toMatch(/never uploaded|no upload|not sent to a server|never leaves? your device|nothing is sent to a server|never leave your device|never sent anywhere|stays? on your (own )?(device|machine)|done (locally )?(by|on) your (own )?(browser|device|machine)|on your own (device|machine)/);
    }
  });

  it('every guideSlug resolves to a real published guide', () => {
    for (const t of TOOLS) {
      if (t.guideSlug) {
        expect(getArticle(t.guideSlug), `${t.slug} points at missing guide ${t.guideSlug}`).toBeDefined();
      }
    }
  });

  it('getTool resolves known slugs and rejects unknown', () => {
    expect(getTool('merge-pdf')?.name).toBe('Merge PDF');
    expect(getTool('nope')).toBeUndefined();
    expect(getAllTools()).toHaveLength(TOOLS.length);
  });
});
