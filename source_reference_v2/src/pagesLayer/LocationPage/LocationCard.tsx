import LocationIcon from '@/shared/assets/icons/location-icon.svg';
import { LocationItem } from '@/shared/data';
import { cn } from '@/shared/libs/cn';
import { useTranslations } from 'next-intl';

interface LocationCardProps {
  locationId?: number | null;
  locationItem: LocationItem;
  onClickLocation?: (locationId: number) => void;
  className?: string;
}

export const LocationCard = ({ locationId = null, locationItem, onClickLocation, className }: LocationCardProps) => {
  const t = useTranslations('location');

  return (
    <div
      className={cn(
        'rounded-card max-w-[328px] shrink-0 cursor-pointer bg-white px-[20px] py-4 transition-colors duration-300 md:max-w-[360px] xl:max-w-[425px] 2xl:max-w-[605px] 2xl:rounded-[16px] 2xl:p-6',
        locationId === locationItem.id ? 'bg-[#488EBE]/10' : 'bg-white',
        className,
      )}
      onClick={() => onClickLocation?.(locationItem.id)}
    >
      <div className="mb-[31px] flex items-center justify-between md:mb-[27px] xl:mb-[46px] 2xl:mb-[88px]">
        <h2 className="text-text max-w-[184px] text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-sm 2xl:max-w-[307px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em]">
          {locationItem.title}
        </h2>

        <span className="flex size-[33px] items-center justify-center rounded-[6px] bg-white 2xl:size-[42px]">
          <LocationIcon className="size-4 text-[#3A6D90] 2xl:size-[22px]" />
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-[4px] 2xl:space-y-[6px]">
          <p className="paragraph-sm-default text-text/60 md:text-xs xl:text-xs 2xl:text-lg">{t('labelHours')}</p>
          <p className="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-xs 2xl:text-lg">
            {locationItem.storeHours}
          </p>
        </div>
        <div className="space-y-[4px]">
          <p className="paragraph-sm-default text-text/60 text-right md:text-sm xl:text-xs 2xl:text-lg">
            {t('labelPhone')}
          </p>
          <p className="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-xs 2xl:text-lg">
            {locationItem.phone}
          </p>
        </div>
      </div>
    </div>
  );
};
