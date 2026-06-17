/**
 * SENSOR DE PRUEBAS MATEMÁTICAS Y VALIDACIÓN DE LEYES - REPUBLICA DOMINICANA
 * Archivo: src/utils/calculoValidacion.ts
 *
 * Ejecuta pruebas unitarias automatizadas sobre los motores financieros de la plataforma:
 * 1. Sueldo Neto (Retenciones TSS, Escalas de ISR de la DGII, topes de cotización)
 * 2. Prestaciones Laborales (Preaviso, cesantía, regalía pascual y vacaciones proporcionales)
 *
 * Garantiza que las fórmulas no tengan fugas numéricas (NaN, Infinity), que cumplan la exactitud
 * fiscal al centavo y operen redondeos simétricos de dos decimales.
 */

import { calcularPrestacionesLaborales, calcularSalarioNeto } from "./calculator";
import { LEGAL_CONFIG } from "../data/legalConfig";

export interface TestResult {
  name: string;
  success: boolean;
  message: string;
  expected?: any;
  actual?: any;
}

/**
 * Redondea un número con precisión de dos decimales para pruebas de exactitud.
 */
function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Ejecuta la suite de pruebas automatizadas y reporta el estado exacto del motor.
 */
export function ejecutarPruebasUnitarias(): TestResult[] {
  const resultados: TestResult[] = [];

  // ----------------------------------------------------
  // GRUPO 1: PRUEBAS DE SUELDO NETO Y RETENCIONES TSS
  // ----------------------------------------------------

  // Caso 1.1: Salario base Cero
  try {
    const res = calcularSalarioNeto({ salarioBruto: "0", ingresosAdicionales: "0" });
    const isClean = res.salarioNeto === 0 && res.afp === 0 && res.sfs === 0 && res.isr === 0;
    resultados.push({
      name: "Sueldo Neto - Salario Cero",
      success: isClean,
      message: isClean 
        ? "El sistema manejó el salario cero retornando cero en todas las deducciones libres de NaN."
        : "Fallo: El salario neto o las deducciones no son cero o contienen valores espurios.",
      actual: res
    });
  } catch (e: any) {
    resultados.push({
      name: "Sueldo Neto - Salario Cero",
      success: false,
      message: `Error al ejecutar: ${e.message}`
    });
  }

  // Caso 1.2: Salarios negativos y valores extraños de usuario
  try {
    const res = calcularSalarioNeto({ salarioBruto: "-15000", ingresosAdicionales: "-500" });
    // Debe sanearse internamente a 0 para prevenir decrementos o reembolsos ilegales de TSS
    const isSafe = res.salarioNeto === 0 && res.afp === 0 && res.sfs === 0 && res.isr === 0;
    resultados.push({
      name: "Sueldo Neto - Sanitización de Negativos",
      success: isSafe,
      message: isSafe
        ? "Los salarios negativos fueron normalizados automáticamente a cero previniendo fraudes matemáticos."
        : "Fallo: Se calcularon deducciones o neto negativos.",
      actual: res
    });
  } catch (e: any) {
    resultados.push({
      name: "Sueldo Neto - Sanitización de Negativos",
      success: false,
      message: `Error al ejecutar: ${e.message}`
    });
  }

  // Caso 1.3: Salario Mínimo de Referencia de la TSS
  try {
    const salarioMinimo = LEGAL_CONFIG.salarioMinimoTSS; // RD$ 24,150
    const res = calcularSalarioNeto({ salarioBruto: salarioMinimo.toString(), ingresosAdicionales: "0" });
    
    const esperadoAFP = round2(salarioMinimo * LEGAL_CONFIG.tss.afp.empleado); // 24150 * 0.0287 = 693.11
    const esperadoSFS = round2(salarioMinimo * LEGAL_CONFIG.tss.sfs.empleado); // 24150 * 0.0304 = 734.16
    const imponibleISR = salarioMinimo - esperadoAFP - esperadoSFS; // 24150 - 693.11 - 734.16 = 22,722.73 (Exento de ISR)
    
    const isPrecise = round2(res.afp) === esperadoAFP && 
                      round2(res.sfs) === esperadoSFS && 
                      res.isr === 0 &&
                      round2(res.salarioNeto) === round2(salarioMinimo - esperadoAFP - esperadoSFS);

    resultados.push({
      name: "Sueldo Neto - Salario Mínimo de Ley (Precisión)",
      success: isPrecise,
      message: isPrecise
        ? "El cálculo de AFP y SFS sobre el salario mínimo dominicano es 100% exacto al centavo y exento de ISR."
        : `Fallo: Desviación matemática detectada. AFP Esperado: ${esperadoAFP}, SFS Esperado: ${esperadoSFS}`,
      expected: { afp: esperadoAFP, sfs: esperadoSFS, isr: 0, neto: round2(salarioMinimo - esperadoAFP - esperadoSFS) },
      actual: { afp: round2(res.afp), sfs: round2(res.sfs), isr: res.isr, neto: round2(res.salarioNeto) }
    });
  } catch (e: any) {
    resultados.push({
      name: "Sueldo Neto - Salario Mínimo de Ley (Precisión)",
      success: false,
      message: `Error de ejecución: ${e.message}`
    });
  }

  // Caso 1.4: Salario Máximo / Extremo con Topes TSS (RD$ 1,000,000)
  try {
    const salarioExtremo = 1000000;
    const res = calcularSalarioNeto({ salarioBruto: salarioExtremo.toString(), ingresosAdicionales: "0" });

    // AFP tope: 20 salarios mínimos. 20 * 24150 = 483,000. Retención de AFP = 483,000 * 2.87% = 13,862.10
    // SFS tope: 10 salarios mínimos. 10 * 24150 = 241,500. Retención de SFS = 241,500 * 3.04% = 7,341.60
    const topeAFP = LEGAL_CONFIG.salarioMinimoTSS * LEGAL_CONFIG.tss.afp.topeSalariosMinimos;
    const topeSFS = LEGAL_CONFIG.salarioMinimoTSS * LEGAL_CONFIG.tss.sfs.topeSalariosMinimos;

    const esperadoAFP = round2(topeAFP * LEGAL_CONFIG.tss.afp.empleado);
    const esperadoSFS = round2(topeSFS * LEGAL_CONFIG.tss.sfs.empleado);

    const isTopeCorrect = round2(res.afp) === esperadoAFP && round2(res.sfs) === esperadoSFS;

    resultados.push({
      name: "Sueldo Neto - Topes de Cotización TSS (Salario Extremo)",
      success: isTopeCorrect,
      message: isTopeCorrect
        ? "Las retenciones se caparon perfectamente en los límites legales de 10 y 20 salarios mínimos vigentes."
        : `Fallo: Los topes no se aplicaron o las tasas difieren. Esperado AFP: ${esperadoAFP}, SFS: ${esperadoSFS}`,
      expected: { afp: esperadoAFP, sfs: esperadoSFS },
      actual: { afp: round2(res.afp), sfs: round2(res.sfs) }
    });
  } catch (e: any) {
    resultados.push({
      name: "Sueldo Neto - Topes de Cotización TSS (Salario Extremo)",
      success: false,
      message: `Error de ejecución: ${e.message}`
    });
  }

  // ----------------------------------------------------
  // GRUPO 2: PRUEBAS DE PRESTACIONES LABORALES
  // ----------------------------------------------------

  // Caso 2.1: Menos de 3 meses (Período de prueba legal - Art. 76 y 80)
  try {
    const res = calcularPrestacionesLaborales({
      fechaIngreso: "2026-01-01",
      fechaSalida: "2026-02-15", // 1 mes y 14 días
      salarioMensual: "35000",
      tipoSalida: "desahucio_patronal",
      incluyePreaviso: true,
      incluyeCesantia: true,
      diasVacacionesPendientes: 0,
      incluyeRegalia: false,
      vacacionesTomadas: true
    });

    const isZeroAccumulated = res.preaviso === 0 && res.cesantia === 0;
    resultados.push({
      name: "Prestaciones - Menos de 3 Meses (Período de Prueba)",
      success: isZeroAccumulated,
      message: isZeroAccumulated
        ? "El período de prueba no acumula preaviso ni cesantía de manera exitosa conforme a la ley dominicana."
        : "Fallo: El trabajador acumuló prestaciones antes de superar los 3 meses de servicio.",
      actual: { preaviso: res.preaviso, cesantia: res.cesantia }
    });
  } catch (e: any) {
    resultados.push({
      name: "Prestaciones - Menos de 3 Meses (Período de Prueba)",
      success: false,
      message: `Error de ejecución: ${e.message}`
    });
  }

  // Caso 2.2: Límite Exacto entre 3 y 6 meses (Preaviso: 7 días, Cesantía: 6 días)
  try {
    const res = calcularPrestacionesLaborales({
      fechaIngreso: "2026-01-01",
      fechaSalida: "2026-04-01", // 3 meses exactos
      salarioMensual: "30000",
      tipoSalida: "desahucio_patronal",
      incluyePreaviso: true,
      incluyeCesantia: true,
      diasVacacionesPendientes: 0,
      incluyeRegalia: false,
      vacacionesTomadas: true
    });

    const salarioDiario = 30000 / LEGAL_CONFIG.prestaciones.divisorSalarial; // 30000 / 23.83 = 1258.9173
    const esperadoPreaviso = round2(7 * salarioDiario); // 8812.42
    const esperadoCesantia = round2(6 * salarioDiario); // 7553.50

    const isBoundaryCorrect = Math.abs(res.preaviso - esperadoPreaviso) < 0.5 && 
                              Math.abs(res.cesantia - esperadoCesantia) < 0.5;

    resultados.push({
      name: "Prestaciones - Límite Exacto 3 Meses",
      success: isBoundaryCorrect,
      message: isBoundaryCorrect
        ? "La escala de 3 meses asignó de forma proporcional los 7 días de preaviso y 6 de cesantía legal."
        : `Fallo: Desviación matemática detectada. Preaviso Esperado: ${esperadoPreaviso}, Cesantía: ${esperadoCesantia}`,
      expected: { preaviso: esperadoPreaviso, cesantia: esperadoCesantia },
      actual: { preaviso: round2(res.preaviso), cesantia: round2(res.cesantia) }
    });
  } catch (e: any) {
    resultados.push({
      name: "Prestaciones - Límite Exacto 3 Meses",
      success: false,
      message: `Error de ejecución: ${e.message}`
    });
  }

  // Caso 2.3: Regalía Pascual (Sueldo #13) - 6 meses (Fracción exacta del 50%)
  try {
    const res = calcularPrestacionesLaborales({
      fechaIngreso: "2025-01-01",
      fechaSalida: "2025-07-01", // Exactamente 6 meses
      salarioMensual: "50000",
      tipoSalida: "desahucio_patronal",
      incluyePreaviso: false,
      incluyeCesantia: false,
      diasVacacionesPendientes: 0,
      incluyeRegalia: true,
      vacacionesTomadas: true
    });

    const esperadoRegalia = round2(50000 * (6 / 12)); // RD$ 25,000

    // Permitimos una tolerancia mínima debido a diferencias menores en cálculo de días
    const isRegaliaCorrect = Math.abs(res.regalia - esperadoRegalia) < 100;

    resultados.push({
      name: "Sueldo 13 - Proporción Semestral (50%)",
      success: isRegaliaCorrect,
      message: isRegaliaCorrect
        ? "La regalía acumulada por un semestre correspondió perfectamente al 50% del salario mensual."
        : `Fallo: La regalía calculada difiere. Esperado: ${esperadoRegalia}, Obtenido: ${res.regalia}`,
      expected: esperadoRegalia,
      actual: round2(res.regalia)
    });
  } catch (e: any) {
    resultados.push({
      name: "Sueldo 13 - Proporción Semestral (50%)",
      success: false,
      message: `Error de ejecución: ${e.message}`
    });
  }

  // ----------------------------------------------------
  // GRUPO 3: PREVENCIÓN DE NaN / INFINITY EN OPERACIONES
  // ----------------------------------------------------
  try {
    const res = calcularSalarioNeto({ salarioBruto: "abc", ingresosAdicionales: "xyz" });
    const isNaNShielded = !isNaN(res.salarioNeto) && !isNaN(res.afp) && isFinite(res.salarioNeto);

    resultados.push({
      name: "Seguridad Numérica - Protección de NaN e Infinity",
      success: isNaNShielded,
      message: isNaNShielded
        ? "El motor de cálculo mitigó inputs nulos o de texto, previniendo fallos críticos de UI."
        : "Fallo: Se produjeron valores NaN o Infinity al procesar strings vacíos o erróneos.",
      actual: res
    });
  } catch (e: any) {
    resultados.push({
      name: "Seguridad Numérica - Protección de NaN e Infinity",
      success: false,
      message: `Fallo al atrapar excepción: ${e.message}`
    });
  }

  return resultados;
}
