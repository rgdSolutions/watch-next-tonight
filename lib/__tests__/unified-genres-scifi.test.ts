import { describe, expect, it } from 'vitest';

import { getUnifiedGenres } from '../unified-genres';

describe('Science Fiction Genre Unification', () => {
  it('should merge "Science Fiction" and "Sci-Fi & Fantasy" into a single genre', () => {
    const movieGenres = [
      { id: 878, name: 'Science Fiction' },
      { id: 28, name: 'Action' },
    ];

    const tvGenres = [
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 10759, name: 'Action & Adventure' },
    ];

    const result = getUnifiedGenres(movieGenres, tvGenres);

    // Find the sci-fi genre (could be named either way)
    const sciFiGenre = result.find(
      (g) => g.name === 'Science Fiction' || g.name === 'Sci-Fi & Fantasy'
    );

    // Verify it exists
    expect(sciFiGenre).toBeTruthy();

    // Verify it has both movie and TV IDs
    expect(sciFiGenre?.movieIds).toContain(878); // Science Fiction movie ID
    expect(sciFiGenre?.tvIds).toContain(10765); // Sci-Fi & Fantasy TV ID

    // Verify we don't have two separate sci-fi genres
    const sciFiGenres = result.filter(
      (g) => g.name === 'Science Fiction' || g.name === 'Sci-Fi & Fantasy'
    );
    expect(sciFiGenres).toHaveLength(1);
  });

  it('should correctly handle user selecting Science Fiction genre', () => {
    const movieGenres = [
      { id: 878, name: 'Science Fiction' },
      { id: 12, name: 'Adventure' },
      { id: 35, name: 'Comedy' },
    ];

    const tvGenres = [
      { id: 10765, name: 'Sci-Fi & Fantasy' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
    ];

    const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

    // When user selects the sci-fi genre
    const sciFiGenre = unifiedGenres.find(
      (g) => g.name === 'Science Fiction' || g.name === 'Sci-Fi & Fantasy'
    );

    // They should get both movie and TV results
    expect(sciFiGenre).toBeTruthy();
    expect(sciFiGenre?.movieIds.length).toBeGreaterThan(0);
    expect(sciFiGenre?.tvIds.length).toBeGreaterThan(0);

    // The genre should have the appropriate emoji
    expect(sciFiGenre?.emoji).toBe('🚀');
  });
});
