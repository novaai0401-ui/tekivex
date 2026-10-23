// @vitest-environment node
// The how-to guides quote public/examples/tool-tests/results.json. These tests
// run the real engine against the committed fixtures, so an engine change that
// alters what survives a merge, split or delete fails here until the evidence
// (and the guides that cite it) are regenerated and re-read.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PDFDocument, PDFName, PDFOperator, PDFRawStream } from 'pdf-lib';
import * as engine from '../src/tools/lib/pdf.ts';
import { collect, sharedResourcesPdf } from './tool-evidence.mjs';

const FIX = join(process.cwd(), 'public/examples/tool-tests');
// Copy into this realm's ArrayBuffer; pdf-lib rejects a Node Buffer's store under jsdom.
const load = (name) => Uint8Array.from(readFileSync(join(FIX, name))).buffer;

/** Minimal JPEG header carrying only an EXIF Orientation tag. */
function exifJpeg(orientation, little) {
  const tiff = new DataView(new ArrayBuffer(26));
  tiff.setUint16(0, little ? 0x4949 : 0x4d4d);
  tiff.setUint16(2, 42, little);
  tiff.setUint32(4, 8, little);
  tiff.setUint16(8, 1, little);
  tiff.setUint16(10, 0x0112, little);
  tiff.setUint16(12, 3, little);
  tiff.setUint32(14, 1, little);
  tiff.setUint16(18, orientation, little);
  const app1Len = 2 + 6 + tiff.byteLength;
  const out = new Uint8Array(2 + 2 + app1Len + 2);
  const v = new DataView(out.buffer);
  v.setUint16(0, 0xffd8);
  v.setUint16(2, 0xffe1);
  v.setUint16(4, app1Len);
  out.set([0x45, 0x78, 0x69, 0x66, 0, 0], 6);
  out.set(new Uint8Array(tiff.buffer), 12);
  v.setUint16(out.length - 2, 0xffda);
  return out.buffer;
}

async function imageCount(bytes) {
  const doc = await PDFDocument.load(bytes);
  let n = 0;
  for (const [, o] of doc.context.enumerateIndirectObjects()) {
    if (o instanceof PDFRawStream && o.dict.get(PDFName.of('Subtype'))?.toString() === '/Image') n++;
  }
  return n;
}

describe('jpegOrientation', () => {
  it('reads the tag a phone writes for a portrait photo', () => {
    expect(engine.jpegOrientation(load('phone-portrait-exif6.jpg'))).toBe(6);
  });

  it('reads all eight values in both byte orders', () => {
    for (let o = 1; o <= 8; o++) {
      expect(engine.jpegOrientation(exifJpeg(o, true))).toBe(o);
      expect(engine.jpegOrientation(exifJpeg(o, false))).toBe(o);
    }
  });

  it('falls back to 1 for missing, invalid or non-JPEG input', () => {
    expect(engine.jpegOrientation(exifJpeg(9, true))).toBe(1);
    expect(engine.jpegOrientation(new TextEncoder().encode('not a jpeg').buffer)).toBe(1);
    expect(engine.jpegOrientation(new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0x00]).buffer)).toBe(1);
  });
});

describe('JPG to PDF with phone photos', () => {
  it('turns a portrait photo stored sideways into a portrait page', async () => {
    const out = await engine.imagesToPdf([
      { name: 'phone-portrait-exif6.jpg', type: 'image/jpeg', bytes: load('phone-portrait-exif6.jpg') },
    ]);
    const { width, height } = (await PDFDocument.load(out)).getPage(0).getSize();
    expect(width).toBeCloseTo(595.28, 1);
    expect(height).toBeCloseTo(595.28 * (800 / 600), 1);
  });
});

describe('encrypted PDFs', () => {
  it('rejects both kinds with a message that covers restriction-only files', async () => {
    for (const name of ['structured-password-to-open.pdf', 'structured-restrictions-only.pdf']) {
      await expect(engine.mergePdfs([{ name, bytes: load(name) }])).rejects.toThrow(engine.PdfOpenError);
      await expect(engine.mergePdfs([{ name, bytes: load(name) }])).rejects.toThrow(/restrict copying or editing/);
    }
  });
});

describe('images on removed pages', () => {
  it('are not left embedded when pages share one resource list', async () => {
    const shared = (await sharedResourcesPdf()).slice().buffer;
    expect(await imageCount(shared)).toBe(1);
    expect(await imageCount(await engine.removePages(shared, 's.pdf', [1]))).toBe(0);
    expect(await imageCount(await engine.extractPages(shared, 's.pdf', [0]))).toBe(0);
  });

  it('are kept when the page refers to them with an escaped name', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([200, 200]);
    const png = Uint8Array.from(Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR42mP4z8AAAAMBAQBSLOpjAAAAAElFTkSuQmCC', 'base64'));
    const img = await doc.embedPng(png);
    // Register the image as "Im 1" and draw it as /Im#201, the escaped spelling.
    const xo = doc.context.obj({});
    xo.set(PDFName.of('Im 1'), img.ref);
    page.node.Resources().set(PDFName.of('XObject'), xo);
    page.pushOperators(PDFOperator.of('q'), PDFOperator.of('cm', [100, 0, 0, 100, 0, 0].map((n) => doc.context.obj(n))),
      PDFOperator.of('Do', [PDFName.of('Im 1')]), PDFOperator.of('Q'));
    doc.addPage([200, 200]);
    const bytes = (await doc.save({ useObjectStreams: false })).slice().buffer;
    expect(await imageCount(await engine.removePages(bytes, 'e.pdf', [1]))).toBe(1);
  });

  it('are kept when a kept page draws them', async () => {
    const shared = (await sharedResourcesPdf()).slice().buffer;
    expect(await imageCount(await engine.removePages(shared, 's.pdf', [0]))).toBe(1);
    expect(await imageCount(await engine.extractPages(shared, 's.pdf', [1, 0]))).toBe(1);
  });
});

describe('published evidence', () => {
  it('matches a fresh run of the engine', async () => {
    const published = JSON.parse(readFileSync(join(FIX, 'results.json'), 'utf8'));
    const fresh = await collect(engine);
    const strip = (t) => {
      const { bytes: _bytes, ...rest } = t;
      return rest;
    };
    expect(fresh.source).toEqual(published.source);
    expect(fresh.tests.map(strip)).toEqual(published.tests.map(strip));
  }, 30000);
});
