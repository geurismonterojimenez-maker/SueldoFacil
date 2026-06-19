import React, { useEffect, useState } from 'react';
import { CostoLaboralInput, CostoLaboralOutput } from '../types';
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

export default function CostoLaboralPrintReport({ directData }: { directData?: any }) {
  const [data, setData] = useState<{
    input: CostoLaboralInput;
    output: CostoLaboralOutput;
    reportSerial: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (directData) {
      setData(directData);
      setLoading(false);
      return;
    }
    try {
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get('data');
      const token = params.get('token');
      let stored = null;

      if (dataParam) {
        try {
          const normalizedBase64 = dataParam.replace(/ /g, '+');
          stored = decodeURIComponent(escape(atob(normalizedBase64)));
        } catch (err) {
          console.error("Error decoding base64 data parameter", err);
        }
      }

      if (!stored && token) {
        stored = sessionStorage.getItem(`sueldofacil_report_${token}`);
        if (!stored) {
          stored = localStorage.getItem(`sueldofacil_report_${token}`);
        }
      }
      if (!stored) {
        stored = localStorage.getItem('sueldofacil_costos_print');
      }
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("No se pudo cargar la información para impresión", e);
    } finally {
      setLoading(false);
    }
  }, [directData]);

  useEffect(() => {
    if (data) {
      if (directData) return;

      const timer = setTimeout(() => {
        window.print();
      }, 950);

      const handleAfterPrint = () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
          sessionStorage.removeItem(`sueldofacil_report_${token}`);
        }
        try {
          window.close();
        } catch (e) {}
      };

      window.addEventListener('afterprint', handleAfterPrint);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [data, directData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-650">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold font-mono">Preparando reporte de Costos Laborales...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.input || !data.output) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-4">
          <p className="text-sm font-bold text-red-600">Error: Datos de Simulación No Encontrados</p>
          <p className="text-xs text-slate-500">Por favor, realiza un cálculo en la web primero e intenta imprimir de nuevo.</p>
          <button onClick={() => window.close()} className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer">
            Cerrar Ventana
          </button>
        </div>
      </div>
    );
  }

  const { input, output, reportSerial } = data;

  // Calculate fractions
  const totalCargasPatronales = output.afpPatronal + output.sfsPatronal + output.arl;
  const totalProvisionesAnuales = output.provisionVacaciones + output.provisionRegalia + output.provisionCesantia;

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans antialiased text-[11px] leading-relaxed py-8 px-4 print:p-0 print:bg-white print:min-h-0">
      
      {/* CONTROLES DE LA PÁGINA */}
      <div className="max-w-[8.5in] mx-auto mb-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-md flex items-center justify-between print-hidden">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span>
            Ficha de Costos de Contratación Lista para Impresión
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.close()}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-800 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs shadow-md shadow-blue-500/10"
          >
            <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* REPORTE FISICO */}
      <div className="print-clean bg-white max-w-[8.5in] mx-auto p-5 border border-slate-200 rounded-xl shadow-lg print:border-0 print:shadow-none print:p-0">
        <div className="flex flex-col justify-between min-h-[8.2in] pb-1">
          <div>
            {/* CABECERA */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="bg-slate-900 text-white p-1 rounded font-bold font-mono text-xs">
                    <span className="text-blue-400">S</span>F
                  </div>
                  <span className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">SueldoFácil.com</span>
                </div>
                <h1 className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">Reporte de Costo Laboral Empresarial</h1>
                <p className="text-[9px] text-slate-500 mt-1">Estudio de costos de personal, aportes al SDSS y provisiones de liquidación (República Dominicana).</p>
              </div>

              <div className="text-right text-[9px] space-y-0.5 font-mono text-slate-600 border border-slate-250 p-2 rounded-xl bg-slate-50">
                <div><strong>Código:</strong> {reportSerial}</div>
                <div><strong>Emitido:</strong> {new Date().toLocaleDateString('es-DO')}</div>
                <div><strong>Versión:</strong> TSS/CNS 2026</div>
              </div>
            </div>

            {/* DETALLE GENERAL DEL CÁLCULO */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 mb-3">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">1. Resumen de Carga Financiera</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Salario Base Nominal</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">RD$ {output.salarioBase.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Aportes Sociales (Patrón)</span>
                  <span className="text-xs font-bold text-rose-600 font-mono">RD$ {totalCargasPatronales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Provisiones Adicionales</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">RD$ {totalProvisionesAnuales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Costo Total de Contratación</span>
                  <span className="text-xs font-black text-blue-600 font-mono">RD$ {output.totalCostoEmpresarial.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-[10px] text-slate-650 flex justify-between items-center">
                <span>
                  Costo adicional por encima del salario base nominal:
                </span>
                <span className="font-black text-blue-600 text-xs font-mono">
                  + {output.porcentajeAdicional.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* DESGLOSE DETALLADO */}
            <div className="mb-3 text-[10px]">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">2. Desglose Detallado de Aportes y Provisiones Mensuales</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[9.5px]">
                    <th className="p-1.5 border border-slate-800 rounded-l">Categoría / Concepto Laboral</th>
                    <th className="p-1.5 border border-slate-800 text-center">Tasa / Método de Ley</th>
                    <th className="p-1.5 border border-slate-800 text-right rounded-r">Costo Mensual (RD$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Salario Base */}
                  <tr className="font-bold">
                    <td className="p-1.5">Salario Nominal del Colaborador (Base)</td>
                    <td className="p-1.5 text-center">-</td>
                    <td className="p-1.5 text-right font-mono">RD$ {output.salarioBase.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  
                  {/* Aportaciones Patronales */}
                  <tr>
                    <td className="p-1.5 pl-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block"></span>
                      Seguro de Pensiones (AFP - Aporte Patronal)
                    </td>
                    <td className="p-1.5 text-center font-mono">7.10%</td>
                    <td className="p-1.5 text-right font-mono text-rose-600">RD$ {output.afpPatronal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 pl-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block"></span>
                      Seguro Familiar de Salud (SFS - Aporte Patronal)
                    </td>
                    <td className="p-1.5 text-center font-mono">7.09%</td>
                    <td className="p-1.5 text-right font-mono text-rose-600">RD$ {output.sfsPatronal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 pl-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block"></span>
                      Seguro de Riesgos Laborales (ARL - IDOPPRIL)
                    </td>
                    <td className="p-1.5 text-center font-mono">{input.riesgoLaboral}% (Riesgo Fijo)</td>
                    <td className="p-1.5 text-right font-mono text-rose-600">RD$ {output.arl.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* Provisiones */}
                  <tr>
                    <td className="p-1.5 pl-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
                      Provisión Mensual de Vacaciones (Estimado 14 días/año)
                    </td>
                    <td className="p-1.5 text-center font-mono">~4.9% del Salario</td>
                    <td className="p-1.5 text-right font-mono text-slate-800">RD$ {output.provisionVacaciones.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 pl-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
                      Provisión Mensual de Regalía Pascual (Sueldo #13)
                    </td>
                    <td className="p-1.5 text-center font-mono">8.33% (1/12 del Salario)</td>
                    <td className="p-1.5 text-right font-mono text-slate-800">RD$ {output.provisionRegalia.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 pl-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block"></span>
                      Provisión Mensual de Cesantía (Fondo de Liquidación)
                    </td>
                    <td className="p-1.5 text-center font-mono">~5.8% (21 días/año)</td>
                    <td className="p-1.5 text-right font-mono text-slate-800">RD$ {output.provisionCesantia.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>

                  {/* Totales */}
                  <tr className="bg-blue-50 font-black text-slate-900 text-xs">
                    <td className="p-1.5">Costo Real Completo Empresarial del Puesto</td>
                    <td className="p-1.5 text-center font-mono text-[9px] text-slate-500">+ {output.porcentajeAdicional.toFixed(1)}% Adicional</td>
                    <td className="p-1.5 text-right font-mono text-blue-600">RD$ {output.totalCostoEmpresarial.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            {/* ÁREA DE FIRMAS (NO BREAK) */}
            <div className="print-no-break grid grid-cols-2 gap-8 border-t border-slate-200 pt-3 mt-3 select-none">
              <div className="text-center">
                <div className="h-10 border-b border-slate-350 mx-auto max-w-[200px]"></div>
                <span className="text-[9px] font-bold text-slate-650 block mt-1.5">Elaborado por</span>
                <span className="text-[8px] text-slate-400 block">Firma y Sello del Contable / RRHH</span>
              </div>
              <div className="text-center">
                <div className="h-10 border-b border-slate-350 mx-auto max-w-[200px]"></div>
                <span className="text-[9px] font-bold text-slate-650 block mt-1.5">Autorizado por</span>
                <span className="text-[8px] text-slate-400 block">Firma y Sello de la Gerencia Financiera</span>
              </div>
            </div>

            {/* CERTIFICACIÓN DE SEGURIDAD LOCAL */}
            <div className="mt-3 border-t border-slate-100 pt-2 flex justify-between items-center text-[8.5px] text-slate-400 select-none">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Certificado bajo algoritmos de cálculo SueldoFácil.com
              </span>
              <span>&copy; 2026 SueldoFácil — Todos los derechos reservados.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
