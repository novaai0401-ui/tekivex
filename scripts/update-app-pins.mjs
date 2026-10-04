#!/usr/bin/env node
// Move apps.lock.json pins to the current tip of each app's `build` branch.
// Review what changed upstream, then build and run scripts/audit-dist.mjs
// before committing the new pins:  node scripts/update-app-pins.mjs [app…]
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const file = new URL('../apps.lock.json', import.meta.url);
const lock = JSON.parse(readFileSync(file, 'utf8'));
const only = process.argv.slice(2);
for (const [path, app] of Object.entries(lock)) {
  if (path.startsWith('_') || (only.length && !only.includes(path))) continue;
  const tip = execSync(`git ls-remote "${app.repo}" refs/heads/build`).toString().split(/\s/)[0];
  if (!/^[0-9a-f]{40}$/.test(tip)) throw new Error(`/${path}: no build branch at ${app.repo}`);
  console.log(`${tip === app.commit ? '=' : '↑'} /${path}: ${app.commit.slice(0, 12)} → ${tip.slice(0, 12)}`);
  app.commit = tip;
}
writeFileSync(file, JSON.stringify(lock, null, 2) + '\n');
