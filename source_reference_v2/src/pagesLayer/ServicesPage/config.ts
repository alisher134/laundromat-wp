import { IntlMessages } from 'next-intl';

export type ServiceKeys = keyof IntlMessages['services']['items'];

export type FeatureKey = keyof IntlMessages['services']['features'];

export const SERVICE_KEYS: ServiceKeys[] = ['laundry', 'drying', 'specialCleaning'];

export interface ServicePriceData {
  id: number;
  featureKey: FeatureKey;
  duration: string;
  price: number;
  currency: string;
}

export interface ServiceData {
  id: number;
  category: ServiceKeys;
  image: string;
  prices: ServicePriceData[];
}

export const SERVICES_DATA: ServiceData[] = [
  {
    id: 1,
    category: 'laundry',
    image: '/images/service-1.png',
    prices: [
      { id: 1, featureKey: 'detergentIncluded', duration: '30 min', price: 15, currency: 'USD' },
      { id: 2, featureKey: 'quickWashes', duration: '30 min', price: 15, currency: 'USD' },
      { id: 3, featureKey: 'performance', duration: '30 min', price: 15, currency: 'USD' },
      { id: 4, featureKey: 'longHours', duration: '30 min', price: 15, currency: 'USD' },
      { id: 5, featureKey: 'cardPayments', duration: '30 min', price: 15, currency: 'USD' },
    ],
  },
  {
    id: 2,
    category: 'drying',
    image: '/images/service-2.png',
    prices: [
      { id: 1, featureKey: 'detergentIncluded', duration: '30 min', price: 15, currency: 'USD' },
      { id: 2, featureKey: 'quickWashes', duration: '30 min', price: 15, currency: 'USD' },
      { id: 3, featureKey: 'performance', duration: '30 min', price: 15, currency: 'USD' },
      { id: 4, featureKey: 'longHours', duration: '30 min', price: 15, currency: 'USD' },
      { id: 5, featureKey: 'cardPayments', duration: '30 min', price: 15, currency: 'USD' },
      { id: 6, featureKey: 'cardPayments', duration: '30 min', price: 15, currency: 'USD' },
    ],
  },
  {
    id: 3,
    category: 'specialCleaning',
    image: '/images/service-3.png',
    prices: [
      { id: 1, featureKey: 'detergentIncluded', duration: '30 min', price: 15, currency: 'USD' },
      { id: 2, featureKey: 'quickWashes', duration: '30 min', price: 15, currency: 'USD' },
      { id: 3, featureKey: 'performance', duration: '30 min', price: 15, currency: 'USD' },
      { id: 4, featureKey: 'longHours', duration: '30 min', price: 15, currency: 'USD' },
      { id: 5, featureKey: 'cardPayments', duration: '30 min', price: 15, currency: 'USD' },
      { id: 6, featureKey: 'cardPayments', duration: '30 min', price: 15, currency: 'USD' },
    ],
  },
];
