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
  TIPS_DATA,
  DEFAULT_CATEGORY,
  DEFAULT_PAGE,
  DEFAULT_TOTAL_PAGES,
  SLIDER_CONFIG,
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

export const TipsPage = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(DEFAULT_CATEGORY);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);
  const [totalPages] = useState<number>(DEFAULT_TOTAL_PAGES);
  const [sortBy, setSortBy] = useState<SortOption>();

  const [sliderRef] = useKeenSlider<HTMLDivElement>(SLIDER_CONFIG);

  const t = useTranslations('tips');

  const titleRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tipsDesktopRef = useRef<HTMLDivElement>(null);
  const tipsMobileRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const titleInView = useInView(titleRef, { once: true, margin: '-100px' });
  const filtersInView = useInView(filtersRef, { once: true, margin: '-100px' });
  const tipsDesktopInView = useInView(tipsDesktopRef, { once: true, margin: '-100px' });
  const tipsMobileInView = useInView(tipsMobileRef, { once: true, margin: '-100px' });
  const paginationInView = useInView(paginationRef, { once: true, margin: '-100px' });

  const categories = CATEGORY_KEYS.map((key) => ({
    key,
    label: t(`categories.${key}`),
  }));

  const sortOptions = SORT_OPTION_KEYS.map((key) => ({
    value: key === 'titleAsc' ? 'title-asc' : key === 'titleDesc' ? 'title-desc' : key,
    label: t(`sortOptions.${key}`),
  }));

  const tipsWithTranslations = useMemo(
    () =>
      TIPS_DATA.map((item) => ({
        ...item,
        category: t(`items.${item.key}.category`),
        title: t(`items.${item.key}.title`),
        date: t(`items.${item.key}.date`),
      })),
    [t],
  );

  const filteredAndSortedTips = useMemo(() => {
    let filtered = tipsWithTranslations;
    if (activeCategory !== 'all') {
      const categoryLabel = t(`categories.${activeCategory}`);
      filtered = tipsWithTranslations.filter((tip) => tip.category === categoryLabel);
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
  }, [tipsWithTranslations, activeCategory, sortBy, t]);

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
        ref={titleRef}
        className="heading-section mb-[32px] text-left md:mb-9 xl:mb-[45px] 2xl:mb-[56px]"
        variants={fadeInUpVariants}
        initial="hidden"
        animate={titleInView ? 'visible' : 'hidden'}
      >
        {t('title')}
      </motion.h1>

      <motion.div
        ref={filtersRef}
        className="mb-[32px] flex flex-col gap-3 md:mb-9 md:flex-row md:items-center md:justify-between xl:mb-[45px] 2xl:mb-[56px]"
        variants={fadeInUpSmallVariants}
        initial="hidden"
        animate={filtersInView ? 'visible' : 'hidden'}
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
        ref={tipsDesktopRef}
        className="hidden gap-4 xl:mb-[86px] xl:grid xl:grid-cols-2 xl:gap-4 xl:gap-[14px] 2xl:mb-[116px] 2xl:gap-4"
        variants={fadeInUpMediumVariants}
        initial="hidden"
        animate={tipsDesktopInView ? 'visible' : 'hidden'}
      >
        {filteredAndSortedTips.map((item) => (
          <TipsCard className={cn(item.bigImage && 'lg:row-span-2')} item={item} key={item.key} />
        ))}
      </motion.div>

      <motion.div
        ref={tipsMobileRef}
        className="mb-[46px] grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 xl:hidden 2xl:mb-[116px]"
        variants={fadeInUpMediumVariants}
        initial="hidden"
        animate={tipsMobileInView ? 'visible' : 'hidden'}
      >
        {filteredAndSortedTips.map((item) => (
          <TipsSlide className="keen-slider__slide min-w-full" item={item} key={item.key} />
        ))}
      </motion.div>

      <motion.div
        ref={paginationRef}
        className="flex flex-col items-center gap-6"
        variants={fadeInUpVariants}
        initial="hidden"
        animate={paginationInView ? 'visible' : 'hidden'}
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
