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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trending Movies & Shows',
    description: 'Discover what everyone is watching right now',
  },
  alternates: {
    canonical: '/trending',
  },
};
