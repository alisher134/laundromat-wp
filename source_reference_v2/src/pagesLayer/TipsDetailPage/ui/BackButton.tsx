import ArrowLeftIcon from '@/shared/assets/icons/arrow-left-icon.svg';

interface BackButtonProps {
  onClick: () => void;
  label: string;
}

export const BackButton = ({ onClick, label }: BackButtonProps) => {
  return (
    <button
      className="text-text/50 mb-[23px] flex cursor-pointer items-center gap-[12px] md:mb-[30px] xl:mb-8 2xl:mb-[43px] 2xl:gap-4"
      onClick={onClick}
    >
      <span className="flex size-[26px] items-center justify-center rounded-[6px] bg-[#3A6D90]/8 text-sm leading-[132%] tracking-[-0.01em] 2xl:size-9 2xl:text-lg">
        <ArrowLeftIcon className="text-brand size-[6px] 2xl:size-[8px]" />
      </span>
      {label}
    </button>
  );
};
