const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 });
export const money = (n: number) => cop.format(n).replace(/\s/g, ' ');
export const number = (n: number) => decimal.format(n);
// El punto agrupa miles y la coma separa decimales en es-CO.
export function parseLocal(value: string): number | null {
  if (!value.trim()) return null;
  if (!/^[\d.\s$,]+$/.test(value)) return NaN;
  const clean = value.replace(/[$\s.]/g, '').replace(',', '.');
  return Number(clean);
}
