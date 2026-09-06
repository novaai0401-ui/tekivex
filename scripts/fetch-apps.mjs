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
// An app whose `build` branch doesn't exist yet is skipped with a warning so
// the marketing site can always deploy; the path just 404s until the app
// repo has published a build.
// ─────────────────────────────────────────────────────────────────────────────
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const TMP = join(ROOT, '.tmp-apps');

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
let skipped = 0;
for (const app of APPS) {
  const clone = join(TMP, app.path);
  const target = join(DIST, app.path);
  rmSync(clone, { recursive: true, force: true });
  try {
    execSync(
      `git clone --quiet --depth 1 --branch build --single-branch "${app.repo}" "${clone}"`,
      { stdio: 'pipe' },
    );
  } catch {
    console.warn(`⚠ /${app.path}: no \`build\` branch on ${app.repo} yet — skipped`);
    skipped++;
    continue;
  }
  rmSync(join(clone, '.git'), { recursive: true, force: true });
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(clone, target, { recursive: true });
  const entries = readdirSync(target).length;
  if (!existsSync(join(target, 'index.html'))) {
    console.warn(`⚠ /${app.path}: vendored ${entries} entries but no index.html at the root`);
  }
  console.log(`✓ /${app.path}: vendored ${entries} top-level entries from ${app.repo}#build`);
  ok++;
}
rmSync(TMP, { recursive: true, force: true });
console.log(`✓ apps vendored — ${ok} ok, ${skipped} skipped`);
