'use client';

import { ActionTile } from '@/shared/ui/action-tile';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { Link } from '@/shared/config/i18n';
import { PATHS } from '@/shared/constants/paths';
import ArrowDownIcon from '@/shared/assets/icons/arrow-down-icon.svg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ServiceData } from './config';

interface ServicesCardProps {
  service: ServiceData;
}

export const ServicesCard = ({ service }: ServicesCardProps) => {
  const t = useTranslations('services');

  const title = t(`items.${service.category}.cardTitle`);
  const description = t(`items.${service.category}.description`);

  return (
    <div
      className="bg-brand-light/9 rounded-[26px] px-4 pt-[32px] pb-[23px] md:px-[32px] md:pt-[38px] md:pb-8 xl:flex xl:items-start xl:justify-between xl:gap-[291px] xl:pt-[56px] 2xl:px-9 2xl:pt-[72px] 2xl:pb-9"
      key={service.id}
    >
      <div className="flex items-start justify-between xl:h-full xl:flex-1 xl:flex-col">
        <div>
          <h2 className="paragraph-heading-md text-text mb-4 max-w-[150px] md:mb-6 md:max-w-[362px] md:text-[45px] xl:mb-8 2xl:mb-9 2xl:text-[64px]">
            {title}
          </h2>
          <p className="text-text max-w-[271px] text-base leading-[132%] font-normal tracking-[-0.01em] md:max-w-[346px] xl:text-lg 2xl:max-w-[416px] 2xl:text-[21px] 2xl:tracking-[-0.02em]">
            {description}
          </p>
        </div>

        <div className="relative hidden h-[95px] w-[112px] md:block xl:mt-auto xl:h-[207px] xl:w-[246px] 2xl:h-[280px] 2xl:w-[308px]">
          <Image alt={title} className="rounded-2xl object-cover" fill priority src={service.image} />
        </div>
      </div>

      <div className="w-full xl:max-w-[617px] 2xl:max-w-[1012px]">
        <div className="mt-[43px] mb-[56px] md:mt-[46px] xl:mt-0 xl:mb-[90px] 2xl:mb-[192px]">
          <div className="text-brand mb-4 flex items-center gap-3 text-sm leading-[132%] font-normal tracking-[-0.01em] md:gap-4 md:text-base xl:mb-[50px] xl:text-lg 2xl:mb-[46px]">
            {t('card.pricesLabel')} <span className="bg-brand flex size-1 items-center justify-center rounded-full" />
          </div>

          <div className="block md:hidden">
            {service.prices.slice(0, 4).map((price) => (
              <div
                className="border-text/12 flex items-center justify-between border-t py-[10px] last:border-b md:py-[12px]"
                key={price.id}
              >
                <p className="text-text col-span-2 text-base leading-[132%] font-normal tracking-[-0.01em] md:text-lg">
                  {t(`features.${price.featureKey}`)}
                </p>
                <div className="flex items-center justify-end gap-3">
                  <p className="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] md:leading-[136%] md:tracking-[-0.02em]">
                    {price.duration}
                  </p>
                  <div className="bg-text/12 h-[42px] w-[0.5px]" />
                  <p className="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] md:leading-[136%] md:tracking-[-0.02em]">
                    {price.price} $
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            {service.prices.slice(0, 5).map((price) => (
              <div
                className="border-text/12 flex items-center justify-between border-t py-[10px] last:border-b md:py-[12px] xl:py-4 2xl:py-4"
                key={price.id}
              >
                <p className="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-lg xl:text-lg 2xl:text-[21px]">
                  {t(`features.${price.featureKey}`)}
                </p>
                <div className="flex items-center justify-end gap-3 md:gap-9 xl:gap-[64px]">
                  <p className="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] xl:text-[21px] xl:leading-[136%] xl:tracking-[-0.02em] 2xl:text-[24px]">
                    {price.duration}
                  </p>
                  <div className="bg-text/12 h-[42px] w-[0.5px]" />
                  <p className="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] xl:text-[21px] xl:leading-[136%] xl:tracking-[-0.02em] 2xl:text-[24px]">
                    {price.price} $
                  </p>
                </div>
              </div>
            ))}
          </div>

          {service.prices.length > 4 && (
            <Link
              className="text-brand border-brand/30 mt-6 flex w-fit items-center gap-2 border-b text-base leading-[132%] font-normal tracking-[-0.01em] md:hidden"
              href={PATHS.services}
            >
              {t('card.allPrices')}
              <ArrowDownIcon className="text-brand h-[7px] w-[7px]" />
            </Link>
          )}

          {service.prices.length > 5 && (
            <Link
              className="text-brand border-brand/30 mt-8 hidden w-fit items-center gap-2 border-b text-base leading-[132%] font-normal tracking-[-0.01em] md:flex"
              href={PATHS.services}
            >
              {t('card.allPrices')}
              <ArrowDownIcon className="text-brand h-[7px] w-[7px]" />
            </Link>
          )}
        </div>

        <ActionTile
          href={PATHS.location}
          icon={CircleRightArrowIcon}
          size="small"
          title={t(`items.${service.category}.instructions`)}
        />
      </div>
    </div>
  );
};
