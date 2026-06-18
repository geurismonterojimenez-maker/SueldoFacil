import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, HelpCircle, Check, Info } from 'lucide-react';
import AdsenseMock from './AdsenseMock';
import { LEGAL_CONFIG } from '../data/legalConfig';

interface HorasExtrasInput {
  salarioMensual: string;
  horasExtrasOrdinarias: string; // 35% recargo (horas arriba de 44 hasta 68 semanales)
  horasExtrasExtremas: string;   // 100% recargo (horas arriba de 68 semanales)
  horasNocturnas: string;        // 15% recargo (trabajo de 9 PM a 7 AM)
  horasFeriadas: string;         // 100% recargo (trabajo en días de descanso o feriados)
}

interface HorasExtrasOutput {
  salarioPorHora: number;
  montoExtrasOrdinarias: number;
  montoExtrasExtremas: number;
  montoNocturnas: number;
  montoFeriadas: number;
  totalAdicional: number;
  salarioTotalConExtras: number;
}

interface Props {
  onPrint?: (data: any) => void;
}

export default function HorasExtras({ onPrint }: Props = {}) {
  const [input, setInput] = useState<HorasExtrasInput>({
    salarioMensual: '30000',
    horasExtrasOrdinarias: '10',
    horasExtrasExtremas: '0',
    horasNocturnas: '5',
    horasFeriadas: '0',
  });

  const [output, setOutput] = useState<HorasExtrasOutput | null>(null);

  useEffect(() => {
    const salario = parseFloat(input.salarioMensual) || 0;
    const horasOrdinarias = parseFloat(input.horasExtrasOrdinarias) || 0;
    const horasExtremas = parseFloat(input.horasExtrasExtremas) || 0;
    const horasNocturnas = parseFloat(input.horasNocturnas) || 0;
    const horasFeriadas = parseFloat(input.horasFeriadas) || 0;

    // Calcular costo por hora (salario mensual / 23.83 / 8 horas de ley)
    const sueldoDiario = salario / LEGAL_CONFIG.diasLaborablesMes;
    const costoHora = sueldoDiario / LEGAL_CONFIG.horasJornadaDiaria;

    // Recargo del 35% para las primeras 24 horas extras (sobre la jornada de 44 horas hasta 68 semanales)
    const ordinariasRecargo = horasOrdinarias * (costoHora * 1.35);

    // Recargo del 100% para horas extras por encima de 68 semanales
    const extremasRecargo = horasExtremas * (costoHora * 2.0);

    // Recargo del 15% para jornada nocturna (9:00 PM a 7:00 AM)
    const nocturnidadRecargo = horasNocturnas * (costoHora * 0.15);

    // Recargo del 100% para trabajo en días feriados o descanso semanal
    const feriadosRecargo = horasFeriadas * (costoHora * 2.0);

    const totalAdicional = ordinariasRecargo + extremasRecargo + nocturnidadRecargo + feriadosRecargo;
    const salarioTotalConExtras = salario + totalAdicional;

    setOutput({
      salarioPorHora: costoHora,
      montoExtrasOrdinarias: ordinariasRecargo,
      montoExtrasExtremas: extremasRecargo,
      montoNocturnas: nocturnidadRecargo,
      montoFeriadas: feriadosRecargo,
      totalAdicional,
      salarioTotalConExtras,
    });
  }, [input]);

  const handleInputChange = (field: keyof HorasExtrasInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    if (!output) return;
    try {
      const token = 'SF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const hh = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      const ss = String(today.getSeconds()).padStart(2, '0');
      const reportSerial = `SF-HEX-${yyyy}${mm}${dd}-${hh}${min}${ss}-V2026`;

      const payload = {
        input,
        output,
        reportSerial
      };
      
      if (onPrint) {
        onPrint(payload);
        return;
      }

      const payloadStr = JSON.stringify(payload);
      sessionStorage.setItem(`sueldofacil_report_${token}`, payloadStr);
      localStorage.setItem(`sueldofacil_report_${token}`, payloadStr);
      
      const dataString = btoa(unescape(encodeURIComponent(payloadStr)));
      window.open(window.location.origin + window.location.pathname + `?print_report=true&type=horas_extras&token=${token}&data=${encodeURIComponent(dataString)}`, '_blank');
    } catch (e) {
      console.error("Error setting print calculations", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* CARD FORMULARIO (IZQUIERDA) */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            Horas Extras y Nocturnidad
          </h2>
          <p className="text-xs text-slate-500 mt-1">Calcula los recargos por horas adicionales trabajadas según el Código Laboral (Art. 203).</p>
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
                value={input.salarioMensual}
                onChange={e => handleInputChange('salarioMensual', e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Horas Extras Comunes
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={input.horasExtrasOrdinarias}
                  onChange={e => handleInputChange('horasExtrasOrdinarias', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  placeholder="Recargo 35%"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Hasta 68h semanales</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Horas sobre 68 semanales
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={input.horasExtrasExtremas}
                  onChange={e => handleInputChange('horasExtrasExtremas', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  placeholder="Recargo 100%"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Recargo del 100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Horas en Jornada Nocturna
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={input.horasNocturnas}
                  onChange={e => handleInputChange('horasNocturnas', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  placeholder="Recargo 15%"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">De 9:00 PM a 7:00 AM</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Horas en Días Feriados
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  value={input.horasFeriadas}
                  onChange={e => handleInputChange('horasFeriadas', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  placeholder="Recargo 100%"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">O en descando semanal</span>
            </div>
          </div>
        </div>

        <AdsenseMock slot="horas-extras" type="banner" />
      </div>

      {/* CARD DETALLES RESULTADOS (DERECHA) */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between self-stretch min-h-[460px]">
        {output && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Resultados de horas extras
              </span>
              <div className="bg-blue-950 text-blue-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-blue-800 font-semibold text-center">
                RD$ {output.salarioPorHora.toFixed(2)} / Hora Base
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-medium">Ingreso Adicional Estimado por Horas Extras</p>
              <h3 className="text-4xl font-bold text-white tracking-tight mt-1">
                RD$ {output.totalAdicional.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Salario Bruto Bruto Estimado con Extras: RD$ {output.salarioTotalConExtras.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* TABLA DE RECUPERACIONES */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Desglose de Recargos</p>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Horas Extras Comunes (+35% Recargo)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.montoExtrasOrdinarias.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Horas Extras Extremas &gt;68h (+100% Recargo)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.montoExtrasExtremas.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Retribución por Nocturnidad (+15% Adicional)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.montoNocturnas.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Horas Feriadas o Descanso (+100% Recargo)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.montoFeriadas.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* NOTA LEGAL */}
            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
              <span className="font-semibold text-slate-300 block mb-1">Fundamento Legal (Código de Trabajo RD):</span>
              - **Art. 203:** Las horas extras se liquidan con incremento del 35% del valor de la hora normal ordinaria.
              - **Si exceden de 68 horas** semanales se pagarán con un 100% de recargo.
              - **La jornada nocturna** (9 PM a 7 AM) goza de un aumento del 15%.
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
          >
            Imprimir Reporte de Horas
          </button>
        </div>
      </div>
    </div>
  );
}
