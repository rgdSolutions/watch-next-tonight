import { Metadata } from 'next';

import { baseUrl } from '@/app/layout';

export const metadata: Metadata = {
  title: 'Trending Movies & TV Shows Today | Watch Next Tonight',
  description:
    "Instantly discover what's HOT globally. Real-time trending movies and shows that everyone is watching and talking about right now.",
  keywords:
    'trending movies today, popular TV shows now, global entertainment trends, viral streaming content, most watched Netflix, top Prime Video shows',
  alternates: {
    canonical: `${baseUrl}/trending`,
  },
  openGraph: {
    title: 'Global Trending Entertainment | Watch Next Tonight',
    description: "Real-time trending content that's taking the world by storm across all platforms",
    type: 'website',
    url: `${baseUrl}/trending`,
    images: [
      {
        url: `${baseUrl}/trending/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Global Trending Movies & TV Shows - Watch Next Tonight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'See What Everyone Is Watching NOW',
    description: 'Global trending movies & shows updated in real-time',
    images: [`${baseUrl}/trending/opengraph-image`],
  },
};

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
