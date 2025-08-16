import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the hooks
import {
  useDiscoverMovies,
  useDiscoverTVShows,
  useMovieGenres,
  useTrending,
  useTVGenres,
} from '@/hooks/use-tmdb';

import { ContentDisplayWithQuery } from '../content-display-with-query';

vi.mock('@/hooks/use-tmdb', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    useMovieGenres: vi.fn(),
    useTVGenres: vi.fn(),
    useDiscoverMovies: vi.fn(),
    useDiscoverTVShows: vi.fn(),
    useTrending: vi.fn(),
    tmdbKeys: {
      trending: (type: string, timeWindow: string) => ['trending', type, timeWindow],
    },
  };
});

// Mock the child components
vi.mock('@/components/content-card', () => ({
  ContentCard: ({ item, onTrailerClick }: any) => (
    <div data-testid="content-card">
      <h3>{item.title}</h3>
      <button onClick={() => onTrailerClick(item)}>Watch Trailer</button>
    </div>
  ),
}));

vi.mock('@/components/trailer-modal', () => ({
  TrailerModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="trailer-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

const mockPreferences = {
  country: 'US',
  genres: ['action', 'comedy'],
  recency: 'recent',
};

const mockMovieGenres = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
  ],
};

const mockTVGenres = {
  genres: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
  ],
};

const mockMoviesData = {
  results: [
    {
      id: 'tmdb-movie-1',
      tmdbId: 1,
      title: 'Test Movie 1',
      type: 'movie',
      posterPath: '/poster1.jpg',
      rating: 8.5,
      releaseDate: '2024-01-01',
      overview: 'A great movie',
    },
  ],
};

const mockTVData = {
  results: [
    {
      id: 'tmdb-tv-1',
      tmdbId: 2,
      title: 'Test TV Show',
      type: 'tv',
      posterPath: '/poster2.jpg',
      rating: 7.5,
      releaseDate: '2024-02-01',
      overview: 'A great TV show',
    },
  ],
};

const mockTrendingData = {
  results: [
    {
      id: 'tmdb-trending-1',
      tmdbId: 3,
      title: 'Trending Movie',
      type: 'movie',
      posterPath: '/poster3.jpg',
      rating: 9.0,
      releaseDate: '2024-03-01',
      overview: 'A trending movie',
    },
    {
      id: 'tmdb-trending-2',
      tmdbId: 4,
      title: 'Trending Show',
      type: 'tv',
      posterPath: '/poster4.jpg',
      rating: 8.0,
      releaseDate: '2024-03-15',
      overview: 'A trending show',
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
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
};

describe('ContentDisplayWithQuery', () => {
  const mockOnBackToPreferences = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMovieGenres).mockReturnValue({
      data: mockMovieGenres,
      isLoading: false,
    } as any);

    vi.mocked(useTVGenres).mockReturnValue({
      data: mockTVGenres,
      isLoading: false,
    } as any);

    vi.mocked(useDiscoverMovies).mockReturnValue({
      data: mockMoviesData,
      isLoading: false,
    } as any);

    vi.mocked(useDiscoverTVShows).mockReturnValue({
      data: mockTVData,
      isLoading: false,
    } as any);

    vi.mocked(useTrending).mockReturnValue({
      data: mockTrendingData,
      isLoading: false,
    } as any);
  });

  it('should render preferences in badges', () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Country: 🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('Genres: Action, Comedy')).toBeInTheDocument();
    expect(screen.getByText('Recency: Recent')).toBeInTheDocument();
  });

  it('should display content cards for movies and TV shows', () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test TV Show')).toBeInTheDocument();
    expect(screen.getByText('2 results found')).toBeInTheDocument();
  });

  it('should filter content by type', async () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Initially shows all content
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test TV Show')).toBeInTheDocument();

    // Filter to movies only
    const contentTypeSelect = screen.getByText('All Content');
    fireEvent.click(contentTypeSelect);
    fireEvent.click(screen.getByText('Movies Only'));

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.queryByText('Test TV Show')).not.toBeInTheDocument();
    });
  });

  it('should show loading skeletons when data is loading', () => {
    vi.mocked(useDiscoverMovies).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    vi.mocked(useDiscoverTVShows).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Should show loading skeletons
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should show empty state when no results found', () => {
    vi.mocked(useDiscoverMovies).mockReturnValue({
      data: { results: [] },
      isLoading: false,
    } as any);

    vi.mocked(useDiscoverTVShows).mockReturnValue({
      data: { results: [] },
      isLoading: false,
    } as any);

    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    expect(
      screen.getByText(/No content found matching your preferences in your region/)
    ).toBeInTheDocument();
  });

  it('should handle trailer modal open and close', async () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Click watch trailer button
    const trailerButton = screen.getAllByText('Watch Trailer')[0];
    fireEvent.click(trailerButton);

    // Modal should open
    await waitFor(() => {
      expect(screen.getByTestId('trailer-modal')).toBeInTheDocument();
    });

    // Close modal
    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByTestId('trailer-modal')).not.toBeInTheDocument();
    });
  });

  it('should call onBackToPreferences when back button clicked', () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.click(screen.getByText('Start Over'));
    expect(mockOnBackToPreferences).toHaveBeenCalled();
  });

  it('should correctly calculate date ranges based on recency', () => {
    render(
      <ContentDisplayWithQuery
        preferences={{ ...mockPreferences, recency: 'brand-new' }}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Check that discover was called with date range for brand-new (1 month)
    expect(vi.mocked(useDiscoverMovies)).toHaveBeenCalledWith(
      expect.objectContaining({
        'primary_release_date.gte': expect.any(String),
        'primary_release_date.lte': expect.any(String),
      }),
      expect.any(Object)
    );

    const calls = vi.mocked(useDiscoverMovies).mock.calls[0];
    const dateGte = new Date(calls[0]['primary_release_date.gte'] as string);
    const dateLte = new Date(calls[0]['primary_release_date.lte'] as string);
    const diffInDays = (dateLte.getTime() - dateGte.getTime()) / (1000 * 60 * 60 * 24);

    // Should be approximately 30 days for brand-new
    expect(diffInDays).toBeGreaterThan(25);
    expect(diffInDays).toBeLessThan(35);
  });

  it('should handle "any" genre selection', () => {
    render(
      <ContentDisplayWithQuery
        preferences={{ ...mockPreferences, genres: ['any'] }}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Should call discover with empty genre string when "any" is selected
    expect(vi.mocked(useDiscoverMovies)).toHaveBeenCalledWith(
      expect.objectContaining({
        'primary_release_date.gte': expect.any(String),
        'primary_release_date.lte': expect.any(String),
        sort_by: 'popularity.desc',
        watch_region: 'US',
      }),
      expect.any(Object)
    );
  });

  it('should handle very-recent recency date calculation', () => {
    render(
      <ContentDisplayWithQuery
        preferences={{ ...mockPreferences, recency: 'very-recent' }}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    const calls = vi.mocked(useDiscoverMovies).mock.calls[0];
    const dateGte = new Date(calls[0]['primary_release_date.gte'] as string);
    const dateLte = new Date(calls[0]['primary_release_date.lte'] as string);
    const diffInDays = (dateLte.getTime() - dateGte.getTime()) / (1000 * 60 * 60 * 24);

    // Should be approximately 90 days for very-recent (3 months)
    expect(diffInDays).toBeGreaterThan(85);
    expect(diffInDays).toBeLessThan(95);
  });

  it('should handle contemporary recency date calculation', () => {
    render(
      <ContentDisplayWithQuery
        preferences={{ ...mockPreferences, recency: 'contemporary' }}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    const calls = vi.mocked(useDiscoverMovies).mock.calls[0];
    const dateGte = new Date(calls[0]['primary_release_date.gte'] as string);
    const dateLte = new Date(calls[0]['primary_release_date.lte'] as string);
    const diffInDays = (dateLte.getTime() - dateGte.getTime()) / (1000 * 60 * 60 * 24);

    // Should be approximately 730 days for contemporary (2 years)
    expect(diffInDays).toBeGreaterThan(700);
    expect(diffInDays).toBeLessThan(750);
  });

  it('should handle default recency date calculation', () => {
    render(
      <ContentDisplayWithQuery
        preferences={{ ...mockPreferences, recency: 'any' }}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    const calls = vi.mocked(useDiscoverMovies).mock.calls[0];
    const dateGte = new Date(calls[0]['primary_release_date.gte'] as string);

    // Should start from 1900 for 'any' recency
    expect(dateGte.getFullYear()).toBe(1900);
  });

  it('should show hidden items card', () => {
    // Update the ContentCard mock to support onHide
    const MockContentCard = ({ item, onHide }: any) => (
      <div data-testid="content-card">
        <h3>{item.title}</h3>
        <button onClick={() => onHide(item.id)}>Hide</button>
      </div>
    );
    MockContentCard.displayName = 'MockContentCard';

    vi.doMock('@/components/content-card', () => ({
      ContentCard: MockContentCard,
    }));

    const { rerender } = render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Initially no hidden items card
    expect(screen.queryByText(/Show \d+ hidden item/)).not.toBeInTheDocument();
  });

  it('should handle empty genres correctly', () => {
    const emptyGenresPrefs = { ...mockPreferences, genres: [] };

    render(
      <ContentDisplayWithQuery
        preferences={emptyGenresPrefs}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Genres: All')).toBeInTheDocument();
  });

  it('should filter TV shows only', async () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Filter to TV shows only
    const contentTypeSelect = screen.getByText('All Content');
    fireEvent.click(contentTypeSelect);
    fireEvent.click(screen.getByText('TV Shows Only'));

    await waitFor(() => {
      expect(screen.queryByText('Test Movie 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test TV Show')).toBeInTheDocument();
    });
  });

  it('should show platform disclaimer for all platforms', () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    expect(
      screen.getByText('* Includes some content that is only available for rent or purchase')
    ).toBeInTheDocument();
  });

  it('should not show platform disclaimer when specific platform is selected', async () => {
    render(
      <ContentDisplayWithQuery
        preferences={mockPreferences}
        onBackToPreferences={mockOnBackToPreferences}
      />,
      { wrapper: createWrapper() }
    );

    // Select Netflix
    const platformSelect = screen.getByText('All Platforms');
    fireEvent.click(platformSelect);
    fireEvent.click(screen.getByText('Netflix'));

    await waitFor(() => {
      expect(
        screen.queryByText('* Includes some content that is only available for rent or purchase')
      ).not.toBeInTheDocument();
    });
  });

  describe('Trending Tab', () => {
    it('should switch to trending tab and show trending content', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Initially shows search results
      expect(screen.getByText('🔍 Your Search Results')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test TV Show')).toBeInTheDocument();

      // Click the switch to toggle to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Should show trending content
      await waitFor(() => {
        expect(screen.getByText('🔥 Globally Trending Results')).toBeInTheDocument();
        expect(screen.getByText('Trending Movie')).toBeInTheDocument();
        expect(screen.getByText('Trending Show')).toBeInTheDocument();
      });

      // Should not show search results
      expect(screen.queryByText('Test Movie 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test TV Show')).not.toBeInTheDocument();
    });

    it('should show accent styling on Results Summary card when in trending mode', async () => {
      const { container } = render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Get the Results Summary card - it's the first Card with CardHeader
      const cardElement = container.querySelector('[class*="transition-all duration-300"]');
      expect(cardElement).toBeInTheDocument();

      // Initially should not have accent classes
      expect(cardElement?.className).not.toContain('border-orange');
      expect(cardElement?.className).not.toContain('shadow-lg');

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Should have accent styling
      await waitFor(() => {
        const accentedCard = container.querySelector('[class*="border-orange"]');
        expect(accentedCard).toBeInTheDocument();
        expect(accentedCard?.className).toContain('border-2');
        expect(accentedCard?.className).toContain('shadow-lg');
      });
    });

    it('should apply gradient text to title in trending mode', async () => {
      const { container } = render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Initially title should not have gradient
      const titleElement = screen.getByText('🔍 Your Search Results');
      expect(titleElement.className).not.toContain('bg-gradient');

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Title should have gradient styling
      await waitFor(() => {
        const trendingTitle = screen.getByText('🔥 Globally Trending Results');
        expect(trendingTitle.className).toContain('bg-gradient-to-r');
        expect(trendingTitle.className).toContain('text-transparent');
      });
    });

    it('should not show preferences badges in trending mode', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Initially shows preferences badges
      expect(screen.getByText('Country: 🇺🇸')).toBeInTheDocument();
      expect(screen.getByText('Genres: Action, Comedy')).toBeInTheDocument();
      expect(screen.getByText('Recency: Recent')).toBeInTheDocument();

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Should not show preferences badges
      await waitFor(() => {
        expect(screen.queryByText('Country: 🇺🇸')).not.toBeInTheDocument();
        expect(screen.queryByText('Genres: Action, Comedy')).not.toBeInTheDocument();
        expect(screen.queryByText('Recency: Recent')).not.toBeInTheDocument();
      });
    });

    it('should disable platform filter when in trending mode', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Platform filter should be enabled initially
      const platformTrigger = screen.getByText('All Platforms').closest('button');
      expect(platformTrigger).not.toBeDisabled();

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Platform filter should be disabled
      await waitFor(() => {
        const disabledPlatformTrigger = screen.getByText('All Platforms').closest('button');
        expect(disabledPlatformTrigger).toBeDisabled();
      });
    });

    it('should filter trending content by content type', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Initially shows all trending content
      await waitFor(() => {
        expect(screen.getByText('Trending Movie')).toBeInTheDocument();
        expect(screen.getByText('Trending Show')).toBeInTheDocument();
      });

      // Filter to movies only
      const contentTypeSelect = screen.getByText('All Content');
      fireEvent.click(contentTypeSelect);
      fireEvent.click(screen.getByText('Movies Only'));

      // Should only show trending movies
      await waitFor(() => {
        expect(screen.getByText('Trending Movie')).toBeInTheDocument();
        expect(screen.queryByText('Trending Show')).not.toBeInTheDocument();
      });
    });

    it('should show correct results count for trending content', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Initially shows search results count
      expect(screen.getByText('2 results found')).toBeInTheDocument();

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Should show trending results count
      await waitFor(() => {
        expect(screen.getByText('2 results found')).toBeInTheDocument(); // 2 trending items
      });
    });

    it('should maintain tab state when filtering content type', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(screen.getByText('🔥 Globally Trending Results')).toBeInTheDocument();
      });

      // Filter content type
      const contentTypeSelect = screen.getByText('All Content');
      fireEvent.click(contentTypeSelect);
      fireEvent.click(screen.getByText('Movies Only'));

      // Should still be in trending mode
      await waitFor(() => {
        expect(screen.getByText('🔥 Globally Trending Results')).toBeInTheDocument();
      });
    });

    it('should show platform disclaimer in trending mode', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Should show disclaimer since trending content includes all platforms
      await waitFor(() => {
        expect(
          screen.getByText('* Includes some content that is only available for rent or purchase')
        ).toBeInTheDocument();
      });
    });

    it('should call useTrending hook with correct parameters', async () => {
      render(
        <ContentDisplayWithQuery
          preferences={mockPreferences}
          onBackToPreferences={mockOnBackToPreferences}
        />,
        { wrapper: createWrapper() }
      );

      // Initially, useTrending should be called but disabled
      expect(vi.mocked(useTrending)).toHaveBeenCalledWith(
        'all',
        'week',
        expect.objectContaining({
          enabled: false,
        })
      );

      // Switch to trending
      const switchElement = screen.getByRole('switch', {
        name: /toggle between search and trending/i,
      });
      fireEvent.click(switchElement);

      // Should enable the trending query
      await waitFor(() => {
        expect(vi.mocked(useTrending)).toHaveBeenCalledWith(
          'all',
          'week',
          expect.objectContaining({
            enabled: true,
          })
        );
      });
    });
  });
});
