'use client';

import { cn } from '@/shared/libs/cn';
import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
  className?: string;
}

export const Preloader = ({ onComplete, className }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleLoad = () => {
      setOpacity(0);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 300);
    };

    if (document.readyState === 'complete') {
      setTimeout(handleLoad, 3000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(handleLoad, 3000);
      });
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-white', className)}
      style={{ opacity, transition: 'opacity 0.3s ease-in-out' }}
    >
      <video
        autoPlay
        className="pointer-events-none size-[100px]"
        loop
        muted
        playsInline
        src="/videos/preloader-speed.mp4"
      />
    </div>
  );
};
