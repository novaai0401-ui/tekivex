"""Evidence for the draft guide on sideways phone photos in PDFs.

Builds one asymmetric test picture, stores it eight ways (one per EXIF
Orientation value, the way cameras do), converts each to PDF three ways, renders
the PDFs and compares them with the picture as a phone gallery shows it.

    python scripts/orientation-evidence.py

Writes public/examples/orientation/: the eight JPEGs, results.json and
comparison.png. Needs Pillow, pypdfium2 and the repo's node_modules.
"""
import json
from importlib import metadata
import subprocess
import sys
import tempfile
from pathlib import Path

import PIL
import pypdfium2 as pdfium
from PIL import Image, ImageChops, ImageDraw, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/examples/orientation'
OUT.mkdir(parents=True, exist_ok=True)

# Inverse of what each Orientation value tells a viewer to do, so that the
# stored pixels display as the same upright picture. Pillow's exif_transpose
# applies the forward transform; the assertion below checks the round trip.
INVERSE = {1: None, 2: Image.FLIP_LEFT_RIGHT, 3: Image.ROTATE_180, 4: Image.FLIP_TOP_BOTTOM,
           5: Image.TRANSPOSE, 6: Image.ROTATE_90, 7: Image.TRANSVERSE, 8: Image.ROTATE_270}


def picture() -> Image.Image:
    """Portrait, like a phone photo of a document; no symmetry, so any wrong turn shows."""
    im = Image.new('RGB', (300, 400), (255, 255, 255))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 110, 70], fill=(214, 40, 40))        # red: top-left
    d.rectangle([250, 0, 300, 40], fill=(40, 150, 60))      # green: top-right
    d.rectangle([0, 360, 300, 400], fill=(40, 70, 200))     # blue: bottom edge
    d.polygon([(150, 120), (100, 220), (200, 220)], fill=(30, 30, 30))  # arrow pointing up
    d.rectangle([135, 220, 165, 300], fill=(30, 30, 30))
    return im


def render(pdf: Path, size) -> Image.Image:
    page = pdfium.PdfDocument(pdf.read_bytes())[0]
    im = page.render(scale=size[0] / page.get_width()).to_pil().convert('RGB')
    return im


def diff(a: Image.Image, b: Image.Image) -> float:
    if a.size != b.size:
        return float('nan')
    return round(sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3, 2)


def main() -> None:
    upright = picture()
    upright.save(OUT / 'upright.png')
    for o, m in INVERSE.items():
        stored = upright if m is None else upright.transpose(m)
        exif = Image.Exif()
        exif[0x0112] = o
        stored.save(OUT / f'o{o}.jpg', quality=92, exif=exif.tobytes())
        assert ImageOps.exif_transpose(Image.open(OUT / f'o{o}.jpg')).size == upright.size, o

    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        t = Path(tmp)
        for o in range(1, 9):
            (t / f'o{o}.jpg').write_bytes((OUT / f'o{o}.jpg').read_bytes())
            # Pillow's own JPEG-to-PDF writer, a common way scripts and apps do it.
            Image.open(t / f'o{o}.jpg').save(t / f'pillow-o{o}.pdf')
        subprocess.run(['node', str(ROOT / 'scripts/orientation-convert.mjs'), str(t)], check=True, cwd=ROOT)

        results = []
        renders = {}
        for o in range(1, 9):
            row = {'orientation': o}
            for tool in ['before', 'pillow', 'after']:
                pdf = t / f'{tool}-o{o}.pdf'
                doc = pdfium.PdfDocument(pdf.read_bytes())[0]
                w, h = round(doc.get_width()), round(doc.get_height())
                im = render(pdf, upright.size)
                upright_page = (h > w) == (upright.height > upright.width)
                d = diff(im.resize(upright.size), upright) if upright_page else None
                row[tool] = {'page': f'{w}x{h}', 'portrait': h > w,
                             'matches_phone_view': bool(upright_page and d is not None and d < 3),
                             'mean_pixel_difference': d}
                if o == 6:
                    renders[tool] = im
            results.append(row)

    # Side-by-side figure for orientation 6, the value phones use for portrait shots.
    labels = [('What the phone shows', upright), ('Before the fix', renders['before']),
              ('Pillow', renders['pillow']), ('Tekivex now', renders['after'])]
    cell = 260
    fig = Image.new('RGB', (cell * 4 + 50, cell + 60), (246, 247, 249))
    d = ImageDraw.Draw(fig)
    for i, (label, im) in enumerate(labels):
        thumb = im.copy()
        thumb.thumbnail((cell - 20, cell - 20))
        x = 10 + i * (cell + 10)
        fig.paste(thumb, (x + (cell - thumb.width) // 2, 10 + (cell - thumb.height) // 2))
        d.text((x + 10, cell + 25), label, fill=(20, 24, 33))
    fig.save(OUT / 'comparison.png', optimize=True)

    summary = {
        'generated_by': 'scripts/orientation-evidence.py',
        'tools': {'before': 'Tekivex JPG to PDF at commit 558cac6, before the fix',
                  'pillow': f'Pillow {PIL.__version__} Image.save(..., "PDF")',
                  'after': 'Tekivex JPG to PDF, current src/tools/lib/pdf.ts'},
        'renderer': f'pypdfium2 {metadata.version("pypdfium2")}',
        'test_picture': '300x400 portrait; orientation N stored with the inverse transform and EXIF Orientation=N',
        'results': results,
        'counts': {tool: sum(r[tool]['matches_phone_view'] for r in results) for tool in ['before', 'pillow', 'after']},
    }
    (OUT / 'results.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(summary['counts']))


if __name__ == '__main__':
    sys.exit(main())
