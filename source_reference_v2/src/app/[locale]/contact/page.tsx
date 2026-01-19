import { ContactPage } from '@/pagesLayer/ContactPage';
import { BreadcrumbSchema } from '@/shared/components/JsonLdSchema';
import { PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_DESCRIPTIONS.contact.title,
  description: PAGE_DESCRIPTIONS.contact.description,
  openGraph: {
    title: `${PAGE_DESCRIPTIONS.contact.title} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.contact.description,
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Contact', url: `${SITE_CONFIG.url}/contact` },
        ]}
      />
      <ContactPage />
    </>
  );
}
