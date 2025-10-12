import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AboutPage from '../about/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/about'),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('AboutPage', () => {
  it('should render the page title and main heading', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Watch Next Tonight');
  });

  it('should render all four main features', () => {
    render(<AboutPage />);

    expect(screen.getByText('Global Content Access')).toBeInTheDocument();
    expect(screen.getByText('Personalized Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Trends')).toBeInTheDocument();
    expect(screen.getByText('Privacy-First Approach')).toBeInTheDocument();
  });

  it('should display all statistics correctly', () => {
    render(<AboutPage />);

    expect(screen.getByText('50K+')).toBeInTheDocument();
    expect(screen.getByText('Movies & Shows')).toBeInTheDocument();
    expect(screen.getByText('8+')).toBeInTheDocument();
    expect(screen.getByText('Streaming Platforms')).toBeInTheDocument();
    expect(screen.getByText('100+')).toBeInTheDocument();
    expect(screen.getByText('Countries Supported')).toBeInTheDocument();
  });

  it('should render mission section with key information', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'Our Mission' })).toBeInTheDocument();
    expect(screen.getByText(/paradox of choice/i)).toBeInTheDocument();
    expect(screen.getByText(/personalized entertainment recommendations/i)).toBeInTheDocument();
  });

  it('should display the How It Works section with three steps', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'How It Works' })).toBeInTheDocument();
    expect(screen.getByText('Choose Your Path')).toBeInTheDocument();
    expect(screen.getByText('Set Your Preferences')).toBeInTheDocument();
    expect(screen.getByText('Get Instant Recommendations')).toBeInTheDocument();
  });

  it('should render author information section', () => {
    render(<AboutPage />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'About the Creator' })
    ).toBeInTheDocument();
    expect(screen.getByText("Ricardo D'Alessandro")).toBeInTheDocument();
    expect(screen.getByText(/Full-stack developer/i)).toBeInTheDocument();
  });

  it('should display technology stack information', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'Our Technology' })).toBeInTheDocument();
    expect(screen.getByText(/Next.js 15/)).toBeInTheDocument();
    expect(screen.getByText(/TMDB API/)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/React Query/)).toBeInTheDocument();
  });

  it('should render CTA section with correct links', () => {
    render(<AboutPage />);

    const personalizedSearchLink = screen.getByRole('link', { name: /Start Personalized Search/i });
    const trendingLink = screen.getByRole('link', { name: /See What's Trending/i });

    expect(personalizedSearchLink).toHaveAttribute('href', '/search');
    expect(trendingLink).toHaveAttribute('href', '/trending');
  });

  it('should include breadcrumb navigation', () => {
    render(<AboutPage />);

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('should render external GitHub link with correct attributes', () => {
    render(<AboutPage />);

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/rgdSolutions');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
