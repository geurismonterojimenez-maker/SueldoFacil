/**
 * AUTOMATED QA TEST SUITE & CI VALIDATOR - SUELDOFÁCIL RD
 * Runs mathematical verification across all critical labor and tax calculators.
 * Executed during build time ('npm run build') to block deployment if regression or formula drift is detected.
 */

import { calcularPrestacionesLaborales, calcularSalarioNeto, calcularCostoLaboral } from "../src/utils/calculator";
import { LEGAL_CONFIG } from "../src/data/legalConfig";

interface TestCase {
  name: string;
  run: () => boolean;
}

const testCases: TestCase[] = [
  // ==========================================
  // SEGMENTO 1: CALCULADORA DE SUELDO NETO Y RETENCIONES TSS
  // ==========================================
  {
    name: "Sueldo Neto - Salario base Cero",
    run: () => {
      const result = calcularSalarioNeto({ salarioBruto: "0", ingresosAdicionales: "0" });
      const pass = result.afp === 0 && result.sfs === 0 && result.isr === 0 && result.salarioNeto === 0;
      if (!pass) console.error("Fallo Salario Cero:", result);
      return pass;
    }
  },
  {
    name: "Sueldo Neto - Salario Negativo e Invalidez",
    run: () => {
      const result = calcularSalarioNeto({ salarioBruto: "-5000", ingresosAdicionales: "-100" });
      const pass = result.afp === 0 && result.sfs === 0 && result.isr === 0 && result.salarioNeto === 0;
      if (!pass) console.error("Fallo Salario Negativo:", result);
      return pass;
    }
  },
  {
    name: "Sueldo Neto - Letras y Ruido (NaN Prevention)",
    run: () => {
      const result = calcularSalarioNeto({ salarioBruto: "abc", ingresosAdicionales: "xyz" });
      const pass = !isNaN(result.salarioNeto) && result.salarioNeto === 0;
      if (!pass) console.error("Fallo Previsión de letras (NaN):", result);
      return pass;
    }
  },
  {
    name: "Sueldo Neto - Salario Dominicano Promedio (RD$ 30,000 - Exento de ISR)",
    run: () => {
      const result = calcularSalarioNeto({ salarioBruto: "30000", ingresosAdicionales: "0" });
      // AFP: 30000 * 2.87% = 861
      // SFS: 30000 * 3.04% = 912
      // Base Sujeto ISR = 30000 - 861 - 912 = 28,227. Exento mensual (< 34,685)
      const expectedAFP = 30000 * LEGAL_CONFIG.tss.afp.empleado;
      const expectedSFS = 30000 * LEGAL_CONFIG.tss.sfs.empleado;
      const pass = Math.abs(result.afp - expectedAFP) < 0.1 &&
                   Math.abs(result.sfs - expectedSFS) < 0.1 &&
                   result.isr === 0 &&
                   Math.abs(result.salarioNeto - (30000 - expectedAFP - expectedSFS)) < 0.1;
      if (!pass) console.error("Fallo Salario Promedio RD$30K:", result);
      return pass;
    }
  },
  {
    name: "Sueldo Neto - Tope de Cotización TSS (Salario Extremo: RD$ 600,000)",
    run: () => {
      const result = calcularSalarioNeto({ salarioBruto: "600000", ingresosAdicionales: "0" });
      // SFS capped at 10 salarios minimos = 10 * 24150 = 241,500
      // Max SFS = 241500 * 3.04% = 7,341.60
      // AFP capped at 20 salarios minimos = 20 * 24150 = 483,000
      // Max AFP = 483000 * 2.87% = 13,862.10
      const topeAFPVal = LEGAL_CONFIG.salarioMinimoTSS * LEGAL_CONFIG.tss.afp.topeSalariosMinimos;
      const topeSFSVal = LEGAL_CONFIG.salarioMinimoTSS * LEGAL_CONFIG.tss.sfs.topeSalariosMinimos;
      const expectedAFP = topeAFPVal * LEGAL_CONFIG.tss.afp.empleado;
      const expectedSFS = topeSFSVal * LEGAL_CONFIG.tss.sfs.empleado;
      
      const pass = Math.abs(result.afp - expectedAFP) < 0.1 && 
                   Math.abs(result.sfs - expectedSFS) < 0.1;
      if (!pass) console.error("Fallo Verificación de Topea TSS:", { result, expectedAFP, expectedSFS });
      return pass;
    }
  },

  // ==========================================
  // SEGMENTO 2: IMPUESTO SOBRE LA RENTA (ISR) Y ESCALAS DGII
  // ==========================================
  {
    name: "ISR - Tramo II (15% sobre excedente, RD$ 50,000 antes de SS)",
    run: () => {
      // Si salario base = RD$ 52,000
      // AFP = 52000 * 0.0287 = 1492.4
      // SFS = 52000 * 0.0304 = 1580.8
      // Base imponible = 52000 - 1492.4 - 1580.8 = 48,926.8
      // Escala II: Excedente sobre 34,685.01 = 48,926.8 - 34,685.01 = 14,241.79
      // ISR = 14,241.79 * 15% = 2,136.27
      const result = calcularSalarioNeto({ salarioBruto: "52000", ingresosAdicionales: "0" });
      const expectedISR = (result.salarioSujetoISR - 34685.01) * 0.15;
      const pass = Math.abs(result.isr - expectedISR) < 0.5;
      if (!pass) console.error("Fallo ISR Escala II RD$52K:", { result, expectedISR });
      return pass;
    }
  },
  {
    name: "ISR - Tramo IV (Escala Máxima del 25%)",
    run: () => {
      // Salario bruto muy alto para disparar el tramo superior de la DGII
      const result = calcularSalarioNeto({ salarioBruto: "120000", ingresosAdicionales: "0" });
      // AFP = 120000 * 0.0287 = 3,444
      // SFS = 120000 * 0.0304 = 3,648
      // Base imponible = 120000 - 3444 - 3648 = 112,908
      // Escala IV: Excedente sobre 72,260.26 = 112,908 - 72,260.26 = 40,647.74
      // ISR = (40,647.74 * 0.25) + 6,647.92 = 10,161.94 + 6,647.92 = 16,809.86
      const expectedISR = ((result.salarioSujetoISR - 72260.26) * 0.25) + 6647.92;
      const pass = Math.abs(result.isr - expectedISR) < 0.5;
      if (!pass) console.error("Fallo ISR Escala IV RD$120K:", { result, expectedISR });
      return pass;
    }
  },

  // ==========================================
  // SEGMENTO 3: PRESTACIONES LABORALES (CÓDIGO DE TRABAJO DE RD)
  // ==========================================
  {
    name: "Prestaciones - Menos de 3 meses (Sin Preaviso ni Cesantía acumulados)",
    run: () => {
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2026-01-01",
        fechaSalida: "2026-02-15", // 1 mes y 14 días
        salarioMensual: "30000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: true,
        incluyeCesantia: true,
        diasVacacionesPendientes: 0,
        incluyeRegalia: false
      });
      // Menos de 3 meses de servicio -> No preaviso ni cesantía
      const pass = result.preaviso === 0 && result.cesantia === 0;
      if (!pass) console.error("Fallo Prestaciones < 3 meses:", result);
      return pass;
    }
  },
  {
    name: "Prestaciones - Escala 3 a 6 meses de servicio",
    run: () => {
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2026-01-01",
        fechaSalida: "2026-05-01", // 4 meses exactos
        salarioMensual: "30000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: true,
        incluyeCesantia: true,
        diasVacacionesPendientes: 0,
        incluyeRegalia: false,
        vacacionesTomadas: true
      });
      // 3 a 6 meses -> Preaviso: 7 días, Cesantía: 6 días
      const salarioDiario = 30000 / 23.83;
      const expectedPreaviso = 7 * salarioDiario;
      const expectedCesantia = 6 * salarioDiario;
      const pass = Math.abs(result.preaviso - expectedPreaviso) < 0.1 &&
                   Math.abs(result.cesantia - expectedCesantia) < 0.1;
      if (!pass) console.error("Fallo Prestaciones 4 meses:", { result, expectedPreaviso, expectedCesantia });
      return pass;
    }
  },
  {
    name: "Prestaciones - Escala 6 a 12 meses de servicio",
    run: () => {
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2025-01-01",
        fechaSalida: "2025-08-01", // 7 meses
        salarioMensual: "45000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: true,
        incluyeCesantia: true,
        diasVacacionesPendientes: 0,
        incluyeRegalia: false,
        vacacionesTomadas: true
      });
      // 6 a 12 meses -> Preaviso: 14 días, Cesantía: 13 días
      const salarioDiario = 45000 / 23.83;
      const expectedPreaviso = 14 * salarioDiario;
      const expectedCesantia = 13 * salarioDiario;
      const pass = Math.abs(result.preaviso - expectedPreaviso) < 0.1 &&
                   Math.abs(result.cesantia - expectedCesantia) < 0.1;
      if (!pass) console.error("Fallo Prestaciones 7 meses:", { result, expectedPreaviso, expectedCesantia });
      return pass;
    }
  },
  {
    name: "Prestaciones - Antigüedad Mayor (1 Año, Preaviso = 28 días, Cesantía = 21 días)",
    run: () => {
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2025-01-01",
        fechaSalida: "2026-01-01", // 1 año de labor
        salarioMensual: "25000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: true,
        incluyeCesantia: true,
        diasVacacionesPendientes: 0,
        incluyeRegalia: false,
        vacacionesTomadas: true
      });
      // 1 año -> Preaviso: 28 días, Cesantía: 21 días
      const salarioDiario = 25000 / 23.83;
      const expectedPreaviso = 28 * salarioDiario;
      const expectedCesantia = 21 * salarioDiario;
      const pass = Math.abs(result.preaviso - expectedPreaviso) < 0.1 &&
                   Math.abs(result.cesantia - expectedCesantia) < 0.1;
      if (!pass) console.error("Fallo Prestaciones 1 año antigüedad:", { result, expectedPreaviso, expectedCesantia });
      return pass;
    }
  },
  {
    name: "Prestaciones - Antigüedad Extrema de 10 Años (Cesantía = 23 días por año)",
    run: () => {
      // 10 años. Preaviso: 28 días. Cesantía: 23 días * 10 años = 230 días
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2016-01-01",
        fechaSalida: "2026-01-01",
        salarioMensual: "50000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: true,
        incluyeCesantia: true,
        diasVacacionesPendientes: 0,
        incluyeRegalia: false,
        vacacionesTomadas: true
      });
      const salarioDiario = 50000 / 23.83;
      const expectedPreaviso = 28 * salarioDiario;
      const expectedCesantia = 230 * salarioDiario;
      const pass = Math.abs(result.preaviso - expectedPreaviso) < 0.1 &&
                   Math.abs(result.cesantia - expectedCesantia) < 0.1;
      if (!pass) console.error("Fallo Prestaciones de 10 años:", { result, expectedPreaviso, expectedCesantia });
      return pass;
    }
  },

  // ==========================================
  // SEGMENTO 4: SUELDO 13 Y REGALÍA PASCUAL (MI DICIEMBRE)
  // ==========================================
  {
    name: "Sueldo 13 / Regalía Pascual - Año completo",
    run: () => {
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2025-01-01",
        fechaSalida: "2025-12-31", // Completa el año completo entero
        salarioMensual: "36000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: false,
        incluyeCesantia: false,
        diasVacacionesPendientes: 0,
        incluyeRegalia: true,
        vacacionesTomadas: true
      });
      // Sifre de regalía esperado = 36000 pesos por año completo
      const expectedRegalia = 36000;
      const pass = Math.abs(result.regalia - expectedRegalia) < 1.0;
      if (!pass) console.error("Fallo Regalía Pascual Año Completo:", { result, expectedRegalia });
      return pass;
    }
  },
  {
    name: "Sueldo 13 / Regalía Pascual - Fracción Proporcional (6 meses exactos)",
    run: () => {
      const result = calcularPrestacionesLaborales({
        fechaIngreso: "2025-01-01",
        fechaSalida: "2025-07-01", // 6 meses acumulativos
        salarioMensual: "24000",
        tipoSalida: "desahucio_patronal",
        incluyePreaviso: false,
        incluyeCesantia: false,
        diasVacacionesPendientes: 0,
        incluyeRegalia: true,
        vacacionesTomadas: true
      });
      // Sifre de regalía esperado = (24000) * (6 / 12) = 12000 pesos
      const expectedRegalia = 12000;
      const pass = Math.abs(result.regalia - expectedRegalia) < 1.1;
      if (!pass) console.error("Fallo Regalía Pascual 6 Meses:", { result, expectedRegalia });
      return pass;
    }
  }
];

// Execute suite
let failedTestsCount = 0;
console.log("\n========================================================");
console.log("⚡ INSTALANDO SUITE DE CONTROL DE CALIDAD - SÉMANTICA LABORAL RD");
console.log("========================================================");

testCases.forEach((tc, idx) => {
  try {
    const success = tc.run();
    if (success) {
      console.log(`✅ [TEST ${idx + 1}/${testCases.length}] MATCH: ${tc.name}`);
    } else {
      console.error(`❌ [TEST ${idx + 1}/${testCases.length}] ERROR EN FÓRMULA: ${tc.name}`);
      failedTestsCount++;
    }
  } catch (error) {
    console.error(`💥 [TEST ${idx + 1}/${testCases.length}] CRASH: ${tc.name}`, error);
    failedTestsCount++;
  }
});

console.log("========================================================");
if (failedTestsCount === 0) {
  console.log("🎉 ¡EXCELENTE! Todos los test de QA matemática han pasado impecablemente.");
  console.log("========================================================\n");
  process.exit(0);
} else {
  console.error(`🚨 ALERTA: Fallaron ${failedTestsCount} pruebas matemáticas de legislación dominicana.`);
  console.error("El build se cancelará para evitar regresión en producción.\n");
  process.exit(1);
}
