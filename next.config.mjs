import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // SEO Optimizations
  trailingSlash: false, // Ensures URL consistency for better SEO

  // Production build optimizations
  productionBrowserSourceMaps: false, // Smaller bundle sizes

  // Permanent redirects for blog posts consolidated into their canonical
  // articles (thin/duplicate content cleanup, June 2026).
  async redirects() {
    const mergedSlugs = {
      'streaming-search-why-endless': 'decision-fatigue-streaming-overwhelm',
      'effortless-discovery-one-viewers': 'decision-fatigue-streaming-overwhelm',
      'content-overload-how-to': 'decision-fatigue-streaming-overwhelm',
      'effortless-discovery-reclaim-your': 'decision-fatigue-streaming-overwhelm',
      'streaming-overload-navigating-the': 'decision-fatigue-streaming-overwhelm',
      'quick-entertainment-choices-finding': 'decision-fatigue-streaming-overwhelm',
      'effortless-discovery-the-magic': 'decision-fatigue-streaming-overwhelm',
      'searching-less-defeating-decision': 'decision-fatigue-streaming-overwhelm',
      'streaming-fatigue-solution-watch': 'decision-fatigue-streaming-overwhelm',
      'entertainment-evolution-how-personalized': 'personalized-recommendations-decoding-your',
      'personalized-recommendations-the-magic': 'personalized-recommendations-decoding-your',
      'perfect-match-algorithm-how': 'personalized-recommendations-decoding-your',
      'personalized-recommendations-watch-next': 'personalized-recommendations-decoding-your',
      'trending-now-discover-global': 'trending-now-how-global',
      'trending-insights-staying-current': 'trending-now-how-global',
      'next-big-show-foreseeing': 'trending-now-how-global',
      'trending-now-watch-next': 'trending-now-how-global',
      'mood-matched-content-aligning-your': 'mood-driven-viewing-psychological',
      'mood-driven-choices-watch-next': 'mood-driven-viewing-psychological',
      'perfect-group-viewing-elevating': 'group-viewing-harmony-finding',
      'curated-watchlists-elevating-your': 'personalized-watchlists-crafting-your',
      'cross-platform-streaming-watch': 'streaming-subscriptions-maximize-your',
      'available-content-maximizing-your': 'streaming-subscriptions-maximize-your',
      'cross-platform-discovery-watch-next': 'streaming-subscriptions-maximize-your',
      'binge-worthy-shows-unpacking-the': 'binge-watching-smarter-essential',
      'genre-exploration-unlocking-new': 'genre-blending-unlock-unexpected',
      'watch-next-tonight-your': 'watch-next-tonight-instantly',
      'watch-next-tonight-real': 'watch-next-tonight-instantly',
      'watch-next-tonight-solution': 'watch-next-tonight-instantly',
    };

    return Object.entries(mergedSlugs).map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },

  // SEO Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: ['remark-frontmatter'],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
