const h=new Set(["fonttbl","colortbl","stylesheet","info","pict","object","themedata","colorschememapping","datastore","latentstyles","listtable","rsidtbl","generator"]);function d(s){let a="",e=0;const p=s.length,r=[{ignore:!1,ucSkip:1}];let o=()=>r[r.length-1],l=0;const c=t=>{o().ignore||(a+=t)};for(;e<p;){const t=s[e];if(t==="{"){r.push({...o()}),e++;continue}if(t==="}"){r.length>1&&r.pop(),e++;continue}if(t==="\\"){const i=s[e+1];if(i==="'"){const n=s.substr(e+2,2);if(e+=4,l>0){l--;continue}c(String.fromCharCode(parseInt(n,16)||0));continue}if(i==="\\"||i==="{"||i==="}"){c(i),e+=2;continue}if(i==="*"){o().ignore=!0,e+=2;continue}if(i===`
`||i==="\r"){c(`
`),e+=2;continue}const u=/^\\([a-zA-Z]+)(-?\d+)? ?/.exec(s.slice(e));if(u){const n=u[1],f=u[2]?Number(u[2]):void 0;if(e+=u[0].length,h.has(n))o().ignore=!0;else if(n==="par"||n==="sect"||n==="line")c(`
`);else if(n==="tab")c("	");else if(n==="uc")o().ucSkip=f??1;else if(n==="u"&&f!==void 0){const g=f<0?f+65536:f;o().ignore||c(String.fromCharCode(g)),l=o().ucSkip}continue}e++;continue}if(t==="\r"||t===`
`){e++;continue}if(e++,l>0){l--;continue}c(t)}return a.replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}export{d as rtfToText};
