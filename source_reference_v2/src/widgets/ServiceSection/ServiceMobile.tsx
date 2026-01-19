'use client';

import { PATHS } from '@/shared/constants/paths';
import { ActionTile } from '@/shared/ui/action-tile';
import Image from 'next/image';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { cn } from '@/shared/libs/cn';
import { useTranslations } from 'next-intl';

interface ServiceCardItem {
  key: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
}

interface ServiceMobileProps {
  item: ServiceCardItem;
  className?: string;
}

export const ServiceMobile = ({ item, className }: ServiceMobileProps) => {
  const t = useTranslations('home.experience.card');

  return (
    <div className={cn('border-t-text/16 border-t pb-8 md:pb-6', className)} key={item.key}>
      <div>
        <h3 className="paragraph-heading-md my-8 max-w-[294px] md:max-w-[293px] md:text-[45px] md:leading-[110%] xl:text-[45px] 2xl:text-[64px]">
          {item.title}
        </h3>
        <p className="text-text/60 mb-[46px] max-w-[305px] text-base leading-[132%] font-normal tracking-[-0.01em] md:mb-[92px] md:max-w-[376px] md:text-lg xl:text-lg 2xl:text-xl 2xl:tracking-[-0.02em]">
          {item.description}
        </p>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-7">
            <div>
              <p className="price-label">{t('priceFrom')}</p>
              <p className="text-text text-2xl leading-[132%] font-normal tracking-[-0.02em] md:text-[28px] 2xl:text-[36px]">
                {item.price} $
              </p>
            </div>

            <div className="bg-text/16 w-px self-stretch" />

            <div>
              <p className="price-label">{t('timeFrom')}</p>
              <p className="text-text text-2xl leading-[132%] font-normal tracking-[-0.02em] md:text-[28px] 2xl:text-[36px]">
                {item.duration}
              </p>
            </div>
          </div>

          <ActionTile href={PATHS.services} icon={CircleRightArrowIcon} size="small" title={t('learnMore')} />
        </div>
      </div>

      <div className="relative h-[276px] w-full md:h-[534px]">
        <Image alt={item.title} className="rounded-card object-cover" fill src={item.image} />
      </div>
    </div>
  );
};
