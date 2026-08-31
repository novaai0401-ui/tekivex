import { describe, it, expect } from 'vitest';
import robots from '../../public/robots.txt?raw';
import securityTxt from '../../public/.well-known/security.txt?raw';

describe('robots.txt — crawler policy', () => {
  const aiBots = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web',
    'anthropic-ai', 'Google-Extended', 'PerplexityBot', 'CCBot', 'Amazonbot',
  ];

  it('explicitly allows every major AI assistant / answer-engine crawler', () => {
    for (const bot of aiBots) {
      const re = new RegExp(`User-agent:\\s*${bot}\\s*\\nAllow:\\s*/`, 'i');
      expect(re.test(robots), `${bot} should be allowed`).toBe(true);
    }
  });

  it('does not Disallow any AI crawler', () => {
    // No "Disallow: /" anywhere in the file (we welcome everyone).
    expect(/Disallow:\s*\//.test(robots)).toBe(false);
  });

  it('keeps AdSense crawlers and the sitemap', () => {
    expect(robots).toMatch(/User-agent:\s*Mediapartners-Google/);
    expect(robots).toMatch(/Sitemap:\s*https:\/\/www\.tekivex\.com\/sitemap-index\.xml/);
    expect(robots).toMatch(/llms\.txt/);
  });
});

describe('.well-known/security.txt', () => {
  it('has a contact and a future expiry', () => {
    expect(securityTxt).toMatch(/Contact:\s*mailto:nishu_singh@tekivex\.com/);
    const m = securityTxt.match(/Expires:\s*(\S+)/);
    expect(m).not.toBeNull();
    expect(new Date(m![1]).getTime()).toBeGreaterThan(Date.now());
  });
});
