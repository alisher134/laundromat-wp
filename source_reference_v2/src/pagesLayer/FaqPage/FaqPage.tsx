'use client';

import { FaqAccordion } from '@/shared/ui/faq-accordion';
import { Category } from '@/shared/ui/category';
import { useKeenSlider } from 'keen-slider/react';

import { useMemo, useState, useRef } from 'react';
import 'keen-slider/keen-slider.min.css';
import { ALL_FAQ_SECTIONS, FAQ_CATEGORIES, FaqCategoryKey } from '@/pagesLayer/FaqPage/config';
import { motion, useInView } from 'framer-motion';

export const FaqPage = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey | 'all'>('all');

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: 'free-snap',
    rtl: false,
    slides: {
      perView: 'auto',
      spacing: 6,
    },
  });

  const categories = useMemo(() => [{ key: 'all' as const, label: 'All' }, ...FAQ_CATEGORIES], []);

  const filteredSections = useMemo(() => {
    if (activeCategory === 'all') {
      return ALL_FAQ_SECTIONS;
    }
    return ALL_FAQ_SECTIONS.filter((section) => section.category === activeCategory);
  }, [activeCategory]);

  // Refs for scroll animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const emptyMessageRef = useRef<HTMLParagraphElement>(null);

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const fadeInUpSmallVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const fadeInUpMediumVariants = {
    hidden: { opacity: 0, y: 150 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      },
    },
  };

  // Check if elements are in view
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });
  const categoriesInView = useInView(categoriesRef, { once: true, margin: '-100px' });
  const accordionInView = useInView(accordionRef, { once: true, margin: '-100px' });
  const emptyMessageInView = useInView(emptyMessageRef, { once: true, margin: '-100px' });

  const handleCategoryClick = (key: FaqCategoryKey | 'all') => {
    setActiveCategory(key);
  };

  return (
    <div className="mx-container-mobile md:mx-container-mobile pt-[124px] md:pt-[136px] xl:pt-[147px] 2xl:pt-[208px]">
      <motion.h1
        animate={titleInView ? 'visible' : 'hidden'}
        className="paragraph-heading-md text-text mb-[56px] text-left uppercase md:text-center md:text-[64px] md:leading-[110%] xl:text-[45px] 2xl:text-[64px]"
        initial="hidden"
        ref={titleRef}
        variants={fadeInUpVariants}
      >
        Faq
      </motion.h1>

      <motion.div
        animate={categoriesInView ? 'visible' : 'hidden'}
        className="md:flex md:flex-col md:items-center md:justify-center"
        initial="hidden"
        ref={categoriesRef}
        variants={fadeInUpSmallVariants}
      >
        <div className="-mx-container-mobile mb-[56px] md:hidden">
          <div className="keen-slider pl-container-mobile" ref={sliderRef}>
            {categories.map(({ key, label }) => (
              <Category
                activeCategory={activeCategory}
                category={key}
                className="keen-slider__slide"
                key={key}
                label={label}
                onClick={() => handleCategoryClick(key)}
              />
            ))}
          </div>
        </div>

        <div className="mb-[56px] hidden gap-2 md:flex">
          {categories.map(({ key, label }) => (
            <Category
              activeCategory={activeCategory}
              category={key}
              className="hidden text-sm md:block 2xl:text-lg"
              key={key}
              label={label}
              onClick={() => handleCategoryClick(key)}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={accordionInView ? 'visible' : 'hidden'}
        initial="hidden"
        ref={accordionRef}
        variants={fadeInUpMediumVariants}
      >
        <FaqAccordion
          className="mx-auto mb-[56px] md:mb-[86px] xl:mb-[86px] xl:w-[1067px] 2xl:mb-[116px] 2xl:w-[1091px]"
          isBig
          sections={filteredSections}
        />
      </motion.div>

      {filteredSections.length === 0 && (
        <motion.p
          animate={emptyMessageInView ? 'visible' : 'hidden'}
          className="text-text/60 mb-[56px] text-center text-lg"
          initial="hidden"
          ref={emptyMessageRef}
          variants={fadeInUpVariants}
        >
          No questions found in this category.
        </motion.p>
      )}
    </div>
  );
};
