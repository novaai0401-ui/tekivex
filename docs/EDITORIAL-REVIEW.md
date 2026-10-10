# Editorial review of the 23 use-case articles

Reviewed October 10, 2026, after the third AdSense "Low value content"
rejection. The rejection asks for "authentic, high-quality information",
"ongoing curation" and "genuine user interest". This sheet records where each
article stands against that bar and what a **person** must add before it may
carry an ad. It is a worksheet for the editors, not published content.

## What the review found

- **No copying.** No article shares more than 2% of its wording with another
  article or with its tool page, so nothing needs merging for duplication.
- **Little firsthand evidence.** 20 of 23 articles cite no outside source, only
  one (Compress PDF) reports results measured on real files, and 17 have no
  image.
- **Most articles promote Tekivex's own products.** 14 are about GridStorm,
  Tekivex UI or Quantum Vault, or about Tekivex itself. They are legitimate
  product writing but are not independent publisher content.
- **Bulk publication.** 14 articles first appeared on 2026-06-17, 6 on
  2026-07-03 and 3 on 2026-07-22, and most were drafted with AI coding agents.
  Rewriting them again with AI would deepen, not fix, the problem.

## Ad policy (enforced in code)

- An article carries an ad only when its registry entry sets `ads: true`
  (`src/content/registry.ts`). The default is off, and **no article is on**.
- Product pages (`/product/*`), tool pages, documentation (`/ui/*`,
  `/gridstorm/*`) and app screens never carry ads. `scripts/audit-dist.mjs`
  fails the build if ad markup appears outside `/use-cases/`.
- Only articles in group B below may ever be switched on, and only after every
  item in their row and the checklist at the end is done.

## Group A — product articles: keep, never monetise

These explain Tekivex's own software. Keep them accurate; do not add ads.

| Article | What a person should do |
| --- | --- |
| tekivex-stack-how-products-fit | Company overview, not a guide. Consider moving the content to /about or /products. |
| tekivex-mit-open-source-model | Company positioning. Check every licence statement against each repository's LICENSE file. |
| gridstorm-vs-ag-grid-migration | Comparison table corrected 2026-10-10 with links to AG Grid's documentation. Re-check those pages before each review. |
| tekivex-ui-vs-mui-chakra | Already sourced and dated (2026-09-15). Re-check MUI and Chakra versions before each review. |
| gridstorm-virtual-scrolling-60fps | Run the measurement procedure it describes and publish the numbers, device, browser and date. |
| gridstorm-financial-trading-grid | Add a screenshot of the real demo and link its source file. |
| gridstorm-plugin-architecture | Title says "35 plugins"; confirm the count against the repository. |
| gridstorm-excel-formulas | Title says "42 functions"; confirm against the formula plugin source and link it. |
| gridstorm-accessible-data-grid | Record a real keyboard and screen-reader test (tool, version, date, result). |
| quantum-vault-post-quantum-tokens-explained | Cite FIPS 204 and the library's source for every algorithm claim. |
| quantum-vault-migrate-pqc-token-issuance | Link the exact SDK version and a working code sample. |
| quantum-vault-sovereign-token-verification | Same as above; state the threat model's limits. |
| tekivex-ui-headless-design-system | Link component source for each claim; add real screenshots. |
| tekivex-ui-accessible-forms | Add an audit result from a real tool run (axe, Lighthouse) with the date. |

## Group B — reader guides: candidates for ads after firsthand work

These answer questions people search for, independent of Tekivex. They are
also topics thousands of sites already cover, so each needs something only
Tekivex can show.

| Article | What a person must add before `ads: true` |
| --- | --- |
| how-to-compress-pdf | Strongest guide (has measured samples). Cite email and portal size limits from the providers' own help pages, with dates. |
| how-to-make-chart-from-csv | Add a worked example with a real public dataset (cite it) and the resulting chart. |
| how-to-merge-pdf-free | Add real screenshots of a test merge; document what happens with forms, bookmarks and encrypted files, tested. |
| how-to-split-pdf-extract-pages | Add a tested example with page ranges and a screenshot of the result. |
| how-to-convert-jpg-to-pdf | Test phone photos (HEIC, rotation, large sizes); report what works and what does not. |
| how-to-convert-pdf-to-jpg | Measure output sizes and quality at each setting on a sample file; publish the numbers. |
| how-to-rotate-pdf | Show before/after on a real scanned file; note which viewers honour the rotation. |
| how-to-delete-pages-from-pdf | Test on a PDF with links and bookmarks; report what survives. |
| why-browser-tools-keep-files-private | Show how a reader can verify "no upload" in browser developer tools, with screenshots. |

## Update, October 10, 2026 (later the same day): tested evidence added

Six group B guides now carry a "What we tested" or "What we measured" section.
The results come from running the site's own tool code on synthetic files
published under `/examples/tool-tests/`:

- `scripts/create-tool-test-fixtures.py` builds the sample files.
- `scripts/tool-evidence.mjs` runs merge, split, delete, rotate and JPG to PDF
  and writes `results.json`.
- `scripts/tool-evidence.test.mjs` fails the test suite if a fresh run no
  longer matches the published results. Regenerate the results and re-read the
  guides when it fails.
- PDF to JPG sizes were measured in Chromium 152 and are recorded in
  `pdf-to-jpg-browser.json`. That run is manual.

The tests found and corrected problems in the product, not only in the prose:

| Finding | Action |
| --- | --- |
| Portrait phone photos (EXIF orientation) became sideways pages in JPG to PDF | Fixed in `src/tools/lib/pdf.ts`; all eight orientations verified by rendering |
| Split and Delete left an image from a removed page embedded when pages share resources | Fixed; unused images are pruned before saving |
| Restriction-only encrypted files were reported as "password-protected" | Message corrected |
| Merge, split and delete drop bookmarks, internal links and form fields | Documented in guides and on tool pages |
| Merge guide claimed compression deduplicates fonts and images | Removed; the compressor rasterises each page |
| Rotate guide claimed output size is "almost identical" | Corrected with the measured sizes |
| PDF to JPG guide claimed print-ready resolution | Corrected: 144 pixels per inch |
| Merge tool FAQ said the page is "supported by the ads on this page" | Removed; tool pages carry no ads |

**What this does not change.** These are machine-run tests. They do not meet
checklist item 1 below, which needs a named person to test the steps in a real
browser and own the byline. No article has been switched to `ads: true`. Before
switching any of these six, the byline author should repeat the tests in the
live tool on a phone and a desktop, confirm the tables, and replace "we" with
their own account where it applies.

## Update, October 11, 2026: evidence for the remaining three group B guides

| Article | Evidence added | Product change it led to |
| --- | --- | --- |
| how-to-compress-pdf | Gmail, Outlook.com, Yahoo Mail and iCloud Mail limits from each provider's own help page, checked 2026-10-11 and linked. Text-only PDF measured at all three settings (`compress-browser.json`). The September image sample was re-run and matched within one byte. | Compress PDF no longer auto-downloads a result larger than the input |
| how-to-make-chart-from-csv | Worked example with NASA GISTEMP v4, cited as NASA asks. Raw download kept unmodified (`gistemp-glb-2026-10-11.csv`), 25-row extract, and the tool's own SVG export. | Label-column guess fixed for all-numeric tables |
| why-browser-tools-keep-files-private | Developer-tools steps, and the request log from merging two marked test PDFs on the live site (`privacy-network-log.json`). No request carried data out. | None needed |

Still open for these three:

- why-browser-tools-keep-files-private still has no screenshots of the network
  panel. They have to be taken by a person in a normal browser window. The
  published log is machine-recorded, not a screenshot.
- Re-check the four email limits before each AdSense review; providers change them.
- NASA revises recent GISTEMP values monthly. The guide says the figures are a
  snapshot; refresh the extract and chart if they are updated.

The same rule as before applies: a named person must repeat these checks
before any of these guides is switched to `ads: true`. None has been.

## Before switching any article to `ads: true`

1. A named person has tested the steps, added the evidence in its row, and is
   the byline author.
2. Every factual claim about another product or service links a dated source.
3. The article has been indexed and is receiving impressions in Search Console.
4. The change is recorded in the public changelog with its real date.
