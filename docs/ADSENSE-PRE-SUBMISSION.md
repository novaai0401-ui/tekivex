# AdSense pre-submission checklist

This is a readiness checklist, not a guarantee of approval. Do not submit a review automatically from CI or a deployment script.

## Included in this change

- Publish the imported Gridstorm Markdown as real `/gridstorm/docs/.../` HTML pages; preserve old documentation bookmarks and update the main site's links.
- Align imported Gridstorm HTML canonical URLs with the main-domain deployment and remove fragment URLs from its sitemap.
- Fail a build when the imported documentation format changes or expected pages and links disappear.
- Replace unsupported Gridstorm performance and UI bundle-size comparisons with measurement procedures and qualified claims.
- Correct the MUI CSS-variable comparison using official documentation checked September 15, 2026.
- Provide a synthetic compression fixture, actual three-level outputs, browser/version/size results and previews; explain rasterisation and automatic downloads.
- Provide an actual SVG export of the CSV example and input troubleshooting.
- Fix PDF worker URL loading for compression and image conversion while preserving server prerendering.

## Render deployment (owner action)

For a manually configured Render service, `render.yaml` is not automatically applied. In Redirects/Rewrites, enter these redirects before app rewrites:

| Source | Destination |
| --- | --- |
| `/platform` | `/products` |
| `/privacy` | `/privacy-policy` |
| `/product/pdfcraft` | `/product/pyntra` |
| `/use-cases/quantum-vault-why-nist-pqc-matters` | `/use-cases/quantum-vault-post-quantum-tokens-explained` |
| `/use-cases/tekivex-ui-theming-css-variables` | `/use-cases/tekivex-ui-headless-design-system` |

- [ ] Confirm the service deploys the intended merged commit.
- [ ] Confirm all five redirects return 301 (or 308), with the stated destinations.
- [ ] Keep the existing app-specific rewrites; do not add a site-wide `/* -> /index.html` rewrite.
- [ ] Run `node scripts/verify-live-readiness.mjs` after deployment. It is read-only and exits nonzero on failed routing/canonical checks.
- [ ] Visit an old Gridstorm documentation bookmark and confirm it opens the equivalent static document.

## Content and visitor checks (owner sign-off)

- [ ] Verify real author identities, biographies and editorial claims. Automated changes cannot attest to a person's experience or review history.
- [ ] Review remaining technical guides against current product APIs. Publish exact versions and evidence for any numerical or compliance claims you retain.
- [ ] Reproduce the examples and check the downloaded results; the compression sample is synthetic and must not be represented as typical customer savings.
- [ ] Test every tool on target mobile and desktop browsers, including invalid/encrypted and larger files. A single browser pass does not establish compatibility everywhere.
- [ ] Check navigation, legal disclosures and contact details for accuracy.
- [ ] Verify the already-configured Google consent message in the applicable regions and its interaction with the site's own consent controls. No CMP configuration changes are included here.
- [ ] Review Auto ads exclusions in AdSense. Keep ads clear of controls and off empty/error/loading-only screens. The new static documentation does not add ad units.

## Search Console and submission (owner action)

- [ ] Inspect the live homepage, a tool guide, a product page and a new documentation URL. Confirm Google can retrieve the content and sees the intended canonical.
- [ ] Resubmit the sitemap after deployment and investigate retrieval problems. Indexing every URL is not an AdSense approval guarantee.
- [ ] Recheck `robots.txt` and `ads.txt` on the live domain.
- [ ] Request review only after verifying the live deployment and the checks above.

References: [AdSense eligibility](https://support.google.com/adsense/answer/9724), [Google Publisher Policies](https://support.google.com/adsense/answer/10502938), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Render redirects and rewrites](https://render.com/docs/redirects-rewrites).
