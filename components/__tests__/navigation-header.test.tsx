import { fireEvent, render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NavigationHeader } from '../navigation-header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock next/link to avoid navigation errors in tests
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: any;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('NavigationHeader', () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Navigation', () => {
    it('renders logo with full text on desktop', () => {
      render(<NavigationHeader />);

      expect(screen.getByText('Watch Next Tonight')).toBeInTheDocument();
      expect(screen.queryByText('WNT')).toBeInTheDocument(); // Also present for mobile
    });

    it('renders all navigation items on desktop', () => {
      render(<NavigationHeader />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /trending/i })).toBeInTheDocument();
    });

    it('does not show mobile menu button on desktop', () => {
      render(<NavigationHeader />);

      const menuButton = screen.getByRole('button');
      expect(menuButton).toHaveClass('md:hidden');
    });

    it('applies correct styling classes to header', () => {
      render(<NavigationHeader />);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass(
        'sticky',
        'top-0',
        'z-50',
        'w-full',
        'border-b',
        'bg-background/95',
        'backdrop-blur'
      );
    });
  });

  describe('Mobile Navigation', () => {
    it('renders abbreviated logo text on mobile', () => {
      render(<NavigationHeader />);

      expect(screen.getByText('WNT')).toHaveClass('sm:hidden');
      expect(screen.getByText('Watch Next Tonight')).toHaveClass('hidden', 'sm:inline');
    });

    it('shows mobile menu button with correct initial state', () => {
      render(<NavigationHeader />);

      const menuButton = screen.getByRole('button');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
      expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('toggles mobile menu when button is clicked', () => {
      render(<NavigationHeader />);

      // Initially, mobile menu should not be visible
      expect(screen.queryByRole('list')).toHaveClass('hidden', 'md:flex');

      // Click menu button to open
      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      // Mobile menu should now be visible (there will be 2 lists - desktop and mobile)
      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2);
      expect(lists[1].parentElement).toHaveClass('md:hidden');
    });

    it('changes menu icon when mobile menu is toggled', () => {
      render(<NavigationHeader />);

      const menuButton = screen.getByRole('button');

      // Initially shows Menu icon
      expect(menuButton.innerHTML).toContain('svg');
      const initialSvg = menuButton.querySelector('svg');

      // Click to open
      fireEvent.click(menuButton);

      // Should now show X icon (different SVG)
      const openSvg = menuButton.querySelector('svg');
      expect(openSvg).not.toBe(initialSvg);
    });
  });

  describe('Navigation Links', () => {
    it('has correct href attributes for all links', () => {
      render(<NavigationHeader />);

      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      homeLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', '/');
      });

      const searchLinks = screen.getAllByRole('link', { name: /search/i });
      searchLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', '/search');
      });

      const trendingLinks = screen.getAllByRole('link', { name: /trending/i });
      trendingLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', '/trending');
      });
    });

    it('logo link navigates to home', () => {
      render(<NavigationHeader />);

      const logoLinks = screen
        .getAllByRole('link')
        .filter((link) => link.querySelector('.text-primary'));

      expect(logoLinks[0]).toHaveAttribute('href', '/');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and attributes that change with state', () => {
      render(<NavigationHeader />);

      // Initial state - menu closed
      let menuButton = screen.getByRole('button');
      expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      // Click to open menu
      fireEvent.click(menuButton);

      // Menu open state
      menuButton = screen.getByRole('button');
      expect(menuButton).toHaveAttribute('aria-label', 'Close menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('adds aria-current="page" to active navigation items', () => {
      mockUsePathname.mockReturnValue('/search');
      render(<NavigationHeader />);

      const searchLink = screen.getByRole('link', { name: /search/i });
      expect(searchLink).toHaveAttribute('aria-current', 'page');

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).not.toHaveAttribute('aria-current');

      const trendingLink = screen.getByRole('link', { name: /trending/i });
      expect(trendingLink).not.toHaveAttribute('aria-current');
    });

    it('mobile menu has proper ARIA attributes', () => {
      render(<NavigationHeader />);

      // Open mobile menu
      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      // Check mobile menu container
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(mobileMenu).toHaveAttribute('id', 'mobile-menu');
    });

    it('closes mobile menu with Escape key', () => {
      render(<NavigationHeader />);

      // Open mobile menu
      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      // Verify menu is open
      expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeInTheDocument();

      // Press Escape key
      fireEvent.keyDown(document, { key: 'Escape' });

      // Verify menu is closed
      expect(
        screen.queryByRole('navigation', { name: /mobile navigation/i })
      ).not.toBeInTheDocument();
    });

    it('uses semantic navigation element', () => {
      render(<NavigationHeader />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('uses semantic header element', () => {
      render(<NavigationHeader />);

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('renders navigation lists with proper structure', () => {
      render(<NavigationHeader />);

      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThanOrEqual(1);

      lists.forEach((list) => {
        const items = list.querySelectorAll('li');
        expect(items.length).toBe(4); // Home, Search, Trending
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles nested paths correctly', () => {
      mockUsePathname.mockReturnValue('/search/results');
      render(<NavigationHeader />);

      // Should not highlight any nav item for nested paths
      const searchLink = screen.getByRole('link', { name: /search/i });
      expect(searchLink).not.toHaveClass('bg-primary');
    });

    it('handles empty pathname gracefully', () => {
      mockUsePathname.mockReturnValue('');

      expect(() => render(<NavigationHeader />)).not.toThrow();
    });
  });

  describe('Responsive Behavior', () => {
    it('applies correct responsive classes', () => {
      render(<NavigationHeader />);

      // Desktop navigation list
      const desktopList = screen.getByRole('list');
      expect(desktopList).toHaveClass('hidden', 'md:flex');

      // Mobile menu button
      const menuButton = screen.getByRole('button');
      expect(menuButton).toHaveClass('md:hidden');

      // Logo text variations
      expect(screen.getByText('Watch Next Tonight')).toHaveClass('hidden', 'sm:inline');
      expect(screen.getByText('WNT')).toHaveClass('sm:hidden');
    });
  });
});
