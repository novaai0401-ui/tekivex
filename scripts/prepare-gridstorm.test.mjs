import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareGridstorm} from './prepare-gridstorm.mjs';

it('publishes Markdown without executing imported code and preserves doc links',()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-docs-'));
  try {
    mkdirSync(join(root,'hub-assets'));
    writeFileSync(join(root,'index.html'),'<html><head><meta name="robots" content="index, follow" /><link rel="canonical" href="https://gridstorm.tekivex.com/"></head><body></body></html>');
    mkdirSync(join(root,'playground'));
    writeFileSync(join(root,'playground/index.html'),'<html><head><title>Playground</title></head><body><div id="root"></div></body></html>');
    writeFileSync(join(root,'sitemap.xml'),'<urlset><url><loc>https://www.tekivex.com/gridstorm/#/docs</loc></url></urlset>');
    writeFileSync(join(root,'hub-assets/index.js'),'const docs={"../../docs/src/content/docs/getting-started/introduction.md":()=>Q(()=>import("./intro.js"),[])};');
    writeFileSync(join(root,'hub-assets/intro.js'),'throw new Error("must never execute");const text="---\\ntitle: Introduction\\n---\\nA useful introduction. [Read again](/getting-started/introduction/)";export {text as default};');
    expect(prepareGridstorm(root)).toBe(1);
    const html=readFileSync(join(root,'docs/getting-started/introduction/index.html'),'utf8');
    expect(html).toContain('<h1>Introduction</h1>');
    expect(html).toContain('href="/gridstorm/docs/getting-started/introduction/"');
    const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
    expect(sitemap).not.toContain('#');
    expect(sitemap).not.toContain('<loc>https://www.tekivex.com/gridstorm/</loc>'); // hub shell not listed
    expect(sitemap).toContain('<loc>https://www.tekivex.com/gridstorm/docs/getting-started/introduction/</loc>');
    const hub=readFileSync(join(root,'index.html'),'utf8');
    expect(hub).toContain('<meta name="robots" content="noindex, follow" />');
    expect(hub).not.toContain('content="index, follow"');
    expect(hub.match(/name="robots"/g)).toHaveLength(1);
    expect(readFileSync(join(root,'playground/index.html'),'utf8')).toContain('noindex, follow');
    expect(html).not.toContain('noindex');
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
