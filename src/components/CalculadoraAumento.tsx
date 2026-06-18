import React, { useState, useEffect } from 'react';
import { Sparkles, Calculator, Share2, Download, Check, RefreshCw, Info, ArrowUpRight, TrendingUp } from 'lucide-react';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

export default function CalculadoraAumento() {
  const [salarioActual, setSalarioActual] = useState('45000');
  const [porcentajeAumento, setPorcentajeAumento] = useState('15');
  const [aumentoFijo, setAumentoFijo] = useState('0');
  const [copiado, setCopiado] = useState(false);
  const [resultados, setResultados] = useState<any>(null);

  useEffect(() => {
    // Check if there is state embedded in URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('aumento-state=')) {
      try {
        const urlParams = new URLSearchParams(hash.split('?')[1] || hash.substring(1));
        const stateBase64 = urlParams.get('aumento-state');
        if (stateBase64) {
          const decoded = JSON.parse(atob(stateBase64));
          if (decoded.actual) setSalarioActual(decoded.actual);
          if (decoded.porcentaje) setPorcentajeAumento(decoded.porcentaje);
          if (decoded.fijo) setAumentoFijo(decoded.fijo);
        }
      } catch (e) {
        console.error("Error decoding share state", e);
      }
    }
  }, []);

  useEffect(() => {
    const actual = parseFloat(salarioActual) || 0;
    const porcFactor = (parseFloat(porcentajeAumento) || 0) / 100;
    const fijo = parseFloat(aumentoFijo) || 0;

    const aumentoSuma = (actual * porcFactor) + fijo;
    const nuevoBruto = Math.max(0, actual + aumentoSuma);

    // Calculate before vs after tax
    const calcActual = calcularSalarioNeto({ salarioBruto: actual.toString() });
    const calcNuevo = calcularSalarioNeto({ salarioBruto: nuevoBruto.toString() });

    setResultados({
      actualBruto: actual,
      nuevoBruto: nuevoBruto,
      incrementoBruto: nuevoBruto - actual,
      
      actualNeto: calcActual.salarioNeto,
      nuevoNeto: calcNuevo.salarioNeto,
      incrementoNeto: calcNuevo.salarioNeto - calcActual.salarioNeto,
      incrementoAnualNeto: (calcNuevo.salarioNeto - calcActual.salarioNeto) * 12,

      actualAfp: calcActual.afp,
      nuevoAfp: calcNuevo.afp,
      cambioAfp: calcNuevo.afp - calcActual.afp,

      actualSfs: calcActual.sfs,
      nuevoSfs: calcNuevo.sfs,
      cambioSfs: calcNuevo.sfs - calcActual.sfs,

      actualIsr: calcActual.isr,
      nuevoIsr: calcNuevo.isr,
      cambioIsr: calcNuevo.isr - calcActual.isr,
    });
  }, [salarioActual, porcentajeAumento, aumentoFijo]);

  const handleCompartir = () => {
    try {
      const state = btoa(JSON.stringify({
        actual: salarioActual,
        porcentaje: porcentajeAumento,
        fijo: aumentoFijo
      }));
      const shareUrl = `${window.location.origin}${window.location.pathname}#aumento_salarial?aumento-state=${state}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPDF = () => {
    if (!resultados) return;
    try {
      const token = 'SF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const hh = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      const ss = String(today.getSeconds()).padStart(2, '0');
      const reportSerial = `SF-AUM-${yyyy}${mm}${dd}-${hh}${min}${ss}-V2026`;

      sessionStorage.setItem(`sueldofacil_report_${token}`, JSON.stringify({
        input: {
          salarioActual,
          porcentajeAumento,
          aumentoFijo
        },
        output: resultados,
        reportSerial
      }));
      window.open(window.location.origin + window.location.pathname + `?print_report=true&type=aumento&token=${token}`, '_blank');
    } catch (e) {
      console.error("Error setting print calculations", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-1 print:p-0">
      
      {/* LEFT COLUMN: CALCULATOR OPTIONS */}
      <div className="lg:col-span-6 bg-white border border-slate-200/85 rounded-2xl p-6 shadow-sm space-y-6 print:border-none print:shadow-none">
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Simulador de Aumento de Sueldo
          </h2>
          <p className="text-xs text-slate-500">
            Analiza el impacto neto exacto de tu aumento considerando los impuestos legales dominicanos (TSS y tramos de ISR).
          </p>
        </div>

        <div className="space-y-4">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">Salario Mensual Actual Bruto (RD$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">RD$</span>
              <input
                type="number"
                value={salarioActual}
                onChange={e => setSalarioActual(e.target.value)}
                className="w-full bg-slate-50/75 border border-slate-200 focus:bg-white rounded-xl py-2.5 pl-11 pr-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
                placeholder="45000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">Aumento en Porcentaje (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={porcentajeAumento}
                  onChange={e => setPorcentajeAumento(e.target.value)}
                  className="w-full bg-slate-50/75 border border-slate-200 focus:bg-white rounded-xl py-2.5 pl-3 pr-8 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
                  placeholder="15"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">Aumento Fijo Sumado Opcional (RD$)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">RD$</span>
                <input
                  type="number"
                  value={aumentoFijo}
                  onChange={e => setAumentoFijo(e.target.value)}
                  className="w-full bg-slate-50/75 border border-slate-200 focus:bg-white rounded-xl py-2.5 pl-11 pr-3 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

        </div>

        {resultados && (
          <div className="pt-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Desglose de Impacto Mensual</span>
            <div className="space-y-2 text-xs font-semibold text-slate-650">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>AFP Pensiones (Incremento de descuento)</span>
                <span className="font-mono text-rose-500">+RD$ {resultados.cambioAfp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>SFS Salud Familiar (Incremento de descuento)</span>
                <span className="font-mono text-rose-500">+RD$ {resultados.cambioSfs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span>ISR Impuesto sobre la Renta (Cambio impositivo)</span>
                <span className="font-mono text-rose-500">+RD$ {resultados.cambioIsr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100 print:hidden">
          <button
            onClick={handleCompartir}
            className="flex-1 min-w-[130px] font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
          >
            {copiado ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            {copiado ? 'Enlace Copiado' : 'Compartir Simulación'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 min-w-[135px] font-bold text-xs bg-blue-600 hover:bg-blue-750 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none shadow-sm"
          >
            <Download className="w-4 h-4" />
            Descargar PDF / Imprimir
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: VISUAL DASHBOARD COMPARISON */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-md self-stretch flex flex-col justify-between min-h-[500px]">
        
        {resultados ? (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Antes vs Después del aumento</span>
              <div className="bg-emerald-950 text-emerald-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-emerald-800 font-semibold">
                Sueldo Neto +RD$ {Math.round(resultados.incrementoNeto).toLocaleString('en-US')}
              </div>
            </div>

            {/* TWIN CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Sueldo Neto Anterior</span>
                <p className="text-xl font-bold font-mono text-slate-400">RD$ {resultados.actualNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                <span className="text-[8px] text-slate-500 font-mono">Bruto: RD$ {resultados.actualBruto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-blue-900/40 space-y-1 relative">
                <div className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[9px] text-blue-400 uppercase font-bold block">Nuevo Sueldo Neto nuevo</span>
                <p className="text-xl font-bold font-mono text-emerald-400">RD$ {resultados.nuevoNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                <span className="text-[8px] text-slate-500 font-mono">Bruto: RD$ {resultados.nuevoBruto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* METRICS OF DIFFERENCE */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Resumen Incremental Anualizado</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-0.5">
                    <span className="text-[9px] text-slate-450 block uppercase">Diferencia Mensual</span>
                    <p className="text-lg font-extrabold text-blue-400 font-mono">+RD$ {resultados.incrementoNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-0.5">
                    <span className="text-[9px] text-slate-450 block uppercase">Ingresos anual extra net</span>
                    <p className="text-lg font-extrabold text-emerald-400 font-mono">+RD$ {resultados.incrementoAnualNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>
              </div>

              {/* INTEGRATIVE COMPARTIVE SVG CHART */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-450 font-bold block uppercase tracking-wide">Proporción del Sueldo Bruto Neto</span>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  {/* Actual Segment */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Antes (Neto es el {(resultados.actualNeto/resultados.actualBruto*100 || 0).toFixed(0)}%)</span>
                      <span className="font-mono">RD$ {resultados.actualNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-500 h-full rounded-full" style={{ width: `${(resultados.actualNeto/resultados.actualBruto*100) || 0}%` }}></div>
                    </div>
                  </div>
                  {/* Nuevo Segment */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-blue-300">
                      <span>Después (Neto es el {(resultados.nuevoNeto/resultados.nuevoBruto*100 || 0).toFixed(0)}%)</span>
                      <span className="font-mono text-emerald-400">RD$ {resultados.nuevoNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(resultados.nuevoNeto/resultados.nuevoBruto*100) || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-xs text-slate-400 font-semibold p-6 text-center leading-relaxed">Cargando simulador...</p>
        )}

        <AdsenseMock slot="aumento-tab-ads" type="banner" />
      </div>

    </div>
  );
}
