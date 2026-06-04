import { PrestacionesInput, PrestacionesOutput, SalarioInput, SalarioOutput, CostoLaboralInput, CostoLaboralOutput } from "../types";
import { RETENCIONES_CONFIG, ISR_ESCALAS } from "../constants";

// Helper to calculate date differences
export function calcularTiempoServicio(fechaIngresoStr: string, fechaSalidaStr: string) {
  const ing = new Date(fechaIngresoStr);
  const sal = new Date(fechaSalidaStr);
  
  if (isNaN(ing.getTime()) || isNaN(sal.getTime())) {
    return { anos: 0, meses: 0, dias: 0, totalMeses: 0 };
  }
  
  let years = sal.getFullYear() - ing.getFullYear();
  let months = sal.getMonth() - ing.getMonth();
  let days = sal.getDate() - ing.getDate();
  
  if (days < 0) {
    months--;
    // Get days in the previous month of sal
    const prevMonth = new Date(sal.getFullYear(), sal.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years < 0) {
    return { anos: 0, meses: 0, dias: 0, totalMeses: 0 };
  }
  
  const totalMeses = (years * 12) + months + (days / 30);
  
  return { anos: years, meses: months, dias: days, totalMeses };
}

export function calcularPrestacionesLaborales(input: PrestacionesInput): PrestacionesOutput {
  const salario = parseFloat(input.salarioMensual) || 0;
  const salarioDiario = salario / 23.83; // Ministry of Labor standard divider
  
  const { anos, meses, dias, totalMeses } = calcularTiempoServicio(input.fechaIngreso, input.fechaSalida);
  
  // 1. Preaviso
  let diasPreaviso = 0;
  if (input.incluyePreaviso) {
    if (totalMeses >= 3 && totalMeses < 6) {
      diasPreaviso = 7;
    } else if (totalMeses >= 6 && totalMeses < 12) {
      diasPreaviso = 14;
    } else if (totalMeses >= 12) {
      diasPreaviso = 28;
    }
  }
  const preaviso = diasPreaviso * salarioDiario;
  
  // 2. Cesantía
  let diasCesantia = 0;
  if (input.incluyeCesantia) {
    if (totalMeses >= 3 && totalMeses < 6) {
      diasCesantia = 6;
    } else if (totalMeses >= 6 && totalMeses < 12) {
      diasCesantia = 13;
    } else if (totalMeses >= 12) {
      // 21 days per year for 1 to 5 years
      // 23 days per year if worked > 5 years
      const rateAnual = (anos >= 5) ? 23 : 21;
      
      diasCesantia = anos * rateAnual;
      
      // Proporcional de la fracción de año restante (si es mayor a 6 meses se otorga cesantía completa)
      const mesesMasDiasProporcionales = meses + (dias / 30);
      if (mesesMasDiasProporcionales >= 6) {
        diasCesantia += rateAnual;
      } else if (mesesMasDiasProporcionales >= 3) {
        // Fracción menor de 6 meses pero mayor de 3 meses da días parciales
        diasCesantia += (rateAnual / 2);
      }
    }
  }
  const cesantia = diasCesantia * salarioDiario;
  
  // 3. Vacaciones
  // El usuario puede ingresar manualmente los días de vacaciones pendientes, o se puede estimar
  let diasVacaciones = input.diasVacacionesPendientes;
  if (diasVacaciones === 0) {
    // Si no especifica días pendientes, estimamos proporcionalidad del último año incompleto
    const mesesPeriodoActual = totalMeses % 12;
    if (mesesPeriodoActual >= 5) {
      if (mesesPeriodoActual >= 5 && mesesPeriodoActual < 6) diasVacaciones = 6;
      else if (mesesPeriodoActual >= 6 && mesesPeriodoActual < 7) diasVacaciones = 7;
      else if (mesesPeriodoActual >= 7 && mesesPeriodoActual < 8) diasVacaciones = 8;
      else if (mesesPeriodoActual >= 8 && mesesPeriodoActual < 9) diasVacaciones = 9;
      else if (mesesPeriodoActual >= 9 && mesesPeriodoActual < 10) diasVacaciones = 10;
      else if (mesesPeriodoActual >= 10 && mesesPeriodoActual < 11) diasVacaciones = 11;
      else if (mesesPeriodoActual >= 11) diasVacaciones = 12;
    }
    // Si ya completó años, se asume que las del año anterior fueron tomadas unless stated, 
    // pero si se desahucia sin haberlas tomado, se suman 14 días (1-5 años) o 18 (5+ años)
    if (anos > 0 && input.diasVacacionesPendientes === 0) {
      // Añadimos vacaciones acumuladas por defecto si el usuario no las modificó
      diasVacaciones += (anos >= 5) ? 18 : 14;
    }
  }
  const vacaciones = diasVacaciones * salarioDiario;
  
  // 4. Regalía Pascual (Sueldo 13 proporcional)
  let regalia = 0;
  if (input.incluyeRegalia) {
    const sal = new Date(input.fechaSalida);
    // Calcular meses trabajados en el año actual (de Enero a fecha de salida)
    // El sueldo 13 se computa del salario devengado entre el 1 de enero y la fecha de salida.
    const mesSalida = sal.getMonth() + 1; // 1 to 12
    const diaSalida = sal.getDate();
    const fraccionMes = Math.min(1, diaSalida / 30);
    const mesesAnioActual = (mesSalida - 1) + fraccionMes;
    
    regalia = (salario / 12) * mesesAnioActual;
  }
  
  // 5. Bonificación estimada
  const diasBono = (anos >= 3) ? 60 : 45;
  const bonificacion = (salarioDiario * diasBono) * 0.10; // Suponemos una bonificación mínima del 10% del beneficio proporcional
  
  const total = preaviso + cesantia + vacaciones + regalia;
  
  return {
    tiempoServicio: {
      anos,
      meses,
      dias,
      totalMeses
    },
    salarioDiario,
    preaviso,
    cesantia,
    vacaciones,
    regalia,
    bonificacion,
    total
  };
}

export function calcularSalarioNeto(input: SalarioInput): SalarioOutput {
  const salarioBruto = parseFloat(input.salarioBruto) || 0;
  const ingresosAdicionales = parseFloat(input.ingresosAdicionales || "0") || 0;
  
  // Salario base para seguridad social
  const salarioBaseSS = salarioBruto; // Las comisiones y horas extras cotizan, bonos no.
  
  // Topes salariales nacionales (Basados en salario mínimo de Grande RD$ 24,150)
  const salarioMinimoGrande = 24150;
  const topeAFP = salarioMinimoGrande * RETENCIONES_CONFIG.afp.topeSueldosMinimos; // RD$ 483,000
  const topeSFS = salarioMinimoGrande * RETENCIONES_CONFIG.sfs.topeSueldosMinimos; // RD$ 241,500
  
  // Descuentos de Seguridad Social (Empleado)
  const afp = Math.min(salarioBaseSS, topeAFP) * RETENCIONES_CONFIG.afp.empleado;
  const sfs = Math.min(salarioBaseSS, topeSFS) * RETENCIONES_CONFIG.sfs.empleado;
  
  // Base imponible para ISR (Deducciones previas reducen la base imponible)
  const salarioSujetoISR = Math.max(0, (salarioBruto + ingresosAdicionales) - afp - sfs);
  
  // Cálculo de ISR mensual basados en los tramos de la DGII
  let isr = 0;
  for (let i = ISR_ESCALAS.length - 1; i >= 0; i--) {
    const escala = ISR_ESCALAS[i];
    if (salarioSujetoISR > escala.limiteInferior) {
      const excedente = salarioSujetoISR - escala.limiteInferior;
      isr = excedente * escala.tasa + escala.montoFijo;
      break;
    }
  }
  
  const retencionesTotales = afp + sfs + isr;
  const salarioNeto = (salarioBruto + ingresosAdicionales) - retencionesTotales;
  const porcentajeNeto = salarioBruto > 0 ? (salarioNeto / (salarioBruto + ingresosAdicionales)) * 100 : 0;
  
  return {
    salarioBruto,
    ingresosAdicionales,
    afp,
    sfs,
    salarioSujetoISR,
    isr,
    salarioNeto,
    retencionesTotales,
    porcentajeNeto
  };
}

export function calcularCostoLaboral(input: CostoLaboralInput): CostoLaboralOutput {
  const salarioMensual = parseFloat(input.salarioMensual) || 0;
  
  // Topes salariales nacionales
  const salarioMinimoGrande = 24150;
  const topeAFP = salarioMinimoGrande * RETENCIONES_CONFIG.afp.topeSueldosMinimos; // RD$ 483,000
  const topeSFS = salarioMinimoGrande * RETENCIONES_CONFIG.sfs.topeSueldosMinimos; // RD$ 241,500
  const topeARL = salarioMinimoGrande * RETENCIONES_CONFIG.arl.topeSueldosMinimos; // RD$ 96,600
  
  // Aportes Patronales (Empleador)
  const afpPatronal = Math.min(salarioMensual, topeAFP) * RETENCIONES_CONFIG.afp.empleador;
  const sfsPatronal = Math.min(salarioMensual, topeSFS) * RETENCIONES_CONFIG.sfs.empleador;
  const arl = Math.min(salarioMensual, topeARL) * (input.riesgoLaboral / 100);
  
  // Provisiones recomendadas anuales convertidas a mensualidad para el empleador
  // Vacaciones acumulativas (aprox 14 días por año) -> ~4.61% ordinario
  const provisionVacaciones = (salarioMensual / 12) * (14 / 14.2); // ~4.9%
  // Regalía Pascual (Sueldo 13 obligado de 1 sueldo adicional por año) -> 8.33% (~1/12)
  const provisionRegalia = salarioMensual / 12;
  // Cesantía o fondo de contingencia (aprox 21 días por año, ~5.4%)
  const provisionCesantia = (salarioMensual / 12) * (21 / 30);
  
  const totalCostoEmpresarial = salarioMensual + afpPatronal + sfsPatronal + arl + provisionVacaciones + provisionRegalia + provisionCesantia;
  const porcentajeAdicional = salarioMensual > 0 ? ((totalCostoEmpresarial - salarioMensual) / salarioMensual) * 100 : 0;
  
  return {
    salarioBase: salarioMensual,
    afpPatronal,
    sfsPatronal,
    arl,
    provisionVacaciones,
    provisionRegalia,
    provisionCesantia,
    totalCostoEmpresarial,
    porcentajeAdicional
  };
}
