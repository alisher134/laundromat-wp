import type { MetadataRoute } from 'next';
import { LOCALES, SITE_CONFIG } from '@/shared/config/seo.config';

const ROUTES = ['', '/services', '/location', '/tips', '/faq', '/contact'] as const;

const ROUTE_CONFIG: Record<string, { changeFrequency: 'weekly' | 'monthly'; priority: number }> = {
  '': { changeFrequency: 'weekly', priority: 1 },
  default: { changeFrequency: 'monthly', priority: 0.8 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => {
      const config = ROUTE_CONFIG[route] ?? ROUTE_CONFIG.default;
      return {
        url: `${SITE_CONFIG.url}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      };
    }),
  );
}
