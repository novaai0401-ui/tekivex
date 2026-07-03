// PDF → image rendering for the PDF-to-JPG tool. Each page is rendered with
// pdf.js onto a canvas and exported as a JPEG (or PNG) data URL + Blob. Like
// pdfCompress, this needs a real <canvas> and the pdf.js worker, so it runs
// only in the browser and is excluded from jsdom coverage.
//
// Both pdf.js and its worker load dynamically so the tool page stays light
// until a visitor actually converts a file.

export type ImageFormat = 'image/jpeg' | 'image/png';

export interface RenderedPage {
  page: number;
  width: number;
  height: number;
  dataUrl: string;
  blob: Blob;
}

export interface RenderProgress {
  page: number;
  totalPages: number;
}

export async function renderPdfToImages(
  bytes: ArrayBuffer,
  format: ImageFormat = 'image/jpeg',
  quality = 0.85,
  scale = 2,
  onProgress?: (p: RenderProgress) => void,
): Promise<RenderedPage[]> {
  // Legacy build for broad browser support — see pdfCompress.ts for why.
  const [pdfjs, workerMod] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;

  const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
  const doc = await loadingTask.promise;
  const out: RenderedPage[] = [];

  for (let n = 1; n <= doc.numPages; n++) {
    onProgress?.({ page: n, totalPages: doc.numPages });
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d')!;
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    await page.render({ canvasContext: ctx, canvas, viewport }).promise;
    const dataUrl = canvas.toDataURL(format, quality);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b ?? new Blob()), format, quality),
    );
    out.push({ page: n, width: canvas.width, height: canvas.height, dataUrl, blob });
    canvas.width = 0;
    canvas.height = 0;
  }

  await loadingTask.destroy();
  return out;
}
