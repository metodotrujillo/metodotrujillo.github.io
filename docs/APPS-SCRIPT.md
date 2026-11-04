# Activar el registro en Google Sheets

El registro está apagado por defecto. La versión pública permite probar sin dar datos. No actives la captura hasta completar el responsable y revisar la política. No es necesario un servidor propio.

1. Crea una hoja de Google Sheets privada. Copia el ID entre `/d/` y `/edit` de su URL.
2. Abre **Extensiones → Apps Script**. Reemplaza `Código.gs` por el contenido de `docs/apps-script.gs`.
3. En **Configuración del proyecto → Propiedades del script**, agrega `SHEET_ID` con el ID de tu hoja. No pongas credenciales en el frontend.
4. Selecciona y ejecuta `initialize`. Autoriza el acceso a tu hoja desde tu propia cuenta. Se crea la pestaña `Leads` y sus encabezados.
5. En **Implementar → Nueva implementación**, elige **Aplicación web**. Ejecutar como: **yo**. Acceso: **cualquier persona**, incluyendo visitantes sin sesión. Algunas organizaciones bloquean esta opción; en ese caso necesitas una cuenta donde esté permitida. La hoja se mantiene privada.
6. Implementa y copia la URL que termina en `/exec`, no `/dev`.
7. Completa `src/config/site.ts`: `appsScriptUrl`, `responsible.name`, `responsible.city`, `responsible.email`, `whatsappCommunityUrl` y redes. Revisa el borrador jurídico. Cambia `leadCaptureEnabled` a `true`.
8. La versión `policyVersion` del sitio y `POLICY_VERSION` del script debe coincidir. Si cambias el texto de autorización, actualiza ambos y conserva las versiones anteriores para acreditar consentimientos.
9. Ejecuta `npm test` y `npm run build`; haz commit y push a `main`. Actions publica Pages.
10. Prueba un registro con datos de prueba que controles, acepta expresamente la autorización y confirma una única fila en `Leads`. Verifica fecha, nombre, correo, celular, autorización, versión, origen y calculadora. Comprueba también un envío con conexión interrumpida y el reintento. No uses datos reales de terceros para las pruebas.

## Confirmación y reintentos

El POST de Apps Script funciona con `mode: no-cors` y `URLSearchParams`, sin preflight. Su respuesta es opaca: **no se interpreta como éxito**. Después del POST se consulta un endpoint JSONP de solo estado para confirmar la existencia del UUID del registro. El GET no devuelve datos personales y valida estrictamente el callback. No contiene correo ni teléfono en la URL. Debes confiar en el script que configuras porque JSONP ejecuta JavaScript; solo se admiten URLs de Apps Script.

Las calculadoras se desbloquean independientemente del envío. La cola se guarda en `sessionStorage` hasta confirmar o expirar en 24 horas; se reintenta hasta cinco veces con espera creciente, al recuperar la conexión o mediante el botón manual. Los reintentos usan el mismo UUID. `LockService` y la búsqueda del UUID evitan filas duplicadas. No se prometen reintentos después de cerrar la pestaña. Si el navegador bloquea almacenamiento, la cola funciona en memoria mientras la página permanezca abierta.

Honeypot y mínimo de tres segundos se validan en cliente y script. Hay un límite básico por correo de 60 segundos. Estas medidas frenan spam sencillo; un endpoint anónimo no ofrece protección completa contra bots o agotamiento de cuotas. Vigila las cuotas y ejecuciones de Apps Script.

## Actualizar el script

Guardar cambios en el editor no actualiza `/exec`. Usa **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar** para mantener la misma URL. Revisa permisos y acceso anónimo en una ventana privada.

## Protección y atención de titulares

Restringe la hoja al responsable y personal autorizado, activa la protección de tu cuenta y define eliminación, revisión anual y atención de consultas/reclamos. Evalúa con tu abogado los términos de Google como encargado y la transmisión internacional. El borrador no sustituye esa revisión.

Fuentes técnicas: [Aplicaciones web](https://developers.google.com/apps-script/guides/web), [ContentService y JSONP](https://developers.google.com/apps-script/guides/content).

## Registro simple y futura comunidad

El formulario pide nombre, correo y celular. La autorización para registrar el acceso es independiente de la invitación opcional a recibir educación financiera y novedades de la futura comunidad. Ambas casillas empiezan sin marcar. No necesitas tener un grupo de WhatsApp para activar el registro.

Las nuevas columnas al final de `Leads` son `interes_comunidad` (`si` o `no`) y `fecha_hora_interes_comunidad` (fecha de autorización si eligió `si`; vacía si eligió `no`). No marcar la opción permite igualmente usar las cuatro calculadoras. Filtra por `si` antes de contactar para contenidos o comunidad; el registro solo no autoriza esas comunicaciones.

La versión de esta autorización es `2026-11-04.v2`. Al actualizar una instalación anterior, publica una nueva versión de Apps Script además del frontend. El script amplía los encabezados de una hoja generada previamente sin mover sus primeras trece columnas. Conserva los registros y autorizaciones anteriores con su propia versión.

Para descargar tu lista como Excel: abre la hoja y usa **Archivo → Descargar → Microsoft Excel (.xlsx)**. Google Sheets es el registro activo; el archivo descargado es una copia del momento.
