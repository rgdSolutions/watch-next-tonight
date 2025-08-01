import { describe, expect, it } from 'vitest';

import { getUnifiedGenres, unifiedGenresToTMDBIds } from '../unified-genres';

describe('getUnifiedGenres', () => {
  const mockMovieGenres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 878, name: 'Science Fiction' },
  ];

  const mockTVGenres = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 9648, name: 'Mystery' },
  ];

  it('should create unified genres from movie and TV genres', () => {
    const result = getUnifiedGenres(mockMovieGenres, mockTVGenres);

    // Should create unified genres
    expect(result.length).toBeGreaterThan(0);

    // Should include action (merges "Action" and "Action & Adventure")
    const action = result.find((g) => g.name === 'Action');
    expect(action).toBeTruthy();
    expect(action?.movieIds).toContain(28);
    expect(action?.tvIds).toContain(10759);

    // Should include comedy (same name, same ID)
    const comedy = result.find((g) => g.name === 'Comedy');
    expect(comedy).toBeTruthy();
    expect(comedy?.movieIds).toContain(35);
    expect(comedy?.tvIds).toContain(35);

    // Should include horror (only in movies)
    const horror = result.find((g) => g.name === 'Horror');
    expect(horror).toBeTruthy();
    expect(horror?.movieIds).toContain(27);
    expect(horror?.tvIds).toHaveLength(0);

    // Should include mystery (only in TV)
    const mystery = result.find((g) => g.name === 'Mystery');
    expect(mystery).toBeTruthy();
    expect(mystery?.movieIds).toHaveLength(0);
    expect(mystery?.tvIds).toContain(9648);
  });

  it('should merge similar genres', () => {
    const result = getUnifiedGenres(mockMovieGenres, mockTVGenres);

    // "Science Fiction" and "Sci-Fi & Fantasy" should be merged into one unified genre
    // This provides better UX - users selecting sci-fi content should get both movies and TV shows
    const sciFiGenre = result.find(
      (g) => g.name === 'Science Fiction' || g.name === 'Sci-Fi & Fantasy'
    );

    expect(sciFiGenre).toBeTruthy();
    // Should have both movie and TV IDs
    expect(sciFiGenre?.movieIds).toContain(878); // Science Fiction movie ID
    expect(sciFiGenre?.tvIds).toContain(10765); // Sci-Fi & Fantasy TV ID
  });

  it('should sort genres alphabetically', () => {
    const result = getUnifiedGenres(mockMovieGenres, mockTVGenres);
    const names = result.map((g) => g.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

    expect(names).toEqual(sortedNames);
  });

  it('should assign emojis to all genres', () => {
    const result = getUnifiedGenres(mockMovieGenres, mockTVGenres);

    result.forEach((genre) => {
      expect(genre.emoji).toBeTruthy();
      expect(genre.emoji.length).toBeGreaterThan(0);
    });
  });
});

describe('unifiedGenresToTMDBIds', () => {
  const mockUnifiedGenres = [
    {
      id: 'action',
      name: 'Action',
      emoji: '💥',
      movieIds: [28],
      tvIds: [10759],
    },
    {
      id: 'comedy',
      name: 'Comedy',
      emoji: '😂',
      movieIds: [35],
      tvIds: [35],
    },
    {
      id: 'sciencefiction',
      name: 'Science Fiction',
      emoji: '🚀',
      movieIds: [878],
      tvIds: [],
    },
    {
      id: 'scififantasy',
      name: 'Sci-Fi & Fantasy',
      emoji: '🚀',
      movieIds: [],
      tvIds: [10765],
    },
  ];

  it('should convert unified genre IDs to movie TMDB IDs', () => {
    const unifiedIds = ['action', 'comedy', 'sciencefiction'];
    const result = unifiedGenresToTMDBIds(unifiedIds, mockUnifiedGenres, 'movie');

    expect(result).toContain(28); // Action movie ID
    expect(result).toContain(35); // Comedy movie ID
    expect(result).toContain(878); // Science Fiction movie ID
    expect(result).not.toContain(10759); // Should not include TV IDs
  });

  it('should convert unified genre IDs to TV TMDB IDs', () => {
    const unifiedIds = ['action', 'comedy', 'scififantasy'];
    const result = unifiedGenresToTMDBIds(unifiedIds, mockUnifiedGenres, 'tv');

    expect(result).toContain(10759); // Action & Adventure TV ID
    expect(result).toContain(35); // Comedy TV ID
    expect(result).toContain(10765); // Sci-Fi & Fantasy TV ID
    expect(result).not.toContain(28); // Should not include movie IDs
  });

  it('should handle empty genre array', () => {
    const result = unifiedGenresToTMDBIds([], mockUnifiedGenres, 'movie');
    expect(result).toEqual([]);
  });

  it('should ignore unknown genre IDs', () => {
    const unifiedIds = ['unknown-genre', 'action'];
    const result = unifiedGenresToTMDBIds(unifiedIds, mockUnifiedGenres, 'movie');

    expect(result).toContain(28); // Action movie ID
    expect(result).toHaveLength(1);
  });

  it('should not include duplicate IDs', () => {
    // If a unified genre had duplicate IDs (shouldn't happen, but testing edge case)
    const genresWithDupes = [
      {
        id: 'test',
        name: 'Test',
        emoji: '🎬',
        movieIds: [1, 1, 2],
        tvIds: [],
      },
    ];

    const result = unifiedGenresToTMDBIds(['test'], genresWithDupes, 'movie');
    expect(result).toEqual([1, 2]);
  });

  it('should handle genres with no IDs for requested media type', () => {
    const unifiedIds = ['sciencefiction']; // Has movie IDs but no TV IDs
    const result = unifiedGenresToTMDBIds(unifiedIds, mockUnifiedGenres, 'tv');

    expect(result).toEqual([]);
  });
});
