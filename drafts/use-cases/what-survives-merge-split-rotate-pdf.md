---
slug: what-survives-merge-split-rotate-pdf
title: "Bookmarks, Links and Form Fields: What Survives When You Merge, Split or Rotate a PDF"
description: Page content almost always survives a merge or split. Bookmarks, links that jump inside the document, and fillable fields often do not. We ran the same test file through two tools and recorded exactly what each kept.
status: DRAFT, not published. A named author must repeat at least one operation in a desktop PDF reader and add what they saw.
evidence: public/examples/tool-tests/results.json (scripts/tool-evidence.mjs), public/examples/tool-tests/pypdf-comparison.json (scripts/pdf-structure-comparison.py)
---

When you merge two PDFs, you check that the pages are there and in the right order. You rarely check whether the bookmark sidebar still works, whether "see page 5" still jumps to page 5, or whether the form can still be filled in. Those parts are stored separately from the pages, and they are what most often goes missing.

<!-- AUTHOR: add a time a merged or trimmed file lost something you needed. -->

## Why pages survive and the rest does not

A page's text and images belong to the page itself. Bookmarks, links that point to other pages, and form fields are tied to the whole document: the bookmark list sits at the top of the file and points into it, and a form is a document-level list of fields whose boxes appear on pages.

The simplest way to merge or split is to copy pages into a new, empty document. That carries each page's content and its visible boxes. But unless the tool also rebuilds the bookmark list, re-points the links and rebuilds the form, those document-level parts stay behind in the source.

## What we tested

We built a six-page test document with six bookmarks, a link to a website, a link that jumps from page 1 to page 5, and a fillable name field on page 3. We then merged it with a copy of itself, extracted pages 1 and 5, deleted page 2, and rotated every page. We did each operation with two tools: the Tekivex tools, and pypdf 6.17.0, a widely used open-source PDF library for Python.

| Operation | What we checked | Tekivex | pypdf |
|---|---|---|---|
| Merge with a copy | Bookmarks | None kept | All 12 kept |
| | Jump links | Present, but go nowhere | Both work |
| | Name field | Visible, but not fillable | Kept, but both copies share one field name |
| Extract pages 1 and 5 | Bookmarks | None kept | The 2 for the extracted pages kept |
| | Jump link, page 1 to page 5 | Goes nowhere | Works |
| Delete page 2 | Bookmarks | None kept | All 6 kept, and 1 now points to the deleted page and does nothing |
| | Jump link | Goes nowhere | Works |
| | Name field | Visible, but not fillable | Kept and fillable |
| Rotate all pages | Everything | All kept | All kept |

Links to websites survived every operation in both tools. Page content came through unchanged in every Tekivex operation: we compared each page's drawing instructions byte by byte.

The Tekivex operations ran on 10 October 2026 and the pypdf ones on 23 October 2026. The [Tekivex results](/examples/tool-tests/results.json), [pypdf results](/examples/tool-tests/pypdf-comparison.json), the [test file](/examples/tool-tests/structured.pdf) and both scripts ([Tekivex](https://github.com/novaai0401-ui/tekivex/blob/master/scripts/tool-evidence.mjs), [pypdf](https://github.com/novaai0401-ui/tekivex/blob/master/scripts/pdf-structure-comparison.py)) are published. It is one synthetic file; other files and other tools may behave differently.

## Reading the results

**Rotation is safe everywhere.** Rotating only changes a number on each page, so nothing else is touched.

**Copying pages loses document-level parts.** That is what Tekivex's merge, split and delete tools do, and why they drop bookmarks, jump links and form fields. We state this on each tool page.

**Keeping everything has its own traps.** pypdf kept more, but merging two copies of the same form produced two fields with the same name. PDF field names are meant to be unique, so viewers may treat the pair as one field or behave unpredictably. And after deleting page 2, pypdf kept that page's bookmark, which now leads nowhere.

## What to do

- **Fill in forms before merging.** The boxes stay visible after a Tekivex merge, so what you typed should still show, but the fields can no longer be edited. We did not test a filled-in form, so check the result.
- **Rotate rather than split and re-merge** when only the orientation is wrong. Our [Rotate PDF](/tools/rotate-pdf) tool turns every page at once and keeps everything.
- **Check the parts you rely on.** After merging or trimming, click two or three bookmarks and one internal link, and try typing in one field.
- **Merge forms that have the same field names with care.** If two documents both have a field called "name", the merged file may link them.

<!-- AUTHOR: open one merged result in your usual PDF reader and describe what you saw in the bookmark panel. -->

## Frequently asked questions

### Why does Tekivex drop bookmarks when merging?

Our tools copy pages into a new file and do not rebuild the bookmark list, links or forms. It is a limitation, not a choice we recommend; each tool page states it.

### Will my merged file look different?

No. In every Tekivex test the page content was byte-for-byte identical. What changes is the navigation and form layer around the pages.
