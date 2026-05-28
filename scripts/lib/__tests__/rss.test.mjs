import { describe, it, expect } from 'vitest';
import { buildRss, escapeXml } from '../rss.mjs';

const SITE = { origin: 'https://tekivex.com', buildDate: new Date('2026-05-28T00:00:00Z') };

const SAMPLE_ITEMS = [
  {
    path: '/tutorials/system-design/url-shortener',
    title: 'Designing a URL shortener',
    description: 'Hashing, sharding, and caching for a 100M-req/day system.',
    categoryTitle: 'System Design',
  },
  {
    path: '/tutorials/ai-ml/transformer-attention',
    title: 'Attention, visually',
    description: 'How self-attention works in transformers.',
    categoryTitle: 'AI & Machine Learning',
  },
];

describe('escapeXml', () => {
  it('escapes the five XML entities', () => {
    expect(escapeXml(`a&b<c>d"e'f`)).toBe('a&amp;b&lt;c&gt;d&quot;e&apos;f');
  });

  it('coerces null/undefined to empty string', () => {
    expect(escapeXml(null)).toBe('');
    expect(escapeXml(undefined)).toBe('');
  });
});

describe('buildRss', () => {
  it('produces a valid RSS 2.0 envelope', () => {
    const xml = buildRss(SITE, SAMPLE_ITEMS);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it('emits an item for each input', () => {
    const xml = buildRss(SITE, SAMPLE_ITEMS);
    const itemCount = (xml.match(/<item>/g) || []).length;
    expect(itemCount).toBe(SAMPLE_ITEMS.length);
  });

  it('escapes XML metacharacters in titles and descriptions', () => {
    const xml = buildRss(SITE, [
      {
        path: '/tutorials/x',
        title: 'A & B <hello>',
        description: 'Quotes "inside" must escape',
        categoryTitle: 'Misc',
      },
    ]);
    expect(xml).toContain('A &amp; B &lt;hello&gt;');
    expect(xml).toContain('Quotes &quot;inside&quot; must escape');
    expect(xml).not.toContain('A & B <hello>');
  });

  it('builds absolute links using the origin', () => {
    const xml = buildRss(SITE, SAMPLE_ITEMS);
    expect(xml).toContain('<link>https://tekivex.com/tutorials/system-design/url-shortener</link>');
    expect(xml).toContain('<guid isPermaLink="true">https://tekivex.com/tutorials/ai-ml/transformer-attention</guid>');
  });

  it('includes an atom:link self pointer', () => {
    const xml = buildRss(SITE, SAMPLE_ITEMS);
    expect(xml).toContain('<atom:link href="https://tekivex.com/feed.xml" rel="self" type="application/rss+xml" />');
  });

  it('truncates to the supplied limit', () => {
    const many = Array.from({ length: 100 }, (_, i) => ({
      path: `/tutorials/x/topic-${i}`,
      title: `Topic ${i}`,
      description: `Description ${i}`,
    }));
    const xml = buildRss({ ...SITE, limit: 5 }, many);
    expect((xml.match(/<item>/g) || []).length).toBe(5);
  });

  it('formats pubDate as RFC-2822 UTC', () => {
    const xml = buildRss(SITE, SAMPLE_ITEMS);
    expect(xml).toContain('<pubDate>Thu, 28 May 2026 00:00:00 GMT</pubDate>');
  });

  it('omits the category line when categoryTitle is missing', () => {
    const xml = buildRss(SITE, [{ path: '/tutorials/x', title: 'T', description: 'D' }]);
    expect(xml).not.toContain('<category>');
  });
});
