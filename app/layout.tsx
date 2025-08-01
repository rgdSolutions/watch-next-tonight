import './globals.css';
import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import Script from 'next/script';

import { QueryProvider } from '@/providers/query-provider';

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
      <head>
        {/* Google tag (gtag.js) */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
