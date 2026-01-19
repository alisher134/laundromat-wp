import ArrowDownIcon from '@/shared/assets/icons/arrow-down-icon.svg';
import Image from 'next/image';
import { cn } from '@/shared/libs/cn';
import { Link } from '@/shared/config/i18n';

interface TipSlideItem {
  key?: string;
  category: string;
  title: string;
  date: string;
  image?: string;
}

interface TipsSlideProps {
  item: TipSlideItem;
  className?: string;
}

export const TipsSlide = ({ item, className }: TipsSlideProps) => {
  return (
    <article className={cn('min-h-[418px] max-w-[324px] shrink-0 md:min-h-[386px] md:max-w-[379px]', className)}>
      <div className="flex h-full w-full flex-1 flex-col rounded-[16px] bg-white p-[20px]">
        <div className="flex justify-end">
          <div className="relative mb-[47px] h-[87px] w-[127px] md:mb-[35px] md:h-[99px] md:w-[149px]">
            {item.image && (
              <Image
                alt={item.title}
                className="rounded-[6px] object-cover"
                fill
                sizes="(max-width: 768px) 145px, 99px"
                src={item.image}
              />
            )}
          </div>
        </div>

        <div className="border-brand/40 text-brand mb-9 flex h-[33px] w-[123px] items-center justify-center rounded-[9px] border px-3 py-1 text-xs leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
          {item.category}
        </div>

        <p className="text-text mb-[50px] line-clamp-3 max-w-[284px] text-lg leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
          {item.title}
        </p>

        <Link className="mt-auto flex items-center justify-between" href={`/tips/${item.key || item.title}`}>
          <p className="text-text/60 paragraph-sm-default">{item.date}</p>

          <span className="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px]">
            <ArrowDownIcon aria-hidden="true" className="text-brand h-[7px] w-[8px]" />
          </span>
        </Link>
      </div>
    </article>
  );
};
