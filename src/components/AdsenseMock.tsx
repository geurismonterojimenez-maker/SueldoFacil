import React, { useEffect, useRef } from 'react';

interface AdsenseMockProps {
  slot?: string;
  type?: 'banner' | 'square' | 'sidebar' | 'infeed';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdsenseMock({ slot = "default", type = "banner" }: AdsenseMockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Trigger AdSense push dynamically once the component finishes mounting 
    if (typeof window !== 'undefined') {
      try {
        if (!initialized.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
      } catch (err) {
        console.warn('AdSense delivery error on slot', slot, err);
      }
    }
  }, [slot]);

  // Map requested spaces directly to the user's authentic Google AdSense Slots
  let adSlot = "8085041596"; // SueldoFacil_anuncio_Horizontal

  if (type === 'square' || type === 'sidebar') {
    adSlot = "9925726553"; // SueldoFacil_Cuadrado
  } else if (type === 'infeed') {
    adSlot = "7571025953"; // Anuncios In-feed3
  }

  // Polished layout classes adapting dynamically to modern devices
  const containerClasses = type === 'square' 
    ? "w-full max-w-sm mx-auto my-4 text-center" 
    : type === 'sidebar' 
    ? "w-full my-4 text-center" 
    : "w-full my-6 text-center";

  return (
    <div className={`adsense-wrapper relative overflow-hidden transition-all duration-200 ${containerClasses}`}>
      <span className="block text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase pb-2 select-none">
        ANUNCIO PATROCINADO
      </span>
      <div className="flex justify-center items-center min-h-[90px] bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800/60 p-2">
        <ins 
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minWidth: '250px' }}
          data-ad-client="ca-pub-6144599865368963"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

