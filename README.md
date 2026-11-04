# Calculadoras Trujillo

4 herramientas educativas para Colombia. React + TypeScript strict + Vite + Tailwind CSS 4. Sitio estático con rutas hash, GitHub Actions y GitHub Pages.

**Web:** https://edwinvg99.github.io/calculadoras-trujillo/

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

La URL local incluye `/calculadoras-trujillo/`. Vite usa ese `base`; en Actions se obtiene automáticamente del nombre del repositorio. Para otro destino define `VITE_BASE_PATH=/otro-repo/` o `/` para un dominio propio. Mantén la barra final.

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

**Estado de entrega:** datos del responsable, URLs de captura/comunidad y redes pendientes por decisión del propietario. El formulario está construido, pero sus campos no recogen datos mientras falta configuración. Se permite usar directamente las calculadoras en esta vista previa. Cuando `captureReady()` sea verdadero, se exige el registro y el acceso se guarda en localStorage. El desbloqueo es una comodidad del navegador, no autenticación ni un control de seguridad.

La captura completa se configura siguiendo [docs/APPS-SCRIPT.md](docs/APPS-SCRIPT.md). El código está en [docs/apps-script.gs](docs/apps-script.gs). No se ha enviado un registro real ni creado una hoja durante la implementación. La confirmación real de fila y el enlace de comunidad deben verificarse al conectar tus URLs.

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

## Revisión antes de activar registros

Completar responsable y URLs; revisar el texto marcado `REVISAR CON ABOGADO`; desplegar y probar Apps Script con datos propios de prueba; comprobar recepción de consentimiento, atribución y deduplicación; comprobar el botón de comunidad y atención de solicitudes. La captura queda apagada hasta entonces.
