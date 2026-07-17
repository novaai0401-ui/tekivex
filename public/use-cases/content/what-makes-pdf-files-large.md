Two PDFs can hold the same ten-page contract and differ in size by a factor of a hundred: 90 KB from a word processor, 9 MB from an office scanner. Meanwhile the "compress" button sometimes shrinks a file by 90% and sometimes does nothing at all. None of this is random. PDF size follows directly from what's inside the file, and once you know the three things that actually take up space, you can predict — before clicking anything — whether a file can shrink, by how much, and what it will cost in quality.

## What's actually inside the bytes

Ignore the page count; it's nearly irrelevant to size. A PDF's bulk comes from three places:

1. **Images** — photographs, scans, screenshots, logos. In almost every oversized PDF, images are 90%+ of the bytes.
2. **Fonts** — every embedded typeface adds tens to hundreds of kilobytes.
3. **Text and vector content** — the actual words and drawn shapes, stored as compact drawing instructions. This is almost never the problem: a full page of text costs a few kilobytes.

That's why the same contract varies so wildly. The word-processor export stores *text as text* — instructions like "place these characters in this font at these positions." The scanner stores *text as a photograph of text*: one large image per page, with no words in it at all. Same content to your eyes; utterly different data.

## The arithmetic of a scanned page

Scanner output dominates the "why is this so huge?" category, and a little arithmetic shows why. A standard A4/letter page scanned at 300 DPI is roughly 2,500 × 3,300 pixels — about 8 million pixels *per page*. Uncompressed, that's ~24 MB of raw color data per page; even JPEG-compressed at typical quality it lands around 0.5–1.5 MB. A 20-page scan at 300 DPI color is therefore a 10–30 MB file by construction — no bug, just pixels.

This also reveals the levers that make scans smaller, in order of power:

- **Resolution (DPI).** Halving the DPI quarters the pixel count. 300 DPI is right for print and OCR; 150 DPI is fine for on-screen reading; 600 DPI is almost never needed for documents.
- **Color mode.** A color scan of a black-and-white document wastes most of its bytes. Grayscale cuts size to about a third; true black-and-white ("bilevel") scans compress spectacularly with fax-style algorithms — often to a few tens of kilobytes per page.
- **Compression quality.** Within JPEG, quality 60–75 is usually indistinguishable from 95 for documents, at a fraction of the size.

If you control the scanner settings, you control the file size *before* the PDF exists — the cheapest fix of all.

## Why compression sometimes does nothing

A PDF's internal data is already compressed: text streams with the ZIP-style Flate algorithm, photos as embedded JPEGs. So a "compress PDF" tool can't just squeeze the file like zipping a folder — compressing compressed data yields nearly nothing. Real PDF compressors work by making *choices*:

- **Downsampling** — reducing image resolution to match how the file will be viewed.
- **Recompressing** — re-encoding images at lower JPEG quality, or converting lossless images to lossy.
- **De-duplicating** — a report that pastes the same logo onto 40 pages sometimes embeds it 40 times; one shared copy suffices.
- **Discarding** — metadata, thumbnails, unused fonts, and objects orphaned by previous edits.

This explains the two frustrating cases. A file that *won't* shrink is one where those choices are already made: images already low-resolution and tightly compressed, no redundancy left. And a file that shrinks but *looks worse* is one where the tool made aggressive choices — usually heavy downsampling — that the content couldn't absorb. Compression tools don't have a magic dial; they have trade-offs, and "maximum compression" always means "minimum image quality."

There's one more case worth knowing: a PDF that's been filled, signed, and re-saved many times can carry every previous version of itself, because many tools append changes rather than rewriting the file. For these, a simple rewrite ("save as" / optimize) drops the dead weight with **zero** quality loss — which is why the same button seems miraculous on one file and useless on the next.

## Fonts: the quiet kilobytes

Each embedded font adds weight — a full font family with regular, bold, italic and bold-italic can add half a megabyte, and CJK (Chinese/Japanese/Korean) fonts far more. Well-behaved software **subsets** fonts: it embeds only the glyphs actually used, marked internally with prefixed names like `ABCDEF+Helvetica`. Documents that use two font families instead of nine aren't just better typography — they're smaller files. (Removing font embedding entirely is a false economy: the document then renders with whatever substitute fonts the reader's machine has, which is the layout-drift problem PDF was invented to prevent.)

## What actually works, case by case

**A scanned document that's too big to email:** downsample to 150 DPI and, if it's black-and-white content, convert away from color. Expect 60–90% reduction. A client-side [compress tool](/tools/compress-pdf) does this without the document — possibly a contract or ID — ever leaving your machine.

**A slide deck or brochure full of photos:** recompress images to JPEG quality ~70 and downsample anything above 150–200 DPI. Expect 40–80% reduction with little visible change on screen.

**A text-heavy PDF that's mysteriously large:** suspect edit history bloat, duplicated resources, or unsubsetted fonts. A rewrite/optimize pass is lossless and often dramatic. If the file came from many rounds of form-filling and signing, this is almost certainly the answer.

**A file that needs to hit a hard limit (a 2 MB portal upload, say):** work the levers in order — resolution first, then color mode, then quality. If it still doesn't fit, split the document and upload in parts rather than crushing it into illegibility; a [page-splitting tool](/tools/split-pdf) preserves full quality.

**A file that refuses to shrink:** it's already efficient. The remaining options are removing pages or accepting visible quality loss. Know when to stop.

## When compression is the wrong move

Some documents shouldn't be squeezed. Anything with **legal or archival weight** — signed contracts, notarized records, evidence — should be preserved byte-for-byte; recompression alters the file (and will invalidate a digital signature outright). Documents destined for **print** need their full resolution: what looks fine at screen size turns visibly soft on paper. And any document that will be **OCR'd or re-processed** later benefits from staying at 300 DPI — text recognition accuracy drops sharply on downsampled scans. The pattern: compress *copies for distribution*, keep originals pristine.

## The mental model to keep

A PDF is small when its text is text, its images match their viewing size, and its fonts are subsetted; it is large when text has become pixels, when resolution exceeds any realistic use, or when history and duplication have accumulated. "Compressing a PDF" is never one operation — it's a bundle of resolution, color, quality, and cleanup decisions. Tools can make those decisions for you, but knowing what they're deciding is the difference between confidently shrinking a file to a tenth of its size and wondering why the button did nothing.
