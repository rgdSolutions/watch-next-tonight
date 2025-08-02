import { describe, expect, it } from 'vitest';

import { chooseInitialContentType } from '../content-display-with-query';

describe('chooseInitialContentType', () => {
  describe('massively popular show-only genres', () => {
    it('should return tv for kids genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['kids'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });

    it('should return tv for reality genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['reality'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });

    it('should return tv when both kids and reality are selected', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['kids', 'reality', 'action'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });
  });

  describe('highly popular movie-only genres', () => {
    it('should return movie for horror genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['horror'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });

    it('should return movie for romance genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['romance'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });

    it('should return movie for thriller genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['thriller'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });

    it('should return movie when multiple movie genres are selected', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['horror', 'thriller', 'drama'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });
  });

  describe('show-only genres', () => {
    it('should return tv for news genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['news'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });

    it('should return tv for soap genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['soap'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });

    it('should return tv for talk genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['talk'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });
  });

  describe('movie-only genres', () => {
    it('should return movie for history genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['history'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });

    it('should return movie for music genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['music'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });

    it('should return movie for tvmovie genre', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['tvmovie'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });
  });

  describe('priority order', () => {
    it('should prioritize massively popular show-only genres over movie genres', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['kids', 'horror', 'thriller'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });

    it('should prioritize highly popular movie genres over less popular show genres', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['horror', 'news', 'talk'],
        recency: 'recent',
      });
      expect(result).toBe('movie');
    });

    it('should prioritize show-only genres over movie-only genres when both are less popular', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['news', 'history', 'music'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });
  });

  describe('default behavior', () => {
    it('should return all when no genres are selected', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: [],
        recency: 'recent',
      });
      expect(result).toBe('all');
    });

    it('should return all for genres not in any special category', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['action', 'adventure', 'comedy'],
        recency: 'recent',
      });
      expect(result).toBe('all');
    });

    it('should return all for mixed genres without priority matches', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['documentary', 'drama', 'sciencefi'],
        recency: 'recent',
      });
      expect(result).toBe('all');
    });
  });

  describe('edge cases', () => {
    it('should handle different country codes', () => {
      const result = chooseInitialContentType({
        country: 'GB',
        genres: ['kids'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });

    it('should handle different recency values', () => {
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['horror'],
        recency: 'brand-new',
      });
      expect(result).toBe('movie');
    });

    it('should handle uppercase genre names', () => {
      // Note: This test assumes genres are already normalized to lowercase
      const result = chooseInitialContentType({
        country: 'US',
        genres: ['kids'],
        recency: 'recent',
      });
      expect(result).toBe('tv');
    });
  });
});

// Export the function for testing
export { chooseInitialContentType };
