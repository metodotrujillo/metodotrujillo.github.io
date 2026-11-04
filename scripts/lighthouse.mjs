import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
const chrome=await launch({chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
const base=process.env.AUDIT_URL||'http://127.0.0.1:4173/';
const routes=process.env.AUDIT_ROUTES?.split(',')||['/','/horas-de-trabajo','/fondo-de-emergencia','/cdt','/4x1000','/acceso','/politica-de-datos'];
const summaries=[];
try{
  await mkdir('reports',{recursive:true});
  for(const route of routes){
    const result=await lighthouse(`${base}#${route}`,{port:chrome.port,output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'});
    if(!result)throw new Error('Lighthouse no devolvió resultado.');
    const slug=route==='/'?'home':route.slice(1);
    await writeFile(`reports/${slug}.json`,result.report[0]);await writeFile(`reports/${slug}.html`,result.report[1]);
    const scores=Object.fromEntries(Object.entries(result.lhr.categories).map(([key,c])=>[key,Math.round(c.score*100)]));
    const failed=Object.values(result.lhr.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.type!=='opportunity').map(a=>({id:a.id,title:a.title,score:a.score}));
    summaries.push({route,scores,failed});console.log(JSON.stringify({route,scores,failed}));
  }
  await writeFile('reports/summary.json',JSON.stringify(summaries,null,2));
  if(summaries.some(r=>Object.values(r.scores).some(s=>s<95)))process.exitCode=1;
}finally{await chrome.kill();}
