import React from 'react';
import { FileDrop } from '../components/FileDrop';
import { downloadBlob, formatBytes } from '../lib/download';
import { renderPdfToImages, type ImageFormat, type RenderedPage } from '../lib/pdfRender';

export function PdfToJpgTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [format, setFormat] = React.useState<ImageFormat>('image/jpeg');
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pages, setPages] = React.useState<RenderedPage[]>([]);

  const ext = format === 'image/png' ? 'png' : 'jpg';

  const convert = async () => {
    if (!file) return;
    setBusy(true); setError(null); setPages([]);
    try {
      const rendered = await renderPdfToImages(
        await file.arrayBuffer(), format, 0.85, 2,
        (p) => setProgress(`Rendering page ${p.page} of ${p.totalPages}…`),
      );
      setProgress(null);
      setPages(rendered);
    } catch (e) {
      setProgress(null);
      setError(e instanceof Error ? e.message : 'Something went wrong converting the file.');
    } finally {
      setBusy(false);
    }
  };

  const base = file?.name.replace(/\.pdf$/i, '') ?? 'page';
  const saveOne = (p: RenderedPage) => downloadBlob(p.blob, `${base}-p${p.page}.${ext}`, format);
  const saveAll = () => pages.forEach((p, i) => setTimeout(() => saveOne(p), i * 150));

  return (
    <div className="tool-body" data-testid="tool-pdf-to-jpg">
      <FileDrop
        accept="application/pdf,.pdf"
        label="Drop a PDF here, or click to browse"
        hint="Each page becomes an image"
        onFiles={(files) => { setFile(files[0]!); setPages([]); setError(null); }}
      />
      {file && (
        <div className="tool-controls">
          <p className="tool-filename">{file.name} · {formatBytes(file.size)}</p>
          <div className="tool-levels" role="radiogroup" aria-label="Image format">
            <label className={`tool-level ${format === 'image/jpeg' ? 'tool-level--active' : ''}`}>
              <input type="radio" name="img-format" checked={format === 'image/jpeg'} onChange={() => setFormat('image/jpeg')} />
              <span className="tool-level-name">JPG</span>
              <span className="tool-level-blurb">Smaller — scans & photos</span>
            </label>
            <label className={`tool-level ${format === 'image/png' ? 'tool-level--active' : ''}`}>
              <input type="radio" name="img-format" checked={format === 'image/png'} onChange={() => setFormat('image/png')} />
              <span className="tool-level-name">PNG</span>
              <span className="tool-level-blurb">Lossless — text & diagrams</span>
            </label>
          </div>
        </div>
      )}
      {progress && <p className="tool-progress" role="status">{progress}</p>}
      {error && <p className="tool-error" role="alert">{error}</p>}

      {pages.length > 0 && (
        <>
          <div className="tool-export-row">
            <button className="tool-cta" type="button" onClick={saveAll}>Download all {pages.length} images</button>
          </div>
          <div className="tool-thumbs">
            {pages.map((p) => (
              <figure key={p.page} className="tool-thumb">
                <img src={p.dataUrl} alt={`Page ${p.page}`} loading="lazy" />
                <figcaption>
                  <span>Page {p.page}</span>
                  <button type="button" className="tool-ghost-btn" onClick={() => saveOne(p)}>Download</button>
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      <button className="tool-cta" type="button" disabled={!file || busy} onClick={convert}>
        {busy ? 'Converting…' : `Convert to ${ext.toUpperCase()}`}
      </button>
    </div>
  );
}
