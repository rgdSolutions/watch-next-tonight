import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LandingPage from '../page';

describe('LandingPage', () => {
  it('should render the title and subtitle', () => {
    render(<LandingPage />);

    expect(screen.getByText('Watch Next Tonight')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Discover your perfect movie or show from all of your favorite streaming services/i
      )
    ).toBeInTheDocument();
  });

  it('should render two main action buttons', () => {
    render(<LandingPage />);

    // Search button
    const searchLink = screen.getByRole('link', { name: /Start Searching/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute('href', '/search');

    // Trending button
    const trendingLink = screen.getByRole('link', { name: /Trending Now/i });
    expect(trendingLink).toBeInTheDocument();
    expect(trendingLink).toHaveAttribute('href', '/trending');
  });

  it('should display search button with magnifying glass icon and description', () => {
    render(<LandingPage />);

    expect(screen.getByText('Start Searching')).toBeInTheDocument();
    expect(
      screen.getByText(/Share your location for(.*)personalized recommendations/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Click to begin')).toBeInTheDocument();
  });

  it('should display trending button with flame icon and description', () => {
    render(<LandingPage />);

    expect(screen.getByText('Trending Now')).toBeInTheDocument();
    expect(
      screen.getByText(/In a hurry\? See what(.*)hot globally right now/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Quick pick')).toBeInTheDocument();
  });

  it('should render feature highlights', () => {
    render(<LandingPage />);

    expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
    expect(screen.getByText('All Streaming Platforms')).toBeInTheDocument();
    expect(screen.getByText('Quick & Easy')).toBeInTheDocument();
  });

  it('should have proper responsive classes', () => {
    const { container } = render(<LandingPage />);

    // Check for responsive flex direction on button container
    const buttonContainer = container.querySelector('.flex.flex-col.md\\:flex-row');
    expect(buttonContainer).toBeInTheDocument();

    // Check for responsive text sizes
    const title = screen.getByText('Watch Next Tonight');
    expect(title).toHaveClass('text-5xl', 'md:text-7xl');
  });

  it('should apply theme-aware colors', () => {
    const { container } = render(<LandingPage />);

    // Check for theme-aware background
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('from-background', 'to-background');

    // Check for dark mode specific classes
    expect(mainContainer).toHaveClass(
      'dark:from-slate-900',
      'dark:via-slate-800/30',
      'dark:to-slate-900'
    );
  });

  it('should have equal button dimensions', () => {
    render(<LandingPage />);

    const searchButton = screen.getByRole('link', { name: /Start Searching/i });
    const trendingButton = screen.getByRole('link', { name: /Trending Now/i });

    // Both buttons should have the same width class
    expect(searchButton).toHaveClass('w-full', 'md:w-96');
    expect(trendingButton).toHaveClass('w-full', 'md:w-96');
  });

  it('should have proper hover states for buttons', () => {
    const { container } = render(<LandingPage />);

    // Check for hover transform classes
    const searchButtonContainer = container.querySelector('[href="/search"] .hover\\:scale-105');
    const trendingButtonContainer = container.querySelector(
      '[href="/trending"] .hover\\:scale-105'
    );

    expect(searchButtonContainer).toBeInTheDocument();
    expect(trendingButtonContainer).toBeInTheDocument();
  });

  it('should use semantic HTML structure', () => {
    render(<LandingPage />);

    // Check for heading hierarchy
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Watch Next Tonight');

    // Check for navigation links
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
