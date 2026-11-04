export const calculators = [
  { slug: 'horas-de-trabajo', title: 'Horas de trabajo', question: '¿Cuánto de tu tiempo cuesta?', description: 'Convierte el precio de eso que quieres en horas de tu trabajo.', icon: 'clock', tag: 'TU TIEMPO TAMBIÉN VALE' },
  { slug: 'fondo-de-emergencia', title: 'Fondo de emergencia', question: '¿Cuánto aguantas sin sueldo?', description: 'Ponle una cifra a tu tranquilidad y un plazo a tu ahorro.', icon: 'shield', tag: 'TU TRANQUILIDAD, EN NÚMEROS' },
  { slug: 'cdt', title: 'Simulador de CDT', question: '¿Cuánto recibirías de verdad?', description: 'Calcula los rendimientos de un CDT, después de retención.', icon: 'chart', tag: 'CUENTAS CLARAS' },
  { slug: '4x1000', title: 'Calculadora 4×1000', question: '¿Cuánto se va en el 4×1000?', description: 'Entiende el impuesto a tus movimientos y la exención mensual.', icon: 'percent', tag: 'CADA PESO CUENTA' },
] as const;
export type CalculatorSlug = typeof calculators[number]['slug'];
