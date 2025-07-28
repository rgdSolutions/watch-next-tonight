import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tmdbClient } from '@/lib/tmdb-client';
import { MediaType } from '@/types/tmdb';

import {
  useDiscoverMovies,
  useDiscoverTVShows,
  useMovieDetails,
  useMovieGenres,
  useSearchMulti,
  useTrending,
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

describe('TMDB Hooks - Error States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSearchMulti - Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error: Rate limit exceeded');
      vi.mocked(tmdbClient.searchMulti).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useSearchMulti('test'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(mockError);
        expect(result.current.data).toBeUndefined();
      });
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error: Failed to fetch');
      vi.mocked(tmdbClient.searchMulti).mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useSearchMulti('movie'), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe('Network error: Failed to fetch');
      });
    });
  });

  describe('useMovieGenres - Error Handling', () => {
    it('should handle genre fetch errors', async () => {
      const mockError = new Error('Failed to fetch genres');
      vi.mocked(tmdbClient.getMovieGenres).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useMovieGenres(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(mockError);
        expect(result.current.data).toBeUndefined();
      });
    });
  });

  describe('useDiscoverMovies - Error Handling', () => {
    it('should handle discover API errors', async () => {
      const mockError = new Error('Invalid parameters');
      vi.mocked(tmdbClient.discoverMovies).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useDiscoverMovies({ with_genres: 'invalid' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error?.message).toBe('Invalid parameters');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state for search', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(tmdbClient.searchMulti).mockReturnValueOnce(promise as any);

      const { result } = renderHook(() => useSearchMulti('test'), { wrapper: createWrapper() });

      // Should be loading initially
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(false);

      // Resolve the promise
      resolvePromise!({
        results: [{ id: 'tmdb-movie-1', title: 'Test' }],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      });

      // Should complete loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toBeDefined();
      });
    });

    it('should show loading state for multiple hooks', async () => {
      let resolveMovies: (value: any) => void;
      let resolveTV: (value: any) => void;

      const moviesPromise = new Promise((resolve) => {
        resolveMovies = resolve;
      });

      const tvPromise = new Promise((resolve) => {
        resolveTV = resolve;
      });

      vi.mocked(tmdbClient.discoverMovies).mockReturnValueOnce(moviesPromise as any);
      vi.mocked(tmdbClient.discoverTVShows).mockReturnValueOnce(tvPromise as any);

      const { result: moviesResult } = renderHook(() => useDiscoverMovies({}), {
        wrapper: createWrapper(),
      });

      const { result: tvResult } = renderHook(() => useDiscoverTVShows({}), {
        wrapper: createWrapper(),
      });

      // Both should be loading
      expect(moviesResult.current.isLoading).toBe(true);
      expect(tvResult.current.isLoading).toBe(true);

      // Resolve movies first
      resolveMovies!({ results: [], page: 1, totalPages: 0, totalResults: 0 });

      await waitFor(() => {
        expect(moviesResult.current.isLoading).toBe(false);
        expect(tvResult.current.isLoading).toBe(true);
      });

      // Resolve TV
      resolveTV!({ results: [], page: 1, totalPages: 0, totalResults: 0 });

      await waitFor(() => {
        expect(tvResult.current.isLoading).toBe(false);
      });
    });
  });

  describe('Retry Behavior', () => {
    it('should not retry on error by default in tests', async () => {
      const mockError = new Error('API Error');
      vi.mocked(tmdbClient.getMovieDetails).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMovieDetails(123), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should only be called once (no retries)
      expect(tmdbClient.getMovieDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled Queries', () => {
    it('should not fetch when movieId is not provided', () => {
      const { result } = renderHook(() => useMovieDetails(0), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(tmdbClient.getMovieDetails).not.toHaveBeenCalled();
    });

    it('should not fetch when search query is empty', () => {
      const { result } = renderHook(() => useSearchMulti(''), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(tmdbClient.searchMulti).not.toHaveBeenCalled();
    });
  });

  describe('Concurrent Error Handling', () => {
    it('should handle multiple concurrent errors', async () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');

      vi.mocked(tmdbClient.getTrending).mockRejectedValueOnce(error1);
      vi.mocked(tmdbClient.getMovieGenres).mockRejectedValueOnce(error2);

      const { result: trendingResult } = renderHook(() => useTrending(), {
        wrapper: createWrapper(),
      });

      const { result: genresResult } = renderHook(() => useMovieGenres(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(trendingResult.current.isError).toBe(true);
        expect(trendingResult.current.error?.message).toBe('Error 1');

        expect(genresResult.current.isError).toBe(true);
        expect(genresResult.current.error?.message).toBe('Error 2');
      });
    });
  });

  describe('Error Recovery', () => {
    it('should recover from error on refetch', async () => {
      const mockError = new Error('Temporary error');
      const mockData = {
        results: [
          {
            id: 'tmdb-movie-1',
            tmdbId: 1,
            title: 'Success',
            type: MediaType.MOVIE,
            overview: 'Test movie',
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

      // First call fails, second succeeds
      vi.mocked(tmdbClient.searchMulti)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useSearchMulti('test'), { wrapper: createWrapper() });

      // Wait for error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Refetch
      result.current.refetch();

      // Should recover
      await waitFor(() => {
        expect(result.current.isError).toBe(false);
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(mockData);
      });
    });
  });
});
