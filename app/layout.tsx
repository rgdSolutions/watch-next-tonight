import './globals.css';
import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://watchnexttonight.com'),
  title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
  description:
    'Discover your next binge-worthy movie or TV show instantly. Get personalized recommendations based on your mood, genre preferences, and available streaming platforms.',
  keywords:
    'movie recommendations, TV show finder, streaming guide, Netflix, Prime Video, Disney+, Apple TV+, MAX, what to watch',
  authors: [{ name: "Ricardo D'Alessandro" }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
    description:
      'Discover your next binge-worthy movie or TV show instantly. Get personalized recommendations based on your preferences.',
    type: 'website',
    siteName: 'Watch Next Tonight',
    url: 'https://watchnexttonight.com',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Watch Next Tonight - Movie & TV Show Recommendations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
    description: 'Discover your next binge-worthy movie or TV show instantly.',
    images: ['/opengraph-image'],
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://watchnexttonight.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Watch Next Tonight',
    description:
      'Discover your next binge-worthy movie or TV show instantly. Get personalized recommendations based on your preferences.',
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
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Watch Next" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#7c3aed" />

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID} />
        )}

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

        {/* Google AdSense loader (loads once site-wide) */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            id="adsense-loader"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          />
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
