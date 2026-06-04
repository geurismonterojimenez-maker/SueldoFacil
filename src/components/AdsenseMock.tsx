import React from 'react';

interface AdsenseMockProps {
  slot?: string;
  type?: 'banner' | 'square' | 'sidebar';
}

export default function AdsenseMock({ slot = "default", type = "banner" }: AdsenseMockProps) {
  // Define highly polished, responsive container styles to prevent layout breakages on mobile screen bounds
  const styles = {
    // Banner should be thin and adaptive (smaller on mobile screens, larger on tablets & desktops)
    banner: "w-full min-h-[64px] sm:min-h-[80px] md:min-h-[96px] my-4 md:my-6",
    // Square handles content streams natively and is bounded on larger screen widths
    square: "w-full max-w-sm min-h-[160px] sm:min-h-[200px] md:min-h-[250px] mx-auto my-3 md:my-5",
    // Sidebar slots usually sit on grid columns and grow responsibly
    sidebar: "w-full min-h-[220px] sm:min-h-[300px] md:min-h-[350px] my-3 md:my-5"
  };

  return (
    <div 
      className={`bg-slate-50/70 hover:bg-slate-50 border border-dashed border-slate-200/90 dark:bg-slate-900/30 dark:border-slate-800 dark:hover:bg-slate-900/45 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden p-4 md:p-6 transition-all duration-150 ${styles[type]}`}
    >
      <span className="absolute top-2 right-3 text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none">
        Anuncio Patrocinado
      </span>
      
      <div className="text-center font-sans">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/30 dark:border-blue-900/30 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase">AdSense</p>
        </div>
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">SueldoFacil Ads • Responsive Slot</p>
        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">Identificador del Espacio: #{slot}</p>
      </div>

      {/* Decorative gradient accents that look extremely professional */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-550 to-emerald-500 opacity-20 dark:opacity-30"></div>
    </div>
  );
}
