import { useEffect } from 'react';
import { calculators } from '../catalog';
import { site } from '../config/site';
export default function SEO({route}:{route:string}){
  useEffect(()=>{
    const calc=calculators.find(c=>`/${c.slug}`===route);
    const title=calc?`${calc.title} gratis Colombia · Trujillo`:route==='/acceso'?'Acceso gratis · Calculadoras Trujillo':route==='/politica-de-datos'?'Política de datos · Trujillo':'Calculadoras Trujillo · Entiende tu plata';
    const description=calc?`${calc.question} ${calc.description} Calcula gratis con cifras colombianas y resultados al instante.`:'4 calculadoras gratis para Colombia: horas de trabajo, fondo de emergencia, CDT y 4×1000. El dinero se aprende.';
    document.title=title;
    for(const selector of ['meta[name="description"]','meta[property="og:description"]','meta[name="twitter:description"]'])document.querySelector(selector)?.setAttribute('content',description);
    for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])document.querySelector(selector)?.setAttribute('content',title);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',`${site.url}#${route}`);
  },[route]);return null;
}
