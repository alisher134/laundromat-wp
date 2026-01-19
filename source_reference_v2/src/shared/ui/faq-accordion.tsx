import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import PlusIcon from '@/shared/assets/icons/plus-icon.svg';
import { cn } from '@/shared/libs/cn';

export interface FaqSection {
  position: number;
  title: string;
  content: string;
  category?: string;
}

type FaqAccordionProps = {
  sections: FaqSection[];
  className?: string;
  isBig?: boolean;
};

const formatIndex = (index: number) => index.toString().padStart(2, '0');

export const FaqAccordion = ({ sections, className, isBig }: FaqAccordionProps) => {
  return (
    <Accordion
      className={cn('mb-[46px] space-y-4 md:w-full xl:w-[785px] 2xl:w-[1100px]', className)}
      collapsible
      type="single"
    >
      {sections.map(({ position, title, content }) => (
        <AccordionItem
          className="overflow-hidden rounded-[11px] bg-white backdrop-blur-[30px] md:rounded-[16px] xl:rounded-[11px] 2xl:rounded-[16px]"
          key={position}
          value={position.toString()}
        >
          <AccordionTrigger className="group flex cursor-pointer items-center justify-between pt-4 pr-3 pb-[17px] pl-4 text-left md:pt-[33px] md:pr-9 md:pb-9 md:pl-6 xl:pt-6 xl:pr-6 xl:pb-[25px] xl:pl-[22px] 2xl:pt-[33px] 2xl:pr-9 2xl:pb-9 2xl:pl-8 [&>svg]:hidden">
            <div className="flex w-full items-center justify-between">
              <div
                className={cn(
                  'flex items-start md:gap-[54px] xl:gap-[104px] 2xl:gap-[143px]',
                  isBig && 'md:gap-[58px] xl:gap-[143px] 2xl:gap-[200px]',
                )}
              >
                <span className="text-brand/70 hidden leading-[132%] font-normal tracking-[-0.01em] md:block md:text-lg xl:text-sm 2xl:text-lg">
                  ( {formatIndex(position)} )
                </span>

                <span className="text-text max-w-[230px] text-base leading-[132%] font-normal tracking-[-0.02em] md:max-w-[448px] md:text-[21px] xl:text-base 2xl:max-w-[545px] 2xl:text-[21px]">
                  {title}
                </span>
              </div>

              <span className="bg-brand/10 text-brand flex h-[40px] w-[40px] items-center justify-center rounded-[9px] transition-all duration-300 group-data-[state=open]:bg-brand/20 md:size-[55px] md:rounded-[12px] xl:size-[40px] 2xl:size-[55px] 2xl:rounded-[12px]">
                <PlusIcon className="h-[10px] w-[10px] transition-transform duration-300 group-data-[state=open]:rotate-45 md:h-[12px] md:w-[12px] xl:h-[10px] xl:w-[10px] 2xl:h-[12px] 2xl:w-[12px]" />
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="text-text px-5 pb-5 text-base leading-[150%] font-normal tracking-[-0.01em]">
            {content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
