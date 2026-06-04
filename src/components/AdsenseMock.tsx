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
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const shellHeight = type === 'banner' ? '132px' : type === 'infeed' ? '202px' : '358px';
    const shellMaxHeight = type === 'banner' ? '132px' : type === 'infeed' ? '242px' : '380px';
    const frameHeight = type === 'banner' ? '110px' : type === 'infeed' ? '180px' : '300px';
    const frameMaxHeight = type === 'banner' ? '120px' : type === 'infeed' ? '220px' : '336px';
    const applySizing = () => {
      shellRef.current?.style.setProperty('height', shellHeight, 'important');
      shellRef.current?.style.setProperty('max-height', shellMaxHeight, 'important');
      shellRef.current?.style.setProperty('overflow', 'hidden', 'important');
      frameRef.current?.style.setProperty('height', frameHeight, 'important');
      frameRef.current?.style.setProperty('max-height', frameMaxHeight, 'important');
      frameRef.current?.style.setProperty('overflow', 'hidden', 'important');
    };

    // Trigger AdSense push dynamically once the component finishes mounting 
    if (typeof window !== 'undefined') {
      try {
        if (!initialized.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
        applySizing();
        const timers = [100, 500, 1200].map(delay => window.setTimeout(applySizing, delay));
        return () => timers.forEach(timer => window.clearTimeout(timer));
      } catch (err) {
        console.warn('AdSense delivery error on slot', slot, err);
      }
    }
  }, [slot, type]);

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

  const shellStyle = {
    height: type === 'banner' ? '132px' : type === 'infeed' ? '202px' : '358px',
    maxHeight: type === 'banner' ? '132px' : type === 'infeed' ? '242px' : '380px',
  };
  const frameStyle = {
    height: type === 'banner' ? '110px' : type === 'infeed' ? '180px' : '300px',
    maxHeight: type === 'banner' ? '120px' : type === 'infeed' ? '220px' : '336px',
    aspectRatio: type === 'square' ? '1 / 1' : undefined,
  };
  const adStyle = {
    display: 'block',
    width: '100%',
    height: type === 'banner' ? '90px' : type === 'infeed' ? '160px' : '300px',
    minWidth: '250px',
  };

  return (
    <div ref={shellRef} className={`adsense-shell relative overflow-hidden ${containerClasses}`} style={shellStyle}>
      <div className="adsense-wrapper relative overflow-hidden transition-all duration-200 w-full text-center">
        <span className="block text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase pb-2 select-none">
          ANUNCIO PATROCINADO
        </span>
        <div
          ref={frameRef}
          className="flex justify-center items-center overflow-hidden bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200/60 dark:border-slate-800/60 p-2"
          style={frameStyle}
        >
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={adStyle}
            data-ad-client="ca-pub-6144599865368963"
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}

