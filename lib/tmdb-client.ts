import {
  GenreList,
  MediaItem,
  SearchResults,
  TMDBVideoResponse,
  TMDBWatchProviderResponse,
} from '@/types/tmdb';

// Client-side TMDB API wrapper
export class TMDBClient {
  private baseUrl = '/api/tmdb';

  private async fetchFromAPI<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data?.message || data?.error || `TMDB API error: ${response.statusText}`;
      const error = new Error(message);
      // Add status to error for retry logic
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  }

  // Search for movies and TV shows
  async searchMulti(query: string, page = 1): Promise<SearchResults> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
    });

    return this.fetchFromAPI<SearchResults>(`/search/multi?${params}`);
  }

  // Discover movies
  async discoverMovies(params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    'primary_release_date.gte'?: string;
    'primary_release_date.lte'?: string;
    with_watch_providers?: string;
    watch_region?: string;
    with_watch_monetization_types?: string;
  }): Promise<SearchResults> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    return this.fetchFromAPI<SearchResults>(`/discover/movie?${searchParams}`);
  }

  // Discover TV shows
  async discoverTVShows(params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    'first_air_date.gte'?: string;
    'first_air_date.lte'?: string;
    with_watch_providers?: string;
    watch_region?: string;
    with_watch_monetization_types?: string;
  }): Promise<SearchResults> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    return this.fetchFromAPI<SearchResults>(`/discover/tv?${searchParams}`);
  }

  // Get movie genres
  async getMovieGenres(): Promise<GenreList> {
    return this.fetchFromAPI<GenreList>('/genre/movie/list');
  }

  // Get TV genres
  async getTVGenres(): Promise<GenreList> {
    return this.fetchFromAPI<GenreList>('/genre/tv/list');
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<MediaItem> {
    return this.fetchFromAPI<MediaItem>(`/movie/${movieId}`);
  }

  // Get TV show details
  async getTVShowDetails(tvId: number): Promise<MediaItem> {
    return this.fetchFromAPI<MediaItem>(`/tv/${tvId}`);
  }

  // Get trending
  async getTrending(
    mediaType: 'all' | 'movie' | 'tv' = 'all',
    timeWindow: 'day' | 'week' = 'week'
  ): Promise<SearchResults> {
    return this.fetchFromAPI<SearchResults>(`/trending/${mediaType}/${timeWindow}`);
  }

  // Get movie videos/trailers
  async getMovieVideos(movieId: number): Promise<TMDBVideoResponse> {
    return this.fetchFromAPI<TMDBVideoResponse>(`/movie/${movieId}/videos`);
  }

  // Get TV show videos/trailers
  async getTVVideos(tvId: number): Promise<TMDBVideoResponse> {
    return this.fetchFromAPI<TMDBVideoResponse>(`/tv/${tvId}/videos`);
  }

  // Get movie watch providers
  async getMovieWatchProviders(movieId: number): Promise<TMDBWatchProviderResponse> {
    return this.fetchFromAPI<TMDBWatchProviderResponse>(`/movie/${movieId}/watch/providers`);
  }

  // Get TV show watch providers
  async getTVWatchProviders(tvId: number): Promise<TMDBWatchProviderResponse> {
    return this.fetchFromAPI<TMDBWatchProviderResponse>(`/tv/${tvId}/watch/providers`);
  }
}

// Export singleton instance
export const tmdbClient = new TMDBClient();
