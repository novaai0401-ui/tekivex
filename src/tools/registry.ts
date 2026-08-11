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
    short: 'Combine several PDFs into one file, in the order you choose.',
    description:
      'Assemble contracts, scanned pages, invoices, or report chapters into one PDF. ' +
      'Drag the files into order first — the output follows your arrangement exactly. ' +
      'The merge is computed locally by your browser, so there is no upload step, no ' +
      'size quota beyond your device’s memory, no watermark, and no account.',
    seoTitle: 'Merge PDF Files Online — Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Combine two or more PDFs into a single document, in any order you choose. Free, ' +
      'watermark-free, and processed locally in your browser — no upload, no signup.',
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
      'Pull exactly the pages you need out of a PDF — the signed page of a contract, one ' +
      'chapter of a manual, or any mix like 1,3,7-9 — into a new document. Ranges can even ' +
      'run backwards (9-7) to reverse page order. Extraction is done by your browser itself, ' +
      'so the document stays on your machine.',
    seoTitle: 'Split PDF — Extract Pages Online, Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Extract single pages or ranges (2-5, 1,3,7-9) from a PDF into a new file, free and ' +
      'watermark-free. Extraction runs locally in your browser — no upload required.',
    keywords: ['split pdf', 'extract pages from pdf', 'pdf page extractor', 'split pdf online free', 'remove pages from pdf', 'pdf splitter no upload'],
    iconName: 'file-pdf',
    color: '#f97316',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page or pick it with the file browser. It is read locally in your browser.' },
      { title: 'Choose pages', body: 'Type the pages to keep — for example "1,3,7-9" or "2-5". The page count is shown so you know the valid range.' },
      { title: 'Split and download', body: 'Click Extract. A new PDF containing only those pages is built in your browser and downloaded.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded anywhere?', a: 'No — there is no server component at all. The extraction is performed by JavaScript running in the page, so the document never leaves your device and there is nothing for us to store or delete.' },
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
      'Turn phone photos of receipts, whiteboards, IDs, or multi-page scans into a single ' +
      'tidy PDF — one image per page, each page sized to match its photo so nothing gets ' +
      'cropped or stretched. Because the conversion happens on your own device, it is a ' +
      'safe choice for identity documents and anything else you would rather not upload.',
    seoTitle: 'JPG to PDF Converter — Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Turn JPG and PNG photos — receipts, scans, IDs — into one PDF, one image per page. ' +
      'Free, and converted on your own device so sensitive photos are never uploaded.',
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
      'Get a scan under an email attachment limit or a portal’s upload cap. Each page is ' +
      're-rendered as an optimised image at a quality level you pick, which can cut ' +
      'image-heavy PDFs to a fraction of their size — and the before/after sizes are shown ' +
      'so you can judge the trade-off before downloading. Compression runs on your device; ' +
      'the document itself goes nowhere.',
    seoTitle: 'Compress PDF Online — Free & Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Shrink a scanned or image-heavy PDF to fit email and upload limits, with before/after ' +
      'sizes shown. Free, with all compression done locally on your device.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor online free', 'compress pdf without upload', 'make pdf smaller'],
    iconName: 'file-pdf',
    color: '#8b5cf6',
    steps: [
      { title: 'Add your PDF', body: 'Drop the oversized PDF onto the page — scans and photo-heavy documents benefit most.' },
      { title: 'Pick a quality level', body: 'Choose High, Balanced, or Strong compression. Stronger settings produce smaller files with softer image quality.' },
      { title: 'Compress and download', body: 'Click Compress. Each page is re-rendered and re-packed in your browser, and you see the before/after size before downloading.' },
    ],
    faqs: [
      { q: 'How does the compression work?', a: 'Each page is re-rendered as an optimised JPEG image and re-packed into a new PDF. That is why it works so well on scans — and why text in the output is no longer selectable. If you need selectable text, keep the original alongside the compressed copy.' },
      { q: 'Will it always make my PDF smaller?', a: 'No — and we show you the before/after size instead of pretending. Text-only PDFs are already compact and can even get bigger when rasterised; the tool warns you when the result is not smaller.' },
      { q: 'Is my PDF uploaded?', a: 'No. Rendering and re-packing are done by your own browser. A side effect worth knowing: compression speed depends on your device, not on our servers — a long PDF on an old phone will take longer than on a laptop.' },
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
      'Need a page of a PDF as a picture — for a slide, a social post, or a document that ' +
      'only accepts images? This tool renders every page to a JPG or PNG you can save ' +
      'individually or all at once, using your browser’s own PDF renderer rather than a ' +
      'server-side converter.',
    seoTitle: 'PDF to JPG — Convert PDF Pages to Images, Free & Private | Tekivex Tools',
    seoDescription:
      'Render each page of a PDF as a JPG or PNG image — ideal for slides and posts. Free ' +
      'and rendered locally by your browser, with no server-side conversion.',
    keywords: ['pdf to jpg', 'pdf to image', 'pdf to png', 'convert pdf to jpg free', 'pdf to jpg without upload', 'extract images from pdf'],
    iconName: 'file-pdf',
    color: '#0ea5e9',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page. Each page is rendered to an image locally in your browser.' },
      { title: 'Pick a format', body: 'Choose JPG (smaller, best for photos and scans) or PNG (lossless, best for text and diagrams).' },
      { title: 'Download', body: 'Save any single page, or use “Download all” to grab every page image at once.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded?', a: 'No. Pages are rasterised by the same in-browser PDF engine your browser could use to display them — the file itself stays on your device throughout.' },
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
      'Scanners and phone cameras love producing sideways documents. This tool turns every ' +
      'page 90° left or right, or flips them 180°, and saves the corrected file. Rotation only ' +
      'updates each page’s orientation flag, so it is instant and completely lossless — and it ' +
      'is applied by your browser, not a server.',
    seoTitle: 'Rotate PDF — Free & Private, No Upload | Tekivex Tools',
    seoDescription:
      'Fix a sideways or upside-down scan: rotate PDF pages 90, 180, or 270 degrees, losslessly ' +
      'and free. Rotation is applied locally by your browser.',
    keywords: ['rotate pdf', 'rotate pdf pages', 'turn pdf sideways', 'fix pdf orientation', 'rotate pdf free', 'rotate pdf without upload'],
    iconName: 'file-pdf',
    color: '#14b8a6',
    steps: [
      { title: 'Add your PDF', body: 'Drop the sideways or upside-down PDF onto the page.' },
      { title: 'Choose a rotation', body: 'Rotate every page 90° left, 90° right, or 180°. The rotation adds to any the pages already have.' },
      { title: 'Download', body: 'Click Rotate & download to save the corrected PDF to your device.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded?', a: 'No. The rotation flag is rewritten locally and the PDF never leaves your device — which is also why the operation completes in under a second even for large files.' },
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
      'Strip out blank scanner pages, internal notes, or pricing sheets before you share a ' +
      'document. Name the pages to delete — a single page, a range like 2-5, or a mix like ' +
      '1,4,9 — and download the trimmed PDF. The original is edited on your own machine, ' +
      'which matters when the pages you are removing are the confidential ones.',
    seoTitle: 'Delete Pages from a PDF — Free & Private, No Upload | Tekivex Tools',
    seoDescription:
      'Delete specific pages (2-5, 1,4,9) from a PDF and download the trimmed file, free. ' +
      'Editing happens on your own device — useful when the removed pages are confidential.',
    keywords: ['delete pages from pdf', 'remove pages from pdf', 'delete pdf pages free', 'remove page from pdf without upload', 'trim pdf pages'],
    iconName: 'file-pdf',
    color: '#f43f5e',
    steps: [
      { title: 'Add your PDF', body: 'Drop a PDF onto the page. The page count is shown so you know the valid range.' },
      { title: 'Type the pages to remove', body: 'Enter the pages to delete — for example “1,4,9” or “2-5”. Everything else is kept.' },
      { title: 'Remove and download', body: 'Click Remove pages. A new PDF without those pages is built in your browser and downloaded.' },
    ],
    faqs: [
      { q: 'Is my PDF uploaded?', a: 'No. The trimmed copy is built on your own machine — which is exactly what you want when the pages being removed are the sensitive ones.' },
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
      'Skip the spreadsheet: drop a CSV export straight from your database, analytics tool, ' +
      'or bank and get a presentable bar, line, area, or donut chart in seconds. Download it ' +
      'as an SVG that stays crisp at any size, or a PNG for quick pasting into slides. Parsing ' +
      'and charting happen in the page itself, so confidential numbers stay with you.',
    seoTitle: 'CSV to Chart — Free Online Chart Maker, Private (No Upload) | Tekivex Tools',
    seoDescription:
      'Drop a CSV and get a clean bar, line, area, or donut chart to download as SVG or PNG. ' +
      'Free, no signup, and your data is parsed in the page — never sent anywhere.',
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
