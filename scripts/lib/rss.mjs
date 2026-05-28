// RSS 2.0 generator for Tekivex tutorials.
// Pure: takes an array of items + a site config and returns an XML string.
// Lives in scripts/lib so it can be unit-tested without spinning up the
// full prerender pipeline.

export function escapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * @param {{ origin: string, buildDate?: Date, limit?: number }} site
 * @param {Array<{ path: string, title: string, description?: string, categoryTitle?: string, pubDate?: Date }>} items
 */
export function buildRss(site, items) {
  const origin = site.origin.replace(/\/$/, '');
  const buildDate = site.buildDate ?? new Date();
  const limit = site.limit ?? 60;

  const rendered = items.slice(0, limit).map((item) => {
    const link = `${origin}${item.path}`;
    const pub = (item.pubDate ?? buildDate).toUTCString();
    const lines = [
      '    <item>',
      `      <title>${escapeXml(item.title || item.path)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <description>${escapeXml(item.description || '')}</description>`,
      item.categoryTitle ? `      <category>${escapeXml(item.categoryTitle)}</category>` : null,
      `      <pubDate>${pub}</pubDate>`,
      '    </item>',
    ];
    return lines.filter(Boolean).join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>Tekivex Tutorials</title>',
    `    <link>${origin}/tutorials</link>`,
    '    <description>In-depth tutorials on system design, software architecture, frontend &amp; backend patterns, and AI/ML — published by Tekivex.</description>',
    '    <language>en-us</language>',
    `    <lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />`,
    ...rendered,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
