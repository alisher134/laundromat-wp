'use client';

import { PATHS } from '@/shared/constants/paths';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { ActionTile } from '@/shared/ui/action-tile';
import { SERVICE_SECTION_DATA } from '@/shared/data';
import { ServiceMobile } from '@/widgets/ServiceSection/ServiceMobile';
import { ServiceItemCard } from '@/widgets/ServiceSection/ServiceItemCard';
import { useTranslations } from 'next-intl';

export const ServiceSection = () => {
  const t = useTranslations('home.experience');
  const tCards = useTranslations('home.serviceSectionCards');

  const cards = SERVICE_SECTION_DATA.map((item) => ({
    ...item,
    title: tCards(`${item.key}.title`),
    description: tCards(`${item.key}.description`),
  }));

  return (
    <section className="section-container section-spacing-bottom mt-[111px] md:mt-[170px] xl:mt-[200px] 2xl:mt-[265px]">
      <h2 className="heading-section-brand mb-8 max-w-[328px] md:max-w-[678px] xl:max-w-[678px] 2xl:max-w-[751px]">
        {t('title')}
      </h2>

      {cards.map((item, index) => (
        <div key={item.key}>
          <ServiceMobile className="block lg:hidden" item={item} />
          <ServiceItemCard className="hidden lg:block" isLast={index === cards.length - 1} item={item} />
        </div>
      ))}

      <ActionTile
        className="mt-8 md:mt-[46px]"
        href={PATHS.services}
        icon={CircleRightArrowIcon}
        size="small"
        title={t('allServices')}
      />
    </section>
  );
};
