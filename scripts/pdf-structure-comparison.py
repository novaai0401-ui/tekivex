"""Evidence for the draft guides on what PDF edits keep, and whether deleted
pages are really gone. Compares the site's engine with pypdf, a widely used
open-source PDF library, on the same published test files.

    node scripts/tool-evidence.mjs            # Tekivex results (results.json)
    python scripts/pdf-structure-comparison.py

Writes public/examples/tool-tests/pypdf-comparison.json.
"""
import io
import json
import subprocess
import tempfile
from importlib import metadata
from pathlib import Path

from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent.parent
FIX = ROOT / 'public/examples/tool-tests'
STRUCTURED = FIX / 'structured.pdf'


def written(w: PdfWriter) -> bytes:
    b = io.BytesIO()
    w.write(b)
    return b.getvalue()


def inspect(data: bytes) -> dict:
    r = PdfReader(io.BytesIO(data))
    bookmarks = []
    for o in r.outline:
        if isinstance(o, list):
            continue
        try:
            target = r.get_destination_page_number(o)
        except Exception:
            target = None
        bookmarks.append(target)
    ext = internal = working = 0
    names = r.named_destinations
    page_ids = {p.indirect_reference.idnum for p in r.pages}
    for p in r.pages:
        for a in p.get('/Annots') or []:
            a = a.get_object()
            if a.get('/Subtype') != '/Link':
                continue
            action = a.get('/A')
            action = action.get_object() if action is not None else None
            if action is not None and action.get('/S') == '/URI':
                ext += 1
                continue
            internal += 1
            dest = a.get('/Dest') if a.get('/Dest') is not None else (action.get('/D') if action is not None else None)
            ok = False
            try:
                if hasattr(dest, '__getitem__') and not isinstance(dest, str):
                    ok = dest[0].idnum in page_ids
                else:
                    d = names.get(str(dest).lstrip('/'))
                    ok = d is not None and d.page is not None and d.page.idnum in page_ids
            except Exception:
                ok = False
            working += ok
    widgets = [str(a.get_object().get('/T') or a.get_object().get('/Parent', {}).get('/T'))
               for p in r.pages for a in (p.get('/Annots') or []) if a.get_object().get('/Subtype') == '/Widget']
    return {
        'pages': len(r.pages),
        'bookmarks': len(bookmarks),
        'bookmarks_pointing_nowhere': sum(1 for t in bookmarks if t is None),
        'external_links': ext,
        'internal_links': internal,
        'working_internal_links': working,
        'form_fields': len(r.get_fields() or {}),
        'form_widgets': len(widgets),
        'widget_field_names': widgets,
    }


def image_objects(data: bytes) -> list:
    r = PdfReader(io.BytesIO(data))
    found = []
    for num in range(1, int(r.trailer['/Size'])):
        try:
            o = r.get_object(num)
        except Exception:
            continue
        if hasattr(o, 'get') and o.get('/Subtype') == '/Image':
            found.append(o.get_data())
    return found


def main() -> None:
    ops = {}
    w = PdfWriter(); w.append(STRUCTURED); w.append(STRUCTURED)
    ops['merge: structured.pdf + structured.pdf (PdfWriter.append twice)'] = inspect(written(w))
    w = PdfWriter(); w.append(STRUCTURED, pages=[0, 4])
    ops['split: extract pages 1 and 5 (PdfWriter.append pages=[0, 4])'] = inspect(written(w))
    w = PdfWriter(clone_from=STRUCTURED); w.remove_page(1)
    ops['delete: remove page 2 (clone_from, remove_page)'] = inspect(written(w))
    w = PdfWriter(clone_from=STRUCTURED)
    for page in w.pages:
        page.rotate(90)
    ops['rotate: 90 degrees, all pages (PageObject.rotate)'] = inspect(written(w))

    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
        t = Path(tmp)
        subprocess.run(['node', str(ROOT / 'scripts/deletion-convert.mjs'), str(t)], check=True, cwd=ROOT)
        shared = (t / 'shared.pdf').read_bytes()
        original = image_objects(shared)
        leak = {'source: only page 2 draws the image': len(original)}
        for name in ['before', 'after']:
            leak[f'Tekivex {name} the fix: delete page 2'] = len(image_objects((t / f'tekivex-{name}-delete.pdf').read_bytes()))
        w = PdfWriter(clone_from=io.BytesIO(shared)); w.remove_page(1)
        left = image_objects(written(w))
        leak['pypdf: clone_from, remove_page'] = len(left)
        leak['pypdf: leftover image is byte-identical to the original'] = bool(left) and left[0] == original[0]
        w = PdfWriter(clone_from=io.BytesIO(shared)); w.remove_page(1); w.compress_identical_objects(remove_unreferenced=True)
        leak['pypdf: clone_from, remove_page, compress_identical_objects(remove_unreferenced=True)'] = len(image_objects(written(w)))
        w = PdfWriter(); w.append(io.BytesIO(shared), pages=[0])
        leak['pypdf: append page 1 only'] = len(image_objects(written(w)))

    result = {
        'generated_by': 'scripts/pdf-structure-comparison.py',
        'pypdf': metadata.version('pypdf'),
        'source': {'file': 'structured.pdf', **inspect(STRUCTURED.read_bytes())},
        'pypdf_operations': ops,
        'hidden_image_after_page_deletion': leak,
        'note': 'The shared-resources file is synthetic (scripts/tool-evidence.mjs sharedResourcesPdf): two pages share one '
                'resource list and only page 2 draws the image. How common this layout is in real files was not measured.',
    }
    (FIX / 'pypdf-comparison.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(leak, indent=1))
    for k, v in ops.items():
        print(k, {x: v[x] for x in ['bookmarks', 'bookmarks_pointing_nowhere', 'working_internal_links', 'internal_links', 'form_fields', 'form_widgets']})


if __name__ == '__main__':
    main()
