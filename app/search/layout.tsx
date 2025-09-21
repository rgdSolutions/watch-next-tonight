import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Movies & TV Shows | Watch Next Tonight',
  description:
    'Find personalized movie and TV show recommendations based on your location, favorite genres, and viewing preferences across all streaming platforms.',
  keywords:
    'movie search, TV show finder, personalized recommendations, streaming search, Netflix search, Prime Video search, Disney+ search',
  alternates: {
    canonical: 'https://watchnexttonight.com/search/',
  },
  openGraph: {
    title: 'Search Movies & TV Shows | Watch Next Tonight',
    description: 'Get personalized recommendations across all your streaming platforms',
    type: 'website',
    url: '/search',
    images: [
      {
        url: '/search/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Search Movies & TV Shows - Watch Next Tonight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Movies & TV Shows',
    description: 'Find your perfect watch based on your preferences',
    images: ['/search/opengraph-image'],
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
