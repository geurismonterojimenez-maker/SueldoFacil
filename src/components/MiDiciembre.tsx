import React, { useState, useEffect } from 'react';
import { Gift, Calendar, DollarSign, PartyPopper, Scale, ShieldCheck, Share2, Check, Info } from 'lucide-react';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

export default function MiDiciembre() {
  const [salarioMensual, setSalarioMensual] = useState('45000');
  const [mesesTrabajados, setMesesTrabajados] = useState('12');
  const [recibeSegundaQuincena, setRecibeSegundaQuincena] = useState(true);
  const [recibeBonificacion, setRecibeBonificacion] = useState(true);
  const [sueldosBono, setSueldosBono] = useState('1'); // Cantidad de sueldos en bonos (Código: 45 o 60 días)
  const [copiador, setCopiador] = useState(false);
  const [resultados, setResultados] = useState<any>(null);

  useEffect(() => {
    const salario = parseFloat(salarioMensual) || 0;
    const meses = Math.min(12, Math.max(1, parseFloat(mesesTrabajados) || 12));
    
    // 1. Regalía Pascual (Salario 13): Exento de todo impuesto (TSS e ISR) conforme al Art 222 del Código de Trabajo
    const regaliaBruto = (salario * meses) / 12;
    const regaliaNeta = regaliaBruto; // Totalmente exenta de retenciones

    // 2. Segunda quincena de Diciembre: Salario ordinario mensual dividido entre 2 mas deducciones ordinarias de TSS e ISR
    const salarioQuincenaBruto = recibeSegundaQuincena ? (salario / 2) : 0;
    let quincenaNeta = 0;
    if (recibeSegundaQuincena) {
      // Calculamos el sueldo neto mensual ordinario y lo dividimos por 2 para mayor precisión en deducciones progresivas
      const calcNormal = calcularSalarioNeto({ salarioBruto: salario.toString() });
      quincenaNeta = calcNormal.salarioNeto / 2;
    }

    // 3. Bonificación (Participación de Utilidades Art 223): Exento de TSS, pero sujeto a retención de ISR (proporcional progresivo)
    const bonificacionBruto = recibeBonificacion ? (salario * parseFloat(sueldosBono)) : 0;
    let bonificacionNeta = 0;
    let isrBonificacion = 0;

    if (bonificacionBruto > 0) {
      // Calculamos retención de ISR progresiva anualizada
      // Bonificación anual se suma al salario bruto anual proyectado
      const afpResto = salario * 0.0287;
      const sfsResto = salario * 0.0304;
      const sueldoNetoMensualImponible = salario - afpResto - sfsResto;
      const imponibleAnualOrdinario = sueldoNetoMensualImponible * 12;
      
      // Monto imponible anual total con el bono
      const imponibleAnualTotal = imponibleAnualOrdinario + bonificacionBruto;

      // Calcular ISR Anual Ordinaria vs Con Bono
      const isrAnualOrdinario = calcularISREstimadoAnual(imponibleAnualOrdinario);
      const isrAnualTotalConBono = calcularISREstimadoAnual(imponibleAnualTotal);

      // La diferencia impositiva anual se atribuye al Impuesto sobre la reincorporación de la Bonificación
      isrBonificacion = Math.max(0, isrAnualTotalConBono - isrAnualOrdinario);
      bonificacionNeta = Math.max(0, bonificacionBruto - isrBonificacion);
    }

    const totalIngresosLiquidos = regaliaNeta + quincenaNeta + bonificacionNeta;

    setResultados({
      regalia: regaliaNeta,
      quincenaBruta: salarioQuincenaBruto,
      quincenaNeta: quincenaNeta,
      bonoBruto: bonificacionBruto,
      bonoNeto: bonificacionNeta,
      bonoIsr: isrBonificacion,
      totalLiquido: totalIngresosLiquidos
    });
  }, [salarioMensual, mesesTrabajados, recibeSegundaQuincena, recibeBonificacion, sueldosBono]);

  // Auxiliar para calcular ISR anual progresivo oficial (DGII 2026)
  const calcularISREstimadoAnual = (imponibleAnual: number): number => {
    let impuestoAnual = 0;
    const ESCALA_1 = 416220.00;
    const ESCALA_2 = 624329.00;
    const ESCALA_3 = 867123.00;

    if (imponibleAnual <= ESCALA_1) {
      impuestoAnual = 0;
    } else if (imponibleAnual <= ESCALA_2) {
      impuestoAnual = (imponibleAnual - ESCALA_1) * 0.15;
    } else if (imponibleAnual <= ESCALA_3) {
      impuestoAnual = 31216.00 + ((imponibleAnual - ESCALA_2) * 0.20);
    } else {
      impuestoAnual = 79776.00 + ((imponibleAnual - ESCALA_3) * 0.25);
    }
    return impuestoAnual;
  };

  const handleShare = () => {
    try {
      const state = btoa(JSON.stringify({
        salario: salarioMensual,
        meses: mesesTrabajados,
        quincena: recibeSegundaQuincena,
        bono: recibeBonificacion,
        sueldosB: sueldosBono
      }));
      const shareUrl = `${window.location.origin}${window.location.pathname}#mi_diciembre?diciembre-state=${state}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiador(true);
      setTimeout(() => setCopiador(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-1">
      
      {/* COLUMN LEFT: INPUTS */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Calculadora "Sueldo #13" (Ingreso de Fin de Año RD)
          </h2>
          <p className="text-xs text-slate-500">
            Estima con exactitud legal tu doble sueldo pascual, el saldo neto de tu segunda quincena ordinaria y el bono corporativo exento de TSS.
          </p>
        </div>

        <div className="space-y-4 text-xs font-semibold">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Salario Ordinario de Referencia (RD$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">RD$</span>
              <input
                type="number"
                value={salarioMensual}
                onChange={e => setSalarioMensual(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white rounded-xl py-2.5 pl-11 pr-3 font-bold font-mono text-slate-850"
                placeholder="45000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Meses laborados en el año ordinario</label>
              <input
                type="number"
                max="12"
                min="1"
                value={mesesTrabajados}
                onChange={e => setMesesTrabajados(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl py-2.5 px-3 font-semibold text-slate-850 font-mono"
                placeholder="12"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Bono de Participación en Utilidades</label>
              <select
                value={sueldosBono}
                onChange={e => setSueldosBono(e.target.value)}
                disabled={!recibeBonificacion}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl py-2.5 px-2 bg-white text-slate-800 disabled:opacity-40"
              >
                <option value="1">1 salario completo (Básico)</option>
                <option value="1.5">1.5 salarios (Pymes)</option>
                <option value="2">2 salarios completos (Líderes)</option>
                <option value="3">3 salarios (Multinacional)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Inclusiones de Pago para Diciembre</span>
            
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/40">
              <div className="space-y-0.5">
                <span className="text-slate-800 text-xs font-bold block">Segunda Quincena de Diciembre (Ordinario)</span>
                <span className="text-[9px] text-slate-450 font-medium">Sujeta a TSS ordinario e ISR proporcional de ley</span>
              </div>
              <input
                type="checkbox"
                checked={recibeSegundaQuincena}
                onChange={e => setRecibeSegundaQuincena(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-250 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/40">
              <div className="space-y-0.5">
                <span className="text-slate-800 text-xs font-bold block">Bono de Participación de Beneficios (Bonificación)</span>
                <span className="text-[9px] text-slate-450 font-medium">Exento de TSS por ley, se descuenta ISR DGII anualizado</span>
              </div>
              <input
                type="checkbox"
                checked={recibeBonificacion}
                onChange={e => setRecibeBonificacion(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-250 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100 print:hidden">
          <button
            onClick={handleShare}
            className="flex-1 font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copiador ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            {copiador ? 'Enlace Copiado' : 'Compartir Resultados'}
          </button>
        </div>

      </div>

      {/* COLUMN RIGHT: OUTCOMES */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-lg self-stretch flex flex-col justify-between min-h-[500px]">
        {resultados ? (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Sueldo #13 Líquido 2026
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2 rounded-full border border-emerald-800 uppercase">
                Exención Regalía: 100%
              </span>
            </div>

            {/* GRAND TOTAL HEADER AREA */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-blue-900/45 text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">Gran Total Líquido a Recibir</span>
                <p className="text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">RD$ {resultados.totalLiquido.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                <div className="inline-flex items-center gap-1.5 pt-1 mt-1 font-semibold text-[10px] text-blue-300">
                  <PartyPopper className="w-3.5 h-3.5 text-blue-400 animate-bounce" /> Todo Sueldo #13 Consolidado
                </div>
              </div>
            </div>

            {/* DETAILED PILL BOXES */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Desglose Legal Detallado de Rubros</p>
              
              {/* 1. REGALÍA */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Gift className="w-4.5 h-4.5 text-rose-450" /> Regalía Pascual (Salario 13)
                  </span>
                  <span className="font-mono font-bold text-emerald-400">RD$ {resultados.regalia.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-450 items-center">
                  <span>Proporción por {mesesTrabajados} meses laborados</span>
                  <span className="text-[9px] bg-slate-850 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-slate-705">100% Tax Free</span>
                </div>
              </div>

              {/* 2. QUINCENA */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4.5 h-4.5 text-blue-400" /> Segunda Quincena Neto
                  </span>
                  <span className="font-mono font-bold text-slate-200">RD$ {resultados.quincenaNeta.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-450">
                  <span>Bruto: RD$ {resultados.quincenaBruta.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span>Taxes/Seguridad Social Aplicados</span>
                </div>
              </div>

              {/* 3. BONIFICACIÓN */}
              {recibeBonificacion && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Scale className="w-4.5 h-4.5 text-amber-500" /> Participación Utilidades (Bono)
                    </span>
                    <span className="font-mono font-bold text-emerald-400">RD$ {resultados.bonoNeto.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-450">
                    <span>Bruto: RD$ {resultados.bonoBruto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    <span className="text-rose-450 font-medium">ISR Retención: -RD$ {resultados.bonoIsr.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-1.5 text-[10px] text-slate-450 italic leading-relaxed pt-2 border-t border-slate-800">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Advertencia: Conforme a la legislación laboral y el Código de Trabajo de la República Dominicana, el Salario de Navidad "Regalía Pascual" es enteramente inembargable y exento de tributos TSS o ISR. La bonificación de utilidades es exenta de TSS pero imponible para el Impuestos de Renta sobre la escala general.</span>
              </div>

            </div>

          </div>
        ) : (
          <p className="text-xs text-slate-400 font-semibold text-center py-10">Cargando resultados...</p>
        )}
        <AdsenseMock slot="midiciembre-ads" type="banner" />
      </div>

    </div>
  );
}
