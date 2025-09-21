import type { Metadata } from 'next';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Watch Next Tonight',
  description:
    'Privacy policy for Watch Next Tonight - We respect your privacy and are committed to protecting your data.',
  alternates: {
    canonical: 'https://watchnexttonight.com/privacy/',
  },
};

export default function PrivacyPage() {
  const lastUpdated = new Date('2025-09-11').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          <h2 className="text-xl font-semibold text-foreground mb-3">GDPR Compliance</h2>
          <p>
            We support the EU General Data Protection Regulations (GDPR) and are committed to
            protecting your privacy rights. We embrace privacy by design and minimize the collection
            of personally identifiable information. Since we do not collect personal data, there is
            no data to export or delete. However, if our practices change, you will have the right
            to request access to, correction of, or deletion of your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
          <p>
            Watch Next Tonight operates with minimal data collection. We do not require user
            accounts, logins, or authentication. We do not collect, store, or process personally
            identifiable information (PII). PII is information that can be used to identify,
            contact, or locate you as an individual.
          </p>
          <p className="mt-2">The only information automatically collected includes:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Anonymous usage data through analytics (page views, device types, geographic regions)
            </li>
            <li>Technical information like browser type and IP addresses (anonymized)</li>
            <li>Cookie preferences for site functionality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Information</h2>
          <p>The limited anonymous data we collect is used solely to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Improve our website and user experience</li>
            <li>Understand general usage patterns and popular content</li>
            <li>Maintain site functionality and performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Security Measures</h2>
          <p>
            We take reasonable measures to protect our website and any data transmitted through it:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Regular security scanning for vulnerabilities</li>
            <li>HTTPS encryption for all data transmission</li>
            <li>Regular updates to dependencies and frameworks</li>
            <li>Hosting on secure, reputable platforms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Analytics</h2>
          <p>
            We use Google Analytics and Vercel Analytics to understand general usage patterns. These
            services collect anonymous data such as page views, device types, and geographic
            regions. We have implemented:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>IP anonymization to protect your privacy</li>
            <li>No user ID tracking</li>
            <li>Minimal data retention periods</li>
          </ul>
          <p className="mt-2">
            You can opt out of Google Analytics by installing the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
          <p>We use minimal cookies only for essential functionality:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Theme preference (light/dark mode) - essential cookie</li>
            <li>Analytics cookies (only if you accept them)</li>
            <li>Google AdSense DART cookies for relevant advertising (if applicable)</li>
          </ul>
          <p className="mt-2">
            <strong>Managing Cookies:</strong> You can control cookies through your browser
            settings. Each browser is different, so check your browser&apos;s Help menu to learn how
            to modify cookies. Disabling cookies may affect some site features but will not prevent
            you from using the core functionality.
          </p>
          <p className="mt-2">
            To opt out of Google&apos;s use of cookies, visit{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </p>
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
          <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer any information to outside parties. This
            does not include trusted third parties who assist us in operating our website, so long
            as those parties agree to keep information confidential. We may release information when
            required to comply with the law, enforce site policies, or protect rights, property, or
            safety.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Advertising</h2>
          <p>
            We may display ads through Google AdSense. These ads use cookies including the DART
            cookie to show relevant content based on your visits to our site and other sites. You
            can opt out of the DART cookie by visiting the{' '}
            <a
              href="https://www.google.com/policies/technologies/ads/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Ad and Content Network privacy policy
            </a>
            .
          </p>
          <p className="mt-2">
            Google&apos;s advertising follows{' '}
            <a
              href="https://support.google.com/adwordspolicy/answer/6008942"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google&apos;s Advertising Principles
            </a>{' '}
            to provide a positive user experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Do Not Track Signals</h2>
          <p>
            We honor Do Not Track (DNT) signals. When a DNT browser mechanism is in place, we do not
            track, plant cookies, or use advertising. We respect your choice to browse privately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            California Privacy Rights (CalOPPA)
          </h2>
          <p>Under CalOPPA, California users have the right to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Visit our site anonymously</li>
            <li>Be notified of privacy policy changes on this page</li>
            <li>Know how we respond to Do Not Track signals</li>
          </ul>
          <p className="mt-2">
            Since we don&apos;t collect personal information, there is no personal data to change or
            delete.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Children&apos;s Privacy (COPPA)
          </h2>
          <p>
            We do not specifically market to children under 13 years old. We do not knowingly
            collect personal information from children under 13. If you are a parent or guardian and
            believe we may have inadvertently collected information from your child, please contact
            us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Data Breach Notification</h2>
          <p>
            Although we do not collect personal data, in the unlikely event of a security breach
            affecting our systems, we will notify affected users via website notice within 7
            business days. We follow Fair Information Practice Principles and support individual
            redress rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Email Communications (CAN-SPAM)
          </h2>
          <p>
            We currently do not collect email addresses or send marketing emails. If this changes in
            the future, we will:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Never use false or misleading subjects or addresses</li>
            <li>Identify messages as advertisements when applicable</li>
            <li>Include our physical address</li>
            <li>Honor opt-out requests promptly</li>
            <li>Provide clear unsubscribe links</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Browse our site anonymously</li>
            <li>Disable cookies in your browser</li>
            <li>Opt out of analytics tracking</li>
            <li>Use Do Not Track settings</li>
            <li>Clear browser data at any time</li>
          </ul>
          <p className="mt-2">
            Since we don&apos;t collect personal data, there&apos;s no data to request, modify, or
            delete.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Terms and Consent</h2>
          <p>
            By using Watch Next Tonight, you consent to this privacy policy. If you do not agree
            with this policy, please do not use our website. Your continued use of the site
            following any changes to this policy will be deemed as acceptance of those changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact Information</h2>
          <p>For privacy-related questions or concerns, you can contact us through:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              GitHub:{' '}
              <a
                href="https://github.com/rgdSolutions/watch-next-tonight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/rgdSolutions/watch-next-tonight
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Policy Updates</h2>
          <p>
            This privacy policy was last updated on {lastUpdated}. We will notify users of any
            material changes to this policy by posting the new privacy policy on this page and
            updating the &quot;last updated&quot; date. We encourage you to review this policy
            periodically for any changes.
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
