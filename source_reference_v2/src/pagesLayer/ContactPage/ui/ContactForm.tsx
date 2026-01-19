'use client';

import { ActionTile } from '@/shared/ui/action-tile';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { cn } from '@/shared/libs/cn';
import { FormEvent, useState } from 'react';
import { Link } from '@/shared/config/i18n';
import { useTranslations } from 'next-intl';

export const ContactForm = () => {
  const [isAgreed, setIsAgreed] = useState(false);

  const t = useTranslations('contact.form');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAgreed) return;

    console.log('submitted');
    // TODO: Add form submission logic here
  };

  return (
    <form className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-2 md:gap-4 2xl:gap-6" onSubmit={onSubmit}>
      <div>
        <label
          className="text-text/40 mb-3 block text-base leading-[132%] font-normal tracking-[-0.01em]"
          htmlFor="first-name"
        >
          {t('firstName')}
        </label>
        <input
          className="text-text h-[76px] w-full rounded-[12px] bg-white px-4 py-[18px] text-base leading-[132%] font-normal tracking-[-0.01em] outline-none"
          id="first-name"
          name="firstName"
          required
          type="text"
        />
      </div>

      <div>
        <label
          className="text-text/40 mb-3 block text-base leading-[132%] font-normal tracking-[-0.01em]"
          htmlFor="last-name"
        >
          {t('lastName')}
        </label>
        <input
          className="text-text h-[76px] w-full rounded-[12px] bg-white px-4 py-[18px] text-base leading-[132%] font-normal tracking-[-0.01em] outline-none"
          id="last-name"
          name="lastName"
          required
          type="text"
        />
      </div>

      <div>
        <label className="text-text/40 mb-3 block text-base leading-[132%] font-normal tracking-[-0.01em]" htmlFor="phone">
          {t('phone')}
        </label>
        <input
          className="text-text h-[76px] w-full rounded-[12px] bg-white px-4 py-[18px] text-base leading-[132%] font-normal tracking-[-0.01em] outline-none"
          id="phone"
          name="phone"
          required
          type="tel"
        />
      </div>

      <div>
        <label className="text-text/40 mb-3 block text-base leading-[132%] font-normal tracking-[-0.01em]" htmlFor="email">
          {t('email')}
        </label>
        <input
          className="text-text h-[76px] w-full rounded-[12px] bg-white px-4 py-[18px] text-base leading-[132%] font-normal tracking-[-0.01em] outline-none"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div className="md:col-span-2">
        <label
          className="text-text/40 mb-3 block text-base leading-[132%] font-normal tracking-[-0.01em]"
          htmlFor="message"
        >
          {t('message')}
        </label>
        <textarea
          className="text-text h-[214px] w-full resize-none rounded-[12px] bg-white px-4 py-[18px] text-base leading-[132%] font-normal tracking-[-0.01em] outline-none"
          id="message"
          name="message"
        />
      </div>

      <div className="mt-2 flex items-start gap-3 md:col-span-2">
        <input
          checked={isAgreed}
          className="peer sr-only"
          id="consent"
          name="consent"
          onChange={(e) => setIsAgreed(e.target.checked)}
          type="checkbox"
        />
        <label className="flex cursor-pointer items-start gap-[9px]" htmlFor="consent">
          <div
            className={cn(
              'border-brand flex size-[21px] shrink-0 items-center justify-center rounded-[6px] border bg-white transition-colors',
            )}
          >
            {isAgreed && <div className="bg-brand size-[11px] rounded-[3px]" />}
          </div>

          <div className="text-text/40 max-w-[268px] text-base leading-[132%] font-normal tracking-[-0.01em] md:max-w-[622px]">
            {t.rich('agreement', {
              personal: (chunks) => (
                <span className="text-brand/60 underline">
                  <Link href="/privacy">{chunks}</Link>
                </span>
              ),
              privacy: (chunks) => (
                <span className="text-brand/60 underline">
                  <Link href="/privacy">{chunks}</Link>
                </span>
              ),
            })}
          </div>
        </label>
      </div>

      <div className="mt-2 md:col-span-2">
        <ActionTile
          className="w-[196px] md:h-[106px] md:w-[328px] xl:h-[75px] xl:w-[233px] 2xl:h-[106px] 2xl:w-[328px]"
          disabled={!isAgreed}
          icon={CircleRightArrowIcon}
          title={t('submit')}
          type="submit"
        />
      </div>
    </form>
  );
};
