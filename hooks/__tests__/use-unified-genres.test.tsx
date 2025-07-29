import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useUnifiedGenres } from '../use-unified-genres';

// Mock the TMDB hooks
vi.mock('../use-tmdb', () => ({
  useMovieGenres: vi.fn(),
  useTVGenres: vi.fn(),
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

  return Wrapper;
};

describe('useUnifiedGenres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unified genres when both movie and TV genres are loaded', async () => {
    const { useMovieGenres, useTVGenres } = await import('../use-tmdb');

    vi.mocked(useMovieGenres).mockReturnValue({
      data: {
        genres: [
          { id: 28, name: 'Action' },
          { id: 35, name: 'Comedy' },
          { id: 18, name: 'Drama' },
        ],
      },
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useTVGenres).mockReturnValue({
      data: {
        genres: [
          { id: 10759, name: 'Action & Adventure' },
          { id: 35, name: 'Comedy' },
          { id: 18, name: 'Drama' },
        ],
      },
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useUnifiedGenres(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.genres).toHaveLength(3); // action (merged with adventure), comedy, drama

    // Action should exist and contain both movie and TV IDs
    const action = result.current.genres.find((g) => g.name === 'Action');
    expect(action).toBeTruthy();
    expect(action?.movieIds).toContain(28);
    expect(action?.tvIds).toContain(10759);

    // Comedy and Drama should exist
    expect(result.current.genres.find((g) => g.name === 'Comedy')).toBeTruthy();
    expect(result.current.genres.find((g) => g.name === 'Drama')).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  it('should show loading state when either hook is loading', async () => {
    const { useMovieGenres, useTVGenres } = await import('../use-tmdb');

    vi.mocked(useMovieGenres).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any);

    vi.mocked(useTVGenres).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useUnifiedGenres(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.genres).toEqual([]);
  });

  it('should return error when either hook has error', async () => {
    const { useMovieGenres, useTVGenres } = await import('../use-tmdb');
    const mockError = new Error('Failed to fetch genres');

    vi.mocked(useMovieGenres).mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    } as any);

    vi.mocked(useTVGenres).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useUnifiedGenres(), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.genres).toEqual([]);
  });

  it('should return empty array when data is not yet available', async () => {
    const { useMovieGenres, useTVGenres } = await import('../use-tmdb');

    vi.mocked(useMovieGenres).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(useTVGenres).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useUnifiedGenres(), {
      wrapper: createWrapper(),
    });

    expect(result.current.genres).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
