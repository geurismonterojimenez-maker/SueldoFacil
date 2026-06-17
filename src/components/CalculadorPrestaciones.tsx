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
    window.print();
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">      {/* CARD IZQUIERDA: CONFIGURACION SIMPLIFICADA (TODO EN UNO) */}
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

              {/* DETALLE LEGAL */}
              <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                <span className="font-semibold text-slate-300 block mb-1">Fundamento Legal (Art. 76 al 86 Ley 16-92):</span>
                El preaviso y la cesantía se calculan en base a tu salario cotizable diario (Salario Bruto / 23.83). La regalía pascual está libre del impuesto ISR y de seguridad social por mandato expreso constitucional y laboral. El empleador cuenta con un máximo de 10 días laborables para realizar el desembolso total de la liquidación antes de generar el cobro por mora laboral diaria.
              </div>
            </div>
          )}
        </div>

        {/* CONTROLES DE RESULTADOS */}
        <div className="flex flex-wrap gap-2.5 mt-6 border-t border-slate-800 pt-5">
          <button
            onClick={handlePrint}
            className="flex-1 min-w-[90px] bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700 font-sans"
          >
            <Printer className="w-4 h-4" />
            PDF / Imprimir
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

        {/* COMPONENTE EEAT AUTORÍA */}
        <EditorialAuthBox
          author="Equipo Editorial SueldoFácil"
          role="Revisado utilizando fuentes oficiales laborables dominicanas"
          reviewDate="Junio 2026"
          updateDate="16 de Junio, 2026"
          sources={[
            "Código de Trabajo dominicano (Ley de Regulación Laboral 16-92)",
            "Boletines Informativos del Comité Nacional de Salarios (CNS RD)",
            "Guías de Cotización TSS para el Régimen Contributivo del Seguro Familiar de Salud"
          ]}
        />

      </div>
    </div>
  );
}
