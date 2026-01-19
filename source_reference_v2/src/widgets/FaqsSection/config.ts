import { IntlMessages } from 'next-intl';

export type FaqKey = keyof IntlMessages['faq']['questions'];

export const FAQ_KEYS: FaqKey[] = ['howToUse', 'detergent', 'prices', 'restrictions', 'bulkyItems'];
