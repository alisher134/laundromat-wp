import { FaqSection } from '@/shared/ui/faq-accordion';

export const FAQ_CATEGORIES = [
  { key: 'general', label: 'General' },
  { key: 'prices', label: 'Prices and payment' },
  { key: 'location', label: 'Location' },
  { key: 'safety', label: 'Safety and convenience' },
] as const;

export type FaqCategoryKey = (typeof FAQ_CATEGORIES)[number]['key'];

export const ALL_FAQ_SECTIONS: FaqSection[] = [
  {
    position: 1,
    title: 'How can I use the washing and drying machines at Laundromat?',
    content:
      'Our self-service washing and drying machines are very easy to use. Simply load your clothes, select a washing or drying cycle, insert coins, and press START. Read the full washing/drying instructions and what to avoid while using the machines here',
    category: 'general',
  },
  {
    position: 2,
    title: 'Do I need to bring my own detergent and other supplies, or are they available on-site for use?',
    content:
      'No, you do not need to bring detergent or any additional laundry supplies. All washing machines automatically dispense the required detergent during the wash cycle. Everything you need to do your laundry is available on-site at the laundromat.',
    category: 'general',
  },
  {
    position: 3,
    title: 'What are the prices for laundry and drying services at Laundromat?',
    content: 'xxxx',
    category: 'prices',
  },
  {
    position: 4,
    title: "What can't be washed at Laundromat?",
    content:
      'For safety and to protect the machines, please do not wash shoes, carpets or rugs, and pet equipment (such as beds, blankets, or accessories). Washing these items may damage the machines or affect wash quality for other customers.',
    category: 'general',
  },
  {
    position: 5,
    title: 'Can I wash large and bulky items such as blankets, duvets, or bed linen?',
    content:
      'Yes. Our machines are designed to handle large and bulky items, including duvets, blankets, bed linen, and pillows. For best results, please follow the recommended machine instructions and select the appropriate cycle.',
    category: 'general',
  },
  {
    position: 6,
    title: 'What are the operating hours of LAUNDROMAT, and is it open 24/7 or only at specific times?',
    content: 'xxx',
    category: 'location',
  },
  {
    position: 7,
    title: 'Is there video surveillance on the laundry area for security?',
    content: 'xxx',
    category: 'safety',
  },
  {
    position: 8,
    title: 'What should I do if there are technical problems with the equipment?',
    content: 'xxx',
    category: 'safety',
  },
];
