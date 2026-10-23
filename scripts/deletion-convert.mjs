// Helper for scripts/pdf-structure-comparison.py: build the shared-resources
// test PDF and delete its page 2 with the site's engine, as it is now and as
// it was before the hidden-image fix (commit 558cac6).
//
//   node scripts/deletion-convert.mjs <dir>
//
// Writes <dir>/shared.pdf, <dir>/tekivex-before-delete.pdf, <dir>/tekivex-after-delete.pdf.

import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sharedResourcesPdf } from './tool-evidence.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(process.argv[2]);
const BEFORE_COMMIT = '558cac6';

async function engine(entry, tmp, name) {
  const outfile = join(tmp, `${name}.mjs`);
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'silent' });
  return import(pathToFileURL(outfile).href);
}

const tmp = mkdtempSync(join(tmpdir(), 'deletion-'));
const oldSrc = join(ROOT, 'src/tools/lib/_pdf_before_fix.ts');
try {
  const shared = await sharedResourcesPdf();
  writeFileSync(join(dir, 'shared.pdf'), shared);
  writeFileSync(oldSrc, execSync(`git show ${BEFORE_COMMIT}:src/tools/lib/pdf.ts`, { cwd: ROOT }));
  for (const [name, entry] of [['before', oldSrc], ['after', join(ROOT, 'src/tools/lib/pdf.ts')]]) {
    const mod = await engine(entry, tmp, name);
    writeFileSync(join(dir, `tekivex-${name}-delete.pdf`), await mod.removePages(shared.slice().buffer, 'shared.pdf', [1]));
  }
  console.log('built shared-resources test file and both deletions');
} finally {
  rmSync(oldSrc, { force: true });
  rmSync(tmp, { recursive: true, force: true });
}
