import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tmdbClient } from '@/lib/tmdb-client';
import { MediaType } from '@/types/tmdb';

import {
  tmdbKeys,
  tmdbPrefetch,
  useDiscoverMovies,
  useDiscoverTVShows,
  useMovieDetails,
  useMovieVideos,
  useMovieWatchProviders,
  useTrending,
  useTVGenres,
  useTVShowDetails,
  useTVVideos,
  useTVWatchProviders,
} from '../use-tmdb';

// Mock the tmdb client
vi.mock('@/lib/tmdb-client', () => ({
  tmdbClient: {
    searchMulti: vi.fn(),
    discoverMovies: vi.fn(),
    discoverTVShows: vi.fn(),
    getMovieGenres: vi.fn(),
    getTVGenres: vi.fn(),
    getMovieDetails: vi.fn(),
    getTVShowDetails: vi.fn(),
    getTrending: vi.fn(),
    getMovieVideos: vi.fn(),
    getTVVideos: vi.fn(),
    getMovieWatchProviders: vi.fn(),
    getTVWatchProviders: vi.fn(),
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

const mockSearchResults = {
  results: [
    {
      id: 'tmdb-movie-1',
      tmdbId: 1,
      title: 'Test Movie',
      type: MediaType.MOVIE,
      overview: 'Test movie description',
      releaseDate: '2024-01-01',
      posterPath: '/test.jpg',
      backdropPath: '/test-bg.jpg',
      rating: 8.5,
      voteCount: 100,
      popularity: 75.5,
      genreIds: [28],
      originalLanguage: 'en',
      adult: false,
    },
  ],
  page: 1,
  totalPages: 1,
  totalResults: 1,
};

const mockMediaItem = {
  id: 'tmdb-movie-123',
  tmdbId: 123,
  title: 'Test Movie Details',
  type: MediaType.MOVIE,
  overview: 'Detailed movie description',
  releaseDate: '2024-01-01',
  posterPath: '/poster.jpg',
  backdropPath: '/backdrop.jpg',
  rating: 8.5,
  voteCount: 1000,
  popularity: 100,
  genreIds: [28, 35],
  originalLanguage: 'en',
  adult: false,
};

const mockVideoResponse = {
  id: 123,
  results: [
    {
      id: '1',
      iso_639_1: 'en',
      iso_3166_1: 'US',
      key: 'dQw4w9WgXcQ',
      name: 'Official Trailer',
      site: 'YouTube',
      size: 1080,
      type: 'Trailer',
      official: true,
      published_at: '2024-01-01T00:00:00.000Z',
    },
  ],
};

const mockWatchProviderResponse = {
  id: 123,
  results: {
    US: {
      link: 'https://www.themoviedb.org/movie/123',
      flatrate: [
        {
          display_priority: 1,
          logo_path: '/netflix.jpg',
          provider_id: 8,
          provider_name: 'Netflix',
        },
      ],
    },
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('use-tmdb comprehensive tests', () => {
  describe('tmdbKeys', () => {
    it('should generate correct query keys', () => {
      expect(tmdbKeys.all).toEqual(['tmdb']);
      expect(tmdbKeys.searches()).toEqual(['tmdb', 'search']);
      expect(tmdbKeys.search('test', 1)).toEqual(['tmdb', 'search', 'test', 1]);
      expect(tmdbKeys.discovers()).toEqual(['tmdb', 'discover']);
      expect(tmdbKeys.discoverMovies({ page: 1 })).toEqual([
        'tmdb',
        'discover',
        'movies',
        { page: 1 },
      ]);
      expect(tmdbKeys.discoverTV({ page: 1 })).toEqual(['tmdb', 'discover', 'tv', { page: 1 }]);
      expect(tmdbKeys.genres()).toEqual(['tmdb', 'genres']);
      expect(tmdbKeys.movieGenres()).toEqual(['tmdb', 'genres', 'movies']);
      expect(tmdbKeys.tvGenres()).toEqual(['tmdb', 'genres', 'tv']);
      expect(tmdbKeys.details()).toEqual(['tmdb', 'details']);
      expect(tmdbKeys.movieDetails(123)).toEqual(['tmdb', 'details', 'movie', 123]);
      expect(tmdbKeys.tvDetails(456)).toEqual(['tmdb', 'details', 'tv', 456]);
      expect(tmdbKeys.trending('movie', 'week')).toEqual(['tmdb', 'trending', 'movie', 'week']);
      expect(tmdbKeys.videos()).toEqual(['tmdb', 'videos']);
      expect(tmdbKeys.movieVideos(123)).toEqual(['tmdb', 'videos', 'movie', 123]);
      expect(tmdbKeys.tvVideos(456)).toEqual(['tmdb', 'videos', 'tv', 456]);
      expect(tmdbKeys.watchProviders()).toEqual(['tmdb', 'watchProviders']);
      expect(tmdbKeys.movieWatchProviders(123)).toEqual(['tmdb', 'watchProviders', 'movie', 123]);
      expect(tmdbKeys.tvWatchProviders(456)).toEqual(['tmdb', 'watchProviders', 'tv', 456]);
    });
  });

  describe('useDiscoverMovies', () => {
    it('should fetch discovered movies', async () => {
      vi.mocked(tmdbClient.discoverMovies).mockResolvedValueOnce(mockSearchResults);

      const params = { with_genres: '28', sort_by: 'popularity.desc' };
      const { result } = renderHook(() => useDiscoverMovies(params), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSearchResults);
      expect(tmdbClient.discoverMovies).toHaveBeenCalledWith(params);
    });

    it('should accept custom query options', async () => {
      vi.mocked(tmdbClient.discoverMovies).mockResolvedValueOnce(mockSearchResults);

      const params = { page: 2 };
      const options = { enabled: false } as any;
      const { result } = renderHook(() => useDiscoverMovies(params, options), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.discoverMovies).not.toHaveBeenCalled();
    });
  });

  describe('useDiscoverTVShows', () => {
    it('should fetch discovered TV shows', async () => {
      vi.mocked(tmdbClient.discoverTVShows).mockResolvedValueOnce(mockSearchResults);

      const params = { with_genres: '35', sort_by: 'vote_average.desc' };
      const { result } = renderHook(() => useDiscoverTVShows(params), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSearchResults);
      expect(tmdbClient.discoverTVShows).toHaveBeenCalledWith(params);
    });
  });

  describe('useTVGenres', () => {
    it('should fetch TV genres', async () => {
      const mockGenres = {
        genres: [
          { id: 10759, name: 'Action & Adventure' },
          { id: 16, name: 'Animation' },
        ],
      };

      vi.mocked(tmdbClient.getTVGenres).mockResolvedValueOnce(mockGenres);

      const { result } = renderHook(() => useTVGenres(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockGenres);
      expect(tmdbClient.getTVGenres).toHaveBeenCalled();
    });

    it('should cache TV genre results with custom options', async () => {
      const mockGenres = { genres: [{ id: 16, name: 'Animation' }] };
      vi.mocked(tmdbClient.getTVGenres).mockResolvedValue(mockGenres);

      const options = { staleTime: 5000 } as any;
      const { result } = renderHook(() => useTVGenres(options), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockGenres);
    });
  });

  describe('useMovieDetails', () => {
    it('should fetch movie details', async () => {
      vi.mocked(tmdbClient.getMovieDetails).mockResolvedValueOnce(mockMediaItem);

      const { result } = renderHook(() => useMovieDetails(123), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMediaItem);
      expect(tmdbClient.getMovieDetails).toHaveBeenCalledWith(123);
    });

    it('should not fetch when movieId is 0', () => {
      const { result } = renderHook(() => useMovieDetails(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.getMovieDetails).not.toHaveBeenCalled();
    });
  });

  describe('useTVShowDetails', () => {
    it('should fetch TV show details', async () => {
      const mockTVItem = { ...mockMediaItem, type: MediaType.TV };
      vi.mocked(tmdbClient.getTVShowDetails).mockResolvedValueOnce(mockTVItem);

      const { result } = renderHook(() => useTVShowDetails(456), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTVItem);
      expect(tmdbClient.getTVShowDetails).toHaveBeenCalledWith(456);
    });

    it('should not fetch when tvId is 0', () => {
      const { result } = renderHook(() => useTVShowDetails(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.getTVShowDetails).not.toHaveBeenCalled();
    });
  });

  describe('useTrending', () => {
    it('should fetch trending content with default params', async () => {
      vi.mocked(tmdbClient.getTrending).mockResolvedValueOnce(mockSearchResults);

      const { result } = renderHook(() => useTrending(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSearchResults);
      expect(tmdbClient.getTrending).toHaveBeenCalledWith('all', 'week');
    });

    it('should fetch trending movies for day', async () => {
      vi.mocked(tmdbClient.getTrending).mockResolvedValueOnce(mockSearchResults);

      const { result } = renderHook(() => useTrending('movie', 'day'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(tmdbClient.getTrending).toHaveBeenCalledWith('movie', 'day');
    });

    it('should fetch trending TV shows for week', async () => {
      vi.mocked(tmdbClient.getTrending).mockResolvedValueOnce(mockSearchResults);

      const { result } = renderHook(() => useTrending('tv', 'week'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(tmdbClient.getTrending).toHaveBeenCalledWith('tv', 'week');
    });
  });

  describe('useMovieVideos', () => {
    it('should fetch movie videos', async () => {
      vi.mocked(tmdbClient.getMovieVideos).mockResolvedValueOnce(mockVideoResponse);

      const { result } = renderHook(() => useMovieVideos(123), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockVideoResponse);
      expect(tmdbClient.getMovieVideos).toHaveBeenCalledWith(123);
    });

    it('should not fetch when movieId is 0', () => {
      const { result } = renderHook(() => useMovieVideos(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.getMovieVideos).not.toHaveBeenCalled();
    });
  });

  describe('useTVVideos', () => {
    it('should fetch TV show videos', async () => {
      vi.mocked(tmdbClient.getTVVideos).mockResolvedValueOnce(mockVideoResponse);

      const { result } = renderHook(() => useTVVideos(456), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockVideoResponse);
      expect(tmdbClient.getTVVideos).toHaveBeenCalledWith(456);
    });

    it('should not fetch when tvId is 0', () => {
      const { result } = renderHook(() => useTVVideos(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.getTVVideos).not.toHaveBeenCalled();
    });
  });

  describe('useMovieWatchProviders', () => {
    it('should fetch movie watch providers', async () => {
      vi.mocked(tmdbClient.getMovieWatchProviders).mockResolvedValueOnce(mockWatchProviderResponse);

      const { result } = renderHook(() => useMovieWatchProviders(123), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockWatchProviderResponse);
      expect(tmdbClient.getMovieWatchProviders).toHaveBeenCalledWith(123);
    });

    it('should not fetch when movieId is 0', () => {
      const { result } = renderHook(() => useMovieWatchProviders(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.getMovieWatchProviders).not.toHaveBeenCalled();
    });
  });

  describe('useTVWatchProviders', () => {
    it('should fetch TV show watch providers', async () => {
      vi.mocked(tmdbClient.getTVWatchProviders).mockResolvedValueOnce(mockWatchProviderResponse);

      const { result } = renderHook(() => useTVWatchProviders(456), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockWatchProviderResponse);
      expect(tmdbClient.getTVWatchProviders).toHaveBeenCalledWith(456);
    });

    it('should not fetch when tvId is 0', () => {
      const { result } = renderHook(() => useTVWatchProviders(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(tmdbClient.getTVWatchProviders).not.toHaveBeenCalled();
    });
  });

  describe('tmdbPrefetch', () => {
    it('should prefetch movie genres', async () => {
      const mockGenres = { genres: [{ id: 28, name: 'Action' }] };
      vi.mocked(tmdbClient.getMovieGenres).mockResolvedValueOnce(mockGenres);

      const queryClient = new QueryClient();
      const prefetchQuery = vi.spyOn(queryClient, 'prefetchQuery');

      await tmdbPrefetch.movieGenres(queryClient);

      expect(prefetchQuery).toHaveBeenCalledWith({
        queryKey: tmdbKeys.movieGenres(),
        queryFn: expect.any(Function),
        staleTime: 24 * 60 * 60 * 1000,
      });
    });

    it('should prefetch TV genres', async () => {
      const mockGenres = { genres: [{ id: 16, name: 'Animation' }] };
      vi.mocked(tmdbClient.getTVGenres).mockResolvedValueOnce(mockGenres);

      const queryClient = new QueryClient();
      const prefetchQuery = vi.spyOn(queryClient, 'prefetchQuery');

      await tmdbPrefetch.tvGenres(queryClient);

      expect(prefetchQuery).toHaveBeenCalledWith({
        queryKey: tmdbKeys.tvGenres(),
        queryFn: expect.any(Function),
        staleTime: 24 * 60 * 60 * 1000,
      });
    });

    it('should prefetch trending content with default params', async () => {
      vi.mocked(tmdbClient.getTrending).mockResolvedValueOnce(mockSearchResults);

      const queryClient = new QueryClient();
      const prefetchQuery = vi.spyOn(queryClient, 'prefetchQuery');

      await tmdbPrefetch.trending(queryClient);

      expect(prefetchQuery).toHaveBeenCalledWith({
        queryKey: tmdbKeys.trending('all', 'week'),
        queryFn: expect.any(Function),
        staleTime: 30 * 60 * 1000,
      });
    });

    it('should prefetch trending movies for day', async () => {
      vi.mocked(tmdbClient.getTrending).mockResolvedValueOnce(mockSearchResults);

      const queryClient = new QueryClient();
      const prefetchQuery = vi.spyOn(queryClient, 'prefetchQuery');

      await tmdbPrefetch.trending(queryClient, 'movie' as any, 'day' as any);

      expect(prefetchQuery).toHaveBeenCalledWith({
        queryKey: tmdbKeys.trending('movie', 'day'),
        queryFn: expect.any(Function),
        staleTime: 30 * 60 * 1000,
      });
    });
  });
});
