import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personalized Movie & TV Recommendations | Watch Next Tonight',
  description:
    'Get custom movie and TV suggestions tailored to YOUR taste. Select genres, location, and content recency for perfectly matched streaming recommendations.',
  keywords:
    'personalized movie recommendations, custom TV show finder, genre preferences, tailored streaming content, location-based suggestions, mood-based movies',
  alternates: {
    canonical: 'https://watchnexttonight.com/search/',
  },
  openGraph: {
    title: 'Personalized Streaming Recommendations | Watch Next Tonight',
    description:
      'Customize your entertainment with AI-powered recommendations tailored to your unique preferences',
    type: 'website',
    url: '/search/',
    images: [
      {
        url: '/search/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Personalized Movie & TV Recommendations - Watch Next Tonight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Personalized Movie & TV Recommendations',
    description: 'Custom suggestions based on YOUR genres, location, and viewing preferences',
    images: ['/search/opengraph-image'],
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
