import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareUi,MIN_WORDS} from './prepare-ui.mjs';

const AD_LOADER='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4630229006617891" crossorigin="anonymous"></script>';
const page=(words,extra='')=>`<!doctype html><html><head><meta name="robots" content="index, follow">${AD_LOADER}</head><body><h1>Title</h1><p>${'word '.repeat(words)}</p>${extra}<script>window.x=1</script></body></html>`;

it('strips every ad tag, noindexes thin shells and lists only substantial pages',()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-ui-'));
  try {
    mkdirSync(join(root,'docs/button'),{recursive:true});
    mkdirSync(join(root,'components/button'),{recursive:true});
    writeFileSync(join(root,'index.html'),page(40));
    writeFileSync(join(root,'404.html'),page(400));
    writeFileSync(join(root,'sitemap-0.xml'),'<urlset/>');
    writeFileSync(join(root,'docs/button/index.html'),page(60,'<ins class="adsbygoogle" data-ad-client="ca-pub-1"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({})</script>'));
    writeFileSync(join(root,'components/button/index.html'),page(MIN_WORDS+50));
    const result=prepareUi(root);
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
    expect(prepareUi(root).indexable).toEqual(['/components/button/']); // repeat build stays valid
  } finally {rmSync(root,{recursive:true,force:true});}
});

it('refuses to publish a build with no substantial pages',()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-ui-'));
  try {
    writeFileSync(join(root,'index.html'),page(10));
    expect(()=>prepareUi(root)).toThrow('no substantial pages');
  } finally {rmSync(root,{recursive:true,force:true});}
});
