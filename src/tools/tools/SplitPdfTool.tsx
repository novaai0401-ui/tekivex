import React from 'react';
import { FileDrop } from '../components/FileDrop';
import { downloadBlob, formatBytes } from '../lib/download';
import { getPageCount, extractPages } from '../lib/pdf';
import { parsePageRanges } from '../lib/pageRanges';

export function SplitPdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState<number | null>(null);
  const [ranges, setRanges] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<string | null>(null);

  const onFiles = async (files: File[]) => {
    const f = files[0]!;
    setFile(f); setPageCount(null); setError(null); setDone(null);
    try {
      setPageCount(await getPageCount(await f.arrayBuffer(), f.name));
    } catch (e) {
      setFile(null);
      setError(e instanceof Error ? e.message : 'Could not read that PDF.');
    }
  };

  const parsed = pageCount !== null ? parsePageRanges(ranges, pageCount) : null;

  const split = async () => {
    if (!file || !parsed?.ok) return;
    setBusy(true); setError(null); setDone(null);
    try {
      const out = await extractPages(await file.arrayBuffer(), file.name, parsed.indices);
      const base = file.name.replace(/\.pdf$/i, '');
      downloadBlob(out, `${base}-pages.pdf`, 'application/pdf');
      setDone(`Extracted ${parsed.indices.length} page${parsed.indices.length === 1 ? '' : 's'} (${formatBytes(out.byteLength)}) — check your downloads.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong extracting the pages.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool-body" data-testid="tool-split-pdf">
      <FileDrop
        accept="application/pdf,.pdf"
        label="Drop a PDF here, or click to browse"
        hint="Then choose which pages to extract"
        onFiles={onFiles}
      />
      {file && pageCount !== null && (
        <div className="tool-controls">
          <p className="tool-filename">{file.name} · {pageCount} page{pageCount === 1 ? '' : 's'}</p>
          <label className="tool-label" htmlFor="split-ranges">Pages to extract</label>
          <input
            id="split-ranges"
            className="tool-input"
            type="text"
            placeholder={`e.g. 1,3,7-9 (1–${pageCount})`}
            value={ranges}
            onChange={(e) => { setRanges(e.target.value); setDone(null); }}
          />
          {ranges.trim() !== '' && parsed && !parsed.ok && <p className="tool-error" role="alert">{parsed.error}</p>}
        </div>
      )}
      {error && <p className="tool-error" role="alert">{error}</p>}
      {done && <p className="tool-success" role="status">{done}</p>}
      <button className="tool-cta" type="button" disabled={!file || !parsed?.ok || busy} onClick={split}>
        {busy ? 'Extracting…' : 'Extract pages'}
      </button>
    </div>
  );
}
