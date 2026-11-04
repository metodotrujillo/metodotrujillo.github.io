import { calculators } from '../catalog';
import Icon from '../components/Icon';

export default function Home({ unlocked = false }: { unlocked?: boolean }) {
  return <>
    <section className="hero container">
      <div className="hero-copy"><p className="eyebrow"><span className="tiny-line"/> HERRAMIENTAS PARA TU VIDA REAL</p>
        <h1>4 calculadoras gratis para <span>entender tu plata.</span></h1>
        <p className="hero-description">Menos suposiciones. Más números.<br/>Descubre lo que tu tiempo, tu ahorro y tus decisiones valen de verdad.</p>
        <a className="button primary" href="#herramientas" onClick={e => { e.preventDefault(); document.getElementById('herramientas')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}>Explorar las calculadoras <Icon name="arrow" size={18}/></a>
        <div className="hero-assurances"><span><Icon name="check" size={15}/> 100 % gratis</span><span><Icon name="check" size={15}/> Hechas para Colombia</span></div>
      </div>
      <div className="hero-visual" aria-label="Ejemplo: una compra de 300.000 pesos equivale a 18,2 horas de trabajo con un ingreso mensual de 3 millones y 42 horas semanales" role="img">
        <div className="visual-top"><span>EL PRECIO DETRÁS DEL PRECIO</span><Icon name="clock" size={21}/></div>
        <div className="visual-equation"><span>$ 300.000</span><span className="equals">=</span><strong>18,2 <small>horas</small></strong><p>de tu trabajo.</p></div>
        <div className="visual-bars" aria-hidden="true">{[27,41,35,59,49,72,65,88,78,100,93,119,110,140,130].map((h,i)=><i key={i} style={{height:h}}/>)}</div>
        <div className="visual-bottom"><span>Un ejemplo. Una perspectiva diferente.</span><span>01 / 04</span></div>
        <div className="visual-note">Tu plata también es tu tiempo.</div>
      </div>
    </section>
    <section className="tools-section container" id="herramientas" aria-labelledby="tools-title">
      <div className="section-heading"><div><p className="eyebrow">ELIGE POR DÓNDE EMPEZAR</p><h2 id="tools-title">Haz las cuentas. Gana claridad.</h2></div><span className="section-note">4 herramientas · un solo acceso</span></div>
      <div className="tool-grid">{calculators.map((c,i)=><a className="tool-card" key={c.slug} href={`#/${c.slug}`}><div className="card-top"><span className="icon-box"><Icon name={c.icon}/></span><span className="card-number">0{i+1}</span></div><p className="card-tag">{c.tag}</p><h3>{c.title}</h3><p>{c.description}</p><span className="card-link">{unlocked ? 'Abrir calculadora' : 'Quiero calcular'}<Icon name="arrow" size={18}/></span></a>)}</div>
    </section>
    <section className="how container" aria-labelledby="how-title"><div><p className="eyebrow">SIN COMPLICACIONES</p><h2 id="how-title">Tu siguiente decisión,<br/>con más claridad.</h2><p>No necesitas saber de finanzas.<br/>Solo empezar con tus números.</p></div><ol className="steps"><li><span>01</span><div><h3>Elige tu calculadora</h3><p>Empieza por la pregunta que tienes hoy.</p></div></li><li><span>02</span><div><h3>Activa tu acceso gratis</h3><p>Un registro para usar las cuatro herramientas.</p></div></li><li><span>03</span><div><h3>Prueba con tus números</h3><p>Cambia los valores y entiende tu resultado al instante.</p></div></li></ol></section>
    <section className="about container"><p className="eyebrow">MÉTODO TRUJILLO</p><blockquote>“El dinero se aprende.”</blockquote><p>Hablamos de dinero, inversiones y negocios con datos y palabras claras.<br/>Herramientas para entender tu plata y decidir con criterio.</p><a className="text-link" href="#/acceso">{unlocked ? 'Ya tienes acceso a las cuatro calculadoras' : 'Empieza con tus números'} <Icon name="arrow" size={17}/></a></section>
  </>;
}
