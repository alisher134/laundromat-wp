'use client';

import { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
  overlayColor?: string;
  overlayOpacity?: number;
}

export const ContentWrapper = ({ children, overlayColor = '#C7D8E3', overlayOpacity = 0.2 }: ContentWrapperProps) => {
  return (
    <div className="relative z-10 bg-white">
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
      <div className="relative">{children}</div>
    </div>
  );
};
