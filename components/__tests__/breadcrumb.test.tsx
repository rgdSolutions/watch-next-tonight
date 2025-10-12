import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Breadcrumb, type BreadcrumbItem } from '../breadcrumb';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock next/script
vi.mock('next/script', () => ({
  default: ({ children, ...props }: any) => <script {...props}>{children}</script>,
}));

describe('Breadcrumb', () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  describe('Rendering', () => {
    it('should not render on homepage when no items provided', () => {
      mockUsePathname.mockReturnValue('/');
      const { container } = render(<Breadcrumb />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render when only home item exists', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
      const { container } = render(<Breadcrumb items={items} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render breadcrumb navigation with multiple items', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category' },
      ];

      render(<Breadcrumb items={items} />);

      const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(nav).toBeInTheDocument();
    });

    it('should render breadcrumb items in correct order', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Team' },
      ];

      render(<Breadcrumb items={items} />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveTextContent('Home');
      expect(links[1]).toHaveTextContent('About');
      expect(screen.getByText('Team')).toBeInTheDocument();
    });

    it('should apply custom className to navigation', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Contact' }];

      render(<Breadcrumb items={items} className="custom-class" />);

      const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(nav).toHaveClass('custom-class');
    });
  });

  describe('Link Behavior', () => {
    it('should render links for items with href', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Current Page' },
      ];

      render(<Breadcrumb items={items} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/');
      expect(links[1]).toHaveAttribute('href', '/about');
    });

    it('should render span for items without href', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Current Page' }];

      render(<Breadcrumb items={items} />);

      const currentPage = screen.getByText('Current Page');
      expect(currentPage.tagName).toBe('SPAN');
      expect(currentPage).toHaveClass('text-foreground', 'font-medium');
    });

    it('should not mark intermediate items as current page', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current' },
      ];

      render(<Breadcrumb items={items} />);

      const links = screen.getAllByRole('link');
      expect(links[0]).not.toHaveAttribute('aria-current');
      expect(links[1]).not.toHaveAttribute('aria-current');
    });

    it('should mark last item without href as current page', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Current Page' }];

      render(<Breadcrumb items={items} />);

      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Separators', () => {
    it('should render chevron separators between items', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category' },
      ];

      render(<Breadcrumb items={items} />);

      // ChevronRight icons should be rendered as separators
      const separators = document.querySelectorAll('svg');
      expect(separators).toHaveLength(2); // 2 separators for 3 items
    });

    it('should not render separator before first item', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'About' }];

      render(<Breadcrumb items={items} />);

      const firstItem = screen.getByRole('list').firstChild as HTMLElement;
      const svg = firstItem?.querySelector('svg');
      expect(svg).toBeNull();
    });

    it('should mark separators as decorative', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category' },
      ];

      render(<Breadcrumb items={items} />);

      const separators = document.querySelectorAll('svg');
      separators.forEach((separator) => {
        expect(separator).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Auto-generation from pathname', () => {
    it('should auto-generate breadcrumbs from pathname when no items provided', () => {
      mockUsePathname.mockReturnValue('/products/electronics');

      render(<Breadcrumb />);

      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    it('should capitalize path segments correctly', () => {
      mockUsePathname.mockReturnValue('/user-profile/settings');

      render(<Breadcrumb />);

      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should handle deeply nested paths', () => {
      mockUsePathname.mockReturnValue('/docs/api/v2/authentication/oauth');

      render(<Breadcrumb />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Docs')).toBeInTheDocument();
      expect(screen.getByText('Api')).toBeInTheDocument();
      expect(screen.getByText('V2')).toBeInTheDocument();
      expect(screen.getByText('Authentication')).toBeInTheDocument();
      expect(screen.getByText('Oauth')).toBeInTheDocument();
    });

    it('should make all but last auto-generated item clickable', () => {
      mockUsePathname.mockReturnValue('/about/team/leadership');

      render(<Breadcrumb />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/');
      expect(links[1]).toHaveAttribute('href', '/about');
      expect(links[2]).toHaveAttribute('href', '/about/team');

      // Last item should not be a link
      expect(screen.getByText('Leadership').tagName).toBe('SPAN');
    });

    it('should handle trailing slashes correctly', () => {
      mockUsePathname.mockReturnValue('/products/');

      render(<Breadcrumb />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('should handle root path correctly', () => {
      mockUsePathname.mockReturnValue('/');

      const { container } = render(<Breadcrumb />);

      // Should not render anything on homepage
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Schema.org JSON-LD', () => {
    it('should include JSON-LD structured data script', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Electronics' },
      ];

      const { container } = render(<Breadcrumb items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('should generate correct BreadcrumbList schema', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Current' },
      ];

      const { container } = render(<Breadcrumb items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(3);
    });

    it('should include correct position and item properties in schema', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];

      const { container } = render(<Breadcrumb items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      expect(jsonLd.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://watchnexttonight.com',
      });

      expect(jsonLd.itemListElement[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://watchnexttonight.com/about',
      });
    });

    it('should not include item URL for current page in schema', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'Current Page' }];

      const { container } = render(<Breadcrumb items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || '{}');

      expect(jsonLd.itemListElement[1]).toEqual({
        '@type': 'ListItem',
        position: 2,
        name: 'Current Page',
        item: undefined,
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: 'About' }];

      render(<Breadcrumb items={items} />);

      const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('should use ordered list for semantic structure', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category' },
      ];

      render(<Breadcrumb items={items} />);

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
    });

    it('should have list items for each breadcrumb', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category' },
      ];

      render(<Breadcrumb items={items} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('should apply hover styles to links', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];

      render(<Breadcrumb items={items} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('hover:text-foreground', 'transition-colors');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      const items: BreadcrumbItem[] = [];
      const { container } = render(<Breadcrumb items={items} />);
      expect(container.firstChild).toBeNull();
    });

    it('should handle items with empty labels gracefully', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: '', href: '/empty' },
        { label: 'End' },
      ];

      render(<Breadcrumb items={items} />);

      // Should still render the structure
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
    });

    it('should handle special characters in labels', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products & Services', href: '/products-services' },
        { label: "User's Profile" },
      ];

      render(<Breadcrumb items={items} />);

      expect(screen.getByText('Products & Services')).toBeInTheDocument();
      expect(screen.getByText("User's Profile")).toBeInTheDocument();
    });

    it('should handle very long labels', () => {
      const longLabel = 'This is a very long breadcrumb label that might cause layout issues';
      const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, { label: longLabel }];

      render(<Breadcrumb items={items} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('should handle pathname with query strings', () => {
      // The component includes query string as part of the last segment
      mockUsePathname.mockReturnValue('/search/query?q=test&filter=new');

      render(<Breadcrumb />);

      expect(screen.getByText('Search')).toBeInTheDocument();
      // The component treats the entire "query?q=test&filter=new" as one segment
      expect(screen.getByText('Query?q=test&filter=new')).toBeInTheDocument();
    });

    it('should handle pathname with encoded characters', () => {
      mockUsePathname.mockReturnValue('/products/category%20name/item');

      render(<Breadcrumb />);

      // Component should handle encoded spaces
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Category%20name')).toBeInTheDocument();
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should prefer provided items over auto-generation', () => {
      mockUsePathname.mockReturnValue('/some/path');

      const items: BreadcrumbItem[] = [
        { label: 'Custom Home', href: '/' },
        { label: 'Custom Page' },
      ];

      render(<Breadcrumb items={items} />);

      expect(screen.getByText('Custom Home')).toBeInTheDocument();
      expect(screen.getByText('Custom Page')).toBeInTheDocument();
      expect(screen.queryByText('Some')).not.toBeInTheDocument();
      expect(screen.queryByText('Path')).not.toBeInTheDocument();
    });

    it('should work correctly with different route depths', () => {
      // Test single level
      mockUsePathname.mockReturnValue('/about');
      const { rerender } = render(<Breadcrumb />);
      expect(screen.getByText('About')).toBeInTheDocument();

      // Test two levels
      mockUsePathname.mockReturnValue('/products/electronics');
      rerender(<Breadcrumb />);
      expect(screen.getByText('Electronics')).toBeInTheDocument();

      // Test three levels
      mockUsePathname.mockReturnValue('/docs/api/reference');
      rerender(<Breadcrumb />);
      expect(screen.getByText('Reference')).toBeInTheDocument();
    });
  });
});
