# Tekivex launch kit

Promotional assets for the Tekivex platform. **Not part of the app build** —
`vite build` only includes the root `index.html` + `src/`, so nothing here ships
to production or affects tests.

## 🎬 `promo.html` — animated launch promo (screen-record this)

A self-contained, dependency-free animated promo. **50 seconds, 1080×1080**
(square — best for X/Twitter and Instagram autoplay). Message: open source &
**free forever** — no pricing or competitor references.

### Scene order
1. Hook — "Enterprise developer tools, open and free."
2. Brand lockup — Tekivex · 6 products · MIT · Free forever
3. GridStorm — live data grid, 100K rows @ 60fps
4. Pyntra — fill + sign + AES-256 encrypt a PDF in-browser
5. Analytics Studio · DataFlow · Quantum Vault montage
6. Tekivex UI — 50+ accessible components
7. New: 27 engineering deep-dives (/use-cases)
8. CTA — "Free forever. No paywalls." → tekivex.com

### How to record it
1. Open `marketing/promo.html` in Chrome (double-click, or `open marketing/promo.html`).
2. Click **● Recording mode** to hide the on-screen controls.
3. The animation auto-plays and loops via **▶ Replay** (50s total).
4. Capture the dark square with any screen recorder:
   - **macOS:** QuickTime → New Screen Recording, or `⇧⌘5`, drag a square selection.
   - **Built-in browser capture:** use a tab/region recorder (Loom, OBS, ScreenStudio) cropped to the square.
   - For a crisp 1080×1080 file, click **⤢ Toggle 1:1** and maximize the window so the stage renders at native size, then crop to the square in your editor.
5. Add the music track in your editor (upbeat minimal-tech, ~120 BPM). The promo
   is timed for hard cuts on the beat.

### Cuts
- **Full:** 50s (all 8 scenes) — landing page / YouTube / LinkedIn.
- **15s teaser** (for the tweet): record scenes 1 → 3 (GridStorm) → 8 (CTA).

### Tweak
Everything is inline HTML/CSS/JS. Scene timings live in the `timeline` array in
the `<script>` at the bottom; colors are CSS variables in `:root`.

## 🐦 Suggested X/Twitter copy (free-focused, no pricing)

**Single tweet:**
> Tekivex: open-source enterprise dev tools. MIT-licensed. Free forever. No paywalls.
>
> ⚡ GridStorm — 100K-row data grid @ 60fps
> 📄 Pyntra — PDF editing in the browser
> 📊 Analytics Studio — drag-&-drop BI
> 🔐 Quantum Vault — post-quantum tokens
>
> 👉 tekivex.com

Post the video **natively** (don't link out — native autoplay gets far more
reach), Tue–Thu ~9–11am ET, and drop the repo link in a reply rather than the
first tweet.
