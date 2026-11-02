// @vitest-environment node
// The draft guide on PDF metadata quotes public/examples/metadata/results.json.
// These tests run the real engine on the committed fixtures, so a change that
// lets photo location data back into JPG to PDF output fails here.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PDFDocument, PDFName, PDFRawStream } from 'pdf-lib';
import * as engine from '../src/tools/lib/pdf.ts';

const FIX = join(process.cwd(), 'public/examples');
const load = (name) => Uint8Array.from(readFileSync(join(FIX, name))).buffer;
const has = (u8, ascii) => Buffer.from(u8).includes(Buffer.from(ascii, 'latin1'));

async function embeddedJpeg(pdfBytes) {
  const doc = await PDFDocument.load(pdfBytes);
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream && obj.dict.get(PDFName.of('Subtype'))?.toString() === '/Image') return obj.contents;
  }
  throw new Error('no image in output');
}

describe('JPG to PDF removes photo metadata', () => {
  it('drops the camera model and GPS block but keeps the image data byte for byte', async () => {
    const photo = load('metadata/photo-with-gps.jpg');
    expect(has(new Uint8Array(photo), 'TestCam Phone 12')).toBe(true);
    const img = await embeddedJpeg(await engine.imagesToPdf([{ name: 'p.jpg', type: 'image/jpeg', bytes: photo }]));
    expect(has(img, 'Exif\0\0')).toBe(false);
    expect(has(img, 'TestCam')).toBe(false);
    const sos = (u8) => { for (let i = 2; i < u8.length - 1; i++) if (u8[i] === 0xff && u8[i + 1] === 0xda) return i; return -1; };
    const src = new Uint8Array(photo);
    expect(Buffer.from(img.slice(sos(img))).equals(Buffer.from(src.slice(sos(src))))).toBe(true);
  });

  it('still places a portrait phone photo upright after removing its EXIF block', async () => {
    const photo = load('tool-tests/phone-portrait-exif6.jpg');
    expect(engine.jpegOrientation(photo)).toBe(6);
    const doc = await PDFDocument.load(await engine.imagesToPdf([{ name: 'p.jpg', type: 'image/jpeg', bytes: photo }]));
    const { width, height } = doc.getPage(0).getSize();
    expect(height).toBeGreaterThan(width);
  });

  it('returns input it cannot parse unchanged', () => {
    const junk = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    expect(engine.stripJpegMetadata(junk)).toBe(junk);
  });
});
