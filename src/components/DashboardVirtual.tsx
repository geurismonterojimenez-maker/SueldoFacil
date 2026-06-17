import React, { useState, useEffect } from 'react';
import { DollarSign, History, TrendingUp, HelpCircle, Download, Database, LayoutDashboard, Sparkles, Check, ChevronRight, User, Wallet, Percent, CreditCard, ShieldCheck } from 'lucide-react';
import { MINIMUM_WAGE_CATEGORIES } from '../constants';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

interface CalculationLog {
  id: string;
  type: string;
  label: string;
  result: number;
  timestamp: string;
  rawState?: any;
}

interface Props {
  historyLogs: CalculationLog[];
  onClearHistory: () => void;
  onSelectCalculation: (calc: any) => void;
}

const SECTOR_INDICATORS = [
  { sector: 'Tecnología & Software', promedio: 75000, demanda: 'Muy Alta' },
  { sector: 'Banca & Servicios Financieros', promedio: 62000, demanda: 'Alta' },
  { sector: 'Turismo, Hotelería & Alimentos', promedio: 28000, demanda: 'Media' },
  { sector: 'Call Centers & BPO', promedio: 38000, demanda: 'Muy Alta' },
  { sector: 'Construcción & Minería', promedio: 45000, demanda: 'Media' },
  { sector: 'Salud & Farma', promedio: 52000, demanda: 'Alta' },
  { sector: 'Manufactura & Zonas Francas', promedio: 22000, demanda: 'Alta' },
];

export default function DashboardVirtual({ historyLogs, onClearHistory, onSelectCalculation }: Props) {
  const [percentIncrement, setPercentIncrement] = useState('15');
  const [baseSalary, setBaseSalary] = useState('50000');
  const [incrementResult, setIncrementResult] = useState<any>(null);
  const [targetSavingsPercent, setTargetSavingsPercent] = useState('10');

  // "Mi Perfil Laboral" Persistent Store States
  const [profileSalario, setProfileSalario] = useState(() => localStorage.getItem('sueldofacil_prof_salario') || '35000');
  const [profileFrecuencia, setProfileFrecuencia] = useState(() => localStorage.getItem('sueldofacil_prof_frecuencia') || 'mensual');
  const [profileFechaIngreso, setProfileFechaIngreso] = useState(() => localStorage.getItem('sueldofacil_prof_fecha_ingreso') || '2024-01-01');
  const [profileEmpresa, setProfileEmpresa] = useState(() => localStorage.getItem('sueldofacil_prof_empresa') || 'grande');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = () => {
    localStorage.setItem('sueldofacil_prof_salario', profileSalario);
    localStorage.setItem('sueldofacil_prof_frecuencia', profileFrecuencia);
    localStorage.setItem('sueldofacil_prof_fecha_ingreso', profileFechaIngreso);
    localStorage.setItem('sueldofacil_prof_empresa', profileEmpresa);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  useEffect(() => {
    const original = parseFloat(baseSalary) || 0;
    const factor = (parseFloat(percentIncrement) || 0) / 100;
    const nuevoBruto = original * (1 + factor);

    const calcOriginal = calcularSalarioNeto({ salarioBruto: baseSalary, ingresosAdicionales: '0' });
    const calcNuevo = calcularSalarioNeto({ salarioBruto: nuevoBruto.toString(), ingresosAdicionales: '0' });

    setIncrementResult({
      brutoOriginal: original,
      brutoNuevo: nuevoBruto,
      netoOriginal: calcOriginal.salarioNeto,
      netoNuevo: calcNuevo.salarioNeto,
      diferenciaNeto: calcNuevo.salarioNeto - calcOriginal.salarioNeto,
      descuentosNuevos: calcNuevo.retencionesTotales
    });
  }, [baseSalary, percentIncrement]);

  // Aggregate amounts accumulated across simulations to create digital-bank "Derechos Acumulados"
  const totalPrestacionesCalculadas = historyLogs
    .filter(l => l.type.toLowerCase().includes('prestaciones') || l.type.toLowerCase().includes('liquidación'))
    .reduce((sum, current) => sum + (current.result || 0), 0);

  const totalSueldosNetosCalculados = historyLogs
    .filter(l => l.type.toLowerCase().includes('neto') || l.type.toLowerCase().includes('mensual'))
    .reduce((sum, current) => sum + (current.result || 0), 0);

  const avgNetSueldos = totalSueldosNetosCalculados > 0 
    ? totalSueldosNetosCalculados / historyLogs.filter(l => l.type.toLowerCase().includes('neto') || l.type.toLowerCase().includes('mensual')).length
    : 45000;

  const ahorroMensualEstimado = (avgNetSueldos * (parseFloat(targetSavingsPercent) / 100)) || 0;

  const exportExcelMock = () => {
    let csv = "data:text/csv;charset=utf-8,";
    csv += "ID,Tipo de Calculo,Valor,Fecha\n";
    historyLogs.forEach(log => {
      csv += `"${log.id}","${log.type}",${log.result},"${log.timestamp}"\n`;
    });
    const encoded = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "sueldofacil_historial_calculado.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in text-xs font-semibold">
      
      {/* PERSONAL DIGITAL BANK BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-sm border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-blue-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Sesión de Consulta Encriptada Local (TSS 2026)
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Mi Panel de Banca Laboral</h1>
            <p className="text-slate-400 max-w-xl text-[11px] leading-relaxed">
              Consolida el historial de tus derechos salariales autogestionados de ley, prestaciones de cesantía liquidadas y estadísticas de consumo locales.
            </p>
          </div>

          {/* BALANCE METRIC CARDS */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-900/80 border border-slate-705 p-4 rounded-2xl min-w-[150px] space-y-1">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Patrimonio de Derechos</span>
              <p className="text-lg font-extrabold text-blue-400 font-mono">RD$ {totalPrestacionesCalculadas.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <span className="text-[8px] text-slate-500 block">Liquidaciones simuladas</span>
            </div>
            
            <div className="bg-slate-900/80 border border-slate-705 p-4 rounded-2xl min-w-[150px] space-y-1">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Sueldo Promedio Neto</span>
              <p className="text-lg font-extrabold text-emerald-400 font-mono">RD$ {avgNetSueldos.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <span className="text-[8px] text-slate-500 block">Estimado en base a consultas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPACTS: INTERACTIVE METRIC WIDGETS */}
        <div className="lg:col-span-7 space-y-8">

          {/* MI PERFIL LABORAL PANEL */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-blue-600" />
                  Mi Perfil Laboral (Autocompletar Activo)
                </h3>
                <p className="text-[11px] text-slate-450">Guarda tus datos ordinarios para pre-completar todas las calculadoras automáticamente al abrirlas.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Salario Bruto (RD$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10.5px] font-bold text-slate-400">RD$</span>
                  <input
                    type="number"
                    value={profileSalario}
                    onChange={(e) => setProfileSalario(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-3 text-xs font-bold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-550/20 focus:bg-white"
                    placeholder="35000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  value={profileFechaIngreso}
                  onChange={(e) => setProfileFechaIngreso(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-550/20 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sector o Clasificación de Empresa</label>
                <select
                  value={profileEmpresa}
                  onChange={(e) => setProfileEmpresa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-550/20 focus:bg-white z-20"
                >
                  <option value="grande">Sector Grande (TSS Base RD$ 24,150)</option>
                  <option value="mediana">Sector Mediano (TSS Base RD$ 22,138)</option>
                  <option value="pequena">Sector Pequeño (TSS Base RD$ 14,835)</option>
                  <option value="micro">Microempresa (TSS Base RD$ 13,685)</option>
                  <option value="zona_franca">Zonas Francas (RD$ 16,700)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Frecuencia de Recibo de Nómina</label>
                <select
                  value={profileFrecuencia}
                  onChange={(e) => setProfileFrecuencia(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-550/20 focus:bg-white z-20"
                >
                  <option value="mensual">Mensual (Un cobro fijo)</option>
                  <option value="quincenal">Quincenal (Dos cobros fijos)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <span className="text-[10px] text-slate-400 font-medium italic">
                * Custodiado localmente conforme a la política de datos YMYL de AdSense.
              </span>
              <button
                onClick={handleSaveProfile}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Guardado Correctamente
                  </>
                ) : (
                  "Guardar en este Navegador"
                )}
              </button>
            </div>
          </div>
          
          {/* DIGITAL BANK ACCOUNT WIDGET FOR HISTORIC LOGS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Wallet className="w-4.5 h-4.5 text-blue-600" />
                  Saldos de Simulación & Recibos Guardados
                </h3>
                <p className="text-[11px] text-slate-400">Tus cotizaciones previas almacenadas de forma local y privada en tu buscador.</p>
              </div>

              {historyLogs.length > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={exportExcelMock}
                    className="text-[10px] font-bold text-slate-550 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                  <button
                    onClick={onClearHistory}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-750 cursor-pointer transition-colors"
                  >
                    Vaciar todo
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {historyLogs.map(log => (
                <div
                  key={log.id}
                  onClick={() => onSelectCalculation(log)}
                  className="p-3.5 border border-slate-100 hover:border-blue-500/30 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span className="font-extrabold text-slate-800 capitalize text-xs">{log.type.replace('_',' ')}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono font-normal pl-3.5">{log.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold font-mono text-slate-900">
                    {log.label}
                    <ChevronRight className="w-4 h-4 text-slate-450" />
                  </div>
                </div>
              ))}

              {historyLogs.length === 0 && (
                <div className="text-center py-8 space-y-2">
                  <p className="text-slate-400 font-medium leading-relaxed max-w-sm mx-auto text-xs">
                    No posees cálculos guardados actualmente. Usa nuestras calculadoras principales y haz click en "Guardar en mi Historial" para verlos agregados aquí en tiempo real.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ACCUMULATED LIQUIDATION TRENDS BAR CHART */}
          {historyLogs.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
                  Historial de Tendencia de Cotización
                </h3>
                <p className="text-[11px] text-slate-400">Evolución de montos de saldos (en miles de RD$) registrados secuencialmente.</p>
              </div>

              {/* RENDER INLINE SVG GRAPH FOR METRICS */}
              <div className="relative pt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end h-32 w-full px-6 border-b border-slate-200">
                  {historyLogs.slice(-5).map((log, idx) => {
                    const maxVal = Math.max(...historyLogs.map(l => l.result || 1000));
                    const percentageHeight = Math.max(15, ((log.result || 0) / maxVal) * 90);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 w-1/5 group">
                        <div 
                          className="bg-blue-600/85 group-hover:bg-blue-600 hover:scale-105 rounded-t-md w-8 transition-all duration-300" 
                          style={{ height: `${percentageHeight}px` }}
                        ></div>
                        <span className="text-[9px] font-bold text-slate-500 font-mono">
                          RD$ {log.result >= 1000 ? `${Math.round(log.result/1000)}K` : log.result}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-slate-400 px-6 mt-2 uppercase tracking-wide">
                  {historyLogs.slice(-5).map((log, idx) => (
                    <span key={idx} className="w-1/5 text-center truncate">{log.type.split(' ')[0]}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC SAVINGS & PERSONAL PROTECTION PLANNER */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-emerald-600" />
                Planificador de Ahorro y Emergencia Familiar 2026
              </h3>
              <p className="text-[11px] text-slate-400">Calcula tu colchón financiero mensual según tu tasa de ahorro asignada sobre la media cotizada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Sueldo de Referencia (RD$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">RD$</span>
                  <input
                    type="number"
                    value={avgNetSueldos}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-10 pr-3 text-xs font-bold font-mono text-slate-700"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Meta de Ahorro (%)</label>
                <select
                  value={targetSavingsPercent}
                  onChange={e => setTargetSavingsPercent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-2.5 text-xs font-bold text-slate-800"
                >
                  <option value="5">Ahorrar 5% (Básico)</option>
                  <option value="10">Ahorrar 10% (Recomendado)</option>
                  <option value="15">Ahorrar 15% (Estratégico)</option>
                  <option value="20">Ahorrar 20% (Avanzado)</option>
                  <option value="30">Ahorrar 30% (Retiro Temprano)</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-xl flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="text-emerald-700 font-bold block">Tu Ahorro Neto Mensual Estimado:</span>
                <span className="text-[10px] text-emerald-600 font-medium block">Poder acumulado en 1 año</span>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-base font-extrabold text-emerald-800 font-mono">RD$ {ahorroMensualEstimado.toLocaleString('en-US', { maximumFractionDigits: 0 })}/Mes</p>
                <p className="text-[10px] font-extrabold text-emerald-600 font-mono">RD$ {(ahorroMensualEstimado * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}/Año</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT WIDGETS: WAGE THRESHOLDS & BENCHMARKS */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* SIMULADOR DE INCREMENTO PORTÁTIL INTEGRADO */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-blue-600 fill-blue-600/10" />
                Simulador Rápido de Aumento
              </h3>
              <p className="text-[11px] text-slate-400">Cotiza el excedente fiscal para ver en cuánto subiría tu nómina neta liquidada.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-450 uppercase font-bold block">Bruto Tentativo</span>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={e => setBaseSalary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-bold font-mono text-slate-800 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-450 uppercase font-bold block">Porcentaje</span>
                <select
                  value={percentIncrement}
                  onChange={e => setPercentIncrement(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-1 bg-white text-xs font-bold text-slate-800"
                >
                  <option value="5">+5%</option>
                  <option value="10">+10%</option>
                  <option value="15">+15%</option>
                  <option value="20">+20%</option>
                  <option value="25">+25%</option>
                  <option value="30">+30%</option>
                </select>
              </div>
            </div>

            {incrementResult && (
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Nuevo Neto Mensual</span>
                  <span className="font-mono font-bold text-emerald-600">RD$ {incrementResult.netoNuevo.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Beneficio Neto Extra</span>
                  <span className="font-mono font-bold text-blue-600">+RD$ {incrementResult.diferenciaNeto.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            )}
          </div>

          {/* SECTOR AVERAGES */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
                Salario Promedio por Sector RD
              </h3>
              <p className="text-[11px] text-slate-400">Conoce las medias salariales aproximadas del mercado local.</p>
            </div>

            <div className="space-y-3">
              {SECTOR_INDICATORS.map((sec, i) => (
                <div key={i} className="flex justify-between items-center p-2 border border-slate-50 bg-slate-50/40 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block text-[11px]">{sec.sector}</span>
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-extrabold uppercase">Demanda: {sec.demanda}</span>
                  </div>
                  <span className="font-bold font-mono text-slate-900 text-xs">RD$ {sec.promedio.toLocaleString('en-US')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* OFFICIAL WAGES GRID */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">Salarios Mínimos Oficiales RD</h3>
              <p className="text-[11px] text-slate-400 mt-1">Sueldos vigentes recomendados por el Comité Nacional de Salarios.</p>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {MINIMUM_WAGE_CATEGORIES.map(cat => (
                <div key={cat.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div className="max-w-[70%]">
                    <span className="font-semibold text-slate-350 block leading-snug">{cat.label}</span>
                  </div>
                  <span className="font-bold font-mono text-blue-400 shrink-0">RD$ {cat.wage.toLocaleString('en-US')}</span>
                </div>
              ))}
            </div>
          </div>

          <AdsenseMock slot="dashboard-panel" type="square" />
        </div>

      </div>
    </div>
  );
}
