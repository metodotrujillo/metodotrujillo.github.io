# Calculadoras Trujillo

4 herramientas educativas para Colombia. React + TypeScript strict + Vite + Tailwind CSS 4. Sitio estático con rutas hash, GitHub Actions y GitHub Pages.

**Web:** https://metodotrujillo.github.io/

## Desarrollo

Requiere Node.js 24 y npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run check:budget
npm run preview -- --port 4173
```

La URL local es `http://127.0.0.1:5173/`. Vite y Actions usan `base: /` para el sitio raíz de la organización. Para otro destino define `VITE_BASE_PATH=/otro-repo/` o `/` para un dominio propio. Mantén la barra final.

## Configuración del propietario

En `src/config/site.ts`:

| Campo | Qué poner |
| --- | --- |
| `appsScriptUrl` | URL pública `/exec` de tu aplicación Apps Script |
| `responsible` | Nombre del responsable, ciudad y correo para ejercer derechos |
| `whatsappCommunityUrl` | Enlace oficial de invitación a la comunidad |
| `social` | URLs reales de Instagram, TikTok, YouTube y Facebook |
| `leadCaptureEnabled` | Cambiar a `true` al completar y revisar el registro |
| `policyVersion`, `policyDate` | Versión y fecha de la política; misma versión en Apps Script |
| `url` | URL de producción si cambia repositorio o dominio |
| `analytics` | Plausible opcional. Apagado por defecto. Configura dominio y URL de script de tu instalación |

**Estado actual:** captura activa y verificada en producción desde el 4 de noviembre de 2026. El formulario envía los registros a la hoja privada de la cuenta personal del responsable mediante su aplicación web de Apps Script. Los enlaces de comunidad y redes siguen sin configurar; no se requieren para el registro.

El registro es obligatorio para abrir las calculadoras. Tras completar el formulario se recuerda el acceso en `localStorage`, incluso si un envío necesita reintentarse. Es una comodidad del navegador, no autenticación. La documentación de configuración y mantenimiento está en [docs/APPS-SCRIPT.md](docs/APPS-SCRIPT.md), y el código receptor en [docs/apps-script.gs](docs/apps-script.gs).

## Cifras y fórmulas

`src/config/colombia.ts` centraliza el año, salario mínimo, transporte, jornada, UVT, cupo GMF, tarifa y retención. Revisa todo antes de publicar y al cambiar de año. Fuentes oficiales y supuestos en [docs/FUENTES.md](docs/FUENTES.md).

- Horas: ingreso / (horas semanales × 52 / 12). Los días equivalen a ocho horas; no es liquidación de nómina. El mínimo es bruto, sin transporte ni descuentos.
- Fondo: meta, faltante, plazo con redondeo hacia arriba, cobertura y progreso. Sin aportes, no hay plazo calculable.
- CDT: `(1 + EA / 100) ** (días / 365) - 1`. Retención solo sobre rendimientos. La tasa precargada es hipotética. No se simulan GMF ni comisiones.
- GMF: el cupo de 350 UVT es mensual y agregado entre cuentas propias. Un movimiento descuenta el acumulado anterior. La cifra anual repite el escenario durante 12 meses.

Funciones puras en `src/lib/finance.ts`. Entradas vacías muestran una invitación a completar; ingresos/jornada cero no producen divisiones infinitas. Importes limitados a un billón COP por campo; tasas hasta 100 %, jornada hasta 168 horas y CDT hasta 3.650 días. Los cálculos usan precisión de JavaScript y se muestran en pesos enteros; no son liquidaciones contables.

## Diseño y accesibilidad

Tokens CSS en `src/styles.css`, expuestos a Tailwind con `@theme inline`; acabado bento en `src/design.css`. Montserrat 400/600/800 y Playfair Display 400 cursiva se sirven localmente con `font-display: swap`. Textura SVG original, sombras, luz radial y gráficos nativos, sin imágenes de stock ni librería UI. Anime.js carga de forma diferida; se omiten animaciones si el usuario prefiere movimiento reducido. Los gráficos de las tarjetas son ejemplos decorativos, no datos en vivo.

Etiquetas reales, foco visible, salto al contenido, errores anunciados y controles táctiles. El dorado se usa en cifras grandes, iconos y CTA; los párrafos usan blanco cálido/gris con contraste. Verde reservado para rendimientos positivos.

## SEO y redes

Título y descripción se actualizan en cada ruta. La página HTML incluye metadatos sociales y una imagen `public/og.png` de 1200×630, favicon, manifest y datos estructurados. Si cambias el dominio, actualiza también `index.html`, `public/robots.txt` y `public/sitemap.xml`.

Las rutas hash funcionan al recargar en Pages. Sus fragmentos no son páginas independientes para los rastreadores; los lectores sociales que no ejecutan JS reciben los metadatos generales. El sitemap incluye la portada. Para posicionar cada calculadora como una URL independiente en el futuro conviene generar HTML estático por ruta. La puntuación SEO automática no elimina esta limitación.

La imagen social está generada con las fuentes de la marca. Para regenerarla:

```sh
python -m pip install pillow fonttools brotli
python scripts/generate-og.py
```

## Pruebas y rendimiento

`npm test` ejecuta casos financieros, formato colombiano, validación, atribución, confirmación de envío y validación del script entregado. No requiere credenciales ni servicios externos.

`npm run check:budget` comprueba que el JS inicial esté bajo 100.000 bytes gzip. Las pantallas de cálculo, acceso, política y Anime.js se cargan por separado. Las fuentes se sirven localmente. El arte social no se descarga al abrir la web.

Con Chrome instalado y `npm run preview -- --port 4173` activo:

```sh
node scripts/lighthouse.mjs
```

En Windows puedes definir `CHROME_PATH` con la ruta a `chrome.exe`. Se generan informes HTML/JSON en `reports/` (ignorados en Git). `AUDIT_URL` permite cambiar el servidor y `AUDIT_ROUTES` una lista separada por comas para repetir solo rutas afectadas. Resultados resumidos y límites de verificación en [docs/QA.md](docs/QA.md). Las notas son mediciones de laboratorio, pueden cambiar según servidor, dispositivo y red; no equivalen a métricas de usuarios reales.

## GitHub Pages

Cada push a `main` ejecuta `.github/workflows/deploy.yml`: instalación, pruebas, compilación strict, presupuesto JS y publicación. En **Settings → Pages**, la fuente debe ser **GitHub Actions**. El repositorio se creó público para Pages, sin credenciales ni registros personales en el código.

Las fases tienen commits independientes. [docs/PLAN.md](docs/PLAN.md) contiene el plan original. Los siguientes cambios de configuración se publican con commit y push.

## Mantenimiento del registro

La integración está activa. Al cambiar el texto de autorización, revisa la política y actualiza su versión tanto en el sitio como en Apps Script. Mantén el canal de atención de derechos y revisa la conservación de datos. El enlace de comunidad se configura cuando exista. El comentario `REVISAR CON ABOGADO` identifica el texto jurídico para su revisión.

## Registro y comunidad (actualización)

Nombre, correo y celular obligatorios; autorización de datos de acceso y pregunta de comunidad independientes. La pregunta exige Sí o No sin preselección. Ambas respuestas dan acceso y se guardan con fecha, hora y versión `2026-11-04.v3`. El Sí autoriza contacto educativo e invitar/agregar a la futura comunidad; No no autoriza ese uso. El formulario no agrega ahora a grupos.

Hoja nueva creada desde cero en el navegador de la cuenta personal verificada: `1WGtI5Q_5fa1wenhkwF2z4BYioEnv6AZhkV8RFYlD1xk`. La integración está activa. Se verificaron dos filas sintéticas, marcadas `PRUEBA TECNICA - NO CONTACTAR`, con respuestas Sí y No; no representan autorizaciones de personas reales. Sigue `docs/APPS-SCRIPT.md` para mantener o actualizar el receptor.

## Dirección de la organización

Repositorio trasladado a `metodotrujillo/metodotrujillo.github.io` para publicar directamente en https://metodotrujillo.github.io/. Se conservan el historial y el flujo de GitHub Actions. La URL anterior de Pages no debe usarse en enlaces de campaña nuevos.

El acceso de demostración anterior (`trujillo.access.v1`) no se acepta como registro. El acceso actual usa `trujillo.registered-access.v2`. La entrega de registros se reintenta si falla la conexión, sin volver a bloquear a alguien que ya completó el formulario.

Proyecto de Apps Script creado desde cero con la cuenta personal verificada en el navegador: `Trujillo · Registro personal Edwin` (`1EJRZi36BQlJz5O_VtNUAegwe-1UUJIG6JcDZiWqLRiOGsp5ykGajIInH`). El código está guardado en ese editor y apunta a la hoja nueva. No se utilizan las hojas ni los proyectos de la conexión de Drive de Trujillo. La aplicación web fue autorizada y desplegada por el propietario, conectada a producción y verificada mediante envío desde el formulario y confirmación de filas.
