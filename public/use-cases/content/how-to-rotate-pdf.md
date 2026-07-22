You open a PDF and every page is on its side — or worse, upside down. It usually happens with scans and phone photos that were captured in the wrong orientation, and it makes a document genuinely hard to read. Rotating the pages fixes it in seconds. Tekivex's [Rotate PDF](/tools/rotate-pdf) tool turns your pages the right way up and saves a corrected file, all inside your web browser, so the PDF is never uploaded anywhere.

This guide shows how to rotate a PDF, explains why it doesn't hurt quality, and covers how to handle a single stubborn page. There's no sign-up and no watermark.

## How to rotate a PDF

1. Open the [Rotate PDF](/tools/rotate-pdf) tool in your browser. Nothing to install.
2. Drag your PDF onto the drop area, or click to browse for it. The file is read locally on your device.
3. Choose a rotation: **90° left**, **90° right**, or **180°** (a half-turn, for upside-down pages). The rotation adds to whatever orientation the pages already have.
4. Check the preview to confirm the pages now sit the right way up.
5. Click **Rotate & download** to save the corrected PDF to your device.

That's it. A sideways scan becomes readable, and an upside-down page flips back, in about a minute.

## Why rotating doesn't lose any quality

It's natural to worry that rotating a document might blur or degrade it, the way re-saving a JPG repeatedly can. It doesn't. A PDF page carries an orientation flag, and rotating simply changes that flag — the underlying text and images are never re-encoded or resampled. The result is pixel-for-pixel identical to the original, just displayed at a different angle. You can rotate a PDF as many times as you like with zero cumulative loss.

## Rotating a single page

This tool rotates every page together, which is exactly what you want when a whole scan came out sideways. But occasionally only one page in a document is wrong — a single landscape chart in an otherwise upright report, say. To fix just that page:

1. Use [Split PDF](/tools/split-pdf) to pull out the one page that needs turning.
2. Rotate that single-page PDF here.
3. Use [Merge PDF](/tools/merge-pdf) to slot it back into the document in the right position.

It's a couple of extra steps, but it keeps the rest of the document untouched.

## Good to know and limitations

- **Rotation applies to all pages at once.** For per-page control, use the split-rotate-merge approach above.
- **Encrypted PDFs must be unlocked first.** Remove the password in a PDF reader, save an unlocked copy, then rotate that.
- **No upload, no watermark, no account.** The rotation is applied in your browser with client-side code, so the file never leaves your device.

## Frequently asked questions

### Is my PDF uploaded to rotate it?

No. Rotation runs entirely in your browser — the file is never sent to a server. To understand how that works and why it's safer, see [why browser tools keep your files private](/use-cases/why-browser-tools-keep-files-private).

### Does rotating a PDF reduce its quality?

No. Rotation only changes each page's orientation flag; the text and images themselves are untouched, so there's no loss of quality at all.

### Can I rotate pages by 45 degrees?

No — PDFs rotate in 90° increments (90, 180, 270). Free rotation to arbitrary angles isn't part of the PDF page model, so a 45° tilt isn't something a page-rotation tool can do without turning the page into an image first.

### The pages already have some rotation — what happens?

The rotation you choose is added to whatever the page already has. So a page that's 90° off, rotated another 90° the right way, ends up upright. Preview before downloading to be sure.
