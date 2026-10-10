Ever tried to email a PDF and been told it's too big? Scanned documents are the usual culprit — a few pages of scanned paper can balloon into a file too large for an email attachment or an upload form. Tekivex's [Compress PDF](/tools/compress-pdf) tool shrinks bulky PDFs right inside your browser, with no uploading. It's genuinely good at slimming down scans and image-heavy files, and it's honest with you about the trade-off involved, which we'll explain plainly below.

![The Compress PDF tool showing High, Balanced, and Strong quality levels to choose from](/images/tools/compress-pdf.png)

## How to compress a PDF

1. Open the [Compress PDF](/tools/compress-pdf) tool. Nothing to install or sign up for.
2. Drag your PDF onto the drop area, or click to browse. Add one file.
3. Choose a quality level: **High** (gentlest compression, best-looking pages), **Balanced** (a middle ground), or **Strong** (smallest file, more visible quality loss).
4. Run the compression. The tool re-renders each page as an optimised image and repacks it into a smaller PDF.
5. If the file got smaller, it downloads automatically and the tool shows the before-and-after sizes.
6. If the result would be bigger than your original, nothing downloads. The tool tells you so and offers a button to download it anyway.

If the result isn't small enough, try again with a stronger setting; if it looks too rough, step back toward High.

## Good to know and the important trade-off

Here's the honest part. To shrink your file, Compress PDF re-renders each page as an optimised JPEG image and repacks the document. That's why it works so well on **scanned and image-heavy PDFs**. But it has a real consequence worth understanding before you use the result:

- **The text becomes non-selectable and non-searchable.** Because each page is turned into an image, you can no longer highlight, copy, or search the text in the compressed file. If you need searchable text, keep your original.
- **Text-only PDFs can get bigger.** A page of plain text is stored as compact instructions. Turning it into a picture makes it larger. In our test below, an 8 KB text document became 50 to 110 KB. The tool notices this, does not download the larger file automatically, and tells you to keep the original.
- **Encrypted PDFs must be unlocked first.** Remove any password in a PDF reader before compressing.
- **Best for:** scanned contracts, image-packed reports, photo-heavy documents — anything too big to attach.

For documents where keeping searchable text matters, or for more control over your files, [Pyntra](/product/pyntra) is our fuller editor. And if the file is large because it simply has many pages you don't all need, [Split PDF](/tools/split-pdf) may solve the problem instead.

## Why file-size limits exist — and what usually fits

Most compression jobs are driven by someone else's upload cap. These are the limits the main email providers state on their own help pages, checked on 11 October 2026:

| Email service | Limit stated by the provider | Source |
|---|---|---|
| Gmail (personal accounts) | 25 MB of attachments. Larger files are added as a Google Drive link instead. Work and school accounts are set by their administrator. | [Google: Attach files](https://support.google.com/mail/answer/6584) |
| Outlook.com | 20 MB, counting the attachment and the email together | [Microsoft: Send large files with Outlook](https://support.microsoft.com/en-us/office/send-large-files-with-outlook-8c698842-b462-4a4c-8d53-5c5dd04f77ef) |
| Yahoo Mail | 25 MB of attachments in total, sending or receiving | [Yahoo: Message size limits](https://help.yahoo.com/kb/SLN5673.html) |
| iCloud Mail | 20 MB per message, or up to 5 GB with Mail Drop turned on | [Apple: Mailbox size and message sending limits](https://support.apple.com/en-us/102198) |

Two practical points follow. Aim comfortably below the number, because the message text counts too on some services. And the recipient's mail server can have a smaller limit than yours, which you only find out when the message bounces. Upload portals for job applications, universities and government services set their own limits, so read the figure on the form itself.

Scans are the files that hit these limits hardest, and they are also the files this tool shrinks best, because photographic page images have a lot of removable detail.

A rough guide to choosing a setting against a target size: start with **Balanced**. If the before/after readout shows you're still over the limit, re-run the original at **Strong**. If Balanced already gets you far under the limit, **High** may give you a visibly crisper document that still fits. The tool downloads the result automatically and then shows both sizes. Keep your original and inspect the downloaded file before using it.

## When compression is the wrong tool

Two situations call for a different approach. If your PDF is mostly *text* and still large, the bulk is usually embedded fonts or an inefficient export — rasterising it here will cost you selectable text without saving much; re-exporting from the source program at lower quality is the better fix. And if the file only needs to be *split up* rather than smaller — say a portal accepts multiple files — extracting the needed pages with [Split PDF](/tools/split-pdf) keeps full quality while cutting size proportionally.

## Frequently asked questions

### How much smaller will my PDF get?

It depends on the file. Scanned and image-heavy PDFs often shrink dramatically: our image-heavy sample went from 3.1 MB to between 23 KB and 104 KB. Text-only PDFs can get *bigger*: our text sample grew from 8 KB to between 50 KB and 110 KB. The tool always shows the actual before-and-after size, and it only downloads automatically when the file got smaller.

### Why can't I select or search the text after compressing?

Because compression works by turning each page into an optimised image. That image looks like your page but no longer contains selectable text. If searchable text is important, keep your original file and only share the compressed copy where that doesn't matter.

### Which quality setting should I choose?

Start with **Balanced**. If you need the file even smaller and can accept some visible quality loss, use **Strong**. If the pages need to stay crisp, choose **High**. You can re-run with a different level anytime.

### How do I get a scan under an email or portal size limit?

Compress at **Balanced** first and read the before/after size the tool shows. If it's still over the limit, re-run the original file at **Strong**. If it's a multi-page scan with pages you don't actually need, [delete those pages](/tools/remove-pages-pdf) before compressing — dropping pages is the most reliable size cut of all. Everything happens on your device throughout, so even oversized confidential scans are never uploaded ([why that matters](/use-cases/why-browser-tools-keep-files-private)).

Your files never leave your browser — compression happens entirely on your own device.

## Worked example: a synthetic image-heavy page

[Download the original sample PDF](/examples/compression-sample.pdf). It contains one generated colour panel and selectable text, with no customer data. The fixture is deliberately image-heavy; its savings are not representative of text documents or every scan.

On September 15, 2026, we processed the same original separately at each setting in Chrome 153.0.8010.36 on Windows. The tool used pdfjs-dist 6.1.200 and pdf-lib 1.17.1. Sizes below are exact bytes, not rounded download labels. JPEG encoding can vary between browser versions.

| Setting | Original bytes | Output bytes | Output file |
| --- | ---: | ---: | --- |
| High quality | 3,067,920 | 104,163 | [High-quality PDF](/examples/compression-high.pdf) |
| Balanced | 3,067,920 | 50,721 | [Balanced PDF](/examples/compression-balanced.pdf) |
| Strong | 3,067,920 | 22,677 | [Strong PDF](/examples/compression-strong.pdf) |

All three outputs retain one page measuring 595 × 842 PDF points. Text extraction finds text in the original and no text in the outputs: the compressor rasterises the page. The smaller file therefore has a meaningful cost, even when it looks readable. Keep the original for search, copying text or further editing.

![Original synthetic PDF page with a textured colour panel and selectable text](/examples/compression-original.png)

![Strong compression output: texture and small text are visibly softer](/examples/compression-strong.png)

To repeat the comparison, open the tool, select the original sample, choose a level and press **Compress PDF**. The download starts automatically; the size comparison appears afterward. Always select the original again when changing levels, rather than recompressing an already degraded output.

We repeated the run on 11 October 2026 in Chromium 152. The outputs were 104,162, 50,720 and 22,677 bytes, within one byte of the September figures, so the results hold across these two browser versions.

## What happens to a text-only PDF

To test the claim that text documents do not compress well, we ran the same three settings on our [six-page text-only test PDF](/examples/tool-tests/structured.pdf) on 11 October 2026, in Chromium 152.

| Setting | Original | Output | Change |
| --- | ---: | ---: | --- |
| High quality | 8,037 bytes | 110,437 bytes | About 14 times larger |
| Balanced | 8,037 bytes | 80,748 bytes | About 10 times larger |
| Strong | 8,037 bytes | 50,304 bytes | About 6 times larger |

Every setting made the file bigger. Text in a PDF is stored as short drawing instructions plus a font, which is already very compact. A picture of the same page is not. After this test we changed the tool so that it no longer downloads a result larger than the original unless you ask for it. The [raw measurements](/examples/tool-tests/compress-browser.json) are published.

If a text PDF is too big, the cause is usually embedded images or fonts from the program that made it. Exporting again from that program with a smaller image setting will usually help more than this tool.

Check the heading and the small `SAMPLE-2026` line at 200% zoom. Search for that marker in both documents and compare page dimensions. If your destination requires searchable text, selectable links, forms or accessibility tags, this rasterising workflow is not an appropriate substitute for the original.

The [machine-readable results](/examples/compression-results.json) record this run. The fixture generator is in the repository at `scripts/create-compression-fixture.py`; it uses a fixed seed with ReportLab and Pillow. These example files are distributed under the repository's MIT license.
