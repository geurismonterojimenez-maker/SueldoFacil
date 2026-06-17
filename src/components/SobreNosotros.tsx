import React from 'react';
import { Users, ShieldCheck, Heart, Award, CheckCircle } from 'lucide-react';
import YmylDisclaimer from './YmylDisclaimer';

export default function SobreNosotros() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 py-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400 border border-blue-200/50">
          <Users className="w-3.5 h-3.5" />
          Conoce al Equipo Detrás de SueldoFácil
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Sobre Nosotros
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Educamos y creamos herramientas transparentes para empoderar a la fuerza laboral y corporativa dominicana.
        </p>
      </div>

      <YmylDisclaimer type="general" />

      {/* DETAILED HUMAN STORY */}
      <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5.5 h-5.5 text-blue-600" />
          Nuestra Historia y Propósito de Proyecto
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
          SueldoFácil nació de una necesidad constante: facilitar cálculos laborales confiables bajo el Código de Trabajo dominicano (Ley 16-92) sin caer en confusiones matemáticas o tecnicismos gubernamentales inaccesibles.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          En República Dominicana, los despidientes, empleadores, jefes de nóminas y profesionales independientes a menudo se topaban con cálculos de retenciones de la TSS, salarios escalonados por escala de ISR o liquidación de prestaciones que resultaban difíciles de calcular sin planillas costosas. Desarrollamos esta suite de cálculo gratuita, intuitiva e interactiva de última generación para nivelar el campo de juego informacional de ambos lados de la moneda.
        </p>
      </div>

      {/* EXPERIENCIA ACUMULADA Y VALORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* EXPERIENCIA ACUMULADA */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Experiencia Acumulada</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Nuestro equipo está compuesto por desarrolladores de software enfocados en Fintech, economistas dedicados a la planificación de finanzas personales, y asesores legales especialistas en derecho laboral dominicano. Sumamos más de 10 años de experiencia conjunta en el diseño e implementación de sistemas de facturación corporativa, liquidaciones del sector privado y asesoramiento tributario directo en la DGII y la TSS.
          </p>
        </div>

        {/* VALORES */}
        <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-6 space-y-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nuestros Valores Fundacionales</h3>
          <ul className="space-y-2 text-xs text-slate-650 dark:text-slate-350">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Precisión Matemática:</strong> Erradicación absoluta de estimaciones aproximadas.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Transparencia:</strong> Divulgación completa de fórmulas y marcos legales.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span><strong>Accesibilidad:</strong> Herramientas útiles libres de suscripciones ocultas.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* COMPROMISO CON LA TRANSMISIÓN Y ACTUALIZACIONES */}
      <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Nuestro Doble Compromiso de Confianza
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block">Compromiso con la Precisión</span>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-normal">
              Revisamos cada cálculo bajo directrices vigentes de la DGII y Ministerios locales. Al menor cambio legislativo en las retenciones, reescribimos el código base y aplicamos auditorías cruzadas.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block">Compromiso con la Transparencia</span>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-normal">
              Nunca camuflaremos anuncios publicitarios agresivos ni solicitaremos credenciales bancarias personales. No guardamos estadísticas de tus salarios ni información identificable, cumpliendo con la privacidad del usuario.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-850">
        <p className="text-xs text-slate-500 font-mono">
          SueldoFácil es un simulador educativo creado de forma independiente en la República Dominicana.
        </p>
      </div>

    </div>
  );
}
