import React from 'react';
import { FileDrop } from '../components/FileDrop';
import { downloadBlob, formatBytes } from '../lib/download';
import { compressPdf, type CompressLevel } from '../lib/pdfCompress';

const LEVELS: { id: CompressLevel; label: string; blurb: string }[] = [
  { id: 'high',     label: 'High quality',  blurb: 'Larger file, crisp pages' },
  { id: 'balanced', label: 'Balanced',      blurb: 'Good size / quality trade-off' },
  { id: 'strong',   label: 'Strong',        blurb: 'Smallest file, softer pages' },
];

export function CompressPdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [level, setLevel] = React.useState<CompressLevel>('balanced');
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ before: number; after: number } | null>(null);

  const compress = async () => {
    if (!file) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const before = bytes.byteLength;
      const out = await compressPdf(bytes, level, (p) => setProgress(`Rendering page ${p.page} of ${p.totalPages}…`));
      setProgress(null);
      const base = file.name.replace(/\.pdf$/i, '');
      downloadBlob(out, `${base}-compressed.pdf`, 'application/pdf');
      setResult({ before, after: out.byteLength });
    } catch (e) {
      setProgress(null);
      setError(e instanceof Error ? e.message : 'Something went wrong compressing the file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool-body" data-testid="tool-compress-pdf">
      <FileDrop
        accept="application/pdf,.pdf"
        label="Drop a PDF here, or click to browse"
        hint="Best for scanned or image-heavy PDFs"
        onFiles={(files) => { setFile(files[0]!); setResult(null); setError(null); }}
      />
      {file && (
        <div className="tool-controls">
          <p className="tool-filename">{file.name} · {formatBytes(file.size)}</p>
          <div className="tool-levels" role="radiogroup" aria-label="Compression level">
            {LEVELS.map((l) => (
              <label key={l.id} className={`tool-level ${level === l.id ? 'tool-level--active' : ''}`}>
                <input type="radio" name="compress-level" value={l.id} checked={level === l.id} onChange={() => setLevel(l.id)} />
                <span className="tool-level-name">{l.label}</span>
                <span className="tool-level-blurb">{l.blurb}</span>
              </label>
            ))}
          </div>
          <p className="tool-note">
            Pages are re-rendered as images, so text in the output is not selectable.
            Best results on scans; text-only PDFs may not shrink.
          </p>
        </div>
      )}
      {progress && <p className="tool-progress" role="status">{progress}</p>}
      {error && <p className="tool-error" role="alert">{error}</p>}
      {result && (
        <p className={result.after < result.before ? 'tool-success' : 'tool-warn'} role="status">
          {formatBytes(result.before)} → {formatBytes(result.after)}
          {result.after < result.before
            ? ` (${Math.round((1 - result.after / result.before) * 100)}% smaller) — check your downloads.`
            : ' — this PDF did not get smaller (it is likely text-only and already compact). The download still ran; keep the original.'}
        </p>
      )}
      <button className="tool-cta" type="button" disabled={!file || busy} onClick={compress}>
        {busy ? 'Compressing…' : 'Compress PDF'}
      </button>
    </div>
  );
}
