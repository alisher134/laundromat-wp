'use client';

import { Link } from '@/shared/config/i18n';
import { useTranslations } from 'next-intl';

import { FOOTER_NAV } from './config';

interface FooterNavProps {
  variant: 'desktop' | 'mobile';
}

export const FooterNav = ({ variant }: FooterNavProps) => {
  const t = useTranslations('common.footer');

  if (variant === 'desktop') {
    return (
      <>
        {FOOTER_NAV.map(({ title, links }) => (
          <nav className="hidden xl:block" key={title}>
            <h3 className="paragraph-sm-default mb-3 text-white/50 xl:mb-5 2xl:mb-6 2xl:text-lg">{t(title)}</h3>
            <ul className="flex flex-col gap-[6px] 2xl:gap-[8px]">
              {links.map(({ label, href }) => (
                <li
                  className="text-base leading-[132%] font-normal tracking-[-0.01em] text-white 2xl:text-[21px]"
                  key={href}
                >
                  <Link href={href}>{t(label)}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </>
    );
  }

  return (
    <div className="mb-[70px] md:flex md:items-start md:gap-[198px] xl:hidden">
      {FOOTER_NAV.map(({ title, links }) => (
        <nav className="not-last:mb-[32px]" key={title}>
          <h3 className="paragraph-sm-default mb-3 text-white/50 md:text-base xl:text-lg">{t(title)}</h3>
          <ul className="flex flex-col gap-[6px]">
            {links.map(({ label, href }) => (
              <li
                className="text-base leading-[132%] font-normal tracking-[-0.01em] text-white md:text-lg 2xl:text-[21px]"
                key={href}
              >
                <Link href={href}>{t(label)}</Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
};
