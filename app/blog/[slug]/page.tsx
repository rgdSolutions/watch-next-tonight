import Image from 'next/image';
import { notFound } from 'next/navigation';

import { baseUrl } from '@/app/layout';
import { getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

/**
 * Generate route metadata for a blog post identified by its slug.
 *
 * @param params - A promise resolving to route params containing `slug`
 * @returns Metadata for the blog post (title, description, keywords, alternates, `openGraph`, and `twitter` objects); returns an empty object if no matching post is found.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {};
  }

  const {
    title,
    publishedAt: publishedTime,
    summary,
    meta_description,
    keywords,
    image,
  } = post.metadata;

  return {
    title,
    description: meta_description || summary,
    keywords: keywords || [],
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title,
      description: meta_description || summary,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${slug}`,
      images: [
        {
          url: image || '/og-image.png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta_description || summary,
      images: [image || '/og-image.png'],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{post.metadata.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          {post.metadata.publishedAt && (
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          )}
          {post.metadata.author && <span>by {post.metadata.author}</span>}
        </div>
        {post.metadata.image && (
          <div className="relative w-full aspect-square mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <post.content />
      </div>
    </article>
  );
}