import type { Metadata } from 'next';

import { Home, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Watch Next Tonight',
  description:
    "The page you're looking for couldn't be found. Let's get you back to finding great content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Error Code */}
        <h1 className="mb-4 text-8xl font-bold text-primary">404</h1>

        {/* Main Error Message */}
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mb-8 text-lg text-muted-foreground">
          Oops! The page you&apos;re looking for seems to have gone off-script. Let&apos;s get you
          back to finding something great to watch.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <Link
            href="/search/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Search className="h-4 w-4" />
            Find Something to Watch
          </Link>

          <Link
            href="/trending/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <TrendingUp className="h-4 w-4" />
            See What&apos;s Trending
          </Link>
        </div>
      </div>
    </main>
  );
}
