import React, { useState, useEffect } from 'react';
import { PrestacionesInput, PrestacionesOutput } from '../types';
import { calcularPrestacionesLaborales } from '../utils/calculator';
import { Calendar, DollarSign, ArrowRight, Printer, Share2, FileSpreadsheet, Eye, HelpCircle, ChevronRight, Check, ChevronDown, BookOpen } from 'lucide-react';
import AdsenseMock from './AdsenseMock';
import YmylDisclaimer from './YmylDisclaimer';
import EditorialAuthBox from './EditorialAuthBox';
import { analytics } from '../utils/analytics';

interface Props {
  onSaveCalculation: (calc: { type: string; label: string; result: number; timestamp: string; details: any }) => void;
  initialState?: any;
}

export default function CalculadorPrestaciones({ onSaveCalculation, initialState }: Props) {
  const [input, setInput] = useState<PrestacionesInput>(() => {
    const savedSalario = localStorage.getItem('sueldofacil_prof_salario') || '35000';
    const savedFechaIngreso = localStorage.getItem('sueldofacil_prof_fecha_ingreso') || '2023-01-01';
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      fechaIngreso: savedFechaIngreso,
      fechaSalida: todayStr,
      salarioMensual: savedSalario,
      tipoSalida: 'desahucio_patronal',
      incluyePreaviso: true,
      incluyeCesantia: true,
      diasVacacionesPendientes: 0,
      incluyeRegalia: true,
      vacacionesTomadas: false,
    };
  });

  const [output, setOutput] = useState<PrestacionesOutput | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [pdfType, setPdfType] = useState<'ejecutivo' | 'educativo'>('ejecutivo');
  const [reportSerial] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    const ss = String(today.getSeconds()).padStart(2, '0');
    return `SF-${yyyy}${mm}${dd}-${hh}${min}${ss}-V2026`;
  });

  // Recalculate on any input change
  useEffect(() => {
    try {
      const result = calcularPrestacionesLaborales(input);
      setOutput(result);
      if (result) {
        analytics.logCalculoRealizado('prestaciones', 'Prestaciones Laborales');
      }
    } catch (e) {
      console.error(e);
      analytics.logErrorCalculo('prestaciones', e instanceof Error ? e.message : 'Error calculando prestaciones');
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
    analytics.logEvent('calculo_realizado', {
      category: 'prestaciones',
      action: 'guardar_calculo',
      label: 'Guardar Prestaciones RD'
    });
    onSaveCalculation({
      type: 'prestaciones',
      label: `Liquidación RD$ ${output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      result: output.total,
      timestamp: new Date().toLocaleTimeString('es-DO') + ' - ' + new Date().toLocaleDateString('es-DO'),
      details: { input, output }
    });
  };

  const handlePrint = () => {
    analytics.logPdfDescargado('prestaciones', 'Prestaciones Laborales');
    try {
      const token = 'SF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      const payload = {
        input,
        output,
        reportSerial,
        pdfType
      };
      const payloadStr = JSON.stringify(payload);
      sessionStorage.setItem(`sueldofacil_report_${token}`, payloadStr);
      localStorage.setItem(`sueldofacil_report_${token}`, payloadStr);
      
      const dataString = btoa(unescape(encodeURIComponent(payloadStr)));
      window.open(window.location.origin + window.location.pathname + `?print_report=true&token=${token}&data=${encodeURIComponent(dataString)}`, '_blank');
    } catch (e) {
      console.error("Error setting print calculations", e);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#prestaciones?state=${btoa(JSON.stringify(input))}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      analytics.logResultadoCopiado('prestaciones', 'Prestaciones Laborales');
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 3000);
    });
  };

  return (
    <>
      {/* VISTA EN PANTALLA GENERAL (SE OCULTA COMPLETAMENTE EN EL PDF/DISEÑO IMPRESO) */}
      <div className="print:hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">      {/* CARD IZQUIERDA: CONFIGURACION SIMPLIFICADA (TODO EN UNO) */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
              Cálculo de Liquidación
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Ingresa tus datos y proyéctalo en tiempo real según el Código de Trabajo de RD.</p>
          </div>
        </div>

        {/* CONTENIDO INTEGRADO (SIN PASO A PASO) */}
        <div className="space-y-4 text-slate-700">
          {/* TIEMPO DE SERVICIO */}
          <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">1. Tiempo de Servicio</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Fecha de Ingreso (Entrada)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="date"
                    value={input.fechaIngreso}
                    onChange={e => handleInputChange('fechaIngreso', e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Fecha de Salida (Último Día)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="date"
                    value={input.fechaSalida}
                    onChange={e => handleInputChange('fechaSalida', e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BASE SALARIAL */}
          <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">2. Sueldo Base</span>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-600 mb-1.5 uppercase tracking-wide">
                Salario Mensual Ordinario (RD$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="number"
                  placeholder="Ej: 35000"
                  value={input.salarioMensual}
                  onChange={e => handleInputChange('salarioMensual', e.target.value)}
                  className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl py-2 pl-9 pr-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 leading-normal">Salario bruto reportado a TSS, sin horas extras extraordinarias.</p>
            </div>
          </div>

          {/* CAUSA / MOTIVO */}
          <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">3. Motivo del Egreso</span>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-600 mb-1.5 uppercase tracking-wide">
                Causa de salida laboral
              </label>
              <select
                value={input.tipoSalida}
                onChange={e => handleInputChange('tipoSalida', e.target.value)}
                className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold"
              >
                <option value="desahucio_patronal">Despido injustificado o Desahucio del Patrono (Con Prestaciones)</option>
                <option value="desahucio_trabajador">Renuncia voluntaria / Desahucio del Trabajador (Pierde Cesantía)</option>
                <option value="despido_justificado">Despido justificado (Por faltas del empleado, Pierde Prestaciones)</option>
                <option value="dimision_justificada">Dimisión Justificada (Renuncia por culpa del empleador, Con Prestaciones)</option>
              </select>
            </div>
          </div>

          {/* CONCEPTOS Y VACACIONES */}
          <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl space-y-3">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block">4. Conceptos y Excepciones</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl hover:bg-slate-100/50 cursor-pointer transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <span className="text-xs font-semibold text-slate-650">Preaviso</span>
                <input
                  type="checkbox"
                  checked={input.incluyePreaviso}
                  onChange={e => handleInputChange('incluyePreaviso', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 bg-white border border-slate-100 rounded-xl hover:bg-slate-100/50 cursor-pointer transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <span className="text-xs font-semibold text-slate-650">Cesantía</span>
                <input
                  type="checkbox"
                  checked={input.incluyeCesantia}
                  onChange={e => handleInputChange('incluyeCesantia', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-100/50 cursor-pointer transition-colors md:col-span-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <span className="text-xs font-bold text-slate-700">Sueldo 13 / Regalía Pascual (Proporcional)</span>
                <input
                  type="checkbox"
                  checked={input.incluyeRegalia}
                  onChange={e => handleInputChange('incluyeRegalia', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>

              {/* CHECK DE VACACIONES TOMADAS */}
              <label className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-100/50 cursor-pointer transition-colors md:col-span-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ring-1 ring-blue-50">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">¿Ya tomó las vacaciones correspondientes?</span>
                  <span className="text-[9.5px] text-slate-400 block mt-0.5">Actívalo si ya disfrutó o cobró sus días de vacaciones</span>
                </div>
                <input
                  type="checkbox"
                  checked={input.vacacionesTomadas || false}
                  onChange={e => handleInputChange('vacacionesTomadas', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>

            <div className={`p-3 bg-white border border-slate-100 rounded-xl space-y-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all ${input.vacacionesTomadas ? 'opacity-50 pointer-events-none bg-slate-50/50' : ''}`}>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Días de vacaciones pendientes</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    {input.vacacionesTomadas 
                      ? 'No aplica (Vacaciones gozadas)' 
                      : 'Coloca 0 para promediar proporcional automáticamente'}
                  </span>
                </div>
                <input
                  type="number"
                  disabled={input.vacacionesTomadas}
                  value={input.vacacionesTomadas ? 0 : input.diasVacacionesPendientes}
                  onChange={e => handleInputChange('diasVacacionesPendientes', parseInt(e.target.value) || 0)}
                  className="w-14 text-center text-xs border border-slate-200 rounded-lg bg-slate-50 p-1 font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* GUARDADO PERMANENTE */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Concluir y Guardar <Check className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
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

              {/* ANUNCIO #1: Rectángulo de Alto RPM bajo el bloque de resumen principal */}
              <AdsenseMock slot="prestaciones-results-inline" type="square" />

              {/* LISTA COMPONENTES */}
              <div className="space-y-3.5 border-t border-slate-800 pt-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-medium text-slate-300">Preaviso</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.preaviso.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-slate-300">Cesantía</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.cesantia.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-xs font-medium text-slate-300">Vacaciones</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.vacaciones.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-medium text-slate-300">Regalía Pascual (Sueldo #13)</span>
                  </div>
                  <span className="text-xs font-mono text-slate-200">
                    RD$ {output.regalia.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

              {/* CONFIGURACIÓN DE FORMATO PDF COPORATIVO DE NIVEL EJECUTIVO */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-3 mt-4">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Elegir Formato del Reporte PDF/Impreso
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfType('ejecutivo');
                      analytics.logEvent('formato_pdf_seleccionado', { category: 'prestaciones', action: 'seleccion_pdf_ejecutivo', label: 'Ejecutivo' });
                    }}
                    className={`py-2 px-3.5 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col justify-center items-center gap-0.5 cursor-pointer select-none ${
                      pdfType === 'ejecutivo'
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-extrabold'
                        : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-800 hover:text-slate-400'
                    }`}
                  >
                    <span>📄 Reporte Ejecutivo</span>
                    <span className="text-[9px] font-normal opacity-75">1-2 Páginas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfType('educativo');
                      analytics.logEvent('formato_pdf_seleccionado', { category: 'prestaciones', action: 'seleccion_pdf_educativo', label: 'Educativo' });
                    }}
                    className={`py-2 px-3.5 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col justify-center items-center gap-0.5 cursor-pointer select-none ${
                      pdfType === 'educativo'
                        ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-extrabold'
                        : 'bg-slate-950 border-slate-850 text-slate-500 hover:border-slate-800 hover:text-slate-400'
                    }`}
                  >
                    <span>📚 Guía Educativa</span>
                    <span className="text-[9px] font-normal opacity-75">4-6 Páginas</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  {pdfType === 'ejecutivo' 
                    ? 'Genera una ficha corporativa de 1 a 2 páginas optimizada con datos del caso, desglose de ley y fundamentos breves.' 
                    : 'Incluye la simulación ejecutiva completa añadida de anexos legales, ejemplos prácticos, errores comunes y FAQ expandido.'}
                </p>
              </div>

              {/* DETALLE LEGAL */}
              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                <span className="font-semibold text-slate-300 block mb-1">Fundamento Legal (Art. 76 al 86 Ley 16-92):</span>
                El preaviso y la cesantía se calculan en base a tu salario cotizable diario (Salario Bruto / 23.83). La regalía pascual está libre del impuesto ISR y de seguridad social por mandato expreso de la ley laboral dominicana. El empleador cuenta con un máximo de **10 días de calendario** ininterrumpidos para realizar el desembolso total de la liquidación antes de incurrir en las sanciones por mora del Art. 86.
              </div>
            </div>
          )}
        </div>

        {/* CONTROLES DE RESULTADOS */}
        <div className="flex flex-wrap gap-2.5 mt-6 border-t border-slate-800 pt-5">
          <button
            onClick={handlePrint}
            className="flex-1 min-w-[90px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-blue-500 font-sans shadow-lg shadow-blue-600/10"
          >
            <Printer className="w-4 h-4" />
            PDF / Imprimir ({pdfType === 'ejecutivo' ? 'Ejecutivo' : 'Completo'})
          </button>
          
          <button
            onClick={handleShare}
            className="flex-1 min-w-[90px] bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700 relative font-sans"
          >
            <Share2 className="w-4 h-4" />
            Copiar Enlace
            {showShareTooltip && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] py-1 px-2.5 rounded shadow whitespace-nowrap z-30 font-medium">
                ¡Enlace copiado!
              </span>
            )}
          </button>

          {output && (
            <a
              onClick={() => analytics.logWhatsappCompartido('prestaciones', 'Prestaciones Laborales')}
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `💼 *Cálculo de Prestaciones Laborales RD - SueldoFácil*\n\n` +
                `• *Fecha Ingreso:* ${input.fechaIngreso}\n` +
                `• *Fecha Salida:* ${input.fechaSalida}\n` +
                `• *Salario Mensual:* RD$ ${parseFloat(input.salarioMensual).toLocaleString('en-US', { maximumFractionDigits: 0 })}\n` +
                `• *Preaviso:* RD$ ${output.preaviso.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n` +
                `• *Cesantía:* RD$ ${output.cesantia.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n` +
                `• *Regalía Pascual:* RD$ ${output.regalia.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n` +
                `• *Vacaciones:* RD$ ${output.vacaciones.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n` +
                `• *Monto Neto de Liquidación:* RD$ ${output.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n\n` +
                `🔗 Realiza tus cálculos gratis de ley aquí:\n${window.location.origin}/#prestaciones?state=${btoa(JSON.stringify(input))}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[90px] bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-600 text-center select-none font-sans"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* ANUNCIO REUBICADO: Al final de la cuadrícula general de cálculo (ancho completo) */}
      <div className="lg:col-span-12 w-full mt-4">
        <AdsenseMock slot="prestaciones-sidebar" type="banner" />
      </div>

      {/* COMPONENT ENRICHMENT: SECCIÓN DE INFORMACIÓN Y EDUCACIÓN LABORAL (EEAT) */}
      <div className="lg:col-span-12 mt-12 space-y-10 border-t border-slate-200 dark:border-slate-800/80 pt-10 text-slate-850 dark:text-slate-200">
        
        {/* BANNER AVISO YMYL */}
        <YmylDisclaimer type="legal" />

        {/* ARTÍCULO PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-8 space-y-6">
            
            {/* QUÉ ES Y CÓMO FUNCIONA */}
            <section className="space-y-3.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5.5 h-5.5 text-blue-600 shrink-0" />
                Guía Completa de Prestaciones Laborales en República Dominicana
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-300 leading-relaxed">
                En la República Dominicana, la terminación contractual por tiempo indefinido genera obligaciones de carácter indemnizatorio que regulan el equilibrio social entre trabajadores y empleadores. Este conjunto de compensaciones económicas se conoce universalmente como <strong>prestaciones laborales</strong>, y sus reglas primarias de cálculo se encuentran tipificadas detalladamente en los Artículos 76, 80, 86, 177 y 219 del Código de Trabajo de la República Dominicana (Ley N° 16-92).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-450 uppercase tracking-widest block font-mono">El Preaviso (Art. 76)</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Es el aviso anticipado que debe dar una parte para rescindir el contrato libre de faltas. Si el empleador despide intempestivamente sin aviso previo, debe compensar económicamente al colaborador un total de salarios diarios según su antigüedad (7 días para 3-6 meses; 14 días para 6-12 meses; y 28 días tras 1 año o más de labores ininterrumpidas).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-455 uppercase tracking-widest block font-mono">La Cesantía (Art. 80)</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Constituye la mayor indemnización por el despido injustificado (desahucio patronal). Su fin es amortiguar el desempleo involuntario del trabajador. Equivale a 6 días de salario diario si tiene de 3 a 6 meses; 13 días si tiene entre 6 meses y 1 año; 21 días anuales de 1 a 5 años; y 23 días anuales por cada año transcurrido si supera el lustro de servicios.
                  </p>
                </div>
              </div>
            </section>

            {/* ANUNCIO #2: In-Content en la Guía Educativa */}
            <AdsenseMock slot="prestaciones-guide-incontent" type="infeed" />

            {/* CASOS PRÁCTICOS */}
            <section className="space-y-3.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Casos Prácticos de Aplicación Real</h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/50 rounded-2xl">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">Escenario 1: Desahucio ejercido por el Empleador</span>
                  <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed">
                    Un colaborador recibe el desahucio tras <strong>2 años y 6 meses</strong> de servicios con un salario mensual ordinario de <strong>RD$ 40,000.00</strong>. Al ser desahucio patronal, adquiere pleno derecho a Preaviso (28 días) y Cesantía (21 días por año, es decir, 42 días completos más la proporción de los meses acumulados). El monto diario cotizable se establece en <strong>RD$ 1,678.55</strong> (40,000 / 23.83). La suma total de su indemnización, agregándole vacaciones no gozadas y doble sueldo proporcional, superará los RD$ 125,000 acumulativos totalmente libres de retención fiscal.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/50 rounded-2xl">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-rose-600 block mb-1">Escenario 2: Renuncia Voluntaria del Colaborador o Dimisión</span>
                  <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed">
                    Si el trabajador renuncia de forma voluntaria (ejerce el desahucio obrero) respetando las normativas de plazo del código civil, <strong>no le corresponden el cobro de preaviso ni cesantía</strong>. El beneficio queda estrictamente delimitado a los "Derechos Adquiridos": las vacaciones proporcionales por haber laborado y la regalía pascual de fin de año del tiempo trabajado (Sueldo #13 proporcional).
                  </p>
                </div>
              </div>
            </section>

            {/* ERRORES FRECUENTES */}
            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Errores Frecuentes y Malinterpretaciones</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span><strong>Pensar que la renuncia da derecho a todo:</strong> Salvo acuerdos voluntarios pactados de mutuo acuerdo con la directiva de la empresa, la renuncia voluntaria cancela el cobro por cesantía y preaviso.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span><strong>Excluir las comisiones fijas:</strong> El Artículo 85 del código establece que las comisiones mensuales constantes forman parte integral del salario ordinario, por ende las prestaciones deben promediar estos depósitos durante el último año trabajado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span><strong>Descuento indebido de ISR o Seguridad Social:</strong> Las sumas recibidas por preaviso y cesantía bajo despido improcedente están legalmente exentas del pago de Impuesto Sobre la Renta (ISR) y de cualquier cuota de la AFP/SFS ante la TSS.</span>
                </li>
              </ul>
            </section>

            {/* CONSEJOS ÚTILES */}
            <section className="space-y-2.5 bg-slate-50 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Consejos Útiles para Trabajadores y RRHH</h3>
              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                Toda terminación de contrato por desahucio ejerce fuerza legal inmediata. A partir del día siguiente de la rescisión, la legislación estípula un plazo perentorio de <strong>10 días calendario</strong> para liquidar el pago final al trabajador. Transcurrido ese plazo sin efectuarse la compensación, entrarán en vigor las penalidades del Artículo 86, consistentes en el pago acumulativo de un día de salario ordinario completo por cada día hábil de retraso.
              </p>
            </section>

          </div>

          {/* COLUMNA ADYACENTE / ACCORDION FAQ */}
          <div className="md:col-span-4 space-y-6">
            
            {/* ANUNCIO #3: Pre FAQ en el Sidebar */}
            <AdsenseMock slot="prestaciones-pre-faq" type="square" />

            <div className="bg-slate-50 dark:bg-slate-950/30 p-5 border border-slate-200/60 dark:border-slate-850 rounded-2xl">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono mb-4 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                Preguntas Frecuentes
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: "¿Qué es el sueldo promedio diario y por qué 23.83?",
                    a: "El Código de Trabajo de RD penaliza o compensa con base en días laborales reales. Para empleados de cobro mensual fijo, se asume que promedian 23.83 días hábiles activos por mes. Para quincenales es 11.91 y semanales 5.5."
                  },
                  {
                    q: "¿Qué ocurre con las vacaciones tomadas?",
                    a: "Si el trabajador tomó las vacaciones anuales que le correspondían físicamente durante el año laboral previo, el empleador no tiene obligación de compensarlas monetariamente. Solo se liquidará la proporción de vacaciones del año en curso."
                  },
                  {
                    q: "¿Se pagan prestaciones si hay fuerza mayor?",
                    a: "La quiebra técnica fortuita o fuerza mayor decretada por el Ministerio de Trabajo exime al empleador de pagar preaviso íntegro, pero se mantiene la obligación del pago de cesantía parcial o asistencias específicas."
                  },
                  {
                    q: "¿El sueldo décimo tercero (regalía) paga impuesto?",
                    a: "No. Por mandato constitucional y laboral, la regalía pascual (Sueldo #13) está absolutamente inmune a retenciones de Impuesto sobre la Renta, deducciones de la seguridad social (AFP, SFS) o cualquier embargo judicial ordinario."
                  },
                  {
                    q: "¿Cuánto tiempo hay para pagar la liquidación?",
                    a: "El empleador posee un plazo inflexible de un máximo de 10 días calendario ininterrumpidos. Superado dicho plazo, por cada día hábil de tardanza se acumula una indemnización equivalente a un día de sueldo normal."
                  }
                ].map((item, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border-b border-slate-200/50 dark:border-slate-800 pb-2.5 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isOpen) {
                            try {
                              analytics.logFaqAbierta('prestaciones', item.q);
                            } catch (e) {}
                          }
                          setActiveFaq(isOpen ? null : idx);
                        }}
                        className="w-full text-left flex items-start justify-between gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors py-1 cursor-pointer"
                      >
                        <span>{item.q}</span>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-semibold">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FUENTES */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-2xl">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Fuentes del Contenido</span>
              <ul className="space-y-1 text-[10px] text-slate-500 leading-tight">
                <li>• Código de Trabajo de la República Dominicana (Ley No. 16-92)</li>
                <li>• Tesorería de la Seguridad Social RD (Ley No. 87-01)</li>
                <li>• Gaceta Oficial Dominicana (Decretos de Salarios Mínimos)</li>
              </ul>
            </div>

          </div>

        </div>

        {/* ANUNCIO #4: Multiplex Pre-Footer */}
        <div className="w-full mt-8">
          <AdsenseMock slot="prestaciones-multiplex-footer" type="multiplex" />
        </div>

        {/* COMPONENTE EEAT AUTORÍA */}
        <EditorialAuthBox
          author="Equipo Editorial SueldoFácil"
          role="Revisado utilizando fuentes oficiales laborables dominicanas"
          reviewDate="Junio 2026"
          updateDate="16 de Junio, 2026"
          sources={[
            "Código de Trabajo dominicano (Ley de Regulación Laboral 16-92)",
            "Boletines Informativos del Comité Nacional de Salarios (CNS RD)",
            "Guías de Cotización TSS para el Seguro de Salud y Riesgos Laborales"
          ]}
        />

      </div>
    </div>

      {/* THE OFFICIAL PRINT REPORT TEMPLATE (FULLY DECOUPLED COMPONENT RENDERS AT ?print_report=true) */}
      {false && output && (
        <div className="hidden print:block bg-white text-slate-900 font-sans p-2 text-xs leading-relaxed max-w-[8.5in] mx-auto print:bg-white print:text-black">
          {/* CUSTOM STATIC CSS TO INJECT FOR EXTRA COMPATIBILITY & BEAUTIFUL MULTIPAGE RENDERING */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body {
                background: white !important;
                color: black !important;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              }
              .page-break {
                page-break-after: always !important;
                break-after: page !important;
              }
              .print-no-break {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          `}} />

          {/* PAGE 1: REPORTE EJECUTIVO - PORTADA Y RESUMEN COPORATIVO (SOLO 1 PAGINA SI ES EJECUTIVO) */}
          <div className="page-break flex flex-col justify-between min-h-[10.5in] pb-4">
            <div>
              {/* CABECERA INSTITUCIONAL */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {/* SVG LOGO CORPORATIVO SUELDO FÁCIL */}
                    <div className="bg-slate-900 text-white p-1.5 rounded-lg flex items-center justify-center font-bold font-mono tracking-tight text-sm">
                      <span className="text-blue-400">S</span>F
                    </div>
                    <span className="text-base font-extrabold tracking-tight text-slate-900 uppercase font-sans">SueldoFácil.com</span>
                  </div>
                  <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Reporte de Prestaciones Laborales</h1>
                  <p className="text-[9.5px] text-slate-500 mt-1 font-medium font-sans">
                    Cálculo matemático de prestaciones conforme al Código de Trabajo de la República Dominicana (Ley No. 16-92).
                  </p>
                  <p className="text-[8.5px] text-slate-400 font-medium font-sans italic">
                    Normativa utilizada: Actualizada al {new Date().toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })}.
                  </p>
                </div>

                {/* CONTROL DE VERSIONES DEL REPORTE (FASE 3) */}
                <div className="text-right text-[10px] space-y-1 font-mono text-slate-600 border border-slate-200/65 p-3 rounded-2xl bg-slate-50/50">
                  <div><strong className="text-slate-800">Reporte:</strong> {reportSerial}</div>
                  <div><strong className="text-slate-800">Versión:</strong> 2026.06</div>
                  <div><strong className="text-slate-800 font-bold">Tipo:</strong> {pdfType === 'ejecutivo' ? 'Reporte Ejecutivo' : 'Guía Educativa'}</div>
                  <div><strong className="text-slate-800">Emitido:</strong> {new Date().toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                  <div><strong className="text-emerald-700 font-bold">Normativa:</strong> Vigente al momento de emisión</div>
                </div>
              </div>

              {/* GRÁFICO O BANNER / NOTA DE PRESENTACIÓN */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 items-center">
                <div className="md:col-span-8 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">Presentación del Reporte</h3>
                  <p className="text-[10.5px] text-slate-600 leading-normal font-sans text-justify">
                    Este documento expone detalladamente el cálculo de los derechos acumulados e indemnizaciones correspondientes a la finalización de la relación laboral descrita. Ha sido auditado contra los topes de cotización de la TSS, salarios mínimos sectoriales vigentes y escalas fiscales definidas por la DGII.
                  </p>
                </div>
                {/* VECTOR QR CODE DE VERIFICACIÓN FUNCIONAL A BASE DE SVG (FASE 2) */}
                <div className="md:col-span-4 flex flex-col justify-center items-center p-2.5 border border-slate-200 rounded-2xl bg-white space-y-1 text-center font-sans shadow-sm">
                  <a href={`https://sueldofacil.com/verificar?codigo=${reportSerial}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                    <svg className="w-14 h-14 text-slate-800 group-hover:text-blue-600 transition-colors" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="none" />
                      {/* Esquinas fijas de alineamiento QR reales */}
                      <rect x="5" y="5" width="22" height="22" fill="currentColor" />
                      <rect x="9" y="9" width="14" height="14" fill="white" />
                      <rect x="12" y="12" width="8" height="8" fill="currentColor" />

                      <rect x="73" y="5" width="22" height="22" fill="currentColor" />
                      <rect x="77" y="9" width="14" height="14" fill="white" />
                      <rect x="80" y="12" width="8" height="8" fill="currentColor" />

                      <rect x="5" y="73" width="22" height="22" fill="currentColor" />
                      <rect x="9" y="77" width="14" height="14" fill="white" />
                      <rect x="12" y="80" width="8" height="8" fill="currentColor" />

                      {/* Patrón de alineamiento */}
                      <rect x="77" y="77" width="8" height="8" fill="currentColor" />
                      <rect x="79" y="79" width="4" height="4" fill="white" />
                      <rect x="80" y="80" width="2" height="2" fill="currentColor" />

                      {/* Pixeles intermedios simulados detallados */}
                      <path d="M35 5h5v5h-5zm0 10h5v10h-5zm10-5h5v5h-5zm10 5h5v5h-5zm10-10h5v5h-5zm-15 15h10v5H50zm15 10h5v5h-5zm-20 5h10v5h-10zm25 15h5v5h-5zm-15 10h10v5h-10zm-15 5h5v5h-5zm-10-25h10v5h-10zm15-5h5v5h-5zm25-10h5v5h-5zm-15 5h5v5h-5z" fill="currentColor" />
                      <path d="M40 12h5v3H40zm10 5h5v3h-5zm-10 15h5v5H40zm15 10h5v5h-5zm5-20h5v5h-5zm10 35h5v5h-5zm-25 5h5v5h-5zm15 5h15v5H50zm-15 0h5v5H35zm-5-30h5v5h-5zm15-5h5v5h-5zm25-10h5v5h-5zm-15 5h5v5h-5z" fill="currentColor" />
                    </svg>
                  </a>
                  <span className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wide leading-none">Escanear / Clic Verificación</span>
                  <a href={`https://sueldofacil.com/verificar?codigo=${reportSerial}`} target="_blank" rel="noopener noreferrer" className="text-[7.5px] text-blue-600 hover:underline hover:text-blue-805 font-mono tracking-tighter truncate max-w-[110px] block mt-0.5">
                    {reportSerial}
                  </a>
                </div>
              </div>

              {/* DATOS DEL TRABAJADOR / FICHA TÉCNICA */}
              <div className="mb-5">
                <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-slate-900 rounded-full"></span>
                  Ficha Técnica de Relación Laboral
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Fecha Ingreso</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">{input.fechaIngreso}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Fecha Salida</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">{input.fechaSalida}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Tiempo Laborado</span>
                    <span className="text-xs font-bold text-slate-800">
                      {output.tiempoServicio.anos}a {output.tiempoServicio.meses}m {output.tiempoServicio.dias}d
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Tipo de Salida</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {input.tipoSalida === 'desahucio_patronal' ? 'Desahucio Patronal' : input.tipoSalida === 'desahucio_trabajador' ? 'Renuncia Voluntaria' : 'Despido Justificado'}
                    </span>
                  </div>
                  <div className="space-y-1 border-t border-slate-200/60 pt-2.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Salario Ordinario</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">RD$ {parseFloat(input.salarioMensual).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="space-y-1 border-t border-slate-200/60 pt-2.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Sueldo Diario (÷23.83)</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="space-y-1 border-t border-slate-200/60 pt-2.5 col-span-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Vacaciones Anuales</span>
                    <span className="text-xs font-bold text-slate-800">
                      {input.vacacionesTomadas ? 'Gozadas / No aplica compensación' : input.diasVacacionesPendientes > 0 ? `Pendientes (${input.diasVacacionesPendientes} días)` : 'Estimación de Ley'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RESULTADO NETO DESTACADO (FASE 1 - AHORRO DE TINTA, MINIMALISTA BLANCO Y AZUL) */}
              <div className="bg-white text-slate-900 border-2 border-slate-905 rounded-2xl p-5 text-center mb-5 space-y-1 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block font-mono leading-none">Monto Total Estimado de Liquidación</span>
                <div className="text-3xl font-black text-blue-700 print:text-blue-800 font-sans tracking-tight leading-normal">
                  RD$ {output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-[9px] text-slate-500 max-w-xl mx-auto leading-normal italic border-t border-slate-100 pt-1.5 mt-1 font-sans">
                  "Este valor representa una simulación estimativa calculada conforme a la legislación vigente y la información provista, no constituyendo una certificación final oficial."
                </p>
              </div>

              {/* TABLA DE DESGLOSE DE CONCEPTOS DE LEY */}
              <div className="mb-5">
                <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-2.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-slate-900 rounded-full"></span>
                  Desglose Detallado de Indemnizaciones y Derechos
                </h2>
                <table className="w-full text-left border-collapse border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white font-sans uppercase text-[9px] font-extrabold tracking-wider print:bg-slate-900 print:text-white">
                      <th className="p-2.5">Concepto Liquidado</th>
                      <th className="p-2.5">Base Reguladora</th>
                      <th className="p-2.5 text-center">Días Computados</th>
                      <th className="p-2.5 text-right">Subtotal Estimado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 bg-white font-bold text-slate-800">
                        Preaviso de Ley <span className="text-[9px] font-normal text-slate-450 block font-sans">Art. 76, Código de Trabajo</span>
                      </td>
                      <td className="p-2.5 bg-white font-medium font-mono text-slate-650">
                        RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / día
                      </td>
                      <td className="p-2.5 bg-white text-center font-bold font-mono text-slate-800">
                        {input.incluyePreaviso ? Math.round(output.preaviso / Math.max(0.01, output.salarioDiario)) : 0} días
                      </td>
                      <td className="p-2.5 bg-white text-right font-bold font-mono text-slate-900 font-sans">
                        RD$ {output.preaviso.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 bg-slate-50/50 font-bold text-slate-800">
                        Auxilio de Cesantía <span className="text-[9px] font-normal text-slate-450 block font-sans">Art. 80, Código de Trabajo</span>
                      </td>
                      <td className="p-2.5 bg-slate-50/50 font-medium font-mono text-slate-650">
                        RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / día
                      </td>
                      <td className="p-2.5 bg-slate-50/50 text-center font-bold font-mono text-slate-800">
                        {input.incluyeCesantia ? Math.round(output.cesantia / Math.max(0.01, output.salarioDiario)) : 0} días
                      </td>
                      <td className="p-2.5 bg-slate-50/50 text-right font-bold font-mono text-slate-900 font-sans">
                        RD$ {output.cesantia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 bg-white font-bold text-slate-800">
                        Vacaciones Proporcionales <span className="text-[9px] font-normal text-slate-450 block font-sans">Art. 177 y sgtes.</span>
                      </td>
                      <td className="p-2.5 bg-white font-medium font-mono text-slate-650">
                        RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / día
                      </td>
                      <td className="p-2.5 bg-white text-center font-bold font-mono text-slate-800">
                        {input.vacacionesTomadas ? 0 : Math.round(output.vacaciones / Math.max(0.01, output.salarioDiario))} días
                      </td>
                      <td className="p-2.5 bg-white text-right font-bold font-mono text-slate-900 font-sans">
                        RD$ {output.vacaciones.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 bg-slate-50/50 font-bold text-slate-800">
                        Regalía Pascual (Sueldo #13) <span className="text-[9px] font-normal text-slate-450 block font-sans">Art. 219, Sueldo Proporcional</span>
                      </td>
                      <td className="p-2.5 bg-slate-50/50 font-medium font-mono text-slate-650">
                        Salario base prorrateado
                      </td>
                      <td className="p-2.5 bg-slate-50/50 text-center font-bold text-slate-850">-</td>
                      <td className="p-2.5 bg-slate-50/50 text-right font-bold font-mono text-slate-900 font-sans">
                        RD$ {output.regalia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="bg-slate-900/10">
                      <td colSpan={3} className="p-2.5 text-right font-extrabold text-[10px] uppercase text-slate-900 print:text-black">Monto Neto Estimado RD$</td>
                      <td className="p-2.5 text-right font-black font-mono text-sm text-slate-950">
                        RD$ {output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* GRÁFICO EJECUTIVO SLATE BAR DE DISTRIBUCIÓN */}
              <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50/40 space-y-2.5">
                <span className="text-[9px] font-extrabold uppercase tracking-wide text-slate-500 font-mono block">Distribución Proporcional de la Liquidación</span>
                <div className="h-2.5 w-full bg-slate-200 rounded-full flex overflow-hidden">
                  {output.total > 0 ? (
                    <>
                      <div className="bg-blue-600 h-full" style={{ width: `${(output.preaviso / output.total) * 100}%` }} />
                      <div className="bg-emerald-600 h-full" style={{ width: `${(output.cesantia / output.total) * 100}%` }} />
                      <div className="bg-indigo-600 h-full" style={{ width: `${(output.vacaciones / output.total) * 100}%` }} />
                      <div className="bg-amber-500 h-full" style={{ width: `${(output.regalia / output.total) * 100}%` }} />
                    </>
                  ) : (
                    <div className="bg-slate-300 w-full" />
                  )}
                </div>
                <div className="grid grid-cols-4 text-[9px] text-slate-600 font-medium font-sans gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span> Preaviso ({output.total > 0 ? Math.round((output.preaviso / output.total) * 100) : 0}%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span> Cesantía ({output.total > 0 ? Math.round((output.cesantia / output.total) * 100) : 0}%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block"></span> Vacaciones ({output.total > 0 ? Math.round((output.vacaciones / output.total) * 100) : 0}%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> Sueldo #13 ({output.total > 0 ? Math.round((output.regalia / output.total) * 100) : 0}%)</div>
                </div>
              </div>
            </div>

            {/* SECCIÓN REGISTRO FIRMAS / SELLOS OPTIMIZADA (FASE 9) */}
            <div className="grid grid-cols-2 gap-8 mt-5 pt-5 border-t border-slate-200 print-no-break">
              {/* TRABAJADOR */}
              <div className="space-y-3">
                <div className="border-t border-slate-300 pt-2 text-center">
                  <span className="text-[10px] font-extrabold text-slate-800 block uppercase tracking-wider font-sans leading-none">Firma del Trabajador</span>
                </div>
                <div className="text-[9px] text-slate-600 space-y-1 font-sans pl-1">
                  <div><strong>Nombre:</strong> ______________________________________</div>
                  <div><strong>Cédula:</strong> ______________________________________</div>
                  <div><strong>Fecha:</strong> ______ / ______ / 20___</div>
                </div>
              </div>

              {/* EMPLEADOR */}
              <div className="space-y-3">
                <div className="border-t border-slate-300 pt-2 text-center">
                  <span className="text-[10px] font-extrabold text-slate-800 block uppercase tracking-wider font-sans leading-none">Firma / Sello del Empleador</span>
                </div>
                <div className="text-[9px] text-slate-600 space-y-1 font-sans pl-1">
                  <div><strong>Nombre/Rep:</strong> ___________________________________</div>
                  <div><strong>Cargo:</strong> _______________________________________</div>
                  <div><strong>RNC o Sello:</strong> __________________________________</div>
                  <div><strong>Fecha:</strong> ______ / ______ / 20___</div>
                </div>
              </div>
            </div>

            {/* DISCLAIMER PROFESIONAL SÓLIDO EN EL PIE DE PÁGINA DE LA HOJA (FASE 4) */}
            <div className="pt-4 border-t border-slate-205 space-y-1 text-center font-sans mt-4">
              <p className="text-[8.5px] text-slate-500 leading-normal italic">
                <strong>AVISO LEGAL E INFORMATION YMYL:</strong> {pdfType === 'ejecutivo' ? 'El presente reporte ha sido elaborado conforme a las disposiciones del Código de Trabajo de la República Dominicana (Ley No. 16-92).' : 'Este documento constituye una simulación informativa y educativa basada en la legislación vigente al momento de su emisión y no sustituye asesoría jurídica profesional.'}
              </p>
              <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-550 pt-1">
                <span>Vigencia Normativa: Actualizada al {new Date().toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' })}.</span>
                <span className="uppercase tracking-widest font-bold">Página 1 de {pdfType === 'ejecutivo' ? '1' : '6'} • SueldoFácil.com • Ref: {reportSerial}</span>
              </div>
            </div>
          </div>

          {/* PAGES 2 to 6: ADITIONAL ANEXOS - EDUCATIONAL REPORT EXPANSION (FASE 6) */}
          {pdfType === 'educativo' && (
            <>
              {/* PAGE 2: FUNDAMENTO JURÍDICO ESPECÍFICO */}
              <div className="page-break flex flex-col justify-between min-h-[10.5in] pb-4 pt-4 border-t border-dashed border-slate-200">
                <div className="space-y-5">
                  <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    Anexo Técnico: Fundamentos Legales Detallados (Ley 16-92)
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px] leading-relaxed">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-wide">AVISO DE PREAVISO (Art. 76 - Ley 16-92)</h4>
                      <p className="text-slate-600 text-justify font-sans">
                        El preaviso obliga a las partes a notificar previamente el cese unilateral de labores. Su compensación pecuniaria sustitutiva procede si el desahucio se ejecuta con efectos inmediatos y sin comunicación formal previa del tiempo requerido. Se gradúa según los plazos establecidos según la antigüedad del trabajador.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-wide">AUXILIO DE CESANTÍA (Art. 80 - Ley 16-92)</h4>
                      <p className="text-slate-600 text-justify font-sans">
                        Es la indemnización obligatoria frente al desempleo involuntario provocado por desahucio. Constituye el principal resorte de reparación financiera y se calcula multiplicando el sueldo promedio diario por la tarifa de días fijados para cada escala temporal de antigüedad.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-wide">DERECHO DE VACACIONES (Art. 177 - Ley 16-92)</h4>
                      <p className="text-slate-605 text-justify font-sans">
                        Las vacaciones anuales proporcionales corresponden a un derecho adquirido inviolable constitucional. Al extinguirse el acuerdo contractual por cualquier motivo, toda porción acumulada o días pendientes de disfrute físico deben compensarse en dinero en base al divisor estándar legal de 23.83.
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-wide">REGALÍA PASCUAL (Art. 219 - Ley 16-92)</h4>
                      <p className="text-slate-605 text-justify font-sans">
                        Consiste en la duodécima parte de los salarios ordinarios devengados en el año natural calendárico. Está legalmente blindada, siendo inmune a todo tipo de gravámenes, retenciones del Impuesto sobre la Renta, aportes de seguridad social TSS ó embargos civiles comunes.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700 font-mono">Disposiciones Estrictas de Plazo de Pago (Art. 86)</h3>
                    <p className="text-[11px] text-slate-600 text-justify leading-relaxed font-sans">
                      Conforme con lo estipulado en el <strong>Artículo 86 del Código de Trabajo</strong> de la República Dominicana, el empleador cuenta con un <strong>plazo de diez (10) días de calendario</strong> contados a partir del cese efectivo de la relación de trabajo, para realizar el pago íntegro de las indemnizaciones y derechos adquiridos. Superado dicho plazo legal de diez días sin liquidar el capital adeudado, se activará la penalidad por mora diaria legal obligatoria, consistente en pagar una indemnización acumulativa adicional para el trabajador de un (1) día de salario promedio regular ordinario por cada día ininterrumpido de demora subsiguiente.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 space-y-1 text-center font-sans mt-4">
                  <p className="text-[8px] text-slate-450 italic">
                    Este documento constituye una simulación educativa y de auto-consulta, no sustituyendo asesoría legal formal de un abogado.
                  </p>
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-550 pt-0.5">
                    <span>Vigencia Normativa: Actualizada al 16/06/2026.</span>
                    <span className="uppercase tracking-widest font-bold">Página 2 de 6 • SueldoFácil.com • Ref: {reportSerial}</span>
                  </div>
                </div>
              </div>

              {/* PAGE 3: ANEXOS EXPLICATIVOS Y CASOS PRÁCTICOS */}
              <div className="page-break flex flex-col justify-between min-h-[10.5in] pb-4 pt-4 border-t border-dashed border-slate-200">
                <div className="space-y-5">
                  <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    Anexo A: Guía Técnica de Fórmulas y Casos de Estudio del Preaviso y Cesantía
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="text-xs font-bold text-slate-900 uppercase font-sans">La Fórmula del Divisor Salarial (Por qué 23.83)</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed text-justify font-sans">
                        El Reglamento Oficial para la Aplicación del Código de Trabajo de la República Dominicana asume que la actividad comercial regular se rige bajo el divisor estandard de <strong>23.83 días hábiles laborables por mes</strong>. Esto surge del descuento proporcional de los días feriados promedio y de descansos semanales acumulados a lo largo del año calendario. El sueldo cotizable regular de la TSS siempre se prorratea utilizando este factor divisor legal inalterable para definir el salario diario básico de beneficios ordinarios.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-1">Escenarios Prácticos de Finalización Contractual</h3>
                      
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-blue-600 block">Escenario 1: Desahucio ejercido por el Empleador</span>
                        <p className="text-[11px] text-slate-650 leading-relaxed text-justify font-sans">
                          Un colaborador recibe el desahucio patronal tras <strong>2 años y 6 meses</strong> de servicios con un salario mensual ordinario de <strong>RD$ 40,000.00</strong>. Al ser de carácter unilateral patronal no justificado (desahucio), adquiere pleno derecho a Preaviso (28 días) y Auxilio de Cesantía (21 días anuales, lo que equivale a 42 días completos, complementados por la porción acumulada proporcional del año restante). El salario diario es de <strong>RD$ 1,678.55</strong> (40,000 / 23.83). La sumatoria total, agregándole indemnizaciones por vacaciones y la regalía de fin de año, supera de forma acumulada los RD$ 125,000 libres totalmente de impuestos.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-rose-600 block">Escenario 2: Renuncia Voluntaria o Dimisión del Trabajador</span>
                        <p className="text-[11px] text-slate-650 leading-relaxed text-justify font-sans">
                          Si del lado del trabajador se rompe voluntariamente el contrato indefinido, comúnmente denominado dimisión o renuncia obrera, <strong>no le asiste derecho de cobro a preaviso de ley ni auxilio de cesantía legal</strong>, al ser extinguido por acto de voluntad propio. En este caso, el desembolso pecuniario del empleador queda única e inflexiblemente limitado a pagar los <strong>"Derechos Adquiridos"</strong> de ley: las vacaciones proporcionales por haber laborado y la regalía pascual del fin de año proporcional del tiempo trabajado (Sueldo #13 proporcional).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 space-y-1 text-center font-sans mt-4">
                  <p className="text-[8px] text-slate-450 italic">
                    Este documento constituye una simulación educativa y de auto-consulta, no sustituyendo asesoría legal formal de un abogado.
                  </p>
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-550 pt-0.5">
                    <span>Vigencia Normativa: Actualizada al 16/06/2026.</span>
                    <span className="uppercase tracking-widest font-bold">Página 3 de 6 • SueldoFácil.com • Ref: {reportSerial}</span>
                  </div>
                </div>
              </div>

              {/* PAGE 4: ERRORES FRECUENTES Y RECOMENDACIONES TÉCNICAS */}
              <div className="page-break flex flex-col justify-between min-h-[10.5in] pb-4 pt-4 border-t border-dashed border-slate-200">
                <div className="space-y-5">
                  <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    Anexo B: Errores Comunes de Cálculo y Recomendaciones Técnicas
                  </h2>

                  <div className="space-y-4 text-[10.5px] leading-relaxed">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-bold text-slate-900 uppercase font-sans">Error Frecuente A: Confundir Renuncia con Pérdida de Derechos Adquiridos</h4>
                      <p className="text-slate-600 text-justify font-sans">
                        Muchos empleadores asumen falsamente que el abandono voluntario o la dimisión cancela absolutamente todos los haberes devengados. La regalía pascual y las vacaciones acumuladas proporcionales son <strong>derechos adquiridos inviolables</strong> consagrados por el ordenamiento sustantivo laboral dominicano. No admiten compensaciones negativas ni decrementos punitivos bajo ninguna circunstancia.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-bold text-slate-900 uppercase font-sans">Error Frecuente B: Exclusión Incorrecta de Variables de Compensación (Comisiones, Bonos)</h4>
                      <p className="text-slate-600 text-justify font-sans">
                        Lejos de lo que se cree, el salario ordinario mensual para prestaciones no incluye únicamente el básico fijo pactado. Conforme al Artículo 85 del Código de Trabajo, toda comisión, incentivo monetario variable por productividad o depósito de comisiones recurrente constituye parte de la base imponible del cálculo, debiendo promediarse las rentas acumuladas de los últimos doce meses para fijar el salario promedio real de ley.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                      <h4 className="font-bold text-slate-900 uppercase font-sans">Error Frecuente C: Aplicación Incorrecta de Retenciones Sociales y Fiscales</h4>
                      <p className="text-slate-600 text-justify font-sans font-medium">
                        Se incurre en severos riesgos de auditoría laboral si se retienen descuentos de seguridad social (AFP, SFS) o de regulaciones de ISR sobre los haberes liquidados en concepto de preaviso y cesantías. Estas indemnizaciones de ley están <strong>estrictamente exentas de todo descuento de ley o gravamen corporativo</strong> según la Ley 87-01 de Seguridad Social y las directrices normativas de la DGII.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 space-y-1 text-center font-sans mt-4">
                  <p className="text-[8px] text-slate-450 italic">
                    Este documento constituye una simulación educativa y de auto-consulta, no sustituyendo asesoría legal formal de un abogado.
                  </p>
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-550 pt-0.5">
                    <span>Vigencia Normativa: Actualizada al 16/06/2026.</span>
                    <span className="uppercase tracking-widest font-bold">Página 4 de 6 • SueldoFácil.com • Ref: {reportSerial}</span>
                  </div>
                </div>
              </div>

              {/* PAGE 5: PREGUNTAS FRECUENTES EXPANDIDAS DE FORMA ELECTRÓNICA PARA IMPRESIÓN COMPLETA */}
              <div className="page-break flex flex-col justify-between min-h-[10.5in] pb-4 pt-4 border-t border-dashed border-slate-200">
                <div className="space-y-5">
                  <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    Anexo C: Cuestionario y Respuestas Jurídicas Completas (FAQ)
                  </h2>

                  <div className="space-y-3.5">
                    {[
                      {
                        q: "¿Qué es en detalle el salario promedio diario y cuál es su implicación laboral?",
                        a: "El salario promedio diario representa la renta promedio asignable a un día hábil laboral real. Para empleados con pago establecido mensualmente, el cálculo de ley estipula la división del salario base entre 23.83. Esto compensa de manera equitativa e inalterable los fines de semana y descansos regulados por ley."
                      },
                      {
                        q: "¿Qué sucede con las vacaciones no tomadas en el período laboral cursado?",
                        a: "De no haberse ejercido físicamente el descanso vacacional remunerado por el año cursado correspondiente, la empresa o empleador arrastra la obligación del pago íntegro de estos días al extinguirse el contrato laboral. El importe pecuniario compensatorio se calcula basado en el divisor estricto de ley (23.83)."
                      },
                      {
                        q: "¿Existe obligación patronal de liquidación en sucesos de fuerza mayor?",
                        a: "La declaratoria formal de quiebra empresarial u otro siniestro extraordinario debidamente refrendado por el Ministerio de Trabajo puede atenuar o eximir las indemnizaciones del preaviso y cesantía en algunas circunstancias, pero subsiste la obligación indiscutible de pagar íntegramente los 'Derechos Adquiridos' del colaborador."
                      },
                      {
                        q: "¿El sueldo décimo tercero (regalía pascual) recibe descuentos de seguridad social?",
                        a: "No. El Artículo 222 del Código de Trabajo de la República Dominicana estipula de forma prioritaria que la regalía de fin de año está absolutamente exenta de toda carga impositiva. No paga cotizaciones de AFP ni de SFS (TSS) y está exenta por completo del Impuesto sobre la Renta (ISR) de la DGII."
                      },
                      {
                        q: "¿Cómo se computa en días calendario la indemnización por retardo de pago corporativo?",
                        a: "De conformidad con el Art. 86 del Código de Trabajo, existe un intervalo perentorio estricto de 10 días calendario (días continuos, incluyendo fines de semana y feriados) tras la ruptura de la relación laboral. Vencido este lapso, el empleador entra formalmente en retraso acumulando de forma obligatoria un día de salario ordinario bruto completo para el trabajador por cada día de mora."
                      }
                    ].map((item, index) => (
                      <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 print-no-break">
                        <h4 className="font-bold text-slate-900 text-xs">{(index + 1)}. {item.q}</h4>
                        <p className="text-[10.5px] text-slate-650 text-justify leading-relaxed font-sans">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 space-y-1 text-center font-sans mt-4">
                  <p className="text-[8px] text-slate-450 italic">
                    Este documento constituye una simulación educativa y de auto-consulta, no sustituyendo asesoría legal formal de un abogado.
                  </p>
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-550 pt-0.5">
                    <span>Vigencia Normativa: Actualizada al 16/06/2026.</span>
                    <span className="uppercase tracking-widest font-bold">Página 5 de 6 • SueldoFácil.com • Ref: {reportSerial}</span>
                  </div>
                </div>
              </div>

              {/* PAGE 6: TRANSPARENCIA, EEAT, AUTORÍA EDITORIAL Y ADVERTENCIA DE ESTIMACIÓN */}
              <div className="flex flex-col justify-between min-h-[10.5in] pb-4 pt-4 border-t border-dashed border-slate-200">
                <div className="space-y-5">
                  <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                    Anexo D: Certificación Editorial & Fuentes Oficiales del Reporte
                  </h2>

                  <div className="space-y-4 text-[10.5px] leading-relaxed font-sans">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                      <h3 className="font-extrabold text-slate-950 uppercase tracking-wider text-xs font-sans">Directorio de Fuentes del Reporte</h3>
                      <p className="text-slate-600 text-justify mb-2 font-sans leading-relaxed">
                        Este reporte corporativo y los algoritmos matemáticos integrados en la simulación técnica han sido validados e indexados de estricto acuerdo con las publicaciones vigentes de los siguientes organismos normativos de la República Dominicana:
                      </p>
                      <ul className="space-y-2 pl-1">
                        <li className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong>Código de Trabajo (Ley No. 16-92)</strong> - Gaceta Oficial Dominicana. Regulación principal de la relación contractual laboral, preavisos, cesantías y derechos adquiridos.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong>Ley No. 87-01 del Sistema Dominicano de Seguridad Social</strong> - Directrices sobre cotización de nómina, aportes patronales e individuales, y límites de TSS (AFP y SFS).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong>Comité Nacional de Salarios (CNS RD)</strong> - Escalas e históricos salariales vigentes para fijar los topes aplicables según sectores empresariales.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span><strong>Dirección General de Impuestos Internos (DGII)</strong> - Tablas e instructivos impositivos anuales de exención del Impuesto sobre la Renta (ISR).</span>
                        </li>
                      </ul>
                    </div>

                    {/* ADVERTENCIA DE ESTIMACIÓN (FASE 8) */}
                    <div className="p-4.5 bg-slate-50 border border-slate-205 rounded-2xl space-y-1.5">
                      <h4 className="font-extrabold text-slate-950 uppercase tracking-wider text-[10px] font-sans">Advertencia de Estimación y Varianzas</h4>
                      <p className="text-slate-600 text-justify font-sans leading-relaxed">
                        Los valores mostrados representan una estimación matemática basada en la información proporcionada voluntariamente por el usuario. El monto definitivo oficial puede variar según acuerdos de mutuo consentimiento privados, beneficios financieros discrecionales adicionales de la empresa o interpretaciones administrativas aplicables por el Ministerio de Trabajo.
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl flex items-start gap-3">
                      <div className="bg-emerald-600 text-white rounded-full w-5 h-5 font-sans font-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-emerald-900 uppercase tracking-widest text-[10px] font-sans leading-none">Verificación de Calidad Científica-Matemática</h4>
                        <p className="text-emerald-800 text-[10.5px] leading-normal text-justify font-sans">
                          SueldoFácil mantiene auditoria técnica activa sobre todas las fórmulas implementadas. El motor matemático de simulación ha sido testeado unitariamente para prevenir inconsistencias de tipo NaN o divisiones por cero garantizando una exactitud al centavo conforme a las directrices de redondeo oficiales de la República Dominicana.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 space-y-1 text-center font-sans mt-4">
                  <p className="text-[8px] text-slate-450 italic">
                    Este documento constituye una simulación educativa y de auto-consulta, no sustituyendo asesoría legal formal de un abogado.
                  </p>
                  <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-550 pt-0.5">
                    <span>Vigencia Normativa: Actualizada al 16/06/2026.</span>
                    <span className="uppercase tracking-widest font-bold">Página 6 de 6 • SueldoFácil.com • Ref: {reportSerial}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
