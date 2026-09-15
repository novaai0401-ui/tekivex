import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareGridstorm} from './prepare-gridstorm.mjs';

it('publishes Markdown without executing imported code and preserves doc links',()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-docs-'));
  try {
    mkdirSync(join(root,'hub-assets'));
    writeFileSync(join(root,'index.html'),'<html><head><link rel="canonical" href="https://gridstorm.tekivex.com/"></head><body></body></html>');
    writeFileSync(join(root,'sitemap.xml'),'<urlset><url><loc>https://www.tekivex.com/gridstorm/#/docs</loc></url></urlset>');
    writeFileSync(join(root,'hub-assets/index.js'),'const docs={"../../docs/src/content/docs/getting-started/introduction.md":()=>Q(()=>import("./intro.js"),[])};');
    writeFileSync(join(root,'hub-assets/intro.js'),'throw new Error("must never execute");const text="---\\ntitle: Introduction\\n---\\nA useful introduction. [Read again](/getting-started/introduction/)";export {text as default};');
    expect(prepareGridstorm(root)).toBe(1);
    const html=readFileSync(join(root,'docs/getting-started/introduction/index.html'),'utf8');
    expect(html).toContain('<h1>Introduction</h1>');
    expect(html).toContain('href="/gridstorm/docs/getting-started/introduction/"');
    expect(readFileSync(join(root,'sitemap.xml'),'utf8')).not.toContain('#');
    expect(readFileSync(join(root,'sitemap-index.xml'),'utf8')).not.toContain('/docs/sitemap');
    expect(prepareGridstorm(root)).toBe(1); // repeat build stays valid
  } finally {rmSync(root,{recursive:true,force:true});}
});

it('fails when the upstream documentation format disappears',()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-docs-'));
  try {
    mkdirSync(join(root,'hub-assets'));
    expect(()=>prepareGridstorm(root)).toThrow('import map changed');
  } finally {rmSync(root,{recursive:true,force:true});}
});
