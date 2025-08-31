import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://watch-next-tonight.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/search', '/trending'],
        disallow: ['/api/', '/_next/', '/static/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/search', '/trending'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: ['/', '/search', '/trending'],
      },
      {
        userAgent: 'AdsBot-Google',
        allow: ['/', '/search', '/trending'],
      },
      {
        userAgent: 'AdsBot-Google-Mobile',
        allow: ['/', '/search', '/trending'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
