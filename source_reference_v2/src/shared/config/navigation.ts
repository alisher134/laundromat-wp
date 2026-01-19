import { PATHS } from '@/shared/constants/paths';
import { IntlMessages } from 'next-intl';

interface LocalizedNavLink {
  href: string;
  label: keyof IntlMessages['common']['nav'];
}

export const HEADER_NAV_LINKS: LocalizedNavLink[] = [
  { href: PATHS.services, label: 'services' },
  { href: PATHS.instructions, label: 'instructions' },
  { href: PATHS.tips, label: 'laundryTips' },
  { href: PATHS.contact, label: 'contact' },
] as const;

export const MOBILE_NAV_LINKS = [
  { href: PATHS.location, labelKey: 'location', labelFallback: 'Our location' },
  { href: PATHS.blog, labelKey: 'blog', labelFallback: 'Blog' },
  { href: PATHS.contact, labelKey: 'contact', labelFallback: 'Contacts' },
  { href: PATHS.faq, labelKey: 'faq', labelFallback: 'FAQ' },
] as const;

export const DARK_TEXT_ROUTES = [PATHS.tips, PATHS.instructions, PATHS.faq, PATHS.location, PATHS.services] as const;

export const FOOTER_VISIBLE_ROUTES = [
  PATHS.home,
  PATHS.tips,
  PATHS.instructions,
  PATHS.faq,
  PATHS.location,
  PATHS.services,
  PATHS.contact,
] as const;

export const isRouteMatch = (pathname: string, route: string): boolean => {
  if (route === '/') {
    return pathname === '/';
  }

  const normalizedRoute = route.replace(/:\w+/g, '[^/]+');
  const regex = new RegExp(`^${normalizedRoute}(\\/.*)?$`);
  return regex.test(pathname);
};

export const isRouteInList = (pathname: string, routes: readonly string[]): boolean => {
  return routes.some((route) => isRouteMatch(pathname, route));
};

export type NavLink = (typeof HEADER_NAV_LINKS)[number];
export type MobileNavLink = (typeof MOBILE_NAV_LINKS)[number];
