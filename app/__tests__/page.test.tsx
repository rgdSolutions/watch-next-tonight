import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Home from '../page';

// Mock the child components
vi.mock('@/components/location-step', () => ({
  LocationStep: ({ onComplete }: any) => (
    <div data-testid="location-step">
      <button onClick={() => onComplete('US')}>Select US</button>
    </div>
  ),
}));

vi.mock('@/components/genre-step', () => ({
  GenreStep: ({ onComplete }: any) => (
    <div data-testid="genre-step">
      <button onClick={() => onComplete(['action', 'comedy'])}>Select Genres</button>
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
  LoadingScreen: ({ preferences }: any) => (
    <div data-testid="loading-screen">Loading for {preferences.country}...</div>
  ),
}));

vi.mock('@/components/content-display-with-query', () => ({
  ContentDisplayWithQuery: ({ preferences, onBackToPreferences }: any) => (
    <div data-testid="content-display">
      <div>Country: {preferences.country}</div>
      <div>Genres: {preferences.genres.join(', ')}</div>
      <div>Recency: {preferences.recency}</div>
      <button onClick={onBackToPreferences}>Back</button>
    </div>
  ),
}));

// Mock the TMDB hooks
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

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the title and subtitle', () => {
    render(<Home />, { wrapper: createWrapper() });

    expect(screen.getByText('Watch Next Tonight')).toBeInTheDocument();
    expect(
      screen.getByText('Find your perfect movie or show in just a few clicks')
    ).toBeInTheDocument();
  });

  it('should start with location step', () => {
    render(<Home />, { wrapper: createWrapper() });

    expect(screen.getByTestId('location-step')).toBeInTheDocument();
    expect(screen.queryByTestId('genre-step')).not.toBeInTheDocument();
  });

  it('should progress through all steps', async () => {
    render(<Home />, { wrapper: createWrapper() });

    // Step 1: Location
    expect(screen.getByTestId('location-step')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Select US'));

    // Step 2: Genres
    await waitFor(() => {
      expect(screen.getByTestId('genre-step')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Select Genres'));

    // Step 3: Recency
    await waitFor(() => {
      expect(screen.getByTestId('recency-step')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Select Recent'));

    // Loading screen
    await waitFor(() => {
      expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
      expect(screen.getByText('Loading for US...')).toBeInTheDocument();
    });

    // Step 4: Results
    await waitFor(() => {
      expect(screen.getByTestId('content-display')).toBeInTheDocument();
      expect(screen.getByText('Country: US')).toBeInTheDocument();
      expect(screen.getByText('Genres: action, comedy')).toBeInTheDocument();
      expect(screen.getByText('Recency: recent')).toBeInTheDocument();
    });
  });

  it('should show back button on recency step', async () => {
    render(<Home />, { wrapper: createWrapper() });

    // Navigate to recency step
    fireEvent.click(screen.getByText('Select US'));
    await waitFor(() => screen.getByTestId('genre-step'));
    fireEvent.click(screen.getByText('Select Genres'));

    await waitFor(() => {
      expect(screen.getByTestId('recency-step')).toBeInTheDocument();
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toBeInTheDocument();
    });

    // Click back to go to genres
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    await waitFor(() => {
      expect(screen.getByTestId('genre-step')).toBeInTheDocument();
    });
  });

  it('should show back button on results and allow going back to recency', async () => {
    render(<Home />, { wrapper: createWrapper() });

    // Navigate to results
    fireEvent.click(screen.getByText('Select US'));
    await waitFor(() => screen.getByTestId('genre-step'));
    fireEvent.click(screen.getByText('Select Genres'));
    await waitFor(() => screen.getByTestId('recency-step'));
    fireEvent.click(screen.getByText('Select Recent'));

    // Wait for loading screen to appear and disappear
    await waitFor(() => {
      expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    });

    // Wait for results
    await waitFor(
      () => {
        expect(screen.getByTestId('content-display')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click back in content display - use getAllByText since there are multiple Back buttons
    const backButtons = screen.getAllByText('Back');
    fireEvent.click(backButtons[1]); // Click the back button in content display

    await waitFor(() => {
      expect(screen.getByTestId('recency-step')).toBeInTheDocument();
    });
  });

  it('should prefetch genre data on mount', async () => {
    const { tmdbPrefetch } = await import('@/hooks/use-tmdb');

    render(<Home />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(tmdbPrefetch.movieGenres).toHaveBeenCalled();
      expect(tmdbPrefetch.tvGenres).toHaveBeenCalled();
    });
  });

  it('should prefetch trending content before showing results', async () => {
    const { tmdbPrefetch } = await import('@/hooks/use-tmdb');

    render(<Home />, { wrapper: createWrapper() });

    // Navigate to recency step
    fireEvent.click(screen.getByText('Select US'));
    await waitFor(() => screen.getByTestId('genre-step'));
    fireEvent.click(screen.getByText('Select Genres'));
    await waitFor(() => screen.getByTestId('recency-step'));

    // Select recency - this should trigger trending prefetch
    fireEvent.click(screen.getByText('Select Recent'));

    await waitFor(() => {
      expect(tmdbPrefetch.trending).toHaveBeenCalled();
    });
  });

  it('should maintain preferences state through navigation', async () => {
    render(<Home />, { wrapper: createWrapper() });

    // Set preferences through steps
    fireEvent.click(screen.getByText('Select US'));
    await waitFor(() => screen.getByTestId('genre-step'));
    fireEvent.click(screen.getByText('Select Genres'));
    await waitFor(() => screen.getByTestId('recency-step'));
    fireEvent.click(screen.getByText('Select Recent'));

    // Wait for loading screen to appear and disappear
    await waitFor(() => {
      expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    });

    // Wait for results
    await waitFor(
      () => {
        expect(screen.getByTestId('content-display')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Go back and forward again - use getAllByText since there are multiple Back buttons
    const backButtons = screen.getAllByText('Back');
    fireEvent.click(backButtons[1]); // Click the back button in content display
    await waitFor(() => screen.getByTestId('recency-step'));
    fireEvent.click(screen.getByText('Select Recent'));

    // Wait for loading screen again
    await waitFor(() => {
      expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    });

    // Preferences should still be maintained
    await waitFor(
      () => {
        expect(screen.getByText('Country: US')).toBeInTheDocument();
        expect(screen.getByText('Genres: action, comedy')).toBeInTheDocument();
        expect(screen.getByText('Recency: recent')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
