import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { baseUrl } from '@/app/layout';
import { type BlogPost, getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Watch Next Tonight',
  description: 'Read our latest articles about movies, TV shows, and streaming recommendations',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

// Revalidate blog listing page every hour
export const revalidate = 3600;

export default async function BlogPage() {
  const posts: BlogPost[] = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Discover insights, recommendations, and behind-the-scenes stories
      </p>

      <div className="space-y-8">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="border-b pb-8">
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                {post.metadata.image && (
                  <Link href={`/blog/${post.slug}`} className="group">
                    <div className="relative w-[300px] h-[300px] aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={post.metadata.image}
                        alt={post.metadata.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}
                <div className="flex flex-col justify-center">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.metadata.title}
                    </h2>
                  </Link>
                  {post.metadata.publishedAt && (
                    <time className="text-sm text-muted-foreground">
                      {new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.metadata.summary && (
                    <p className="mt-3 text-muted-foreground">{post.metadata.summary}</p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
