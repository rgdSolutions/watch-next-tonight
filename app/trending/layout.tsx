import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trending Now | Watch Next Tonight',
  description:
    "Discover what's trending globally right now. See the hottest movies and TV shows everyone is watching across all streaming platforms.",
  keywords:
    'trending movies, trending TV shows, popular on Netflix, popular on Prime Video, what to watch now, global trending',
  openGraph: {
    title: 'Trending Now | Watch Next Tonight',
    description: "See what's hot globally right now across all streaming platforms",
    type: 'website',
    url: '/trending',
    images: [
      {
        url: '/trending/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Trending Now - Watch Next Tonight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trending Movies & Shows',
    description: 'Discover what everyone is watching right now',
    images: ['/trending/opengraph-image'],
  },
};

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
