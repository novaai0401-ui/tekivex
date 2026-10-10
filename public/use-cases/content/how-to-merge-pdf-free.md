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
- **Encrypted PDFs need to be unlocked first.** That includes files you can open without a password but which restrict copying or editing, as many statements and e-tickets do. Save an unencrypted copy, then merge that version.
- **Bookmarks and fillable fields do not come along.** The merged file keeps every page exactly as it looked, but not the bookmark sidebar, links that jump to another page, or form fields you could type into. Fill in forms before you merge. The test below shows what survives.
- **No account, no watermark, no upload.** You won't be asked to register, and nothing gets stamped onto your pages.

If you need to do more than merge — reordering pages inside a single document, editing, or annotating — take a look at [Pyntra](/product/pyntra), our fuller-featured editor. And if you later need to pull specific pages back out of your merged file, the [Split PDF](/tools/split-pdf) tool is the companion to this one.

## What we tested

On 10 October 2026 we ran the tool's own merge code on a synthetic six-page test PDF. It has six bookmarks, a link to a website, a link that jumps to page 5, and a fillable name field. We merged the file with a copy of itself and inspected the result.

| In the original | After merging |
|---|---|
| Page content | Kept. The drawing instructions of all 12 pages are byte-for-byte identical to the originals, so nothing was re-compressed. |
| Link to a website | Kept, in both copies |
| Link that jumps to page 5 | Still clickable, but it no longer goes anywhere |
| Bookmarks | Removed |
| Fillable name field | Still visible, but no longer fillable |
| File that opens without a password but restricts editing | Rejected with an "encrypted" message |

You can repeat the test yourself. The [test PDF](/examples/tool-tests/structured.pdf) and [raw results](/examples/tool-tests/results.json) are published, and the [test script](https://github.com/novaai0401-ui/tekivex/blob/master/scripts/tool-evidence.mjs) is in our public repository. If bookmarks or live form fields matter for your document, merge it in a desktop PDF editor instead, and check that the result still has them.

## Common merging scenarios and how to handle them

**Combining scanned batches.** Scanners often save each page — or each side of a double-sided document — as its own PDF. Drop the whole batch in at once, then sort them in the file list before merging. If a scan came out upside down, run it through [Rotate PDF](/tools/rotate-pdf) first and merge the corrected copy.

**Assembling an application or submission pack.** Cover letter, CV, certificates, references: portals frequently insist on "one PDF". Merge them in reading order and give the output a clear name before you upload it. If the pack comes out too large for the portal's size limit, pass the merged file through [Compress PDF](/tools/compress-pdf) afterwards.

**Adding a signed page back into a contract.** Print-sign-scan workflows leave you with the original contract plus a one-page scan of the signature page. Extract everything except the unsigned page with [Split PDF](/tools/split-pdf), then merge the signed scan into its place.

## Troubleshooting

- **The merge button stays disabled** — you need at least two files. A single PDF has nothing to merge with.
- **One of the files is rejected** — it is probably encrypted. Some encrypted files need a password to open. Others open normally but restrict copying or editing, and the tool rejects those too. Save an unencrypted copy first, which needs the file's owner password if it has one, or open it in [Pyntra](/product/pyntra), which handles encrypted documents.
- **The page runs out of memory on a phone** — merging several very large scans can exceed a phone browser's memory since everything is processed locally. Retry on a desktop browser, or compress the largest inputs first.

## How a browser-based merger differs from upload-based tools

Most "free" online PDF mergers work the same way under the hood: you upload your files to their server, the server stitches them together, and you download the result. That round trip is where the differences that matter to you show up.

| Question to ask of any merger | Tekivex Merge PDF |
|---|---|
| Where are my files processed? | In your browser, on your device |
| Does a copy stay on someone's server, and for how long? | No copy is made. Nothing is sent. |
| Is the free result watermarked? | No |
| Do I need an account or email? | No |
| Is there a daily limit? | No |
| Does it keep bookmarks and form fields? | No. See the test above. |
| Does it work offline once the page has loaded? | Yes |

For an upload-based service, the answers to the first two questions are in its privacy policy. Read the retention period before uploading anything sensitive.

The practical takeaway: if a document is sensitive — a contract, medical record, or anything with personal data — a tool that never uploads removes a whole category of risk. There's no server copy to breach, subpoena, or forget to delete. (For the full explanation, see [why browser tools keep files private](/use-cases/why-browser-tools-keep-files-private).)

## Frequently asked questions

### Can I merge PDFs on my phone?

Yes — Merge PDF runs in any modern mobile browser, no app to install. The one caveat is memory: phones have less of it than laptops, and because the whole merge happens on your device, combining several large scans can occasionally exhaust a mobile browser. If a merge stalls on your phone, do it on a desktop or [compress the largest files](/tools/compress-pdf) first.

### Can I merge just a few pages from each file instead of the whole documents?

Merge combines entire files in the order you set. To cherry-pick pages, do it in two steps: use [Split PDF](/tools/split-pdf) to extract just the pages you want from each source into smaller files, then merge those. For heavier page-level editing — reordering pages inside one document, deleting some, inserting others — [Pyntra](/product/pyntra) is the fuller editor.

### Does merging lower the quality of my PDFs?

No. Merging copies each page across exactly as it is — same resolution, same text, same embedded fonts. In our test the page content came out byte-for-byte identical. What is lost is structure around the pages: bookmarks, links that jump within the document, and fillable form fields. (Quality only changes if you deliberately run the result through [Compress PDF](/tools/compress-pdf) afterwards to shrink the file size.)

### Should I merge first and then compress, or compress first and then merge?

For file size it makes little difference. [Compress PDF](/tools/compress-pdf) turns every page into its own JPEG image, one page at a time, so the pages compress the same way whichever order you choose. Merging first is simpler because you compress one file instead of several. Compress only when you have to: it makes text unselectable and removes links. If the destination needs searchable text, merge without compressing.

### What if my merged file is rejected by an upload portal for being too large?

Portals that demand "one PDF" often also cap the file size. Merge your files as normal, then pass the result through [Compress PDF](/tools/compress-pdf) to bring it under the limit before you submit.

Your files never leave your browser — merging happens entirely on your own device.
