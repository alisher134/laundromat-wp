import { TipsPage } from '@/pagesLayer/TipsPage';
import { BreadcrumbSchema, ItemListSchema } from '@/shared/components/JsonLdSchema';
import { TIPS_DATA } from '@/shared/data';
import { PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_DESCRIPTIONS.tips.title,
  description: PAGE_DESCRIPTIONS.tips.description,
  openGraph: {
    title: `${PAGE_DESCRIPTIONS.tips.title} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.tips.description,
  },
};

export default function Page() {
  const tipItems = TIPS_DATA.map((tip, index) => ({
    name: `Tip ${index + 1}`,
    url: `${SITE_CONFIG.url}/tips/${tip.key}`,
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Tips', url: `${SITE_CONFIG.url}/tips` },
        ]}
      />
      <ItemListSchema items={tipItems} />
      <TipsPage />
    </>
  );
}
