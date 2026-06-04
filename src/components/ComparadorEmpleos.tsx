import React, { useState, useEffect } from 'react';
import { DollarSign, Shield, ArrowRight, TrendingUp, Info } from 'lucide-react';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

export default function ComparadorEmpleos() {
  const [offers, setOffers] = useState({
    empleoA: {
      nombre: 'Alternativa A (Actual)',
      salarioBruto: '65000',
      bonoAnual: '1', // Sueldos base anuales por bonificación
      transporteMensual: '2500',
      seguroComplementario: '1500',
      incentivos: '5000' // Incentivos mensuales adicionales
    },
    empleoB: {
      nombre: 'Alternativa B (Nueva Oferta)',
      salarioBruto: '75000',
      bonoAnual: '1.5',
      transporteMensual: '4000',
      seguroComplementario: '2000',
      incentivos: '8000'
    }
  });

  const [comparisons, setComparisons] = useState<any>(null);

  useEffect(() => {
    // Calculo para ambos empleos
    const calculoA = calcularSalarioNeto({
      salarioBruto: offers.empleoA.salarioBruto,
      ingresosAdicionales: offers.empleoA.incentivos
    });
    
    const calculoB = calcularSalarioNeto({
      salarioBruto: offers.empleoB.salarioBruto,
      ingresosAdicionales: offers.empleoB.incentivos
    });

    // Anualizaciones
    const sueldoBrutoAnualA = parseFloat(offers.empleoA.salarioBruto) * 12;
    const sueldoBrutoAnualB = parseFloat(offers.empleoB.salarioBruto) * 12;

    const bonoAnualValA = parseFloat(offers.empleoA.salarioBruto) * parseFloat(offers.empleoA.bonoAnual);
    const bonoAnualValB = parseFloat(offers.empleoB.salarioBruto) * parseFloat(offers.empleoB.bonoAnual);

    const incentivosAnualA = (parseFloat(offers.empleoA.incentivos) || 0) * 12;
    const incentivosAnualB = (parseFloat(offers.empleoB.incentivos) || 0) * 12;

    const seguroAnualA = (parseFloat(offers.empleoA.seguroComplementario) || 0) * 12;
    const seguroAnualB = (parseFloat(offers.empleoB.seguroComplementario) || 0) * 12;

    const transporteAnualA = (parseFloat(offers.empleoA.transporteMensual) || 0) * 12;
    const transporteAnualB = (parseFloat(offers.empleoB.transporteMensual) || 0) * 12;

    // Beneficio anual real = (Salario neto * 12) + Bono Anual + Seguro Anual + Incentivos Anteriores - Transporte Anual
    const totalBeneficioAnualNetoRealA = (calculoA.salarioNeto * 12) + bonoAnualValA + seguroAnualA - transporteAnualA;
    const totalBeneficioAnualNetoRealB = (calculoB.salarioNeto * 12) + bonoAnualValB + seguroAnualB - transporteAnualB;

    const diffAnual = totalBeneficioAnualNetoRealB - totalBeneficioAnualNetoRealA;
    const incrementoPorcentaje = totalBeneficioAnualNetoRealA > 0 
      ? (diffAnual / totalBeneficioAnualNetoRealA) * 100 
      : 0;

    setComparisons({
      puestoA: {
        nombre: offers.empleoA.nombre,
        bruto: parseFloat(offers.empleoA.salarioBruto),
        netoMensual: calculoA.salarioNeto,
        beneficioAnualReal: totalBeneficioAnualNetoRealA,
        fiscalAnual: calculoA.retencionesTotales * 12,
        bonoAnual: bonoAnualValA,
        seguroAnual: seguroAnualA,
        transporteAnual: transporteAnualA,
        incentivosAnual: incentivosAnualA
      },
      puestoB: {
        nombre: offers.empleoB.nombre,
        bruto: parseFloat(offers.empleoB.salarioBruto),
        netoMensual: calculoB.salarioNeto,
        beneficioAnualReal: totalBeneficioAnualNetoRealB,
        fiscalAnual: calculoB.retencionesTotales * 12,
        bonoAnual: bonoAnualValB,
        seguroAnual: seguroAnualB,
        transporteAnual: transporteAnualB,
        incentivosAnual: incentivosAnualB
      },
      diferenciaAnual: diffAnual,
      incrementoPorcentaje: incrementoPorcentaje,
      mejorOpcion: totalBeneficioAnualNetoRealB > totalBeneficioAnualNetoRealA ? 'B' : 'A'
    });
  }, [offers]);

  const handleInputChange = (empleo: 'empleoA' | 'empleoB', field: string, value: string) => {
    setOffers(prev => ({
      ...prev,
      [empleo]: {
        ...prev[empleo],
        [field]: value
      }
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* FORMULARIO COMPARATIVO */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Simulador de Cambio de Empleo
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compara de forma interactiva dos ofertas de empleo descontando impuestos de ley (TSS e ISR) e integrando beneficios anuales para tomar decisiones inteligentes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* EMPLEO A */}
          <div className="space-y-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest pb-2 border-b border-slate-100">Empleo Alternativa A</h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nombre Descriptivo</label>
              <input
                type="text"
                value={offers.empleoA.nombre}
                onChange={e => handleInputChange('empleoA', 'nombre', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Salario Bruto Mensual (RD$)</label>
              <input
                type="number"
                value={offers.empleoA.salarioBruto}
                onChange={e => handleInputChange('empleoA', 'salarioBruto', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Incentivos Adicionales (RD$ / Mes)</label>
              <input
                type="number"
                value={offers.empleoA.incentivos}
                onChange={e => handleInputChange('empleoA', 'incentivos', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Bonificación Anual (En Sueldos Base)</label>
              <select
                value={offers.empleoA.bonoAnual}
                onChange={e => handleInputChange('empleoA', 'bonoAnual', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800"
              >
                <option value="0">No cuenta con bonos</option>
                <option value="0.5">Medio sueldo anual</option>
                <option value="1">1 sueldo completo al año</option>
                <option value="2">2 sueldos completos al año</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Seguro Médico Adicional / Beneficios (RD$ / Mes)</label>
              <input
                type="number"
                value={offers.empleoA.seguroComplementario}
                onChange={e => handleInputChange('empleoA', 'seguroComplementario', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Costo de Transporte (RD$ / Mes)</label>
              <input
                type="number"
                value={offers.empleoA.transporteMensual}
                onChange={e => handleInputChange('empleoA', 'transporteMensual', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* EMPLEO B */}
          <div className="space-y-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <h3 className="text-xs font-bold text-blue-650 uppercase tracking-widest pb-2 border-b border-slate-100">Empleo Alternativa B</h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nombre Descriptivo</label>
              <input
                type="text"
                value={offers.empleoB.nombre}
                onChange={e => handleInputChange('empleoB', 'nombre', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Salario Bruto Mensual (RD$)</label>
              <input
                type="number"
                value={offers.empleoB.salarioBruto}
                onChange={e => handleInputChange('empleoB', 'salarioBruto', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Incentivos Adicionales (RD$ / Mes)</label>
              <input
                type="number"
                value={offers.empleoB.incentivos}
                onChange={e => handleInputChange('empleoB', 'incentivos', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Bonificación Anual (En Sueldos Base)</label>
              <select
                value={offers.empleoB.bonoAnual}
                onChange={e => handleInputChange('empleoB', 'bonoAnual', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800"
              >
                <option value="0">No cuenta con bonos</option>
                <option value="0.5">Medio sueldo anual</option>
                <option value="1">1 sueldo completo al año</option>
                <option value="2">2 sueldos completos al año</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Seguro Médico Adicional / Beneficios (RD$ / Mes)</label>
              <input
                type="number"
                value={offers.empleoB.seguroComplementario}
                onChange={e => handleInputChange('empleoB', 'seguroComplementario', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Costo de Transporte (RD$ / Mes)</label>
              <input
                type="number"
                value={offers.empleoB.transporteMensual}
                onChange={e => handleInputChange('empleoB', 'transporteMensual', e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADO COMPARATIVO */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between self-stretch min-h-[500px]">
        {comparisons ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Análisis Financiero Real
              </span>
              <div className="bg-emerald-950 text-emerald-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-emerald-800 font-semibold">
                Mejor Opción: {comparisons.mejorOpcion === 'A' ? 'Alternativa A' : 'Alternativa B'}
              </div>
            </div>

            {/* RECOMMENDATION EXPLICIT CARD */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                Diferencia Anual Real en Valor Neto:
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                RD$ {Math.abs(comparisons.diferenciaAnual).toLocaleString('en-US', { maximumFractionDigits: 0 })}/Año
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium font-mono leading-normal">
                {comparisons.diferenciaAnual >= 0 ? (
                  `¡La nueva oferta representa un aumento real del ${comparisons.incrementoPorcentaje.toFixed(1)}% anual!`
                ) : (
                  `¡Quedarte en tu empleo actual es un ${Math.abs(comparisons.incrementoPorcentaje).toFixed(1)}% mejor económicamente!`
                )}
              </p>
            </div>

            {/* TABLA COMPARATIVA DIRECTA */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Métricas Clave de Comparación (Anual)</p>
              
              <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-2">
                <span>Concepto</span>
                <span className="text-right">Oferta A</span>
                <span className="text-right">Oferta B</span>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-300">
                <span>Sueldo Neto de Ley</span>
                <span className="text-right font-mono text-slate-200">RD$ {Math.round(comparisons.puestoA.netoMensual).toLocaleString('en-US')}/m</span>
                <span className="text-right font-mono text-slate-200">RD$ {Math.round(comparisons.puestoB.netoMensual).toLocaleString('en-US')}/m</span>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-300">
                <span>Impacto Fiscal (Anual)</span>
                <span className="text-right font-mono text-rose-400">-RD$ {Math.round(comparisons.puestoA.fiscalAnual).toLocaleString('en-US')}</span>
                <span className="text-right font-mono text-rose-400">-RD$ {Math.round(comparisons.puestoB.fiscalAnual).toLocaleString('en-US')}</span>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-300">
                <span>Incentivos (Anual)</span>
                <span className="text-right font-mono text-blue-400">+RD$ {Math.round(comparisons.puestoA.incentivosAnual).toLocaleString('en-US')}</span>
                <span className="text-right font-mono text-blue-400">+RD$ {Math.round(comparisons.puestoB.incentivosAnual).toLocaleString('en-US')}</span>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-300">
                <span>Bono Estimado (Anual)</span>
                <span className="text-right font-mono text-blue-400">+RD$ {Math.round(comparisons.puestoA.bonoAnual).toLocaleString('en-US')}</span>
                <span className="text-right font-mono text-blue-400">+RD$ {Math.round(comparisons.puestoB.bonoAnual).toLocaleString('en-US')}</span>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-300">
                <span>Seguro Médico (Anual)</span>
                <span className="text-right font-mono text-blue-400">+RD$ {Math.round(comparisons.puestoA.seguroAnual).toLocaleString('en-US')}</span>
                <span className="text-right font-mono text-blue-400">+RD$ {Math.round(comparisons.puestoB.seguroAnual).toLocaleString('en-US')}</span>
              </div>

              <div className="grid grid-cols-3 text-xs text-slate-300">
                <span>Transporte (Anual)</span>
                <span className="text-right font-mono text-rose-450">-RD$ {Math.round(comparisons.puestoA.transporteAnual).toLocaleString('en-US')}</span>
                <span className="text-right font-mono text-rose-450">-RD$ {Math.round(comparisons.puestoB.transporteAnual).toLocaleString('en-US')}</span>
              </div>

              <div className="grid grid-cols-3 text-xs font-bold border-t border-slate-800 pt-3 text-white">
                <span>Beneficio Neto Real</span>
                <span className={`text-right font-mono ${comparisons.mejorOpcion === 'A' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  RD$ {Math.round(comparisons.puestoA.beneficioAnualReal).toLocaleString('en-US')}
                </span>
                <span className={`text-right font-mono ${comparisons.mejorOpcion === 'B' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  RD$ {Math.round(comparisons.puestoB.beneficioAnualReal).toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-800 pt-1">
              Nota: El beneficio neto anual se calcula sumando el salario neto libre de TSS e ISR, bonificaciones de mercado anuales prorrateadas, incentivos, valor del seguro médico complementario y descontando el gasto real de traslado y gasolina.
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 font-semibold">Cargando...</p>
        )}
        <AdsenseMock slot="comparador-ads" type="banner" />
      </div>
    </div>
  );
}
