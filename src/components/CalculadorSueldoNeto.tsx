import React, { useState, useEffect } from 'react';
import { SalarioInput, SalarioOutput } from '../types';
import { calcularSalarioNeto } from '../utils/calculator';
import { DollarSign, Printer, Share2, HelpCircle, Check, Info, ArrowUpRight } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

interface Props {
  onSaveCalculation: (calc: { type: string; label: string; result: number; timestamp: string; details: any }) => void;
  initialState?: any;
}

export default function CalculadorSueldoNeto({ onSaveCalculation, initialState }: Props) {
  const [input, setInput] = useState<SalarioInput>({
    salarioBruto: '45000',
    ingresosAdicionales: '0',
    percepcionISR: true
  });
  const [output, setOutput] = useState<SalarioOutput | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    try {
      const result = calcularSalarioNeto(input);
      setOutput(result);
    } catch (e) {
      console.error(e);
    }
  }, [input]);

  const handleInputChange = (field: keyof SalarioInput, value: string | boolean) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!output) return;
    onSaveCalculation({
      type: 'salario',
      label: `Neto RD$ ${output.salarioNeto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      result: output.salarioNeto,
      timestamp: new Date().toLocaleTimeString('es-DO') + ' - ' + new Date().toLocaleDateString('es-DO'),
      details: { input, output }
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#salario?state=${btoa(JSON.stringify(input))}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 3000);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* FORMULARIO IZQUIERDA */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            Cálculo de Salario y Retenciones
          </h2>
          <p className="text-xs text-slate-400 mt-1">Calcula los descuentos legales de Seguridad Social (AFP, SFS) e Impuesto Sobre la Renta (ISR).</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Salario Bruto Mensual (RD$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="number"
                placeholder="Ej: 45000"
                value={input.salarioBruto}
                onChange={e => handleInputChange('salarioBruto', e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              Ingresa el salario ordinario base antes de los descuentos de nómina.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Ingresos Adicionales Mensuales (Comisiones, Incentivos, etc.)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="number"
                placeholder="Ej: 5000 (Opcional)"
                value={input.ingresosAdicionales}
                onChange={e => handleInputChange('ingresosAdicionales', e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            Guardar en mi Historial <Check className="w-4 h-4" />
          </button>
        </div>

        <AdsenseMock slot="salario-sidebar" type="banner" />
      </div>

      {/* RESULTADO DERECHA */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between self-stretch min-h-[500px]">
        {output && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Análisis Neto Mensual
              </span>
              <div className="bg-emerald-950 text-emerald-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-emerald-800 font-semibold">
                Neto del {output.porcentajeNeto.toFixed(1)}%
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-medium">Salario Neto Recibido</p>
              <h3 className="text-4xl font-bold text-white tracking-tight mt-1">
                RD$ {output.salarioNeto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Salario Bruto Total: RD$ {(output.salarioBruto + output.ingresosAdicionales).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* RETENCIONES TABLA */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Desglose de Retenciones Obligatorias (TSS & DGII)</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                  <span className="text-xs text-slate-300">SFS / Salud (3.04%)</span>
                </div>
                <span className="text-xs font-mono text-slate-200">
                  - RD$ {output.sfs.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
                  <span className="text-xs text-slate-300">AFP / Pensiones (2.87%)</span>
                </div>
                <span className="text-xs font-mono text-slate-200">
                  - RD$ {output.afp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
                  <span className="text-xs text-slate-300">Impuesto Sobre la Renta (ISR)</span>
                </div>
                <span className="text-xs font-mono text-slate-200">
                  - RD$ {output.isr.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Total Descontado</span>
                </div>
                <span className="text-xs font-bold font-mono text-rose-400">
                  - RD$ {output.retencionesTotales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* GRÁFICO BARRA COMPARATIVA */}
            <div className="bg-slate-950 p-4 border border-slate-800/80 rounded-xl space-y-2 mt-2">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Distribución del Salario</p>
              <div className="h-3 w-full bg-slate-800 rounded-full flex overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${output.porcentajeNeto}%` }} title="Neto" />
                <div className="bg-blue-500 h-full" style={{ width: `${(output.sfs / (output.salarioBruto + output.ingresosAdicionales)) * 100}%` }} title="SFS" />
                <div className="bg-indigo-500 h-full" style={{ width: `${(output.afp / (output.salarioBruto + output.ingresosAdicionales)) * 100}%` }} title="AFP" />
                <div className="bg-rose-500 h-full" style={{ width: `${(output.isr / (output.salarioBruto + output.ingresosAdicionales)) * 100}%` }} title="ISR" />
              </div>
              <div className="flex gap-3 text-[9px] text-slate-400 justify-between items-center pt-1 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> Neto ({output.porcentajeNeto.toFixed(0)}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500"></span> SFS</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500"></span> AFP</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500"></span> ISR</span>
              </div>
            </div>

            {/* NOTA TSS y DGII */}
            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
              <span className="font-semibold text-slate-300 block mb-1">Dato de Interés Fiscal:</span>
              La base gravable para el cobro del ISR mensual de la DGII es tu salario bruto reduciéndole primero el 3.04% de Seguro Familiar de Salud (SFS) y el 2.87% de AFP (Fondo de Pensiones). Los descuentos de SFS y AFP están limitados por los topes de cotización de la TSS de 10 y 20 salarios mínimos regulados.
            </div>
          </div>
        )}

        <div className="flex gap-2.5 mt-6 border-t border-slate-800 pt-5">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          
          <button
            onClick={handleShare}
            className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700 relative"
          >
            <Share2 className="w-4 h-4" />
            Compartir
            {showShareTooltip && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] py-1 px-2.5 rounded shadow whitespace-nowrap z-30 font-medium">
                Enlace copiado!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
