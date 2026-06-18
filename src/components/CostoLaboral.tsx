import React, { useState, useEffect } from 'react';
import { CostoLaboralInput, CostoLaboralOutput } from '../types';
import { calcularCostoLaboral } from '../utils/calculator';
import { DollarSign, Shield, Info, Check, Printer, Percent } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

export default function CostoLaboral() {
  const [input, setInput] = useState<CostoLaboralInput>({
    salarioMensual: '40000',
    riesgoLaboral: 1.2, // ARL 1.2% por defecto
  });

  const [output, setOutput] = useState<CostoLaboralOutput | null>(null);

  const [reportSerial] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    const ss = String(today.getSeconds()).padStart(2, '0');
    return `SF-CL-${yyyy}${mm}${dd}-${hh}${min}${ss}-V2026`;
  });

  const handlePrint = () => {
    if (!output) return;
    try {
      const token = 'SF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      sessionStorage.setItem(`sueldofacil_report_${token}`, JSON.stringify({
        input,
        output,
        reportSerial
      }));
      window.open(window.location.origin + window.location.pathname + `?print_report=true&type=costos&token=${token}`, '_blank');
    } catch (e) {
      console.error("Error setting print calculations", e);
    }
  };

  useEffect(() => {
    try {
      const result = calcularCostoLaboral(input);
      // Incluir Infotep (1% de nómina a cuenta patronal) en los cálculos para dar un resultado de clase mundial
      const infotepPatronal = parseFloat(input.salarioMensual) * 0.01;
      
      setOutput({
        ...result,
        arl: result.arl, // already calculated
        totalCostoEmpresarial: result.totalCostoEmpresarial + infotepPatronal,
        // Recalcular porcentaje adicional incluyendo Infotep
        porcentajeAdicional: ((result.totalCostoEmpresarial + infotepPatronal - result.salarioBase) / result.salarioBase) * 100
      });
    } catch (e) {
      console.error(e);
    }
  }, [input]);

  const handleInputChange = (field: keyof CostoLaboralInput, value: string | number) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* FORMULARIO DE COSTOS LABORALES (IZQUIERDA) */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            Costo Real del Empleado (RRHH)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Perfecto para emprendedores, contables y departamentos de RRHH. Averigua cuánto cuesta realmente un empleado incluyendo seguridad social, INFOTEP y provisiones de ley.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Salario Nomina de Empleado (Mensual RD$)
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
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              Salario bruto contractual establecido.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tasa ARL (Seguro de Riesgos Laborales %)
            </label>
            <div className="relative">
              <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="number"
                step="0.01"
                value={input.riesgoLaboral}
                onChange={e => handleInputChange('riesgoLaboral', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Establecido por la TSS según riesgo de clase laboral (normalmente entre 1.1% y 1.3%)</span>
          </div>
        </div>

        <AdsenseMock slot="costos-employers" type="banner" />
      </div>

      {/* DETALLES DE COSTO PATRONAL (DERECHA) */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between self-stretch min-h-[500px]">
        {output && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Caudal del Empleador
              </span>
              <div className="bg-blue-950 text-blue-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-blue-800 font-semibold">
                +{output.porcentajeAdicional.toFixed(1)}% Adicional s/ Nómina
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-medium">Costo Total Mensual del Colaborador</p>
              <h3 className="text-4xl font-bold text-white tracking-tight mt-1">
                RD$ {output.totalCostoEmpresarial.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Gasto adicional mensual estimado de RD$ {(output.totalCostoEmpresarial - output.salarioBase).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* LISTA COMPONENTES */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Aportes a la Seguridad Social (Patrono)</p>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Seguro Familiar de Salud (SFS) - 7.09%</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.sfsPatronal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Fondo de Pensiones (AFP) - 7.10%</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.afpPatronal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Riesgos Laborales (ARL) - {input.riesgoLaboral}%</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.arl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">INFOTEP (Aporte Patronal Obligatorio 1%)</span>
                <span className="font-mono text-slate-200">
                  RD$ {(output.salarioBase * 0.01).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* PROVISIONES DE LEY */}
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pt-2 border-t border-slate-800">Provisiones Pasivas Acumuladas</p>

              <div className="flex justify-between items-center text-xs py-0.5">
                <span className="text-slate-300">Provisión de Sueldo de Navidad (Regalía ~8.33%)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.provisionRegalia.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-0.5">
                <span className="text-slate-300">Provisión de Vacaciones Anuales (~4.9%)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.provisionVacaciones.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs py-0.5">
                <span className="text-slate-300">Provisión de Cesantía/Indemnización (~5.4%)</span>
                <span className="font-mono text-slate-200">
                  RD$ {output.provisionCesantia.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* CONSEJO OPERATIVO */}
            <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
              <span className="font-semibold text-slate-300 block mb-1">Análisis Financiero de RRHH:</span>
              En la República Dominicana, el salario contractual neto representa aproximadamente el **70-75% del costo real** de la nómina para la empresa. Provisionar estos pasivos (Regalía, Vacaciones y Cesantía) mes a mes te previene de asfixia en el flujo de caja ante desahucios masivos.
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
          >
            Exportar a Planilla de Presupuesto
          </button>
        </div>
      </div>
    </div>
  );
}
