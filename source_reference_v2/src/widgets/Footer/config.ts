import { PATHS } from '@/shared/constants/paths';
import { IntlMessages } from 'next-intl';

interface FooterNavItem {
  title: keyof IntlMessages['common']['footer'];
  links: {
    label: keyof IntlMessages['common']['footer'];
    href: string;
  }[];
}

export const FOOTER_NAV: FooterNavItem[] = [
  {
    title: 'company',
    links: [
      {
        label: 'location',
        href: PATHS.location,
      },
      {
        label: 'laundryTips',
        href: PATHS.laundryTips,
      },
      {
        label: 'contact',
        href: PATHS.contacts,
      },
      {
        label: 'faq',
        href: PATHS.faq,
      },
    ],
  },
  {
    title: 'services',
    links: [
      {
        label: 'laundry',
        href: PATHS.laundry,
      },
      {
        label: 'drying',
        href: PATHS.drying,
      },
      {
        label: 'specialCleaning',
        href: PATHS.specialCleaning,
      },
    ],
  },
];
