import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TrendingPage from '../page';

// Mock the Header component
vi.mock('@/components/header', () => ({
  Header: () => <div data-testid="header">Header Component</div>,
}));

// Mock the ContentDisplayWithQuery component
vi.mock('@/components/content-display-with-query', () => ({
  ContentDisplayWithQuery: ({ preferences }: any) => (
    <div data-testid="content-display">
      {preferences ? (
        <div>Content with preferences</div>
      ) : (
        <div>Trending content without preferences</div>
      )}
    </div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestQueryWrapper';
  return Wrapper;
};

describe('TrendingPage', () => {
  it('should render the header component', () => {
    render(<TrendingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render the content display without preferences', () => {
    render(<TrendingPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('content-display')).toBeInTheDocument();
    expect(screen.getByText('Trending content without preferences')).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    const { container } = render(<TrendingPage />, { wrapper: createWrapper() });

    // Check for gradient background
    const mainContainer = container.querySelector('.flex-1.bg-gradient-to-br');
    expect(mainContainer).toBeInTheDocument();

    // Check for container with proper spacing
    const contentContainer = container.querySelector('.container.mx-auto.px-4.py-8');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should apply theme-aware styling', () => {
    const { container } = render(<TrendingPage />, { wrapper: createWrapper() });

    const gradientContainer = container.querySelector(
      '.from-background.via-background.to-muted\\/20'
    );
    expect(gradientContainer).toBeInTheDocument();
  });

  it('should have max width constraint', () => {
    const { container } = render(<TrendingPage />, { wrapper: createWrapper() });

    const maxWidthContainer = container.querySelector('.max-w-8xl');
    expect(maxWidthContainer).toBeInTheDocument();
  });
});
