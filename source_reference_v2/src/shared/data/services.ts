import { Service, CategoryOption } from './types';
import { FaqSection } from '@/shared/ui/faq-accordion';

export const SERVICES_DATA: Service[] = [
  {
    id: 1,
    category: 'laundryService',
    title: 'Laundry service',
    description:
      'Wash your clothes quickly and efficiently, 365 days a year, with our technologically advanced washing machines',
    image: '/images/service-1.png',
    prices: [
      {
        id: 1,
        feature: 'Detergent included',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 2,
        feature: '30 minute washes',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 3,
        feature: 'A++ performance',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 4,
        feature: 'Long opening hours',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 5,
        feature: 'Card only payments',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
    ],
  },
  {
    id: 2,
    category: 'dryingService',
    title: 'Drying service',
    description: 'Dry your laundry in record time with our fast, high-efficiency dryers',
    image: '/images/service-2.png',
    prices: [
      {
        id: 1,
        feature: 'Detergent included',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 2,
        feature: '30 minute washes',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 3,
        feature: 'A++ performance',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 4,
        feature: 'Long opening hours',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 5,
        feature: 'Card only payments',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 6,
        feature: 'Card only payments',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
    ],
  },
  {
    id: 3,
    category: 'specialCleaning',
    title: 'Special cleaning',
    description:
      'Our machines handle large or delicate items like duvets, blankets, and pillows — please follow instructions for best results',
    image: '/images/service-3.png',
    prices: [
      {
        id: 1,
        feature: 'Detergent included',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 2,
        feature: '30 minute washes',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 3,
        feature: 'A++ performance',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 4,
        feature: 'Long opening hours',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 5,
        feature: 'Card only payments',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
      {
        id: 6,
        feature: 'Card only payments',
        duration: '30 min',
        price: 15,
        currency: 'USD',
      },
    ],
  },
];

export type ServiceSectionCardKey = 'wash' | 'dry' | 'specialCleaning';

export const SERVICE_SECTION_CARD_KEYS: ServiceSectionCardKey[] = ['wash', 'dry', 'specialCleaning'];

export interface ServiceSectionCardData {
  key: ServiceSectionCardKey;
  image: string;
  price: number;
  duration: string;
}

export const SERVICE_SECTION_DATA: ServiceSectionCardData[] = [
  {
    key: 'wash',
    image: '/images/service-1.png',
    price: 15,
    duration: '30 min',
  },
  {
    key: 'dry',
    image: '/images/service-2.png',
    price: 15,
    duration: '30 min',
  },
  {
    key: 'specialCleaning',
    image: '/images/service-3.png',
    price: 15,
    duration: '30 min',
  },
];

export const SERVICES_CATEGORIES: CategoryOption[] = [
  { key: 'laundry', label: 'Laundry service' },
  { key: 'drying', label: 'Drying service' },
  { key: 'specialCleaning', label: 'Special cleaning' },
] as const;

export const DEFAULT_SERVICE_CATEGORY = 'laundry' as const;

export const SERVICES_FAQ_SECTIONS: FaqSection[] = [
  {
    position: 1,
    title: 'How to use washing machines and dryers in LAUNDROMAT correctly?',
    content: 'xxxx',
  },
  {
    position: 2,
    title: 'Do I need to bring my own detergent and other supplies, or are they available on-site for use?',
    content: 'xxxx',
  },
  {
    position: 3,
    title: 'What are the prices for laundry and drying services at LAUNDROMAT?',
    content: 'xxxx',
  },
  {
    position: 4,
    title: "What things can't be washed in LAUNDROMAT machines?",
    content: 'xxxx',
  },
  {
    position: 5,
    title: 'Is it possible to wash large items such as blankets or bed linen?',
    content: 'xxxx',
  },
];
