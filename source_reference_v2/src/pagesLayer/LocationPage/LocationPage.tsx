'use client';

import { LocationCard } from './LocationCard';
import { useState, useRef } from 'react';
import { SliderButtons } from '@/shared/ui/slider-buttons';
import { useSlider } from '@/shared/hooks/useSlider';
import { motion, useInView, type Variants } from 'framer-motion';

import { useTranslations } from 'next-intl';

import { LOCATION_KEYS } from '@/pagesLayer/LocationPage/config';
import { GoogleLocationMap } from '@/pagesLayer/LocationPage/GoogleLocationMap';

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

const fadeInUpSmallVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

const fadeInUpMediumVariants: Variants = {
  hidden: { opacity: 0, y: 150 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export const LocationPage = () => {
  const t = useTranslations('location');
  const [locationId, setLocationId] = useState<number | null>(null);

  const slider = useSlider({
    slides: {
      perView: 'auto',
      spacing: 8,
    },
  });

  const titleRef = useRef<HTMLHeadingElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const cardsDesktopRef = useRef<HTMLDivElement>(null);
  const cardsMobileRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });
  const mapInView = useInView(mapRef, { once: true, margin: '-100px' });
  const cardsDesktopInView = useInView(cardsDesktopRef, { once: true, margin: '-100px' });
  const cardsMobileInView = useInView(cardsMobileRef, { once: true, margin: '-100px' });

  const onClickLocation = (locationId: number) => {
    setLocationId(locationId);
  };

  const locations = LOCATION_KEYS.map((key, index) => ({
    id: index + 1,
    title: t(`items.${key}.address`),
    phone: t(`items.${key}.phone`),
    storeHours: t(`items.${key}.hours`),
  }));

  return (
    <div className="mx-4 pt-[124px] md:mx-4 md:pt-[136px] xl:pt-[147px] 2xl:pt-[208px]">
      <motion.h1
        ref={titleRef}
        className="paragraph-heading-md text-text mb-[33px] max-w-[328px] md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:max-w-[463px] xl:text-[45px] 2xl:max-w-[501px] 2xl:text-[64px]"
        variants={fadeInUpVariants}
        initial="hidden"
        animate={titleInView ? 'visible' : 'hidden'}
      >
        {t.rich('title', {
          span: (chunks) => <span className="text-brand">{chunks}</span>,
        })}
      </motion.h1>

      <div className="flex flex-col gap-[6px] md:flex-row md:gap-6">
        {/* <LocationMap activeLocationId={locationId} onLocationSelect={onClickLocation} /> */}
        <motion.div
          ref={mapRef}
          className="md:order-2 md:flex-1"
          variants={fadeInUpMediumVariants}
          initial="hidden"
          animate={mapInView ? 'visible' : 'hidden'}
        >
          <GoogleLocationMap activeLocationId={locationId} onLocationSelect={onClickLocation} />
        </motion.div>
        <motion.div
          ref={cardsDesktopRef}
          className="custom-scrollbar hidden h-[409px] w-full scroll-m-3 overflow-y-auto md:order-1 md:block md:h-[409px] md:w-[360px] md:shrink-0 md:pr-2 xl:h-[474px] xl:w-[425px] 2xl:h-[784px] 2xl:w-[605px] 2xl:pr-3"
          variants={fadeInUpSmallVariants}
          initial="hidden"
          animate={cardsDesktopInView ? 'visible' : 'hidden'}
        >
          <div className="flex flex-col gap-[6px]">
            {locations.map((locationItem) => (
              <LocationCard
                key={locationItem.id}
                locationId={locationId}
                locationItem={locationItem}
                onClickLocation={onClickLocation}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={cardsMobileRef}
          className="block md:hidden"
          variants={fadeInUpSmallVariants}
          initial="hidden"
          animate={cardsMobileInView ? 'visible' : 'hidden'}
        >
          <div className="keen-slider" ref={slider.sliderRef}>
            {locations.map((locationItem) => (
              <LocationCard
                className="keen-slider__slide"
                key={locationItem.id}
                locationId={locationId}
                locationItem={locationItem}
                onClickLocation={onClickLocation}
              />
            ))}
          </div>

          <div className="flex-center mt-6">
            <SliderButtons className="md:hidden" {...slider} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
