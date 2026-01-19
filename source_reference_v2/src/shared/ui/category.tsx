import { cn } from '@/shared/libs/cn';

interface CategoryProps {
  label?: string;
  category?: string;
  isActive?: boolean;
  activeCategory?: string;
  onClick?: (value: string) => void;
  className?: string;
  paddingClassName?: string;
  minWidthClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const Category = ({
  label,
  category,
  isActive,
  activeCategory,
  onClick,
  className,
  paddingClassName = 'px-4 py-3 md:px-6 md:py-4',
  minWidthClassName = 'min-w-fit',
  activeClassName = 'border-transparent bg-brand/6 text-brand',
  inactiveClassName = 'border-text/20 text-text',
}: CategoryProps) => {
  const value = label ?? category ?? '';
  const active = isActive ?? (activeCategory !== undefined && category !== undefined && activeCategory === category);

  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-[12px] border border-transparent text-base leading-[132%] font-normal tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 md:rounded-[16px] 2xl:text-lg',
        minWidthClassName,
        paddingClassName,
        active ? activeClassName : inactiveClassName,
        className,
      )}
      key={value}
      onClick={() => onClick?.(value)}
    >
      {value}
    </button>
  );
};
