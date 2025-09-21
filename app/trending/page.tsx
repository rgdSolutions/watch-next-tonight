'use client';

import { ContentDisplayWithQuery } from '@/components/content-display-with-query';
import { Header } from '@/components/header';

export default function TrendingPage() {
  return (
    <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        <Header />
        <div className="hidden sm:block mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Global Trending Entertainment</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what millions are watching right now. Real-time trending movies and TV shows
            from around the world, updated hourly.
          </p>
        </div>
        <ContentDisplayWithQuery />
      </div>
    </div>
  );
}
