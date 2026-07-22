Not every page in a PDF earns its place. A scanned document often picks up a blank back-side, a cover sheet, or a fax header you don't want to keep. Maybe you need to send someone a report but leave out the confidential appendix. Deleting the unwanted pages — and keeping everything else exactly as it was — is the fix, and Tekivex's [Delete PDF Pages](/tools/remove-pages-pdf) tool does it right inside your web browser, so the document is never uploaded to a server.

This guide walks through removing pages, explains the page syntax, and covers the pitfalls. There's no account to create and no watermark on the result.

## How to delete pages from a PDF

1. Open the [Delete PDF Pages](/tools/remove-pages-pdf) tool in your browser. Nothing to install.
2. Drag your PDF onto the drop area, or click to browse. The tool shows the total page count so you know the valid range.
3. Type the pages you want to **remove**. Everything you don't list is kept.
4. Double-check your list against the page count — it's easy to be off by one.
5. Click **Remove pages**. A new PDF without those pages is built in your browser and downloaded automatically.

The pages you keep stay in their original order and quality; only the ones you named are dropped.

## Understanding the page syntax

You can remove a single page, a continuous range, or a mix of both:

- **A single page:** type `3` to delete just page 3.
- **A range:** type `2-5` to delete pages 2, 3, 4 and 5.
- **A mix:** type `1,4,9` to delete pages 1, 4 and 9 while keeping the rest.
- **Combine them:** `1,3-5,10` removes page 1, pages 3 to 5, and page 10.

Pages are counted from 1, matching how your PDF reader numbers them. If you enter a page that doesn't exist — page 30 in a 20-page document — the tool tells you rather than quietly ignoring it, so you can correct the list.

## A safer way to work: keep the original

Because deleting pages produces a brand-new file and leaves your source untouched on disk, the safest habit is to keep the original until you've confirmed the trimmed version is correct. Open the downloaded PDF, scroll through it, and make sure you removed exactly what you meant to — and nothing you needed. If you got the list wrong, just run the original through the tool again with a corrected selection.

## Good to know and limitations

- **At least one page must remain.** The tool won't let you delete every page — a PDF needs at least one — and it will say so if you try.
- **Removed pages take their content with them.** Anything on a deleted page — text, images, form fields, annotations — goes too. There's no partial delete of just part of a page.
- **Encrypted PDFs must be unlocked first.** Remove the password in a reader, save an unlocked copy, then trim that.
- **No upload, no watermark, no account.** Page removal runs entirely in your browser, so the file never leaves your device.

If, instead of deleting pages, you want to *keep* a specific range as its own document, the [Split PDF](/tools/split-pdf) tool is the better fit. And to combine several trimmed documents afterwards, use [Merge PDF](/tools/merge-pdf).

## Frequently asked questions

### Is my PDF uploaded to remove pages?

No. Page removal happens entirely in your browser with client-side code — the file is never sent to a server. Here's [why browser tools keep your files private](/use-cases/why-browser-tools-keep-files-private).

### What page format can I enter?

Comma-separated single pages and ranges: `3`, `2-5`, or `1,4,9`. You can combine them, like `1,3-5,10`. Pages outside the document are reported as an error instead of being ignored.

### Can I get the deleted pages back?

Not from the trimmed file — the removed pages aren't stored in it. That's why it's worth keeping your original PDF until you've checked the result. If you need those pages later, re-run the original with a different selection.

### What if I only want to keep a few pages?

If you're keeping fewer pages than you're deleting, it's often easier to use [Split PDF](/tools/split-pdf) to extract the pages you want, rather than listing all the ones to remove.
