import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tmdbClient } from '@/lib/tmdb-client';
import { MediaType } from '@/types/tmdb';

import { useMovieGenres, useSearchMulti } from '../use-tmdb';

// Mock the tmdb client
vi.mock('@/lib/tmdb-client', () => ({
  tmdbClient: {
    searchMulti: vi.fn(),
    getMovieGenres: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

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

describe('useTMDB hooks', () => {
  describe('useSearchMulti', () => {
    it('should fetch search results when query is provided', async () => {
      const mockResults = {
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

      vi.mocked(tmdbClient.searchMulti).mockResolvedValueOnce(mockResults);

      const { result } = renderHook(() => useSearchMulti('test'), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResults);
      expect(tmdbClient.searchMulti).toHaveBeenCalledWith('test', 1);
    });

    it('should not fetch when query is empty', () => {
      const { result } = renderHook(() => useSearchMulti(''), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(tmdbClient.searchMulti).not.toHaveBeenCalled();
    });
  });

  describe('useMovieGenres', () => {
    it('should fetch movie genres', async () => {
      const mockGenres = {
        genres: [
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
        ],
      };

      vi.mocked(tmdbClient.getMovieGenres).mockResolvedValueOnce(mockGenres);

      const { result } = renderHook(() => useMovieGenres(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockGenres);
      expect(tmdbClient.getMovieGenres).toHaveBeenCalled();
    });

    it('should cache genre results', async () => {
      const mockGenres = {
        genres: [{ id: 28, name: 'Action' }],
      };

      vi.mocked(tmdbClient.getMovieGenres).mockResolvedValue(mockGenres);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 1000 * 60 * 60, // 1 hour
          },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // First render
      const { result: result1 } = renderHook(() => useMovieGenres(), { wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Clear mock calls
      vi.mocked(tmdbClient.getMovieGenres).mockClear();

      // Second render should use cache
      const { result: result2 } = renderHook(() => useMovieGenres(), { wrapper });

      expect(result2.current.data).toEqual(mockGenres);
      expect(result2.current.isSuccess).toBe(true);
      expect(tmdbClient.getMovieGenres).not.toHaveBeenCalled(); // Should use cache
    });
  });
});
