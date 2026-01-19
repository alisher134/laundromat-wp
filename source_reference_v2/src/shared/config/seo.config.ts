import type { Locale } from './i18n';

export const LOCALES = ['en', 'gr'] as const satisfies readonly Locale[];

export const SITE_CONFIG = {
  name: 'Laundromat',
  url: 'https://laundromat.gr',
  description:
    'Looking for a fast, easy, and affordable way to do your laundry? Visit Laundromat self-service laundry and enjoy modern and efficient laundry solutions.',
  keywords: ['laundromat', 'laundry', 'self-service', 'wash', 'dry', 'Athens', 'Greece'],
  author: 'Laundromat',
  creator: 'AVA Digital',
  images: {
    og: '/images/og-image.jpg',
    logo: '/images/logo.png',
  },
} as const;

export const PAGE_DESCRIPTIONS = {
  home: {
    title: 'The easiest way to do your laundry',
    description: SITE_CONFIG.description,
  },
  services: {
    title: 'Services',
    description:
      'All your laundry needs, handled quickly and conveniently. Our advanced, high-capacity machines get your laundry done faster and perfectly fresh every time.',
  },
  location: {
    title: 'Our Locations',
    description: 'Find the nearest Laundromat. Multiple locations across Athens and Corfu. Open daily 7am - midnight.',
  },
  contact: {
    title: 'Contact',
    description: 'Have a question? Get in touch. Contact us via email, phone, or social media.',
  },
  tips: {
    title: 'Laundry Tips',
    description: 'Laundry tips and tricks. Useful resources and company news about laundry care.',
  },
  faq: {
    title: 'FAQs',
    description: 'Frequently asked questions about Laundromat services. How to use machines, prices, and more.',
  },
} as const;

export const BUSINESS_LOCATIONS = [
  {
    id: 'athens-center',
    name: 'Laundromat Athens Center',
    address: {
      street: 'Ioulianou 50',
      city: 'Athens',
      postalCode: '104 34',
      country: 'GR',
      countryName: 'Greece',
    },
    geo: {
      latitude: 37.9838,
      longitude: 23.7275,
    },
  },
  {
    id: 'glyfada',
    name: 'Laundromat Glyfada',
    address: {
      street: 'Grigoriou Lampraki 56',
      city: 'Glyfada',
      postalCode: '166 75',
      country: 'GR',
      countryName: 'Greece',
    },
    geo: {
      latitude: 37.8614,
      longitude: 23.7539,
    },
  },
  {
    id: 'corfu',
    name: 'Laundromat Corfu',
    address: {
      street: 'Ethniki Palaiokastritsas',
      city: 'Kerkira',
      postalCode: '491 00',
      country: 'GR',
      countryName: 'Greece',
    },
    geo: {
      latitude: 39.6243,
      longitude: 19.9217,
    },
  },
] as const;

export const BUSINESS_INFO = {
  name: SITE_CONFIG.name,
  type: 'Laundromat',
  phone: '+30 210 123 4567',
  phoneDisplay: '+30 210 123 4567',
  email: 'info@laundromat.gr',
  priceRange: '€€',
  address: BUSINESS_LOCATIONS[0].address,
  geo: BUSINESS_LOCATIONS[0].geo,
  openingHours: {
    opens: '07:00',
    closes: '00:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const,
  },
  services: ['Self-Service Laundry', 'Wash and Dry', 'Special Cleaning'] as const,
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/laundromatgr',
  instagram: 'https://www.instagram.com/laundromatgr',
} as const;

export type SiteConfig = typeof SITE_CONFIG;
export type BusinessInfo = typeof BUSINESS_INFO;
export type SocialLinks = typeof SOCIAL_LINKS;
export type PageDescriptions = typeof PAGE_DESCRIPTIONS;
export type BusinessLocation = (typeof BUSINESS_LOCATIONS)[number];
