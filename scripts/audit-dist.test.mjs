import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {audit} from './audit-dist.mjs';

const words=(n)=>'word '.repeat(n);
const page=(path,{title=`T ${path}`,desc='d',body=words(300),robots='index, follow',extra=''}={})=>
  `<html><head><title>${title}</title><meta name="description" content="${desc}"><meta name="robots" content="${robots}"><link rel="canonical" href="https://www.tekivex.com${path}"></head><body><p>${body}</p>${extra}</body></html>`;

function site(files){
  const root=mkdtempSync(join(tmpdir(),'tekivex-audit-'));
  const dist=join(root,'dist');
  writeFileSync(join(root,'render.yaml'),'routes:\n  - type: redirect\n    source: /old\n    destination: /\n  - type: rewrite\n    source: /ui/*\n    destination: /ui/index.html\n  - type: rewrite\n    source: /gridstorm/playground/*\n    destination: /gridstorm/playground/index.html\n');
  for(const [p,c] of Object.entries(files)){const f=join(dist,p);mkdirSync(join(f,'..'),{recursive:true});writeFileSync(f,c);}
  return {root,dist};
}
const sitemap=(...paths)=>`<urlset>${paths.map(p=>`<url><loc>https://www.tekivex.com${p}</loc></url>`).join('')}</urlset>`;

it('passes a clean site, following redirects and app rewrites',async()=>{
  const {root,dist}=site({
    'sitemap.xml':sitemap('/','/a/'),
    'index.html':page('/',{extra:'<a href="/a/">a</a><a href="/old">r</a><a href="/gridstorm/playground/x">p</a><a href="https://example.com/x">e</a>'}),
    'a/index.html':page('/a/'),
  });
  try{expect((await audit(dist)).failures).toEqual([]);}finally{rmSync(root,{recursive:true,force:true});}
});

it('reports every class of regression',async()=>{
  const {root,dist}=site({
    'sitemap.xml':sitemap('/','/thin/','/hidden/','/dup/','/missing/','/scaffold/','/paid/','/sidebar/'),
    'scaffold/index.html':page('/scaffold/',{body:words(300)+' This page is a generated scaffold.'}),
    'paid/index.html':page('/paid/',{body:words(300)+' This is an enterprise plugin that requires a license for production use.'}),
    'sidebar/index.html':page('/sidebar/',{body:words(30),extra:`<nav>${'<a href="/">link text here</a>'.repeat(200)}</nav>`}),
    'index.html':page('/',{title:'Same',extra:'<a href="/components/button/">b</a><a href="/ui/nowhere/">soft 404</a>'}),
    'thin/index.html':page('/thin/',{body:words(20)}),
    'hidden/index.html':page('/hidden/',{robots:'noindex, follow',desc:''}),
    'dup/index.html':page('/dup/',{title:'Same'}),
    'ui/docs/index.html':'<html><head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1"></script></head><body></body></html>',
    'use-cases/guide/index.html':'<html><body><ins class="adsbygoogle"></ins></body></html>',
  });
  try{
    const kinds=(await audit(dist)).failures.map(f=>`${f.kind} ${f.where} ${f.detail??''}`.trim());
    expect(kinds).toEqual(expect.arrayContaining([
      'broken-link / /components/button/',
      'broken-link / /ui/nowhere/',
      'thin /thin/ 20 words of own content',
      'placeholder-text /scaffold/',
      'false-licence-claim /paid/',
      'noindex-in-sitemap /hidden/',
      'no-description /hidden/',
      'sitemap-missing /missing/ sitemap.xml',
      'duplicate-title / | /dup/ Same',
      'ads-outside-editorial /ui/docs/index.html',
      'thin /sidebar/ 30 words of own content',
    ]));
    expect(kinds.some(k=>k.includes('/use-cases/'))).toBe(false);
  }finally{rmSync(root,{recursive:true,force:true});}
});
