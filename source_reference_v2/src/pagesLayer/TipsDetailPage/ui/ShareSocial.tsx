import FacebookIcon from '@/shared/assets/icons/facebook-icon.svg';
import LinkIcon from '@/shared/assets/icons/link-icon.svg';
import TelegramIcon from '@/shared/assets/icons/telegram-icon.svg';
import VkIcon from '@/shared/assets/icons/vk-icon.svg';

interface ShareSocialProps {
  url: string;
}

export const ShareSocial = ({ url }: ShareSocialProps) => {
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="xl:max-w-[144px]">
      <h3 className="text-text/60 mb-6 text-lg leading-[132%] font-normal tracking-[-0.01em]">Share</h3>
      <div className="flex flex-wrap items-center gap-[10px]">
        <a
          className="border-text/16 text-brand flex size-[67px] items-center justify-center rounded-[12px] border"
          href={`https://t.me/share/url?url=${encodedUrl}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <TelegramIcon className="h-[22px] w-[26px]" />
        </a>
        <a
          className="border-text/16 text-brand flex size-[67px] items-center justify-center rounded-[12px] border"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FacebookIcon className="size-[26px]" />
        </a>
        <a
          className="border-text/16 text-brand flex size-[67px] items-center justify-center rounded-[12px] border"
          href={`https://vk.com/share.php?url=${encodedUrl}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <VkIcon className="h-[20px] w-[31px]" />
        </a>
        <a
          className="border-text/16 text-brand flex size-[67px] items-center justify-center rounded-[12px] border"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkIcon className="size-[21px]" />
        </a>
      </div>
    </div>
  );
};
