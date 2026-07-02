import { describe, it, expect } from 'vitest';
import {
  parseCsv, toNumber, guessColumns, buildChartModel, buildDonutSlices, niceTicks,
  MAX_DONUT_SLICES,
} from '../lib/csv';

describe('parseCsv', () => {
  it('parses headers and rows', () => {
    const t = parseCsv('Month,Revenue\nJan,100\nFeb,200\n');
    expect(t.headers).toEqual(['Month', 'Revenue']);
    expect(t.rows).toEqual([['Jan', '100'], ['Feb', '200']]);
  });

  it('handles quoted fields with commas, escaped quotes, and newlines', () => {
    const t = parseCsv('Name,Note\n"Smith, Jane","She said ""hi""\nsecond line"');
    expect(t.rows[0]).toEqual(['Smith, Jane', 'She said "hi"\nsecond line']);
  });

  it('handles \\r\\n line endings and ragged rows', () => {
    const t = parseCsv('A,B,C\r\n1,2\r\n4,5,6,7\r\n');
    expect(t.rows).toEqual([['1', '2', ''], ['4', '5', '6']]);
  });

  it('names blank headers', () => {
    expect(parseCsv(',B\n1,2').headers).toEqual(['Column 1', 'B']);
  });
});

describe('toNumber', () => {
  it('parses currencies, thousands separators, and percents', () => {
    expect(toNumber('$1,234.50')).toBe(1234.5);
    expect(toNumber('12%')).toBe(12);
    expect(toNumber('-3.2')).toBe(-3.2);
  });
  it('returns null for non-numbers', () => {
    expect(toNumber('abc')).toBeNull();
    expect(toNumber('')).toBeNull();
  });
});

describe('guessColumns + buildChartModel', () => {
  const table = parseCsv('Month,Revenue,Expenses,Notes\nJan,100,80,ok\nFeb,200,90,fine');

  it('guesses the label column and numeric columns', () => {
    const g = guessColumns(table);
    expect(g.numericCols).toEqual([1, 2]);
    expect([0, 3]).toContain(g.labelCol);
  });

  it('builds a chart model with parsed values', () => {
    const m = buildChartModel(table, 0, [1, 2]);
    expect(m.labels).toEqual(['Jan', 'Feb']);
    expect(m.series.map((s) => s.name)).toEqual(['Revenue', 'Expenses']);
    expect(m.series[0]!.values).toEqual([100, 200]);
  });
});

describe('buildDonutSlices', () => {
  it('folds slices beyond the cap into "Other"', () => {
    const headers = 'L,V';
    const rows = Array.from({ length: 12 }, (_, i) => `cat${i},${100 - i}`).join('\n');
    const model = buildChartModel(parseCsv(`${headers}\n${rows}`), 0, [1]);
    const slices = buildDonutSlices(model);
    expect(slices).toHaveLength(MAX_DONUT_SLICES);
    expect(slices[slices.length - 1]!.label).toBe('Other');
    // Total is preserved by the fold.
    const total = slices.reduce((s, e) => s + e.value, 0);
    expect(total).toBe(Array.from({ length: 12 }, (_, i) => 100 - i).reduce((a, b) => a + b));
  });

  it('drops zero/negative values', () => {
    const model = buildChartModel(parseCsv('L,V\na,5\nb,0\nc,-2'), 0, [1]);
    expect(buildDonutSlices(model).map((s) => s.label)).toEqual(['a']);
  });
});

describe('niceTicks', () => {
  it('starts at 0 for positive data and lands on round steps', () => {
    const t = niceTicks(0, 97);
    expect(t[0]).toBe(0);
    expect(t[t.length - 1]!).toBeGreaterThanOrEqual(97);
  });
  it('extends below zero for negative data', () => {
    expect(niceTicks(-30, 80)[0]!).toBeLessThanOrEqual(-30);
  });
});
