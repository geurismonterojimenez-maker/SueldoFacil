import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Target, DollarSign, Calendar, Sparkles, ChevronDown, ChevronUp, CheckCircle, Info,
  Award, Download, Printer, Percent, Flame, Upload, RefreshCw, Car, Home, Plane, 
  GraduationCap, Briefcase, ShieldAlert, Heart, CalendarPlus, User, Layout, Palette, Check
} from 'lucide-react';
import AdsenseMock from './AdsenseMock';

export default function PlanAhorro() {
  // CLIENT & GOAL DATA
  const [nombreCliente, setNombreCliente] = useState('Emprendedor Dominicano');
  const [metaNombre, setMetaNombre] = useState('Inicial de mi Apartamento');
  const [metaMonto, setMetaMonto] = useState<number>(300000);
  const [ahorroInicial, setAhorroInicial] = useState<number>(30000);
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [fechaObjetivo, setFechaObjetivo] = useState<string>(() => {
    const target = new Date();
    target.setMonth(target.getMonth() + 18); // 18 months default
    return target.toISOString().split('T')[0];
  });
  const [frecuencia, setFrecuencia] = useState<'diario' | 'semanal' | 'quincenal' | 'mensual'>('mensual');
  const [objetivoCategoria, setObjetivoCategoria] = useState<'vehiculo' | 'casa' | 'viaje' | 'estudios' | 'negocio' | 'emergencia' | 'otro'>('casa');
  
  // COSMETIC & PERSONALIZATION OPTIONS
  const [colorTema, setColorTema] = useState<'azul' | 'verde' | 'morado' | 'dorado' | 'personalizado'>('azul');
  const [customColorHex, setCustomColorHex] = useState<string>('#1e40af'); // Royal blue default
  const [metaFotoUrl, setMetaFotoUrl] = useState<string>(''); // Base64 or external source
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});
  
  // SAVINGS GRID BOARD CONFIGURATION
  // Options: Autocalculated (Default matches to fill exactly 100 sheets) or user manual block denomination
  const [bloquesModo, setBloquesModo] = useState<'cien' | 'doscientos' | 'quinientas' | 'mil' | 'custom'>('cien');
  const [customBlockValue, setCustomBlockValue] = useState<number>(1000);
  const [markedBlocks, setMarkedBlocks] = useState<Record<number, boolean>>({});

  // Trigger sound effect or trigger celebratory popup for 100% completion
  const [showCertificate, setShowCertificate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // FAQ toggling
  const toggleFaq = (index: number) => {
    setOpenFaq(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Convert uploaded image file to DataURL base64 for reliable printing integration
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMetaFotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-compiled elegant vector preview presets inside pure HTML/inline SVGs corresponding to goal categorization
  const metaIllustrations = useMemo(() => {
    switch (objetivoCategoria) {
      case 'vehiculo':
        return {
          icon: <Car className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Vehículo Propio',
          quote: 'Cualquier camino se recorre mejor cuando das el primer paso con planificación.',
          bg: 'from-blue-200 to-indigo-100',
          gradientHex: '#2563eb'
        };
      case 'casa':
        return {
          icon: <Home className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Vivienda Anhelada',
          quote: 'Construir un hogar es colocar un ladrillo financiero cada día con consistencia.',
          bg: 'from-emerald-200 to-teal-100',
          gradientHex: '#10b981'
        };
      case 'viaje':
        return {
          icon: <Plane className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Aventura & Viajes',
          quote: 'El mundo no es para contemplarlo, es para vivirlo tras planificar el viaje de tus sueños.',
          bg: 'from-sky-200 to-blue-100',
          gradientHex: '#0ea5e9'
        };
      case 'estudios':
        return {
          icon: <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Capacitación & Estudios',
          quote: 'La educación es la mejor inversión para asegurar retornos extraordinarios en tu futuro.',
          bg: 'from-violet-200 to-fuchsia-100',
          gradientHex: '#8b5cf6'
        };
      case 'negocio':
        return {
          icon: <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Emprendimiento Propio',
          quote: 'Ser tu propio jefe no es cuestión de suerte, es cuestión de ahorro inteligente y acción.',
          bg: 'from-amber-200 to-yellow-100',
          gradientHex: '#d97706'
        };
      case 'emergencia':
        return {
          icon: <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Fondo de Estabilidad',
          quote: 'La paz mental absoluta no tiene precio. Protege a los tuyos ante imprevistos.',
          bg: 'from-rose-200 to-orange-100',
          gradientHex: '#f43f5e'
        };
      case 'otro':
      default:
        return {
          icon: <Heart className="w-8 h-8 md:w-10 md:h-10 text-slate-800" />,
          title: 'Bienestar Financiero',
          quote: 'El éxito inicia en el preciso instante en que decides tomar el control de tu dinero.',
          bg: 'from-slate-200 to-stone-100',
          gradientHex: '#64748b'
        };
    }
  }, [objetivoCategoria]);

  // COLOR SCHEMES CONFIGURATION FOR PREMIUM PLANNER PRINTING
  const colorScheme = useMemo(() => {
    switch (colorTema) {
      case 'verde':
        return {
          primary: 'bg-emerald-600',
          primaryBorder: 'border-emerald-200',
          primaryText: 'text-emerald-700',
          bannerBg: 'bg-emerald-50 dark:bg-emerald-950/20',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          accentBorder: 'border-emerald-600',
          lightBg: 'bg-emerald-50/50',
          hex: '#059669',
          tint: '#ecfdf5',
          darkText: 'text-emerald-900',
          gradient: 'from-emerald-700 to-teal-800'
        };
      case 'morado':
        return {
          primary: 'bg-indigo-600',
          primaryBorder: 'border-indigo-200',
          primaryText: 'text-indigo-700',
          bannerBg: 'bg-indigo-50 dark:bg-indigo-950/20',
          badgeBg: 'bg-indigo-100 text-indigo-800',
          accentBorder: 'border-indigo-600',
          lightBg: 'bg-indigo-50/50',
          hex: '#4f46e5',
          tint: '#eef2ff',
          darkText: 'text-indigo-900',
          gradient: 'from-indigo-700 to-purple-800'
        };
      case 'dorado':
        return {
          primary: 'bg-amber-600',
          primaryBorder: 'border-amber-200',
          primaryText: 'text-amber-700',
          bannerBg: 'bg-amber-50 dark:bg-amber-950/20',
          badgeBg: 'bg-amber-100 text-amber-800',
          accentBorder: 'border-amber-600',
          lightBg: 'bg-amber-50/50',
          hex: '#b45309',
          tint: '#fef3c7',
          darkText: 'text-amber-900',
          gradient: 'from-amber-600 to-yellow-700'
        };
      case 'personalizado':
        return {
          primary: 'bg-slate-700',
          primaryBorder: 'border-slate-200',
          primaryText: 'text-slate-800',
          bannerBg: 'bg-slate-50 dark:bg-slate-950/20',
          badgeBg: 'bg-slate-100 text-slate-800',
          accentBorder: 'border-slate-800',
          lightBg: 'bg-slate-50/50',
          hex: customColorHex,
          tint: `${customColorHex}10`,
          darkText: 'text-slate-950',
          gradient: `from-[${customColorHex}] to-slate-900`
        };
      case 'azul':
      default:
        return {
          primary: 'bg-blue-600',
          primaryBorder: 'border-blue-200',
          primaryText: 'text-blue-700',
          bannerBg: 'bg-blue-50 dark:bg-blue-950/20',
          badgeBg: 'bg-blue-100 text-blue-800',
          accentBorder: 'border-blue-600',
          lightBg: 'bg-blue-50/50',
          hex: '#2563eb',
          tint: '#eff6ff',
          darkText: 'text-blue-900',
          gradient: 'from-blue-700 to-indigo-800'
        };
    }
  }, [colorTema, customColorHex]);

  // MATH CORE COMPUTATIONS FOR PLANNER STATISTICS
  const dateCalculations = useMemo(() => {
    const start = new Date(fechaInicio);
    const end = new Date(fechaObjetivo);
    
    // Total Difference in Days & Weeks
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalWeeks = Math.max(1, Number((totalDays / 7).toFixed(1)));
    const totalMonths = Math.max(1, Number((totalDays / 30.43).toFixed(1)));
    
    const remainderToSave = Math.max(0, metaMonto - ahorroInicial);
    
    // Periodic Requirements
    const dailyRequired = Math.round(remainderToSave / totalDays);
    const weeklyRequired = Math.round(remainderToSave / totalWeeks);
    const biweeklyRequired = Math.round(remainderToSave / (totalMonths * 2));
    const monthlyRequired = Math.round(remainderToSave / totalMonths);

    let periodLabel = 'Mensual';
    let saveAmountPerPeriod = monthlyRequired;
    let totalPeriodsCount = Math.ceil(totalMonths);

    if (frecuencia === 'diario') {
      periodLabel = 'Diario';
      saveAmountPerPeriod = dailyRequired;
      totalPeriodsCount = totalDays;
    } else if (frecuencia === 'semanal') {
      periodLabel = 'Semanal';
      saveAmountPerPeriod = weeklyRequired;
      totalPeriodsCount = Math.ceil(totalWeeks);
    } else if (frecuencia === 'quincenal') {
      periodLabel = 'Quincenal';
      saveAmountPerPeriod = biweeklyRequired;
      totalPeriodsCount = Math.ceil(totalMonths * 2);
    }

    return {
      totalDays,
      totalWeeks,
      totalMonths,
      remainderToSave,
      dailyRequired,
      weeklyRequired,
      biweeklyRequired,
      monthlyRequired,
      saveAmountPerPeriod,
      periodLabel,
      totalPeriodsCount
    };
  }, [fechaInicio, fechaObjetivo, metaMonto, ahorroInicial, frecuencia]);

  // SAVING GRID BLOCKS SYSTEM
  // Dynamic number of blocks and individual value based on setup configuration
  const gridSystem = useMemo(() => {
    const targetToAccumulate = dateCalculations.remainderToSave;
    let counts = 100;
    
    if (bloquesModo === 'doscientos') {
      counts = 200;
    } else if (bloquesModo === 'quinientas') {
      counts = 500;
    } else if (bloquesModo === 'mil') {
      counts = 1000;
    }

    let valuePerBlock = Math.ceil(targetToAccumulate / counts);
    if (bloquesModo === 'custom') {
      valuePerBlock = customBlockValue > 0 ? customBlockValue : 100;
      counts = Math.ceil(targetToAccumulate / valuePerBlock);
      if (counts <= 0) counts = 1;
      if (counts > 2000) counts = 2000; // Hard restriction to avoid rendering engine melting
    }

    return {
      blockCount: counts,
      blockValue: valuePerBlock
    };
  }, [bloquesModo, customBlockValue, dateCalculations.remainderToSave]);

  // Compute actual interactive progress
  const interactiveState = useMemo(() => {
    const checkedCount = Object.values(markedBlocks).filter(Boolean).length;
    const accumulatedFromGrid = checkedCount * gridSystem.blockValue;
    const totalAccumulated = Math.min(metaMonto, ahorroInicial + accumulatedFromGrid);
    const calculatedPercentage = metaMonto > 0 ? Math.round((totalAccumulated / metaMonto) * 100) : 0;
    const realRemaining = Math.max(0, metaMonto - totalAccumulated);

    return {
      checkedCount,
      accumulatedFromGrid,
      totalAccumulated,
      calculatedPercentage,
      realRemaining
    };
  }, [markedBlocks, gridSystem, ahorroInicial, metaMonto]);

  // Auto trigger Certificate when reaching 100% savings real accumulated projection
  useEffect(() => {
    if (interactiveState.calculatedPercentage >= 100 && metaMonto > 0) {
      setShowCertificate(true);
    } else {
      setShowCertificate(false);
    }
  }, [interactiveState.calculatedPercentage, metaMonto]);

  // Auto Reset Grid Board when configuration variables change to keep integrity
  const resetBoard = () => {
    setMarkedBlocks({});
  };

  // Select/Unselect entire grid for demonstration
  const markAllBlocks = () => {
    const newRecord: Record<number, boolean> = {};
    for (let i = 0; i < gridSystem.blockCount; i++) {
      newRecord[i] = true;
    }
    setMarkedBlocks(newRecord);
  };

  // Toggle single block with client-side interactive callback feedback
  const handleBlockClick = (idx: number) => {
    setMarkedBlocks(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // MILESTONE QUOTES BASED ON REALTIME INTERACTIVE PROGRESS PERCENT
  const getProgressMilestoneString = () => {
    const pct = interactiveState.calculatedPercentage;
    if (pct < 25) return '25% → ¡Excelente comienzo! El camino del ahorro se inicia tomando acción.';
    if (pct < 50) return '50% → ¡Ya estás a un cuarto de camino! Imagina la satisfacción de cumplirlo.';
    if (pct < 75) return '75% → ¡Ya estás a la mitad! Mitad del esfuerzo completado, continúa firme.';
    if (pct < 100) return '90% → ¡Tu meta está sumamente cerca! Visualiza tu éxito a la vuelta de la esquina.';
    return '100% → ¡META TOTALMENTE CUMPLIDA! Te felicitamos por tu disciplina de acero.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* HEADER PRINCIPAL */}
      <div className="text-center max-w-4xl mx-auto space-y-3 pt-4 print:hidden">
        <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 text-blue-600 dark:text-blue-400 text-xs font-bold font-mono tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> PLANNER EDITORIAL PREMIUM V1
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Creador de Plan de Ahorro Personalizado
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Diseña, personaliza e imprime un planificador financiero de grado profesional para tu habitación o negocio. Gamifica tu ahorro coloreando los bloques hasta alcanzar tus sueños.
        </p>
      </div>

      {/* DUAL WORKSPACE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANEL IZQUIERDO: CONFIGURADOR DE DISEÑO (OCULTO EN LA HOJA DE IMPRESIÓN) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-6 print:hidden">
          
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layout className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Pasos del Diseñador
            </h2>
          </div>

          {/* COLOR THEME SELECTOR */}
          <div className="space-y-3">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Palette className="w-4 h-4" /> 1. Paleta de Color
            </span>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[
                { id: 'azul', label: 'Azul', hex: '#2563eb' },
                { id: 'verde', label: 'Verde', hex: '#10b981' },
                { id: 'morado', label: 'Morado', hex: '#8b5cf6' },
                { id: 'dorado', label: 'Dorado', hex: '#d97706' },
                { id: 'personalizado', label: 'Hex', hex: customColorHex }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setColorTema(style.id as any)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${colorTema === style.id ? 'border-semibold border-slate-800 dark:border-white shadow-sm font-black text-slate-900 dark:text-white' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}
                >
                  <span 
                    className="w-5 h-5 rounded-full border border-slate-200/40 mb-1" 
                    style={{ backgroundColor: style.id === 'personalizado' ? customColorHex : style.hex }}
                  />
                  {style.label}
                  {colorTema === style.id && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-800 dark:bg-white rounded-full" />}
                </button>
              ))}
            </div>

            {colorTema === 'personalizado' && (
              <div className="pt-2 flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/40">
                <span className="text-[10px] uppercase font-bold text-slate-400">Color Hex:</span>
                <input 
                  type="color" 
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-6 p-0 border-0 cursor-pointer rounded bg-transparent shrink-0"
                />
                <input 
                  type="text" 
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase"
                />
              </div>
            )}
          </div>

          {/* BASIC FORM FIELDS */}
          <div className="space-y-4">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-4 h-4" /> 2. Datos del Cliente & Meta
            </span>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre del Propietario</label>
              <input 
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                placeholder="Ingresa tu nombre"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre de la Meta</label>
                <input 
                  type="text"
                  value={metaNombre}
                  onChange={(e) => setMetaNombre(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  placeholder="Ej. Inicial de mi Apartamento"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo de Meta</label>
                <select
                  value={objetivoCategoria}
                  onChange={(e) => setObjetivoCategoria(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="casa">🏠 Casa / Apartamento</option>
                  <option value="vehiculo">🚗 Vehículo Próximo</option>
                  <option value="viaje">✈️ Viajes & Aventuras</option>
                  <option value="estudios">🎓 Educación & Postgrado</option>
                  <option value="negocio">💼 Negocio Propio / Startups</option>
                  <option value="emergencia">🛡️ Fondo de Reserva Familiar</option>
                  <option value="otro">❤️ Otro Objetivo Personal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monto Objetivo (RD$)</label>
                <input 
                  type="number"
                  value={metaMonto || ''}
                  onChange={(e) => setMetaMonto(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  placeholder="Monto meta"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ahorro Inicial (RD$)</label>
                <input 
                  type="number"
                  value={ahorroInicial !== undefined ? ahorroInicial : ''}
                  onChange={(e) => setAhorroInicial(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-white"
                  placeholder="Ahorro inicial"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha de Inicio</label>
                <input 
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha Objetivo</label>
                <input 
                  type="date"
                  value={fechaObjetivo}
                  onChange={(e) => setFechaObjetivo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Frecuencia de Ahorros</label>
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

          {/* DYNAMIC PHOTO SELECTOR */}
          <div className="space-y-3">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> 3. Imagen de Inspiración (Opcional)
            </span>
            <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
              Puedes cargar una fotografía de tu meta (ej. la casa de tus sueños, el auto, etc.) para incrustarla automáticamente en el planner físico.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-xl text-xs font-bold border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Subir Fotografía
              </button>
              {metaFotoUrl && (
                <button
                  type="button"
                  onClick={() => setMetaFotoUrl('')}
                  className="py-2 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Remover
                </button>
              )}
            </div>
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* SAVING MODULE BLOCK QUANTITY CONFIG */}
          <div className="space-y-3.5 pt-1 border-t border-slate-150/40 dark:border-slate-850">
            <span className="block text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layout className="w-4 h-4" /> 4. Ajustes de Cuadrícula
            </span>
            <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
              Configura cuántos bloques impresos contendrá tu tablero de progreso y el monto que equivale rellenar cada uno.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cien', label: '100 bloques' },
                { id: 'doscientos', label: '200 bloques' },
                { id: 'quinientas', label: '500 bloques' },
                { id: 'custom', label: 'Valor Manual' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setBloquesModo(opt.id as any);
                    resetBoard();
                  }}
                  className={`p-2 rounded-xl text-[11px] font-bold border text-left flex items-center justify-between cursor-pointer ${bloquesModo === opt.id ? 'bg-slate-50 dark:bg-slate-950 border-slate-800 dark:border-slate-100 font-extrabold text-slate-800 dark:text-white' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}
                >
                  <span>{opt.label}</span>
                  {bloquesModo === opt.id && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                </button>
              ))}
            </div>

            {bloquesModo === 'custom' && (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
                <label className="block text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Monto por cada Bloque (RD$)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">RD$</span>
                  <input 
                    type="number"
                    value={customBlockValue}
                    onChange={(e) => {
                      setCustomBlockValue(Math.max(1, Number(e.target.value)));
                      resetBoard();
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-2 py-1 text-xs font-extrabold text-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Ej. 1000"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={resetBoard}
                className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 rounded-xl text-[11px] font-extrabold cursor-pointer border border-slate-200/40"
              >
                Limpiar Tablero
              </button>
              <button
                type="button"
                onClick={markAllBlocks}
                className="py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-350 rounded-xl text-[11px] font-extrabold cursor-pointer border border-slate-200/40"
              >
                Rellenar Todo
              </button>
            </div>
          </div>

          {/* MAIN WEBPAGE PRINT BUTTON */}
          <div className="pt-4 border-t border-slate-150/40 dark:border-slate-850">
            <button
              onClick={() => window.print()}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-950 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-slate-950/20 uppercase tracking-wider"
            >
              <Printer className="w-4 h-4 text-emerald-400" /> Imprimir Planner (Carta / A4)
            </button>
          </div>

          <AdsenseMock slot="plan-ahorro-personalized-sidebar" type="square" />
        </div>

        {/* PROYECTO VISUAL: ETSY-STYLE PREMIUM LETTER SHEET EMBEDDED PREVIEW */}
        <div className="lg:col-span-8 flex flex-col justify-center items-center">
          
          <div className="w-full flex items-center justify-between pb-3 px-2 print:hidden select-none">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-emerald-500" /> HOJA DE PLANNER DIGITAL PREMIUM (VÍA VISTA PREVIA)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="p-1.5 px-3 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          {/* LETTER BOX PREVIEW WRAPPER */}
          {/* Fulfills design criteria: Comparable to Canva Pro designs, elegant borders, balanced padding, looks extremely clean, fits single standard page bounds in printing */}
          <div 
            id="printable-savings-planner"
            className="w-full max-w-[850px] min-h-[1100px] bg-white border border-slate-300 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden text-slate-900 print:border-none print:shadow-none print:p-0 flex flex-col justify-between"
            style={{
              fontFamily: '"Inter", "Space Grotesk", system-ui, sans-serif',
              borderColor: colorScheme.hex,
              borderWidth: '2px'
            }}
          >
            {/* Header watermarks & branding */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-[0.06] w-56 h-56 rounded-full" style={{ backgroundColor: colorScheme.hex }}></div>
            <div className="absolute left-0 bottom-0 -translate-x-16 translate-y-16 opacity-[0.04] w-72 h-72 rounded-full" style={{ backgroundColor: colorScheme.hex }}></div>

            {/* DESIGN CONTAINER TOP: MAIN LOGO & HEADING */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: `${colorScheme.hex}25` }}>
                
                {/* BRAND LOGO CONFORME CON LA INSTRUCCIONES */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0" style={{ backgroundColor: colorScheme.hex }}>
                    SF
                  </div>
                  <div>
                    <h5 className="font-extrabold tracking-tight text-slate-950 text-sm">SueldoFácil</h5>
                    <p className="text-[9px] font-mono font-bold tracking-widest uppercase text-slate-400">República Dominicana</p>
                  </div>
                </div>

                <div className="sm:text-right space-y-0.5">
                  <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400">PLANIFICACIÓN FINANCIERA DE ALTA GAMA</h4>
                  <p className="text-xl md:text-2xl font-black tracking-tight" style={{ color: colorScheme.hex }}>
                    PLAN DE AHORRO PERSONALIZADO
                  </p>
                </div>
              </div>

              {/* CLIENT META METRICS SUB-BANNER */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b" style={{ borderColor: `${colorScheme.hex}15` }}>
                <div className="space-y-0.5 border-l-2 pl-3" style={{ borderLeftColor: colorScheme.hex }}>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Propietario</span>
                  <span className="text-xs md:text-sm font-extrabold text-slate-900 truncate block">{nombreCliente}</span>
                </div>
                <div className="space-y-0.5 border-l-2 pl-3" style={{ borderLeftColor: colorScheme.hex }}>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Proyecto Financiero</span>
                  <span className="text-xs md:text-sm font-extrabold text-slate-900 truncate block">{metaNombre}</span>
                </div>
                <div className="space-y-0.5 border-l-2 pl-3" style={{ borderLeftColor: colorScheme.hex }}>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Monto Meta Acordado</span>
                  <span className="text-xs md:text-sm font-black text-slate-950 block">RD$ {metaMonto.toLocaleString('en-US')}</span>
                </div>
                <div className="space-y-0.5 border-l-2 pl-3" style={{ borderLeftColor: colorScheme.hex }}>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Plazo de Ejecución</span>
                  <span className="text-xs md:text-sm font-bold text-slate-700 block">
                    {dateCalculations.totalMonths} meses ({fechaInicio} a {fechaObjetivo})
                  </span>
                </div>
              </div>

              {/* TWO COLUMN INSPIRATIONAL & FINANCIAL PROFILE SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
                
                {/* COLUMN LEFT: MOTIVATION TEXTS & ILLUSTRATIONS */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl flex items-center gap-4 border" style={{ backgroundColor: `${colorScheme.hex}08`, borderColor: `${colorScheme.hex}20` }}>
                    <div className="p-2.5 rounded-xl bg-white shrink-0 shadow-sm border border-slate-100">
                      {metaIllustrations.icon}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-black uppercase text-slate-450 tracking-wider">Hito de Motivación</span>
                      <p className="text-[12px] italic font-semibold text-slate-750 font-serif leading-relaxed">
                        "{metaIllustrations.quote}"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-150/40">
                      <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Ahorro Diario</span>
                      <span className="text-xs font-mono font-black text-slate-800">RD$ {dateCalculations.dailyRequired.toLocaleString('en-US')}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-150/40 font-mono">
                      <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Ahorro Semanal</span>
                      <span className="text-xs font-black text-slate-800">RD$ {dateCalculations.weeklyRequired.toLocaleString('en-US')}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-150/40 font-mono">
                      <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Ahorro Mensual</span>
                      <span className="text-xs font-black text-slate-800">RD$ {dateCalculations.monthlyRequired.toLocaleString('en-US')}</span>
                    </div>
                  </div>
                </div>

                {/* COLUMN RIGHT: META FOTO O DESCRIPCIÓN VISUAL DE LA META */}
                <div className="md:col-span-5">
                  <div className="w-full h-28 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner flex items-center justify-center">
                    {metaFotoUrl ? (
                      <img 
                        src={metaFotoUrl} 
                        alt="Meta" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 flex flex-col justify-center items-center p-3 text-center">
                        <span className="text-[9px] uppercase font-bold text-blue-400 tracking-wider mb-1">Visualización Inspiradora</span>
                        <p className="text-[10px] text-slate-350 leading-snug font-medium">Meta: {metaIllustrations.title}. Puedes subir una fotografía real en la barra de control lateral.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* DYNAMIC PROGRESS BAR SHEET DESIGN */}
              <div className="pb-6">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-wider pb-1.5">
                  <span>Porcentaje del Objetivo Completado</span>
                  <span className="font-extrabold text-xs" style={{ color: colorScheme.hex }}>
                    {interactiveState.calculatedPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200/50 flex">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, interactiveState.calculatedPercentage)}%`,
                      backgroundColor: colorScheme.hex
                    }}
                  ></div>
                </div>
                
                {/* Financial distribution index details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[10px] font-bold text-slate-500 font-mono">
                  <div>• Meta Acumulada: <span className="text-slate-900">RD$ {metaMonto.toLocaleString('en-US')}</span></div>
                  <div>• Inicial: <span className="text-slate-900">RD$ {ahorroInicial.toLocaleString('en-US')}</span></div>
                  <div>• Ahorro Grid: <span className="text-slate-900">RD$ {interactiveState.accumulatedFromGrid.toLocaleString('en-US')}</span></div>
                  <div>• Restante: <span className="text-slate-950 font-black">RD$ {interactiveState.realRemaining.toLocaleString('en-US')}</span></div>
                </div>
              </div>

              {/* DETAILED SAVING TILES GRID SECTION */}
              <div className="space-y-3 pt-4 border-t" style={{ borderColor: `${colorScheme.hex}15` }}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest">
                    TABLERO DE PROGRESO DE AHORRO • {gridSystem.blockCount} CASILLAS DE RD$ {gridSystem.blockValue.toLocaleString('en-US')}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold tracking-wider print:hidden select-none">
                    *Haz clic sobre las casillas acumuladas para colorearlas
                  </p>
                </div>

                {/* THE SAVINGS GRID BOARD: EXTREMELY VISUAL AND PROFESSIONAL BULLET JOURNAL TILES */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto max-h-[340px] pr-1.5 py-1">
                  {Array.from({ length: gridSystem.blockCount }).map((_, idx) => {
                    const isChecked = !!markedBlocks[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => handleBlockClick(idx)}
                        className={`aspect-video rounded-lg border text-[10px] font-extrabold flex flex-col justify-center items-center relative transition-all cursor-pointer ${isChecked ? 'text-white border-transparent' : 'bg-slate-50/70 hover:bg-slate-50 hover:border-slate-400 border-slate-200 text-slate-500'}`}
                        style={{
                          backgroundColor: isChecked ? colorScheme.hex : undefined
                        }}
                      >
                        <span className="text-[8px] font-bold block opacity-40">#{idx + 1}</span>
                        <span className="font-mono block tracking-tighter">
                          {gridSystem.blockValue >= 1000 
                            ? `${(gridSystem.blockValue / 1000).toFixed(0)}k` 
                            : gridSystem.blockValue}
                        </span>
                        {isChecked && (
                          <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                            <Check className="w-2 h-2" style={{ color: colorScheme.hex }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Summary counters of active blocks */}
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1">
                  <span>CASILLAS ALCANZADAS: {interactiveState.checkedCount} / {gridSystem.blockCount}</span>
                  <span>AHORRADO EN GRID: RD$ {interactiveState.accumulatedFromGrid.toLocaleString('en-US')}</span>
                </div>
              </div>

              {/* DYNAMIC PROGRESS MILESTONES (HITOS DE AHORRO) */}
              <div className="py-6 border-b border-t mt-4" style={{ borderColor: `${colorScheme.hex}15` }}>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-2">HITOS DE SEGUIMIENTO GENERAL</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold tracking-tight">
                  <div className={`p-2 rounded-xl border ${interactiveState.calculatedPercentage >= 25 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'}`}>
                    <span className="block font-black text-xs">25%</span>
                    <span>Inicio Firme</span>
                  </div>
                  <div className={`p-2 rounded-xl border ${interactiveState.calculatedPercentage >= 50 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'}`}>
                    <span className="block font-black text-xs">50%</span>
                    <span>Mitad de Camino</span>
                  </div>
                  <div className={`p-2 rounded-xl border ${interactiveState.calculatedPercentage >= 75 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'}`}>
                    <span className="block font-black text-xs">75%</span>
                    <span>Meta muy Cerca</span>
                  </div>
                  <div className={`p-2 rounded-xl border ${interactiveState.calculatedPercentage >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 animate-pulse' : 'bg-slate-50 border-slate-200/60 text-slate-400 opacity-60'}`}>
                    <span className="block font-black text-xs">100%</span>
                    <span>¡Meta Lograda!</span>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 text-center mt-3 font-serif italic">
                  {getProgressMilestoneString()}
                </p>
              </div>

            </div>

            {/* DESIGN CONTAINER FOOTER: STAMP & SIGNATURE */}
            <div>
              <div className="flex items-end justify-between border-t pt-5 mt-4" style={{ borderColor: `${colorScheme.hex}25` }}>
                
                {/* INCENTIVES AD */}
                <div className="max-w-[420px] text-left">
                  <p className="text-[10px] font-bold text-slate-800">Compromiso Financiero Diario</p>
                  <p className="text-[8px] text-slate-400 leading-relaxed font-semibold">
                    Este plan ha sido auditado por el motor optimizado de Sueldo Fácil Dominicano. Pega este planner en un espacio visible en tu casa u oficina y registra tu constancia periódica.
                  </p>
                </div>

                {/* SIGNATURE STAMP BLOCK FOR Bullet Journal aesthetic */}
                <div className="flex flex-col items-center justify-center text-center space-y-1 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Sello de Compromiso</span>
                  <div className="w-12 h-6 border-b border-dashed border-slate-400"></div>
                  <span className="text-[8px] font-bold text-slate-650">Firma del Propietario</span>
                </div>
              </div>

              {/* SYSTEM INFORMATION STRIP */}
              <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-350 select-none border-t border-slate-100 pt-2.5 mt-4">
                <span>SUELDO FÁCIL DOMINICANA • RECURSOS LIBRES DE COBRO</span>
                <span>FECHA DE IMPRESIÓN: {new Date().toLocaleDateString('es-DO')}</span>
                <span>VERSIÓN: FSC-PLANNER-2026</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* EXTRA PREMIUM SECTION: CERTIFICADO DE LOGRO AL 100% */}
      {/* Renders a beautiful visual pop with high printable quality so the client gets a proud keepsake */}
      {showCertificate && (
        <div className="p-1 px-2 pointer-events-auto bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white relative shadow-2xl space-y-6">
          <div className="absolute top-2 right-3 font-mono text-[9px] font-bold text-yellow-250 uppercase tracking-widest animate-pulse border border-yellow-500/20 px-2 py-0.5 rounded-full bg-slate-900/40">
            ★ CERTIFICADO DESBLOQUEADO (100%)
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-xl md:text-2xl font-serif font-black tracking-wider text-yellow-100 flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-yellow-300 animate-bounce" /> CERTIFICADO DE META CUMPLIDA
            </h3>
            <p className="text-xs text-amber-100 font-semibold max-w-lg mx-auto">
              Has acumulado satisfactoriamente el 100% de tu meta de ahorro financiero. Aquí está tu pergamino de reconocimiento por disciplina fiscal intachable.
            </p>

            {/* CERTIFICATE DOCUMENT DESIGN */}
            <div 
              className="bg-stone-50 border-8 border-double border-amber-600 text-stone-900 rounded-2xl p-6 md:p-10 shadow-lg text-center mx-auto max-w-[700px] space-y-6 relative overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(circle, #fffbeb, #fafaf9)'
              }}
            >
              {/* Decorative side margins */}
              <div className="absolute left-3 top-3 bottom-3 right-3 border border-amber-200 pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                
                <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest block font-mono">REPÚBLICA DOMINICANA</span>
                
                <h4 className="text-lg md:text-xl font-serif font-bold text-amber-900 uppercase">
                  Certificado de Excelencia Financiera
                </h4>

                <p className="text-[11px] text-stone-500 italic max-w-md mx-auto">
                  Por cuanto ha demostrado una disciplina excepcional y perseverancia, se otorga este pergamino a:
                </p>

                {/* Main Name displaying Client Name */}
                <h2 className="text-2xl md:text-3xl font-serif font-black text-stone-950 underline decoration-amber-600/50 decoration-double">
                  {nombreCliente}
                </h2>

                <p className="text-xs text-stone-750 max-w-lg mx-auto leading-relaxed">
                  Por haber cumplido con éxito su meta de ahorro planificada: <strong className="text-slate-900">"{metaNombre}"</strong>, acumulando la cantidad total de <strong className="text-emerald-700 font-mono">RD$ {metaMonto.toLocaleString('en-US')}</strong> mediante aportes ordenados de frecuencia {frecuencia}.
                </p>

                <div className="flex justify-between items-end max-w-sm mx-auto pt-6 border-t border-amber-200">
                  <div className="text-center font-mono text-[9px] text-stone-400">
                    <p className="border-b border-stone-300 pb-1 w-20 mx-auto font-bold">{fechaObjetivo}</p>
                    <p>Fecha Cumplimiento</p>
                  </div>

                  <div className="w-12 h-12 bg-amber-500 rounded-full border border-amber-600 flex items-center justify-center font-bold text-white shadow-md relative group select-none">
                    <span className="text-[9px] font-black">100%</span>
                    <div className="absolute -bottom-3 text-[7.5px] uppercase font-bold text-amber-800 scale-90 whitespace-nowrap">SELLO APARTADO</div>
                  </div>

                  <div className="text-center font-mono text-[9px] text-stone-400">
                    <p className="border-b border-stone-300 pb-1 w-20 mx-auto font-bold">SUELDO FÁCIL</p>
                    <p>Firma Emisora</p>
                  </div>
                </div>

                <p className="text-[9px] text-stone-400 font-mono pt-4 leading-none">
                  "El ahorro constante es el cimiento de la riqueza duradera de cualquier nación."
                </p>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => window.print()}
                className="mx-auto py-2 px-5 bg-slate-900 border border-slate-800 hover:bg-slate-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer uppercase tracking-wider shadow-md"
              >
                <Printer className="w-3.5 h-3.5 text-yellow-350" /> Imprimir Honor Financiero (Diploma)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANT LONG COALESCED SEO SECTION MAINTAINING EXCELLENT SYSTEM INDEXATION PROPERTIES */}
      <article className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400 print:hidden">
        
        <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Guía Financiera Definitiva de Planners de Ahorro para República Dominicana
          </h2>
          <p className="text-sm font-semibold text-slate-400">
            Aprende cómo usar planners imprimibles para disciplinar tus finanzas, rellenar metas, y capitalizar interés compuesto.
          </p>
        </header>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. ¿Por qué el Método Visual de Casillas Rellenables Funciona Mejor?
          </h3>
          <p>
            Tradicionalmente, las personas ahorran utilizando Excel u hojas de cálculo frías y abstractas. El problema es la falta de interacción kinestésica y recompensa de estímulos rápidos. Al utilizar un <strong>planner de ahorro imprimible con bloques personalizables</strong> (como este diseñado especialmente para República Dominicana), creas un compromiso tangible y visible. 
          </p>
          <p>
            Al colocar este documento impreso de alta gama en tu refrigeradora, en tu espejo, o en la pared de tu oficina, activas los neurotransmisores del progreso. Colorear un recuadro de <strong>RD$ 500</strong> o <strong>RD$ 1,000</strong> te otorga una inyección de dopamina que refuerza el hábito e impulsa la consistencia en el preaviso de tu próximo depósito bancario.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Tipos de Cuentas Dominicana recomendables para Resguardar tu Capital
          </h3>
          <p>
            Diferentes metas requieren diferentes herramientas del mercado de valores de la República Dominicana:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Para Cuentas de Ahorro Programado:</strong> Excelente para separar el ahorro mensual de tu nómina en bancos múltiples locales (como Banreservas, Banco Popular, Banco BHD).
            </li>
            <li>
              <strong>Para Certificados en Asociaciones:</strong> Las asociaciones de ahorros (APAP, Alaver, Cibao) permiten congelar el dinero ganado por plazos definidos rindiendo entre el 5.5% y el 9% anual con inmunidad tributaria temporal.
            </li>
            <li>
              <strong>Para Puestos de Bolsa:</strong> Los fondos mutuos aprobados por la Superintendencia del Mercado de Valores (SIMV) logran rentabilidades óptimas desde RD$ 1,000 dominicanos.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Preguntas Frecuentes (FAQ) sobre Planificación de Ahorro en RD
          </h3>
          <div className="space-y-3 dark:border-slate-800">
            {[
              {
                q: "¿Cómo funciona un planner de ahorro personal de 100 bloques?",
                a: "Consiste en dividir tu meta neta restante de ahorro en 100 partes iguales. Cada vez que deposites el valor correspondiente a esa porción en tu cuenta bancaria o fondo de inversión, coloreas una casilla en tu planner impreso hasta llenar la totalidad de la matriz de progreso."
              },
              {
                q: "¿Qué beneficios tiene el ahorro en pesos dominicanos comparado con dólares (USD)?",
                a: "Ahorrar en pesos te ofrece tasas de interés sustancialmente más altas (típicamente entre 6.5% y 11% anual en RD) frente al ahorro en dólares que otorga tasas discretas (de 1.5% a 3% anual), aunque el dólar protege tus ahorros de devaluaciones severas de la moneda nacional."
              },
              {
                q: "¿Qué es la retención única del 10% aplicada por la DGII sobre los intereses?",
                a: "En la República Dominicana, la Dirección General de Impuestos Internos (DGII) retiene por ley el 10% de los intereses acumulados de manera pasiva en entidades reguladas. Sin embargo, los certificados de fomento de vivienda y diversos fondos mutuos de bolsa están legalmente exonerados de este impuesto."
              },
              {
                q: "¿Es aconsejable ahorrar si tengo tarjetas de crédito vigentes con deudas?",
                a: "No. El costo financiero de una deuda de consumo o tarjeta de crédito en RD es sumamente elevado (fluctúa entre un 48% y un 60% anual de tasa de interés). Por lo tanto, saldar tus deudas te otorga un retorno financiero implícito mucho más alto que colocar tu dinero a rendir en un banco activo."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-slate-150/40 dark:border-slate-850 pb-3">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left font-bold text-slate-800 dark:text-slate-300 py-2 hover:text-blue-600 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openFaq[idx] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaq[idx] && (
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 pl-4 pt-1 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </article>

    </div>
  );
}
