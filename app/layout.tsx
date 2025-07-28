import './globals.css';
import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
  description:
    'Discover your next binge-worthy movie or TV show instantly. Get personalized recommendations based on your mood, genre preferences, and available streaming platforms.',
  keywords:
    'movie recommendations, TV show finder, streaming guide, Netflix, Prime Video, Disney+, Apple TV+, MAX, what to watch',
  authors: [{ name: "Ricardo D'Alessandro" }],
  openGraph: {
    title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
    description:
      'Discover your next binge-worthy movie or TV show instantly. Get personalized recommendations based on your preferences.',
    type: 'website',
    siteName: 'Watch Next Tonight',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
    description: 'Discover your next binge-worthy movie or TV show instantly.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
