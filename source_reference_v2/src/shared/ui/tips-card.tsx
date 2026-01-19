'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import ArrowDownIcon from '@/shared/assets/icons/arrow-down-icon.svg';
import { cn } from '@/shared/libs/cn';
import { Link } from '@/shared/config/i18n';

const SPRING_CONFIG = { stiffness: 55, damping: 16, mass: 0.85 };

interface TipCardItem {
  key?: string;
  category: string;
  title: string;
  date: string;
  image?: string;
  bigImage?: string;
}

interface TipsCardProps {
  item: TipCardItem;
  className?: string;
}

export const TipsCard = ({ item, className }: TipsCardProps) => {
  const cardRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start center'],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const imageScale = useTransform(smoothProgress, [0, 0.65], [0.8, 1]);

  return (
    <article
      className={cn(
        'rounded-[12px] bg-white/80 backdrop-blur-[30px] backdrop-filter lg:h-[278px] 2xl:h-[390px] 2xl:rounded-[16px]',
        className,
        item.bigImage && 'p-0 lg:h-[576px] 2xl:h-[796px]',
      )}
      ref={cardRef}
    >
      {item.bigImage && (
        <motion.div
          className="relative h-[277px] w-full origin-top-left lg:mb-10 2xl:mb-12 2xl:h-[390px]"
          style={{ scale: imageScale }}
        >
          <Image
            alt={item.title}
            className="rounded-t-[12px] object-cover object-top 2xl:rounded-t-[16px]"
            fill
            src={item.bigImage}
          />
        </motion.div>
      )}

      <div
        className={cn(
          'flex items-start justify-between px-6 2xl:px-8',
          item.bigImage ? 'mb-20 2xl:mb-[120px]' : 'pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8',
        )}
      >
        <div className="border-brand/40 text-brand rounded-[9px] border px-[13px] py-[9px] text-xs leading-[132%] font-normal tracking-[-0.01em] 2xl:rounded-[10px] 2xl:px-[18px] 2xl:py-[10px] 2xl:text-sm">
          {item.category}
        </div>

        {item.image && (
          <motion.div
            className="relative h-[87px] origin-top-left md:h-[99px] md:w-[149px] lg:h-[127px] lg:w-[186px] 2xl:h-[177px] 2xl:w-[258px]"
            style={{ scale: imageScale }}
          >
            <Image
              alt={item.title}
              className="rounded-[6px] object-cover"
              fill
              sizes="(max-width: 768px) 145px, 99px"
              src={item.image}
            />
          </motion.div>
        )}
      </div>

      <Link
        className={cn(
          'text-text hover:text-brand block cursor-pointer pl-6 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-colors md:max-w-[390px] lg:mb-4 2xl:mb-[3px] 2xl:max-w-[515px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em]',
          item.bigImage && '2xl:max-w-[560px]',
        )}
        href={`/tips/${item.key || item.title}`}
        title={item.title}
      >
        <span className={cn('line-clamp-2', item.bigImage && 'line-clamp-3')}>{item.title}</span>
      </Link>

      <Link className="flex items-center justify-between px-6 pb-6 2xl:px-8" href={`/tips/${item.key || item.title}`}>
        <p className="text-text/60 paragraph-sm-default 2xl:text-lg">{item.date}</p>

        <span className="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] 2xl:size-[57px]">
          <ArrowDownIcon className="text-brand h-[7px] w-[8px] 2xl:size-[10px]" />
        </span>
      </Link>
    </article>
  );
};
