'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/features/language-switcher';
import { FOOTER_VISIBLE_ROUTES, isRouteInList } from '@/shared/config/navigation';
import { CONTACTS } from '@/shared/constants/contacts';
import { PATHS } from '@/shared/constants/paths';
import { Link, usePathname } from '@/shared/config/i18n';
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg';
import { FooterNav } from './FooterNav';

const SPRING_CONFIG = { stiffness: 80, damping: 25, mass: 0.8 };

const FooterContacts = () => (
  <address className="flex flex-col items-start gap-[6px] not-italic xl:gap-2 2xl:gap-[10px]">
    <a
      className="text-4xl leading-[136%] font-normal tracking-[-0.04em] text-white md:text-[45px] xl:text-[64px] xl:leading-[110%] 2xl:text-[64px]"
      href={CONTACTS.phoneLink}
    >
      {CONTACTS.phone}
    </a>
    <a
      className="text-[21px] leading-[136%] font-normal tracking-[-0.02em] text-white underline xl:text-2xl 2xl:text-4xl"
      href={CONTACTS.emailLink}
    >
      {CONTACTS.email}
    </a>
  </address>
);

const FooterCopyright = () => {
  const t = useTranslations('common.footer');

  return (
    <div className="flex items-center justify-between">
      <p className="max-w-[120px] text-xs leading-[132%] font-normal tracking-[-0.01em] text-white/60 md:max-w-full 2xl:text-lg">
        {t('copyright')}
      </p>

      <Link
        className="hidden text-xs leading-[132%] font-normal tracking-[-0.01em] text-white/60 md:inline-block 2xl:text-lg"
        href={PATHS.privacyPolicy}
      >
        {t('privacyPolicy')}
      </Link>

      <p className="w-[77px] text-xs leading-[132%] font-normal tracking-[-0.01em] text-white/60 md:w-fit 2xl:text-lg">
        {t('websiteBy')} <span className="font-medium text-white">AVA Digital</span>
      </p>
    </div>
  );
};

const AnimatedFooterContent = () => {
  const t = useTranslations('common.footer');
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const formWidth = useTransform(smoothProgress, [0, 1], ['60%', '100%']);
  const bottomBlockScale = useTransform(smoothProgress, [0.8, 1], [0.85, 1]);

  return (
    <footer className="xl:px-container-tablet xl:pb-container-tablet 2xl:px-container-desktop 2xl:pb-container-desktop relative bg-white px-[6px] pt-[120px] pb-[6px] md:pt-[164px] xl:pt-[200px] 2xl:pt-[256px]">
      <div className="pointer-events-none absolute inset-0 bg-[#C7D8E3]/20" />

      <div className="bg-brand px-container-mobile pb-container-mobile xl:px-container-tablet relative overflow-hidden rounded-[20px] pt-9 xl:py-[34px]">
        <div className="mb-8 flex items-start justify-between xl:mb-[83px] 2xl:mb-[180px]">
          <FooterContacts />
          <FooterNav variant="desktop" />
          <div className="hidden md:block">
            <LanguageSwitcher variant="footer" />
          </div>
        </div>

        <FooterNav variant="mobile" />

        <div className="mb-[29px] block md:hidden">
          <LanguageSwitcher variant="footer" />
        </div>

        <div className="md:w-[316px] xl:w-[332px] 2xl:w-[467px]" ref={ref}>
          <motion.form
            className="rounded-card flex items-center justify-between border border-white/20 py-[10px] pr-[10px] pl-[21px] 2xl:py-[14px] 2xl:pr-[14px] 2xl:pl-[26px]"
            role="search"
            style={{ width: formWidth }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              {t('subscribePlaceholder')}
            </label>
            <input
              className="paragraph-sm-default w-full text-white outline-none xl:text-base 2xl:text-lg"
              id="newsletter-email"
              placeholder={t('subscribePlaceholder')}
              type="email"
            />
            <button
              className="flex-center rounded-badge focus-brand size-[34px] shrink-0 bg-white 2xl:size-12"
              type="submit"
            >
              <ArrowRightIcon aria-hidden="true" className="text-brand size-[7px]" />
            </button>
          </motion.form>
        </div>

        <span aria-hidden className="footer-circle-1" />
        <span aria-hidden className="footer-circle-2" />
      </div>

      <motion.div
        className="mx-container-mobile xl:px-container-tablet origin-top rounded-b-[16px] bg-[#b0d4eb] px-4 pt-6 pb-5 xl:pt-[60px] xl:pb-5 2xl:mx-10"
        style={{ scaleX: bottomBlockScale }}
      >
        <Link
          className="mb-5 inline-block text-xs leading-[132%] font-normal tracking-[-0.01em] text-white/60 md:hidden"
          href={PATHS.privacyPolicy}
        >
          {t('privacyPolicy')}
        </Link>
        <FooterCopyright />
      </motion.div>
    </footer>
  );
};

export const Footer = () => {
  const pathname = usePathname();
  const shouldShowFooter = isRouteInList(pathname, FOOTER_VISIBLE_ROUTES);

  if (!shouldShowFooter) {
    return null;
  }

  return <AnimatedFooterContent />;
};
