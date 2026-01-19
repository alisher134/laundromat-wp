import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/shared/config/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
