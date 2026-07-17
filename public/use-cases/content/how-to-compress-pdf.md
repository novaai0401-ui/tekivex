Ever tried to email a PDF and been told it's too big? Scanned documents are the usual culprit — a few pages of scanned paper can balloon into a file too large for an email attachment or an upload form. Tekivex's [Compress PDF](/tools/compress-pdf) tool shrinks bulky PDFs right inside your browser, with no uploading. It's genuinely good at slimming down scans and image-heavy files, and it's honest with you about the trade-off involved, which we'll explain plainly below.

![The Compress PDF tool showing High, Balanced, and Strong quality levels to choose from](/images/tools/compress-pdf.png)

## How to compress a PDF

1. Open the [Compress PDF](/tools/compress-pdf) tool. Nothing to install or sign up for.
2. Drag your PDF onto the drop area, or click to browse. Add one file.
3. Choose a quality level: **High** (gentlest compression, best-looking pages), **Balanced** (a middle ground), or **Strong** (smallest file, more visible quality loss).
4. Run the compression. The tool re-renders each page as an optimised image and repacks it into a smaller PDF.
5. Check the before-and-after file sizes the tool shows you, so you can see exactly how much you saved.
6. Download your compressed PDF.

If the result isn't small enough, try again with a stronger setting; if it looks too rough, step back toward High.

## Good to know and the important trade-off

Here's the honest part. To shrink your file, Compress PDF re-renders each page as an optimised JPEG image and repacks the document. That's why it works so well on **scanned and image-heavy PDFs**. But it has a real consequence worth understanding before you use the result:

- **The text becomes non-selectable and non-searchable.** Because each page is turned into an image, you can no longer highlight, copy, or search the text in the compressed file. If you need searchable text, keep your original.
- **Text-only PDFs may not shrink much.** A document that's mostly plain text has little image data to optimise, so it might barely get smaller — or not at all. The tool shows the real before/after size and warns you when it couldn't make the file smaller, so you're never misled.
- **Encrypted PDFs must be unlocked first.** Remove any password in a PDF reader before compressing.
- **Best for:** scanned contracts, image-packed reports, photo-heavy documents — anything too big to attach.

For documents where keeping searchable text matters, or for more control over your files, [Pyntra](/product/pyntra) is our fuller editor. And if the file is large because it simply has many pages you don't all need, [Split PDF](/tools/split-pdf) may solve the problem instead.

## What kind of result to expect, by document type

Compression outcomes are predictable once you know what's inside the file (the full story is in [why PDFs get so large](/use-cases/what-makes-pdf-files-large)):

- **Scanned documents** — the best case. A phone- or office-scanner PDF is one large photograph per page, and photographs have lots of room to optimise. Reductions of 60–90% are normal.
- **Slide decks and image-heavy reports** — very good. Expect 40–80% depending on how oversized the embedded images are.
- **Digital text documents** (exported from Word, Google Docs, LaTeX) — modest to none. Text is already tiny; there's little to squeeze. These files are usually small to begin with, so they rarely need compressing at all.
- **Already-compressed files** — near zero. If someone has run the file through an optimiser already, a second pass can't find savings that no longer exist. The tool will tell you rather than hand you a file that's mysteriously the same size.

## Before you compress: three checks that might solve it better

1. **Is the file big because of pages you don't need?** Extracting just the relevant pages with [Split PDF](/tools/split-pdf) keeps full quality *and* selectable text — often a better answer than squeezing all 60 pages.
2. **Do you need the text to stay searchable?** This tool's method trades selectable text for size (details below). If the recipient must be able to search or copy the text — court filings, anything going into a document-management system — compress a *copy* for sending and keep your original, or reduce size at the source instead (re-export from the original program with smaller image settings).
3. **Is it going to be printed?** Screen-friendly compression can look visibly soft on paper. For print, stay on **High**, or don't compress at all.

## Troubleshooting

- **"Couldn't make it smaller."** The file is already efficient — usually a text-based or previously optimised PDF. Try removing unneeded pages instead.
- **The output looks blurry.** Step the quality level back toward High and re-run from your *original* file — never compress an already-compressed copy, since quality losses stack while savings don't.
- **It still doesn't fit the upload limit.** Combine strategies: extract only the required pages, then compress those. If a portal has a hard 2 MB cap and the document genuinely can't fit, split it and upload in parts at full quality.

## Frequently asked questions

### How much smaller will my PDF get?

It depends on the file. Scanned and image-heavy PDFs often shrink dramatically; text-only PDFs may shrink little or not at all. The tool always shows the actual before-and-after size so there's no guesswork, and it warns you if it couldn't reduce the file.

### Why can't I select or search the text after compressing?

Because compression works by turning each page into an optimised image. That image looks like your page but no longer contains selectable text. If searchable text is important, keep your original file and only share the compressed copy where that doesn't matter.

### Which quality setting should I choose?

Start with **Balanced**. If you need the file even smaller and can accept some visible quality loss, use **Strong**. If the pages need to stay crisp, choose **High**. You can re-run with a different level anytime.

### Is compressing a signed or legal document safe?

Be careful here. Compression rewrites the file, which **invalidates digital signatures** and changes the bytes of a document you may need to preserve exactly. Keep signed originals untouched and compress only copies meant for convenience sharing.

### Is my PDF uploaded to a server?

No. All the compression happens in your browser on your own device — your file is never sent across the internet. See [why browser tools keep files private](/use-cases/why-browser-tools-keep-files-private) for how that works.

Your files never leave your browser — compression happens entirely on your own device.
