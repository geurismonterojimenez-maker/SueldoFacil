import React from 'react';
import { BookOpen, FileCheck2, RefreshCw, AlertCircle, Sparkles, Scale } from 'lucide-react';
import YmylDisclaimer from './YmylDisclaimer';

export default function PoliticaEditorial() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 py-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400 border border-blue-200/50">
          <BookOpen className="w-3.5 h-3.5" />
          Transparencia y Calidad Informativa
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Política Editorial de SueldoFácil
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Nuestras pautas deontológicas, metodologías pedagógicas y estándares de revisión técnica que guían cada simulación, artículo y herramienta.
        </p>
      </div>

      <YmylDisclaimer type="general" />

      {/* CORE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* MISIÓN */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl w-fit">
            <Scale className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Misión Editorial</h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
            Nuestra principal meta es democratizar y simplificar el acceso a la legislación laboral dominicana para trabajadores y gestores de talento. 
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminamos las barreras del lenguaje técnico denso traduciendo decretos estatales y tablas de retenciones impositivas en simuladores intuitivos de uso libre, promoviendo la educación financiera, equidad legal y previsión presupuestaria en la República Dominicana.
          </p>
        </div>

        {/* METODOLOGÍA / CRITERIOS */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Criterios de Investigación</h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
            Solo investigamos bajo el amparo de materiales oficiales emitidos por los reguladores del Estado dominicano.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            No adaptamos ni difundimos especulaciones informales de prensa o rumores de redes sociales. Todo lo publicado en las calculadoras de ISR, AFP, SFS o Prestaciones proviene directamente de la Gaceta Oficial, Ley 16-92 del Código de Trabajo, circulares administrativas de la DGII y los boletines formales de la TSS.
          </p>
        </div>

        {/* PROCESO DE REVISIÓN */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Proceso de Revisión Técnica</h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
            Validación de código y fórmulas matemáticas por partida doble.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Antes de que cualquier cambio matemático o lógico sea integrado en nuestras calculadoras, el algoritmo es sometido a auditorías internas utilizando escenarios de liquidación reales, planillas en Excel provistas por contadores expertos en República Dominicana y el validador oficial de la Tesorería de la Seguridad Social.
          </p>
        </div>

        {/* FRECUENCIA DE ACTUALIZACIÓN */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Frecuencia de Actualización</h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
            Monitoreo diario de las disposiciones de entes rectores.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Las escalas tributarias anuales de la Dirección General de Impuestos Internos (DGII), los salarios mínimos sectoriales revisados por el Comité Nacional de Salarios y los topes de cotización de la Tesorería de la Seguridad Social (TSS) se actualizan inmediatamente tras su entrada en vigor legal.
          </p>
        </div>

        {/* POLÍTICA DE CORRECCIÓN DE ERRORES */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3 md:col-span-2">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl w-fit">
            <AlertCircle className="w-5 h-5 animate-bounce" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Política de Corrección y Fe de Errata</h2>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
            Fe absoluta de errata ante discrepancias en legislaciones impositivas o cambios interpretativos.
          </p>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            A pesar de nuestros exhaustivos filtros, si descubrimos un error de cálculo o un contenido desactualizado, el equipo editorial de SueldoFácil procede a corregirlo en un plazo máximo de 12 horas. También contamos con una vía directa para recibir notificaciones de nuestros usuarios por correo, publicando notas de ajuste en nuestro blog con total transparencia.
          </p>
        </div>

        {/* OPINIÓN VS INFORMACIÓN */}
        <div className="bg-slate-100/50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850 p-6 rounded-2xl md:col-span-2 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400 block">
            Diferenciación de Contenidos: Informativo vs Simulación
          </span>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            En SueldoFácil establecemos límites nítidos entre la recopilación objetiva de la ley (contenidos informativos del Código Civil o Laboral) y las estimaciones hechas en los simuladores interactivos o interpretaciones educativas de nuestro blog. Las herramientas digitales ofrecen cálculos proyectados, de modo que el usuario debe comprender que corresponden a simulaciones hipotéticas y consultar fuentes jurídicas vinculantes en caso de litigios.
          </p>
        </div>

      </div>

      {/* FOOTER INFO */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-850">
        <p className="text-xs text-slate-500 font-mono">
          Última actualización de la Política Editorial: 16 de Junio, 2026.
        </p>
      </div>

    </div>
  );
}
