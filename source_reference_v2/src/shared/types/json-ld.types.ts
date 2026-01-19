export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
}

export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: readonly string[];
  opens: string;
  closes: string;
}

export interface Organization {
  '@type': 'Organization';
  name: string;
  logo?: ImageObject;
}

export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
}

export interface Place {
  '@type': 'Place';
  name: string;
}

export interface LocalBusinessSchemaData {
  '@context': 'https://schema.org';
  '@type': 'Laundromat';
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: PostalAddress;
  geo: GeoCoordinates;
  openingHoursSpecification: OpeningHoursSpecification[];
  priceRange: string;
  image: string;
  sameAs: string[];
  areaServed: Place;
  serviceType: readonly string[];
}

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbListSchemaData {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface FAQItem {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface FAQPageSchemaData {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: FAQItem[];
}

export interface ArticleSchemaData {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: Organization;
  publisher: Organization;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface ServiceSchemaData {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'LocalBusiness';
    name: string;
  };
  areaServed: Place;
  serviceType: string;
}

export interface WebSiteSchemaData {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface ItemListSchemaData {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    url: string;
  }[];
}

export interface BreadcrumbInputItem {
  name: string;
  url: string;
}

export interface FAQInputItem {
  question: string;
  answer: string;
}

export interface ArticleInput {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  url: string;
}

export interface ServiceInput {
  name: string;
  description: string;
  serviceType: string;
}

export interface ItemListInput {
  name: string;
  url: string;
}
