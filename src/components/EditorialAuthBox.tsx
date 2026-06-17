import React from 'react';
import { UserCheck, CheckCircle2, Calendar } from 'lucide-react';

interface Props {
  author?: string;
  role?: string;
  reviewDate?: string;
  updateDate?: string;
  sources?: string[];
  className?: string;
}

export default function EditorialAuthBox({
  author = 'Equipo Editorial SueldoFácil',
  role = 'Especialistas en Derecho del Trabajo y Contabilidad en RD',
  reviewDate = 'Junio 2026',
  updateDate = '16 de Junio, 2026',
  sources = [
    'Código de Trabajo de la República Dominicana (Ley N° 16-92)',
    'Reglamento de Aplicación de la TSS (Ley N° 87-01)',
    'Escalas Mensuales del Impuesto Sobre la Renta (DGII 2026)'
  ],
  className = ''
}: Props) {
  return (
    <div className={`mt-8 p-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800 rounded-2xl space-y-4 ${className}`}>
      
      {/* AUTHOR DETAILS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/65 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {author}
            </span>
            <span className="text-[10px] text-slate-550 dark:text-slate-400 font-medium block">
              {role}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-mono text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Revisado: {reviewDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Actualizado: {updateDate}</span>
          </div>
        </div>
      </div>

      {/* COMPLIANCE CORE SENTENCE */}
      <div className="space-y-1.5">
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
          Contenido elaborado por el equipo editorial del sitio y revisado utilizando fuentes oficiales.
        </p>
        <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal">
          SueldoFácil garantiza la exactitud matemática de sus fórmulas apegándose al pie de la letra al Código de Trabajo dominicano (Regulación 16-92), las tasas impositivas de la DGII para personas físicas y las directrices de retención del Régimen Contributivo de la Seguridad Social (TSS).
        </p>
      </div>

      {/* METOLOGÍA Y MATERIAL DE CONSULTA */}
      {sources && sources.length > 0 && (
        <div className="bg-white dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900">
          <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-slate-550 dark:text-slate-400 block mb-2">
            Fuentes Oficiales y Referencias Consultadas
          </span>
          <ul className="space-y-1.5">
            {sources.map((src, idx) => (
              <li key={idx} className="text-[10.5px] text-slate-600 dark:text-slate-350 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                <span>{src}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
