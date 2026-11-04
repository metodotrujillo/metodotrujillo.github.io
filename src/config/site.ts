export const site = {
  url: 'https://metodotrujillo.github.io/',
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwKT9PDjPywCgH613W89gQTxOcg-3sxss9pIoIVo-lzfHlGfsCG5OMrua03Q8tfe2y7BQ/exec',
  whatsappCommunityUrl: '',
  leadCaptureEnabled: true, // Receptor desplegado en la cuenta personal del responsable.
  policyVersion: '2026-11-04.v3',
  policyDate: '4 de noviembre de 2026',
  responsible: { name: 'Edwin Velaquez', city: 'Medellín', email: 'velasquezgiraldoedwin@gmail.com' },
  social: { instagram: '', tiktok: '', youtube: '', facebook: '' },
  analytics: { enabled: false, plausibleDomain: '', scriptUrl: 'https://plausible.io/js/script.hash.js' },
};
export function captureReady() {
  return site.leadCaptureEnabled && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(site.appsScriptUrl) && !Object.values(site.responsible).some(v=>v.includes('[PENDIENTE'));
}
