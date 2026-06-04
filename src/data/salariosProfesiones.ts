export interface ProfessionData {
  id: string;
  name: string;
  slug: string;
  promedio: number;
  minimo: number;
  maximo: number;
  anual: number;
  netoEstimado: number;
  afpEstimada: number;
  sfsEstimada: number;
  isrEstimado: number;
  comparacionNacional: string;
  comparacionProvincial: {
    provincia: string;
    desviacion: number;
  }[];
  tendencia: 'Alza' | 'Estable' | 'Baja';
  similarProfessions: string[];
  faq: { q: string; a: string; }[];
}

export interface ProvinciaData {
  id: string;
  nombre: string;
  promedioSalario: number;
  diferenciaNacional: number;
  costoVidaEstimado: number; // escala base Santo Domingo = 100
  poderAdquisitivoLetter: 'A' | 'B' | 'C' | 'D';
}

export const PROFESSIONS_DB: ProfessionData[] = [
  {
    id: 'programador',
    slug: 'programador-rd',
    name: 'Programador / Desarrollador de Software',
    promedio: 85000,
    minimo: 45000,
    maximo: 180000,
    anual: 1020000,
    netoEstimado: 74210,
    afpEstimada: 2439.5,
    sfsEstimada: 2584,
    isrEstimado: 5766.5,
    comparacionNacional: "Se encuentra un 125% por encima de la media de salarios básicos nacionales.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 12 },
      { provincia: "Santiago", desviacion: -5 },
      { provincia: "La Altagracia (Higüey)", desviacion: -15 }
    ],
    tendencia: 'Alza',
    similarProfessions: ['Administrador de Sistemas', 'Analista de Datos', 'Gerente de Proyectos de TI'],
    faq: [
      { q: "¿Cuánto gana un programador junior en República Dominicana?", a: "Un programador junior en RD suele devengar salarios que rondan entre RD$ 35,000 y RD$ 55,000 mensuales según la escala empresarial." },
      { q: "¿Qué deducciones tiene el sueldo de un desarrollador de software?", a: "Se le aplica el 2.87% de AFP, 3.04% de SFS y el tramo correspondiente del Impuesto Sobre la Renta (ISR) de la DGII si supera los RD$ 34,685." }
    ]
  },
  {
    id: 'contador',
    slug: 'contador-rd',
    name: 'Contador Público / Auxiliar Contable',
    promedio: 42000,
    minimo: 25000,
    maximo: 85000,
    anual: 504000,
    netoEstimado: 38435,
    afpEstimada: 1205.4,
    sfsEstimada: 1276.8,
    isrEstimado: 1082.8,
    comparacionNacional: "Se sitúa un 15% por encima del salario promedio general de oficina.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 7 },
      { provincia: "Santiago", desviacion: 2 },
      { provincia: "La Vega", desviacion: -8 }
    ],
    tendencia: 'Estable',
    similarProfessions: ['Auditor', 'Analista Financiero', 'Asistente de Cuentas por Cobrar'],
    faq: [
      { q: "¿Cuál es el salario de un contralor en RD?", a: "Los profesionales senior de contabilidad o contralores corporativos pueden alcanzar salarios superiores a los RD$ 120,000 con beneficios complementarios." },
      { q: "¿Es necesario estar colegiado por el ICPARD para ejercer?", a: "Para firmar estados financieros auditados oficiales sí es requisito tener exequátur e inscripción activa ante el Instituto de Contadores Públicos Autorizados." }
    ]
  },
  {
    id: 'ingeniero-civil',
    slug: 'ingeniero-civil-rd',
    name: 'Ingeniero Civil / Gerente de Obras',
    promedio: 65000,
    minimo: 35000,
    maximo: 135000,
    anual: 780000,
    netoEstimado: 56980,
    afpEstimada: 1865.5,
    sfsEstimada: 1976,
    isrEstimado: 4178.5,
    comparacionNacional: "Se encuentra un 75% por encima de la media de salarios básicos nacionales.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 10 },
      { provincia: "Santiago", desviacion: 8 },
      { provincia: "San Cristóbal", desviacion: -2 }
    ],
    tendencia: 'Alza',
    similarProfessions: ['Arquitecto', 'Supervisor de Campo', 'Planificador de Proyectos'],
    faq: [
      { q: "¿Gana más un ingeniero civil independiente o asalariado?", a: "Independientes tienen mayor techo si administran obras grandes (márgenes por cubicaciones), pero los asalariados tienen la ventaja de bonificaciones e indemnizaciones estables." },
      { q: "¿Cuánto se retiene de ISR a un salario de RD$ 65,000?", a: "Luego de restar SFS y AFP, la base neta imponible es sobre RD$ 61,158. Con la escala DGII, se descuentan RD$ 4,178.5 de ISR mensual en 2026." }
    ]
  },
  {
    id: 'medico',
    slug: 'medico-rd',
    name: 'Médico General / Especialista',
    promedio: 75000,
    minimo: 45000,
    maximo: 160000,
    anual: 900000,
    netoEstimado: 64995,
    afpEstimada: 2152.5,
    sfsEstimada: 2280,
    isrEstimado: 5572.5,
    comparacionNacional: "Se coloca en la franja del 20% de mayores remuneraciones nacionales.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 15 },
      { provincia: "Santiago", desviacion: 10 },
      { provincia: "La Vega", desviacion: 0 }
    ],
    tendencia: 'Estable',
    similarProfessions: ['Enfermera', 'Odontólogo', 'Director de Clínica'],
    faq: [
      { q: "¿Cuánto gana un especialista médico en el sector público?", a: "Los sueldos base de especialistas en el SNS (Servicio Nacional de Salud) rondan entre RD$ 70,000 y RD$ 95,000, sin acumular los incentivos de distancia, guardias y antigüedad." },
      { q: "¿El sueldo médico cotiza en la TSS?", a: "Sí, todos los directivos de salud y médicos bajo relación de dependencia pública o privada tributan y aportan AFP y SFS sobre su salario ordinario." }
    ]
  },
  {
    id: 'enfermera',
    slug: 'enfermera-rd',
    name: 'Enfermera Profesional / Licenciada',
    promedio: 33000,
    minimo: 22000,
    maximo: 50000,
    anual: 396000,
    netoEstimado: 31049,
    afpEstimada: 947.1,
    sfsEstimada: 1003.2,
    isrEstimado: 0,
    comparacionNacional: "Está cerca del promedio del salario básico para personal auxiliar del sector salud.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 5 },
      { provincia: "Santiago", desviacion: 0 },
      { provincia: "San Francisco de Macorís", desviacion: -5 }
    ],
    tendencia: 'Estable',
    similarProfessions: ['Médico', 'Radiólogo', 'Asistente de Laboratorio'],
    faq: [
      { q: "¿Cuánto gana una auxiliar de enfermería en RD?", a: "Las auxiliares de enfermería reciben salarios promedio de entre RD$ 18,000 y RD$ 26,000 mensuales." },
      { q: "¿Aplica exención de ISR para sueldos de RD$ 33,000?", a: "Sí, al estar debajo de la exención de la DGII (RD$ 34,685), las enfermeras con sueldo unitario de RD$ 33,000 no descuentan ISR." }
    ]
  },
  {
    id: 'cajero',
    slug: 'cajero-rd',
    name: 'Cajero / Asistente de Caja Comercial',
    promedio: 22000,
    minimo: 16700,
    maximo: 32000,
    anual: 264000,
    netoEstimado: 20699,
    afpEstimada: 631.4,
    sfsEstimada: 668.8,
    isrEstimado: 0,
    comparacionNacional: "Se alinea al salario mínimo corporativo de escala mediana a grande.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 4 },
      { provincia: "Santiago", desviacion: 1 },
      { provincia: "Puerto Plata", desviacion: -3 }
    ],
    tendencia: 'Estable',
    similarProfessions: ['Vendedor', 'Auxiliar de Oficinas', 'Servicio al Cliente'],
    faq: [
      { q: "¿Cuánto se le descuenta de seguro de salud a un cajero?", a: "SFS representa el 3.04% mensual. Por un sueldo de RD$ 22,000, les retienen RD$ 668.8." },
      { q: "¿Se paga incentivos por manejo de efectivo o faltantes?", a: "Muchos bancos y grandes supermercados otorgan bonos de caja (riesgo de cuadre) adicionales exentos del impuesto ordinal." }
    ]
  },
  {
    id: 'vendedor',
    slug: 'vendedor-rd',
    name: 'Ejecutivo de Ventas / Promotor comercial',
    promedio: 30000,
    minimo: 18000,
    maximo: 95000,
    anual: 360000,
    netoEstimado: 28227,
    afpEstimada: 861,
    sfsEstimada: 912,
    isrEstimado: 0,
    comparacionNacional: "Sueldos base comunes, frecuentemente incrementados vía comisiones exentas o variables.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 7 },
      { provincia: "Santiago", desviacion: 4 },
      { provincia: "La Romana", desviacion: -5 }
    ],
    tendencia: 'Alza',
    similarProfessions: ['Cajero', 'Especialista en Mercadeo', 'Servicio al Cliente'],
    faq: [
      { q: "¿Cómo cotizan las comisiones por ventas en la TSS?", a: "Según el reglamento TSS, las comisiones ordinarias forman parte del salario cotizable y aplican retención de AFP/SFS." },
      { q: "¿Tienen derecho a salario extra navideño por comisiones?", a: "Sí, el Sueldo 13 o regalía se computa sumando todo lo devengado en el año, incluyendo el sueldo básico y las comisiones, dividido entre 12." }
    ]
  },
  {
    id: 'abogado',
    slug: 'abogado-rd',
    name: 'Abogado / Consultor Legal corporativo',
    promedio: 58000,
    minimo: 30000,
    maximo: 130000,
    anual: 696000,
    netoEstimado: 51229,
    afpEstimada: 1664.6,
    sfsEstimada: 1763.2,
    isrEstimado: 3343.2,
    comparacionNacional: "Se sitúa un 50% arriba del promedio general nacional.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 12 },
      { provincia: "Santiago", desviacion: 5 },
      { provincia: "La Altagracia (Higüey)", desviacion: -4 }
    ],
    tendencia: 'Estable',
    similarProfessions: ['Asesor Tributario', 'Gestor de Contratos', 'Auxiliar Judicial'],
    faq: [
      { q: "¿Cuánto cobra un abogado de iguala mensual en RD?", a: "Las igualas para pequeñas empresas suelen estar entre RD$ 15,000 y RD$ 40,000 mensuales según la carga de gestiones notariales y societarias ordinarias." },
      { q: "¿Aplica cobros de ISR si trabaja de manera independiente?", a: "Sí, bajo la modalidad independiente se debe facturar con retención de ITBIS (18%) e ISR (10% servicios profesionales) según los formularios DGII." }
    ]
  },
  {
    id: 'arquitecto',
    slug: 'arquitecto-rd',
    name: 'Arquitecto Diseñador / Dibujante CAD',
    promedio: 55000,
    minimo: 28000,
    maximo: 110000,
    anual: 660000,
    netoEstimado: 48805,
    afpEstimada: 1578.5,
    sfsEstimada: 1672,
    isrEstimado: 2944.5,
    comparacionNacional: "Un 45% superior a la base impositiva media corporativa.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 15 },
      { provincia: "Santiago", desviacion: 5 },
      { provincia: "Higüey (Bávaro)", desviacion: 10 }
    ],
    tendencia: 'Alza',
    similarProfessions: ['Ingeniero Civil', 'Diseñador de Interiores', 'Inspector de Obras'],
    faq: [
      { q: "¿Cuál es el precio promedio de un plano en República Dominicana?", a: "Los arquitectos de RD cobran comisiones según el costo estimado de la construcción (entre un 3.5% y un 6.5% de la obra total)." },
      { q: "¿Los arquitectos deducen Seguridad Social?", a: "Sí, todos los arquitectos que trabajan en nómina regular para constructoras o firmas inmobiliarias tienen sus deducciones regulares." }
    ]
  },
  {
    id: 'chofer',
    slug: 'chofer-rd',
    name: 'Chofer Organizacional / Conductor de Distribución',
    promedio: 24050,
    minimo: 18000,
    maximo: 35000,
    anual: 288600,
    netoEstimado: 22628,
    afpEstimada: 690.2,
    sfsEstimada: 731.1,
    isrEstimado: 0,
    comparacionNacional: "Se asocia al nivel salarial de las micro y pequeñas empresas del transporte.",
    comparacionProvincial: [
      { provincia: "Santo Domingo", desviacion: 3 },
      { provincia: "Santiago", desviacion: 1 },
      { provincia: "La Vega", desviacion: -2 }
    ],
    tendencia: 'Estable',
    similarProfessions: ['Mensajero', 'Auxiliar de Almacén', 'Operador de Montacargas'],
    faq: [
      { q: "¿Estructura el patrono gastos específicos de dieta y viáticos?", a: "Sí, comúnmente la dieta por transporte de mercancías interprovincial se entrega como reembolso o viático, exento de retenciones impositivas TSS." },
      { q: "¿Cuánto es la regalía pascual de un chofer?", a: "Equivale a la duodécima parte (1/12) del salario ordinario ganado durante el año civil." }
    ]
  }
];

export const PROVINCIAS_DB: ProvinciaData[] = [
  { id: 'santo-domingo', nombre: 'Santo Domingo & Distrito Nacional', promedioSalario: 48500, diferenciaNacional: 12.8, costoVidaEstimado: 100, poderAdquisitivoLetter: 'A' },
  { id: 'santiago', nombre: 'Santiago', promedioSalario: 42000, diferenciaNacional: -2.3, costoVidaEstimado: 85, poderAdquisitivoLetter: 'B' },
  { id: 'la-vega', nombre: 'La Vega', promedioSalario: 31500, diferenciaNacional: -26.7, costoVidaEstimado: 72, poderAdquisitivoLetter: 'C' },
  { id: 'san-cristobal', nombre: 'San Cristóbal', promedioSalario: 34000, diferenciaNacional: -20.9, costoVidaEstimado: 75, poderAdquisitivoLetter: 'C' },
  { id: 'puerto-plata', nombre: 'Puerto Plata', promedioSalario: 35500, diferenciaNacional: -17.4, costoVidaEstimado: 80, poderAdquisitivoLetter: 'B' },
  { id: 'sfm', nombre: 'San Francisco de Macorís', promedioSalario: 31000, diferenciaNacional: -27.9, costoVidaEstimado: 70, poderAdquisitivoLetter: 'C' },
  { id: 'la-romana', nombre: 'La Romana', promedioSalario: 38000, diferenciaNacional: -11.6, costoVidaEstimado: 83, poderAdquisitivoLetter: 'C' },
  { id: 'higuey', nombre: 'Higüey / Punta Cana', promedioSalario: 43500, diferenciaNacional: 1.1, costoVidaEstimado: 95, poderAdquisitivoLetter: 'B' }
];
