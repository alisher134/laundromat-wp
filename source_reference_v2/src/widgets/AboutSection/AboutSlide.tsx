import { cn } from '@/shared/libs/cn';
import { IconComponent } from '@/shared/types/common';

interface AboutSlideItem {
  key: string;
  icon: IconComponent;
  title: string;
  subtitle: string;
  description: string;
}

interface AboutSlideProps {
  item: AboutSlideItem;
  className?: string;
}

export const AboutSlide = ({ item, className }: AboutSlideProps) => {
  const Icon = item.icon;

  return (
    <article
      className={cn(
        'bg-brand-bg/10 relative min-w-[293px] rounded-[16px] px-[20px] pt-[20px] pb-[30px] backdrop-blur-[60px] backdrop-filter md:h-[295px] md:min-w-[546px] md:p-[28px] xl:min-w-[625px] 2xl:h-[414px] 2xl:min-w-[878px] 2xl:pt-[40px] 2xl:pb-9 2xl:pl-[42px]',
        'md:flex md:gap-[46px] xl:gap-[112px] 2xl:gap-[151px]',
        className,
      )}
    >
      <div className="md:flex md:h-full md:flex-col-reverse md:justify-between">
        <span className="border-text/16 mt-auto flex size-[50px] items-center justify-center rounded-[14px] border md:size-[57px] md:rounded-[19px] 2xl:size-[80px] 2xl:rounded-[26px]">
          <Icon className="text-brand size-[22px] 2xl:size-9" />
        </span>

        <h3 className="text-text hidden text-[42px] leading-[110%] font-normal tracking-[-0.04em] md:block md:max-w-[144px] 2xl:max-w-[203px] 2xl:text-[64px]">
          {item.title}
        </h3>
      </div>

      <span className="bg-brand absolute top-5 right-5 h-[6px] w-[6px] rounded-full" role="presentation" />

      <div className="md:border-l-text/20 md:flex md:h-full md:flex-col md:justify-end md:border-l md:pl-[32px] 2xl:pl-[48px]">
        <h3 className="paragraph-heading-md mt-[74px] mb-[20px] block md:hidden">{item.title}</h3>

        <div className="bg-text/20 block h-px w-full md:hidden" />

        <p className="text-text mt-[22px] mb-3 max-w-[214px] text-lg leading-[124%] font-normal tracking-[-0.01em] md:mb-[33px] md:text-[19px] md:leading-[124%] md:tracking-[-0.04em] 2xl:mb-[46px] 2xl:max-w-[302px] 2xl:text-[28px]">
          {item.subtitle}
        </p>
        <p className="paragraph-subtle paragraph-sm-default max-w-[192px] 2xl:max-w-[271px] 2xl:text-base">
          {item.description}
        </p>
      </div>
    </article>
  );
};
