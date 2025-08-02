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
          { id: 878, name: 'Science Fiction' },
          { id: 10752, name: 'War' },
          { id: 27, name: 'Horror' },
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
          { id: 10765, name: 'Sci-Fi & Fantasy' },
          { id: 10768, name: 'War & Politics' },
          { id: 10762, name: 'Kids' },
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

    // Check the total number of genres (some are unified)
    expect(result.current.genres.length).toBeGreaterThan(0);

    // Every genre should have both movie and TV IDs
    result.current.genres.forEach((genre) => {
      expect(genre.movieIds.length).toBeGreaterThan(0);
      expect(genre.tvIds.length).toBeGreaterThan(0);
    });

    // Check Science Fiction is unified with Sci-Fi & Fantasy
    const sciFi = result.current.genres.find((g) => g.id === 'sciencefi');
    expect(sciFi).toBeTruthy();
    expect(sciFi?.name).toBe('Sci-Fi & Fantasy');
    expect(sciFi?.movieIds).toContain(878);
    expect(sciFi?.tvIds).toContain(10765);

    // Check War is unified with War & Politics
    const war = result.current.genres.find((g) => g.id === 'war');
    expect(war).toBeTruthy();
    expect(war?.name).toBe('War & Politics');
    expect(war?.movieIds).toContain(10752);
    expect(war?.tvIds).toContain(10768);

    // Check Action and Action & Adventure are separate
    const action = result.current.genres.find((g) => g.name === 'Action');
    const actionAdventure = result.current.genres.find((g) => g.name === 'Action & Adventure');
    expect(action).toBeTruthy();
    expect(actionAdventure).toBeTruthy();
    expect(action?.id).not.toBe(actionAdventure?.id);

    // Check Horror has fallback TV mapping
    const horror = result.current.genres.find((g) => g.name === 'Horror');
    expect(horror).toBeTruthy();
    expect(horror?.movieIds).toContain(27);
    expect(horror?.tvIds.length).toBeGreaterThan(0); // Has fallback

    // Check Kids has fallback movie mapping
    const kids = result.current.genres.find((g) => g.name === 'Kids');
    expect(kids).toBeTruthy();
    expect(kids?.tvIds).toContain(10762);
    expect(kids?.movieIds.length).toBeGreaterThan(0); // Has fallback

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
