import { MetadataRoute } from 'next';

import { baseUrl } from '@/app/layout';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
