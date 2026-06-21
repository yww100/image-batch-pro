'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  slot: string;
  client?: string;
  style?: React.CSSProperties;
  className?: string;
  layout?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

export default function AdSense({
  slot,
  client = ADSENSE_CLIENT,
  style,
  className = '',
  layout = 'in-article',
  format = 'auto',
}: AdSenseProps) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!client || !slot) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense push failed', e);
    }
  }, [client, slot]);

  if (!client || !slot) {
    return (
      <div
        className={`bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center ${className}`}
        style={style}
      >
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Advertisement</p>
        <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center">
          <span className="text-sm text-slate-400">Ad space — upgrade to Pro to remove ads</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 text-center">Advertisement</p>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </div>
  );
}
