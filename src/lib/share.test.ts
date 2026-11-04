import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyResult, shareResult } from './share';
afterEach(()=>vi.unstubAllGlobals());
describe('compartir resultados',()=>{
  it('usa la API nativa si está disponible',async()=>{const share=vi.fn().mockResolvedValue(undefined);vi.stubGlobal('location',{href:'https://example.com/#/cdt'});vi.stubGlobal('navigator',{share});expect(await shareResult('CDT','Mi ejemplo')).toBe('Resultado compartido.');expect(share).toHaveBeenCalledWith({title:'CDT',text:'Mi ejemplo',url:'https://example.com/#/cdt'});});
  it('copiar sirve como alternativa',async()=>{const writeText=vi.fn().mockResolvedValue(undefined);vi.stubGlobal('location',{href:'https://example.com/#/cdt'});vi.stubGlobal('navigator',{clipboard:{writeText}});expect(await shareResult('CDT','Resultado')).toContain('copiado');expect(writeText).toHaveBeenCalledWith('CDT\nResultado\nhttps://example.com/#/cdt');});
  it('cancelar no copia sin querer',async()=>{vi.stubGlobal('location',{href:'https://example.com'});const writeText=vi.fn();vi.stubGlobal('navigator',{share:vi.fn().mockRejectedValue(Object.assign(new Error(),{name:'AbortError'})),clipboard:{writeText}});expect(await shareResult('CDT','Resultado')).toBe('');expect(writeText).not.toHaveBeenCalled();});
  it('informa si el portapapeles está bloqueado',async()=>{vi.stubGlobal('location',{href:'https://example.com'});vi.stubGlobal('navigator',{clipboard:{writeText:vi.fn().mockRejectedValue(new Error())}});expect(await copyResult('CDT','Resultado')).toContain('manualmente');});
});
