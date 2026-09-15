// Read-only post-deploy checks. No credentials and no AdSense review submission.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base = new URL(process.argv[2] || 'https://www.tekivex.com');
const render = readFileSync(new URL('../render.yaml', import.meta.url), 'utf8');
let failures = 0;
async function check(path, verify) {
  try {
    const response = await fetch(new URL(path, base), {redirect:'manual', signal:AbortSignal.timeout(20000)});
    await verify(response);
    console.log(`PASS ${path}`);
  } catch(error) { failures++; console.error(`FAIL ${path}: ${error.message}`); }
}
for (const m of render.matchAll(/type:\s*redirect\s+source:\s*(\S+)\s+destination:\s*(\S+)/g)) {
  await check(m[1], r=>{
    assert.ok([301,308].includes(r.status), `expected permanent redirect, received ${r.status}`);
    assert.equal(new URL(r.headers.get('location'), base).href, new URL(m[2],base).href);
  });
}
await check('/readiness-check-nonexistent-page',r=>assert.equal(r.status,404));
for (const path of ['/gridstorm/','/gridstorm/docs/','/gridstorm/docs/getting-started/introduction/']) {
  await check(path, async r=>{
    assert.equal(r.status,200);
    const html=await r.text();
    assert.ok(html.includes(`href="https://www.tekivex.com${path}"`),'expected canonical missing');
  });
}
await check('/gridstorm/sitemap.xml',async r=>{assert.equal(r.status,200);assert.ok(!(await r.text()).includes('#'),'fragment sitemap URLs remain');});
process.exitCode=failures?1:0;
