'use client';

import { ContentDisplayWithQuery } from '@/components/content-display-with-query';
import { Header } from '@/components/header';

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        <Header />
        <ContentDisplayWithQuery />
      </div>
    </div>
  );
}
