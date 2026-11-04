import { site } from '../config/site';
import { readStore, writeStore, removeStore } from './storage';
export const PENDING_KEY='trujillo.pending.v1';
const ATTRIBUTION_KEY='trujillo.attribution.v1';
export type Attribution={utm_source:string;utm_medium:string;utm_campaign:string;src:string;entryCalculator:string};
export type Lead={id:string;name:string;email:string;whatsapp:string;consent:'si';communityInterest:'si'|'no';policyVersion:string;consentedAt:string;startedAt:number;submittedAt:number;website:string;attribution:Attribution};
export function validateContact(name:string,email:string,phone:string,consent:boolean){
  return {name:name.trim().length<2||name.trim().length>80?'Escribe tu nombre (2 a 80 caracteres).':'',email:!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email.trim())||email.length>254?'Revisa tu correo electrónico.':'',whatsapp:!(/^3\d{9}$/).test(phone)?'Usa 10 dígitos, empezando por 3.':'',consent:!consent?'Necesitamos tu autorización para registrar tus datos.':''};
}
export function attributionFrom(search:string,hash:string):Attribution{
  const query=new URLSearchParams(search);const route=hash.replace(/^#\//,'').split('?')[0];const hashQuery=new URLSearchParams(hash.split('?')[1]||'');const get=(key:string)=>(query.get(key)||hashQuery.get(key)||'').slice(0,160);
  return {utm_source:get('utm_source'),utm_medium:get('utm_medium'),utm_campaign:get('utm_campaign'),src:['tiktok','ig','fb'].includes(get('src'))?get('src'):'',entryCalculator:['horas-de-trabajo','fondo-de-emergencia','cdt','4x1000'].includes(route)?route:'home'};
}
export function captureAttribution():Attribution{
  const fresh=attributionFrom(location.search,location.hash);
  try{const stored=JSON.parse(readStore(ATTRIBUTION_KEY,'sessionStorage')||'null') as Attribution|null;if(stored)return stored;}catch{/* Reiniciar dato malformado. */}
  writeStore(ATTRIBUTION_KEY,JSON.stringify(fresh),'sessionStorage');return fresh;
}
export function queueLead(lead:Lead){return writeStore(PENDING_KEY,JSON.stringify(lead),'sessionStorage');}
export function pendingLead():Lead|null{
  try{const lead=JSON.parse(readStore(PENDING_KEY,'sessionStorage')||'null') as Lead|null;if(lead&&typeof lead.submittedAt==='number'&&Date.now()-lead.submittedAt<86_400_000&&lead.policyVersion===site.policyVersion)return lead;}catch{/* Sin cola válida. */}
  removeStore(PENDING_KEY,'sessionStorage');return null;
}
export function clearPending(){removeStore(PENDING_KEY,'sessionStorage');}

// El POST no-cors de Apps Script da respuesta opaca. Confirmamos la fila mediante
// JSONP de solo estado: nunca se devuelven nombre, correo o teléfono por GET.
export function confirmReceipt(id:string):Promise<boolean>{
  return new Promise((resolve,reject)=>{
    const callback=`trujillo_${crypto.randomUUID().replace(/-/g,'')}`;
    const callbacks=window as unknown as Record<string,unknown>;
    const script=document.createElement('script');
    const cleanup=()=>{clearTimeout(timer);script.remove();delete callbacks[callback];};
    const timer=setTimeout(()=>{cleanup();reject(new Error('No se pudo confirmar la recepción.'));},12000);
    callbacks[callback]=(result:{received?:boolean})=>{cleanup();resolve(result.received===true);};
    script.onerror=()=>{cleanup();reject(new Error('No hay conexión con el registro.'));};
    const url=new URL(site.appsScriptUrl);url.search=new URLSearchParams({action:'status',id,callback,t:String(Date.now())}).toString();script.src=url.toString();script.referrerPolicy='no-referrer';document.head.append(script);
  });
}
export async function submitLead(lead:Lead, transport:{post:(url:string,options:RequestInit)=>Promise<unknown>;confirm:(id:string)=>Promise<boolean>}={post:fetch,confirm:confirmReceipt}):Promise<void>{
  if(!site.appsScriptUrl)throw new Error('El registro aún no está habilitado.');
  const body=new URLSearchParams({id:lead.id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,consent:lead.consent,communityInterest:lead.communityInterest,policyVersion:lead.policyVersion,consentedAt:lead.consentedAt,startedAt:String(lead.startedAt),submittedAt:String(lead.submittedAt),website:lead.website,...lead.attribution});
  await transport.post(site.appsScriptUrl,{method:'POST',mode:'no-cors',credentials:'omit',body,signal:AbortSignal.timeout(15000)});
  if(!await transport.confirm(lead.id))throw new Error('El registro aún no confirmó tus datos.');
}
