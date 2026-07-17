Open a PDF in a text editor and you'll see something surprising: it's not gibberish all the way down. Near the top you'll find readable words like `/Catalog`, `/Pages`, and `/Font`, woven between blocks of compressed binary data. A PDF is not a picture of a document — it's a small database of drawing instructions, and understanding how that database is put together explains almost every odd thing PDFs do: why copied text comes out scrambled, why a "deleted" paragraph can still be hiding in the file, and why some edits break a document while others don't.

This guide walks through the format from the ground up. No tooling required — just curiosity.

## The problem PDF was invented to solve

In the early 1990s, sending someone a document meant gambling on their setup. A WordPerfect file opened in Microsoft Word would reflow; a document written with fonts you didn't own would substitute different ones and push every page break somewhere new. Adobe's 1993 answer was the Portable Document Format, built around one promise: **the page you see is the page everyone sees**, on any machine, in any decade.

To keep that promise, PDF made a radical trade. Instead of storing a document as flowing text that the viewer lays out (the way HTML or Word documents work), a PDF stores the *finished layout*: place this glyph at these exact coordinates, draw this line from here to there, paint this image inside this rectangle. The layout engine ran once, on the author's machine, and its output was frozen into the file.

That single decision is the root of both everything PDF is good at (fidelity, archival stability, print-readiness) and everything it's bad at (reflowing on phones, easy editing, reliable text extraction).

## The four building blocks of every PDF

Structurally, every PDF file — from a one-page receipt to a 2,000-page aircraft manual — has the same four parts:

1. **A header.** A single line like `%PDF-1.7` declaring the format version.
2. **A body of numbered objects.** The actual content: pages, fonts, images, metadata, annotations. Each object has a number and can reference other objects by number, like rows in a database referencing each other by ID.
3. **A cross-reference table (the "xref").** An index that records the exact byte position of every object in the file. This is how a viewer can open page 500 of a huge manual instantly — it looks up the page object in the index and jumps straight to that byte offset, without reading pages 1–499.
4. **A trailer.** The entry point, at the *end* of the file, which points to the xref table and to the root object (the `/Catalog`). PDF readers famously read files back-to-front: last line first.

The objects form a tree. The catalog points to a page tree; the page tree points to individual page objects; each page points to its **content stream** (the drawing instructions) and its **resources** (the fonts and images those instructions use).

## Text is not text — it's typesetting instructions

Inside a page's content stream, "Hello" isn't stored the way this article stores it. It looks more like:

```
BT
/F1 12 Tf
72 708 Td
(Hello) Tj
ET
```

Translated: begin a text block, select font F1 at 12 points, move to coordinates (72, 708) — PDF measures from the bottom-left corner — and show the glyphs for "Hello". Every run of text on the page is a separate positioning instruction like this.

Crucially, the file stores *glyph IDs in a particular font*, not universal character codes. A well-made PDF includes a mapping table (called a ToUnicode CMap) that says "glyph 47 in this font means the letter H". A badly made one doesn't. That's why copying text out of some PDFs produces perfect prose and out of others produces `□□□` or letters in the wrong order: the visual page is identical either way, but the recoverable *meaning* depends entirely on whether the producing software bothered to include the mapping.

It's also why there is no reliable notion of a paragraph inside a PDF. Word-wrapping happened before the file was written; the file just contains lines of positioned glyphs. Tools that extract paragraphs are reverse-engineering the layout, guessing which lines belong together — and sometimes guessing wrong.

## Streams, filters, and where the bytes go

Most of a PDF's size lives in **streams** — objects that carry bulk data with a compression filter applied:

- Content streams and embedded fonts are usually compressed with **Flate** (the same algorithm as ZIP files).
- Photographs are typically stored as complete JPEG files inside the PDF (the `DCTDecode` filter) — a PDF viewer literally contains a JPEG decoder.
- Scanned black-and-white pages often use fax-style compression (`CCITTFaxDecode`) or JBIG2.

This is why a "PDF" of a scanned contract behaves so differently from a PDF exported from a word processor. The scan is one big image per page with *no text objects at all* — nothing to select, search, or copy — unless OCR software has added an invisible text layer on top. The export, by contrast, is mostly tiny text instructions and might be a hundred times smaller.

## Incremental updates: why "deleted" isn't always gone

PDF has an append-only update mechanism. When some tools modify a document — filling a form field, adding a signature, redacting a line — they don't rewrite the file. They append the changed objects to the end, plus a new xref table that says "object 12 now lives here". The original object 12 is still present in the file; it's just no longer referenced.

This design enables digital signatures (you can verify the exact bytes that were signed, then see what changed afterwards) — but it has a sharp edge: **content you think you removed may still be in the file**. There have been real incidents of "redacted" government and legal documents where the black boxes were drawn *on top of* the text, or where an incremental update left the original data intact. Proper redaction tools rewrite the document and genuinely remove the underlying objects; drawing a black rectangle does not.

The flip side of appending is bloat: a form that has been filled, saved, re-filled and re-saved can carry every previous version of itself. Doing a full "save as" or optimize pass rewrites the file with only live objects, which is one reason that step alone sometimes shrinks a PDF dramatically.

## Why merging is easy but editing is hard

Understanding the object model explains a pattern anyone who works with PDFs has noticed:

- **Page-level operations are reliable.** Merging, splitting, rotating, and deleting pages just re-arrange page objects and update the page tree — nothing inside any page needs to be understood. A [browser-based merge tool](/tools/merge-pdf) can do this client-side in milliseconds.
- **Content-level editing is fragile.** Changing a word means finding the right glyph run among thousands of positioning instructions, re-typesetting with a font that may be subsetted (containing *only* the glyphs originally used — the replacement letter might not exist in the embedded font!), and nudging everything that follows. Editors do their best, but the format was never designed for it.

The practical advice follows directly: keep the source document (the Word file, the Markdown, the design file) as the thing you edit, and treat the PDF as the *output* — a print, not a manuscript.

## A few more pieces worth knowing

- **Encryption** in a PDF encrypts the streams and strings, not the file's skeleton — which is why a locked PDF still reveals its page count. "Owner passwords" that restrict printing or copying without a password to *open* the file are advisory: the viewer is asked to enforce them, and not all viewers do.
- **PDF/A** is the archival profile: everything embedded, no encryption, no JavaScript, no external references — a PDF built to still open correctly in 2060.
- **Tagged PDF** adds a parallel logical structure (headings, paragraphs, reading order, alt text) alongside the drawing instructions. It's what makes a PDF usable with a screen reader, and it only exists if the producing software creates it.
- **PDF became an ISO standard** (ISO 32000) in 2008, so the format is no longer proprietary to Adobe — which is why thousands of independent tools can read and write it.

## The takeaway

A PDF is a frozen page: a numbered collection of objects whose content streams position glyphs and images at fixed coordinates, indexed for fast random access, updated by appending. Once you hold that model in your head, PDF behavior stops being mysterious. Text extraction is unreliable because meaning was never the point — appearance was. Merging is trivial because pages are self-contained objects. "Deleted" content can survive because updates append rather than rewrite. And the file that always looks the same everywhere achieves that precisely by refusing to be anything other than what it was the day it was made.
