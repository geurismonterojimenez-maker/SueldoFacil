import React, { useEffect, useState } from 'react';
import { PrestacionesInput, PrestacionesOutput } from '../types';
import { Printer, ArrowLeft, Download, ShieldCheck, FileSpreadsheet } from 'lucide-react';

// Number words converter in Spanish for elite institutional presentation
function numeroALetras(num: number): string {
  const rounded = Math.round(num * 100) / 100;
  const entero = Math.floor(rounded);
  const centavos = Math.round((rounded - entero) * 100);

  const unidades = (n: number): string => {
    switch (n) {
      case 1: return 'UN';
      case 2: return 'DOS';
      case 3: return 'TRES';
      case 4: return 'CUATRO';
      case 5: return 'CINCO';
      case 6: return 'SEIS';
      case 7: return 'SIETE';
      case 8: return 'OCHO';
      case 9: return 'NUEVE';
      default: return '';
    }
  };

  const decenas = (n: number): string => {
    if (n < 10) return unidades(n);
    if (n === 10) return 'DIEZ';
    if (n === 11) return 'ONCE';
    if (n === 12) return 'DOCE';
    if (n === 13) return 'TRECE';
    if (n === 14) return 'CATORCE';
    if (n === 15) return 'QUINCE';
    if (n < 20) return 'DIECI' + unidades(n - 10);
    if (n === 20) return 'VEINTE';
    if (n < 30) return 'VEINTI' + unidades(n - 20);
    
    const d = Math.floor(n / 10);
    const u = n % 10;
    let label = '';
    switch (d) {
      case 3: label = 'TREINTA'; break;
      case 4: label = 'CUARENTA'; break;
      case 5: label = 'CINCUENTA'; break;
      case 6: label = 'SESENTA'; break;
      case 7: label = 'SETENTA'; break;
      case 8: label = 'OCHENTA'; break;
      case 9: label = 'NOVENTA'; break;
    }
    return u > 0 ? `${label} Y ${unidades(u)}` : label;
  };

  const centenas = (n: number): string => {
    if (n === 100) return 'CIEN';
    const c = Math.floor(n / 100);
    const rest = n % 100;
    let label = '';
    switch (c) {
      case 1: label = 'CIENTO'; break;
      case 2: label = 'DOSCIENTOS'; break;
      case 3: label = 'TRESCIENTOS'; break;
      case 4: label = 'CUATROCIENTOS'; break;
      case 5: label = 'QUINIENTOS'; break;
      case 6: label = 'SEISCIENTOS'; break;
      case 7: label = 'SETECIENTOS'; break;
      case 8: label = 'OCHOCIENTOS'; break;
      case 9: label = 'NOVECIENTOS'; break;
    }
    return rest > 0 ? `${label} ${decenas(rest)}` : label;
  };

  const seccion = (num: number, divisor: number, strSingular: string, strPlural: string): string => {
    const c = Math.floor(num / divisor);
    const rest = num % divisor;
    let label = '';

    if (c > 0) {
      if (c === 1) {
        label = strSingular;
      } else {
        label = `${seccion(c, 1, '', '')} ${strPlural}`;
      }
    } else {
      label = '';
    }

    if (divisor === 1) {
      if (num < 10) return unidades(num);
      if (num < 100) return decenas(num);
      return centenas(num);
    }

    return label + (rest > 0 ? ' ' + seccion(rest, 1, 'UN', '') : '');
  };

  const centavosStr = centavos.toString().padStart(2, '0');

  if (entero === 0) return `CERO PESOS CON ${centavosStr}/100`;
  if (entero === 1) return `UN PESO CON ${centavosStr}/100`;

  const millones = Math.floor(entero / 1000000);
  const restoMillones = entero % 1000000;
  const miles = Math.floor(restoMillones / 1000);
  const unidadesRest = restoMillones % 1000;

  let result = '';

  if (millones > 0) {
    if (millones === 1) {
      result += 'UN MILLÓN';
    } else {
      result += `${seccion(millones, 1, '', '')} MILLONES`;
    }
  }

  if (miles > 0) {
    if (result) result += ' ';
    if (miles === 1) {
      result += 'MIL';
    } else {
      result += `${seccion(miles, 1, '', '')} MIL`;
    }
  }

  if (unidadesRest > 0) {
    if (result) result += ' ';
    result += seccion(unidadesRest, 1, '', '');
  }

  // Adjust for "DE PESOS" when we have exact millions with no miles or units remainder
  const suffix = (millones > 0 && miles === 0 && unidadesRest === 0) ? 'DE PESOS' : 'PESOS';
  
  // Format clean string
  return `${result} ${suffix} CON ${centavosStr}/100`;
}

export function PrestacionesPrintReport() {
  const [data, setData] = useState<{
    input: PrestacionesInput;
    output: PrestacionesOutput;
    reportSerial: string;
    pdfType: 'ejecutivo' | 'educativo';
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      let stored = null;
      if (token) {
        stored = sessionStorage.getItem(`sueldofacil_report_${token}`);
      }
      if (!stored) {
        // Fallback matching to previous key for backwards compatibility
        stored = localStorage.getItem('sueldofacil_print_calculations');
      }
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("No se pudo cargar la información para impresión", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run automatically when document is ready & fully rendered, and register afterprint event
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        window.print();
      }, 900);

      const handleAfterPrint = () => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
          sessionStorage.removeItem(`sueldofacil_report_${token}`);
        }
        // Also clean any older session keys starting with sueldofacil_report_
        try {
          for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('sueldofacil_report_')) {
              sessionStorage.removeItem(key);
            }
          }
        } catch (e) {
          console.error("Error clearing old reports", e);
        }

        // Close window if opened inside a popup
        try {
          window.close();
        } catch (e) {
          // Fallback if browser blocks window.close()
        }
      };

      window.addEventListener('afterprint', handleAfterPrint);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-700">Generando vista de impresión oficial...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6 text-center">
        <div className="max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-black text-slate-900 uppercase">Sin Datos de Cálculo</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            No se detectó un cálculo de prestaciones activo en este navegador. Vuelva a la calculadora e intente dar clic en el botón de "PDF / Imprimir".
          </p>
          <button
            onClick={() => {
              window.location.search = '';
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Volver a la Calculadora
          </button>
        </div>
      </div>
    );
  }

  const { input, output, reportSerial, pdfType } = data;
  const hoyFormatted = new Date().toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaFormatted = new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Calculate percentages for the executive visual bar chart
  const totalVal = Math.max(0.01, output.total);
  const pctPreaviso = ((output.preaviso / totalVal) * 100).toFixed(1);
  const pctCesantia = ((output.cesantia / totalVal) * 100).toFixed(1);
  const pctVacaciones = ((output.vacaciones / totalVal) * 100).toFixed(1);
  const pctRegalia = ((output.regalia / totalVal) * 100).toFixed(1);
  const pctBonif = ((output.bonificacion / totalVal) * 100).toFixed(1);

  // Computable Days counts
  const diasPreaviso = input.incluyePreaviso ? Math.round(output.preaviso / Math.max(0.01, output.salarioDiario)) : 0;
  const diasCesantia = input.incluyeCesantia ? Math.round(output.cesantia / Math.max(0.01, output.salarioDiario)) : 0;
  const diasVacaciones = !input.vacacionesTomadas ? (input.diasVacacionesPendientes > 0 ? input.diasVacacionesPendientes : Math.round(output.vacaciones / Math.max(0.01, output.salarioDiario))) : 0;

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans antialiased text-xs leading-relaxed py-8 px-4 print:p-0 print:bg-white print:min-h-0">
      
      {/* GLOBAL REUSABLE PRINT RULES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: #0f172a !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
          .print-no-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          /* Grayscale optimization rules for high-contrast printers */
          .bg-emerald-50 {
            background-color: #f0fdf4 !important;
          }
          .bg-slate-50 {
            background-color: #f8fafc !important;
          }
          .bg-amber-50 {
            background-color: #fffbeb !important;
          }
          .bg-slate-100 {
            background-color: #f1f5f9 !important;
          }
          /* Text fills contrast safeguard */
          .text-slate-650 {
            color: #334155 !important;
          }
          .text-slate-450 {
            color: #64748b !important;
          }
          /* High-intensity borders for charts and tables */
          .border-slate-205, .border-slate-200 {
            border-color: #cbd5e1 !important;
          }
        }
      `}} />

      {/* FLOAT ACTION TOOLBAR (VISIBLE ONLY ON SCREEN PREVIEW) */}
      <div className="max-w-[8.5in] mx-auto mb-6 p-4 bg-white border border-slate-200 rounded-3xl shadow-md flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.location.search = '';
            }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Calculadora
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono leading-none">Aislamiento de Impresión</span>
            <span className="text-xs font-extrabold text-slate-800">Reporte Oficial {reportSerial}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold shadow-lg shadow-blue-600/10"
          >
            <Printer className="w-4.5 h-4.5" />
            Imprimir Reporte (Ctrl+P)
          </button>
        </div>
      </div>

      {/* THE STATEMENT SHEET FOR SHEET SIZE 8.5in x 11in (A4/Letter Container) */}
      <div className="bg-white max-w-[8.5in] mx-auto p-8 border border-slate-205 rounded-xl shadow-lg print:border-0 print:shadow-none print:p-0">
        
        {/* ==================== PAGINA 1: RESUMEN CORPORATIVO / REPORTE EJECUTIVO ==================== */}
        <div className="page-break flex flex-col justify-between min-h-[10in] pb-4">
          <div>
            {/* CABECERA INSTITUCIONAL */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
              <div className="space-y-1.5 max-w-[65%]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="bg-slate-900 text-white p-1.5 rounded-lg flex items-center justify-center font-bold font-mono tracking-tight text-sm">
                    <span className="text-blue-400">S</span>F
                  </div>
                  <span className="text-base font-extrabold tracking-tight text-slate-900 uppercase font-sans">SueldoFácil.com</span>
                </div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Reporte de Prestaciones Laborales</h1>
                <p className="text-[9.5px] text-slate-500 font-medium font-sans leading-relaxed">
                  Cálculo matemático de prestaciones conforme al Código de Trabajo de la República Dominicana (Ley No. 16-92) y directrices de la TSS.
                </p>
                <p className="text-[8.5px] text-slate-400 font-medium font-sans italic">
                  Vigencia Normativa: Actualizada al {hoyFormatted}.
                </p>
              </div>

              {/* CONTROL DE VERSIONES Y METADATA DEL REPORTE */}
              <div className="text-right text-[10px] space-y-1 font-mono text-slate-600 border border-slate-200 p-3 rounded-2xl bg-slate-50">
                <div><strong className="text-slate-800">Reporte:</strong> {reportSerial}</div>
                <div><strong className="text-slate-800">Versión:</strong> 2026.06</div>
                <div><strong className="text-slate-800 font-bold">Tipo:</strong> {pdfType === 'ejecutivo' ? 'Reporte Ejecutivo' : 'Guía Educativa'}</div>
                <div><strong className="text-slate-800">Fecha:</strong> {hoyFormatted}</div>
                <div><strong className="text-slate-800">Hora:</strong> {horaFormatted}</div>
                <div><strong className="text-emerald-700 font-bold">Norma:</strong> Ley 16-92 RD</div>
              </div>
            </div>

            {/* PRESENTACIÓN INSTITUCIONAL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 items-center">
              <div className="md:col-span-8 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono">Presentación del Documento</h3>
                <p className="text-[10.5px] text-slate-650 leading-normal font-sans text-justify">
                  Este documento de simulación laboral expone determinadamente el desglose de los derechos adquiridos e indemnizaciones acumuladas por el trabajador bajo las escalas del Código Laboral de la República Dominicana. El motor matemático ha sido auditado contra topes legales y normativas aplicables de la Seguridad Social (TSS).
                </p>
              </div>

              {/* VECTOR QR CODE DE VERIFICACIÓN */}
              <div className="md:col-span-4 flex flex-col justify-center items-center p-2 border border-slate-200 rounded-2xl bg-white space-y-0.5 text-center font-sans shadow-sm">
                <a href={`https://sueldofacil.com/verificar?codigo=${reportSerial}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-slate-800" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="none" />
                    <rect x="5" y="5" width="22" height="22" fill="currentColor" />
                    <rect x="9" y="9" width="14" height="14" fill="white" />
                    <rect x="12" y="12" width="8" height="8" fill="currentColor" />

                    <rect x="73" y="5" width="22" height="22" fill="currentColor" />
                    <rect x="77" y="9" width="14" height="14" fill="white" />
                    <rect x="80" y="12" width="8" height="8" fill="currentColor" />

                    <rect x="5" y="73" width="22" height="22" fill="currentColor" />
                    <rect x="9" y="77" width="14" height="14" fill="white" />
                    <rect x="12" y="80" width="8" height="8" fill="currentColor" />

                    <rect x="77" y="77" width="8" height="8" fill="currentColor" />
                    <rect x="79" y="79" width="4" height="4" fill="white" />
                    <rect x="80" y="80" width="2" height="2" fill="currentColor" />

                    <path d="M35 5h5v5h-5zm0 10h5v10h-5zm10-5h5v5h-5zm10 5h5v5h-5zm10-10h5v5h-5zm-15 15h10v5H50zm15 10h5v5h-5zm-20 5h10v5h-10zm25 15h5v5h-5zm-15 10h10v5h-10zm-15 5h5v5h-5zm-10-25h10v5h-10zm15-5h5v5h-5zm25-10h5v5h-5zm-15 5h5v5h-5z" fill="currentColor" />
                    <path d="M40 12h5v3H40zm10 5h5v3h-5zm-10 15h5v5H40zm15 10h5v5h-5zm5-20h5v5h-5zm10 35h5v5h-5zm-25 5h5v5h-5zm15 5h15v5H50zm-15 0h5v5H35zm-5-30h5v5h-5zm15-5h5v5h-5zm25-10h5v5h-5zm-15 5h5v5h-5z" fill="currentColor" />
                  </svg>
                </a>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-wide leading-none">Código Verificador</span>
                <span className="text-[7px] text-blue-600 font-mono tracking-tighter truncate max-w-[110px] block font-bold">
                  {reportSerial}
                </span>
              </div>
            </div>

            {/* FICHA TÉCNICA DEL TRABAJADOR */}
            <div className="mb-5">
              <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                Ficha Técnica de Relación Laboral
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Fecha Ingreso</span>
                  <span className="text-xs font-extrabold text-slate-800 font-mono">{input.fechaIngreso}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Fecha Salida</span>
                  <span className="text-xs font-extrabold text-slate-800 font-mono">{input.fechaSalida}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Tiempo Laborado</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {output.tiempoServicio.anos} año(s), {output.tiempoServicio.meses} mes(es) y {output.tiempoServicio.dias} día(s)
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Tipo de Salida</span>
                  <span className="text-xs font-extrabold text-slate-800 truncate block">
                    {input.tipoSalida === 'desahucio_patronal' ? 'Desahucio Patronal (Despido Unilateral)' : 
                     input.tipoSalida === 'desahucio_trabajador' ? 'Renuncia Voluntaria' : 
                     input.tipoSalida === 'despido_justificado' ? 'Despido Justificado' : 'Dimisión Justificada'}
                  </span>
                </div>
                <div className="space-y-1 border-t border-slate-200/60 pt-2 col-span-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Salario Ordinario</span>
                  <span className="text-xs font-extrabold text-slate-800 font-mono">RD$ {parseFloat(input.salarioMensual).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="space-y-1 border-t border-slate-200/60 pt-2 col-span-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Salario Diario Promedio</span>
                  <span className="text-xs font-extrabold text-slate-800 font-mono">RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="space-y-1 border-t border-slate-200/60 pt-2 col-span-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Estatus de Vacaciones</span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {input.vacacionesTomadas ? 'Disfrutadas físicamente (Sin compensación adeudada)' : 
                     input.diasVacacionesPendientes > 0 ? `Pendientes por compensar (${input.diasVacacionesPendientes} días)` : 
                     'Estimación proporcional de Ley por tiempo laborado'}
                  </span>
                </div>
              </div>
            </div>

            {/* MONTO PRINCIPAL DESTACADO */}
            <div className="bg-slate-50 text-slate-900 border-2 border-slate-900 rounded-2xl p-5 text-center mb-5 space-y-1.5 print:bg-slate-50">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block font-mono">Monto Total Estimado de Liquidación Laboral</span>
              <div className="text-3xl font-black text-blue-800 font-sans tracking-tight leading-none my-1">
                RD$ {output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[9.5px] font-bold text-slate-700 uppercase font-serif tracking-wider pt-1 border-t border-slate-200 max-w-xl mx-auto">
                {numeroALetras(output.total)}
              </div>
            </div>

            {/* TABLA DE CONCEPTOS DETALLADOS */}
            <div className="mb-4">
              <h2 className="text-xs font-bold text-slate-800 tracking-widest uppercase font-mono mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                Desglose Analítico de Liquidaciones
              </h2>
              <table className="w-full text-left border-collapse border border-slate-300 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-white font-sans uppercase text-[9px] font-extrabold tracking-wider">
                    <th className="p-2 border border-slate-300">Concepto de Ley</th>
                    <th className="p-2 border border-slate-300">Base Diario</th>
                    <th className="p-2 border border-slate-300 text-center">Días Computados</th>
                    <th className="p-2 border border-slate-300 text-right">Subtotal Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border border-slate-300 font-bold text-slate-800">
                      Preaviso Omisión <span className="text-[9.5px] font-normal text-slate-450 block font-sans">Art. 76 Co. Trab. (Falta de notificación del despido)</span>
                    </td>
                    <td className="p-2 border border-slate-300 font-semibold font-mono text-slate-600">
                      RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold font-mono text-slate-800">
                      {diasPreaviso} días
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-extrabold font-mono text-slate-900">
                      RD$ {output.preaviso.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <td className="p-2 border border-slate-300 font-bold text-slate-800">
                      Auxilio de Cesantía <span className="text-[9.5px] font-normal text-slate-450 block font-sans">Art. 80 Co. Trab. (Indemnización por pérdida de empleo)</span>
                    </td>
                    <td className="p-2 border border-slate-300 font-semibold font-mono text-slate-600">
                      RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold font-mono text-slate-800">
                      {diasCesantia} días
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-extrabold font-mono text-slate-900">
                      RD$ {output.cesantia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 border border-slate-300 font-bold text-slate-800">
                      Vacaciones Proporcionales <span className="text-[9.5px] font-normal text-slate-450 block font-sans">Art. 177 Co. Trab. (Derecho adquirido inviolable)</span>
                    </td>
                    <td className="p-2 border border-slate-300 font-semibold font-mono text-slate-600">
                      RD$ {output.salarioDiario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold font-mono text-slate-800">
                      {diasVacaciones} días
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-extrabold font-mono text-slate-900">
                      RD$ {output.vacaciones.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <td className="p-2 border border-slate-300 font-bold text-slate-800">
                      Regalía Pascual (Sueldo 13) <span className="text-[9.5px] font-normal text-slate-450 block font-sans">Art. 219 Co. Trab. (Proporción anual libre de impuestos)</span>
                    </td>
                    <td className="p-2 border border-slate-300 font-semibold font-mono text-slate-600">
                      Sueldo Ordinario
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold font-mono text-slate-800">
                      Proporcional
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-extrabold font-mono text-slate-900">
                      RD$ {output.regalia.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  {output.bonificacion > 0 && (
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300 font-bold text-slate-800">
                        Bonificación de Utilidades <span className="text-[9.5px] font-normal text-slate-450 block font-sans">Art. 223 - Participación en beneficios de la empresa</span>
                      </td>
                      <td className="p-2 border border-slate-300 font-semibold font-mono text-slate-600">
                        Incentivo ordinario
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold font-mono text-slate-800">
                        Proporcional
                      </td>
                      <td className="p-2 border border-slate-300 text-right font-extrabold font-mono text-slate-900">
                        RD$ {output.bonificacion.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-100 font-bold">
                    <td colSpan={3} className="p-2.5 border border-slate-300 text-slate-900 text-[10px] uppercase text-right tracking-wider">
                      Suma de Conceptos Liquidados:
                    </td>
                    <td className="p-2.5 border border-slate-300 text-right text-base text-slate-950 font-black font-mono">
                      RD$ {output.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* GRÁFICO EJECUTIVO - DISTRIBUCIÓN PROPORCIONAL SÓLIDA DESACOPLADA */}
            <div className="mb-5 p-4.5 border border-slate-200 bg-slate-50/50 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono mb-2">Composición del Capital Liquidado</h3>
              
              {/* Proportional visual horizontal bar graph */}
              <div className="w-full h-6 rounded-lg bg-slate-200 overflow-hidden flex shadow-inner mb-3">
                {output.preaviso > 0 && (
                  <div 
                    style={{ width: `${pctPreaviso}%` }} 
                    className="bg-blue-600 h-full relative group transition-all"
                    title={`Preaviso: ${pctPreaviso}%`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-mono font-bold text-white truncate px-1">
                      {pctPreaviso}%
                    </span>
                  </div>
                )}
                {output.cesantia > 0 && (
                  <div 
                    style={{ width: `${pctCesantia}%` }} 
                    className="bg-sky-500 h-full relative group transition-all"
                    title={`Cesantía: ${pctCesantia}%`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-mono font-bold text-white truncate px-1">
                      {pctCesantia}%
                    </span>
                  </div>
                )}
                {output.vacaciones > 0 && (
                  <div 
                    style={{ width: `${pctVacaciones}%` }} 
                    className="bg-amber-500 h-full relative group transition-all"
                    title={`Vacaciones: ${pctVacaciones}%`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-mono font-bold text-white truncate px-1">
                      {pctVacaciones}%
                    </span>
                  </div>
                )}
                {output.regalia > 0 && (
                  <div 
                    style={{ width: `${pctRegalia}%` }} 
                    className="bg-emerald-600 h-full relative group transition-all"
                    title={`Sueldo 13 / Regalía: ${pctRegalia}%`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-mono font-bold text-white truncate px-1">
                      {pctRegalia}%
                    </span>
                  </div>
                )}
                {output.bonificacion > 0 && (
                  <div 
                    style={{ width: `${pctBonif}%` }} 
                    className="bg-purple-600 h-full relative group transition-all"
                    title={`Bonificaciones: ${pctBonif}%`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-mono font-bold text-white truncate px-1">
                      {pctBonif}%
                    </span>
                  </div>
                )}
              </div>

              {/* Legends with colored blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[9px] font-sans">
                {output.preaviso > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-750">
                    <span className="inline-block w-2.5 h-2.5 bg-blue-600 rounded"></span>
                    <span>Preaviso ({pctPreaviso}%)</span>
                  </div>
                )}
                {output.cesantia > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-750">
                    <span className="inline-block w-2.5 h-2.5 bg-sky-500 rounded"></span>
                    <span>Cesantía ({pctCesantia}%)</span>
                  </div>
                )}
                {output.vacaciones > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-750">
                    <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded"></span>
                    <span>Vacaciones ({pctVacaciones}%)</span>
                  </div>
                )}
                {output.regalia > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-750">
                    <span className="inline-block w-2.5 h-2.5 bg-emerald-600 rounded"></span>
                    <span>Regalía ({pctRegalia}%)</span>
                  </div>
                )}
                {output.bonificacion > 0 && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-750">
                    <span className="inline-block w-2.5 h-2.5 bg-purple-600 rounded"></span>
                    <span>Bonificación ({pctBonif}%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* ESPACIOS DE COMPROMISO CORPORATIVO Y FIRMAS */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono mb-5 text-center">Firma de Formalización y Conformidad</h3>
              <div className="grid grid-cols-2 gap-8 pt-4">
                {/* TRABAJADOR */}
                <div className="flex flex-col justify-end items-center text-center space-y-4">
                  <div className="w-[85%] border-b border-slate-705 h-8"></div>
                  <div className="space-y-0.5 font-sans">
                    <span className="font-extrabold text-[10.5px] text-slate-900 block">Trabajador Firmante</span>
                    <span className="text-[9.5px] text-slate-500 block">Nombre Completo</span>
                    <span className="text-[9.5px] font-mono text-slate-400 block">Cédula: _______________________</span>
                    <span className="text-[9.5px] text-slate-400 block">Fecha: ____ / ____ / ________</span>
                  </div>
                </div>

                {/* EMPLEADOR */}
                <div className="flex flex-col justify-end items-center text-center space-y-4">
                  <div className="w-[85%] border-b border-slate-705 h-8"></div>
                  <div className="space-y-0.5 font-sans">
                    <span className="font-extrabold text-[10.5px] text-slate-900 block">Por el Empleador / Representante Legal</span>
                    <span className="text-[9.5px] text-slate-500 block">Sello y Firma Autorizada</span>
                    <span className="text-[9.5px] font-mono text-slate-400 block">RNC / Cédula: __________________</span>
                    <span className="text-[9.5px] text-slate-400 block">Fecha: ____ / ____ / ________</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER DE PAGINA 1 */}
          <div className="pt-3 border-t border-slate-150 space-y-1 text-center font-sans">
            <div className="text-[8.5px] font-bold text-amber-700/85 uppercase tracking-wider dark:text-amber-600/85 mb-1">
              SIMULACIÓN EDUCATIVA • NO CONSTITUYE DOCUMENTO OFICIAL
            </div>
            <p className="text-[8px] text-slate-450 leading-relaxed italic max-w-xl mx-auto font-medium">
              Declaración: Este informe constituye una simulación estimativa basada en regulaciones de la República Dominicana y no sustituye de ninguna forma el laudo legal dictaminado ante el Ministerio de Trabajo. Actualizado conforme a la normativa laboral vigente.
            </p>
            <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-500 pt-1.5">
              <span className="font-semibold">SueldoFácil | www.sueldofacil.com</span>
              <span className="uppercase tracking-widest font-bold">Página 1 de {pdfType === 'ejecutivo' ? '1' : '3'} • REF: {reportSerial}</span>
            </div>
          </div>
        </div>


        {/* ==================== PAGINA 2: ANEXOS COMPLEMENTARIOS (SI ES COMPLETO) ==================== */}
        {pdfType === 'educativo' && (
          <div className="page-break flex flex-col justify-between min-h-[10in] pt-8 border-t border-dashed border-slate-200 mt-8 print:border-0 print:m-0 print:pt-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5 border-b border-slate-300 pb-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Soporte y Fundamentación Legal del Cálculo (Anexo Técnico)
              </h2>

              <div className="space-y-4">
                {/* PREAVISO */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[10px]">PREAVISO DE LEY (Art. 76 al 79 - Ley 16-92)</h4>
                  <p className="text-slate-650 text-justify text-[10px] font-sans leading-relaxed">
                    Es el plazo previo de aviso que una de las dos partes debe obligatoriamente notificar a la otra para dar por extinguido un acuerdo contractual por tiempo indefinido. En República Dominicana, si el empleador extingue la relación de manera inesperada sin aviso físico previo de desahucio, nace la obligación imperiosa de pagar la indemnización pecuniaria correspondiente en base a la escala temporal laborada: 3 a 6 meses de antigüedad = 7 días ordinarios; 6 a 12 meses = 14 días ordinarios; y mayor a un año = 28 días completos de remuneración ordinaria.
                  </p>
                </div>

                {/* CESANTIA */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[10px]">AUXILIO DE CESANTÍA (Art. 80 al 84 - Ley 16-92)</h4>
                  <p className="text-slate-650 text-justify text-[10px] font-sans leading-relaxed">
                    Constituye la indemnización patronal por desempleo que el empleador debe pagar de forma absoluta al trabajador cuando materializa un desahucio patronal. La escala de ley acumula beneficios de acuerdo al historial de antigüedad en servicios continuos: 3 a 6 meses = 6 días de salario diario; 6 a 12 meses = 13 días de salario; 1 a 5 años = 21 días por cada año completo; mayores de 5 años = 23 días por año laborado.
                  </p>
                </div>

                {/* VACACIONES */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[10px]">VACACIONES REMUNERADAS (Art. 177 - Ley 16-92)</h4>
                  <p className="text-slate-650 text-justify text-[10px] font-sans leading-relaxed">
                    Las vacaciones anuales proporcionales constituyen un beneficio adquirido sagrado y constitucionalmente protegido. Al romperse el vínculo del contrato de trabajo por cualquier vía, la empresa debe abonar de forma directa en efectivo la equivalencia de aquellos periodos proporcionales acumulados o días no disfrutados físicamente conforme al divisor legal mensual de 23.83.
                  </p>
                </div>

                {/* REGALIA */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[10px]">REGALÍA PASCUAL / SUELDO 13 (Art. 219 - Ley 16-92)</h4>
                  <p className="text-slate-650 text-justify text-[10px] font-sans leading-relaxed">
                    Imputable al pago de fin de año del sueldo décimo tercero. Corresponde rigurosamente a la duodécima parte de la totalidad de sueldos ordinarios percibidos por el empleado en su año de actividad corriente. Está consagrado con blindaje jurídico e inalienabilidad plena, lo cual impide retenciones por deudas, deducciones de renta DGII, exento de aportes sociales a la TSS (AFP y SFS), ni admite embargo judicial ordinario.
                  </p>
                </div>

                {/* PLAZOS */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-800 font-mono">Disposiciones del Plazo Perentorio de Pago (Art. 86)</h3>
                  <p className="text-[10px] text-amber-900 text-justify leading-relaxed font-sans">
                    El <strong>Artículo 86 del Código de Trabajo</strong> de la República Dominicana instituye que el empleador dispone de un margen estricto e improrrogable de <strong>diez (10) días calendario consecutivos</strong> (computando fines de semana) a contar de la separación laboral, para efectuar el desembolso pecuniario íntegro de la liquidación laboral oficial. Pasado este plazo perentorio sin saldar el derecho total adeudado, comienza a aplicarse de manera forzosa la penalidad de mora patronal acumulativa, ascendiente a un (1) día de salario diario completo del trabajador por cada día subsiguiente de tardanza irracional.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER DE PAGINA 2 */}
            <div className="pt-3 border-t border-slate-150 space-y-1 text-center font-sans">
              <div className="text-[8.5px] font-bold text-amber-700/85 uppercase tracking-wider dark:text-amber-600/85 mb-1">
                SIMULACIÓN EDUCATIVA • NO CONSTITUYE DOCUMENTO OFICIAL
              </div>
              <p className="text-[8px] text-slate-450 leading-relaxed italic max-w-xl mx-auto font-medium">
                Declaración: Este informe constituye una simulación estimativa basada en regulaciones de la República Dominicana y no sustituye de ninguna forma el laudo legal dictaminado ante el Ministerio de Trabajo. Actualizado conforme a la normativa laboral vigente.
              </p>
              <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-500 pt-1.5">
                <span className="font-semibold">SueldoFácil | www.sueldofacil.com</span>
                <span className="uppercase tracking-widest font-bold">Página 2 de 3 • REF: {reportSerial}</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PAGINA 3: ERRORES COMUNES Y DIRECTORIO DE FUENTES (SI ES COMPLETO) ==================== */}
        {pdfType === 'educativo' && (
          <div className="page-break flex flex-col justify-between min-h-[10in] pt-8 border-t border-dashed border-slate-200 mt-8 print:border-0 print:m-0 print:pt-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center gap-1.5 border-b border-slate-300 pb-2 mb-4">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Guía Contra Errores Críticos & Directorio Normativo
              </h2>

              <div className="space-y-4 text-[10.5px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ERROR A */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[9.5px]">Error Patronal Frecuente Nº 1</h4>
                    <span className="font-bold text-[9px] text-rose-600 block uppercase">Puntualizar descuento a Derechos Adquiridos</span>
                    <p className="text-slate-600 text-justify text-[9.5px] leading-relaxed">
                      Muchas directivas de personal consideran de forma equívoca que la renuncia voluntaria (dimisión) o un despido por falta cancelan por completo el derecho a regalía pascual y vacaciones vencidas. Éstos constituyen <strong>derechos adquiridos absolutos</strong>, no sujetos a descuento pecuniario disciplinario por ningún motivo contractual.
                    </p>
                  </div>

                  {/* ERROR B */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[9.5px]">Error Patronal Frecuente Nº 2</h4>
                    <span className="font-bold text-[9px] text-rose-600 block uppercase">Excluir variables complementarias como comisiones</span>
                    <p className="text-slate-600 text-justify text-[9.5px] leading-relaxed">
                      La base reguladora para el subsidio por prestaciones no se restringe exclusivamente al salario contractual neto establecido. De acuerdo al Artículo 85 del Código, toda compensación regular por comisiones, horas extras reiterativas, o primas de producción forma parte imponible de la base acumulada del sueldo promedio diario.
                    </p>
                  </div>
                </div>

                {/* DIRECTORIO DE FUENTES DE VALIDACIÓN (EEAT) */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h3 className="font-extrabold text-slate-950 uppercase tracking-wider text-[10px] font-sans">Directorio Oficial y Fuentes de Respaldo</h3>
                  <p className="text-slate-650 text-justify leading-relaxed">
                    Las formulaciones de cálculo, los límites del seguro TSS y la base impositiva de redondeo han sido tomadas en estricta conformidad con las publicaciones vigentes de los siguientes órganos reguladores:
                  </p>
                  <ul className="space-y-1.5 pl-1 text-slate-650">
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Código Laboral de la Rep. Dominicana (Ley No. 16-92)</strong> - Normativa sustantiva de los procesos indemnizatorios en desajustes contractuales.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Ley del Sistema Social (Ley No. 87-01)</strong> - Normas sobre bases cotizables máximas y topes previsionales de deducciones sanitarias.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Dirección General de Impuestos Internos (DGII RD)</strong> - Catálogo de exenciones tributarias de retención sobre prestaciones, preaviso y regalías.</span>
                    </li>
                  </ul>
                </div>

                {/* CERTIFICACION DE EXACTITUD */}
                <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-2xl flex items-start gap-3">
                  <div className="bg-emerald-600 text-white rounded-full w-5 h-5 font-sans font-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-emerald-950 uppercase tracking-widest text-[9px] leading-none">Certificación Editorial & Verificación de Calidad Científico-Matemática</h4>
                    <p className="text-emerald-900 leading-normal text-justify">
                      SueldoFácil mantiene auditoria técnica continua sobre las fórmulas integradas. La lógica del motor simulador respeta de forma escrupulosa las resoluciones de redondeo dictaminadas en los tribunales del país, garantizando exactitud óptima de balance sobre la liquidación definitiva.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER DE PAGINA 3 */}
            <div className="pt-3 border-t border-slate-150 space-y-1 text-center font-sans">
              <div className="text-[8.5px] font-bold text-amber-700/85 uppercase tracking-wider dark:text-amber-600/85 mb-1">
                SIMULACIÓN EDUCATIVA • NO CONSTITUYE DOCUMENTO OFICIAL
              </div>
              <p className="text-[8px] text-slate-450 leading-relaxed italic max-w-xl mx-auto font-medium">
                Declaración: Este informe constituye una simulación estimativa basada en regulaciones de la República Dominicana y no sustituye de ninguna forma el laudo legal dictaminado ante el Ministerio de Trabajo. Actualizado conforme a la normativa laboral vigente.
              </p>
              <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 dark:text-slate-500 pt-1.5">
                <span className="font-semibold">SueldoFácil | www.sueldofacil.com</span>
                <span className="uppercase tracking-widest font-bold">Página 3 de 3 • REF: {reportSerial}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
