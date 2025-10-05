import type { Metadata } from 'next';

import { ArrowRight, Github, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { baseUrl } from '@/app/layout';
import { Breadcrumb } from '@/components/breadcrumb';
import { ContactForm } from '@/components/contact-form';
import { ScrollToTop } from '@/components/scroll-to-top';

export const metadata: Metadata = {
  title: 'Contact Us - Watch Next Tonight Support',
  description:
    "Get in touch with Watch Next Tonight. We're here to help with questions, feedback, or partnership inquiries.",
  alternates: {
    canonical: `${baseUrl}/contact/`,
  },
  openGraph: {
    title: 'Contact Watch Next Tonight',
    description: "Questions, feedback, or suggestions? We'd love to hear from you.",
    url: `${baseUrl}/contact/`,
  },
};

// Static page - no revalidation needed
export const revalidate = false;

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Github,
      title: 'GitHub',
      description: 'Report issues or contribute',
      link: 'https://github.com/rgdSolutions/watch-next-tonight',
      linkText: 'View Repository',
    },
    {
      icon: MessageCircle,
      title: 'Feedback',
      description: 'Share your thoughts',
      link: '#contact-form',
      linkText: 'Use Form Below',
    },
  ];

  return (
    <main className="container max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions, feedback, or suggestions? We&apos;d love to hear from you. Choose your
          preferred contact method below.
        </p>
      </div>

      {/* Contact Methods */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Contact Methods</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className="border rounded-lg p-6 text-center hover:border-primary transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                <Link
                  href={method.link}
                  className="text-primary hover:underline text-sm font-medium"
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {method.linkText}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Send Us a Message</h2>
        <ContactForm />
      </section>

      {/* FAQ Preview */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mb-4">
          Before reaching out, you might find your answer in our FAQ section.
        </p>
        <Link href="/faq/" className="inline-flex items-center gap-2 text-primary hover:underline">
          View FAQ
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Response Time */}
      <section className="text-center py-8 border-t">
        <h3 className="font-semibold mb-2">Expected Response Time</h3>
        <p className="text-muted-foreground">
          We typically respond to inquiries within 24-48 hours during business days. For urgent
          matters, please indicate so in your message.
        </p>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </main>
  );
}
