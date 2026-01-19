'use client';

import { useCallback, useState } from 'react';

import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg';
import { Locale, LOCALES, usePathname, useRouter } from '@/shared/config/i18n';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';
import { capitalize } from '@/shared/helpers/capitalize';
import { SelectOption } from '@/shared/types/common';
import { useLocale } from 'next-intl';
import { cn } from '@/shared/libs/cn';

const LANGUAGE_OPTIONS: SelectOption<Locale>[] = LOCALES.map((value) => ({
  label: value,
  value,
}));

type LanguageSwitcherVariant = 'header' | 'headerDark' | 'burgerMenu' | 'footer';

interface LanguageSwitcherProps {
  variant?: LanguageSwitcherVariant;
  className?: string;
}

const VARIANT_STYLES = {
  header: {
    text: 'text-white',
    bg: 'bg-brand/8',
    icon: 'text-white',
  },
  headerDark: {
    text: 'text-[#414242]',
    bg: 'bg-white/16',
    icon: 'text-brand',
  },
  burgerMenu: {
    text: 'text-text',
    bg: 'bg-brand/8',
    icon: 'text-brand',
  },
  footer: {
    text: 'text-white',
    bg: 'bg-white/6',
    icon: 'text-white',
  },
} as const;

export const LanguageSwitcher = ({ variant = 'header', className }: LanguageSwitcherProps) => {
  const styles = VARIANT_STYLES[variant];

  const [isOpen, setIsOpen] = useState(false);

  const { replace } = useRouter();

  const pathname = usePathname();

  const close = useCallback(() => setIsOpen(false), []);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (locale: Locale) => {
    setIsOpen(false);
    replace(pathname, { locale });
  };

  const currentLocale = useLocale();

  const ref = useOutsideClick(close);

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex cursor-pointer items-center gap-[6px] rounded-[8px] px-2 py-1 text-sm leading-[132%] font-normal tracking-[-0.01em] 2xl:text-lg"
        onClick={toggleOpen}
        type="button"
      >
        <span className={cn('leading-[132%] tracking-[-0.01em]', styles.text)}>{capitalize(currentLocale)}</span>
        <span className={cn('rounded-[6px] px-[7px] pt-[5px] pb-[4px] transition-transform duration-150', styles.bg)}>
          <ChevronDownIcon className={cn('h-[3px] w-[5px]', isOpen && 'rotate-180', styles.icon)} />
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute left-0 z-10 mt-2 w-full min-w-[96px] overflow-hidden rounded-[10px] border border-white/20 bg-white/90 text-center shadow-xl backdrop-blur"
          role="listbox"
        >
          {LANGUAGE_OPTIONS.map((locale) => {
            const isActive = locale.value === currentLocale;
            const optionClasses = isActive ? 'bg-brand/10 font-semibold text-brand' : 'text-text hover:bg-brand/5';

            return (
              <li key={locale.value}>
                <button
                  aria-selected={isActive}
                  className={cn(
                    'paragraph-body-sm flex w-full cursor-pointer items-center justify-center px-3 py-2 transition',
                    optionClasses,
                  )}
                  onClick={() => handleSelect(locale.value)}
                  role="option"
                  type="button"
                >
                  {capitalize(locale.label)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
