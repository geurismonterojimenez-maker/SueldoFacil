import { SearchItem, BlogPost, FAQItem, SEOConfig } from "./types";
import { LEGAL_CONFIG } from "./data/legalConfig";

export const MINIMUM_WAGE_CATEGORIES = [
  { id: 'grande', label: 'Empresas Grandes (>150 empleados / RD$ 150M+ ventas)', wage: LEGAL_CONFIG.salarioMinimoTSS },
  { id: 'mediana', label: 'Empresas Medianas (51-150 empleados / RD$ 150M ventas)', wage: 22138 },
  { id: 'pequena', label: 'Empresas Pequeñas (11-50 empleados / RD$ 50M ventas)', wage: 14835 },
  { id: 'micro', label: 'Microempresas (<10 empleados / RD$ 8M ventas)', wage: 13685 },
  { id: 'zona_franca', label: 'Zonas Francas (Sectores Especializados)', wage: 16700 },
  { id: 'domesticos', label: 'Trabajadores Domésticos', wage: 10000 },
  { id: 'seguridad_privada', label: 'Vigilantes de Seguridad Privada', wage: 19837 },
];

export const RETENCIONES_CONFIG = {
  afp: {
    empleado: LEGAL_CONFIG.tss.afp.empleado,
    empleador: LEGAL_CONFIG.tss.afp.empleador,
    topeSueldosMinimos: LEGAL_CONFIG.tss.afp.topeSalariosMinimos
  },
  sfs: {
    empleado: LEGAL_CONFIG.tss.sfs.empleado,
    empleador: LEGAL_CONFIG.tss.sfs.empleador,
    topeSueldosMinimos: LEGAL_CONFIG.tss.sfs.topeSalariosMinimos
  },
  arl: {
    empleadorRate: LEGAL_CONFIG.tss.arl.empleador,
    topeSueldosMinimos: LEGAL_CONFIG.tss.arl.topeSalariosMinimos
  }
};

// ISR 2026 Escalas Mensuales de la DGII
export const ISR_ESCALAS = LEGAL_CONFIG.dgii.tramosISR.map(t => ({
  limiteInferior: t.limiteInferior,
  limiteSuperior: t.limiteSuperior,
  tasa: t.tasa,
  montoFijo: t.montoFijo
}));

export const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'calc-prestaciones',
    title: 'Calculadora de Prestaciones Laborales',
    description: 'Calcula tu liquidación completa: cesantía, preaviso, vacaciones y regalía pascual en segundos.',
    category: 'calculadora',
    targetTab: 'prestaciones'
  },
  {
    id: 'calc-salario',
    title: 'Calculadora de Salario Neto',
    description: 'Calcula tus deducciones de AFP, SFS e ISR a partir de tu salario bruto ordinal.',
    category: 'calculadora',
    targetTab: 'salario'
  },
  {
    id: 'calc-isr',
    title: 'Calculadora de Impuesto Sobre la Renta (ISR) - DGII',
    description: 'Descubre cuánto te retiene la DGII mensualmente según tu escala salarial.',
    category: 'calculadora',
    targetTab: 'isr'
  },
  {
    id: 'calc-afp-sfs',
    title: 'Calculadora de AFP y SFS (Seguridad Social)',
    description: 'Calcula el descuento de la Tesorería de Seguridad Social (TSS) para el empleado y el costo del empleador.',
    category: 'calculadora',
    targetTab: 'afp_sfs'
  },
  {
    id: 'calc-costos',
    title: 'Calculadora de Costo Laboral (Empleadores)',
    description: 'Averigua el costo real total de contratar a un colaborador en República Dominicana (Seguridad Social + provisiones).',
    category: 'calculadora',
    targetTab: 'costos'
  },
  {
    id: 'calc-horas',
    title: 'Calculadora de Horas Extras y Nocturnidad',
    description: 'Calcula las horas adicionales (diurnas, nocturnas y días feriados) con recargos del 35%, 50% y 100%.',
    category: 'calculadora',
    targetTab: 'horas_extras'
  },
  {
    id: 'calc-comparador',
    title: 'Comparador de Ofertas de Trabajo',
    description: 'Determina qué oferta laboral te beneficia más comparando salarios netos, bonos y otros incentivos.',
    category: 'calculadora',
    targetTab: 'comparador'
  },
  {
    id: 'cartas-contratos',
    title: 'Generador de Cartas Laborales y Contratos',
    description: 'Genera de forma instantánea cartas de renuncia, despido, contratos indefinidos y solicitudes de aumento.',
    category: 'calculadora',
    targetTab: 'cartas_contratos'
  },
  {
    id: 'ai-asistente',
    title: 'Asistente IA de Legislación Laboral Dominicana',
    description: 'Consulta con inteligencia artificial especializada en el Código de Trabajo Dominicano (Ley 16-92).',
    category: 'calculadora',
    targetTab: 'ai_assistant'
  },
  {
    id: 'salarios-profesiones',
    title: 'Centro de Salarios de República Dominicana',
    description: 'Consulta los salarios promedios locales por profesión e investiga tendencias por provincia en tiempo real.',
    category: 'calculadora',
    targetTab: 'salarios_profesiones'
  },
  {
    id: 'calculadora-aumento',
    title: 'Calculadora de Aumento Salarial de Ley',
    description: 'Calcula tu incremento de sueldo neto tras recibir un aumento de salario de nómina ordinario.',
    category: 'calculadora',
    targetTab: 'calculadora_aumento'
  },
  {
    id: 'mi-diciembre',
    title: 'Calculadora Sueldo #13 (Doble Sueldo Pascual y Regalía)',
    description: 'Estima tus ingresos líquidos acumulados de fin de año con las exenciones de la Regalía de Navidad (Art. 219 al 222).',
    category: 'calculadora',
    targetTab: 'mi_diciembre'
  },
  {
    id: 'biblioteca-laboral',
    title: 'Biblioteca Laboral y Código de Trabajo Dominicana',
    description: 'Analiza conceptos de derechos del Código laboral (Ley 16-92), explicaciones, multas y ejemplos prácticos.',
    category: 'articulo',
    targetTab: 'biblioteca_laboral'
  },
  {
    id: 'analizador-recibos',
    title: 'Auditor de Volantes de Pago y Deducciones de Nómina',
    description: 'Verifica si tu empleador descuenta correctamente AFP, SFS e ISR en tus recibos de pago mensuales.',
    category: 'calculadora',
    targetTab: 'analizador_recibos'
  },
  {
    id: 'plan-ahorro',
    title: 'Plan de Ahorro y Metas de Inversión RD',
    description: 'Calcula cuánto necesitas ahorrar mensual o quincenalmente para metas financieras, con ajuste por inflación y consejos con IA.',
    category: 'calculadora',
    targetTab: 'plan_ahorro'
  },
  {
    id: 'presupuesto-anual',
    title: 'Presupuesto Anual y Proyección de Finanzas RD',
    description: 'Gestiona ingresos y gastos fijos y variables bajo la regla de presupuesto 50/30/20 y calcula tu salud financiera.',
    category: 'calculadora',
    targetTab: 'presupuesto_anual'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'prestaciones',
    q: '¿Qué es el preaviso y cuándo aplica en República Dominicana?',
    a: 'El preaviso es el plazo que la ley obliga a las partes a notificar antes de rescindir un contrato de trabajo indefinido. Si el patrono despide al trabajador sin darle preaviso, debe pagárselo en dinero en la liquidación.'
  },
  {
    category: 'prestaciones',
    q: '¿Cómo se calcula el salario diario promedio para prestaciones?',
    a: 'Para los trabajadores cobrados mensualmente, se divide el salario ordinario mensual de los últimos 12 meses entre 23.83. Esto es conocido como el salario diario promedio por el Ministerio de Trabajo dominicano.'
  },
  {
    category: 'regalia',
    q: '¿Cuándo debe pagarse el Sueldo 13 o Regalía Pascual?',
    a: 'Según el Artículo 220 del Código de Trabajo, la regalía pascual debe pagarse a más tardar el 20 de diciembre. Es exenta de impuesto sobre la renta (ISR) y de aportes a la Seguridad Social (AFP/SFS).'
  },
  {
    category: 'seguridad_social',
    q: '¿Cuál es el tope de salario cotizable para el descuento de AFP y SFS?',
    a: 'La TSS establece un límite para los aportes. El tope para la SFS (Seguro Familiar de Salud) es de 10 salarios mínimos nacionales cotizables y el de la AFP (Fondo de Pensiones) es de 20 salarios mínimos.'
  }
];

export const SEO_TAB_CONFIGS: Record<string, SEOConfig> = {
  home: {
    title: "SueldoFacil - Calculadora Laboral de República Dominicana",
    description: "La plataforma número 1 para calcular salarios netos, prestaciones, ISR (DGII), AFP, SFS y consultar legislación con inteligencia artificial.",
    ogTitle: "SueldoFacil.com | Calculadoras Laborales y Financieras Dominicanas",
    ogDescription: "Ahorra tiempo y evita errores calculando tu liquidación, retenciones impositivas y nómina en pocos clics de manera gratuita.",
    canonical: "https://sueldofacil.com/"
  },
  prestaciones: {
    title: "Calculadora de Prestaciones Laborales República Dominicana",
    description: "Calcula tu liquidación completa paso a paso: preaviso, cesantía, regalía y vacaciones acumuladas bajo el Código de Trabajo dominicano.",
    ogTitle: "Liquidación y Prestaciones Laborales RD - SueldoFacil",
    ogDescription: "Simulador exacto de los derechos laborales conforme a la Ley 16-92 del Ministerio de Trabajo.",
    canonical: "https://sueldofacil.com/prestaciones/"
  },
  salario: {
    title: "Calculadora de Salario Neto RD - Sueldo Neto y Retenciones de Nómina",
    description: "Ingresa tu salario bruto mensual y conoce el desglose real restando AFP, Seguro Familiar de Salud (SFS) e Impuesto Sobre la Renta (ISR).",
    ogTitle: "Cálculo de Sueldo Neto Dominicana - SueldoFacil",
    ogDescription: "Calculadora limpia y exacta con las tasas actualizadas de Seguridad Social y DGII.",
    canonical: "https://sueldofacil.com/salario/"
  },
  nominas: {
    title: "Calculadora de Nómina Colectiva RD - Registro y Deducciones TSS",
    description: "Administra y simula deducciones de nóminas de varios empleados de manera unificada bajo el Código Tributario dominicano.",
    ogTitle: "Cálculos de Nóminas Colectivas en República Dominicana",
    ogDescription: "Registra empleados, calcula retenciones AFP / SFS e ISR Patronal de forma unificada.",
    canonical: "https://sueldofacil.com/nominas/"
  },
  costos: {
    title: "Calculadora de Costo Laboral de Empleados - SueldoFacil",
    description: "Calcula el costo total real de contratación en República Dominicana, incluyendo aportes TSS patronales (7.10% AFP, 7.09% SFS, ARL) y provisiones de ley.",
    ogTitle: "Costo Empresa por Colaborador RD - SueldoFacil",
    ogDescription: "Herramienta avanzada para emprendedores y departamentos de Recursos Humanos para presupuestar nóminas de forma exacta.",
    canonical: "https://sueldofacil.com/costos/"
  },
  horas_extras: {
    title: "Calculadora de Horas Extras y Recargos de Nocturnidad RD",
    description: "Monitorea y calcula con exactitud las horas de trabajo adicionales diurnas, nocturnas y días feriados con recargo del 35%, 50% y 100%.",
    ogTitle: "Recargo por Horas Extras y Nocturnas en RD",
    ogDescription: "Cálculo preciso del recargo por horas extraordinarias conforme con el Código del Trabajo Dominicano.",
    canonical: "https://sueldofacil.com/horas-extras/"
  },
  comparador: {
    title: "Comparador de Ofertas Laborales y Beneficios en RD",
    description: "Compara de forma interactiva dos ofertas de empleo descontando impuestos nacionales de ley e integrando beneficios anuales.",
    ogTitle: "Simulador Comparador de Trabajos y Beneficios en RD",
    ogDescription: "Toma decisiones inteligentes comparando el valor neto real de compensación laboral.",
    canonical: "https://sueldofacil.com/comparador/"
  },
  cartas_contratos: {
    title: "Generador de Cartas Laborales y Contratos Legales de RD",
    description: "Genera al instante contratos fijos, cartas de renuncia con preaviso, cartas de despido y reclamos de aumento listos para imprimir.",
    ogTitle: "Formatos de Cartas y Contratos de Trabajo RD",
    ogDescription: "Formularios interactivos prediseñados bajo estándares judiciales y laborales dominicanos.",
    canonical: "https://sueldofacil.com/documentos/"
  },
  ai_assistant: {
    title: "Asistente de Inteligencia Artificial para Ley de Trabajo Dominicana",
    description: "Asistente virtual conversacional experto en el Código de Trabajo del país y normativas de la TSS para evacuar consultas impositivas.",
    ogTitle: "Consultas Legales Laborales con Inteligencia Artificial RD",
    ogDescription: "Resuelve dudas específicas de cesantías, vacaciones y licencias legales guiado por IA.",
    canonical: "https://sueldofacil.com/asistente-ia/"
  },
  blog: {
    title: "Guías, Tutoriales y Consejos Laborales de República Dominicana",
    description: "Infórmate de forma amigable sobre el impuesto de las bonificaciones, doble sueldo, despidos intempestivos y reglamentos TSS de vigencia activa.",
    ogTitle: "Blog Informativo de Derechos Laborales Dominicana - SueldoFacil",
    ogDescription: "Consejos prácticos para trabajadores y patronos Dominicanos.",
    canonical: "https://sueldofacil.com/blog/"
  },
  dashboard: {
    title: "Tu Historial y Panel de Gestión Laboral - SueldoFacil",
    description: "Historial de cálculos de prestaciones guardadas, simulador de aumentos anuales e indicadores clave del sector laboral dominicano.",
    ogTitle: "Panel del Usuario Dominicano - SueldoFacil",
    ogDescription: "Gestiona tu bitácora de cálculos financieros e investiga salarios mínimos actualizados por escala corporativa.",
    canonical: "https://sueldofacil.com/panel/"
  },
  salarios_profesiones: {
    title: "Guía de Salarios por Profesión en República Dominicana - SueldoFacil",
    description: "Consulta cuánto gana un programador, contador, médico o abogado en RD. Estadísticas salariales reales y tendencias por provincia de vigencia activa.",
    ogTitle: "Salarios por Profesión en República Dominicana",
    ogDescription: "Guía interactiva de compensación salarial media por sector, cargo e histórico.",
    canonical: "https://sueldofacil.com/salarios-profesion/"
  },
  calculadora_aumento: {
    title: "Calculadora de Aumento Salarial República Dominicana - SueldoFacil",
    description: "Calcula en cuánto incrementa tu salario neto real tras un aumento de sueldo bruto. Desglose inmediato con impuestos (SFS, AFP, ISR).",
    ogTitle: "Simulador de Aumento de Sueldo RD - SueldoFacil",
    ogDescription: "Calcula el retorno líquido exacto de tu aumento deduciendo retenciones.",
    canonical: "https://sueldofacil.com/calcular-aumento/"
  },
  mi_diciembre: {
    title: "Calculadora Sueldo #13 - Doble Sueldo y Bonificación RD",
    description: "Estima tus ingresos integrales de fin de año en República Dominicana: segunda quincena, regalía pascual exenta de impuestos y bonificación.",
    ogTitle: "Calculadora Sueldo #13 - Doble Sueldo y Regalias",
    ogDescription: "Audita tus ingresos de fin de año exentos de AFP e ISR.",
    canonical: "https://sueldofacil.com/mi-diciembre/"
  },
  biblioteca_laboral: {
    title: "Biblioteca de Legislación de Trabajo Dominicana - SueldoFacil",
    description: "Estudia las regulaciones del Código de Trabajo dominicano de manera simple. Guías sobre cesantía, preaviso, horas extras y vacaciones oficiales.",
    ogTitle: "Biblioteca de Leyes Laborales de República Dominicana",
    ogDescription: "Consultas simplificadas para trabajadores dominicanos del Código de Trabajo.",
    canonical: "https://sueldofacil.com/biblioteca/"
  },
  analizador_recibos: {
    title: "Auditor de Recibos de Nómina Dominicana - SueldoFacil",
    description: "Audita tus volantes de pago mensuales de forma digital. Descubre discrepancias en los descuentos de la TSS (AFP, SFS) o retenciones de ISR de la DGII.",
    ogTitle: "Auditor de Volantes de Pago RD - SueldoFacil",
    ogDescription: "Detecta rápidamente retenciones ilegales o excesivas en tu sueldo.",
    canonical: "https://sueldofacil.com/analizar-recibos/"
  },
  plan_ahorro: {
    title: "Plan de Ahorro RD | Sueldo Fácil",
    description: "Calcula tu plan de ahorro y organiza tu presupuesto anual con herramientas gratuitas para República Dominicana.",
    ogTitle: "Plan de Ahorro RD | Sueldo Fácil",
    ogDescription: "Calcula tu plan de ahorro y organiza tu presupuesto anual de forma gratuita para República Dominicana.",
    canonical: "https://sueldofacil.com/plan-ahorro/"
  },
  presupuesto_anual: {
    title: "Presupuesto Anual RD | Sueldo Fácil",
    description: "Calcula tu plan de ahorro y organiza tu presupuesto anual con herramientas gratuitas para República Dominicana.",
    ogTitle: "Presupuesto Anual RD | Sueldo Fácil",
    ogDescription: "Calcula tu plan de ahorro y organiza tu presupuesto anual de forma gratuita para República Dominicana.",
    canonical: "https://sueldofacil.com/presupuesto-anual/"
  },
  editorial: {
    title: "Política Editorial y Transparencia | Sueldo Fácil",
    description: "Nuestra política editorial: pautas, metodologías y criterios de investigación para garantizar la exactitud de nuestras calculadoras laborales en RD.",
    ogTitle: "Política Editorial | Sueldo Fácil",
    ogDescription: "Conozca cómo revisamos, verificamos y actualizamos nuestras herramientas de cálculo laboral en RD.",
    canonical: "https://sueldofacil.com/politica-editorial/"
  },
  sobre_nosotros: {
    title: "Sobre Nosotros y Nuestro Equipo | Sueldo Fácil",
    description: "Conozca al equipo multidisciplinario detrás de Sueldo Fácil: economistas, programadores y expertos legales dedicados a democratizar el derecho laboral en RD.",
    ogTitle: "Sobre Nosotros | Sueldo Fácil",
    ogDescription: "Nuestra misión, visión y los profesionales que hacen posible Sueldo Fácil.",
    canonical: "https://sueldofacil.com/sobre-nosotros/"
  },
  contacto: {
    title: "Contacto e Información Institucional | Sueldo Fácil",
    description: "Póngase en contacto con el equipo editorial y de soporte de Sueldo Fácil. Formulario de contacto, correo institucional y horarios de servicio.",
    ogTitle: "Contacto | Sueldo Fácil",
    ogDescription: "Escríbanos o consulte nuestros horarios de atención institucional en República Dominicana.",
    canonical: "https://sueldofacil.com/contacto/"
  }
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'guia-definitiva-liquidacion-prestaciones-dominicana',
    title: 'Guía Definitiva sobre Prestaciones Laborales y Liquidación en República Dominicana',
    excerpt: '¿Te despidieron o deseas renunciar? Te enseñamos cómo se calculan el preaviso, la cesantía y otros derechos conforme a la Ley 16-92.',
    category: 'prestaciones',
    date: 'Junio 2026',
    readingTime: '5 min de lectura',
    content: `En la República Dominicana, la terminación de un contrato de trabajo por tiempo indefinido abre la puerta a las **prestaciones laborales** o la liquidación, dependiendo de la vía elegida para concluirlo (desahucio, dimisión o despido).

### 1. El Preaviso (Art. 76)
Es la notificación anticipada que realiza una parte a otra. Su omisión da derecho a una indemnización pecuniaria:
- De **3 a 6 meses** de trabajo: **7 días** de salario ordinario.
- De **6 meses a 1 año** de trabajo: **14 días** de salario ordinario.
- De **más de 1 año** de trabajo: **28 días** de salario ordinario.

### 2. La Cesantía (Art. 80)
La indemnización que el empleador debe pagar en caso de desahucio ejercido por él, o si el trabajador dimite justificadamente:
- Sucesión de **3 a 6 meses**: **6 días** de salario.
- Sucesión de **6 meses a 1 año**: **13 días** de salario.
- Sucesión de **1 a 5 años**: **21 días** de salario por cada año de servicio.
- Sucesión de **más de 5 años**: **23 días** de salario por cada año de servicio.

### Resumen del cálculo promedio diario
Para determinar las prestaciones, el Ministerio de Trabajo calcula el salario promedio diario dividiendo el salario base de cotización entre **23.83** para cobros mensuales.`,
    faq: [
      { q: '¿Qué es el salario diario promedio?', a: 'Es el salario mensual dividido entre 23.83 para determinar la cuota diaria del trabajador.' },
      { q: '¿Pago impuesto de ISR por mi liquidación?', a: 'No, las indemnizaciones por preaviso y cesantía están exentas de ISR y de SS.' }
    ],
    summaryTable: [
      { label: 'Sueldo diario promedio', value: 'Sueldo Bruto / 23.83' },
      { label: 'ISR s/ Cesantía', value: 'Exento' },
      { label: 'Plazo de pago legal', value: '10 días calendarios tras la salida' }
    ]
  },
  {
    slug: 'como-funciona-impuesto-sobre-la-renta-personas-fisicas-rd',
    title: 'Cómo calcula la DGII el Impuesto Sobre la Renta (ISR) para Empleados en RD',
    excerpt: 'Te explicamos los tramos salariales vigentes para 2026 y cómo la deducción de la AFP reduce tus obligaciones impositivas.',
    category: 'isr',
    date: 'Mayo 2026',
    readingTime: '4 min de lectura',
    content: `El **Impuesto Sobre la Renta (ISR)** es un impuesto que grava toda renta, ingreso, beneficio o utilidad de las personas físicas. En el régimen salarial dominicano, este impuesto se descuenta mensualmente a través de retenciones que realiza el empleador.

### Deducciones del Salario Antes de ISR
El impuesto no se calcula sobre el total bruto del salario. Primero se descuentan las contribuciones del empleado al sistema de seguridad social:
1. **AFP**: El 2.87% del salario cotizable.
2. **SFS**: El 3.04% del salario cotizable.

El monto restante es el **salario neto sujeto al ISR**.

### Los Tramos de ISR Mensuales Actualizados (2026)
- **Tramo I (Hasta RD$ 34,685.00)**: Exento (0% de impuesto).
- **Tramo II (RD$ 34,685.01 - RD$ 52,027.42)**: Retención del **15%** del excedente de RD$ 34,685.00.
- **Tramo III (RD$ 52,027.43 - RD$ 72,260.25)**: Retención fija de **RD$ 2,601.36** más el **20%** del excedente de RD$ 52,027.42.
- **Tramo IV (RD$ 72,260.26 en adelante)**: Retención fija de **RD$ 6,647.92** más el **25%** del excedente de RD$ 72,260.25.`,
    faq: [
      { q: '¿Es el salario bruto la base imponible?', a: 'No, primero se resta el 2.87% de AFP y el 3.04% de SFS.' },
      { q: '¿Se grava el doble sueldo con ISR?', a: 'No, la regalía pascual está legalmente exenta de toda deducción fiscal.' }
    ],
    summaryTable: [
      { label: 'Deducción AFP', value: '2.87% del Salario' },
      { label: 'Deducción SFS', value: '3.04% del Salario' },
      { label: 'Exención mínima mensual', value: 'RD$ 34,685.00' }
    ]
  }
];
