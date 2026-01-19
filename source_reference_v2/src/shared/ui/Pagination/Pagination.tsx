import { cn } from '@/shared/libs/cn';
import { getPageItems } from '@/shared/ui/Pagination/model/config';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination = ({ current, total, onChange, siblingCount = 1, className }: PaginationProps) => {
  const items = getPageItems(current, total, siblingCount);
  const containerClass = 'flex items-center';
  const base =
    'flex cursor-pointer items-center border border-transparent justify-center md:rounded-[8px] 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] text-[#414242]/40 transition-colors md:h-[35px] md:w-[42px] 2xl:w-[56px] 2xl:h-[48px]';
  const active = 'border-[#414242]/25 text-[#414242] md:size-[52px] 2xl:h-[54px] 2xl:w-[56px]';
  const inactive = 'border-transparent hover:text-[#414242]/60 2xl:w-[47px] 2xl:h-[56px] md:h-[42px] md:w-[35px]';

  return (
    <div className={cn(containerClass, className)}>
      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span className={cn(base, inactive)} key={`ellipsis-${index}`}>
            …
          </span>
        ) : (
          <button className={cn(base, item === current ? active : inactive)} key={item} onClick={() => onChange(item)}>
            {item}
          </button>
        ),
      )}
    </div>
  );
};
