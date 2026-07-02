import React from 'react';
import { FileDrop } from '../components/FileDrop';
import { downloadBlob, formatBytes } from '../lib/download';
import { mergePdfs } from '../lib/pdf';

interface Item { file: File }

export function MergePdfTool() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<string | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  };

  const merge = async () => {
    setBusy(true); setError(null); setDone(null);
    try {
      const files = await Promise.all(items.map(async ({ file }) => ({ name: file.name, bytes: await file.arrayBuffer() })));
      const out = await mergePdfs(files);
      downloadBlob(out, 'merged.pdf', 'application/pdf');
      setDone(`Merged ${items.length} files (${formatBytes(out.byteLength)}) — check your downloads.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong merging the files.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool-body" data-testid="tool-merge-pdf">
      <FileDrop
        accept="application/pdf,.pdf"
        multiple
        label="Drop PDF files here, or click to browse"
        hint="Add two or more PDFs to combine"
        onFiles={(files) => { setItems((prev) => [...prev, ...files.map((file) => ({ file }))]); setDone(null); }}
      />
      {items.length > 0 && (
        <ul className="tool-filelist">
          {items.map(({ file }, i) => (
            <li key={`${file.name}-${i}`} className="tool-fileitem">
              <span className="tool-fileitem-name">{i + 1}. {file.name}</span>
              <span className="tool-fileitem-meta">{formatBytes(file.size)}</span>
              <span className="tool-fileitem-actions">
                <button type="button" aria-label={`Move ${file.name} up`} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" aria-label={`Move ${file.name} down`} onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
                <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setItems((p) => p.filter((_, k) => k !== i))}>✕</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="tool-error" role="alert">{error}</p>}
      {done && <p className="tool-success" role="status">{done}</p>}
      <button className="tool-cta" type="button" disabled={items.length < 2 || busy} onClick={merge}>
        {busy ? 'Merging…' : `Merge ${items.length || ''} PDF${items.length === 1 ? '' : 's'}`}
      </button>
    </div>
  );
}
