'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems: BreadcrumbItem[] =
    items ||
    (() => {
      const pathSegments = pathname.split('/').filter(Boolean);
      const generatedItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        generatedItems.push({
          label,
          href: index === pathSegments.length - 1 ? undefined : currentPath,
        });
      });

      return generatedItems;
    })();

  // Generate schema.org BreadcrumbList
  const baseUrl = 'https://watchnexttonight.com';
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? (item.href === '/' ? baseUrl : `${baseUrl}${item.href}`) : undefined,
    })),
  };

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb on homepage
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-2 text-sm text-muted-foreground mb-6 ${className}`}
      >
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2" aria-hidden="true" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                  aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
