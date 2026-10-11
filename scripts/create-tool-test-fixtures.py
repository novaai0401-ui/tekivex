"""Build the synthetic fixtures used by scripts/tool-evidence.mjs.

Deterministic (ReportLab invariant mode, fixed text, fixed pixel art) so the
committed files can be regenerated and diffed. Nothing here is customer data.

    python scripts/create-tool-test-fixtures.py

Writes to public/examples/tool-tests/.
"""
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

OUT = Path(__file__).resolve().parent.parent / 'public/examples/tool-tests'
OUT.mkdir(parents=True, exist_ok=True)

W, H = A4


def structured_pdf(path: Path) -> None:
    """Six pages carrying the features people ask about: bookmarks, an external
    link, an internal link, and a fillable form field."""
    c = canvas.Canvas(str(path), pagesize=A4, invariant=1)
    c.setTitle('Tekivex tool test - structured document (synthetic)')
    for n in range(1, 7):
        c.bookmarkPage(f'p{n}')
        c.addOutlineEntry(f'Chapter {n}', f'p{n}', level=0)
        c.setFont('Helvetica-Bold', 28)
        c.drawString(60, H - 100, f'Page {n} of 6')
        c.setFont('Helvetica', 11)
        c.drawString(60, H - 130, 'Synthetic test document. Text on this page is selectable: MARKER-' + str(n))
        if n == 1:
            c.drawString(60, H - 170, 'External link: https://example.com/')
            c.linkURL('https://example.com/', (60, H - 175, 260, H - 160), relative=0)
            c.drawString(60, H - 200, 'Internal link: jump to page 5')
            c.linkAbsolute('page 5', 'p5', (60, H - 205, 260, H - 190))
        if n == 3:
            c.drawString(60, H - 170, 'Fillable field:')
            c.acroForm.textfield(name='full_name', tooltip='Full name', x=160, y=H - 180,
                                 width=220, height=20, value='', borderStyle='inset')
        c.showPage()
    c.save()


def encrypted_variants(src: Path) -> None:
    # 1. Needs a password to open at all.
    w = PdfWriter(clone_from=PdfReader(src))
    w.encrypt(user_password='open-me', owner_password='owner-secret', algorithm='AES-256')
    with open(OUT / 'structured-password-to-open.pdf', 'wb') as f:
        w.write(f)
    # 2. Opens without a password in any viewer, but carries owner restrictions
    #    (no printing, no editing). Common on bank statements and e-tickets.
    w = PdfWriter(clone_from=PdfReader(src))
    w.encrypt(user_password='', owner_password='owner-secret', algorithm='AES-256',
              permissions_flag=0)
    with open(OUT / 'structured-restrictions-only.pdf', 'wb') as f:
        w.write(f)


def phone_photo(path: Path) -> None:
    """A JPEG stored the way most phones store a portrait shot: landscape pixels
    plus EXIF Orientation=6 ("rotate 90 degrees clockwise to display")."""
    img = Image.new('RGB', (800, 600), (235, 240, 248))
    d = ImageDraw.Draw(img)
    # In stored pixels the arrow points LEFT; displayed per EXIF 6 it points UP.
    d.polygon([(120, 300), (330, 150), (330, 450)], fill=(25, 60, 140))
    d.rectangle([330, 250, 680, 350], fill=(25, 60, 140))
    exif = Image.Exif()
    exif[0x0112] = 6
    img.save(path, 'JPEG', quality=85, exif=exif.tobytes())


if __name__ == '__main__':
    base = OUT / 'structured.pdf'
    structured_pdf(base)
    encrypted_variants(base)
    phone_photo(OUT / 'phone-portrait-exif6.jpg')
    for p in sorted(OUT.iterdir()):
        print(f'{p.name}\t{p.stat().st_size}')
