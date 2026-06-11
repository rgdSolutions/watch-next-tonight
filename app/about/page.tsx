import type { Metadata } from 'next';

import { Code, Film, Globe, Shield, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { baseUrl } from '@/app/layout';
import { Breadcrumb } from '@/components/breadcrumb';
import { Ricardo } from '@/components/ricardo';
import { ScrollToTop } from '@/components/scroll-to-top';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Watch Next Tonight is a free movie and TV recommendation tool: real TMDB data, no account, no tracking. Learn how it works and who built it.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About Watch Next Tonight - Your Personalized Streaming Guide',
    description:
      'Discover how Watch Next Tonight helps you find the perfect content across Netflix, Prime Video, Disney+, and more.',
    url: `${baseUrl}/about`,
  },
};

// Static page - no revalidation needed
export const revalidate = false;

export default function AboutPage() {
  const features = [
    {
      icon: Globe,
      title: 'Global Content Access',
      description:
        'Access recommendations for content available in your region across all major streaming platforms.',
    },
    {
      icon: Star,
      title: 'Personalized Recommendations',
      description:
        'Get movie and TV show suggestions tailored to your unique preferences and viewing mood.',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Trends',
      description:
        "Stay updated with what's trending globally and discover the hottest new releases.",
    },
    {
      icon: Shield,
      title: 'Privacy-First Approach',
      description: 'We respect your privacy. No account required, no personal data stored.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Movies & Shows' },
    { number: '8+', label: 'Streaming Platforms' },
    { number: '100+', label: 'Countries Supported' },
    { number: '100%', label: 'Free, No Account' },
  ];

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
          About Watch Next Tonight
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A free, no-account-needed way to find your next movie or TV show across your streaming
          platforms.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-6">Our Mission</h2>
        <div className="prose prose-lg text-muted-foreground max-w-none">
          <p className="mb-4">
            In a world with endless streaming options, finding something to watch shouldn&apos;t be
            overwhelming. Watch Next Tonight was created to solve the paradox of choice that
            millions face every evening.
          </p>
          <p className="mb-4">
            We believe that everyone deserves personalized entertainment recommendations without
            compromising their privacy or dealing with opaque algorithms. The tool pairs live data
            from The Movie Database with a simple, intuitive interface to deliver instant, relevant
            suggestions tailored to your mood and preferences.
          </p>
          <p>
            Whether you&apos;re looking for a thrilling action movie, a heartwarming comedy, or a
            binge-worthy series, we&apos;re here to help you discover your next favorite watch in
            seconds, not minutes.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="glass-panel p-6 space-y-2">
              <div className="font-display text-3xl md:text-4xl font-bold aurora-text">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8">Why Choose Watch Next Tonight?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass-panel flex gap-4 p-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full aurora-bg flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-2">Choose Your Path</h3>
              <p className="text-muted-foreground">
                Select either personalized search for tailored recommendations or trending to see
                what&apos;s popular globally.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full aurora-bg flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-2">Set Your Preferences</h3>
              <p className="text-muted-foreground">
                For personalized results, tell us your location, favorite genres, and whether you
                want new or classic content.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full aurora-bg flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-2">Get Instant Recommendations</h3>
              <p className="text-muted-foreground">
                Receive curated suggestions with ratings, trailers, and the streaming services that
                carry each title in your region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8">About the Creator</h2>
        <div className="glass-panel p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Code className="w-12 h-12 text-primary" />
              </div>
            </div>
            <Ricardo />
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-bold mb-8">Our Technology</h2>
        <div className="prose prose-lg text-muted-foreground max-w-none">
          <p className="mb-4">
            Watch Next Tonight is built with modern web technologies to keep it fast and reliable:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Next.js 15</strong> - For lightning-fast performance and SEO optimization
            </li>
            <li>
              <strong>TMDB API</strong> - Access to comprehensive movie and TV show data
            </li>
            <li>
              <strong>React Query</strong> - Intelligent data caching and synchronization
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe code for reliability and maintainability
            </li>
            <li>
              <strong>Tailwind CSS</strong> - Beautiful, responsive design across all devices
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 border-t border-keyline">
        <h2 className="font-display text-2xl font-bold mb-4">Ready to Find Your Next Watch?</h2>
        <p className="text-muted-foreground mb-8">
          Your first set of picks takes about a minute, and you don&apos;t need an account.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-full aurora-bg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            <Film className="h-4 w-4" />
            Start Personalized Search
          </Link>
          <Link
            href="/trending"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-keyline-bright bg-secondary/40 px-6 py-3 text-sm font-medium transition-colors hover:bg-primary/10"
          >
            <TrendingUp className="h-4 w-4" />
            See What&apos;s Trending
          </Link>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}
