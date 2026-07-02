import { describe, it, expect, vi, afterEach } from 'vitest';
import { downloadBlob, formatBytes } from '../lib/download';
import { currentTheme, LIGHT_THEME, DARK_THEME } from '../lib/chartTheme';

describe('formatBytes', () => {
  it('formats across magnitudes', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.00 MB');
  });
  it('handles nonsense safely', () => {
    expect(formatBytes(-1)).toBe('—');
    expect(formatBytes(NaN)).toBe('—');
  });
});

describe('downloadBlob', () => {
  afterEach(() => vi.restoreAllMocks());

  it('creates an object URL and clicks a download anchor', () => {
    const createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    downloadBlob(new Uint8Array([1, 2, 3]), 'file.pdf', 'application/pdf');
    expect(createSpy).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('accepts string payloads (SVG export path)', () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    downloadBlob('<svg/>', 'chart.svg', 'image/svg+xml');
    expect(clickSpy).toHaveBeenCalledOnce();
  });
});

describe('chart theme selection', () => {
  it('follows the site theme attribute (selected steps, not a flip)', () => {
    delete document.documentElement.dataset.hubTheme;
    expect(currentTheme()).toBe(LIGHT_THEME);
    document.documentElement.dataset.hubTheme = 'dark';
    expect(currentTheme()).toBe(DARK_THEME);
    document.documentElement.dataset.hubTheme = 'light';
    expect(currentTheme()).toBe(LIGHT_THEME);
  });

  it('light and dark categorical palettes are distinct selected sets', () => {
    expect(LIGHT_THEME.series).toHaveLength(8);
    expect(DARK_THEME.series).toHaveLength(8);
    expect(LIGHT_THEME.series[0]).not.toBe(DARK_THEME.series[0]);
  });
});
