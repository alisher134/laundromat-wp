'use client';

import { TIP_DETAIL_DATA, TIPS_CATEGORIES } from '@/shared/data';
import { useRouter } from '@/shared/config/i18n';
import { PATHS } from '@/shared/constants/paths';
import { TIPS_SLIDES_DATA } from '@/widgets/TipsSection/config';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BackButton, ArticleHeader, ArticleContent, ShareSocial, RelatedArticlesSlider } from './ui';

export const TipsDetailPage = () => {
  const router = useRouter();
  const t = useTranslations('home.tips');

  const [activeCategory, setActiveCategory] = useState<string>(TIPS_CATEGORIES[0].key);

  const handleGoBack = useCallback(() => {
    router.push(PATHS.tips);
  }, [router]);

  const handleCategoryClick = useCallback((key: string) => {
    setActiveCategory(key);
  }, []);

  const article = TIP_DETAIL_DATA;

  const tipsSlides = TIPS_SLIDES_DATA.map((item) => ({
    ...item,
    category: t(`items.${item.key}.category`),
    title: t(`items.${item.key}.title`),
    date: t(`items.${item.key}.date`),
    bigImage: '',
  }));

  return (
    <section className="mx-4 pt-[75px] md:mx-4 xl:mx-6 2xl:mx-9">
      <BackButton label="All articles" onClick={handleGoBack} />

      <ArticleHeader
        activeCategory={activeCategory}
        categories={TIPS_CATEGORIES}
        mainImage={article.mainImage}
        onCategoryClick={handleCategoryClick}
        title={article.title}
      />

      <div className="xl:flex xl:flex-row-reverse xl:items-start xl:justify-end xl:gap-[125px] 2xl:gap-[297px]">
        <ArticleContent
          bonusTip={article.bonusTip}
          introText={article.introText}
          secondImage={article.secondImage}
          subtitle={article.subtitle}
          tips={article.tips}
        />

        <ShareSocial url="https://www.google.com" />
      </div>

      <RelatedArticlesSlider items={tipsSlides} title="Blog" />
    </section>
  );
};
