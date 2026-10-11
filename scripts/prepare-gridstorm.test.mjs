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
    writeFileSync(join(root,'hub-assets/intro.js'),'throw new Error("must never execute");const text="---\\ntitle: Introduction\\n---\\nA useful introduction. This is an enterprise plugin that requires a license for production use. [Read again](/getting-started/introduction/)";export {text as default};');
    expect(prepareGridstorm(root)).toBe(1);
    const html=readFileSync(join(root,'docs/getting-started/introduction/index.html'),'utf8');
    expect(html).toContain('<h1>Introduction</h1>');
    expect(html).toContain('href="/gridstorm/docs/getting-started/introduction/"');
    const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
    expect(sitemap).not.toContain('#');
    expect(sitemap).toContain('/gridstorm/docs/getting-started/introduction/');
    expect(sitemap).not.toContain('<loc>https://www.tekivex.com/gridstorm/</loc>'); // app shell is not content
    expect(readFileSync(join(root,'index.html'),'utf8')).toContain('content="noindex, follow"');
    expect(html).not.toContain('noindex');
    expect(html).not.toMatch(/licen[cs]e/i); // GridStorm has no paid tier
    expect(html).toContain('<meta name="description" content="A useful introduction. Read again">');
    expect(html).toContain('"@type":"TechArticle"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(readFileSync(join(root,'docs/index.html'),'utf8')).toContain('A useful introduction.');
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
