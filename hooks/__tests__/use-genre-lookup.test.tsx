import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MediaType } from '@/types/tmdb';

import { useGenreLookup } from '../use-genre-lookup';

// Mock the dependencies
vi.mock('@/hooks/use-tmdb', () => ({
  useMovieGenres: vi.fn(),
  useTVGenres: vi.fn(),
}));

vi.mock('@/hooks/use-unified-genres', () => ({
  useUnifiedGenres: vi.fn(),
}));

vi.mock('@/lib/unified-genres', () => ({
  GENRE_EMOJIS: {
    action: '💥',
    comedy: '😂',
    drama: '🎭',
    horror: '😱',
    romance: '💕',
  },
}));

const mockMovieGenres = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
  ],
};

const mockTVGenres = {
  genres: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
  ],
};

const mockUnifiedGenres = [
  { id: 'action', name: 'Action' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'drama', name: 'Drama' },
  { id: 'horror', name: 'Horror' },
  { id: 'romance', name: 'Romance' },
];

describe('useGenreLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return movie genre names when media type is movie', async () => {
    const { useMovieGenres, useTVGenres } = await import('@/hooks/use-tmdb');
    const { useUnifiedGenres } = await import('@/hooks/use-unified-genres');

    vi.mocked(useMovieGenres).mockReturnValue({ data: mockMovieGenres } as any);
    vi.mocked(useTVGenres).mockReturnValue({ data: null } as any);
    vi.mocked(useUnifiedGenres).mockReturnValue({ genres: mockUnifiedGenres } as any);

    const { result } = renderHook(() => useGenreLookup(MediaType.MOVIE));

    expect(result.current.getGenreName(28)).toBe('Action');
    expect(result.current.getGenreName(35)).toBe('Comedy');
    expect(result.current.getGenreName(999)).toBe(''); // Unknown genre
  });

  it('should return TV genre names when media type is TV', async () => {
    const { useMovieGenres, useTVGenres } = await import('@/hooks/use-tmdb');
    const { useUnifiedGenres } = await import('@/hooks/use-unified-genres');

    vi.mocked(useMovieGenres).mockReturnValue({ data: null } as any);
    vi.mocked(useTVGenres).mockReturnValue({ data: mockTVGenres } as any);
    vi.mocked(useUnifiedGenres).mockReturnValue({ genres: mockUnifiedGenres } as any);

    const { result } = renderHook(() => useGenreLookup(MediaType.TV));

    expect(result.current.getGenreName(10759)).toBe('Action & Adventure');
    expect(result.current.getGenreName(35)).toBe('Comedy');
  });

  it('should return genre with emoji when available', async () => {
    const { useMovieGenres, useTVGenres } = await import('@/hooks/use-tmdb');
    const { useUnifiedGenres } = await import('@/hooks/use-unified-genres');

    vi.mocked(useMovieGenres).mockReturnValue({ data: mockMovieGenres } as any);
    vi.mocked(useTVGenres).mockReturnValue({ data: null } as any);
    vi.mocked(useUnifiedGenres).mockReturnValue({ genres: mockUnifiedGenres } as any);

    const { result } = renderHook(() => useGenreLookup(MediaType.MOVIE));

    const actionGenre = result.current.getGenreWithEmoji(28);
    expect(actionGenre).toEqual({
      id: 28,
      name: 'Action',
      emoji: '💥',
      displayName: '💥 Action',
    });

    const comedyGenre = result.current.getGenreWithEmoji(35);
    expect(comedyGenre).toEqual({
      id: 35,
      name: 'Comedy',
      emoji: '😂',
      displayName: '😂 Comedy',
    });
  });

  it('should return genre without emoji when not in unified genres', async () => {
    const { useMovieGenres, useTVGenres } = await import('@/hooks/use-tmdb');
    const { useUnifiedGenres } = await import('@/hooks/use-unified-genres');

    const customMovieGenres = {
      genres: [{ id: 99, name: 'Documentary' }],
    };

    vi.mocked(useMovieGenres).mockReturnValue({ data: customMovieGenres } as any);
    vi.mocked(useTVGenres).mockReturnValue({ data: null } as any);
    vi.mocked(useUnifiedGenres).mockReturnValue({ genres: mockUnifiedGenres } as any);

    const { result } = renderHook(() => useGenreLookup(MediaType.MOVIE));

    const documentaryGenre = result.current.getGenreWithEmoji(99);
    expect(documentaryGenre).toEqual({
      id: 99,
      name: 'Documentary',
      emoji: '',
      displayName: 'Documentary',
    });
  });

  it('should return null for unknown genre ID', async () => {
    const { useMovieGenres, useTVGenres } = await import('@/hooks/use-tmdb');
    const { useUnifiedGenres } = await import('@/hooks/use-unified-genres');

    vi.mocked(useMovieGenres).mockReturnValue({ data: mockMovieGenres } as any);
    vi.mocked(useTVGenres).mockReturnValue({ data: null } as any);
    vi.mocked(useUnifiedGenres).mockReturnValue({ genres: mockUnifiedGenres } as any);

    const { result } = renderHook(() => useGenreLookup(MediaType.MOVIE));

    const unknownGenre = result.current.getGenreWithEmoji(999);
    expect(unknownGenre).toBeNull();
  });

  it('should handle case-insensitive genre matching', async () => {
    const { useMovieGenres, useTVGenres } = await import('@/hooks/use-tmdb');
    const { useUnifiedGenres } = await import('@/hooks/use-unified-genres');

    const mixedCaseGenres = {
      genres: [{ id: 28, name: 'ACTION' }], // All caps
    };

    vi.mocked(useMovieGenres).mockReturnValue({ data: mixedCaseGenres } as any);
    vi.mocked(useTVGenres).mockReturnValue({ data: null } as any);
    vi.mocked(useUnifiedGenres).mockReturnValue({ genres: mockUnifiedGenres } as any);

    const { result } = renderHook(() => useGenreLookup(MediaType.MOVIE));

    const actionGenre = result.current.getGenreWithEmoji(28);
    expect(actionGenre?.emoji).toBe('💥'); // Should still match
    expect(actionGenre?.displayName).toBe('💥 ACTION');
  });
});
