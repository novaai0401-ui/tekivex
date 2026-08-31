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

## Where sideways PDFs come from (and how to avoid them)

Almost every crooked PDF traces back to one of three sources. Flatbed scanners produce sideways pages when a document is placed with its long edge against the glass — many office copiers scan everything as landscape by default. Phone-camera "scan" apps guess orientation from the image content, and guess wrong on pages that are mostly tables or diagrams. And print-to-PDF drivers sometimes stamp a landscape orientation flag on portrait content when the source application had a landscape default.

If the same scanner keeps producing sideways output, look for an "auto-rotate" or "orientation detection" option in its settings — fixing it at the source beats fixing every file afterwards. Until then, this tool corrects the output losslessly in seconds.

## Rotation and file size

Because rotation only rewrites each page's orientation flag, the output file is byte-for-byte almost identical in size to the input — no re-encoding, no quality change, no growth. This is different from tools that rasterise pages to rotate them, which can balloon a small text PDF into a large image-based one. If you also need the file smaller, that's a separate job for [Compress PDF](/tools/compress-pdf) — do the rotation first, then compress the corrected file.

## Frequently asked questions

### Why does my PDF look rotated in one app but upright in another?

Because there are two different "rotations" in a PDF. This tool sets each page's *orientation flag* — a piece of metadata every compliant reader is supposed to honour. Most do, but a few older viewers and some print pipelines ignore the flag and show the page at its "baked-in" orientation, which is why the same file can look right in one app and sideways in another. If a viewer stubbornly ignores the flag, rasterising the page (via [PDF to JPG](/tools/pdf-to-jpg) and back) bakes the rotation in permanently. Rotation runs entirely in your browser, so the file is never uploaded ([why that matters](/use-cases/why-browser-tools-keep-files-private)).

### Does rotating a PDF reduce its quality?

No. Rotation only changes each page's orientation flag; the text and images themselves are untouched, so there's no loss of quality at all.

### Can I rotate pages by 45 degrees?

No — PDFs rotate in 90° increments (90, 180, 270). Free rotation to arbitrary angles isn't part of the PDF page model, so a 45° tilt isn't something a page-rotation tool can do without turning the page into an image first.

### The pages already have some rotation — what happens?

The rotation you choose is added to whatever the page already has. So a page that's 90° off, rotated another 90° the right way, ends up upright. Preview before downloading to be sure.
