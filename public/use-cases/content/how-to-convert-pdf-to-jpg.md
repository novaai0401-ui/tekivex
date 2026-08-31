Sometimes you need a picture, not a PDF. Maybe you want to post a single page of a document to social media, drop a page into a slide deck, or send a screenshot-style image to someone who can't easily open a PDF on their phone. Turning each page of a PDF into a JPG (or PNG) image solves all of these — and Tekivex's [PDF to JPG](/tools/pdf-to-jpg) tool does it entirely inside your web browser, so your document is never uploaded to anyone's server.

This guide covers how to convert a PDF to images, when to pick JPG versus PNG, and the few things worth knowing before you start. It takes under a minute, there's no sign-up, and nothing is watermarked.

## How to convert a PDF to JPG

1. Open the [PDF to JPG](/tools/pdf-to-jpg) tool in your browser. There's nothing to install.
2. Drag your PDF onto the drop area, or click to browse for it. Each page is rendered to an image locally, right on your device.
3. Choose your image format. **JPG** produces smaller files and is ideal for scans and photos; **PNG** is lossless and keeps text and diagrams razor-sharp, at a larger file size.
4. Preview the rendered pages to confirm they look right.
5. Download any single page you need, or use **Download all** to grab every page as an image at once.

That's the whole process. A one-page PDF gives you one image; a twenty-page PDF gives you twenty.

## JPG or PNG — which should you choose?

The right format depends on what's on the page:

- **Choose JPG** for pages that are mostly photographs or scanned documents. JPG compresses continuous-tone images efficiently, so you get a small file with no visible loss for that kind of content.
- **Choose PNG** for pages full of sharp text, line drawings, charts, or screenshots. PNG is lossless, so fine edges stay crisp instead of getting the faint fuzz that heavy JPG compression can introduce. The trade-off is a larger file.

If you're unsure, try JPG first — for most everyday pages it's the better balance of quality and size.

## Good to know and limitations

- **The images are pictures, not text.** Once a page becomes a JPG or PNG, the text in it is no longer selectable or searchable. If you need editable text, keep the original PDF too.
- **Each page downloads as its own file.** To keep the tool lightweight, there's no ZIP bundling — "Download all" simply triggers each image in turn. Your browser may ask permission to download multiple files the first time; that's expected.
- **Encrypted PDFs need unlocking first.** If your PDF is password-protected, open it in a reader, save an unlocked copy, and convert that.
- **No upload, no watermark, no account.** Every page is rendered in your browser using client-side code, so the PDF never leaves your device.

If you later want to go the other way — turning images back into a single PDF — the [JPG to PDF](/tools/jpg-to-pdf) tool is the companion to this one. And if you only need a few pages as images, you can first pull them out with [Split PDF](/tools/split-pdf) and then convert just those.

## What people actually use page images for

- **Slides.** Presentation software makes embedding a PDF page awkward, but pastes an image instantly. Convert the page, drop it on the slide, done.
- **Social posts and chat.** Messaging apps and social platforms preview images inline but show PDFs as opaque attachments. A JPG of the poster, flyer, or announcement gets seen instead of downloaded-and-forgotten.
- **Forms that only accept images.** Plenty of upload forms accept JPG/PNG but not PDF. Rendering the relevant page to an image gets you through without hunting for another app.
- **Thumbnails and previews.** If you're building a document library or catalogue, rendering the first page of each PDF gives you preview images without a server-side rendering pipeline.

## Getting the best quality out of the conversion

The renderer draws each page at a resolution chosen for crisp on-screen viewing. For content destined for a large print or a projector, PNG is the safer choice: it's lossless, so fine text and line art survive untouched, where JPG's compression can leave faint artefacts around sharp edges. For photos and scans the difference is invisible and JPG's smaller size wins. One thing no setting can change: the output is a picture of the page, so the text in it can't be selected or searched. If the recipient needs working text, send the PDF itself, or extract just the needed pages with [Split PDF](/tools/split-pdf).

## Frequently asked questions

### When should I turn a PDF into images instead of keeping the PDF?

Convert to JPG or PNG when the destination only accepts images — a social post, a slide, a marketplace listing, or a form field that wants a picture rather than a document. Keep the PDF when the recipient needs to select text, follow links, or print at full fidelity, because page images lose all of that. A useful middle path: convert only the one or two pages you need as images and send the original PDF alongside. Either way the rendering happens in your browser, so nothing is uploaded ([why that matters](/use-cases/why-browser-tools-keep-files-private)).

### Can I convert just one page?

Yes. After the PDF is loaded, every page is rendered separately, so you can download only the page (or pages) you actually need instead of the whole document.

### Will the image quality be good?

Yes. Pages are rendered at a high resolution suitable for screen and most printing. For the sharpest text and line art, choose PNG; for photos and scans, JPG gives you a much smaller file with no visible difference.
