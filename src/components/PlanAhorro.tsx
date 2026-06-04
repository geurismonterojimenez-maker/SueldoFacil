import React, { useState, useMemo, useEffect } from 'react';
import { 
  Target, DollarSign, Calendar, Sparkles, CheckCircle, Info,
  Award, Printer, Flame, CalendarPlus, User, Layout, Palette, Check
} from 'lucide-react';
import AdsenseMock from './AdsenseMock';

export default function PlanAhorro() {
  // 1. STATE BINDING FOR CONFIGURATOR (CLIENT INPUTS)
  const [nombreCliente, setNombreCliente] = useState<string>('Emprendedor Dominicano');
  const [metaNombre, setMetaNombre] = useState<string>('Inicial de mi Apartamento');
  const [metaMonto, setMetaMonto] = useState<number>(300000);
  const [ahorroInicial, setAhorroInicial] = useState<number>(30000);
  
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [fechaObjetivo, setFechaObjetivo] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 18); // Default 18 months term
    return d.toISOString().split('T')[0];
  });
  
  const [frecuencia, setFrecuencia] = useState<'diario' | 'semanal' | 'quincenal' | 'mensual'>('semanal');
  const [objetivoCategoria, setObjetivoCategoria] = useState<'casa' | 'vehiculo' | 'viaje' | 'negocio' | 'estudios' | 'emergencia' | 'otro'>('casa');
  
  const [colorTema, setColorTema] = useState<string>('azul');
  const [customColorHex, setCustomColorHex] = useState<string>('#0b2042');
  
  const [printTelefono, setPrintTelefono] = useState<string>('809-555-0199');
  const [printInstagram, setPrintInstagram] = useState<string>('sueldofacil');
  const [printFrase, setPrintFrase] = useState<string>('');

  const [markedBlocks, setMarkedBlocks] = useState<Record<number, boolean>>(() => {
    // Default pre-fill some blocks to make dashboard look alive
    const initial: Record<number, boolean> = {};
    for (let i = 1; i <= 15; i++) {
      initial[i] = true;
    }
    return initial;
  });

  // Sync date terms automatically
  const handleTermChange = (months: number) => {
    const start = new Date(fechaInicio);
    start.setMonth(start.getMonth() + Math.max(1, months));
    setFechaObjetivo(start.toISOString().split('T')[0]);
  };

  // 2. DETAILED GOAL CATEGORIES CONFIGURATION (Quotes & Elegant Line vectors)
  const metaIllustrations = useMemo(() => {
    switch (objetivoCategoria) {
      case 'vehiculo':
        return {
          icon: <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 16.5A1.5 1.5 0 1117.5 15h-11A1.5 1.5 0 115 16.5m14-1.5L17 10h-10L4 15m15-1.5V10h-1.5M4 13.5V10h1.5M16 10a1.5 1.41 0 00-1.5-1.41H9.5A1.5 1.41 0 008 10" /></svg>,
          title: 'Vehículo Propio',
          quote: 'Cualquier camino se recorre mejor cuando das el primer paso con planificación y constancia.',
          bg: 'from-blue-200 to-indigo-100',
          gradientHex: '#2563eb',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-80" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="55" x2="110" y2="55" stroke="currentColor" />
              <path d="M20 55 H100 L95 38 C94 35, 90 32, 85 32 H35 C30 32, 26 35, 25 38 Z" stroke="currentColor" />
              <path d="M35 32 L42 20 H78 L85 32" stroke="currentColor" />
              <circle cx="40" cy="55" r="7" className="fill-white" stroke="currentColor" />
              <circle cx="80" cy="55" r="7" className="fill-white" stroke="currentColor" />
              <path d="M55 20 V32" stroke="currentColor" />
            </svg>
          )
        };
      case 'casa':
        return {
          icon: <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
          title: 'Vivienda Anhelada',
          quote: 'Construir un hogar es colocar un ladrillo financiero cada día con paciencia y disciplina.',
          bg: 'from-emerald-200 to-teal-100',
          gradientHex: '#10b981',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-80" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" />
              <rect x="25" y="30" width="35" height="30" stroke="currentColor" />
              <polygon points="20,30 42.5,12 65,30" stroke="currentColor" />
              <rect x="38" y="44" width="9" height="16" stroke="currentColor" />
              <rect x="50" y="36" width="6" height="6" stroke="currentColor" />
              <line x1="53" y1="36" x2="53" y2="42" stroke="currentColor" />
              <line x1="50" y1="39" x2="56" y2="39" stroke="currentColor" />
              <path d="M85,60 L85,45 M75,40 C75,30 95,30 95,40 C95,45 85,50 85,45" stroke="currentColor" />
            </svg>
          )
        };
      case 'viaje':
        return {
          icon: <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
          title: 'Viaje Hermoso',
          quote: 'El mundo no es para contemplarlo, es para vivirlo tras diseñar el viaje de tus sueños.',
          bg: 'from-sky-200 to-blue-105',
          gradientHex: '#0ea5e9',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-80" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 40 Q40 38 60 40 T100 25" stroke="currentColor" />
              <path d="M54 34 L72 15 L78 18 L64 34 M56 36 L43 50 L48 53 L62 38" stroke="currentColor" />
              <path d="M22 36 C42 36, 92 28, 98 25 C102 23, 103 21, 101 20 C99 19, 95 21, 90 23 L22 34 Z" className="fill-white" stroke="currentColor" />
              <circle cx="25" cy="50" r="2" fill="currentColor" />
              <circle cx="85" cy="18" r="1.5" fill="currentColor" />
            </svg>
          )
        };
      case 'estudios':
        return {
          icon: <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
          title: 'Estudios & Futuro',
          quote: 'La educación es la mejor inversión para asegurar retornos extraordinarios en tu crecimiento personal.',
          bg: 'from-violet-200 to-fuchsia-100',
          gradientHex: '#8b5cf6',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-80" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="60,15 100,28 60,41 20,28" stroke="currentColor" />
              <path d="M35 32 V50 C35 55, 85 55, 85 50 V32" stroke="currentColor" />
              <path d="M100 28 V48" stroke="currentColor" />
              <circle cx="100" cy="49" r="2.5" className="fill-current" />
            </svg>
          )
        };
      case 'negocio':
        return {
          icon: <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
          title: 'Emprendimiento',
          quote: 'Comenzar tu propio negocio no es cuestión de suerte, es cuestión de ahorro inteligente y acción.',
          bg: 'from-amber-200 to-yellow-105',
          gradientHex: '#d97706',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-85" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" />
              <rect x="25" y="28" width="50" height="32" stroke="currentColor" />
              <polygon points="20,28 35,16 65,16 80,28" stroke="currentColor" />
              <rect x="35" y="44" width="12" height="16" stroke="currentColor" />
              <rect x="54" y="38" width="14" height="12" stroke="currentColor" />
            </svg>
          )
        };
      case 'emergencia':
        return {
          icon: <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
          title: 'Fondo de Estabilidad',
          quote: 'La tranquilidad de tu familia no tiene precio. Construye un fondo robusto ante cualquier imprevisto.',
          bg: 'from-rose-200 to-orange-100',
          gradientHex: '#f43f5e',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-80" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M60 12 C80 12, 90 18, 90 35 C90 52, 70 60, 60 62 C50 60, 30 52, 30 35 C30 18, 40 12, 60 12 Z" className="fill-white" stroke="currentColor" />
              <path d="M50 35 H70 M60 25 V45" strokeWidth="2.5" />
            </svg>
          )
        };
      case 'otro':
      default:
        return {
          icon: <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
          title: 'Bienestar Financiero',
          quote: 'Tomar el control absoluto de tus finanzas es el maravilloso puente hacia la libertad que mereces.',
          bg: 'from-slate-200 to-stone-100',
          gradientHex: '#64748b',
          detailedVector: (
            <svg viewBox="0 0 120 70" className="w-16 h-12 stroke-current opacity-80" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M35 15 H85 V30 C85 42, 75 52, 60 52 C45 52, 35 42, 35 30 Z" stroke="currentColor" />
              <path d="M60 52 V62 M45 62 H75" stroke="currentColor" />
              <path d="M35 22 H25 C20 22, 20 32, 25 32 H35" stroke="currentColor" />
              <path d="M85 22 H95 C100 22, 100 32, 95 32 H85" stroke="currentColor" />
            </svg>
          )
        };
    }
  }, [objetivoCategoria]);

  // COLOR PALETTES DEFINITIONS
  const colorScheme = useMemo(() => {
    switch (colorTema) {
      case 'verde':
        return {
          primary: 'bg-emerald-600',
          primaryBorder: 'border-emerald-200',
          hex: '#059669',
          tint: '#ecfdf5',
        };
      case 'morado':
        return {
          primary: 'bg-indigo-600',
          primaryBorder: 'border-indigo-200',
          hex: '#4f46e5',
          tint: '#eef2ff',
        };
      case 'dorado':
        return {
          primary: 'bg-amber-600',
          primaryBorder: 'border-amber-200',
          hex: '#b45309',
          tint: '#fef3c7',
        };
      case 'personalizado':
        return {
          primary: 'bg-slate-700',
          primaryBorder: 'border-slate-200',
          hex: customColorHex || '#0f172a',
          tint: `${customColorHex || '#0f172a'}12`,
        };
      case 'azul':
      default:
        return {
          primary: 'bg-blue-900',
          primaryBorder: 'border-blue-200',
          hex: '#0b2042', // Rich Dark Corporate Navy
          tint: '#f0f4f9',
        };
    }
  }, [colorTema, customColorHex]);

  // DATE AND STATS CORE PRECISE MATHEMATICS
  const dateCalculations = useMemo(() => {
    // Standard protective guards to prevent crash/infinite cycles
    const checkedMeta = Math.max(100, metaMonto);
    const checkedInicial = Math.min(checkedMeta - 1, Math.max(0, ahorroInicial));
    
    const start = new Date(fechaInicio);
    const end = new Date(fechaObjetivo);
    
    const diffTime = Math.max(86400000, end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalWeeks = Math.max(1, Number((totalDays / 7).toFixed(1)));
    const totalMonths = Math.max(1, Number((totalDays / 30.43).toFixed(1)));
    
    const remainderToSave = Math.max(0, checkedMeta - checkedInicial);
    
    const dailyRequired = Math.round(remainderToSave / totalDays);
    const weeklyRequired = Math.round(remainderToSave / totalWeeks);
    const monthlyRequired = Math.round(remainderToSave / totalMonths);
    
    return {
      totalDays,
      totalWeeks,
      totalMonths,
      remainderToSave,
      dailyRequired,
      weeklyRequired,
      monthlyRequired
    };
  }, [fechaInicio, fechaObjetivo, metaMonto, ahorroInicial]);

  // THE 100 CASILLAS MULTI-SERIF VALUE SYSTEM
  const gridSystem = useMemo(() => {
    const remainder = dateCalculations.remainderToSave;
    const blockValue = Math.ceil(remainder / 100) || 10;
    return {
      blockCount: 100,
      blockValue: blockValue
    };
  }, [dateCalculations.remainderToSave]);

  // DYNAMIC INTERACTIVITIES STATE CALCULATIONS
  const interactiveState = useMemo(() => {
    const checkedCount = Object.keys(markedBlocks).length;
    const blockValue = gridSystem.blockValue;
    const accumulatedFromGrid = checkedCount * blockValue;
    const totalAccumulated = Math.min(metaMonto, ahorroInicial + accumulatedFromGrid);
    const realRemaining = Math.max(0, metaMonto - totalAccumulated);
    const calculatedPercentage = Math.min(100, Math.round((totalAccumulated / metaMonto) * 100)) || 0;
    
    return {
      checkedCount,
      accumulatedFromGrid,
      totalAccumulated,
      realRemaining,
      calculatedPercentage
    };
  }, [markedBlocks, gridSystem.blockValue, metaMonto, ahorroInicial]);

  // Toggles checked records
  const handleBlockClick = (num: number) => {
    setMarkedBlocks(prev => {
      const next = { ...prev };
      if (next[num]) {
        delete next[num];
      } else {
        next[num] = true;
      }
      return next;
    });
  };

  const resetBoard = () => {
    setMarkedBlocks({});
  };

  const fillAllBlocks = () => {
    const all: Record<number, boolean> = {};
    for (let i = 1; i <= 100; i++) {
      all[i] = true;
    }
    setMarkedBlocks(all);
  };

  // Displays proud Certificate of Achievement once 100% is met!
  const showCertificate = interactiveState.calculatedPercentage >= 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 print:p-0 print:m-0">
      
      {/* ADVERTISING BANNER ROW */}
      <div className="print:hidden">
        <AdsenseMock slot="plan-ahorro-top-horizontal" type="banner" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPACT SIDEBAR CONFIGURATOR */}
        <div id="savings-sidebar" className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-6 print:hidden">
          
          <div className="border-b pb-3.5">
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4.5 h-4.5 text-blue-500 animate-pulse" /> 1. Paleta Visual
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Configura el color para impresión o uso digital.</p>
            
            {/* COLOR THEMES BUTTONS */}
            <div className="grid grid-cols-5 gap-1.5 mt-3">
              <button 
                onClick={() => setColorTema('azul')} 
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${colorTema === 'azul' ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                Azul
              </button>
              <button 
                onClick={() => setColorTema('verde')} 
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${colorTema === 'verde' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                Verde
              </button>
              <button 
                onClick={() => setColorTema('morado')} 
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${colorTema === 'morado' ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                Morado
              </button>
              <button 
                onClick={() => setColorTema('dorado')} 
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${colorTema === 'dorado' ? 'bg-amber-50 border-amber-600 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                Dorado
              </button>
              <button 
                onClick={() => setColorTema('personalizado')} 
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${colorTema === 'personalizado' ? 'bg-slate-250 border-slate-600 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                Custom
              </button>
            </div>

            {/* Custom hex selector */}
            {colorTema === 'personalizado' && (
              <div className="mt-2 text-left flex items-center gap-2">
                <input 
                  type="color" 
                  value={customColorHex} 
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-350"
                />
                <span className="text-[11px] font-mono font-bold dark:text-white uppercase">{customColorHex}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-emerald-500" /> 2. Datos de Mi Plan
            </h2>

            {/* Propietario name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre Propietario</label>
              <input 
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            {/* Goal name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Proyecto / Meta</label>
              <input 
                type="text"
                value={metaNombre}
                onChange={(e) => setMetaNombre(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                placeholder="Ej. Inicial de mi carro"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tipo de Meta</label>
              <select 
                value={objetivoCategoria}
                onChange={(e) => setObjetivoCategoria(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="casa">🏠 Vivienda / Casa Propia</option>
                <option value="vehiculo">🚗 Vehículo / Carro</option>
                <option value="viaje">✈️ Aventura & Viajes</option>
                <option value="negocio">💼 Emprendimiento / Negocio</option>
                <option value="estudios">🎓 Capacitación / Estudios</option>
                <option value="emergencia">🛡️ Fondo de Emergencia</option>
                <option value="otro">❤️ Otro Bienestar Financiero</option>
              </select>
            </div>

            {/* Montos block */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Monto Meta (RD$)</label>
                <input 
                  type="number"
                  value={metaMonto || ''}
                  onChange={(e) => setMetaMonto(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Monto Inicial (RD$)</label>
                <input 
                  type="number"
                  value={ahorroInicial !== undefined ? ahorroInicial : ''}
                  onChange={(e) => setAhorroInicial(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Terms and execution times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Fecha de Inicio</label>
                <input 
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-[11px] font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Plazo (Meses)</label>
                <input 
                  type="number"
                  value={Math.round(dateCalculations.totalMonths)}
                  onChange={(e) => handleTermChange(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  placeholder="Ej. 18"
                />
              </div>
            </div>

            {/* Target Frecuencia */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Frecuencia de Ahorros</label>
              <select
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="diario">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal (Cada 15 días)</option>
                <option value="mensual">Mensual (Un aporte al mes)</option>
              </select>
            </div>
          </div>

          {/* CUSTOM FIRMA CONFIGURATION */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-pink-500" /> 3. Firma y Contacto
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp</label>
                <input 
                  type="text"
                  value={printTelefono}
                  onChange={(e) => setPrintTelefono(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold font-mono text-slate-800 dark:text-white"
                  placeholder="Ej. 809-555-0199"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instagram (@)</label>
                <input 
                  type="text"
                  value={printInstagram}
                  onChange={(e) => setPrintInstagram(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white"
                  placeholder="Ej. sueldofacil"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Frase Motivacional Ajustada</label>
              <textarea 
                rows={2}
                value={printFrase}
                onChange={(e) => setPrintFrase(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white"
                placeholder="Si la dejas vacía, se utilizará el preset correspondiente a la meta seleccionada."
              />
            </div>
          </div>

          {/* GRID CONTROLS */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">4. Acciones del Tablero</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={resetBoard}
                className="py-2 bg-slate-100 hover:bg-slate-250 text-slate-600 rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors border border-slate-200"
              >
                Limpiar Tablero
              </button>
              <button
                onClick={fillAllBlocks}
                className="py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-[10px] font-extrabold cursor-pointer transition-colors"
                style={{ backgroundColor: colorScheme.hex }}
              >
                Llenar al 100%
              </button>
            </div>
          </div>

          {/* MAIN WEBPAGE PRINT BUTTON */}
          <div className="pt-4 border-t border-slate-105 dark:border-slate-800">
            <button
              onClick={() => window.print()}
              className="w-full py-3 px-4 text-white rounded-2xl text-[11px] font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-950/15 uppercase tracking-wider"
              style={{ backgroundColor: colorScheme.hex }}
            >
              <Printer className="w-4 h-4 text-emerald-400" /> Imprimir Planner (Formato Carta)
            </button>
          </div>

          <AdsenseMock slot="plan-ahorro-personalized-sidebar" type="square" />
        </div>

        {/* RIGHT VISUAL WORKSPACE (UNIFIED SHEET PREVIEW) */}
        <div className="lg:col-span-8 flex flex-col justify-center items-center">
          
          <div className="w-full flex items-center justify-between pb-3.5 px-1 print:hidden select-none">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-blue-600" /> VISTA PREVIA DEL PLANNER PREMIUM GUARDABLE EN PDF
            </span>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> IMPRIMIR O REVELAR PDF
            </button>
          </div>

          {/* LETTER BOX PREVIEW WRAPPER */}
          {/* Fulfills design criteria: Comparable to Canva Pro designs, elegant borders, balanced padding, looks extremely clean, fits single standard page bounds in printing */}
          <div 
            id="printable-savings-planner"
            className="w-full max-w-[816px] min-h-[1056px] h-[1056px] print:h-[268mm] bg-white border-[3px] rounded-2xl p-6 relative overflow-hidden text-slate-900 flex flex-col justify-between shadow-xl print:shadow-none print:rounded-none print:p-5 select-none transition-colors duration-150"
            style={{
              borderColor: colorScheme.hex,
              fontFamily: '"Inter", system-ui, sans-serif'
            }}
          >
            {/* 1. BRANDING HEADER */}
            <div className="flex items-center justify-between border-b pb-3.5">
              {/* Left branding */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
                  style={{ backgroundColor: colorScheme.hex }}
                >
                  SF
                </div>
                <div>
                  <div className="text-[15px] font-black tracking-tight text-slate-950 flex items-center gap-1">
                    SueldoFácil
                  </div>
                  <div className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-slate-404">
                    República Dominicana
                  </div>
                </div>
              </div>

              {/* Center Title */}
              <div className="text-center">
                <h1 className="text-[21px] font-black tracking-[4px] text-slate-900 uppercase leading-none">
                  Plan de Ahorro
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1.5 text-[9.5px] font-bold tracking-widest text-slate-400">
                  <span className="w-6 h-[1px] bg-slate-200"></span>
                  <span style={{ color: colorScheme.hex }}>PERSONALIZADO</span>
                  <span className="w-6 h-[1px] bg-slate-200"></span>
                </div>
              </div>

              {/* Right Piggy Bank Custom Line SVG */}
              <div className="shrink-0">
                <svg viewBox="0 0 100 80" className="w-14 h-12 stroke-current fill-none text-slate-700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: colorScheme.hex }}>
                  {/* Piggy Body */}
                  <path d="M50 20 C25 20, 15 35, 15 50 C15 65, 30 70, 50 70 C70 70, 85 65, 85 50 C85 35, 75 20, 50 20 Z" />
                  {/* Piggy Nose */}
                  <path d="M85 45 C89 45, 91 48, 91 52 C91 56, 89 59, 85 59" />
                  <circle cx="88" cy="50" r="1" fill="currentColor" />
                  <circle cx="88" cy="54" r="1" fill="currentColor" />
                  {/* Piggy Ears */}
                  <path d="M30 22 L26 12 L38 20" />
                  {/* Piggy Eyes */}
                  <circle cx="70" cy="38" r="1.5" fill="currentColor" />
                  {/* Piggy Tail */}
                  <path d="M15 45 Q5 40 10 32" />
                  {/* Piggy Legs */}
                  <rect x="32" y="70" width="7" height="4" rx="1" />
                  <rect x="61" y="70" width="7" height="4" rx="1" />
                  {/* Falling Gold Coins */}
                  <circle cx="50" cy="8" r="2.5" />
                  <line x1="50" y1="12" x2="50" y2="14" />
                </svg>
              </div>
            </div>

            {/* 2. FOUR METADATA CARDS */}
            <div className="grid grid-cols-4 gap-2 border-b py-3 text-left">
              {/* Owner */}
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-2">
                <User className="w-4.5 h-4.5 shrink-0" style={{ color: colorScheme.hex }} />
                <div className="min-w-0">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Propietario</div>
                  <div className="text-xs font-extrabold text-slate-900 truncate leading-tight mt-0.5">{nombreCliente || 'Emprendedor'}</div>
                </div>
              </div>

              {/* Goal/Project name */}
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-2">
                <Target className="w-4.5 h-4.5 shrink-0" style={{ color: colorScheme.hex }} />
                <div className="min-w-0">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Proyecto Metas</div>
                  <div className="text-xs font-extrabold text-slate-900 truncate leading-tight mt-0.5">{metaNombre || 'Comprar Vehículo'}</div>
                </div>
              </div>

              {/* Goal Amount */}
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-2">
                <DollarSign className="w-4.5 h-4.5 shrink-0" style={{ color: colorScheme.hex }} />
                <div className="min-w-0">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Monto Objetivo</div>
                  <div className="text-sm font-black text-slate-950 font-mono leading-tight mt-0.5">RD$ {metaMonto.toLocaleString('en-US')}</div>
                </div>
              </div>

              {/* Executive Term */}
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 shrink-0" style={{ color: colorScheme.hex }} />
                <div className="min-w-0">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Plazo Estimado</div>
                  <div className="text-xs font-extrabold text-slate-900 leading-tight mt-0.5">{Math.round(dateCalculations.totalMonths)} Meses ({fechaInicio.split('-')[2] || '04'}/{fechaInicio.split('-')[1] || '06'} al {fechaObjetivo.split('-')[2] || '04'}/{fechaObjetivo.split('-')[1] || '12'})</div>
                </div>
              </div>
            </div>

            {/* 3. HITO DE MOTIVACIÓN BANNER */}
            <div className="p-3 bg-slate-50/40 border border-slate-105 rounded-xl flex items-center justify-between gap-4 my-0.5 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: colorScheme.hex }}></div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  {metaIllustrations.icon}
                </div>
                <div>
                  <div className="text-[8px] font-black tracking-widest text-slate-404 uppercase">Hito de Motivación</div>
                  <blockquote className="text-[11.5px] italic text-slate-700 leading-snug font-serif mt-0.5 max-w-[500px]">
                    "{printFrase || metaIllustrations.quote}"
                  </blockquote>
                </div>
              </div>

              {/* Goal Illustration Vector Column */}
              <div className="shrink-0 text-slate-400 flex items-center">
                {metaIllustrations.detailedVector}
              </div>
            </div>

            {/* 4. SAVINGS FREQUENCIES ROWS */}
            <div className="grid grid-cols-3 gap-3 border-b pb-3.5 pt-1">
              {/* Daily Card */}
              <div 
                className="p-3 bg-white rounded-xl border relative flex items-center gap-3 select-none"
                style={{
                  borderColor: frecuencia === 'diario' ? colorScheme.hex : '#f1f5f9',
                  borderWidth: frecuencia === 'diario' ? '2px' : '1px',
                  backgroundColor: frecuencia === 'diario' ? '#f8fafc' : '#ffffff'
                }}
              >
                {frecuencia === 'diario' && (
                  <span className="absolute top-1 right-2.5 text-[7px] font-black text-white px-1.5 py-0.5 rounded uppercase leading-none" style={{ backgroundColor: colorScheme.hex }}>
                    Elegido
                  </span>
                )}
                <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8.5px] font-black text-slate-404 uppercase tracking-widest">Ahorro Diario</div>
                  <div className="text-base font-black text-slate-900 font-mono tracking-tight mt-0.5">
                    RD$ {dateCalculations.dailyRequired.toLocaleString('en-US')}
                  </div>
                </div>
              </div>

              {/* Weekly Card */}
              <div 
                className="p-3 bg-white rounded-xl border relative flex items-center gap-3 select-none"
                style={{
                  borderColor: frecuencia === 'semanal' ? colorScheme.hex : '#f1f5f9',
                  borderWidth: frecuencia === 'semanal' ? '2px' : '1px',
                  backgroundColor: frecuencia === 'semanal' ? '#f8fafc' : '#ffffff'
                }}
              >
                {frecuencia === 'semanal' && (
                  <span className="absolute top-1 right-2.5 text-[7px] font-black text-white px-1.5 py-0.5 rounded uppercase leading-none" style={{ backgroundColor: colorScheme.hex }}>
                    Elegido
                  </span>
                )}
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8.5px] font-black text-slate-404 uppercase tracking-widest">Ahorro Semanal</div>
                  <div className="text-base font-black text-slate-900 font-mono tracking-tight mt-0.5">
                    RD$ {dateCalculations.weeklyRequired.toLocaleString('en-US')}
                  </div>
                </div>
              </div>

              {/* Monthly Card */}
              <div 
                className="p-3 bg-white rounded-xl border relative flex items-center gap-3 select-none"
                style={{
                  borderColor: frecuencia === 'mensual' ? colorScheme.hex : '#f1f5f9',
                  borderWidth: frecuencia === 'mensual' ? '2px' : '1px',
                  backgroundColor: frecuencia === 'mensual' ? '#f8fafc' : '#ffffff'
                }}
              >
                {frecuencia === 'mensual' && (
                  <span className="absolute top-1 right-2.5 text-[7px] font-black text-white px-1.5 py-0.5 rounded uppercase leading-none" style={{ backgroundColor: colorScheme.hex }}>
                    Elegido
                  </span>
                )}
                <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[8.5px] font-black text-slate-404 uppercase tracking-widest">Ahorro Mensual</div>
                  <div className="text-base font-black text-slate-900 font-mono tracking-tight mt-0.5">
                    RD$ {dateCalculations.monthlyRequired.toLocaleString('en-US')}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. PROGRESS RATIO BAR */}
            <div className="flex flex-col gap-1.5 py-3 border-b">
              <div className="flex justify-between items-center text-[9px] uppercase font-bold text-slate-404 tracking-wider">
                <span>Porcentaje del Objetivo Completado</span>
                <span className="text-xs font-black" style={{ color: colorScheme.hex }}>{interactiveState.calculatedPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-205/20 p-0.5 flex">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, interactiveState.calculatedPercentage)}%`,
                    backgroundColor: colorScheme.hex
                  }}
                ></div>
              </div>

              {/* Progress dynamic metadata counters block */}
              <div className="grid grid-cols-5 text-center text-[8.5px] font-bold text-slate-500 pt-2 font-sans tracking-tight">
                <div className="border-r border-slate-200 pr-1">
                  <span className="block text-[7.5px] text-slate-400 uppercase">Ahorrado</span>
                  <span className="text-slate-900 font-extrabold truncate block">RD$ {interactiveState.totalAccumulated.toLocaleString('en-US')}</span>
                </div>
                <div className="border-r border-slate-200 px-1">
                  <span className="block text-[7.5px] text-slate-400">INICIAL</span>
                  <span className="text-slate-900 font-extrabold truncate block">RD$ {ahorroInicial.toLocaleString('en-US')}</span>
                </div>
                <div className="border-r border-slate-200 px-1">
                  <span className="block text-[7.5px] text-slate-404">AHORRO EN GRID</span>
                  <span className="text-slate-900 font-extrabold truncate block">RD$ {interactiveState.accumulatedFromGrid.toLocaleString('en-US')}</span>
                </div>
                <div className="border-r border-slate-200 px-1">
                  <span className="block text-[7.5px] text-slate-404">RESTANTE</span>
                  <span className="text-red-700 font-extrabold truncate block">RD$ {interactiveState.realRemaining.toLocaleString('en-US')}</span>
                </div>
                <div className="pl-1">
                  <span className="block text-[7.5px] text-slate-404">META TOTAL</span>
                  <span className="text-slate-900 font-extrabold truncate block">RD$ {metaMonto.toLocaleString('en-US')}</span>
                </div>
              </div>
            </div>

            {/* 6. SAVINGS PROGRESS BOARD GRID (100 CASILLAS) */}
            <div className="py-3 flex-1 flex flex-col justify-between select-none">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wider pb-1.5">
                <span>Mesa de Progreso de Ahorro • 100 Casillas de RD$ {gridSystem.blockValue.toLocaleString('en-US')}</span>
                <span className="text-[8px] font-semibold text-slate-400 normal-case tracking-normal print:hidden">
                  * Haz clic en las casillas para colorearlas
                </span>
              </div>
              
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 100 }).map((_, idx) => {
                  const num = idx + 1;
                  const isChecked = markedBlocks[num] || false;
                  const valueToShow = gridSystem.blockValue;
                  
                  // short formatting helper for grid values
                  const formatBlockValShort = (val: number) => {
                    if (val >= 1000000) {
                      return `${(val / 1000000).toFixed(1)}M`;
                    } else if (val >= 10000) {
                      return `${(val / 1000).toFixed(0)}k`;
                    } else {
                      return val.toLocaleString('en-US');
                    }
                  };

                  return (
                    <div
                      key={idx}
                      id={`casilla-${num}`}
                      onClick={() => handleBlockClick(num)}
                      className="h-[10.5mm] print:h-[9.5mm] flex flex-col justify-between p-1 rounded-lg border text-center transition-all cursor-pointer box-border relative overflow-hidden select-none"
                      style={{
                        borderColor: isChecked ? colorScheme.hex : '#e2e8f0',
                        backgroundColor: isChecked ? colorScheme.hex : '#ffffff',
                        color: isChecked ? '#ffffff' : '#0f172a'
                      }}
                    >
                      {/* Check overlap icon */}
                      {isChecked && (
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center print:hidden">
                          <Check className="w-4 h-4 text-white opacity-80" strokeWidth={3} />
                        </div>
                      )}
                      <span className={`text-[7px] print:text-[6.5px] font-bold block ${isChecked ? 'text-white/60' : 'text-slate-404'}`}>
                        {num}
                      </span>
                      <span className={`text-[10px] print:text-[9.5px] font-black font-mono tracking-tighter leading-none mt-0.5 block ${isChecked ? 'text-white' : 'text-slate-800'}`}>
                        {formatBlockValShort(valueToShow)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. MILISTONES TRACK (HITOS IMPORTANTES) */}
            <div className="py-2.5 border-t border-slate-100">
              <div className="text-[8.5px] font-black text-slate-400 tracking-wider uppercase text-center mb-2">
                Hitos de Progreso Clave
              </div>
              <div className="grid grid-cols-4 gap-2">
                {/* 25% Hito */}
                <div className="p-2 border border-slate-150/60 rounded-xl flex items-center gap-2 bg-slate-50/20 min-w-0">
                  <div className={`p-1.5 rounded-lg ${interactiveState.calculatedPercentage >= 25 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-300'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[7.5px] font-black text-slate-400">HITO 25%</span>
                    <span className="block text-[10px] font-extrabold text-slate-900 leading-none truncate">RD$ {(metaMonto * 0.25).toLocaleString('en-US')}</span>
                  </div>
                </div>

                {/* 50% Hito */}
                <div className="p-2 border border-slate-150/60 rounded-xl flex items-center gap-2 bg-slate-50/20 min-w-0">
                  <div className={`p-1.5 rounded-lg ${interactiveState.calculatedPercentage >= 50 ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-300'}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[7.5px] font-black text-slate-400">HITO 50%</span>
                    <span className="block text-[10px] font-extrabold text-slate-900 leading-none truncate">RD$ {(metaMonto * 0.5).toLocaleString('en-US')}</span>
                  </div>
                </div>

                {/* 75% Hito */}
                <div className="p-2 border border-slate-150/60 rounded-xl flex items-center gap-2 bg-slate-50/20 min-w-0">
                  <div className={`p-1.5 rounded-lg ${interactiveState.calculatedPercentage >= 75 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-300'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[7.5px] font-black text-slate-400">HITO 75%</span>
                    <span className="block text-[10px] font-extrabold text-slate-900 leading-none truncate">RD$ {(metaMonto * 0.75).toLocaleString('en-US')}</span>
                  </div>
                </div>

                {/* 100% Hito */}
                <div className="p-2 border border-slate-150/60 rounded-xl flex items-center gap-2 bg-slate-50/20 min-w-0">
                  <div className={`p-1.5 rounded-lg ${interactiveState.calculatedPercentage >= 100 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-300'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[7.5px] font-black text-slate-400">METAS 100%</span>
                    <span className="block text-[10px] font-extrabold text-slate-900 leading-none truncate font-mono">RD$ {metaMonto.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. FOOTER METADATA FIRMA */}
            <div className="flex items-center justify-between border-t border-slate-150/65 pt-2.5 mt-1 text-[9.5px] font-bold text-slate-400 font-sans tracking-wide">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: colorScheme.hex }} />
                <span>INICIO: <span className="text-slate-705">{fechaInicio}</span></span>
              </div>
              <div className="flex items-center gap-4">
                {printTelefono && (
                  <span className="hidden sm:inline">WhatsApp: <span className="text-slate-705 font-mono font-bold">{printTelefono}</span></span>
                )}
                {printInstagram && (
                  <span>Instagram: <span className="text-slate-705">@{printInstagram}</span></span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: colorScheme.hex }} />
                <span>OBJETIVO: <span className="text-slate-705">{fechaObjetivo}</span></span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* EXTRA PREMIUM SECTION: CERTIFICADO DE LOGRO AL 100% */}
      {showCertificate && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white relative shadow-2xl space-y-4 max-w-4xl mx-auto print:hidden">
          <div className="absolute top-3 right-4 font-mono text-[9px] font-bold text-yellow-200 uppercase tracking-widest animate-pulse border border-yellow-500/30 px-2 py-0.5 rounded-full bg-slate-900/40">
            ★ METAS CONSEGUIDAS (100%)
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
              <Award className="w-16 h-16 text-yellow-200 animate-bounce" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-xl font-black tracking-tight uppercase">¡Felicidades, {nombreCliente}!</h3>
              <p className="text-sm text-yellow-50 leading-relaxed font-semibold">
                Has alcanzado el 100% de tu plan de ahorro para <span className="font-extrabold text-white text-base">"{metaNombre}"</span>. 
                Tu esfuerzo, disciplina y constancia han valido la pena. ¡Guarda tu plan completado o imprímelo con orgullo!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-900 rounded-3xl p-6 max-w-4xl mx-auto space-y-4 text-left print:hidden">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Info className="w-4.5 h-4.5 text-blue-500" /> Consultas frecuentes sobre tu Planificador
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-black text-slate-800 dark:text-slate-200">¿Cómo funciona el Tablero Diario?</span>
            <p className="text-slate-500 leading-relaxed font-semibold">
              El tablero divide exactamente el monto restante (monto total menos tu ahorro inicial) en 100 casillas idénticas. Cada casilla representa un aporte fijo e igualitario. Conforme vayas depositando a tu hucha o cuenta, ve tachando digitalmente en la web o imprímelo para rotularlo a mano.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-black text-slate-800 dark:text-slate-200">¿Cómo descargo mi hoja en formato PDF?</span>
            <p className="text-slate-500 leading-relaxed font-semibold">
              Haz clic en el botón de "Imprimir Planner". En el cuadro de diálogo de impresión que abre el navegador por defecto, selecciona "Guardar como PDF" como destino en lugar de una impresora física. Esto generará de forma gratuita un documento PDF vectorial premium idéntico.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
