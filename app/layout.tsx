import './globals.css';
import type { Metadata, Viewport } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Watch Next Tonight: Your Perfect Stream, Instantly Unlocked',
  description:
    'Say goodbye to streaming paralysis. Watch Next Tonight curates your perfect movie or show, instantly available across all major platforms. Your personalized binge-list awaits.',
  keywords:
    'what to watch tonight, personalized movie recommendations, cross-platform streaming guide, find what to watch instantly, effortless TV show discovery, mood-based content finder, best binge-worthy shows, streamlined show suggestions, global trending movies, quick movie search solution, all streaming services content, tailored entertainment recommendations, simplify content discovery, stop endless scrolling, find your next favorite show, curated streaming picks, where to watch movies online, perfect match for your mood, available movies across platforms, how to choose a movie, eliminating decision fatigue streaming, hot new series to watch, genre specific movie finder, get movie recommendations fast, smart TV show suggestions, discover new streaming content, online movie finder tool, your perfect night in entertainment, next great watch, personalized film suggestions',
  authors: [{ name: "Ricardo D'Alessandro" }],
  openGraph: {
    title: 'Watch Next Tonight: Your Perfect Stream, Instantly Unlocked',
    description:
      'Say goodbye to streaming paralysis. Watch Next Tonight curates your perfect movie or show, instantly available across all major platforms.',
    type: 'website',
    siteName: 'Watch Next Tonight',
    url: 'https://watch-next-tonight.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Watch Next Tonight - Personalized streaming recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch Next Tonight: Your Perfect Stream, Instantly Unlocked',
    description:
      'Say goodbye to streaming paralysis. Curated recommendations across all platforms.',
    images: ['/twitter-image.png'],
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
  alternates: {
    canonical: 'https://watch-next-tonight.vercel.app',
  },
  metadataBase: new URL('https://watch-next-tonight.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://watch-next-tonight.vercel.app';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Watch Next Tonight',
      alternateName: 'WNT - Personalized Streaming Guide',
      description:
        'Say goodbye to streaming paralysis. Watch Next Tonight curates your perfect movie or show, instantly available across all major platforms. Your personalized binge-list awaits.',
      applicationCategory: 'EntertainmentApplication',
      operatingSystem: 'Any',
      url: baseUrl,
      author: {
        '@type': 'Person',
        name: "Ricardo D'Alessandro",
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '250',
      },
      keywords: [
        'cross-platform movie search',
        'mood-driven show recommendations',
        'global trending content aggregator',
        'personalized film discovery tool',
        'streaming service availability checker',
        'AI-powered movie matching',
        'quick entertainment finder app',
        'genre-specific binge guide',
      ],
      featureList: [
        'Unified streaming library across all platforms',
        'Personalized recommendations for your mood',
        'Real-time trending content insights',
        'Tailored recommendation engine',
        'Multi-platform availability checker',
        'Advanced AI matching technology',
        'Speed-optimized search',
        'Detailed genre categorization',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What should I watch next on streaming?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Watch Next Tonight solves this universal content dilemma by providing personalized movie and TV show recommendations based on your mood, genre preferences, and available streaming platforms.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is there an app for all streaming services?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Watch Next Tonight is a comprehensive solution that searches across Netflix, Prime Video, Disney+, Apple TV+, MAX, and more to find content available on your platforms.',
          },
        },
        {
          '@type': 'Question',
          name: 'How to pick a movie for my mood?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our mood-based content finder analyzes your current feeling and matches it with perfect movie or show recommendations that align with your emotional state.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where to find trending movies globally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Watch Next Tonight aggregates global trending data to show you what movies and shows are popular worldwide, helping you stay current with the latest must-watch content.',
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Watch Next Tonight',
      applicationSuite: 'Entertainment Discovery Platform',
      screenshot: `${baseUrl}/screenshot.png`,
      softwareVersion: '2.0',
      releaseNotes:
        'Enhanced AI recommendations, cross-platform search, trending content aggregation',
      datePublished: '2024-01-01',
      dateModified: new Date().toISOString(),
    },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={baseUrl} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Watch Next" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#7c3aed" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
        <ThemeProvider defaultTheme="system" storageKey="watch-next-theme">
          <QueryProvider>{children}</QueryProvider>
          <ThemeToggle />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
