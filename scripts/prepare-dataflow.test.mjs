import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareDataflow} from './prepare-dataflow.mjs';

it('keeps the landing page indexed and noindexes the duplicate dashboards',()=>{
  const root=mkdtempSync(join(tmpdir(),'tekivex-dataflow-'));
  try {
    const page='<html><head><meta name="robots" content="index, follow" /></head><body>Same text</body></html>';
    writeFileSync(join(root,'index.html'),page);
    for (const d of ['stocks','crypto','assets']) mkdirSync(join(root,d));
    writeFileSync(join(root,'stocks/index.html'),page);
    writeFileSync(join(root,'crypto/index.html'),'<html><head></head><body>Same text</body></html>');
    expect(prepareDataflow(root).sort()).toEqual(['crypto','stocks']);
    expect(readFileSync(join(root,'index.html'),'utf8')).toContain('content="index, follow"');
    expect(readFileSync(join(root,'stocks/index.html'),'utf8')).toContain('content="noindex, follow"');
    expect(readFileSync(join(root,'crypto/index.html'),'utf8')).toContain('content="noindex, follow"');
    const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
    expect(sitemap).toContain('<loc>https://www.tekivex.com/dataflow/</loc>');
    expect(sitemap).not.toContain('stocks');
  } finally {rmSync(root,{recursive:true,force:true});}
});
