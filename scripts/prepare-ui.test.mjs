import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareUi,MIN_WORDS} from './prepare-ui.mjs';

const AD_LOADER='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630229006617891" crossorigin="anonymous"></script>';
const page=(words,extra='')=>`<!doctype html><html><head><meta name="robots" content="index, follow">${AD_LOADER}</head><body><h1>Title</h1><p>${'word '.repeat(words)}</p>${extra}<script>window.x=1</script></body></html>`;

it('strips every ad tag, noindexes thin shells and lists only substantial pages',async()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-ui-'));
  try {
    mkdirSync(join(root,'docs/button'),{recursive:true});
    mkdirSync(join(root,'components/button'),{recursive:true});
    writeFileSync(join(root,'index.html'),page(40));
    writeFileSync(join(root,'404.html'),page(400));
    writeFileSync(join(root,'sitemap-0.xml'),'<urlset/>');
    writeFileSync(join(root,'docs/button/index.html'),page(60,'<ins class="adsbygoogle" data-ad-client="ca-pub-1"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({})</script>'));
    writeFileSync(join(root,'components/button/index.html'),page(MIN_WORDS+50));
    const result=await prepareUi(root);
    expect(result.adsRemoved).toBe(6); // 4 loaders + <ins> + push()
    expect(result.indexable).toEqual(['/components/button/']);
    for (const f of ['index.html','docs/button/index.html','components/button/index.html','404.html']) {
      expect(readFileSync(join(root,f),'utf8')).not.toMatch(/adsbygoogle|googlesyndication/);
    }
    expect(readFileSync(join(root,'index.html'),'utf8')).toContain('content="noindex, follow"');
    expect(readFileSync(join(root,'docs/button/index.html'),'utf8')).toContain('content="noindex, follow"');
    expect(readFileSync(join(root,'404.html'),'utf8')).toContain('content="noindex, follow"');
    expect(readFileSync(join(root,'components/button/index.html'),'utf8')).toContain('content="index, follow"');
    const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
    expect(sitemap).toContain('<loc>https://www.tekivex.com/ui/components/button/</loc>');
    expect(sitemap).not.toContain('/ui/docs/button/');
    expect(sitemap).not.toContain('<loc>https://www.tekivex.com/ui/</loc>');
    expect(readFileSync(join(root,'sitemap-index.xml'),'utf8')).toContain('/ui/sitemap.xml');
    expect(existsSync(join(root,'sitemap-0.xml'))).toBe(false);
    expect((await prepareUi(root)).indexable).toEqual(['/components/button/']); // repeat build stays valid
  } finally {rmSync(root,{recursive:true,force:true});}
});

it('refuses to publish a build with no substantial pages',async()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-ui-'));
  try {
    writeFileSync(join(root,'index.html'),page(10));
    await expect(prepareUi(root)).rejects.toThrow('no substantial pages');
  } finally {rmSync(root,{recursive:true,force:true});}
});

it('re-prefixes base-less links, follows renames and unlinks fake demo URLs',async()=>{
  const dist=mkdtempSync(join(tmpdir(),'tekivex-ui-links-'));
  const root=join(dist,'ui');
  try {
    for (const d of ['components/button','components/theme-builder','playground']) mkdirSync(join(root,d),{recursive:true});
    writeFileSync(join(dist,'index.html'),'<html></html>');
    writeFileSync(join(root,'components/theme-builder/index.html'),page(MIN_WORDS+10));
    writeFileSync(join(root,'playground/index.html'),page(MIN_WORDS+10));
    writeFileSync(join(root,'components/button/index.html'),page(MIN_WORDS+10,
      '<a href="/components/theme-builder/#api">a</a><a href="/playground/?c=button">b</a><a href="/ui/theme-builder/">c</a>'+
      '<a href="/">home</a><a href="/2026/q2">demo</a><a href="https://github.com/x">ext</a><a href="#top">hash</a>'));
    const {links}=await prepareUi(root);
    expect(links).toEqual({prefixed:2,renamed:1,neutralised:1});
    const html=readFileSync(join(root,'components/button/index.html'),'utf8');
    expect(html).toContain('href="/ui/components/theme-builder/#api"');
    expect(html).toContain('href="/ui/playground/?c=button"');
    expect(html).toContain('href="/ui/components/theme-builder/">c');
    expect(html).toContain('href="/">home');
    expect(html).toContain('<a data-unlinked-href="/2026/q2">demo</a>');
    expect(html).toContain('href="https://github.com/x"');
  } finally {rmSync(dist,{recursive:true,force:true});}
});

it('gives pages that share a title distinct titles',async()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-ui-titles-'));
  try {
    for (const d of ['components/toast','components/toast-provider']) {
      mkdirSync(join(root,d),{recursive:true});
      writeFileSync(join(root,d,'index.html'),page(MIN_WORDS+10).replace('<head>','<head><title>TkxToast | TekiVex UI</title>'));
    }
    expect((await prepareUi(root)).retitled).toBe(2);
    expect(readFileSync(join(root,'components/toast-provider/index.html'),'utf8')).toContain('<title>TkxToast — Toast Provider | TekiVex UI</title>');
    expect(readFileSync(join(root,'components/toast/index.html'),'utf8')).toContain('<title>TkxToast — Toast | TekiVex UI</title>');
  } finally {rmSync(root,{recursive:true,force:true});}
});

it('judges thinness on the page content, not the sidebar, and drops placeholder pages',async()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-ui-content-'));
  try {
    const sidebar=`<nav aria-label="Main">${'<a href="/ui/x/">Component link</a>'.repeat(200)}</nav>`;
    const starlight=(words,extra='')=>`<!doctype html><html><head><title>T</title></head><body>${sidebar}<main><div class="sl-markdown-content"><h1>Title</h1><p>${'word '.repeat(words)}</p>${extra}</div></main></body></html>`;
    for (const d of ['components/stub','components/real','components/scaffold']) mkdirSync(join(root,d),{recursive:true});
    writeFileSync(join(root,'components/stub/index.html'),starlight(60));
    writeFileSync(join(root,'components/real/index.html'),starlight(MIN_WORDS+40));
    writeFileSync(join(root,'components/scaffold/index.html'),starlight(MIN_WORDS+400,'<p>This page is a generated scaffold. It will be replaced with hand-authored examples.</p>'));
    const {indexable}=await prepareUi(root);
    expect(indexable).toEqual(['/components/real/']);
    expect(readFileSync(join(root,'components/stub/index.html'),'utf8')).toContain('content="noindex, follow"');
    expect(readFileSync(join(root,'components/scaffold/index.html'),'utf8')).toContain('content="noindex, follow"');
  } finally {rmSync(root,{recursive:true,force:true});}
});
