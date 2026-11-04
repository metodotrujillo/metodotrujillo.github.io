import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Icon from './components/Icon';
import Calculator from './pages/Calculator';
import { calculators } from './catalog';

export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || '/');
  useEffect(() => { const change = () => { setRoute(location.hash.slice(1) || '/'); window.scrollTo(0,0); }; addEventListener('hashchange',change); return () => removeEventListener('hashchange',change); },[]);
  const calculator = calculators.find(c=>`/${c.slug}`===route);
  return <><a className="skip-link" href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus();}}>Saltar al contenido</a><header className="site-header"><div className="container header-inner"><a href="#/" className="brand" aria-label="Trujillo, inicio">TRUJILLO<span>DINERO • INVERSIONES • NEGOCIOS</span></a><nav aria-label="Navegación principal"><a href="#/" className="nav-home">Las calculadoras</a><a className="button small outline" href="#/acceso">Acceso gratis <Icon name="arrow" size={16}/></a></nav></div></header><main id="main" tabIndex={-1}>{route==='/' ? <Home/> : calculator ? <Calculator key={calculator.slug} slug={calculator.slug}/> : <section className="container page-intro"><p className="eyebrow">CALCULADORAS TRUJILLO</p><h1>Estamos haciendo las cuentas.</h1><p>Esta herramienta estará lista en la siguiente fase.</p><a href="#/" className="button primary">Volver al inicio</a></section>}</main><footer className="site-footer container"><div><a className="brand" href="#/">TRUJILLO</a><p>El dinero se aprende.</p></div><div className="footer-links"><a href="#/politica-de-datos">Política de datos</a><span>Hecho para Colombia · 2026</span></div><p className="disclaimer">Es una estimación educativa, no una asesoría financiera.</p></footer><div className="mobile-cta"><span>Tu plata, más clara.</span><a className="button primary small" href="#/acceso">Acceso gratis <Icon name="arrow" size={16}/></a></div></>;
}
