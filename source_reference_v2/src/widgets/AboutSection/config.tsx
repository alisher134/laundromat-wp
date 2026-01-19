import { IntlMessages } from 'next-intl';
import CalendarIcon from '@/shared/assets/icons/calendar-icon.svg';
import TimerIcon from '@/shared/assets/icons/timer-icon.svg';
import ClockIcon from '@/shared/assets/icons/clock-icon.svg';
import LowIcon from '@/shared/assets/icons/low-icon.svg';
import { IconComponent } from '@/shared/types/common';

export type AboutCardKey = keyof IntlMessages['home']['aboutCards'];

export const ABOUT_CARD_KEYS: AboutCardKey[] = ['allYear', 'quickService', 'always', 'lowPrices'];

export interface AboutCardData {
  key: AboutCardKey;
  icon: IconComponent;
}

export const ABOUT_CARDS_DATA: AboutCardData[] = [
  {
    key: 'allYear',
    icon: CalendarIcon,
  },
  {
    key: 'quickService',
    icon: TimerIcon,
  },

  {
    key: 'lowPrices',
    icon: LowIcon,
  },
  {
    key: 'always',
    icon: ClockIcon,
  },
];
