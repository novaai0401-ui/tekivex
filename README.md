# Tekivex

> **Free developer tools, independently built.**
> The marketing hub, product catalogue, and free in-browser tools for [tekivex.com](https://tekivex.com) — one brand, one design system, one launcher.
>
> *Tekivex — from Greek **techne** (craft, skill, art) + **vex** (to drive forward). The driving force of skilled engineering.*

---

## What is this?

Tekivex is an independent project shipping free developer tools and web apps. This repo is the **apex site** (tekivex.com): the product catalogue, long-form guides, legal pages, and eight free client-side tools. The larger products are deployed on their own subdomains and linked from here.

```
tekivex.com (this repo)      ← hub, catalogue, guides, free in-browser tools
    └── links to →
         gridstorm            ← data grid library (npm: gridstorm)
         tekivex-ui           ← component library (www.tekivex.com/ui, npm: tekivex-ui)
         quantum-vault        ← post-quantum tokens (npm: @sigvault/sdk)
         pyntra               ← browser PDF editor (pyntra.tekivex.com)
         analytics-studio     ← browser BI app (www.tekivex.com/analytics)
         dataflow             ← real-time streaming dashboard (www.tekivex.com/dataflow)
```

The in-browser tools at `/tools` (merge/split/compress/rotate PDF, JPG↔PDF, CSV to chart) are implemented **in this repo** and run entirely client-side — nothing is uploaded.

---

## Products

| Product | Status | Description |
|---|---|---|
| **GridStorm** | Beta | Free high-performance data grid — 35 plugins, 100K rows @ 60fps, WCAG 2.1 AA |
| **Tekivex UI** | Preview | Accessible component library for React, Vue & Svelte |
| **Quantum Vault** | Beta | Post-quantum token issuance & verification (ML-DSA-87 + XChaCha20) |
| **Pyntra** | Beta | Browser PDF editor — hosted at pyntra.tekivex.com |
| **Analytics Studio** | Beta | In-browser BI & dashboards — hosted at www.tekivex.com/analytics |
| **DataFlow** | Beta | Real-time streaming dashboard — hosted at www.tekivex.com/dataflow |

All free for commercial use. Statuses are shown honestly on the site via each product manifest's `status` field.

---

## Architecture

### Adding a new product (2 steps)

**Step 1 — Create a manifest file:**

```ts
// src/platform/manifest-myproduct.ts
import type { ProductManifest } from './types';

export const myProductManifest: ProductManifest = {
  id: 'my-product',
  name: 'My Product',
  tagline: 'One-line description',
  description: 'Full description...',
  version: '0.1.0',
  status: 'beta',        // 'ga' | 'beta' | 'preview' | 'coming-soon'
  tier: 'open-source',   // 'open-source' | 'enterprise' | 'platform'
  color: '#8b5cf6',
  accentColor: 'rgba(139, 92, 246, 0.1)',
  iconName: 'my-icon',
  homePath: '/product/my-product',
  docsRoot: 'https://my-product.example.com/docs',
  // ...
};
```

**Step 2 — Register it** in `src/platform/registry.ts`. The launcher, nav, routing, sitemap, and prerender pick it up automatically.

### Repo layout

```
├── public/
│   ├── robots.txt           # Crawl rules + sitemap pointer
│   ├── sitemap.xml          # Generated at build
│   ├── ads.txt              # AdSense seller declaration
│   └── use-cases/content/   # Markdown source for the 20+ guides
├── src/
│   ├── App.tsx              # History router (/, /products, /product/:id, /tools/:slug, /use-cases/:slug)
│   ├── platform/            # Product manifests, registry, SEO config, useSeo()
│   ├── tools/               # Free in-browser tools (pdf-lib / pdfjs-dist / CSV charts)
│   ├── content/             # Article registry + article pages
│   ├── pages/               # Static pages (About, FAQ, legal, contact, …)
│   ├── ads/                 # Consent-gated AdSlot component
│   ├── consent/             # Cookie banner + Consent Mode v2 script loader
│   └── layout/              # TopNav, Footer, BrandFaq
├── scripts/prerender.mjs    # Emits per-route static HTML + sitemaps + RSS at build
└── vercel.json              # Redirects + SPA fallback rewrite
```

---

## SEO Strategy

`npm run build` runs Vite, then `scripts/prerender.mjs` writes a static HTML file per route with route-specific `<title>`, meta description, canonical, Open Graph/Twitter tags, JSON-LD (Organization, BreadcrumbList, FAQPage, TechArticle), and the real page content pre-rendered into `#root` — so crawlers see full content without executing JavaScript. React hydrates over it in the browser.

---

## Deployment (Vercel)

1. Import `novaai0401-ui/tekivex` in Vercel
2. Framework preset: **Other**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy — prerendered files are served directly; unmatched paths fall back to the SPA via the rewrite in `vercel.json`

---

## License

MIT — see [LICENSE](./LICENSE)
