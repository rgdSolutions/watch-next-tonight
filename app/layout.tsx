import './globals.css';
import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Hanken_Grotesk, Unbounded } from 'next/font/google';
import Script from 'next/script';

import { NavigationHeader } from '@/components/navigation-header';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/providers/query-provider';

const hankenGrotesk = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://watchnexttonight.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Watch Next Tonight - Find Your Perfect Movie or Show',
    template: '%s | Watch Next Tonight',
  },
  description:
    'Find your next movie or TV show in under a minute. Free picks by genre, mood, and country, with trailers and where to watch. No account needed.',
  category: 'entertainment',
  keywords:
    'movie recommendations, TV show finder, streaming guide, Netflix, Prime Video, Disney+, Apple TV+, MAX, what to watch',
  authors: [{ name: "Ricardo D'Alessandro" }],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'Watch Next Tonight - Find Your Perfect Movie or Show',
    description:
      'Discover your next binge-worthy movie or TV show instantly. Get personalized recommendations based on your preferences.',
    type: 'website',
    siteName: 'Watch Next Tonight',
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
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
    images: [`${baseUrl}/opengraph-image`],
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
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [
    {
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
        url: `${baseUrl}/about`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: "Ricardo D'Alessandro",
      url: `${baseUrl}/about`,
      jobTitle: 'Full-Stack Developer',
      sameAs: ['https://github.com/rgdSolutions'],
      worksFor: {
        '@type': 'Organization',
        name: 'Watch Next Tonight',
        url: baseUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Watch Next Tonight',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Watch Next Tonight',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: `${baseUrl}/contact`,
      },
      sameAs: ['https://github.com/rgdSolutions/watch-next-tonight'],
    },
  ];

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Watch Next Tonight Blog"
          href="/rss.xml"
        />
        <link rel="apple-touch-icon" href="/apple-icon" />
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
      <body
        className={cn(
          hankenGrotesk.variable,
          unbounded.variable,
          'font-sans flex flex-col min-h-screen'
        )}
      >
        <ThemeProvider defaultTheme="dark" storageKey="watch-next-theme">
          <NavigationHeader />
          <QueryProvider>{children}</QueryProvider>
          <ThemeToggle />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
