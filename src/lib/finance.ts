import { colombia } from '../config/colombia';

// Acotamos entradas para evitar pérdidas de precisión y resultados Infinity.
// Las cantidades monetarias admiten hasta 1 billón COP. No se redondea entre pasos.
export const MAX_MONEY = 1_000_000_000_000;
export type NumericInput = number | string | null | undefined;
export function nonnegative(value: NumericInput, max = MAX_MONEY): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max) throw new RangeError(`Ingresa un valor entre 0 y ${max.toLocaleString('es-CO')}.`);
  return n;
}
export function workHours(income: NumericInput, weeklyHours: NumericInput, price: NumericInput, dayHours: NumericInput = 8) {
  const pay = nonnegative(income), hours = nonnegative(weeklyHours, 168), cost = nonnegative(price), day = nonnegative(dayHours, 24);
  // Promedio anual de 52 semanas / 12 meses; no es el divisor de liquidación de nómina.
  const monthlyHours = hours * 52 / 12;
  const hourlyPay = monthlyHours > 0 ? pay / monthlyHours : 0;
  const totalHours = hourlyPay > 0 ? cost / hourlyPay : cost === 0 ? 0 : null;
  return { hourlyPay, monthlyHours, hours: totalHours, days: totalHours !== null && day > 0 ? totalHours / day : null };
}
export function emergencyFund(expenses: NumericInput, savings: NumericInput, months: NumericInput, monthlySaving: NumericInput) {
  const spend = nonnegative(expenses), saved = nonnegative(savings), targetMonths = nonnegative(months, 120), contribution = nonnegative(monthlySaving);
  const goal = spend * targetMonths;
  const remaining = Math.max(0, goal - saved);
  return { goal, remaining, monthsToGoal: remaining === 0 ? 0 : contribution === 0 ? null : Math.ceil(remaining / contribution), runway: spend === 0 ? null : saved / spend, progress: goal === 0 ? 100 : Math.min(100, saved / goal * 100) };
}
export function cdt(principal: NumericInput, annualRatePercent: NumericInput, days: NumericInput, withholdingPercent: NumericInput = colombia.withholdingRate * 100) {
  const amount = nonnegative(principal), ea = nonnegative(annualRatePercent, 100), term = nonnegative(days, 3650), tax = nonnegative(withholdingPercent, 100);
  const periodRate = Math.expm1(Math.log1p(ea / 100) * term / 365);
  const gross = amount * periodRate;
  const withholding = gross * tax / 100;
  const net = gross - withholding;
  return { periodRate, gross, withholding, net, final: amount + net };
}
export function gmf(amount: NumericInput, exempt: boolean, mode: 'monthly' | 'movement' = 'monthly', previousMonthlyMovements: NumericInput = 0, uvt: NumericInput = colombia.uvt) {
  const total = nonnegative(amount), previous = nonnegative(previousMonthlyMovements), unit = nonnegative(uvt);
  const exemption = exempt ? unit * colombia.gmfExemptUVT : 0;
  const availableExemption = mode === 'movement' ? Math.max(0, exemption - previous) : exemption;
  const taxable = Math.max(0, total - availableExemption);
  const tax = taxable * colombia.gmfRate;
  // En modo movimiento, el anual es una proyección repitiendo el mismo escenario cada mes.
  return { exemption, availableExemption, taxable, tax, annual: tax * 12 };
}
