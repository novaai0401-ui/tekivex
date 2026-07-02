// CSV parsing + chart-model building for the CSV→Chart tool. Pure functions,
// unit-tested. RFC-4180-style: comma-separated, double-quote escaping with
// "" inside quoted fields, tolerant of \r\n and a trailing newline.

export interface CsvTable {
  headers: string[];
  rows: string[][];
}

export function parseCsv(text: string): CsvTable {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const src = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const endField = () => { row.push(field); field = ''; };
  const endRow = () => { endField(); rows.push(row); row = []; };

  while (i < src.length) {
    const ch = src[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQuotes = true; i++; continue; }
    if (ch === ',') { endField(); i++; continue; }
    if (ch === '\n') { endRow(); i++; continue; }
    field += ch; i++;
  }
  // Flush the final field/row unless the input ended with a clean newline.
  if (field !== '' || row.length > 0) endRow();

  // Drop fully-empty trailing rows (a common artifact of trailing newlines).
  while (rows.length && rows[rows.length - 1]!.every((c) => c.trim() === '')) rows.pop();

  const headers = rows.length ? rows[0]!.map((h, idx) => (h.trim() === '' ? `Column ${idx + 1}` : h.trim())) : [];
  const dataRows = rows.slice(1).map((r) => {
    // Normalise ragged rows to the header width.
    const out = r.slice(0, headers.length);
    while (out.length < headers.length) out.push('');
    return out;
  });
  return { headers, rows: dataRows };
}

export function toNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/[$€£%\s]/g, '').replace(/,(?=\d{3}(\D|$))/g, '');
  if (cleaned === '' || cleaned === '-') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Fraction of non-empty cells in a column that parse as numbers. */
export function numericScore(table: CsvTable, col: number): number {
  let numeric = 0;
  let filled = 0;
  for (const r of table.rows) {
    const cell = (r[col] ?? '').trim();
    if (!cell) continue;
    filled++;
    if (toNumber(cell) !== null) numeric++;
  }
  return filled === 0 ? 0 : numeric / filled;
}

export interface ColumnGuess {
  /** Index of the best label (category) column. */
  labelCol: number;
  /** Indices of numeric columns, in header order. */
  numericCols: number[];
}

export function guessColumns(table: CsvTable): ColumnGuess {
  const numericCols: number[] = [];
  let labelCol = 0;
  let worstScore = 2;
  table.headers.forEach((_, i) => {
    const score = numericScore(table, i);
    if (score >= 0.8 && table.rows.some((r) => (r[i] ?? '').trim() !== '')) numericCols.push(i);
    if (score < worstScore) { worstScore = score; labelCol = i; }
  });
  // If every column is numeric, fall back to labeling by the first column.
  const filteredNumeric = numericCols.filter((c) => c !== labelCol);
  return { labelCol, numericCols: filteredNumeric.length ? filteredNumeric : numericCols.slice(1) };
}

export interface ChartSeries {
  name: string;
  values: (number | null)[];
}

export interface ChartModel {
  labels: string[];
  series: ChartSeries[];
}

export const MAX_SERIES = 8;
export const MAX_DONUT_SLICES = 8;

export function buildChartModel(table: CsvTable, labelCol: number, valueCols: number[]): ChartModel {
  const labels = table.rows.map((r) => (r[labelCol] ?? '').trim() || '—');
  const series = valueCols.slice(0, MAX_SERIES).map((c) => ({
    name: table.headers[c] ?? `Column ${c + 1}`,
    values: table.rows.map((r) => toNumber(r[c] ?? '')),
  }));
  return { labels, series };
}

export interface DonutSlice {
  label: string;
  value: number;
}

/** Collapse a single series into ≤ MAX_DONUT_SLICES slices, folding the tail into "Other". */
export function buildDonutSlices(model: ChartModel, seriesIndex = 0): DonutSlice[] {
  const s = model.series[seriesIndex];
  if (!s) return [];
  const entries = model.labels
    .map((label, i) => ({ label, value: s.values[i] ?? 0 }))
    .filter((e) => (e.value ?? 0) > 0) as DonutSlice[];
  entries.sort((a, b) => b.value - a.value);
  if (entries.length <= MAX_DONUT_SLICES) return entries;
  const head = entries.slice(0, MAX_DONUT_SLICES - 1);
  const other = entries.slice(MAX_DONUT_SLICES - 1).reduce((sum, e) => sum + e.value, 0);
  return [...head, { label: 'Other', value: other }];
}

/** Nice axis ticks: 5-ish steps from 0 (or a negative floor) to the data max. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  const lo = Math.min(0, min);
  const hi = Math.max(0, max);
  const span = hi - lo || 1;
  const rawStep = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const start = Math.floor(lo / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= hi + step * 0.5; v += step) ticks.push(Math.round(v * 1e9) / 1e9);
  return ticks;
}
