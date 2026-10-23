// Helper for scripts/orientation-evidence.py: convert each test JPEG to a PDF
// with the site's JPG to PDF engine, as it is now and as it was before the
// EXIF-orientation fix (commit 558cac6), so the two can be compared.
//
//   node scripts/orientation-convert.mjs <dir>
//
// Reads <dir>/o1.jpg … o8.jpg, writes <dir>/after-oN.pdf and before-oN.pdf.

import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(process.argv[2]);
const BEFORE_COMMIT = '558cac6';

async function engine(entry, tmp, name) {
  const outfile = join(tmp, `${name}.mjs`);
  await build({ entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', outfile, logLevel: 'silent' });
  return import(pathToFileURL(outfile).href);
}

const tmp = mkdtempSync(join(tmpdir(), 'orientation-'));
// The old engine has to sit inside the repo so it resolves pdf-lib from node_modules.
const oldSrc = join(ROOT, 'src/tools/lib/_pdf_before_fix.ts');
try {
  writeFileSync(oldSrc, execSync(`git show ${BEFORE_COMMIT}:src/tools/lib/pdf.ts`, { cwd: ROOT }));
  const after = await engine(join(ROOT, 'src/tools/lib/pdf.ts'), tmp, 'after');
  const before = await engine(oldSrc, tmp, 'before');
  for (let o = 1; o <= 8; o++) {
    const bytes = Uint8Array.from(readFileSync(join(dir, `o${o}.jpg`))).buffer;
    const file = { name: `o${o}.jpg`, type: 'image/jpeg', bytes };
    writeFileSync(join(dir, `after-o${o}.pdf`), await after.imagesToPdf([file]));
    writeFileSync(join(dir, `before-o${o}.pdf`), await before.imagesToPdf([{ ...file, bytes: bytes.slice(0) }]));
  }
  console.log('converted 8 orientations with both engines');
} finally {
  rmSync(oldSrc, { force: true });
  rmSync(tmp, { recursive: true, force: true });
}
