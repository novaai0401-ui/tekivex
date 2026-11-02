"""Build the photo used by scripts/metadata-evidence.mjs.

A synthetic 1200x900 JPEG whose EXIF block carries the details a phone
typically records: camera make and model, the time it was taken, and a GPS
position. The position is Westminster, London (51.5007 N, 0.1246 W), chosen as
a public landmark; no real person's location is involved.

Usage: python3 scripts/create-metadata-fixtures.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public/examples/metadata"
OUT.mkdir(parents=True, exist_ok=True)

img = Image.new("RGB", (1200, 900), (40, 110, 160))
d = ImageDraw.Draw(img)
for i in range(0, 1200, 60):
    d.rectangle([i, 600, i + 30, 900], fill=(230, 200, 90))
d.text((40, 40), "Tekivex metadata test photo", fill=(255, 255, 255))

exif = Image.Exif()
exif[0x010F] = "TestCam"            # Make
exif[0x0110] = "TestCam Phone 12"   # Model
exif[0x0131] = "TestCam Camera 1.0" # Software
exif[0x0132] = "2026:11:02 09:15:00"
ifd = exif.get_ifd(0x8769)          # Exif IFD
ifd[0x9003] = "2026:11:02 09:15:00" # DateTimeOriginal
gps = exif.get_ifd(0x8825)          # GPS IFD
gps[1] = "N"; gps[2] = (51.0, 30.0, 2.52)
gps[3] = "W"; gps[4] = (0.0, 7.0, 28.56)
img.save(OUT / "photo-with-gps.jpg", "JPEG", quality=88, exif=exif.tobytes())
print("wrote", OUT / "photo-with-gps.jpg")
