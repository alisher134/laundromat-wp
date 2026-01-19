'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

import LocationPointIcon from '@/shared/assets/icons/map-point-icon.svg';
import LocationPointOutlineIcon from '@/shared/assets/icons/map-point-outline-icon.svg';

interface LocationPosition {
  id: number;
  top: string;
  left: string;
}

const LOCATIONS: Record<'mobile' | 'desktop', LocationPosition[]> = {
  mobile: [
    { id: 0, top: '21%', left: '47%' },
    { id: 1, top: '32%', left: '54%' },
    { id: 2, top: '45%', left: '55%' },
  ],
  desktop: [
    { id: 0, top: '21%', left: '36%' },
    { id: 1, top: '32%', left: '42%' },
    { id: 2, top: '45%', left: '34%' },
  ],
};

const SPRING_CONFIG = { stiffness: 80, damping: 25, mass: 0.8 };

interface MarkerProps {
  position: LocationPosition;
  isActive: boolean;
  onSelect: () => void;
  opacity?: MotionValue<number>;
}

const Marker = ({ position, isActive, onSelect, opacity }: MarkerProps) => {
  const content = isActive ? (
    <LocationPointIcon className="text-brand transition-opacity duration-300" />
  ) : (
    <LocationPointOutlineIcon />
  );

  const className =
    'absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition-transform hover:scale-110';

  if (opacity) {
    return (
      <motion.div className={className} onClick={onSelect} style={{ top: position.top, left: position.left, opacity }}>
        {content}
      </motion.div>
    );
  }

  return (
    <div className={className} onClick={onSelect} style={{ top: position.top, left: position.left }}>
      {content}
    </div>
  );
};

interface LocationSectionMapProps {
  activeLocationId: number | null;
  onLocationSelect: (index: number) => void;
}

export const LocationSectionMap = ({ activeLocationId, onLocationSelect }: LocationSectionMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start 0.3'],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const mapY = useTransform(smoothProgress, [0, 1], [150, 0]);
  const markersOpacity = useTransform(smoothProgress, [0.95, 1], [0, 1]);

  return (
    <div
      className="z-background absolute top-[200px] right-0 left-0 h-[698px] w-[809px] md:top-[150px] md:h-[751px] md:w-[1018px] xl:top-0 xl:h-[952px] xl:w-[1104px] 2xl:h-[1337px] 2xl:w-[1551px]"
      ref={containerRef}
    >
      <div className="absolute h-full w-full -translate-x-[260px] -translate-y-[20px] min-[360px]:-translate-x-[240px] min-[360px]:-translate-y-[60px] min-[375px]:-translate-x-[220px] min-[375px]:-translate-y-[55px] min-[390px]:-translate-x-[200px] min-[390px]:-translate-y-[50px] min-[425px]:-translate-x-[178px] min-[425px]:-translate-y-[40px] sm:translate-x-[100px] md:hidden">
        <Image
          alt="Map showing laundromat locations in the area"
          className="object-contain"
          fill
          priority
          src="/images/big-map-preview.png"
        />
        {LOCATIONS.mobile.map((position) => (
          <Marker
            isActive={activeLocationId === position.id}
            key={position.id}
            onSelect={() => onLocationSelect(position.id)}
            position={position}
          />
        ))}
      </div>

      <motion.div
        className="absolute hidden h-full w-full -translate-x-[50px] md:block md:translate-x-[53px] md:translate-y-[-100px] lg:translate-x-[183px] lg:translate-y-[-100px] xl:translate-x-[503px] xl:translate-y-[-50px] 2xl:translate-x-[800px]"
        style={{ y: mapY }}
      >
        <Image alt="" aria-hidden="true" className="object-contain" fill priority src="/images/desktop-map-preview.png" />
        {LOCATIONS.desktop.map((position) => (
          <Marker
            isActive={activeLocationId === position.id}
            key={position.id}
            onSelect={() => onLocationSelect(position.id)}
            opacity={markersOpacity}
            position={position}
          />
        ))}
      </motion.div>
    </div>
  );
};
