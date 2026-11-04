import { describe, expect, it } from 'vitest';
import { cdt, emergencyFund, gmf, MAX_MONEY, nonnegative, workHours } from './finance';
import { parseLocal, money } from './format';
import { colombia } from '../config/colombia';

describe('validación numérica', () => {
  it.each(['', null, undefined, 0])('normaliza vacío/cero %s', v => expect(nonnegative(v)).toBe(0));
  it.each([-1, Infinity, NaN, 'abc', MAX_MONEY+1])('rechaza valor inválido %s', v => expect(()=>nonnegative(v)).toThrow(RangeError));
  it('admite montos grandes precisos',()=>expect(nonnegative(MAX_MONEY)).toBe(MAX_MONEY));
});
describe('horas de trabajo', () => {
  it('usa semanas promedio, no divisor de nómina',()=>{const r=workHours(3_000_000,42,300_000);expect(r.monthlyHours).toBe(182);expect(r.hours).toBeCloseTo(18.2);expect(r.days).toBeCloseTo(2.275);});
  it('no divide por cero sin salario',()=>expect(workHours(0,42,100).hours).toBeNull());
  it('no divide por cero sin jornada',()=>expect(workHours(100,0,100).hours).toBeNull());
  it('compra gratis cuesta cero tiempo',()=>expect(workHours('',42,0).hours).toBe(0));
  it('día personalizable',()=>expect(workHours(182,42,8,4).days).toBe(2));
  it('rechaza negativos',()=>expect(()=>workHours(-1,42,1)).toThrow());
  it('montos enormes permanecen finitos',()=>expect(Number.isFinite(workHours(MAX_MONEY,42,MAX_MONEY).hours)).toBe(true));
});
describe('fondo de emergencia',()=>{
  it('calcula meta, avance y redondea meses hacia arriba',()=>expect(emergencyFund(2_000_000,3_000_000,6,400_000)).toEqual({goal:12_000_000,remaining:9_000_000,monthsToGoal:23,runway:1.5,progress:25}));
  it('ahorro supera meta',()=>{const r=emergencyFund(100,1000,3,0);expect(r.progress).toBe(100);expect(r.remaining).toBe(0);expect(r.monthsToGoal).toBe(0);});
  it('sin aporte, plazo indeterminado',()=>expect(emergencyFund(100,0,3,0).monthsToGoal).toBeNull());
  it('sin gastos, cobertura no aplica',()=>expect(emergencyFund('',0,6,'').runway).toBeNull());
  it('sin datos no produce NaN',()=>expect(emergencyFund('','','','').progress).toBe(100));
  it('rechaza negativos',()=>expect(()=>emergencyFund(100,-1,6,10)).toThrow());
  it('admite meta de magnitud enorme sin desbordamiento',()=>expect(emergencyFund(MAX_MONEY,0,12,1).goal).toBe(12*MAX_MONEY));
});
describe('CDT',()=>{
  it('un año al 10% y retención del 4%',()=>{const r=cdt(1_000_000,10,365,4);expect(r.gross).toBeCloseTo(100_000);expect(r.withholding).toBeCloseTo(4_000);expect(r.net).toBeCloseTo(96_000);expect(r.final).toBeCloseTo(1_096_000);});
  it('fracción de año efectiva',()=>expect(cdt(10_000_000,10,180).gross).toBeCloseTo(10_000_000*(1.1**(180/365)-1)));
  it.each([0,''])('capital cero/vacío %s',v=>expect(cdt(v,10,180).gross).toBe(0));
  it('plazo/tasa cero',()=>{expect(cdt(100,10,0).final).toBe(100);expect(cdt(100,'',180).gross).toBe(0);});
  it('retención solo sobre intereses',()=>expect(cdt(1000,10,365,100).final).toBe(1000));
  it('capital enorme',()=>expect(Number.isFinite(cdt(MAX_MONEY,100,3650).final)).toBe(true));
  it.each([[-1,10,90,4],[100,-1,90,4],[100,10,-1,4],[100,10,90,101]])('rechaza fuera de rango %s',(a,b,c,d)=>expect(()=>cdt(a,b,c,d)).toThrow());
});
describe('GMF',()=>{
  const limit=colombia.uvt*350;
  it('sin exención',()=>expect(gmf(1_000_000,false).tax).toBe(4000));
  it('hasta límite exento',()=>expect(gmf(limit,true).tax).toBe(0));
  it('solo grava exceso',()=>expect(gmf(limit+1_000_000,true).tax).toBe(4000));
  it('resta acumulado mensual para un movimiento',()=>expect(gmf(1_000_000,true,'movement',limit-500_000).tax).toBe(2000));
  it('no reutiliza cupo agotado',()=>expect(gmf(100,true,'movement',limit+100).tax).toBe(.4));
  it('proyecta doce meses',()=>expect(gmf(1_000_000,false).annual).toBe(48000));
  it.each([0,'',null])('cero/vacío %s',v=>expect(gmf(v,true).tax).toBe(0));
  it('rechaza negativos',()=>expect(()=>gmf(-1,false)).toThrow());
  it('grandes cifras',()=>expect(gmf(MAX_MONEY,false).tax).toBe(4_000_000_000));
});
describe('formato colombiano',()=>{
  it('lee moneda, miles y coma decimal',()=>expect(parseLocal('$ 1.500.000,50')).toBe(1_500_000.5));
  it('vacío permanece vacío',()=>expect(parseLocal('')).toBeNull());
  it.each(['-1','1e9','1,2,3','abc'])('rechaza %s',v=>expect(Number.isNaN(parseLocal(v))).toBe(true));
  it('formatea COP',()=>expect(money(1_500_000)).toBe('$ 1.500.000'));
});
