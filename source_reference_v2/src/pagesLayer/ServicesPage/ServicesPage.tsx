'use client';

import { DEFAULT_SERVICE_CATEGORY, SLIDER_CONFIG } from '@/shared/data';
import { Category } from '@/shared/ui/category';
import { useKeenSlider } from 'keen-slider/react';
import { useState, useRef } from 'react';
import 'keen-slider/keen-slider.min.css';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { PATHS } from '@/shared/constants/paths';
import { ActionTile } from '@/shared/ui/action-tile';
import { FaqAccordion } from '@/shared/ui/faq-accordion';
import { ServicesCard } from './ServicesCard';
import { useTranslations } from 'next-intl';
import { SERVICE_KEYS, SERVICES_DATA } from '@/pagesLayer/ServicesPage/config';
import { FAQ_KEYS } from '@/widgets/FaqsSection/config';
import { motion, useInView, type Variants } from 'framer-motion';

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

const fadeInUpSmallVariants: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

const fadeInUpMediumVariants: Variants = {
  hidden: { opacity: 0, y: 150 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

const fadeInUpLargeVariants: Variants = {
  hidden: { opacity: 0, y: 200 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  },
};

export const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_SERVICE_CATEGORY);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(SLIDER_CONFIG);

  const t = useTranslations('services');
  const tFaq = useTranslations('faq');

  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });
  const categoriesInView = useInView(categoriesRef, { once: true, margin: '-100px' });
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-100px' });

  const handleCategoryClick = (key: string) => {
    setActiveCategory(key);
  };

  const categories = SERVICE_KEYS.map((service) => ({
    key: service,
    label: t(`items.${service}.title`),
  }));

  const faqSections = FAQ_KEYS.map((key, index) => ({
    position: index + 1,
    title: tFaq(`questions.${key}.question`),
    content: tFaq(`questions.${key}.answer`),
  }));

  return (
    <div className="px-container-mobile md:px-container-mobile xl:px-container-tablet 2xl:mx-container-desktop pt-[124px] md:pt-[136px] xl:pt-[147px] 2xl:pt-[208px]">
      <motion.h1
        ref={titleRef}
        className="paragraph-heading-md text-text max-w-[328px] md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:max-w-[615px] xl:text-[45px] 2xl:max-w-[883px] 2xl:text-[64px]"
        variants={fadeInUpVariants}
        initial="hidden"
        animate={titleInView ? 'visible' : 'hidden'}
      >
        {t.rich('title', {
          span: (chunks) => <span className="text-brand">{chunks}</span>,
        })}
      </motion.h1>

      <motion.div
        ref={categoriesRef}
        variants={fadeInUpSmallVariants}
        initial="hidden"
        animate={categoriesInView ? 'visible' : 'hidden'}
      >
        <div className="my-[32px] md:hidden">
          <div className="keen-slider" ref={sliderRef}>
            {categories.map(({ key, label }) => (
              <Category
                activeCategory={activeCategory}
                category={key}
                className="keen-slider__slide rounded-[12px]! text-sm!"
                key={key}
                label={label}
                onClick={() => handleCategoryClick(key)}
                paddingClassName="px-[18px] py-[14px]"
              />
            ))}
          </div>
        </div>

        <div className="my-[32px] hidden gap-2 md:flex">
          {categories.map(({ key, label }) => (
            <Category
              activeCategory={activeCategory}
              category={key}
              className="rounded-[12px]! text-sm!"
              key={key}
              label={label}
              onClick={() => handleCategoryClick(key)}
              paddingClassName="px-[18px] py-[14px]"
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={servicesRef}
        className="mb-[120px] grid grid-cols-1 gap-4 md:mb-[164px] xl:mb-[200px] 2xl:mb-[256px] 2xl:gap-6"
        variants={fadeInUpMediumVariants}
        initial="hidden"
        animate={servicesInView ? 'visible' : 'hidden'}
      >
        {SERVICES_DATA.map((service) => (
          <ServicesCard key={service.id} service={service} />
        ))}
      </motion.div>

      <motion.div
        ref={faqRef}
        variants={fadeInUpLargeVariants}
        initial="hidden"
        animate={faqInView ? 'visible' : 'hidden'}
      >
        <h2 className="text-text mb-8 text-[31px] leading-[110%] font-normal tracking-[-0.04em] uppercase md:mb-[46px] md:text-[64px] xl:mb-[46px] xl:text-[45px] 2xl:mb-[70px] 2xl:text-[64px]">
          {tFaq('title')}
        </h2>

        <div className="border-text/16 flex flex-col-reverse gap-[46px] border-t pt-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <ActionTile href={PATHS.faq} icon={CircleRightArrowIcon} size="small" title={tFaq('allQuestions')} />
          </div>

          <FaqAccordion sections={faqSections} />
        </div>
      </motion.div>
    </div>
  );
};
