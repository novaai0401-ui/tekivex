import React from 'react';
import { FileDrop } from '../components/FileDrop';
import { downloadBlob, formatBytes } from '../lib/download';
import { rotatePdf } from '../lib/pdf';

const ROTATIONS: { label: string; deg: 90 | 180 | 270 }[] = [
  { label: '⟲ 90° left', deg: 270 },
  { label: '⟳ 90° right', deg: 90 },
  { label: '↻ 180°', deg: 180 },
];

export function RotatePdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<string | null>(null);

  const rotate = async (deg: 90 | 180 | 270) => {
    if (!file) return;
    setBusy(true); setError(null); setDone(null);
    try {
      const out = await rotatePdf(await file.arrayBuffer(), file.name, deg);
      const base = file.name.replace(/\.pdf$/i, '');
      downloadBlob(out, `${base}-rotated.pdf`, 'application/pdf');
      setDone(`Rotated (${formatBytes(out.byteLength)}) — check your downloads.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong rotating the file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool-body" data-testid="tool-rotate-pdf">
      <FileDrop
        accept="application/pdf,.pdf"
        label="Drop a PDF here, or click to browse"
        hint="Then choose how far to rotate every page"
        onFiles={(files) => { setFile(files[0]!); setDone(null); setError(null); }}
      />
      {file && (
        <div className="tool-controls">
          <p className="tool-filename">{file.name} · {formatBytes(file.size)}</p>
          <div className="tool-rotate-row">
            {ROTATIONS.map((r) => (
              <button key={r.deg} type="button" className="tool-cta tool-cta--secondary" disabled={busy} onClick={() => rotate(r.deg)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {busy && <p className="tool-progress" role="status">Rotating…</p>}
      {error && <p className="tool-error" role="alert">{error}</p>}
      {done && <p className="tool-success" role="status">{done}</p>}
    </div>
  );
}
