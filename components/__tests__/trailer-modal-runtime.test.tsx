import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MediaItem, MediaType } from '@/types/tmdb';

import { TrailerModal } from '../trailer-modal';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the hooks
const mockUseMovieDetails = vi.fn();
const mockUseTVShowDetails = vi.fn();

vi.mock('@/hooks/use-tmdb', () => ({
  useMovieDetails: (...args: any[]) => mockUseMovieDetails(...args),
  useTVShowDetails: (...args: any[]) => mockUseTVShowDetails(...args),
  useMovieVideos: () => ({ data: null, isLoading: false }),
  useTVShowVideos: () => ({ data: null, isLoading: false }),
  useMovieWatchProviders: () => ({ data: null, isLoading: false }),
  useTVShowWatchProviders: () => ({ data: null, isLoading: false }),
}));

vi.mock('@/hooks/use-genre-lookup', () => ({
  useGenreLookup: () => ({
    getGenreWithEmoji: (id: number) => ({ id, name: `Genre ${id}`, displayName: `Genre ${id}` }),
  }),
}));

// Mock the child components
vi.mock('@/components/video-player', () => ({
  VideoPlayer: () => <div>Video Player</div>,
}));

vi.mock('@/components/watch-providers', () => ({
  WatchProviders: () => <div>Watch Providers</div>,
}));

const mockMovieItem: MediaItem = {
  id: 'tmdb-movie-550',
  tmdbId: 550,
  title: 'Fight Club',
  type: MediaType.MOVIE,
  overview: 'An insomniac office worker...',
  releaseDate: '1999-10-15',
  posterPath: '/poster.jpg',
  backdropPath: '/backdrop.jpg',
  rating: 8.4,
  voteCount: 1000,
  popularity: 50,
  genreIds: [18, 53],
  originalLanguage: 'en',
};

const mockTVItem: MediaItem = {
  id: 'tmdb-tv-1396',
  tmdbId: 1396,
  title: 'Breaking Bad',
  type: MediaType.TV,
  overview: 'A high school chemistry teacher...',
  releaseDate: '2008-01-20',
  posterPath: '/poster.jpg',
  backdropPath: '/backdrop.jpg',
  rating: 9.5,
  voteCount: 5000,
  popularity: 100,
  genreIds: [18, 80],
  originalLanguage: 'en',
};

describe('TrailerModal - Runtime Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display formatted movie runtime from details', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: { ...mockMovieItem, runtime: 139 }, // 2h 19m
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockMovieItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('2h 19m')).toBeInTheDocument();
  });

  it('should display formatted movie runtime under 1 hour', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: { ...mockMovieItem, runtime: 45 },
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockMovieItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('45m')).toBeInTheDocument();
  });

  it('should display TV show seasons and episodes info', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: {
        ...mockTVItem,
        numberOfSeasons: 5,
        numberOfEpisodes: 62,
      },
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockTVItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('5 Seasons • 62 Episodes')).toBeInTheDocument();
  });

  it('should display single season correctly', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: {
        ...mockTVItem,
        numberOfSeasons: 1,
        numberOfEpisodes: 10,
      },
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockTVItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('1 Season • 10 Episodes')).toBeInTheDocument();
  });

  it('should display only seasons when episodes count is missing', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: {
        ...mockTVItem,
        numberOfSeasons: 3,
      },
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockTVItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('3 Seasons')).toBeInTheDocument();
  });

  it('should display fallback when runtime is not available', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: { ...mockMovieItem, runtime: undefined },
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockMovieItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('Runtime N/A')).toBeInTheDocument();
  });

  it('should display Series fallback for TV shows without details', () => {
    mockUseMovieDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: { ...mockTVItem },
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={mockTVItem} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('Series')).toBeInTheDocument();
  });

  it('should use runtime from item if detail fetch fails', () => {
    const movieWithRuntime = { ...mockMovieItem, runtime: 120 };

    mockUseMovieDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch'),
    }));

    mockUseTVShowDetails.mockImplementation(() => ({
      data: null,
      isLoading: false,
      error: null,
    }));

    render(<TrailerModal item={movieWithRuntime} isOpen={true} onClose={() => {}} country="US" />);

    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });
});
