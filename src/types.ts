export type TabType = 
  | 'home' 
  | 'prestaciones' 
  | 'salario' 
  | 'isr' 
  | 'afp_sfs' 
  | 'costos' 
  | 'horas_extras' 
  | 'nominas' 
  | 'comparador' 
  | 'cartas_contratos' 
  | 'ai_assistant' 
  | 'blog' 
  | 'dashboard'
  | 'salarios_profesiones'
  | 'calculadora_aumento'
  | 'mi_diciembre'
  | 'biblioteca_laboral'
  | 'analizador_recibos'
  | 'plan_ahorro'
  | 'presupuesto_anual';

// SEO Schema
export interface SEOConfig {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  canonical: string;
}

// Global Search Items
export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'calculadora' | 'articulo' | 'faq';
  targetTab: TabType;
  subTarget?: string;
}

// Calculadora de Prestaciones Inputs/Outputs
export interface PrestacionesInput {
  fechaIngreso: string;
  fechaSalida: string;
  salarioMensual: string;
  tipoSalida: 'desahucio_patronal' | 'desahucio_trabajador' | 'despido_justificado' | 'dimision_justificada';
  incluyePreaviso: boolean;
  incluyeCesantia: boolean;
  diasVacacionesPendientes: number;
  incluyeRegalia: boolean;
}

export interface PrestacionesOutput {
  tiempoServicio: {
    anos: number;
    meses: number;
    dias: number;
    totalMeses: number;
  };
  salarioDiario: number;
  preaviso: number;
  cesantia: number;
  vacaciones: number;
  regalia: number;
  bonificacion: number;
  total: number;
  afpSfsNetoDed?: number; // Decucciones si aplica
}

// Calculadora de Salario Neto
export interface SalarioInput {
  salarioBruto: string;
  ingresosAdicionales?: string;
  percepcionISR?: boolean;
}

export interface SalarioOutput {
  salarioBruto: number;
  ingresosAdicionales: number;
  afp: number;
  sfs: number;
  salarioSujetoISR: number;
  isr: number;
  salarioNeto: number;
  retencionesTotales: number;
  porcentajeNeto: number;
}

// Costo Laboral Empleador
export interface CostoLaboralInput {
  salarioMensual: string;
  riesgoLaboral: number; // ARL % (default 1.10%)
}

export interface CostoLaboralOutput {
  salarioBase: number;
  afpPatronal: number; // 7.10%
  sfsPatronal: number; // 7.09%
  arl: number; // e.g. 1.10%
  provisionVacaciones: number; // ~4.61% o 8.33%
  provisionRegalia: number; // 8.33% (~1/12)
  provisionCesantia: number; // ~5.4% de reserva
  totalCostoEmpresarial: number;
  porcentajeAdicional: number;
}

// Comparador de Empleo
export interface EmpleoComparacionInput {
  empleoA: {
    nombre: string;
    salarioBruto: string;
    seguroComplementario: string;
    bonoAnual: string;
    otrosBeneficios: string;
    distanciaKm: string;
  };
  empleoB: {
    nombre: string;
    salarioBruto: string;
    seguroComplementario: string;
    bonoAnual: string;
    otrosBeneficios: string;
    distanciaKm: string;
  };
}

// Generador de Cartas
export type TipoCarta = 'renuncia' | 'despido' | 'aumento' | 'contrato_indefinido' | 'contrato_definido';

export interface CartaInput {
  nombreTrabajador: string;
  cedulaTrabajador: string;
  nombreEmpresa: string;
  rncEmpresa?: string;
  puestoTrabajo: string;
  fechaEfectiva: string;
  salarioPactado?: string;
  justificacionAumento?: string;
}

// Blog SEO
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'salarios' | 'prestaciones' | 'afp' | 'sfs' | 'isr' | 'vacaciones' | 'regalia' | 'bonificacion' | 'empleo' | 'rrhh' | 'finanzas';
  date: string;
  readingTime: string;
  content: string;
  faq: { q: string; a: string; }[];
  summaryTable: { label: string; value: string; }[];
}

// FAQ General
export interface FAQItem {
  q: string;
  a: string;
  category: string;
}
