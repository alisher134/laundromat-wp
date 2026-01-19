'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useSlider } from '@/shared/hooks/useSlider';
import Image from 'next/image';

import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import StarsIcon from '@/shared/assets/icons/stars-icon.svg';
import { ActionTile } from '@/shared/ui/action-tile';
import { SliderButtons } from '@/shared/ui/slider-buttons';
import { REVIEWS_DATA } from '@/shared/data';
import { ReviewSlide } from './ReviewSlide';
import { ReviewCard } from './ReviewCard';
import 'keen-slider/keen-slider.min.css';
import { useTranslations } from 'next-intl';

const SPRING_CONFIG = { stiffness: 120, damping: 35, mass: 0.8 };

export const ReviewsSection = () => {
  const t = useTranslations('home.reviews');
  const reviewsGridRef = useRef<HTMLDivElement>(null);
  const slider = useSlider({
    slides: { perView: 'auto', spacing: 8, origin: 0 },
  });

  const { scrollYProgress } = useScroll({
    target: reviewsGridRef,
    offset: ['start end', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const gridY = useTransform(smoothProgress, [0, 1], [30, -60]);

  const reviews = REVIEWS_DATA.map((item) => ({
    ...item,
    name: t(`items.${item.key}.name`),
    review: t(`items.${item.key}.description`),
  }));

  return (
    <section className="container-responsive section-spacing-top lg:flex lg:items-start lg:justify-between">
      <div className="w-full lg:w-auto lg:min-w-[320px] xl:min-w-[424px] 2xl:max-w-[596px] 2xl:min-w-[596px]">
        <h2 className="heading-section w-full md:max-w-[300px] lg:max-w-[300px] 2xl:max-w-[396px]">
          {t.rich('title', {
            span: (chunks) => <span className="text-brand">{chunks}</span>,
          })}
        </h2>

        <div className="mt-[46px] mb-[246px] hidden lg:block 2xl:mt-[56px] 2xl:mb-[353px]">
          <ActionTile href="/" icon={CircleRightArrowIcon} title={t('allReviews')} />
        </div>

        <div className="hidden min-h-[72px] w-fit min-w-[194px] items-center justify-start gap-[10px] rounded-[14px] bg-white py-[12px] pr-[14px] pl-[10px] md:min-h-[94px] md:min-w-[240px] md:gap-[14px] lg:flex">
          <Image
            alt="Google"
            className="h-[55px] w-[53px] md:h-[78px] md:w-[81px] lg:h-[78px] lg:w-[81px] 2xl:h-[99px] 2xl:w-[94px]"
            height={70}
            src="/images/google-logo.png"
            width={68}
          />

          <div>
            <StarsIcon
              aria-hidden="true"
              className="text-brand mb-[6px] h-[8px] w-[15px] lg:mb-[17px] lg:h-[11px] lg:w-[20px] 2xl:mb-[17px] 2xl:h-[13px] 2xl:w-[24px]"
            />
            <h4 className="text-text font-noral mb-[2px] text-sm leading-[132%] tracking-[-0.01em] lg:mb-1 2xl:mb-1 2xl:text-base">
              {t('ratingGoogle')}
            </h4>
            <p className="paragraph-body-xs text-text/60 lg:text-xs 2xl:text-sm">
              {t.rich('ratingGoogleDescription', {
                span: (chunks) => <span className="text-brand">{chunks}</span>,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="my-8 flex items-center justify-between gap-4 lg:hidden">
        <div className="flex min-h-[72px] w-fit min-w-[194px] items-center justify-start gap-[10px] rounded-[14px] bg-white py-[12px] pr-[14px] pl-[10px] md:min-h-[94px] md:min-w-[240px] md:gap-[14px] lg:hidden">
          <Image alt="Google" height={55} sizes="(max-width: 768px) 78px, 81px" src="/images/google-logo.png" width={53} />

          <div>
            <StarsIcon aria-hidden="true" className="text-brand mb-[6px] h-[8px] w-[15px]" />
            <h4 className="text-text mb-[2px] text-sm leading-[132%] font-normal tracking-[-0.01em]">
              {t('ratingGoogle')}
            </h4>
            <p className="paragraph-body-xs text-text/60 text-xs">
              {t.rich('ratingGoogleDescription', {
                span: (chunks) => <span className="text-brand">{chunks}</span>,
              })}
            </p>
          </div>
        </div>

        <SliderButtons className="md:hidden" {...slider} />
      </div>

      <div className="-mx-container-mobile lg:hidden">
        <div className="keen-slider pl-container-mobile" ref={slider.sliderRef}>
          {reviews.map((item) => (
            <ReviewSlide item={item} key={item.key} />
          ))}
        </div>
      </div>

      <motion.div className="hidden lg:grid lg:grid-cols-1 lg:gap-4" ref={reviewsGridRef} style={{ y: gridY }}>
        {reviews.map((item) => (
          <ReviewCard item={item} key={item.key} />
        ))}
      </motion.div>

      <ActionTile className="mt-9 lg:hidden" icon={CircleRightArrowIcon} size="small" title={t('allReviews')} />
    </section>
  );
};
