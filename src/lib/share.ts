export async function shareResult(title: string, text: string): Promise<string> {
  const url = location.href;
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return 'Resultado compartido.'; }
    catch (e) { if (e instanceof Error && e.name === 'AbortError') return ''; }
  }
  return copyResult(title,text,url);
}
export async function copyResult(title:string,text:string,url=location.href):Promise<string>{
  try { await navigator.clipboard.writeText(`${title}\n${text}\n${url}`); return 'Resultado copiado. Ya puedes pegarlo en un mensaje.'; }
  catch { return 'No fue posible copiar. Selecciona el resultado y cópialo manualmente.'; }
}
