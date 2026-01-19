import { cn } from '@/shared/libs/cn';
import Image from 'next/image';

interface Category {
  key: string;
  label: string;
}

interface ArticleHeaderProps {
  title: string;
  mainImage: string;
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (key: string) => void;
}

export const ArticleHeader = ({ title, mainImage, categories, activeCategory, onCategoryClick }: ArticleHeaderProps) => {
  return (
    <div className="mb-8 md:mb-[86px] xl:mb-[78px] 2xl:mb-[116px]">
      <div className="mb-8 md:mb-9 xl:mb-[46px] xl:flex xl:items-end xl:justify-between 2xl:mb-[56px]">
        <h1 className="paragraph-heading-md text-text mb-8 max-w-[328px] md:mb-9 md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:mb-0 xl:max-w-[614px] xl:text-[45px] 2xl:max-w-[1012px] 2xl:text-[64px]">
          {title}
        </h1>

        <div className="flex items-center gap-[6px]">
          {categories.map(({ key, label }) => (
            <button
              className={cn(
                'border-text/20 text-text rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em]',
                activeCategory === key && 'text-brand border-[#3A6D90]/40',
              )}
              key={key}
              onClick={() => onCategoryClick(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[380px] w-full md:h-[380px] xl:h-[560px] 2xl:h-[910px]">
        <Image
          alt={title}
          className="rounded-[6px] object-cover"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          src={mainImage}
        />
      </div>
    </div>
  );
};
