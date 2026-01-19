'use client';

import { LOCATIONS_DATA } from '@/shared/data';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { PATHS } from '@/shared/constants/paths';
import { ActionTile } from '@/shared/ui/action-tile';
import { SliderButtons } from '@/shared/ui/slider-buttons';
import { LocationSlider } from './LocationSlider';
import { useSlider } from '@/shared/hooks/useSlider';
import 'keen-slider/keen-slider.min.css';
import { LocationSectionMap } from '@/widgets/LocationSection/LocationSectionMap';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const LocationSection = () => {
  const t = useTranslations('home.location');
  const tLocation = useTranslations('location');
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);

  const { sliderRef, ...sliderControls } = useSlider();

  const locations = LOCATIONS_DATA.map((item) => ({
    ...item,
    title: tLocation(`items.${item.key}.address`),
    storeHours: tLocation(`items.${item.key}.hours`),
    phone: tLocation(`items.${item.key}.phone`),
  }));

  const handleLocationSelect = (index: number) => {
    setActiveLocationId(index);
  };

  return (
    <section className="ml-container-mobile xl:ml-container-tablet 2xl:ml-container-desktop relative mt-[120px] overflow-x-clip overflow-y-visible md:mt-[164px] xl:mt-[200px] xl:pb-[300px] 2xl:mt-[286px]">
      <div className="pointer-events-none relative z-10">
        <h2 className="heading-section pointer-events-auto mb-8 max-w-[328px] md:mb-[46px] md:max-w-[488px] 2xl:mb-[56px] 2xl:max-w-[743px]">
          {t.rich('title', {
            span: (chunks) => <span className="text-brand">{chunks}</span>,
          })}
        </h2>

        <div className="pointer-events-auto inline-block">
          <ActionTile href={PATHS.location} icon={CircleRightArrowIcon} size="small" title={t('viewOnGoogleMaps')} />
        </div>
      </div>

      <LocationSectionMap activeLocationId={activeLocationId} onLocationSelect={handleLocationSelect} />

      <div className="relative z-10 w-full pt-[436px] md:pt-[473px] xl:w-[620px] xl:pt-[273px] 2xl:w-[872px] 2xl:pt-[407px]">
        <div className="mr-container-mobile mb-[18px] flex items-center justify-between xl:mr-0">
          <div className="text-brand paragraph-sm-default flex items-center gap-3">
            {t('ourLocation')}
            <span className="bg-brand flex size-1 items-center justify-center rounded-full" />
          </div>

          <SliderButtons {...sliderControls} />
        </div>

        <div className="keen-slider" ref={sliderRef}>
          {locations.map((locationItem, index) => (
            <LocationSlider
              className="keen-slider__slide"
              isActive={activeLocationId === index}
              key={locationItem.id}
              locationItem={locationItem}
              onSelect={() => handleLocationSelect(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
