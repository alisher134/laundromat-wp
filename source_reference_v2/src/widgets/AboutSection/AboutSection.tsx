'use client';

import { AboutSlide } from './AboutSlide';
import { useSlider } from '@/shared/hooks/useSlider';
import { SliderButtons } from '@/shared/ui/slider-buttons';
import { ABOUT_CARDS_DATA } from '@/widgets/AboutSection/config';
import 'keen-slider/keen-slider.min.css';
import { useTranslations } from 'next-intl';

export const AboutSection = () => {
  const t = useTranslations('home.hero');
  const tCards = useTranslations('home.aboutCards');

  const { sliderRef, ...sliderControls } = useSlider({
    mode: 'free',
    slides: { perView: 'auto', spacing: 8, origin: 0 },
    breakpoints: {
      '(min-width: 768px)': {
        slides: { perView: 'auto', spacing: 8, origin: 0 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 'auto', spacing: 18, origin: 0 },
      },
    },
    defaultAnimation: {
      duration: 1200,
      easing: (t: number) => {
        // Плавная ease-out кривая для более мягкой анимации
        return 1 - Math.pow(1 - t, 4);
      },
    },
  });

  const cards = ABOUT_CARDS_DATA.map((card) => ({
    ...card,
    title: tCards(`${card.key}.title`),
    subtitle: tCards(`${card.key}.subtitle`),
    description: tCards(`${card.key}.description`),
  }));

  return (
    <section className="mx-container-mobile lg:mx-container-tablet 2xl:mx-container-desktop pt-[86px] lg:pt-[122px] 2xl:pt-[172px]">
      <div className="lg:flex lg:items-stretch lg:justify-between lg:gap-[18px]">
        <div className="w-full lg:flex lg:max-w-[400px] lg:shrink-0 lg:flex-col xl:max-w-[574px] 2xl:max-w-[807px]">
          <div className="mb-[46px] flex items-center gap-[12px] md:mb-[64px]">
            <p className="paragraph-body-sm text-brand">{t('subtitle')}</p>

            <span className="bg-brand h-1 w-1 rounded-full" />
          </div>

          <div className="mt-auto hidden lg:block">
            <SliderButtons {...sliderControls} />
          </div>
        </div>

        <div className="min-w-0 lg:flex-1">
          <h2 className="heading-section mb-8 max-w-[328px] md:mb-9 md:max-w-[667px] lg:mb-9 lg:max-w-[500px] xl:max-w-[667px] 2xl:mb-[56px] 2xl:max-w-[938px]">
            {t.rich('description', {
              span: (chunks) => <span className="text-brand">{chunks}</span>,
            })}
          </h2>

          <p className="text-text/80 mb-[86px] max-w-[327px] text-lg leading-[146%] font-normal tracking-[-0.01em] md:max-w-[366px] md:text-base lg:mb-[116px] lg:max-w-[366px] lg:text-base 2xl:mb-[215px] 2xl:max-w-[477px] 2xl:text-[21px]">
            {t('cta')}
          </p>

          <div className="-mx-container-mobile lg:-mx-container-tablet 2xl:-mx-container-desktop">
            <div
              className="keen-slider pl-container-mobile lg:pl-container-tablet 2xl:pl-container-desktop"
              ref={sliderRef}
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 100%)',
              }}
            >
              {cards.map((item) => (
                <AboutSlide className="keen-slider__slide" item={item} key={item.key} />
              ))}
            </div>
          </div>

          <div className="lg:hidden">
            <div className="flex-center mt-[23px]">
              <SliderButtons {...sliderControls} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
