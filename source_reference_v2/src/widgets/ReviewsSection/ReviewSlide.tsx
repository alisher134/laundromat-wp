'use client';

import { cn } from '@/shared/libs/cn';
import PersonAddIcon from '@/shared/assets/icons/person-add-icon.svg';
import 'keen-slider/keen-slider.min.css';
import { Link } from '@/shared/config/i18n';
import { PATHS } from '@/shared/constants/paths';
import { useTranslations } from 'next-intl';

interface ReviewSlideItem {
  key: string;
  name: string;
  review: string;
  order: number;
}

export interface ReviewSlideProps {
  item: ReviewSlideItem;
  className?: string;
}

export const ReviewSlide = ({ item, className }: ReviewSlideProps) => {
  const t = useTranslations('home.reviews');

  return (
    <div
      className={cn(
        'keen-slider__slide min-w-[320px] rounded-[16px] bg-white/80 px-[20px] pt-[20px] pb-[32px] backdrop-blur-[42px] md:min-w-[385px]',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="mb-[80px] flex items-center gap-[18px]">
          <span className="bg-brand-bg/10 flex size-[50px] items-center justify-center rounded-[14px]">
            <PersonAddIcon aria-hidden="true" className="text-brand size-[26px]" />
          </span>

          <h4 className="text-text text-lg leading-[132%] font-normal tracking-[-0.01em]">{item.name}</h4>
        </div>

        <span className="bg-brand h-[6px] w-[6px] rounded-full" />
      </div>

      <div className="bg-text/20 h-px w-full" />

      <p className="text-text mt-5 mb-[46px] text-sm leading-[146%] font-normal tracking-[-0.01em]">{item.review}</p>

      <Link className="link-brand" href={PATHS.reviews}>
        {t('readMore')}
      </Link>
    </div>
  );
};
