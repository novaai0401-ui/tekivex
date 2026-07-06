// pdf-lib engines for the PDF tools. pdf-lib is imported dynamically so the
// ~200 KB library is only fetched when a visitor actually processes a file —
// tool pages themselves stay light.

async function pdfLib() {
  return import('pdf-lib');
}

/** Thrown with a friendly message when a source PDF cannot be opened. */
export class PdfOpenError extends Error {
  constructor(filename: string, cause: unknown) {
    const encrypted = String(cause).toLowerCase().includes('encrypt');
    super(
      encrypted
        ? `"${filename}" is password-protected. Unlock it first (the Pyntra editor can open encrypted PDFs).`
        : `"${filename}" could not be read as a PDF.`,
    );
    this.name = 'PdfOpenError';
  }
}

async function loadDoc(lib: Awaited<ReturnType<typeof pdfLib>>, bytes: ArrayBuffer, filename: string) {
  try {
    const doc = await lib.PDFDocument.load(bytes);
    // A structurally broken file can survive load() and only explode later
    // (e.g. during copyPages) with a raw internal error. Probing the page
    // tree here surfaces the problem immediately, as a friendly error.
    if (doc.getPageCount() < 1) throw new Error('no pages');
    return doc;
  } catch (e) {
    if (e instanceof PdfOpenError) throw e;
    throw new PdfOpenError(filename, e);
  }
}

/** Wrap post-load pdf-lib failures so raw internals never reach the UI. */
async function friendly<T>(filename: string, op: () => Promise<T>): Promise<T> {
  try {
    return await op();
  } catch (e) {
    if (e instanceof PdfOpenError || (e instanceof Error && /keep at least one/.test(e.message))) throw e;
    throw new PdfOpenError(filename, e);
  }
}

export async function mergePdfs(files: { name: string; bytes: ArrayBuffer }[]): Promise<Uint8Array> {
  const lib = await pdfLib();
  const out = await lib.PDFDocument.create();
  for (const f of files) {
    const src = await loadDoc(lib, f.bytes, f.name);
    await friendly(f.name, async () => {
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
    });
  }
  return out.save();
}

export async function getPageCount(bytes: ArrayBuffer, filename: string): Promise<number> {
  const lib = await pdfLib();
  const doc = await loadDoc(lib, bytes, filename);
  return doc.getPageCount();
}

export async function extractPages(
  bytes: ArrayBuffer,
  filename: string,
  indices: number[],
): Promise<Uint8Array> {
  const lib = await pdfLib();
  const src = await loadDoc(lib, bytes, filename);
  const out = await lib.PDFDocument.create();
  return friendly(filename, async () => {
    const pages = await out.copyPages(src, indices);
    pages.forEach((p) => out.addPage(p));
    return out.save();
  });
}

/** Rotate pages by a quarter-turn multiple. `indices` omitted = all pages. */
export async function rotatePdf(
  bytes: ArrayBuffer,
  filename: string,
  turnDegrees: 90 | 180 | 270,
  indices?: number[],
): Promise<Uint8Array> {
  const lib = await pdfLib();
  const doc = await loadDoc(lib, bytes, filename);
  return friendly(filename, async () => {
    const pages = doc.getPages();
    const target = indices ?? pages.map((_, i) => i);
    const targetSet = new Set(target);
    pages.forEach((p, i) => {
      if (!targetSet.has(i)) return;
      const current = p.getRotation().angle;
      p.setRotation(lib.degrees((current + turnDegrees) % 360));
    });
    return doc.save();
  });
}

/** Remove the given 0-based pages, keeping the rest. At least one page must remain. */
export async function removePages(
  bytes: ArrayBuffer,
  filename: string,
  removeIndices: number[],
): Promise<Uint8Array> {
  const lib = await pdfLib();
  const src = await loadDoc(lib, bytes, filename);
  const total = src.getPageCount();
  const remove = new Set(removeIndices);
  const keep: number[] = [];
  for (let i = 0; i < total; i++) if (!remove.has(i)) keep.push(i);
  if (!keep.length) throw new Error('That would remove every page — keep at least one.');
  const out = await lib.PDFDocument.create();
  return friendly(filename, async () => {
    const copied = await out.copyPages(src, keep);
    copied.forEach((p) => out.addPage(p));
    return out.save();
  });
}

/** One image per page; the page matches the image's aspect ratio at A4-ish width. */
export async function imagesToPdf(files: { name: string; type: string; bytes: ArrayBuffer }[]): Promise<Uint8Array> {
  const lib = await pdfLib();
  const out = await lib.PDFDocument.create();
  const PAGE_W = 595.28; // A4 width in points
  for (const f of files) {
    const isPng = f.type === 'image/png' || /\.png$/i.test(f.name);
    let img;
    try {
      img = isPng ? await out.embedPng(f.bytes) : await out.embedJpg(f.bytes);
    } catch {
      throw new Error(`"${f.name}" could not be embedded — only JPG and PNG images are supported.`);
    }
    const scale = PAGE_W / img.width;
    const w = PAGE_W;
    const h = img.height * scale;
    const page = out.addPage([w, h]);
    page.drawImage(img, { x: 0, y: 0, width: w, height: h });
  }
  return out.save();
}
