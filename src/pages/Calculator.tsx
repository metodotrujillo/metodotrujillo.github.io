import { useState } from 'react';
import { calculators, type CalculatorSlug } from '../catalog';
import { colombia } from '../config/colombia';
import { cdt, emergencyFund, gmf, workHours } from '../lib/finance';
import { money, number } from '../lib/format';
import { copyResult, shareResult } from '../lib/share';
import NumberField from '../components/NumberField';
import Icon from '../components/Icon';

type Values = { income: number|null; hours: number|null; price: number|null; expenses: number|null; saved: number|null; monthly: number|null; amount: number|null; rate: number|null; days: number|null; withholding: number|null; previous: number|null };
const initial: Values = { income:3_000_000, hours:colombia.weeklyHours, price:300_000, expenses:2_000_000, saved:3_000_000, monthly:400_000, amount:10_000_000, rate:10, days:180, withholding:colombia.withholdingRate*100, previous:0 };
const disclaimer = 'Es una estimación educativa, no una asesoría financiera.';
export default function Calculator({ slug }: { slug: CalculatorSlug }) {
  const entry = calculators.find(c=>c.slug===slug)!;
  const [values,setValues] = useState<Values>(initial);
  const [months,setMonths] = useState(6);
  const [exempt,setExempt] = useState(true);
  const [mode,setMode] = useState<'monthly'|'movement'>('monthly');
  const [message,setMessage] = useState('');
  const [sharing,setSharing] = useState(false);
  const [resetKey,setResetKey] = useState(0);
  const v=values;
  const field=(key:keyof Values,label:string,opts:{currency?:boolean;suffix?:string;max?:number;hint?:string}={})=><NumberField key={`${key}-${resetKey}`} label={label} value={v[key]} onChange={n=>setValues(old=>({...old,[key]:n}))} {...opts}/>;
  const work = workHours(v.income,v.hours,v.price);
  const fund = emergencyFund(v.expenses,v.saved,months,v.monthly);
  const deposit = cdt(v.amount,v.rate,v.days,v.withholding);
  const tax = gmf(v.amount,exempt,mode,v.previous);
  const required: (keyof Values)[] = slug==='horas-de-trabajo'?['income','hours','price']:slug==='fondo-de-emergencia'?['expenses','saved','monthly']:slug==='cdt'?['amount','rate','days','withholding']:mode==='movement'?['amount','previous']:['amount'];
  const missing = required.some(k=>v[k]===null);
  const unableWork = slug==='horas-de-trabajo' && ((v.income ?? 0)<=0 || (v.hours ?? 0)<=0);
  const ready = !missing && !unableWork;
  let mainLabel='',mainValue='',summary='',explanation='';
  let rows: [string,string][]=[];
  if(slug==='horas-de-trabajo'){
    mainLabel='ESTA COMPRA TE CUESTA';mainValue=`${number(work.hours??0)} horas`;
    summary=`${money(v.price??0)} equivalen a ${mainValue} de trabajo con un ingreso mensual de ${money(v.income??0)}.`;
    rows=[['Días equivalentes de 8 horas',number(work.days??0)],['Valor de tu hora',money(work.hourlyPay)],['Horas de trabajo al mes',number(work.monthlyHours)]];
    explanation='Horas al mes = horas semanales × 52 ÷ 12. Valor de tu hora = ingreso mensual ÷ horas al mes. Horas que cuesta = precio ÷ valor de tu hora. Los días equivalen a 8 horas. Es un promedio de tiempo trabajado, no un cálculo de nómina. Si usas el salario mínimo, el ingreso es bruto: no incluye auxilio de transporte ni descuenta aportes.';
  }else if(slug==='fondo-de-emergencia'){
    mainLabel='TU META DE TRANQUILIDAD';mainValue=money(fund.goal);summary=`Mi meta para ${months} meses de gastos es ${mainValue}. Me faltan ${money(fund.remaining)}.`;
    rows=[['Te falta por ahorrar',money(fund.remaining)],['Tiempo para lograrlo',fund.monthsToGoal===null?'Sin aporte mensual':`${number(fund.monthsToGoal)} meses`],['Hoy aguantas sin sueldo',fund.runway===null?'Sin gastos: no aplica':`${number(fund.runway)} meses`]];
    explanation='Meta = gastos mensuales × meses objetivo. Faltante = meta − ahorro, mínimo cero. Tiempo = faltante ÷ ahorro mensual, redondeado al mes siguiente. Cobertura actual = ahorro ÷ gastos mensuales. Sin aporte, el plazo no se puede determinar. No incluye inflación, intereses ni cambios en los gastos.';
  }else if(slug==='cdt'){
    mainLabel='AL FINAL RECIBIRÍAS';mainValue=money(deposit.final);summary=`Con ${money(v.amount??0)} a ${number(v.rate??0)} % E.A. durante ${number(v.days??0)} días, el valor final estimado es ${mainValue}, después de retención.`;
    rows=[['Rendimiento bruto',money(deposit.gross)],['Retención sobre rendimientos',money(deposit.withholding)],['Rendimiento neto',money(deposit.net)]];
    explanation='Tasa del período = (1 + tasa E.A. ÷ 100)^(días ÷ 365) − 1. Bruto = monto × tasa del período. Retención = bruto × porcentaje de retención ÷ 100. Neto = bruto − retención. Valor final = monto + neto. No se descuentan GMF, comisiones o inflación. La tasa del ejemplo es hipotética, no es una oferta de mercado. Confirma las condiciones y la retención aplicables a tu caso.';
  }else{
    mainLabel=mode==='monthly'?'GMF ESTIMADO ESTE MES':'GMF DE ESTE MOVIMIENTO';mainValue=money(tax.tax);summary=`El 4×1000 estimado ${mode==='monthly'?'del mes':'del movimiento'} es ${mainValue}. Exención ${exempt?'aplicada':'no aplicada'}.`;
    rows=[['Monto sujeto al impuesto',money(tax.taxable)],['Cupo exento disponible',money(tax.availableExemption)],['Proyección a 12 meses',money(tax.annual)]];
    explanation=`GMF = máximo(0, monto − cupo exento disponible) × 0,004. Tope mensual = ${colombia.gmfExemptUVT} UVT × ${money(colombia.uvt)} = ${money(colombia.gmfExemptUVT*colombia.uvt)} (${colombia.year}). Para un movimiento, se resta el acumulado previo del mes al cupo exento. Suma los movimientos elegibles de tus cuentas propias: el cupo no se multiplica por entidad. La proyección anual repite este escenario 12 veces, con el cupo de cada mes; no estima movimientos adicionales. Otras exenciones no se simulan.`;
  }
  return <div className="container calculator-page"><a className="back-link" href="#/"><Icon name="back" size={17}/> Todas las calculadoras</a><div className="calculator-heading"><span className="icon-box"><Icon name={entry.icon}/></span><div><p className="eyebrow">{entry.tag}</p><h1>{entry.title}</h1></div></div><p className="calculator-subtitle">{entry.question} Pon tus números y mira el resultado.</p>
    <div className="calculator-layout"><section className="input-panel" aria-label="Datos para calcular"><div className="panel-heading"><h2>Tus números</h2><button type="button" className="reset-button" onClick={()=>{setValues(initial);setMonths(6);setExempt(true);setMode('monthly');setResetKey(k=>k+1);setMessage('Valores de ejemplo restaurados.');}}>Restablecer ejemplo</button></div>
      {slug==='horas-de-trabajo'&&<>{field('income','Tu ingreso mensual',{currency:true,hint:'Usa tu ingreso disponible para una estimación más personal.'})}<button className="preset minimum-button" type="button" onClick={()=>{setValues(old=>({...old,income:colombia.minimumWage}));setResetKey(k=>k+1);}}>Usar salario mínimo {colombia.year}: {money(colombia.minimumWage)}</button>{field('hours','Horas que trabajas por semana',{suffix:'horas',max:168,hint:`Jornada máxima general: ${colombia.weeklyHours} h desde el 15 de julio de ${colombia.year}. Ajusta a tu caso.`})}{field('price','Precio de lo que quieres comprar',{currency:true})}</>}
      {slug==='fondo-de-emergencia'&&<>{field('expenses','Tus gastos fijos mensuales',{currency:true})}{field('saved','Lo que ya tienes ahorrado',{currency:true})}<fieldset className="presets"><legend>Meses de gastos que quieres cubrir</legend><div>{[3,6,12].map(m=><button className={`preset ${months===m?'selected':''}`} type="button" key={m} aria-pressed={months===m} onClick={()=>setMonths(m)}>{m} meses</button>)}</div></fieldset>{field('monthly','Cuánto puedes ahorrar al mes',{currency:true})}</>}
      {slug==='cdt'&&<>{field('amount','Monto que pondrías en el CDT',{currency:true})}{field('rate','Tasa efectiva anual (E.A.)',{suffix:'%',max:100,hint:'Ejemplo hipotético. Ingresa la tasa que quieres simular.'})}<fieldset className="presets"><legend>Plazos de ejemplo</legend><div>{[90,180,360].map(d=><button className={`preset ${v.days===d?'selected':''}`} type="button" key={d} aria-pressed={v.days===d} onClick={()=>{setValues(old=>({...old,days:d}));setResetKey(k=>k+1);}}>{d} días</button>)}</div></fieldset>{field('days','Plazo en días',{suffix:'días',max:3650})}{field('withholding','Retención sobre rendimientos',{suffix:'%',max:100,hint:'Se aplica al rendimiento, no al capital.'})}</>}
      {slug==='4x1000'&&<><fieldset className="presets"><legend>¿Qué quieres calcular?</legend><div>{(['monthly','movement'] as const).map(m=><button className={`preset ${mode===m?'selected':''}`} key={m} type="button" aria-pressed={mode===m} onClick={()=>setMode(m)}>{m==='monthly'?'Total del mes':'Un movimiento'}</button>)}</div></fieldset>{field('amount',mode==='monthly'?'Total de movimientos del mes':'Valor del movimiento',{currency:true})}{mode==='movement'&&field('previous','Movimientos anteriores de este mes',{currency:true,hint:'Suma los movimientos elegibles de tus cuentas propias.'})}<label className="checkbox-row"><input type="checkbox" checked={exempt} onChange={e=>setExempt(e.target.checked)}/><span>Aplicar la exención mensual a esta cuenta</span></label><p className="field-hint">Si tu cuenta está marcada como exenta o tu entidad aplica la exención entre cuentas propias, activa esta opción.</p><div className="info-note">El cupo es de {colombia.gmfExemptUVT} UVT al mes entre tus cuentas. No necesitas marcar una única cuenta. <a href={colombia.sources.gmf} target="_blank" rel="noreferrer">Consulta la aclaración de la DIAN.</a></div></>}
    </section><section className="result-panel" aria-label="Tu resultado"><div className="result-status"><span/> RESULTADO EN VIVO</div><div className="result-content" aria-live="polite" aria-atomic="true"><p className="result-label">{mainLabel}</p><p className="result-number" key={ready ? mainValue:'empty'}>{ready?mainValue:'—'}</p>{!ready&&<p className="result-help">{missing?'Completa los campos con valores válidos para ver tu resultado.':'Ingresa un ingreso y una jornada mayores a cero.'}</p>}{slug==='fondo-de-emergencia'&&ready&&<div className="progress-wrap"><div className="progress-caption"><span>Tu avance</span><strong>{number(fund.progress)} %</strong></div><progress max="100" value={fund.progress} aria-label="Avance del fondo de emergencia"/></div>}<dl className="result-rows">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{ready?value:'—'}</dd></div>)}</dl></div><button type="button" className="button outline share-button" disabled={!ready||sharing} onClick={async()=>{setSharing(true);setMessage(await shareResult(entry.title,`${summary} ${disclaimer}`));setSharing(false);}}><Icon name="share" size={18}/> Compartir resultado</button><button type="button" className="copy-button" disabled={!ready} onClick={async()=>{setMessage(await copyResult(entry.title,`${summary} ${disclaimer}`));setSharing(false);}}>Copiar resultado</button><p className="share-message" role="status">{message}</p><p className="result-disclaimer">{disclaimer}</p></section></div>
    <details className="explanation"><summary>¿Cómo se calcula?</summary><p>{explanation}</p><p>Fuentes y cifras de {colombia.year}, revisadas el 4 de noviembre de 2026. <a href={slug==='horas-de-trabajo'?colombia.sources.weeklyHours:slug==='4x1000'?colombia.sources.gmf:slug==='cdt'?colombia.sources.withholding:colombia.sources.uvt} target="_blank" rel="noreferrer">Ver fuente oficial</a>.</p></details>
    <aside className="other-tools"><h2>Sigue haciendo cuentas</h2><div>{calculators.filter(c=>c.slug!==slug).map(c=><a href={`#/${c.slug}`} key={c.slug}><Icon name={c.icon} size={18}/><span>{c.title}</span><Icon name="arrow" size={16}/></a>)}</div></aside>
  </div>;
}

