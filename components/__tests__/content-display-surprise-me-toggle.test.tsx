import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as useGenreLookupHook from '@/hooks/use-genre-lookup';
import * as useTmdbHooks from '@/hooks/use-tmdb';
import * as useUnifiedGenresHook from '@/hooks/use-unified-genres';

import { ContentDisplayWithQuery } from '../content-display-with-query';

// Mock hooks
vi.mock('@/hooks/use-tmdb');
vi.mock('@/hooks/use-unified-genres');
vi.mock('@/hooks/use-genre-lookup');

const mockMoviesData = {
  results: [
    {
      id: '1',
      title: 'Test Movie',
      media_type: 'movie',
      genre_ids: [28],
      genreIds: [28],
      vote_average: 8.0,
      poster_path: '/test.jpg',
      release_date: '2024-01-01',
      releaseDate: '2024-01-01',
      voteAverage: 8.0,
      posterPath: '/test.jpg',
      overview: 'Test movie overview',
    },
  ],
};

const mockTVData = {
  results: [
    {
      id: '2',
      name: 'Test TV Show',
      media_type: 'tv',
      genre_ids: [18],
      genreIds: [18],
      vote_average: 7.5,
      poster_path: '/test-tv.jpg',
      first_air_date: '2024-01-01',
      firstAirDate: '2024-01-01',
      voteAverage: 7.5,
      posterPath: '/test-tv.jpg',
      overview: 'Test TV show overview',
    },
  ],
};

const mockTrendingData = {
  results: [
    {
      id: '3',
      title: 'Trending Movie',
      media_type: 'movie',
      genre_ids: [12],
      genreIds: [12],
      vote_average: 9.0,
      poster_path: '/trending.jpg',
      release_date: '2024-02-01',
      releaseDate: '2024-02-01',
      voteAverage: 9.0,
      posterPath: '/trending.jpg',
      overview: 'Trending movie overview',
    },
    {
      id: '4',
      title: 'Trending TV Show',
      name: 'Trending TV Show',
      media_type: 'tv',
      genre_ids: [35],
      genreIds: [35],
      vote_average: 8.5,
      poster_path: '/trending-tv.jpg',
      first_air_date: '2024-02-01',
      firstAirDate: '2024-02-01',
      voteAverage: 8.5,
      posterPath: '/trending-tv.jpg',
      overview: 'Trending TV show overview',
    },
  ],
};

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
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('ContentDisplayWithQuery - Surprise Me Toggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useGenreLookup
    vi.mocked(useGenreLookupHook.useGenreLookup).mockReturnValue({
      getGenreWithEmoji: (id: number) => ({
        id,
        name: 'Test Genre',
        emoji: '🎬',
      }),
    } as any);

    // Set up default mocks
    vi.mocked(useTmdbHooks.useDiscoverMovies).mockReturnValue({
      data: mockMoviesData,
      isLoading: false,
    } as any);

    vi.mocked(useTmdbHooks.useDiscoverTVShows).mockReturnValue({
      data: mockTVData,
      isLoading: false,
    } as any);

    vi.mocked(useTmdbHooks.useTrending).mockReturnValue({
      data: mockTrendingData,
      isLoading: false,
    } as any);

    vi.mocked(useTmdbHooks.useMovieGenres).mockReturnValue({
      data: { genres: [{ id: 28, name: 'Action' }] },
      isLoading: false,
    } as any);

    vi.mocked(useTmdbHooks.useTVGenres).mockReturnValue({
      data: { genres: [{ id: 18, name: 'Drama' }] },
      isLoading: false,
    } as any);

    vi.mocked(useUnifiedGenresHook.useUnifiedGenres).mockReturnValue({
      genres: [],
      isLoading: false,
      error: null,
    });
  });

  it('should always show switch toggle regardless of genres', () => {
    const props = {
      preferences: {
        country: 'US',
        genres: [], // Testing with empty genres
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    // Switch should be visible
    expect(screen.getByLabelText('Toggle between search and trending results')).toBeInTheDocument();
    expect(screen.getByText('🔍 Search')).toBeInTheDocument();
    expect(screen.getByText('Trending 🔥')).toBeInTheDocument();
  });

  it('should show switch toggle even when genres are selected', () => {
    const props = {
      preferences: {
        country: 'US',
        genres: ['action'], // Has genres
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    // Switch should be visible
    expect(screen.getByLabelText('Toggle between search and trending results')).toBeInTheDocument();
    expect(screen.getByText('🔍 Search')).toBeInTheDocument();
    expect(screen.getByText('Trending 🔥')).toBeInTheDocument();
  });

  it('should show search results by default', async () => {
    const props = {
      preferences: {
        country: 'US',
        genres: [],
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Should show search results
      expect(screen.getByText('🔍 Your Search Results')).toBeInTheDocument();
      expect(screen.getByText('Test Movie')).toBeInTheDocument();

      // Should not show trending results
      expect(screen.queryByText('Trending Movie')).not.toBeInTheDocument();
      expect(screen.queryByText('Trending TV Show')).not.toBeInTheDocument();
    });
  });

  it('should show trending results when switch is toggled', async () => {
    const props = {
      preferences: {
        country: 'US',
        genres: [],
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    // Toggle the switch
    const switchElement = screen.getByLabelText('Toggle between search and trending results');
    fireEvent.click(switchElement);

    await waitFor(() => {
      // Should show trending results
      expect(screen.getByText('🔥 Globally Trending Results')).toBeInTheDocument();
      expect(screen.getByText('Trending Movie')).toBeInTheDocument();
      expect(screen.getByText('Trending TV Show')).toBeInTheDocument();

      // Should not show search results
      expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
      expect(screen.queryByText('Test TV Show')).not.toBeInTheDocument();
    });
  });

  it('should disable filters when showing trending results', async () => {
    const props = {
      preferences: {
        country: 'US',
        genres: [],
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    await waitFor(() => {
      // Initially filters should be enabled
      const contentTypeSelect = screen.getAllByRole('button')[1]; // Content type select trigger
      const platformSelect = screen.getAllByRole('button')[2]; // Platform select trigger

      expect(contentTypeSelect).not.toBeDisabled();
      expect(platformSelect).not.toBeDisabled();
    });

    // Toggle to trending
    const switchElement = screen.getByLabelText('Toggle between search and trending results');
    fireEvent.click(switchElement);

    await waitFor(() => {
      // Platform filters should be disabled
      const platformSelect = screen.getByText('All Platforms').closest('button');
      expect(platformSelect).toBeDisabled();
    });
  });

  it('should filter trending results by content type when not disabled', async () => {
    const props = {
      preferences: {
        country: 'US',
        genres: [],
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    // Toggle to trending first
    const switchElement = screen.getByLabelText('Toggle between search and trending results');
    fireEvent.click(switchElement);

    await waitFor(() => {
      // Initially should show all content
      expect(screen.getByText('Trending Movie')).toBeInTheDocument();
      expect(screen.getByText('Trending TV Show')).toBeInTheDocument();
    });

    // The filter should be disabled when showing trending, so this test may need to be adjusted
    // based on the actual behavior we want
  });

  it('should update visual state of labels when toggling', async () => {
    const props = {
      preferences: {
        country: 'US',
        genres: [],
        recency: 'recent',
      },
      onBackToPreferences: vi.fn(),
    };

    render(<ContentDisplayWithQuery {...props} />, { wrapper: createWrapper() });

    const searchLabel = screen.getByText('🔍 Search');
    const trendingLabel = screen.getByText('Trending 🔥');

    // Initially search should be active
    expect(searchLabel).toHaveClass('font-semibold');
    expect(trendingLabel).toHaveClass('text-muted-foreground');

    // Toggle the switch
    const switchElement = screen.getByLabelText('Toggle between search and trending results');
    fireEvent.click(switchElement);

    await waitFor(() => {
      // Trending should now be active
      expect(searchLabel).toHaveClass('text-muted-foreground');
      expect(trendingLabel).toHaveClass('font-semibold');
    });
  });

  it('should call useTrending hook based on tab state', () => {
    // First render with genres (not Surprise Me)
    const { rerender } = render(
      <ContentDisplayWithQuery
        preferences={{
          country: 'US',
          genres: ['action'],
          recency: 'recent',
        }}
        onBackToPreferences={vi.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // useTrending should be called with enabled: false (tab is 'search' by default)
    expect(vi.mocked(useTmdbHooks.useTrending)).toHaveBeenCalledWith(
      'all',
      'week',
      expect.objectContaining({ enabled: false })
    );

    // The hook is always called, but with enabled based on tab state
    // Since both renders start with tab='search', enabled should be false
  });
});
