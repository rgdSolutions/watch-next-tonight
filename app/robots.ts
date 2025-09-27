import { MetadataRoute } from 'next';

import { baseUrl } from '@/app/layout';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/api/',
          '/search',
          '/trending',
          '/privacy',
          '/terms',
          '/_next/',
          '/static/',
          '/out/',
        ],
        disallow: [
          '/__tests__/',
          '/coverage/',
          '/node_modules/',
          '/tests/',
          '/docs/',
          '*.test.*',
          '*.spec.*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
