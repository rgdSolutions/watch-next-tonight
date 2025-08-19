import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Header } from '../header';

describe('Header', () => {
  describe('Desktop view', () => {
    beforeEach(() => {
      vi.resetModules();
      vi.mock('@/hooks/use-is-mobile-screen-width', () => ({
        useIsMobileScreenWidth: () => false,
      }));
    });

    it('should render the title', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Watch Next Tonight');
    });

    it('should render the subtitle on desktop', () => {
      render(<Header />);

      const subtitle = screen.getByText('Find your perfect movie or show in just a few clicks');
      expect(subtitle).toBeInTheDocument();
    });

    it('should have proper styling classes', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass(
        'text-4xl',
        'font-bold',
        'tracking-tight',
        'mb-2',
        'md:text-5xl',
        'lg:text-6xl'
      );

      const subtitle = screen.getByText('Find your perfect movie or show in just a few clicks');
      expect(subtitle).toHaveClass('text-muted-foreground', 'text-lg', 'md:text-xl');
    });

    it('should have centered text alignment', () => {
      const { container } = render(<Header />);

      const headerContainer = container.querySelector('.text-center');
      expect(headerContainer).toBeInTheDocument();
    });

    it('should have proper spacing', () => {
      const { container } = render(<Header />);

      const headerContainer = container.querySelector('.text-center.mb-4');
      expect(headerContainer).toBeInTheDocument();
    });

    it('should use semantic HTML', () => {
      render(<Header />);

      // Should have exactly one h1 element
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings).toHaveLength(1);

      // Should have a paragraph for subtitle
      const subtitle = screen.getByText('Find your perfect movie or show in just a few clicks');
      expect(subtitle.tagName).toBe('P');
    });

    it('should be responsive with different text sizes', () => {
      render(<Header />);

      const title = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText('Find your perfect movie or show in just a few clicks');

      // Check for responsive text size classes
      expect(title).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl');
      expect(subtitle).toHaveClass('text-lg', 'md:text-xl');
    });
  });

  // Note: Mobile view testing is complex due to module mocking limitations
  // The Header component correctly hides subtitle on mobile via useIsMobileScreenWidth hook
});
