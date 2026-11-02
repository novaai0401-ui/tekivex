// ─── Tool evidence ───────────────────────────────────────────────────────────
// What each tool did when it was run on published sample files. Every figure
// below is read from the result files in public/examples/, which the scripts
// named there regenerate; nothing here is typed in by hand. Shown on each tool
// page (React) and in its prerendered HTML, so visitors and crawlers see the
// same thing.

import engine from '../../public/examples/tool-tests/results.json';
import compressBrowser from '../../public/examples/tool-tests/compress-browser.json';
import pdfToJpgBrowser from '../../public/examples/tool-tests/pdf-to-jpg-browser.json';
import orientation from '../../public/examples/orientation/results.json';

export interface EvidenceRow { label: string; value: string }
export interface EvidenceImage { src: string; alt: string; width: number; height: number; caption: string }
export interface EvidenceSource { label: string; href: string }
export interface ToolEvidence {
  /** When the measurements were taken, as a readable date. */
  tested: string;
  /** One sentence: what was run, on what. */
  method: string;
  rows: EvidenceRow[];
  image?: EvidenceImage;
  sources: EvidenceSource[];
}

const REPO = 'https://github.com/novaai0401-ui/tekivex/blob/master';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const day = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };
const kb = (bytes: number) => (bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(2)} MB` : `${(bytes / 1000).toFixed(1)} KB`);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

type EngineTest = (typeof engine.tests)[number] & Record<string, unknown>;
const test = (prefix: string): EngineTest => {
  const t = engine.tests.find((x) => x.label.startsWith(prefix));
  if (!t) throw new Error(`tool evidence: no engine result starting "${prefix}"`);
  return t as EngineTest;
};
const src = engine.source;
const sourceBytes = compressBrowser.results.find((r) => r.input === 'tool-tests/structured.pdf')!.inputBytes;
const SAMPLE = `a ${src.pageCount}-page test PDF with ${src.bookmarks} bookmarks, ${plural(src.internalLinks, 'internal link')}, ${plural(src.externalLinks, 'web link')} and ${plural(src.formFields, 'form field')}`;

const engineSources: EvidenceSource[] = [
  { label: 'Sample PDF used', href: '/examples/tool-tests/structured.pdf' },
  { label: 'Raw results (JSON)', href: '/examples/tool-tests/results.json' },
  { label: 'Test script', href: `${REPO}/scripts/tool-evidence.mjs` },
];
const engineMethod = `The tool's own PDF code (pdf-lib ${engine.pdfLib}) was run on ${SAMPLE}.`;
const encrypted = engine.tests.filter((t) => t.label.includes('password-to-open') || t.label.includes('restrictions-only'));
const encryptedRow: EvidenceRow = {
  label: 'Encrypted files',
  value: encrypted.every((t) => !t.ok)
    ? `Both test files were refused with a message, including one that opens without a password but restricts editing (${encrypted.length} of ${encrypted.length}).`
    : 'At least one encrypted test file was accepted; see the raw results.',
};
const kept = (n: number, of: number, what: string) => (n === of ? `kept (${of} of ${of})` : n === 0 ? `dropped (0 of ${of} ${what})` : `${n} of ${of} kept`);

const merge = test('merge: structured.pdf + structured.pdf');
const split = test('split: extract pages');
const splitShared = test('split: extract page 1 of the same shared-resources file');
const del = test('delete: remove page 2');
const delShared = test('delete: remove page 2 of a file whose pages share');
const rotate = test('rotate:');
const jpg = test('jpg-to-pdf:');

const orient = orientation.results;
const wrong = (k: 'before' | 'after') => orient.filter((r) => !r[k].matches_phone_view).length;
const strongImage = compressBrowser.results.find((r) => r.input === 'compression-sample.pdf' && r.level === 'strong')!;
const textOnly = compressBrowser.results.filter((r) => r.input === 'tool-tests/structured.pdf');
const imageHeavy = compressBrowser.results.filter((r) => r.input === 'compression-sample.pdf');
const jpgRuns = pdfToJpgBrowser.results;

export const TOOL_EVIDENCE: Record<string, ToolEvidence> = {
  'merge-pdf': {
    tested: day(engine.generated),
    method: `${engineMethod} The file was merged with a copy of itself.`,
    rows: [
      { label: 'Result', value: `${merge.pageCount} pages, ${kb(merge.bytes as number)}; page content was copied unchanged.` },
      { label: 'Bookmarks', value: kept(merge.bookmarks as number, src.bookmarks * 2, 'bookmarks') },
      { label: 'Internal links', value: `${merge.workingInternalLinks} of ${src.workingInternalLinks * 2} still work` },
      { label: 'Form fields', value: kept(merge.formFields as number, src.formFields * 2, 'fields') },
      encryptedRow,
    ],
    sources: engineSources,
  },
  'split-pdf': {
    tested: day(engine.generated),
    method: `${engineMethod} Pages 1 and 5 were extracted, and a second file whose pages share one image list was split.`,
    rows: [
      { label: 'Result', value: `${split.pageCount} pages, ${kb(split.bytes as number)}` },
      { label: 'Bookmarks', value: kept(split.bookmarks as number, src.bookmarks, 'bookmarks') },
      { label: 'Internal link between the two pages', value: `${split.workingInternalLinks} of ${split.internalLinks} still work` },
      { label: 'Images from pages you did not keep', value: `${splitShared.imagesInOutput} of ${splitShared.imagesInSource} left in the file` },
    ],
    sources: engineSources,
  },
  'remove-pages-pdf': {
    tested: day(engine.generated),
    method: `${engineMethod} Page 2 was deleted, and the same was done on a file whose pages share one image list.`,
    rows: [
      { label: 'Result', value: `${del.pageCount} pages, ${kb(del.bytes as number)}` },
      { label: 'Text of the deleted page', value: del.deletedPageTextFound ? 'still present in the file' : 'not found anywhere in the output file' },
      { label: 'Image used only on the deleted page', value: `${delShared.imagesInOutput} of ${delShared.imagesInSource} left in the file` },
      { label: 'Bookmarks', value: kept(del.bookmarks as number, src.bookmarks, 'bookmarks') },
    ],
    sources: engineSources,
  },
  'rotate-pdf': {
    tested: day(engine.generated),
    method: `${engineMethod} Every page was rotated by 90 degrees.`,
    rows: [
      { label: 'Result', value: `${rotate.pageCount} pages; ${kb(sourceBytes)} became ${kb(rotate.bytes as number)}, because the file is rewritten when saved.` },
      { label: 'Bookmarks', value: kept(rotate.bookmarks as number, src.bookmarks, 'bookmarks') },
      { label: 'Internal links', value: `${rotate.workingInternalLinks} of ${src.workingInternalLinks} still work` },
      { label: 'Form fields', value: kept(rotate.formFields as number, src.formFields, 'fields') },
    ],
    sources: engineSources,
  },
  'jpg-to-pdf': {
    tested: day(engine.generated),
    method: `A ${orientation.test_picture.split(';')[0]} test picture was saved in all ${orient.length} orientations a phone camera can record, converted, and the PDF pages were compared with the upright picture.`,
    rows: [
      { label: 'Pages that came out sideways or flipped before the fix', value: `${wrong('before')} of ${orient.length}` },
      { label: 'After the fix (current tool)', value: `${wrong('after')} of ${orient.length}` },
      { label: 'Real phone portrait photo', value: `${jpg.pageCount} upright page, ${kb(jpg.bytes as number)}, photo not re-compressed` },
    ],
    image: {
      src: '/examples/orientation/comparison.png',
      alt: 'Test picture in several stored orientations next to the upright PDF pages the tool produced from them',
      width: 1090,
      height: 320,
      caption: 'Pages produced from the orientation test pictures, compared with the upright picture.',
    },
    sources: [
      { label: 'Test pictures and results', href: '/examples/orientation/results.json' },
      { label: 'Phone photo used', href: '/examples/tool-tests/phone-portrait-exif6.jpg' },
      { label: 'Test script', href: `${REPO}/scripts/orientation-evidence.py` },
    ],
  },
  'pdf-to-jpg': {
    tested: day(pdfToJpgBrowser.generated),
    method: `The tool's own rendering code was run in ${pdfToJpgBrowser.browser.split(' (')[0]} on two sample PDFs, at the settings the tool uses.`,
    rows: jpgRuns.map((r) => ({
      label: `${r.kind[0].toUpperCase()}${r.kind.slice(1)} page, as ${r.format}`,
      value: `${r.pixels.replace('x', ' × ')} pixels, ${kb(r.bytes)}`,
    })),
    sources: [
      { label: 'Sample PDF used', href: '/examples/compression-sample.pdf' },
      { label: 'Raw results (JSON)', href: '/examples/tool-tests/pdf-to-jpg-browser.json' },
    ],
  },
  'compress-pdf': {
    tested: day(compressBrowser.generated),
    method: `The tool's own compression code was run in ${compressBrowser.browser.split(' (')[0]} at all three settings on an image-heavy page and on a text-only file.`,
    rows: [
      ...imageHeavy.map((r) => ({ label: `Image-heavy page, ${r.level}`, value: `${kb(r.inputBytes)} became ${kb(r.outputBytes)}` })),
      ...textOnly.map((r) => ({ label: `Text-only file, ${r.level}`, value: `${kb(r.inputBytes)} grew to ${kb(r.outputBytes)}` })),
    ],
    image: {
      src: '/examples/compression-strong.png',
      alt: `The image-heavy sample page after Strong compression, ${kb(strongImage.outputBytes)}`,
      width: 778,
      height: 1100,
      caption: `The image-heavy sample page after Strong compression (${kb(strongImage.inputBytes)} became ${kb(strongImage.outputBytes)}).`,
    },
    sources: [
      { label: 'Image-heavy sample PDF', href: '/examples/compression-sample.pdf' },
      { label: 'Raw results (JSON)', href: '/examples/tool-tests/compress-browser.json' },
    ],
  },
  'csv-to-chart': {
    tested: 'October 11, 2026',
    method: "NASA's GISTEMP v4 global temperature record was downloaded unmodified, the annual values for 2001 to 2025 were extracted, and the tool's own SVG export was saved.",
    rows: [
      { label: 'Data', value: '25 annual values, 2001 to 2025, temperature anomaly versus the 1951–1980 average' },
      { label: 'What the test found', value: 'Year was plotted as data instead of used as labels; the label-column choice was fixed.' },
    ],
    image: {
      src: '/examples/global-temperature-2001-2025.svg',
      alt: 'Line chart of global temperature anomaly from 2001 to 2025, exported by CSV to Chart from NASA GISTEMP data',
      width: 760,
      height: 400,
      caption: 'The chart CSV to Chart exported from the NASA GISTEMP extract.',
    },
    sources: [
      { label: 'Unmodified NASA download', href: '/examples/gistemp-glb-2026-10-11.csv' },
      { label: '25-row extract', href: '/examples/global-temperature-2001-2025.csv' },
      { label: 'NASA GISTEMP', href: 'https://data.giss.nasa.gov/gistemp/' },
    ],
  },
};
