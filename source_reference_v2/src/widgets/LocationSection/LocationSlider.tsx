import LocationIcon from '@/shared/assets/icons/location-icon.svg';
import { cn } from '@/shared/libs/cn';
import { useTranslations } from 'next-intl';

interface LocationSliderItem {
  id: number;
  key: string;
  title: string;
  storeHours: string;
  phone: string;
}

interface LocationSliderProps {
  locationItem: LocationSliderItem;
  className?: string;
  isActive?: boolean;
  onSelect?: () => void;
}

export const LocationSlider = ({ locationItem, className, isActive, onSelect }: LocationSliderProps) => {
  const t = useTranslations('location');

  return (
    <div
      className={cn(
        'group hover:border-brand rounded-card border-text/16 max-w-[306px] shrink-0 cursor-pointer border bg-white/10 px-[20px] py-4 backdrop-blur-[30px] transition-colors duration-200 md:max-w-[306px] 2xl:max-w-[430px] 2xl:rounded-[16px] 2xl:p-6',
        isActive && 'border-brand',
        className,
      )}
      onClick={onSelect}
    >
      <div className="mb-[31px] flex items-center justify-between md:mb-[27px] 2xl:mb-[41px]">
        <h2
          className={cn(
            'text-text group-hover:text-brand max-w-[184px] text-base leading-[132%] font-normal tracking-[-0.01em] transition-colors duration-200 md:text-sm xl:text-sm 2xl:max-w-[307px] 2xl:text-lg 2xl:leading-[132%] 2xl:tracking-[-0.01em]',
            isActive && 'text-brand',
          )}
        >
          {locationItem.title}
        </h2>

        <span className="bg-brand/6 flex size-[33px] items-center justify-center rounded-[6px] 2xl:size-[42px]">
          <LocationIcon aria-hidden="true" className="text-brand size-4 2xl:size-[22px]" />
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-[4px] 2xl:space-y-[6px]">
          <p className="text-text/60 paragraph-sm-default md:text-xs xl:text-xs 2xl:text-base">{t('labelHours')}</p>
          <p className="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-xs 2xl:text-base">
            {locationItem.storeHours}
          </p>
        </div>
      </div>
    </div>
  );
};
