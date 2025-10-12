import type { Metadata } from 'next';

import { Code, Film, Globe, Shield, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { baseUrl } from '@/app/layout';
import { Breadcrumb } from '@/components/breadcrumb';
import { Ricardo } from '@/components/ricardo';
import { ScrollToTop } from '@/components/scroll-to-top';

export const metadata: Metadata = {
  title: 'About Watch Next Tonight - Your Personalized Streaming Guide',
  description:
    'Learn about Watch Next Tonight, the AI-powered streaming recommendation platform helping millions find their perfect movie or TV show across all major platforms.',
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
    { number: '4.8★', label: 'User Rating' },
  ];

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Watch Next Tonight</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered companion for discovering the perfect movie or TV show across all your
          streaming platforms.
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <div className="prose prose-lg text-muted-foreground max-w-none">
          <p className="mb-4">
            In a world with endless streaming options, finding something to watch shouldn&apos;t be
            overwhelming. Watch Next Tonight was created to solve the paradox of choice that
            millions face every evening.
          </p>
          <p className="mb-4">
            We believe that everyone deserves personalized entertainment recommendations without
            compromising their privacy or dealing with complicated algorithms. Our platform combines
            cutting-edge technology with a simple, intuitive interface to deliver instant, relevant
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Why Choose Watch Next Tonight?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex gap-4">
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
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
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
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-2">Get Instant Recommendations</h3>
              <p className="text-muted-foreground">
                Receive curated suggestions with ratings, descriptions, and direct links to watch on
                your streaming platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">About the Creator</h2>
        <div className="bg-muted/50 rounded-lg p-8">
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
        <h2 className="text-3xl font-bold mb-8">Our Technology</h2>
        <div className="prose prose-lg text-muted-foreground max-w-none">
          <p className="mb-4">
            Watch Next Tonight is built with cutting-edge web technologies to ensure fast, reliable,
            and accurate recommendations:
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
      <section className="text-center py-12 border-t">
        <h2 className="text-2xl font-bold mb-4">Ready to Find Your Next Watch?</h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of users who&apos;ve discovered their new favorite shows with Watch Next
          Tonight.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Film className="h-4 w-4" />
            Start Personalized Search
          </Link>
          <Link
            href="/trending"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
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
