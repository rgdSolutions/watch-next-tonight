import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { tmdbClient } from '@/lib/tmdb-client';
import {
  GenreList,
  MediaItem,
  SearchResults,
  TMDBVideoResponse,
  TMDBWatchProviderResponse,
} from '@/types/tmdb';

// Query key factory for consistent cache key generation
export const tmdbKeys = {
  all: ['tmdb'] as const,
  searches: () => [...tmdbKeys.all, 'search'] as const,
  search: (query: string, page?: number) => [...tmdbKeys.searches(), query, page] as const,

  discovers: () => [...tmdbKeys.all, 'discover'] as const,
  discoverMovies: (params: any) => [...tmdbKeys.discovers(), 'movies', params] as const,
  discoverTV: (params: any) => [...tmdbKeys.discovers(), 'tv', params] as const,

  genres: () => [...tmdbKeys.all, 'genres'] as const,
  movieGenres: () => [...tmdbKeys.genres(), 'movies'] as const,
  tvGenres: () => [...tmdbKeys.genres(), 'tv'] as const,

  details: () => [...tmdbKeys.all, 'details'] as const,
  movieDetails: (id: number) => [...tmdbKeys.details(), 'movie', id] as const,
  tvDetails: (id: number) => [...tmdbKeys.details(), 'tv', id] as const,

  trending: (mediaType: string, timeWindow: string) =>
    [...tmdbKeys.all, 'trending', mediaType, timeWindow] as const,

  videos: () => [...tmdbKeys.all, 'videos'] as const,
  movieVideos: (id: number) => [...tmdbKeys.videos(), 'movie', id] as const,
  tvVideos: (id: number) => [...tmdbKeys.videos(), 'tv', id] as const,

  watchProviders: () => [...tmdbKeys.all, 'watchProviders'] as const,
  movieWatchProviders: (id: number) => [...tmdbKeys.watchProviders(), 'movie', id] as const,
  tvWatchProviders: (id: number) => [...tmdbKeys.watchProviders(), 'tv', id] as const,
};

// Search for movies and TV shows
export function useSearchMulti(query: string, page = 1, options?: UseQueryOptions<SearchResults>) {
  return useQuery({
    queryKey: tmdbKeys.search(query, page),
    queryFn: () => tmdbClient.searchMulti(query, page),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Discover movies with filters
export function useDiscoverMovies(
  params: Parameters<typeof tmdbClient.discoverMovies>[0],
  options?: UseQueryOptions<SearchResults>
) {
  return useQuery({
    queryKey: tmdbKeys.discoverMovies(params),
    queryFn: () => tmdbClient.discoverMovies(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// Discover TV shows with filters
export function useDiscoverTVShows(
  params: Parameters<typeof tmdbClient.discoverTVShows>[0],
  options?: UseQueryOptions<SearchResults>
) {
  return useQuery({
    queryKey: tmdbKeys.discoverTV(params),
    queryFn: () => tmdbClient.discoverTVShows(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

// Get movie genres (cached for 24 hours)
export function useMovieGenres(options?: UseQueryOptions<GenreList>) {
  return useQuery({
    queryKey: tmdbKeys.movieGenres(),
    queryFn: () => tmdbClient.getMovieGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    ...options,
  });
}

// Get TV genres (cached for 24 hours)
export function useTVGenres(options?: UseQueryOptions<GenreList>) {
  return useQuery({
    queryKey: tmdbKeys.tvGenres(),
    queryFn: () => tmdbClient.getTVGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    ...options,
  });
}

// Get movie details
export function useMovieDetails(movieId: number, options?: UseQueryOptions<MediaItem>) {
  return useQuery({
    queryKey: tmdbKeys.movieDetails(movieId),
    queryFn: () => tmdbClient.getMovieDetails(movieId),
    enabled: !!movieId,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Get TV show details
export function useTVShowDetails(tvId: number, options?: UseQueryOptions<MediaItem>) {
  return useQuery({
    queryKey: tmdbKeys.tvDetails(tvId),
    queryFn: () => tmdbClient.getTVShowDetails(tvId),
    enabled: !!tvId,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Get trending content
export function useTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'week',
  options?: UseQueryOptions<SearchResults>
) {
  return useQuery({
    queryKey: tmdbKeys.trending(mediaType, timeWindow),
    queryFn: () => tmdbClient.getTrending(mediaType, timeWindow),
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

// Get movie videos/trailers
export function useMovieVideos(movieId: number, options?: UseQueryOptions<TMDBVideoResponse>) {
  return useQuery({
    queryKey: tmdbKeys.movieVideos(movieId),
    queryFn: () => tmdbClient.getMovieVideos(movieId),
    enabled: !!movieId,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Get TV show videos/trailers
export function useTVVideos(tvId: number, options?: UseQueryOptions<TMDBVideoResponse>) {
  return useQuery({
    queryKey: tmdbKeys.tvVideos(tvId),
    queryFn: () => tmdbClient.getTVVideos(tvId),
    enabled: !!tvId,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Get movie watch providers
export function useMovieWatchProviders(
  movieId: number,
  options?: UseQueryOptions<TMDBWatchProviderResponse>
) {
  return useQuery({
    queryKey: tmdbKeys.movieWatchProviders(movieId),
    queryFn: () => tmdbClient.getMovieWatchProviders(movieId),
    enabled: !!movieId,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Get TV show watch providers
export function useTVWatchProviders(
  tvId: number,
  options?: UseQueryOptions<TMDBWatchProviderResponse>
) {
  return useQuery({
    queryKey: tmdbKeys.tvWatchProviders(tvId),
    queryFn: () => tmdbClient.getTVWatchProviders(tvId),
    enabled: !!tvId,
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
}

// Prefetch functions for optimistic loading
export const tmdbPrefetch = {
  movieGenres: (queryClient: any) =>
    queryClient.prefetchQuery({
      queryKey: tmdbKeys.movieGenres(),
      queryFn: () => tmdbClient.getMovieGenres(),
      staleTime: 24 * 60 * 60 * 1000,
    }),

  tvGenres: (queryClient: any) =>
    queryClient.prefetchQuery({
      queryKey: tmdbKeys.tvGenres(),
      queryFn: () => tmdbClient.getTVGenres(),
      staleTime: 24 * 60 * 60 * 1000,
    }),

  trending: (queryClient: any, mediaType = 'all' as const, timeWindow = 'week' as const) =>
    queryClient.prefetchQuery({
      queryKey: tmdbKeys.trending(mediaType, timeWindow),
      queryFn: () => tmdbClient.getTrending(mediaType, timeWindow),
      staleTime: 30 * 60 * 1000,
    }),
};
