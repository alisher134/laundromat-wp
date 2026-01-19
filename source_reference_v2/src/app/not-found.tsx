'use client';

import { motion, type Variants } from 'framer-motion';
import CircleRightArrowIcon from '@/shared/assets/icons/circle-right-arrow-icon.svg';
import { cn } from '@/shared/libs/cn';
import Link from 'next/link';

const titleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

const linkVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.5,
    },
  },
};

export default function GlobalNotFound() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-[url(/images/notfound-background.png)] bg-cover bg-center" />
      <div className="relative z-10 mx-4 mb-6 flex h-full items-end justify-end pb-6 text-white md:px-[18px] md:pb-6 xl:px-6 xl:pb-[41px] 2xl:px-[35px] 2xl:pb-[34px]">
        <div className="flex flex-col-reverse items-end gap-[28px] md:w-full md:justify-between md:gap-[46px] lg:flex-row">
          <motion.div animate="visible" initial="hidden" variants={linkVariants}>
            <Link
              className={cn(
                'border-text/20 flex min-h-[75px] w-full max-w-[196px] flex-1 flex-col rounded-[7px] border bg-white/23 pt-[14px] pr-[12px] pb-[12px] pl-4 backdrop-blur-2xl backdrop-filter md:min-h-[75px] md:max-w-[233px] xl:min-h-[75px] xl:max-w-[233px] 2xl:min-h-[106px] 2xl:max-w-[328px] 2xl:rounded-[10px] 2xl:border-0',
              )}
              href="/"
            >
              <p className="text-sm leading-[132%] font-medium tracking-[-0.01em] text-white 2xl:text-lg">
                Return to Homepage
              </p>

              <div className="mt-auto flex justify-end">
                <span className="bg-brand flex size-[17px] items-center justify-center rounded-[15px] 2xl:size-[22px]">
                  <CircleRightArrowIcon className="size-[6px] text-white 2xl:size-[10px]" />
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.h1
            animate="visible"
            className="m-0 p-0 text-[160px] leading-[70%] font-normal tracking-[-0.05em] text-white md:text-[320px] xl:text-[400px] 2xl:text-[600px]"
            initial="hidden"
            variants={titleVariants}
          >
            404
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
