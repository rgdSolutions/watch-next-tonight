import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SearchPage from '@/app/search/page';

// Simple mock implementations
vi.mock('@/components/location-step', () => ({
  LocationStep: ({ onComplete }: any) => (
    <div data-testid="location-step">
      <button onClick={() => onComplete('US')}>United States</button>
    </div>
  ),
}));

vi.mock('@/components/genre-step', () => ({
  GenreStep: ({ onComplete }: any) => (
    <div data-testid="genre-step">
      <button onClick={() => onComplete(['action'])}>Select Action</button>
    </div>
  ),
}));

vi.mock('@/components/recency-step', () => ({
  RecencyStep: ({ onComplete }: any) => (
    <div data-testid="recency-step">
      <button onClick={() => onComplete('recent')}>Select Recent</button>
    </div>
  ),
}));

vi.mock('@/components/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

vi.mock('@/components/content-display-with-query', () => ({
  ContentDisplayWithQuery: ({ preferences, onBackToPreferences }: any) => (
    <div data-testid="content-display">
      <div>Country: {preferences.country}</div>
      <div>Genres: {preferences.genres.join(', ')}</div>
      <div>Recency: {preferences.recency}</div>
      <button onClick={onBackToPreferences}>Back to Preferences</button>
    </div>
  ),
}));

vi.mock('@/hooks/use-tmdb', () => ({
  tmdbPrefetch: {
    movieGenres: vi.fn(),
    tvGenres: vi.fn(),
    trending: vi.fn().mockResolvedValue(undefined),
  },
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

describe('TMDB Integration Flow - Simplified', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete the full user flow from location to results', async () => {
    render(<SearchPage />, { wrapper: createWrapper() });

    // Step 1: Location selection
    expect(screen.getByTestId('location-step')).toBeInTheDocument();
    fireEvent.click(screen.getByText('United States'));

    // Step 2: Genre selection
    await waitFor(() => {
      expect(screen.getByTestId('genre-step')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Select Action'));

    // Step 3: Recency selection
    await waitFor(() => {
      expect(screen.getByTestId('recency-step')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Select Recent'));

    // Loading screen
    await waitFor(() => {
      expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    });

    // Step 4: Results display
    await waitFor(
      () => {
        expect(screen.getByTestId('content-display')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify preferences were passed correctly
    expect(screen.getByText('Country: US')).toBeInTheDocument();
    expect(screen.getByText('Genres: action')).toBeInTheDocument();
    expect(screen.getByText('Recency: recent')).toBeInTheDocument();
  });

  it('should allow navigating back from results to genres step', async () => {
    render(<SearchPage />, { wrapper: createWrapper() });

    // Navigate to results
    fireEvent.click(screen.getByText('United States'));
    await waitFor(() => screen.getByTestId('genre-step'));
    fireEvent.click(screen.getByText('Select Action'));
    await waitFor(() => screen.getByTestId('recency-step'));
    fireEvent.click(screen.getByText('Select Recent'));

    // Wait for results
    await waitFor(
      () => {
        expect(screen.getByTestId('content-display')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Navigate back
    fireEvent.click(screen.getByText('Back to Preferences'));

    await waitFor(() => {
      expect(screen.getByTestId('genre-step')).toBeInTheDocument();
    });
  });

  it('should prefetch genre data on mount', async () => {
    const { tmdbPrefetch } = await import('@/hooks/use-tmdb');

    render(<SearchPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(tmdbPrefetch.movieGenres).toHaveBeenCalled();
      expect(tmdbPrefetch.tvGenres).toHaveBeenCalled();
    });
  });

  it('should prefetch trending data before showing results', async () => {
    const { tmdbPrefetch } = await import('@/hooks/use-tmdb');

    render(<SearchPage />, { wrapper: createWrapper() });

    // Navigate to recency step
    fireEvent.click(screen.getByText('United States'));
    await waitFor(() => screen.getByTestId('genre-step'));
    fireEvent.click(screen.getByText('Select Action'));
    await waitFor(() => screen.getByTestId('recency-step'));

    // Select recency - this should trigger trending prefetch
    fireEvent.click(screen.getByText('Select Recent'));

    await waitFor(() => {
      expect(tmdbPrefetch.trending).toHaveBeenCalled();
    });
  });
});
