import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the hooks
import {
  useDiscoverMovies,
  useDiscoverTVShows,
  useMovieGenres,
  useTVGenres,
} from '@/hooks/use-tmdb';

import { ContentDisplayWithQuery } from '../content-display-with-query';

vi.mock('@/hooks/use-tmdb', () => ({
  useMovieGenres: vi.fn(),
  useTVGenres: vi.fn(),
  useDiscoverMovies: vi.fn(),
  useDiscoverTVShows: vi.fn(),
}));

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

    expect(screen.getByText(/No content found matching your preferences/)).toBeInTheDocument();
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

    fireEvent.click(screen.getByText('Change Preferences'));
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
        with_genres: '',
      }),
      expect.any(Object)
    );
  });
});
