import { useState, useEffect } from 'react';

export type Breakpoint = 'lg' | 'xl' | '2xl';

const BREAKPOINTS = {
  '2xl': 1536,
  xl: 1280,
} as const;

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('lg');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};
