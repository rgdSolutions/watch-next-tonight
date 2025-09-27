import { Metadata } from 'next';

import { baseUrl } from '@/app/layout';

export const metadata: Metadata = {
  title: 'Personalized Movie & TV Recommendations | Watch Next Tonight',
  description:
    'Get custom movie and TV suggestions tailored to YOUR taste. Select genres, location, and content recency for perfectly matched streaming recommendations.',
  keywords:
    'personalized movie recommendations, custom TV show finder, genre preferences, tailored streaming content, location-based suggestions, mood-based movies',
  alternates: {
    canonical: `${baseUrl}/search/`,
  },
  openGraph: {
    title: 'Personalized Streaming Recommendations | Watch Next Tonight',
    description:
      'Customize your entertainment with AI-powered recommendations tailored to your unique preferences',
    type: 'website',
    url: `${baseUrl}/search/`,
    images: [
      {
        url: `${baseUrl}/search/opengraph-image`,
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
    images: [`${baseUrl}/search/opengraph-image`],
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
