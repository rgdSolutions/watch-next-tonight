import { MetadataRoute } from 'next';

import { baseUrl } from '@/app/layout';
import { getBlogPosts } from '@/lib/blog';

// Bump when static page content meaningfully changes; a per-deploy timestamp
// teaches crawlers to ignore the field.
const staticPagesLastModified = new Date('2026-06-11');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = await getBlogPosts();

  // Create blog post entries
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.updatedAt || post.metadata.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticPagesLastModified,
      changeFrequency: 'weekly',
      priority: 0.3,
    },
  ];

  // Combine static pages and blog posts
  return [...staticPages, ...blogPosts];
}
