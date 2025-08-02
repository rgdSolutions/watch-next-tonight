import { NextRequest } from 'next/server';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

// We need to set the env var before importing the route
process.env.TMDB_READ_ACCESS_TOKEN = 'test-token';

// Dynamic import to ensure env var is set
let GET: any;
beforeAll(async () => {
  const route = await import('../[...path]/route');
  GET = route.GET;
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Trending API Transformation', () => {
  it('should properly transform trending results with media_type field', async () => {
    const mockTrendingData = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Trending Movie',
          media_type: 'movie',
          overview: 'A trending movie',
          release_date: '2024-01-01',
          poster_path: '/movie-poster.jpg',
          backdrop_path: '/movie-backdrop.jpg',
          vote_average: 8.5,
          vote_count: 1000,
          popularity: 100,
          genre_ids: [28, 12],
          original_language: 'en',
          adult: false,
        },
        {
          id: 2,
          name: 'Trending TV Show',
          media_type: 'tv',
          overview: 'A trending TV show',
          first_air_date: '2024-01-01',
          poster_path: '/tv-poster.jpg',
          backdrop_path: '/tv-backdrop.jpg',
          vote_average: 8.0,
          vote_count: 500,
          popularity: 90,
          genre_ids: [18, 35],
          original_language: 'en',
        },
      ],
      total_pages: 10,
      total_results: 200,
    };

    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrendingData,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/tmdb/trending/all/week');
    const params = Promise.resolve({ path: ['trending', 'all', 'week'] });

    const response = await GET(request, { params });
    const data = await response.json();

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/trending/all/week',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );

    // Verify transformation
    expect(data).toEqual({
      results: [
        {
          id: 'tmdb-movie-1',
          tmdbId: 1,
          title: 'Trending Movie',
          type: 'movie',
          overview: 'A trending movie',
          releaseDate: '2024-01-01',
          posterPath: 'https://image.tmdb.org/t/p/w500/movie-poster.jpg',
          backdropPath: 'https://image.tmdb.org/t/p/original/movie-backdrop.jpg',
          rating: 8.5,
          voteCount: 1000,
          popularity: 100,
          genreIds: [28, 12],
          originalLanguage: 'en',
          adult: false,
          runtime: undefined,
          episodeRunTime: undefined,
          numberOfEpisodes: undefined,
          numberOfSeasons: undefined,
        },
        {
          id: 'tmdb-tv-2',
          tmdbId: 2,
          title: 'Trending TV Show',
          type: 'tv',
          overview: 'A trending TV show',
          releaseDate: '2024-01-01',
          posterPath: 'https://image.tmdb.org/t/p/w500/tv-poster.jpg',
          backdropPath: 'https://image.tmdb.org/t/p/original/tv-backdrop.jpg',
          rating: 8.0,
          voteCount: 500,
          popularity: 90,
          genreIds: [18, 35],
          originalLanguage: 'en',
          adult: undefined,
          runtime: undefined,
          episodeRunTime: undefined,
          numberOfEpisodes: undefined,
          numberOfSeasons: undefined,
        },
      ],
      page: 1,
      totalPages: 10,
      totalResults: 200,
    });
  });

  it('should handle empty trending results', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      }),
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/tmdb/trending/movie/day');
    const params = Promise.resolve({ path: ['trending', 'movie', 'day'] });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(data).toEqual({
      results: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
    });
  });

  it('should handle trending results with missing media_type', async () => {
    const mockTrendingData = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Movie without media_type',
          // media_type is missing
          overview: 'A movie',
          release_date: '2024-01-01',
          poster_path: '/poster.jpg',
          vote_average: 7.5,
          genre_ids: [28],
        },
      ],
      total_pages: 1,
      total_results: 1,
    };

    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrendingData,
    } as Response);

    const request = new NextRequest('http://localhost:3000/api/tmdb/trending/all/week');
    const params = Promise.resolve({ path: ['trending', 'all', 'week'] });

    const response = await GET(request, { params });
    const data = await response.json();

    // Should default to 'tv' when media_type is not 'movie'
    expect(data.results[0].type).toBe('tv');
  });
});
