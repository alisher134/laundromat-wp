'use client';

import LaundromatLogo from '@/shared/assets/icons/laundromat-logo.svg';
import { PATHS } from '@/shared/constants/paths';
import { CONTACTS } from '@/shared/constants/contacts';
import { BurgerMenu } from './BurgerMenu';
import OurLocationIcon from '@/shared/assets/icons/our-location.svg';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/shared/config/i18n';
import { cn } from '@/shared/libs/cn';
import { LanguageSwitcher } from '@/features/language-switcher';
import { DARK_TEXT_ROUTES, HEADER_NAV_LINKS, isRouteInList } from '@/shared/config/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';

export const Header = () => {
  const t = useTranslations('common.nav');
  const pathname = usePathname();

  const isPageWithHeroBg = pathname === PATHS.home || pathname === PATHS.contact;
  const isHomPage = pathname === PATHS.home;
  const isDarkTextRoute = isRouteInList(pathname, DARK_TEXT_ROUTES);

  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldPlayEntrance, setShouldPlayEntrance] = useState(false);

  const shouldUseBlackText = isPageWithHeroBg ? isScrolled : isDarkTextRoute;

  // Animation limitation on mount
  useLayoutEffect(() => {
    if (isHomPage && typeof window !== 'undefined' && window.scrollY < 50) {
      // eslint-disable-next-line
      setShouldPlayEntrance(true);
    }
  }, [isHomPage]);

  useEffect(() => {
    if (!isPageWithHeroBg) return;

    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.9;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPageWithHeroBg]);

  const textColorClass = shouldUseBlackText ? 'text-text' : 'text-white';

  return (
    <header
      className={cn(
        'px-container-mobile min-[1120px]:px-container-tablet 2xl:px-container-desktop fixed top-0 right-0 left-0 z-50 pt-4 pb-4 transition-all duration-500 min-[1366px]:pt-[11px] min-[1366px]:pb-[11px] md:pt-[18px] md:pb-[18px] 2xl:pt-[22px] 2xl:pb-[22px]',
        shouldPlayEntrance && 'hero-fade hero-fade-0',
        shouldUseBlackText && 'bg-white/30 backdrop-blur-sm',
      )}
    >
      <div className="flex items-center justify-between">
        <Link href={PATHS.home}>
          <LaundromatLogo
            className={cn(
              'h-[30px] w-[118px] min-[1366px]:h-[31px] min-[1366px]:w-[126px] md:h-[32px] md:w-[122px] 2xl:h-[39px] 2xl:w-[156px]',
              shouldUseBlackText ? 'text-brand' : 'text-white',
            )}
          />
        </Link>

        <nav className="hidden items-center gap-[123px] min-[1366px]:flex">
          <ul>
            <li className={cn('paragraph-body-xs 2xl:text-lg', textColorClass)}>
              <Link className="flex items-center gap-[6px]" href={PATHS.location}>
                {t('location')} <OurLocationIcon aria-hidden="true" className="h-[10px] w-[11px]" />
              </Link>
            </li>
          </ul>

          <ul className="flex items-center gap-[28px]">
            {HEADER_NAV_LINKS.map(({ href, label }) => (
              <li className={cn('paragraph-body-xs 2xl:text-lg', textColorClass)} key={label}>
                <Link href={href}>{t(label)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5 md:gap-[46px] xl:gap-[59px] 2xl:gap-[105px]">
          <LanguageSwitcher variant={shouldUseBlackText ? 'headerDark' : 'header'} />

          <a
            className={cn(
              'hidden text-sm leading-[132%] font-normal tracking-[-0.01em] md:block 2xl:text-lg 2xl:font-medium',
              textColorClass,
            )}
            href={CONTACTS.phoneLink}
          >
            {CONTACTS.phone}
          </a>

          <div className="block min-[1366px]:hidden">
            <BurgerMenu isMainPage={shouldUseBlackText} />
          </div>
        </div>
      </div>
    </header>
  );
};
