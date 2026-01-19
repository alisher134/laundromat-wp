'use client';

import { ActionTile } from '@/shared/ui/action-tile';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { SliderButtons } from '@/shared/ui/slider-buttons';
import { useSlider } from '@/shared/hooks/useSlider';
import { TIPS_CARDS_DATA, TIPS_SLIDES_DATA } from '@/widgets/TipsSection/config';
import { TipsCard } from '@/shared/ui/tips-card';
import { TipsSlide } from './TipsSlide';
import { cn } from '@/shared/libs/cn';
import 'keen-slider/keen-slider.min.css';
import { useTranslations } from 'next-intl';

export const TipsSection = () => {
  const t = useTranslations('home.tips');

  const { sliderRef, ...sliderControls } = useSlider({
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 16 },
      },
    },
  });

  const tipsCards = TIPS_CARDS_DATA.map((item) => ({
    ...item,
    category: t(`items.${item.key}.category`),
    title: t(`items.${item.key}.title`),
    date: t(`items.${item.key}.date`),
  }));

  const tipsSlides = TIPS_SLIDES_DATA.map((item) => ({
    ...item,
    category: t(`items.${item.key}.category`),
    title: t(`items.${item.key}.title`),
    date: t(`items.${item.key}.date`),
  }));

  return (
    <section className="container-responsive mt-[120px] md:mt-[164px] md:pb-[82px] xl:mt-[200px] xl:pb-[100px] 2xl:mt-[286px] 2xl:pb-[93px]">
      <div>
        <div className="mb-[32px] flex items-center justify-between">
          <h2 className="heading-section">{t('title')}</h2>

          <SliderButtons className="md:hidden" {...sliderControls} />
        </div>

        <div className="-mx-container-mobile lg:hidden">
          <div className="keen-slider pl-container-mobile" ref={sliderRef}>
            {tipsSlides.map((item) => (
              <TipsSlide className="keen-slider__slide" item={item} key={item.key} />
            ))}
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-5 2xl:gap-4">
          {tipsCards.map((item) => (
            <TipsCard className={cn(item.bigImage && 'lg:row-span-2')} item={item} key={item.key} />
          ))}
        </div>
      </div>

      <ActionTile
        className="mt-[46px] 2xl:mt-[56px]"
        href="/tips"
        icon={CircleRightArrowIcon}
        size="small"
        title={t('allTips')}
      />
    </section>
  );
};
