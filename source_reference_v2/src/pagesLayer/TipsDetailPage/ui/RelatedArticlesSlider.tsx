'use client';

import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { SliderButtons } from '@/shared/ui/slider-buttons';
import { TipsCard } from '@/shared/ui/tips-card';
import { TipsSlide } from '@/widgets/TipsSection/TipsSlide';
import { useKeenSlider } from 'keen-slider/react';
import { useCallback, useMemo, useState } from 'react';
import 'keen-slider/keen-slider.min.css';

const DESKTOP_BREAKPOINT = '(min-width: 1280px)';
const DESKTOP_SLIDES_PER_VIEW = 2;
const MOBILE_SLIDES_PER_VIEW = 1;

interface TipCardItem {
  key: string;
  category: string;
  title: string;
  date: string;
  image?: string;
  bigImage?: string;
}

interface RelatedArticlesSliderProps {
  items: TipCardItem[];
  title: string;
}

export const RelatedArticlesSlider = ({ items, title }: RelatedArticlesSliderProps) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  const mobileSliderConfig = useMemo(
    () => ({
      slides: {
        perView: 'auto' as const,
        spacing: 8,
        origin: 0,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: { perView: 'auto' as const, spacing: 16, origin: 0 },
        },
      },
      created: (slider: { track: { details: { slides: { length: number } } } }) => {
        setTotalSlides(slider.track.details.slides.length);
      },
      slideChanged: (slider: { track: { details: { rel: number } } }) => {
        setCurrentSlide(slider.track.details.rel);
      },
    }),
    [],
  );

  const desktopSliderConfig = useMemo(
    () => ({
      slides: {
        perView: DESKTOP_SLIDES_PER_VIEW,
        spacing: 21,
        origin: 0,
      },
      breakpoints: {
        '(min-width: 1440px)': {
          slides: { perView: DESKTOP_SLIDES_PER_VIEW, spacing: 16, origin: 0 },
        },
      },
      created: (slider: { track: { details: { slides: { length: number } } } }) => {
        setTotalSlides(slider.track.details.slides.length);
      },
      slideChanged: (slider: { track: { details: { rel: number } } }) => {
        setCurrentSlide(slider.track.details.rel);
      },
    }),
    [],
  );

  const [mobileSliderRef, mobileInstanceSliderRef] = useKeenSlider<HTMLDivElement>(mobileSliderConfig);
  const [desktopSliderRef, desktopInstanceSliderRef] = useKeenSlider<HTMLDivElement>(desktopSliderConfig);

  const onPrev = useCallback(() => {
    if (isDesktop) {
      desktopInstanceSliderRef.current?.prev();
    } else {
      mobileInstanceSliderRef.current?.prev();
    }
  }, [isDesktop, desktopInstanceSliderRef, mobileInstanceSliderRef]);

  const onNext = useCallback(() => {
    if (isDesktop) {
      desktopInstanceSliderRef.current?.next();
    } else {
      mobileInstanceSliderRef.current?.next();
    }
  }, [isDesktop, desktopInstanceSliderRef, mobileInstanceSliderRef]);

  const visibleSlides = useMemo(() => (isDesktop ? DESKTOP_SLIDES_PER_VIEW : MOBILE_SLIDES_PER_VIEW), [isDesktop]);

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide >= totalSlides - visibleSlides;

  return (
    <div className="mt-[120px]">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="paragraph-heading-md text-text md:text-[45px] md:leading-[110%] xl:text-[45px] 2xl:text-[64px]">
          {title}
        </h2>

        <SliderButtons isFirstSlide={isFirstSlide} isLastSlide={isLastSlide} onNext={onNext} onPrev={onPrev} />
      </div>

      <div className="-mx-container-mobile block xl:hidden">
        <div className="keen-slider pl-container-mobile" ref={mobileSliderRef}>
          {items.map((item) => (
            <TipsSlide className="keen-slider__slide" item={item} key={item.key} />
          ))}
        </div>
      </div>

      <div className="-mx-container-tablet 2xl:-mx-container-desktop hidden xl:block">
        <div className="keen-slider pl-container-tablet 2xl:pl-container-desktop" ref={desktopSliderRef}>
          {items.map((item) => (
            <TipsCard className="keen-slider__slide" item={item} key={item.key} />
          ))}
        </div>
      </div>
    </div>
  );
};
