import Image from 'next/image';
import { Link } from '@/shared/config/i18n';

interface Tip {
  number: number;
  title: string;
  description: string;
}

interface BonusTip {
  title: string;
  items: string[];
}

interface ArticleContentProps {
  introText: string;
  subtitle?: string;
  tips: Tip[];
  secondImage?: string;
  bonusTip?: BonusTip;
}

const parseLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const [, linkText, url] = match;
    parts.push(
      <Link
        className="text-text mb-6 text-lg leading-[168%] font-normal tracking-[-0.02em] underline md:mb-[46px] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:mb-[56px] 2xl:text-[26px] 2xl:leading-[160%]"
        href={url}
        key={match.index}
        rel="noopener noreferrer"
        target={url.startsWith('http') ? '_blank' : undefined}
      >
        {linkText}
      </Link>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export const ArticleContent = ({ introText, subtitle, tips, secondImage, bonusTip }: ArticleContentProps) => {
  return (
    <div className="w-full md:max-w-[670px] xl:max-w-[782px] 2xl:max-w-[967px]">
      <p className="text-text mb-[46px] text-2xl leading-[136%] font-normal tracking-[-0.02em] md:mb-16 md:text-4xl md:tracking-[-0.04em] xl:mb-[86px] xl:text-xl 2xl:mb-[72px] 2xl:text-[32px] 2xl:leading-[140%]">
        {introText}
      </p>

      {subtitle && (
        <h2 className="text-text mb-6 text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[46px] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:mb-[56px] 2xl:text-[28px]">
          {subtitle}
        </h2>
      )}

      <div className="mb-[86px] 2xl:mb-[120px]">
        {tips.map((tip) => (
          <div key={tip.number}>
            <h3 className="text-text mb-[18px] text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[18px] md:text-[21px] xl:mb-[28px] xl:text-2xl xl:leading-[156%] 2xl:mb-[28px] 2xl:text-[28px]">
              {tip.number}. {tip.title}
            </h3>
            <p className="text-text mb-[86px] text-lg leading-[168%] font-normal tracking-[-0.02em] md:mb-[56px] md:text-[21px] xl:mb-[86px] xl:text-2xl xl:leading-[156%] 2xl:mb-[86px] 2xl:text-[26px] 2xl:leading-[160%]">
              {parseLinks(tip.description)}
            </p>
          </div>
        ))}
      </div>

      {secondImage && (
        <div className="relative mb-[56px] h-[338px] w-full md:mb-[116px] md:h-[475px] xl:h-[475px] 2xl:mb-[48px] 2xl:h-[600px]">
          <Image
            alt="Laundry detergent"
            className="rounded-[6px] object-cover 2xl:rounded-[12px]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            src={secondImage}
          />
        </div>
      )}

      {bonusTip && (
        <div className="mb-16 space-y-4 2xl:mb-[96px]">
          <h3 className="text-text mb-[10px] text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[10px] md:text-[21px] xl:mb-[20px] xl:text-2xl xl:leading-[156%] 2xl:mb-7 2xl:text-[28px]">
            {bonusTip.title}
          </h3>
          <ul className="pl-6 2xl:pl-8">
            {bonusTip.items.map((item, index) => (
              <li
                className="text-text mb-[10px] list-disc text-lg leading-[168%] font-normal tracking-[-0.02em] md:mb-[10px] md:text-[21px] xl:mb-[20px] xl:text-2xl xl:leading-[156%] 2xl:mb-6 2xl:text-[26px] 2xl:leading-[160%]"
                key={index}
              >
                {parseLinks(item)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
