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
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareGridstorm } from './prepare-gridstorm.mjs';
import { prepareUi } from './prepare-ui.mjs';
import { prepareDataflow } from './prepare-dataflow.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const TMP = join(ROOT, '.tmp-apps');
const STRICT =
  process.env.FETCH_APPS_STRICT != null
    ? process.env.FETCH_APPS_STRICT !== '0'
    : Boolean(process.env.RENDER || process.env.CI);
const ATTEMPTS = 4;

// The app repos must be PUBLIC for an anonymous clone to work (Render and CI
// have no GitHub credentials). If one has to stay private, set
// APPS_GITHUB_TOKEN in the Render/CI environment to a fine-grained token with
// read-only "Contents" access to that repo; it is injected via an extraHeader
// so it never appears in the clone URL, remotes, or logs.
const TOKEN = process.env.APPS_GITHUB_TOKEN || '';
const AUTH = TOKEN
  ? `-c http.https://github.com/.extraheader="AUTHORIZATION: basic ${Buffer.from('x-access-token:' + TOKEN).toString('base64')}"`
  : '';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch one app with retries; resolves to null on success or the last git
 * error text. With a commit, fetches exactly that commit (the reviewed pin);
 * without one, the tip of the `build` branch (APPS_FOLLOW_BRANCH=1 previews).
 */
async function fetchApp(repo, dest, commit) {
  let lastErr = '';
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    rmSync(dest, { recursive: true, force: true });
    try {
      const opts = { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } };
      if (commit) {
        execSync(`git init --quiet "${dest}"`, opts);
        execSync(`git ${AUTH} -C "${dest}" fetch --quiet --depth 1 "${repo}" ${commit}`, opts);
        execSync(`git -C "${dest}" checkout --quiet FETCH_HEAD`, opts);
      } else {
        execSync(`git ${AUTH} clone --quiet --depth 1 --branch build --single-branch "${repo}" "${dest}"`, opts);
      }
      return null;
    } catch (e) {
      lastErr = String(e?.stderr ?? e?.message ?? e).trim();
      if (/could not read Username|Authentication failed|Repository not found/i.test(lastErr)) {
        lastErr += `\n    → ${repo} is private or missing. Make it public, or set APPS_GITHUB_TOKEN (read-only Contents) in the build environment.`;
        break; // credentials won't appear on retry
      }
      if (attempt < ATTEMPTS) {
        const wait = 2000 * attempt;
        console.warn(`  ↻ clone of ${repo}#build failed (attempt ${attempt}/${ATTEMPTS}), retrying in ${wait / 1000}s: ${lastErr.split('\n')[0]}`);
        await sleep(wait);
      }
    }
  }
  return lastErr || 'unknown git error';
}

// Each app is pinned to a reviewed commit in apps.lock.json, so a push to an
// app's build branch never changes the live site on its own.
const LOCK = JSON.parse(readFileSync(join(ROOT, 'apps.lock.json'), 'utf8'));
const FOLLOW = process.env.APPS_FOLLOW_BRANCH === '1';
const APPS = Object.entries(LOCK)
  .filter(([path]) => !path.startsWith('_'))
  .map(([path, { repo, commit }]) => {
    if (!FOLLOW && !/^[0-9a-f]{40}$/.test(commit || '')) throw new Error(`apps.lock.json: /${path} needs a full 40-character commit`);
    return { path, repo, commit: FOLLOW ? null : commit };
  });
if (FOLLOW) console.warn('⚠ APPS_FOLLOW_BRANCH=1 — vendoring unreviewed build-branch tips, not the pinned commits');

if (!existsSync(DIST)) {
  console.error('fetch-apps: dist/ not found — run vite build + prerender first');
  process.exit(1);
}

let ok = 0;
const failed = [];
// Deploy record: which commit of this site and of every app is live.
const siteCommit = process.env.RENDER_GIT_COMMIT || (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return null; } })();
const manifest = { builtAt: new Date().toISOString(), site: { commit: siteCommit }, apps: {} };
for (const app of APPS) {
  const clone = join(TMP, app.path);
  const target = join(DIST, app.path);
  const ref = app.commit || 'build';
  const err = await fetchApp(app.repo, clone, app.commit);
  if (err) {
    console.error(`✗ /${app.path}: could not fetch ${app.repo}@${ref} after ${ATTEMPTS} attempts\n    ${err.replace(/\n/g, '\n    ')}`);
    failed.push(app.path);
    continue;
  }
  const commit = execSync(`git -C "${clone}" rev-parse HEAD`).toString().trim();
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
  console.log(`✓ /${app.path}: vendored ${entries} top-level entries from ${app.repo}@${commit.slice(0, 12)}`);
  manifest.apps[app.path] = { repo: app.repo, commit, pinned: Boolean(app.commit) };
  if (app.path === 'gridstorm') prepareGridstorm(target);
  if (app.path === 'ui') await prepareUi(target);
  if (app.path === 'dataflow') prepareDataflow(target);
  ok++;
}
rmSync(TMP, { recursive: true, force: true });
writeFileSync(join(DIST, 'deploy-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

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
