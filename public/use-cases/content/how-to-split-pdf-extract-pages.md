Sometimes you don't want the whole PDF — you just want a few pages out of it. Maybe someone sent you a 40-page report and you only need the summary on page 1 and the chart on page 12. Or you scanned a stack of documents into one file and now need to pull out a single form. Tekivex's [Split PDF](/tools/split-pdf) tool lets you extract exactly the pages you want into a new PDF, right inside your browser, without uploading anything.

Here's how to do it, including the simple syntax for choosing which pages to keep.

![The Split PDF tool showing report-q1.pdf with 3 pages and a "Pages to extract" field filled in with 1,3](/images/tools/split-pdf.png)

## How to split a PDF and extract pages

1. Open the [Split PDF](/tools/split-pdf) tool. There's nothing to download or install.
2. Drag your PDF onto the drop area, or click to browse for it. Drop just one file — this tool works on a single PDF at a time.
3. The tool reads your file and shows you its page count, so you know the valid range to pick from.
4. In the **Pages to extract** field, type the pages you want using the syntax below.
5. Run the extraction. The pages you chose are pulled into a brand-new PDF.
6. The new file downloads to your device, containing only the pages you asked for.

### The page syntax, explained

You can mix single pages and ranges, separated by commas, in any order you like:

- `3` — just page 3.
- `2-5` — pages 2, 3, 4 and 5.
- `1,3,7-9` — pages 1, 3, 7, 8 and 9.
- `9-7` — pages 9, 8 and 7, in reverse order (a backwards range flips the pages around).

Because order is respected, `3,1` gives you page 3 followed by page 1 — handy for reordering as you extract.

## Good to know and limitations

- **One output file per run.** Each run produces a single new PDF with your selected pages. If you need several separate files, just run the tool again with different page numbers.
- **Out-of-range pages show an error.** If you ask for page 50 in a 10-page document, the tool tells you rather than guessing. Check the page count it displays and adjust.
- **Encrypted PDFs must be unlocked first.** If your file is password-protected, remove the password in a PDF reader and save an unlocked copy before splitting.
- **It's the mirror image of merging.** If you instead want to join files together, use [Merge PDF](/tools/merge-pdf). For heavier editing, [Pyntra](/product/pyntra) is our full editor.

## The page-number trap: printed numbers vs. PDF pages

The most common splitting mistake has nothing to do with syntax. The page number *printed on* a page and the page's *position in the PDF* are often different things. A report whose "page 12" you want may open with a cover, a title page, and a table of contents — making the printed page 12 actually the **14th page of the file**. The tool (like every PDF tool) counts physical positions, starting at 1 from the very first page.

The fix takes five seconds: scroll to the page you want in any PDF viewer and read the position from the viewer's own page indicator (it shows something like "14 / 44"), then use *that* number. When extracting a long range, check where the range *ends* the same way — off-by-two errors at the end of a chapter are the classic result of trusting printed numbers.

## Practical ways people use this

- **Send one chapter, not the book.** Extract pages 25–41 of a manual instead of emailing all 300 pages.
- **Pull the signed page out of a returned contract.** The counterparty returns the full document; you extract just the execution page for your records.
- **Share a document minus its sensitive parts.** Extract every page *except* the ones with account numbers — for a 20-page file with page 7 confidential, extract `1-6,8-20`. (If deleting specific pages is the more natural way to think about it, the companion [Remove Pages](/tools/remove-pages-pdf) tool works from that direction.)
- **Split a batch scan.** Scanned five forms into one file? Run the tool once per form — `1-4`, then `5-8`, and so on — to get separate documents.
- **Reorder as you extract.** Since output follows the order you type, `5,1-4` moves page 5 to the front — a quick fix for a cover page scanned last.

## Troubleshooting

- **The file loads but shows no page count.** The PDF is almost certainly password-protected. Unlock it in a PDF reader first (you'll need the password) and save an unlocked copy.
- **"Out of range" on a page you can see.** You're likely reading the printed page number, not the file position — see the trap above.
- **The extracted pages look right but text won't select.** The source was a scan; its pages are images of text, and extraction faithfully copies them as-is. Extraction never removes text that was there — and never adds text that wasn't.

## Frequently asked questions

### How do I extract just one page from a PDF?

Type that single page number in the Pages to extract field — for example `4` — and run it. You'll get a new PDF containing only page 4.

### Can I extract pages that aren't next to each other?

Yes. Separate them with commas, like `1,3,7-9`. You can freely combine individual pages and ranges in a single request, and they can be in any order.

### Can I reverse the order of pages?

Yes. Write a range backwards, such as `9-7`, and those pages come out in reverse. You can also list single pages out of order, like `5,2,1`, to rearrange as you extract.

### Does extracting pages lose any quality?

No. Splitting is structural — the selected pages are copied into the new file exactly as they are, with their images, fonts, and formatting untouched. The extracted file is byte-for-byte faithful to those pages.

### Can I split one PDF into many files at once?

Each run produces one output file, so a five-part split takes five quick runs (`1-4`, then `5-8`, and so on). For pulling many arbitrary page sets out of the same document, keep the file loaded and just change the page list between runs.

### Are my files uploaded anywhere?

No. Your PDF is opened and split entirely within your browser on your own device — nothing is sent to a server. To learn how in-browser tools protect your privacy, see [why browser tools keep files private](/use-cases/why-browser-tools-keep-files-private).

Your files never leave your browser — splitting happens entirely on your own device.
