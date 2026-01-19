import { LocationPage } from '@/pagesLayer/LocationPage';
import { BreadcrumbSchema, LocalBusinessSchema } from '@/shared/components/JsonLdSchema';
import { PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_DESCRIPTIONS.location.title,
  description: PAGE_DESCRIPTIONS.location.description,
  openGraph: {
    title: `${PAGE_DESCRIPTIONS.location.title} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.location.description,
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Locations', url: `${SITE_CONFIG.url}/location` },
        ]}
      />
      <LocalBusinessSchema />
      <LocationPage />
    </>
  );
}
