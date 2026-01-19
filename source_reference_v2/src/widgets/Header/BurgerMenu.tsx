'use client';

import Image from 'next/image';
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from '@/shared/ui/sheet';
import { LanguageSwitcher } from '@/features/language-switcher';
import { Link } from '@/shared/config/i18n';
import BurgerIcon from '@/shared/assets/icons/burger-icon.svg';
import CloseIcon from '@/shared/assets/icons/close-icon.svg';
import { cn } from '@/shared/libs/cn';
import { HEADER_NAV_LINKS } from '@/shared/config/navigation';
import { CONTACTS } from '@/shared/constants/contacts';
import { useTranslations } from 'next-intl';

export const BurgerMenu = ({ isMainPage }: { isMainPage?: boolean }) => {
  const t = useTranslations('common.nav');
  const textColorClass = isMainPage ? 'text-text' : 'text-white';

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className="flex touch-manipulation items-center justify-center transition-transform active:scale-95"
      >
        <BurgerIcon aria-hidden="true" className={cn('h-9 w-[38px]', textColorClass)} />
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col overflow-hidden border-none p-0" side="right">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>

        <div className="relative h-[280px] w-full shrink-0 overflow-hidden">
          <Image
            alt=""
            aria-hidden="true"
            className="translate-x-[-100px] translate-y-[-40px] rotate-170"
            fill
            priority
            src="/images/mobile-circle.png"
          />

          <div className="absolute top-4 right-4 z-10 flex items-center gap-5">
            <LanguageSwitcher variant="burgerMenu" />

            <SheetClose
              aria-label="Close menu"
              className="border-brand/30 flex h-10 w-10 touch-manipulation items-center justify-center rounded-[10px] border transition-transform active:scale-95"
            >
              <CloseIcon aria-hidden="true" className="text-brand h-[13px] w-[13px]" />
            </SheetClose>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 pb-6">
          <nav aria-label="Main navigation">
            <p className="paragraph-body-xs text-text/50 mb-6" id="menu-label">
              {t('menu')}
            </p>
            <ul aria-labelledby="menu-label" className="space-y-3" role="menu">
              {HEADER_NAV_LINKS.map(({ href, label }) => (
                <li key={label} role="none">
                  <SheetClose asChild>
                    <Link
                      className="text-text hover:text-brand active:text-brand/80 block touch-manipulation py-1 text-[28px] leading-[124%] font-normal tracking-[-0.04em] transition"
                      href={href}
                      role="menuitem"
                    >
                      {t(label)}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-text/50 mb-6 text-sm leading-[132%] font-normal tracking-[-0.01em]">{t('contact')}</p>
            <div className="space-y-3">
              <a
                className="text-brand block touch-manipulation py-1 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-opacity active:opacity-70"
                href={CONTACTS.phoneLink}
              >
                {CONTACTS.phone}
              </a>
              <a
                className="text-brand border-brand/40 block w-fit touch-manipulation border-b py-1 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-opacity active:opacity-70"
                href={CONTACTS.emailLink}
              >
                {CONTACTS.email}
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
