import type { Metadata } from 'next';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Watch Next Tonight',
  description:
    'Privacy policy for Watch Next Tonight - We respect your privacy and do not collect personal data.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go back</span>
      </Link>

      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Data Collection</h2>
          <p>
            Watch Next Tonight does not collect, store, or process any personal information. We do
            not require user accounts, logins, or any form of authentication.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Analytics</h2>
          <p>
            We use Google Analytics and Vercel Analytics to understand general usage patterns. These
            services may collect anonymous data such as page views, device types, and geographic
            regions. This data does not typically include personally identifiable information; where
            applicable we rely on the cookie opt-in to control data collection.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
          <p>We use minimal cookies only for essential functionality:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Theme preference (light/dark mode)</li>
            <li>Analytics cookies (if you accept them)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
          <p>
            Content data is provided by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              The Movie Database (TMDB)
            </a>{' '}
            API. This product uses the TMDB API but is not endorsed or certified by TMDB. We do not
            share any user data with TMDB.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Advertising</h2>
          <p>
            We may display ads through Google AdSense. These ads use cookies to show relevant
            content. You can learn more about Google&apos;s privacy practices at{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Your Choices</h2>
          <p>
            Since we don&apos;t collect personal data, there&apos;s no data to request, modify, or
            delete. You can clear your browser cookies at any time to reset theme preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
          <p>
            For privacy-related questions, please contact us through our{' '}
            <a
              href="https://github.com/rgdSolutions/watch-next-tonight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Updates</h2>
          <p>
            This privacy policy was last updated on{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            . Any changes will be posted on this page.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-12"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go back</span>
      </Link>
    </div>
  );
}
