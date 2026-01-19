import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { DEFAULT_LOCALE, loadMessages, LOCALES } from '@/shared/config/i18n/model/config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(LOCALES, requested) ? requested : DEFAULT_LOCALE;
  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
