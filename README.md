# Tekivex

> **Enterprise software, crafted with skill.**
> A platform shell that unifies multiple developer tools and enterprise products under one brand, one design system, and one launcher.
>
> *Tekivex — from Greek **techne** (craft, skill, art) + **vex** (to drive forward). The driving force of skilled engineering.*

---

## What is this?

Tekivex is a **standalone platform shell** — a product launcher and marketing hub for a suite of enterprise software products. Each product is independently deployed and linked from here by URL.

```
tekivex (this repo)            ← platform shell, product catalog, SEO
    └── links to →
         grid-data (GridStorm) ← data grid packages, docs, demos
         pdf-toolkit            ← (future repo)
         nexa-recruit           ← (future repo)
         nexa-care              ← (future repo)
```

**This repo contains no product code.** It is purely the platform shell: product cards, landing pages, SEO metadata, branding, and navigation.

---

## Products

| Product | Status | Description |
|---|---|---|
| **GridStorm** | ✅ GA | Free enterprise data grid — 35 plugins, 100K rows @ 60fps, WCAG 2.1 AA |
| **PDF Toolkit** | 🔵 Beta | WASM/Rust PDF renderer — 13 annotation types, PII detection, AES-256 |
| **Analytics Studio** | 🔜 Q3 2026 | Visual BI & dashboards — drag-and-drop, 20+ chart types, no SQL |
| **DataFlow** | 🔜 Q4 2026 | Real-time streaming — WebSocket, Kafka, sub-10ms latency |

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
  status: 'coming-soon', // 'ga' | 'beta' | 'preview' | 'coming-soon'
  tier: 'enterprise',    // 'open-source' | 'enterprise' | 'platform'
  color: '#8b5cf6',
  accentColor: 'rgba(139, 92, 246, 0.1)',
  iconName: 'my-icon',
  homePath: '/product/my-product',
  docsRoot: 'https://my-product.vercel.app/docs',
  primaryDemoPath: 'https://my-product.vercel.app/demo',
  stats: [...],
  keyFeatures: [...],
  quickLinks: [...],
  tags: [...],
  seo: {
    title: 'My Product — Description | Tekivex',
    description: '...',
    keywords: [...],
    jsonLdType: 'SoftwareApplication',
  },
};
```

**Step 2 — Register it:**

```ts
// src/platform/registry.ts
import { myProductManifest } from './manifest-myproduct';

const PRODUCT_MANIFESTS: ProductManifest[] = [
  // existing products...
  myProductManifest, // ← add here
];
```

Done. The launcher, nav dropdown, product page, and SEO all pick it up automatically.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | CSS custom properties (no CSS-in-JS) |
| Routing | Hash-based (`#/products`, `#/product/:id`) |
| SEO | Dynamic `useSeo` hook — injects `<title>`, OG, Twitter, JSON-LD per route |
| Deployment | Vercel (SPA catch-all route) |

**No external UI library. No state management library. Zero workspace dependencies** — fully standalone.

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/007krcs/tekivex.git
cd tekivex

# 2. Install
npm install

# 3. Dev server (http://localhost:5173)
npm run dev

# 4. Production build
npm run build
```

---

## Project Structure

```
tekivex/
├── index.html               # Static SEO: OG, Twitter, JSON-LD Organization schema
├── public/
│   ├── robots.txt           # Crawl rules + sitemap pointer
│   ├── sitemap.xml          # All product pages with priority/changefreq
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── App.tsx              # Hash router (/, /products, /product/:id)
│   ├── main.tsx
│   ├── styles.css
│   ├── platform/
│   │   ├── types.ts              # ProductManifest interface + SEO types
│   │   ├── registry.ts           # Product list + getProduct() helpers
│   │   ├── PlatformProvider.tsx  # React context (config, products, navigate)
│   │   ├── useSeo.ts             # Dynamic <head> injection hook
│   │   ├── seoConfig.ts          # Per-route SeoConfig map
│   │   ├── manifest-gridstorm.ts
│   │   ├── manifest-pdf-toolkit.ts
│   │   ├── manifest-nexa-recruit.ts
│   │   ├── manifest-nexa-care.ts
│   │   └── manifest-coming-soon.ts
│   ├── pages/
│   │   ├── PlatformPage.tsx      # /products — product launcher
│   │   └── ProductHomePage.tsx   # /product/:id — individual product page
│   ├── layout/
│   │   ├── TopNav.tsx       # Brand + ProductSwitcher dropdown
│   │   └── Footer.tsx       # 6-column footer with all product links
│   ├── icons/
│   │   ├── Icon.tsx         # <Icon name="grid" size={20} />
│   │   └── paths.ts         # SVG path registry (30+ icons)
│   └── theme/
│       ├── ThemeProvider.tsx
│       └── ThemeToggle.tsx
└── vercel.json              # SPA catch-all: all routes → /index.html
```

---

## SEO Strategy

Every route gets unique `<title>`, `<meta description>`, Open Graph, Twitter Card, and a `SoftwareApplication` JSON-LD schema injected dynamically by `useSeo()`:

```
/ (home)                  → Tekivex Organization schema
/products                 → product catalog page
/product/gridstorm        → GridStorm SoftwareApplication schema
/product/nexa-recruit     → NexaRecruit SoftwareApplication schema
/product/nexa-care        → NexaCare SoftwareApplication schema
... etc
```

Static fallbacks in `index.html` serve crawlers that don't execute JavaScript.

---

## Deployment (Vercel)

1. Import `007krcs/tekivex` in Vercel
2. Framework preset: **Other**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy — `vercel.json` serves all routes from `index.html`

---

## License

MIT — see [LICENSE](./LICENSE)
