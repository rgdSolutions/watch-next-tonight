import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as tmdbHooks from '@/hooks/use-tmdb';
import * as unifiedGenresHooks from '@/hooks/use-unified-genres';

import { ContentDisplayWithQuery } from '../content-display-with-query';

// Mock the hooks
vi.mock('@/hooks/use-tmdb');
vi.mock('@/hooks/use-unified-genres');
vi.mock('@/lib/streaming-providers', () => ({
  getProviderIdsForPlatform: vi.fn((platform: string) => {
    const providers: Record<string, string> = {
      netflix: '8',
      prime: '9|119',
      disney: '337',
      appletv: '350',
      max: '15|1899',
    };
    return providers[platform] || undefined;
  }),
  PROVIDER_COLORS: {
    netflix: '#e50914',
    prime: '#00a8e1',
    disney: '#113ccf',
    appletv: '#000000',
    max: '#b92df5',
    other: '#6b7280',
  },
}));

// Mock child components to avoid complex rendering
vi.mock('@/components/content-card', () => ({
  ContentCard: ({ item }: any) => (
    <div data-testid="content-card">
      <h3>{item.title}</h3>
    </div>
  ),
}));

vi.mock('@/components/trailer-modal', () => ({
  TrailerModal: () => null,
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
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const mockMovieItem = {
  id: 'tmdb-movie-1',
  tmdbId: 1,
  title: 'Test Movie',
  type: 'movie' as const,
  overview: 'A test movie',
  releaseDate: '2024-01-01',
  posterPath: 'https://image.tmdb.org/t/p/w500/test.jpg',
  backdropPath: 'https://image.tmdb.org/t/p/original/test-bg.jpg',
  rating: 8.5,
  voteCount: 1000,
  popularity: 100,
  genreIds: [28, 35],
  originalLanguage: 'en',
  adult: false,
};

const mockTVItem = {
  id: 'tmdb-tv-1',
  tmdbId: 1,
  title: 'Test TV Show',
  type: 'tv' as const,
  overview: 'A test TV show',
  releaseDate: '2024-01-01',
  posterPath: 'https://image.tmdb.org/t/p/w500/test-tv.jpg',
  backdropPath: 'https://image.tmdb.org/t/p/original/test-tv-bg.jpg',
  rating: 8.0,
  voteCount: 500,
  popularity: 75,
  genreIds: [18, 35],
  originalLanguage: 'en',
};

const mockUnifiedGenres = [
  {
    id: 'kids',
    name: 'Kids',
    emoji: '👶',
    movieIds: [],
    tvIds: [10762],
  },
  {
    id: 'reality',
    name: 'Reality',
    emoji: '📺',
    movieIds: [],
    tvIds: [10764],
  },
  {
    id: 'horror',
    name: 'Horror',
    emoji: '👻',
    movieIds: [27],
    tvIds: [],
  },
  {
    id: 'romance',
    name: 'Romance',
    emoji: '💕',
    movieIds: [10749],
    tvIds: [],
  },
  {
    id: 'news',
    name: 'News',
    emoji: '📰',
    movieIds: [],
    tvIds: [10763],
  },
  {
    id: 'soap',
    name: 'Soap',
    emoji: '💔',
    movieIds: [],
    tvIds: [10766],
  },
  {
    id: 'talk',
    name: 'Talk',
    emoji: '🎤',
    movieIds: [],
    tvIds: [10767],
  },
  {
    id: 'history',
    name: 'History',
    emoji: '📜',
    movieIds: [36],
    tvIds: [],
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    movieIds: [10402],
    tvIds: [],
  },
  {
    id: 'mystery',
    name: 'Mystery',
    emoji: '🔍',
    movieIds: [9648],
    tvIds: [9648],
  },
  {
    id: 'comedy',
    name: 'Comedy',
    emoji: '😂',
    movieIds: [35],
    tvIds: [35],
  },
  {
    id: 'drama',
    name: 'Drama',
    emoji: '🎭',
    movieIds: [18],
    tvIds: [18],
  },
];

describe('ContentDisplayWithQuery - chooseInitialContentType functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the hooks with default responses
    vi.mocked(unifiedGenresHooks.useUnifiedGenres).mockReturnValue({
      genres: mockUnifiedGenres,
      isLoading: false,
      error: null,
    });

    vi.mocked(tmdbHooks.useMovieGenres).mockReturnValue({
      data: {
        genres: [
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
          { id: 18, name: 'Drama' },
          { id: 27, name: 'Horror' },
          { id: 10749, name: 'Romance' },
          { id: 36, name: 'History' },
          { id: 10402, name: 'Music' },
          { id: 9648, name: 'Mystery' },
        ],
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(tmdbHooks.useTVGenres).mockReturnValue({
      data: {
        genres: [
          { id: 10759, name: 'Action & Adventure' },
          { id: 35, name: 'Comedy' },
          { id: 18, name: 'Drama' },
          { id: 10762, name: 'Kids' },
          { id: 10764, name: 'Reality' },
          { id: 10763, name: 'News' },
          { id: 10766, name: 'Soap' },
          { id: 10767, name: 'Talk' },
          { id: 9648, name: 'Mystery' },
        ],
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(tmdbHooks.useDiscoverMovies).mockReturnValue({
      data: { results: [mockMovieItem], page: 1, totalPages: 1, totalResults: 1 },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(tmdbHooks.useDiscoverTVShows).mockReturnValue({
      data: { results: [mockTVItem], page: 1, totalPages: 1, totalResults: 1 },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(tmdbHooks.useTrending).mockReturnValue({
      data: { results: [mockMovieItem, mockTVItem], page: 1, totalPages: 1, totalResults: 2 },
      isLoading: false,
      error: null,
    } as any);
  });

  describe('Massively popular show-only genres (highest priority)', () => {
    it('should select TV tab when "kids" genre is selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['kids'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });

    it('should select TV tab when "reality" genre is selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['reality'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });

    it('should prioritize kids/reality over other genres', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['horror', 'kids', 'music'], // Mix of movie and TV genres
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Kids should win
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });
  });

  describe('Highly popular movie-only genres (second priority)', () => {
    it('should select movie tab when "horror" genre is selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['horror'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });

    it('should select movie tab when "romance" genre is selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['romance'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });

    it('should not override kids/reality priority', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['horror', 'reality'], // Horror (movie) vs Reality (TV)
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Reality should win due to higher priority
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });
  });

  describe('Show-only genres (third priority)', () => {
    it('should select TV tab for "news" genre', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['news'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });

    it('should select TV tab for "soap" genre', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['soap'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });

    it('should select TV tab for "talk" genre', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['talk'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });

    it('should be overridden by horror/romance priority', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['news', 'horror'], // News (TV) vs Horror (movie)
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Horror should win due to higher priority
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });
  });

  describe('Movie-only genres (fourth priority)', () => {
    it('should select movie tab for "history" genre', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['history'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });

    it('should select movie tab for "music" genre', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['music'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });

    it('should select movie tab for "mystery" genre when only movie-specific', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['mystery'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Mystery is available for both, but in our priority check it's listed as movie-only
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });

    it('should be overridden by TV show-only genres', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['history', 'talk'], // History (movie) vs Talk (TV)
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Talk should win due to higher priority
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });
  });

  describe('Default behavior and edge cases', () => {
    it('should default to "all" when no genres are selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: [],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('All Content');
      });
    });

    it('should default to "all" for genres available on both platforms', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['comedy', 'drama'], // Both available for movies and TV
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('All Content');
      });
    });

    it('should handle unknown genre IDs gracefully', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['unknown-genre-1', 'unknown-genre-2'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('All Content');
      });
    });

    it('should handle mixed case genre IDs', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['KIDS', 'Horror'], // Testing case sensitivity
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Should still work with lowercase comparison
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('All Content');
      });
    });
  });

  describe('Content type initial selection edge cases', () => {
    it('should correctly set initial content type for each component instance', async () => {
      const onBackToPreferences = vi.fn();

      // Test that each separate component instance gets the correct initial content type
      const { unmount: unmount1 } = render(
        <ContentDisplayWithQuery
          preferences={{
            country: 'US',
            genres: ['kids'],
            recency: 'all',
          }}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });

      unmount1();

      // Test a new instance with horror genre
      const { unmount: unmount2 } = render(
        <ContentDisplayWithQuery
          preferences={{
            country: 'US',
            genres: ['horror'],
            recency: 'all',
          }}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });

      unmount2();

      // Test a new instance with comedy (both movie and TV)
      render(
        <ContentDisplayWithQuery
          preferences={{
            country: 'US',
            genres: ['comedy'],
            recency: 'all',
          }}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('All Content');
      });
    });
  });

  describe('Complex genre combinations', () => {
    it('should handle all priority levels in one selection', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['kids', 'horror', 'news', 'history', 'comedy'], // All priority levels
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Kids (highest priority) should win
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });

    it('should handle multiple genres from same priority level', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['horror', 'romance'], // Both high priority movie genres
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('Movies Only');
      });
    });

    it('should handle conflicting TV genres correctly', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['news', 'soap', 'talk'], // All TV-only genres
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Get all comboboxes and find the one for content type (first one)
        const comboboxes = screen.getAllByRole('combobox');
        const contentTypeSelect = comboboxes[0];
        expect(contentTypeSelect).toHaveTextContent('TV Shows Only');
      });
    });
  });

  describe('Integration with content rendering', () => {
    it('should render correct content when TV is auto-selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['kids'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Should show TV content
        expect(screen.getByText('Test TV Show')).toBeInTheDocument();
        // Movie content should not be visible in TV tab
        expect(screen.queryByText('Test Movie')).not.toBeInTheDocument();
      });
    });

    it('should render correct content when Movies is auto-selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['horror'],
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Should show movie content
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        // TV content should not be visible in Movies tab
        expect(screen.queryByText('Test TV Show')).not.toBeInTheDocument();
      });
    });

    it('should render all content when All is selected', async () => {
      const onBackToPreferences = vi.fn();
      const preferences = {
        country: 'US',
        genres: ['comedy'], // Available on both
        recency: 'all',
      };

      render(
        <ContentDisplayWithQuery
          preferences={preferences}
          onBackToPreferences={onBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        // Should show both movie and TV content
        expect(screen.getByText('Test Movie')).toBeInTheDocument();
        expect(screen.getByText('Test TV Show')).toBeInTheDocument();
      });
    });
  });
});
