import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MediaType } from '@/types/tmdb';

import { WatchProviders } from '../watch-providers';

// Mock the hooks
const mockUseMovieWatchProviders = vi.fn();
const mockUseTVWatchProviders = vi.fn();

vi.mock('@/hooks/use-tmdb', () => ({
  useMovieWatchProviders: () => mockUseMovieWatchProviders(),
  useTVWatchProviders: () => mockUseTVWatchProviders(),
}));

const mockProviderResponse = {
  id: 550,
  results: {
    US: {
      link: 'https://www.themoviedb.org/movie/550-fight-club/watch?locale=US',
      flatrate: [
        {
          display_priority: 1,
          logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
          provider_id: 8,
          provider_name: 'Netflix',
        },
        {
          display_priority: 2,
          logo_path: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
          provider_id: 337,
          provider_name: 'Disney Plus',
        },
      ],
      rent: [
        {
          display_priority: 3,
          logo_path: '/peURlLlr8jggOwK53fJ5wdQl05y.jpg',
          provider_id: 2,
          provider_name: 'Apple TV',
        },
      ],
      buy: [
        {
          display_priority: 3,
          logo_path: '/peURlLlr8jggOwK53fJ5wdQl05y.jpg',
          provider_id: 2,
          provider_name: 'Apple TV',
        },
      ],
    },
    GB: {
      link: 'https://www.themoviedb.org/movie/550-fight-club/watch?locale=GB',
      flatrate: [
        {
          display_priority: 8,
          logo_path: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
          provider_id: 119,
          provider_name: 'Amazon Prime Video',
        },
      ],
    },
  },
};

describe('WatchProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMovieWatchProviders.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
    mockUseTVWatchProviders.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  it('should render loading state', () => {
    mockUseMovieWatchProviders.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { container } = render(
      <WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="US" />
    );

    // Check for skeleton elements
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display streaming providers for movies in US', () => {
    mockUseMovieWatchProviders.mockReturnValue({
      data: mockProviderResponse,
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="US" />);

    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Disney Plus')).toBeInTheDocument();
    expect(screen.getByText('+ Rent/Buy available')).toBeInTheDocument();
  });

  it('should display streaming providers for specific country', () => {
    mockUseMovieWatchProviders.mockReturnValue({
      data: mockProviderResponse,
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="GB" />);

    expect(screen.getByText('Amazon Prime Video')).toBeInTheDocument();
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
  });

  it('should fall back to US providers if country not available', () => {
    mockUseMovieWatchProviders.mockReturnValue({
      data: mockProviderResponse,
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="FR" />);

    // Should show US providers as fallback
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Disney Plus')).toBeInTheDocument();
  });

  it('should show message when no providers available', () => {
    mockUseMovieWatchProviders.mockReturnValue({
      data: { id: 550, results: {} },
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="US" />);

    expect(
      screen.getByText(
        'Not available on streaming platforms in your region, but may be available for rent or purchase.'
      )
    ).toBeInTheDocument();
  });

  it('should work with TV shows', () => {
    const tvProviderResponse = {
      id: 1396,
      results: {
        US: {
          flatrate: [
            {
              display_priority: 1,
              logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
              provider_id: 8,
              provider_name: 'Netflix',
            },
          ],
        },
      },
    };

    mockUseTVWatchProviders.mockReturnValue({
      data: tvProviderResponse,
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={1396} mediaType={MediaType.TV} country="US" />);

    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('should handle free providers', () => {
    const freeProviderResponse = {
      id: 550,
      results: {
        US: {
          free: [
            {
              display_priority: 10,
              logo_path: '/xL9SUR63qrEjFZAhtsipskeAMR7.jpg',
              provider_id: 613,
              provider_name: 'Tubi TV',
            },
          ],
        },
      },
    };

    mockUseMovieWatchProviders.mockReturnValue({
      data: freeProviderResponse,
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="US" />);

    expect(screen.getByText('Tubi TV')).toBeInTheDocument();
  });

  it('should remove duplicate providers', () => {
    const duplicateProviderResponse = {
      id: 550,
      results: {
        US: {
          flatrate: [
            {
              display_priority: 1,
              logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
              provider_id: 8,
              provider_name: 'Netflix',
            },
          ],
          free: [
            {
              display_priority: 1,
              logo_path: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg',
              provider_id: 8,
              provider_name: 'Netflix',
            },
          ],
        },
      },
    };

    mockUseMovieWatchProviders.mockReturnValue({
      data: duplicateProviderResponse,
      isLoading: false,
      error: null,
    });

    render(<WatchProviders mediaId={550} mediaType={MediaType.MOVIE} country="US" />);

    // Should only show Netflix once
    const netflixElements = screen.getAllByText('Netflix');
    expect(netflixElements).toHaveLength(1);
  });
});
