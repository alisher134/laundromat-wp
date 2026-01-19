import { FaqPage } from '@/pagesLayer/FaqPage';
import { ALL_FAQ_SECTIONS } from '@/pagesLayer/FaqPage/config';
import { BreadcrumbSchema, FAQSchema } from '@/shared/components/JsonLdSchema';
import { PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_DESCRIPTIONS.faq.title,
  description: PAGE_DESCRIPTIONS.faq.description,
  openGraph: {
    title: `${PAGE_DESCRIPTIONS.faq.title} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.faq.description,
  },
};

const FAQ_ITEMS_FOR_SCHEMA = ALL_FAQ_SECTIONS.map((section) => ({
  question: section.title,
  answer: section.content,
}));

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'FAQs', url: `${SITE_CONFIG.url}/faq` },
        ]}
      />
      <FAQSchema items={FAQ_ITEMS_FOR_SCHEMA} />
      <FaqPage />
    </>
  );
}
