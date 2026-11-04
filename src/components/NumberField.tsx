import { useId, useState } from 'react';
import { MAX_MONEY } from '../lib/finance';
import { parseLocal } from '../lib/format';

export default function NumberField({ label, value, onChange, currency = false, suffix, max = MAX_MONEY, hint }: { label: string; value: number | null; onChange: (n: number | null) => void; currency?: boolean; suffix?: string; max?: number; hint?: string }) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const format = (n: number | null) => n === null ? '' : new Intl.NumberFormat('es-CO', {maximumFractionDigits: 2}).format(n);
  return <div className="field"><label htmlFor={id}>{label}</label><div className={`input-wrap ${error ? 'invalid' : ''}`}>
    {currency && <span className="input-prefix">$</span>}
    <input id={id} type="text" inputMode="decimal" autoComplete="off" value={focused ? raw : format(value)} aria-invalid={!!error} aria-describedby={`${id}-hint ${id}-error`} onFocus={()=>{setRaw(format(value));setFocused(true);}} onChange={e=>{const next=e.target.value;setRaw(next);const parsed=parseLocal(next);if(parsed!==null && (!Number.isFinite(parsed) || parsed<0 || parsed>max)){setError(`Usa un valor de 0 a ${format(max)}.`);onChange(null);}else{setError('');onChange(parsed);}}} onBlur={()=>{if(!error)setFocused(false);}} />
    {suffix && <span className="input-suffix">{suffix}</span>}
  </div><p id={`${id}-hint`} className="field-hint">{hint}</p><p id={`${id}-error`} className="field-error" aria-live="polite">{error}</p></div>;
}
