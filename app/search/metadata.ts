import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Movies & TV Shows | Watch Next Tonight',
  description:
    'Find personalized movie and TV show recommendations based on your location, favorite genres, and viewing preferences across all streaming platforms.',
  keywords:
    'movie search, TV show finder, personalized recommendations, streaming search, Netflix search, Prime Video search, Disney+ search',
  openGraph: {
    title: 'Search Movies & TV Shows | Watch Next Tonight',
    description: 'Get personalized recommendations across all your streaming platforms',
    type: 'website',
    url: '/search',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Movies & TV Shows',
    description: 'Find your perfect watch based on your preferences',
  },
  alternates: {
    canonical: '/search',
  },
};
