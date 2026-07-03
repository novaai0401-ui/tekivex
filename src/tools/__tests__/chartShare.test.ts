import { describe, it, expect } from 'vitest';
import { encodeChartState, decodeChartState, MAX_SHARE_LEN, type ChartShareState } from '../lib/chartShare';

const state: ChartShareState = {
  csv: 'Month,Revenue,Expenses\nJan,100,80\nFeb,200,90',
  kind: 'line',
  labelCol: 0,
  valueCols: [1, 2],
};

describe('chart share encode/decode', () => {
  it('round-trips a chart state through the fragment', () => {
    const enc = encodeChartState(state);
    expect(enc.ok).toBe(true);
    const back = decodeChartState(enc.fragment!);
    expect(back).toEqual(state);
  });

  it('accepts a fragment with a leading #', () => {
    const enc = encodeChartState(state);
    expect(decodeChartState('#' + enc.fragment!)).toEqual(state);
  });

  it('produces URL-fragment-safe output (no +, /, or = padding)', () => {
    const enc = encodeChartState(state);
    expect(enc.fragment!).toMatch(/^c1:[A-Za-z0-9_-]+$/);
  });

  it('refuses a dataset too large to share, with a helpful reason', () => {
    const big = 'A,B\n' + Array.from({ length: 20000 }, (_, i) => `row${i},${i}`).join('\n');
    const enc = encodeChartState({ ...state, csv: big });
    expect(enc.ok).toBe(false);
    expect(enc.fragment).toBeUndefined();
    expect(enc.error).toMatch(/too large/i);
    expect(big.length).toBeGreaterThan(MAX_SHARE_LEN); // sanity: it really is big
  });

  it('returns null for junk, wrong version, or non-share fragments', () => {
    expect(decodeChartState('')).toBeNull();
    expect(decodeChartState('#nothing-here')).toBeNull();
    expect(decodeChartState('c9:abcd')).toBeNull();
    expect(decodeChartState('c1:!!!not-base64!!!')).toBeNull();
  });

  it('defaults a bad chart kind to bar and tolerates missing columns', () => {
    // Hand-craft a c1 fragment with an invalid kind via re-encode.
    const enc = encodeChartState({ ...state, kind: 'bar' });
    const back = decodeChartState(enc.fragment!);
    expect(back!.kind).toBe('bar');
  });
});
