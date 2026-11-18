#!/usr/bin/env node
// Dependency audit with a short, dated list of accepted advisories.
//
// Same gate as `npm audit --audit-level=high`, with one difference: an
// advisory listed in ALLOW below does not fail the build until its date
// passes. Use it only when no fixed version exists and the risk has been
// judged. Every entry needs a reason and an end date, so it cannot linger.
//
// Fails when:
//   • any high or critical advisory is not in ALLOW;
//   • an ALLOW entry's date has passed (look again: is a fix out?).
// Warns (does not fail) when an ALLOW entry no longer matches anything, so
// it can be deleted.
//
// Usage: node scripts/audit-deps.mjs   (runs `npm audit --json` itself)
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ALLOW = [
  {
    id: 'GHSA-fc5q-39xc-vjpf',
    package: 'picomatch',
    until: '2027-01-31',
    reason:
      'ReDoS in extglob patterns, affecting every picomatch release up to 4.0.7 with no fixed ' +
      'version published (checked 2026-11-18). It reaches us only through Vite and Vitest, which ' +
      'run at build and test time on our own glob patterns, never on input from site visitors. ' +
      'npm audit\'s suggested fix downgrades Vite and Vitest by major versions. Remove this entry ' +
      'once a patched picomatch is released and the lockfile picks it up.',
  },
];

const SEVERE = new Set(['high', 'critical']);

/** The advisory id from a GitHub advisory URL, or null. */
export function advisoryId(url) {
  const m = /\/(GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4})\b/i.exec(String(url || ''));
  return m ? m[1] : null;
}

/**
 * Judge `npm audit --json` output against the allow list.
 * Returns what fails the build, what is accepted, and what in the list is
 * expired or no longer needed.
 */
export function judge(report, allow = ALLOW, today = new Date()) {
  const day = today.toISOString().slice(0, 10);
  const byId = new Map(allow.map((a) => [a.id, a]));
  const failing = [];
  const accepted = [];
  const expired = [];
  const seen = new Set();

  for (const [name, vuln] of Object.entries(report?.vulnerabilities ?? {})) {
    // `via` holds advisory objects for the package that has the flaw, and
    // plain package names for packages that only depend on it. Judging the
    // advisories is enough: a dependent is only flagged because of them.
    for (const via of vuln.via ?? []) {
      if (typeof via !== 'object' || !via) continue;
      if (!SEVERE.has(via.severity)) continue;
      const id = advisoryId(via.url) ?? `npm-${via.source}`;
      const key = `${id}:${name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const entry = { id, package: name, title: via.title, range: via.range, severity: via.severity };
      const ok = byId.get(id);
      if (!ok || ok.package !== name) failing.push(entry);
      else if (ok.until < day) { expired.push({ ...entry, until: ok.until }); failing.push(entry); }
      else accepted.push({ ...entry, until: ok.until });
    }
  }

  const matched = new Set(accepted.map((a) => a.id).concat(expired.map((a) => a.id)));
  const unused = allow.filter((a) => !matched.has(a.id)).map((a) => a.id);
  return { failing, accepted, expired, unused };
}

function main() {
  let raw;
  try {
    raw = execSync('npm audit --json', { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  } catch (e) {
    // npm audit exits non-zero when it finds anything; the JSON is still on stdout.
    raw = e.stdout?.toString() ?? '';
  }
  let report;
  try { report = JSON.parse(raw); } catch {
    console.error('✗ audit-deps: npm audit did not return JSON');
    console.error(raw.slice(0, 2000));
    process.exit(1);
  }
  if (report.error) {
    console.error(`✗ audit-deps: npm audit failed: ${report.error.summary ?? JSON.stringify(report.error)}`);
    process.exit(1);
  }

  const { failing, accepted, expired, unused } = judge(report);
  for (const a of accepted) console.log(`• accepted until ${a.until}: ${a.id} in ${a.package} (${a.severity}) ${a.title}`);
  for (const id of unused) console.warn(`⚠ ALLOW entry ${id} no longer matches anything; remove it from scripts/audit-deps.mjs`);
  for (const e of expired) console.error(`✗ ALLOW entry for ${e.id} expired on ${e.until}: check for a fixed version, then remove it or set a new date with a reason`);
  for (const f of failing) console.error(`✗ ${f.severity}: ${f.id} in ${f.package} (${f.range}) ${f.title}`);
  if (failing.length) {
    console.error(`✗ audit-deps: ${failing.length} high or critical advisor${failing.length === 1 ? 'y' : 'ies'} not accepted`);
    process.exit(1);
  }
  console.log(`✓ audit-deps: no unaccepted high or critical advisories${accepted.length ? ` (${accepted.length} accepted)` : ''}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
