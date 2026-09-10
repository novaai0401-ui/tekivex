# AdSense improvement and release checklist

This change addresses content availability, misleading route responses, and one
worked editorial example. It does not guarantee approval or establish why Google
rejected any specific page. The reported rejection is "Low value content".

## Changes in this pull request

- Article Markdown is bundled with the application, so a separate failed request
  cannot remove the article after React starts or during navigation.
- The build fails for missing or empty registered articles.
- Publication and modification dates are visible in article HTML and React.
- Extra URL segments no longer show a registered page under a fabricated URL.
- Render's site-wide homepage rewrite and unrelated retired-guide redirects are
  removed. App-specific rewrites remain because those apps have their own routers.
- Static redirect stubs are removed: Render serves existing files before rules.
- The CSV guide includes a downloadable teaching dataset, verifiable expected
  values, interpretation, and accurate limitations of data-bearing share links.
- CI checks article HTML, sitemap targets, dates, and redirect artifacts.

## Render deployment

Before merging, confirm whether the existing service is managed by a Blueprint.
Changing render.yaml does not configure a manually created service automatically.

For a manually configured service, after the new build is deployed:

1. Keep build command `npm run build` and publish directory `dist`.
2. In Redirects/Rewrites, remove the `/*` → `/index.html` rewrite.
3. Remove the eleven redirects from retired Pyntra, Analytics Studio, and DataFlow
   guides to `/use-cases`. These have no equivalent replacement in this repo.
4. Keep the five meaningful redirects and all app-specific rewrites in render.yaml.
5. Verify ordinary pages and app deep links before considering the release complete.

Expected production checks (use the browser and HTTP status tools):

| URL | Expected |
| --- | --- |
| `/use-cases/how-to-make-chart-from-csv` | 200; article body, worked example and download |
| `/tools/merge-pdf` | 200; working tool |
| `/contact` | 200; full contact page |
| `/platform` | 301 to `/products`, not a 200 HTML redirect |
| `/use-cases/analytics-studio-in-browser-sql` | 404 |
| `/this-page-does-not-exist` | 404; noindex error page |
| `/use-cases/how-to-make-chart-from-csv/made-up` | 404 |
| `/analytics`, `/dataflow/stocks`, `/ui/playground/` | Existing apps still load |
| `/ads.txt` | 200; correct publisher account |

Render reference: https://render.com/docs/redirects-rewrites

Do not infer production HTTP status from Vite's local SPA development server.
If rolling back, restore the previous deploy and any manually changed rules.
Vercel configuration is outside this Render-specific routing change.

## Information needed from the owner

- Render service URL and whether it uses a Blueprint. No passwords or API keys.
- Date of the most recent AdSense review, plus any detailed crawler diagnostics.
- Search Console indexing report and URL Inspection results for the homepage,
  one PDF guide, one engineering guide, and one tool (exclude private account data).
- Confirmation that the configured Google consent message is **published** for
  this site. Check an eligible-region session for correct consent behavior and
  whether the custom banner duplicates or conflicts with Google's message.
- Current Auto ads settings and page exclusions; verify ads do not serve on error
  pages or empty/loading screens. Script presence alone does not prove ad serving.

The owner has confirmed Render hosting and a configured Google consent message.
Do not replace that message or treat consent as the proven rejection cause.

## Editorial evidence to collect next

| Content | Evidence needed | Result to publish |
| --- | --- | --- |
| GridStorm 100K/60fps | Released version/commit, hardware, browser, dataset, runnable benchmark, frame times and dropped frames | Reproduction steps and measured results, including slower cases |
| UI comparisons | Versions, equivalent working examples, exact build/minify/gzip commands, output sizes | A fair comparison with source links and limitations |
| PDF compression | Non-sensitive sample files, original/output sizes at every quality setting, visual output review | Downloadable examples and a before/after table; explain rasterization and loss of text |
| Accessibility | Tested component list, keyboard tests, assistive technology/browser versions, known failures | Scoped findings rather than an unsupported blanket compliance claim |

The new CSV dataset is explicitly synthetic. Do not present it as customer
evidence or a benchmark. The named author should review the revised guide before
publication; preserve the existing publication date and use the actual revision date.

Documentation hash-route migration needs inspection of the separate `grid-data`
application's published documentation routes. Do not replace links with guessed
URLs in this shell repository. It is a follow-up, not completed by this patch.

After deployment, inspect the rendered content in Search Console, resolve crawl
errors, finish the evidence-led revisions, then request AdSense review. There is
no article-count or word-count target in this checklist and no guaranteed outcome.

Google references:
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/10502938
- https://support.google.com/adsense/answer/13554116
