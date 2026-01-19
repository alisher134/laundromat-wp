export interface LocationItem {
  id: number;
  title: string;
  storeHours: string;
  phone: string;
}

export interface ServicePrice {
  id: number;
  feature: string;
  duration: string;
  price: number;
  currency: string;
}

export interface Service {
  id: number;
  category: 'laundryService' | 'dryingService' | 'specialCleaning';
  title: string;
  description: string;
  image: string;
  prices: ServicePrice[];
}

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
  price: number;
  duration: string;
}

export interface TipCard {
  category: string;
  title: string;
  date: string;
  image?: string;
  bigImage?: string;
}

export type TipDescriptionSegment = { type: 'text'; content: string } | { type: 'link'; text: string; url: string };

export interface TipItem {
  number: number;
  title: string;
  description: string;
}

export interface BonusTip {
  title: string;
  items: string[];
}

export interface TipDetail {
  id: string;
  title: string;
  category: string;
  date: string;
  mainImage: string;
  introText: string;
  subtitle?: string;
  tips: TipItem[];
  secondImage?: string;
  bonusTip?: BonusTip;
}

export type CategoryKey = 'all' | 'tipsAndTricks' | 'usefulResources' | 'companyNews';
export type SortOption = 'latest' | 'oldest' | 'title-asc' | 'title-desc';

export interface CategoryOption {
  key: string;
  label: string;
}

export type ReviewSlideItem = {
  name: string;
  review: string;
  order?: number;
};
