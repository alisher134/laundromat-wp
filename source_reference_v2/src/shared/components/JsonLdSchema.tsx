import { BUSINESS_INFO, SITE_CONFIG, SOCIAL_LINKS } from '@/shared/config/seo.config';
import type {
  ArticleInput,
  ArticleSchemaData,
  BreadcrumbInputItem,
  BreadcrumbListSchemaData,
  FAQInputItem,
  FAQPageSchemaData,
  ItemListInput,
  ItemListSchemaData,
  LocalBusinessSchemaData,
  ServiceInput,
  ServiceSchemaData,
  WebSiteSchemaData,
} from '@/shared/types/json-ld.types';

interface JsonLdScriptProps {
  data: object;
}

const JsonLdScript = ({ data }: JsonLdScriptProps) => (
  <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} type="application/ld+json" />
);

export const LocalBusinessSchema = () => {
  const schema: LocalBusinessSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'Laundromat',
    name: BUSINESS_INFO.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: BUSINESS_INFO.openingHours.days,
        opens: BUSINESS_INFO.openingHours.opens,
        closes: BUSINESS_INFO.openingHours.closes,
      },
    ],
    priceRange: BUSINESS_INFO.priceRange,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.images.og}`,
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram],
    areaServed: {
      '@type': 'Place',
      name: `${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.countryName}`,
    },
    serviceType: BUSINESS_INFO.services,
  };

  return <JsonLdScript data={schema} />;
};

export const WebSiteSchema = () => {
  const schema: WebSiteSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLdScript data={schema} />;
};

interface BreadcrumbSchemaProps {
  items: BreadcrumbInputItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema: BreadcrumbListSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={schema} />;
};

interface FAQSchemaProps {
  items: FAQInputItem[];
}

export const FAQSchema = ({ items }: FAQSchemaProps) => {
  const schema: FAQPageSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
};

interface ArticleSchemaProps {
  article: ArticleInput;
}

export const ArticleSchema = ({ article }: ArticleSchemaProps) => {
  const schema: ArticleSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}${SITE_CONFIG.images.logo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };

  return <JsonLdScript data={schema} />;
};

interface ServiceSchemaProps {
  items: ServiceInput[];
}

export const ServiceSchema = ({ items }: ServiceSchemaProps) => {
  return (
    <>
      {items.map((service, index) => {
        const schema: ServiceSchemaData = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          description: service.description,
          provider: {
            '@type': 'LocalBusiness',
            name: BUSINESS_INFO.name,
          },
          areaServed: {
            '@type': 'Place',
            name: `${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.countryName}`,
          },
          serviceType: service.serviceType,
        };
        return <JsonLdScript data={schema} key={index} />;
      })}
    </>
  );
};

interface ItemListSchemaProps {
  items: ItemListInput[];
}

export const ItemListSchema = ({ items }: ItemListSchemaProps) => {
  const schema: ItemListSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };

  return <JsonLdScript data={schema} />;
};
