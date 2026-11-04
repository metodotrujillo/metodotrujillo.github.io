# Verificación de entrega · 4 de noviembre de 2026

## Comprobaciones automáticas

- TypeScript strict y compilación de producción: correctos.
- Vitest: **81 pruebas** en cuatro archivos; fórmulas, validaciones, montos extremos, vacíos, origen, confirmación, consentimiento, antispam de Apps Script y compartir/copiar.
- `npm audit`: **0 vulnerabilidades**, incluyendo dependencias de desarrollo.
- JavaScript inicial: **74,73 KiB gzip** (76,53 KB decimales), bajo el límite de 100 KB. Los simuladores y Anime.js usan chunks diferidos.

## Lighthouse móvil

Lighthouse 13.5.0, Chrome headless local, compilación de producción servida por `vite preview`, perfil móvil con throttling predeterminado y caché fría. Los informes HTML/JSON permanecen en `reports/` en el equipo; se excluyen del repositorio.

| Pantalla | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| Home | 98 | 100 | 100 | 100 |
| Horas de trabajo | 98 | 100 | 100 | 100 |
| Fondo de emergencia | 99 | 100 | 100 | 100 |
| CDT | 99 | 100 | 100 | 100 |
| 4×1000 | 99 | 100 | 100 | 100 |
| Acceso | 99 | 100 | 100 | 100 |
| Política | 99 | 100 | 100 | 100 |

CLS de 0 a 0,0003 en estas mediciones. Se corrigió un salto por el placeholder de carga y un nombre accesible que no coincidía con el texto de la marca. Quedan oportunidades menores de cadena de recursos y CSS que bloquea el primer pintado; los resultados superan el objetivo solicitado. Estos valores son de laboratorio local, no un resultado garantizado de producción ni datos de Core Web Vitals de visitantes reales.

## Revisión en navegador

- Diseño de portada y bento en escritorio, tableta y móvil de 360 px. Corrección del halo decorativo que producía desbordamiento horizontal.
- Cambio de precio de $300.000 a $600.000: 18,2 → 36,4 horas; ingreso cero muestra explicación y bloquea compartir cifras inválidas.
- Fondo con ahorro igual a la meta: faltante cero, plazo cero y progreso 100 %.
- GMF sin exención: $10.000.000 → $40.000 mensuales y $480.000 en la proyección anual.
- Copiar resultado devuelve confirmación visible en el navegador. La interfaz nativa de Web Share depende del navegador/sistema; también hay botón directo de copia.
- Navegación hash, restauración de ejemplos, foco al cambiar de pantalla y recarga conservando el acceso.
- Casilla de autorización inicialmente sin marcar; formulario desactivado mientras falta configuración. Vista previa sin transmitir datos personales.
- Imagen social original de 1200×630 revisada visualmente.

Las pruebas automáticas no sustituyen una auditoría de accesibilidad con usuarios y lectores de pantalla. No se ejecutó una revisión manual completa con lector de pantalla ni en Safari/iOS real.

## Pendiente del propietario

Completar responsable, correo, ciudad, URL Apps Script, comunidad y redes. Revisar política con abogado. Hacer la prueba de integración con la aplicación web real y confirmar filas, deduplicación y atención de derechos. No se hicieron envíos reales ni se habilitó la captura. Las cifras oficiales están documentadas; verificar su vigencia al activar y al cambiar de año.

## Fases y commits

1. `16e2bcb`: estructura, identidad y primer despliegue.
2. `263fe53`: fórmulas y pruebas.
3. `1664d7c`: UI de calculadoras, rediseño bento y Anime.js.
4. `a896d0e`: acceso, política y captura idempotente en Sheets.
5. Commit final de pulido: SEO, imagen social, auditorías, accesibilidad, documentación y ajustes de integración.

## Actualización de registro

Responsable diligenciado con los datos facilitados por el propietario. Pregunta de comunidad con Sí/No obligatorio, sin selección inicial y acceso igual para ambas respuestas. 89 pruebas pasan, incluida validación de respuesta vacía. Hoja nativa de Google Sheets creada e inspeccionada por API: `Leads!A1:O2`, quince encabezados, sin registros personales, filtro y primera fila fija, región Colombia y zona America/Bogota. Se revisó visualmente el XLSX previo a importar; el navegador solicitó acceso a Google y no permitió inspección visual nativa. No se ha desplegado Apps Script ni probado recepción de filas reales.
