import { describe, expect, it } from 'vitest';

import { TMDBGenre } from '@/types/tmdb';

import {
  areGenresSimilar,
  getUnifiedGenres,
  normalizeGenreName,
  UnifiedGenre,
  unifiedGenresToTMDBIds,
} from '../unified-genres';

// Re-export internal functions for testing
export { areGenresSimilar, normalizeGenreName };

describe('Unified Genres Extended Tests', () => {
  const movieGenres: TMDBGenre[] = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  const tvGenres: TMDBGenre[] = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
  ];

  describe('normalizeGenreName', () => {
    it('should normalize genre names correctly', () => {
      expect(normalizeGenreName('Science Fiction')).toBe('sciencefi');
      expect(normalizeGenreName('Sci-Fi & Fantasy')).toBe('fifantasy');
      expect(normalizeGenreName('Action & Adventure')).toBe('actionadventure');
      expect(normalizeGenreName('War & Politics')).toBe('warpolitics');
      expect(normalizeGenreName('TV Movie')).toBe('tvmovie');
    });

    it('should handle case insensitivity', () => {
      expect(normalizeGenreName('SCIENCE FICTION')).toBe('sciencefi');
      expect(normalizeGenreName('sci-fi & fantasy')).toBe('fifantasy');
    });

    it('should remove special characters', () => {
      expect(normalizeGenreName('Action-Adventure')).toBe('actionadventure');
      expect(normalizeGenreName('Sci Fi')).toBe('fi');
    });
  });

  describe('areGenresSimilar', () => {
    it('should match exact genres after normalization', () => {
      expect(areGenresSimilar('Action', 'action')).toBe(true);
      expect(areGenresSimilar('Drama', 'Drama')).toBe(true);
    });

    it('should match Science Fiction with Sci-Fi & Fantasy', () => {
      expect(areGenresSimilar('Science Fiction', 'Sci-Fi & Fantasy')).toBe(true);
      expect(areGenresSimilar('Sci-Fi & Fantasy', 'Science Fiction')).toBe(true);
    });

    it('should match War with War & Politics', () => {
      expect(areGenresSimilar('War', 'War & Politics')).toBe(true);
      expect(areGenresSimilar('War & Politics', 'War')).toBe(true);
    });

    it('should NOT match Fantasy with Sci-Fi & Fantasy', () => {
      expect(areGenresSimilar('Fantasy', 'Sci-Fi & Fantasy')).toBe(false);
    });

    it('should NOT match Action with Action & Adventure', () => {
      expect(areGenresSimilar('Action', 'Action & Adventure')).toBe(false);
    });

    it('should handle special mappings correctly', () => {
      expect(areGenresSimilar('scifi', 'sciencefiction')).toBe(true);
      expect(areGenresSimilar('warmilitary', 'war')).toBe(true);
    });

    it('should not do substring matching for restricted genres', () => {
      expect(areGenresSimilar('Fantasy', 'Sci-Fi & Fantasy')).toBe(false);
      expect(areGenresSimilar('Action', 'Action & Adventure')).toBe(false);
      expect(areGenresSimilar('Adventure', 'Action & Adventure')).toBe(false);
      expect(areGenresSimilar('War', 'Warfare')).toBe(false);
    });

    it('should do substring matching for non-restricted genres', () => {
      expect(areGenresSimilar('Documentary', 'Documentary Series')).toBe(true);
      expect(areGenresSimilar('Crime Drama', 'Crime')).toBe(true);
    });
  });

  describe('getUnifiedGenres with fallback mappings', () => {
    it('should apply fallback mappings for movie-only genres', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      // Adventure should map to Action & Adventure
      const adventure = unifiedGenres.find((g) => g.name === 'Adventure');
      expect(adventure).toBeDefined();
      expect(adventure!.movieIds).toContain(12);
      expect(adventure!.tvIds).toContain(10759);

      // Fantasy should map to Sci-Fi & Fantasy
      const fantasy = unifiedGenres.find((g) => g.name === 'Fantasy');
      expect(fantasy).toBeDefined();
      expect(fantasy!.movieIds).toContain(14);
      expect(fantasy!.tvIds).toContain(10765);

      // History should map to War & Politics
      const history = unifiedGenres.find((g) => g.name === 'History');
      expect(history).toBeDefined();
      expect(history!.movieIds).toContain(36);
      expect(history!.tvIds).toContain(10768);

      // Romance should map to Soap
      const romance = unifiedGenres.find((g) => g.name === 'Romance');
      expect(romance).toBeDefined();
      expect(romance!.movieIds).toContain(10749);
      expect(romance!.tvIds).toContain(10766);

      // TV Movie should map to Action & Adventure
      const tvMovie = unifiedGenres.find((g) => g.name === 'TV Movie');
      expect(tvMovie).toBeDefined();
      expect(tvMovie!.movieIds).toContain(10770);
      expect(tvMovie!.tvIds).toContain(10759);
    });

    it('should apply fallback mappings for TV-only genres', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      // Soap should map to Romance
      const soap = unifiedGenres.find((g) => g.name === 'Soap');
      expect(soap).toBeDefined();
      expect(soap!.movieIds).toContain(10749);
      expect(soap!.tvIds).toContain(10766);
    });

    it('should apply default Drama fallback for unmapped genres', () => {
      // Create a genre that won't have any mappings
      const customMovieGenres = [...movieGenres, { id: 99999, name: 'Experimental' }];
      const unifiedGenres = getUnifiedGenres(customMovieGenres, tvGenres);

      const experimental = unifiedGenres.find((g) => g.name === 'Experimental');
      expect(experimental).toBeDefined();
      expect(experimental!.movieIds).toContain(99999);
      expect(experimental!.tvIds).toContain(18); // Default Drama fallback
    });

    it('should keep Action and Action & Adventure as separate genres', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      // Action should remain separate
      const action = unifiedGenres.find((g) => g.name === 'Action');
      expect(action).toBeDefined();
      expect(action!.movieIds).toContain(28);
      expect(action!.tvIds).toContain(10759); // Should have Action & Adventure as fallback

      // Action & Adventure should be its own genre
      const actionAdventure = unifiedGenres.find((g) => g.name === 'Action & Adventure');
      expect(actionAdventure).toBeDefined();
      expect(actionAdventure!.movieIds).toContain(28); // Should have Action as fallback
      expect(actionAdventure!.tvIds).toContain(10759);
    });

    it('should unify War and War & Politics correctly', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      // Should only have one War entry
      const warGenres = unifiedGenres.filter((g) => g.name.includes('War'));
      expect(warGenres).toHaveLength(1);

      const war = warGenres[0];
      expect(war.name).toBe('War & Politics');
      expect(war.movieIds).toContain(10752);
      expect(war.tvIds).toContain(10768);
    });
  });

  describe('unifiedGenresToTMDBIds', () => {
    it('should convert unified genre IDs to TMDB movie IDs', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      const movieIds = unifiedGenresToTMDBIds(['sciencefi', 'action'], unifiedGenres, 'movie');
      expect(movieIds).toContain(878); // Science Fiction
      expect(movieIds).toContain(28); // Action
      expect(movieIds).toHaveLength(2);
    });

    it('should convert unified genre IDs to TMDB TV IDs', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      const tvIds = unifiedGenresToTMDBIds(['sciencefi', 'actionadventure'], unifiedGenres, 'tv');
      expect(tvIds).toContain(10765); // Sci-Fi & Fantasy
      expect(tvIds).toContain(10759); // Action & Adventure
      expect(tvIds).toHaveLength(2);
    });

    it('should handle empty input', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      const movieIds = unifiedGenresToTMDBIds([], unifiedGenres, 'movie');
      expect(movieIds).toEqual([]);
    });

    it('should handle non-existent genre IDs', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      const movieIds = unifiedGenresToTMDBIds(['nonexistent', 'action'], unifiedGenres, 'movie');
      expect(movieIds).toContain(28); // Action
      expect(movieIds).toHaveLength(1);
    });

    it('should deduplicate IDs', () => {
      const unifiedGenres: UnifiedGenre[] = [
        {
          id: 'test',
          name: 'Test',
          emoji: '🎬',
          movieIds: [1, 1, 2],
          tvIds: [3, 3, 4],
        },
      ];

      const movieIds = unifiedGenresToTMDBIds(['test'], unifiedGenres, 'movie');
      expect(movieIds).toEqual([1, 2]);

      const tvIds = unifiedGenresToTMDBIds(['test'], unifiedGenres, 'tv');
      expect(tvIds).toEqual([3, 4]);
    });
  });

  describe('comprehensive genre unification', () => {
    it('should create consistent bidirectional mappings', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      // Every genre should appear only once
      const genreIds = unifiedGenres.map((g) => g.id);
      const uniqueIds = new Set(genreIds);
      expect(genreIds.length).toBe(uniqueIds.size);

      // Check Science Fiction and Sci-Fi & Fantasy are unified
      const sciFi = unifiedGenres.find((g) => g.id === 'sciencefi');
      expect(sciFi).toBeDefined();
      expect(sciFi!.name).toBe('Sci-Fi & Fantasy');
      expect(sciFi!.movieIds).toContain(878); // Science Fiction
      expect(sciFi!.tvIds).toContain(10765); // Sci-Fi & Fantasy

      // Check War and War & Politics are unified
      const war = unifiedGenres.find((g) => g.id === 'war');
      expect(war).toBeDefined();
      expect(war!.name).toBe('War & Politics');
      expect(war!.movieIds).toContain(10752); // War
      expect(war!.tvIds).toContain(10768); // War & Politics

      // Check Fantasy remains separate (it's not unified with Sci-Fi & Fantasy)
      const fantasy = unifiedGenres.find((g) => g.name === 'Fantasy');
      expect(fantasy).toBeDefined();
      expect(fantasy!.movieIds).toContain(14);
      expect(fantasy!.tvIds).toContain(10765); // Fallback mapping
    });

    it('should maintain genre integrity', () => {
      const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

      // All original movie genre IDs should be present
      movieGenres.forEach((movieGenre) => {
        const found = unifiedGenres.some((ug) => ug.movieIds.includes(movieGenre.id));
        expect(found).toBe(true);
      });

      // All original TV genre IDs should be present
      tvGenres.forEach((tvGenre) => {
        const found = unifiedGenres.some((ug) => ug.tvIds.includes(tvGenre.id));
        expect(found).toBe(true);
      });
    });
  });
});
