import Image from 'next/image';
import { cn } from '@/shared/libs/cn';

import LocationPointIcon from '@/shared/assets/icons/location-point-icon.svg';

interface LocationMapProps {
  activeLocationId: number | null;
  onLocationSelect: (id: number) => void;
}

const LOCATIONS = [
  { id: 1, top: '28%', left: '43%' },
  { id: 2, top: '27%', left: '59%' },
  { id: 3, top: '62%', left: '46%' },
];

export const LocationMap = ({ activeLocationId, onLocationSelect }: LocationMapProps) => {
  return (
    <div className="relative h-[408px] w-full md:order-2 md:h-[409px] md:flex-1 xl:h-[474px] 2xl:h-[786px]">
      <Image alt="location" className="rounded-card object-cover" fill priority src="/images/location-map.png" />
      {LOCATIONS.map((position) => (
        <div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition-transform hover:scale-110"
          key={position.id}
          onClick={() => onLocationSelect(position.id)}
          style={{ top: position.top, left: position.left }}
        >
          <LocationPointIcon
            className={cn(
              'text-brand transition-opacity duration-300',
              activeLocationId === position.id ? 'opacity-100' : 'opacity-50',
            )}
          />
        </div>
      ))}
    </div>
  );
};
