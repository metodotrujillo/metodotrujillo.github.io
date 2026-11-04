import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

describe('validación del Apps Script entregado',()=>{
  const now=Date.now();
  const context=runInNewContext(`${readFileSync('docs/apps-script.gs','utf8')}; ({validate:validate_,safe:safe_,validId:validId_});`);
  const valid={id:'dc153291-4e8c-4ba1-b2b3-514c7c1c6091',name:'Ana',email:'ana@example.com',whatsapp:'+573001234567',consent:'si',communityInterest:'no',policyVersion:'2026-11-04.v3',startedAt:now-5000,submittedAt:now,consentedAt:new Date(now).toISOString(),entryCalculator:'cdt',website:''};
  it('acepta registro autorizado',()=>expect(context.validate(valid)).toBe(true));
  it('acepta interés opcional afirmativo',()=>expect(context.validate({...valid,communityInterest:'si'})).toBe(true));
  it('rechaza respuesta de comunidad vacía',()=>expect(context.validate({...valid,communityInterest:''})).toBe(false));
  it('rechaza interés fuera de si/no',()=>expect(context.validate({...valid,communityInterest:'otro'})).toBe(false));
  it('rechaza honeypot',()=>expect(context.validate({...valid,website:'bot'})).toBe(false));
  it('rechaza envío demasiado rápido',()=>expect(context.validate({...valid,startedAt:now-100})).toBe(false));
  it('rechaza política incorrecta',()=>expect(context.validate({...valid,policyVersion:'anterior'})).toBe(false));
  it('rechaza consentimiento ausente',()=>expect(context.validate({...valid,consent:''})).toBe(false));
  it('rechaza teléfono extranjero',()=>expect(context.validate({...valid,whatsapp:'+12345678901'})).toBe(false));
  it('neutraliza fórmulas en Sheets',()=>expect(context.safe(' =IMPORTXML("https://example.com")')).toMatch(/^'/));
  it('no altera nombre normal',()=>expect(context.safe('Ana')).toBe('Ana'));
});
