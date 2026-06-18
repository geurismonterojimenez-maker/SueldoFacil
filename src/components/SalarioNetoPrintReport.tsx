import React, { useEffect, useState } from 'react';
import { SalarioInput, SalarioOutput } from '../types';
import { Printer, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

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

  const suffix = (millones > 0 && miles === 0 && unidadesRest === 0) ? 'DE PESOS' : 'PESOS';
  return `${result} ${suffix} CON ${centavosStr}/100`;
}

export default function SalarioNetoPrintReport() {
  const [data, setData] = useState<{
    input: SalarioInput;
    output: SalarioOutput;
    reportSerial: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dataParam = params.get('data');
      const token = params.get('token');
      let stored = null;

      if (dataParam) {
        try {
          stored = decodeURIComponent(escape(atob(dataParam)));
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
        stored = localStorage.getItem('sueldofacil_salario_print');
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

  useEffect(() => {
    if (data) {
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
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-650">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold font-mono">Preparando reporte de Salario Neto...</p>
        </div>
      </div>
    );
  }

  if (!data) {
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

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans antialiased text-[11px] leading-relaxed py-8 px-4 print:p-0 print:bg-white print:min-h-0">
      
      {/* CONTROLES DE LA PÁGINA */}
      <div className="max-w-[8.5in] mx-auto mb-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-md flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span>
            Reporte de Salario Neto Listo para Impresión
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
      <div className="bg-white max-w-[8.5in] mx-auto p-8 border border-slate-200 rounded-xl shadow-lg print:border-0 print:shadow-none print:p-0">
        
        {/* CABECERA */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="bg-slate-900 text-white p-1 rounded font-bold font-mono text-xs">
                <span className="text-blue-400">S</span>F
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">SueldoFácil.com</span>
            </div>
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">Reporte Ejecutivo de Salario Neto</h1>
            <p className="text-[9px] text-slate-500 mt-1">Cálculo de deducciones de ley conforme a la TSS y escalas fiscales de la DGII de RD.</p>
          </div>

          <div className="text-right text-[9px] space-y-0.5 font-mono text-slate-600 border border-slate-250 p-2.5 rounded-xl bg-slate-50">
            <div><strong>Código:</strong> {reportSerial}</div>
            <div><strong>Emitido:</strong> {new Date().toLocaleDateString('es-DO')}</div>
            <div><strong>Normativa:</strong> Ley 87-01 y Código Tributario RD</div>
          </div>
        </div>

        {/* DETALLE GENERAL DEL CÁLCULO */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 mb-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">1. Datos Generales de la Simulación</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Salario Bruto Mensual</span>
              <span className="text-xs font-bold text-slate-800 font-mono">RD$ {output.salarioBruto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Ingresos Adicionales</span>
              <span className="text-xs font-bold text-slate-800 font-mono">RD$ {output.ingresosAdicionales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Retenciones de Ley</span>
              <span className="text-xs font-bold text-rose-600 font-mono">RD$ {output.retencionesTotales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Salario Neto Recibido</span>
              <span className="text-xs font-black text-emerald-600 font-mono">RD$ {output.salarioNeto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* DESGLOSE DETALLADO */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">2. Desglose de Deducciones y Cargas Sociales</h2>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-900 text-white text-[9.5px]">
                <th class="p-2 border border-slate-800 rounded-l">Concepto de Deducción</th>
                <th class="p-2 border border-slate-800 text-center">Porcentaje (%)</th>
                <th class="p-2 border border-slate-800 text-right rounded-r">Monto Deducido (RD$)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="p-2 font-semibold">Seguro de Pensiones (AFP - Empleado)</td>
                <td class="p-2 text-center font-mono">2.87%</td>
                <td class="p-2 text-right font-mono">RD$ {output.afp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td class="p-2 font-semibold">Seguro Familiar de Salud (SFS - Empleado)</td>
                <td class="p-2 text-center font-mono">3.04%</td>
                <td class="p-2 text-right font-mono">RD$ {output.sfs.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td class="p-2 font-semibold">Impuesto Sobre la Renta (ISR - Escala de la DGII)</td>
                <td class="p-2 text-center font-mono">Variable</td>
                <td class="p-2 text-right font-mono">RD$ {output.isr.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="bg-slate-50 font-bold text-slate-900">
                <td class="p-2">Total de Retenciones Aplicadas</td>
                <td class="p-2 text-center">-</td>
                <td class="p-2 text-right font-mono text-rose-600">RD$ {output.retencionesTotales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr class="bg-blue-50/40 font-black text-slate-900 text-xs">
                <td class="p-2">Monto Neto a Depositar al Empleado</td>
                <td class="p-2 text-center font-mono text-[9px] text-slate-500">{output.porcentajeNeto.toFixed(1)}% del Salario</td>
                <td class="p-2 text-right font-mono text-emerald-600">RD$ {output.salarioNeto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* VALOR EN LETRAS */}
        <div className="border border-slate-200 rounded-xl p-3.5 mb-6 text-slate-700 bg-slate-50/30">
          <span className="text-[8.5px] font-bold text-slate-400 uppercase block mb-1">Monto en Letras Oficiales</span>
          <p className="text-[10px] font-bold text-slate-800 leading-normal uppercase">
            SON: {numeroALetras(output.salarioNeto)}
          </p>
        </div>

        {/* NOTAS LEGALES E INFORMATIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-[9.5px] text-slate-500 text-justify leading-relaxed">
          <div>
            <strong>Base Imponible del Impuesto:</strong> Conforme al Código Tributario Dominicano, las cotizaciones obligatorias a la Seguridad Social (AFP y SFS) están exentas de tributos y se deducen del sueldo bruto para obtener la base imponible del Impuesto sobre la Renta.
          </div>
          <div>
            <strong>Topes Salariales de Cotización:</strong> El cálculo aplica los límites máximos establecidos por la Tesorería de la Seguridad Social (TSS) equivalentes a 10 salarios mínimos para el seguro de salud (SFS) y 20 salarios mínimos para pensiones (AFP).
          </div>
        </div>

        {/* ÁREA DE FIRMAS (NO BREAK) */}
        <div className="print-no-break grid grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-8 select-none">
          <div className="text-center">
            <div className="h-14 border-b border-slate-350 mx-auto max-w-[200px]"></div>
            <span className="text-[9px] font-bold text-slate-650 block mt-2">Firma del Colaborador</span>
            <span className="text-[8px] text-slate-400 block">Recibido Conforme</span>
          </div>
          <div className="text-center">
            <div className="h-14 border-b border-slate-350 mx-auto max-w-[200px]"></div>
            <span className="text-[9px] font-bold text-slate-650 block mt-2">Por la Empresa</span>
            <span className="text-[8px] text-slate-400 block">Firma y Sello de Recursos Humanos</span>
          </div>
        </div>

        {/* CERTIFICACIÓN DE SEGURIDAD LOCAL */}
        <div className="mt-8 border-t border-slate-100 pt-4 flex justify-between items-center text-[8.5px] text-slate-400 select-none">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            Certificado bajo algoritmos de cálculo SueldoFácil.com
          </span>
          <span>&copy; 2026 SueldoFácil — Todos los derechos reservados.</span>
        </div>

      </div>
    </div>
  );
}
