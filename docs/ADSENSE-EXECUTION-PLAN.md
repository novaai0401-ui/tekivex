# AdSense readiness execution plan

This checklist tracks implementation and evidence. A passing build is not a Google approval guarantee; the account review is a separate user action.

## Consent and advertising
- [x] Repair preference reopening on the cookie-policy page.
- [x] Revoke prior consent signals when resetting; synchronize tabs and handle unavailable storage.
- [x] Keep the Google-certified consent message authoritative for regulated ad consent; test available integration and explain controls accurately.
- [x] Remove ad requests from 404, legal, empty and interactive-only screens. Preserve publisher verification.
- [ ] Check Auto ads exclusions and consent-message publication if account access is available.
- [ ] Test accepting, rejecting, reopening, withdrawing and returning visits in a browser.

## Content accuracy
- [x] Check the source release for Gridstorm plugin count, adapters and license; reconcile conflicting introductory documentation.
- [x] Remove unsupported bundle, frame-rate and accessibility guarantees across site-owned articles and marketing metadata.
- [x] Review imported documentation for outdated comparisons and version ambiguity.
- [x] Correct the editorial policy to distinguish accountable maintainers, assisted drafting and evidenced verification without inventing human review.
- [x] Preserve original examples, dated corrections, author attribution and accessible output descriptions.

## Routing and discovery
- [x] Repair the broken virtual-scroll reference and validate all generated documentation links.
- [ ] Configure all five Render redirects and verify permanent HTTP redirects on the live domain.
- [ ] Verify canonical URLs, sitemap/index files, crawler access and byte-exact ads.txt.
- [ ] Verify real 404 responses, with no advertising on those responses.
- [ ] Inspect public pages with and without JavaScript; maintain mobile navigation and readable layouts.

## Testing and release
- [x] Add regression tests for confirmed defects.
- [ ] Run TypeScript, unit tests, coverage and full build including all vendored apps; fix failures and repeat affected checks.
- [ ] Run real browser tool workflows, invalid-input handling, mobile layouts and downloadable-output checks.
- [ ] Publish changes, wait for GitHub CI, merge/deploy the passing revision and verify the live deployment.
- [ ] Check Search Console retrieval/canonical diagnostics when an authenticated account is available.
- [ ] Record completed checks, exact deployment revision and any account-access blockers. Do not label unverified account settings as complete.

## Evidence and remaining gates — September 15, 2026

- TypeScript passes. All 323 tests pass across 39 files; line coverage 84.70%, branches 70.77%, functions 77.93%. PDF engine tests inspect real pdf-lib output (page counts, extraction, rotation, deletion and images); component tests cover invalid inputs.
- Browser analytics sequence: undecided → accepted → reopened/undecided → denied → reload/denied. Cookie-policy banner now reappears. Cross-tab and storage failures are covered by regression tests.
- Full build imported all four product apps; final rebuild and CI verification are release gates. 23 complete article bodies and the 404/no-global-ad-loader assertions pass. All 67 generated Gridstorm documentation/index pages passed the earlier output audit; the stronger same-site link check must pass the final build.
- Google privacy-message integration is unit-tested against the documented callback interface, not certified as working for every regulated region. The user reports configuring the message; its published account settings remain unverified.
- Render login via GitHub failed because that account is deployment-only. Automatic approval review rejected Google sign-in because access to that separate Google account had not been specifically authorized. No redirect settings were changed. The five exact rules are in ADSENSE-PRE-SUBMISSION.md.
- Search Console, Auto ads exclusions, author credentials/permission and AdSense account eligibility require owner verification. Do not mark those as passing from code alone.
- Browser file chooser automation timed out on the local sample-PDF test. This is not recorded as successful file processing or as a confirmed application defect.

Google evaluates original publisher value and the actual live experience; tests and content counts do not guarantee approval. No review request has been submitted.
