import { Locale } from 'next-intl';

export const LOCALES = ['en', 'gr'] as const;
export const DEFAULT_LOCALE: Locale = 'en';
export const NAMESPACES = ['common', 'contact', 'faq', 'home', 'tips', 'instructions', 'services', 'error', 'location'] as const;

export const loadMessages = async (locale: Locale) => {
  const result: Record<string, Record<string, string>> = {};

  for (const namespace of NAMESPACES) {
    const messages = (await import(`../messages/${locale}/${namespace}.json`)).default;
    result[namespace] = messages;
  }

  return result;
};
