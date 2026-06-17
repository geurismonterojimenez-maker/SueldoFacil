/**
 * CONFIGURACIÓN LEGAL CENTRALIZADA - REPÚBLICA DOMINICANA (2026)
 * Permite actualizar tasas, topes y tramos de nómina y prestaciones desde un único archivo.
 */

export const LEGAL_CONFIG = {
  vigencia: "Año Fiscal 2026",
  ultimaActualizcion: "16 de Junio, 2026",
  
  // Salario Mínimo de Referencia para topes de la TSS
  // En RD se usa el salario mínimo oficial del sector comercial grande como base para los topes de cotización
  salarioMinimoTSS: 24150,

  // Parámetros de la Tesorería de la Seguridad Social (TSS) - Ley 87-01
  tss: {
    afp: {
      empleado: 0.0287,       // 2.87%
      empleador: 0.0710,      // 7.10%
      topeSalariosMinimos: 20 // Tope de cotización: 20 salarios mínimos
    },
    sfs: {
      empleado: 0.0304,       // 3.04%
      empleador: 0.0709,      // 7.09%
      topeSalariosMinimos: 10 // Tope de cotización: 10 salarios mínimos
    },
    arl: {
      empleado: 0.00,         // El empleado no aporta a riesgos laborales
      empleador: 0.0120,      // 1.20% promedio (varía por nivel de riesgo de empresa)
      topeSalariosMinimos: 4  // Tope de cotización: 4 salarios mínimos
    }
  },

  // Impuesto Sobre la Renta (ISR) para Personas Físicas - DGII 2026
  // Escala impositiva mensual
  dgii: {
    tramosISR: [
      {
        limiteInferior: 0,
        limiteSuperior: 34685.00,
        tasa: 0.00,
        montoFijo: 0,
        articuloColeccion: "Artículo 296, Tramo I (Exento)"
      },
      {
        limiteInferior: 34685.01,
        limiteSuperior: 52027.42,
        tasa: 0.15,
        montoFijo: 0,
        articuloColeccion: "Artículo 296, Tramo II (15%)"
      },
      {
        limiteInferior: 52027.43,
        limiteSuperior: 72260.25,
        tasa: 0.20,
        montoFijo: 2601.36,
        articuloColeccion: "Artículo 296, Tramo III (20%)"
      },
      {
        limiteInferior: 72260.26,
        limiteSuperior: Infinity,
        tasa: 0.25,
        montoFijo: 6647.92,
        articuloColeccion: "Artículo 296, Tramo IV (25%)"
      }
    ]
  },

  // Normativa del Código de Trabajo (Ley 16-92)
  prestaciones: {
    divisorSalarial: 23.83, // Divisor oficial para salario diario (Art. 82)
    articulos: {
      preaviso: "Artículo 76",
      cesantia: "Artículo 80",
      vacaciones: "Artículo 177 y siguientes",
      regalia: "Artículo 219"
    },
    reglasPreaviso: [
      { minMeses: 3, maxMeses: 6, dias: 7 },
      { minMeses: 6, maxMeses: 12, dias: 14 },
      { minMeses: 12, maxAnos: Infinity, dias: 28 }
    ],
    reglasCesantia: [
      { minMeses: 3, maxMeses: 6, dias: 6 },
      { minMeses: 6, maxMeses: 12, dias: 13 },
      { minAnos: 1, maxAnos: 5, diasPorAnio: 21 },
      { minAnos: 5, maxAnos: Infinity, diasPorAnio: 23 }
    ],
    reglasVacacionesAcumuladas: [
      { minAnos: 1, maxAnos: 5, dias: 14 },
      { minAnos: 5, maxAnos: Infinity, dias: 18 }
    ],
    reglasVacacionesProporcionales: [
      { meses: 5, dias: 6 },
      { meses: 6, dias: 7 },
      { meses: 7, dias: 8 },
      { meses: 8, dias: 9 },
      { meses: 9, dias: 10 },
      { meses: 10, dias: 11 },
      { meses: 11, dias: 12 }
    ]
  },

  // Sueldo 13 y Bonos
  diciembre: {
    regaliaPascual: {
      divisor: 12,
      exencionTSS: true,
      exencionISR: true,
      embargable: false,
      articulo: "Artículo 219 al 222",
      fechaLimitePago: "20 de Diciembre"
    },
    utilidades: {
      empresaConBeneficios: true,
      tasaReparto: 0.10, // 10% de las utilidades netas anuales
      díasBonoMenos3Anos: 45, // 45 días de salario ordinario
      díasBonoMas3Anos: 60,   // 60 días de salario ordinario
      exencionTSS: true,
      exencionISR: false, // Las utilidades sí tributan ISR
      articulo: "Artículo 223"
    }
  }
};
