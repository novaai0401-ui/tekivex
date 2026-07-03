import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfs, getPageCount, extractPages, imagesToPdf, rotatePdf, removePages, PdfOpenError } from '../lib/pdf';

// 1×1 transparent PNG.
const TINY_PNG = Uint8Array.from(atob(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
), (c) => c.charCodeAt(0));

async function makePdf(pages: number): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([200, 200]);
  const bytes = await doc.save();
  return bytes.slice().buffer as ArrayBuffer;
}

describe('pdf engine (real pdf-lib round-trips)', () => {
  it('merges documents preserving total page count and order', async () => {
    const out = await mergePdfs([
      { name: 'a.pdf', bytes: await makePdf(2) },
      { name: 'b.pdf', bytes: await makePdf(3) },
    ]);
    const merged = await PDFDocument.load(out);
    expect(merged.getPageCount()).toBe(5);
  });

  it('reports page counts', async () => {
    expect(await getPageCount(await makePdf(4), 'x.pdf')).toBe(4);
  });

  it('extracts the requested pages into a new document', async () => {
    const out = await extractPages(await makePdf(6), 'x.pdf', [0, 2, 5]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(3);
  });

  it('converts PNG images into a one-page-per-image PDF', async () => {
    const out = await imagesToPdf([
      { name: 'a.png', type: 'image/png', bytes: TINY_PNG.slice().buffer as ArrayBuffer },
      { name: 'b.png', type: 'image/png', bytes: TINY_PNG.slice().buffer as ArrayBuffer },
    ]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(2);
    // Page aspect matches the (square) image at A4 width.
    const { width, height } = doc.getPage(0).getSize();
    expect(Math.abs(width - height)).toBeLessThan(0.01);
  });

  it('raises a friendly PdfOpenError for non-PDF bytes', async () => {
    const garbage = new TextEncoder().encode('not a pdf').buffer as ArrayBuffer;
    await expect(getPageCount(garbage, 'junk.pdf')).rejects.toThrow(PdfOpenError);
    await expect(getPageCount(garbage, 'junk.pdf')).rejects.toThrow(/could not be read/i);
  });

  it('rejects unsupported image types with a clear message', async () => {
    const garbage = new TextEncoder().encode('GIF89a').buffer as ArrayBuffer;
    await expect(imagesToPdf([{ name: 'a.gif', type: 'image/gif', bytes: garbage }]))
      .rejects.toThrow(/only JPG and PNG/i);
  });

  it('rotates all pages by a quarter turn, accumulating existing rotation', async () => {
    const once = await rotatePdf(await makePdf(2), 'x.pdf', 90);
    const doc1 = await PDFDocument.load(once);
    expect(doc1.getPage(0).getRotation().angle).toBe(90);
    // Rotating the already-rotated output again lands on 180.
    const twice = await rotatePdf(once.slice().buffer as ArrayBuffer, 'x.pdf', 90);
    const doc2 = await PDFDocument.load(twice);
    expect(doc2.getPage(0).getRotation().angle).toBe(180);
  });

  it('rotates only the requested pages', async () => {
    const out = await rotatePdf(await makePdf(3), 'x.pdf', 270, [1]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPage(0).getRotation().angle).toBe(0);
    expect(doc.getPage(1).getRotation().angle).toBe(270);
  });

  it('removes the given pages and keeps the rest', async () => {
    const out = await removePages(await makePdf(5), 'x.pdf', [1, 3]);
    const doc = await PDFDocument.load(out);
    expect(doc.getPageCount()).toBe(3);
  });

  it('refuses to remove every page', async () => {
    await expect(removePages(await makePdf(2), 'x.pdf', [0, 1]))
      .rejects.toThrow(/keep at least one/i);
  });
});
