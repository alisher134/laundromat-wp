'use client';

import { useMemo, useState, useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { Pagination } from '@/shared/ui/Pagination';
import { Category } from '@/shared/ui/category';
import { TipsCard } from '@/shared/ui/tips-card';
import { TipsSlide } from '@/widgets/TipsSection/TipsSlide';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import SortIcon from '@/shared/assets/icons/sort-icon.svg';
import { cn } from '@/shared/libs/cn';
import {
  INSTRUCTIONS_DATA,
  INSTRUCTION_DEFAULT_CATEGORY,
  INSTRUCTION_DEFAULT_PAGE,
  INSTRUCTION_DEFAULT_TOTAL_PAGES,
  INSTRUCTION_SLIDER_CONFIG,
  CategoryKey,
  SortOption,
} from '@/shared/data';
import 'keen-slider/keen-slider.min.css';
import { useTranslations } from 'next-intl';
import { motion, useInView, type Variants } from 'framer-motion';

const CATEGORY_KEYS: CategoryKey[] = ['all', 'tipsAndTricks', 'usefulResources', 'companyNews'];

const SORT_OPTION_KEYS = ['latest', 'oldest', 'titleAsc', 'titleDesc'] as const;

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

export const InstructionsPage = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(INSTRUCTION_DEFAULT_CATEGORY);
  const [currentPage, setCurrentPage] = useState<number>(INSTRUCTION_DEFAULT_PAGE);
  const [totalPages] = useState<number>(INSTRUCTION_DEFAULT_TOTAL_PAGES);
  const [sortBy, setSortBy] = useState<SortOption>();

  const [sliderRef] = useKeenSlider<HTMLDivElement>(INSTRUCTION_SLIDER_CONFIG);

  const t = useTranslations('instructions');

  const titleRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const instructionsDesktopRef = useRef<HTMLDivElement>(null);
  const instructionsMobileRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });
  const filtersInView = useInView(filtersRef, { once: true, margin: '-100px' });
  const instructionsDesktopInView = useInView(instructionsDesktopRef, { once: true, margin: '-100px' });
  const instructionsMobileInView = useInView(instructionsMobileRef, { once: true, margin: '-100px' });
  const paginationInView = useInView(paginationRef, { once: true, margin: '-100px' });

  const categories = CATEGORY_KEYS.map((key) => ({
    key,
    label: t(`categories.${key}`),
  }));

  const sortOptions = SORT_OPTION_KEYS.map((key) => ({
    value: key === 'titleAsc' ? 'title-asc' : key === 'titleDesc' ? 'title-desc' : key,
    label: t(`sortOptions.${key}`),
  }));

  const instructionsWithTranslations = useMemo(
    () =>
      INSTRUCTIONS_DATA.map((item) => ({
        ...item,
        category: t(`items.${item.key}.category`),
        title: t(`items.${item.key}.title`),
        date: t(`items.${item.key}.date`),
      })),
    [t],
  );

  const filteredAndSortedInstructions = useMemo(() => {
    let filtered = instructionsWithTranslations;
    if (activeCategory !== 'all') {
      const categoryLabel = t(`categories.${activeCategory}`);
      filtered = instructionsWithTranslations.filter((instruction) => instruction.category === categoryLabel);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'latest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [instructionsWithTranslations, activeCategory, sortBy, t]);

  const handleCategoryClick = (key: string) => {
    setActiveCategory(key as CategoryKey);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  return (
    <div className="mx-4 pt-[124px] md:mx-4 md:pt-[136px] xl:pt-[147px] 2xl:pt-[208px]">
      <motion.h1
        animate={titleInView ? 'visible' : 'hidden'}
        className="heading-section mb-[32px] text-left md:mb-9 xl:mb-[45px] 2xl:mb-[56px]"
        initial="hidden"
        ref={titleRef}
        variants={fadeInUpVariants}
      >
        {t('title')}
      </motion.h1>

      <motion.div
        animate={filtersInView ? 'visible' : 'hidden'}
        className="mb-[32px] flex flex-col gap-3 md:mb-9 md:flex-row md:items-center md:justify-between xl:mb-[45px] 2xl:mb-[56px]"
        initial="hidden"
        ref={filtersRef}
        variants={fadeInUpSmallVariants}
      >
        <div className="-mx-container-mobile md:hidden">
          <div className="keen-slider pl-container-mobile" ref={sliderRef}>
            {categories.map(({ key, label }) => (
              <Category
                activeCategory={activeCategory}
                category={key}
                className="keen-slider__slide text-sm 2xl:text-lg"
                key={key}
                label={label}
                onClick={() => handleCategoryClick(key)}
                paddingClassName="px-[18px] py-[14px]"
              />
            ))}
          </div>
        </div>

        <div className="hidden gap-2 md:flex">
          {categories.map(({ key, label }) => (
            <Category
              activeCategory={activeCategory}
              category={key}
              className="text-sm 2xl:text-lg"
              key={key}
              label={label}
              onClick={() => handleCategoryClick(key)}
              paddingClassName="px-[18px] py-[14px]"
            />
          ))}
        </div>

        <div className="flex justify-start">
          <Select onValueChange={handleSortByChange} value={sortBy}>
            <SelectTrigger
              className="border-text/20 text-text min-h-[45px] w-full rounded-[12px] px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] shadow-none md:w-[120px] [&>svg]:ml-auto"
              withIcon={false}
            >
              <SelectValue placeholder={t('sortPlaceholder')} />
              <SortIcon className="text-text h-[15px] w-[15px] shrink-0" />
            </SelectTrigger>
            <SelectContent className="w-full md:w-[120px]">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div
        animate={instructionsDesktopInView ? 'visible' : 'hidden'}
        className="hidden gap-4 xl:mb-[86px] xl:grid xl:grid-cols-2 xl:gap-4 xl:gap-[14px] 2xl:mb-[116px] 2xl:gap-4"
        initial="hidden"
        ref={instructionsDesktopRef}
        variants={fadeInUpMediumVariants}
      >
        {filteredAndSortedInstructions.map((item) => (
          <TipsCard className={cn(item.bigImage && 'lg:row-span-2')} item={item} key={item.key} />
        ))}
      </motion.div>

      <motion.div
        animate={instructionsMobileInView ? 'visible' : 'hidden'}
        className="mb-[46px] grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 xl:hidden 2xl:mb-[116px]"
        initial="hidden"
        ref={instructionsMobileRef}
        variants={fadeInUpMediumVariants}
      >
        {filteredAndSortedInstructions.map((item) => (
          <TipsSlide className="keen-slider__slide min-w-full" item={item} key={item.key} />
        ))}
      </motion.div>

      <motion.div
        animate={paginationInView ? 'visible' : 'hidden'}
        className="flex flex-col items-center gap-6"
        initial="hidden"
        ref={paginationRef}
        variants={fadeInUpVariants}
      >
        <Pagination
          className="hidden md:flex"
          current={currentPage}
          onChange={onPageChange}
          siblingCount={3}
          total={totalPages}
        />

        <button className="border-text/20 text-text flex h-[70px] w-[220px] cursor-pointer items-center justify-center rounded-[8px] border text-sm leading-[132%] font-normal tracking-[-0.01em] 2xl:h-[83px] 2xl:w-[278px]">
          {t('loadMore')}
        </button>
      </motion.div>
    </div>
  );
};
