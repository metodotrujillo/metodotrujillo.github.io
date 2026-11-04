/** Calculadoras Trujillo · Google Apps Script (runtime V8).
 * Completar Script Properties: SHEET_ID. No hacer pública la hoja.
 * REVISAR CON ABOGADO: datos del responsable, política y condiciones de Google.
 */
const POLICY_VERSION = '2026-11-04.v1';
const SHEET_NAME = 'Leads';
const HEADERS = ['id', 'fecha_servidor', 'nombre', 'correo', 'whatsapp', 'autorizacion', 'version_politica', 'fecha_hora_autorizacion', 'utm_source', 'utm_medium', 'utm_campaign', 'src', 'calculadora_entrada'];

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Falta SHEET_ID en Propiedades del script.');
  const book = SpreadsheetApp.openById(id);
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) { sheet.appendRow(HEADERS); sheet.setFrozenRows(1); }
  return sheet;
}
function initialize() { sheet_(); } // Ejecutar una vez para autorizar y preparar la hoja.
function safe_(v, max) {
  const text = String(v || '').slice(0, max || 160).replace(/[\u0000-\u001f]/g, ' ');
  // Evita interpretar entradas externas como fórmulas en Sheets.
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
}
function validId_(id) { return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id || '')); }
function hasId_(sheet, id) {
  return sheet.getLastRow() > 1 && !!sheet.getRange(2, 1, sheet.getLastRow()-1, 1).createTextFinder(id).matchEntireCell(true).findNext();
}
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function validate_(p) {
  const now = Date.now(), start = Number(p.startedAt), end = Number(p.submittedAt);
  return validId_(p.id) && !p.website && p.consent === 'si' && p.policyVersion === POLICY_VERSION
    && String(p.name || '').trim().length >= 2 && String(p.name || '').length <= 80
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email || '')) && String(p.email).length <= 254
    && /^\+573\d{9}$/.test(String(p.whatsapp || ''))
    && Number.isFinite(start) && Number.isFinite(end) && end-start >= 3000
    && end <= now+300000 && now-end <= 86400000
    && Number.isFinite(Date.parse(p.consentedAt)) && Math.abs(Date.parse(p.consentedAt)-end) < 10000
    && ['home','horas-de-trabajo','fondo-de-emergencia','cdt','4x1000'].indexOf(p.entryCalculator) !== -1;
}
function doPost(e) {
  const p = e && e.parameter || {};
  if (!validate_(p)) return json_({ok:false});
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const sheet = sheet_();
    if (hasId_(sheet, p.id)) return json_({ok:true}); // Idempotencia: mismo envío, una fila.
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(p.email).toLowerCase());
    const key = Utilities.base64EncodeWebSafe(digest);
    const cache = CacheService.getScriptCache();
    if (cache.get('rate_'+key)) return json_({ok:false});
    sheet.appendRow([p.id, new Date().toISOString(), safe_(String(p.name).trim(),80), safe_(String(p.email).toLowerCase(),254), safe_(p.whatsapp,13), 'si', POLICY_VERSION, safe_(p.consentedAt,40), safe_(p.utm_source), safe_(p.utm_medium), safe_(p.utm_campaign), safe_(p.src,10), safe_(p.entryCalculator,30)]);
    SpreadsheetApp.flush();
    cache.put('rate_'+key, '1', 60);
    return json_({ok:true});
  } catch (_) { return json_({ok:false}); }
  finally { lock.releaseLock(); }
}
function doGet(e) {
  const p = e && e.parameter || {};
  if (p.action !== 'status' || !validId_(p.id) || !/^trujillo_[0-9a-f]{32}$/.test(String(p.callback || ''))) return json_({received:false});
  let received = false;
  try { received = hasId_(sheet_(), p.id); } catch (_) { /* No divulgar errores internos. */ }
  // Solo confirma un UUID impredecible. Nunca expone datos personales ni lista filas.
  return ContentService.createTextOutput(p.callback+'('+JSON.stringify({received:received})+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
