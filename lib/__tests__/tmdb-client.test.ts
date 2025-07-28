import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  expectedTransformedMovie,
  expectedTransformedTV,
  mockGenresResponse,
} from '@/tests/mocks/tmdb-responses';

import { TMDBClient, tmdbClient } from '../tmdb-client';

// Mock fetch
global.fetch = vi.fn();

describe('TMDBClient', () => {
  let client: TMDBClient;

  beforeEach(() => {
    client = new TMDBClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchMulti', () => {
    it('should search for movies and TV shows', async () => {
      const mockResponse = {
        results: [expectedTransformedMovie, expectedTransformedTV],
        page: 1,
        totalPages: 1,
        totalResults: 2,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.searchMulti('fight club');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/tmdb/search/multi?query=fight+club&page=1',
        undefined
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle pagination', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [], page: 2, totalPages: 5, totalResults: 100 }),
      } as Response);

      await client.searchMulti('test', 2);

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/search/multi?query=test&page=2', undefined);
    });
  });

  describe('discoverMovies', () => {
    it('should discover movies with filters', async () => {
      const mockResponse = {
        results: [expectedTransformedMovie],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.discoverMovies({
        with_genres: '28',
        sort_by: 'popularity.desc',
        'primary_release_date.gte': '2023-01-01',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/tmdb/discover/movie?with_genres=28&sort_by=popularity.desc&primary_release_date.gte=2023-01-01',
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('discoverTVShows', () => {
    it('should discover TV shows with filters', async () => {
      const mockResponse = {
        results: [expectedTransformedTV],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.discoverTVShows({
        with_genres: '18',
        sort_by: 'vote_average.desc',
        'first_air_date.gte': '2020-01-01',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/tmdb/discover/tv?with_genres=18&sort_by=vote_average.desc&first_air_date.gte=2020-01-01',
        undefined
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMovieGenres', () => {
    it('should fetch movie genres', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGenresResponse,
      } as Response);

      const result = await client.getMovieGenres();

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/genre/movie/list', undefined);
      expect(result).toEqual(mockGenresResponse);
    });
  });

  describe('getTVGenres', () => {
    it('should fetch TV genres', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGenresResponse,
      } as Response);

      const result = await client.getTVGenres();

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/genre/tv/list', undefined);
      expect(result).toEqual(mockGenresResponse);
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => expectedTransformedMovie,
      } as Response);

      const result = await client.getMovieDetails(550);

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/movie/550', undefined);
      expect(result).toEqual(expectedTransformedMovie);
    });
  });

  describe('getTVShowDetails', () => {
    it('should fetch TV show details', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => expectedTransformedTV,
      } as Response);

      const result = await client.getTVShowDetails(1396);

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/tv/1396', undefined);
      expect(result).toEqual(expectedTransformedTV);
    });
  });

  describe('getTrending', () => {
    it('should fetch trending content with default parameters', async () => {
      const mockResponse = {
        results: [expectedTransformedMovie, expectedTransformedTV],
        page: 1,
        totalPages: 1,
        totalResults: 2,
      };

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.getTrending();

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/trending/all/week', undefined);
      expect(result).toEqual(mockResponse);
    });

    it('should fetch trending movies for a day', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [], page: 1, totalPages: 1, totalResults: 0 }),
      } as Response);

      await client.getTrending('movie', 'day');

      expect(mockFetch).toHaveBeenCalledWith('/api/tmdb/trending/movie/day', undefined);
    });
  });

  describe('error handling', () => {
    it('should throw error when API returns non-ok response', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(client.searchMulti('test')).rejects.toThrow('TMDB API error: Not Found');
    });

    it('should handle network errors', async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.searchMulti('test')).rejects.toThrow('Network error');
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(tmdbClient).toBeInstanceOf(TMDBClient);
    });
  });
});
