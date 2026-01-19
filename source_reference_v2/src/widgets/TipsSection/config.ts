export type TipKey = 'tip-1' | 'tip-2' | 'tip-3';

export const TIP_KEYS: TipKey[] = ['tip-1', 'tip-2', 'tip-3'];

export interface TipCardData {
  key: TipKey;
  image: string;
  bigImage: string;
}

export interface TipSlideData {
  key: TipKey;
  image: string;
}

export const TIPS_CARDS_DATA: TipCardData[] = [
  {
    key: 'tip-1',
    image: '',
    bigImage: '/images/tips-1.png',
  },
  {
    key: 'tip-2',
    image: '/images/tips-2.png',
    bigImage: '',
  },
  {
    key: 'tip-3',
    image: '/images/tips-4.png',
    bigImage: '',
  },
];

export const TIPS_SLIDES_DATA: TipSlideData[] = [
  {
    key: 'tip-1',
    image: '/images/tips-1.png',
  },
  {
    key: 'tip-2',
    image: '/images/tips-2.png',
  },
  {
    key: 'tip-3',
    image: '/images/tips-3.png',
  },
];
