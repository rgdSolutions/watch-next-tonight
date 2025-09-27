import type { Metadata } from 'next';

import Link from 'next/link';

import { baseUrl } from '@/app/layout';
import { Breadcrumb } from '@/components/breadcrumb';
import { ScrollToTop } from '@/components/scroll-to-top';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Watch Next Tonight',
  description:
    'Terms and Conditions for Watch Next Tonight - Read our terms of service and usage guidelines.',
  alternates: {
    canonical: `${baseUrl}/terms/`,
  },
};

export default function TermsPage() {
  const lastUpdated = new Date('2025-09-11').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms and Conditions' }]} />

      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Agreement to Terms</h2>
          <p>
            By accessing and using Watch Next Tonight (&quot;the Service&quot;), you agree to be
            bound by these Terms and Conditions (&quot;Terms&quot;). If you disagree with any part
            of these terms, you do not have permission to access the Service. These Terms apply to
            all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Description of Service</h2>
          <p>
            Watch Next Tonight is a free web-based application that provides movie and TV show
            recommendations based on user preferences. The Service aggregates content information
            from third-party sources, primarily The Movie Database (TMDB) API, to help users
            discover what to watch across various streaming platforms.
          </p>
          <p className="mt-2">
            The Service is provided &quot;as is&quot; for informational and entertainment purposes
            only. We do not host, stream, or provide access to any copyrighted content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Use License</h2>
          <p>
            Permission is granted to temporarily access and use Watch Next Tonight for personal,
            non-commercial use only. This license does not include:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Modifying or copying the Service&apos;s materials</li>
            <li>Using the materials for commercial purposes or public display</li>
            <li>Attempting to reverse engineer any software contained in the Service</li>
            <li>Removing any copyright or proprietary notations from the materials</li>
            <li>Scraping, data mining, or using automated systems to access the Service</li>
          </ul>
          <p className="mt-2">
            This license shall automatically terminate if you violate any of these restrictions and
            may be terminated by us at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Acceptable Use Policy</h2>
          <p>You agree not to use the Service:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              In any way that violates any applicable federal, state, local, or international law
            </li>
            <li>
              To transmit any material that is defamatory, offensive, or otherwise objectionable
            </li>
            <li>To impersonate or attempt to impersonate another person or entity</li>
            <li>In any way that infringes upon the rights of others</li>
            <li>
              To engage in any conduct that restricts or inhibits anyone&apos;s use of the Service
            </li>
            <li>To introduce viruses, malware, or other harmful code</li>
            <li>To circumvent or disable any security features of the Service</li>
            <li>To use any robot, spider, or other automatic device to access the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Content and Information</h2>
          <p>
            The movie and TV show information displayed on Watch Next Tonight is provided by
            third-party sources, primarily The Movie Database (TMDB). We do not guarantee the
            accuracy, completeness, or reliability of this information. Streaming availability,
            ratings, and other details may change without notice.
          </p>
          <p className="mt-2">
            We are not affiliated with any streaming services mentioned on our platform. All
            trademarks, service marks, and logos are the property of their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Intellectual Property Rights
          </h2>
          <p>
            The Service and its original content (excluding third-party content), features, and
            functionality are and will remain the exclusive property of Watch Next Tonight and its
            licensors. The Service is protected by copyright, trademark, and other laws. Our
            trademarks and trade dress may not be used in connection with any product or service
            without our prior written consent.
          </p>
          <p className="mt-2">
            All movie and TV show data, including but not limited to titles, descriptions, images,
            and ratings, remain the property of their respective owners and are used under license
            from TMDB.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Third-Party Links and Services
          </h2>
          <p>
            Our Service may contain links to third-party websites or services that are not owned or
            controlled by Watch Next Tonight. We have no control over, and assume no responsibility
            for, the content, privacy policies, or practices of any third-party websites or
            services.
          </p>
          <p className="mt-2">
            You acknowledge and agree that we shall not be responsible or liable for any damage or
            loss caused by your use of any such third-party content, goods, or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS.
            WATCH NEXT TONIGHT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING WITHOUT
            LIMITATION:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>The implied warranties of merchantability and fitness for a particular purpose</li>
            <li>That the Service will be uninterrupted, timely, secure, or error-free</li>
            <li>
              That the information provided through the Service is accurate, reliable, or complete
            </li>
            <li>That any defects or errors will be corrected</li>
          </ul>
          <p className="mt-2">
            Any material obtained through the use of the Service is done at your own discretion and
            risk. You will be solely responsible for any damage to your computer system or loss of
            data that results from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WATCH NEXT TONIGHT, ITS
            AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
            <li>Damages resulting from your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of our servers</li>
            <li>Any interruption or cessation of transmission to or from the Service</li>
            <li>Any errors or omissions in any content</li>
          </ul>
          <p className="mt-2">
            This limitation of liability applies whether the alleged liability is based on contract,
            tort, negligence, strict liability, or any other basis, even if we have been advised of
            the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Watch Next Tonight and its affiliates,
            licensors, and service providers from and against any claims, liabilities, damages,
            judgments, awards, losses, costs, expenses, or fees (including reasonable
            attorneys&apos; fees) arising out of or relating to your violation of these Terms or
            your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Privacy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . Please review our Privacy Policy, which explains how we collect, use, and protect
            information about you when you use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice
            or liability, for any reason whatsoever, including without limitation if you breach the
            Terms.
          </p>
          <p className="mt-2">
            Upon termination, your right to use the Service will cease immediately. All provisions
            of the Terms which by their nature should survive termination shall survive termination.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any
            time. If a revision is material, we will provide notice by posting the new Terms on this
            page and updating the &quot;last updated&quot; date.
          </p>
          <p className="mt-2">
            By continuing to access or use our Service after those revisions become effective, you
            agree to be bound by the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable by a court, the
            remaining provisions of these Terms will remain in effect. These Terms constitute the
            entire agreement between us regarding our Service and supersede any prior agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United
            States, without regard to its conflict of law provisions. Our failure to enforce any
            right or provision of these Terms will not be considered a waiver of those rights.
          </p>
          <p className="mt-2">
            You agree to submit to the personal and exclusive jurisdiction of the courts located
            within the United States for the resolution of any disputes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">DMCA Notice</h2>
          <p>
            If you believe that content available through the Service infringes your copyright,
            please notify us with the following information:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>A physical or electronic signature of the copyright owner</li>
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the material to be removed</li>
            <li>Your contact information</li>
            <li>A statement that you have a good faith belief that use is not authorized</li>
            <li>A statement that the information in the notification is accurate</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">Contact Information</h2>
          <p>For questions about these Terms and Conditions, please contact us at:</p>
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
          <h2 className="text-xl font-semibold text-foreground mb-3">Effective Date</h2>
          <p>
            These Terms and Conditions are effective as of {lastUpdated} and will remain in effect
            except with respect to any changes in its provisions in the future, which will be in
            effect immediately after being posted on this page.
          </p>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
