import ArrowLeftIcon from '@/shared/assets/icons/arrow-left-icon.svg';
import ArrowRightIcon from '@/shared/assets/icons/arrow-right-icon.svg';
import { cn } from '@/shared/libs/cn';

interface SliderButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  isFirstSlide?: boolean;
  isLastSlide?: boolean;
  className?: string;
}

export const SliderButtons = ({ onPrev, onNext, isFirstSlide, isLastSlide, className }: SliderButtonsProps) => {
  return (
    <div aria-label="Slider navigation" className={cn('flex items-center gap-[8px]', className)} role="group">
      <button
        aria-disabled={isFirstSlide}
        aria-label="Previous slide"
        className={cn(
          'border-brand group hover:bg-brand focus-brand flex size-[40px] cursor-pointer items-center justify-center rounded-[8px] border transition-colors duration-200 disabled:pointer-events-none',
          isFirstSlide && 'opacity-40',
        )}
        disabled={isFirstSlide}
        onClick={onPrev}
        type="button"
      >
        <ArrowLeftIcon
          aria-hidden="true"
          className={cn('text-brand size-[10px] group-hover:text-white', isFirstSlide && 'opacity-40')}
        />
      </button>
      <button
        aria-disabled={isLastSlide}
        aria-label="Next slide"
        className={cn(
          'border-brand group hover:bg-brand focus-brand flex size-[40px] cursor-pointer items-center justify-center rounded-[8px] border transition-colors duration-200 disabled:pointer-events-none',
          isLastSlide && 'opacity-40',
        )}
        disabled={isLastSlide}
        onClick={onNext}
        type="button"
      >
        <ArrowRightIcon
          aria-hidden="true"
          className={cn('text-brand size-[10px] group-hover:text-white', isLastSlide && 'opacity-40')}
        />
      </button>
    </div>
  );
};
