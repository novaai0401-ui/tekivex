// Run the site's real PDF engines (src/tools/lib/pdf.ts) against the synthetic
// fixtures in public/examples/tool-tests/ and record what each operation keeps
// and what it drops. The output, public/examples/tool-tests/results.json, is
// the evidence the how-to guides cite. Regenerate it whenever the engines or
// pdf-lib change:
//
//     python scripts/create-tool-test-fixtures.py   # only if fixtures change
//     node scripts/tool-evidence.mjs
//
// This exercises pdf-lib in Node, not a browser. The pdf-lib code paths are the
// same ones the browser runs. Rendering-based tools (Compress, PDF to JPG) are
// not covered here because they need a canvas.

import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef, PDFRawStream, decodePDFRawStream } from 'pdf-lib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = join(ROOT, 'public/examples/tool-tests');

async function loadEngine() {
  const dir = await mkdtemp(join(tmpdir(), 'tekivex-evidence-'));
  const outfile = join(dir, 'pdf.mjs');
  await build({
    entryPoints: [join(ROOT, 'src/tools/lib/pdf.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    logLevel: 'silent',
  });
  const mod = await import(pathToFileURL(outfile).href);
  return { mod, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

const sha = (u8) => createHash('sha256').update(u8).digest('hex').slice(0, 16);
const ab = (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

function countOutline(outlines) {
  let n = 0;
  let item = outlines instanceof PDFDict ? outlines.lookup(PDFName.of('First')) : undefined;
  while (item instanceof PDFDict) {
    n++;
    item = item.lookup(PDFName.of('Next'));
  }
  return n;
}

/** Inspect a PDF for the structures readers care about. */
export async function inspect(bytes) {
  const doc = await PDFDocument.load(bytes);
  const cat = doc.catalog;
  const bookmarks = countOutline(cat.lookup(PDFName.of('Outlines')));
  const acro = cat.lookup(PDFName.of('AcroForm'));
  const fields = acro instanceof PDFDict ? acro.lookup(PDFName.of('Fields')) : undefined;
  const formFields = fields instanceof PDFArray ? fields.size() : 0;

  const pageRefs = new Set(doc.getPages().map((p) => p.ref.toString()));
  const named = cat.lookup(PDFName.of('Dests'));
  const resolveDest = (d) => {
    if (d instanceof PDFArray) {
      const r = d.get(0);
      return r instanceof PDFRef && pageRefs.has(r.toString());
    }
    // Named destination stored in the catalog's /Dests dictionary (ReportLab's form).
    if (d && named instanceof PDFDict) {
      const key = d.toString().replace(/^\//, '').replace(/^\((.*)\)$/, '$1');
      const v = named.lookup(PDFName.of(key));
      if (v instanceof PDFDict) return resolveDest(v.lookup(PDFName.of('D')));
      if (v) return resolveDest(v);
    }
    return false;
  };

  let externalLinks = 0;
  let internalLinks = 0;
  let workingInternalLinks = 0;
  let widgets = 0;
  for (const page of doc.getPages()) {
    const annots = page.node.lookup(PDFName.of('Annots'));
    if (!(annots instanceof PDFArray)) continue;
    for (let i = 0; i < annots.size(); i++) {
      const a = annots.lookup(i);
      if (!(a instanceof PDFDict)) continue;
      const sub = a.lookup(PDFName.of('Subtype'))?.toString();
      if (sub === '/Widget') widgets++;
      if (sub !== '/Link') continue;
      const action = a.lookup(PDFName.of('A'));
      const s = action instanceof PDFDict ? action.lookup(PDFName.of('S'))?.toString() : undefined;
      if (s === '/URI') {
        externalLinks++;
        continue;
      }
      internalLinks++;
      const dest =
        a.lookup(PDFName.of('Dest')) ?? (action instanceof PDFDict ? action.lookup(PDFName.of('D')) : undefined);
      if (dest && resolveDest(dest)) workingInternalLinks++;
    }
  }
  const pages = doc.getPages().map((p) => {
    const { width, height } = p.getSize();
    return { w: Math.round(width), h: Math.round(height), rotate: p.getRotation().angle };
  });
  const contents = doc.getPages().map((p) => {
    const c = p.node.lookup(PDFName.of('Contents'));
    return c?.contents ? sha(c.contents) : null;
  });
  return { pageCount: pages.length, pages, bookmarks, externalLinks, internalLinks, workingInternalLinks, formFields, widgets, contents };
}

/** Does any stream in the file, after decompression, contain `needle`? */
async function containsText(bytes, needle) {
  const doc = await PDFDocument.load(bytes);
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    let data;
    try {
      data = decodePDFRawStream(obj).decode();
    } catch {
      data = obj.contents;
    }
    if (Buffer.from(data).includes(needle)) return true;
  }
  return false;
}

async function attempt(fn) {
  try {
    return { ok: true, value: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * A two-page PDF whose pages share one resource dictionary, the way many
 * real-world producers write files. The image is drawn only on page 2.
 */
export async function sharedResourcesPdf() {
  const doc = await PDFDocument.create();
  const p1 = doc.addPage([200, 200]);
  const p2 = doc.addPage([200, 200]);
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR42mP4z8AAAAMBAQBSLOpjAAAAAElFTkSuQmCC',
    'base64',
  );
  p2.drawImage(await doc.embedPng(png), { x: 0, y: 0, width: 100, height: 100 });
  p1.drawText('kept page');
  p1.node.set(PDFName.of('Resources'), p2.node.Resources());
  return doc.save({ useObjectStreams: false });
}

async function countImages(bytes) {
  const doc = await PDFDocument.load(bytes);
  let n = 0;
  for (const [, o] of doc.context.enumerateIndirectObjects()) {
    if (o instanceof PDFRawStream && o.dict.get(PDFName.of('Subtype'))?.toString() === '/Image') n++;
  }
  return n;
}

/** Run every check with the given engine module. Returns { source, tests }. */
export async function collect(mod) {
  const structured = await readFile(join(FIX, 'structured.pdf'));
  const pwOpen = await readFile(join(FIX, 'structured-password-to-open.pdf'));
  const restricted = await readFile(join(FIX, 'structured-restrictions-only.pdf'));
  const photo = await readFile(join(FIX, 'phone-portrait-exif6.jpg'));
  const shared = Buffer.from(await sharedResourcesPdf());

  const source = await inspect(structured);
  const run = async (label, fn) => {
    const r = await attempt(fn);
    if (!r.ok) return { label, ok: false, error: r.error };
    const out = { label, ok: true, bytes: r.value.byteLength, ...(await inspect(r.value)) };
    Object.defineProperty(out, 'raw', { value: r.value, enumerable: false });
    return out;
  };

  const tests = [];
  tests.push(await run('merge: structured.pdf + structured.pdf', () =>
    mod.mergePdfs([{ name: 'a.pdf', bytes: ab(structured) }, { name: 'b.pdf', bytes: ab(structured) }])));
  tests.push(await run('split: extract pages "1,5" (link source and link target)', () =>
    mod.extractPages(ab(structured), 'structured.pdf', [0, 4])));
  tests.push(await run('delete: remove page 2', () => mod.removePages(ab(structured), 'structured.pdf', [1])));
  tests.push(await run('rotate: 90 degrees, all pages', () => mod.rotatePdf(ab(structured), 'structured.pdf', 90)));
  tests.push(await run('merge: password-to-open PDF', () =>
    mod.mergePdfs([{ name: 'locked.pdf', bytes: ab(pwOpen) }, { name: 'b.pdf', bytes: ab(structured) }])));
  tests.push(await run('merge: restrictions-only PDF (opens without a password)', () =>
    mod.mergePdfs([{ name: 'restricted.pdf', bytes: ab(restricted) }, { name: 'b.pdf', bytes: ab(structured) }])));
  tests.push(await run('jpg-to-pdf: phone portrait photo stored with EXIF orientation 6', () =>
    mod.imagesToPdf([{ name: 'phone-portrait-exif6.jpg', type: 'image/jpeg', bytes: ab(photo) }])));
  tests.push(await run('delete: remove page 2 of a file whose pages share one resource list (image only on page 2)', () =>
    mod.removePages(ab(shared), 'shared.pdf', [1])));
  tests.push(await run('split: extract page 1 of the same shared-resources file', () =>
    mod.extractPages(ab(shared), 'shared.pdf', [0])));

  // Page drawing instructions should survive byte-identical: kept pages are
  // copied, never re-encoded.
  const same = (t, sourceIdx) => t.ok && t.contents.every((h, i) => h === source.contents[sourceIdx[i]]);
  tests[0].contentStreamsUnchanged = same(tests[0], [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5]);
  tests[1].contentStreamsUnchanged = same(tests[1], [0, 4]);
  tests[2].contentStreamsUnchanged = same(tests[2], [0, 2, 3, 4, 5]);
  tests[3].contentStreamsUnchanged = same(tests[3], [0, 1, 2, 3, 4, 5]);
  // A deleted page's text must not linger anywhere in the output file.
  if (tests[2].ok) {
    tests[2].deletedPageTextFound = await containsText(tests[2].raw, 'MARKER-2');
    tests[2].sourceHasDeletedPageText = await containsText(structured, 'MARKER-2');
  }
  // An image used only on a removed page must not stay embedded.
  const imagesInSource = await countImages(shared);
  for (const t of tests.slice(7)) {
    if (!t.ok) continue;
    t.imagesInSource = imagesInSource;
    t.imagesInOutput = await countImages(t.raw);
  }
  for (const t of [source, ...tests]) delete t.contents;
  return { source: { file: 'structured.pdf', ...source }, tests };
}

async function main() {
  const { mod, cleanup } = await loadEngine();
  try {
    const { source, tests } = await collect(mod);
    const pdfLibVersion = JSON.parse(await readFile(join(ROOT, 'node_modules/pdf-lib/package.json'), 'utf8')).version;
    const result = {
      generated: new Date().toISOString().slice(0, 10),
      runtime: `Node ${process.version}`,
      pdfLib: pdfLibVersion,
      engine: 'src/tools/lib/pdf.ts',
      fixtures: 'public/examples/tool-tests/ (synthetic, from scripts/create-tool-test-fixtures.py)',
      source,
      tests,
    };
    await writeFile(join(FIX, 'results.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await cleanup();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
