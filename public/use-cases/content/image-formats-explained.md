Every phone, scanner, and screenshot key produces image files — but they don't produce the *same kind* of image file, and the differences matter more than most people realize. Pick the wrong format and a crisp screenshot turns fuzzy, a simple logo balloons to ten times its needed size, or a form upload rejects your photo outright. This guide explains the formats you'll actually meet — JPG, PNG, WebP, HEIC, GIF, and AVIF — what each one is for, and how to choose without memorizing anything.

## The one distinction that drives everything: lossy vs lossless

Image compression comes in two flavors:

- **Lossless** compression stores the picture exactly. Every pixel comes back identical when the file is opened. The file gets smaller by finding patterns and repetition — like writing "row of 400 white pixels" instead of listing them one by one.
- **Lossy** compression makes the file dramatically smaller by *throwing information away* — ideally information your eyes barely notice. The picture that comes back is an approximation of the original.

Neither is "better." Lossy is spectacular for photographs, where millions of subtly varying pixels hide small errors. Lossless is essential for text, line art, and interfaces, where every pixel boundary is sharp and any smudging is visible. Most format-choice mistakes come down to using a lossy format on sharp-edged graphics or a lossless format on photos.

## JPG/JPEG: the photograph workhorse

JPEG (the file extension is usually `.jpg`) has been the default photo format since 1992, and for good reason: it can shrink a photograph to a tenth of its raw size with no visible difference at normal viewing sizes.

It works by slicing the image into 8×8-pixel blocks and discarding fine detail within each block — starting with detail human vision is least sensitive to. At sensible quality settings this is invisible. Pushed too far, it produces the telltale **JPEG artifacts**: blocky smudges and ghostly halos around sharp edges.

Two things to know:

- **JPEG has no transparency.** Every JPG is a filled rectangle. A logo saved as JPG gets a white (or black) box behind it.
- **Re-saving compounds the loss.** Each edit-and-save cycle re-runs the lossy compression on the already-degraded result. Edit a JPG five times and you can watch it deteriorate. Keep an original and export copies instead.

**Use JPG for:** photographs and photo-like images, especially for sharing and uploading. **Avoid it for:** screenshots, logos, text, charts, anything with transparency.

## PNG: the screenshot and graphics format

PNG is lossless and supports full transparency (an "alpha channel" — pixels can be partially see-through, which is why PNG logos sit cleanly on any background). Text stays razor-sharp, flat colors stay flat, and no amount of re-saving degrades anything.

The cost is size — but only for the wrong content. A screenshot of a settings dialog might be 80 KB as a PNG and look perfect, while the same screenshot as a JPG looks worse *and* isn't much smaller, because JPEG's photo-tuned compression handles sharp edges poorly. Flip the content and the sizes flip too: a 12-megapixel photo can be 3 MB as a JPG but 25 MB as a PNG, with no visible benefit for the extra bytes.

**Use PNG for:** screenshots, UI images, logos, diagrams, charts, anything needing transparency. **Avoid it for:** photographs you intend to email or upload.

## WebP: the web's two-in-one format

WebP, released by Google, does both jobs: it has a lossy mode (typically 25–35% smaller than an equivalent JPG) and a lossless mode (usually smaller than PNG), plus transparency and animation in either. Every modern browser has supported it for years, which is why images you save from websites increasingly arrive as `.webp`.

Its weakness is everything *outside* the browser. Older versions of Windows Photo Viewer, some corporate systems, government upload portals, and various desktop apps still refuse WebP files. The web loves it; the long tail of software hasn't caught up.

**Use WebP for:** images published on websites. **Convert it to JPG or PNG when:** an upload form or application rejects it.

## HEIC: what your iPhone is actually saving

Since 2017, iPhones save photos as **HEIC** by default (High Efficiency Image Container, storing images compressed with the HEVC video codec). The engineering rationale is solid — roughly half the file size of JPEG at the same quality, plus support for live photos and burst sequences.

The practical reality is that HEIC is the format most likely to cause a compatibility headache. Windows needs an extension to open it, many websites and web tools can't read it, and plenty of upload forms reject it. Apple knows this: when you share a photo through most channels, iOS quietly converts it to JPG in transit. The problem appears when you copy files off the phone directly — via cable, cloud drive, or AirDrop to a Mac — and end up holding `.heic` files that half your software won't open.

Two fixes worth knowing: on the phone, **Settings → Camera → Formats → Most Compatible** makes the camera shoot JPG from the start; for existing photos, exporting or re-sharing them from the Photos app produces a JPG copy. (If your goal is bundling phone photos into a document, convert them to JPG or PNG first — a browser-based [JPG to PDF tool](/tools/jpg-to-pdf) can then assemble them without uploading anything.)

## GIF and AVIF: the old-timer and the newcomer

**GIF** survives on memes alone. Technically it's a poor format — limited to 256 colors, with clunky one-bit transparency and enormous file sizes for what it delivers. Its one killer feature, looping animation, is now done better by video files and animated WebP/AVIF; most "GIFs" you see on social platforms are actually silent MP4 videos. Don't choose GIF for anything new.

**AVIF** is the newest widely supported format, based on the AV1 video codec. It compresses better than WebP — often *much* better at low file sizes — and handles high dynamic range. Browser support is now solid, and it's gradually appearing beyond the web. Treat it like WebP with better compression and slightly younger compatibility.

## A 30-second decision guide

- **Photo to share or upload** → JPG (quality 80–90 is the sweet spot).
- **Screenshot, chart, logo, or anything with text** → PNG.
- **Needs a transparent background** → PNG (or WebP if it stays on the web).
- **Publishing on a website you control** → WebP or AVIF, with JPG/PNG fallbacks if your audience skews to old devices.
- **A form rejected your file** → convert to JPG (photos) or PNG (graphics); these two are accepted everywhere.
- **Archiving originals you may edit again** → keep the original format your camera produced, and export copies for each use.

## Two footnotes worth remembering

**Converting can't restore what's gone.** Turning a JPG into a PNG makes a bigger file, not a better image — the detail JPEG discarded is permanently lost. Convert formats to gain *compatibility* or *transparency*, never expecting quality back.

**Photos carry hidden metadata.** JPG and HEIC files from phones usually embed EXIF data: the exact time, camera model, and often **GPS coordinates** of where the photo was taken. Most social platforms strip this on upload, but email attachments and direct file transfers keep it. If you're sharing photos of your home, your children, or anything sensitive, strip location metadata first — every phone's share sheet or a basic image editor can do it.

None of this requires expertise to apply. Match lossy formats to photos, lossless formats to sharp graphics, fall back to JPG/PNG when compatibility bites, and keep your originals. That covers 99% of real-world image decisions.
