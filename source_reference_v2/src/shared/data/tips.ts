import { TipDetail, CategoryOption } from './types';
import { SelectOption } from '@/shared/types/common';

export type TipsPageTipKey = 'tip-1' | 'tip-2' | 'tip-3' | 'tip-4' | 'tip-5' | 'tip-6' | 'tip-7' | 'tip-8';

export const TIPS_PAGE_TIP_KEYS: TipsPageTipKey[] = [
  'tip-1',
  'tip-2',
  'tip-3',
  'tip-4',
  'tip-5',
  'tip-6',
  'tip-7',
  'tip-8',
];

export interface TipsPageTipData {
  key: TipsPageTipKey;
  image?: string;
  bigImage?: string;
}

export const TIPS_DATA: TipsPageTipData[] = [
  { key: 'tip-1', image: '/images/tips-1.png' },
  { key: 'tip-2', image: '/images/tips-2.png' },
  { key: 'tip-3', image: '/images/tips-3.png' },
  { key: 'tip-4', image: '/images/tips-4.png' },
  { key: 'tip-5', image: '/images/tips-5.png' },
  { key: 'tip-6', image: '/images/tips-6.png' },
  { key: 'tip-7', image: '/images/tips-7.png' },
  { key: 'tip-8', image: '/images/tips-8.png' },
];

export const CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'All articles' },
  { key: 'tipsAndTricks', label: 'Tips and tricks' },
  { key: 'usefulResources', label: 'Useful resources' },
  { key: 'companyNews', label: 'Company news' },
] as const;

export const SORT_OPTIONS: SelectOption<string>[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
] as const;

export const DEFAULT_CATEGORY = 'all' as const;
export const DEFAULT_SORT = 'latest' as const;
export const DEFAULT_PAGE = 1;
export const DEFAULT_TOTAL_PAGES = 10;

export const SLIDER_CONFIG = {
  loop: false,
  mode: 'free-snap' as const,
  rtl: false,
  slides: {
    perView: 'auto' as const,
    spacing: 6,
  },
} as const;

export const TIPS_CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'All articles' },
  { key: 'april292025', label: 'April 29, 2025' },
] as const;

export const TIP_DETAIL_DATA: TipDetail = {
  id: 'winter-laundry-tips',
  title: '5 Amazingly simple laundry tips for winter clothes',
  category: 'Articles',
  date: 'April 20, 2023',
  mainImage: '/images/tips-6.png',
  introText:
    "Follow these seven laundry hacks and tips and you'll be able to breathe easy whether it's snowing or scorching outside!",
  subtitle: 'Top 7 Laundry Tips For Winter Clothes',
  tips: [
    {
      number: 1,
      title: 'Separate Your Laundry Carefully To Prevent Fabric Damage',
      description:
        "This laundry tip may seem like common sense, but it's important enough that it's worth repeating. When washing various fabrics in the same load, try to stick with fabrics that require the same amount of care. For instance, wool coats are oftentimes dry clean only while some fleece jackets can be washed on the gentle cycle in cold water without any problems whatsoever. By grouping like fabrics together, you'll be able to prevent the damage that can happen when certain types of fabric get too rough or too hot during the wash.",
    },
    {
      number: 2,
      title: 'Sort Clothes Into Light, Medium, And Heavy Fabrics',
      description:
        "Another tip that's particularly helpful in the winter is to sort your laundry into three different categories: light, medium, and heavy fabrics. The reason for this laundry tip is to distribute weight evenly among all of your laundry garments so that everything has a chance to agitate freely inside the washing machine. By sorting your clothes into categories, you'll avoid the problem of having too much weight on one side of your laundry load.",
    },
    {
      number: 3,
      title: 'Check The Care Instructions Before Washing',
      description:
        "Make sure that you are actually laundering your winter clothes correctly by reading the clothing labels carefully! Many coats, jackets, sweaters, and other winter clothes are [dry clean only](https://example.com). This means that they should not be washed at home with the rest of your laundry. If there is any doubt whether or not a garment can be machine washed, check for specific instructions on how to wash it – usually right on the label itself. If there are no instructions, then it's best to send that garment out to a professional dry cleaner or [laundry service](https://example.com).",
    },
    {
      number: 4,
      title: 'Clean Wool Clothing Properly',
      description:
        "Wool clothing needs special care during both the laundry process as well as drying – another laundry-related issue winter brings with it! To clean wool clothing, use cool or lukewarm water instead of hot water. Wool is an absorbent fabric that needs to be washed gently in order to prevent it from getting worn out or stretched out too much. When drying wool clothes, make sure they are hung up – never put them in the dryer! When it comes to washing them, make sure you read your clothing labels before putting any kind of wool garment in the laundry! Washing wool incorrectly can cause damage and shrinkage – not fun when you're trying to stay warm!",
    },
    {
      number: 5,
      title: 'Launder Your Cold Weather Accessories',
      description:
        "Another laundry tip that's important in the winter is to launder your cold-weather accessories like hats, scarves, mittens, and even leather gloves if need be! These accessories can easily pick up odors from being crammed into a drawer all winter long. Not only does this laundry tip keep your accessories from smelling awful all the time, but it also helps to extend their life by washing away any perspiration that may have seeped into them.",
    },
  ],
  secondImage: '/images/laundry-detergent-pods.png',
  bonusTip: {
    title: 'Bonus Tips! Protect Your Winter Coat During The Dryer Cycle With A Tennis Ball',
    items: [
      "Tennis balls aren't just for playing tennis! To protect your winter coat during the dryer cycle, simply toss one into the machine with your wet clothes. Tossing in a tennis ball will help to keep down any static cling while also protecting your garment from being stretched out of shape or torn by the tumbling of the dryer. The best part of this laundry hack is that it's free!",
      'Once the cycle is done, remove the coat and shake it out vigorously. The tennis balls will help fluff up your coat by restoring any lost volume while also protecting it from too much wear and tear!',
      "Of course, washing your winter clothes isn't rocket science but it can help to prevent some common problems like fabric damage or funky smells! With these seven surprisingly simple laundry tips for winter clothes, you'll have no problem keeping your wardrobe fresh all year long.",
    ],
  },
};
