import React, { useState, useEffect } from 'react';
import { SalarioInput, SalarioOutput } from '../types';
import { calcularSalarioNeto } from '../utils/calculator';
import { DollarSign, Printer, Share2, HelpCircle, Check, Info, ArrowUpRight, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import AdsenseMock from './AdsenseMock';
import YmylDisclaimer from './YmylDisclaimer';
import EditorialAuthBox from './EditorialAuthBox';
import { analytics } from '../utils/analytics';

interface Props {
  onSaveCalculation: (calc: { type: string; label: string; result: number; timestamp: string; details: any }) => void;
  initialState?: any;
  onAskSavingTips?: (netSalary: number) => void;
}

export default function CalculadorSueldoNeto({ onSaveCalculation, initialState, onAskSavingTips }: Props) {
  const [input, setInput] = useState<SalarioInput>(() => {
    const savedSalario = localStorage.getItem('sueldofacil_prof_salario') || '45000';
    return {
      salarioBruto: savedSalario,
      ingresosAdicionales: '0',
      percepcionISR: true
    };
  });
  const [output, setOutput] = useState<SalarioOutput | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    try {
      const result = calcularSalarioNeto(input);
      setOutput(result);
      if (result) {
        analytics.logCalculoRealizado('salario', 'Sueldo Neto');
      }
    } catch (e) {
      console.error(e);
      analytics.logErrorCalculo('salario', e instanceof Error ? e.message : 'Error de cálculo');
    }
  }, [input]);

  const handleInputChange = (field: keyof SalarioInput, value: string | boolean) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!output) return;
    analytics.logEvent('calculo_realizado', {
      category: 'salario',
      action: 'guardar_calculo',
      label: 'Guardar Sueldo Neto'
    });
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
      analytics.logResultadoCopiado('salario', 'Sueldo Neto');
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

            {/* TIPS DE AHORRO CON IA */}
            {onAskSavingTips && (
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-900/60 rounded-2xl p-4 mt-2 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="p-1 px-1.5 rounded bg-slate-800 text-xs">🤖</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">¿Quieres consejos para ahorrar?</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-snug">Obtén recomendaciones financieras y de inversión exclusivas para este nivel de ingresos.</p>
                  </div>
                </div>
                <button
                  onClick={() => onAskSavingTips(output.salarioNeto)}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center select-none cursor-pointer shadow-md border border-blue-500/20"
                >
                  Personalizar Tips de Ahorro con IA <ArrowUpRight className="w-3.5 h-3.5 text-blue-200" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 mt-6 border-t border-slate-800 pt-5">
          <button
            onClick={() => {
              analytics.logPdfDescargado('salario', 'Sueldo Neto');
              window.print();
            }}
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
              onClick={() => analytics.logWhatsappCompartido('salario', 'Sueldo Neto')}
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `💰 *Cálculo de Salario Neto RD - SueldoFácil*\n\n` +
                `• *Salario Bruto:* RD$ ${output.salarioBruto.toLocaleString('en-US', { maximumFractionDigits: 0 })}\n` +
                `• *Salario Neto Recibido:* RD$ ${output.salarioNeto.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n` +
                `• *Deducciones Totales:* RD$ ${output.retencionesTotales.toLocaleString('en-US', { maximumFractionDigits: 2 })}\n\n` +
                `🔗 Realiza tu cálculo de ley gratis aquí:\n${window.location.origin}/#salario?state=${btoa(JSON.stringify(input))}`
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

      {/* COMPONENT ENRICHMENT: SECCIÓN DE DETALLE TRIBUTARIO Y TSS EN RD (EEAT) */}
      <div className="lg:col-span-12 mt-12 space-y-10 border-t border-slate-200 dark:border-slate-800/80 pt-10 text-slate-850 dark:text-slate-200">
        
        {/* BANNER AVISO YMYL */}
        <YmylDisclaimer type="finanzas" />

        {/* ARTÍCULO PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-8 space-y-6">
            
            {/* QUÉ ES Y CÓMO FUNCIONA */}
            <section className="space-y-3.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5.5 h-5.5 text-blue-600 shrink-0" />
                Guía de Retenciones de Nómina y Salario Neto en República Dominicana
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-300 leading-relaxed">
                El cálculo definitivo de un <strong>salario neto</strong> en la República Dominicana implica una serie de deducciones obligatorias por ley. Lo que percibe un empleado formal en su cuenta de nómina mensual no equivale a su salario bruto total acordado en el contrato de trabajo, sino al sueldo resultante tras deducir las contribuciones al Sistema Dominicano de Seguridad Social (Ley 87-01) y las retenciones del Impuesto Sobre la Renta (ISR) que establece la Dirección General de Impuestos Internos (DGII).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-450 uppercase tracking-widest block font-mono">AFP (Pensiones)</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">2.87% del empleado</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Destinado a la Administradora de Fondos de Pensiones. El empleador aporta un 7.10% adicional por su cuenta ante la TSS.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-455 uppercase tracking-widest block font-mono">SFS (Seguro de Salud)</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">3.04% del empleado</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Aporte al Seguro Familiar de Salud. El empleador asume un 7.09% complementario de la cuota.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-900 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-455 uppercase tracking-widest block font-mono">ISR (Impuestos DGII)</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Hasta 25% excedente</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    Se calcula de forma progresiva según escalas vigentes únicamente tras restar las cuotas de AFP y SFS.
                  </p>
                </div>
              </div>
            </section>

            {/* CASOS PRÁCTICOS DE CÁLCULO */}
            <section className="space-y-3.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Casos Prácticos de Deducciones Reales</h3>
              
              <div className="space-y-3">
                <div className="p-4 bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/50 rounded-2xl">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">Ejemplo 1: Salario de RD$ 30,000.00 (Exento de ISR)</span>
                  <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed">
                    Un trabajador formal con sueldo de <strong>RD$ 30,000.00</strong> mensuales experimentará deducciones fijas de AFP (2.87% = RD$ 861.00) y SFS (3.04% = RD$ 912.00). Al restar estos conceptos de la TSS, se genera una base tributaria de <strong>RD$ 28,227.00</strong>. Al ser este monto inferior al Tramo I de exención de la DGII (RD$ 34,685.00), el empleado queda libre de pago de ISR. Su salario neto final depositado en su cuenta de ahorro será exactamente de <strong>RD$ 28,227.00</strong>.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/50 rounded-2xl">
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-rose-600 block mb-1">Ejemplo 2: Salario de RD$ 60,000.00 (Sujeto a ISR Escalonado)</span>
                  <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed">
                    Para un sueldo bruto de <strong>RD$ 60,000.00</strong>, la TSS deduce AFP (RD$ 1,722.00) y SFS (RD$ 1,824.00), lo que nos deja una base de <strong>RD$ 56,454.00</strong>. Este monto entra en la escala tributaria del <strong>Tramo III</strong> de la DGII (entre RD$ 52,027.43 y RD$ 72,260.25). Se aplica una retención fija de <strong>RD$ 2,601.36</strong> más el 20% sobre el excedente de RD$ 52,027.42. La retención final de ISR asciende a <strong>RD$ 3,486.68</strong>. Sumando seguridad social más impuestos, el sueldo neto definitivo será de <strong>RD$ 52,967.32</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* ERRORES FRECUENTES */}
            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Errores Frecuentes al Estimar tus Finanzas</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span><strong>Aplicar el ISR directamente al Salario Bruto:</strong> Este es el error más recurrente. La DGII solo calcula el tramo impositivo una vez que el empleador descuenta el 5.91% total de cotización médica de la TSS (AFP + SFS) al sueldo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span><strong>Desconocer los topes límites de cotización:</strong> El seguro familiar de salud (SFS) tiene un tope de cotización limitado a un máximo de 10 salarios mínimos estatales acumulados. AFP se limita a 20 salarios mínimos. Sueldos extremadamente altos no pagan el porcentaje directo lineal de su salario total.</span>
                </li>
              </ul>
            </section>

          </div>

          {/* COLUMNA ADYACENTE / ACCORDION FAQ */}
          <div className="md:col-span-4 space-y-6">
            
            <div className="bg-slate-50 dark:bg-slate-950/30 p-5 border border-slate-200/60 dark:border-slate-850 rounded-2xl">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-mono mb-4 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                Dudas de Retenciones
              </h3>

              <div className="space-y-3">
                {[
                  {
                    q: "¿Qué deducciones realiza la TSS al trabajador?",
                    a: "De forma mensual e ineludible, se te retiene un 2.87% del salario bruto cotizable para tu plan de AFP (pensiones) y un 3.04% para el SFS (salud)."
                  },
                  {
                    q: "¿Qué escalas de ISR aplican para 2026?",
                    a: "El primer tramo de exención es de RD$ 34,685.00 mensuales. El segundo tramo descuenta 15% del excedente, el tercero asume RD$ 2,601.36 más 20%, y el cuarto descuenta RD$ 6,647.92 más el 25%."
                  },
                  {
                    q: "¿La regalía pascual sufre retenciones de impuestos?",
                    a: "No. El código del trabajo asume protección integral al doble sueldo navideño, eximiéndolo de cualquier impuesto fiscal de la DGII o retención ordinaria de seguridad social."
                  },
                  {
                    q: "¿Qué ocurre si tengo varios empleadores?",
                    a: "Por ley, debes reportar el pluriempleo para evitar la duplicidad impositiva innecesaria, de modo que un único empleador designado acumule tu escala real de ISR mensual."
                  }
                ].map((item, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border-b border-slate-200/50 dark:border-slate-800 pb-2.5 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
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
            <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900 rounded-2xl font-mono text-[9.5px]">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2 font-sans">Bases Impositivas</span>
              <ul className="space-y-1 text-slate-500 leading-tight">
                <li>• Ley Orgánica de la Seguridad Social (87-01)</li>
                <li>• Código Tributario de la República Dominicana (Ley 11-92)</li>
                <li>• Circulares vigentes Dirección General de Impuestos Internos</li>
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
            "Código de Trabajo dominicano (Regulación Laboral 16-92)",
            "Boletines de Escala de Retención de ISR para personas físicas - DGII",
            "Monto tope imponible mensual estipulado por la TSS"
          ]}
        />

      </div>
    </div>
  );
}
