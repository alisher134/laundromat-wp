import 'next-intl';
import { Locale } from '@/shared/config/i18n/model/types';

import common from '@/shared/config/i18n/messages/en/common.json';
import contact from '@/shared/config/i18n/messages/en/contact.json';
import faq from '@/shared/config/i18n/messages/en/faq.json';
import home from '@/shared/config/i18n/messages/en/home.json';
import services from '@/shared/config/i18n/messages/en/services.json';
import tips from '@/shared/config/i18n/messages/en/tips.json';
import instructions from '@/shared/config/i18n/messages/en/instructions.json';
import error from '@/shared/config/i18n/messages/en/error.json';
import location from '@/shared/config/i18n/messages/en/location.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: IntlMessages;
  }

  interface IntlMessages {
    common: typeof common;
    contact: typeof contact;
    faq: typeof faq;
    home: typeof home;
    services: typeof services;
    tips: typeof tips;
    instructions: typeof instructions;
    error: typeof error;
    location: typeof location;
  }
}
