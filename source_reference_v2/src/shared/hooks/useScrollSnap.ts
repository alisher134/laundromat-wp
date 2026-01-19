'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface UseScrollSnapOptions {
  enabled?: boolean;
  scrollEndFallbackMs?: number;
}

const SCROLL_END_FALLBACK_MS = 600;

export const useScrollSnap = ({
  enabled = true,
  scrollEndFallbackMs = SCROLL_END_FALLBACK_MS,
}: UseScrollSnapOptions = {}) => {
  const isSnappingRef = useRef(false);
  const lastScrollY = useRef(0);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const snapToPosition = useCallback((targetY: number) => {
    if (isSnappingRef.current) return;

    isSnappingRef.current = true;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, []);

  const handleScrollEnd = useCallback(() => {
    isSnappingRef.current = false;
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const supportsScrollEnd = 'onscrollend' in window;

    const handleScroll = () => {
      if (isSnappingRef.current) return;

      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY.current;
      lastScrollY.current = scrollY;

      if (scrollY > 0 && scrollY < heroHeight) {
        if (scrollingDown) {
          snapToPosition(heroHeight);
        } else {
          snapToPosition(0);
        }

        if (!supportsScrollEnd) {
          if (fallbackTimeoutRef.current) {
            clearTimeout(fallbackTimeoutRef.current);
          }
          fallbackTimeoutRef.current = setTimeout(handleScrollEnd, scrollEndFallbackMs);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (supportsScrollEnd) {
      window.addEventListener('scrollend', handleScrollEnd);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (supportsScrollEnd) {
        window.removeEventListener('scrollend', handleScrollEnd);
      }
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
      }
    };
  }, [enabled, scrollEndFallbackMs, snapToPosition, handleScrollEnd]);
};
