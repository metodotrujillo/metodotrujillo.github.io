import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Home from './pages/Home';
import Icon from './components/Icon';
import SEO from './components/SEO';
import Analytics from './components/Analytics';
import useLeadDelivery from './components/useLeadDelivery';
import { calculators, type CalculatorSlug } from './catalog';
import { readStore, writeStore } from './lib/storage';
import { captureAttribution } from './lib/leads';
import { site } from './config/site';
const Calculator=lazy(()=>import('./pages/Calculator'));
const Access=lazy(()=>import('./pages/Access'));
const Policy=lazy(()=>import('./pages/Policy'));
const ACCESS_KEY='trujillo.registered-access.v2';
export default function App(){
  const [hash,setHash]=useState(location.hash.slice(1)||'/');
  const [unlocked,setUnlocked]=useState(()=>readStore(ACCESS_KEY)==='yes');
  const route=hash.split('?')[0];const calculator=calculators.find(c=>`/${c.slug}`===route);
  const next=new URLSearchParams(hash.split('?')[1]||'').get('next');
  const entry=calculator?.slug||calculators.find(c=>c.slug===next)?.slug;
  const {status,enqueue,retry}=useLeadDelivery();const firstRoute=useRef(true);
  useEffect(()=>{captureAttribution();const change=()=>{setHash(location.hash.slice(1)||'/');window.scrollTo(0,0);};addEventListener('hashchange',change);return()=>removeEventListener('hashchange',change);},[]);
  useEffect(()=>{if(firstRoute.current){firstRoute.current=false;return;}document.getElementById('main')?.focus({preventScroll:true});},[route]);
  function unlock(){setUnlocked(true);writeStore(ACCESS_KEY,'yes');location.hash=`/acceso${entry?`?next=${entry}`:''}`;}
  const go=unlocked?'#/':`#/acceso${entry?`?next=${entry}`:''}`;
  const content=route==='/'?<Home unlocked={unlocked}/>:route==='/politica-de-datos'?<Policy/>:route==='/acceso'||calculator&&!unlocked?<Access entry={entry as CalculatorSlug|undefined} unlocked={unlocked} onUnlock={unlock} onLead={enqueue}/>:calculator?<Calculator key={calculator.slug} slug={calculator.slug}/>:<section className="container page-intro"><p className="eyebrow">VOLVAMOS A HACER LAS CUENTAS</p><h1>Esta página no está aquí.</h1><p>Elige una de nuestras cuatro calculadoras para seguir.</p><a className="button primary" href="#/">Ver las calculadoras<Icon name="arrow" size={17}/></a></section>;
  return <><SEO route={route}/><Analytics/><a className="skip-link" href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus();}}>Saltar al contenido</a><header className="site-header"><div className="container header-inner"><a href="#/" className="brand" title="Volver al inicio">TRUJILLO<span>DINERO • INVERSIONES • NEGOCIOS</span></a><nav aria-label="Navegación principal"><a href="#/" className="nav-home">Las calculadoras</a><a className="button small outline" href={go}>{unlocked?'Mis calculadoras':'Acceso gratis'}<Icon name="arrow" size={16}/></a></nav></div></header>
  {status!=='idle'&&<div className="delivery-status container" role="status">{status==='sending'?'Tu acceso ya está listo. Estamos confirmando el registro…':status==='success'?'Registro recibido. Ya puedes usar las cuatro calculadoras.':'Ya tienes acceso. El registro no se pudo confirmar; reintentaremos mientras esta página esté abierta.'}{status==='error'&&<button type="button" onClick={retry}>Reintentar ahora</button>}</div>}
  <main id="main" tabIndex={-1}><Suspense fallback={<div className="container loading-state" role="status">Preparando tus herramientas…</div>}>{content}</Suspense></main>
  <footer className="site-footer container"><div><a className="brand" href="#/">TRUJILLO</a><p>El dinero se aprende.</p></div><div className="footer-links">{Object.entries(site.social).filter(([,url])=>url).map(([label,url])=><a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>)}{unlocked&&site.whatsappCommunityUrl&&<a href={site.whatsappCommunityUrl} target="_blank" rel="noreferrer">Comunidad WhatsApp</a>}<a href="#/politica-de-datos">Política de datos</a><span>Hecho para Colombia · 2026</span></div><p className="disclaimer">Es una estimación educativa, no una asesoría financiera.</p></footer><div className="mobile-cta"><span>{unlocked?'Tus herramientas están listas.':'Tu plata, más clara.'}</span><a className="button primary small" href={go}>{unlocked?'Calculadoras':'Acceso gratis'}<Icon name="arrow" size={16}/></a></div></>;
}


