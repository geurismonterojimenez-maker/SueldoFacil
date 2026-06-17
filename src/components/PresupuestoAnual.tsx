import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, Calculator, TrendingUp, Calendar, AlertTriangle, ShieldCheck, CheckCircle2,
  Trash2, Plus, Download, Printer, Percent, Sparkles, ChevronDown, ChevronUp, RefreshCw, Info, HelpCircle
} from 'lucide-react';
import AdsenseMock from './AdsenseMock';

// Define initial categories for incomes & expenses to populate the form dynamically
interface RowItem {
  id: string;
  label: string;
  value: number;
}

export default function PresupuestoAnual() {
  // Incomes rows state
  const [incomes, setIncomes] = useState<RowItem[]>([
    { id: '1', label: 'Salario Ordinario', value: 55000 },
    { id: '2', label: 'Freelance & Extras', value: 12000 },
    { id: '3', label: 'Comisiones / Negocio', value: 5000 }
  ]);
  const [newIncomeLabel, setNewIncomeLabel] = useState('');
  const [newIncomeValue, setNewIncomeValue] = useState<number | ''>('');

  // Fixed Expenses rows state
  const [fixedExpenses, setFixedExpenses] = useState<RowItem[]>([
    { id: 'f1', label: 'Alquiler o Hipoteca', value: 16000 },
    { id: 'f2', label: 'Luz / Electricidad (Edes)', value: 3500 },
    { id: 'f3', label: 'Internet y Cable', value: 2500 },
    { id: 'f4', label: 'Teléfono Móvil', value: 1500 },
    { id: 'f5', label: 'Préstamos o Deudas', value: 5000 },
    { id: 'f6', label: 'Colegio / Educación', value: 4000 },
    { id: 'f7', label: 'TSS / Seguro Médico', value: 3300 }
  ]);
  const [newFixedLabel, setNewFixedLabel] = useState('');
  const [newFixedValue, setNewFixedValue] = useState<number | ''>('');

  // Variable Expenses rows state
  const [variableExpenses, setVariableExpenses] = useState<RowItem[]>([
    { id: 'v1', label: 'Canasta Alimentación / Súper', value: 12000 },
    { id: 'v2', label: 'Combustible / Transporte', value: 6000 },
    { id: 'v3', label: 'Salidas y Entretenimiento', value: 4500 },
    { id: 'v4', label: 'Ropa y Calzado', value: 2000 },
    { id: 'v5', label: 'Salud y Farmacia', value: 1500 }
  ]);
  const [newVariableLabel, setNewVariableLabel] = useState('');
  const [newVariableValue, setNewVariableValue] = useState<number | ''>('');

  // Sinking savings targets
  const [savingGoalMonthly, setSavingGoalMonthly] = useState<number>(10000);

  // Scenarios Mode: 'realista' (standard), 'conservador' (lower incomes, higher expenses), 'optimista' (higher incomes, lower expenses)
  const [scenario, setScenario] = useState<'realista' | 'conservador' | 'optimista'>('realista');

  // Salary Hike Simulator States
  const [hikePercentage, setHikePercentage] = useState<number>(15); // +15%
  const [hikeMonth, setHikeMonth] = useState<number>(7); // starting in July (Month index 6)
  const [applyHike, setApplyHike] = useState<boolean>(false);

  // Expense cuts slider state
  const [selectedCutCategory, setSelectedCutCategory] = useState<string>('v3'); // Salidas y Entretenimiento
  const [cutPercentage, setCutPercentage] = useState<number>(30); // 30% cut

  // Interactive FAQs toggle state
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper row handlers
  const handleAddIncome = () => {
    if (!newIncomeLabel.trim() || !newIncomeValue) return;
    setIncomes([...incomes, { id: Math.random().toString(), label: newIncomeLabel, value: Number(newIncomeValue) }]);
    setNewIncomeLabel('');
    setNewIncomeValue('');
  };

  const handleAddFixed = () => {
    if (!newFixedLabel.trim() || !newFixedValue) return;
    setFixedExpenses([...fixedExpenses, { id: Math.random().toString(), label: newFixedLabel, value: Number(newFixedValue) }]);
    setNewFixedLabel('');
    setNewFixedValue('');
  };

  const handleAddVariable = () => {
    if (!newVariableLabel.trim() || !newVariableValue) return;
    setVariableExpenses([...variableExpenses, { id: Math.random().toString(), label: newVariableLabel, value: Number(newVariableValue) }]);
    setNewVariableLabel('');
    setNewVariableValue('');
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter(i => i.id !== id));
  };

  const handleDeleteFixed = (id: string) => {
    setFixedExpenses(fixedExpenses.filter(i => i.id !== id));
  };

  const handleDeleteVariable = (id: string) => {
    setVariableExpenses(variableExpenses.filter(i => i.id !== id));
  };

  // Core calculations taking scenario multipliers into account
  const baseTotals = useMemo(() => {
    const totalInc = incomes.reduce((acc, curr) => acc + curr.value, 0);
    const totalFix = fixedExpenses.reduce((acc, curr) => acc + curr.value, 0);
    
    // Check if the selected category for cuts is in variables
    const totalVar = variableExpenses.reduce((acc, curr) => {
      let val = curr.value;
      if (curr.id === selectedCutCategory) {
        val = val * (1 - (cutPercentage / 100));
      }
      return acc + val;
    }, 0);

    // Apply scenario multipliers:
    // Conservador: -10% Incomes, +12% Expenses
    // Optimista: +10% Incomes, -8% Expenses
    let multiplierIncome = 1.0;
    let multiplierExpenses = 1.0;

    if (scenario === 'conservador') {
      multiplierIncome = 0.90;
      multiplierExpenses = 1.12;
    } else if (scenario === 'optimista') {
      multiplierIncome = 1.10;
      multiplierExpenses = 0.92;
    }

    const calculatedInc = totalInc * multiplierIncome;
    const calculatedFix = totalFix * multiplierExpenses;
    const calculatedVar = totalVar * multiplierExpenses;
    const calculatedExp = calculatedFix + calculatedVar;
    const calculatedSaved = Math.max(0, calculatedInc - calculatedExp);

    return {
      monthlyIncome: Math.round(calculatedInc),
      monthlyExpenses: Math.round(calculatedExp),
      monthlyFixed: Math.round(calculatedFix),
      monthlyVariable: Math.round(calculatedVar),
      monthlyNetSaving: Math.round(calculatedSaved),
      savingGoalMonthly
    };
  }, [incomes, fixedExpenses, variableExpenses, scenario, selectedCutCategory, cutPercentage, savingGoalMonthly]);

  // 12-Month Array Projection taking salary hikes into account
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const yearlyProjection = useMemo(() => {
    const monthsData = [];
    let cumulativeSavings = 0;

    for (let m = 0; m < 12; m++) {
      // Income calculations for this month (index m starting 0 for Jan)
      let currentMonthIncome = baseTotals.monthlyIncome;
      
      if (applyHike && m >= (hikeMonth - 1)) {
        // Find if salary ordinario is present in incomes and apply hike there, or apply generally
        const wageItem = incomes.find(i => i.label.toLowerCase().includes('salario') || i.label.toLowerCase().includes('sueldo'));
        if (wageItem) {
          const baseWage = wageItem.value;
          const hikeDelta = baseWage * (hikePercentage / 100);
          currentMonthIncome += Math.round(hikeDelta);
        } else {
          // fallback apply percentage hike general
          currentMonthIncome += Math.round(currentMonthIncome * (hikePercentage / 100));
        }
      }

      // Expenses remain constant over month boundaries in this projection
      const currentMonthExpenses = baseTotals.monthlyExpenses;
      const netSaves = Math.max(0, currentMonthIncome - currentMonthExpenses);
      cumulativeSavings += netSaves;

      monthsData.push({
        num: m + 1,
        name: monthNames[m],
        income: currentMonthIncome,
        expenses: currentMonthExpenses,
        netSaving: netSaves,
        cumulative: cumulativeSavings
      });
    }

    const totalYearlyIncome = monthsData.reduce((acc, curr) => acc + curr.income, 0);
    const totalYearlyExpenses = monthsData.reduce((acc, curr) => acc + curr.expenses, 0);
    const totalYearlySavings = monthsData.reduce((acc, curr) => acc + curr.netSaving, 0);

    return {
      monthsData,
      totalYearlyIncome,
      totalYearlyExpenses,
      totalYearlySavings
    };
  }, [baseTotals, applyHike, hikeMonth, hikePercentage, incomes]);

  // 50/30/20 Rule Analysis Calculations
  const analysis50_30_20 = useMemo(() => {
    const inc = baseTotals.monthlyIncome;
    if (inc === 0) return { needs: 0, wants: 0, savings: 0, needsP: 0, wantsP: 0, savingsP: 0 };
    
    // Needs (Garantizados Fijos)
    const needs = baseTotals.monthlyFixed;
    // Wants (Ingresos variables)
    const wants = baseTotals.monthlyVariable;
    // Net real savings or surplus
    const surplus = baseTotals.monthlyNetSaving;

    const needsP = Math.round((needs / inc) * 100);
    const wantsP = Math.round((wants / inc) * 100);
    const savingsP = Math.round((surplus / inc) * 100);

    return {
      needs,
      wants,
      savings: surplus,
      needsP,
      wantsP,
      savingsP
    };
  }, [baseTotals]);

  // Score Indicator between 0-100
  const financialHealth = useMemo(() => {
    let score = 50; // starts in regular base

    const savingRatio = baseTotals.monthlyIncome > 0 ? (baseTotals.monthlyNetSaving / baseTotals.monthlyIncome) * 100 : 0;
    
    // 1. Ratio checks
    if (savingRatio >= 20) {
      score += 25;
    } else if (savingRatio >= 10) {
      score += 15;
    } else if (savingRatio > 0) {
      score += 5;
    } else {
      score -= 20;
    }

    // 2. Needs ratio checks
    const needsRatio = baseTotals.monthlyIncome > 0 ? (baseTotals.monthlyFixed / baseTotals.monthlyIncome) * 100 : 0;
    if (needsRatio <= 50) {
      score += 15;
    } else if (needsRatio <= 65) {
      score += 5;
    } else {
      score -= 15;
    }

    // 3. Goal matching check
    if (baseTotals.monthlyNetSaving >= baseTotals.savingGoalMonthly) {
      score += 10;
    } else if (baseTotals.monthlyNetSaving > 0) {
      score += 3;
    }

    // Clean clamps 0-100
    const finalScore = Math.min(100, Math.max(0, score));

    let tier: 'Excelente' | 'Buena' | 'Regular' | 'Riesgo' = 'Regular';
    let color = 'text-amber-500 bg-amber-100 dark:bg-amber-950/40 border-amber-500/20';
    let iconColor = 'text-amber-500';

    if (finalScore >= 90) {
      tier = 'Excelente';
      color = 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 border-emerald-550/20';
      iconColor = 'text-emerald-500';
    } else if (finalScore >= 70) {
      tier = 'Buena';
      color = 'text-blue-600 bg-blue-105 dark:bg-blue-950/40 border-blue-500/20';
      iconColor = 'text-blue-500';
    } else if (finalScore >= 50) {
      tier = 'Regular';
      color = 'text-orange-500 bg-orange-100 dark:bg-orange-950/40 border-orange-500/20';
      iconColor = 'text-orange-500';
    } else {
      tier = 'Riesgo';
      color = 'text-red-600 bg-red-100 dark:bg-red-950/40 border-red-500/20';
      iconColor = 'text-red-500';
    }

    return {
      score: finalScore,
      tier,
      themeClass: color,
      iconColor
    };
  }, [baseTotals]);

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "\uFEFF"; // BOM UTF-8 for Excel Spanish readability
    csvContent += "Sueldo Fácil - Reporte Presupuestario Anual Completo\n";
    csvContent += `Escenario Simulado:; ${scenario.toUpperCase()}\n`;
    csvContent += `Ingreso Mensual Proyectado (Promedio):; RD$ ${baseTotals.monthlyIncome}\n`;
    csvContent += `Gastos Fijos Totales:; RD$ ${baseTotals.monthlyFixed}\n`;
    csvContent += `Gastos Variables Totales (con cortes):; RD$ ${baseTotals.monthlyVariable}\n`;
    csvContent += `Capacidad Mensual Ahorro Real:; RD$ ${baseTotals.monthlyNetSaving} (${analysis50_30_20.savingsP}%)\n`;
    csvContent += `Puntuación de Salud Financiera:; ${financialHealth.score}/100 - ${financialHealth.tier}\n\n`;

    csvContent += "Tabla Histórica Proyecciones de Mes a Mes\n";
    csvContent += "Mes;Ingresos Proyectados;Gastos Totales;Superávit Mensual;Acumulado Anual\n";

    yearlyProjection.monthsData.forEach(m => {
      csvContent += `${m.name};RD$ ${m.income};RD$ ${m.expenses};RD$ ${m.netSaving};RD$ ${m.cumulative}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Presupuesto_Anual_SueldoFacil_${scenario}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Structured Schema Markup
  const schemaMarkup = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://sueldofacil.com/presupuesto-anual/#webpage",
          "url": "https://sueldofacil.com/presupuesto-anual/",
          "name": "Presupuesto Anual RD | Sueldo Fácil",
          "description": "Calcula tu plan de ahorro y organiza tu presupuesto anual con herramientas gratuitas para República Dominicana."
        },
        {
          "@type": "FAQPage",
          "@id": "https://sueldofacil.com/presupuesto-anual/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿En qué consiste la regla de presupuesto 50/30/20?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Es un enfoque de finanzas que distribuye el sueldo así: 50% para necesidades esenciales (techo, deudas fijas, súper), 30% para deseos suntuarios o variables (ropa, restaurantes, cafés) y 20% retenido obligatoriamente para ahorro, fondos previsional o inversión."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cómo influye un incremento salarial en mi planificación anual?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Un incremento incrementa proporcionalmente la capacidad líguida de ahorro siempre y cuando se evite la 'inflación de estilo de vida' (incrementar paralelamente los gastos variables para calzarse al nuevo sueldo)."
              }
            }
          ]
        }
      ]
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Schema Injection in Head */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* SEO TITLE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-blue-105 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Planificador de Presupuestos
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Presupuesto Anual y Salud Financiera RD
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Toma el control absoluto de tus finanzas. Administra ingresos, gastos fijos y variables, analiza desviaciones bajo la regla 50/30/20 y simula escenarios óptimos o conservadores.
        </p>
      </div>

      {/* THREE SCENARIO SELECTOR SWITCHES */}
      <div className="flex border border-slate-200 dark:border-slate-800 rounded-2xl p-1 bg-slate-150/40 dark:bg-slate-950 max-w-md mx-auto print:hidden">
        <button
          onClick={() => setScenario('conservador')}
          className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${scenario === 'conservador' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          🌧️ Conservador (-10%)
        </button>
        <button
          onClick={() => setScenario('realista')}
          className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${scenario === 'realista' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          ⚖️ Realista
        </button>
        <button
          onClick={() => setScenario('optimista')}
          className={`flex-1 py-2 px-3 text-xs font-black rounded-xl transition-all cursor-pointer ${scenario === 'optimista' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          ☀️ Optimista (+10%)
        </button>
      </div>

      {/* CORE BUDGET GRID INTERACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PRIMARY FORMS PORTFOLIO */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          
          {/* INCOME MANAGER SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>💵 Gestión de Ingresos Netos</span>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                RD$ {incomes.reduce((acc, curr) => acc + curr.value, 0).toLocaleString('en-US')}/mes
              </span>
            </h3>

            {/* Incomes rows rendered */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {incomes.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/20">
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">RD$ {item.value.toLocaleString('en-US')}</span>
                    <button
                      onClick={() => handleDeleteIncome(item.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick append income */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100 dark:border-slate-805/40">
              <input
                type="text"
                placeholder="Nueva categoría (e.g. Alquiler)"
                value={newIncomeLabel}
                onChange={(e) => setNewIncomeLabel(e.target.value)}
                className="col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Monto"
                value={newIncomeValue}
                onChange={(e) => setNewIncomeValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="col-span-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                onClick={handleAddIncome}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FIXED EXPENSES MANAGER SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>🏠 Gastos Fijos (Necesidades)</span>
              <span className="text-xs font-extrabold text-slate-400">
                RD$ {fixedExpenses.reduce((acc, curr) => acc + curr.value, 0).toLocaleString('en-US')}/mes
              </span>
            </h3>

            {/* scroll list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {fixedExpenses.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/20">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">RD$ {item.value.toLocaleString('en-US')}</span>
                    <button
                      onClick={() => handleDeleteFixed(item.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick append expense */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100 dark:border-slate-805/40">
              <input
                type="text"
                placeholder="Nueva categoría fija"
                value={newFixedLabel}
                onChange={(e) => setNewFixedLabel(e.target.value)}
                className="col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Monto"
                value={newFixedValue}
                onChange={(e) => setNewFixedValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="col-span-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                onClick={handleAddFixed}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VARIABLE EXPENSES MANAGER SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex justify-between items-center">
              <span>🛍️ Gastos Variables (Deseos/Súper)</span>
              <span className="text-xs font-extrabold text-slate-400">
                RD$ {variableExpenses.reduce((acc, curr) => acc + curr.value, 0).toLocaleString('en-US')}/mes
              </span>
            </h3>

            {/* scroll list */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {variableExpenses.map(item => {
                const isSelectedCut = item.id === selectedCutCategory;
                const finalVal = isSelectedCut ? item.value * (1 - (cutPercentage / 100)) : item.value;
                return (
                  <div key={item.id} className={`flex justify-between items-center p-2.5 rounded-xl border ${isSelectedCut ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200/20'}`}>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 block">{item.label}</span>
                      {isSelectedCut && (
                        <span className="text-[9px] text-amber-500 font-bold font-mono">¡Corte del {cutPercentage}% activo!</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-450">
                        RD$ {Math.round(finalVal).toLocaleString('en-US')}
                      </span>
                      <button
                        onClick={() => handleDeleteVariable(item.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-lg text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick append variable */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100 dark:border-slate-805/40">
              <input
                type="text"
                placeholder="Nueva categoría variable"
                value={newVariableLabel}
                onChange={(e) => setNewVariableLabel(e.target.value)}
                className="col-span-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Monto"
                value={newVariableValue}
                onChange={(e) => setNewVariableValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="col-span-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                onClick={handleAddVariable}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center p-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SINKING MONTHLY GOAL TARGET */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Meta Mensual de Ahorro Colectiva</span>
              <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400">RD$ {savingGoalMonthly.toLocaleString('en-US')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={savingGoalMonthly}
              onChange={(e) => setSavingGoalMonthly(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

        </div>

        {/* RIGHT COLUMN: CORE DASHBOARD, SCENARIOS, PROJECTIONS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* BUDGET BAR BANNER & FINANCIAL HEALTH SCORE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* HERO OUTFLOW METRICS */}
            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white rounded-3xl p-5 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest block mb-1">
                  ⚖️ Superávit Mensual Proyectado ({scenario})
                </span>
                <span className="text-2xl font-black font-mono">
                  RD$ {baseTotals.monthlyNetSaving.toLocaleString('en-US')}
                </span>
                <div className="text-[10px] text-blue-100 font-semibold mt-2.5 leading-snug">
                  Un ingreso real de <strong className="text-white">RD$ {baseTotals.monthlyIncome.toLocaleString('en-US')}</strong> frente a egresos consolidados de <strong className="text-white">RD$ {baseTotals.monthlyExpenses.toLocaleString('en-US')}</strong>.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-bold text-blue-105">
                <span>Porcentaje de Ahorro:</span>
                <span className="font-mono text-emerald-300">{analysis50_30_20.savingsP}%</span>
              </div>
            </div>

            {/* HEALTH SCORE GRAPH */}
            <div className={`border rounded-3xl p-5 shadow-md flex flex-col justify-between ${financialHealth.themeClass}`}>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest block">
                    📈 Salud Financiera
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${financialHealth.themeClass}`}>
                    {financialHealth.tier}
                  </span>
                </div>
                
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black font-mono">{financialHealth.score}</span>
                  <span className="text-xs font-semibold">/ 100</span>
                </div>

                <p className="text-[10px] font-semibold mt-2.5 leading-relaxed opacity-90">
                  {financialHealth.score >= 90 
                    ? '¡Excelente! Mantienes tus gastos fijos al mínimo y apartas más del 20% de tus ingresos a inversión o previsión.' 
                    : financialHealth.score >= 70
                    ? 'Puntaje positivo. Tienes capacidad de ahorro, pero podrías recortar gastos variables del mes para acelerar tus metas.'
                    : 'Puntaje delicado. Tus gastos fijos representan una fracción alta de tu sueldo neto. Considera desinflar tu presupuesto variable.'}
                </p>
              </div>

              <div className="w-full bg-slate-200/50 dark:bg-slate-950/40 rounded-full h-2 overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 bg-blue-600`}
                  style={{ width: `${financialHealth.score}%` }}
                ></div>
              </div>
            </div>

          </div>

          {/* 50/30/20 ANALYZER COMPARISON PANEL */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  🎯 Evaluación según la regla ideal 50/30/20
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Analiza en qué tramos se reparte tu presupuesto en República Dominicana.</p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handleExportCSV}
                  className="p-1 px-3 bg-slate-100 dark:bg-slate-950 hover:bg-slate-205 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar CSV
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1 px-3 bg-slate-100 dark:bg-slate-950 hover:bg-slate-205 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
              </div>
            </div>

            {/* Split progression bars comparative to 50/30/20 */}
            <div className="space-y-4">
              
              {/* Needs bar */}
              <div>
                <div className="flex justify-between items-center text-xs pb-1 font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Necesidades Fijas (Alquiler, TSS, Préstamos): {analysis50_30_20.needsP}%</span>
                  <span className="text-slate-400">Meta recomendada: 50%</span>
                </div>
                <div className="w-full bg-slate-150 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${analysis50_30_20.needsP > 50 ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(100, analysis50_30_20.needsP)}%` }}
                  ></div>
                </div>
              </div>

              {/* Wants bar */}
              <div>
                <div className="flex justify-between items-center text-xs pb-1 font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Deseos Variables (Comida extra, salidas, ropa): {analysis50_30_20.wantsP}%</span>
                  <span className="text-slate-400">Meta recomendada: 30%</span>
                </div>
                <div className="w-full bg-slate-150 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${analysis50_30_20.wantsP > 30 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, analysis50_30_20.wantsP)}%` }}
                  ></div>
                </div>
              </div>

              {/* Savings bar */}
              <div>
                <div className="flex justify-between items-center text-xs pb-1 font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Ahorro e Inversión (Sobrante proyectado): {analysis50_30_20.savingsP}%</span>
                  <span className="text-slate-400">Meta recomendada: 20%</span>
                </div>
                <div className="w-full bg-slate-150 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${analysis50_30_20.savingsP >= 20 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, analysis50_30_20.savingsP)}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* Smart system alert notifications */}
            {analysis50_30_20.needsP > 50 && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950 p-3 rounded-xl flex gap-2.5">
                <AlertTriangle className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-800 dark:text-red-400 leading-relaxed font-semibold">
                  Tus <strong>necesidades fijas superan el 50%</strong> recomendado de tu presupuesto base. Esto te resta margen de maniobra ante emergencias laborales. Intenta refinanciar deudas a menor tasa o buscar un compañero para aminorar el alquiler.
                </p>
              </div>
            )}
          </div>

          {/* DYNAMIC SALARY HIKE SIMULATOR INTERACTIVITY */}
          <div className="bg-gradient-to-br from-slate-900 border border-slate-800 to-slate-950 p-6 rounded-3xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  💵 Simulador de Aumento Salarial Anual
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setApplyHike(!applyHike)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${applyHike ? 'bg-emerald-600' : 'bg-slate-800'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${applyHike ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
              Calcula cómo influye proporcionalmente sobre tu presupuesto anual un incremento de sueldo pautado en un determinado mes del año fiscal dominicano.
            </p>

            {applyHike && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 border border-slate-805/40 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Tasa del Incremento (%)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={hikePercentage}
                    onChange={(e) => setHikePercentage(Number(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-555"
                  />
                  <span className="text-xs font-mono font-bold text-slate-300 mt-1 block">Aumento: + {hikePercentage}%</span>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Aplicado a partir de:
                  </label>
                  <select
                    value={hikeMonth}
                    onChange={(e) => setHikeMonth(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl p-2 focus:outline-none text-slate-100 font-bold"
                  >
                    {monthNames.map((n, idx) => (
                      <option key={idx} value={idx + 1}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC EXPENSE CUT SIMULATOR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              ✂️ Simulador de Reducción de Gastos Variables
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Selecciona una de tus categorías variables existentes para simular un recorte y proyectar el ahorro acumulado adicional al finalizar el año fiscal dominicano.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Category Select */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Gasto Variable a Recortar</label>
                <select
                  value={selectedCutCategory}
                  onChange={(e) => setSelectedCutCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl p-2.5 focus:outline-none text-slate-900 dark:text-white font-bold cursor-pointer"
                >
                  {variableExpenses.map(item => (
                    <option key={item.id} value={item.id}>{item.label} (RD$ {item.value})</option>
                  ))}
                </select>
              </div>

              {/* Cut percentage */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <span>Porcentaje de Recorte</span>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{cutPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="10"
                  value={cutPercentage}
                  disabled
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded appearance-none"
                />
                <span className="text-[9px] text-slate-400 block mt-1 font-bold">Configurado al 10% estándar para optimización prudente.</span>
              </div>
            </div>

            {/* Simulated Yearly Saved Bonus box */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/20 dark:border-slate-850/40 rounded-2xl flex justify-between items-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-black block">RECORTE ESTIMADO</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-300">
                  Ahorras: RD$ {Math.round((variableExpenses.find(i => i.id === selectedCutCategory)?.value || 0) * (cutPercentage / 100)).toLocaleString('en-US')} / mes
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-500 font-bold block">AHORRO ANUAL EXCEDENTE</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  + RD$ {Math.round((variableExpenses.find(i => i.id === selectedCutCategory)?.value || 0) * (cutPercentage / 100) * 12).toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC EXCEL-FORM 12-MONTH MATRIX DETAILS FOR SENIOR DESIGNER SPEC */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 overflow-hidden">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              📅 Matriz Completa de Proyección Mensual (Enero - Diciembre)
            </h4>
            <p className="text-[11px] text-slate-400 font-semibold">Observa cómo evoluciona tu balance acumulado a lo largo de los 12 meses:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-2.5 pr-4">Mes</th>
                    <th className="py-2.5 pr-4 text-right">Ingresos</th>
                    <th className="py-2.5 pr-4 text-right">Gastos</th>
                    <th className="py-2.5 pr-4 text-right text-emerald-555">Ahorro</th>
                    <th className="py-2.5 text-right text-blue-500">Acumulado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-semibold text-slate-700 dark:text-slate-350">
                  {yearlyProjection.monthsData.map(m => (
                    <tr key={m.num} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                      <td className="py-2.5 pr-4 font-bold text-slate-800 dark:text-slate-300">{m.name}</td>
                      <td className="py-2.5 pr-4 text-right">RD$ {m.income.toLocaleString('en-US')}</td>
                      <td className="py-2.5 pr-4 text-right">RD$ {m.expenses.toLocaleString('en-US')}</td>
                      <td className="py-2.5 pr-4 text-right text-emerald-600 dark:text-emerald-400">RD$ {m.netSaving.toLocaleString('en-US')}</td>
                      <td className="py-2.5 text-right font-black text-blue-600 dark:text-blue-400">RD$ {m.cumulative.toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DYNAMIC SUMMARIZED PM REPORT WRITTEN IN COMPLIANT PARAGRAPHS */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 rounded-2xl p-4 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-400">Reporte Fiscal Automático</h5>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-500 font-semibold leading-relaxed">
                Tus gastos totales representan el <strong>{Math.round((baseTotals.monthlyExpenses / (baseTotals.monthlyIncome || 1)) * 100)}%</strong> de tus ingresos ordinarios. Actualmente posees una capacidad de reserva líquida de <strong className="text-emerald-900 dark:text-white">RD$ {baseTotals.monthlyNetSaving.toLocaleString('en-US')} mensuales</strong>. Si sostienes este ritmo riguroso en el escenario {scenario}, acumularás la suma neta de <strong className="text-slate-900 dark:text-white">RD$ {yearlyProjection.totalYearlySavings.toLocaleString('en-US')}</strong> al cerrar el año.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SEO ARTICLE CONTENT DEVELOPED BY DIGITAL STRATEGISTS FOR DOMINICAN CONTEXT */}
      <article className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        
        <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Guía Esencial para estructurar tu Presupuesto Anual en República Dominicana
          </h2>
          <p className="text-sm font-semibold text-slate-400">
            Alinea tus ingresos netos según los costos de la canasta básica familiar, el precio inflacionario del carbón local y la regla 50/30/20.
          </p>
        </header>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. ¿Por qué el presupuesto anual supera en valor a los presupuestos semanales convencionales?
          </h3>
          <p>
            Gestionar las finanzas dominicanas con planes únicamente mensuales suele ocultar gastos irregulares o anuales de fuerte impacto como el <strong>marbete de circulación vehicular</strong>, la póliza inmobiliaria o del automóvil, los útiles de inicio del año escolar en agosto y los dobles aportes por concepto del descuento de TSS en meses con regalías extras.
          </p>
          <p>
            Al proyectar tus ingresos a 12 meses consideras el impacto del <strong>doble sueldo o regalía pascual</strong> que por ley está libre de retenciones fiscales ordinarias. Esto te permite redistribuir el excedente de diciembre para atenuar la denominada "cuesta de enero", una época de alta fricción crediticia en la población del país.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Adaptabilidad de la famosa Regla 50/30/20 en el contexto de Santo Domingo y Provincias
          </h3>
          <p>
            La regla 50/30/20 (50% necesidades, 30% deseos, 20% ahorro) es un estándar global, pero en República Dominicana requiere ligeros ajustes debido al costo de la canasta básica alimentaria estimada por el Banco Central de la República Dominicana, la cual ronda habitualmente los RD$44,000 en promedio general de escala dominicana.
          </p>
          <p>
            Para salarios inferiores al promedio nacional, la división de gastos fijos (alimentación del hogar, renta, servicios públicos de las distribuidoras EDE, agua, transporte diario) puede absorber hasta el 70% u 80% del sueldo nominal neto. Si estás en esta situación, tu prioridad imperativa en el presupuesto debe ser:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Comprimir el Gasto Variable:</strong> Disminuir suscripciones digitales innecesarias, comidas fuera del hogar u ocio no programado los fines de semana.
            </li>
            <li>
              <strong>Focalizar Ingreso en Amortizar Deudas Pasivas:</strong> Amortizar préstamos de consumo rápido o tarjetas tradicionales que devengan altos cargos por mora y tasas anuales cercanas al 60% dominicano.
            </li>
            <li>
              <strong>Corte de un 10% prudente:</strong> Simular escenarios controlados de optimización de combustible o transporte masivo.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Control sobre la Inflación de Estilo de Vida ante un Aumento de Nómina
          </h3>
          <p>
            Un error común tras recibir un aumento de sueldo de ley o de nómina corporativa ordinaria es incrementar de forma sincronizada los gastos variables o fijos (comprar un nuevo vehículo, rentar un apartamento más costoso). Esto se conoce como <strong>inflación de estilo de vida</strong> e impide el crecimiento de tu salud financiera o tu fondo de vejez de AFP. El simulador integrado de aumento te permite prever cómo capturar ese excedente líquido para volcarlo de inmediato hacia tu plan estratégico de ahorro o inversiones en la bolsa de valores nacional.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. 15 Preguntas Frecuentes (FAQ) sobre Estructuración de Presupuesto Anual RD
          </h3>
          <div className="space-y-3 dark:border-slate-800">
            {[
              {
                q: "¿Qué diferencia un gasto fijo de un gasto variable?",
                a: "Los gastos fijos son recurrentes y obligatorios para mantener tu subsistencia y techo (hipoteca o alquiler, colegiaturas, préstamos contraídos y servicios como luz de la Ede). Los variables fluctúan e incluyen gastos adaptables como compras de ropa, salidas recreacionales y restaurantes."
              },
              {
                q: "¿Cuáles son las ventajas de proyectar a un año entero en vez de un mes?",
                a: "Te permite visibilizar los meses de déficit estacionales o con gastos densos fijos (seguros, inicio de año escolar en agosto, marbete) y cubrirlos utilizando excedentes planeados como el doble sueldo de diciembre."
              },
              {
                q: "¿Cómo calculo exactamente la capacidad de ahorro en pesos dominicanos?",
                a: "Toma todos tus ingresos netos mensuales percibidos y réstale la sumatoria de tus egresos (gastos fijos obligatorios + gastos variables reales). El monto sobrante finaliza directo a tu balanza de ahorro."
              },
              {
                q: "¿Es aconsejable amortizar deudas antes de iniciar un plan de ahorro?",
                a: "SÍ. Las deudas de tarjetas de crédito o prestamistas personales cobran tasas usureras (por encima de las tasas pasivas de rendimientos de bolsa de valores). Consolidar deudas primero te libera valiosa liquidez mensual para tu presupuesto."
              },
              {
                q: "¿Qué pasa si mis gastos fijos superan el 70% de mi ingreso ordinario?",
                a: "Significa que estás bajo un grado de vulnerabilidad crediticia. Debes revisar alternativas de reducción estricta de telefonía, internet básico, refinar préstamos o complementar ingresos a través de freelance los fines de semana."
              },
              {
                q: "¿Qué es el doble sueldo pascual en RD y dónde clasifica en el presupuesto?",
                a: "Está legislado bajo los Artículos 219 al 222 del Código del Trabajo dominicano. Se percibe en diciembre libre de retenciones impositivas y de seguridad social. Se debe catalogar como un ingreso extraordinario destinado principalmente para saldar pasivos u ahorro en bolsas."
              },
              {
                q: "¿Cómo se calcula y para qué sirve la retención patronal de TSS?",
                a: "El patrono retiene mensualmente tu parte previsional legal: SFS (3.04%) y AFP (2.87%). Estas retenciones reducen tu base gravable sujeta a ISR de la DGII."
              },
              {
                q: "¿Qué es la canasta familiar dominicana y cómo influye en mi presupuesto?",
                a: "Es la canasta de bienes básicos (comida de súper, vestimenta, luz, transporte) calculada mensualmente por el Banco Central. Conocerla te da una base para medir si tus egresos personales de súper están sobre la media del sector poblacional correspondiente."
              },
              {
                q: "¿Cuál es una tasa de corte viable para reducir gastos de ocio?",
                a: "Una tasa saludable de optimización prudente en salidas o comidas ociosas se sitúa entre un 10% y un 30% mensual, lo que rinde un robusto acumulado de excedente al cerrar el año fiscal sin comprometer severamente tu bienestar social."
              },
              {
                q: "¿Puedo colocar ítems como el pago diario del 'gimnasio' como gasto fijo?",
                a: "No, a menos que sea un contrato de pago mandatorio. Clasifícalo preferentemente en gastos variables de recreación, de tal forma que puedas suspenderlo fácilmente si tu presupuesto entra en zona de riesgo."
              },
              {
                q: "¿Cómo incluyo los imprevistos médicos en el presupuesto anual?",
                a: "Sincroniza un aporte periódico fijo hacia un sub-fondo específico de salud, o contrata un plan básico de seguro complementario que disminuya el deducible imprevisto en emergencias."
              },
              {
                q: "¿Es la regla 50/30/20 aconsejable para microempresas dominicanas?",
                a: "La regla está orientada a finanzas personales. En negocios dominicanos o Mipymes, el flujo de caja operativo demanda un control porcentual de márgenes de reinversión mucho más estricto."
              },
              {
                q: "¿Cómo influye el tipo de cambio del dólar en mis gastos variables en RD?",
                a: "La depreciación del peso encarece bienes de alta importación como carburantes, electrodomésticos y servicios de streaming internacionales, por lo que tus gastos variables se incrementarán de manera exógena si la moneda sufre fluctuación."
              },
              {
                q: "¿Cómo configuro un plan para saldar mis tarjetas de crédito dominicanas rápidas?",
                a: "Utiliza el método de 'bola de nieve': enumera tus tarjetas de menor a mayor saldo y vuelca todo tu sueldo excedente a saldar la de menor saldo amortizando solo el pago mínimo del resto. Una vez liquidada la menor, vuelcas ese capital redundante con fuerza e impulso hacia la siguiente."
              },
              {
                q: "¿Existe una aplicación regulada para consolidar todos mis presupuestos dominicanos?",
                a: "Puedes usar calculadoras consolidadas gratuitas como la de Sueldo Fácil para modelar escenarios exactos y descargar plantillas unificadas XLS para tu control diario en casa."
              }
            ].map((item, idx) => (
              <div key={idx} className="border-b border-slate-100 dark:border-slate-805/40 pb-3">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left font-bold text-slate-800 dark:text-slate-300 py-2 hover:text-blue-600 focus:outline-none focus:text-blue-500"
                >
                  <span>{idx + 1}. {item.q}</span>
                  {openFaq[idx] ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>
                {openFaq[idx] && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-4 pt-1 leading-relaxed">
                    {item.a}
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
