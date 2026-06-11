import Image from 'next/image';
import { notFound } from 'next/navigation';

import { baseUrl } from '@/app/layout';
import { Breadcrumb } from '@/components/breadcrumb';
import { getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

// Social cards need a 1.91:1 image; covers are square, so each post has a
// pre-cropped 1200x630 variant generated under /images/blog/og/.
function getOgImage(image: string) {
  if (image.startsWith('/images/blog/')) {
    return image.replace('/images/blog/', '/images/blog/og/');
  }
  return image;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
    updatedAt,
    summary,
    meta_description,
    keywords,
    image,
  } = post.metadata;

  const ogImage = getOgImage(image);

  return {
    title,
    description: meta_description || summary,
    keywords: keywords || [],
    authors: [{ name: post.metadata.author }],
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title,
      description: meta_description || summary,
      type: 'article',
      publishedTime,
      modifiedTime: updatedAt || publishedTime,
      authors: [post.metadata.author],
      url: `${baseUrl}/blog/${slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta_description || summary,
      images: [ogImage],
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    description: post.metadata.meta_description || post.metadata.summary,
    image: `${baseUrl}${getOgImage(post.metadata.image)}`,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.updatedAt || post.metadata.publishedAt,
    author: {
      '@type': 'Person',
      name: post.metadata.author,
      url: `${baseUrl}/about`,
      sameAs: ['https://github.com/rgdSolutions'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Watch Next Tonight',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`,
    },
  };

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.metadata.title },
        ]}
      />
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{post.metadata.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          {post.metadata.publishedAt && (
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          )}
          {post.metadata.updatedAt && (
            <span>
              Updated{' '}
              <time dateTime={post.metadata.updatedAt}>{formatDate(post.metadata.updatedAt)}</time>
            </span>
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
