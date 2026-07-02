import React from 'react';
import { FileDrop } from '../components/FileDrop';
import { downloadBlob } from '../lib/download';
import {
  parseCsv, guessColumns, buildChartModel, buildDonutSlices, niceTicks,
  MAX_SERIES, type CsvTable, type ChartModel,
} from '../lib/csv';
import { currentTheme, type ChartTheme } from '../lib/chartTheme';

type ChartKind = 'bar' | 'line' | 'area' | 'donut';

const SAMPLE_CSV = `Month,Revenue,Expenses
Jan,12400,8200
Feb,13100,8600
Mar,14800,9100
Apr,14200,9400
May,16900,9800
Jun,18300,10400`;

const W = 760;
const H = 400;
const M = { top: 18, right: 104, bottom: 52, left: 60 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

const fmt = (n: number) =>
  Math.abs(n) >= 10000 ? new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
  : new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(n);

interface Tip { x: number; y: number; label: string; series: string; value: number; color: string }

// ── Hooks ────────────────────────────────────────────────────────────────────

function useChartTheme(): ChartTheme {
  const [theme, setTheme] = React.useState(currentTheme);
  React.useEffect(() => {
    const obs = new MutationObserver(() => setTheme(currentTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-hub-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

// ── Scales ───────────────────────────────────────────────────────────────────

function extent(model: ChartModel): { min: number; max: number } {
  let min = 0, max = 0;
  for (const s of model.series) for (const v of s.values) if (v !== null) { if (v < min) min = v; if (v > max) max = v; }
  if (min === 0 && max === 0) max = 1;
  return { min, max };
}

// ── SVG chart ────────────────────────────────────────────────────────────────

function Chart({ kind, model, theme, onTip }: {
  kind: ChartKind; model: ChartModel; theme: ChartTheme;
  onTip: (t: Tip | null) => void;
}) {
  const n = model.labels.length;
  const { min, max } = extent(model);
  const ticks = niceTicks(min, max);
  const lo = ticks[0]!;
  const hi = ticks[ticks.length - 1]!;
  const y = (v: number) => M.top + PH - ((v - lo) / (hi - lo || 1)) * PH;
  const xBand = (i: number) => M.left + (i + 0.5) * (PW / Math.max(n, 1));
  const labelSkip = Math.max(1, Math.ceil(n / 12));

  const axis = (
    <g aria-hidden="true">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={M.left} x2={M.left + PW} y1={y(t)} y2={y(t)} stroke={theme.grid} strokeWidth={1} />
          <text x={M.left - 8} y={y(t) + 3.5} textAnchor="end" fontSize={11} fill={theme.inkMuted}>{fmt(t)}</text>
        </g>
      ))}
      <line x1={M.left} x2={M.left + PW} y1={y(0)} y2={y(0)} stroke={theme.baseline} strokeWidth={1} />
      {model.labels.map((l, i) => (i % labelSkip === 0 ? (
        <text key={i} x={xBand(i)} y={M.top + PH + 18} textAnchor="middle" fontSize={11} fill={theme.inkMuted}>
          {l.length > 12 ? `${l.slice(0, 11)}…` : l}
        </text>
      ) : null))}
    </g>
  );

  if (kind === 'bar') {
    const groupW = PW / Math.max(n, 1);
    const inner = Math.max(groupW * 0.72, 4);
    const per = Math.max((inner - 2 * (model.series.length - 1)) / model.series.length, 2);
    return (
      <g>
        {axis}
        {model.series.map((s, si) => s.values.map((v, i) => {
          if (v === null) return null;
          const x = xBand(i) - inner / 2 + si * (per + 2);
          const y0 = y(0), y1 = y(v);
          const top = Math.min(y0, y1), h = Math.max(Math.abs(y0 - y1), 1);
          const r = Math.min(4, per / 2, h);
          // Rounded at the data end only, anchored square at the baseline.
          const d = v >= 0
            ? `M${x},${top + h} L${x},${top + r} Q${x},${top} ${x + r},${top} L${x + per - r},${top} Q${x + per},${top} ${x + per},${top + r} L${x + per},${top + h} Z`
            : `M${x},${top} L${x},${top + h - r} Q${x},${top + h} ${x + r},${top + h} L${x + per - r},${top + h} Q${x + per},${top + h} ${x + per},${top + h - r} L${x + per},${top} Z`;
          return (
            <path key={`${si}-${i}`} d={d} fill={theme.series[si % theme.series.length]}
              onMouseEnter={() => onTip({ x: x + per / 2, y: top, label: model.labels[i]!, series: s.name, value: v, color: theme.series[si % theme.series.length]! })}
              onMouseLeave={() => onTip(null)} />
          );
        }))}
      </g>
    );
  }

  // line / area share path math
  const seriesToDraw = kind === 'area' ? model.series.slice(0, 1) : model.series;
  const linePath = (values: (number | null)[]) => {
    let d = '';
    values.forEach((v, i) => { d += v === null ? '' : `${d === '' || values[i - 1] === null ? 'M' : 'L'}${xBand(i)},${y(v)} `; });
    return d.trim();
  };
  return (
    <g>
      {axis}
      {kind === 'area' && seriesToDraw[0] && (
        <path
          d={`${linePath(seriesToDraw[0].values)} L${xBand(n - 1)},${y(0)} L${xBand(0)},${y(0)} Z`}
          fill={theme.series[0]} opacity={0.18}
        />
      )}
      {seriesToDraw.map((s, si) => (
        <path key={s.name} d={linePath(s.values)} fill="none" stroke={theme.series[si % theme.series.length]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {/* Direct labels at line ends for ≤4 series (selective labeling). */}
      {seriesToDraw.length > 1 && seriesToDraw.length <= 4 && seriesToDraw.map((s, si) => {
        const lastIdx = [...s.values].reverse().findIndex((v) => v !== null);
        if (lastIdx === -1) return null;
        const i = s.values.length - 1 - lastIdx;
        return (
          <text key={s.name} x={xBand(i) + 8} y={y(s.values[i]!) + 4} fontSize={11} fontWeight={600} fill={theme.inkSecondary}>{s.name}</text>
        );
      })}
      {/* Invisible hover targets, larger than the marks. */}
      {seriesToDraw.map((s, si) => s.values.map((v, i) => (v === null ? null : (
        <circle key={`${si}-${i}`} cx={xBand(i)} cy={y(v)} r={10} fill="transparent"
          onMouseEnter={() => onTip({ x: xBand(i), y: y(v), label: model.labels[i]!, series: s.name, value: v, color: theme.series[si % theme.series.length]! })}
          onMouseLeave={() => onTip(null)} />
      ))))}
    </g>
  );
}

function Donut({ model, theme, onTip }: { model: ChartModel; theme: ChartTheme; onTip: (t: Tip | null) => void }) {
  const slices = buildDonutSlices(model);
  const total = slices.reduce((s, e) => s + e.value, 0) || 1;
  const cx = W / 2, cy = H / 2 - 6, R = 128, r = 78;
  let a0 = -Math.PI / 2;
  const arcs = slices.map((sl, i) => {
    const a1 = a0 + (sl.value / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (a: number, rad: number) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r);
    const mid = (a0 + a1) / 2;
    const el = { d: `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3} Z`, mid, slice: sl, color: theme.series[i % theme.series.length]! };
    a0 = a1;
    return el;
  });
  return (
    <g>
      {arcs.map((a, i) => (
        <path key={i} d={a.d} fill={a.color} stroke={theme.surface} strokeWidth={2}
          onMouseEnter={() => onTip({ x: cx + (R + 6) * Math.cos(a.mid), y: cy + (R + 6) * Math.sin(a.mid), label: a.slice.label, series: 'Share', value: a.slice.value, color: a.color })}
          onMouseLeave={() => onTip(null)} />
      ))}
      {/* Percent labels outside slices ≥ 6%, in ink — never on the colored mark. */}
      {arcs.filter((a) => a.slice.value / total >= 0.06).map((a, i) => (
        <text key={i} x={cx + (R + 16) * Math.cos(a.mid)} y={cy + (R + 16) * Math.sin(a.mid) + 4}
          textAnchor={Math.cos(a.mid) > 0.2 ? 'start' : Math.cos(a.mid) < -0.2 ? 'end' : 'middle'}
          fontSize={11} fill={theme.inkSecondary}>
          {Math.round((a.slice.value / total) * 100)}%
        </text>
      ))}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={22} fontWeight={700} fill={theme.inkPrimary}>{fmt(total)}</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize={11} fill={theme.inkMuted}>total</text>
    </g>
  );
}

// ── Tool ─────────────────────────────────────────────────────────────────────

export function CsvChartTool() {
  const theme = useChartTheme();
  const [table, setTable] = React.useState<CsvTable | null>(null);
  const [labelCol, setLabelCol] = React.useState(0);
  const [valueCols, setValueCols] = React.useState<number[]>([]);
  const [kind, setKind] = React.useState<ChartKind>('bar');
  const [tip, setTip] = React.useState<Tip | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const loadCsv = (text: string) => {
    const t = parseCsv(text);
    if (!t.headers.length || !t.rows.length) { setError('That CSV appears to be empty — it needs a header row plus data rows.'); return; }
    const guess = guessColumns(t);
    if (!guess.numericCols.length) { setError('No numeric columns found — at least one column must contain numbers to chart.'); return; }
    setError(null);
    setTable(t);
    setLabelCol(guess.labelCol);
    setValueCols(guess.numericCols.slice(0, 3));
  };

  const model = React.useMemo(
    () => (table && valueCols.length ? buildChartModel(table, labelCol, valueCols) : null),
    [table, labelCol, valueCols],
  );

  const exportSvg = () => {
    if (!svgRef.current) return;
    const src = svgRef.current.cloneNode(true) as SVGSVGElement;
    src.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    downloadBlob(new XMLSerializer().serializeToString(src), 'chart.svg', 'image/svg+xml');
  };

  const exportPng = () => {
    if (!svgRef.current) return;
    const src = svgRef.current.cloneNode(true) as SVGSVGElement;
    src.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgText = new XMLSerializer().serializeToString(src);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = W * 2; canvas.height = H * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = theme.surface;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => { if (blob) downloadBlob(blob, 'chart.png', 'image/png'); }, 'image/png');
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
  };

  const toggleCol = (c: number) => {
    setValueCols((prev) => prev.includes(c)
      ? prev.filter((x) => x !== c)
      : prev.length >= MAX_SERIES ? prev : [...prev, c].sort((a, b) => a - b));
  };

  return (
    <div className="tool-body" data-testid="tool-csv-to-chart">
      {!table && (
        <>
          <FileDrop
            accept="text/csv,.csv,text/plain"
            label="Drop a .csv file here, or click to browse"
            hint="First row = headers. Or paste CSV below."
            onFiles={async (files) => loadCsv(await files[0]!.text())}
          />
          <textarea
            className="tool-textarea"
            placeholder={'Or paste CSV here…\nMonth,Revenue\nJan,1200\nFeb,1350'}
            rows={5}
            aria-label="Paste CSV data"
            onChange={(e) => { if (e.target.value.trim().split('\n').length > 1) loadCsv(e.target.value); }}
          />
          <button className="tool-ghost-btn" type="button" onClick={() => loadCsv(SAMPLE_CSV)}>Try sample data</button>
        </>
      )}
      {error && <p className="tool-error" role="alert">{error}</p>}

      {table && model && (
        <>
          <div className="tool-chart-controls">
            <div role="radiogroup" aria-label="Chart type" className="tool-kinds">
              {(['bar', 'line', 'area', 'donut'] as ChartKind[]).map((k) => (
                <button key={k} type="button" className={`tool-kind ${kind === k ? 'tool-kind--active' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
            <label className="tool-label">
              Labels:{' '}
              <select className="tool-select" value={labelCol} onChange={(e) => setLabelCol(Number(e.target.value))}>
                {table.headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
              </select>
            </label>
            <fieldset className="tool-cols">
              <legend className="tool-label">Series (max {MAX_SERIES})</legend>
              {table.headers.map((h, i) => (i === labelCol ? null : (
                <label key={i} className="tool-col-check">
                  <input type="checkbox" checked={valueCols.includes(i)} onChange={() => toggleCol(i)} /> {h}
                </label>
              )))}
            </fieldset>
            <button className="tool-ghost-btn" type="button" onClick={() => { setTable(null); setTip(null); }}>Start over</button>
          </div>

          {(kind === 'area') && model.series.length > 1 && (
            <p className="tool-note">Area shows the first selected series ({model.series[0]!.name}); switch to line or bar to compare several.</p>
          )}
          {(kind === 'donut') && (
            <p className="tool-note">Donut charts the first selected series; slices beyond 8 fold into “Other”.</p>
          )}

          {/* Legend — always present for 2+ series; a single series is named by the download title */}
          {kind !== 'donut' && model.series.length >= 2 && (
            <div className="tool-legend" role="list" aria-label="Series legend">
              {(kind === 'area' ? model.series.slice(0, 1) : model.series).map((s, i) => (
                <span key={s.name} role="listitem" className="tool-legend-item">
                  <span className="tool-legend-chip" style={{ background: theme.series[i % theme.series.length] }} aria-hidden="true" />
                  {s.name}
                </span>
              ))}
            </div>
          )}
          {kind === 'donut' && (
            <div className="tool-legend" role="list" aria-label="Slice legend">
              {buildDonutSlices(model).map((sl, i) => (
                <span key={sl.label} role="listitem" className="tool-legend-item">
                  <span className="tool-legend-chip" style={{ background: theme.series[i % theme.series.length] }} aria-hidden="true" />
                  {sl.label}
                </span>
              ))}
            </div>
          )}

          <div className="tool-chart-wrap" style={{ position: 'relative' }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              width="100%"
              role="img"
              aria-label={`${kind} chart of ${model.series.map((s) => s.name).join(', ')} by ${table.headers[labelCol]}`}
              style={{ background: theme.surface, borderRadius: 12, fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}
            >
              <rect x={0} y={0} width={W} height={H} fill={theme.surface} rx={12} />
              {kind === 'donut'
                ? <Donut model={model} theme={theme} onTip={setTip} />
                : <Chart kind={kind} model={model} theme={theme} onTip={setTip} />}
            </svg>
            {tip && (
              <div className="tool-tooltip" style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }} role="status">
                <span className="tool-legend-chip" style={{ background: tip.color }} aria-hidden="true" />
                <strong>{tip.label}</strong> · {tip.series}: {fmt(tip.value)}
              </div>
            )}
          </div>

          <div className="tool-export-row">
            <button className="tool-cta" type="button" onClick={exportSvg}>Download SVG</button>
            <button className="tool-cta tool-cta--secondary" type="button" onClick={exportPng}>Download PNG</button>
          </div>

          {/* Table view — the accessible/relief representation of the same data. */}
          <details className="tool-table-details" open={false}>
            <summary>View data as a table ({table.rows.length} rows)</summary>
            <div className="tool-table-scroll">
              <table className="tool-table">
                <thead><tr>{table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                <tbody>
                  {table.rows.slice(0, 50).map((r, ri) => (
                    <tr key={ri}>{r.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {table.rows.length > 50 && <p className="tool-note">Showing the first 50 of {table.rows.length} rows.</p>}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
