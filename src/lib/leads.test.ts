import { afterEach, describe, expect, it, vi } from 'vitest';
import { attributionFrom, submitLead, validateContact, type Lead } from './leads';
import { site } from '../config/site';
afterEach(()=>vi.restoreAllMocks());
describe('validación de contacto',()=>{
  it('acepta datos colombianos completos',()=>expect(Object.values(validateContact('Ana','ana@example.com','3001234567',true,'no')).every(v=>v==='')).toBe(true));
  it.each(['','123','2001234567','30012345678','+573001234567'])('rechaza teléfono %s',phone=>expect(validateContact('Ana','ana@example.com',phone,true).whatsapp).not.toBe(''));
  it.each(['si','no'])('la respuesta %s permite registrarse',choice=>expect(Object.values(validateContact('Ana','ana@example.com','3001234567',true,choice)).every(v=>v==='')).toBe(true));
  it('exige respuesta de comunidad sin preselección',()=>expect(validateContact('Ana','ana@example.com','3001234567',true,'').communityInterest).not.toBe(''));
  it('exige consentimiento expreso',()=>expect(validateContact('Ana','ana@example.com','3001234567',false).consent).not.toBe(''));
  it('detecta nombre/correo vacíos',()=>{const r=validateContact('','','',false);expect(r.name).not.toBe('');expect(r.email).not.toBe('');});
  it('limita longitud',()=>expect(validateContact('a'.repeat(81),'x'.repeat(255),'3001234567',true).name).not.toBe(''));
});
describe('atribución',()=>{
  it('captura UTM y calculadora',()=>expect(attributionFrom('?src=tiktok&utm_source=tiktok&utm_medium=social&utm_campaign=noviembre','#/cdt')).toEqual({utm_source:'tiktok',utm_medium:'social',utm_campaign:'noviembre',src:'tiktok',entryCalculator:'cdt'}));
  it('admite campañas después del hash',()=>expect(attributionFrom('','#/4x1000?src=ig').src).toBe('ig'));
  it('origen directo',()=>expect(attributionFrom('','').entryCalculator).toBe('home'));
  it('descarta red no válida',()=>expect(attributionFrom('?src=evil','').src).toBe(''));
  it('recorta entradas enormes',()=>expect(attributionFrom('?utm_campaign='+('x'.repeat(999)),'').utm_campaign).toHaveLength(160));
});
describe('confirmación de registro',()=>{
  const lead:Lead={id:'dc153291-4e8c-4ba1-b2b3-514c7c1c6091',name:'Prueba',email:'prueba@example.com',whatsapp:'+573001234567',consent:'si',communityInterest:'no',policyVersion:site.policyVersion,consentedAt:'2026-11-04T15:00:00Z',startedAt:1000,submittedAt:5000,website:'',attribution:attributionFrom('?src=ig','#/cdt')};
  it('no considera respuesta opaca como recepción confirmada',async()=>{vi.spyOn(site,'appsScriptUrl','get').mockReturnValue('https://script.google.com/macros/s/test/exec');const transport={post:vi.fn().mockResolvedValue({type:'opaque'}),confirm:vi.fn().mockResolvedValue(false)};await expect(submitLead(lead,transport)).rejects.toThrow('no confirmó');expect(transport.confirm).toHaveBeenCalledWith(lead.id);});
  it.each(['si','no'] as const)('envía la preferencia de comunidad %s sin alterar el acceso',async preference=>{vi.spyOn(site,'appsScriptUrl','get').mockReturnValue('https://script.google.com/macros/s/test/exec');const post=vi.fn().mockResolvedValue({});await submitLead({...lead,communityInterest:preference},{post,confirm:vi.fn().mockResolvedValue(true)});const body=(post.mock.calls[0][1] as RequestInit).body as URLSearchParams;expect(body.get('communityInterest')).toBe(preference);expect(body.get('consent')).toBe('si');});
  it('solo confirma éxito después del acuse',async()=>{vi.spyOn(site,'appsScriptUrl','get').mockReturnValue('https://script.google.com/macros/s/test/exec');await expect(submitLead(lead,{post:vi.fn().mockResolvedValue({}),confirm:vi.fn().mockResolvedValue(true)})).resolves.toBeUndefined();});
});
