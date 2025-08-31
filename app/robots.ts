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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
