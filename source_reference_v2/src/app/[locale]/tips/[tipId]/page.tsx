import { TipsDetailPage } from '@/pagesLayer/TipsDetailPage';
import { TIP_DETAIL_DATA, TIPS_DATA } from '@/shared/data';
import { ArticleSchema, BreadcrumbSchema } from '@/shared/components/JsonLdSchema';
import { LOCALES, SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

type PageParams = { locale: string; tipId: string };

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    TIPS_DATA.map((tip) => ({
      locale,
      tipId: tip.key,
    })),
  );
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale, tipId } = await params;
  const article = TIP_DETAIL_DATA;

  const canonicalUrl = `${SITE_CONFIG.url}/${locale}/tips/${tipId}`;

  return {
    title: article.title,
    description: article.introText.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.introText.slice(0, 160),
      type: 'article',
      publishedTime: article.date,
      url: canonicalUrl,
      images: [
        {
          url: article.mainImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.introText.slice(0, 160),
      images: [article.mainImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${SITE_CONFIG.url}/${loc}/tips/${tipId}`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { locale, tipId } = await params;
  const article = TIP_DETAIL_DATA;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Tips', url: `${SITE_CONFIG.url}/${locale}/tips` },
          { name: article.title, url: `${SITE_CONFIG.url}/${locale}/tips/${tipId}` },
        ]}
      />
      <ArticleSchema
        article={{
          datePublished: article.date,
          description: article.introText,
          image: `${SITE_CONFIG.url}${article.mainImage}`,
          title: article.title,
          url: `${SITE_CONFIG.url}/${locale}/tips/${tipId}`,
        }}
      />
      <TipsDetailPage />
    </>
  );
}
