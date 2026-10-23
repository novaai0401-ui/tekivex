# Draft reader guides

These are complete drafts, **not published**. Nothing in `drafts/` is served,
prerendered or listed in a sitemap. They were drafted on 2026-10-23 with an AI
assistant, from tests that were actually run and whose results are published
under `public/examples/`. AdSense rejected tekivex.com for low-value content,
and `docs/EDITORIAL-REVIEW.md` requires a named person to test each guide and
own its byline. So a draft only goes live after a person has done the steps
below.

| Draft | Evidence | Script |
| --- | --- | --- |
| `why-phone-photos-turn-sideways-in-pdf.md` | `public/examples/orientation/results.json`, `comparison.png` | `scripts/orientation-evidence.py` |
| `is-a-deleted-pdf-page-really-gone.md` | `public/examples/tool-tests/pypdf-comparison.json` | `scripts/pdf-structure-comparison.py` |
| `what-survives-merge-split-rotate-pdf.md` | `results.json` and `pypdf-comparison.json` in `public/examples/tool-tests/` | `scripts/tool-evidence.mjs`, `scripts/pdf-structure-comparison.py` |

## To publish a draft

1. **Repeat the test yourself.** Each draft's `status` line says what to
   repeat. Use your own phone, your own file, your usual PDF reader.
2. **Fill in every `<!-- AUTHOR: ... -->` note** with what you actually saw or
   did. Delete any note you cannot answer from your own experience, and the
   sentence around it if it depends on it.
3. **Rewrite the introduction and any paragraph that does not sound like you.**
   Keep every number and every link to evidence.
4. **Re-run the evidence scripts** if the tools or libraries changed, and
   update any number that moved.
5. Move the file to `public/use-cases/content/<slug>.md` without the front
   matter, add an `article({...})` entry in `src/content/registry.ts` with the
   real author's id and the real publish date, and add a changelog entry.
6. Leave `ads` off. Follow the checklist at the end of
   `docs/EDITORIAL-REVIEW.md` before switching it on.

Publish one guide at a time, a week or more apart, rather than all at once.
