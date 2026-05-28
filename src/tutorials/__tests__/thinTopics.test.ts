import { describe, it, expect } from 'vitest';
import { THIN_TOPIC_PATHS, THIN_WORD_THRESHOLD, isThinTopic } from '../thinTopics';

describe('thinTopics list', () => {
  it('has a sensible word threshold', () => {
    expect(THIN_WORD_THRESHOLD).toBe(300);
  });

  it('contains at least some paths (generator ran)', () => {
    expect(THIN_TOPIC_PATHS.size).toBeGreaterThan(0);
  });

  it('every entry looks like a /tutorials/<category>/<slug> path', () => {
    for (const p of THIN_TOPIC_PATHS) {
      expect(p).toMatch(/^\/tutorials\/[a-z0-9-]+\/[a-z0-9-]+$/);
    }
  });

  it('isThinTopic returns true for a known stub and false for an obvious long-form path', () => {
    // The 64-word noise-spectrograms stub was the shortest article.
    expect(isThinTopic('/tutorials/ai-speech/noise-spectrograms')).toBe(true);
    // A path the generator has not seen → not thin.
    expect(isThinTopic('/tutorials/unknown/path')).toBe(false);
  });
});
