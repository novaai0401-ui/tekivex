// ─── Free in-browser tools registry ──────────────────────────────────────────
// Single source of truth for the /tools hub. Every tool runs entirely
// client-side — files are processed in the visitor's browser and never
// uploaded — which is the privacy promise the whole hub is built on.
//
// Consumed by the React app (ToolsHub, ToolPage, App routing, seoConfig) and
// by scripts/prerender.mjs (bundled with esbuild) so crawlers see the same
// titles, descriptions, steps, and FAQs the app renders.

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolStep {
  title: string;
  body: string;
}

export interface ToolMeta {
  /** URL slug — the tool lives at /tools/<slug>. */
  slug: string;
  /** Display name used in cards and the page H1. */
  name: string;
  /** One-line card blurb. */
  short: string;
  /** Longer on-page intro paragraph (also the meta description base). */
  description: string;
  /** <title> tag value. */
  seoTitle: string;
  /** <meta name="description"> value. */
  seoDescription: string;
  keywords: string[];
  /** Icon name from src/icons/paths.ts. */
  iconName: string;
  /** Accent color for the card. */
  color: string;
  /** "How it works" steps rendered on the page (and prerendered for crawlers). */
  steps: ToolStep[];
  /** Real questions with honest answers — rendered + FAQPage JSON-LD. */
  faqs: ToolFaq[];
  /** Honest limitations shown on the page. */
  limitations: string[];
  /** Slug of the in-depth how-to guide in /use-cases (optional). */
  guideSlug?: string;
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'merge-pdf',
    guideSlug: 'how-to-merge-pdf-free',
    name: 'Merge PDF',
    short: 'Combine several PDFs into one file — private, in your browser.',
    description:
      'Combine two or more PDF files into a single document. Everything runs in your ' +
      'browser: the files are never uploaded to a server, there is no file-size quota ' +
      'from us (only your device’s memory), no watermark, and no account.',
    seoTitle: 'Merge PDF Files Online — Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Combine PDF files into one document for free. 100% private: files are processed in ' +
      'your browser and never uploaded. No watermark, no signup, no file limit.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger online free', 'merge pdf without upload', 'private pdf merger'],
    iconName: 'file-pdf',
    color: '#ef4444',
    steps: [
      { title: 'Add your PDFs', body: 'Drop two or more PDF files onto the page, or pick them with the file browser. They are read locally — nothing leaves your device.' },
      { title: 'Order them', body: 'Drag the files into the order you want them to appear in the combined document.' },
      { title: 'Merge and download', body: 'Click Merge. The combined PDF is assembled in your browser and downloads straight to your device.' },
    ],
    faqs: [
      { q: 'Are my files uploaded to a server?', a: 'No. The merge happens entirely in your browser using client-side code. Your PDFs never leave your device, which also means there is nothing for us to store, scan, or delete afterwards.' },
      { q: 'Is there a file-size or page limit?', a: 'We impose none. The practical limit is your device’s memory — merging very large PDFs on a low-memory phone can fail, in which case try it on a desktop browser.' },
      { q: 'Does it add a watermark or require an account?', a: 'No watermark, no account, no email. The tool is free and supported by the ads on this page.' },
      { q: 'Are password-protected PDFs supported?', a: 'Encrypted PDFs cannot be merged directly. Remove the password first (you need to know it), or use the full Pyntra editor, which can open encrypted PDFs.' },
    ],
    limitations: [
      'Encrypted (password-protected) PDFs must be unlocked before merging.',
      'Very large files are bounded by your device’s memory, since everything runs locally.',
    ],
  },
  {
    slug: 'split-pdf',
    guideSlug: 'how-to-split-pdf-extract-pages',
    name: 'Split PDF',
    short: 'Extract pages or page ranges from a PDF into a new file.',
    description:
      'Pull specific pages out of a PDF — a single page, a range like 2-5, or any ' +
      'combination like 1,3,7-9 — into a new document. Runs fully in your browser; ' +
      'the file is never uploaded.',
    seoTitle: 'Split PDF — Extract Pages Online, Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Extract pages or page ranges from a PDF for free. 100% private: processing happens in ' +
      'your browser, the file is never uploaded. No watermark, no signup.',
    keywords: ['split pdf', 'extract pages from pdf', 'pdf page extractor', 'split pdf online free', 'remove pages from pdf', 'pdf splitter no upload'],
    iconName: 'file-pdf',
    color: '#f97316',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page or pick it with the file browser. It is read locally in your browser.' },
      { title: 'Choose pages', body: 'Type the pages to keep — for example "1,3,7-9" or "2-5". The page count is shown so you know the valid range.' },
      { title: 'Split and download', body: 'Click Extract. A new PDF containing only those pages is built in your browser and downloaded.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded anywhere?', a: 'No. Page extraction runs entirely in your browser. The file never leaves your device.' },
      { q: 'What page syntax is supported?', a: 'Comma-separated single pages and ranges, in any order: "3", "2-5", "1,3,7-9", or "9-7" to reverse a range. Pages outside the document are reported as errors rather than silently dropped.' },
      { q: 'Can I split one PDF into many files at once?', a: 'This tool produces one output per extraction. To produce several files, run it once per page set — each run takes seconds since nothing is uploaded.' },
    ],
    limitations: [
      'Encrypted PDFs must be unlocked before splitting.',
      'One output file per run — repeat the extraction for multiple outputs.',
    ],
  },
  {
    slug: 'jpg-to-pdf',
    guideSlug: 'how-to-convert-jpg-to-pdf',
    name: 'JPG to PDF',
    short: 'Turn JPG and PNG images into a single PDF document.',
    description:
      'Convert one or more JPG or PNG images into a single PDF, one image per page, ' +
      'with sensible page sizing. Conversion happens in your browser — photos are ' +
      'never uploaded, which matters when they are scans of documents or IDs.',
    seoTitle: 'JPG to PDF Converter — Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Convert JPG and PNG images to a single PDF for free. 100% private: images are converted ' +
      'in your browser and never uploaded. No watermark, no signup.',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'convert photos to pdf', 'jpg to pdf without upload', 'scan to pdf private'],
    iconName: 'file-pdf',
    color: '#06b6d4',
    steps: [
      { title: 'Add your images', body: 'Drop JPG or PNG files onto the page. They are read locally — useful for scans, receipts, and IDs you would rather not upload anywhere.' },
      { title: 'Order the pages', body: 'Drag the images into the order you want. Each image becomes one PDF page sized to fit it.' },
      { title: 'Convert and download', body: 'Click Convert. The PDF is assembled in your browser and downloads immediately.' },
    ],
    faqs: [
      { q: 'Are my photos uploaded?', a: 'No. The conversion runs client-side in your browser. For sensitive scans (IDs, medical or financial documents) this is the whole point — the image never touches a server.' },
      { q: 'Which image formats work?', a: 'JPG/JPEG and PNG. Other formats (HEIC, WebP, TIFF) need converting to JPG or PNG first — most phones can export HEIC photos as JPG.' },
      { q: 'How are page sizes chosen?', a: 'Each PDF page matches its image’s aspect ratio at a printable size, so nothing is cropped or stretched.' },
    ],
    limitations: [
      'HEIC, WebP, and TIFF are not supported directly — export them as JPG or PNG first.',
      'Very large photo batches are bounded by your device’s memory.',
    ],
  },
  {
    slug: 'compress-pdf',
    guideSlug: 'how-to-compress-pdf',
    name: 'Compress PDF',
    short: 'Shrink scanned or image-heavy PDFs to a smaller file size.',
    description:
      'Reduce a PDF’s file size by re-rendering its pages as optimised images, at a ' +
      'quality level you choose. Best suited to scanned or image-heavy PDFs, where it ' +
      'can cut the size dramatically. Runs fully in your browser — the file is never uploaded.',
    seoTitle: 'Compress PDF Online — Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Shrink scanned and image-heavy PDFs for free, at a quality level you choose. 100% private: ' +
      'compression runs in your browser, the file is never uploaded.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor online free', 'compress pdf without upload', 'make pdf smaller'],
    iconName: 'file-pdf',
    color: '#8b5cf6',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page. It is read locally in your browser.' },
      { title: 'Pick a quality level', body: 'Choose High, Balanced, or Strong compression. Stronger settings produce smaller files with softer image quality.' },
      { title: 'Compress and download', body: 'Click Compress. Each page is re-rendered and re-packed in your browser, and you see the before/after size before downloading.' },
    ],
    faqs: [
      { q: 'How does the compression work?', a: 'Each page is re-rendered as an optimised JPEG image and re-packed into a new PDF. That is why it works so well on scans — and why text in the output is no longer selectable. If you need selectable text, keep the original alongside the compressed copy.' },
      { q: 'Will it always make my PDF smaller?', a: 'No — and we show you the before/after size instead of pretending. Text-only PDFs are already compact and can even get bigger when rasterised; the tool warns you when the result is not smaller.' },
      { q: 'Is my PDF uploaded?', a: 'No. Rendering and re-packing run entirely in your browser.' },
    ],
    limitations: [
      'Output pages are images — text becomes non-selectable and non-searchable.',
      'Text-only PDFs may not shrink (the tool tells you instead of silently delivering a bigger file).',
      'Encrypted PDFs must be unlocked first.',
    ],
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    short: 'Turn each page of a PDF into a downloadable image.',
    description:
      'Convert a PDF into images — one JPG (or PNG) per page — that you can download ' +
      'individually or all at once. Each page is rendered in your browser, so the PDF ' +
      'is never uploaded to a server.',
    seoTitle: 'PDF to JPG — Convert PDF Pages to Images, Free & Private | Tekivex Tools',
    seoDescription:
      'Convert PDF pages to JPG or PNG images for free. 100% private: each page is rendered in ' +
      'your browser and never uploaded. No watermark, no signup.',
    keywords: ['pdf to jpg', 'pdf to image', 'pdf to png', 'convert pdf to jpg free', 'pdf to jpg without upload', 'extract images from pdf'],
    iconName: 'file-pdf',
    color: '#0ea5e9',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page. Each page is rendered to an image locally in your browser.' },
      { title: 'Pick a format', body: 'Choose JPG (smaller, best for photos and scans) or PNG (lossless, best for text and diagrams).' },
      { title: 'Download', body: 'Save any single page, or use “Download all” to grab every page image at once.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded?', a: 'No. Every page is rendered to an image in your browser using client-side code — the PDF never leaves your device.' },
      { q: 'JPG or PNG — which should I choose?', a: 'JPG makes smaller files and suits scans and photos. PNG is lossless and keeps text and line art crisp, at a larger file size.' },
      { q: 'Why does each page download separately?', a: 'To avoid bundling a heavyweight ZIP library into the page, each image downloads on its own. “Download all” triggers them in sequence — your browser may ask permission to download multiple files the first time.' },
    ],
    limitations: [
      'Rendered images are pictures of the pages — the text in them is not selectable.',
      'Each page downloads as its own file (no ZIP), so very large PDFs mean many downloads.',
      'Encrypted PDFs must be unlocked first.',
    ],
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    short: 'Rotate the pages of a PDF and save the result.',
    description:
      'Fix a sideways or upside-down PDF by rotating its pages 90°, 180°, or 270°, then ' +
      'download the corrected file. Rotation happens in your browser — the PDF is never uploaded.',
    seoTitle: 'Rotate PDF — Free & Private, No Upload | Tekivex Tools',
    seoDescription:
      'Rotate PDF pages 90, 180, or 270 degrees and download the fixed file, free. 100% private: ' +
      'the PDF is rotated in your browser and never uploaded.',
    keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf sideways', 'fix pdf orientation', 'rotate pdf free', 'rotate pdf without upload'],
    iconName: 'file-pdf',
    color: '#14b8a6',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page. It is read locally in your browser.' },
      { title: 'Choose a rotation', body: 'Rotate every page 90° left, 90° right, or 180°. The rotation adds to any the pages already have.' },
      { title: 'Download', body: 'Click Rotate & download to save the corrected PDF to your device.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded?', a: 'No. The rotation is applied in your browser with client-side code; the file never leaves your device.' },
      { q: 'Does rotating lose quality?', a: 'No. Rotation only changes each page’s orientation flag — the underlying text and images are untouched, so there is no quality loss.' },
      { q: 'Can I rotate just one page?', a: 'This tool rotates all pages together. To rotate a single page, first extract it with Split PDF, rotate that, then Merge it back if needed.' },
    ],
    limitations: [
      'Rotation is applied to all pages at once.',
      'Encrypted PDFs must be unlocked first.',
    ],
  },
  {
    slug: 'remove-pages-pdf',
    name: 'Delete PDF Pages',
    short: 'Remove unwanted pages from a PDF and keep the rest.',
    description:
      'Delete specific pages from a PDF — a single page, a range like 2-5, or a mix like ' +
      '1,4,9 — and download the trimmed document. Everything runs in your browser; the file ' +
      'is never uploaded.',
    seoTitle: 'Delete Pages from a PDF — Free & Private, No Upload | Tekivex Tools',
    seoDescription:
      'Remove pages from a PDF for free and download the trimmed file. 100% private: processing ' +
      'happens in your browser, the PDF is never uploaded. No watermark, no signup.',
    keywords: ['delete pages from pdf', 'remove pages from pdf', 'delete pdf pages free', 'remove page from pdf without upload', 'trim pdf pages'],
    iconName: 'file-pdf',
    color: '#f43f5e',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page. The page count is shown so you know the valid range.' },
      { title: 'Type the pages to remove', body: 'Enter the pages to delete — for example “1,4,9” or “2-5”. Everything else is kept.' },
      { title: 'Remove and download', body: 'Click Remove pages. A new PDF without those pages is built in your browser and downloaded.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded?', a: 'No. Page removal runs entirely in your browser — the file never leaves your device.' },
      { q: 'What page syntax is supported?', a: 'Comma-separated single pages and ranges: “3”, “2-5”, or “1,4,9”. Pages outside the document are reported as errors rather than ignored.' },
      { q: 'What if I remove every page?', a: 'The tool refuses that and tells you — a PDF must keep at least one page.' },
    ],
    limitations: [
      'At least one page must remain.',
      'Encrypted PDFs must be unlocked first.',
    ],
  },
  {
    slug: 'csv-to-chart',
    guideSlug: 'how-to-make-chart-from-csv',
    name: 'CSV to Chart',
    short: 'Paste or drop a CSV and get a clean, downloadable chart.',
    description:
      'Turn a CSV file into a presentable chart — bar, line, area, or donut — in ' +
      'seconds, then download it as SVG or PNG for slides and documents. Your data ' +
      'is parsed in the browser and never uploaded.',
    seoTitle: 'CSV to Chart — Free Online Chart Maker, Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Make a bar, line, area, or donut chart from a CSV for free and download it as SVG or PNG. ' +
      '100% private: your data is parsed in the browser and never uploaded.',
    keywords: ['csv to chart', 'chart maker online free', 'csv to graph', 'make a chart from csv', 'csv visualizer', 'chart generator no signup'],
    iconName: 'bar-chart',
    color: '#3b82f6',
    steps: [
      { title: 'Add your CSV', body: 'Drop a .csv file or paste CSV text. The first row is treated as headers; your data stays in the browser.' },
      { title: 'Pick columns and a chart type', body: 'Choose the label column and one or more numeric columns, then switch between bar, line, area, and donut to see what reads best.' },
      { title: 'Download', body: 'Export the chart as a crisp SVG (scales to any size) or a PNG for quick pasting into slides and docs.' },
    ],
    faqs: [
      { q: 'Is my data uploaded?', a: 'No. The CSV is parsed and charted entirely in your browser — nothing is sent to a server, so it is safe for internal or confidential numbers.' },
      { q: 'What CSV format is expected?', a: 'A header row followed by data rows, comma-separated, with standard double-quote escaping. The first text-like column is suggested as labels and numeric columns as series, but you can change both.' },
      { q: 'Why does the donut fold small slices into "Other"?', a: 'Beyond eight slices a donut stops being readable, so smaller slices are grouped into an "Other" slice. Switch to a bar chart when you need every category visible.' },
      { q: 'SVG or PNG — which should I download?', a: 'SVG stays sharp at any size and is ideal for slides and print. PNG is a fixed-size image that pastes anywhere.' },
    ],
    limitations: [
      'Charts are capped at 8 series / 8 donut slices for readability — extra donut slices fold into "Other".',
      'Semicolon- or tab-delimited files should be exported as comma-separated CSV first.',
    ],
  },
];

export function getAllTools(): readonly ToolMeta[] {
  return TOOLS;
}

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
