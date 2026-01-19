'use client';

import { PATHS } from '@/shared/constants/paths';
import { cn } from '@/shared/libs/cn';
import { ActionTile } from '@/shared/ui/action-tile';
import { useBreakpoint } from '@/shared/hooks/useBreakpoint';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';

interface ServiceCardItem {
  key: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
}

interface ServiceItemCardProps {
  item: ServiceCardItem;
  isLast?: boolean;
  className?: string;
}

const CARD_SIZES = {
  small: {
    lg: { height: 280, width: 350 },
    xl: { height: 390, width: 475 },
    '2xl': { height: 520, width: 720 },
  },
  large: {
    lg: { height: 508, width: 700 },
    xl: { height: 580, width: 900 },
    '2xl': { height: 790, width: 1120 },
  },
};

const SPRING_CONFIG = { stiffness: 35, damping: 18, mass: 1.3 };
const IMAGE_SIZES = '(max-width: 1280px) 700px, (max-width: 1536px) 900px, 1120px';

export const ServiceItemCard = ({ item, isLast, className }: ServiceItemCardProps) => {
  const t = useTranslations('home.experience.card');
  const cardRef = useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['center end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const expandProgress = useTransform(smoothProgress, [0, 0.8], [0, 1]);

  const smallSize = CARD_SIZES.small[breakpoint];
  const largeSize = CARD_SIZES.large[breakpoint];

  const height = useTransform(expandProgress, [0, 0.9], [smallSize.height, largeSize.height]);
  const width = useTransform(expandProgress, [0, 1], [smallSize.width, largeSize.width]);
  const isActiveProgress = useTransform(expandProgress, [0, 0.4], [0, 1], { clamp: true });
  const displayValue = useTransform(isActiveProgress, (val: number) => (val > 0 ? 'flex' : 'none'));
  const justifyContentValue = useTransform(expandProgress, [0, 0.3], ['flex-start', '']);
  const paddingBottomValue = useTransform(expandProgress, [0, 0.3], [12, 0]);

  return (
    <div className={cn('border-t-text/16 border-t', isLast && 'border-b-text/16 border-b', className)} ref={cardRef}>
      <motion.div
        className="flex items-start lg:py-3 xl:py-4 2xl:py-4"
        style={{
          justifyContent: justifyContentValue,
          paddingBottom: paddingBottomValue,
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="lg:min-w-[400px] xl:min-w-[558px] 2xl:min-w-[777px]">
          <h3 className="text-text mb-7 max-w-[290px] text-[45px] leading-[110%] font-normal tracking-[-0.04em] lg:mt-5 xl:mt-[27px] xl:mb-[75px] 2xl:mt-10 2xl:mb-[75px] 2xl:text-[64px]">
            {item.title}
          </h3>

          <p className="text-text/80 mb-[46px] max-w-[326px] text-base leading-[132%] font-normal tracking-[-0.01em] 2xl:mb-[56px] 2xl:max-w-[455px] 2xl:text-[21px]">
            {item.description}
          </p>

          <ActionTile href={PATHS.services} icon={CircleRightArrowIcon} title={t('learnMore')} />

          <motion.div
            className="mt-[100px] flex items-stretch gap-7 lg:mt-[100px] xl:mt-[133px] xl:h-[77px] 2xl:mt-[200px] 2xl:h-[101px] 2xl:gap-[46px]"
            style={{
              opacity: isActiveProgress,
              display: displayValue,
            }}
          >
            <div>
              <p className="price-label">{t('priceFrom')}</p>
              <p className="price-value">{item.price} $</p>
            </div>

            <div className="bg-text/16 w-px" />

            <div>
              <p className="price-label">{t('timeFrom')}</p>
              <p className="price-value">{item.duration}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="rounded-card relative overflow-hidden"
          style={{
            height,
            width,
          }}
        >
          <Image
            alt={`${item.title} service`}
            className="rounded-card object-cover object-center"
            fill
            priority
            sizes={IMAGE_SIZES}
            src={item.image}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
