import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  type?: 'finanzas' | 'legal' | 'general';
  className?: string;
}

export default function YmylDisclaimer({ type = 'general', className = '' }: Props) {
  const getMessage = () => {
    switch (type) {
      case 'finanzas':
        return 'La información y los cálculos proporcionados en esta herramienta tienen fines estrictamente educativos e informativos y no constituyen ni reemplazan una asesoría financiera, tributaria o contable profesional. Aunque nos esforzamos por verificar nuestras fuentes con las guías de la DGII y la TSS, las normativas pueden variar según condiciones particulares. Por favor, consulte con un consultor financiero o contador matriculado.';
      case 'legal':
        return 'Los cálculos de prestaciones y liquidaciones laborales simulados aquí se rigen exclusivamente bajo fines didácticos e ilustrativos sobre la Ley 16-92 (Código de Trabajo de la República Dominicana). No constituye ninguna forma de asesoría jurídica o representación legal profesional. Las decisiones de terminación laboral deben ser revisadas o consultadas de manera formal con un abogado especializado o con los canales directos del Ministerio de Trabajo.';
      default:
        return 'Todo el contenido, calculadoras y herramientas de este portal están diseñados para apoyo didáctico e ilustrativo. No constituyen asesoría profesional (financiera, jurídica o tributaria). Aunque se actualiza regularmente con leyes vigentes, consulte siempre a profesionales acreditados o a los organismos oficiales correspondientes antes de tomar decisiones definitivas.';
    }
  };

  return (
    <div className={`p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-slate-700 dark:text-slate-350 ${className}`}>
      <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
          Aviso Legal y Descargo de Responsabilidad (YMYL)
        </span>
        <p className="text-xs leading-relaxed font-medium">
          {getMessage()}
        </p>
      </div>
    </div>
  );
}
