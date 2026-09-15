from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image
import random
from pathlib import Path
out=Path(__file__).resolve().parent.parent/'public/examples'
out.mkdir(exist_ok=True)
rng=random.Random(42)
im=Image.new('RGB',(1200,800))
im.putdata([(max(0,min(255,int(35+110*x/1200)+rng.randrange(-15,16))),max(0,min(255,int(80+100*y/800)+rng.randrange(-15,16))),max(0,min(255,160+rng.randrange(-15,16)))) for y in range(800) for x in range(1200)])
c=canvas.Canvas(str(out/'compression-sample.pdf'),pagesize=(595,842),invariant=1)
c.setTitle('Tekivex compression sample - synthetic data')
c.setFillColorRGB(.08,.14,.23)
c.setFont('Helvetica-Bold',24);c.drawString(48,780,'PDF compression sample')
c.setFont('Helvetica',11);c.drawString(48,755,'Synthetic image and text. No customer information. MIT licensed.')
c.drawImage(ImageReader(im),48,380,width=499,height=333)
c.setFont('Helvetica-Bold',16);c.drawString(48,345,'What to compare')
for i,t in enumerate(['1. Check the fine texture in the coloured panel at 200% zoom.', '2. Search for SAMPLE-2026 in the original and compressed files.', '3. Confirm page count and page dimensions remain unchanged.', '4. Compare file sizes using the same original at each setting.']):
 c.setFont('Helvetica',11);c.drawString(48,315-i*25,t)
c.setFont('Helvetica',9);c.drawString(48,155,'Small text: SAMPLE-2026. Compression rasterises this selectable text.')
c.drawString(48,135,'This fixture demonstrates one input; results are not typical savings for all PDFs.')
c.setFont('Helvetica',10);c.drawString(48,60,'Tekivex tutorial fixture | generated deterministically with random seed 42')
c.showPage();c.save()
