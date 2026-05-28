import { describe, it, expect } from 'vitest';
import { getSeoForRoute } from '../seoConfig';
import { THIN_TOPIC_PATHS } from '../../tutorials/thinTopics';

describe('getSeoForRoute — thin tutorial handling', () => {
  it('sets noindex on a known thin tutorial route', () => {
    const path = '/tutorials/ai-speech/noise-spectrograms';
    expect(THIN_TOPIC_PATHS.has(path)).toBe(true);
    const seo = getSeoForRoute(path);
    expect(seo.noindex).toBe(true);
  });

  it('does NOT set noindex on a substantive tutorial route', () => {
    // mcp-protocol is the longest article at 3658 words.
    const seo = getSeoForRoute('/tutorials/ai-ml-agents/mcp-protocol');
    expect(seo.noindex).toBeFalsy();
  });

  it('does NOT noindex the tutorials landing page', () => {
    const seo = getSeoForRoute('/tutorials');
    expect(seo.noindex).toBeFalsy();
  });
});
