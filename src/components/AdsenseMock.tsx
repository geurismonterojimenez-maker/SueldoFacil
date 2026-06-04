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

const AD_CLIENT = 'ca-pub-6144599865368963';

const AD_SLOTS = {
  banner: '8085041596',
  square: '9925726553',
  sidebar: '9925726553',
  infeed: '7571025953',
};

const FORMAT_CONFIG = {
  banner: {
    outerHeight: 118,
    frameHeight: 96,
    outerClass: 'w-full max-w-5xl mx-auto my-8 text-center print:hidden',
    format: 'auto',
  },
  infeed: {
    outerHeight: 176,
    frameHeight: 154,
    outerClass: 'w-full max-w-4xl mx-auto my-8 text-center print:hidden',
    format: 'fluid',
  },
  square: {
    outerHeight: 322,
    frameHeight: 300,
    outerClass: 'w-full max-w-[320px] mx-auto my-8 text-center print:hidden',
    format: 'auto',
  },
  sidebar: {
    outerHeight: 322,
    frameHeight: 300,
    outerClass: 'w-full max-w-[320px] mx-auto my-6 text-center print:hidden',
    format: 'auto',
  },
};

export default function AdsenseMock({ slot = 'default', type = 'banner' }: AdsenseMockProps) {
  const adRef = useRef<HTMLModElement>(null);
  const placementRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const config = FORMAT_CONFIG[type];
  const adSlot = AD_SLOTS[type];

  useEffect(() => {
    const applySizing = () => {
      placementRef.current?.style.setProperty('height', `${config.outerHeight}px`, 'important');
      placementRef.current?.style.setProperty('max-height', `${config.outerHeight}px`, 'important');
      placementRef.current?.style.setProperty('overflow', 'hidden', 'important');
      frameRef.current?.style.setProperty('height', `${config.frameHeight}px`, 'important');
      frameRef.current?.style.setProperty('max-height', `${config.frameHeight}px`, 'important');
      frameRef.current?.style.setProperty('overflow', 'hidden', 'important');
    };

    if (typeof window !== 'undefined') {
      try {
        applySizing();
        if (!initialized.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          initialized.current = true;
        }
        const timers = [100, 500, 1200, 2400].map(delay => window.setTimeout(applySizing, delay));
        return () => timers.forEach(timer => window.clearTimeout(timer));
      } catch (err) {
        console.warn('AdSense delivery error on slot', slot, err);
      }
    }
  }, [config.frameHeight, config.outerHeight, slot]);

  return (
    <div
      ref={placementRef}
      className={config.outerClass}
      data-ad-placement={slot}
      style={{ height: config.outerHeight, maxHeight: config.outerHeight, overflow: 'hidden' }}
    >
      <span className="block h-[18px] text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase select-none">
        Anuncio patrocinado
      </span>
      <div
        ref={frameRef}
        className="relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200/70 bg-slate-50/70 p-2 dark:border-slate-800/70 dark:bg-slate-900/20"
        style={{ height: config.frameHeight, maxHeight: config.frameHeight, overflow: 'hidden' }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: type === 'banner' ? 90 : type === 'infeed' ? 140 : 280,
            minWidth: 250,
          }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format={config.format}
          data-ad-layout={type === 'infeed' ? 'in-article' : undefined}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
