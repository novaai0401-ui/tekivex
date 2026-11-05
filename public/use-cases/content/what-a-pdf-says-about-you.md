When you send a PDF, you send more than its pages. Most PDFs also carry a small record about the file itself: a title, an author name, the program that made it, and when it was created and last changed. A PDF made from phone photos can also carry each photo's own record, which often includes the phone model and the exact place the photo was taken. None of this shows on the page, but anyone who opens the file's properties can read it.

## The two places PDF details hide

**Document properties.** Every PDF can have a short list of fields: Title, Author, Subject, Keywords, Creator (the program the document was written in), Producer (the program that wrote the PDF), and created and modified dates. Word processors fill these in from your account name and the document's settings. Many files also hold the same details a second time in a block called XMP, which some viewers read instead.

**Details inside images.** A JPEG photo carries its own EXIF record. Phones typically store the make and model, the date and time, and, when location is on, GPS coordinates. If a PDF tool places the photo into the PDF without re-encoding it, the EXIF record travels with it.

## What we tested

We built a three-page test document whose properties name an author ("Priya Example"), a title ("Q3 salary review"), keywords, the programs that made it and two dates in January 2026, with the same author in an XMP block. We also made a test photo whose EXIF record names a camera ("TestCam Phone 12"), a time, and a GPS position at Westminster in London, a public landmark. Then we ran the Tekivex tools' own code (pdf-lib 1.17.1) on them on 2 November 2026, once before and once after the fix described below.

| Operation | Author, title, keywords | Original program and dates | XMP block | Photo's camera and GPS |
|---|---|---|---|---|
| Merge with a copy | Removed | Replaced with "pdf-lib" and the time of the merge | Removed | Not applicable |
| Extract page 1 | Removed | Replaced | Removed | Not applicable |
| Delete page 2 | Removed | Replaced | Removed | Not applicable |
| Rotate all pages | **Kept** | Creator and created date kept; Producer and modified date updated | **Kept** | Not applicable |
| JPG to PDF, before our fix | None added | "pdf-lib" and the time of conversion | None | **Kept, byte for byte** |
| JPG to PDF, now | None added | "pdf-lib" and the time of conversion | None | Removed |

Before the fix, we copied the image back out of the PDF. It was identical to the original photo, and an ordinary EXIF reader (Pillow 12.1.1) still showed the camera model, the time and the GPS position. We changed the tool the same day. It now removes the photo's EXIF, XMP and IPTC records before placing it in the PDF, and copies the picture data itself unchanged, so quality is not affected. The same reader finds no EXIF record in the image copied out of the new PDF, and a portrait phone photo still comes out upright.

The [results](/examples/metadata/results.json), the [test document](/examples/metadata/document-with-metadata.pdf), the [test photo](/examples/metadata/photo-with-gps.jpg), the [image copied back out of the PDF now](/examples/metadata/embedded-image-from-jpg-to-pdf.jpg) and the [test script](https://github.com/novaai0401-ui/tekivex/blob/master/scripts/metadata-evidence.mjs) are published. It is one synthetic document and one synthetic photo; other tools behave differently.

## Why the results differ

Merge, extract and delete build a brand-new document and copy pages into it, so the old document's properties are left behind. That is the same reason they drop bookmarks and form fields, as described in [what survives when you merge, split or rotate a PDF](/use-cases/what-survives-merge-split-rotate-pdf). The new file gets fresh properties naming the PDF library and the current time.

Rotate changes a setting on each page of the original document and saves it again, so the original properties stay.

JPG to PDF places your photo into the PDF without re-compressing it, which keeps its full quality. Before our fix it copied the whole file, so the EXIF record, location included, came along. It now leaves the photo's records out but still keeps the colour profile, which affects how the photo looks.

Other converters may still copy the photo as it is, so the advice below applies to any tool.

## How to check a file before you send it

1. **Look at the document properties.** In Adobe Acrobat Reader, choose File, then Properties. In macOS Preview, choose Tools, then Show Inspector. In a Chromium-based browser's PDF viewer, open the menu and choose Document properties. Check the Title, Author, Subject and Keywords.
2. **For photos, check before converting.** Your phone's photo details screen, or the file's properties on a computer, shows whether a location is stored. If it is, turn it off for that photo or export a copy without location before making the PDF.
3. **Remember the dates.** A created date in the properties can reveal when a draft was started, even if the document says otherwise.

## What we did not test

We did not test Compress PDF, which redraws each page as a new image and so would not be expected to keep photo EXIF records; that is an expectation, not a measurement. We did not test PDF forms, comments or attachments, which can hold names too, or files from scanners, which may add their own details.

## Frequently asked questions

### Does merging remove my name from a PDF?

With the Tekivex tools, merging, extracting and deleting pages removed the author, title and keywords in our test. Check the result anyway, because other tools may copy the properties across.

### Can a PDF reveal where a photo was taken?

Yes, if the photo was taken with location on and the PDF tool copied the photo file as it is. Our JPG to PDF tool did this until 2 November 2026; it now removes the location and other photo records.

## Sources

- [pdf-lib](https://pdf-lib.js.org/), the open-source library the Tekivex PDF tools use: version 1.17.1, MIT licence, checked on the npm registry on November 2, 2026
- [Pillow](https://pillow.readthedocs.io/), the Python imaging library used to read the photos' EXIF records: version 12.1.1

## How this guide was made

This guide was drafted with an AI assistant from the tests described above, then checked line by line against the tests' published results. It is credited to the Tekivex team rather than to a named person because no individual author wrote it or repeated the check with their own phone. If you find a mistake, [tell us](/contact) and we will correct it and note the change.
