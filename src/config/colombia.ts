// ⚠️ VERIFICAR antes de publicar: revisar vigencia, cambios judiciales y fuentes oficiales.
// Fecha de revisión: 2026-11-04. Valores nominales; no se actualizan automáticamente.
export const colombia = {
  year: 2026,
  reviewedAt: '2026-11-04',
  minimumWage: 1_750_905,
  transportAllowance: 249_095,
  weeklyHours: 42, // Desde el 15 de julio de 2026. No aplica a todos los regímenes laborales.
  uvt: 52_374,
  gmfExemptUVT: 350,
  gmfRate: 0.004,
  withholdingRate: 0.04, // Rendimientos de títulos de renta fija; editable en el simulador.
  sources: {
    minimumWage: 'https://dapre.presidencia.gov.co/normativa/normativa/DECRETO%20No.%200159%20DEL%2019%20DE%20FEBRERO%20DE%202026.pdf',
    transportAllowance: 'https://www.cancilleria.gov.co/normograma/compilacion/docs/decreto_1470_2025.htm',
    weeklyHours: 'https://normograma.mintic.gov.co/mintic/compilacion/docs/circular_mintra_0101_2025.htm',
    uvt: 'https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0227_2025.htm',
    gmf: 'https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_3949_2025.htm',
    withholding: 'https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_19736_2014.htm',
  },
} as const;
