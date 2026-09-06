#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// fetch-apps.mjs — vendor the product apps into this site's build tree.
//
// Each app lives in its own repo and publishes its fully-built static site
// (with the right base path baked in) to a `build` branch via its own
// GitHub Actions workflow. Here we simply clone that branch and drop the
// files into dist/<path>/, so ONE deploy of www.tekivex.com serves:
//
//   /ui         ← tekivex-ui        (landing + /playground + /book + docs)
//   /gridstorm  ← grid-data         (hub + example apps + Astro docs)
//   /analytics  ← analytics-builder (demo app)
//   /dataflow   ← dataflow          (demo app)
//
// One domain, one routing tree, no subdomains — and no cross-repo builds:
// this script never installs or compiles anything, it only copies.
//
// Every app has a published `build` branch, so a fetch failure is a real
// problem, not a "not yet" state. A transient clone error is retried; a
// persistent one FAILS the build on Render/CI (STRICT) so the previous good
// deploy stays live instead of shipping a site with a 404'ing product path.
// Locally it degrades to a warning so the marketing site can still be worked
// on offline. Override either way with FETCH_APPS_STRICT=1|0.
// ─────────────────────────────────────────────────────────────────────────────
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const TMP = join(ROOT, '.tmp-apps');
const STRICT =
  process.env.FETCH_APPS_STRICT != null
    ? process.env.FETCH_APPS_STRICT !== '0'
    : Boolean(process.env.RENDER || process.env.CI);
const ATTEMPTS = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Clone with retries; resolves to null on success or the last git error text. */
async function cloneBuildBranch(repo, dest) {
  let lastErr = '';
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    rmSync(dest, { recursive: true, force: true });
    try {
      execSync(
        `git clone --quiet --depth 1 --branch build --single-branch "${repo}" "${dest}"`,
        { stdio: ['ignore', 'pipe', 'pipe'] },
      );
      return null;
    } catch (e) {
      lastErr = String(e?.stderr ?? e?.message ?? e).trim();
      if (attempt < ATTEMPTS) {
        const wait = 2000 * attempt;
        console.warn(`  ↻ clone of ${repo}#build failed (attempt ${attempt}/${ATTEMPTS}), retrying in ${wait / 1000}s: ${lastErr.split('\n')[0]}`);
        await sleep(wait);
      }
    }
  }
  return lastErr || 'unknown git error';
}

const APPS = [
  { path: 'ui',        repo: 'https://github.com/novaai0401-ui/tekivex-ui.git' },
  { path: 'gridstorm', repo: 'https://github.com/novaai0401-ui/grid-data.git' },
  { path: 'analytics', repo: 'https://github.com/novaai0401-ui/analytics-builder.git' },
  { path: 'dataflow',  repo: 'https://github.com/novaai0401-ui/dataflow.git' },
];

if (!existsSync(DIST)) {
  console.error('fetch-apps: dist/ not found — run vite build + prerender first');
  process.exit(1);
}

let ok = 0;
const failed = [];
for (const app of APPS) {
  const clone = join(TMP, app.path);
  const target = join(DIST, app.path);
  const err = await cloneBuildBranch(app.repo, clone);
  if (err) {
    console.error(`✗ /${app.path}: could not fetch ${app.repo}#build after ${ATTEMPTS} attempts\n    ${err.replace(/\n/g, '\n    ')}`);
    failed.push(app.path);
    continue;
  }
  rmSync(join(clone, '.git'), { recursive: true, force: true });
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(clone, target, { recursive: true });
  const entries = readdirSync(target).length;
  if (!existsSync(join(target, 'index.html'))) {
    console.error(`✗ /${app.path}: vendored ${entries} entries but no index.html at the root`);
    failed.push(app.path);
    continue;
  }
  console.log(`✓ /${app.path}: vendored ${entries} top-level entries from ${app.repo}#build`);
  ok++;
}
rmSync(TMP, { recursive: true, force: true });

if (failed.length) {
  const msg = `apps vendored — ${ok} ok, ${failed.length} FAILED (${failed.map((p) => '/' + p).join(', ')})`;
  if (STRICT) {
    console.error(`✗ ${msg} — failing the build so the last good deploy stays live`);
    process.exit(1);
  }
  console.warn(`⚠ ${msg} — continuing because FETCH_APPS_STRICT is off (local build)`);
} else {
  console.log(`✓ apps vendored — ${ok} ok`);
}
