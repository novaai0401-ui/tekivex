# AdSense on Tekivex product apps and subdomains

**Policy (since the September 2026 "Low value content" rejection): ad code is
placed only on long-form editorial pages of `www.tekivex.com` — the guides under
`/use-cases/*` and product overview pages with full editorial content. No other
page, path or host carries the AdSense loader or an ad unit.**

Earlier revisions of this document told every product app and subdomain to add
`ads.txt` *and* the AdSense loader. That guidance is withdrawn. The loader on
~60–100-word application shells (`/ui/docs/*`, `/ui/examples/*`, `/ui/blog/*`,
`/ui/about`, `/ui/contact`, legal pages) and on Pyntra tool, category and legal
pages is exactly what Google's
[Publisher Policies](https://support.google.com/adsense/answer/10502938) describe
as ads on screens without publisher content, and it was the most likely cause of
the second rejection.

## What this repository enforces at build time

`scripts/fetch-apps.mjs` vendors each app's published `build` branch into
`dist/<path>/` and then post-processes it:

| Path | Step | Effect |
|---|---|---|
| `/ui/*` | `scripts/prepare-ui.mjs` | Removes every AdSense loader and `<ins class="adsbygoogle">`; marks pages with fewer than 200 words of initial HTML `noindex, follow`; regenerates `/ui/sitemap.xml` from the substantial pages only; re-prefixes the upstream build's base-less links (`/components/x/` → `/ui/components/x/`), follows renamed pages, unlinks fake demo URLs; disambiguates duplicate titles. |
| `/gridstorm/*` | `scripts/prepare-gridstorm.mjs` | Marks the hub, playground and example-app shells `noindex, follow`; `/gridstorm/sitemap.xml` lists documentation pages only; every doc page gets a meta description, `TechArticle` and `BreadcrumbList` data, and a unique title. |
| `/analytics/*`, `/dataflow/*` | — | Contain no ad code upstream; left as-is. |

Each app is vendored from the exact commit pinned in `apps.lock.json`, never
from the moving tip of its `build` branch, and `dist/deploy-manifest.json`
records which commits are live. To take an upstream change:
`npm run pins:update`, review, `npm run build` (which ends with
`scripts/audit-dist.mjs`), then commit the new pins.

`scripts/audit-dist.mjs` fails the build on any internal broken link, a
sitemap page that is thin, noindexed, untitled, undescribed or uncanonical,
a duplicate title, or ad markup outside `/use-cases/*` and `/product/*`.

So even if an upstream app repo re-adds ad code, the deployed `www.tekivex.com`
tree will not serve it. Please still remove it at the source so the standalone
previews match production.

## Pyntra (`pyntra.tekivex.com`) — separate deployment, must be fixed in its repo

Pyntra is not vendored here. In the Pyntra repository:

1. Remove the AdSense loader and all ad units from every `/tools/*` interface,
   every `/cards/*` category page, and the contact, privacy, terms, about and
   navigation pages.
2. Keep ad units only on long, original guides, reviewed one by one.
3. Keep `ads.txt` in place (it is harmless and required once ads do run).

## AdSense dashboard settings (cannot be done from code)

- **Auto ads:** turn off site-wide, or exclude `/ui/*`, `/gridstorm/*`,
  `/analytics/*`, `/dataflow/*` and the whole `pyntra.tekivex.com` host. Auto
  ads ignore where `AdSlot` components are placed and can inject ads into the
  application shells regardless of this repository.
- **Privacy & messaging:** keep the consent message published.

## `ads.txt`

Every host that will ever serve ads needs
`google.com, pub-4630229006617891, DIRECT, f08c47fec0942fa0` at its root
(canonical copy: [`docs/ads.txt`](./ads.txt)). The vendored apps ship it already;
its presence does not by itself place ads.

## Verify after deploy

```bash
for p in /ui/ /ui/docs/button /ui/components/button/ /gridstorm/ /gridstorm/docs/; do
  printf '%-32s ads=%s noindex=%s\n' "$p" \
    "$(curl -s https://www.tekivex.com$p | grep -c adsbygoogle)" \
    "$(curl -s https://www.tekivex.com$p | grep -c 'noindex')"
done
# expected: ads=0 everywhere; noindex=1 for /ui/, /ui/docs/button, /gridstorm/; 0 for the two content pages
```
