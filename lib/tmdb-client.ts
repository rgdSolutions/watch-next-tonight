import { GenreList, MediaItem, SearchResults } from '@/types/tmdb';

// Client-side TMDB API wrapper
export class TMDBClient {
  private baseUrl = '/api/tmdb';

  private async fetchFromAPI<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
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
}

// Export singleton instance
export const tmdbClient = new TMDBClient();
