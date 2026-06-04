import React, { useState, useEffect } from 'react';
import { PrestacionesInput, PrestacionesOutput } from '../types';
import { calcularPrestacionesLaborales } from '../utils/calculator';
import { Calendar, DollarSign, ArrowRight, Printer, Share2, FileSpreadsheet, Eye, HelpCircle, ChevronRight, Check } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

interface Props {
  onSaveCalculation: (calc: { type: string; label: string; result: number; timestamp: string; details: any }) => void;
  initialState?: any;
}

export default function CalculadorPrestaciones({ onSaveCalculation, initialState }: Props) {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<PrestacionesInput>({
    fechaIngreso: '2023-01-01',
    fechaSalida: '2026-06-01',
    salarioMensual: '35000',
    tipoSalida: 'desahucio_patronal',
    incluyePreaviso: true,
    incluyeCesantia: true,
    diasVacacionesPendientes: 0,
    incluyeRegalia: true,
  });

  const [output, setOutput] = useState<PrestacionesOutput | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Recalculate on any input change
  useEffect(() => {
    try {
      const result = calcularPrestacionesLaborales(input);
      setOutput(result);
    } catch (e) {
      console.error(e);
    }
  }, [input]);

  const handleInputChange = (field: keyof PrestacionesInput, value: any) => {
    setInput(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto toggle rules depending on tipoSalida
      if (field === 'tipoSalida') {
        if (value === 'desahucio_trabajador' || value === 'despido_justificado') {
          updated.incluyePreaviso = false;
          updated.incluyeCesantia = false;
        } else {
          updated.incluyePreaviso = true;
          updated.incluyeCesantia = true;
        }
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!output) return;
    onSaveCalculation({
      type: 'prestaciones',
      label: `Liquidación RD$ ${output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      result: output.total,
      timestamp: new Date().toLocaleTimeString('es-DO') + ' - ' + new Date().toLocaleDateString('es-DO'),
      details: { input, output }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#prestaciones?state=${btoa(JSON.stringify(input))}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 3000);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* CARD IZQUIERDA: FORMULARIO PASO A PASO */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            Cálculo de Liquidación
          </h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(idx => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                  step === idx
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {idx}
              </button>
            ))}
          </div>
        </div>

        {/* PASO 1: FECHA DE INGRESO */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-2">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Paso 1: ¿Cuándo comenzó tu relación laboral? La antigüedad es clave para determinar los meses o años de cesantía y preaviso.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Fecha de Ingreso (Entrada)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  type="date"
                  value={input.fechaIngreso}
                  onChange={e => handleInputChange('fechaIngreso', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              Siguiente Paso <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PASO 2: FECHA DE SALIDA */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-2">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Paso 2: ¿Hasta qué fecha laboras? Esto fija el lapso de tiempo exacto y el remanente proporcional del año para el Sueldo #13.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Fecha de Salida (Último Día Laborado)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  type="date"
                  value={input.fechaSalida}
                  onChange={e => handleInputChange('fechaSalida', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all text-sm"
              >
                Anterior
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                Siguiente Paso <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: SALARIO MENSUAL */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-2">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Paso 3: Introduce tu salario mensual promedio bruto ordinario. No incluyas bonificaciones extraordinarias.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Salario Ordinario Mensual (RD$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                <input
                  type="number"
                  placeholder="Ej: 35000"
                  value={input.salarioMensual}
                  onChange={e => handleInputChange('salarioMensual', e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all text-sm"
              >
                Anterior
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                Siguiente Paso <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: TIPO DE SALIDA / CONFIGURACIONES */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Motivo / Tipo de Terminación Laboral
              </label>
              <select
                value={input.tipoSalida}
                onChange={e => handleInputChange('tipoSalida', e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="desahucio_patronal">Despido injustificado o Desahucio del Patrono (Con Prestaciones)</option>
                <option value="desahucio_trabajador">Renuncia voluntaria / Desahucio del Trabajador (Pierde Cesantía)</option>
                <option value="despido_justificado">Despido justificado (Por faltas del empleado, Pierde Prestaciones)</option>
                <option value="dimision_justificada">Dimisión Justificada (Renuncia por culpa del empleador, Con Prestaciones)</option>
              </select>
            </div>

            {/* INTERRUPTORES */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Conceptos a Incluir
              </label>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <span className="text-xs font-medium text-slate-700">Preaviso</span>
                <input
                  type="checkbox"
                  checked={input.incluyePreaviso}
                  onChange={e => handleInputChange('incluyePreaviso', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <span className="text-xs font-medium text-slate-700">Cesantía</span>
                <input
                  type="checkbox"
                  checked={input.incluyeCesantia}
                  onChange={e => handleInputChange('incluyeCesantia', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                <span className="text-xs font-medium text-slate-700">Regalía Pascual (Sueldo 13 proporcional)</span>
                <input
                  type="checkbox"
                  checked={input.incluyeRegalia}
                  onChange={e => handleInputChange('incluyeRegalia', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-700">Días de vacaciones pendientes</span>
                  <input
                    type="number"
                    value={input.diasVacacionesPendientes}
                    onChange={e => handleInputChange('diasVacacionesPendientes', parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-xs border border-slate-200 rounded bg-slate-50 p-1"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Deja en 0 si quieres calcular el proporcional acumulado automáticamente</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all text-sm"
              >
                Anterior
              </button>
              <button
                onClick={handleSave}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                Concluir y Guardar <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <AdsenseMock slot="prestaciones-sidebar" type="banner" />
      </div>

      {/* CARD DERECHA: RESULTADOS EN TIEMPO REAL */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between self-stretch min-h-[500px]">
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Resultado en tiempo real
            </span>
            <div className="bg-slate-800 text-blue-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-slate-700">
              Cálculo de Ley
            </div>
          </div>

          {output && (
            <div className="space-y-6">
              <div>
                <p className="text-slate-400 text-xs font-medium">Monto Total Estimado</p>
                <h3 className="text-4xl font-bold text-white tracking-tight mt-1">
                  RD$ {output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  Antigüedad laboral: {output.tiempoServicio.anos} años, {output.tiempoServicio.meses} meses, y {output.tiempoServicio.dias} días
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Sueldo promedio diario establecido: RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Sueldo / 23.83)
                </p>
              </div>

              {/* LISTA COMPONENTES */}
              <div className="space-y-3.5 border-t border-slate-800 pt-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-medium text-slate-300">Preaviso</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.preaviso.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-slate-300">Cesantía</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.cesantia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-xs font-medium text-slate-300">Vacaciones</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.vacaciones.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-medium text-slate-300">Regalía Pascual (Sueldo #13)</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.regalia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* GRAFICO BARRA SIMPLE */}
              <div className="bg-slate-950 p-4 border border-slate-800/80 rounded-xl space-y-2 mt-2">
                <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider">Breakdown Proporcional</p>
                <div className="h-2.5 w-full bg-slate-800 rounded-full flex overflow-hidden">
                  {output.total > 0 ? (
                    <>
                      <div className="bg-blue-500 h-full transition-all" style={{ width: `${(output.preaviso / output.total) * 100}%` }} title="Preaviso" />
                      <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(output.cesantia / output.total) * 100}%` }} title="Cesantía" />
                      <div className="bg-indigo-500 h-full transition-all" style={{ width: `${(output.vacaciones / output.total) * 100}%` }} title="Vacaciones" />
                      <div className="bg-amber-500 h-full transition-all" style={{ width: `${(output.regalia / output.total) * 100}%` }} title="Regalía Pascual" />
                    </>
                  ) : (
                    <div className="bg-slate-700 w-full h-full" />
                  )}
                </div>
                <div className="flex gap-3 text-[9px] text-slate-400 justify-between items-center pt-1 font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500"></span> Preaviso</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> Cesantía</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500"></span> Vacaciones</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500"></span> Sueldo #13</span>
                </div>
              </div>

              {/* DETALLE LEGAL */}
              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                <span className="font-semibold text-slate-300 block mb-1">Fundamento Legal (Art. 76 al 86 Ley 16-92):</span>
                El preaviso y la cesantía se calculan en base a tu salario cotizable diario (Salario Bruto / 23.83). La regalía pascual está libre del impuesto ISR y de seguridad social por mandato expreso constitucional y laboral. El empleador cuenta con un máximo de 10 días laborables para realizar el desembolso total de la liquidación antes de generar el cobro por mora laboral diaria.
              </div>
            </div>
          )}
        </div>

        {/* CONTROLES DE RESULTADOS */}
        <div className="flex gap-2.5 mt-6 border-t border-slate-800 pt-5">
          <button
            onClick={handlePrint}
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
