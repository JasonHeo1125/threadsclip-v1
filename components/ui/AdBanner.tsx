'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export function AdBanner({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = '' 
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) return;
    
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
      adsbygoogle.push({});
      isAdLoaded.current = true;
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

export function AdBannerPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`bg-[var(--color-bg-elevated)] border border-dashed border-[var(--color-border)] rounded-lg flex items-center justify-center text-[var(--color-text-muted)] text-sm ${className}`}
      style={{ minHeight: '90px' }}
    >
      <span>Ad Space</span>
    </div>
  );
}
