import React, { useState, useEffect } from 'react';
import { 
  Search, Calculator, Sparkles, Building, Briefcase, FileText, 
  Bot, HelpCircle, LayoutDashboard, Sun, Moon, Menu, X, 
  Clock, ArrowRight, DollarSign, Calendar, ChevronRight, Share2, Compass, BookOpen,
  Gift, ShieldAlert, TrendingUp
} from 'lucide-react';
import { TabType, SearchItem } from './types';
import { SEARCH_ITEMS, FAQ_ITEMS, SEO_TAB_CONFIGS } from './constants';

// Component imports
import CalculadorPrestaciones from './components/CalculadorPrestaciones';
import CalculadorSueldoNeto from './components/CalculadorSueldoNeto';
import AsistenteIA from './components/AsistenteIA';
import HorasExtras from './components/HorasExtras';
import CostoLaboral from './components/CostoLaboral';
import ComparadorEmpleos from './components/ComparadorEmpleos';
import GeneradorDocumentos from './components/GeneradorDocumentos';
import BlogVirtual from './components/BlogVirtual';
import NoficacionesNominas from './components/NoficacionesNominas';
import DashboardVirtual from './components/DashboardVirtual';
import CentroSalarios from './components/CentroSalarios';
import CalculadoraAumento from './components/CalculadoraAumento';
import MiDiciembre from './components/MiDiciembre';
import BibliotecaLaboral from './components/BibliotecaLaboral';
import AnalizadorRecibos from './components/AnalizadorRecibos';
import AdsenseMock from './components/AdsenseMock';

export default function App() {
  const [tab, setTab] = useState<TabType>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSearch, setFilteredSearch] = useState<SearchItem[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync dark class with documentElement for Tailwind support
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load history on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sueldofacil_history');
      if (saved) {
        setHistoryLogs(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    // Check shared URL hash states to support shared link calculations!
    const hash = window.location.hash;
    if (hash && hash.includes('state=')) {
      try {
        const urlParams = new URLSearchParams(hash.substring(1));
        const stateBase64 = urlParams.get('state');
        if (stateBase64) {
          const decoded = JSON.parse(atob(stateBase64));
          // If we decode successfully, set appropriate tab & preset state
          if (hash.startsWith('#prestaciones')) {
            setTab('prestaciones');
          } else if (hash.startsWith('#salario')) {
            setTab('salario');
          }
        }
      } catch (e) {
        console.error("Failed to parse base64 share link state", e);
      }
    }
  }, []);

  // Update SEO Head metrics conforming to SEO specialist & CRO rules
  useEffect(() => {
    const seo = SEO_TAB_CONFIGS[tab] || {
      title: "SueldoFacil - Herramientas Laborales República Dominicana",
      description: "Calculadora de prestaciones, salarios, ISR y asistencia de inteligencia artificial en la República Dominicana."
    };
    document.title = seo.title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);
  }, [tab]);

  // Handle Search Input real-time filtering (Like Google Instant search)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSearch([]);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const filtered = SEARCH_ITEMS.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    setFilteredSearch(filtered);
  }, [searchQuery]);

  const handleSaveCalculation = (logItem: any) => {
    const freshLog = {
      id: Math.random().toString(36).substring(2, 9),
      ...logItem
    };
    const updated = [freshLog, ...historyLogs].slice(0, 15); // cap at 15 items
    setHistoryLogs(updated);
    localStorage.setItem('sueldofacil_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistoryLogs([]);
    localStorage.removeItem('sueldofacil_history');
  };

  const handleSelectHistoryItem = (log: any) => {
    // Navigate straight to the saved calculation category
    setTab(log.type as TabType);
  };

  const selectTab = (t: TabType) => {
    setTab(t);
    setSearchQuery('');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER PRINCIPAL */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${darkMode ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-205'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <button onClick={() => selectTab('home')} className="flex items-center gap-2 cursor-pointer select-none text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-none">SueldoFacil</span>
              <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider">REPUBLICA DOMINICANA</span>
            </div>
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            <button 
              onClick={() => selectTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => selectTab('prestaciones')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'prestaciones' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Prestaciones
            </button>
            <button 
              onClick={() => selectTab('salario')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'salario' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Salario Neto
            </button>
            <button 
              onClick={() => selectTab('nominas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'nominas' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Nóminas
            </button>
            <button 
              onClick={() => selectTab('cartas_contratos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'cartas_contratos' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Documentos
            </button>
            <button 
              onClick={() => selectTab('ai_assistant')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700`}
            >
              <Bot className="w-3.5 h-3.5" />
              Asistente IA
            </button>
            <button 
              onClick={() => selectTab('blog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'blog' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Blog
            </button>
            <button 
              onClick={() => selectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${tab === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Mi Panel
            </button>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            
            {/* DARK MODE TOGGLE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="Cambiar Modo"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-1.5 z-30 transition-colors ${darkMode ? 'bg-slate-950 border-slate-905' : 'bg-white border-slate-200'}`}>
          <button 
            onClick={() => selectTab('home')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'home' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Inicio
          </button>
          <button 
            onClick={() => selectTab('prestaciones')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'prestaciones' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Prestaciones
          </button>
          <button 
            onClick={() => selectTab('salario')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'salario' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Salario Neto
          </button>
          <button 
            onClick={() => selectTab('nominas')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'nominas' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Nóminas
          </button>
          <button 
            onClick={() => selectTab('cartas_contratos')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'cartas_contratos' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Documentos
          </button>
          <button 
            onClick={() => selectTab('ai_assistant')}
            className="w-full text-left p-2.5 rounded-xl text-sm font-bold bg-blue-50 text-blue-700 flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            Asistente IA
          </button>
          <button 
            onClick={() => selectTab('blog')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'blog' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Blog
          </button>
          <button 
            onClick={() => selectTab('dashboard')}
            className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center ${tab === 'dashboard' ? 'bg-slate-150 text-slate-900' : 'text-slate-600'}`}
          >
            Panel Personal
          </button>
        </div>
      )}

      {/* CORE CONTENIDO MARCO */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* WIDGET: CONMUTADOR LABORAL (SWITCHES / STICH) */}
        {['prestaciones', 'salario', 'nominas', 'costos', 'horas_extras', 'comparador', 'salarios_profesiones', 'calculadora_aumento', 'mi_diciembre', 'biblioteca_laboral', 'analizador_recibos'].includes(tab) && (
          <div className="mb-8">
            <div className={`p-1.5 w-full rounded-2xl flex overflow-x-auto md:flex-wrap items-center gap-1 transition-colors scrollbar-none ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100/80 border border-slate-200/50'}`}>
              {[
                { id: 'prestaciones', name: 'Prestaciones', icon: Briefcase },
                { id: 'salario', name: 'Salario Neto', icon: Calculator },
                { id: 'nominas', name: 'Nóminas', icon: Building },
                { id: 'horas_extras', name: 'Horas Extras', icon: Clock },
                { id: 'costos', name: 'Costo Laboral', icon: Sparkles },
                { id: 'comparador', name: 'Comparador', icon: DollarSign },
                { id: 'salarios_profesiones', name: 'Sueldo Cargo', icon: Compass },
                { id: 'calculadora_aumento', name: 'Aumento Neto', icon: TrendingUp },
                { id: 'mi_diciembre', name: 'Sueldo #13', icon: Gift },
                { id: 'biblioteca_laboral', name: 'Leyes FAQ', icon: BookOpen },
                { id: 'analizador_recibos', name: 'Auditor Volante', icon: ShieldAlert }
              ].map(item => {
                const isActive = tab === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectTab(item.id as TabType)}
                    className={`flex-1 shrink-0 py-2 px-3 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                        isActive 
                          ? (darkMode ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-blue-600 shadow-md')
                          : (darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50')
                      }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? (darkMode ? 'text-white' : 'text-blue-500') : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* VIEW: HOME PAGE */}
        {tab === 'home' && (
          <div className="space-y-12">
            
            {/* HERO */}
            <div className="text-center md:py-12 max-w-4xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
                <Sparkles className="w-3.5 h-3.5 fill-blue-700/15" />
                La plataforma laboral #1 de República Dominicana
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Calcula tu salario, prestaciones e impuestos <span className="text-blue-600">en segundos</span>.
              </h1>
              
              <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Herramientas laborales y financieras diseñadas para trabajadores, empleadores, contables y departamentos de RRHH de República Dominicana.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <button
                  onClick={() => selectTab('salario')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calcular Salario Neto
                </button>
                <button
                  onClick={() => selectTab('prestaciones')}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  Calcular Prestaciones
                </button>
              </div>
            </div>

            {/* BUSCADOR INTELIGENTE TIPO GOOGLE */}
            <div className="max-w-xl mx-auto relative z-25">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Busca calculadoras, FAQ, leyes, cartas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm text-sm focus:outline-none focus:ring-4 focus:ring-blue-550/10 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>

              {/* DROPDOWN DE RESULTADOS */}
              {filteredSearch.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-205 rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                  {filteredSearch.map(item => (
                    <button
                      key={item.id}
                      onClick={() => selectTab(item.targetTab)}
                      className="w-full text-left p-4 hover:bg-slate-50 flex justify-between items-center transition-all cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                        <p className="text-[11px] text-slate-450 leading-snug">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GRID DE HERRAMIENTAS - MAQUETACIÓN BENTO */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-600" />
                  Grid de Herramientas Laborales
                </h3>
                <span className="text-xs font-mono text-slate-400">9 CALCULADORAS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* CALC PRESTACIONES */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Prestaciones Laborales o Liquidación</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sufre un despido o quieres renunciar? Calcula preaviso, cesantía, regalía y vacaciones en pocos pasos de ley.
                    </p>
                  </div>
                  <button onClick={() => selectTab('prestaciones')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Comenzar Cálculo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* CALC SALARIOS */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Salario Neto Mensual</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Simula tus deducciones de nómina correspondientes a la AFP (2.87%), SFS (3.04%) e Impuesto Sobre la Renta (ISR).
                    </p>
                  </div>
                  <button onClick={() => selectTab('salario')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Comenzar Cálculo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* CALC NOCTURNIDAD / EXTRAS */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Horas Extras y Nocturnas</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Calcula con exactitud los incrementos de ley del 35%, 50% y 100% sobre tus jornadas nocturnas o extraordinarias semanales.
                    </p>
                  </div>
                  <button onClick={() => selectTab('horas_extras')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Comenzar Cálculo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ASISTENTE IA */}
                <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl w-fit border border-blue-500/20">
                      <Bot className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold">Asistente IA • Legislación Dominicana</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Consulta de forma interactiva con nuestra inteligencia artificial especializada en el Código Laboral (Ley 16-92) dominicano.
                    </p>
                  </div>
                  <button onClick={() => selectTab('ai_assistant')} className="text-xs font-bold text-blue-400 hover:text-blue-350 flex items-center gap-1 pt-4 mt-4 border-t border-slate-800">
                    Consultar a la IA <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* NOMINAS */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-teal-50 text-teal-650 rounded-xl w-fit">
                      <Building className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Cálculo de Nómina Colectiva</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Perfecto para empresas. Añade tus colaboradores para registrar deducciones masivas y el aporte total patronal consolidado.
                    </p>
                  </div>
                  <button onClick={() => selectTab('nominas')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Establecer Nómina <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* DOCUMENTOS */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-rose-50 text-rose-650 rounded-xl w-fit">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Generador de Cartas y Contratos</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Genera cartas de renuncia formal, solicitudes de aumento salarial y contratos a plazos fijos válidos legalmente en el país.
                    </p>
                  </div>
                  <button onClick={() => selectTab('cartas_contratos')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Generar Documento <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* COSTO LABORAL */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Costo Laboral (Empleadores)</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Calcula el costo real de un colaborador para tu empresa incluyendo cargas sociales, TSS (7.10% AFP, 7.09% SFS), ARL y provisiones de ley.
                    </p>
                  </div>
                  <button onClick={() => selectTab('costos')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Calcular Costos <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* COMPARADOR DE EMPLEOS */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-purple-50 text-purple-650 rounded-xl w-fit">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Comparador de Empleos</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ¿Tienes varias propuestas laborales? Compara salarios netos reales deducidos y valoriza bonificaciones para tomar la mejor decisión.
                    </p>
                  </div>
                  <button onClick={() => selectTab('comparador')} className="text-xs font-bold text-blue-600 hover:text-blue-750 flex items-center gap-1 pt-4 mt-4 border-t border-slate-100">
                    Comparar Ofertas <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* SECCIÓN FAQS GENERALES PRE-CARGADAS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Dudas Frecuentes de la Ley de Trabajo Dominicana
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {FAQ_ITEMS.map((faq, i) => (
                  <div key={i} className="space-y-2 pt-4 md:pt-0 md:px-4">
                    <p className="text-xs font-bold text-slate-900">{faq.q}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <AdsenseMock slot="home-footer" type="banner" />
          </div>
        )}

        {/* VIEW: PRESTACIONES */}
        {tab === 'prestaciones' && (
          <CalculadorPrestaciones onSaveCalculation={handleSaveCalculation} />
        )}

        {/* VIEW: SALARIO NETO */}
        {tab === 'salario' && (
          <CalculadorSueldoNeto onSaveCalculation={handleSaveCalculation} />
        )}

        {/* VIEW: NOMINA */}
        {tab === 'nominas' && (
          <NoficacionesNominas />
        )}

        {/* VIEW: COSTOS LABORALES */}
        {tab === 'costos' && (
          <CostoLaboral />
        )}

        {/* VIEW: HORAS EXTRAS */}
        {tab === 'horas_extras' && (
          <HorasExtras />
        )}

        {/* VIEW: COMPARADOR DE EMPLEOS */}
        {tab === 'comparador' && (
          <ComparadorEmpleos />
        )}

        {/* VIEW: DOCUMENTOS */}
        {tab === 'cartas_contratos' && (
          <GeneradorDocumentos />
        )}

        {/* VIEW: ASISTENTE IA */}
        {tab === 'ai_assistant' && (
          <AsistenteIA />
        )}

        {/* VIEW: BLOG */}
        {tab === 'blog' && (
          <BlogVirtual onSelectorClick={selectTab} />
        )}

        {/* VIEW: DASHBOARD */}
        {tab === 'dashboard' && (
          <DashboardVirtual 
            historyLogs={historyLogs} 
            onClearHistory={handleClearHistory} 
            onSelectCalculation={handleSelectHistoryItem} 
          />
        )}

        {/* VIEW: SALARIOS PROFESIONES */}
        {tab === 'salarios_profesiones' && (
          <CentroSalarios />
        )}

        {/* VIEW: CALCULADORA AUMENTO */}
        {tab === 'calculadora_aumento' && (
          <CalculadoraAumento />
        )}

        {/* VIEW: MI DICIEMBRE */}
        {tab === 'mi_diciembre' && (
          <MiDiciembre />
        )}

        {/* VIEW: BIBLIOTECA LABORAL */}
        {tab === 'biblioteca_laboral' && (
          <BibliotecaLaboral onNavigateTab={selectTab} />
        )}

        {/* VIEW: ANALIZADOR RECIBOS */}
        {tab === 'analizador_recibos' && (
          <AnalizadorRecibos />
        )}

      </main>

      {/* FOOTER */}
      <footer className={`border-t py-12 mt-12 transition-colors ${darkMode ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-350'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              S
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">SueldoFacil.com</span>
          </div>
          
          <p className="text-xs max-w-xl mx-auto leading-relaxed">
            La plataforma líder de República Dominicana para la simulación y cálculo educativo de derechos laborales e impositivos. Diseñado de forma gratuita en estricto apego a las directrices de la TSS, Código Laboral (Ley 16-92) e Impuestos Internos.
          </p>

          <div className="flex justify-center gap-4 text-[10px] font-mono tracking-wider pt-2">
            <span className="hover:text-white cursor-pointer" onClick={() => selectTab('home')}>INICIO</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => selectTab('prestaciones')}>PRESTACIONES</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => selectTab('salario')}>SALARIO NETO</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => selectTab('blog')}>BLOG</span>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            © {new Date().getFullYear()} SueldoFacil. No afiliada al Ministerio de Trabajo dominicano.
          </p>
        </div>
      </footer>
    </div>
  );
}
