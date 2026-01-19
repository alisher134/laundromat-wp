import { Link } from '@/shared/config/i18n';
import type { ComponentType, SVGProps, MouseEventHandler } from 'react';

import { cn } from '@/shared/libs/cn';

interface ActionTileProps {
  title: string;
  disabled?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: 'default' | 'small';
  className?: string;
  type?: 'button' | 'submit';
}

const baseTileClasses = (size: 'default' | 'small') =>
  cn(
    'flex flex-1 flex-col rounded-[7px] 2xl:rounded-[10px] border border-text/20 pt-[14px] 2xl:pt-[18px] 2xl:pl-5 2xl:pb-[14px] 2xl:pr-[14px] pr-3 pb-3 pl-4 transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
    size === 'default' &&
      'min-h-[75px] min-w-[196px] max-w-[196px] md:min-h-[106px] md:min-w-[328px] md:max-w-[328px] xl:min-h-[75px] xl:min-w-[233px] xl:max-w-[233px] 2xl:min-h-[106px] 2xl:min-w-[328px] 2xl:max-w-[328px]',
    size === 'small' &&
      'min-h-[75px] min-w-[196px] max-w-[196px] md:min-h-[75px] md:min-w-[233px] md:max-w-[233px] xl:min-h-[75px] xl:min-w-[233px] xl:max-w-[233px] 2xl:min-h-[106px] 2xl:min-w-[328px] 2xl:max-w-[328px]',
  );

export const ActionTile = ({
  title,
  disabled = false,
  icon: Icon,
  href,
  onClick,
  size = 'default',
  className,
  type = 'button',
}: ActionTileProps) => {
  const content = (
    <>
      <p
        className={cn(
          'text-text text-sm leading-[132%] font-medium tracking-[-0.01em] 2xl:text-lg',
          disabled && 'text-text/40',
        )}
      >
        {title}
      </p>

      <div className="mt-auto flex justify-end">
        <span
          className={cn(
            'bg-brand flex size-[17px] items-center justify-center rounded-full 2xl:size-[22px]',
            disabled && 'opacity-50',
          )}
        >
          <Icon aria-hidden className="size-[6px] text-white 2xl:size-[8px]" />
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link className={cn(baseTileClasses(size), 'cursor-pointer', className)} href={href}>
        {content}
      </Link>
    );
  }

  if (onClick || type === 'submit') {
    return (
      <button
        className={cn(
          baseTileClasses(size),
          'cursor-pointer text-left',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {content}
      </button>
    );
  }

  return <div className={cn(baseTileClasses(size), className)}>{content}</div>;
};
