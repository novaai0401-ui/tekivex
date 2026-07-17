Need to combine a few PDFs into one file? Maybe you have a scanned contract, a signature page, and an appendix that all belong together — or a stack of receipts your accountant wants as a single document. Merging them by hand is a pain, and most "free" online mergers ask you to upload your files to a stranger's server first. Tekivex's [Merge PDF](/tools/merge-pdf) tool does the whole job right inside your web browser, so your documents never leave your computer.

This guide walks you through it step by step. It takes about a minute, there's no sign-up, and there's no watermark stamped across your pages at the end.

![The Merge PDF tool with two files, report-q1.pdf and appendix.pdf, loaded and a "Merge 2 PDFs" button ready to click](/images/tools/merge-pdf.png)

## How to merge PDFs

1. Open the [Merge PDF](/tools/merge-pdf) tool in your browser. Nothing to install.
2. Drag two or more PDF files onto the drop area, or click it to browse and select them from your device.
3. Check the order of your files. This is the order they'll appear in the final document.
4. Use the up and down controls next to each file to rearrange them until the sequence is exactly what you want — say, cover letter first, then the report, then the appendix.
5. Click the **Merge** button. The tool combines everything on the spot.
6. Your combined PDF downloads automatically to your device. Open it to confirm the pages are all there and in the right order.

That's the whole process. You can merge two files or twenty; the steps are the same.

## Good to know and limitations

- **Order matters, and you control it.** The final document follows the top-to-bottom order shown on screen, so reorder before you click Merge.
- **No file-size cap from us.** We don't impose a limit on how big your PDFs can be. The only real ceiling is your own device's memory, since all the work happens locally. Very large files on an older phone may feel slow.
- **Password-protected PDFs need to be unlocked first.** If a file is encrypted, open it in a PDF reader, remove the password (or save an unlocked copy), and then merge that version.
- **No account, no watermark, no upload.** You won't be asked to register, and nothing gets stamped onto your pages.

If you need to do more than merge — reordering pages inside a single document, editing, or annotating — take a look at [Pyntra](/product/pyntra), our fuller-featured editor. And if you later need to pull specific pages back out of your merged file, the [Split PDF](/tools/split-pdf) tool is the companion to this one.

## What merging does — and doesn't — change

A common worry is that combining PDFs will recompress or degrade them. It won't. Merging is a *structural* operation: each page is copied into the new document exactly as it was, byte for byte — same images, same fonts, same quality. The merged file's size is essentially the sum of its parts. (If the combined file ends up too large to email, that's the input files' weight, not the merge — see [why PDFs get large and how compression works](/use-cases/what-makes-pdf-files-large) for what to do about it.)

Two edge cases are worth knowing before you rely on a merged file:

- **Bookmarks and internal links may not carry over.** A table-of-contents entry that jumped to "Chapter 3" in the original document pointed at a page in *that* file; after merging, such navigation aids can be lost or point to the wrong place. The visible pages themselves are always intact.
- **Interactive form fields can collide.** If two source files both contain a form field named "Signature", merged PDFs can behave oddly — some readers link the fields together. If you're merging filled forms, flatten them first (print to PDF or save a flattened copy) so the entries become fixed page content.

## Common scenarios, with the fastest route

- **Contract + signature page.** Scan or export both, drop the contract in first, the signature page second, merge. If the signed page came from your phone as a photo, run it through [JPG to PDF](/tools/jpg-to-pdf) first.
- **A month of receipts for expenses.** Convert any photos to PDF, then merge in date order — most expense systems want one file, oldest first.
- **Report + appendix from different programs.** Merging doesn't care where the PDFs came from; a Word export, a spreadsheet export, and a scan combine cleanly. Mixed page sizes (say, Letter and A4) are fine too — each page keeps its own dimensions.
- **Rebuilding a document in a different order.** Merge everything, then use [Split PDF](/tools/split-pdf) with an out-of-order page list (like `3,1,2`) to rearrange.

## Troubleshooting

- **A file won't load.** It's usually either password-protected (unlock it first) or truncated by a bad download — re-download and try again. The tool tells you which rather than failing silently.
- **The merged file seems huge.** One of your inputs is image-heavy, typically a scan. Merge first, then run the result through [Compress PDF](/tools/compress-pdf) if it needs to fit an attachment limit.
- **Pages came out in the wrong order.** The output follows the on-screen list top to bottom. Reorder there and merge again — running the tool twice costs nothing.

## Frequently asked questions

### Is this PDF merger really free?

Yes. There's no paid tier, no trial that expires, and no account to create. Open the tool, merge your files, download the result. Because everything runs in your browser, there's nothing for us to charge you to host.

### Will there be a watermark on my merged PDF?

No. Many free online tools add a watermark or logo unless you pay. Merge PDF does not — the file you download contains only your pages, exactly as they were.

### Are my files uploaded to a server?

No. This is the important part. Your PDFs are read and combined entirely within your browser on your own device. They are never sent across the internet to us or anyone else. If you'd like to understand why that matters and how to verify it, read [why browser tools keep files private](/use-cases/why-browser-tools-keep-files-private).

### Does merging reduce the quality of my PDFs?

No. Pages are copied into the combined document unchanged — no recompression, no re-rendering. Text stays selectable, images keep their resolution, and print quality is identical to the originals.

### Can I merge PDFs on my phone?

Yes. The tool runs in any modern mobile browser the same way it does on a desktop. Very large files can be slower on older phones since your device does the work, but a typical stack of documents merges in seconds.

### Is there a limit on how many PDFs I can combine?

We don't set one. You can merge as many PDFs as you like. The practical limit is your device's available memory, because the merging happens locally rather than on a powerful server.

Your files never leave your browser — merging happens entirely on your own device.
