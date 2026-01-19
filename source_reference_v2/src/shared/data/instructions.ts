import { CategoryOption } from './types';
import { SelectOption } from '@/shared/types/common';

export type InstructionsPageInstructionKey =
  | 'instruction-1'
  | 'instruction-2'
  | 'instruction-3'
  | 'instruction-4'
  | 'instruction-5'
  | 'instruction-6'
  | 'instruction-7'
  | 'instruction-8';

export const INSTRUCTIONS_PAGE_INSTRUCTION_KEYS: InstructionsPageInstructionKey[] = [
  'instruction-1',
  'instruction-2',
  'instruction-3',
  'instruction-4',
  'instruction-5',
  'instruction-6',
  'instruction-7',
  'instruction-8',
];

export interface InstructionsPageInstructionData {
  key: InstructionsPageInstructionKey;
  image?: string;
  bigImage?: string;
}

export const INSTRUCTIONS_DATA: InstructionsPageInstructionData[] = [
  { key: 'instruction-1', image: '/images/tips-1.png' },
  { key: 'instruction-2', image: '/images/tips-2.png' },
  { key: 'instruction-3', image: '/images/tips-3.png' },
  { key: 'instruction-4', image: '/images/tips-4.png' },
  { key: 'instruction-5', image: '/images/tips-5.png' },
  { key: 'instruction-6', image: '/images/tips-6.png' },
  { key: 'instruction-7', image: '/images/tips-7.png' },
  { key: 'instruction-8', image: '/images/tips-8.png' },
];

export const INSTRUCTION_CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'All articles' },
  { key: 'tipsAndTricks', label: 'Tips and tricks' },
  { key: 'usefulResources', label: 'Useful resources' },
  { key: 'companyNews', label: 'Company news' },
] as const;

export const INSTRUCTION_SORT_OPTIONS: SelectOption<string>[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
] as const;

export const INSTRUCTION_DEFAULT_CATEGORY = 'all' as const;
export const INSTRUCTION_DEFAULT_SORT = 'latest' as const;
export const INSTRUCTION_DEFAULT_PAGE = 1;
export const INSTRUCTION_DEFAULT_TOTAL_PAGES = 10;

export const INSTRUCTION_SLIDER_CONFIG = {
  loop: false,
  mode: 'free-snap' as const,
  rtl: false,
  slides: {
    perView: 'auto' as const,
    spacing: 6,
  },
} as const;
