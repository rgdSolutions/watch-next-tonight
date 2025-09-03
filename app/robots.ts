import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://watchnexttonight.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/', '/search', '/trending', '/_next/', '/static/'],
        disallow: [
          '/__tests__/',
          '/coverage/',
          '/out/',
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
