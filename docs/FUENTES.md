# Cifras de Colombia · revisión 4 de noviembre de 2026

Todas las cifras viven en `src/config/colombia.ts` y deben verificarse antes de publicar y al cambiar de año.

| Dato 2026 | Valor | Fuente oficial |
| --- | --- | --- |
| Salario mínimo mensual | $1.750.905 | [Decreto 159 de 2026](https://dapre.presidencia.gov.co/normativa/normativa/DECRETO%20No.%200159%20DEL%2019%20DE%20FEBRERO%20DE%202026.pdf) |
| Auxilio transporte | $249.095 | [Decreto 1470 de 2025](https://www.cancilleria.gov.co/normograma/compilacion/docs/decreto_1470_2025.htm) |
| Jornada semanal | 42 horas desde 15-jul-2026 | [Circular 101 de 2025](https://normograma.mintic.gov.co/mintic/compilacion/docs/circular_mintra_0101_2025.htm) |
| UVT | $52.374 | [Resolución DIAN 238 de 2025, compilada en Resolución 227](https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0227_2025.htm) |
| Exención mensual GMF | 350 UVT ($18.330.900) | [Concepto DIAN 3949 de 2025](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_3949_2025.htm) |
| GMF | 0,004 | Estatuto Tributario, art. 872 |
| Retención títulos renta fija | 4 % del rendimiento | [Oficio DIAN 19736 de 2014](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_19736_2014.htm) |

La consulta DIAN aclara que no hace falta marcar una única cuenta: el límite de 350 UVT se distribuye entre cuentas propias. No multiplicar el cupo por banco. El selector permite simular si la exención aplica. En modo movimiento se descuenta el acumulado anterior del mes. La proyección anual supone el mismo patrón cada mes; no es una segunda exención anual.

Horas de trabajo usa 52 semanas / 12 meses, ingreso elegido por el usuario y días de 8 horas equivalentes. No calcula horas extra ni liquidación salarial. El mínimo no incluye transporte ni deducciones y se identifica como ingreso bruto.

CDT no representa una oferta comercial. Tasa E.A., base de 365 días y retención editables; sin comisiones, inflación, GMF ni condiciones particulares. No se redondean pasos intermedios; la interfaz muestra pesos enteros.
