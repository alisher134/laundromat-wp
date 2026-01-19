'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ActionTile } from '@/shared/ui/action-tile';
import { FaqAccordion } from '@/shared/ui/faq-accordion';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { useTranslations } from 'next-intl';
import { FAQ_KEYS } from '@/widgets/FaqsSection/config';

const SPRING_CONFIG = { stiffness: 35, damping: 20, mass: 1.2 };

export const FaqsSection = () => {
  const t = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.5'],
  });

  const smoothProgress = useSpring(scrollYProgress, SPRING_CONFIG);
  const y = useTransform(smoothProgress, [0, 0.7], [220, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [0.3, 1]);

  const sections = FAQ_KEYS.map((key, index) => ({
    position: index + 1,
    title: t(`questions.${key}.question`),
    content: t(`questions.${key}.answer`),
  }));

  return (
    <motion.section
      className="container-responsive mt-[120px] md:mt-[164px] xl:mt-[200px]"
      ref={sectionRef}
      style={{ y, opacity }}
    >
      <h2 className="heading-section mb-8">{t('title')}</h2>

      <div className="bg-text/16 hidden h-px w-full md:mb-4 md:block xl:mb-6 2xl:mb-10" />

      <div className="w-full lg:flex lg:flex-row-reverse lg:items-start lg:justify-between lg:gap-8">
        <FaqAccordion sections={sections} />

        <ActionTile href="/faq" icon={CircleRightArrowIcon} size="small" title={t('allQuestions')} />
      </div>
    </motion.section>
  );
};
