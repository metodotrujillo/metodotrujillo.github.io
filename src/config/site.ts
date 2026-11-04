export const site = {
  url: 'https://metodotrujillo.github.io/',
  appsScriptUrl: '', // URL https://script.google.com/macros/s/…/exec
  whatsappCommunityUrl: '',
  leadCaptureEnabled: false, // Activar después de completar los datos y desplegar Apps Script.
  policyVersion: '2026-11-04.v2',
  policyDate: '4 de noviembre de 2026',
  responsible: { name: '[PENDIENTE: nombre del responsable]', city: '[PENDIENTE: ciudad]', email: '[PENDIENTE: correo de contacto]' },
  social: { instagram: '', tiktok: '', youtube: '', facebook: '' },
  analytics: { enabled: false, plausibleDomain: '', scriptUrl: 'https://plausible.io/js/script.hash.js' },
};
export function captureReady() {
  return site.leadCaptureEnabled && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(site.appsScriptUrl) && !Object.values(site.responsible).some(v=>v.includes('[PENDIENTE'));
}
