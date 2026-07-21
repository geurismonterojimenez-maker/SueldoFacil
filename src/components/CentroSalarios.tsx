import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, DollarSign, Shield, Info, ArrowUpRight, HelpCircle, MapPin, Building, ChevronLeft, Calendar } from 'lucide-react';
import { PROFESSIONS_DB, PROVINCIAS_DB, ProfessionData } from '../data/salariosProfesiones';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

export default function CentroSalarios() {
  const [selectedProfession, setSelectedProfession] = useState<ProfessionData | null>(null);
  const [activeProvinceTab, setActiveProvinceTab] = useState<'profesiones' | 'provincias'>('profesiones');

  // Inject Schemas on Selected Profession Change
  useEffect(() => {
    if (!selectedProfession) {
      // General schemas
      const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Centro de Salarios de República Dominicana - SueldoFacil",
        "description": "Estadísticas, salarios promedio, mínimos y máximos por profesión en la República Dominicana."
      };
      
      let script = document.getElementById('sueldofacil-seo-schema');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'sueldofacil-seo-schema');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(defaultSchema);
      return;
    }

    // Role-specific FAQ schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": selectedProfession.faq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "SueldoFacil",
          "item": "https://sueldofacil.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Salarios",
          "item": `https://sueldofacil.com/salarios/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": selectedProfession.name,
          "item": `https://sueldofacil.com/salarios/${selectedProfession.slug}`
        }
      ]
    };

    // Article / SalaryEstimator schema
    const jobPostingSchema = {
      "@context": "https://schema.org",
      "@type": "Occupation",
      "name": selectedProfession.name,
      "estimatedSalary": {
        "@type": "MonetaryAmountDistribution",
        "currency": "DOP",
        "duration": "Y1M",
        "median": selectedProfession.promedio,
        "percentile10": selectedProfession.minimo,
        "percentile90": selectedProfession.maximo
      },
      "occupationLocation": {
        "@type": "Country",
        "name": "República Dominicana"
      }
    };

    let script = document.getElementById('sueldofacil-seo-schema');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'sueldofacil-seo-schema');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    // Combine both schemas
    script.textContent = JSON.stringify([jobPostingSchema, faqSchema, breadcrumbSchema]);

    // Update document head metadata dynamically
    document.title = `¿Cuánto gana un ${selectedProfession.name} en República Dominicana? (Tasa 2026)`;
  }, [selectedProfession]);

  const selectRoleBySlug = (slug: string) => {
    const role = PROFESSIONS_DB.find(p => p.slug === slug || p.id === slug);
    if (role) {
      setSelectedProfession(role);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTOR TABS */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveProvinceTab('profesiones'); setSelectedProfession(null); }}
          className={`py-3 px-6 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeProvinceTab === 'profesiones' && !selectedProfession ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Salarios por Profesión (Nacional)
        </button>
        <button
          onClick={() => { setActiveProvinceTab('provincias'); setSelectedProfession(null); }}
          className={`py-3 px-6 text-sm font-bold border-b-2 cursor-pointer transition-all ${activeProvinceTab === 'provincias' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Comparador por Provincia & Poder Adquisitivo
        </button>
      </div>

      {selectedProfession ? (
        // DETAIL VIEW FOR INDIVIDUAL PROFESSION - INDEXABLE SEO PAGE
        <div className="space-y-8">
          {/* BREADCRUMBS */}
          <nav className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 capitalize">
            <button onClick={() => setSelectedProfession(null)} className="hover:text-blue-600">Sueldos</button>
            <span>/</span>
            <span className="text-slate-600 font-bold">{selectedProfession.name}</span>
          </nav>

          {/* DETAIL HERO CONTAINER */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-sm">
            <div className="relative z-10 space-y-4">
              <button 
                onClick={() => setSelectedProfession(null)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Volver a Profesiones
              </button>

              <div className="space-y-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${selectedProfession.tendencia === 'Alza' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                  Tendencia: {selectedProfession.tendencia} {selectedProfession.tendencia === 'Alza' ? '▲' : '▬'}
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Sueldo del {selectedProfession.name} en República Dominicana
                </h1>
                <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
                  Comparación orientativa de retenciones TSS, escala del impuesto sobre la renta (ISR) y diferencias salariales por ubicación en 2026. No es una estadística oficial.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMN LEFT: SUMMARY & GRAPHICS */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* PRIMARY CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Salario Promedio</span>
                  <p className="text-2xl font-extrabold text-blue-600 font-mono">RD$ {selectedProfession.promedio.toLocaleString('en-US')}</p>
                  <span className="text-[10px] text-slate-400 font-mono italic">Al mes (Bruto ordinario)</span>
                </div>
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Rango Mínimo Estimado</span>
                  <p className="text-2xl font-extrabold text-slate-800 font-mono">RD$ {selectedProfession.minimo.toLocaleString('en-US')}</p>
                  <span className="text-[10px] text-slate-400 font-mono italic">Junior / Microempresa</span>
                </div>
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Techo Máximo Registrado</span>
                  <p className="text-2xl font-extrabold text-slate-800 font-mono">RD$ {selectedProfession.maximo.toLocaleString('en-US')}</p>
                  <span className="text-[10px] text-slate-400 font-mono italic">Seniors / Multinacionales</span>
                </div>
              </div>

              {/* ESTIMATOR GRAPHICS - RESPONSIVE SVG */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Distribución Salarial de Mercado
                  </h3>
                  <p className="text-xs text-slate-400">Visualización de escala salarial (mínimo, promedio y tope corporativo máximo en RD$)</p>
                </div>

                <div className="relative pt-2">
                  <div className="flex justify-between items-end h-32 w-full px-4 border-b border-slate-100">
                    <div className="flex flex-col items-center gap-1.5 w-1/4">
                      <div className="bg-slate-100 border border-slate-200 rounded-t-lg w-12 hover:bg-slate-200 transition-colors" style={{ height: '40px' }}></div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">RD$ {selectedProfession.minimo >= 1000 ? (selectedProfession.minimo/1000)+'K' : selectedProfession.minimo}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-1/4">
                      <div className="bg-blue-600/80 hover:bg-blue-600 border border-blue-650 rounded-t-lg w-12 transition-colors" style={{ height: '75px' }}></div>
                      <span className="text-[10px] font-bold text-blue-600 font-mono">RD$ {selectedProfession.promedio/1000}K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 w-1/4">
                      <div className="bg-slate-900 hover:bg-black border border-slate-950 rounded-t-lg w-12 transition-colors" style={{ height: '110px' }}></div>
                      <span className="text-[10px] font-bold text-slate-900 font-mono">RD$ {selectedProfession.maximo/1000}K</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] font-semibold text-slate-400 px-4 mt-2 uppercase tracking-wide">
                    <span className="w-1/4 text-center">Nivel Mínimo</span>
                    <span className="w-1/4 text-center">Promedio Nacional</span>
                    <span className="w-1/4 text-center">Techo Máximo</span>
                  </div>
                </div>
              </div>

              {/* SIMULATED LEGAL TAX BREAKDOWN */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Simulación de Impuestos de Nómina (Base Salario Promedio)
                  </h3>
                  <p className="text-xs text-slate-400">Detalles de deducciones que realizaría el empleador conforme a TSS ordinario y escala de Impuesto sobre la Renta.</p>
                </div>

                <div className="space-y-3.5 divide-y divide-slate-100">
                  <div className="flex justify-between text-xs py-1.5 pt-0">
                    <span className="text-slate-600 font-medium">Concepto impositivo regular</span>
                    <span className="text-slate-900 font-bold">Porcentaje / Monto</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-slate-550">Sueldo Mensual Bruto</span>
                    <span className="font-mono text-slate-900 font-bold">RD$ {selectedProfession.promedio.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-slate-550">Retención de AFP (2.87% Fondo de Pensiones)</span>
                    <span className="font-mono text-rose-500 font-bold">-RD$ {selectedProfession.afpEstimada.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-slate-550">Retención de SFS (3.04% Seguro de Salud Fijo)</span>
                    <span className="font-mono text-rose-500 font-bold">-RD$ {selectedProfession.sfsEstimada.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2">
                    <span className="text-slate-550">Retención de ISR de la DGII (Tramo Fiscal)</span>
                    <span className="font-mono text-rose-500 font-bold">-RD$ {selectedProfession.isrEstimado.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs py-2 pt-3 font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-slate-900">Sueldo Neto Líquido Mensual Estimado:</span>
                    <span className="font-mono text-emerald-600 text-sm">RD$ {selectedProfession.netoEstimado.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-[10px] text-slate-450 italic leading-relaxed pt-2">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Este desglose se basa estrictamente en la Ley 87-01 de Seguridad Social y la escala fiscal de retenciones del año tributario en curso para asalariados de República Dominicana.</span>
                </div>
              </div>

              {/* GEOGRAPHIC COST INDEX DETAILS */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Comparación de Sueldos por Provincia para Esta Posición
                  </h3>
                  <p className="text-xs text-slate-400">Variación estimada del salario para un {selectedProfession.name} según el polo de contratación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedProfession.comparacionProvincial.map((p, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">{p.provincia}</span>
                      <p className="text-sm font-bold text-slate-800">
                        {p.desviacion >= 0 ? `+${p.desviacion}%` : `${p.desviacion}%`}
                      </p>
                      <span className="text-[10px] text-slate-450 block font-semibold">
                        Sueldo estimado: RD$ {Math.round(selectedProfession.promedio * (1 + (p.desviacion/100))).toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FREQUENTLY ASKED QUESTIONS */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  Preguntas Frecuentes sobre el Sueldo de {selectedProfession.name}
                </h3>
                
                <div className="space-y-4">
                  {selectedProfession.faq.map((f, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-800">¿{f.q.replace('¿','')}?</h4>
                      <p className="text-xs text-slate-550 leading-relaxed font-semibold">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* COLUMN RIGHT: RELATED LINKS & ARTICLES */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* RELATED PROFESSIONS */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-3.5">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Otras Profesiones Consultadas</p>
                
                <div className="flex flex-col gap-2">
                  {PROFESSIONS_DB.filter(p => p.id !== selectedProfession.id).slice(0, 5).map(role => (
                    <button
                      key={role.id}
                      onClick={() => selectRoleBySlug(role.slug)}
                      className="text-left py-2 px-3 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl text-xs font-bold transition-all text-slate-700 hover:text-blue-600 flex items-center justify-between cursor-pointer"
                    >
                      <span>{role.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* AD BLOCK & VALUE CALL */}
              <div className="bg-blue-600/5 border border-blue-500/10 p-5 rounded-2xl space-y-3">
                <p className="text-xs font-bold text-blue-700">Calculadoras de Enlace Recomendadas</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Estimaste las retenciones para un salario base, pero puedes liquidar prestaciones de preaviso e indemnizaciones si aplicas terminación de contrato.</p>
                <AdsenseMock slot="salary-related" type="square" />
              </div>

            </div>

          </div>
        </div>
      ) : activeProvinceTab === 'profesiones' ? (
        
        // PROFESSIONS INDEX VIEW
        <div className="space-y-6 animate-fade-in">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
              Sueldos y Remuneraciones Promedio en República Dominicana
            </h2>
            <p className="text-xs text-slate-400 font-medium">Buscador y directorio de salarios de mercado promedio, de ley mínimos y sus aportes TSS para cada industria dominicana.</p>
          </div>

          {/* GRID OF ROLES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROFESSIONS_DB.map(role => (
              <div 
                key={role.id} 
                className="bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${role.tendencia === 'Alza' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {role.tendencia === 'Alza' ? '▲ Alta Demanda' : '▬ Estable'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{role.name}</h3>
                  <div className="space-y-0.5 pt-1">
                    <span className="text-[9px] text-slate-450 uppercase font-bold block">Salario Promedio Estimado</span>
                    <p className="text-lg font-extrabold text-slate-950 font-mono">RD$ {role.promedio.toLocaleString('en-US')}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => selectRoleBySlug(role.slug)}
                  className="text-[11px] font-extrabold text-blue-650 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100 cursor-pointer transition-colors w-full text-left"
                >
                  Ver Ficha SEO Completa <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // PROVINCES COMPARATOR VIEW
        <div className="space-y-6 animate-fade-in text-xs font-semibold">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
              Poder Adquisitivo y Salario por Provincias
            </h2>
            <p className="text-xs text-slate-400 font-medium">Estudio analítico de costo de vida promedio, ingresos regionales y poder de ahorro.</p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 text-slate-500 font-bold border-b border-slate-250 bg-slate-50 p-4">
              <div className="md:col-span-4">Provincia / Región</div>
              <div className="md:col-span-2 text-right">Promedio Salario</div>
              <div className="md:col-span-2 text-right">Costo Vida</div>
              <div className="md:col-span-2 text-right">Desviación Nacional</div>
              <div className="md:col-span-2 text-center">Clasificación de Ahorro</div>
            </div>

            <div className="divide-y divide-slate-100">
              {PROVINCIAS_DB.map(p => (
                <div key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-0 items-center p-4 hover:bg-slate-50/50">
                  <div className="md:col-span-4 flex items-center gap-2 text-slate-900 font-bold">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    {p.nombre}
                  </div>
                  <div className="md:col-span-2 text-right font-mono text-slate-850">
                    RD$ {p.promedioSalario.toLocaleString('en-US')}
                  </div>
                  <div className="md:col-span-2 text-right font-mono text-slate-850">
                    {p.costoVidaEstimado}% <span className="text-[10px] text-slate-400">(SD=100)</span>
                  </div>
                  <div className={`md:col-span-2 text-right font-mono ${p.diferenciaNacional >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {p.diferenciaNacional >= 0 ? `+${p.diferenciaNacional}%` : `${p.diferenciaNacional}%`}
                  </div>
                  <div className="md:col-span-2 text-center">
                    <span className={`inline-block py-1 px-2.5 rounded-lg text-[10px] font-extrabold uppercase ${
                      p.poderAdquisitivoLetter === 'A' ? 'bg-emerald-50 text-emerald-600' :
                      p.poderAdquisitivoLetter === 'B' ? 'bg-blue-50 text-blue-600' :
                      p.poderAdquisitivoLetter === 'C' ? 'bg-slate-100 text-slate-600' : 'bg-red-50 text-red-650'
                    }`}>
                      Clase {p.poderAdquisitivoLetter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* AD BLOCK CONTEXT BANNER */}
      <AdsenseMock slot="salarios-tab-footer" type="banner" />
    </div>
  );
}
