// What document metadata survives the Tekivex PDF tools?
//
// Builds a 3-page PDF whose Info dictionary and XMP packet name an author, the
// software that made it and its dates, then runs the tools' own code
// (src/tools/lib/pdf.ts) for merge, extract, rotate, delete and JPG to PDF,
// and records which details each output still carries. For JPG to PDF the
// input is public/examples/metadata/photo-with-gps.jpg
// (scripts/create-metadata-fixtures.py), whose EXIF block holds a camera
// model and GPS position; the embedded image is saved next to the results so
// its EXIF can be read back with any EXIF tool.
//
// Usage: node scripts/metadata-evidence.mjs   (writes public/examples/metadata/)
import { build } from 'esbuild';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PDFDocument, PDFName, PDFRawStream, PDFDict, StandardFonts, decodePDFRawStream } from 'pdf-lib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/examples/metadata');
const AUTHOR = 'Priya Example';
const XMP = `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/"><dc:creator><rdf:Seq><rdf:li>${AUTHOR}</rdf:li></rdf:Seq></dc:creator><xmp:CreatorTool>Example Word Processor 2026</xmp:CreatorTool></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;

async function loadEngine() {
  const dir = await mkdtemp(join(tmpdir(), 'tekivex-meta-'));
  const outfile = join(dir, 'pdf.mjs');
  await build({ entryPoints: [join(ROOT, 'src/tools/lib/pdf.ts')], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'silent' });
  return { mod: await import(pathToFileURL(outfile).href), cleanup: () => rm(dir, { recursive: true, force: true }) };
}
const ab = (u8) => u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);

export async function sourcePdf() {
  const doc = await PDFDocument.create({ updateMetadata: false });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= 3; i++) doc.addPage([595, 842]).drawText(`Metadata test page ${i}`, { x: 60, y: 760, size: 18, font });
  doc.setTitle('Q3 salary review');
  doc.setAuthor(AUTHOR);
  doc.setSubject('Internal draft');
  doc.setKeywords(['salary', 'confidential']);
  doc.setCreator('Example Word Processor 2026');
  doc.setProducer('Example PDF Writer 3.1');
  doc.setCreationDate(new Date('2026-01-15T10:00:00Z'));
  doc.setModificationDate(new Date('2026-01-16T12:30:00Z'));
  const xmp = doc.context.flateStream(XMP, { Type: 'Metadata', Subtype: 'XML' });
  doc.catalog.set(PDFName.of('Metadata'), doc.context.register(xmp));
  return doc.save({ useObjectStreams: false });
}

/** Every stream decoded, plus the raw file, as one string to search. */
function allText(doc, bytes) {
  let s = Buffer.from(bytes).toString('latin1');
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream) { try { s += Buffer.from(decodePDFRawStream(obj).decode()).toString('latin1'); } catch {} }
  }
  return s;
}

export async function inspect(bytes) {
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const text = allText(doc, bytes);
  return {
    pages: doc.getPageCount(),
    info: {
      title: doc.getTitle() ?? null, author: doc.getAuthor() ?? null, subject: doc.getSubject() ?? null,
      keywords: doc.getKeywords() ?? null, creator: doc.getCreator() ?? null, producer: doc.getProducer() ?? null,
      created: doc.getCreationDate()?.toISOString() ?? null, modified: doc.getModificationDate()?.toISOString() ?? null,
    },
    xmpPacket: doc.catalog.has(PDFName.of('Metadata')),
    authorNameAnywhere: text.includes(AUTHOR),
    cameraModelAnywhere: text.includes('TestCam Phone 12'),
    gpsBlockAnywhere: text.includes('TestCam') && /\x88\x25/.test(text),
  };
}

function firstImage(doc) {
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream && obj.dict.get(PDFName.of('Subtype'))?.toString() === '/Image') return obj.contents;
  }
  return null;
}

async function main() {
  const { mod, cleanup } = await loadEngine();
  try {
    const src = await sourcePdf();
    await writeFile(join(OUT, 'document-with-metadata.pdf'), src);
    const photo = await readFile(join(OUT, 'photo-with-gps.jpg'));
    const runs = {
      'source file': src,
      'merge: file + copy of itself': await mod.mergePdfs([{ name: 'a.pdf', bytes: ab(src) }, { name: 'b.pdf', bytes: ab(src) }]),
      'split: extract page 1': await mod.extractPages(ab(src), 'a.pdf', [0]),
      'delete: remove page 2': await mod.removePages(ab(src), 'a.pdf', [1]),
      'rotate: 90 degrees, all pages': await mod.rotatePdf(ab(src), 'a.pdf', 90),
      'jpg-to-pdf: photo-with-gps.jpg': await mod.imagesToPdf([{ name: 'photo-with-gps.jpg', type: 'image/jpeg', bytes: ab(photo) }]),
    };
    const results = {};
    for (const [label, bytes] of Object.entries(runs)) results[label] = await inspect(bytes);
    const jpgDoc = await PDFDocument.load(runs['jpg-to-pdf: photo-with-gps.jpg']);
    const embedded = firstImage(jpgDoc);
    await writeFile(join(OUT, 'embedded-image-from-jpg-to-pdf.jpg'), embedded);
    results['jpg-to-pdf: photo-with-gps.jpg'].embeddedImageIdenticalToInput = Buffer.compare(Buffer.from(embedded), photo) === 0;
    const pkg = JSON.parse(await readFile(join(ROOT, 'node_modules/pdf-lib/package.json'), 'utf8'));
    const out = { generated: new Date().toISOString().slice(0, 10), pdfLib: pkg.version, generatedBy: 'scripts/metadata-evidence.mjs', results };
    await writeFile(join(OUT, 'results.json'), JSON.stringify(out, null, 2) + '\n');
    console.log(JSON.stringify(out, null, 2));
  } finally { await cleanup(); }
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
