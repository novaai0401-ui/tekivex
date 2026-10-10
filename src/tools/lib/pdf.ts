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
        ? `"${filename}" is encrypted. That covers password-protected files and also files that open without a password but restrict copying or editing. Save an unencrypted copy first, then try again.`
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

type PdfLib = Awaited<ReturnType<typeof pdfLib>>;
type PdfDoc = Awaited<ReturnType<PdfLib['PDFDocument']['create']>>;

/**
 * Many PDFs give every page one shared resource dictionary listing every
 * image in the document. Copying a page copies that whole dictionary, so an
 * image that appeared only on a page the visitor removed would still be
 * embedded, invisibly, in the output. Give each page its own list containing
 * only the images and drawings its content actually uses, then drop every
 * object nothing points to any more.
 *
 * Conservative: if a page's content cannot be decoded, it is left as is.
 */
function pruneUnusedImages(lib: PdfLib, doc: PdfDoc): void {
  const { PDFName, PDFDict, PDFArray, PDFRef, PDFRawStream, PDFStream, decodePDFRawStream } = lib;
  const ctx = doc.context;
  for (const page of doc.getPages()) {
    const resources = page.node.Resources();
    const xobjects = resources?.lookup(PDFName.of('XObject'));
    if (!resources || !(xobjects instanceof PDFDict)) continue;
    let content = '';
    try {
      const c = page.node.lookup(PDFName.of('Contents'));
      const streams = c instanceof PDFArray ? c.asArray().map((x) => ctx.lookup(x)) : [c];
      for (const st of streams) {
        if (st instanceof PDFRawStream) content += new TextDecoder('latin1').decode(decodePDFRawStream(st).decode()) + '\n';
        else if (st instanceof PDFStream) content += new TextDecoder('latin1').decode(st.getContents()) + '\n';
        else if (st !== undefined) throw new Error('unreadable content');
      }
    } catch {
      continue;
    }
    const used = new Set<string>();
    for (const m of content.matchAll(/\/([^\s/<>[\]()%{}]+)\s+Do\b/g)) {
      // Names may use #xx escapes; compare in decoded form, as decodeText() returns.
      used.add(m[1]!.replace(/#([0-9a-fA-F]{2})/g, (_, h: string) => String.fromCharCode(parseInt(h, 16))));
    }
    const kept = PDFDict.withContext(ctx);
    for (const [key, value] of xobjects.entries()) {
      if (used.has(key.decodeText())) kept.set(key, value);
    }
    const own = resources.clone(ctx);
    own.set(PDFName.of('XObject'), kept);
    page.node.set(PDFName.of('Resources'), own);
  }

  // Sweep: keep only objects reachable from the document catalog and info dictionary.
  const reachable = new Set<string>();
  const queue: unknown[] = [ctx.trailerInfo.Root, ctx.trailerInfo.Info];
  while (queue.length) {
    const obj = queue.pop();
    if (obj instanceof PDFRef) {
      const key = obj.toString();
      if (reachable.has(key)) continue;
      reachable.add(key);
      queue.push(ctx.lookup(obj));
    } else if (obj instanceof PDFDict) {
      for (const [, v] of obj.entries()) queue.push(v);
    } else if (obj instanceof PDFArray) {
      queue.push(...obj.asArray());
    } else if (obj instanceof PDFStream) {
      queue.push(obj.dict);
    }
  }
  for (const [ref] of ctx.enumerateIndirectObjects()) {
    if (!reachable.has(ref.toString())) ctx.delete(ref);
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
    pruneUnusedImages(lib, out);
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
    pruneUnusedImages(lib, out);
    return out.save();
  });
}

/**
 * Read the EXIF Orientation tag (1-8) from JPEG bytes. Phones usually store a
 * portrait photo as landscape pixels plus this tag; galleries and browsers
 * honour it, PDF viewers never see it. Returns 1 when absent or unreadable.
 */
export function jpegOrientation(bytes: ArrayBuffer): number {
  const v = new DataView(bytes);
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 1;
  let off = 2;
  while (off + 4 <= v.byteLength) {
    const marker = v.getUint16(off);
    if ((marker & 0xff00) !== 0xff00) return 1;
    const len = v.getUint16(off + 2);
    if (marker === 0xffda) return 1; // start of scan: no EXIF before the image data
    if (marker === 0xffe1 && off + 10 <= v.byteLength && v.getUint32(off + 4) === 0x45786966) {
      const tiff = off + 10; // after "Exif header"
      if (tiff + 8 > v.byteLength) return 1;
      const little = v.getUint16(tiff) === 0x4949;
      const u16 = (o: number) => v.getUint16(o, little);
      const u32 = (o: number) => v.getUint32(o, little);
      const ifd = tiff + u32(tiff + 4);
      if (ifd + 2 > v.byteLength) return 1;
      const entries = u16(ifd);
      for (let i = 0; i < entries; i++) {
        const e = ifd + 2 + i * 12;
        if (e + 12 > v.byteLength) return 1;
        if (u16(e) === 0x0112) {
          const o = u16(e + 8);
          return o >= 1 && o <= 8 ? o : 1;
        }
      }
      return 1;
    }
    off += 2 + len;
  }
  return 1;
}

/**
 * Matrix [a b c d e f] mapping the image's unit square onto a page of the
 * displayed size, so the original JPEG bytes are placed upright without being
 * decoded or re-encoded. Derived per EXIF orientation (TIFF 6.0 / EXIF 2.32).
 */
function orientationMatrix(o: number, w: number, h: number): [number, number, number, number, number, number] {
  switch (o) {
    case 2: return [-w, 0, 0, h, w, 0];
    case 3: return [-w, 0, 0, -h, w, h];
    case 4: return [w, 0, 0, -h, 0, h];
    case 5: return [0, -h, -w, 0, w, h];
    case 6: return [0, -h, w, 0, 0, h];
    case 7: return [0, h, w, 0, 0, 0];
    case 8: return [0, h, -w, 0, w, 0];
    default: return [w, 0, 0, h, 0, 0];
  }
}

/**
 * One image per page; the page matches the image's displayed aspect ratio at
 * A4 width. JPEG orientation tags are honoured, so a portrait phone photo
 * produces a portrait page, not a sideways one.
 */
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
    const orientation = isPng ? 1 : jpegOrientation(f.bytes);
    const sideways = orientation >= 5;
    const dispW = sideways ? img.height : img.width;
    const dispH = sideways ? img.width : img.height;
    const w = PAGE_W;
    const h = dispH * (PAGE_W / dispW);
    const page = out.addPage([w, h]);
    if (orientation === 1) {
      page.drawImage(img, { x: 0, y: 0, width: w, height: h });
    } else {
      const name = page.node.newXObject('Image', img.ref);
      page.pushOperators(
        lib.pushGraphicsState(),
        lib.concatTransformationMatrix(...orientationMatrix(orientation, w, h)),
        lib.drawObject(name),
        lib.popGraphicsState(),
      );
    }
  }
  return out.save();
}
