import { describe, expect, it } from 'vitest';

import {
  getUnifiedGenres,
  matchesUnifiedGenres,
  UNIFIED_GENRES,
  unifiedGenresToTMDBIds,
} from '../unified-genres';

describe('getUnifiedGenres', () => {
  const mockMovieGenres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
  ];

  const mockTVGenres = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
  ];

  it('should return unified genres that exist in either movie or TV genres', () => {
    const result = getUnifiedGenres(mockMovieGenres, mockTVGenres);

    // Should include action (has movie and TV IDs)
    expect(result.find((g) => g.id === 'action')).toBeTruthy();

    // Should include comedy (same ID for both)
    expect(result.find((g) => g.id === 'comedy')).toBeTruthy();

    // Should include horror (only has movie ID)
    expect(result.find((g) => g.id === 'horror')).toBeTruthy();

    // Should include sci-fi (only has TV ID)
    expect(result.find((g) => g.id === 'sci-fi')).toBeTruthy();
  });

  it('should filter out genres that have no valid IDs', () => {
    const result = getUnifiedGenres(mockMovieGenres, mockTVGenres);

    // Should not include romance (ID 10749 not in our mock data)
    expect(result.find((g) => g.id === 'romance')).toBeFalsy();

    // Should not include music (ID 10402 not in our mock data)
    expect(result.find((g) => g.id === 'music')).toBeFalsy();
  });
});

describe('unifiedGenresToTMDBIds', () => {
  it('should convert unified genre IDs to movie TMDB IDs', () => {
    const unifiedIds = ['action', 'comedy', 'sci-fi'];
    const result = unifiedGenresToTMDBIds(unifiedIds, 'movie');

    expect(result).toContain(28); // Action movie ID
    expect(result).toContain(35); // Comedy movie ID
    expect(result).toContain(878); // Science Fiction movie ID
  });

  it('should convert unified genre IDs to TV TMDB IDs', () => {
    const unifiedIds = ['action', 'comedy', 'sci-fi'];
    const result = unifiedGenresToTMDBIds(unifiedIds, 'tv');

    expect(result).toContain(10759); // Action & Adventure TV ID
    expect(result).toContain(35); // Comedy TV ID
    expect(result).toContain(10765); // Sci-Fi & Fantasy TV ID
  });

  it('should handle empty genre array', () => {
    const result = unifiedGenresToTMDBIds([], 'movie');
    expect(result).toEqual([]);
  });

  it('should ignore unknown genre IDs', () => {
    const unifiedIds = ['unknown-genre', 'action'];
    const result = unifiedGenresToTMDBIds(unifiedIds, 'movie');

    expect(result).toContain(28); // Action movie ID
    expect(result).toHaveLength(1);
  });

  it('should not include duplicate IDs', () => {
    // Action and Adventure both map to 10759 for TV
    const unifiedIds = ['action', 'adventure'];
    const result = unifiedGenresToTMDBIds(unifiedIds, 'tv');

    expect(result).toContain(10759);
    expect(result).toHaveLength(1); // Should only appear once
  });
});

describe('matchesUnifiedGenres', () => {
  it('should return true when item has matching movie genre', () => {
    const itemGenreIds = [28, 53]; // Action, Thriller
    const selectedGenres = ['action'];

    expect(matchesUnifiedGenres(itemGenreIds, selectedGenres, 'movie')).toBe(true);
  });

  it('should return true when item has matching TV genre', () => {
    const itemGenreIds = [10759, 18]; // Action & Adventure, Drama
    const selectedGenres = ['adventure'];

    expect(matchesUnifiedGenres(itemGenreIds, selectedGenres, 'tv')).toBe(true);
  });

  it('should return false when item has no matching genres', () => {
    const itemGenreIds = [35, 18]; // Comedy, Drama
    const selectedGenres = ['horror'];

    expect(matchesUnifiedGenres(itemGenreIds, selectedGenres, 'movie')).toBe(false);
  });

  it('should return true when no genres are selected', () => {
    const itemGenreIds = [28, 35];
    const selectedGenres: string[] = [];

    expect(matchesUnifiedGenres(itemGenreIds, selectedGenres, 'movie')).toBe(true);
  });
});

describe('UNIFIED_GENRES constant', () => {
  it('should have unique IDs', () => {
    const ids = UNIFIED_GENRES.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have emojis for all genres', () => {
    UNIFIED_GENRES.forEach((genre) => {
      expect(genre.emoji).toBeTruthy();
      expect(genre.emoji.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one ID (movie or TV) for each genre', () => {
    UNIFIED_GENRES.forEach((genre) => {
      const hasIds = genre.movieIds.length > 0 || genre.tvIds.length > 0;
      expect(hasIds).toBe(true);
    });
  });
});
