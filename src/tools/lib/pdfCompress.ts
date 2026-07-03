// Compress-PDF engine: render each page with pdf.js, re-encode as JPEG at the
// chosen quality, and re-pack with pdf-lib. This is a *rasterising* compressor
// — dramatic on scans and image-heavy documents, but output text is no longer
// selectable, and text-only PDFs may not shrink. The UI states both plainly
// and shows the before/after size instead of pretending.
//
// Both libraries load dynamically so this heavy path costs nothing until a
// visitor actually compresses a file.

export type CompressLevel = 'high' | 'balanced' | 'strong';

const LEVELS: Record<CompressLevel, { scale: number; quality: number }> = {
  high:     { scale: 1.6, quality: 0.8 },
  balanced: { scale: 1.3, quality: 0.65 },
  strong:   { scale: 1.0, quality: 0.5 },
};

export interface CompressProgress {
  page: number;
  totalPages: number;
}

export async function compressPdf(
  bytes: ArrayBuffer,
  level: CompressLevel,
  onProgress?: (p: CompressProgress) => void,
): Promise<Uint8Array> {
  // The pdf.js "legacy" build targets a much wider browser range than the
  // default build (whose output crashes on anything but the very newest
  // engines — e.g. Map.prototype.getOrInsertComputed). Verified against
  // Chromium 141, where the modern build throws and legacy works.
  const [pdfjs, workerMod, pdfLib] = await Promise.all([
    import('pdfjs-dist/legacy/build/pdf.mjs'),
    import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
    import('pdf-lib'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;

  const { scale, quality } = LEVELS[level];
  const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
  const srcDoc = await loadingTask.promise;
  const out = await pdfLib.PDFDocument.create();

  for (let n = 1; n <= srcDoc.numPages; n++) {
    onProgress?.({ page: n, totalPages: srcDoc.numPages });
    const page = await srcDoc.getPage(n);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d')!;
    // White backdrop so transparency doesn't turn black in JPEG.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, canvas, viewport }).promise;

    const jpegUrl = canvas.toDataURL('image/jpeg', quality);
    const jpegBytes = Uint8Array.from(atob(jpegUrl.split(',')[1]!), (c) => c.charCodeAt(0));
    const img = await out.embedJpg(jpegBytes);

    // Page keeps the original point dimensions so the document prints the same.
    const { width: pw, height: ph } = page.getViewport({ scale: 1 });
    const outPage = out.addPage([pw, ph]);
    outPage.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
    canvas.width = 0; // release backing store eagerly on memory-tight devices
    canvas.height = 0;
  }

  await loadingTask.destroy();
  return out.save();
}
