import React, { useEffect, useState } from 'react';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';

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

export default function HorasExtrasPrintReport() {
  const [data, setData] = useState<any | null>(null);
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
        stored = localStorage.getItem('sueldofacil_horas_print');
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
          <p className="text-xs font-bold font-mono">Preparando reporte de Horas Extras...</p>
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
  const salarioMensual = parseFloat(input.salarioMensual) || 0;
  const horasOrdinarias = parseFloat(input.horasExtrasOrdinarias) || 0;
  const horasExtremas = parseFloat(input.horasExtrasExtremas) || 0;
  const horasNocturnas = parseFloat(input.horasNocturnas) || 0;
  const horasFeriadas = parseFloat(input.horasFeriadas) || 0;

  const totalHoras = horasOrdinarias + horasExtremas + horasNocturnas + horasFeriadas;
  const salarioPorHora = output.salarioPorHora || 0;
  const totalAdicional = output.totalAdicional || 0;
  const salarioTotalConExtras = output.salarioTotalConExtras || 0;

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 font-sans antialiased text-[11px] leading-relaxed py-8 px-4 print:p-0 print:bg-white print:min-h-0">
      
      {/* CONTROLES DE LA PÁGINA */}
      <div className="max-w-[8.5in] mx-auto mb-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-md flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span>
            Cálculo de Horas Extras Listo para Impresión
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
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">Volante de Liquidación de Horas Extraordinarias</h1>
            <p className="text-[9px] text-slate-500 mt-1">Reporte formal para control de nómina y cumplimiento laboral en República Dominicana.</p>
          </div>

          <div className="text-right text-[9px] space-y-0.5 font-mono text-slate-600 border border-slate-250 p-2.5 rounded-xl bg-slate-50">
            <div><strong>Código:</strong> {reportSerial}</div>
            <div><strong>Fecha:</strong> {new Date().toLocaleDateString('es-DO')}</div>
            <div><strong>Marco Regulatorio:</strong> Art. 203 Código de Trabajo RD</div>
          </div>
        </div>

        {/* DETALLE GENERAL DEL CÁLCULO */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 mb-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">1. Parámetros y Valores Base</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Salario Ordinario Mensual</span>
              <span className="text-xs font-bold text-slate-800 font-mono">RD$ {salarioMensual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Tarifa por Hora Ordinaria</span>
              <span className="text-xs font-bold text-slate-800 font-mono">RD$ {salarioPorHora.toLocaleString('en-US', { minimumFractionDigits: 4 })}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Horas Registradas</span>
              <span className="text-xs font-bold text-slate-850 font-mono">{totalHoras} hrs</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Monto Total Adicional</span>
              <span className="text-xs font-black text-emerald-600 font-mono">RD$ {totalAdicional.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* DESGLOSE DETALLADO */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">2. Desglose Detallado de Horas y Recargos</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[9.5px]">
                <th className="p-2 border border-slate-800 rounded-l">Categoría de Horas</th>
                <th className="p-2 border border-slate-800 text-center">Horas</th>
                <th className="p-2 border border-slate-800 text-right">Recargo (%)</th>
                <th className="p-2 border border-slate-800 text-right">Valor Hora Recargada</th>
                <th className="p-2 border border-slate-800 text-right rounded-r">Total Bruto a Pagar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-2 font-semibold">Horas Extras Ordinarias (Hasta 68h semanales)</td>
                <td className="p-2 text-center font-mono">{horasOrdinarias}</td>
                <td className="p-2 text-right font-mono">35%</td>
                <td className="p-2 text-right font-mono">RD$ {(salarioPorHora * 1.35).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="p-2 text-right font-mono">RD$ {(output.montoExtrasOrdinarias || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Horas Extras Extremas (Excedentes de 68h)</td>
                <td className="p-2 text-center font-mono">{horasExtremas}</td>
                <td className="p-2 text-right font-mono">100%</td>
                <td className="p-2 text-right font-mono">RD$ {(salarioPorHora * 2.0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="p-2 text-right font-mono">RD$ {(output.montoExtrasExtremas || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Horas en Jornada Nocturna (9:00 PM a 7:00 AM)</td>
                <td className="p-2 text-center font-mono">{horasNocturnas}</td>
                <td className="p-2 text-right font-mono">15%</td>
                <td className="p-2 text-right font-mono">RD$ {(salarioPorHora * 0.15).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="p-2 text-right font-mono">RD$ {(output.montoNocturnas || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Horas Trabajadas en Días Feriados o de Descanso</td>
                <td className="p-2 text-center font-mono">{horasFeriadas}</td>
                <td className="p-2 text-right font-mono">100%</td>
                <td className="p-2 text-right font-mono">RD$ {(salarioPorHora * 2.0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="p-2 text-right font-mono">RD$ {(output.montoFeriadas || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bg-slate-900/5 font-bold text-slate-900">
                <td className="p-2" colSpan={3}>Suma de Ingresos Adicionales</td>
                <td className="p-2 text-right">-</td>
                <td className="p-2 text-right font-mono text-emerald-600">RD$ {totalAdicional.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bg-blue-50/40 font-black text-slate-900 text-xs">
                <td className="p-2" colSpan={3}>NUEVO SUELDO BRUTO CALCULADO (Mensual + Extras)</td>
                <td className="p-2 text-right">-</td>
                <td className="p-2 text-right font-mono text-blue-700">RD$ {salarioTotalConExtras.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* VALOR EN LETRAS */}
        <div className="border border-slate-200 rounded-xl p-3.5 mb-6 text-slate-700 bg-slate-50/30">
          <span className="text-[8.5px] font-bold text-slate-400 uppercase block mb-1">Monto de Horas Extras en Letras</span>
          <p className="text-[10px] font-bold text-slate-800 leading-normal uppercase">
            SON: {numeroALetras(totalAdicional)}
          </p>
        </div>

        {/* NOTAS LEGALES E INFORMATIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-[9.5px] text-slate-500 text-justify leading-relaxed">
          <div>
            <strong>Art. 203 del Código de Trabajo:</strong> Estipula que las horas de trabajo prestadas en exceso de la jornada ordinaria se liquidan con un recargo del 35%. Si el trabajo extraordinario se presta entre las 9:00 PM y las 7:00 AM, aplica acumulativamente el recargo por nocturnidad (15%).
          </div>
          <div>
            <strong>Cotizaciones y Retenciones:</strong> Las horas extras forman parte de la base imponible sujeta a retenciones de la Tesorería de la Seguridad Social (TSS) y del Impuesto Sobre la Renta (ISR), debiendo ser integradas en la declaración mensual a través del sistema IR-3 de la DGII.
          </div>
        </div>

        {/* ÁREA DE FIRMAS (NO BREAK) */}
        <div className="print-no-break grid grid-cols-2 gap-8 border-t border-slate-200 pt-8 mt-8 select-none">
          <div className="text-center">
            <div className="h-14 border-b border-slate-350 mx-auto max-w-[200px]"></div>
            <span className="text-[9px] font-bold text-slate-650 block mt-2">Supervisor / Gerente de Área</span>
            <span className="text-[8px] text-slate-400 block">Autorizado y Validado</span>
          </div>
          <div className="text-center">
            <div className="h-14 border-b border-slate-350 mx-auto max-w-[200px]"></div>
            <span className="text-[9px] font-bold text-slate-650 block mt-2">Colaborador / Empleado</span>
            <span className="text-[8px] text-slate-400 block">Firma de Conformidad</span>
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
