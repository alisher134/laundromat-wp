import { ServicesPage } from '@/pagesLayer/ServicesPage';
import { BreadcrumbSchema, ServiceSchema } from '@/shared/components/JsonLdSchema';
import { PAGE_DESCRIPTIONS, SITE_CONFIG } from '@/shared/config/seo.config';
import { SERVICES_DATA } from '@/shared/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_DESCRIPTIONS.services.title,
  description: PAGE_DESCRIPTIONS.services.description,
  openGraph: {
    title: `${PAGE_DESCRIPTIONS.services.title} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTIONS.services.description,
  },
};

const SERVICES_FOR_SCHEMA = SERVICES_DATA.map((service) => ({
  name: service.title,
  description: service.description,
  serviceType: service.category,
}));

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Services', url: `${SITE_CONFIG.url}/services` },
        ]}
      />
      <ServiceSchema items={SERVICES_FOR_SCHEMA} />
      <ServicesPage />
    </>
  );
}
