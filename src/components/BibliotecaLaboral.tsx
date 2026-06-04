import React, { useState } from 'react';
import { BookOpen, Search, Scale, HelpCircle, ArrowRight, ShieldCheck, ChevronDown, Award, Briefcase, Calendar, GraduationCap } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

interface Props {
  onNavigateTab: (tabName: string) => void;
}

const TEMATICAS_LIB = [
  {
    id: 'prestaciones',
    titulo: 'Prestaciones Laborales & Cesantía (Art. 76 al 86)',
    categoria: 'Terminación Laboral',
    badge: 'Artículos Clave',
    resumen: 'Guía detallada sobre preaviso, auxilio de cesantía, desahucios correspondientes por el empleador o despido justificado bajo el Código dominicano.',
    explicacion: 'Las prestaciones laborales son compensaciones económicas que recibe un trabajador al terminar su contrato. El preaviso otorga días hábiles o compensación metálica para buscar empleo, mientras el auxilio de cesantía es una indemnización progresiva por el tiempo de servicio prestado.',
    ejemplo: 'Un empleado con 2 años de antigüedad desahuciado por su jefe tiene derecho a 28 días de preaviso pagado y 42 días de cesantía, además de la proporción de doble sueldo y vacaciones.',
    enlaceCal: 'prestaciones',
    txtCal: 'Calcular Prestaciones de Cesantía'
  },
  {
    id: 'vacaciones',
    titulo: 'Regulación de Vacaciones (Art. 177 al 191)',
    categoria: 'Derechos Ordinarios',
    badge: 'Obligatorio',
    resumen: 'Escala de días de vacaciones remuneradas anuales de acuerdo a la antigüedad del trabajador y su forma de cálculo.',
    explicacion: 'Todo empleador debe conceder vacaciones de forma obligatoria cada año cumplido. La legislatura dominicana define: de 1 a 5 años de antigüedad corresponden 14 días laborables pagados; y para más de 5 años, aumentan a 18 días laborables.',
    ejemplo: 'Iniciaste en agosto del 2021. Al cumplir 5 años laborando de manera continua, tu empleador debe pagarte y otorgarte de forma íntegra 18 días laborables libres con remuneración completa.',
    enlaceCal: 'vacaciones',
    txtCal: 'Simular Días de Vacaciones'
  },
  {
    id: 'bonificaciones',
    titulo: 'Bono de Participación en Utilidades (Art. 223 al 226)',
    categoria: 'Sueldos y Retribuciones',
    badge: 'Art. 223',
    resumen: 'Análisis del 10% de las utilidades netas que las corporaciones comerciales deben repartir anualmente entre todos sus asalariados.',
    explicacion: 'Es obligatoria la participación de los trabajadores en las utilidades de la empresa. El empleador está obligado a pagar: el equivalente a 45 días de sueldo ordinario para antigüedad menor de 3 años, y el equivalente a 60 días si el trabajador acumula más de 3 años de servicio.',
    ejemplo: 'Si la empresa reporta utilidades anuales y tienes 4 años de servicio continuo, te corresponde de forma íntegra la liquidación de 60 días de tu salario bruto ordinario mensual en el primer trimestre.',
    enlaceCal: 'bonificaciones',
    txtCal: 'Calcular Bonificación Anual'
  },
  {
    id: 'regalia',
    titulo: 'Regalía Pascual / Doble Sueldo (Art. 219 al 222)',
    categoria: 'Sueldos y Retribuciones',
    badge: 'Exento del ISR',
    isRegalia: true,
    resumen: 'El Salario 13 extraordinario navideño. Cálculo proporcional y su naturaleza legal inembargable y exenta de seguridad social.',
    explicacion: 'El empleador está obligado a pagar el salario de Navidad, a más tardar el 20 de diciembre. Se calcula dividiendo el total sumado de salarios brutos ordinarios devengados en el año natural entre doce.',
    ejemplo: 'Si ingresaste en abril ganando RD$ 30,000 mensuales y laboraste 9 meses del año, tu sueldo de Navidad "Regalía Pascual" acumulado es de RD$ 22,500 (RD$ 30,000 * 9 meses / 12).',
    enlaceCal: 'diciembre',
    txtCal: 'Simular Sueldo #13 Completo'
  },
  {
    id: 'jornadas',
    titulo: 'Horas Extras y Jornadas (Art. 147 al 162)',
    categoria: 'Condiciones de Trabajo',
    badge: 'Jornadas de Ley',
    resumen: 'Límites de jornada de 44 horas semanales, recargo del 35% para horas extraordinarias ordinarias y 100% para nocturnas o días de descanso.',
    explicacion: 'La jornada ordinaria no puede exceder las 8 horas diarias ni las 44 horas semanales. Las horas que excedan este límite se pagan con un 35% de recargo; las horas laboradas en días festivos o descanso semanal se retribuyen con un 100% adicional (doble salario).',
    ejemplo: 'Tu salario promedio por hora regular es de RD$ 200. Si realizas 3 horas extras de lunes a viernes, cada una de esas horas extraordinarias te será saldada a RD$ 270.',
    enlaceCal: 'horas_extras',
    txtCal: 'Calcular Horas Extras Recargadas'
  }
];

export default function BibliotecaLaboral({ onNavigateTab }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeExpandedId, setActiveExpandedId] = useState<string | null>('prestaciones');

  const filteredTopics = TEMATICAS_LIB.filter(topic => 
    topic.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.resumen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-xs font-semibold">
      
      {/* SEARCH BANNER HERO */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-sm border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-blue-500/30">
            <GraduationCap className="w-3.5 h-3.5" /> Artículos Jurídicos Homologados para Consultas en Línea
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Biblioteca de Legislación Laboral</h1>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Consulte interpretaciones simplificadas, fórmulas directas y ejemplos del Código de Trabajo de la República Dominicana avalada por expertos en derecho laboral criollo.
          </p>

          {/* SEARCH BAR CONTAINER */}
          <div className="relative max-w-md pt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 focus:bg-slate-900 rounded-xl py-2 md:py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-100 placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              placeholder="Buscar artículo, prestación, regalía, horas..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ARTICLES ACCORDION COLUMN */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="divide-y divide-slate-100 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            {filteredTopics.map(topic => {
              const isExpanded = activeExpandedId === topic.id;
              return (
                <div key={topic.id} className="transition-all">
                  
                  {/* TRIGGER HEADER */}
                  <button
                    onClick={() => setActiveExpandedId(isExpanded ? null : topic.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                          {topic.categoria}
                        </span>
                        <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                          {topic.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                        {topic.titulo}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 max-w-xl">
                        {topic.resumen}
                      </p>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  {/* CHUNKS DETAILS */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Explicación Doctrinal de Ley:</span>
                        <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                          {topic.explicacion}
                        </p>
                      </div>

                      <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-1">
                        <span className="text-[9px] text-blue-600 uppercase font-bold tracking-widest block">Ejemplo Práctico de Mercado:</span>
                        <p className="text-xs text-slate-750 font-semibold leading-relaxed">
                          {topic.ejemplo}
                        </p>
                      </div>

                      {/* FAST LAUNCH TO INTEGRATIVE CALCULATOR */}
                      <div className="pt-2 flex justify-between items-center bg-blue-50/40 p-3.5 border border-blue-100/40 rounded-xl">
                        <div className="space-y-0.5 max-w-[70%]">
                          <span className="font-bold text-blue-900 block leading-snug">¿Quieres realizar la simulación en tiempo real?</span>
                          <span className="text-[10px] text-slate-450 block font-semibold leading-snug">Usa los mismos coeficientes del Código para estimar tus montos líquidos.</span>
                        </div>
                        <button
                          onClick={() => {
                            const target = topic.enlaceCal;
                            const resolved = target === 'vacaciones' 
                              ? 'prestaciones' 
                              : (target === 'bonificaciones' || target === 'diciembre') 
                                ? 'mi_diciembre' 
                                : target;
                            onNavigateTab(resolved);
                          }}
                          className="font-extrabold text-[10px] bg-blue-600 hover:bg-blue-750 text-white py-2 px-3.5 rounded-lg flex items-center gap-1 hover:gap-1.5 transition-all select-none cursor-pointer"
                        >
                          {topic.txtCal} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

            {filteredTopics.length === 0 && (
              <p className="text-center text-slate-400 font-medium py-10">No se encontraron temáticas para su búsqueda. Pruebe palabras genéricas como "prestaciones" o "regalía".</p>
            )}
          </div>

        </div>

        {/* RELATED COMPLIANCE INFO COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QUICK LEGAL COMPLIANCE BOX */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3.5">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Cumplimiento Tributario Asalariados</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Exclusión General de TSS</span>
                  <p className="text-[11px] text-slate-500 leading-snug">La Regalía Pascual y los montos liquidados por desahucio están 100% libres de deducciones de pensión (AFP) y ARS (SFS).</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Seguridad Social Ley 87-01</span>
                  <p className="text-[11px] text-slate-500 leading-snug">Deducción obligatoria ordinaria: 2.87% AFP para vejez, y 3.04% SFS para cobertura del seguro familiar de salud (ars).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-500/10 p-5 rounded-2xl space-y-3.5">
            <p className="text-xs font-bold text-blue-700">Calculadoras Incorporadas que Puedes Usar</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => onNavigateTab('prestaciones')} className="text-left font-bold text-xs hover:text-blue-600 py-1 flex items-center justify-between cursor-pointer">
                <span>Calculador de Prestaciones</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button onClick={() => onNavigateTab('salario')} className="text-left font-bold text-xs hover:text-blue-600 py-1 flex items-center justify-between cursor-pointer">
                <span>Calculador de Sueldo Neto</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            <AdsenseMock slot="biblioteca-ads" type="square" />
          </div>

        </div>

      </div>

    </div>
  );
}
