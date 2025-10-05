import type { Metadata } from 'next';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

import { baseUrl } from '@/app/layout';
import { Breadcrumb } from '@/components/breadcrumb';
import { ScrollToTop } from '@/components/scroll-to-top';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | Watch Next Tonight',
  description:
    'Find answers to common questions about Watch Next Tonight. Learn how to get personalized movie and TV show recommendations across streaming platforms.',
  alternates: {
    canonical: `${baseUrl}/faq/`,
  },
  openGraph: {
    title: 'Frequently Asked Questions - Watch Next Tonight',
    description:
      'Get answers to your questions about finding the perfect movie or TV show to watch tonight.',
    url: `${baseUrl}/faq/`,
  },
};

// Static page - no revalidation needed
export const revalidate = false;

export default function FAQPage() {
  const faqs = [
    {
      question: 'How does Watch Next Tonight work?',
      answer:
        'Watch Next Tonight uses advanced algorithms to provide personalized movie and TV show recommendations. Simply choose between personalized search or trending content, set your preferences (location, genres, and content recency), and receive instant recommendations tailored to your taste with direct links to watch on your streaming platforms.',
    },
    {
      question: 'Is Watch Next Tonight free to use?',
      answer:
        'Yes, Watch Next Tonight is completely free to use. There are no hidden fees, subscriptions, or premium features. We believe everyone deserves great entertainment recommendations without cost barriers.',
    },
    {
      question: 'Which streaming platforms does Watch Next Tonight support?',
      answer:
        'We support all major streaming platforms including Netflix, Amazon Prime Video, Disney+, Apple TV+, MAX (HBO Max), Hulu, Paramount+, and Peacock. Our database is constantly updated to include new platforms and regional availability.',
    },
    {
      question: 'Do I need to create an account to use the service?',
      answer:
        "No, you don't need to create an account. Watch Next Tonight respects your privacy and allows you to get recommendations instantly without any registration. Your preferences are processed in real-time and are not stored.",
    },
    {
      question: 'How accurate are the streaming availability results?',
      answer:
        'Our streaming availability data is updated daily from reliable sources including The Movie Database (TMDB) API. While we strive for 100% accuracy, streaming catalogs change frequently. We recommend double-checking availability on your streaming platform before starting to watch.',
    },
    {
      question: 'Can I get recommendations for content in my country?',
      answer:
        'Yes! Watch Next Tonight supports over 100 countries worldwide. During the personalized search process, you can select your location to ensure recommendations are available in your region. The trending section shows global content that may vary by region.',
    },
    {
      question: "How do you determine what's trending?",
      answer:
        "Our trending section aggregates data from multiple sources including view counts, social media buzz, critic reviews, and user ratings. We use a proprietary algorithm to identify content that's gaining popularity globally, updated in real-time.",
    },
    {
      question: 'Can I filter results by specific genres?',
      answer:
        "Absolutely! In the personalized search mode, you can select multiple genres including Action, Comedy, Drama, Horror, Romance, Sci-Fi, Thriller, Documentary, Animation, and more. You can combine genres to find exactly what you're in the mood for.",
    },
    {
      question: "What's the difference between personalized search and trending?",
      answer:
        "Personalized search tailors recommendations based on your specific preferences (location, genres, content recency), giving you customized results. Trending shows what's popular globally right now, perfect for discovering what everyone else is watching and talking about.",
    },
    {
      question: 'How often is the content database updated?',
      answer:
        'Our content database is updated multiple times daily. New releases are typically added within 24 hours of announcement, and streaming availability is refreshed daily to ensure accuracy. Trending data is updated in real-time.',
    },
    {
      question: 'Can I save my favorite recommendations?',
      answer:
        "Currently, Watch Next Tonight doesn't offer a save feature to maintain your privacy and keep the service simple. However, you can bookmark specific recommendation URLs in your browser or take screenshots of results you want to remember.",
    },
    {
      question: "Why can't I find a specific movie or show?",
      answer:
        "If you can't find specific content, it might be: (1) Not available on streaming platforms in your region, (2) Only available for rental/purchase, not streaming, (3) Recently removed from streaming platforms, or (4) Too new to be in our database yet. Try checking back in a few days for new releases.",
    },
    {
      question: 'Do you show content ratings and parental guidance?',
      answer:
        'Yes, we display official ratings (G, PG, PG-13, R, etc.) for all content when available. We also show content descriptions that may help you determine if something is appropriate for your viewing situation.',
    },
    {
      question: "Can I get recommendations for kids' content?",
      answer:
        "Yes! Select the Animation or Family genres in personalized search to find kid-friendly content. You can also filter by rating to ensure age-appropriate recommendations. Many results will indicate if they're specifically designed for children.",
    },
    {
      question: 'How can I report an issue or suggest a feature?',
      answer:
        'We welcome feedback! You can report issues or suggest features through our Contact page, or directly on our GitHub repository. We actively review all feedback and continuously improve the service based on user suggestions.',
    },
  ];

  // Schema.org FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about finding your perfect movie or TV show with Watch Next
          Tonight.
        </p>
      </div>

      {/* FAQ Items */}
      <section className="space-y-4 mb-16">
        <h2 className="sr-only">Questions and Answers</h2>
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border rounded-lg p-6 hover:border-primary transition-colors"
          >
            <summary className="flex items-start justify-between cursor-pointer list-none">
              <h3 className="font-semibold text-lg pr-4 flex-1">{faq.question}</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground group-open:hidden flex-shrink-0 mt-1" />
              <ChevronUp className="w-5 h-5 text-muted-foreground hidden group-open:block flex-shrink-0 mt-1" />
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </section>

      {/* Additional Help Section */}
      <section className="border-t pt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Still Have Questions?</h2>
        <p className="text-muted-foreground text-center mb-8">
          Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact Support
          </Link>
          <Link
            href="https://github.com/rgdSolutions/watch-next-tonight/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Report an Issue
          </Link>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="mt-16 p-8 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quick Tips for Best Results</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Select multiple genres for more diverse recommendations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Use &quot;Last 2 Years&quot; for the newest content across platforms</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Check trending daily for fresh, popular content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Try different genre combinations to discover hidden gems</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Bookmark the site for quick access when you need recommendations</span>
          </li>
        </ul>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}
