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

## Before switching any article to `ads: true`

1. A named person has tested the steps, added the evidence in its row, and is
   the byline author.
2. Every factual claim about another product or service links a dated source.
3. The article has been indexed and is receiving impressions in Search Console.
4. The change is recorded in the public changelog with its real date.
