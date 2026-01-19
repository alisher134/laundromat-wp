import { DEFAULT_LOCALE, LOCALES } from '@/shared/config/i18n/model/config';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});
