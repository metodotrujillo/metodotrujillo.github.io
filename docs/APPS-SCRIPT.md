# Activar los registros en Google Sheets

La hoja ya está creada, es privada y contiene la pestaña `Leads` con sus quince encabezados, primera fila inmovilizada y filtro. Destino actualizado a la copia facilitada por el propietario desde su cuenta personal.

[Abre la hoja de registros](https://docs.google.com/spreadsheets/d/10RUluozJGMZilFV7kVRkyaBVs-dmDcEECbVn2wRjCv4/edit)

El formulario ya tiene el responsable Edwin Velaquez, Medellín, y el correo facilitado por el propietario. Está pendiente desplegar la aplicación web en su cuenta y pegar su URL en la configuración. **La hoja creada todavía no recibe registros de la web.**

## Pasos del propietario en Google

1. Abre la hoja con tu cuenta de Google. No la publiques ni actives «cualquier persona con el enlace».
2. Ve a **Extensiones → Apps Script**. Sustituye el contenido de `Código.gs` por el de `docs/apps-script.gs` de este repositorio y guarda. El ID de la hoja ya está incluido en `DEFAULT_SHEET_ID`; no necesitas crear una API key ni configurar una cuenta de facturación. Opcionalmente `SHEET_ID` en Propiedades del script permite cambiar el destino.
3. Selecciona la función `initialize` y pulsa **Ejecutar**. Google solicitará las autorizaciones de tu cuenta. Revisa los permisos antes de concederlos. El agente no necesita tu contraseña ni un token.
4. Ve a **Implementar → Nueva implementación → Aplicación web**. Elige **Ejecutar como: yo** y **Quién tiene acceso: cualquier persona**. Esto habilita el receptor de formularios; la hoja sigue privada. Algunas cuentas de organizaciones no permiten acceso anónimo.
5. Implementa y copia la URL terminada en `/exec`, no `/dev`. Envía esa URL para conectarla a la página.

## Conectar el frontend

En `src/config/site.ts`, completa `appsScriptUrl` y cambia `leadCaptureEnabled` a `true`. Los datos del responsable ya están diligenciados. Mantén `policyVersion: '2026-11-04.v3'` igual a `POLICY_VERSION` en el script. Ejecuta pruebas y compilación, haz commit y push. GitHub Actions publica la web.

Después, realiza dos registros de prueba con datos que controles: uno con Sí y otro con No a la comunidad. Confirma recepción, respuesta y fecha en `Leads`. No uses datos de terceros para pruebas. La integración no se considera verificada hasta ver las filas desde la web real.

## Qué guarda la hoja

Una fila por registro: ID, fecha del servidor, nombre, correo, celular, autorización de datos, versión de la política, fecha de autorización, UTM, red de origen, calculadora de entrada, respuesta a comunidad (`si` o `no`) y fecha/hora de esa respuesta. No se envían los valores financieros de los simuladores.

Nombre, correo, celular, autorización de acceso y respuesta Sí/No son obligatorios. Las respuestas no tienen valor predeterminado. Responder No permite usar las mismas cuatro herramientas y no autoriza comunicaciones de comunidad. Responder Sí autoriza contacto educativo por correo o WhatsApp y que Trujillo invite o agregue a la persona a su futura comunidad de finanzas personales. El envío del formulario no la agrega ahora a ningún grupo. Filtra la columna `interes_comunidad` por `si` antes de preparar invitaciones o agregar personas; respeta las revocatorias posteriores. La columna `fecha_hora_respuesta_comunidad` se completa en ambos casos.

Para descargar una copia Excel: **Archivo → Descargar → Microsoft Excel (.xlsx)**. La hoja de Google es el registro activo; la descarga es una copia de ese momento.

## Confirmación, privacidad y reintentos

El POST usa `no-cors` y devuelve una respuesta opaca. No la consideramos confirmación: después se consulta por JSONP un endpoint de solo estado que confirma el UUID, sin devolver nombre, correo o celular. El callback está validado y la URL GET no contiene esos datos. Usa únicamente tu propia URL de Apps Script.

Tras completar el formulario se desbloquean las calculadoras incluso si la red falla. Se guarda temporalmente un registro pendiente en `sessionStorage` durante la sesión, con vencimiento a las 24 horas. Se hacen hasta cinco reintentos con espera creciente, al recuperar la conexión o desde el botón manual. No se prometen envíos después de cerrar la pestaña. Si el navegador bloquea almacenamiento, se trabaja en memoria.

Los reintentos usan el mismo UUID. `LockService` y la búsqueda del UUID evitan filas duplicadas. Honeypot, mínimo de tres segundos y límite básico por correo frenan spam sencillo; vigila las cuotas de Apps Script.

## Actualizaciones

Guardar el código no actualiza `/exec`: usa **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar**. Si cambias la autorización, cambia la versión tanto en la web como en Apps Script y conserva el historial.

Restringe el acceso a la hoja y define atención de solicitudes, conservación y revisión periódica. El texto de la política conserva el comentario `REVISAR CON ABOGADO` para la revisión correspondiente.

Fuentes técnicas: [Aplicaciones web](https://developers.google.com/apps-script/guides/web), [ContentService y JSONP](https://developers.google.com/apps-script/guides/content).
