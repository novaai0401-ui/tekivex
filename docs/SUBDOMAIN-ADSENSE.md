# Serving AdSense ads on the Tekivex subdomains

Once `tekivex.com` is approved in AdSense, **the same publisher account
(`ca-pub-4630229006617891`) can serve ads on every `*.tekivex.com` subdomain
with no separate review** — AdSense approval is granted at the registrable-domain
level (`tekivex.com`), which covers all its subdomains.

But each subdomain is a separate *host*, so two things must be present **on every
subdomain you want to monetise**:

1. an `ads.txt` file served at that host's root, and
2. the AdSense ad code (loader script + `<ins class="adsbygoogle">` units).

This repo is only the apex marketing site (`tekivex.com`). The subdomains below
live in their own repos/deployments and must each be updated there.

## Subdomains in scope

| Subdomain | Product |
|---|---|
| `gridstorm.tekivex.com` | GridStorm |
| `ui.tekivex.com`        | Tekivex UI |
| `pyntra.tekivex.com`    | Pyntra |
| `analytics.tekivex.com` | Analytics Studio |
| `dataflow.tekivex.com`  | DataFlow |

(`www.tekivex.com` already 301-redirects to the apex, so it needs nothing.)

## Step 1 — `ads.txt` on every subdomain

Each subdomain must answer `https://<subdomain>.tekivex.com/ads.txt` with this
**exact** line (canonical copy: [`docs/ads.txt`](./ads.txt)):

```
google.com, pub-4630229006617891, DIRECT, f08c47fec0942fa0
```

Two ways to do it — pick whichever fits each subdomain's stack:

**A. Ship the file directly (simplest).**
For a static / Vite / Next public-assets site, drop the file at the path that
becomes the web root — e.g. `public/ads.txt`. Deploy. Verify:

```bash
curl -s https://gridstorm.tekivex.com/ads.txt
# → google.com, pub-4630229006617891, DIRECT, f08c47fec0942fa0
```

**B. Redirect to the apex (zero per-repo maintenance).**
Google's ads.txt crawler follows a redirect to the root domain, so a subdomain
may 301 its `/ads.txt` to the apex file. On Vercel, add to that subdomain's
`vercel.json`:

```json
{
  "redirects": [
    { "source": "/ads.txt", "destination": "https://tekivex.com/ads.txt", "permanent": true }
  ]
}
```

Option A is the most universally reliable; use B only where you'd rather not
maintain a copy. Either way the result must be the same single line above.

## Step 2 — AdSense code on every subdomain

Add the AdSense account/loader (consent-gated, exactly as the apex does in
`index.html`) and place `<ins class="adsbygoogle" data-ad-client="ca-pub-4630229006617891" …>`
units inside substantive content — never on thin/utility pages. Reuse the apex
`AdSlot` pattern (`src/ads/AdSlot.tsx`) and Consent Mode setup (`index.html`)
as the reference implementation.

## Verify all subdomains at once

```bash
for s in gridstorm ui pyntra analytics dataflow; do
  printf '%s: ' "$s"
  curl -s "https://$s.tekivex.com/ads.txt" || echo "MISSING"
done
```

Every line should print the `google.com, pub-4630229006617891, DIRECT, …`
record. Any `MISSING` / 404 means that subdomain will show "ads.txt not found"
in AdSense and may have ad serving restricted.

## Important sequencing

- `ads.txt` and ad code do **not** affect *approval* — they govern whether ads
  can *serve and earn* after approval. Add them once `tekivex.com` is approved
  (or alongside, it does no harm).
- Approval itself is gated on `tekivex.com` passing the content review. See the
  P1 (publish-date) and P2 (named authors / E-E-A-T) changes already applied to
  this repo.
